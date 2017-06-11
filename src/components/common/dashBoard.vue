<template>
    <div class="DashBoard">
        <h2 class="title">
          <span><i class="fa fa-handshake-o"></i></span>
          <span style="color:#4382f2;">{{ msg }}</span>
          <span><i class="fa fa-handshake-o"></i></span>
          <img src="../../assets/timg.jpg" style="width: 70%;margin: 20px 20px 0 100px;">
        </h2>

    </div>
</template>

<script>
	export default {
		name: 'DashBoard',

    data() {
			return {
				msg: '欢迎使用百加商品管理及收银一体化系统',
      }
    },
	}
</script>

<style scoped>
  .title{
    text-align: center;
  }
</style>
