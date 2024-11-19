<template>
  <header class="header">
    <img src="../assets/logoF.png" alt="Logo" class="logo" />
    <div class="nav-links">
      <template v-if="!isLoggedIn">
        <a @click.prevent="handleLoginClick" class="login-link">Login</a>
        <a @click.prevent="handleSignupClick" class="signup-button">Signup</a>
      </template>
      <template v-else>
        <div class="user-menu">
          <span @click="toggleDropdown" class="user-name">
            <i class="fa fa-user-circle"></i> 

            {{ userInfo?.name || 'User' }}
          </span>
          <div v-if="isDropdownVisible" class="dropdown">

            <a @click.prevent="openChangePasswordModal"> <i class="fa fa-key"></i>Change Password</a>

            <a @click.prevent="handleLogout">            <i class="fa fa-sign-out-alt"></i> 
              Logout</a>

          </div>
        </div>
      </template>
    </div>
  </header>
  <PasswordChange
    :isVisible="isPasswordModalVisible"
    :userId="userId"
    @submit="changePassword"
    @close="closeModal"
  />
</template>

<script>
import { getUserIdFromToken, removeToken } from '@/utils/authUtils';
import PasswordChange from './PasswordChange.vue';

export default {
  name: 'HeaderL',
  components: {
    PasswordChange
  },
  data() {
    return {
      isDropdownVisible: false,
      isLoggedIn: false,
      userInfo: null,
      isPasswordModalVisible: false ,
      userId:getUserIdFromToken()

    };
  },
  methods: {
    async fetchUserInfo() {
      try {
        const userId = getUserIdFromToken();
        if (userId) {
          this.isLoggedIn = true;
          const response=await this.$store.dispatch('user/getUserById', userId);
          console.log('API Response:', response);

        this.userInfo=response;

        }
      } catch (error) {
        console.error('Error fetching user info:', error.message);
      }
    },
    handleLoginClick() {
      this.$emit('show-modal', true, false);
    },
    handleSignupClick() {
      this.$emit('show-modal', true, true);
    },
    handleLogout() {
      removeToken();
      this.$router.push('/'); 
    },
    openChangePasswordModal() {
      this.isPasswordModalVisible = true;
    },
    closeModal() {
      this.isPasswordModalVisible = false;
    },
    async changePassword(passwordData)  {
      try {
        await this.$store.dispatch("user/changePassword", passwordData);
        console.log(passwordData);
        this.closePasswordModal(); 
        alert("Password changed successfully.");
      } catch (error) {
        alert(`Failed to change password: ${error.message}`);
      }
    },
    toggleDropdown() {
      this.isDropdownVisible = !this.isDropdownVisible;
    },
  },
  async mounted() {
    await this.fetchUserInfo();
  },
};
</script>

<style scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: space-between; 
  background-color: rgba(17, 17, 17, 255);
  padding: 20px;
  color: white;
  font-family: Verdana, Geneva, Tahoma, sans-serif;
}

.logo {
  width: 15%;
  height: auto;
  margin-right: 10%;
}

.nav-links {
  margin-right: 10%;
  display: flex;
  align-items: center;
}

.login-link {
  color: white;
  text-decoration: none;
  margin-right: 30%;
  cursor: pointer;
}

.signup-button {
  padding: 10px 20px;
  border: 1px solid white;
  color: white;
  text-decoration: none;
  border-radius: 5px;
  transition: background-color 0.3s;
  cursor: pointer;
}

.signup-button:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.user-menu {
  display: flex;
  align-items: center;
  position: relative;
  font-size: 16px;
}

.user-name {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 5px;
}
.user-name i {
  margin-right: 8px; 
  font-size: 18px; 
}
.dropdown {
  position: absolute;
  top: 30px;
  right: 0;
  background-color: white;
  border: 1px solid #ddd;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  min-width: 200px;
  padding: 10px 0;
  display: flex;
  flex-direction: column;
}

.dropdown a {
  display: flex;
  align-items: center;
  padding: 8px 15px;
  font-size: 14px;
  color: #333;
  text-decoration: none;
}

.dropdown a:hover {
  background-color: #f2f2f2;
}

.dropdown i {
  margin-right: 8px; 
  font-size: 16px; 
}
</style>
