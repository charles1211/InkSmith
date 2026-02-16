import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, MapPin, Mail, Phone } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-ink-950 border-t border-white/10 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="font-serif text-2xl font-bold text-white tracking-widest">INKSMITH</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Premium custom tattooing in a sterile, welcoming environment. 
              We transform your stories into permanent art.
            </p>
            <div className="flex space-x-4">
              <a href="https://instagram.com/inksmithtattoobda" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-ink-accent transition-colors"><Instagram size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-ink-accent transition-colors"><Facebook size={20} /></a>
            </div>
          </div>

          {/* Quick Links & Contact */}
          <div className="space-y-4">
            <h4 className="font-bold text-white tracking-wider uppercase text-sm">Studio</h4>
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-400">
              <ul className="space-y-2">
                <li><Link to="/artists" className="hover:text-ink-accent">Artists</Link></li>
                <li><Link to="/book" className="hover:text-ink-accent">Book Appointment</Link></li>
                <li><Link to="/ai-consult" className="hover:text-ink-accent">AI Consultation</Link></li>
              </ul>
              <ul className="space-y-2">
                <li><Link to="/aftercare" className="hover:text-ink-accent">Aftercare</Link></li>
                <li><Link to="/contact" className="hover:text-ink-accent">Contact</Link></li>
              </ul>
            </div>
            
            <div className="pt-4 border-t border-white/5 space-y-3 text-gray-400 text-sm">
              <div className="flex items-start space-x-3">
                <MapPin size={16} className="text-ink-accent mt-1 shrink-0" />
                <span>39 King St, 2nd Floor, Ratteray Bldg., Hamilton HM 19</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone size={16} className="text-ink-accent" />
                <span>+1 (441) 261-8532</span>
              </div>
               <div className="flex items-center space-x-3">
                <Mail size={16} className="text-ink-accent" />
                <span>inksmithbda@gmail.com</span>
              </div>
            </div>
          </div>

          {/* Hours */}
          <div className="space-y-4">
            <h4 className="font-bold text-white tracking-wider uppercase text-sm">Studio Hours</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li className="flex justify-between"><span>Mon - Sat</span> <span>12:00 PM - 8:00 PM</span></li>
              <li className="flex justify-between"><span>Sunday</span> <span>11:00 AM - 7:00 PM</span></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-white/5 text-center text-gray-600 text-xs">
          <p>&copy; {new Date().getFullYear()} InkSmith Studios. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;