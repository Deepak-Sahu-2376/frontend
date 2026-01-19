import React from "react";
import { CheckCircle, Award, Clock, Star, Users, Briefcase, Target, Phone } from "lucide-react";
import { Button } from "../components/ui/button.jsx";
import SEO from "../components/SEO";
import { Link } from "react-router-dom";

export function About() {
  const features = [
    "25+ years of industry experience",
    "Licensed real estate professionals",
    "Award-winning customer service",
    "Comprehensive market knowledge",
    "Cutting-edge technology platform",
    "Personalized client approach"
  ];

  const stats = [
    { icon: Star, number: "4.9", label: "Client Rating" },
    { icon: Award, number: "50+", label: "Awards Won" },
    { icon: Clock, number: "24/7", label: "Support Available" },
    { icon: Users, number: "10k+", label: "Happy Clients" }
  ];



  const testimonials = [
    {
      name: "Vikram Malhotra",
      text: "DeshRock helped me find my dream home in record time. Their team is professional and transparent.",
      role: "Homeowner"
    },
    {
      name: "Anjali Gupta",
      text: "The best real estate consultancy I have worked with. Smooth process from start to finish.",
      role: "Investor"
    },
    {
      name: "Rahul Verma",
      text: "Highly recommended! They understood my requirements perfectly and found the best office space.",
      role: "Business Owner"
    }
  ];

  return (
    <div className="bg-background pt-16">
      <SEO
        title="About Us"
        description="Learn about DeshRock's 25+ years of experience in the real estate industry. We are your trusted partner for buying and selling properties."
      />

      {/* Hero Section */}
      <section className="relative py-24 bg-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-40">
          <img
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80"
            alt="About Hero"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-10 container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">Building Dreams, <span className="text-[#A17F5A]">Creating Legacy</span></h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
            Your trusted partner in navigating the real estate landscape with integrity, innovation, and expertise.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <Target className="h-8 w-8 text-[#A17F5A]" /> Our Mission
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-8">
              To empower individuals and businesses by providing exceptional real estate solutions. We strive to make every transaction seamless, transparent, and rewarding, ensuring that our clients find not just a property, but a place they can truly call home or a foundation for their success.
            </p>
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <Briefcase className="h-8 w-8 text-[#A17F5A]" /> Our Vision
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              To be the most preferred and trusted real estate brand in India, known for our unwavering commitment to quality, customer satisfaction, and ethical business practices. We aim to set new benchmarks in the industry through innovation and excellence.
            </p>
          </div>
          {/* Video Section moved here for better layout */}
          <div className="relative rounded-2xl shadow-2xl overflow-hidden aspect-video">
            <video
              className="w-full h-full object-cover"
              src="/assets/video/deshrock.mp4"
              autoPlay
              loop
              muted
              playsInline
            >
              Your browser does not support the video tag.
            </video>
            <div className="absolute inset-0 bg-black/20"></div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center group p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-all">
                  <div className="bg-[#A17F5A]/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-[#A17F5A] transition-colors duration-300">
                    <Icon className="h-8 w-8 text-[#A17F5A] group-hover:text-white transition-colors duration-300" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
                  <p className="text-gray-600 font-medium">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose DeshRock?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">We bring a unique blend of expertise and personalized care to every interaction.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start p-6 bg-white border border-gray-100 rounded-xl hover:border-[#A17F5A]/50 transition-colors">
              <CheckCircle className="h-6 w-6 text-green-500 mr-4 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-lg mb-2 text-gray-900">Excellence Guaranteed</h3>
                <span className="text-gray-600">{feature}</span>
              </div>
            </div>
          ))}
        </div>
      </section>



      {/* Testimonials */}
      <section className="py-20 container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Clients Say</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Real stories from real people.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <div key={i} className="bg-gray-50 p-8 rounded-2xl relative">
              <div className="text-[#A17F5A] text-6xl absolute top-4 left-6 opacity-30">"</div>
              <p className="text-gray-700 italic mb-6 relative z-10 pt-4">{t.text}</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-gray-500 font-bold">
                  {t.name[0]}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">{t.name}</h4>
                  <p className="text-xs text-gray-500">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#A17F5A] text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Find Your Dream Property?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto text-white/90">
            Let our experts guide you through the journey. Connect with us today and take the first step.
          </p>
          <Link to="/contact">
            <Button size="lg" className="bg-white text-[#A17F5A] hover:bg-gray-100 hover:text-[#906636] font-bold px-8 py-6 rounded-full text-lg shadow-lg">
              Contact Us Today
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}

export default About;