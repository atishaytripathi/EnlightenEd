import React from 'react'
import Footerstyle from './Footer.css'
import logo from '../../Icons/logo1.png'
import { useEffect, useState } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Sidebar from '../../Admin/Components/Sidebar';

const Footer = () => {

  const [isVisible, setIsVisible] = useState(false);

  const handleScroll = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    
    if (scrollTop + windowHeight >= documentHeight - 10) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const currentYear = new Date().getFullYear();

  const [email, setEmail] =useState("");

  const sendEmail = async(e) => {
    e.preventDefault();

    const res = await fetch(`${process.env.REACT_APP_API_BACKEND_URL}/subscribe`,{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },body:JSON.stringify({
        email
      })
    });

    const data = await res.json();

    if(data.status === 401 || !data){
      console.log("error")
    }
    else {
      console.log("Email sent");
      setEmail("")
      setOpen(true)
    }
  }

  const [open, setOpen] = useState(false);


  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };



  return (
    <footer className={`footer ${isVisible ? 'visible' : ''}`}>
      <div>
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
          <Alert
            onClose={handleClose}
            severity="success"
            variant="filled"
            sx={{ width: '100%' }}
          >
            Email sent successfully!
          </Alert>
        </Snackbar>
      </div>
      <div className='footer-top'>
          <div className="footer-logo" >
          <img src={logo} alt="NAMD Logo" style={{cursor:'pointer'}} />
          <p className="footer-description" style={{cursor:'default'}}>
            An attempt to converge the industry-level education at one place.
          </p>
        </div>
        <div className="footer-sections">
          <div className="footer-section">
            <h3 style={{cursor:'default'}}>Teaching</h3>
            <ul>
              <li><a href="/help-center">Help Center</a></li>
              <li><a href="/">FAQs</a></li>
              <li><a href="/about">About us</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h3 style={{cursor:'default'}}>Community</h3>
            <ul>
              <li><a href="/" onClick={()=>{
                window.open('https://www.linkedin.com/in/atishaytripathi/','_blank', 'noopener,noreferrer')
              }}>LinkedIn</a></li>
              <li><a href="/">Twitter</a></li>
              <li><a href="/" onClick={()=>{
                window.open('https://www.instagram.com/atishaytripathi/','_blank', 'noopener,noreferrer')
              }}>LinkedIn</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h3 style={{cursor:'default'}}>Subscribe</h3>
            <p style={{cursor:'default'}}>Subscribe for latest updates.</p>
            <form className="subscribe-form">
              <input type="email" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} />
              <button type="submit" onClick={sendEmail}>Subscribe</button>
            </form>
          </div>
        </div>
          </div>
    
    <div className="footer-bottom">
      <p>&copy; Copyright {currentYear}. All rights reserved.</p>
      <ul className="footer-links">
        <li><a href="/terms">Terms</a></li>
        <li><a href="/privacy">Privacy</a></li>
        <li><a href="/cookie-settings">Cookie Settings</a></li>
      </ul>
    </div>
  </footer>
  )
}

export default Footer