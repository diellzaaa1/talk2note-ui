<template>
  <div class="main-container">
    <div class="note-container">
      <div class="note-header">
        <h1 class="note-title">{{ noteTitle }}</h1>
        <div class="settings-dropdown">
          <button @click="toggleSettingsMenu" class="settings-button">
            <i class="fas fa-cog"></i> 
          </button>
          <div v-if="isSettingsMenuOpen" class="settings-menu">
            <button @click="lockNote" class="settings-option">
              <i class="fas fa-lock"></i> Lock Note
            </button>
            <button @click="archiveNote" class="settings-option">
              <i class="icon fas fa-archive"></i> Archive Note
            </button>
            <button @click="shareNote" class="settings-option">
              <i class="fas fa-envelope"></i> Share via Email
            </button>
            <button @click="exportNote" class="settings-option">
              <i class="fas fa-file-export"></i> Export as PDF
            </button>
            <button @click="deleteNote" class="settings-option delete-option">
              <i class="fas fa-trash-alt"></i> Delete
            </button>
          </div>
        </div>
      </div>

      <textarea 
        v-model="noteText" 
        placeholder="Type your notes here..." 
        class="note-textarea"
      ></textarea>

      

      <div class="transcription-settings">
        <button @click="toggleTranscription" 
                class="transcription-button" 
                :class="{ 'recording': isTranscribing }">
          <i :class="isTranscribing ? 'fas fa-stop' : 'fas fa-microphone'" aria-hidden="true"></i>
          {{ isTranscribing ? 'End Note Taking' : 'Take Notes' }}
        </button>
        <div class="language-selector">
          <select v-model="selectedLanguage" id="language" class="language-dropdown">
            <option value="en">English</option>
            <option value="sq">Albanian</option>  
          </select>
        </div>
      </div>

      <button @click="saveNote" class="save-button">Save Note</button>
    </div>
  </div>

  <div v-if="isLockModalOpen" class="modal-overlay" @click="closeLockModal">
    <div class="modal-content" @click.stop>
      <h2>Lock Note</h2>
      <input v-model="lockPassword" type="password" placeholder="Enter Password" class="modal-input"/>
      <input v-model="confirmLockPassword" type="password" placeholder="Confirm Password" class="modal-input"/>
      <button @click="lockNoteAction" class="modal-button lock-button">Lock Note</button>
      <button @click="closeLockModal" class="modal-button cancel-button">Cancel</button>
    </div>
  </div>

  <div v-if="isShareModalOpen" class="modal-overlay" @click="closeShareModal">
    <div class="modal-content" @click.stop>
      <h2>Share Note</h2>
      <input v-model="email" type="email" placeholder="Enter Email" class="modal-input"/>
      <button @click="shareNoteAction" class="modal-button share-button">Share Note</button>
      <button @click="closeShareModal" class="modal-button cancel-button">Cancel</button>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

export default {
  setup() {
    const route = useRoute();
    const noteText = ref('');
    const noteTitle = ref('');
    const selectedLanguage = ref('en');
    const isTranscribing = ref(false);
    const isSettingsMenuOpen = ref(false);
    const isLockModalOpen = ref(false);
    const isShareModalOpen = ref(false);
    const lockPassword = ref('');
    const confirmLockPassword = ref('');
    const email = ref('');

    onMounted(() => {
      noteTitle.value = route.query.title || '';
    });

    const toggleTranscription = () => {
      isTranscribing.value = !isTranscribing.value;
      if (isTranscribing.value) {
        console.log("Transcription started in", selectedLanguage.value);
      } else {
        console.log("Transcription stopped.");
      }
    };

    const saveNote = () => {
      console.log("Note saved:", noteTitle.value, noteText.value);
    };

    const toggleSettingsMenu = () => {
      isSettingsMenuOpen.value = !isSettingsMenuOpen.value;
    };

    const lockNote = () => {
      isLockModalOpen.value = true;
    };

    const lockNoteAction = () => {
      if (lockPassword.value === confirmLockPassword.value) {
        console.log("Note locked with password:", lockPassword.value);
        isLockModalOpen.value = false;
      } else {
        alert("Passwords do not match.");
      }
    };

    const closeLockModal = () => {
      isLockModalOpen.value = false;
    };

    const shareNote = () => {
      isShareModalOpen.value = true;
    };

    const shareNoteAction = () => {
      console.log("Note shared with email:", email.value);
      isShareModalOpen.value = false;
    };

    const closeShareModal = () => {
      isShareModalOpen.value = false;
    };

    const exportNote = () => {
      console.log("Note exported as PDF");
    };

    const deleteNote = () => {
      console.log("Note deleted");
    };

    return {
      noteText,
      noteTitle,
      selectedLanguage,
      isTranscribing,
      isSettingsMenuOpen,
      isLockModalOpen,
      isShareModalOpen,
      lockPassword,
      confirmLockPassword,
      email,
      toggleTranscription,
      saveNote,
      toggleSettingsMenu,
      lockNote,
      shareNote,
      exportNote,
      deleteNote,
      lockNoteAction,
      shareNoteAction,
      closeLockModal,
      closeShareModal
    };
  },
};
</script>

<style scoped>
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  font-family: 'Arial', sans-serif;
  background-color: #121212;
}

.main-container {
  display: flex;
  width: 75%;
  height: 100vh;
  padding: 20px;
}

.note-container {
  flex: 1;
  padding: 20px;
  background-color: rgba(17, 17, 17, 255);
  border-radius: 10px;
  text-align: center;
  position: relative;
}

.note-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.note-title {
  font-size: 24px;
  color: white;
  margin-bottom: 15px;
  margin-left:5%;
}

.settings-dropdown {
  position: relative;
}

.settings-button {
  background: none;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
}

.settings-menu {
  position: absolute;
  top: 30px;
  right: 0;
  background-color: #333;
  border-radius: 5px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  padding: 10px;
  display: flex;
  flex-direction: column;
  width: 220px;
}

.settings-option {
  background: none;
  color: white;
  border: none;
  padding: 12px 15px;
  text-align: left;
  cursor: pointer;
  transition: background-color 0.3s;
  width: 100%;
}

.settings-option:hover {
  background-color: #444;
}

.note-textarea {
  margin-top: 3%;
  margin-left: 3%;
  width: 90%;
  height: 50%;
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  resize: none;
  background-color: rgba(17, 17, 17, 255);
  color: white;
  font-size: 16px;
}

.transcription-settings {
  display: flex;
  align-items: center;
  margin-top: 10px;
}

.language-selector {
  margin-left: 10px;
}

.language-dropdown {
  padding: 5px;
  border-radius: 5px;
  border: 1px solid #ccc;
  background-color: #fff;
  color: #333;
}

.delete-option {
  color: rgb(212, 83, 83); 
}

.transcription-button {
  padding: 10px;
  border: none;
  border-radius: 5px;
  color: white;
  font-weight: 500;
  cursor: pointer;
  background-color: #28a745;
  width: 13%;
  margin-left: 5%;
}

.transcription-button.recording {
  background-color: #dc3545;
}

.transcription-button:hover {
  background-color: #218838;
}

.transcription-button.recording:hover {
  background-color: #c82333;
}

.transcription-button .fa {
  font-size: 24px;
}

.save-button {
  position: absolute;
  bottom: 20%;
  margin-left: 39%;
  transform: translateX(-50%);
  padding: 12px 24px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.save-button:hover {
  background-color: #0056b3;
}

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
  width: 400px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

.modal-input {
  width: 86%;
  padding: 10px;
  margin: 10px 0;
  border-radius: 5px;
  border: 1px solid #ccc;
}

.modal-button {
  width: 90%;
  padding: 10px;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin:2%;
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

.modal-button:hover {
  background-color: #218838;
}

.modal-button.lock-button:hover,
.modal-button.share-button:hover {
  background-color: #7c848d;
}

.modal-button.cancel-button:hover {
  background-color: #333;
}
</style>
