import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faInstagram,
  faLinkedin,
  faFacebook,
  faYoutube,
  faXTwitter,
} from "@fortawesome/free-brands-svg-icons";

export default function Footer() {
  return (
    <footer className="w-full flex flex-col">
      <div className="max-w-[1500px] mx-auto w-full justify-center flex items-center py-16">
        <Image
          src="/LOGO-SENAC80.png"
          alt="Logo"
          width={300}
          height={300}
          className="w-[150px] md:w-[300px] h-auto"
        />
      </div>

      <div className="flex flex-col w-full px-4 py-8 bg-[#003282]">
        <div className="max-w-[1500px] mx-auto w-full flex flex-col sm:flex-row justify-center items-center gap-4">
          <ul className="flex items-center gap-6 md:gap-2 text-[#a7a4a4]">
            <li>
              <a
                href="https://www.facebook.com/senacpe/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="hover:text-white transition-colors duration-200 block"
              >
                <FontAwesomeIcon icon={faFacebook} className="w-6 h-6" />
              </a>
            </li>
             <li>
              <a
                href="https://x.com/senacpe"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X (Twitter)"
                className="hover:text-white transition-colors duration-200 block"
              >
                <FontAwesomeIcon icon={faXTwitter} className="w-5 h-5" />
              </a>
            </li>
            <li>
              <a
                href="https://www.linkedin.com/company/senacpe"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="hover:text-white transition-colors duration-200 block"
              >
                <FontAwesomeIcon icon={faLinkedin} className="w-6 h-6" />
              </a>
            </li>
            <li>
              <a
                href="https://www.instagram.com/senacpe/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="hover:text-white transition-colors duration-200 block"
              >
                <FontAwesomeIcon icon={faInstagram} className="w-6 h-6" />
              </a>
            </li>
            <li>
              <a
                href="https://www.youtube.com/user/SenacPernambuco"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="hover:text-white transition-colors duration-200 block"
              >
                <FontAwesomeIcon icon={faYoutube} className="w-6 h-6" />
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
