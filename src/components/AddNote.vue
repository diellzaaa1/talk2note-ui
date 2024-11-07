<template>
    <div v-if="isVisible" class="modal-overlay">
      <div class="modal">
        <h2>New Note</h2>
        <form @submit.prevent="submitNote">
          <div class="form-group">
            <label for="noteTitle">Title:</label>
            <input
              type="text"
              id="noteTitle"
              v-model="noteTitle"
              required
              class="input-field"
            />
          </div>
          <div class="form-group">
            <label for="folderSelect">Choose Folder:</label>
            <select
              id="folderSelect"
              v-model="selectedFolder"
              required
              class="select-field"
            >
              <option disabled value="">Select a folder</option>
              <option v-for="folder in folders" :key="folder.id" :value="folder.id">
                {{ folder.name }}
              </option>
            </select>
          </div>
          <div class="form-actions">
            <button type="submit" class="submit-button">Create Note</button>
            <button type="button" @click="closeModal" class="cancel-button">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  </template>
  
  <script>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  
  export default {
    props: {
      isVisible: {
        type: Boolean,
        required: true,
      },
      folders: {
        type: Array,
        required: true,
      },
    },
    setup(props, { emit }) {
      const router = useRouter();
      const noteTitle = ref('');
      const selectedFolder = ref('');
  
      const submitNote = () => {
        if (noteTitle.value && selectedFolder.value) {
          router.push({
            name: 'NoteCreation',
            query: {
              title: noteTitle.value,
              folderId: selectedFolder.value,
            },
          });
          closeModal(); 
        }
      };
  
      const closeModal = () => {
        noteTitle.value = ''; 
        selectedFolder.value = ''; 
        emit('close'); 
      };
  
      return {
        noteTitle,
        selectedFolder,
        submitNote,
        closeModal,
      };
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
    background: rgba(0, 0, 0, 0.7); 
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000; 
  }
  
  .modal {
    background: #ffffff; 
    padding: 30px;
    border-radius: 10px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2); 
    width: 400px;
    max-width: 90%; 
  }
  
  h2 {
    margin-bottom: 20px; 
    color: black; 
    text-align: center;
  }
  
  .form-group {
    margin-bottom: 20px; 
  }
  
  label {
    display: block;
    margin-bottom: 5px;
    color: black; 
  }
  
  .input-field,
  .select-field {
    width: 100%; 
    padding: 10px; 
    border: 1px solid #ccc; 
    border-radius: 5px; 
    box-sizing: border-box;
  }
  
  .input-field:focus,
  .select-field:focus {
    border-color: #007bff; 
    outline: none;
  }
  
  .form-actions {
    display: flex;
    justify-content: space-between;
  }
  
  .submit-button,
  .cancel-button {
    padding: 10px 15px; 
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background 0.3s, color 0.3s;
  }
  
  .submit-button {
    background-color: black; 
    color: white;
  }
  
  .submit-button:hover {
    background-color: #444;
  }
  
  .cancel-button {
    background-color: #4f4f51; 
    color: white;
  }
  
  .cancel-button:hover {
    background-color: #444;
  }
  </style>
  