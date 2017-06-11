/**
 * Created by Administrator on 2017/5/20.
 */

let deleteModule = {
  methods : {
      openMsgbox (props) {
        this.$msgbox({
          title: props.title || '删除',
          message: props.message  ||  '确定删除',
          showCancelButton: true,
          confirmButtonText: '删除',
          cancelButtonText: '取消',
          confirmButtonClass :'el-button--danger',
          beforeClose: (action, instance, done) => {
            if (action === 'confirm') {
              instance.confirmButtonLoading = true;
              instance.confirmButtonText = '正在删除...';
              props.callback();
              done();
              instance.confirmButtonLoading = false;
            } else {
              instance.confirmButtonLoading = false;
              done();
            }
          }
        });
      }
  }
};

module.exports = deleteModule;
