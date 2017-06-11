<template>
    <div class="commonInfoFindForm">
      <el-form rel="form" :model="findModel">
        <el-row>
          <el-col :span="8">
            <el-form-item :label="findModel.message">
              <el-date-picker
                v-model="findModel.startDate"
                type="date"
                placeholder="选择开始日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="1" class="span-and">
            <span >至</span>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-date-picker
                v-model="findModel.endDate"
                type="date"
                placeholder="选择结束日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="审核状态">
              <el-select v-model="findModel.status" placeholder="选择审核状态">
                <el-option label="全部" value=""></el-option>
                <el-option label="已审核" value="2"></el-option>
                <el-option label="未审核" value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="1">
            <el-button type="primary" style="padding: 10px 30px;" @click="findModel.callback">查询</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
</template>

<script>
	export default {
		name: 'commonInfoFindForm',
    props: ['findModel'],
    data() {
			return {
				/*findModel : {
					startDate : '', //进货单最早时间
          endDate : '',//进货单最迟时间
          status : '',//进货单审核状态
        }*/
      }
    }
	}
</script>

<style scoped>
  .span-and{
    margin-top: 6px;
    margin-left: -8px;
  }
</style>
