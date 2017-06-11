<template>
  <el-table
    :data="tableData"
    border
    stripe
    fit
    style="width: 100%">
    <el-table-column type="expand">
      <template scope="props">
        <el-form label-position="left" inline class="demo-table-expand">
          <el-form-item label="商品编号">
            <span>{{ props.row.commodityId }}</span>
          </el-form-item>
          <el-form-item label="商品名称">
            <span>{{ props.row.name }}</span>
          </el-form-item>
          <el-form-item label="商品条形码">
            <span>{{ props.row.barcode }}</span>
          </el-form-item>
          <el-form-item label="商品供货商">
            <span>{{ props.row.provideName }}</span>
          </el-form-item>
          <el-form-item label="商品规格">
            <span>{{ props.row.format }}</span>
          </el-form-item>
          <el-form-item label="商品分类">
            <span>{{ props.row.categoryName }}</span>
          </el-form-item>
          <el-form-item label="商品单位">
            <span>{{ props.row.unitName }}</span>
          </el-form-item>
          <el-form-item label="商品零售价">
            <span>{{ props.row.retailPrice }}</span>
          </el-form-item>
          <el-form-item label="商品成本价">
            <span>{{ props.row.costPrice }}</span>
          </el-form-item>
          <el-form-item label="商品库存上限">
            <span>{{ props.row.quantityUpperLimit }}</span>
          </el-form-item>
          <el-form-item label="商品库存下限">
            <span>{{ props.row.quantityLowerLimit }}</span>
          </el-form-item>
          <el-form-item label="商品描述">
            <span>{{ props.row.remark }}</span>
          </el-form-item>
        </el-form>
      </template>
    </el-table-column>
    <el-table-column
      prop="commodityId"
      label="商品编号"
      width="104">
    </el-table-column>
    <el-table-column
      prop="name"
      label="名称"
      width="168">
    </el-table-column>
    <el-table-column
      prop="format"
      label="商品规格"
      width="100">
    </el-table-column>
    <el-table-column
      prop="retailPrice"
      label="零售价"
      width="80">
    </el-table-column>
    <el-table-column
      prop="factNum"
      label="库存数量"
      width="100">
    </el-table-column>
    <el-table-column
      label="库存金额"
      width="100"
      :formatter="totalPrice">
    </el-table-column>
    <el-table-column
      prop="Status"
      label="状态"
      width="70"
      :formatter="statusFormat">
    </el-table-column>
    <el-table-column
      label="操作"
      inline-template
      width="224">
      <div>
        <el-button type="info" size="small" @click="editMaterial(row)">修改</el-button>
        <el-button  size="small" @click="updateMaterialStatus(row.Status, row.commodityId)">切换状态</el-button>
        <el-button type="danger" size="small" @click="deleteMaterial(row.name, row.commodityId)">删除</el-button>
      </div>
    </el-table-column>
  </el-table>
</template>

<script>
  import bus from 'components/common/js/bus';
	export default {
		name: '',
    props : ['tableData'],
    data () {
      return {
      }
    },
    methods : {
      //状态格式化
      statusFormat (row, column) {
        return row[column.property] === 1 ? '可用' : '禁用';
      },
      //计算库存成本
      totalPrice(row, column) {
				return row.costPrice * row.factNum;
      },
      //修改商品资料信息
      editMaterial(row) {
        this.$router.push({name : 'updateMaterialMessage', params: { material: Object.assign({}, row)}})
      },
      //更新商品状态
      updateMaterialStatus(Status,materialId) {
				this.$http.put('/api/commodity/updateCommodityStatusById', {Status: Status, commodityId : materialId}, {}).then((req) =>{
					if(req.ok) {
            let result = req.body.result;
            if(result.code) {
            	this.$message.success(result.msg);
            	//更新表格
              bus.$emit('findMaterialByPage');
            	//this.findMaterialByPage(0);
            }else{
            	this.$message.error(result.msg);
            }
          }else{
						this.$message.error('连接服务器失败');
          }
        });
      },
      //删除指定id商品资料
      deleteMaterial(name, materialId) {
        const self = this;
        this.$msgbox({
          title: '删除商品资料信息',
          message: '确定删除【 ' + name + ' 】商品',
          showCancelButton: true,
          confirmButtonText: '删除',
          cancelButtonText: '取消',
          confirmButtonClass :'el-button--danger',
          beforeClose: (action, instance, done) => {
            if (action === 'confirm') {
              instance.confirmButtonLoading = true;
              instance.confirmButtonText = '正在删除...';
              self.$http.put('/api/commodity/deleteCommodityById', {commodityId : materialId},{}).then((req) => {
                if(req.ok){
                  let result = req.body.result;
                  if(result.code) {
                    self.$message.success(result.msg);
                  }else{
                    self.$message.error(result.msg);
                  }
                }else{
                  self.$message.error('连接服务器失败');
                }
                done();
                instance.confirmButtonLoading = false;
                //更新
                bus.$emit('findMaterialByPage');
                //self.findMaterialByPage();
              })
            } else {
              instance.confirmButtonLoading = false;
              done();
            }
          }
        });
      }
    }
	}
</script>

<style scoped>
</style>
