import React from 'react';
import AboutStyle from './About.css';

const About = () => {
  return (
    <div className="about-page" style={{cursor:'default'}}>
      <div className="about-container">
        <h1>About Us</h1>
        <p>
          Welcome to our e-learning platform, your destination for quality education in IT, also expanding to Medical and Management fields. 
          Our curated courses are designed to help you gain the skills you need to excel in your chosen field. Whether you are 
          looking to enhance your IT knowledge, delve into the medical sciences, or master management techniques, we have a 
          course for you.
        </p>
        <h2>Our Features</h2>
        <ul>
          <li>Curated Courses: Expertly designed courses to meet industry standards.</li>
          <li>Progress Tracking: Monitor your learning progress and achievements.</li>
          <li>Note-Taking: Add notes and mark important sections for future reference.</li>
          <li>Enrollment Management: Easily enroll in courses and manage your learning journey.</li>
          <li>Expanding Fields: Currently focused on IT, with new courses in Medical and Management fields being added.</li>
        </ul>
        <h2>Why Choose Us?</h2>
        <p>
          Our platform is designed with you in mind. We provide high-quality content, interactive learning experiences, and 
          tools to help you succeed. Join us today and take the next step in your educational journey.
        </p>
      </div>
    </div>
  );
};

export default About;
