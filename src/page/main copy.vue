<template>
  <div>
    <el-row>
      <!-- <el-button round>圆角按钮</el-button> -->
      <!-- <el-button type="primary" round @click="save">操作</el-button> -->
      <el-button type="success" round @click="business">成功按钮</el-button>
      <!-- <el-button type="info" round>信息按钮</el-button>
      <el-button type="warning" round>警告按钮</el-button>
      <el-button type="danger" round>危险按钮</el-button>  -->
    </el-row>
    <el-progress
      type="circle"
      :percentage="progressValue"
      color="#8e71c7"
    ></el-progress>
    <!-- <el-progress type="circle" :percentage="progressValue"></el-progress>
    <el-progress
      type="circle"
      :percentage="progressValue"
      status="success"
    ></el-progress>
    <el-progress
      type="circle"
      :percentage="progressValue"
      status="warning"
    ></el-progress>
    <el-progress
      type="circle"
      :percentage="50"
      status="exception"
    ></el-progress>
    <s-progress
      @finishProgress="closeProgress"
      v-if="showProgress"
      :progressStatus="progressStatus"
    ></s-progress> -->
  </div>
</template>

<script>
import axios from "axios";
import { business } from "../common/api/api";
import sProgress from "@/components/SProgress";
export default {
  components: {
    "s-progress": sProgress
  },
  data() {
    return {
      progressValue: 0,
      status: "success",
      showProgress: false,
      progressStatus: false
    };
  },
  methods: {
    closeProgress(val) {
      this.showProgress = val;
      this.progressStatus = val;
    },
    save() {
      this.showProgress = true;
      setTimeout(() => {
        this.progressStatus = true;
      }, 3000);
    },
    business() {
      let that = this;
      let r = business({ uuid: "" })
        .then(function(res) {
          // console.info(res, 1);
          if (res.status === 200 && res.data.msg === "success") {
            let interval = setInterval(() => {
              business({uuid: res.data.data.uuid})
                .then(function(response) {
                  // console.log(response.data.data, 2);
                  that.progressValue = parseInt(response.data.data.count);
                  if (parseInt(response.data.data.count) >= 100) {
                    clearInterval(interval);
                    that.$message({
                      message: "操作成功",
                      type: "success"
                    });
                  }
                })
                .catch(function(error) {
                  // console.log(error);
                  clearInterval(interval);
                  that.$message.error("操作失败");
                });
            }, 2000);
          }
        })
        .catch(function(error) {
          console.log(error);
          clearInterval(interval);
        });
    }
  }
};
</script>
