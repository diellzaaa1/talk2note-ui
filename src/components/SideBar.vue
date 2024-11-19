<template>
  <div class="sidebar">
    <ul class="sidebar-list">
      <li class="sidebar-item">
        <div class="menu-item">
          <i class="icon fas fa-search"></i>
          <input type="text" v-model="searchQuery" placeholder="Quick Find" class="search-input" @input="onSearch" />
        </div>
      </li>

      <li class="sidebar-item add-folder">
        <button @click="openAddFolderModal" class="add-button">
          <i class="icon fas fa-plus"></i> Add Folder
        </button>
      </li>

      <li class="sidebar-item">
        <router-link :to="{ name: 'NoteCreation' }"  class="menu-item no-link"><i class="icon fas fa-plus"></i> Add Note </router-link>
      </li>

      <AddFolderModal
        :isVisible="isAddFolderModalVisible"
        :folders="folders"
        @add-folder="handleAddFolder"
        @close="closeAddFolderModal"
      />

      <li class="sidebar-item">
        <router-link :to="{ name: 'NoteToDo' }"  class="menu-item no-link">
          <i class="icon fas fa-tasks"></i> To-Do
        </router-link>
      </li>

      <li class="sidebar-item">
        <router-link :to="{ name: 'ArchivedNotes' }"  class="menu-item no-link">
          <i class="icon fas fa-archive"></i> Archived 
        </router-link>
      </li>

      <li class="sidebar-item">
        <router-link :to="{ name: 'LockedNotes' }"  class="menu-item no-link">
          <i class="icon fas fa-lock"></i> Locked 
        </router-link>
      </li>

      <li class="sidebar-item">
        <router-link :to="{ name: 'AllNotes' }"  class="menu-item no-link">
          <i class="icon fas fa-list"></i> All My Notes
        </router-link>
      </li>
     
      <!-- <li class="sidebar-item">
        <router-link to="tags" class="menu-item no-link">
          <i class="icon fas fa-tags"></i> Tags
        </router-link>
      </li> -->

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
        <ul v-if="folderNotes[folder.id]" class="nested-list">
  <li
    v-for="note in (folderNotes[folder.id] ?? []).filter(note => !note.isArchived)"
    :key="note.id"
    class="nested-item"
    @click="handleNoteClick(note)"
  >
    <i class="icon fas fa-file-alt"></i> {{ note.title }}
  </li>
</ul>


      </li>
    </ul>
          <PasswordModal
        :show="isModalVisible"
        :currentNote="currentNote"
        @unlock-success="redirectToNoteCreation"
        @close-modal="closeModal"
      />

  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex'; 
import AddFolderModal from './folderModal.vue'; 
import { useRouter } from 'vue-router';
import PasswordModal from '../components/UnlockNote.vue'
import { getUserIdFromToken } from '@/utils/authUtils';

export default {
  components: { AddFolderModal,PasswordModal }, 
  setup() {
    const router = useRouter();
    const store = useStore(); 
    const isModalVisible = ref(false);
    const isAddFolderModalVisible = ref(false);
    const currentNote=ref(null);
    const openFolders = ref({}); 
    const folderNotes = ref({}); 
    const searchQuery = ref('');

    
    const folders = computed(() => store.getters['folder/allFolders']);
    const userId = getUserIdFromToken();  

    onMounted(() => {
      store.dispatch('folder/fetchFoldersByUserId', userId); 
    });

    const filteredFolders = computed(() => {
      if (!searchQuery.value) return folders.value;
      return folders.value.filter(folder => 
        folder.name.toLowerCase().includes(searchQuery.value.toLowerCase()) || 
        folder.notes.some(note => note.title.toLowerCase().includes(searchQuery.value.toLowerCase()))
      );
    });

      function toggleFolder(folderId) {
    openFolders.value[folderId] = !openFolders.value[folderId];

    if (openFolders.value[folderId] && !folderNotes.value[folderId]) {
      store.dispatch('note/fetchNotesByFolderId', folderId)
        .then(notes => {
          folderNotes.value[folderId] = notes; 
        })
        .catch(error => {
          console.error('Error fetching notes:', error);
        });
    }
  }
      function handleNoteClick(note) {
        if (note.password) {
          currentNote.value = note; 
          console.log(currentNote.value)
          isModalVisible.value = true; 
        } else {
          redirectToNoteCreation(note);
        }
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

    // function handleAddNote(noteTitle, selectedFolder) {
    //   const folder = folders.value.find(f => f.name === selectedFolder);
    //   if (folder) {
    //     const noteId = folder.notes.length + 1;
    //     folder.notes.push({ id: noteId, title: noteTitle });
    //     closeModal();
    //     router.push({ name: 'NoteCreation', params: { title: noteTitle, content: '' } });
    //   }
    // }

    function handleAddFolder(folderName) {
      if (folderName) {
        store.dispatch('folder/createFolder', { name: folderName });  
        closeAddFolderModal();
      }
    }

    function redirectToNoteCreation(note) {
      console.log('Password is correct. Redirecting...');
      router.push({ name: 'NoteCreation', params: { id: note.noteId } });
  }






    return {
      openFolders,
      folderNotes,
      folders,
      toggleFolder,
      openModal,
      closeModal,
      currentNote,
      openAddFolderModal,
      closeAddFolderModal,
      // handleAddNote,
      handleAddFolder,
      redirectToNoteCreation,
      isModalVisible,
      isAddFolderModalVisible,
      searchQuery,
      filteredFolders,
      handleNoteClick
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
