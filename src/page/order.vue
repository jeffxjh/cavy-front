<template>
  <div>
    <el-row :gutter="20" class="el-row">
      <el-col :span="2">
        <el-card class="box-card">
          <h6 class="card-subtitle">钱包余额</h6>
            <div class="row align-items-center gx-2 mb-1">
              <div class="col-12">
                <h2 class="card-title text-inherit">0 CNY</h2>
              </div>
              <div class="col-12">
                
              </div>
            </div>
            <span class="badge bg-soft-info text-info">
              <i class="bi-graph-dash"></i> 100%
            </span>
            <span class="text-body fs-6 ms-1">上次记录 0  CNY</span>
        </el-card>
      </el-col>

   
    </el-row>

  </div>
</template>

<script>
export default {
  name: 'Order'
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