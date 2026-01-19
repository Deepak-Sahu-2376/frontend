import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Search, ArrowLeft, Building2 } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 overflow-hidden relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating buildings */}
        <div className="absolute top-1/4 left-10 opacity-10 animate-float-slow">
          <Building2 className="w-24 h-24 text-[#A17F5A]" />
        </div>
        <div className="absolute top-1/3 right-20 opacity-10 animate-float-delayed">
          <Building2 className="w-32 h-32 text-[#A17F5A]" />
        </div>
        <div className="absolute bottom-1/4 left-1/4 opacity-10 animate-float">
          <Building2 className="w-20 h-20 text-[#A17F5A]" />
        </div>
        <div className="absolute bottom-1/3 right-1/3 opacity-10 animate-float-slow">
          <Building2 className="w-28 h-28 text-[#A17F5A]" />
        </div>

        {/* Gradient orbs */}
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-[#A17F5A]/5 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-[#A17F5A]/5 rounded-full blur-3xl animate-pulse-slow animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#A17F5A]/3 rounded-full blur-3xl animate-pulse-slow animation-delay-4000" />
      </div>

      <div className="relative z-10 text-center max-w-2xl mx-auto">
        {/* Logo */}
        <div className="mb-8">
          <img src="/deshrock.svg" alt="DeshRock" className="h-16 w-auto mx-auto animate-float" />
        </div>

        {/* Animated 404 */}
        <div className="relative mb-8">
          <h1 className="text-[150px] md:text-[200px] font-black text-transparent bg-clip-text bg-gradient-to-r from-[#A17F5A] via-[#D4AF77] to-[#A17F5A] leading-none animate-gradient-x select-none">
            404
          </h1>

          {/* Glitch effect layers */}
          <h1 className="absolute inset-0 text-[150px] md:text-[200px] font-black text-[#A17F5A]/10 leading-none animate-glitch-1 select-none" aria-hidden="true">
            404
          </h1>
          <h1 className="absolute inset-0 text-[150px] md:text-[200px] font-black text-[#D4AF77]/10 leading-none animate-glitch-2 select-none" aria-hidden="true">
            404
          </h1>
        </div>

        {/* Animated search icon */}
        <div className="relative mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#A17F5A]/10 backdrop-blur-sm border border-[#A17F5A]/30 animate-bounce-slow">
            <Search className="w-10 h-10 text-[#A17F5A] animate-search" />
          </div>
          {/* Ripple effect */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 rounded-full border border-[#A17F5A]/30 animate-ripple" />
            <div className="absolute w-20 h-20 rounded-full border border-[#A17F5A]/30 animate-ripple animation-delay-500" />
            <div className="absolute w-20 h-20 rounded-full border border-[#A17F5A]/30 animate-ripple animation-delay-1000" />
          </div>
        </div>

        {/* Message */}
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 animate-fade-in-up">
          Property Not Found
        </h2>
        <p className="text-lg text-gray-500 mb-10 animate-fade-in-up animation-delay-200 max-w-md mx-auto">
          Looks like this property has been sold or the page doesn't exist. Let's help you find your dream home!
        </p>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up animation-delay-400">
          <Link
            to="/"
            className="group relative inline-flex items-center gap-2 px-8 py-4 bg-[#A17F5A] rounded-lg text-white font-semibold overflow-hidden transition-all duration-300 hover:bg-[#8e6f4e] hover:shadow-lg hover:shadow-[#A17F5A]/30 hover:scale-105"
          >
            <span className="relative z-10 flex items-center gap-2">
              <Home className="w-5 h-5" />
              Go Home
            </span>
          </Link>

          <Link
            to="/properties"
            className="group inline-flex items-center gap-2 px-8 py-4 bg-transparent border border-[#A17F5A] rounded-lg text-[#A17F5A] font-semibold transition-all duration-300 hover:bg-[#A17F5A]/10 hover:scale-105"
          >
            <Search className="w-5 h-5" />
            Browse Properties
          </Link>
        </div>

        {/* Back button */}
        <button
          onClick={() => window.history.back()}
          className="mt-8 inline-flex items-center gap-2 text-gray-400 hover:text-[#A17F5A] transition-colors duration-300 animate-fade-in-up animation-delay-600"
        >
          <ArrowLeft className="w-4 h-4" />
          Go back to previous page
        </button>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-30px) rotate(-5deg); }
        }
        
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-25px) rotate(3deg); }
        }
        
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes glitch-1 {
          0%, 100% { transform: translate(0); }
          20% { transform: translate(-2px, 2px); }
          40% { transform: translate(-2px, -2px); }
          60% { transform: translate(2px, 2px); }
          80% { transform: translate(2px, -2px); }
        }
        
        @keyframes glitch-2 {
          0%, 100% { transform: translate(0); }
          20% { transform: translate(2px, -2px); }
          40% { transform: translate(2px, 2px); }
          60% { transform: translate(-2px, -2px); }
          80% { transform: translate(-2px, 2px); }
        }
        
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes search {
          0%, 100% { transform: rotate(0deg) scale(1); }
          25% { transform: rotate(-10deg) scale(1.1); }
          75% { transform: rotate(10deg) scale(1.1); }
        }
        
        @keyframes ripple {
          0% { transform: scale(1); opacity: 1; }
          100% { transform: scale(2.5); opacity: 0; }
        }
        
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.1); }
        }
        
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-slow { animation: float-slow 8s ease-in-out infinite; }
        .animate-float-delayed { animation: float-delayed 7s ease-in-out infinite 1s; }
        .animate-gradient-x { 
          background-size: 200% 200%;
          animation: gradient-x 3s ease infinite; 
        }
        .animate-glitch-1 { animation: glitch-1 0.3s ease-in-out infinite; }
        .animate-glitch-2 { animation: glitch-2 0.3s ease-in-out infinite 0.1s; }
        .animate-bounce-slow { animation: bounce-slow 3s ease-in-out infinite; }
        .animate-search { animation: search 2s ease-in-out infinite; }
        .animate-ripple { animation: ripple 2s linear infinite; }
        .animate-fade-in-up { animation: fade-in-up 0.6s ease-out forwards; }
        .animate-pulse-slow { animation: pulse-slow 6s ease-in-out infinite; }
        
        .animation-delay-200 { animation-delay: 0.2s; opacity: 0; }
        .animation-delay-400 { animation-delay: 0.4s; opacity: 0; }
        .animation-delay-500 { animation-delay: 0.5s; }
        .animation-delay-600 { animation-delay: 0.6s; opacity: 0; }
        .animation-delay-1000 { animation-delay: 1s; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
      `}</style>
    </div>
  );
};

export default NotFound;
