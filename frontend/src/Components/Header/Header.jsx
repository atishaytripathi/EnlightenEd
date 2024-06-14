import React from "react";
import HeaderStyle from "./Header.css";
import { Link, useNavigate, NavLink } from "react-router-dom";
import { RxHamburgerMenu } from "react-icons/rx";
import { FaUser } from "react-icons/fa";
import logo from "../../Icons/logo6.png";
import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { PiSignOut } from "react-icons/pi";


export default function Header() {
  const [isActiveHamburger, setIsActiveHamburger] = useState(0);
  const [isActiveUser, setIsActiveUser] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollTop, setLastScrollTop] = useState(0);
  // const [isActivePage, setIsActivePage ] = useState(false);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  const token = Cookies.get("token");
  const decodedToken = JSON.parse(localStorage.getItem("decodedToken"));
  // console.log(decodedToken);
  const handleScroll = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;

    if (scrollTop > lastScrollTop && scrollTop > 50) {
      // Scrolling down and past a certain point
      setIsVisible(false);
    } else {
      // Scrolling up
      setIsVisible(true);
    }

    setLastScrollTop(scrollTop);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollTop]);

  const handleDropdownHamburger = () => {
    setIsActiveHamburger(!isActiveHamburger);
  };

  const handleDropdownUser = () => {
    setIsActiveUser(!isActiveUser);
  };
  const handleLogout = () => {
    handleDropdownUser();
    Cookies.remove("token");
    localStorage.removeItem('decodedToken');
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Fetch categories
        const courses = await axios.get(
          `${process.env.REACT_APP_API_BACKEND_URL}/userPanel/getField`
        );
        const courseData = courses.data;

        if (Array.isArray(courseData)) {
          // Extract unique categories
          const uniqueCategories = [
            ...new Set(courseData.map((course) => course.field)),
          ];

          setCategories(uniqueCategories);
        } else {
          console.error("Unexpected response structure:", courseData);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const handleClick=(e)=>{
    if(e && e.target && e.target.tagName!=="path"){
      setIsActiveUser(false);
      setIsActiveHamburger(false);
      // setIsActivePage(false);
    }
    }
    window.addEventListener("click", handleClick);
  }, []);
  
  // const handleMyCourses =()=>{
  //   navigate('/mycourses');
  // };


  return (
    <header className={`header ${isVisible ? "visible" : "hidden"}`}>
      <div className="left-section">
        
          {/* <RxHamburgerMenu
            size="40px"
            className={`hamburger-menu ${
              isActiveHamburger ? "active" : "unactive"
            }`}
            onClick={handleDropdownHamburger}
          /> */}
          <Link to="/">
            <img src={logo} className="App-logo" alt="logo" />
          </Link>
          <h1 onClick={()=>{navigate('/')}} style={{cursor:'pointer'}}>EnlightenEd</h1>
        
        {/* <div className={`dropdown ${isActiveHamburger ? "active" : "unactive"}`}>
          <div className="btn_dropdown">Filter by :</div>
          {categories.map((field) => (
            <div
              className="btn_dropdown"
              key={field}
              onClick={() => {
                navigate("/courses", { state: { name: field } });
              }}
            >
              {field}
            </div>
          ))}
        </div> */}
      </div>
      <div className="nav_links">
        {
        (!token || decodedToken.role==='user') && 
        <NavLink to="/" className="btn_link" 
            style={({ isActive }) => ({
              // backgroundColor: isActive ? 'black' : '',
              // color: isActive ? 'white' : '',
              padding: isActive ? '5px 10px' : '',
              borderRadius: isActive ? '3px' : '',
              borderBottom: isActive ? 'none' : '',
              boxShadow: isActive ? 'rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px': 'none',
            })}
          >
          Home
        </NavLink>}
        {
          (!token || decodedToken.role==='user') &&
          <NavLink
          to='/courses'
          state= {{ name: 'courses'}}
          className="btn_link"
          style={({ isActive }) => ({
            // backgroundColor: isActive ? 'black' : '',
              // color: isActive ? 'white' : '',
              padding: isActive ? '5px 10px' : '',
              borderRadius: isActive ? '3px' : '',
              borderBottom: isActive ? 'none' : '',
              boxShadow: isActive ? 'rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px': 'none',
          })}
        >
          Courses
        </NavLink>}
        {
          (!token || decodedToken.role==='user') &&
          <NavLink to="/about" className="btn_link"
          style={({ isActive }) => ({
            // backgroundColor: isActive ? 'black' : '',
              // color: isActive ? 'white' : '',
              padding: isActive ? '5px 10px' : '',
              borderRadius: isActive ? '3px' : '',
              borderBottom: isActive ? 'none' : '',
              boxShadow: isActive ? 'rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px': 'none',
          })}
        >
          About
        </NavLink>}
        {!token && (
          <NavLink to="/login" className="btn_link">
            Login
          </NavLink>
        )}
      </div>
      {token && <div className="right-section">
        <FaUser
        id="logo"
          size="30px"
          className={`user-icon ${isActiveUser ? "active" : "unactive"}`}
          onClick={handleDropdownUser}
          style={{
            marginTop: token ? (decodedToken?.role==='user' ? '95%':'45%') : '45%'
          }}
        />
        <div className={`dropdown ${isActiveUser ? "active" : "unactive"}`}>
          {
            (decodedToken?.role==='user') &&
            <NavLink to="/profile" className="btn_dropdown" 
          style={({ isActive }) => ({
            backgroundColor: isActive ? 'white' : '',
            color: isActive ? 'black' : '',
            padding: isActive ? '5px 10px' : '',
            borderRadius: isActive ? '3px' : '',
            borderBottom: isActive ? 'none' : '',
            // boxShadow: isActive ? 'inset 0 0 0.5px 1px hsla(0, 0%,  100%, 0.075),0 0 0 1px hsla(0, 0%, 0%, 0.05),0 0.3px 0.4px hsla(0, 0%, 0%, 0.02),0 0.9px 1.5px hsla(0, 0%, 0%, 0.045),0 3.5px 6px hsla(0, 0%, 0%, 0.09)': 'none',
            // alignSelf: isActive ? 'center' : ''
          })}>
            Profile
          </NavLink>}
          {
            (decodedToken?.role==='user') &&
            <NavLink to="/mycourses" className="btn_dropdown" 
          // onClick={handleMyCourses}
          style={({ isActive }) => ({
            backgroundColor: isActive ? 'white' : '',
            color: isActive ? 'black' : '',
            padding: isActive ? '5px 10px' : '',
            borderRadius: isActive ? '3px' : '',
            borderBottom: isActive ? 'none' : ''
          })}
          >
            My Courses
          </NavLink>}
          <NavLink to= '/login' className="btn_dropdown" onClick={handleLogout}>
            Sign Out <PiSignOut className="signout-icon" />
          </NavLink>
        </div>
      </div>}
    </header>
  );
}
