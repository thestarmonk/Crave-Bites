import { Github, Instagram, Twitter, Facebook, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Footer = () => {
    const { user } = useContext(AuthContext);

    return (
        <footer className="bg-secondary-light/50 border-t border-white/5 pt-16 pb-8 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    <div className="md:col-span-1">
                        <Link to="/" className="text-2xl font-bold text-gradient mb-6 block">CraveBites</Link>
                        <p className="text-gray-400 leading-relaxed mb-6">
                            Savor the flavors of the city's finest cuisine, delivered fresh and fast to your doorstep.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="p-2 bg-white/5 hover:bg-primary rounded-full transition-300"><Twitter size={18} /></a>
                            <a href="#" className="p-2 bg-white/5 hover:bg-primary rounded-full transition-300"><Instagram size={18} /></a>
                            <a href="#" className="p-2 bg-white/5 hover:bg-primary rounded-full transition-300"><Facebook size={18} /></a>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-bold text-lg mb-6 text-white">Quick Links</h4>
                        <ul className="space-y-4 text-gray-400">
                            <li><Link to="/" className="hover:text-primary transition-300">Home</Link></li>
                            <li><Link to="/menu" className="hover:text-primary transition-300">Menu</Link></li>
                            <li><Link to="/cart" className="hover:text-primary transition-300">Cart</Link></li>
                            <li>
                                <Link to="/admin/login" className="text-gray-500 hover:text-primary transition-300 text-xs font-black uppercase tracking-widest flex items-center gap-2">
                                    <ShieldCheck size={14} /> Admin Portal
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-lg mb-6 text-white">Support</h4>
                        <ul className="space-y-4 text-gray-400">
                            <li><Link to="/contact" className="hover:text-primary transition-300">Contact Us</Link></li>
                            <li><Link to="/privacy-policy" className="hover:text-primary transition-300">Privacy Policy</Link></li>
                            <li><Link to="/terms-of-service" className="hover:text-primary transition-300">Terms of Service</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-lg mb-6 text-white">Subscribe</h4>
                        <p className="text-gray-400 mb-6">Get 10% off your first order!</p>
                        <div className="flex">
                            <input
                                type="email"
                                placeholder="Email address"
                                className="bg-white/5 border border-white/10 rounded-l-xl px-4 py-2.5 focus:outline-none focus:border-primary w-full"
                            />
                            <button className="bg-primary hover:bg-primary-dark px-4 py-2.5 rounded-r-xl font-bold transition-300">
                                Join
                            </button>
                        </div>
                    </div>
                </div>

                <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-500 text-sm">
                    <p>© 2026 CraveBites. All rights reserved.</p>
                    <div className="flex space-x-6">
                        <p>Designed with ❤️ for Foodies</p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
