import React, { useEffect } from 'react'
import reactlogo from '../../Icons/react-logo-1.png'
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

function MyCourses() {

    const [courses, setCourses] = useState([]);
    const [isLoading, setLoading] = useState(true);
    const [userId, setUserId] = useState();
    const [userEmail, setUserEmail] = useState();
    const navigate = useNavigate();
    const token = Cookies.get('token');
    
    
    useEffect(() => {
      if (token) {
        const decoded = jwtDecode(token);
        setUserEmail(decoded.username);
        // console.log('useremail:',userEmail);
      }
    }, [userEmail]);

    useEffect(() => {
        const fetchCoursesByUser = async () => {
            try {
                const courses = await axios.get(`${process.env.REACT_APP_API_BACKEND_URL}/courseProgress/getEnrolledCourses/${userId}`);
                // console.log(courses,':courses')
                const courseData = courses.data;
                // console.log(courseData);
                if(!courseData) {
                    console.error('No courses enrolled.');
                }
                setCourses(courseData)
                // setCourses([...courses, {'_id':836467, 'title':'react', 'field': 'IT', 'difficulty':'Beginner'}]);
                console.log('print',courses);
                setLoading(false);
            } catch (error) {
                console.error(error);
            }
        };
        const fetchUserId = async () => {
          if(userEmail) {
            try {
              const response = await axios.get(`${process.env.REACT_APP_API_BACKEND_URL}/user/getUser/${userEmail}`);
              // console.log('userid',response.data);
              setUserId(response.data);
              // console.log(userId,':userid');
            } catch (error) {
              console.error('Error fetching User ID:', error);
            }
          }
        };
        fetchUserId();
        fetchCoursesByUser();
    },[ userEmail, userId]);

    if (isLoading) {
        return <div>Loading...</div>;
      }

      const toggleCourse = (id) => {
        navigate('/topics', {state:id});
      }

  return (
     <>
      <div className='content-list'>
        <div className='wrapper2'>
          <div className='category'>
            Enrolled Courses
          </div>
          <div className='card-section' >
            {courses.map((course) => (
              <div className='cards' key={course._id} onClick={()=>{
                // console.log('course page',course._id);
                // toggleCourse(course._id);
                toggleCourse(course._id);
                }} >
                <div className='card-image-div'>
                  {/* <img src={reactlogo} className='image' alt={`${course.title} logo`} /> */}
                  <img src={course.logo} className='image' alt={`${course.title} logo`} />
                </div>
                <div className='card-content'>
                  <div className='card-title'>{course.title}</div>
                  <div className='field'>{course.field}</div>
                  <div className='difficulty'>{course.difficulty} Level</div>
                </div>
              </div>
            ))}
          </div>
        </div>
    </div>
    </>
  )
}

export default MyCourses