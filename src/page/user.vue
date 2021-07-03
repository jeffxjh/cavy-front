 <style>
</style>
<template>
  <div id="user">
    <h1>用户列表</h1>
    <el-progress :text-inside="true" :stroke-width="26" :percentage="70"></el-progress>
<el-progress :text-inside="true" :stroke-width="24" :percentage="100" status="success"></el-progress>
<el-progress :text-inside="true" :stroke-width="22" :percentage="80" status="warning"></el-progress>
<el-progress :text-inside="true" :stroke-width="20" :percentage="50" status="exception"></el-progress>
  </div>
</template>

<script>
export default {
  name: 'User'
}
</script>
