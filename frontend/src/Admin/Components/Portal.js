import React from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Userlist from './Userlist'
import "../../../src/sb-admin-2.min.css";
import Layout from '../../Layout'
import { useState, useEffect } from 'react'
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import Header from '../../Components/Header/Header'
import Footer from '../../Components/Footer/Footer'

function Portal() {
  const [isAdmin, setIsAdmin] = useState(false);
  
  
  function toggleSidebar(){
    const token = Cookies.get('token');
    const decoded = jwtDecode(token);
    const role= decoded.role;
    if(role === 'admin')
      setIsAdmin(true);
  }

  useEffect (()=>{
    toggleSidebar();
  },[isAdmin])

  return (
    <>
    <Header />
      <div id="wrapper" >
        {isAdmin && (<div className='sidebar1'>
          <Sidebar />
        </div>)}
        <div id="content-wrapper" className="d-flex flex-column">
          <div id="content">
            {/* <Topbar /> */}
            <div className='container-fluid'>
              <Outlet></Outlet>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>        
  )
}

export default Portal

