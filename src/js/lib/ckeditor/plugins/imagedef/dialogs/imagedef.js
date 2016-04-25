CKEDITOR.dialog.add(
  "imagedef",
  function (b){
    return {
      title:"批量传图",
      minWidth:590,
      minHeight:300,
      contents:[{
        id:"tab1",
        label:"",
        title:"",
        expand:true,
        padding:0,
        elements:[{
          type:"html",
          html:initImageDlgInnerHtml() //对话框中要显示的内容，这里的代码将发在下面
        }]
      }],
      onOk: function(){ //对话框点击确定的时候调用该函数
        var D = this;
        var imes = getCkUploadImages();//获取上传的图片，用于取路径，将图片显示在富文本编辑框中
        $(imes).each(function(){
          D.imageElement = b.document.createElement('img');
          D.imageElement.setAttribute('alt', '');
          D.imageElement.setAttribute('_cke_saved_src', $(this).attr("src"));
          D.imageElement.setAttribute('src', $(this).attr("src"));
          D.commitContent(1, D.imageElement);
          if (!D.imageElement.getAttribute('style')){
            D.imageElement.removeAttribute('style');
          }
          b.insertElement(D.imageElement);
        });
      },
      onLoad: function(){ //对话框初始化时调用
        initEventImageUpload(); //用于注册上传swfupload组件
      },
      onShow:function(){
        clearCkImageUpload(); //在对话框显示时作一些特殊处理
      }
    };
  }
);