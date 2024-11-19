import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '@/layouts/HomePage.vue'; 
import MainPage from '@/layouts/MainPage.vue';
import NoteCreation from '@/components/NoteContent.vue';
import NoteToDo from '@/layouts/NoteToDo.vue';
import AllNotes from '@/layouts/AllNotes.vue';
import ArchivedNotes from '@/layouts/ArchivedNotes.vue';
import LockedNotes from '@/layouts/LockedNotes.vue';
import { authorizeMiddleware } from '@/utils/authUtils';
const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage,
  },
  {
    path: '/main',
    name: 'MainPage',
    component: MainPage,
    redirect: '/main/allNotes',
    meta: { requiresAuth: true } , 
    children: [
      {
        path: 'note/:id?', 
        name: 'NoteCreation',
        component: NoteCreation,
      }
,      
      {
        path: 'noteToDo',
        name: 'NoteToDo',
        component: NoteToDo

      },
      {
        path: 'allNotes',
        name: 'AllNotes',
        component: AllNotes

      },
      {
        path: 'archived',
        name: 'ArchivedNotes',
        component: ArchivedNotes

      },
      {
        path: 'locked',
        name: 'LockedNotes',
        component: LockedNotes

      }
    ]
  },
];

const router = createRouter({
  history: createWebHistory(), 
  routes,
});

router.beforeEach(authorizeMiddleware)

export default router;
