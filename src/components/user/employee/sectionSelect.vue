<template>
    <div>
      <label>选择指定部门查找：</label>
      <el-select v-model="selectData" clearable placeholder="请选择" >
        <el-option
          v-for="item in options"
          :key="item.roleId"
          :label="item.name"
          :value="item.roleId">
        </el-option>
      </el-select>
    </div>
</template>

<script>
	export default {
		name: '',
    props : ['selectModel'],
    data(){
			this.findAllSection();
			return {
        options : [],
        selectData : this.selectData
      }
    },
    watch : {
      //监听选中的值
      selectData(val) {
        this.$emit("on-result-change",val);
      }
    },
    methods: {
      //获取所有的类型
      findAllSection () {
        this.$http.get('/api/user/role/getRoleBySelect', {}).then((req) => {
          if (req.ok) {
            let result = req.body.result;
            if (result.code) {
              this.options = result.result;
            } else {
              this.$message.error(reusult.msg);
            }
          }
        },() => {
            this.$message.error('连接服务器失败');
        })
      }
    }
	}
</script>

<style scoped>
</style>
