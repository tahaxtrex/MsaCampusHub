import { SlSocialInstagram } from "react-icons/sl";
import { FaWhatsapp } from "react-icons/fa";
import { CiLinkedin } from "react-icons/ci";
import { MdOutlineMailOutline } from "react-icons/md";

const Footer1 = () => {
  return (
    <footer className="bg-white shadow-inner border-t border-gray-200 mt-10">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* === Left Section: Logo or Description === */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Muslim Student Association</h2>
          <p className="text-gray-600 mt-2 text-sm">
            Building unity, community, and faith at Constructor University.
          </p>
        </div>

        {/* === Center Section: Social Media Icons === */}
        <div className="flex flex-col items-center">
          <h3 className="text-md font-semibold text-gray-700 mb-2">Follow Us</h3>
          <div className="flex space-x-4">
            <a
              href="https://www.instagram.com/muslimsofcub/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <SlSocialInstagram className="h-6 w-6 text-gray-700 hover:text-green-600 transition" />
            </a>
            <a
              href="https://chat.whatsapp.com/Izg7UIoa3QN2fEqqUJUMx8"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaWhatsapp className="h-6 w-6 text-gray-700 hover:text-green-600 transition" />
            </a>
            <a
              href="https://www.linkedin.com/in/taha-hbirri-84a524311/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <CiLinkedin className="h-7 w-7 text-gray-700 hover:text-green-600 transition" />
            </a>
            <a
              href="mailto:msa.constructoruniversity@gmail.com?subject=Contact%20MSA&body=Salam,"
            >
              <MdOutlineMailOutline className="h-7 w-7 text-gray-700 hover:text-green-600 transition" />
            </a>
          </div>
        </div>

        {/* === Right Section: Links or Quick Navigation === */}
        <div className="text-center md:text-right">
          <h3 className="text-md font-semibold text-gray-700 mb-2">Quick Links</h3>
          <ul className="space-y-1 text-sm text-gray-600">
            <li><a href="/about" className="hover:text-green-600">About Us</a></li>
            <li><a href="/donate" className="hover:text-green-600">Donate</a></li>
            <li><a href="/calendar" className="hover:text-green-600">Events</a></li>
            <li><a href="/contact" className="hover:text-green-600">Contact</a></li>
          </ul>
        </div>

      </div>

      {/* === Bottom Strip === */}
      <div className="border-t border-gray-200 py-4 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Muslim Student Association – All rights reserved.
      </div>
    </footer>
  );
};

export default Footer1;
