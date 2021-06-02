from os import stat
from os import path
from flask import Flask, render_template, redirect, url_for, request, session
import json
import dao

app = Flask(__name__)
app.secret_key = "nobody knows"

@app.route('/')
def index():
    return render_template('index.html')


@app.route('/dataupload', methods=["GET", "POST"])
def dataupload():
    # 上传数据集，存到dataset文件中，并将该数据集名字保存在dataset/test(train).json中
    file = request.files.to_dict()["dataset"]
    filename = file.filename
    res, dataset_name, dataset_type = dao.test_train_read(filename, session)
    if not dataset_name:  # 文件输入格式异常
        return json.dumps(res)
    file.save(path.join("static/dataset/", filename))
    dao.update_json("static/dataset/{}.json".format(dataset_type), {dataset_name: filename})
    return json.dumps(res)


# 更新数据集下拉表用
@app.route('/getdataset', methods=["GET", "POST"])
def getdataset():
    datasets = list(dao.read_json("static/dataset/test.json").keys())
    return json.dumps({"datasets": datasets})


# 收集下拉表的数据
@app.route('/submitdata', methods=["GET", "POST"])
def submitdata():
    session["dataset"] = request.form["dataset"]
    return json.dumps({"url": url_for("proxy")})


# 代理模型展示界面
@app.route('/proxy')
def proxy():
    return render_template("proxy.html")


# 更新静态资源用
@app.context_processor
def override_url_for():
    return dict(url_for=dated_url_for)


def dated_url_for(endpoint, **values):
    filename = None
    if endpoint == 'static':
        filename = values.get('filename', None)
    if filename:
        file_path = path.join(app.root_path, endpoint, filename)
        values['v'] = int(stat(file_path).st_mtime)
    return url_for(endpoint, **values)


if __name__ == '__main__':
    app.run()
