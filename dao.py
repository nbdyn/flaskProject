import json
import os
import re


def read_json(path):
    # 将json文件转化为一个字典
    if os.path.exists(path):
        with open(path, 'r') as load_f:
            load_dict = json.load(load_f)
            return load_dict
    else:
        with open(path, 'w') as load_f:
            save_json(path, {})
            return {}


def save_json(path, dict):
    # 将字典转化为json文件
    with open(path, "w") as f:
        json.dump(dict, f)


def update_json(path, dict):
    # 向json中添加新项
    old_dict = read_json(path)
    old_dict.update(dict)
    save_json(path, old_dict)


def test_train_read(filename, session):
    # 获取数据集的名字和类型
    group = re.match("(.+)_(.+).csv", filename)
    if not group:
        return {"error": "请检查文件命名格式是否有误"}, None, None
    else:
        name = group.group(1)
        type = group.group(2)
        if type != "test" and type != "train":
            return {"error": "请检查数据集后缀是否为test或train"}, None, None
        # if not session.get('test_train'):
        #     session['test_train'] = "{}_{}".format(name, type)
        # else:
        #     name_1, type_1 = session.get('test_train').split("_")
        #     print("name1{}type1{}name{}type{}".format(name_1, type_1, name, type))
        #     del session["test_train"]
        #     if name_1 != name:
        #         return {"error": "请检查测试集和训练集是否属于同一数据集"}, None, None
        #     elif (type == "test" and type_1 != "train") or (type == "train" and type_1 != "test"):
        #         return {"error": "请上传一个测试集一个训练集"}, None, None
        return {}, name, type


if __name__ == "__main__":
    di = {"a": "a"}
    b = {"b": "b"}
    b.update(di)
    print(b)
