import React, { useEffect } from 'react'
import CourseStyle from './Courses.css'
import reactlogo from '../../Icons/react-logo-1.png'
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Courses() {
    const [courses, setCourses] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isLoading, setLoading] = useState(true);
  
    const navigate = useNavigate();
    const location = useLocation();

    const propCategory = location.state.name;
    
    useEffect(() => {
      const fetchCategoriesAndCourses = async () => {
        try {
          // Fetch categories
          const courses = await axios.get(`${process.env.REACT_APP_API_BACKEND_URL}/userPanel/getField`);
          const courseData= courses.data;
          // console.log('Fetched courses data:', courseData);

          if (Array.isArray(courseData)) {
            // Extract unique categories
            const uniqueCategories = [...new Set(courseData.map(course => course.field))];
            // console.log('Unique categories:', uniqueCategories); // Verify the unique categories
            setCourses(courseData);

            if(propCategory != 'courses')
            {
              setCategories([propCategory]);
            }
            else
            {
              setCategories(uniqueCategories);
            }
          } else {
            console.error("Unexpected response structure:", courseData);
          }
          // Fetch courses for each category
          // const coursesData = {};
          // for (const category of categories) {
          //   const coursesResponse = await axios.get(`${process.env.REACT_APP_API_BACKEND_URL}/userPanel/getCoursesByField/${category}`);
          //   coursesData[category] = coursesResponse.data;
          //   console.log('hello',coursesData);
          // }
  
          setLoading(false);
        } catch (error) {
          console.error(error);
        }
      };
  
      fetchCategoriesAndCourses();
    }, [propCategory]);
  
    if (isLoading) {
      return <div style={{
        margin:'17% 42%',
        fontSize:'40px',
        color:'black'
      }}>Loading...</div>;
    }

    const categorizedCourses = courses.reduce((acc, course) => {
        const { field } = course;
        if (!acc[field]) {
          acc[field] = [];
        }
        acc[field].push(course);
        // console.log(acc);
        return acc;
      }, {});
  // console.log('categories', categories);
  
  const toggleCourse = (id) => {
    navigate('/topics', {state:id});
  }

  return (
    <>
      {/* <div className='content-list'>
        <div className='wrapper2'>
          <div className='filter'>Filter By:</div>
        </div>
      </div> */}
      <div className='content-list'>
      {categories.map((field) => (
        <div className='wrapper2' key={field}>
          <div className='category'>
            {field==='courses'?'All Courses':field}
          </div>
          <div className='card-section' >
            {categorizedCourses[field].map((course) => (
              <div className='cards' key={course._id} onClick={()=>{
                // console.log('course page',course._id);
                toggleCourse(course._id);
                // navigate("/topics", {data:{course:course._id}})
                }} >
                <div className='card-image-div'>
                  {/* <img src={reactlogo} className='image' alt={`${course.title} logo`} /> */}
                  <img src={course.logo} className='image' alt={`${course.title} logo`} />
                </div>
                <div className='card-content'>
                  <div className='card-title'>{course.title}</div>
                  {/* <div className='field'>{course.field}</div> */}
                  <div className='difficulty'>{course.difficulty} Level</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
    </>
    
  );
}

export default Courses