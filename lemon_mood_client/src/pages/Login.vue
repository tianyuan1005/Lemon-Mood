<template>
  <el-container v-loading.fullscreen.lock="loading">
    <el-main class="main">
      <el-card class="box-card">
        <el-image class="lemon" :src="require('../assets/ic_lemon.png')" fit="scale-down" @click="$router.push({path:'/'})"/>
        <span class="title">Welcome to Lemon Mood</span>
        <el-tabs v-model="activeName" @tab-click="handleClick" stretch>
          <el-tab-pane label="Log In" name="first">
            <div class="tab_item">
              <el-input class="input" v-model="login_email" placeholder="Email" maxlength="32" clearable/>
              <el-input class="input" v-model="login_pwd" placeholder="Password" maxlength="16" clearable
                        show-password @keyup.enter.native="handleLogin"/>
              <div class="btn_content">
                <el-button class="btn" type="primary" @click="handleLogin">Sign In <i
                  class="el-icon-caret-right"></i></el-button>
                <el-link type="primary" :underline="false" @click="dia_findpwd = true">Forget Password</el-link>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="Sign Up" name="second">
            <div class="tab_item">
              <el-input class="input" v-model="register_email" placeholder="Email" maxlength="32" clearable/>
              <el-input class="input" v-model="register_pwd" placeholder="Password" maxlength="16" clearable
                        show-password/>
              <el-input class="input" v-model="register_pwd_confirm" placeholder="Confirm Password" maxlength="16" clearable
                        show-password/>
              <div class="btn_content">
                <el-button class="btn" type="primary" @click="handleRegisterPre">Register <i class="el-icon-success"></i></el-button>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </el-main>

    <el-dialog
      title="E-mail verification"
      :visible.sync="dia_vcode"
      top="280px"
      width="400px"
      :before-close="handleCloseDiaVcode">
      <el-input class="input" v-model="vcode" placeholder="Enter verification code" maxlength="6" clearable/>
        <span slot="footer" class="dialog-footer">
      <el-button @click="dia_vcode = false">Cancel</el-button>
      <el-button type="primary" @click="handleRegister()">Submit</el-button>
    </span>
    </el-dialog>

    <el-dialog
      title="Forgot your password?"
      :visible.sync="dia_findpwd"
      top="280px"
      width="500px">
      <el-input class="input" v-model="findpwd_user_code" placeholder="Email" maxlength="32" clearable/>
      <span slot="footer" class="dialog-footer">
      <el-button @click="dia_findpwd = false">Cancel</el-button>
      <el-button type="primary" @click="handleFindpwd()">Submit</el-button>
    </span>
    </el-dialog>

  </el-container>
</template>

<script>

  export default {
    data() {
      return {
        dia_vcode: false,
        dia_findpwd: false,
        loading: false,
        activeName: 'first',
        login_email: '',
        login_pwd: '',
        register_email: '',
        register_pwd: '',
        register_pwd_confirm: '',
        vcode:'',
        findpwd_user_code:'',
      };
    },
    methods: {
      handleClick(tab, event) {
        console.log(tab, event);
      },
      handleRegisterPre: function () {
        if (!this.register_email) {
          return this.$message.error('please input your email');
        }
        if (!this.register_pwd) {
          return this.$message.error('please input your password');
        }
        if (!this.register_pwd_confirm) {
          return this.$message.error('Please enter confirm password');
        }
        let params = {
          user_code: this.register_email,
          user_pwd: this.register_pwd,
          user_pwd_confirm: this.register_pwd_confirm
        };
        this.loading = true;
        this.$post(this, this.$api.user_register_pre(), params).then(data => {
          this.loading = false;
          if (data && data.status === 200) {
            this.dia_vcode = true;
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
      handleRegister: function () {
        if (!this.register_email) {
          return this.$message.error('please input your email');
        }
        if (!this.register_pwd) {
          return this.$message.error('please input your password');
        }
        if (!this.register_pwd_confirm) {
          return this.$message.error('Please enter confirm password');
        }
        if (!this.vcode) {
          return this.$message.error('Please enter verification code');
        }
        let params = {
          user_code: this.register_email,
          user_pwd: this.register_pwd,
          user_pwd_confirm: this.register_pwd_confirm,
          vcode:this.vcode,
        };
        this.loading = true;
        this.$post(this, this.$api.user_register(), params).then(data => {
          this.loading = false;
          if (data && data.status === 200) {
            this.$message({
              showClose: true,
              duration: 5000,
              message: 'Congratulations, registration is successful',
              type: 'success'
            });
            this.register_email = null;
            this.register_pwd = null;
            this.register_pwd_confirm = null;
            this.dia_vcode = false;
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
      handleLogin: function () {
        if (!this.login_email) {
          return this.$message.error('please input your email');
        }
        if (!this.login_pwd) {
          return this.$message.error('please input your password');
        }
        let params = {
          user_code: this.login_email,
          user_pwd: this.login_pwd
        };
        this.loading = true;
        this.$post(this, this.$api.user_login(), params).then(data => {
          this.loading = false;
          if (data && data.status === 200) {
            sessionStorage.setItem('user', JSON.stringify(data.datas));
            this.$router.push({path: '/main'});
            this.$message({
              type: 'success',
              message: 'Log in success!'
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
      ,handleCloseDiaVcode(done) {
        this.$confirm('Confirm to close?', 'Tips', {
          confirmButtonText: 'Confirm',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(_ => {
            this.register_email = null;
            this.register_pwd = null;
            this.register_pwd_confirm = null;
            done();
          })
          .catch(_ => {});
      },
      handleFindpwd: function () {
        if (!this.findpwd_user_code) {
          return this.$message.error('please input your email');
        }
        let params = {
          user_code: this.findpwd_user_code,
        };
        this.loading = true;
        this.$post(this, this.$api.user_findpwd(), params).then(data => {
          this.loading = false;
          if (data && data.status === 200) {
            this.dia_findpwd = false;
            this.findpwd_user_code = null;
            this.$message({
              duration: 10000,
              type: 'success',
              message: data.datas
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
    },
  };
</script>
<style scoped>
  .main {
    min-width: 1800px;
    min-height: 500px;
    margin: 100px auto 0 auto;
    display: flex;
  }

  .box-card {
    margin: 0 auto auto auto;
    width: 450px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .lemon {
    display: block;
    width: 60px;
    height: 60px;
    margin: auto;
  }

  .title {
    margin-top: 20px;
    display: block;
    font-weight: bold;
    color: black;
    font-size: 30px;
  }

  .tab_item {
    display: flex;
    flex-direction: column;
  }

  .input {
    margin-top: 20px;
    font-size: 16px;
  }

  .btn_content {
    height: 100px;
    display: flex;
    justify-content: space-between;
  }

  .btn {
    margin-top: auto;
    margin-bottom: auto;
  }
</style>
