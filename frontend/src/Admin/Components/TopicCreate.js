import axios from 'axios';
import { useFormik } from 'formik';
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import "../../../src/sb-admin-2.min.css";


function TopicCreate() {
  const [isLoading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const courseId = location.state;

  const myFormik = useFormik({
    initialValues: {
      title: "",
      videos: "",
      blogs: "",
      relatedCourses: ""
    },
    validate: (values) => {
      let errors = {};
      myFormik.values.relatedCourses= courseId;

      if (!values.title) {
        errors.title = "Please enter a title";
      }

      return errors;
    },
    onSubmit: async (values) => {
      try {
        setLoading(true);
        await axios.post(`${process.env.REACT_APP_API_BACKEND_URL}/adminPanel/createTopic/${courseId}`, values);
        setLoading(false);
      } catch (error) {
        console.log(error);
        alert("Validation failed");
        setLoading(false);
      }
    },
  });

//   const handleFileChange = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         myFormik.setFieldValue('logo', reader.result); // base64 string
//       };
//       reader.readAsDataURL(file);
//     }
//   };

  return (
    <div className='container' style={{marginTop:'50px'}}>
     <button className="d-none ml-0 d-sm-inline-block btn btn-sm btn-primary shadow-sm" onClick={()=>{navigate(-1)}}
      style={{marginBottom:'20px'}}>Back</button>
      <form onSubmit={myFormik.handleSubmit}>
        <div className='row'>
          <div className="col-lg-6">
            <label>Title</label>
            <input 
              name='title'
              placeholder='Enter the title' 
              value={myFormik.values.title} 
              onChange={myFormik.handleChange} 
              type={"text"}
              className={`form-control ${myFormik.errors.title ? "is-invalid" : ""}`} 
            />
            <span style={{ color: "red" }}>{myFormik.errors.title}</span>
          </div>

          <div className="col-lg-6">
            <label>Videos</label>
            <input 
              name='videos'
              placeholder='Attach video links' 
              value={myFormik.values.videos} 
              onChange={myFormik.handleChange} 
              type={"text"}
              className={`form-control ${myFormik.errors.videos ? "is-invalid" : ""}`} 
            />
            <span style={{ color: "red" }}>{myFormik.errors.videos}</span>
          </div>

          <div className='col-lg-4'>
            <label>Blogs</label>
            <input 
              name='blogs'
              placeholder='Attach blog links' 
              type={"text"} 
              value={myFormik.values.blogs}
              onChange={myFormik.handleChange}
              className={`form-control ${myFormik.errors.blogs ? "is-invalid" : ""}`} 
            />
            <span style={{ color: "red" }}>{myFormik.errors.blogs}</span>
          </div>

          <div className='col-lg-4 mt-4'>
            <input 
              disabled={isLoading} 
              type="submit" 
              value={isLoading ? "Submitting" : "Create"} 
              className='btn btn-primary' 
            />
          </div>
        </div>
      </form>
    </div>
    
  );
}

export default TopicCreate;
