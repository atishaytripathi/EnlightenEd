import React from 'react'
import HomeStyle from './Home.css'
import concept from '../../Icons/conceptart1.png'
import concept1 from '../../Icons/conceptart.png'
import { Link, useNavigate } from 'react-router-dom'
import DynamicCarousel from '../Carousel/Carousel'
import 'animate.css';



function Home() {
  const navigate = useNavigate();
  const items = [concept, concept1];
  return (
 <div style={{marginTop:'90px',display:"flex", justifyContent:"space-around", alignItems:"flex-start"}}>
    <div className='wrapper1'>
      <div className='writeup'>
        <h1 className='animate__animated animate__fadeInUp animate__delay-1s' style={{color:'#3a3b45'}}>
          A new approach to technical education.
        </h1>
        <p className='animate__animated animate__fadeInUp animate__delay-2s'>
          A goto place for free and industry-level courses, along with progress-tracking and many more options.
        </p>
        <div className='animate__animated animate__fadeInUp animate__delay-3s'>
          <div to='/courses' className='btn_link' style={{cursor:'pointer'}}
          onClick={()=>{navigate("/courses",{state:{name:'courses'}})}}>Explore Courses</div> 
        </div>
      </div>

      <div>
       
        {/* <img src={concept} className='art' alt='concept-art'/> */}
      </div>
    </div>
  <div style={{width:"30rem", height:"30rem"}}>
  <DynamicCarousel items={items} autoplay />
  </div>
 </div>
    
  )
}

export default Home