<template>
    <div class="archived-notes-page">
      <div class="header">
        <h2>Archived</h2>
      </div>
  
      <div class="notes-row">
        <div
          v-for="note in filteredArchivedNotes"
          :key="note.id"
          class="note"
        >
          <span
            class="category-label"
            :style="{ backgroundColor: getCategoryColor(note.category) }"
          >
            {{ note.category }}
          </span>
          <h3>{{ note.title }}</h3>
          <p>{{ note.description }}</p>
          <p class="date">{{ note.date }}</p>
          <div class="actions">
            <button @click="viewNote(note.id)">
              <i class="fas fa-file-alt"></i>
            </button>
            <button @click="restoreNote(note.id)">
              <i class="fas fa-undo"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  
  
  <script>
  export default {
    data() {
      return {
        searchQuery: '',
        activeFilter: 'ALL',
        filters: ['ALL', 'PERSONAL', 'HOME', 'BUSINESS'],
        archivedNotes: [
          { id: 1, title: 'Finish the task on the board', description: 'Remember to finish...', date: '22.01.2023', category: 'Business', archived: true },
          { id: 2, title: 'Buy a new tea cup', description: 'Remember to buy a...', date: '21.01.2023', category: 'Home', archived: true },
          { id: 3, title: 'Hang out with Marry', description: 'Hang out with Marry, Friday...', date: '20.01.2023', category: 'Personal', archived: true },
          // Add more archived notes here
        ],
      };
    },
    computed: {
      filteredArchivedNotes() {
        return this.archivedNotes.filter(note => {
          const matchesSearch = note.title.toLowerCase().includes(this.searchQuery.toLowerCase());
          const matchesCategory = this.activeFilter === 'ALL' || note.category === this.activeFilter;
          return matchesSearch && matchesCategory;
        });
      },
    },
    methods: {
      viewNote(id) {
        const note = this.archivedNotes.find(note => note.id === id);
        if (note) {
          alert(`Viewing note: ${note.title}\n${note.description}`);
        }
      },
      restoreNote(id) {
        const note = this.archivedNotes.find(note => note.id === id);
        if (note) {
          alert(`Restoring note: ${note.title}`);
          note.archived = false;
        }
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
  };
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
  color:white;
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
  color:white;
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
