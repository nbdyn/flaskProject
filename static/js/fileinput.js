// 这是文件选择框的初始化函数
function initFileInput(ctrlName, addr, filetype) {
     var control = $('#' + ctrlName);
     control.fileinput({
         language: 'zh', //设置语言
         uploadUrl: addr, //上传的地址
         allowedFileExtensions: filetype,//接收的文件后缀
         //uploadExtraData:{"id": 1, "fileName":'123.mp3'},
         uploadAsync: true, //默认异步上传
         showUpload: true, //是否显示上传按钮
         showRemove : true, //显示移除按钮
         showPreview : true, //是否显示预览
         showCaption: true,//是否显示标题
         browseClass: "btn btn-primary", //按钮样式
         dropZoneEnabled: false,//是否显示拖拽区域
         //maxFileSize: 0,//单位为kb，如果为0表示不限制文件大小
         minFileCount: 2,
         maxFileCount: 2, //表示允许同时上传的最大文件个数
         enctype: 'multipart/form-data',
         validateInitialCount:true,
         previewFileIcon: "<i class='iconfont icon-csv'></i>",
         msgFilesTooMany: "选择上传的文件数量({n}) 超过允许的最大数值{m}！",
         layoutTemplates :{
              //actionDelete:'', //去除上传预览的缩略图中的删除图标
             //actionUpload:'',//去除上传预览缩略图中的上传图片；
             //actionZoom:''   //去除上传预览缩略图中的查看详情预览的缩略图标。
         },
     }).on('filepreupload', function(event, data, previewId, index) {     //上传中
         var form = data.form, files = data.files, extra = data.extra,
         response = data.response, reader = data.reader;
         console.log('文件正在上传');
     }).on("fileuploaded", function (event, data, previewId, index) {    //一个文件上传成功
         console.log('文件上传成功！');
     debugger
         console.log('文件上传成功！'+data.response.id);
     }).on('fileerror', function(event, data, msg) {  //一个文件上传失败
         console.log('文件上传失败！'+data.id);
     })
 }


 // 数据集下拉框的内容更新函数
function dataset_select_update(){
    $.ajax({
			type : 'get',
			url : '/getdataset',
			dataType : 'json',
			success : function(datas) {//返回list数据并循环获取
				var select = $("#dataset_select");
				$("#dataset_select").empty()
				for (var i = 0; i < datas["datasets"].length; i++) {
					select.append("<option value=" + datas["datasets"][i] + ">" + datas["datasets"][i] + "</option>");
				}
				$('.selectpicker').selectpicker('val', '');
				$('.selectpicker').selectpicker('refresh');
			}
		});
}

// 下拉框初始化
function init_select(){
    $(".selectpicker").selectpicker({
    });
    $(window).on('load', function() {
        $('.selectpicker').selectpicker('val', '');
        $('.selectpicker').selectpicker('refresh');
    });
    dataset_select_update()
}

// 第一页表单提交
function submit_all(){
    var dataset = $("#dataset_select").find("option:selected")
    if(dataset.length == 0){
        window.alert("未选择数据集！");
    }
    else{
            var datas = {"dataset": dataset.text()}
            $.ajax({
            type : 'post',
            url : '/submitdata',
            dataType : 'json',
            data:datas,
            success:function (datas) {
                window.location.href=datas["url"]
            }
        });
    }
}


// 下拉框增加
function add(){
    num++;
    $("#add_div").remove();
    $("#pop_div").remove();

    var divele = document.createElement("div");
    divele.setAttribute("class", "row row-margin-top");
    divele.setAttribute("id", "select"+num)
    var inner = '<div class="col-xs-1"><p>XAI'+num+'</p></div>'+
                '<div class="col-xs-4">'+
                        '<select id="blackbox_select'+num+'" class="selectpicker" data-style="btn-primary"></select>'+
                        '<botton onclick=black_select_update() style="margin-left: 20px; cursor: pointer"><i class="iconfont icon-shuaxin"></i></botton>'+
                '</div>'+
                '<div class="col-xs-4">'+
                        '<select id="proxy_select'+num+'" class="selectpicker" data-style="btn-primary"></select>'+
                        '<botton onclick=proxy_select_update() style="margin-left: 20px; cursor: pointer"><i class="iconfont icon-shuaxin"></i></botton>'+
                '</div>'+
                '<div class="col-xs-1" id="add_div"><button class="btn btn-default" onclick="add()" id="add">添加</button></div>'+
                '<div class="col-xs-1" id="pop_div"><button class="btn btn-default" onclick="pop()" id="pop">删除</button></div>'
    divele.innerHTML=inner;
    var momEle = document.getElementById("blackproxy");
    momEle.appendChild(divele)
    init_select()
}


// 下拉框删除
function pop(){
    if(num==1){
        alert("XAI数量至少为1！")
    }
    else{
        var row = document.getElementById("select"+num);
        row.remove();
        num--;
        var add = "<div class=\"col-xs-1\" id=\"add_div\"><button class=\"btn btn-default\" onclick=\"add()\" id=\"add\">添加</button></div>"
        var pop = "<div class=\"col-xs-1\" id=\"pop_div\"><button class=\"btn btn-default\" onclick=\"pop()\" id=\"pop\">删除</button></div>"
        $("#select"+num).append(add, pop)
    }
}