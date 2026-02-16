'use client';

import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, PenTool, ArrowRight, ChevronDown, User, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavItem {
  name: string;
  path: string;
  children?: { name: string; path: string }[];
}

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false);
    setDropdownOpen(null);
    setUserMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks: NavItem[] = [
    { name: 'Home', path: '/' },
    { name: 'Artists', path: '/artists' },
    { name: 'Portfolio', path: '/portfolio' },
    { 
      name: 'Aftercare', 
      path: '/aftercare',
      children: [
        { name: 'Tattoo', path: '/aftercare?type=tattoo' },
        { name: 'Piercing', path: '/aftercare?type=piercing' }
      ]
    },
    { name: 'Contact', path: '/contact' },
  ];

  const isParentActive = (item: NavItem) => {
    if (location.pathname === item.path) return true;
    if (item.children) {
      return item.children.some(child => location.pathname === child.path.split('?')[0]);
    }
    return false;
  };

  return (
    <>
      <nav 
        className={`fixed w-full z-50 transition-all duration-500 ease-in-out ${
          scrolled 
            ? 'bg-ink-950/80 backdrop-blur-xl border-b border-white/5 py-3 shadow-2xl' 
            : 'bg-gradient-to-b from-ink-950/80 to-transparent py-6 border-b border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 group relative z-50">
              <div className={`transition-transform duration-500 ${scrolled ? 'scale-90' : 'scale-100'}`}>
                <PenTool className="h-8 w-8 text-ink-accent group-hover:rotate-12 transition-transform duration-300 drop-shadow-[0_0_10px_rgba(212,175,55,0.3)]" />
              </div>
              <span className="font-serif text-2xl font-black tracking-[0.15em] text-white">
                INKSMITH
              </span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <div className="flex items-center space-x-6">
                {navLinks.map((link) => (
                  <div 
                    key={link.name} 
                    className="relative group/dropdown"
                    onMouseEnter={() => setDropdownOpen(link.name)}
                    onMouseLeave={() => setDropdownOpen(null)}
                  >
                    <Link
                      to={link.path}
                      className={`relative text-xs font-bold uppercase tracking-[0.2em] transition-colors duration-300 py-4 flex items-center ${
                        isParentActive(link) ? 'text-white' : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      {link.name}
                      {link.children && <ChevronDown className="w-3 h-3 ml-1" />}
                      <span className={`absolute bottom-2 left-0 w-full h-px bg-ink-accent transform origin-left transition-transform duration-300 ${
                        isParentActive(link) ? 'scale-x-100' : 'scale-x-0 group-hover/dropdown:scale-x-50'
                      }`} />
                    </Link>

                    {/* Dropdown Menu */}
                    {link.children && (
                      <div className="absolute top-full left-0 w-48 pt-2 opacity-0 invisible group-hover/dropdown:opacity-100 group-hover/dropdown:visible transition-all duration-300 transform translate-y-2 group-hover/dropdown:translate-y-0">
                        <div className="bg-ink-950/95 backdrop-blur-xl border border-white/10 rounded-lg overflow-hidden shadow-2xl">
                          {link.children.map((child) => (
                            <Link
                              key={child.name}
                              to={child.path}
                              className="block px-6 py-3 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-ink-accent hover:bg-white/5 transition-colors"
                            >
                              {child.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="flex items-center space-x-4">
                {/* User Auth Section */}
                {user ? (
                   <div className="relative" onMouseEnter={() => setUserMenuOpen(true)} onMouseLeave={() => setUserMenuOpen(false)}>
                      <button className="flex items-center space-x-2 text-sm font-bold text-white hover:text-ink-accent transition-colors py-2">
                         <div className="w-8 h-8 rounded-full bg-ink-accent/10 border border-ink-accent/30 flex items-center justify-center text-ink-accent">
                            <User className="w-4 h-4" />
                         </div>
                         <span className="uppercase tracking-wide text-xs">{user.name.split(' ')[0]}</span>
                         <ChevronDown className="w-3 h-3" />
                      </button>

                      {/* User Dropdown */}
                      <div className={`absolute top-full right-0 w-56 pt-2 transition-all duration-300 transform ${userMenuOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-2'}`}>
                        <div className="bg-ink-950/95 backdrop-blur-xl border border-white/10 rounded-lg overflow-hidden shadow-2xl">
                           <div className="px-6 py-4 border-b border-white/5">
                             <p className="text-white text-sm font-bold truncate">{user.name}</p>
                             <p className="text-gray-500 text-xs truncate">{user.email}</p>
                             {user.role === 'admin' && (
                               <span className="inline-block mt-2 px-2 py-0.5 bg-red-500/20 text-red-400 text-[10px] font-bold uppercase rounded border border-red-500/30">Admin</span>
                             )}
                           </div>
                           
                           {user.role === 'admin' && (
                             <Link to="/admin" className="block px-6 py-3 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-white hover:bg-white/5 transition-colors flex items-center">
                               <LayoutDashboard className="w-3 h-3 mr-2" /> Dashboard
                             </Link>
                           )}

                           <button 
                            onClick={handleLogout}
                            className="w-full text-left px-6 py-3 text-xs font-bold uppercase tracking-widest text-red-400 hover:text-red-300 hover:bg-white/5 transition-colors flex items-center"
                           >
                             <LogOut className="w-3 h-3 mr-2" /> Logout
                           </button>
                        </div>
                      </div>
                   </div>
                ) : (
                  <Link 
                    to="/login"
                    className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-white transition-colors mr-2"
                  >
                    Login
                  </Link>
                )}

                {/* CTA Button */}
                <Link 
                  to="/book" 
                  className={`group relative px-6 py-2.5 overflow-hidden font-bold tracking-widest uppercase text-xs border transition-all duration-300 ${
                     scrolled 
                      ? 'bg-ink-accent text-black border-ink-accent hover:bg-white hover:border-white' 
                      : 'bg-transparent text-white border-white/30 hover:border-white hover:bg-white hover:text-ink-950'
                  }`}
                >
                  <span className="relative z-10 flex items-center">
                    Book Now 
                  </span>
                </Link>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden relative z-50">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 text-white hover:text-ink-accent transition-colors focus:outline-none"
                aria-label="Toggle menu"
              >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div 
        className={`fixed inset-0 z-40 bg-ink-950/98 backdrop-blur-xl transition-all duration-500 md:hidden flex flex-col justify-center items-center ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
           <div className="absolute top-1/4 right-0 w-64 h-64 bg-ink-accent/5 rounded-full blur-[80px]"></div>
           <div className="absolute bottom-1/4 left-0 w-64 h-64 bg-blue-500/5 rounded-full blur-[80px]"></div>
        </div>

        <nav className="flex flex-col space-y-6 text-center relative z-10 w-full px-8 max-h-[80vh] overflow-y-auto">
          {navLinks.map((link, idx) => (
            <div key={link.name} className="flex flex-col items-center">
              <Link
                to={link.path}
                className={`text-2xl font-serif font-bold uppercase tracking-widest text-white hover:text-ink-accent transition-all duration-300 transform flex items-center ${
                  isOpen ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                }`}
                style={{ transitionDelay: `${idx * 100}ms` }}
              >
                {link.name}
              </Link>
              
              {/* Mobile Submenu */}
              {link.children && (
                <div className={`mt-4 space-y-4 flex flex-col items-center border-l-2 border-white/10 pl-4 transition-all duration-500 delay-[${idx * 100 + 200}ms] ${
                   isOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                }`}>
                  {link.children.map((child) => (
                    <Link
                      key={child.name}
                      to={child.path}
                      className="text-sm font-bold uppercase tracking-[0.2em] text-gray-400 hover:text-ink-accent"
                      onClick={() => setIsOpen(false)}
                    >
                      {child.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}

          <div 
             className={`pt-8 border-t border-white/10 w-full max-w-xs mx-auto transition-all duration-500 delay-500 transform ${
              isOpen ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}
          >
             {user ? (
               <div className="space-y-4">
                 <div className="text-white text-lg font-serif">{user.name}</div>
                 
                 {/* Admin Link for Mobile */}
                 {user.role === 'admin' && (
                   <Link 
                     to="/admin" 
                     className="block text-ink-accent uppercase tracking-widest text-sm font-bold flex items-center justify-center gap-2"
                     onClick={() => setIsOpen(false)}
                   >
                     <LayoutDashboard className="w-4 h-4" /> Admin Dashboard
                   </Link>
                 )}

                 <button onClick={() => { handleLogout(); setIsOpen(false); }} className="text-red-400 uppercase tracking-widest text-sm font-bold">Sign Out</button>
               </div>
             ) : (
                <div className="flex flex-col gap-4">
                  <Link 
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="text-gray-400 hover:text-white uppercase tracking-widest text-sm font-bold"
                  >
                    Client Login
                  </Link>
                  <Link 
                    to="/book" 
                    className="inline-flex justify-center items-center px-10 py-4 bg-ink-accent text-ink-950 font-black tracking-[0.2em] uppercase text-sm hover:bg-white transition-colors w-full"
                    onClick={() => setIsOpen(false)}
                  >
                    Book Appointment <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </div>
             )}
          </div>
        </nav>
      </div>
    </>
  );
};

export default Navbar;