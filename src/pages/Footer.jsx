import React from 'react';
import { FaTwitter, FaFacebook, FaInstagram, FaLinkedin } from 'react-icons/fa';  // Import icons for social media
import { Link } from 'react-router';

const Footer = () => {
  return (
    <footer className="bg-neutral-900 text-white py-8 ">
      <div className="max-w-full md:max-w-[80%] mx-auto px-4 ">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left section: About us */}
          <div>
            <h3 className="text-2xl font-bold text-gray-200">About Blogifyon</h3>
            <p className="mt-4 text-gray-400">
              Blogifyon is where creativity meets conversation. Join us in exploring diverse ideas, personal growth, and insightful stories.
            </p>
          </div>

          {/* Middle section: Useful Links */}
          <div>
            <h3 className="text-2xl font-bold text-gray-200">Quick Links</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/" className="hover:text-indigo-400 text-gray-400">Home</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-indigo-400 text-gray-400">About Us</Link>
              </li>
            </ul>
          </div>

          {/* Right section: Social Media */}
          <div>
            <h3 className="text-2xl font-bold text-gray-200">Follow Us</h3>
            <div className="mt-4 flex space-x-6">
              <Link to="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <FaTwitter className="text-2xl hover:text-indigo-400 text-gray-100" />
              </Link>
              <Link to="https://facebook.com" target="_blank" rel="noopener noreferrer">
                <FaFacebook className="text-2xl hover:text-indigo-400 text-gray-100" />
              </Link>
              <Link to="https://instagram.com" target="_blank" rel="noopener noreferrer">
                <FaInstagram className="text-2xl hover:text-indigo-400 text-gray-100" />
              </Link>
              <Link to="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                <FaLinkedin className="text-2xl hover:text-indigo-400 text-gray-100" />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom section: Copyright */}
        <div className="text-center mt-8 border-t border-gray-700 pt-4">
          <p className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} All Rights Reserved | Samin Mahmud
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
