<template>
  <div>
    <el-row :gutter="20" class="el-row">
      <el-col :span="2">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <img class="checkbox" src="@/assets/main/checkbox.png" alt="checkbox" />
          </div>
          <div><span style="color: grey;">Task</span></div>
          <div><span style="color: grey;">Completed</span></div>
          <div><span style="font-size:xx-large ;font-weight: bolder;">24</span></div>
          <div><span style="color: red;">-9%</span></div>
        </el-card></el-col>
      <el-col :span="6">
        <el-card class="box-card">
          <el-row>
            <el-col :span="10">
              <div><span style="color: grey;">Total Application</span></div>
              <div><span style="font-size:xx-large ;font-weight: bolder;">5672</span></div>
              <div><span style="color: grey;font-size: smaller;"> <img class="curves" src="@/assets/main/curves.png"
                       alt="curves" />+14% Inc</span></div>
            </el-col>
            <el-col :span="10">
              <div id="aa"></div>
            </el-col>
          </el-row>
        </el-card></el-col>
      <el-col :span="6"><el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>卡片名称</span>
            <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>
          </div>
          <div v-for="o in 4" :key="o" class="text item">
            {{ "列表内容 " + o }}
          </div>
        </el-card></el-col>
      <el-col :span="6"><el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>卡片名称</span>
            <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>
          </div>
          <div v-for="o in 4" :key="o" class="text item">
            {{ "列表内容 " + o }}
          </div>
        </el-card></el-col>
    </el-row>
    <el-row :gutter="20" class="el-row">
      <el-col :span="8"><el-card shadow="always" class="el-card-define">
          <span>事事如意</span>
          <div style="height: 200px">
            <el-table
                      :data="tableData.data1"
                      max-height="200"
                      style="width: 100%">
              <el-table-column prop="buss" label="事项名称" width="150" />
              <el-table-column prop="cast" label="总支出" width="180" />
              <el-table-column prop="income" label="总收入" width="180" />
              <el-table-column prop="sum" label="产生次数" width="150" />
            </el-table>
          </div>
        </el-card></el-col>
      <el-col :span="8"><el-card shadow="always">
          <span>亲友团</span>
          <div style="height: 200px">
            <el-table
                      :data="tableData.data2"
                      max-height="200"
                      style="width: 100%">
              <el-table-column prop="name" label="人员名称" width="150" />
              <el-table-column prop="cast" label="总支出" width="180" />
              <el-table-column prop="income" label="总收入" width="180" />
              <el-table-column prop="sum" label="交往次数" width="150" />
            </el-table>
          </div>
        </el-card></el-col>
      <el-col :span="8"><el-card shadow="always">
          <span>恩重如山榜</span>
          <div style="height: 200px">
            <el-table
                      :data="tableData.data3"
                      max-height="200"
                      style="width: 100%">
              <el-table-column prop="buss" label="事项名称" />
              <el-table-column prop="name" label="人员名称" />
              <el-table-column prop="amt" label="金额" />
              <el-table-column prop="type" label="支出或收入" />
            </el-table>
          </div>
        </el-card></el-col>
    </el-row>
    <el-row :gutter="20" class="el-row">
      <el-col :span="24"><el-card shadow="always">
          <span>最近人情记录</span>
          <div style="height: 500px">
            <el-table
                      :data="tableData.data4"
                      max-height="800"
                      height="500"
                      style="width: 100%">
              <el-table-column prop="buss" label="事项名称" width="150" />
              <el-table-column prop="name" label="姓名" width="150" />
              <el-table-column prop="relation" label="关系" width="180" />
              <el-table-column prop="intimacy" label="亲密度" width="150" />
              <el-table-column prop="type" label="支出或收入" width="150" />
              <el-table-column prop="cost" label="支出" width="180" />
              <el-table-column prop="income" label="收入" width="180" />
              <el-table-column
                               prop="favorability"
                               label="本次往来满意度"
                               width="180" />
              <el-table-column prop="date" label="日期" width="180" />
            </el-table>
          </div>
        </el-card></el-col>
    </el-row>
    <div id="myChart" :style="{ width: '300px', height: '300px' }"></div>
    <div id="aaa" :style="{ width: '300px', height: '300px' }"></div>
  </div>
</template>

<script>
import axios from "axios";
import { business } from "../common/api/api";
export default {
  components: {},
  data() {
    return {
      tableData: {
        data1: [
          { buss: "结婚", cast: 12, income: 21, sum: 2 },
          { buss: "过年", cast: 21, income: 12, sum: 2 },
        ],
        data2: [
          { name: "张三", cast: 12, income: 21, sum: 2 },
          { name: "李四", cast: 21, income: 12, sum: 2 },
        ],
        data3: [{ buss: "结婚", name: "张三", amt: 1233, type: "收入" }],
        data4: [{ date: "asd", name: "jj", address: "长沙" }],
      },
    };
  },
  created() { },
  methods: {
    drawLine() {
      let myChart = this.$echarts.init(document.getElementById("myChart"));
      // 绘制图表
      myChart.setOption({
        title: { text: "在Vue中使用echarts" },
        tooltip: {},
        xAxis: {
          data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"],
        },
        yAxis: {},
        series: [
          {
            name: "销量",
            type: "bar",
            data: [5, 20, 36, 10, 10, 20],
          },
        ],
      });
    },
    aa() {
      let aa = this.$echarts.init(document.getElementById("aa"));
      // 绘制图表
      aa.setOption({
        tooltip: {
          trigger: 'item'
        },
        legend: {
          top: '5%',
          left: 'center'
        },
        series: [
          {
            name: 'Access From',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            padAngle: 5,
            itemStyle: {
              borderRadius: 10
            },
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 40,
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: [
              { value: 1048, name: 'Search Engine' }
            ]
          }
        ]
      });
    },
  },
  mounted() {
    // 新建一个promise对象
    let newPromise = new Promise((resolve) => {
      resolve();
    });
    //然后异步执行echarts的初始化函数
    newPromise.then(() => {
      this.drawLine();
      this.aa();
    });
  },
};
</script>
<style scoped>
.el-card span .font2 {
  color: gainsboro !important;
  font-size: large;
  font-weight: bolder;
}

.checkbox {
  cursor: pointer;
  height: 40px;
  margin-left: 0;
}

.curves {
  cursor: pointer;
  height: 10px;
  margin-left: 0;
  padding-right: 5px;
}

.el-row {
  margin-left: 50px !important;
  margin-right: 50px !important;
  margin-bottom: 20px;
  margin-top: 20px;
  display: flex;
  flex-wrap: wrap;
}

.el-row:last-child {
  margin-bottom: 0;
}

.el-col {
  border-radius: 4px;
}

.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
</style>