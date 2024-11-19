<!-- PasswordModal.vue -->
<template>
    <div v-if="show" class="password-modal">
      <div class="password-modal-content">
        <h3>Note Password</h3>
        <input
          type="password"
          v-model="passwordInput"
          placeholder="Enter password"
        />
        <div class="password-modal-actions">
          <button @click="unlockNote" class="modal-button unlock-button">Unlock</button>
          <button @click="closeModal" class="modal-button cancel-button">Cancel</button>
        </div>
        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      show: {
        type: Boolean,
        required: true,
      },
      currentNote: {
        type: Object,
        required: true,
      },
    },
    data() {
      return {
        passwordInput: '',
        errorMessage: '',
      };
    },
    methods: {
      async unlockNote() {
        try {
          const response = await this.$store.dispatch('note/unlockNoteAsync', {
            noteId: this.currentNote.noteId,
            password: this.passwordInput,
          });
          this.$emit('unlock-success', response);
          this.closeModal();
        } catch (error) {
          this.errorMessage = 'Wrong password. Try Again!';
        }
      },
      closeModal() {
        this.$emit('close-modal');
      },
    },
  };
  </script>
  
  <style scoped>
  .password-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999; 
  }
  
  .password-modal-content {
    background: #ffffff;
    padding: 20px;
    border-radius: 10px;
    width: 20%;
    height: 23%;
    text-align: center;
    color: black;
  }
  
  .password-modal-content h3 {
    margin-bottom: 15px;
  }
  
  .password-modal-content input {
    margin-top: 4%;
    width: 90%;
    padding: 10px;
    margin-bottom: 2%;
    border-radius: 5px;
    border: 1px solid #444;
    color: black;
  }
  
  .password-modal-actions {
    display: flex;
    justify-content: space-between;
  }
  
  .password-modal-actions button {
    background: black;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  
  .modal-button.unlock-button {
    background-color: #000;
  }
  
  .modal-button.cancel-button {
    background-color: #4f4f51;
  }
  
  .error-message {
    color: #d05147;
    margin-top: 10px;
    font-weight: 200;
  }
  </style>
  