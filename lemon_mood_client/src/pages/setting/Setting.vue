<template>
  <el-container v-loading.fullscreen.lock="loading" class="el-container ">


    <div class="title">
      <span>User Name</span>
    </div>
    <div class="block">
      <el-input v-model="user_name" class="block_input" placeholder="please input user name" maxlength="16" clearable/>
      <el-button class="block_button" type="primary" plain @click="handlerUpdateUsername">Save</el-button>
    </div>


    <div class="title">
      <span>Location City</span>
    </div>
    <div class="block">
      <el-input v-model="location" class="block_input" placeholder="please input your city such as London" maxlength="20" clearable/>
      <el-button class="block_button" type="primary" plain @click="handlerUpdateLocation">Save</el-button>
    </div>


    <div class="title">
      <span>Profile Photo</span>
    </div>
    <div class="block">
      <el-input v-model="user_head" class="block_input_head" placeholder="please select profile photo" readonly=""/>
      <el-upload
        ref="upload"
        class="el-upload"
        enctype="multipart/form-data"
        accept=".jpg,.png"
        :action="upload_url"
        :before-upload="handlerBefore"
        :on-change="handleChange"
        :on-success="handleSuccess"
        :file-list="fileList"
        :show-file-list="false"
        :auto-upload="false">
        <el-button slot="trigger" class="block_button" type="primary" plain>Select</el-button>
        <el-button class="block_button" type="success" @click="submitUpload">Save</el-button>
      </el-upload>
    </div>


    <div class="title">
      <span>User Password</span>
    </div>
    <div class="block">
      <el-input v-model="user_pwd" class="block_input" placeholder="please input old password" maxlength="16" clearable show-password/>
    </div>
    <div class="block">
      <el-input v-model="user_pwd_new" class="block_input" placeholder="please input new password" maxlength="16" clearable show-password/>
    </div>
    <div class="block">
      <el-input v-model="user_pwd_new_again" class="block_input" placeholder="please input confirm password" maxlength="16" clearable show-password/>
      <el-button class="block_button" type="primary" plain @click="handlerUpdateUserPwd">Save</el-button>
    </div>

  </el-container>
</template>

<script>
  export default {
    data() {
      return {
        upload_url: this.$api.sys_upload(),
        loading: false,
        user_name: '',
        location: '',
        user_head: '',
        user_pwd: '',
        user_pwd_new: '',
        user_pwd_new_again: '',
        fileList: [],
        user: {},
      };
    },
    created() {
      this.user = JSON.parse(sessionStorage.getItem('user'));
      this.user_name = this.user.user_name;
      this.location = this.user.location;
    },
    methods: {
      submitUpload() {
        this.$refs.upload.submit();
      },
      handlerBefore() {
        this.loading = true;
      },
      handleChange(file, fileList) {
        if (!this.loading) {
          this.fileList = fileList.slice(-1);
          this.user_head = this.fileList[0].name;
        }
      },
      handleSuccess(data, file, fileList) {
        if (data && data.status === 200) {
          this.user_head = '';
          this.fileList = [];
          let user_head = this.$api.host_server() + data.datas.file_name;
          this.doUpdateUserInfo(null, user_head, null);
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
      handlerUpdateUsername() {
        if (!this.user_name) {
          this.$message({
            showClose: true,
            duration: 5000,
            message: 'Username can not be empty',
            type: 'error'
          });
          return;
        }
        this.loading = true;
        this.doUpdateUserInfo(this.user_name, null, null);
      },
      handlerUpdateLocation() {
        if (!this.location) {
          this.$message({
            showClose: true,
            duration: 5000,
            message: 'Location city can not be empty',
            type: 'error'
          });
          return;
        }
        this.loading = true;
        this.doUpdateUserInfo(null, null, this.location);
      },
      doUpdateUserInfo(user_name, user_head, location) {
        let user = this.user;
        if (user_name) {
          user.user_name = user_name;
        }
        if (user_head) {
          user.user_head = user_head;
        }
        if (location) {
          user.location = location;
        }
        let params = {
          id: user.id,
          user_name: user_name,
          user_head: user_head,
          location: location,
        };
        this.$post(this, this.$api.user_update(), params).then(data => {
          this.loading = false;
          if (data && data.status === 200) {
            sessionStorage.setItem('user', JSON.stringify(user));
            this.$emit('father_updateUser');
            this.$message({
              type: 'success',
              message: 'update user info success!'
            });
          } else {
            this.$message({
              showClose: true,
              duration: 5000,
              message: data.message,
              type: 'error'
            });
          }
        });
      },
      handlerUpdateUserPwd() {
        if (!this.user_pwd) {
          this.$message({
            showClose: true,
            duration: 5000,
            message: 'Password can not be empty',
            type: 'error'
          });
          return;
        }
        if (!this.user_pwd_new) {
          this.$message({
            showClose: true,
            duration: 5000,
            message: 'New password can not be empty',
            type: 'error'
          });
          return;
        }
        if (!this.user_pwd_new_again) {
          this.$message({
            showClose: true,
            duration: 5000,
            message: 'Confirm password can not be empty',
            type: 'error'
          });
          return;
        }
        if (this.user_pwd_new !== this.user_pwd_new_again) {
          this.$message({
            showClose: true,
            duration: 5000,
            message: 'The new password and confirm password are not the same',
            type: 'error'
          });
          return;
        }
        this.loading = true;
        this.doUpdateUserPwd(this.user_pwd, this.user_pwd_new, this.user_pwd_new_again);
      },
      doUpdateUserPwd(user_pwd, user_pwd_new, user_pwd_new_again) {
        let user = this.user;
        let params = {
          id: user.id,
          user_pwd: user_pwd,
          user_pwd_new: user_pwd_new,
          user_pwd_new_again: user_pwd_new_again,
        };
        this.$post(this, this.$api.user_resetpwd(), params).then(data => {
          this.loading = false;
          if (data && data.status === 200) {
            this.$message({
              type: 'success',
              message: 'update password success!'
            });
          } else {
            this.$message({
              showClose: true,
              duration: 5000,
              message: data.message,
              type: 'error'
            });
          }
        });
      }
    }
  }
</script>

<style src="./Setting.css" scoped/>
