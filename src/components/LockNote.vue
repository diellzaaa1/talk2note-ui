<template>
  <div v-if="isOpen" class="modal-overlay">
    <div class="modal-content">
      <h2>Lock Note</h2>
      <input 
        v-model="localLockPassword" 
        type="password" 
        placeholder="Enter Password" 
        class="modal-input" 
      />
      <input 
        v-model="localConfirmLockPassword" 
        type="password" 
        placeholder="Confirm Password" 
        class="modal-input" 
      />
      <button @click="lockNoteAction" class="modal-button lock-button">Lock Note</button>
      <button @click="closeModal" class="modal-button cancel-button">Cancel</button>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'; 

export default {
  props: {
    isOpen: Boolean,
    noteId: Number, 
  },
  data() {
    return {
      localLockPassword: '',
      localConfirmLockPassword: '',
    };
  },
  methods: {
    ...mapActions('note', ['lockNoteAsync']), 

    closeModal() {
      this.$emit('close');
    },

    async lockNoteAction() {
      if (this.localLockPassword === this.localConfirmLockPassword) {
        try {
          await this.lockNoteAsync({
            noteId: this.noteId,
            password: this.localLockPassword,
          });
          console.log('thissss',this.noteId)
          this.closeModal(); 
          this.localLockPassword='';
          this.localConfirmLockPassword='';
        } catch (error) {
          alert('Error locking note: ' + error.message);
        }
      } else {
        alert("Passwords do not match.");
        this.localLockPassword='';
        this.localConfirmLockPassword='';
      }
    }
  }
}
</script>

<style scoper>

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  width: 30%;
  height:40%;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);

}

.modal-input {
  width: 86%;
  padding: 12px;
  margin-top:5%;
  border-radius: 5px;
  border: 1px solid #ccc;
  margin-left:3%;
}

.modal-button {
  width: 92%;
  padding: 12px;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top:3%;
  margin-left:3%;

}

.modal-button.lock-button {
  background-color: #000;
}

.modal-button.share-button {
  background-color: #000;
}

.modal-button.cancel-button {
  background-color: #4f4f51;
}

/* .modal-button:hover {
  background-color: #218838;
} */

.modal-button.lock-button:hover,
.modal-button.share-button:hover {
  background-color: #7c848d;
}

.modal-button.cancel-button:hover {
  background-color: #333;
}
</style>  