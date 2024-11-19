<template>
  <div v-if="isOpen" class="modal-overlay">
    <div class="modal-content1">
      <h2>Share Note</h2>
      <input 
        v-model="localEmail" 
        type="email" 
        placeholder="Enter Email Address" 
        class="modal-input"
      />
      <button @click="shareNoteAction" class="modal-button share-button">Share</button>
      <button @click="closeModal" class="modal-button cancel-button">Cancel</button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    isOpen: Boolean, 
    noteId: Number, 
    userId: Number,
  },
  data() {
    return {
      localEmail: '', 
    };
  },
  methods: {
    closeModal() {
      this.$emit('close');
    },
    async shareNoteAction() {
      try {
        const noteId = Number(this.noteId); 

        await this.$store.dispatch('note/shareNoteAsync', {
          userId: this.userId,
          noteId: noteId,
          toEmail: this.localEmail,
        });
        
        this.closeModal();  
      } catch (error) {
        console.log(this.userId,this.noteId,this.localEmail)

        console.error('Error sharing note:', error); 
      }
    }
  }
}
</script>

<style scoped>
.modal-content1 {
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  width: 30%;
  height: 30%;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}
</style>
