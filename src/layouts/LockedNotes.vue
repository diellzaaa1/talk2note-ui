<template>
  <div class="locked-notes-page">
    <div class="header">
      <h2>Locked Notes</h2>
    </div>

    <div class="notes-row">
      <div
        v-for="note in lockedNotes"
        :key="note.id"
        :class="['note', { 'locked-note': note.isLocked }]"
      >
        <h3>{{ note.title }}</h3>

        <div v-if="note.password" class="locked-message">
          <i class="fas fa-lock"></i> Locked
        </div>

        <div v-else>
          <p>{{ note.description }}</p>
          <p class="date">{{ note.date }}</p>
        </div>

        <div class="actions">
          <button @click="viewNote(note)">
            <i :class="note.isLocked ? 'fas fa-unlock' : 'fas fa-eye'"></i>
            {{ note.password ? 'Unlock' : 'View' }}
          </button>
        </div>
      </div>
    </div>

    <PasswordModal
      :show="showPasswordModal"
      :currentNote="currentNote"
      @unlock-success="handleUnlockSuccess"
      @close-modal="closeModal"
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
      lockedNotes: [],
      showPasswordModal: false,
      currentNote: null,
    };
  },
  methods: {
    async fetchLockedNotes() {
      try {
        const userId = getUserIdFromToken();
        this.lockedNotes = await this.$store.dispatch(
          'note/fetchLockedNotesByUserId',
          userId
        );
        console.log('Fetched Locked Notes:', this.lockedNotes);
      } catch (error) {
        console.error('Error fetching locked notes:', error.message);
      }
    },
    viewNote(note) {
      this.currentNote = note;
      this.showPasswordModal = true;
    },
    handleUnlockSuccess(response) {
      console.log(response);
      this.navigateToNotePage(this.currentNote.noteId);
    },
    closeModal() {
      this.showPasswordModal = false;
      this.currentNote = null;
    },
    navigateToNotePage(id) {
      this.$router.push({ name: 'NoteCreation', params: { id } });
    },
  },
  mounted() {
    this.fetchLockedNotes();
  },
};
</script>

  
  <style scoped>
  .locked-notes-page {
    width: 75%;
    margin: 2%;
    padding: 20px;
    border-radius: 10px;
    /* background: #181818; */
  }
  
  .header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
    color: white;
  }
  
  .notes-row {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
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
  
  .note.locked-note {
    background: rgba(17, 17, 17, 255);
  }
  
  .note h3 {
    margin: 10px 0;
    font-size: 1.2em;
    color: white;
  }
  
  .note p {
    color: white;
  }
  
  .actions {
    display: flex;
    justify-content: flex-end;
    margin-top: 10px;
  }
  
  .actions button {
    background: rgba(17, 17, 17, 255);
    color: white;
    border: 1px solid white;
    padding: 8px 15px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 0.8em;
  }
  
  .actions button:hover {
    background: #b8c0bc;
    color:black;
  }
  
  .locked-message {
    font-size: 1.2em;
    color: #d05147;
    padding: 8px;
    background-color: rgba(213, 38, 25, 0.1);
    border-radius: 5px;
    display: flex;
    align-items: center;
  }
  
  .locked-message i {
    margin-right: 10px;
  }
  
  .date {
    color: #bbb;
    font-size: 0.8em;
  }
 
  </style>
  