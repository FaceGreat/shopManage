<template>
    <div class="discountForm">
      <el-form :model="form" rel="form"  label-width="150px">
        <el-form-item label="会员类型名称" >
          <el-input v-model="form.name" class="element"></el-input>
        </el-form-item>
        <el-form-item label="会员类型折扣率" >
          <el-input v-model="form.discount" class="element"></el-input>
        </el-form-item>
        <el-form-item label="满足折扣消费次数" >
          <el-input-number v-model="form.timesLimit" :min="1" class="element"></el-input-number>
        </el-form-item>
        <el-form-item label="满足折扣消费金额" >
        <el-input-number v-model="form.costLimit" :min="1" class="element"></el-input-number>
        <br/>
        <p>在指定消费<span class="tagSpan">金额和次数</span>后自动升级为对应的会员类型</p>
      </el-form-item>
      </el-form>
    </div>
</template>

<script>
	export default {
		name: 'discountForm',
    props :['form']
	}
</script>

<style scoped>
  .element{
    width:350px;
  }
  .tagSpan{
    color : red;
    font-size: 15px;
  }
</style>
