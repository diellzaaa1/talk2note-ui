<template>
  <div class="archived-notes-page">
    <div class="header">
      <h2>Archived</h2>
    </div>

    <div class="notes-row">
      <div
        v-for="note in archivedNotes"
        :key="note.noteId"
        class="note"
      >
        <!-- <span
          class="category-label"
          :style="{ backgroundColor: getCategoryColor(note.category) }"
        >
          {{ note.category }}
        </span> -->
        <h3>{{ note.title }}</h3>
        <div v-if="note.password">
          <p v-if="note.password" class="locked-message1">This note is locked.</p>
        </div>
        <div v-else>
          <p class="content">{{ previewContent(note.content) }}</p>
        </div>
        <p class="date">{{ formatDate(note.createdAt) }}</p>
        <div class="actions">
          <button @click="handleNoteAction(note)">
            <i :class="note.password ? 'fas fa-eye' : 'fas fa-file-alt'"></i>
          </button>
          <button @click="restoreNote(note.noteId)">
            <i class="fas fa-undo"></i>
          </button>
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
      archivedNotes: [], 
      showPasswordModal: false,
      currentNote: null,
    };
  },
  methods: {
  async fetchArchivedNotes() {
    try {
      const userId = getUserIdFromToken();
      this.archivedNotes = await this.$store.dispatch('note/fetchArchivedNotesByUserId', userId);
      console.log('Fetched Archived Notes:', this.archivedNotes); 
    } catch (error) {
      console.error('Error fetching archived notes:', error.message);
    }
  },

  handleNoteAction(note) {
      if (note.password) {
        this.openPasswordModal(note);
      } else {
        this.navigateToNotePage(note.noteId);
      }
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
  
  formatDate(date) {
    const parsedDate = new Date(date);
    return parsedDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })},

    previewContent(content) {
    const maxLength = 100; 
    if (content.length > maxLength) {
      return content.slice(0, maxLength) + '...';
    }
    return content;
  },

  getCategoryColor(category) {
    const categoryColors = {
      Business: '#4CAF50',
      Home: '#FF9800',
      Personal: '#2196F3',
    };
    return categoryColors[category] || '#999';
  },
},

mounted() {
  this.fetchArchivedNotes(); 
} }
</script>

<style scoped>
.archived-notes-page {
  width: 75%;
  margin: 2%;
  padding: 20px;
  border-radius: 10px;
}

.header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  color: white;
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

.note p {
  color: white;
}

.category-label {
  font-size: 0.8em;
  color: #f0f0f0;
  border-radius: 10px;
  padding: 3px 8px;
  align-self: flex-start;
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
</style>
