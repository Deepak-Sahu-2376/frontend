// src/pages/Home.jsx

import React from 'react';
import HeroSection from '../components/HeroSection';
import TopPicksSection from '../components/TopPicksSection';
import FeaturedPropertiesSection from '../components/FeaturedPropertiesSection';
import TopRatedPropertiesSection from '../components/TopRatedPropertiesSection';

import FAQSection from '../components/FAQSection';
import CTASection from '../components/CTASection';
import SEO from '../components/SEO';
// ... other imports

const Home = () => {
  return (
    // Replaced <Fragment> with a <div> and added the top margin (mt-8)
    <div className="mt-16">
      <SEO
        title="Home"
        description="Discover your dream home with DeshRock. We offer premium residential and commercial properties, real estate investment opportunities, and rentals with trusted agents."
        keywords="real estate, property, buy home, sell home, deshrock, gurgaon real estate, real estate agents, real estate investment, real estate near me, real estate for sale, real estate with rentals, real estate broker, property taxes, contingent, real estate attorney, real estate appraiser, real estate agencies, real estate auctions, real estate career, real estate business, real estate for rent, real estate to buy, real estate to lease, real estate with ai, real estate market, real estate crash, real estate license, real estate law, real estate school, real estate development, real estate trust, real estate vs stocks, real estate vs mutual funds, commercial real estate, residential real estate, luxury real estate, real estate for women, real estate without borders, gurgaon real estate, real estate agents, real estate investment, real estate near me, real estate for sale, real estate with rentals, real estate broker, property taxes, contingent, real estate attorney, real estate appraiser, real estate agencies, real estate auctions, real estate career, real estate business, real estate for rent, real estate to buy, real estate to lease, real estate with ai, real estate market, real estate crash, real estate license, real estate law, real estate school, real estate development, real estate trust, real estate vs stocks, real estate vs mutual funds, commercial real estate, residential real estate, luxury real estate, real estate for women, real estate without borders, gurgaon, "
      />
      <HeroSection />

      {/* --- Top Picks Section Added Here --- */}
      <TopPicksSection />

      <FeaturedPropertiesSection />



      <TopRatedPropertiesSection />



      <FAQSection />

      <CTASection />

      <main className="flex-grow max-w-7xl mx-auto p-4">
      </main>
    </div>
  );
};

export default Home;