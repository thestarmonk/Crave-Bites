import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Mail, Lock, User as UserIcon, Phone } from 'lucide-react';
import { motion } from 'framer-motion';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: ''
    });
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(formData);
            navigate('/');
        } catch (error) { }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-6 py-24 relative overflow-hidden">
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/20 blur-[150px] rounded-full"></div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass p-8 md:p-12 rounded-3xl w-full max-w-md border border-white/10 relative z-10"
            >
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-extrabold mb-2">Create Account</h1>
                    <p className="text-gray-400">Join our foodie community today</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300 ml-1">Full Name</label>
                        <div className="relative">
                            <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                            <input
                                type="text"
                                required
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-6 focus:outline-none focus:border-primary transition-300"
                                placeholder="John Doe"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300 ml-1">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                            <input
                                type="email"
                                required
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-6 focus:outline-none focus:border-primary transition-300"
                                placeholder="name@example.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300 ml-1">Phone Number</label>
                        <div className="relative">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                            <input
                                type="tel"
                                required
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-6 focus:outline-none focus:border-primary transition-300"
                                placeholder="+91 98765 43210"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300 ml-1">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                            <input
                                type="password"
                                required
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-6 focus:outline-none focus:border-primary transition-300"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-primary hover:bg-primary-dark text-white py-4 rounded-2xl font-bold transition-300 shadow-xl shadow-primary/20 mt-4"
                    >
                        Create Account
                    </button>
                </form>

                <div className="mt-8 text-center text-gray-400">
                    Already have an account?{' '}
                    <Link to="/login" className="text-primary font-bold hover:underline">Sign In</Link>
                </div>
            </motion.div>
        </div>
    );
};

export default Register;
