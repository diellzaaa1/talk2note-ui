import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

export function getUserIdFromToken() {
  const token = Cookies.get('authToken');
  console.log('Token:', token); 
  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.UserId; 

      return userId;
    } catch (error) {
      console.error('Error decoding token:', error); 
    }
  }
  return null;
}




export function removeToken() {
    Cookies.remove('authToken'); 
  }

  export function getToken() {
    return Cookies.get('authToken');  
  }

export function authorizeMiddleware  (to, from, next){
    const token = Cookies.get('authToken');
   
  
    if (to.path === '/' && token) {
      next('/main');
    } else if (to.meta.requiresAuth && !token) {    
      next('/');
    
    } else {
      next();
    }
  }
