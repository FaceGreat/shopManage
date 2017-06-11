<template>
  <div>
    <div class="barTitle">
      <div class="pt-left"><h3>{{ vBarTitle }}</h3></div>
      <div class="pt-right">
        <span class="pt-Home"><router-link to="/home">主页</router-link></span>
        <span class="pt-line"> / </span>
        <span class="pt-page">{{ vBarTitle }}</span>
      </div>
    </div>
    <hr class="pt-hr" />
  </div>
</template>

<script>
	export default {
		name: 'barTitle',
    props :[ 'vBarTitle']
	}
</script>

<style scoped>
  .barTitle{
    clear:both;
    height:55px;

  }
  .pt-left{
    float:left;
  }
  .pt-right{
    float:right;
  }
  .pt-Home{
    font-size:18px;
  }
  .pt-line{
    color:#ccc;
  }
  .pt-hr{
    margin-top: -18px;
    margin-bottom: 24px;
  }
  a{
    color:#209e91;
  }
</style>
