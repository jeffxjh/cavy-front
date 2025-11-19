<template>
    <div class="test2">
        <el-upload
            style="margin-left:14%;margin-top:5%"
            class="avatar-uploader el-upload--text"
            :drag="Plus"
            action="http://localhost:8443/api/uploadVidoe3"
            multiple
            :show-file-list="false"
            :data="{ SavePath: this.Path.url }"
            :on-success="handleVideoSuccess"
            :before-upload="beforeUploadVideo"
            :on-progress="uploadVideoProcess"
        >
            <i v-if="Plus" class="el-icon-upload"></i>
            <div v-if="Plus" class="el-upload__text">
                将文件拖到此处，或
                <em>点击上传</em>
            </div>
            <el-progress
                v-if="videoFlag == true"
                type="circle"
                :percentage="videoUploadPercent"
                style="margin-top:30px;"
            ></el-progress>
            <div class="el-upload__tip" slot="tip">只能上传mp4/flv/avi文件，且不超过300M</div>
        </el-upload>
    </div>
</template>

<script>
    export default {
        name: 'test2',
        data() {
            return {
                videoForm: {
                    videoId: '',
                    videoUrl: '',
                },
                videoFlag: false,
                Plus: true,
                Path: {
                    url: 'F:/video/videoUpload',
                },
                videoUploadPercent: 0,
            };
        },
        mounted: function() {},
        methods: {
            // 视频上传前执行
            beforeUploadVideo(file) {
                const fileType =
                    file.name.endsWith('.flv') ||
                    file.name.endsWith('.avi') ||
                    file.name.endsWith('.mp4') ||
                    file.name.endsWith('.ogg') ||
                    file.name.endsWith('.wmv') ||
                    file.name.endsWith('.rmvb');

                console.info(file, fileType, 'file');
                const isLt300M = file.size / 1024 / 1024 < 300;
                if (
                    [
                        'video/mp4',
                        'video/ogg',
                        'video/flv',
                        'video/avi',
                        'video/wmv',
                        'video/rmvb',
                    ].indexOf(file.type) === -1 &&
                    !fileType
                ) {
                    this.$message.error('请上传正确的视频格式');
                    return false;
                }
                if (!isLt300M) {
                    this.$message.error('上传视频大小不能超过300MB哦!');
                    return false;
                }
            },
            // 视频上传过程中执行
            uploadVideoProcess(event, file, fileList) {
                this.Plus = false;
                this.videoFlag = true;
                this.videoUploadPercent = file.percentage.toFixed(0);
            },
            // 视频上传成功是执行
            handleVideoSuccess(res, file) {
                this.Plus = false;
                this.videoUploadPercent = 100;
                console.log(res);
                // 如果为200代表视频保存成功
                if (res.resCode === '200') {
                    // 接收视频传回来的名称和保存地址
                    // 至于怎么使用看你啦~
                    this.videoForm.videoId = res.newVidoeName;
                    this.videoForm.videoUrl = res.VideoUrl;
                    this.$message.success('视频上传成功！');
                } else {
                    this.$message.error('视频上传失败，请重新上传！');
                }
            },
        },
    };
</script>
