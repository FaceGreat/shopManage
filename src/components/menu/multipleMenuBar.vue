<template>
    <el-submenu :index="menuItem.url">
      <template slot="title">
        <span class="sb-icon"><i :class="menuItem.icon"></i></span>
        <span class="sb-cn">&nbsp;{{ menuItem.name }}</span>
      </template>
      <div :key="item.menuId" v-for="item in menuItem.children">
        <single-menu-bar :menuItem="item" v-if="item.children.length === 0"></single-menu-bar>
        <items :menuItem="item" v-else></items>
      </div>
    </el-submenu>
</template>

<script>
  import singleMenuBar from 'components/menu/singleMenuBer.vue'
	export default {
  	name : 'items',
		props : ['menuItem'],
    data(){
  		return {
      }
    },
    components :{
      singleMenuBar
    },
    methods : {

    }
	}
</script>

<style scoped>
</style>
