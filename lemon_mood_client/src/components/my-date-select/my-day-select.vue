<template>
  <div class="content">
    <MB v-if="button" icon="el-icon-arrow-left" circle @click="last"/>
    <span class="my_date">{{my_date_str}}</span>
    <MB v-if="button" icon="el-icon-arrow-right" circle @click="next"/>
  </div>

</template>

<script>
  import fecha from 'element-ui/src/utils/date';
  import MB from '../../components/my-button/my-button'

  export default {
    name: 'MyDaySelect',
    components: {
      MB,
    },
    model: {
      prop: 'modelVal',//指向props的参数名
      event: 'change'//事件名称
    },
    props:{
      modelVal:null,
      button:Boolean,
    },
    data() {
      return {
        now: null,
        my_date: null,
        my_date_str: '',
      };
    },
    created() {
      this.now = new Date();
      this.my_date = this.now;
      this.my_date_str = this.myformat(this.my_date);
    },
    watch: {
      my_date(value) {
        this.my_date_str = this.myformat(value);
        this.$emit('change',value);
      },
    },
    methods: {
      myformat(date) {
        return fecha.format(date, 'dddd, MMMM d, yyyy');
      },
      next() {
        let now = new Date(this.now.getTime());
        now.setTime(this.my_date.getTime() + 3600 * 1000 * 24);
        if (now.getTime() > this.now.getTime()) {
          this.$message({
            showClose: true,
            message: 'Date exceeds the limit',
            type: 'warning'
          });
          return;
        }
        this.my_date = now;
      },
      last() {
        let now = new Date(this.now.getTime());
        now.setTime(this.my_date.getTime() - 3600 * 1000 * 24);
        this.my_date = now;
      }
    },

  };
</script>
<style scoped>
  .content {
    display: flex;
    flex-direction: row;
    justify-content: center;
  }

  .my_date {
    text-align: center;
    min-width: 240px;
    line-height: 40px;
    height: 40px;
    padding-left: 20px;
    padding-right: 20px;
    font-weight: bold;
  }

</style>
