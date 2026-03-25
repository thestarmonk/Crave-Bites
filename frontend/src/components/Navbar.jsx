import { useContext, useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, LogOut, Menu as MenuIcon, X, Zap } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const { cartItems } = useContext(CartContext);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Menu', path: '/menu' },
        { name: 'Contact', path: '/contact' },
    ];

    return (
        <nav className={`fixed top-0 w-full z-50 transition-500 ${isScrolled ? 'py-4' : 'py-6'}`}>
            <div className="max-w-7xl mx-auto px-6">
                <div className={`glass-dark rounded-[2rem] border border-white/10 px-6 py-3 flex justify-between items-center transition-500 ${isScrolled ? 'shadow-[0_20px_40px_rgba(0,0,0,0.3)]' : ''}`}>
                    <div className="flex items-center gap-6">
                        <Link to="/" className="flex items-center gap-2 group">
                            <div className="bg-primary p-2 rounded-xl group-hover:rotate-12 transition-500">
                                <Zap size={20} className="text-white" fill="currentColor" />
                            </div>
                            <span className="text-2xl font-black tracking-tighter text-white">Crave<span className="text-primary">Bites</span></span>
                        </Link>
                    </div>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`px-5 py-2 rounded-xl text-sm font-bold transition-300 ${location.pathname === link.path ? 'text-white bg-[#1A1A24]' : 'text-gray-400 hover:text-white hover:bg-[#0D0D12]'}`}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    <div className="flex items-center gap-3">
                        <Link to="/cart" className="relative p-2.5 bg-[#0D0D12] hover:bg-[#1A1A24] rounded-xl transition-300 text-gray-300 hover:text-white">
                            <ShoppingCart size={20} />
                            <AnimatePresence>
                                {cartItems.length > 0 && (
                                    <motion.span
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        exit={{ scale: 0 }}
                                        className="absolute -top-1 -right-1 bg-primary text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-black border-2 border-bg-dark"
                                    >
                                        {cartItems.length}
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </Link>

                        <div className="h-8 w-px bg-[#262626] mx-1 hidden sm:block"></div>

                        {user ? (
                            <div className="flex items-center gap-2">
                                <Link to="/profile" className="hidden sm:flex items-center gap-3 pl-2 pr-4 py-1.5 bg-[#0D0D12] hover:bg-[#1A1A24] rounded-xl transition-300 border border-white/5">
                                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center text-xs font-black">
                                        {user.name.charAt(0)}
                                    </div>
                                    <span className="text-sm font-bold text-gray-200">{user.name.split(' ')[0]}</span>
                                </Link>
                                <button onClick={logout} className="p-2.5 text-gray-400 hover:text-primary transition-300">
                                    <LogOut size={20} />
                                </button>
                            </div>
                        ) : (
                            <Link to="/login" className="bg-primary hover:bg-primary-dark text-white px-6 py-2.5 rounded-xl font-black text-sm transition-500 shadow-lg shadow-primary/20 hover:scale-[1.02]">
                                Sign In
                            </Link>
                        )}

                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="md:hidden p-2.5 bg-[#0D0D12] rounded-xl text-gray-300"
                        >
                            {isMobileMenuOpen ? <X size={20} /> : <MenuIcon size={20} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="absolute top-full left-0 w-full px-6 pt-2 md:hidden"
                    >
                        <div className="glass-dark rounded-[2rem] border border-white/10 p-4 space-y-2 shadow-2xl">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="block px-6 py-4 rounded-2xl text-lg font-bold text-gray-300 hover:text-white hover:bg-[#1A1A24]"
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
