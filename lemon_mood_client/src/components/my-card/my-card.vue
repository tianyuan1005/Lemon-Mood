<template>
  <div class="card_main">
    <div class="card_title">
      {{title}}
    </div>
    <div class="card_content">
      <slot></slot>
    </div>
  </div>

</template>

<script>

  export default {
    name: 'MyCard',
    props: {
      title: String
    },
    data() {
      return {};
    },
    created() {
    },
    methods: {},

  };
</script>
<style scoped>
  .card_main {
    border: 1px solid #E1E0E0;
    background-color: #FFFFFF;
  }

  .card_title {
    height: 50px;
    background-color: #fef9ef;
    text-align: center;
    font-size: 18px;
    line-height: 50px;
  }

  .card_content {
    min-height: 100px;
  }
</style>
