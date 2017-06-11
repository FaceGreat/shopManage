/**
 * Created by Administrator on 2017/5/17.
 */


let memberDiscount = {
  methods : {
    //初始化会员对象
    initMember () {
      return this.member = {
        memberId : '',
        name : '',
        memberPhone : '',
        discountId : '',
        consumeTimes : 0,
        consumeCost : 0,
        Status : 1,
        regDate : ''
      }
    },
    //获取所有会员类型
    getAllMemberDiscount () {
      this.$http.get('/api/user/getAllMemberDiscount', {}).then((req) => {
        if(req.ok) {
          let result = req.body.result;
          if(result.code) {
            this.options = result.result;
          }else{
            this.$message.error(result.msg);
          }
        }
      },()=>{
        this.$message.error('连接服务器失败');
      });
    },
    //打开添加新会员模态框
    openAddNewMember() {
      this.updateVisible({
        state : true,
        title : '会员信息',
        callback: this.addMemberManage, //确定选择的回调函数
        name : 'memberForm',//子组件名
        props: {
          form : this.member,//会员信息
          options : this.options,//会员类型
          disable : false,//是否禁用
          formData : this.formData,//模糊搜索的数据
        }//父组件传递子组件的指定参数
      });
    },
    //修改会员信息
    openEditMember(){
      this.updateVisible({
        state : true,
        title : '会员信息',
        callback: this.updateMember, //确定选择的回调函数
        name : 'memberForm',//子组件名
        props: {
          form : this.member,
          options : this.options,
          disable : true,
        }//父组件传递子组件的指定参数
      });
    },
    //选择或填写会员禁用原因
    openUpdateMemberStatus() {
      this.updateVisible({
        state : true,
        title : '禁用会员状态原因',
        callback: this.updateMemberStatus, //确定选择的回调函数
        name : 'toggleMemberStatus',//子组件名
        props: {
          form : this.member,
          checkEdList : []
        }//父组件传递子组件的指定参数
      });

    },
    //添加一个会员信息
    addMember() {
      this.$http.post('/api/user/saveMember', this.member, {}).then((req) => {
        if(req.ok) {
          let result = req.body.result;
          if(result.code){
            this.$message.success(result.msg);
            this.initMember();
            this.getMemberByPage();
          }else{
            this.$message.error(result.msg);
          }
        }
      }, ()=>{
        this.$message.error('连接服务器失败');
      })
    }
  }
};

module.exports = memberDiscount;
