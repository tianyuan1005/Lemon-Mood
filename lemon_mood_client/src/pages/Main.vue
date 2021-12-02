<template>
  <el-container class="el-container ">
    <div class="main">
      <div class="left">
        <div class="left_title">
          <el-image class="lemon" :src="require('../assets/ic_lemon.png')" fit="scale-down"/>
          <span class="title">Lemon</span>
        </div>
        <el-menu :default-active="index" @select="handleMenu">
          <el-menu-item class="el-menu-item" index="/main/home">
            <i class="el-icon-s-home"></i>
            <span slot="title">Homepage</span>
          </el-menu-item>
          <el-menu-item class="el-menu-item" index="/main/log">
            <i class="el-icon-edit-outline"></i>
            <span slot="title">Log Moods</span>
          </el-menu-item>
          <el-menu-item class="el-menu-item" index="/main/calendar">
            <i class="el-icon-date"></i>
            <span slot="title">Calendar</span>
          </el-menu-item>
          <el-menu-item class="el-menu-item" index="/main/setting">
            <i class="el-icon-setting"></i>
            <span slot="title">Setting</span>
          </el-menu-item>
        </el-menu>
        <div class="left_header">
          <div slot="error">
            <el-image class="left_header_img" :src="user_head" fit="scale-down">
              <div slot="error" class="image-slot">
                <el-image class="left_header_img" :src="require('../assets/head_default.png')" fit="scale-down"/>
              </div>
            </el-image>
          </div>
          <span class="left_header_name">{{user_name}}</span>
        </div>
        <el-button class="logout" index="5" @click="handleLogout">
          <el-image class="menu_icon" :src="require('../assets/ic_menu_logout.png')" fit="scale-down"/>
          <span class="logout_txt">Log out</span>
        </el-button>
      </div>
      <div class="line"></div>
      <div class="right">
        <router-view @father_updateUser="updateUser" @father_changeMenu="handleMenu"/>
      </div>
    </div>
  </el-container>
</template>

<script>
  import Setting from '../pages/setting/Setting';

  export default {
    components: {
      Setting
    },
    data() {
      return {
        user_head: require('../assets/head_default.png'),
        user_name: '',
        user: null,
        index: '/main/home',
      };
    },
    created() {
      this.updateUser();
    },
    methods: {
      updateUser() {
        this.user = JSON.parse(sessionStorage.getItem('user'));
        if (this.user.user_head) {
          this.user_head = this.user.user_head;
        }
        if (this.user.user_name) {
          this.user_name = this.user.user_name;
        }
      },
      handleMenu: function (index, indexPath) {
        this.index = index;
        this.$router.push({path: index});
      },
      handleLogout: function () {
        this.$confirm('Do you want to log out?', 'Tips', {
          confirmButtonText: 'YES',
          cancelButtonText: 'NO',
          type: 'warning'
        }).then(() => {
          this.$router.push('/login');
          this.$message({
            type: 'success',
            message: 'Log out success!'
          });
        });
      },
    },
  };
</script>
<style scoped>
  .el-container {
  }

  .main {
    background-color: #FFFFFF;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
    min-width: 1200px;
    margin: 10px auto 10px auto;
    display: flex;
    flex-direction: row;
  }

  .left {
    min-height: 900px;
    width: 200px;
  }

  .left_title {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }

  .left_header {
    margin-top: 150px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .left_header_img {
    width: 80px;
    height: 80px;
    border-radius: 40px
  }

  .left_header_name {
    margin-top: 5px;
    width: 160px;
    color: black;
    font-size: 20px;
    overflow-wrap: break-word;
  }

  .lemon {
    width: 40px;
    height: 40px;
  }

  .title {
    width: 100px;
    font-weight: bold;
    color: black;
    margin-left: 10px;
    text-align: left;
    font-size: 20px;
    height: 80px;
    line-height: 90px;
  }

  .line {
    margin-left: -1px;
    width: 1px;
    background-color: #E1E0E0;
  }

  .right {
    min-height: 900px;
    width: 1000px;
  }

  .el-menu-item {
    text-align: left;
  }

  .el-menu-item i {
    margin-left: 20px;
    font-size: 22px;
  }

  .el-menu-item span {
    font-size: 16px;
  }

  .menu_icon {
    width: 20px;
    height: 16px;
    margin-bottom: -3px;
  }

  .logout {
    margin-top: 10px;
  }

  .logout_txt {
    font-size: 16px;
  }
</style>
