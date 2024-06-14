import axios from 'axios';
import { useFormik } from 'formik';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../../../src/sb-admin-2.min.css";


function UserCreate() {
  const [isLoading, setLoading] = useState(false);
  const navigate = useNavigate();

  const myFormik = useFormik({
    initialValues: {
      title: "",
      description: "",
      logo: "",
      field: "",
      difficulty: "",
    },
    validate: (values) => {
      let errors = {};

      if (!values.title && values.description) {
        errors.title = "Please enter a title";
      }

      else if (!values.description && values.logo) {
        errors.description = "Please enter a description";
      }

      else if (!values.logo && values.field) {
        errors.logo = "Please select a logo";
      }

      else if (!values.field && values.difficulty) {
        errors.field = "Please select a field (eg. IT, MED, MBA etc.)";
      }

      else if (!values.difficulty && values.description) {
        errors.difficulty = "Please select the level of difficulty: Beginner, Intermediate or Advanced";
      }

      return errors;
    },
    onSubmit: async (values) => {
      try {
        setLoading(true);
        await axios.post("http://localhost:8000/adminPanel/createCourse", values);
        setLoading(false);
      } catch (error) {
        console.log(error);
        alert("Validation failed");
        setLoading(false);
      }

    
    },
  });

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        myFormik.setFieldValue('logo', reader.result); // base64 string
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className='container' style={{marginTop:'40px'}}>
      <button className="d-none ml-0 d-sm-inline-block btn btn-sm btn-primary shadow-sm" onClick={()=>{navigate(-1)}}
        style={{
          marginBottom:'20px'
        }}>Back</button>
      <form onSubmit={myFormik.handleSubmit}>
        <div className='row'>
          <div className="col-lg-6">
            <label>Title</label>
            <input 
              name='title' 
              value={myFormik.values.title} 
              onChange={myFormik.handleChange} 
              type={"text"}
              className={`form-control ${myFormik.errors.title ? "is-invalid" : ""}`} 
            />
            <span style={{ color: "red" }}>{myFormik.errors.title}</span>
          </div>

          <div className="col-lg-6">
            <label>Description</label>
            <input 
              name='description' 
              value={myFormik.values.description} 
              onChange={myFormik.handleChange} 
              type={"text"}
              className={`form-control ${myFormik.errors.description ? "is-invalid" : ""}`} 
            />
            <span style={{ color: "red" }}>{myFormik.errors.description}</span>
          </div>

          <div className='col-lg-4'>
            <label>Logo</label>
            <input 
              name='logo' 
              type="file" 
              onChange={handleFileChange}
              className={`form-control ${myFormik.errors.logo ? "is-invalid" : ""}`} 
            />
            <span style={{ color: "red" }}>{myFormik.errors.logo}</span>
          </div>

          <div className='col-lg-4'>
            <label>Field</label>
            <select 
              name='field' 
              value={myFormik.values.field} 
              onChange={myFormik.handleChange} 
              className={`form-control ${myFormik.errors.field ? "is-invalid" : ""}`}
            >
              <option value="">----Select----</option>
              <option value="IT">Information Technology</option>
              <option value="MED">Medical</option>
              <option value="MBA">Management</option>
            </select>
            <span style={{ color: "red" }}>{myFormik.errors.field}</span>
          </div>

          <div className='col-lg-4'>
            <label>Difficulty</label>
            <select 
              name='difficulty' 
              value={myFormik.values.difficulty} 
              onChange={myFormik.handleChange} 
              className={`form-control ${myFormik.errors.difficulty ? "is-invalid" : ""}`}
            >
              <option value="">----Select----</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
            <span style={{ color: "red" }}>{myFormik.errors.difficulty}</span>
          </div>

          <div className='col-lg-4 mt-3'>
            <input 
              disabled={isLoading} 
              type="submit" 
              value={isLoading ? "Submitting..." : "Create"} 
              className='btn btn-primary' 
            />
          </div>
        </div>
      </form>
    </div>
    
  );
}

export default UserCreate;
