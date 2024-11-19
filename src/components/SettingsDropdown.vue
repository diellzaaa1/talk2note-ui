<template>
    <div class="settings-dropdown">
      <button @click="toggleSettingsMenu" class="settings-button">
        <i class="fas fa-ellipsis-h"></i>
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
  </template>
  
  <script>
  export default {
    props: {
      isSettingsMenuOpen: Boolean,
      noteId: [Number, String]
 

    },
    methods: {
      toggleSettingsMenu() {
        this.$emit('toggle-settings');
      },
      lockNote() {
        this.$emit('lock-note');
      },
      shareNote() {
        this.$emit('share-note');
      },
      archiveNote() {
        this.$emit('archive-note');
      },
      exportNote() {
      this.$store.dispatch('note/exportNoteAsPdfAsync', this.noteId);
    },
    async deleteNote() {
      try {
        await this.$store.dispatch('note/deleteNoteAsync', this.noteId);
        
        this.$router.push('/main');
      } catch (error) {
        console.error("Error deleting note:", error);
      }
    }
    }
  }
  </script>
<style scoperd>
.settings-dropdown {
  position: relative;
}

.settings-button {
  background: none;
  border: none;
  color: white;
  font-size: 30px;
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
.delete-option {
  color: rgb(212, 83, 83); 
}
</style>  