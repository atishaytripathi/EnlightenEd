import React from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Header from './Components/Header/Header'
import Footer from './Components/Footer/Footer'
import Sidebar from './Admin/Components/Sidebar'
import { useState } from 'react'
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';


function Layout() {
  
  return (
    <>
    <Header />
    <Outlet />
    <Footer />
    </>
  )
}


export default Layout