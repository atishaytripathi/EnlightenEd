import React, { useEffect, useState , useRef } from 'react'
import useFetch from '../useFetch/useFetch';
import Loader from '../Loader/Loader';
import './LoginSignup.css'
import { FaUser, FaEnvelope, FaEye } from "react-icons/fa";
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import Layout from '../../Layout';
import {jwtDecode } from 'jwt-decode';


const LoginSignup = () => {
    const [action, setAction]=useState('');
    const [userName,setUserName]=useState('')
    const [name,setName]=useState('')
    const [pwd, setPwd] = useState('');
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [isSigningUp, setIsSigningUp] = useState(false);
    const [type, setType]=useState(false);
    const [isSignup, setIsSignup] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const navigate = useNavigate();
   

    const { data, isLoading, error } = useFetch ('',false);
    
    const registerLink = () =>{
        setIsSignup(!isSignup);
        setAction('active');
    };

    const loginLink = () =>{
      setIsSignup(!isSignup);  
      setAction('');
    };

    const hidePass = ()=> {
        setType(!type)
    }


    const handleAuth = async (e) => {
      e.preventDefault();
      try {
        const url = isSignup
          ?
             `${process.env.REACT_APP_API_BACKEND_URL}/user/signup`
          : (isAdmin
          ? `${process.env.REACT_APP_API_BACKEND_URL}/admin/signin`
          : `${process.env.REACT_APP_API_BACKEND_URL}/user/signin`)

        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            accept: 'application/json',
          },
          body: JSON.stringify({ name: name, email: userName, password:pwd }),
        });
  
        if (!response.ok) {
          throw new Error('Failed to authenticate');
        }
        const responseData = await response.json();
        Cookies.set('token', responseData.token, { secure: true, sameSite: 'Strict' });
        const decoded = jwtDecode(responseData.token)
        localStorage.setItem('decodedToken', JSON.stringify(decoded));
        if (decoded.role === 'admin') {
          navigate('/portal/dashboard');
        } else {
          navigate('/');
        }
      } catch (error) {
        console.error('Authentication failed', error);
      } finally {
        if(isSignup)
            setIsSigningUp(false);
        else
            setIsLoggingIn(false);
      }
    };

  return (
    <div className='wrap'>
      <div className={`wrapper ${action}`}>
        <div className="form-box login">
            <form action="" onSubmit={handleAuth}>
                <h1>Login</h1>
                <div className="input-box">
                    <input type="text" placeholder="Email" required onChange={(e)=>{setUserName(e.target.value)}}/>
                    <FaUser className='icon'/>
                </div>
                <div className="input-box">
                    <input type={type ? "text" : "password"} placeholder="Password" required onChange={(e)=>{setPwd(e.target.value)}}/>
                    <FaEye className='icon'onClick={hidePass} style={{cursor:'pointer'}}/>
                </div>
                <div className="remember-forgot">
                    <label> <input type="checkbox"/>Remember Me</label>
                    <a href="#">Forgot Password?</a>
                    
                </div>
                
                <button type="submit" disabled={isLoggingIn}>{isLoggingIn ? 'Logging In...' : 'Login'}</button>
                <div className="register-link">Don't have an account?<a href="#" onClick={registerLink}> Register Here</a>
                <label className='admin-checkbox'>
                      <input type="checkbox" checked={isAdmin} onChange={() => setIsAdmin(!isAdmin)} />
                       Admin Login
                    </label>
                </div>
                
            </form>
        </div>

        <div className="form-box register">
            <form action="" onSubmit={handleAuth}>
                <h1>Registration</h1>
                <div className="input-box">
                    <input type="text" value={name} onChange={(e)=>{setName(e.target.value)}} placeholder="Username" required/>
                    <FaUser className='icon'/>
                </div>
                <div className="input-box">
                    <input type="email" value={userName} onChange={(e)=>{setUserName(e.target.value)}} placeholder="Email" required/>
                    <FaEnvelope className='icon'/>
                </div>
                <div className="input-box">
                    <input type={type ? "text" : "password"} value={pwd} onChange={(e)=>{setPwd(e.target.value)}} placeholder="Password" required/>
                    <FaEye className='icon'onClick={hidePass} style={{cursor:'pointer'}}/>
                </div>
                <div className="remember-forgot">
                    <label>
                        <input type="checkbox"/>I agree to the terms and conditions.
                    </label>
                    <a href="#">Forgot Password?</a>
                </div>
                <button type="submit" disabled={isSigningUp}>{isSigningUp ? 'Signing Up...' : 'Sign Up'}</button>
                <div className="register-link">Already have an account?<a href="#" onClick={loginLink}> Login Here</a></div>
            </form>
            {isLoading && <Loader />}
            {error && <div>Error: {error.message}</div>}
        </div>
      </div>
    </div>
  )
}

export default LoginSignup