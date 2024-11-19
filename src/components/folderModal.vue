<template>
  <div v-if="isVisible" class="modal-overlay">
    <div class="modal-content2">
      <h2>New Folder</h2>
      <input v-model="name" type="text" id="name" placeholder="Folder Name" />
      <div class="modal-actions">
        <button @click="createFolder">Create Folder</button>
        <button @click="closeModal" class="cancel">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    isVisible: Boolean,  
  },
  data() {
    return {
      name: '',
    };
  },
  methods: {
    closeModal() {
      this.$emit('close');
    },
    
    async createFolder() {
      if (this.name) {
        try {
          const folderData = { name: this.name }; 
          await this.$store.dispatch('folder/createFolder',folderData);
          this.name = ''; 
          this.closeModal();    
        } catch (error) {
          alert('Error creating folder: ' + error.message);
        }
      } else {
        alert('Please provide a folder name.');
      }
    },
  },
};
</script>
  
  <style scoped>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }
  
  .modal-content2 {
    background-color: white;
    padding: 20px;
    border-radius: 12px;
    width: 300px;
    height:20%;
    display: flex;
    flex-direction: column;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  }
  
  h2 {
    font-size: 24px;
    color: black;
    text-align: center;
    margin-bottom: 20px;
  }
  
  input {
    width: 90%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    margin-bottom: 15px;
  }
  
  .modal-actions {
    margin-top: 10px;
    display: flex;
    justify-content: space-between;
  }
  
  button {
    background-color: black;
    color: white;
    border: none;
    padding: 10px 20px;
    cursor: pointer;
    transition: background 0.3s;
    border-radius: 5px;
  }
  .cancel{ 
    background-color: #4f4f51;
  }
  
  button:hover {
    background-color: #333;
  }
  
  button:focus {
    outline: none;
  }
  </style>
  