import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, ShieldCheck, Heart, Phone, Mail, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-teal-600 flex items-center justify-center text-white">
                <Building2 className="w-5 h-5 text-amber-300" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                Stay<span className="text-teal-400">Hyderabad</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Find your space. Feel at home. Hyderabad's trusted marketplace for verified PGs, hostels, and shared rooms.
            </p>
            <div className="flex items-center gap-2 text-xs text-amber-400 bg-amber-950/40 p-2.5 rounded-lg border border-amber-800/40">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>Verified listings & zero brokerage directly with property owners</span>
            </div>
          </div>

          {/* Popular Areas */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Hyderabad Hubs
            </h4>
            <ul className="space-y-2.5 text-sm">
              {['Madhapur', 'HITEC City', 'Gachibowli', 'Kondapur', 'Ameerpet', 'Kukatpally', 'Miyapur', 'Dilsukhnagar'].map((area) => (
                <li key={area}>
                  <Link
                    to={`/properties?locality=${encodeURIComponent(area)}`}
                    className="hover:text-teal-400 transition-colors flex items-center gap-1.5"
                  >
                    <MapPin className="w-3.5 h-3.5 text-teal-500" />
                    PGs in {area}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Accommodation Types */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Accommodations
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/properties?genderCategory=MALE" className="hover:text-teal-400 transition-colors">
                  Executive Boys Hostels
                </Link>
              </li>
              <li>
                <Link to="/properties?genderCategory=FEMALE" className="hover:text-teal-400 transition-colors">
                  Secure Girls Hostels
                </Link>
              </li>
              <li>
                <Link to="/properties?genderCategory=CO_LIVING" className="hover:text-teal-400 transition-colors">
                  Premium Co-Living Spaces
                </Link>
              </li>
              <li>
                <Link to="/properties?hasAc=true" className="hover:text-teal-400 transition-colors">
                  AC Rooms with Food
                </Link>
              </li>
              <li>
                <Link to="/register?role=ROLE_OWNER" className="text-amber-400 hover:text-amber-300 font-medium">
                  Hostel Owner Registration
                </Link>
              </li>
            </ul>
          </div>

          {/* Support & Contact */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Contact & Support
            </h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-teal-500 shrink-0" />
                <span>Madhapur & HITEC City, Hyderabad, Telangana 500081</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-teal-500 shrink-0" />
                <span>+91 98490 12345</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-teal-500 shrink-0" />
                <span>support@stayhyderabad.com</span>
              </li>
            </ul>

            <div className="mt-6">
              <p className="text-xs text-slate-500">
                Notice: Sample vacancy information and demonstration listings are clearly marked for testing purposes.
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} StayHyderabad Technologies. All rights reserved.</p>
          <div className="flex gap-6">
            <span className="hover:text-slate-300 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-300 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-300 cursor-pointer">Listing Policy</span>
            <span className="hover:text-slate-300 cursor-pointer">Safety Guidelines</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
