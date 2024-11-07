<template>
  <div class="container">
    <div class="header">
      <div class="filters">
        <input v-model="searchQuery" placeholder="Search tasks..." class="search-bar" />
        <div class="filter-options">
          <select @change="applyFilter($event)" class="filter-dropdown">
            <option value="Done">Show Done</option>
            <option value="To Do">Show To Do</option>
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
      <div class="column task-column">{{ item.task }}</div>
      <div class="column description-column">{{ item.description }}</div>
      <div class="column status-column">
        <span :class="statusClass(item)">{{ item.status }}</span>
      </div>
      <div class="column due-date-column">{{ item.dueDate }}</div>
      <div class="column action-column">
        <button @click="toggleStatus(index)" class="action-icon done-icon">✓</button>
        <button @click="openEditModal(index)" class="action-icon edit-icon">
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

export default {
  components: {
    EditTaskModal
  },
  data() {
    return {
      searchQuery: '',
      newTask: '',
      newDescription: '',
      newDueDate: '',
      items: [
        { id: 1, task: 'Task 1', description: 'Description 1', status: 'Done', dueDate: '2022-01-31', checked: false },
        { id: 2, task: 'Task 2', description: 'Description 2', status: 'To Do', dueDate: '2022-02-28', checked: false }
      ],
      filteredItems: [],
      isEditModalVisible: false,
      taskToEdit: {} 
    };
  },
  mounted() {
    this.filteredItems = this.items;
  },
  computed: {
    filteredAndSortedItems() {
      return this.filteredItems.filter(item =>
        item.task.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
  },
  methods: {
    applyFilter(event) {
      const status = event.target.value;
      if (status) {
        this.filteredItems = this.items.filter(item => item.status === status);
      }
    },
    clearFilters() {
      this.filteredItems = this.items;
      this.searchQuery = '';
    },
    toggleStatus(index) {
      const item = this.filteredItems[index];
      item.status = item.status === 'Done' ? 'To Do' : 'Done';
    },
    openEditModal(item) {
      this.isEditModalVisible = true;
      this.taskToEdit = { ...item }; 
    },
    closeEditModal() {
      this.isEditModalVisible = false;
      this.taskToEdit = {}; 
    },
    saveTask(updatedTask) {
      const taskIndex = this.filteredItems.findIndex(task => task.id === updatedTask.id);
      if (taskIndex !== -1) {
        this.$set(this.filteredItems, taskIndex, updatedTask); 
        this.closeEditModal(); 
      }
    },
    deleteTask(index) {
      this.items.splice(index, 1);
    },
    statusClass(item) {
      const today = new Date().toISOString().slice(0, 10);
      return item.status === 'Done' ? 'status-done' : (item.dueDate < today ? 'status-overdue' : 'status-to-do');
    }
  }
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

.status-to-do {
  color: #007bff;
}

.status-overdue {
  color: #dc3545;
}

.done-icon {
  color: #28a745;
  font-size: 1.7em;
  font-weight: bolder;
}
</style>
