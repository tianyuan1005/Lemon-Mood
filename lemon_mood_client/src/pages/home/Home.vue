<template>
  <el-container class="el-container" v-loading.fullscreen.lock="(loading_0||loading_1||loading_2||loading_3)">


    <MDS class="mds"/>


    <div class="top_layout">
      <MC v-if="!lemon_today" class="top_layout_item" :title="'Mood and Activities'">
        <div class="log_no_top">
          <el-image class="log_no_img" :src="require('../../assets/ic_lemon.png')" fit="scale-down"/>
          <div class="log_no_txt">You haven't logged your mood today yet!</div>
        </div>
        <div class="log_no_bottom">
          <el-button type="success" class="log_no_btn" @click="$emit('father_changeMenu','/main/log')">log now<i class="el-icon-arrow-right"></i></el-button>
        </div>
      </MC>
      <MC v-if="lemon_today" class="top_layout_item" :title="'Mood and Activities'">
        <div class="log_container">
          <div class="log_block">
            <el-image class="log_mood" :src="lemon_today.type_icon_str"/>
            <div class="log_mood_str">{{lemon_today.type_name}}</div>
            <div class="log_create_at_str">{{lemon_today.create_at}}</div>
          </div>
          <div class="log_block">
            <div class="log_div_doing" v-for="doing in lemon_today.doing_list">
              <el-image class="log_doing_img" :src="doing.icon"/>
              <div class="log_doing_str">{{doing.name}}</div>
            </div>
          </div>
        </div>
      </MC>
      <MC class="top_layout_item" :title="'Weather'">
        <div class="weather">
          <div class="w_01" v-if="weather">
            <el-image class="w_weather_img" :src="weather.weather_img" fit="scale-down">
              <div slot="error">
              </div>
            </el-image>
            <div class="w_weather">
              {{weather.weather}}
            </div>
            <div class="w_city">
              {{weather.city_str}}
            </div>
          </div>
          <div class="w_02">
            {{weather.temp_str}}
          </div>
        </div>
      </MC>
    </div>


    <MC class="block" :title="'Sleep Pattern'">
      <ve-histogram class="chart_histogram" :extend="histogramExtend" :colors="['#5ab1ef']" :data="histogramData" :tooltip="{}" :legend-visible="false"/>
    </MC>


    <MC class="block" :title="'Mood Chart'">
      <ve-line class="chart_line" :extend="lineExtend" :data="lineData" :colors="['#bff55e']" :tooltip="{}" :legend-visible="false"/>
      <div class="chart_z">
        <el-image class="chart_z_img" :src="require('../../assets/ic_mood_excited_highlight.png')" fit="scale-down"/>
        <el-image class="chart_z_img" :src="require('../../assets/ic_mood_good_highlight.png')" fit="scale-down"/>
        <el-image class="chart_z_img" :src="require('../../assets/ic_mood_meh_highlight.png')" fit="scale-down"/>
        <el-image class="chart_z_img" :src="require('../../assets/ic_mood_bad_highlight.png')" fit="scale-down"/>
        <el-image class="chart_z_img" :src="require('../../assets/ic_mood_awful_highlight.png')" fit="scale-down"/>
      </div>
    </MC>


    <MC class="block " :title="'Often Together'">
      <div class="often_content">
        <div class="often_select">
          <MS v-model="often_value" placeholder="Select Mood">
            <el-option
              v-for="item in often_options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </MS>
          <el-image v-if="often_value" class="often_select_img" :src="require('../../assets/'+mood_map.get(often_value).icon+'_highlight.png')"/>
        </div>
        <div>
          You often do this:
        </div>
        <div class="often_block" v-if="mood_doing_map.get(often_value)">
          <div class="often_div_doing" v-for="doing in mood_doing_map.get(often_value)">
            <el-badge :value="doing.num" type="primary">
              <el-image class="often_doing_img" :src="doing.icon"/>
            </el-badge>
            <div class="often_doing_str">{{doing.name}}</div>
          </div>
        </div>
      </div>
    </MC>


  </el-container>
</template>

<script>
  import fecha from 'element-ui/src/utils/date';
  import MDS from '../../components/my-date-select/my-day-select'
  import MC from '../../components/my-card/my-card'
  import VeHistogram from 'v-charts/lib/histogram.common'
  import VeLine from 'v-charts/lib/line.common'
  import MS from '../../components/my-select/select'

  export default {
    components: {
      MDS,
      MC,
      VeHistogram,
      VeLine,
      MS,
    },
    data() {
      return {
        loading_0: false,
        loading_1: false,
        loading_2: false,
        loading_3: false,
        lemon_today: null,
        doing_map: new Map(),
        histogramExtend: {
          series: {
            barMaxWidth: 10,
          }
        },
        histogramData: {
          columns: ['ddate_str', 'sleep'],
          rows: []
        },
        lineExtend: {
          series: {
            smooth: false,
            symbol: 'none'
          },
          yAxis: {
            max:5,
            min:0,
            axisLabel: {
              show: false,
              textStyle: {
                color: "#aaa"
              }
            },
          },
        },
        lineData: {
          columns: ['ddate_str', 'mood_int'],
          inverse: true,
          rows: []
        },
        lemon_list: [],
        often_options: [],
        often_value: null,
        mood_map: new Map(),
        mood_doing_map: new Map(),
        weather: {},
      };
    },
    created() {
      this.showLocationTips();
      this.setupMoodList();
    },
    methods: {
      setupMoodList() {
        this.loading_0 = true;
        this.$post(this, this.$api.biz_type_list(), {category: 'mood'}).then(data => {
          if (data && data.status === 200) {
            this.often_options = [];
            this.mood_map = new Map();
            for (let i in data.datas) {
              let d = data.datas[i];
              d.value = d.code;
              d.label = d.name;
              this.often_options.push(d);
              this.mood_map.set(d.value, d);
            }
          } else {
            this.$message({
              showClose: true,
              message: data.message,
              type: 'error'
            });
          }
          this.loading_0 = false;
          this.setupDoingList();
        });
      },
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
          this.getTodayLemon();
          this.getLemonList();
        });
      },
      getTodayLemon() {
        this.loading_2 = true;
        let user = JSON.parse(sessionStorage.getItem('user'));
        let params = {};
        params.ddate = new Date();
        params.user_id = user.id;
        this.$post(this, this.$api.biz_lemon_list(), params).then(data => {
          if (data && data.status === 200) {
            if (data.datas.length) {
              this.lemon_today = data.datas[0];
              if (this.lemon_today) {
                this.lemon_today.ddate_str = fecha.format(new Date(this.lemon_today.ddate), 'dddd, MMMM d, yyyy');
                this.lemon_today.type_icon_str = require('../../assets/' + this.lemon_today.type_icon + '_highlight.png');
                let doing_list_code = this.lemon_today.activity.split(',');
                this.lemon_today.doing_list = [];
                for (let i in doing_list_code) {
                  let code = doing_list_code[i];
                  let doing = {name: this.doing_map.get(code).name, icon: require('../../assets/' + this.doing_map.get(code).icon + '_highlight.png')};
                  this.lemon_today.doing_list.push(doing);
                }
              } else {
                this.lemon_today = null;
              }
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
      getLemonList() {
        this.loading_3 = true;
        let user = JSON.parse(sessionStorage.getItem('user'));
        this.$post(this, this.$api.biz_lemon_list(), {user_id: user.id}).then(data => {
          if (data && data.status === 200) {
            this.lemon_list = [];
            this.lemon_list.push(data.datas);
            let datas_r = null;
            if (data.datas.length > 30) {
              datas_r = (data.datas.reverse()).slice(data.datas.length - 30, data.datas.length);
            } else {
              datas_r = data.datas.reverse();
            }
            let list = [];
            for (let i in datas_r) {
              let d = datas_r[i];
              d.mood_int = (6-parseInt(d.mood.substr(d.mood.length - 1)));
              d.ddate_str = d.ddate.substr(5);
              list.push(d);
            }
            this.histogramData.rows = list;
            this.lineData.rows = list;

            let tempMap = new Map();
            for (let i in data.datas) {//1.分类
              let d = data.datas[i];
              let mood = d.mood;
              if (tempMap.has(mood)) {
                let doing_arr = tempMap.get(mood);
                doing_arr.push(d.activity);
              } else {
                let doing_arr = [];
                tempMap.set(mood, doing_arr);
                doing_arr.push(d.activity);
              }
            }

            this.mood_doing_map = new Map();
            for (let item of tempMap) {//2.分组
              let doing_arr = item[1].toString().split(',');
              let tempMap1 = new Map();
              for (let doing of doing_arr) {
                if (tempMap1.has(doing)) {
                  let count = tempMap1.get(doing);
                  count = count + 1;
                  tempMap1.set(doing, count);
                } else {
                  tempMap1.set(doing, 1);
                }
              }
              //3.排序
              let list = [];
              for (let item1 of tempMap1) {
                let doing = {
                  key: item1[0],
                  num: item1[1],
                  name: this.doing_map.get(item1[0]).name,
                  icon: require('../../assets/' + this.doing_map.get(item1[0]).icon + '_highlight.png')
                };
                list.push(doing);
              }
              list.sort(function (a, b) {
                return b.num - a.num
              });
              if (list.length > 3) {
                this.mood_doing_map.set(item[0], list.slice(0, 3));
              } else {
                this.mood_doing_map.set(item[0], list);
              }
            }


          } else {
            this.$message({
              showClose: true,
              duration: 5000,
              message: data.message,
              type: 'error'
            });
          }
          this.loading_3 = false;
        });
      },
      setupWeather(location) {
        this.$post(this, this.$api.sys_weather(), {city:location}).then(data => {
          if (data && data.status === 200) {
            this.weather = data.datas;
            this.weather.temp_str = parseInt(this.weather.temp) + '℃';
            this.weather.city_str = this.weather.city+','+this.weather.country;
          } else {
            this.$message({
              showClose: true,
              message: data.message,
              type: 'error'
            });
          }
        });
      },
      showLocationTips() {
        let user = JSON.parse(sessionStorage.getItem('user'));
        if (!user.location) {
          this.$alert("You can set the target city to show the weather conditions in your area.", 'Weather Tips', {
            confirmButtonText: 'Go to set now!',
            callback: action => {
              if (action === 'confirm')
                this.$emit('father_changeMenu', '/main/setting')
            }
          });
        } else {
          this.setupWeather(user.location);
        }
      }
    }
  }
</script>

<style src="./Home.css" scoped/>

