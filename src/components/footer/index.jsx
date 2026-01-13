import { BsArrowRight } from "react-icons/bs";
import Logo from '../../../public/imgs/logo_orange.png'
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaEnvelope, FaInstagram, FaLinkedin, FaLocationDot, FaWhatsapp } from "react-icons/fa6";
import { FaGithub } from "react-icons/fa";
import { BASE_URL } from "../../config";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [categoryApi, setCategoryAPI] = useState([]);
  // 1. Estado para controlar a visibilidade do botão
  const [isVisible, setIsVisible] = useState(false);

  // 2. Lógica para monitorar o scroll
  useEffect(() => {
    const toggleVisibility = () => {
      // Se rolar mais de 300px, mostra o botão
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);

    // Limpa o evento ao desmontar o componente
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  useEffect(() => {
    fetch(`${BASE_URL}/api/category/`)
      .then(res => res.json())
      .then(data => {
        setCategoryAPI(data);
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <footer className="w-full bottom-0 overflow-hidden bg-gradient-to-br from-[#fafaff] via-[#f5f4ff] to-[#fafaff] text-[#0d0106] pt-12 pb-8 border-t border-[#3626a7]/10">
      <div className="container relative mx-auto px-4">
        <div className="grid lg:grid-cols-4 gap-8 mb-12">
          <div className="lg:col-span-1">
            <div className="flex items-center mb-6">
              <div className="relative rounded-full">
                <div className="absolute rounded-full"></div>
                <div className="relative rounded-full p-2">
                  <img src={Logo} className="rounded-full w-13 h-13 flex items-center justify-center backdrop-blur-sm " />
                </div>
              </div>
              <div className="ml-4">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-[#3626a7] via-[#9820d4] to-[#3626a7] bg-clip-text text-transparent">
                  IPolar
                </h2>
                <p className="text-sm text-[#0d0106]/70 mt-1">Building better experiences</p>
              </div>
            </div>
            <p className="text-[#0d0106]/80 text-sm leading-relaxed mb-6">
              Creating beautiful, accessible digital experiences with modern design principles and cutting-edge technology.
            </p>

            <div className="mb-8 ">
              <h3 className="text-sm font-semibold text-[#3626a7] mb-3">Stay Updated</h3>
              <div className="flex shadow-sm max-w-[90%] ">
                <input
                  type="email"
                  placeholder="Your email"
                  className=" max-w-[90%] px-4 py-3 bg-white border border-[#3626a7]/20 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-[#9820d4] focus:border-transparent placeholder:text-[#0d0106]/40 shadow-inner"
                />
                <button className="px-4 bg-gradient-to-r from-[#3626a7] to-[#9820d4] text-white hover:from-[#2a1f85] hover:to-[#7a1aa9] transition-all duration-300 rounded-r-lg flex items-center justify-center shadow-md hover:shadow-lg">
                  <BsArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-[#3626a7] mb-6 pb-2 border-b border-[#3626a7]/20 flex items-center">
              <span className="bg-gradient-to-r from-[#3626a7] to-[#9820d4] w-1 h-6 rounded-full mr-3"></span>
              Links
            </h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="flex items-center text-[#0d0106]/80 hover:text-[#ff331f] hover:translate-x-1 transition-all duration-300 group">
                  <span className="w-0 h-0.5 bg-[#ff331f] group-hover:w-3 mr-2 transition-all duration-300"></span>
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="flex items-center text-[#0d0106]/80 hover:text-[#ff331f] hover:translate-x-1 transition-all duration-300 group">
                  <span className="w-0 h-0.5 bg-[#ff331f] group-hover:w-3 mr-2 transition-all duration-300"></span>
                  About
                </Link>
              </li>
              <li>
                <Link to="/contact" className="flex items-center text-[#0d0106]/80 hover:text-[#ff331f] hover:translate-x-1 transition-all duration-300 group">
                  <span className="w-0 h-0.5 bg-[#ff331f] group-hover:w-3 mr-2 transition-all duration-300"></span>
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-[#3626a7] mb-6 pb-2 border-b border-[#9820d4]/20 flex items-center">
              <span className="bg-gradient-to-r from-[#9820d4] to-[#ff331f] w-1 h-6 rounded-full mr-3"></span>
              Category
            </h3>
            <ul className="space-y-3">
              {categoryApi.map((item) => (
                <li key={item.name}>
                  <Link
                    to={`/category/${item.slug}`}
                    className="flex items-center text-[#0d0106]/80 hover:text-[#9820d4] hover:translate-x-1 transition-all duration-300 group"
                  >
                    <span className="w-0 h-0.5 bg-[#9820d4] group-hover:w-3 mr-2 transition-all duration-300"></span>
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-[#3626a7] mb-6 pb-2 border-b border-[#ff331f]/20 flex items-center">
              <span className="bg-gradient-to-r from-[#ff331f] to-[#3626a7] w-1 h-6 rounded-full mr-3"></span>
              Contact Info
            </h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-[#3626a7]/10 to-[#9820d4]/10 flex items-center justify-center mr-3 mt-1 shadow-sm">
                  <FaEnvelope className="fill-[var(--color4)]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[var(--color3)]">Email</p>
                  <p className="text-[#0d0106]/60 text-sm">gabri3lcardoso07@gmail.com</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-[#9820d4]/10 to-[#ff331f]/10 flex items-center justify-center mr-3 mt-1 shadow-sm">
                  <FaWhatsapp className="fill-[var(--color4)]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[var(--color3)]">Phone</p>
                  <p className="text-[#0d0106]/60 text-sm">(16) 99297-4306</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-[#ff331f]/10 to-[#3626a7]/10 flex items-center justify-center mr-3 mt-1 shadow-sm">
                  <FaLocationDot className="fill-[var(--color4)]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[var(--color3)]">Location</p>
                  <p className="text-[#0d0106]/60 text-sm">Ribeirão Preto, SP</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#3626a7]/10"></div>
          </div>
          <div className="relative flex justify-center">
            <div className="px-4 bg-gradient-to-br from-[#fafaff] via-[#f5f4ff] to-[#fafaff]">
              <div className="w-12 h-1 bg-gradient-to-r from-[#3626a7] via-[#9820d4] to-[#ff331f] rounded-full"></div>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-[#0d0106]/60 text-sm">
              © {currentYear} <span className="font-semibold text-[#3626a7]">IPolar</span>. All rights reserved.
            </p>
          </div>

          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <div className="text-sm text-[#0d0106]/60 mr-4">Follow us:</div>
            {[
              { icon: FaLinkedin, link: "https://www.linkedin.com/in/gabriell-cardoso" },
              { icon: FaInstagram, link: "https://www.instagram.com/gabri3l.cardoso" },
              { icon: FaGithub, link: "https://github.com/gabriell-c" },
            ].map((social, index) => (
              <a
                target="_blank"
                key={index}
                href={social.link}
                className="relative group"
              >
                <div className="relative w-10 h-10 rounded-lg bg-[#ff331f]/10 border border-white/50 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-md hover:bg-[#3626a7]/10 group">
                  <social.icon className="group-hover:text-[#3626a7] w-5 h-5 text-[#ff331f]" />
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* 3. BOTÃO COM LÓGICA DE VISIBILIDADE E ANIMAÇÃO */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className={`fixed bottom-8 right-8 w-12 h-12 rounded-full bg-gradient-to-r from-[#3626a7] to-[#9820d4] text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-500 flex items-center justify-center z-50 group backdrop-blur-sm bg-white/5 border border-white/20 
            ${isVisible ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-10 pointer-events-none'}`}
          aria-label="Back to top"
        >
          <div className="transform group-hover:-translate-y-1 transition-transform duration-300">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </div>
        </button>

      </div>
    </footer>
  );
};

export default Footer;