import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaYoutube } from "react-icons/fa";
import "../../../src/sb-admin-2.min.css";
import Tooltip from '@mui/material/Tooltip';


function Userlist() {
  const [userList, setUserList] = useState([]);
  const [isLoading, setLoading] = useState(true);

  const navigate = useNavigate()
  const location = useLocation();
  const category = location.state.name;
  const courseId = location.state.id;

  const getApiUrl = () => {
    if (category === 'courses') {
      return {
        get: `${process.env.REACT_APP_API_BACKEND_URL}/adminPanel/getCourses`,
        delete: `${process.env.REACT_APP_API_BACKEND_URL}/adminPanel/deleteCourse/`
      };
    } else if (category === 'topics') {
      return {
        get: `${process.env.REACT_APP_API_BACKEND_URL}/adminPanel/getTopicsByCourse/${courseId}`,
        delete: `${process.env.REACT_APP_API_BACKEND_URL}/adminPanel/deleteTopic/`
      };
    }
  };

  useEffect(() => {
    getUsers();
  }, [category]);

  const getUsers = async () => {
    const apiUrls = getApiUrl();
    if (!apiUrls) return;

    try {
      const response = await axios.get(apiUrls.get);
      setUserList(response.data);
      // console.log(userList);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (id) => {
    const apiUrls = getApiUrl();
    if (!apiUrls) return;

    try {
      const confirmDelete = window.confirm("Are you sure you want to delete the data?");
      if (confirmDelete) {
        await axios.delete(`${apiUrls.delete}${id}`);
        getUsers();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const transformKeys = (key) => {
    switch (key) {
      case '_id':
      case '__v':
      case 'topics':
      case 'relatedCourses':
      case 'checkbox':
      case 'starred':
      case 'notes':
      case 'topicNotes':
        return null;
      default:
        return key.charAt(0).toUpperCase() + key.slice(1);
    }
  };
// console.log(location.state.name);
  const headers = userList.length > 0 
    ? Object.keys(userList[0]).filter(key => key !== '_id' && key !== '__v' && key !=='topics' && 
                                      key!=='relatedCourses' && key!=='checkbox' && key!=='starred' && key!=='notes' && key!=='topicNotes')
    : [];
      

    const toggleVideo = (user, key) => {
      if (user[key].length > 0) {
        window.open(user[key], '_blank', 'noopener,noreferrer');
      }
    };

    const renderCellContent = (key, user, id) => {
      if(key === 'title') {
        return <Tooltip key={key} title={user[key]} arrow 
                >
                <div onClick={() => { 
                  navigate("/portal/user-list", { state: {name: "topics", id:id } } ) }} style={{
                  cursor:'pointer'
                }}>{user[key]}</div></Tooltip>
      }
      if (key === 'logo') {
        return <img src={user[key]} style={{ height: "3rem", width: "3rem", borderRadius: "50%" }} alt="User Logo" />;
      } 
       else if(key ==='videos') {
        return user[key][0].length===0?'':<FaYoutube style={{cursor:'pointer', marginLeft:'10%'}} onClick={()=>{toggleVideo(user, key)}}/>
      } else if(key==='description') {
        if(user[key].length>30) {
          return <Tooltip key={key} title={user[key]} arrow><div style={{cursor:'pointer'}}>{user[key].substring(0, 20)+" ..."}</div></Tooltip>;
        } else {
          return user[key];
        }
      } else if (key==='blogs'){
          if(user[key][0].length===0){
            return ''
          }
          if(user[key][0].length>20) {
            return <Tooltip key={key} title={user[key]} arrow><div style={{cursor:'pointer'}}>{user[key][0].substring(0, 20)+" ..."}</div></Tooltip>;
          } else {
            return user[key];
          }
      } else {
        return user[key];
      }
    };

    const toggleCreateButton = (category, id) =>{
      // console.log(category, id);
      if(category === 'courses'){
        navigate("/portal/create-user")
      } else if (category === 'topics'){
        navigate("/portal/create-topic", {state: id})
      }
    };
  // console.log(!userList)
  return (
    <div style={{marginBottom:'25%'}}>
      <div className="d-sm-flex align-items-center justify-content-between mb-4" style={{marginTop:'3rem'}}>
        <button className="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm" onClick={()=>{navigate(-1)}}>Back</button>
        <h1 className="h3 mb-0 text-gray-800">{category === "courses" ? "Course List" : "Topic List"}</h1>
        <div className="d-sm-inline-block btn btn-sm btn-primary shadow-sm" onClick={()=>{
          // console.log('click');
          toggleCreateButton(category, courseId)}}
          style={{
            zIndex:'10000',
            position:'relative'
          }}>
          Create {category === "courses" ? "Course" : "Topic"}
        </div>
        {/* <Link to="/portal/create-user" className="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm">
          Create {category === "courses" ? "Course" : "Topic"}
        </Link> */}
      </div>
      {userList.length!==0 ? <div className="card shadow mb-4">
        <div className="card-header py-3">
          <h6 className="m-0 font-weight-bold text-primary">DataTables</h6>
        </div>
        <div className="card-body">
          {isLoading 
            ? <img src='https://media.giphy.com/media/ZO9b1ntYVJmjZlsWlm/giphy.gif' alt="Loading..." />
            : <div className="table-responsive">
                <table className="table table-bordered" id="dataTable" width="100%" cellSpacing="0">
                  <thead>
                    <tr>
                      {headers.map((key) => (
                        <th key={key} style={{color:'black'}}>{transformKeys(key)}</th>
                      ))}
                      <th style={{color:'black'}}>Action</th>
                    </tr>
                  </thead>
                  <tfoot>
                   
                  </tfoot>
                  <tbody>
                    {userList.map((user) => (
                      <tr key={user._id}>
                        {headers.map((key) => (
                         <td key={key} style={{color:'#5C5C5C'}}>{renderCellContent(key, user, user._id)}</td>
                        ))}
                        <td>
                          {/* <Link to={`/portal/user-view/${user._id}`} className='btn btn-primary btn-sm mr-1'>View</Link>
                          <Link to={`/portal/user-edit/${user._id}`} className='btn btn-info btn-sm mr-1'>Edit</Link> */}
                          <button onClick={() => handleDelete(user._id)} className='btn btn-danger btn-sm mr-1'>Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
          }
        </div>
      </div>
      : <div className="card shadow mb-4" style={{
        padding:'20px',
        alignItems:'center'
      }}>
          No topics under this course.
        </div>}
    </div>
  );
}

export default Userlist;
