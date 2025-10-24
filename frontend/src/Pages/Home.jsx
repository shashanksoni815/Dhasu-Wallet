import React from 'react';
import Navbar from '../Components/Layout/Navbar';
import Footer from '../Components/Layout/Footer';
import Hero from '../Components/Home/Hero';
import Features from '../Components/Home/Features';
import HowItWorks from '../Components/Home/HowItWorks';
import Testimonials from '../Components/Home/Testimonails';
import CTA from '../Components/Home/CTA';

const Home = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <Testimonials />
        <CTA />
      </main>
      <Footer />
    </div>
  );
};

export default Home;