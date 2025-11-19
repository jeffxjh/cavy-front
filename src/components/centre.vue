<template>
  <div id="centre" ref="myElement">
    <el-calendar>
      <template slot="dateCell" slot-scope="{date, data}">
        <el-popover
                    :open-delay="500"
                    v-if="reversedMessage(data.day)"
                    placement="top-start"
                    :width="tipesWidth"
                    trigger="hover">
          <div class="el-popover__title day-title">今日提醒</div>
          <div class="el-popover__title" style="text-align: center">{{ data.day }}</div>
          <div v-for="(item, index) in reversedMessage(data.day).data" :key="index">
            <el-row>
              <el-col :span="6">时间：</el-col>
              <el-col :span="18">{{ item.startDate.substring(11) }} - {{ item.endDate.substring(11) }}</el-col>
            </el-row>
            <el-row>
              <el-col :span="6">标题：</el-col>
              <el-col :span="18">{{ item.title }}</el-col>
            </el-row>
            <br v-if="index != reversedMessage(data.day).data.length - 1" />
          </div>
          <div slot="reference" class="test" @click="dayClick(data.day)">
            <div class="jcs-day">{{ data.day.split('-').slice(2).join('-') }}</div>
            <div :class="[reversedMessage(data.day) && !data.isSelected ? 'jcs' : 'done']">{{ data.isSelected ? '✔️' :
              '' }}
            </div>
          </div>
        </el-popover>
        <div v-else class="test" @click="dayClick(data.day)">
          <div class="jcs-day">{{ data.day.split('-').slice(2).join('-') }}</div>
          <div :class="[reversedMessage(data.day) && !data.isSelected ? 'jcs' : 'done']">{{ data.isSelected ? '✔️' : ''
            }}
          </div>
        </div>
      </template>
    </el-calendar>
  </div>
</template>

<script>
export default {
  name: "CalendarDemo",
  data() {
    return {
      tipesWidth: 0,
      cData: [
        {
          "data": [
            {
              "content": "测试01",
              "createDate": "2021-02-01 10:00:27",
              "createUser": "EB3764DA0D4B0A42A7C2EE176116748F",
              "endDate": "2021-02-02 11:59:59",
              "id": "c0423050ea6352d295e995a2d5e40b94",
              "isDelete": 0,
              "startDate": "2021-02-02 01:00:00",
              "title": "测试01"
            },
            {
              "content": "测试02",
              "createDate": "2021-02-01 12:00:27",
              "createUser": "EB3764DA0D4B0A42A7C2EE176116748F",
              "endDate": "2021-02-02 22:59:59",
              "id": "c0423050ea6352d295e995a2d5e40b94",
              "isDelete": 0,
              "startDate": "2021-02-02 09:00:00",
              "title": "测试02"
            }
          ],
          "date": "2025-01-25"
        },
        {
          "data": [
            {
              "content": "测试测试测试",
              "createDate": "2021-02-01 10:00:27",
              "createUser": "EB3764DA0D4B0A42A7C2EE176116748F",
              "endDate": "2021-02-03 23:59:59",
              "id": "c0423050ea6352d295e995a2d5e40b94",
              "isDelete": 0,
              "startDate": "2021-02-03 00:00:00",
              "title": "测试"
            }
          ],
          "date": "2025-01-24"
        },
        {
          "data": [
            {
              "content": "测试01测试01测试01测试01测试01",
              "createDate": "2021-02-01 10:25:27",
              "createUser": "EB3764DA0D4B0A42A7C2EE176116748F",
              "endDate": "2021-02-18 21:00:00",
              "id": "ee0851a0696089665e7c6c92c98185a7",
              "isDelete": 0,
              "startDate": "2021-02-18 00:00:00",
              "title": "测试01测试01测试01测试01"
            }
          ],
          "date": "2025-01-23"
        }
      ],
      count: 0
    }
  },
  mounted() {
    window.addEventListener('resize', this.handleWindow, true)

    // 当组件挂载完成后执行    
    this.$nextTick(() => {
      this.conputeTitpsWidth();
    });
  },

  methods: {
  
    // 滚动对应高亮
    handleWindow(e) {
      this.conputeTitpsWidth();
      console.log(e)
    },
    conputeTitpsWidth() {
      const elementWidth = this.$refs.myElement.offsetWidth;
      this.tipesWidth = elementWidth / 7 - 30;
    },
    reversedMessage: function (val) {
      return this.cData.find(function (data) {
        return data.date === val;
      })
    },
    dayClick(val) {
      alert(val)
    }
  }
}
</script>
<style scoped>
.jcs {
  background: #fb8c8c;
  position: absolute;
  top: 10%;
  right: 5%;
  width: 10px;
  height: 10px;
  border-radius: 10px;
}

.done {
  position: absolute;
  bottom: 10%;
  right: 5%;
  width: 10px;
  height: 10px;
  border-radius: 10px;
}

.test {
  width: 100%;
  height: 100%;
  position: relative;
}

.el-calendar-day {}

.jcs-day {
  position: absolute;
  top: 35%;
  left: 40%;

}

.day-title {
  font-size: 16px;
  letter-spacing: 1px;
  color: #1aae50;
  text-align: center;
  border-bottom: 1px solid #e6e6e6;
  padding: 0 0 6px 0;
  margin: 0 0 10px 0;
}

.test01 {
  width: 640px;
  margin-left: 200px;
}

.is-selected {
  color: #1989FA;
}
</style>