import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Star, Clock, ShieldCheck, Play, Award, Zap, MapPin, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="overflow-x-hidden pt-32 pb-40 relative">
            {/* Hero Section */}
            <section className="relative min-h-[95vh] flex items-center px-6 overflow-hidden">
                {/* Background Glows */}
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[150px] rounded-full"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/10 blur-[150px] rounded-full"></div>

                <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="inline-flex items-center gap-2 bg-[#0D0D12] border border-white/10 px-4 py-2 rounded-full mb-8"
                        >
                            <span className="flex h-2 w-2 relative">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                            </span>
                            <span className="text-xs font-bold uppercase tracking-widest text-primary-light">Now Serving 24/7</span>
                        </motion.div>

                        <h1 className="text-7xl md:text-8xl font-black leading-[1.1] mb-8 tracking-tight">
                            Elevate Your <br />
                            <span className="text-gradient">Dining</span> Experience
                        </h1>
                        <p className="text-gray-400 text-xl mb-12 max-w-lg leading-relaxed font-medium">
                            Experience culinary excellence delivered with speed. Hand-picked ingredients, world-class chefs, and a passion for flavor.
                        </p>

                        <div className="flex flex-wrap gap-6 items-center">
                            <Link to="/menu" className="btn-premium bg-primary hover:bg-primary-dark text-white px-10 py-5 rounded-2xl font-bold flex items-center gap-3 transition-500 shadow-2xl shadow-primary/30">
                                <span>Order Now</span>
                                <ArrowRight size={22} />
                            </Link>
                            <Link to="/contact" className="group flex items-center gap-4 text-white font-bold hover:text-primary transition-300">
                                <div className="w-14 h-14 rounded-full border border-white/20 flex items-center justify-center group-hover:border-primary transition-300 group-hover:scale-110">
                                    <Play size={20} fill="white" className="ml-1" />
                                </div>
                                <span>See How It Works</span>
                            </Link>
                        </div>

                        <div className="mt-16 flex items-center gap-12 border-t border-white/10 pt-12">
                            <div>
                                <h4 className="text-3xl font-black mb-1">12k+</h4>
                                <p className="text-sm text-gray-500 font-bold uppercase tracking-widest">Happy Clients</p>
                            </div>
                            <div className="w-px h-12 bg-white/10"></div>
                            <div>
                                <h4 className="text-3xl font-black mb-1">4.9</h4>
                                <div className="flex items-center gap-1 text-yellow-500 mb-1">
                                    <Star size={14} fill="currentColor" />
                                    <Star size={14} fill="currentColor" />
                                    <Star size={14} fill="currentColor" />
                                    <Star size={14} fill="currentColor" />
                                    <Star size={14} fill="currentColor" />
                                </div>
                                <p className="text-sm text-gray-500 font-bold uppercase tracking-widest">Cloud Rating</p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        transition={{ duration: 1.2, type: "spring", bounce: 0.4 }}
                        className="relative hidden lg:block"
                    >
                        <div className="relative z-10 animate-float p-4">
                            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-accent/20 blur-[80px] -z-10 rounded-full"></div>
                            <img
                                src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1000&auto=format&fit=crop"
                                alt="Delicious Bowl"
                                className="rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.6)] border-2 border-white/20 hover:scale-[1.02] transition-500 cursor-pointer"
                            />
                        </div>

                        {/* Floating elements */}
                        <motion.div
                            animate={{ y: [0, -15, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute -top-10 -right-10 glass-no-hover p-6 rounded-3xl z-20 border-white/20 shadow-2xl"
                        >
                            <div className="flex items-center gap-4">
                                <div className="bg-[#0A1A0A] p-3 rounded-2xl">
                                    <Zap size={24} className="text-green-500" fill="currentColor" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-black uppercase tracking-widest">Fastest</p>
                                    <p className="font-bold text-lg text-white">20 Min Delivery</p>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            animate={{ y: [0, 15, 0] }}
                            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                            className="absolute -bottom-10 -left-10 glass-no-hover p-6 rounded-3xl z-20 border-white/20 shadow-2xl"
                        >
                            <div className="flex items-center gap-4">
                                <div className="bg-[#110A19] p-3 rounded-2xl text-primary">
                                    <Award size={24} fill="currentColor" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-black uppercase tracking-widest">Top Rated</p>
                                    <p className="font-bold text-lg text-white">Premium Quality</p>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-32 px-6 relative overflow-hidden">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-24 max-w-2xl mx-auto">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-5xl font-black mb-6"
                        >
                            Why We Are <span className="text-gradient">Different</span>
                        </motion.h2>
                        <p className="text-gray-400 text-lg font-medium leading-relaxed">
                            It's not just food, it's an experience. We've redefined what a delivery service should feel like.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {[
                            {
                                icon: <Clock size={40} />,
                                title: "Lightning Fast",
                                desc: "Proprietary routing algorithms ensure your meal arrives in peak condition every single time.",
                                color: "from-[#0A1119] to-[#0A1119]"
                            },
                            {
                                icon: <Star size={40} />,
                                title: "Gourmet Quality",
                                desc: "No middle ground. We partner only with the top-tier restaurants and chefs in the city.",
                                color: "from-[#110A19] to-[#110A19]"
                            },
                            {
                                icon: <ShieldCheck size={40} />,
                                title: "Ultra Secure",
                                desc: "End-to-end encrypted payments and contactless delivery for your absolute peace of mind.",
                                color: "from-[#0A1911] to-[#0A1911]"
                            }
                        ].map((feature, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                whileHover={{ y: -12 }}
                                className={`glass-no-hover p-12 rounded-[3.5rem] border border-white/5 bg-gradient-to-br ${feature.color} relative group overflow-hidden`}
                            >
                                <div className="text-white mb-8 bg-[#1A1A24] w-20 h-20 rounded-[2rem] flex items-center justify-center group-hover:bg-primary transition-500 group-hover:text-white">
                                    {feature.icon}
                                </div>
                                <h3 className="text-2xl font-black mb-4">{feature.title}</h3>
                                <p className="text-gray-400 leading-relaxed font-medium">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-gradient-glow rounded-[4rem] p-16 md:p-24 relative overflow-hidden text-center border border-white/10">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
                        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/10 blur-[100px] rounded-full -translate-x-1/2 translate-y-1/2"></div>

                        <div className="relative z-10">
                            <h2 className="text-5xl md:text-7xl font-black mb-8 leading-tight">Ready to taste the <br /><span className="text-gradient">Difference?</span></h2>
                            <p className="text-gray-400 text-xl mb-12 max-w-xl mx-auto font-medium">Join 12,000+ happy foodies and experience the evolution of food delivery.</p>
                            <Link to="/register" className="w-full sm:w-auto btn-theme px-12 py-5 rounded-2xl font-black text-lg inline-flex items-center justify-center gap-3">
                                Create Your Account
                                <Zap size={22} fill="white" />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
