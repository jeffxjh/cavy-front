<template>
  <div>
    <div ref="editor"></div>
  </div>
</template>

<script>
import E from 'wangeditor';
export default {
  name: 'editor',
  data() {
    return {};
  },
  props: {
    value: '',
  },
  mounted() {
    let editor = new E(this.$refs.editor);
    editor.config.menus = [
      'bold', // 粗体
      'fontSize', // 字号
      'fontName', // 字体
      'italic', // 斜体
      'underline', // 下划线
      'strikeThrough', // 删除线
      'foreColor', // 文字颜色
      'link', // 插入链接
      'list', // 列表
      'justify', // 对齐方式
      'quote', // 引用
      'image', // 插入图片
      'location', // 位置
    ];
    editor.config.onchange = html => {
      this.$emit('input', html);
    };
    editor.config.uploadImgShowBase64 = true
    //配置文件上传接口有跨域问题
    // editor.config.uploadImgServer = '/cavy/file/minio/upload';
    // editor.config.uploadImgHeaders = {
    //   Accept: "application/json, text/plain, */*",
    //   Authorization: "Bearer "+localStorage.token,
    //
    // }
    editor.config.uploadImgMaxSize = 10 * 1024 * 1024; // 将图片大小限制为 10M
    editor.config.uploadFileName = 'file'; //后端接受上传文件的参数名
    editor.config.uploadImgMaxLength = 1; // 限制一次最多上传 1 张图片
    editor.config.showLinkImg = false; //隐藏网络图片上传
    editor.config.uploadImgHooks = {
      fail: (xhr, editor, result) => {
        // 插入图片失败回调
        console.log(result);
      },
      success: (xhr, editor, result) => {
        // 图片上传成功回调
        console.log(result);
      },
      timeout: (xhr, editor) => {
        // 网络超时的回调
        console.log('网络超时');
      },
      error: (xhr, editor) => {
        // 图片上传错误的回调
        console.log('上传错误');
      },
      //回显
      customInsert: (insertImg, result, editor) => {
        console.log(result);
        let id = result.data.fileId;
        let a = result.data.fileName.split('.')[1];
        let str = id + '/' + a;
        let url =
          '图片下载地址？fileId=' +
          str;
        insertImg(url);
      },
    };
    editor.create();
    editor.txt.html(this.value);
  },
};
</script>

<style scoped>
</style>
