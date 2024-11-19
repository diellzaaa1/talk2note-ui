<template>
  <div class="main-container">
    <div class="note-container">
      <div class="note-header">
        <div class="folder-selector">
          <i class="icon fas fa-folder"></i>
          <select v-model="selectedFolderId" class="folder-dropdown">
            <option value="" disabled selected>Folder</option>
            <option v-for="folder in folders" :key="folder.id" :value="folder.id">{{ folder.name }}</option>
          </select>
        </div>

        <input v-model="note.title" placeholder="" class="note-title-input" />
        <p class="note-date">{{ formattedDate }}</p>

        <div class="settings-wrapper">
          <button 
            @click="toggleTranscription" 
            class="transcription-button" 
            :class="{ 'recording': isTranscribing }">
            <i :class="isTranscribing ? 'fas fa-stop' : 'fas fa-microphone'" 
               :style="{ color: isTranscribing ? 'red' : 'lightgreen' }"></i>
            {{ isTranscribing ? 'Stop' : 'Transcribe' }}
          </button>
          <div class="language-selector">
            <select v-model="selectedLanguage" id="language" class="language-dropdown">
              <option value="en-US">in English</option>
              <option value="sq-AL">in Albanian</option>
            </select>
          </div>
          <SettingsDropdown 
            :noteId="noteId"
            :isSettingsMenuOpen="isSettingsMenuOpen"
            @toggle-settings="toggleSettingsMenu"
            @lock-note="lockNote"
            @share-note="shareNote"
            @archive-note="archiveNote"
            @export-note="exportNote"
            @delete-note="deleteNote"
          />
        </div>
      </div>

      <textarea 
        v-model="note.content"
        placeholder="..." 
        class="note-textarea"
      ></textarea>

      <button
        @click="noteId ? handleUpdateNote() : handleCreateNote()"
        :class="{'save-note': !noteId, 'save-changes': noteId}"
        class="save-button"
      >
        {{ noteId ? 'Save Changes' : 'Save Note' }}
      </button>

    </div>

    <LockNoteModal 
      :isOpen="isLockModalOpen" 
      :noteId="noteId" 
      :lockPassword="lockPassword"
      :confirmLockPassword="confirmLockPassword"
      @close="closeLockModal"
      @lock-note="lockNoteAction"
    />
    <ShareNoteModal 
      :isOpen="isShareModalOpen" 
      :noteId="noteId"  
      :userId="userId"  
      @close="closeShareModal"
      @share-note="shareNoteAction"
    />
  </div>
</template>
<script>
import { ref, onMounted, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
import LockNoteModal from './LockNote.vue';
import ShareNoteModal from './ShareNote.vue';
import SettingsDropdown from './SettingsDropdown.vue';
import * as signalR from '@microsoft/signalr';
import { mapGetters } from 'vuex';
import { getUserIdFromToken } from '@/utils/authUtils';

export default {
  components: {
    LockNoteModal,
    ShareNoteModal,
    SettingsDropdown,
  },
  computed: {
    ...mapGetters('transcription', ['isTranscribing', 'error']),
  },
  setup() {
    const store = useStore();
    const route = useRoute();

    const selectedLanguage = ref('');
    const isTranscribing = ref(false);
    const isSettingsMenuOpen = ref(false);
    const isLockModalOpen = ref(false);
    const isShareModalOpen = ref(false);
    const noteId = ref(route.params.id);
    const userId=getUserIdFromToken();
    const note = ref({ title: '', content: '', createdAt: '', folderId: '' });
    const selectedFolderId = ref('');
    const folders = ref([]);

    const setupSignalRConnection = async () => {
      const connection = new signalR.HubConnectionBuilder()
        .withUrl("http://localhost:5207/hubs/transcription")
        .configureLogging(signalR.LogLevel.Information)
        .build();

      try {
        await connection.start();
        console.log("SignalR connected.");

        connection.on("ReceiveTranscription", (transcription) => {
          note.value.content += transcription + " ";
        });
      } catch (error) {
        console.error("SignalR connection failed:", error);
      }
    };

    const toggleTranscription = async () => {
      isTranscribing.value = !isTranscribing.value;

      if (isTranscribing.value) {
        try {
          await store.dispatch('transcription/beginTranscription', selectedLanguage.value);
          console.log('Transcription started.', selectedLanguage.value);
        } catch (error) {
          console.error('Error starting transcription:', error);
        }
      } else {
        try {
          await store.dispatch('transcription/endTranscription');
          console.log('Transcription stopped.');
        } catch (error) {
          console.error('Error stopping transcription:', error);
        }
      }
    };

    const fetchFolders = async () => {
      try {
        const userId=getUserIdFromToken()
        const fetchedFolders = await store.dispatch('folder/fetchFoldersByUserId', userId);
        folders.value = fetchedFolders;
      } catch (error) {
        console.error('Failed to fetch folders:', error);
      }
    };

    const fetchNote = async () => {
      if (noteId.value) {
        try {
          const fetchedNote = await store.dispatch('note/fetchNoteById', noteId.value);
          note.value = fetchedNote;
          selectedFolderId.value = fetchedNote.folderId;
        } catch (error) {
          console.error('Failed to fetch note:', error);
        }
      }
    };


    const handleUpdateNote = async () => {
      const updatedNoteData = {
        noteId:noteId.value,
        title: note.value.title,
        content: note.value.content,
        folderId: selectedFolderId.value,

      };

      try {
        await store.dispatch('note/updateNoteAsync', {
          noteId: noteId.value,
          updatedNoteData,
        });
        console.log('Note updated successfully.');
      } catch (error) {
        console.error('Error updating note:', error);
      }
    };

    const handleCreateNote = async () => {
      const currentDate = new Date().toISOString();
      const userId = getUserIdFromToken();
      const noteData = {
          title: note.value.title,
          content: note.value.content,
          createdAt: currentDate,
          updatedAt: currentDate,
          userId: userId,
          folderId: selectedFolderId.value,
          isArchived: false,
        };
      console.log(noteData,userId)

      try {
        await store.dispatch('note/createNote', {
          noteData,
          userId,
        });
        console.log('Note created successfully.');
      } catch (error) {
        console.error('Error creating note:', error);
      }
    };

    const toggleSettingsMenu = () => {
      isSettingsMenuOpen.value = !isSettingsMenuOpen.value;
    };

    const lockNote = () => {
      isLockModalOpen.value = true;
    };

    const archiveNote = () => {
      store.dispatch('note/archiveNoteAsync', noteId.value); 
    };

    const closeLockModal = () => {
      isLockModalOpen.value = false;
    };

    const shareNote = () => {
      isShareModalOpen.value = true;
    };

    const shareNoteAction = () => {
      isShareModalOpen.value = false;
    };

    const closeShareModal = () => {
      isShareModalOpen.value = false;
    };

    onMounted(() => {
      fetchFolders();
      fetchNote();
      setupSignalRConnection();
    });

    watch(() => route.params.id, (newId) => {
      noteId.value = newId;
      fetchNote();
    });

    const formattedDate = computed(() => {
      const date = note.value.createdAt ? new Date(note.value.createdAt) : new Date();
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    });

    return {
      selectedLanguage,
      isTranscribing,
      isSettingsMenuOpen,
      isLockModalOpen,
      isShareModalOpen,
      note,
      selectedFolderId,
      folders,
      noteId,
      userId,
      formattedDate,
      toggleTranscription,
      fetchFolders,
      fetchNote,
      handleUpdateNote,
      handleCreateNote,
      lockNote,
      closeLockModal,
      closeShareModal,
      shareNoteAction,
      shareNote,
      toggleSettingsMenu,
      archiveNote
    };
  },
};
</script>


<style scoped>
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  /* font-family: 'Arial', sans-serif; */
  background-color: rgba(17, 17, 17, 255);
}

.main-container {
  display: flex;
  width: 75%;
  height: 100vh;
  padding: 20px;
}
.folder-selector {
  margin-top:-3%;
  margin-bottom:3%;
  margin-left:4%;
  position: relative;
  z-index: 5; 
}

.folder-dropdown {
  padding: 8px;
  border-radius: 5px;
  border: none;
  background-color: transparent;
  color: white;
  width: 200px;
  z-index: 10; 
  position: relative; 
}

.folder-dropdown option {
  background-color: rgba(17, 17, 17, 255);
  color: white; 

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
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  position: relative;
  width: 100%;
}

.settings-wrapper {
  position: absolute; 
  top: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 30px; 
  z-index: 8;   


}

.note-title-input {
  width: 25%;
  padding: 8px;
  font-size: 20px;
  margin-left:5%;
  color: white;
  background: transparent;
  border: none;
  border-bottom: 1px solid white;
  text-align: left;
}

.note-title-input::placeholder {
  color: grey;
}
.note-title-input:focus{
  outline:none;
  border-bottom:1px solid white;
}
.folder-dropdown:focus{
  outline:none;
  border-bottom:none;
}

.note-date {
  font-size: 14px;
  color: #aaa;
  margin-top: 1%;
  margin-left:5%;
}

.note-textarea {
  margin-top: 3%;
  width: 90%;
  height: 50%;
  padding: 1rem;
  border: none;
  background-color: rgba(17, 17, 17, 255);
  color: white;
  font-size: 16px;
  resize: none;
}

.note-textarea:focus{
  outline:none;
  border-bottom:none;
}
.icon {
  margin-right: 10px;
  color: white;
}

.language-dropdown {
  padding: 5px;
  border-radius: 5px;
  border: none;
  background-color: transparent;
  color: white;
  z-index: 10; 

}
.language-dropdown option{
  background-color: rgba(17, 17, 17, 255) ;
}

.transcription-button {
  padding: 10px;
  border: none;
  border-radius: 5px;
  /* font-size:15px; */
  color: white;
  font-weight: 500;
  cursor: pointer;
  background-color: transparent;
  border: none;
  width:120px;

}


.transcription-button .fa {
  font-size: 24px;
}

.transcription-button:hover {
  background-color: transparent;
}

.transcription-button.recording:hover {
  background-color: transparent;
}
.save-note {
  background-color: rgb(75, 165, 75);
}

.save-changes {
  background-color: #40a0ff;
}


.save-button {
  position: absolute;
  bottom: 20%;
  transform: translateX(-50%);
  padding: 12px 24px;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  width:15%;
}

.save-button:hover {
  background-color: #40a0ff;
}
</style>