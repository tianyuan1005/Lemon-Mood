<template>
  <el-container class="el-container" v-loading.fullscreen.lock="(loading||loading_1||loading_2)">


    <MDS :button="true" v-model="ddate" class="mds"/>


    <div class="block">
      <span class="t">How do you feel today?</span>
      <el-radio-group v-model="mood">
        <MRB
          v-for="type in mood_list" :key="type.code"
          :label="type.code"
          :label_show="type.name"
          class="b"
          :img="require('../../assets/'+type.icon+'.png')"
          :img_highlight="require('../../assets/'+type.icon+'_highlight.png')"
        />
      </el-radio-group>
    </div>


    <div class="block">
      <span class="t">How many hours do you sleep last night?</span>
      <div class="slide_content">
        <span class="sleep_hours"/>
        <MSD
          class="el-slider"
          v-model="sleep"
          :max="12"
          :show-tooltip="false"
          :img="require('../../assets/ic_lemon.png')"
        />
        <span class="sleep_hours">{{sleep}} Hours</span>
      </div>
    </div>


    <div class="block">
      <span class="t">What did you do today?</span>
      <el-checkbox-group v-model="doing" @change="handleCheckedCitiesChange">
        <div>
          <MCB
            v-for="type in doing_list" :key="type.code"
            :label="type.code"
            :label_show="type.name"
            class="b"
            :img="require('../../assets/'+type.icon+'.png')"
            :img_highlight="require('../../assets/'+type.icon+'_highlight.png')"
          />
        </div>
      </el-checkbox-group>
    </div>


    <span class="tt">Note</span>
    <MIP
      type="textarea"
      v-model="note"
      :autosize="{ minRows: 1, maxRows: 10}"
      class="block_input"
      placeholder="Add Note..."
      maxlength="500"/>


    <span class="tt">Photo</span>
    <div class="block_input_photo">
      <el-upload
        ref="upload"
        class="el-upload"
        enctype="multipart/form-data"
        accept=".jpg,.png"
        :action="upload_url"
        :data="upload_params"
        :before-upload="handlerBefore"
        :on-change="handleChange"
        :on-success="handleSuccess"
        :file-list="fileList"
        :show-file-list="false"
        :auto-upload="false">
        <MIP
          readonly
          v-model="photo"
          class="photo_input"
          slot="trigger"
          placeholder="Click to select photo..."/>
      </el-upload>
    </div>


    <div class="submit_content">
      <el-button class="block_button" type="success" @click="handlerSubmit">Save</el-button>
    </div>


  </el-container>
</template>

<script>
  import MDS from '../../components/my-date-select/my-day-select'
  import MRB from '../../components/my-radio-button/my-radio-button'
  import MCB from '../../components/my-checkbox-button/my-checkbox-button'
  import MSD from '../../components/my-slider/my-slider'
  import MIP from '../../components/my-input/my-input'

  export default {
    components: {
      MDS,
      MRB,
      MCB,
      MSD,
      MIP
    },
    data() {
      return {
        loading: false,
        loading_1: false,
        loading_2: false,
        mood_list: [],
        doing_list: [],
        fileList: [],
        ddate: null,//params
        mood: '',//params
        sleep: 6,//params
        doing: [],//params
        note: '',//params
        photo: '',//params
        upload_url: this.$api.biz_mood_upload(),
        upload_params: {user_id: '', ddate: null, mood: '', sleep: 0, doing: [], note: ''},
      };
    },
    created() {
      this.setupMoodList();
      this.setupDoingList();
    },
    methods: {
      setupMoodList() {
        this.loading_1 = true;
        this.$post(this, this.$api.biz_type_list(), {category: 'mood'}).then(data => {
          if (data && data.status === 200) {
            this.mood_list = data.datas;
          } else {
            this.$message({
              showClose: true,
              message: data.message,
              type: 'error'
            });
          }
          this.getLemon();
          this.loading_1 = false;
        });
      },
      setupDoingList() {
        this.loading_2 = true;
        this.$post(this, this.$api.biz_type_list(), {category: 'doing'}).then(data => {
          if (data && data.status === 200) {
            this.doing_list = data.datas;
          } else {
            this.$message({
              showClose: true,
              message: data.message,
              type: 'error'
            });
          }
          this.getLemon();
          this.loading_2 = false;
        });
      },
      submitUpload() {
        let user = JSON.parse(sessionStorage.getItem('user'));
        this.upload_params.user_id = user.id;
        this.upload_params.ddate = this.ddate;
        this.upload_params.mood = this.mood;
        this.upload_params.sleep = this.sleep;
        this.upload_params.doing = this.doing;
        this.upload_params.note = this.note;
        this.upload_params.photo = this.photo;

        if (this.fileList.length > 0) {
          this.loading = true;
          this.$refs.upload.submit();
        } else {
          this.loading = true;
          this.$post(this, this.$api.biz_mood_no_upload(), this.upload_params).then(data => {
            this.handleSuccess(data, null, null);
          });
        }
      },
      handlerBefore() {
        this.loading = true;
      },
      handleChange(file, fileList) {
        if (!this.loading) {
          this.fileList = fileList.slice(-1);
          this.photo = this.fileList[0].name;
        }
      },
      handleSuccess(data, file, fileList) {
        if (data && data.status === 200) {
          this.$message({
            showClose: true,
            message: 'Log Moods success!',
            type: 'success'
          });
          //this.ddate = new Date();
          //this.mood = '';
          //this.sleep = 6;
          //this.doing = [];
          //this.note = '';
          //this.fileList = [];
          //this.photo = '';
          setTimeout(() => {
            this.loading = false;
          }, 200);
        } else {
          this.loading = false;
          this.$message({
            showClose: true,
            duration: 5000,
            message: data.message,
            type: 'error'
          });
        }
      },
      handlerSubmit() {
        if (!this.mood) {
          this.$message({
            showClose: true,
            duration: 5000,
            message: 'Please select one mood',
            type: 'error'
          });
          return;
        }
        if (this.doing.length < 1) {
          this.$message({
            showClose: true,
            duration: 5000,
            message: 'Please select at least one activity',
            type: 'error'
          });
          return;
        }
        this.submitUpload();
      },
      handleCheckedCitiesChange(val) {
        this.doing = val.slice(-3);
      },
      getLemon(){
        if (this.mood_list.length > 0 && this.doing_list.length > 0) {
          this.loading = true;
          let user = JSON.parse(sessionStorage.getItem('user'));
          this.$post(this, this.$api.biz_lemon_list(), {user_id: user.id, ddate: this.ddate, limit: 1}).then(data => {

            if (data && data.status === 200 && data.datas.length > 0) {
              let lemon = data.datas[0];
              this.mood = lemon.mood;
              this.sleep = lemon.sleep;
              this.doing = lemon.activity.split(',');
              this.note = lemon.note;
              this.photo = lemon.photo;
            } else {
              this.mood = '';
              this.sleep = 6;
              this.doing = [];
              this.note = '';
              this.fileList = [];
              this.photo = '';
            }
            this.loading = false;
          });
        }
      }
    },
    watch: {
      ddate(date) {
        this.getLemon();
      }
    }
  }
</script>

<style src="./LogMood.css" scoped/>
