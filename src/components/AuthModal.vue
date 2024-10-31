<template>
  <div class="modal-overlay" v-if="visible" @click="closeModal">
    <div class="modal" @click.stop>
      <button class="close" @click="closeModal">✖</button>
      <h2 class="modal-title">{{ isSignIn ? 'Sign In' : 'Join Now' }}</h2>
      <div class="auth-options">
        <form @submit.prevent="handleSubmit">
          <div class="input-group">
            <input
              type="email"
              v-model="email"
              placeholder="Email"
              required
            />
          </div>
          <div class="input-group">
            <input
              type="password"
              v-model="password"
              placeholder="Password"
              required
            />
          </div>
          <div v-if="!isSignIn">
            <div class="input-group">
              <input
                type="text"
                v-model="username"
                placeholder="Username"
                required
              />
            </div>
            <div class="input-group">
              <input
                type="password"
                v-model="confirmPassword"
                placeholder="Confirm Password"
                required
              />
            </div>
          </div>
          <button type="submit" class="submit-btn">
            {{ isSignIn ? 'Sign In' : 'Sign Up' }}
          </button>
        </form>
        <div class="divider">or</div>
        <button class="google-btn" @click="handleGoogleAuth">
          <img src="@/assets/google-icon.png" alt="Gmail Logo" class="gmail-logo" />
          Continue with Google
        </button>
        
        <p @click="toggleMode" class="toggle-mode">
          {{ isSignIn ? 'Don’t have an account? Sign Up' : 'Already have an account? Sign In' }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    visible: Boolean,
    isSignIn: Boolean,
  },
  data() {
    return {
      email: '',
      password: '',
      username: '',
      confirmPassword: '',
    };
  },
  methods: {
    closeModal() {
      this.$emit('close-modal');
      this.resetForm();
    },
    toggleMode() {
      this.$emit('toggle-mode');
      this.resetForm();
    },
    resetForm() {
      this.email = '';
      this.password = '';
      this.username = '';
      this.confirmPassword = '';
    },
    handleSubmit() {
      if (this.isSignIn) {
        this.signIn();
      } else {
        this.signUp();
      }
    },
    signIn() {
      console.log('Signing in:', this.email, this.password);
      this.closeModal();
    },
    signUp() {
      if (this.password !== this.confirmPassword) {
        alert("Passwords do not match!");
        return;
      }
      console.log('Signing up:', this.email, this.password, this.username);
      this.$emit('signup', {
        email: this.email,
        password: this.password,
        username: this.username,
      });
      this.closeModal();
    },
    handleGoogleAuth() {
      console.log('Signing in with Google...');
      this.closeModal();
    }
  }
};
</script>
  
  <style scoped>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }
  
  .modal {
    background: #f9f9f9;
    padding: 30px;
    border-radius: 12px;
    width: 400px;
    position: relative;
    box-shadow: 0 2px 15px rgba(0, 0, 0, 0.3);
  }
  
  .close {
    position: absolute;
    top: 15px;
    right: 15px;
    background: transparent;
    border: none;
    font-size: 24px;
    cursor: pointer;
  }
  
  .modal-title {
    font-size: 24px;
    text-align: center;
    margin-bottom: 20px;
    color: #333;
  }
  
  .auth-options {
    display: flex;
    flex-direction: column;
  }
  
  .input-group {
    margin-bottom: 15px;
  }
  
  input {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
  }
  
  .submit-btn {
    width: 100%;
    padding: 10px;
    border: none;
    border-radius: 5px;
    background-color: #000; /* Black for Sign In */
    color: white;
    cursor: pointer;
    transition: background 0.3s;
  }
  
  .submit-btn:hover {
    background-color: #333; 
  }
  
  .google-btn {
    background: white; 
    color: #333; 
    border: 1px solid #ccc; 
    padding: 12px;
    border-radius: 5px;
    cursor: pointer;
    display: flex; 
    align-items: center; 
    margin-top: 15px; 
    transition: background 0.3s; 
  }
  
  .google-btn:hover {
    background: #f1f1f1; 
  }
  
  .gmail-logo {
    width: 20px;
    height: auto;
    margin-right: 10px; 
  }
  
  .divider {
    text-align: center;
    margin: 15px 0;
    color: #666;
  }
  
  .toggle-mode {
    color: black; 
    cursor: pointer;
    text-align: center;
    margin-top: 15px;
  }
  </style>
  