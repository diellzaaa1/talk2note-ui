<template>
    <div v-if="isVisible" class="modal-overlay3">
      <div class="modal-content2">
        <h2>Change Password</h2>
        <form @submit.prevent="handleSubmit">
          <input
            v-model="currentPassword"
            type="password"
            placeholder="Current Password"
            class="modal-input"
            required
          />
          <input
            v-model="newPassword"
            type="password"
            placeholder="New Password"
            class="modal-input"
            required
          />
          <input
            v-model="confirmPassword"
            type="password"
            placeholder="Confirm New Password"
            class="modal-input"
            required
          />
          <div v-if="newPassword && confirmPassword && newPassword !== confirmPassword" class="error-message">
            Passwords do not match.
          </div>
          <div class="modal-buttons">
            <button type="submit" class="modal-button submit-button" :disabled="newPassword !== confirmPassword">
              Change Password
            </button>
            <button type="button" @click="closeModal" class="modal-button cancel-button">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "PasswordChangeModal",
    props: {
      isVisible: {
        type: Boolean,
        required: true
      },
      userId: {
        type: [Number,String],
        required: true
      }
    },
    data() {
      return {
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      };
    },
    methods: {
      async handleSubmit() {
        if (this.newPassword === this.confirmPassword) {
          const passwordData = {
            id: this.userId,
            currentPassword: this.currentPassword,
            newPassword: this.newPassword,
          };
  
          try {
            this.$emit("submit", passwordData);
            this.closeModal();  
          } catch (error) {
            console.error('Error changing password:', error);
          }
        }
      },
      closeModal() {
        this.$emit("close"); 
      }
    }
  };
  </script>
  
  <style scoped>
  .modal-overlay3 {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999; 

  }
  
  .modal-content2 {
    background-color: #fff;
    padding: 20px;
    border-radius: 10px;
    width: 30%;
    height: 50%;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  }
  
  h2 {
    margin-bottom: 20px;
    text-align: center;
    font-size: 24px;
    font-weight: 600;
  }
  
  .modal-input {
    width: 90%;
    height:20%;
    padding: 10px;
    margin-bottom: 20px;
    border: 1px solid #ddd;
    border-radius: 5px;
    font-size: 16px;
  }
  
  .error-message {
    color: red;
    font-size: 14px;
    margin-bottom: 10px;
    text-align: center;
  }
  
  .modal-buttons {
    display: flex;
    justify-content: space-between;
  }
  
  .modal-button {
    padding: 12px;
    border-radius: 5px;
    font-size: 16px;
    cursor: pointer;
  }
  
  .submit-button {
    background-color: #111411;
    color: white;
  }
  
  /* .cancel-button {
    background-color: #f44336;
    color: white;
  } */
  
  .submit-button:disabled {
    background-color: #d3d3d3;
    cursor: not-allowed;
  }
  </style>
  