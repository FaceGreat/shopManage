<template>
  <div class="title">
    <div class="login-title">{{ message }}</div>
    <div class="dark_banner_wrap"></div>
  </div>
</template>

<script>
  export default{
    name : 'title',
    props : ['message']
  }
</script>
<style scoped>
  .login-title{
    width: 100%;
    margin: 10px 0 0 -58px;
    padding: 18px 10px 18px 60px;
    background: #27A9E3;
    position: relative;
    color: #fff;
    font-size: 16px;
  }
  .dark_banner_wrap {
    background: url(../../assets/aiwrap.png);
    width: 18px;
    height: 10px;
    margin: 0 0 20px -58px;
    position: relative;
  }
</style>
