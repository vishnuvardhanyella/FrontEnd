// About.jsx

import React, { useEffect } from 'react';
import './About.css';

const About = () => {
  useEffect(()=>{
    window.scrollTo(0,0)
  },[])
  return (
    <div className="about-card">
      <h2>About Us</h2>
      <div className="about-content">
        <section>
          <h3>What We Offer</h3>
          <p>Explore your constituency and get details about contesting candidates. Choose your leader wisely by accessing information about Telangana elections, party manifestos, surveys, and essential voter details.</p>
        </section>

        <section>
          <h3>Why Choose Us?</h3>
          <p>Our platform is designed to empower you with knowledge. We gather data from reliable sources, including the Election Commission of India (ECI) website. We acknowledge human fallibility, so if you find any discrepancies, please <a href="mailto:vardhanyella.gmail.com">drop us an email</a>.</p>
        </section>

        <section>
          <h3>My Mission</h3>
          <p>In the quest for a fulfilling career, I find myself in the realm of job searching, yearning for an opportunity to showcase my skills. This website, born out of my eagerness to contribute to society, serves a dual purpose. It not only provides a valuable resource for informed voting but also stands as a testament to my capabilities. Join me on this mission, as together, we navigate towards an empowered and well-informed democracy.</p>
        </section>
      </div>
    </div>
  );
};

export default About;
