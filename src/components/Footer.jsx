// src/components/Footer.jsx

import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white mt-12 pt-10 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 border-b border-gray-700 pb-8 mb-8">

          <div>
            <Link to="/" className="flex items-center gap-0 mb-4">
              <img src="/deshrock.svg" alt="DeshRock" className="h-10 w-auto" />
              <span className="text-2xl font-bold" style={{ color: 'rgb(173, 139, 68)' }}>
                eshRock
              </span>
            </Link>
            <p className="text-sm text-gray-400 mb-4">
              Your trusted partner in real estate. We help you find the perfect property and achieve your real estate dreams come true.
            </p>
            <p className="text-sm text-gray-400">+91 9599271680</p>
            <p className="text-sm text-gray-400">Deshrockpvt.ltd@gmail.com</p>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              {[
                { label: 'Projects', path: '/projects' },
                { label: 'About Us', path: '/about' },
                { label: 'Properties', path: '/properties' },
                { label: 'Contact', path: '/contact' },
                
              ].map((item) => (
                <li key={item.label}>
                  <Link to={item.path} className="text-gray-400 hover:text-orange-400 transition">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-sm">
              {[
                { label: 'Buy Property', path: '/properties?listingType=SALE' },
                { label: 'Sell Property', path: '/properties?listingType=SALE' },
                { label: 'Rent Property', path: '/properties?listingType=RENT' },
                { label: 'Property Management', path: '/properties' }
              ].map((item) => (
                <li key={item.label}>
                  <Link to={item.path} className="text-gray-400 hover:text-orange-400 transition">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Stay Connected</h4>
            <p className="text-sm text-gray-400 mb-6 leading-relaxed">
              Subscribe to our newsletter for the latest property updates and market
              insights.
            </p>
            <div className="flex flex-col space-y-4">
              <div className="flex space-x-3 pt-2">
                {[
                  { Icon: Facebook, link: "https://www.facebook.com/profile.php?id=61562746145975" },
                  { Icon: Instagram, link: "https://www.instagram.com/deshrockpvt.ltd/" },
                  { Icon: Linkedin, link: "https://www.linkedin.com/company/100949660" }
                ].map(({ Icon, link }, index) => (
                  <a
                    key={index}
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-gray-800 rounded-lg text-white hover:bg-gray-700 hover:text-white transition-colors border border-gray-700"
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-4 text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} DeshRock. All rights reserved.</p>
          <div className="flex space-x-4 mt-3 md:mt-0">
            <a href="/privacy-policy" className="hover:text-orange-400">Privacy Policy</a>
            <a href="/terms-of-service" className="hover:text-orange-400">Terms of Service</a>
            <a href="/cookie-policy" className="hover:text-orange-400">Cookie Policy</a>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;