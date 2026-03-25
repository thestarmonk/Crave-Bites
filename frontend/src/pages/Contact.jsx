import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Phone, MapPin, Send, MessageSquare, ChevronDown, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const Contact = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const [activeFaq, setActiveFaq] = useState(null);

    const faqs = [
        { q: "What are your delivery hours?", a: "We serve 24/7! Our kitchen never sleeps to ensure you get your favorite meals whenever craving strikes." },
        { q: "How can I track my order?", a: "Once you place an order, you can see live status updates in your Profile under 'Recent Orders'." },
        { q: "Do you offer contact-less delivery?", a: "Safety first! All our deliveries are contact-less by default to ensure maximum hygiene." },
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        await new Promise(resolve => setTimeout(resolve, 1500));
        toast.success("Message received! We'll reach out within 2 hours.", {
            icon: <CheckCircle className="text-primary" />,
            style: { borderRadius: '20px', background: '#0D0D12', color: '#fff' }
        });
        setFormData({ name: '', email: '', subject: '', message: '' });
        setIsSubmitting(false);
    };

    return (
        <div className="pt-32 pb-20 px-6 min-h-screen relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[150px] -z-10 rounded-full translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/5 blur-[150px] -z-10 rounded-full -translate-x-1/2 translate-y-1/2"></div>

            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">

                    {/* Left Column: Info & FAQ */}
                    <div className="lg:col-span-5 space-y-12">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                        >
                            <h1 className="text-7xl font-black mb-6 leading-tight">Let's <br /><span className="text-gradient">Connect.</span></h1>
                            <p className="text-gray-400 text-lg leading-relaxed font-medium">
                                Have a specific request or just want to chat food? Our team is always ready to help you elevate your dining experience.
                            </p>
                        </motion.div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
                            {[
                                { icon: <Phone className="text-primary" />, label: "Call Us", val: "+1 (555) 000-0000" },
                                { icon: <Mail className="text-accent" />, label: "Email", val: "hello@cravebites.com" },
                                { icon: <MapPin className="text-blue-500" />, label: "Visit", val: "123 Foodie St, NYC" }
                            ].map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="glass-no-hover p-6 rounded-3xl border border-white/10 flex items-center gap-5 group hover:border-primary/30 transition-500"
                                >
                                    <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-primary/20 transition-500">
                                        {item.icon}
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-1">{item.label}</p>
                                        <p className="text-white font-bold">{item.val}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* FAQ Section */}
                        <div className="pt-8 border-t border-white/10">
                            <h3 className="text-xl font-black mb-8">Common Questions</h3>
                            <div className="space-y-4">
                                {faqs.map((faq, i) => (
                                    <div key={i} className="glass-no-hover rounded-2xl overflow-hidden border border-white/5">
                                        <button
                                            onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                                            className="w-full p-5 text-left flex justify-between items-center hover:bg-white/5 transition-300"
                                        >
                                            <span className="font-bold text-sm text-gray-200">{faq.q}</span>
                                            <ChevronDown size={18} className={`text-gray-500 transition-500 ${activeFaq === i ? 'rotate-180 text-primary' : ''}`} />
                                        </button>
                                        <AnimatePresence>
                                            {activeFaq === i && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    className="px-5 pb-5 text-gray-400 text-xs leading-relaxed"
                                                >
                                                    {faq.a}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Contact Form */}
                    <div className="lg:col-span-7">
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="glass p-8 md:p-12 rounded-[3.5rem] border border-white/10 relative"
                        >
                            <div className="bg-primary/10 w-20 h-20 rounded-3xl flex items-center justify-center mb-10 border border-primary/20">
                                <MessageSquare className="text-primary" size={32} fill="currentColor" />
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Your Full Name</label>
                                        <input
                                            required
                                            type="text"
                                            className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all placeholder:text-gray-700 font-medium"
                                            placeholder="John Wick"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Email Address</label>
                                        <input
                                            required
                                            type="email"
                                            className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all placeholder:text-gray-700 font-medium"
                                            placeholder="john@crave.com"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Subject</label>
                                    <input
                                        required
                                        type="text"
                                        className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all placeholder:text-gray-700 font-medium"
                                        placeholder="How can we assist you?"
                                        value={formData.subject}
                                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Detailed Message</label>
                                    <textarea
                                        required
                                        rows="5"
                                        className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all placeholder:text-gray-700 resize-none font-medium"
                                        placeholder="Describe your inquiry..."
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full btn-premium bg-primary text-white py-6 rounded-2xl font-black text-lg transition-all shadow-2xl flex items-center justify-center gap-4 disabled:opacity-50 group"
                                >
                                    {isSubmitting ? (
                                        "Dispatching Message..."
                                    ) : (
                                        <>
                                            Send Message <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                        </>
                                    )}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
