<template>
    <div class="locked-notes-page">
      <div class="header">
        <h2>Locked </h2>
      </div>
  
      <div class="notes-row">
        <div
          v-for="note in filteredArchivedNotes"
          :key="note.id"
          :class="['note', { 'locked-note': note.isLocked }]"
        >
          <h3>{{ note.title }}</h3>
          
          <div v-if="note.isLocked" class="locked-message">
            <i class="fas fa-lock"></i> locked
          </div>
  
          <div v-else>
            <p>{{ note.description }}</p>
            <p class="date">{{ note.date }}</p>
          </div>
  
          <div class="actions">
            <button @click="viewNote(note)">
              <i :class="note.isLocked ? 'fas fa-unlock' : 'fas fa-eye'"></i>
              {{ note.isLocked ? 'Unlock' : 'View' }}
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
          { id: 1, title: 'Finish the task on the board', description: 'Remember to finish...', date: '22.01.2023', category: 'Business', archived: true, isLocked: true },
          { id: 2, title: 'Buy a new tea cup', description: 'Remember to buy a...', date: '21.01.2023', category: 'Home', archived: true, isLocked: true },
          { id: 3, title: 'Hang out with Marry', description: 'Hang out with Marry, Friday...', date: '20.01.2023', category: 'Personal', archived: true, isLocked: true },
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
      viewNote(note) {
        if (note.isLocked) {
          this.promptPassword(note);
        } else {
          alert(`Viewing note: ${note.title}\n${note.description}`);
        }
      },
      promptPassword(note) {
        const password = prompt('Enter password to view this note:');
        if (password === 'correctPassword') {
          note.isLocked = false;
          alert('Note unlocked!');
        } else {
          alert('Incorrect password.');
        }
      },
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
    background: #007bff;
  }
  
  .locked-message {
    font-size: 1.2em;
    color: #d52619;
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
  