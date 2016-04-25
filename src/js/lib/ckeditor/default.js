function initImageDlgInnerHtml(){ //这是在对话框中要显示的内容
    var iHtml = "<div style='float:left;width:100%'>上传到服务器上</div>" ;
    iHtml += "<div style='float:left;width:100%;' class='setUpload'>";
    iHtml += "<div style='float:left;height:24px;width:82px' class='su_img'><span id='ck_btn_id'>dssdf</span></div>";
    iHtml += "<div style='float:left' id='ck_fs_upload_progress'>未选择文件</div>";
    iHtml += "</div>";
    iHtml += "<div style='float:left;width:100%'><input id='stop_id' type='button' vlaue='终止'/><input id='ck_btn_start' class='cke_dialog_start_button_z' type='button' value='开始上传' style='float:left' onclick='ckUploadImageStart();'/></div>";
    iHtml += "<div id='ck_pic_div' style='float:left;width:100%'></div>";
    return iHtml;
}

function initEventImageUpload(){ //对上传控件的注册
    ckeditorInitSwfu("ck_fs_upload_progress","stop_id","ck_btn_id");
    $("#ck_fs_upload_progress").parent().find("object").css({"height":"24px","width":"82px"});
    $("#ck_btn_start").mouseover(function(){
    $(this).css({"cursor":"hand","background-position":"0 -1179px"});
    });
}

function clearCkImageUpload(){ //对对话框弹出时作特殊处理
    if($("#ck_fs_upload_progress").html().indexOf(".jpg") != -1){
    $("#ck_fs_upload_progress").html("");
    }
    $("#ck_pic_div").html("");
}

function getCkUploadImages(){
    return $("#ck_pic_div").find("img");
}
 
var ckSwfu; //初始化上传控件
function ckeditorInitSwfu(progress,btn,spanButtonPlaceHolder) {
    var uploadUrl = "${BasePath}/commodity_com/img/uploadCommodityImg.ihtml?type=1";
    //在firefox、chrome下，上传不能保留登录信息，所以必须加上jsessionid。
    var jsessionid = document.cookie;
    if(jsessionid) {
    uploadUrl += "?jsessionid="+jsessionid;
    }

    ckSwfu=new SWFUpload({
        upload_url : uploadUrl,
        flash_url : "../SWFupload/SWFUpload.swf",
        file_size_limit : "4 MB",
        file_types : "*.jpg;*.png;*.gif;*.jpeg;*.bmp",
        file_types_description : "Web Image Files",
        file_queue_limit : 0,
        custom_settings : {
        progressTarget : progress,
        cancelButtonId : btn
        },
        debug: false,

        button_image_url : "../../imgs/btn.jpg",
        button_placeholder_id : spanButtonPlaceHolder,
        button_text: "<span class='btnText'>上传图片</span>",
        button_width: 81,
        button_height: 24,
        button_text_top_padding: 2,
        button_text_left_padding: 20,
        button_text_style: '.btnText{color:#666666;}',
        //button_cursor:SWFUpload.CURSOR.HAND,

        file_queued_handler : fileQueuedCk,
        //file_queue_error_handler : fileQueueError,
        file_dialog_complete_handler : fileDialogCompleteCk,
        //upload_start_handler : uploadStart,
        //upload_progress_handler : uploadProgress,
        //upload_error_handler : uploadError,
        upload_success_handler : uploadSuccessCk,
        //upload_complete_handler : uploadComplete,
        //queue_complete_handler : queueComplete
    });
};
//开始上传图片
function ckUploadImageStart(obj){
    ckSwfu.startUpload();
}
//回调重写
function fileQueuedCk(file) {
    try {
    if($("#ck_fs_upload_progress").html().indexOf(".jpg") == -1){
        $("#ck_fs_upload_progress").html("");
    }
    var progress = new FileProgress(file, this.customSettings.progressTarget);
    progress.setStatus("Pending...");
    progress.toggleCancel(true, this);
    $(progress.fileProgressWrapper).css("display","none");
    $("#ck_fs_upload_progress").append(" "+file.name);
    } 
    catch (ex) {
        this.debug(ex);
    }
}

//回调重写，上传成功后
function uploadSuccessCk(file, serverData) {
try {
    var progress = new FileProgress(file, swfu.customSettings.progressTarget);
    $(progress.fileProgressWrapper).css("display","none");
    var json = eval("("+serverData+")");
    var img = '<div style="float:left;"><img picUrl="'+json.url+'" src="'+json.url+'" style="width:80px;height:80px"/><a href="javascript：void(0)" onclick="deletePic(this)">X</a></div>';
    $("#ck_pic_div").append(img);
    $("#ck_pic_div").dragsort("destroy"); //图片排序，这里要下载dragsort插件
    $("#ck_pic_div").dragsort({ 
            dragSelector: "div", 
            dragBetween: true, 
            placeHolderTemplate: "<div class='placeHolder' style='float:left'><img /><a></a></div>"
        });
    } 
    catch (ex){
    }
}

//回调重写，主要是设置参数，如果需要的参数没有，就清空上传的文件，为了解决下次选择会上传没有参数时的图片
function fileDialogCompleteCk(numFilesSelected, numFilesQueued) {
    try {
        var commoNo = $("#commoNo").val();
        var brandNo = $("#brand option:selected").val();
        var catNo = $("#thirdCommon option:selected").val();
        //初始化上传图片
        if(brandNo != "" && commoNo != "" && catNo != "") {
            this.addPostParam("commoNo",commoNo);
            this.addPostParam("thirdCatNo",catNo);
            this.addPostParam("brandNo",brandNo);
            if (numFilesSelected > 0) {
                document.getElementById(this.customSettings.cancelButtonId).disabled = false;
            }
        }else{
            for(var i=0;i<numFilesSelected;i++){
               var promitId = this.customSettings.progressTarget;
               $("#"+promitId).find("*").remove();
               var fileId = this.getFile().id;
               this.cancelUpload(fileId,false);
           }
           $("#ck_fs_upload_progress").html("");
           alert("请选择分类和品牌！");
        }
    }catch (ex)  {
        this.debug(ex);
    }
}