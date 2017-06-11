/**
 * Created by Administrator on 2017/5/18.
 */

let commodity = {
  methods : {
    openFindCommodity(type){
      if(type === 1){
        this.formData = [];
      }
      this.updateVisible({
        state : true,
        title : '商品信息',
        callback: this.addCommodityToBill, //确定选择的回调函数
        name : 'commodityTable',//子组件名
        props: {
          data : {
            multipleSelectedMaterials : [],//选中的值
            formData : this.formData,//模糊搜索的数据
            commodityKey :this.commodityKey,//
          }
        }//父组件传递子组件的指定参数
      });
    },
    //添加商品信息
    addCommodityToBill() {
      let selectedData = this.visible.props.data.multipleSelectedMaterials;
      for (let pIndex in selectedData) {
        let repeat = false;
        for(let tIndex in this.tableData) {
          if(this.tableData[tIndex].commodityId === selectedData[pIndex].commodityId) {
            this.tableData[tIndex].num++;
            repeat = true;
            break;
          }
        }
        if(!repeat){
          this.tableData.push(selectedData[pIndex]);
        }
      }
      //this.tableData = this.visible.props.data.multipleSelectedMaterials;
      this.closeVisible();
    },
    clearSpecifyElement() {
      this.multipleSelectedMaterialsByChecked.forEach(row => {
        //去除表格显示的数据
        this.tableData.forEach((item, index) => {
          if(item.commodityId === row.commodityId) {
            this.tableData.splice(index, 1);
          }
          return;
        });
      });
    }
  }
};

module.exports = commodity;
