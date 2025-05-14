import { FaTwitter, FaInstagram, FaFacebook } from 'react-icons/fa';

function Footer() {
  return (
    <footer className="w-full bg-blue-800 text-white p-5">
      <div className="container mx-auto text-center">
        <p className="text-sm">
          © 2025 <span className="font-semibold">homelycareonline.</span> All rights reserved.
        </p>
        <div className="flex justify-center space-x-4 mt-2">
          <a href="#" className="hover:text-gray-200" aria-label="Twitter">
            <FaTwitter size={24} />
          </a>
          <a href="#" className="hover:text-gray-200" aria-label="Instagram">
            <FaInstagram size={24} />
          </a>
          <a href="#" className="hover:text-gray-200" aria-label="Facebook">
            <FaFacebook size={24} />
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;


