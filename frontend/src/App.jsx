import logo from './logo.svg';
import './App.css';
import LoginSignup from './Components/LoginSignup/LoginSignup';
import {Route,  BrowserRouter, Routes, Navigate, Outlet } from 'react-router-dom';
import Layout from './Layout';
import Home from './Components/Home/Home';
import About from './Components/About/About';
import Cookies from 'js-cookie';
import axios from 'axios';
import Dashboard from './Admin/Components/Dashboard';
import Portal from './Admin/Components/Portal';
import UserCreate from './Admin/Components/UserCreate';
import UserList from './Admin/Components/Userlist';
import TopicCreate from './Admin/Components/TopicCreate';
import Topics from './Components/Topics/Topics';
import MyCourses from './Components/MyCourses/MyCourses'
import { jwtDecode } from 'jwt-decode';
import Courses from './Components/Courses/Courses';
import Profile from './Components/Profile/Profile'



const PrivateRoute = ({ children, role }) => {
  const token = Cookies.get('token');
  console.log("Token:", token);

  if (!token) {
    console.log("No token found. Redirecting to login.");
    return <Navigate to='/login' />;
  }

  try {
    const decoded = jwtDecode(token);
    console.log("Decoded Token:", decoded);
    if (role && decoded.role !== role) {
      console.log(`Role mismatch: expected ${role}, got ${decoded.role}. Redirecting to login.`);
      return <Navigate to='/login' />;
    }
    
    console.log("Role matched. Rendering children.");
    return children;
  } catch (error) {
    console.error("Error decoding token:", error);
    return <Navigate to='/login' />;
  }
};

function App() {
  const renderAdminRoutes = () => (
    <Route path='/portal' element={<PrivateRoute role="admin"><Portal /></PrivateRoute>}>
      <Route path='dashboard' element={<Dashboard />} />
      <Route path='user-list' element={<UserList />} />
      <Route path='create-user' element={<UserCreate />} />
      <Route path='create-topic' element={<TopicCreate />} />  
    </Route>
  );

  const renderUserRoutes = () => (
    <Route path='/' element={<PrivateRoute role="user"><Layout /></PrivateRoute>}>
      <Route path='profile' element={<Profile />} /> 
    </Route>
  );
  return (
    <BrowserRouter basename='/'>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index element={<Home />} />
          <Route path='about' element={<About />} />
          <Route path='login' element={<LoginSignup />} />
          <Route path='courses' element={<Courses/>}/>
          <Route path='topics' element={<Topics/>}/>
          <Route path='mycourses' element={<MyCourses />} />
          {/* Render admin and user routes */}
          {renderAdminRoutes()}
          {renderUserRoutes()}
        </Route>
      </Routes>
    </BrowserRouter>
   
  );
}

export default App;
