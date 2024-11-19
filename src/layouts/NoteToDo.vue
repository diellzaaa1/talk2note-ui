<template>
  <div class="container">
    <div class="header">
      <div class="filters">
        <input v-model="searchQuery" placeholder="Search tasks..." class="search-bar" />
        <div class="filter-options">
          <select @change="applyFilter($event)" class="filter-dropdown">
          <option value="">Select Status</option>
          <option value="Done">Show Done</option>
          <option value="To Do">Show To Do</option>
          <option value="Overdue">Show Overdue</option>
        </select>

          <button @click="clearFilters" class="filter-button">Clear Filter</button>
        </div>
      </div>
    </div>

    <div class="add-task">
      <input v-model="newTask" placeholder="New Task" class="task-input" />
      <input v-model="newDescription" placeholder="Description" class="task-input" />
      <input v-model="newDueDate" type="date" class="task-input" />
      <button @click="addTask" class="add-task-button">Add Task</button>
    </div>

    <div class="table-header">
      <div class="column task-column">Task</div>
      <div class="column description-column">Description</div>
      <div class="column status-column">Status</div>
      <div class="column due-date-column">Due Date</div>
      <div class="column action-column">Actions</div>
    </div>

    <div v-for="(item, index) in filteredAndSortedItems" :key="index" class="table-row">
      <div class="column task-column">{{ item.title }}</div>
      <div class="column description-column">{{ item.description }}</div>
      <div class="column status-column">
       <span :class="statusClass(item)">
  {{ getStatusText(item) }}
</span>


      </div>
      <div class="column due-date-column">{{ formatDate(item.dueDate) }}</div>
      <div class="column action-column">
        <button @click="toggleStatus(index)" class="action-icon done-icon">✓</button>
        <button @click="openEditModal(item)" class="action-icon edit-icon">
          <i class="fas fa-pen"></i>
        </button>
        <button @click="deleteTask(index)" class="action-icon delete-icon">❌</button>
      </div>
    </div>
    <EditTaskModal 
      :isVisible="isEditModalVisible"
        :taskToEdit="taskToEdit"
        @close-modal="closeEditModal"
        @save-task="saveTask"
    />
  </div>
</template>

<script>
import EditTaskModal from '../components/taskEdit.vue';
import { getUserIdFromToken } from '@/utils/authUtils';

export default {
  components: {
    EditTaskModal,
  },
  data() {
    return {
      todayDate: new Date().toISOString().slice(0, 10), 
      searchQuery: '',
      newTask: '',
      newDescription: '',
      newDueDate: '',
      filteredItems: [], 
      isEditModalVisible: false,
      taskToEdit: {},
    };
  },
  computed: {
    filteredAndSortedItems() {
      return (this.filteredItems || []).filter(item =>
        item.title.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
    userId() {
      return getUserIdFromToken();
    },
  },
  methods: {
    async fetchTasks() {
      try {
        const tasks = await this.$store.dispatch('noteToDo/fetchNoteToDosByUserId', this.userId);
        this.filteredItems = tasks || [];
      } catch (error) {
        console.error('Error fetching tasks:', error);
        this.filteredItems = []; 
      }
    },
    applyFilter(event) {
  const status = event.target.value;
  if (status) {
    if (status === 'Done') {
      this.filteredItems = this.filteredItems.filter(item => item.isCompleted === true);
    } else if (status === 'To Do') {
      this.filteredItems = this.filteredItems.filter(item => item.isCompleted === false && this.todayDate < item.dueDate);
    } else if (status === 'Overdue') {
      this.filteredItems = this.filteredItems.filter(item => !item.isCompleted && this.todayDate > item.dueDate);
    }
  }
},

    clearFilters() {
      this.fetchTasks();
      this.searchQuery = '';
    },
    async addTask() {
      if (!this.newTask || !this.newDescription || !this.newDueDate) {
        alert('Please fill in all fields.');
        return;
      }

      const newTask = {
        title: this.newTask,
        description: this.newDescription,
        dueDate: this.newDueDate,
        userId: this.userId,
      };

      try {
        await this.$store.dispatch('noteToDo/createNoteToDo', newTask);
        this.fetchTasks();
        this.newTask = '';
        this.newDescription = '';
        this.newDueDate = '';
      } catch (error) {
        console.error('Error adding task:', error);
      }
    },
    async deleteTask(index) {
      const task = this.filteredItems[index];
      try {
        await this.$store.dispatch('noteToDo/deleteNoteToDo', task.id);
        this.fetchTasks();
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    },
    async toggleStatus(index) {
      const task = this.filteredItems[index]; 
      const isCompleted = true; 

      try {
        await this.$store.dispatch('noteToDo/updateCompletionStatus', {
          id: task.id,        
          isCompleted,
        });
        this.fetchTasks();
      } catch (error) {
        console.error('Error toggling task status:', error);
      }
    },
    openEditModal(item) {
      this.isEditModalVisible = true;
      this.taskToEdit = { ...item };
    },
    closeEditModal() {
      this.isEditModalVisible = false;
      this.taskToEdit = {};
    },
    async saveTask(updatedTask) {
      try {
        await this.$store.dispatch('noteToDo/updateNoteToDo', updatedTask);
        this.fetchTasks();  
        this.closeEditModal();
      } catch (error) {
        console.error('Error saving task:', error);
      }
    },
    getStatusText(item) {
    if (item.isCompleted) {
      return 'Done'; 
    } else if (this.todayDate > item.dueDate) {
      return 'Overdue'; 
    } else {
      return 'To Do'; 
    }
  },

  statusClass(item) {
    if (item.isCompleted) {
      return 'status-done'; 
    } else if (this.todayDate > item.dueDate) {
      return 'status-overdue';
    } else {
      return 'status-to-do';
    }
  },
    formatDate(date) {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      const formattedDate = new Date(date).toLocaleDateString('en-GB', options);
      return formattedDate;
    },
  },
  mounted() {
    this.fetchTasks();
  },
};
</script>

<style scoped>
.container {
  width: 75%;
  max-width: 1200px;
  padding: 20px;
  background-color: #121212;
  border-radius: 10px;
  /* box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4); */
  color: #ffffff;
}

.filters {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
}

.search-bar {
  padding: 10px;
  border: 1px solid #444444;
  border-radius: 20px;
  background-color: #1e1e1e;
  color: #ffffff;
  width: 50%;
}

.filter-options {
  display: flex;
  gap: 10px;
  align-items: center;
}

.filter-dropdown {
  padding: 10px;
  border: none;
  border-radius: 5px;
  background-color: #333333;
  color: #ffffff;
  cursor: pointer;
}

.filter-dropdown option {
  background-color: #444444;
  color: #ffffff;
}

.filter-button {
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  background-color: #6c757d; 
  color: #ffffff;
  /* font-weight: bold; */
  cursor: pointer;
  transition: all 0.3s ease;
}

.add-task {
  margin-top:2%;
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  width: 100%;
  justify-content: flex-start;
}

.task-input {
  padding: 8px;
  border: 1px solid #444444;
  border-radius: 5px;
  background-color: #1e1e1e;
  color: #ffffff;
  width: 308px; 
}

.add-task-button {
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  background-color: #40a0ff;
  color: #ffffff;
  /* font-weight: bold; */
  width: 13%;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-left: 10px; 
}

.table-header, .table-row {
  display: flex;
  justify-content: space-between;
  padding: 10px;
  /* height: 7%; */
  border-bottom: 2px solid #2f3136; 
}


.column {
  flex: 1;
  padding: 10px;
}

.action-column {
  display: flex;
  gap: 10px;
  justify-content: center;
}

.action-icon {
  background: none;
  border: none;
  font-size: 1.2em;
  padding: 2%;
  cursor: pointer;
}

.edit-icon .fas {
  color: #6c757d; 
  font-size: 1.2em;
}

.delete-icon {
  color: #dc3545;
  font-size: 1.3em;
  font-weight: bold;
}

.status-done {
  color: #28a745; 
}

.status-overdue {
  color: red; 
}

.status-to-do {
  color: #40a0ff; 
}


.done-icon {
  color: #28a745;
  font-size: 1.7em;
  font-weight: bolder;
}
</style>
