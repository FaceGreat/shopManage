<template>
    <div>
      <v-bar-title vBarTitle="盘点单"></v-bar-title>
      <inventory-form></inventory-form>
    </div>
</template>

<script>
  import vBarTitle from 'components/common/barTitle'
  import inventoryForm from 'components/inventory/inventoryForm'

  import bus from 'components/common/js/bus'
	export default {
		name: '',
    data() {
			return  {
      }
    },
    watch:{
      '$route'(val){
        if (val) {
          //初始化指定数据
         bus.$emit('init-inventory-form');
        }
      }
    },
    components : {
      vBarTitle, inventoryForm
    }
	}
</script>

<style scoped>
</style>
