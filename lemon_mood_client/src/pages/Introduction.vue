<template>
  <el-container>
    <el-header>
      <el-image class="lemon" :src="require('../assets/ic_lemon.png')" fit="scale-down" />
      <span class="title">Lemon</span>
    </el-header>
    <el-main>
      <div class="text_content">
        <span class="text_1">Track anything and discover how it affects your health</span>
        <span class="text_2">Get the full picture and find what works best for You.</span>
      </div>
      <el-image class="chart" :src="require('../assets/bg_chart.png')" fit="scale-down" />
    </el-main>
    <el-footer>
      <el-button class="btn" type="primary" @click="$router.push({path:'/login'})">Get Started<i class="el-icon-caret-right"></i></el-button>
    </el-footer>
  </el-container>
</template>

<script>
</script>

<style scoped>
  .el-container {
    margin: 0px 50px 0px 50px;
  }

  .el-header {
    min-width: 1800px;
    margin: 0 auto 0 auto;
    height: 200px !important;
    display: flex;
    align-items: center;
  }

  .el-main {
    min-width: 1800px;
    min-height: 500px;
    margin: 0 auto 0 auto;
    display: flex;
  }

  .el-footer {
    min-width: 1800px;
    margin: 0 auto 0 auto;
    height: 200px !important;
    display: flex;
    flex-direction: row-reverse;
    justify-content: space-between;
  }

  .lemon {
    width: 80px;
    height: 80px;
  }

  .title {
    font-weight: bold;
    color: black;
    margin-left: 30px;
    font-size: 50px;
    height: 80px;
    line-height: 100px;
  }

  .text_content {
    margin-left: 110px;
    display: flex;
    flex-direction: column;
  }

  .text_1 {
    font-weight: bold;
    width: 800px;
    color: black;
    font-size: 85px;
    text-align: start;
  }

  .text_2 {
    width: 700px;
    color: black;
    font-size: 42px;
    margin-top: 50px;
    text-align: start;
  }

  .chart {
    margin-left: 100px;
    width: 600px;
    height: 400px;
  }

  .btn {
    margin-bottom: auto;
    margin-right: 150px;
    font-size: 28px;
  }
</style>
