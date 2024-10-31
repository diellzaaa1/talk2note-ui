import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../layouts/HomePage.vue'; 
// import SignupPage from '../views/SignupPage.vue'; // Import your signup page component

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage,
  }
//   {
//     path: '/signup',
//     name: 'Signup',
//     component: SignupPage,
//   },
  
];

const router = createRouter({
  history: createWebHistory(), // Use HTML5 history mode
  routes,
});

export default router;
