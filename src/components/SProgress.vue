<template>
    <div class="scaleProgress">
      <el-progress
        :text-inside="true"
        :stroke-width="18"
        :percentage="progressNum"
      ></el-progress>
    </div>
</template>

<script>
export default {
  data() {
    return {
      progressNum: 10,
      startTimer: "",
      endTimer: ""
    };
  },
  props: {
    progressStatus: {
      type: Boolean,
      default() {
        return false;
      }
    }
  },
  watch: {
    progressStatus(val) {
      if (val) {
        this.endProgress();
      }
    }
  },
  methods: {
    startProgress() {
      this.startTimer = setInterval(() => {
        this.progressNum++;
        // if (this.progressNum > 85) {
        //   clearInterval(this.startTimer);
        // }
      }, 100);
    },
    endProgress() {
      clearInterval(this.startTimer);
      this.endTimer = setInterval(() => {
        this.progressNum++;
        if (this.progressNum > 99) {
          clearInterval(this.endTimer);
          this.finishProgress();
        }
      }, 10);
    },
    finishProgress() {
      this.$emit("finishProgress", false);
    }
  },
  mounted() {
    this.startProgress();
  }
};
</script>
<style scoped>
.scaleProgress {
  transform: scaleY(0.75);
}
</style>
