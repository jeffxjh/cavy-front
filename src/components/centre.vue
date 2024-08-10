<template>
  <div id="centre">
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
        <el-card class="box-card" body-style="padding: 0;">
          <el-row align="bottom">
            <el-col :span="12">
              <div style="width: 100%;height:32%;align-content: end;"><span style="color: grey;">Total User</span>
              </div>
              <div style="width: 100%;height:32%;align-content: center;"><span
                      style="font-size:xxx-large ;font-weight: bolder;">{{ userChange.total }}</span>
              </div>
              <div style="width: 100%;height:32%;">
                <span style="color: grey;font-size: large;"><img class="curves" src="@/assets/main/curves.png"
                       alt="curves" />
                  <span v-if="userChangeNum > 0" style="color: green;font-size: large;">+{{ userChangeNum }}% Inc</span>
                  <span v-else style="color: red;font-size: large;">{{ userChangeNum }}% Red</span>
                </span>
              </div>
            </el-col>
            <el-col :span="12">
              <div id="drawUserPic" :style="{ width: '198px', height: '198px' }"></div>
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
  </div>
</template>

<script>
export default {
  name: 'centre',
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
      userChange: {
        add: 10,
        total: 100,
        delete: 2
      }
    };
  },
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
    drawUserPic() {
      // 初始化ECharts实例
      this.drawUserPic = this.$echarts.init(document.getElementById("drawUserPic"));

      // 绘制图表
      this.drawUserPic.setOption({
        tooltip: {
          trigger: 'item'
        },
        //铭文
        legend: {
          show: false,
          top: '5%',
          left: 'center'
        },
        series: [
          {
            name: 'Access From',
            type: 'pie',
            //圆弧内半径和外半径
            radius: ['55%', '70%'],
            avoidLabelOverlap: false,
            padAngle: 2,
            itemStyle: {
              borderRadius: 10
            },
            label: {
              normal: {
                show: true,
                position: 'center',
                color: '#4c4a4a',
                formatter: '{total|' + '+1位' + '}' + '\n\r' + '{active|活跃用户}',
                rich: {
                  total: {
                    fontSize: 20,
                    fontFamily: "微软雅黑",
                    color: '#454c5c'
                  },
                  active: {
                    fontFamily: "微软雅黑",
                    fontSize: 12,
                    color: '#6c7a89',
                    lineHeight: 30,
                  },
                }
              },
              emphasis: {//中间文字显示
                show: true,
              }
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
              // { value: 1048, name: '全部', itemStyle : {normal : {color :'#76d1fa'}} },
              // { value: 110, name: '新增', itemStyle : {normal : {color :'#31cc88'}} },
              // { value: 20, name: '删除', itemStyle : {normal : {color :'#f84d20'}} }, 
              { value: this.userChange.total, name: '全部' },
              { value: this.userChange.add, name: '新增' },
              { value: this.userChange.delete, name: '删除' },
            ]
          },
        ]
      });
    },
  },
  computed:{
    userChangeNum() {
      return this.userChange.add-this.userChange.delete
    }
  },
  mounted() {
    // 新建一个promise对象
    let newPromise = new Promise((resolve) => {
      resolve();
    });
    //然后异步执行echarts的初始化函数
    newPromise.then(() => {
      // this.drawLine();
    });

    // 使用箭头函数保持this上下文
    setTimeout(() => {
      this.drawUserPic();
    }, 0);

    // 使用箭头函数保持this上下文
    window.addEventListener('resize', () => {
      if (this.drawUserPic) {
        this.drawUserPic.resize();
      }
    });

  },
}
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