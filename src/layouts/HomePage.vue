<template>
  <div class="home">
    <HeaderL @show-modal="handleShowModal" />
    <AuthModal 
      :visible="isModalVisible" 
      :isSignIn="isSignIn" 
      @close-modal="handleCloseModal" 
      @toggle-mode="toggleMode"
      @signup-success="switchToSignIn"
    />
    <div class="content">
      <div class="text-content">
        <h2>Instantly Capture Thoughts: Experience Real-Time Transcription!</h2>
        <p>Revolutionize your note-taking experience by speaking your mind. Capture thoughts, organize them into actionable tasks, and keep everything you need right at your fingertips.</p>
        <button @click="openModal" class="signup-button">Get Started</button>
      </div>
      <div class="image-container">
        <img :src="image1" alt="Note Taking Illustration" class="illustration" />
        <img :src="image2" alt="Another Illustration" class="small-image" />
      </div>
    </div>
  </div>
</template>

<script>
import HeaderL from '../components/header.vue';
import AuthModal from '../components/AuthModal.vue';
import image1 from '../assets/3.jpg';
import image2 from '../assets/5.jpg';

export default {
  components: {
    HeaderL,
    AuthModal,
  },
  data() {
    return {
      isModalVisible: false,
      isSignIn: true,
      image1,
      image2,
    };
  },
  methods: {
    handleShowModal(visible, isSignIn) {
      this.isModalVisible = visible;
      this.isSignIn = isSignIn;
    },
    handleCloseModal() {
      this.isModalVisible = false;
    },
    openModal() {
      this.isModalVisible = true;
    },

    toggleMode() {
  console.log('Toggling mode...');
  this.isSignIn = !this.isSignIn;
  console.log('New isSignIn value:', this.isSignIn);
},
switchToSignIn() {
      this.isSignIn = true; 
    }

  },
};
</script>
<style scoped>
.home {
  height: 100vh; 
  background: rgba(17, 17, 17, 255); 
  color: white; 
  display: flex; 
  flex-direction: column; 
}

.content {
  flex: 1;
  display: flex; 
  justify-content: space-between; 
  align-items: flex-start; 
  padding: 50px 20px;
  font-family: Verdana, Geneva, Tahoma, sans-serif;
}

.text-content {
  flex: 1;
  max-width: 500px; 
  margin-left: 2%;
  text-align: left;
  padding-top: 2%;
  padding-right: 10%;
  display: flex;
  flex-direction: column;
  gap: 15px; 
  line-height: 1.5; 
}

h2 {
  font-size: 1.8rem; 
  margin: 0;
}

p {
  font-size: 1rem;
  margin: 0;
}

.signup-button {
  width: 30%;
  margin-top: 10%; 
  padding: 10px 20px;
  background-color: white;
  color: black; 
  text-decoration: none;
  border-radius: 5px;
  font-weight: bold;
  font-size: 0.8rem; 
  text-align: center;
  display: inline-block; 
  transition: background-color 0.3s;
  align-self: center;
}

.signup-button:hover {
  background-color: #f0f0f0; 
  cursor: pointer;
}

.image-container {
  flex: 1;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.illustration {
  max-width: 60%;
  height: auto;
  border-radius: 3%;
}

.small-image {
  position: absolute; 
  top: 45%;
  left: -2%;
  max-width: 30%; 
  height: auto;
  opacity: 0.8; 
  border-radius: 5%;
}
</style>
