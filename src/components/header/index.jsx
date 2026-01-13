import { useState, useEffect, useRef } from 'react';
import useAuthCheck from '../verify'
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Logo from '/imgs/logo_purple.png'
import useEmblaCarousel from 'embla-carousel-react'
import { 
  faSearch, 
  faUser, 
  faShoppingCart, 
  faBars, 
  faTimes, 
  faTag,
  faArrowRightFromBracket
} from '@fortawesome/free-solid-svg-icons';
import { BiHome } from "react-icons/bi";
import { BiSolidWatchAlt } from "react-icons/bi";
import { IoHeadset } from "react-icons/io5";
import { MdOutlineCable } from "react-icons/md";
import { IoFlash } from "react-icons/io5";
import { FaComputerMouse, FaGamepad, FaKeyboard } from "react-icons/fa6";
import { BiSolidWebcam } from "react-icons/bi";
import { FaLightbulb } from "react-icons/fa6";
import { FaFloppyDisk } from "react-icons/fa6";
import { BsFillHouseGearFill } from "react-icons/bs";
import { BASE_URL } from '../../config';


const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const [categoryApi, setCategoryAPI] = useState([]);
  const [userlogged, setUser] = useState({}); 
  const isLogged = useAuthCheck(); 
  const searchRef = useRef(null);
  const navigate = useNavigate()
  const [search, setSearch] = useState("");
  const [quantityItemCart, setQuantityItemCart] = useState(0)
  const [emblaRef] = useEmblaCarousel()

  const handleSearch = (e) => {
    e.preventDefault();
    if (!search.trim()) return;
    navigate(`/products?search=${encodeURIComponent(search)}`);
  };

  const updateCartOnly = async () => {
    const token = localStorage.getItem("access");
    if (!token) return;
    try {
      const cartRes = await fetch(`${BASE_URL}/api/cart/my-cart/`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (cartRes.ok) {
        const cartData = await cartRes.json();
        setQuantityItemCart(cartData.items.length);
      }
    } catch (error) {
      console.error("Erro ao atualizar contador do carrinho:", error);
    }
  }

  const syncHeader = async () => {
    const token = localStorage.getItem("access");
    if (!token) {
      setUser({});
      setQuantityItemCart(0);
      return;
    }

    try {
      const userRes = await fetch(`${BASE_URL}/api/users/me/`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (userRes.ok) {
        const userData = await userRes.json();
        setUser(userData);

        const cartRes = await fetch(`${BASE_URL}/api/cart/my-cart/`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (cartRes.ok) {
          const cartData = await cartRes.json();
          setQuantityItemCart(cartData.items.length);
        }
      } else {
        localStorage.clear();
        setUser({});
        setQuantityItemCart(0);
      }
    } catch (error) {
      console.error("Erro na sincronização:", error);
    }
  };

  useEffect(() => {
    syncHeader();

    window.addEventListener("authChange", syncHeader);
    window.addEventListener("cartUpdate", updateCartOnly);
    window.addEventListener("storage", syncHeader); 
    window.addEventListener("focus", syncHeader);

    return () => {
      window.removeEventListener("authChange", syncHeader);
      window.removeEventListener("cartUpdate", updateCartOnly);
      window.removeEventListener("storage", syncHeader);
      window.removeEventListener("focus", syncHeader);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    fetch(`${BASE_URL}/api/category/`)
      .then(res => res.json())
      .then(data => setCategoryAPI(data))
      .catch(err => console.error(err));
          
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const categoryIcons = {
    "smartwatches": BiSolidWatchAlt,
    "fones-de-ouvido-e-headsets": IoHeadset,
    "carregadores-e-cabos": MdOutlineCable ,
    "power-banks": IoFlash,
    "mouse": FaComputerMouse,
    "teclado": FaKeyboard,
    "gamer": FaGamepad,
    "iluminacao": FaLightbulb,
    "armazenamento": FaFloppyDisk,
    "casa-inteligente": BsFillHouseGearFill,
    "webcam": BiSolidWebcam,
  };

  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      if (isMenuOpen) return;
      if (e.key === 'k' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        if (!['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) {
          e.preventDefault(); 
          searchRef.current?.focus();
        }
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [isMenuOpen]);

  const handleLogout = () => {
    localStorage.clear();
    window.dispatchEvent(new Event("authChange"));
    navigate("/login");
  };

  return (
    <>
      <section className={`top-0 fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-sm shadow-lg' : 'bg-white shadow-sm'}`}>
        
        <div className="px-4 md:px-6 py-3 border-b border-gray-100">
          <div className="max-w-7xl  mx-auto">
            <div className="flex items-center justify-between gap-4">
              
              <div className="flex items-center gap-4 flex-1 md:flex-none">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="Menu"
                >
                  <FontAwesomeIcon 
                    icon={isMenuOpen ? faTimes : faBars} 
                    className="text-gray-700 w-4 h-4" 
                  />
                </button>

                <a href="/" className="flex items-center group">
                  <div className="relative">
                    <img src={Logo} alt="logo" className='w-12' />
                  </div>
                </a>
              </div>

              <div className="hidden md:flex flex-1 max-w-2xl mx-6">
                <div className="relative w-full group">
                  {!isMenuOpen && (
                    <div className="absolute -inset-1 opacity-0">
                      <input
                        type="text"
                        className="absolute w-0 h-0 opacity-0"
                        onKeyDown={(e) => {
                          if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                            e.preventDefault();
                            searchRef.current?.focus();
                          }
                        }}
                        tabIndex={-1}
                      />
                    </div>
                  )}
                  
                  <div className="relative">
                    <div className={`absolute -inset-1 rounded-xl bg-gradient-to-r from-[#3626a7]/10 via-[#ff331f]/5 to-[#3626a7]/10 blur-sm transition-opacity duration-500 ${
                      isSearchFocused ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'
                    }`}></div>
                    
                    <div className={`relative bg-white rounded-xl border transition-all duration-300 ${
                      isSearchFocused 
                        ? 'border-[#3626a7] shadow-lg' 
                        : 'border-gray-300 group-hover:border-gray-400 shadow-sm'
                    }`}>
                      <form onSubmit={handleSearch} className="relative flex items-center">
                        <div className="absolute left-4">
                          <FontAwesomeIcon 
                            icon={faSearch} 
                            className={`w-4 h-4 transition-all duration-300 ${
                              isSearchFocused 
                                ? 'text-[#3626a7] scale-110' 
                                : 'text-gray-400 group-hover:text-gray-600'
                            }`} 
                          />
                        </div>
                        
                        <input
                          onChange={(e) => setSearch(e.target.value)}
                          ref={searchRef}
                          value={search}
                          type="search"
                          placeholder="Search for products, brands, and inspiration..."
                          className="w-full pl-12 pr-28 py-3.5 bg-transparent text-gray-900 placeholder-gray-500 focus:outline-none"
                          onFocus={() => setIsSearchFocused(true)}
                          onBlur={() => setIsSearchFocused(false)}
                        />
                        
                        <div className="absolute right-3 flex items-center gap-2">
                          <div className={`flex items-center gap-1 transition-all duration-300 ${
                            isSearchFocused ? 'opacity-0 invisible scale-95' : 'opacity-100 visible scale-100'
                          }`}>
                            <kbd className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded border border-gray-300 flex items-center gap-1">
                              <span className="text-[10px]">⌘</span>
                              <span>K</span>
                            </kbd>
                          </div>
                          
                          <button
                            type="submit"
                            className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 ${
                              search
                                ? 'bg-gradient-to-r from-[#3626a7] to-[#2a1f8c] text-white hover:shadow-lg hover:scale-105 active:scale-95'
                                : 'bg-gray-100 text-gray-400 cursor-default'
                            }`}
                          >
                            <span className="text-sm">Search</span>
                            <svg 
                              className={`w-3.5 h-3.5 transition-transform duration-300 ${
                                search ? 'group-hover:translate-x-0.5' : ''
                              }`} 
                              fill="none" 
                              stroke="currentColor" 
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button 
                  onClick={() => {
                    setIsMenuOpen(false);
                    searchRef.current?.focus();
                  }}
                  className="md:hidden p-2.5 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <FontAwesomeIcon icon={faSearch} className="w-4 h-4" />
                </button>

                <div className="relative group hidden md:block">
                  <button className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-50 transition-colors group">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#3626a7] to-[#ff331f] flex items-center justify-center overflow-hidden">
                      {userlogged.profile?.avatar ? (
                        <img className='w-full h-full object-cover' src={userlogged.profile.avatar} alt={userlogged.username} />
                      ) : (
                        <FontAwesomeIcon icon={faUser} className="w-3.5 h-3.5 text-white" />
                      )}
                    </div>
                    <div className="text-left hidden lg:block max-w-[200px]">
                      <p className="truncate text-base font-medium">{userlogged.first_name || "user"}</p>
                    </div>
                  </button>
                  
                  <div className="z-9999 absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 origin-top-right">
                    <div className="p-2 w-full">
                      <div className="px-3 py-2 mb-1">
                        <p className="text-base font-semibold text-gray-900">Welcome</p>
                        <p className="text-sm text-gray-500 truncate">{userlogged.first_name ? userlogged.first_name : "Log in for better experience"}</p>
                      </div>
                      
                      <Link to={userlogged.id ? "/profile" : "/login"} className="flex items-center px-3 py-2.5 text-sm text-gray-700 hover:text-[#3626a7] hover:bg-gray-50 rounded-lg transition-colors">
                        <span className="mr-3">→</span>
                        <span>My Account</span>
                      </Link>

                      <Link to={userlogged.id ? "/profile/orders" : "/login"} className="flex items-center px-3 py-2.5 text-sm text-gray-700 hover:text-[#3626a7] hover:bg-gray-50 rounded-lg transition-colors">
                        <span className="mr-3">→</span>
                        <span>Orders</span>
                      </Link>

                      <Link to={userlogged.id ? "/profile/favorites" : "/login"} className="flex items-center px-3 py-2.5 text-sm text-gray-700 hover:text-[#3626a7] hover:bg-gray-50 rounded-lg transition-colors">
                        <span className="mr-3">→</span>
                        <span>Favorites</span>
                      </Link>

                      <Link to={userlogged.id ? "/profile/settings" : "/login"} className="flex items-center px-3 py-2.5 text-sm text-gray-700 hover:text-[#3626a7] hover:bg-gray-50 rounded-lg transition-colors">
                        <span className="mr-3">→</span>
                        <span>Settings</span>
                      </Link>
                      
                      {userlogged.id ? (
                        <button onClick={handleLogout} className="w-full px-3 py-2.5 mt-2 text-sm bg-gradient-to-r from-[#3626a7] to-[#2a1f8c] text-white font-medium rounded-lg hover:shadow-lg transition-all flex items-center justify-between">
                          <span>Logout</span>
                          <FontAwesomeIcon icon={faArrowRightFromBracket} />
                        </button>
                      ) : (
                        <Link to="/login" className="block w-full px-3 py-2.5 mt-2 text-sm bg-gradient-to-r from-[#3626a7] to-[#2a1f8c] text-white text-center font-medium rounded-lg hover:shadow-lg transition-all">Log in</Link>
                      )}
                    </div>
                  </div>
                </div>

                <Link to={userlogged.id ? "/profile" : "/login"} className="md:hidden p-2.5 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-50 transition-colors">
                  <FontAwesomeIcon icon={faUser} className="w-4 h-4" />
                </Link>

                <div className="relative group">
                  <Link to={"/cart"} className="p-2.5 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-50 transition-colors relative">
                    <FontAwesomeIcon icon={faShoppingCart} className="w-4 h-4" />
                    {quantityItemCart > 0 && (
                      <span className="absolute -top-1 -right-1 bg-[#ff331f] text-white text-xs font-medium rounded-full w-5 h-5 flex items-center justify-center">
                        {quantityItemCart}
                      </span>
                    )}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border-b border-gray-100 w-full overflow-hidden hidden md:block">
          <div className="max-w-[1500px] mx-auto relative px-0">
            <nav className="flex items-center py-2 px-15">
              <div className="embla w-full [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)] [-webkit-mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]" ref={emblaRef}>
                <div className="px-0 flex items-center gap-4 md:gap-8 cursor-grab active:cursor-grabbing">
                  {categoryApi.map((category, index) => {
                    const Icon = categoryIcons[category.slug] || BiHome;                
                    return (
                      <Link
                        to={`/category/${category.slug}`}
                        key={index}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all whitespace-nowrap ${
                          activeCategory === index 
                            ? 'text-[#3626a7] bg-[#3626a7]/5' 
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                        }`}
                        onMouseEnter={() => setActiveCategory(index)}
                        onMouseLeave={() => setActiveCategory(null)}
                      >
                        <Icon className={`w-3.5 h-3.5 ${activeCategory === index ? 'text-[#ff331f]' : 'text-gray-400'}`}/>
                        <span className="text-sm font-medium">{category.name}</span>
                      </Link>
                    )
                  })}
                </div>
              </div>
            </nav>
          </div>
        </div>
      </section>

      <div className={`md:hidden fixed inset-0 z-40 h-full ${isMenuOpen ? 'visible' : 'invisible'}`}>
        <div 
          className={`absolute inset-0 bg-black/20 transition-opacity duration-300 ${isMenuOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setIsMenuOpen(false)}
        />
        
        <div className={`absolute top-0 left-0 h-full w-80 bg-white transform transition-transform duration-300 ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="p-6 border-b border-gray-100 mt-20">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl mb-3">
              {userlogged.profile?.avatar ? (
                <Link to={"/profile"} onClick={() => setIsMenuOpen(false)} className="w-12 h-12 rounded-full bg-gradient-to-br from-[#3626a7] to-[#ff331f] flex items-center justify-center overflow-hidden">
                  <img className='w-full h-full object-cover' src={userlogged.profile.avatar} alt={userlogged.username} />
                </Link>
              ) : (
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#3626a7] to-[#ff331f] flex items-center justify-center">
                  <FontAwesomeIcon icon={faUser} className="w-5 h-5 text-white" />
                </div>
              )}
              <div>
                <p className="font-semibold text-gray-900">Welcome!</p>
                <p className="text-sm text-gray-500 truncate">{userlogged.first_name ? userlogged.first_name : "Log in for better experience"}</p>
              </div>
            </div>
          </div>

          <div className="p-2 h-[calc(100vh-250px)] overflow-y-auto">
            <div className="mb-10">
              <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3 px-2">
                Categories
              </h3>
              <div className="grid grid-cols-1 gap-2">
                {categoryApi.map((category, index) => {
                  const Icon = categoryIcons[category.slug] || BiHome;                
                  return (
                    <Link
                      key={index}
                      to={`/category/${category.slug}`}
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-3 p-3 bg-gray-50/70 rounded-xl hover:bg-gray-100 transition-colors group"
                    >
                      <Icon className="w-5 h-5 text-gray-600 group-hover:text-[#3626a7] transition-colors" />
                      <span className="text-sm font-medium text-gray-700">{category.name}</span>
                    </Link>
                  )
                })}
              </div>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100 bg-white">
            {userlogged.id ? (
              <button onClick={handleLogout} className="w-full py-3 bg-gradient-to-r from-[#3626a7] to-[#2a1f8c] text-white font-semibold rounded-lg hover:shadow-lg transition-all flex items-center justify-center">
                <span>Logout</span>
                <FontAwesomeIcon className='ml-3' icon={faArrowRightFromBracket} />
              </button>
            ) : (
              <Link to="/login" onClick={() => setIsMenuOpen(false)} className="block w-full py-3 bg-gradient-to-r from-[#3626a7] to-[#2a1f8c] text-white text-center font-semibold rounded-lg hover:shadow-lg transition-all">Log in</Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;