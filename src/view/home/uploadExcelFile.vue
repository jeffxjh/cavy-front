<template>
    <el-dialog
      title="提示"
      :visible.sync="showDialog"
      :width="width"
      @close="handleClose">
      <el-button size="small" type="primary" @click="downTemplate">下载模板</el-button>

      <el-row>
        <div class="el-form-item__content">
          <el-upload ref="upload"
                     accept=".xls,.xlsx"
                     action="#"
                     :auto-upload="false"
                     :multiple="true"
                     :file-list="fileList"
                     :before-upload="beforeUpload"
                     :http-request="uploadHttpRequest"
                     :on-remove="fileRemove"
                     :on-change="fileChange">
            <el-button size="small" type="primary">选择文件</el-button>
            <div slot="tip" class="el-upload__tip">一次只能上传一个xls/xlsx文件，且不超过10M</div>
          </el-upload>
        </div>
      </el-row>
      <el-row>
        <el-button size="small" @click="closeDialog">取 消</el-button>
        <el-button type="primary" size="small" @click="submitUpload">上 传</el-button>
        <!--      <el-button type="primary" size="small" @click="downloadRes">下载反馈结果</el-button>-->
      </el-row>

    </el-dialog>
</template>

<script>
import {postExcelRequest} from "@/common/api/axios";
export default {
  // 接受父组件传递的值
  props: {
    addOrUpdateVisible: {
      type: Boolean,
      default: false
    },
    width: {
      type: String,
      default: ''
    },
    excelUrl: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      // 控制弹出框显示隐藏
      showDialog: false,
      fileList: []
    }
  },
  methods: {
    // 弹出框关闭后触发
    handleClose() {
      // 子组件调用父组件方法，并传递参数
      this.$emit('changeShow', 'false')
    },
    // 上传文件之前的钩子：判断上传文件格式、大小等，若返回false则停止上传
    beforeUpload(file) {
      //文件类型
      const isType = file.type === 'application/vnd.ms-excel'
      const isTypeComputer = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      const fileType = isType || isTypeComputer
      if (!fileType) {
        this.$message.error('上传文件只能是xls/xlsx格式！')
      }

      // 文件大小限制为10M
      const fileLimit = file.size / 1024 / 1024 < 10;
      if (!fileLimit) {
        this.$message.error('上传文件大小不超过10M！')
      }
      return fileType && fileLimit
    },
    // 自定义上传方法，param是默认参数，可以取得file文件信息，具体信息如下图
    uploadHttpRequest(param) {
      const formData = new FormData() //FormData对象，添加参数只能通过append('key', value)的形式添加
      formData.append('file', param.file) //添加文件对象
      formData.append('uploadType', this.rulesType)
      postExcelRequest(this.excelUrl,formData).then(res => {
        console.log('上传结果', res.data)
        param.onSuccess()
        })
        .catch(err => {
          console.log('上传失败', err)
          param.onError()
        })
    },
    // 点击上传：手动上传到服务器，此时会触发组件的http-request
    submitUpload() {
      this.$refs.upload.submit()
    },
    // 文件发生改变
    fileChange(file, fileList) {
      if (fileList.length > 0) {
        this.fileList = [fileList[fileList.length - 1]] // 展示最后一次选择的文件
      }
    },
    // 移除选择的文件
    fileRemove(file, fileList) {
      if (fileList.length < 1) {
        this.uploadDisabled = true //未选择文件则禁用上传按钮
      }
    },
    // 取消
    closeDialog() {
      this.$refs.upload.clearFiles() //清除上传文件对象
      this.fileList = [] //清空选择的文件列表
      this.$emit('close', false)
    } ,
    // 下载模板
    downTemplate() {
        let link = document.createElement('a')
        link.style.display = 'none'
        link.href = '/static/用户导入模板.xlsx';
        link.download = '用户导入模板.xlsx';
        link.click();
    }
  },
  watch: {
    // 监听 addOrUpdateVisible 改变
    addOrUpdateVisible(oldVal, newVal) {
      this.showDialog = this.addOrUpdateVisible
    },
  }
}
</script>

<style scoped>

</style>
