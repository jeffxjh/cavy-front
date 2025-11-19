<template>
  <div class="dashboard">
    <!-- <el-row :gutter="20" class="stats-row">
      <el-col :span="6">
        <stat-card 
          title="待办任务" 
          :value="stats.todoCount" 
          icon="el-icon-s-order"
          color="#409EFF"
          @click="$router.push('/my-tasks')"
        />
      </el-col>
      <el-col :span="6">
        <stat-card 
          title="已办任务" 
          :value="stats.doneCount" 
          icon="el-icon-finished"
          color="#67C23A"
        />
      </el-col>
      <el-col :span="6">
        <stat-card 
          title="进行中流程" 
          :value="stats.runningCount" 
          icon="el-icon-loading"
          color="#E6A23C"
        />
      </el-col>
      <el-col :span="6">
        <stat-card 
          title="已完成流程" 
          :value="stats.completedCount" 
          icon="el-icon-success"
          color="#909399"
        />
      </el-col>
    </el-row>

    <el-row :gutter="20" class="content-row">
      <el-col :span="16">
        <quick-access-panel @quick-action="handleQuickAction" />
      </el-col>
      <el-col :span="8">
        <recent-tasks :tasks="recentTasks" />
      </el-col>
    </el-row> -->
  </div>
</template>

<script>
// import StatCard from '@/components/common/StatCard'
// import QuickAccessPanel from '@/components/dashboard/QuickAccessPanel'
// import RecentTasks from '@/components/dashboard/RecentTasks'

export default {
  name: 'workflowDashboard',
  components: {
    // StatCard,
    // QuickAccessPanel,
    // RecentTasks
  },
  data() {
    return {
      stats: {
        todoCount: 0,
        doneCount: 0,
        runningCount: 0,
        completedCount: 0
      },
      recentTasks: []
    }
  },
  mounted() {
    this.loadDashboardData()
  },
  methods: {
    async loadDashboardData() {
    //   try {
    //     // 加载统计数据和最近任务
    //     const [statsRes, tasksRes] = await Promise.all([
    //       this.$api.workflow.getDashboardStats(),
    //       this.$api.task.getTodoTasks(this.$store.state.user.userId)
    //     ])
        
    //     this.stats = statsRes.data
    //     this.recentTasks = tasksRes.data.slice(0, 5)
    //   } catch (error) {
    //     this.$message.error('加载数据失败')
    //   }
    },
    
    handleQuickAction(action) {
      switch (action) {
        case 'process-design':
          this.$router.push('/process-design')
          break
        case 'form-design':
          this.$router.push('/form-design')
          break
        case 'my-tasks':
          this.$router.push('/my-tasks')
          break
      }
    }
  }
}
</script>

<style scoped>
.dashboard {
  padding: 20px;
  
 
}
</style>