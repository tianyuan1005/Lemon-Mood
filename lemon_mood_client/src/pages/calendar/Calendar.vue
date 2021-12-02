<template>
  <el-container class="el-container" v-loading.fullscreen.lock="(loading_1||loading_2)">


    <MMS :button="true" v-model="ddate" class="mms"/>


    <div class="calendar_title">
      <div class="title" v-for="t in cal_titles">
        <div class="week">
          {{t}}
        </div>
      </div>
    </div>
    <div class="calendar">
      <div class="day_num" v-for="i in cal_nums" :key="i">
        <div class="day_inside">
          <div class="day">
            {{getDayText(i)}}
          </div>
          <div v-if="getLemon(i)">
            <el-image class="mood" :src="require('../../assets/'+getLemon(i)+'_highlight.png')"/>
          </div>
        </div>
        <MBT class="bt_day" :disabled="!getDayText(i)" @click="toDetail(i)"/>
      </div>
    </div>


    <el-dialog
      width="440px"
      top="100px"
      :visible.sync="dialogVisible"
      :before-close="handleClose"
      :title="lemon_select.ddate_str"
    >
      <div class="dia_container">
        <div class="dia_block">
          <el-image class="dia_mood" :src="lemon_select.type_icon_str"/>
          <div class="dia_mood_str">{{lemon_select.type_name}}</div>
          <div class="dia_create_at_str">{{lemon_select.create_at}}</div>
        </div>
        <div class="dia_block">
          <div class="dia_sleep_str">{{lemon_select.sleep}} hours of sleep last night!</div>
        </div>
        <div class="dia_block">
          <div class="dia_div_doing" v-for="doing in lemon_select.doing_list">
            <el-image class="dia_doing_img" :src="doing.icon"/>
            <div class="dia_doing_str">{{doing.name}}</div>
          </div>
        </div>
        <div class="dia_block">
          <div class="dia_note_str">{{lemon_select.note}}</div>
        </div>
        <div class="dia_block" v-if="lemon_select.photo">
          <el-image class="dia_photo" :src="lemon_select.photo_icon" fit="scale-down"/>
        </div>
      </div>
    </el-dialog>


  </el-container>
</template>

<script>
  import fecha from 'element-ui/src/utils/date';
  import MMS from '../../components/my-date-select/my-month-select'
  import MBT from '../../components/my-button/my-button'

  const cal_titles = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const cal_nums = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41];

  export default {
    components: {
      MMS,
      MBT
    },
    data() {
      return {
        dialogVisible:false,
        loading_1: false,
        loading_2: false,
        ddate: null,//params
        cal_titles: cal_titles,
        cal_nums: cal_nums,
        cal_days: [{index: 0, date: ''}],
        cal_start: 0,
        lemon_map: new Map(),
        doing_map: new Map(),
        dia_vcode: false,
        lemon_select: {}
      };
    },
    created() {
      this.setupDoingList();
      this.getLemonList();
    },
    methods: {
      setupDoingList() {
        this.loading_1 = true;
        this.$post(this, this.$api.biz_type_list(), {category: 'doing'}).then(data => {
          if (data && data.status === 200) {
            this.doing_map = new Map();
            for (let i in  data.datas) {
              let t = data.datas[i];
              this.doing_map.set(t.code, t);
            }
          } else {
            this.$message({
              showClose: true,
              message: data.message,
              type: 'error'
            });
          }
          this.loading_1 = false;
        });
      },
      getDayText(i) {
        let day = this.cal_days[i - this.cal_start];
        return day && day.index;
      },
      getLemon(i) {
        let day = this.cal_days[i - this.cal_start];
        let lemon = day && this.lemon_map.get(day.date);
        let icon = lemon && lemon.type_icon;
        return icon;
      },
      getLemonList() {
        this.loading_2 = true;
        let user = JSON.parse(sessionStorage.getItem('user'));
        this.$post(this, this.$api.biz_lemon_list(), {user_id: user.id}).then(data => {

          if (data && data.status === 200) {
            this.lemon_map = new Map();
            for (let i in  data.datas) {
              let d = data.datas[i];
              this.lemon_map.set(d.ddate, d);
            }
          } else {
            this.$message({
              showClose: true,
              duration: 5000,
              message: data.message,
              type: 'error'
            });
          }
          this.loading_2 = false;
        });
      },
      toDetail(i) {
        let day = this.cal_days[i - this.cal_start];
        this.lemon_select = day && this.lemon_map.get(day.date);
        if (this.lemon_select) {
          this.lemon_select.ddate_str = fecha.format(new Date(this.lemon_select.ddate), 'dddd, MMMM d, yyyy');
          this.lemon_select.type_icon_str = require('../../assets/' + this.lemon_select.type_icon + '_highlight.png');
          let doing_list_code = this.lemon_select.activity.split(',');
          this.lemon_select.doing_list = [];
          for (let i in doing_list_code) {
            let code = doing_list_code[i];
            let doing = {name: this.doing_map.get(code).name, icon: require('../../assets/' + this.doing_map.get(code).icon + '_highlight.png')};
            this.lemon_select.doing_list.push(doing);
          }
          this.lemon_select.photo_icon = this.$api.host_server() + this.lemon_select.photo
          this.dialogVisible = true;
        } else {
          this.lemon_select = {};
        }
      },
      handleClose(done) {
        done();
      }
    },
    watch: {
      ddate(date) {
        let dd = new Date(date);
        dd.setDate(1);
        this.cal_start = dd.getDay();

        let curDate = new Date(date);
        let curMonth = curDate.getMonth();
        curDate.setMonth(curMonth + 1);
        curDate.setDate(0);

        let days = curDate.getDate();

        this.cal_days = [];
        for (let k = 1; k <= days; k++) {
          dd.setDate(k);
          let day = {index: k, date: (fecha.format(dd, 'yyyy-MM-dd'))};
          this.cal_days.push(day);
        }

      }
    },
  }
</script>

<style src="./Calendar.css" scoped/>
