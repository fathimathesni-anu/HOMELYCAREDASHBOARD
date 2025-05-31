import { FaTwitter, FaInstagram, FaFacebook } from 'react-icons/fa';

function Footer() {
  return (
    <footer className="w-full bg-blue-800 text-white py-6 px-4 sm:px-8 md:px-16">
      <div className="container mx-auto flex flex-col items-center space-y-3 sm:space-y-0 sm:flex-row sm:justify-between">
        <p className="text-sm text-center sm:text-left">
          © 2025 <span className="font-semibold">homelycareonline.</span> All rights reserved.
        </p>
        <div className="flex space-x-6">
          <a href="#" className="hover:text-gray-300 transition-colors duration-200" aria-label="Twitter">
            <FaTwitter size={28} />
          </a>
          <a href="#" className="hover:text-gray-300 transition-colors duration-200" aria-label="Instagram">
            <FaInstagram size={28} />
          </a>
          <a href="#" className="hover:text-gray-300 transition-colors duration-200" aria-label="Facebook">
            <FaFacebook size={28} />
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;



