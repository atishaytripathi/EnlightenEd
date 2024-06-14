import { faFaceLaughWink, faTachographDigital, faUsers } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import { useEffect, useRef } from 'react'
import { Link , useNavigate} from 'react-router-dom'
import "../../../src/sb-admin-2.min.css";
import { RiAdminFill } from "react-icons/ri";


function Sidebar({isVisible, setIsVisible}) {
    const sidebarRef = useRef(null);

  const sidebarStyle = {
    height: isVisible ? 'calc(100vh - 100px)' : 'calc(100vh - 5rem)',
    overflowY: 'auto', // Ensure scrolling is enabled
  };

  useEffect(() => {
    if (isVisible && sidebarRef.current) {
      sidebarRef.current.scrollTo({
        top: sidebarRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [isVisible]);
        

    const navigate=useNavigate()
    return (
        <ul className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion" style={sidebarStyle}  ref={sidebarRef} id="accordionSidebar">

            {/* <!-- Sidebar - Brand --> */}
            <a className="sidebar-brand d-flex align-items-center justify-content-center">
                <div >
                    <RiAdminFill  size={"30px"} />
                </div>
                <div className="sidebar-brand-text mx-3">Admin</div>
            </a>

            {/* <!-- Divider --> */}
            <hr className="sidebar-divider my-0" />

            {/* <!-- Nav Item - Dashboard --> */}
            <li className="nav-item active">
                <Link className="nav-link" to="/portal/dashboard">
                    <FontAwesomeIcon icon={faTachographDigital} style={{ marginRight: "0.5rem" }} />
                    <span>Dashboard</span>
                </Link>
            </li>
            {/* <!-- Divider --> */}
            <hr className="sidebar-divider my-0" />

            {/* <!-- Nav Item - Users --> */}
            <li className="nav-item active">
                <div className="nav-link"  onClick={()=>{navigate("/portal/user-list",{state:{name:"courses"}})}} style={{ cursor: "pointer" }}>
                    <FontAwesomeIcon icon={faUsers} style={{ marginRight: "0.5rem" }} />
                    <span>Courses</span>
                </div>
            </li>

        </ul>
    )
}

export default Sidebar