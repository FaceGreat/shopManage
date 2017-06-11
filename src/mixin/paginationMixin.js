/**
 * Created by Administrator on 2017/6/2.
 */

let paginationModule = {
  data() {
    return {
      pageModule : {},
      callback : '',
    }
  },
  methods : {
    //初始化参数
    initPageModule () {
      this.pageModule = {
        page : 5 ,//每页条数
        currentPage : 1, //当前页
        total :0, //总条数　
        currentPageCallback : this.updateCurrentPage//当前页改变时的回调函数
      }
    },
    //更新分页参数
    updatePageModule (props) {
      this.pageModule.page =  props.page || 5;//每页条数
      this.pageModule.total = props.total || 0; //总条数　
      this.callback = props.callback || '';//回调函数
    },
    //更新当前页
    updateCurrentPage(currentPage) {
      this.pageModule.currentPage = currentPage;
      this.callback();
    }
  }
};


module.exports = paginationModule;
