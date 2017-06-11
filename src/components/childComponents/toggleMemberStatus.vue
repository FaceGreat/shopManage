<template>
    <div class="toggleMemberStatus">
      <el-input v-model="visible.props.form.remark"></el-input>
      <span v-show="show" class="label-span">快捷设置：</span>
      <el-checkbox-group v-model="visible.props.checkEdList">
        <el-checkbox :key="index" v-for="(item,index) in checkList" :label="item"></el-checkbox>
      </el-checkbox-group>
    </div>
</template>

<script>
  import bus from 'components/common/js/bus'
	export default {
		name: 'toggleMemberStatus',
    props : ['visible'],
    data() {
			return {
        show : false,
        checkList : [],
      }
    },
    created() {
      bus.$on('update-remark', ()=>{
        this.getDisabledRemark();
      });
      this.getDisabledRemark();
    },
    methods : {
			getDisabledRemark() {
        this.$http.get('/api/user/getMemberRemark', {}).then((req) => {
          if(req.ok) {
          	let result = req.body.result;
          	if(result.code) {
              let len = result.result.length;
              let str = '';
          		if( len !== 0) {
          			this.show = true;
          			for(let i = 0; i <len;i++) {
          				if(i === 0){
                    str += result.result[i].remark;
                  }else{
          					str += ',' + result.result[i].remark;
                  }
                  this.checkList = Array.from(new Set(str.split(',')));
                }
              }
            }else{
          		this.$message.error(result.msg);
            }
          }
        }, ()=> {
        	this.$message.error('连接服务器失败');
        })
      }
    }
	}
</script>

<style scoped>
  .label-span{
    margin:  20px 0 20px 0;
    display: block;
    font-size: 16px;
  }
</style>
