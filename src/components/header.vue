<template>
  <header class="header">
    <img src="../assets/logoF.png" alt="Logo" class="logo" />
    <div class="nav-links">
      <a @click.prevent="handleLoginClick" class="login-link">Login</a>
      <a @click.prevent="handleSignupClick" class="signup-button">Signup</a>
    </div>
  </header>
</template>

<script>
export default {
  name: 'HeaderL',
  methods: {
    handleLoginClick() {
      this.$emit('show-modal', true, false); // Emit event for login
    },
    handleSignupClick() {
      this.$emit('show-modal', true, true); // Emit event for signup
    }
  }
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
</style>
