/**
 * Created by Administrator on 2017/5/18.
 */


let commonMixin = {
  methods : {
    //初始化模态框参数
    initVisible(){
      this.visible = {
        state: false, //模态框显示状态
        title: '', //模态框标题
        name: '',//子组件名
        callback : ()=>{}, //确定选择的回调函数
        props: {} //父组件传递子组件的指定参数
      }
    },
    //更新模态框参数信息
    updateVisible(props){
      this.visible = {
        state: props.state, //模态框显示状态
        title: props.title, //模态框标题
        callback: props.callback, //确定选择的回调函数
        name: props.name,//子组件名
        props: props.props//父组件传递子组件的指定参数
      }
    },
    //关闭模态框
    closeVisible() {
      this.visible.state = false;
    }
  }
};


module.exports = commonMixin;
