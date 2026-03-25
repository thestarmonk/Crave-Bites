import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ShieldCheck, Lock, Mail } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const data = await login(email, password);
            if (data.role === 'admin') {
                toast.success('Admin authenticated successfully');
                navigate('/admin');
            } else {
                toast.error('Access denied. This portal is for administrators only.');
                // Optionally logout if you don't want a non-admin to stay logged in
            }
        } catch (error) {
            // Error toast is already handled in Context
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-6 py-20 relative overflow-hidden bg-[#0A0A0A]">
            {/* Background Decorative Elements */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 blur-[150px] rounded-full"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 blur-[150px] rounded-full"></div>

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass p-10 md:p-14 rounded-[2.5rem] w-full max-w-lg border border-white/10 relative z-10 shadow-2xl"
            >
                <div className="text-center mb-10">
                    <div className="w-20 h-20 bg-primary/20 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-primary/20 shadow-inner">
                        <ShieldCheck size={40} className="text-primary" />
                    </div>
                    <h1 className="text-3xl font-black mb-2 uppercase tracking-tighter">Admin <span className="text-gradient">Portal</span></h1>
                    <p className="text-gray-400 font-medium">Restricted Access • Secure Login</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Admin Email</label>
                        <div className="relative">
                            <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                            <input
                                type="email"
                                required
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-14 pr-6 focus:outline-none focus:border-primary transition-all duration-300 font-medium"
                                placeholder="admin@cravebites.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Secure Password</label>
                        <div className="relative">
                            <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                            <input
                                type="password"
                                required
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-14 pr-6 focus:outline-none focus:border-primary transition-all duration-300 font-medium"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full btn-theme py-5 rounded-2xl font-black text-lg disabled:opacity-50 flex items-center justify-center gap-3"
                    >
                        {isSubmitting ? 'Authenticating...' : 'Secure Login'}
                        <ShieldCheck size={20} />
                    </button>
                </form>

                <div className="mt-8 pt-8 border-t border-white/5 text-center">
                    <button
                        onClick={() => navigate('/login')}
                        className="text-gray-500 hover:text-white text-sm font-bold transition-300"
                    >
                        Go to Customer Login
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default AdminLogin;
