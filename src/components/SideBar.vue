<template>
  <div class="sidebar">
    <ul class="sidebar-list">
      <!-- Search bar -->
      <li class="sidebar-item">
        <div class="menu-item">
          <i class="icon fas fa-search"></i>
          <input type="text" v-model="searchQuery" placeholder="Quick Find" class="search-input" @input="onSearch" />
        </div>
      </li>

      <!-- Add Folder Button -->
      <li class="sidebar-item add-folder">
        <button @click="openAddFolderModal" class="add-button">
          <i class="icon fas fa-plus"></i> Add Folder
        </button>
      </li>

      <!-- Add Note Button -->
      <li class="sidebar-item">
        <button class="add-button" @click="openModal"><i class="icon fas fa-plus"></i> Add Note</button>
      </li>

      <AddNoteModal
        :isVisible="isModalVisible"
        :folders="folders"
        @add-note="handleAddNote"
        @close="closeModal"
      />
      <AddFolderModal
        :isVisible="isAddFolderModalVisible"
        :folders="folders"
        @add-folder="handleAddFolder"
        @close="closeAddFolderModal"
      />

      <li class="sidebar-item">
        <router-link to="noteToDo" class="menu-item no-link">
          <i class="icon fas fa-tasks"></i> To-Do
        </router-link>
      </li>

      <li class="sidebar-item">
        <router-link to="archived" class="menu-item no-link">
          <i class="icon fas fa-archive"></i> Archived Notes
        </router-link>
      </li>

      <li class="sidebar-item">
        <router-link to="locked" class="menu-item no-link">
          <i class="icon fas fa-lock"></i> Locked Notes
        </router-link>
      </li>

      <li class="sidebar-item">
        <router-link to="allNotes" class="menu-item no-link">
          <i class="icon fas fa-list"></i> All My Notes
        </router-link>
      </li>
     

      <li class="sidebar-item">
        <router-link to="tags" class="menu-item no-link">
          <i class="icon fas fa-tags"></i> Tags
        </router-link>
      </li>

      <!-- Folders Section -->
      <li class="sidebar-item">
        <div class="menu-item">
          <strong>Folders</strong>
        </div>
      </li>

      <li
        v-for="folder in filteredFolders"
        :key="folder.id"
        class="sidebar-item"
        @click="toggleFolder(folder.id)"
      >
        <div class="folder-item">
          <i class="icon fas fa-folder"></i> {{ folder.name }} 
        </div>
        <ul v-if="openFolders[folder.id]" class="nested-list">
          <li v-for="note in folder.notes" :key="note.id" class="nested-item" @click="redirectToNoteCreation(note.title)">
            <i class="icon fas fa-file-alt"></i> {{ note.title }} 
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>


<script>
import { reactive, ref, computed } from 'vue';
import AddNoteModal from './AddNote.vue';
import AddFolderModal from './folderModal.vue'; 
import { useRouter } from 'vue-router';

export default {
  components: { AddNoteModal, AddFolderModal }, 
  setup() {
    const router = useRouter();
    const isModalVisible = ref(false);
    const isAddFolderModalVisible = ref(false);
    const openFolders = reactive({});
    const searchQuery = ref('');

    const folders = reactive([
      {
        id: 'dailyNotes',
        name: 'Daily Notes',
        notes: [
          { id: 1, title: '10 November' },
          { id: 2, title: '11 November' },
        ],
      },
      {
        id: 'designNotes',
        name: 'Design Notes',
        notes: [
          { id: 3, title: 'UI Concepts' },
          { id: 4, title: 'Brand Guidelines' },
        ],
      },
      {
        id: 'importantNotes',
        name: 'Important Notes',
        notes: [
          { id: 5, title: 'Meeting Notes' },
        ],
      },
      {
        id: 'journal',
        name: 'Journal',
        notes: [
          { id: 6, title: 'Daily Reflections' },
        ],
      },
    ]);

    const filteredFolders = computed(() => {
      if (!searchQuery.value) return folders;
      return folders.filter(folder => 
        folder.name.toLowerCase().includes(searchQuery.value.toLowerCase()) || 
        folder.notes.some(note => note.title.toLowerCase().includes(searchQuery.value.toLowerCase()))
      );
    });

    function toggleFolder(folderId) {
      openFolders[folderId] = !openFolders[folderId];
    }

    function openModal() {
      isModalVisible.value = true;
    }

    function closeModal() {
      isModalVisible.value = false;
    }

    function openAddFolderModal() {
      isAddFolderModalVisible.value = true; 
    }

    function closeAddFolderModal() {
      isAddFolderModalVisible.value = false; 
    }

    function handleAddNote(noteTitle, selectedFolder) {
      const folder = folders.find(f => f.name === selectedFolder);
      if (folder) {
        const noteId = folder.notes.length + 1;
        folder.notes.push({ id: noteId, title: noteTitle });
        closeModal();
        router.push({ name: 'NoteCreation', params: { title: noteTitle, content: '' } });
      }
    }

    function handleAddFolder(folderName) {
      if (folderName) {
        folders.push({ id: folderName, name: folderName, notes: [] });
        closeAddFolderModal();
      }
    }

    function redirectToNoteCreation(noteTitle) {
      router.push({ name: 'NoteCreation', params: { title: noteTitle, content: '' } });
    }

    function onSearch() {
    
    }

    return {
      openFolders,
      folders,
      toggleFolder,
      openModal,
      closeModal,
      openAddFolderModal,
      closeAddFolderModal,
      handleAddNote,
      handleAddFolder,
      redirectToNoteCreation,
      isModalVisible,
      isAddFolderModalVisible,
      searchQuery,
      filteredFolders,
      onSearch,
    };
  },
};
</script>


<style scoped>
.sidebar {
  width: 225px;
  background-color: #2f3136;
  color: #ffffff;
  height: 100vh;
  padding: 20px;
  display: flex;
  flex-direction: column;
}

.sidebar-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.sidebar-item {
  padding: 10px;
  color: #b9bbbe;
  cursor: pointer;
  transition: background-color 0.3s;
}

.sidebar-item:hover {
  background-color: #40444b;
  border-radius: 4px;
}

.menu-item, .add-button {
  display: flex;
  align-items: center;
  text-decoration: none;
}

.no-link {
  text-decoration: none; 
  color: inherit; 
}

.add-button {
  background: none;
  border: none;
  color: #b9bbbe;
  cursor: pointer;
  font-size: 14px;
  padding: 0;
  width: 100%;
}

.add-button:hover {
  color: white;
}

.folder-item {
  margin-left: 3%;
}

.icon {
  margin-right: 10px;
  color: white;
}

.nested-list {
  list-style: none;
  padding-left: 20px;
  margin-top: 5px;
}

.nested-item {
  padding: 8px 0;
  color: #dcdcdc;
  display: flex;
  align-items: center;
  cursor: pointer;
}

.nested-item:hover {
  color: white;
}

.search-input {
  background-color: transparent;
  border: none;
  color: white;
  outline: none;
  width: 100%;
  padding-left: 10px;
  font-size: 14px;
}
</style>
