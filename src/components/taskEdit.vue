<template>
  <div v-if="isVisible" class="modal-overlay" @click="closeModal">
    <div class="modal" @click.stop>
      <button class="close" @click="closeModal">✖</button>
      <h2 class="modal-title">Edit</h2>
      <form @submit.prevent="saveTask">
        <div class="form-group">
          <label for="task">Task</label>
          <input v-model="editedTask.title" type="text" id="title" class="task-input" />
        </div>
        <div class="form-group">
          <label for="description">Description</label>
          <input v-model="editedTask.description" type="text" id="description" class="task-input" />
        </div>
        <div class="form-group">
          <label for="dueDate">Due Date</label>
          <input v-model="editedTask.dueDate" type="date" id="dueDate" class="task-input" />
        </div>
        <div class="form-group">
          <button type="submit" class="submit-btn">Save</button>
          <button type="button" @click="closeModal" class="cancel-btn">Cancel</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    isVisible: {
      type: Boolean,
      required: true
    },
    taskToEdit: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      editedTask: { ...this.taskToEdit }
    };
  },
  methods: {
    closeModal() {
    this.$emit('close-modal');
  },
  saveTask() {
    this.$emit('save-task', this.editedTask);
    this.closeModal();  
  }
  },
  watch: {
    taskToEdit(newVal) {
      this.editedTask = { ...newVal }; 
    }
  }
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal {
  background: #f9f9f9;
  padding: 30px;
  border-radius: 12px;
  width: 400px;
  position: relative;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.3);
}

.close {
  position: absolute;
  top: 15px;
  right: 15px;
  background: transparent;
  border: none;
  font-size: 24px;
  cursor: pointer;
}

.modal-title {
  font-size: 24px;
  text-align: center;
  margin-bottom: 20px;
  color: #333;
}

.form-group {
  margin-bottom: 15px;
}

.task-input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.submit-btn {
  width: 100%;
  padding: 10px;
  border: none;
  border-radius: 5px;
  background-color: black;
  color: white;
  cursor: pointer;
  transition: background 0.3s;
}

.cancel-btn {
  width: 100%;
  padding: 10px;
  border: 1px solid black;
  border-radius: 5px;
  background-color: white;
  color: black;
  cursor: pointer;
  margin-top: 10px;
  transition: background 0.3s;
}
</style>
