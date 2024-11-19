import { createStore } from 'vuex'; 
import folder from './modules/folder';
import note from './modules/note';
import noteToDo from './modules/noteToDo';
import transcription from './modules/transcription';
import user from './modules/user';

const store = createStore({
  modules: {
    folder, 
    note,
    noteToDo,
    transcription,
    user
  },
});

export default store;
