<template>
    <div class="addPurchaseList">
      <v-bar-title vBarTitle="进货单"></v-bar-title>
      <purchase-form></purchase-form>
    </div>
</template>

<script>
  import vBarTitle from 'components/common/barTitle'
  import purchaseForm from 'components/purchase/purchaseForm'
  import bus from 'components/common/js/bus'
	export default {
		name: 'addPurchaseList',
    data () {
			return {
      }
    },
    watch:{
      '$route'(val){
        if (val) {
          //初始化指定数据
          bus.$emit('init-purchase-form');
        }
      }
    },
    components : {
      vBarTitle, purchaseForm
    }
	}
</script>

<style scoped>
</style>
