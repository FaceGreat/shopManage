<template>
  <div class="memberForm">
    <el-form ref="form" :model="visible.props.form" label-width="120px">
      <el-form-item label="卡号">
        <el-input type="text" :readonly="visible.props.disable" v-model="visible.props.form.memberId" placeholder="用户持有卡号" class="element"></el-input>
      </el-form-item>
      <el-form-item label="姓名">
        <el-input type="text" v-model="visible.props.form.name" placeholder="用户姓名" class="element"></el-input>
      </el-form-item>
      <el-form-item label="所属会员类型">
        <el-select v-model="visible.props.form.discountId" placeholder="请选择" class="element">
          <el-option
            v-for="item in visible.props.options"
            :key="item.discountId"
            :label="item.name"
            :value="item.discountId">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="联系电话">
        <el-input type="text" v-model="visible.props.form.memberPhone" placeholder="用户联系电话" class="element"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  export default {
    name: 'memberForm',
    props : ['visible'],
    data(){
      return {
      }
    },
    methods : {

    }
  }
</script>

<style scoped>
  .element{
    width:300px;
  }
</style>
