<template>
  <div class="notes-page">
    <div class="header">
      <input type="text" v-model="searchQuery" placeholder="Search" class="search-bar" />
    </div>

    <div class="filters">
      <button
        :class="{ active: activeFilter === null }"
        @click="setFilter(null)"
      >
        All
      </button>

      <button
        v-for="folder in folders"
        :key="folder.id"
        :class="{ active: activeFilter === folder.id }"
        @click="setFilter(folder)"
      >
        {{ folder.name }}
      </button>
    </div>

    <div class="notes-row">
      <div
        v-for="note in filteredNotes"
        :key="note.noteId"
        class="note"
      >
        <span
          class="category-label"
        >
          {{ getFolderName(note.folderId) }}
        </span>

        <h3>{{ note.title }}</h3>

        <div v-if="note.password">
          <p v-if="note.password" class="locked-message1">This note is locked.</p>
        </div>
        <div v-else>
          <p class="content">{{ previewContent(note.content) }}</p>
        </div>

        <p v-if="!note.password" class="date">{{ formatDate(note.createdAt) }}</p>
        <div class="actions">
          <button @click="handleNoteAction(note)">
        <i :class="note.password ? 'fas fa-eye' : 'fas fa-file-alt'"></i>
      </button>
        </div>
      </div>
    </div>

    <PasswordModal
      v-if="showPasswordModal"
      :show="showPasswordModal"
      :currentNote="currentNote"
      @close-modal="closePasswordModal"
      @unlock-success="handleUnlockSuccess"
    />
  </div>
</template>

<script>
import PasswordModal from '../components/UnlockNote.vue';  
import { getUserIdFromToken } from '@/utils/authUtils';

export default {
  components: {
    PasswordModal,
  },
  data() {
    return {
      searchQuery: '',
      activeFilter: null,
      folders: [],
      notes: [],
      showPasswordModal: false,
      currentNote: null,
    };
  },
  computed: {
    filteredNotes() {
      return this.notes.filter(note => {
        const matchesSearch = note.title.toLowerCase().includes(this.searchQuery.toLowerCase());
        const matchesFolder = this.activeFilter === null || note.folderId === this.activeFilter;
        return matchesSearch && matchesFolder;
      });
    },
  },
  methods: {
    async fetchNotes() {
      try {
        const userId = getUserIdFromToken();
        const notes = await this.$store.dispatch('note/fetchNotesByUserId', userId);
        this.notes = notes;
        console.log('Fetched Notes:', this.notes);
      } catch (error) {
        console.error('Error fetching notes:', error.message);
      }
    },
    async fetchFolders() {
      try {
        const userId = getUserIdFromToken();
        const folders = await this.$store.dispatch('folder/fetchFoldersByUserId', userId);
        this.folders = folders;
        console.log('Fetched Folders:', this.folders);
      } catch (error) {
        console.error('Error fetching folders:', error.message);
      }
    },
    handleNoteAction(note) {
      if (note.password) {
        this.openPasswordModal(note);
      } else {
        this.viewNote(note.noteId);
      }
    },
    setFilter(folder) {
      this.activeFilter = folder === null ? null : folder.id;
    },
    viewNote(id) {
      console.log(id);
      this.$router.push({ name: 'NoteCreation', params: { id } });
    },
    getFolderName(folderId) {
      const folder = this.folders.find(f => f.id === folderId);
      return folder ? folder.name : 'No Folder';
    },
    formatDate(date) {
      const parsedDate = new Date(date);
      return parsedDate.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    },
    previewContent(content) {
      const maxLength = 100;
      if (content.length > maxLength) {
        return content.slice(0, maxLength) + '...';
      }
      return content;
    },
    openPasswordModal(note) {
      this.currentNote = note;
      console.log(this.currentNote);
      this.showPasswordModal = true;
    },
    closePasswordModal() {
      this.showPasswordModal = false;
      this.selectedNote = null;
    },
    handleUnlockSuccess(response) {
      this.currentNote = response;
      console.log(response);
      this.navigateToNotePage(this.currentNote.noteId);
    },
    navigateToNotePage(id) {
      this.$router.push({ name: 'NoteCreation', params: { id } });
    },
  },
  mounted() {
    this.fetchNotes();
    this.fetchFolders();
  },
};
</script>

<style scoped>
.notes-page {
  width: 75%;
  margin: 2%;
  padding: 20px;
  border-radius: 10px;
}

.header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.search-bar {
  width: 70%;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #f0f0f0;
  background-color: rgba(17, 17, 17, 255);
  color: white;
}

.filters {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.filters button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 5px 10px;
  color: white;
}

.filters .active {
  font-weight: bold;
  text-decoration: underline;
}

.notes-row {
  display: flex;
  overflow-x: auto;
  flex-wrap: wrap;
  gap: 30px;
}

.note {
  background: rgba(17, 17, 17, 255);
  border: 2px solid #333;
  border-radius: 5px;
  flex: 1 1 30%;
  min-width: 250px;
  max-width: 300px;
  padding: 15px;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1);
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.note h3 {
  margin: 10px 0;
  font-size: 1.1em;
  color: white;
}

.content {
  color: white;
}

.category-label {
  font-size: 0.8em;
  font-weight: bold;
  color: black;
  border-radius: 10px;
  background-color: white;
  padding: 3px 8px;
  align-self: flex-start;
}

.folder-name {
  font-size: 0.8em;
  color: white;
  margin-left: 10px;
}

.date {
  font-size: 0.8em;
  color: white;
  margin-top: 10px;
}

.actions {
  display: flex;
  align-self: flex-end;
  gap: 10px;
  margin-top: 10px;
}

.actions button {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.2em;
  color: white;
}

.locked-message1 {
  margin-top: 10px;
  color: #e74c3c; 
  font-weight: bold;
  font-size: 14px;
}
</style>
