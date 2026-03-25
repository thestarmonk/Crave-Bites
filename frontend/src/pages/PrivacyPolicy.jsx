import { motion } from 'framer-motion';
import { Shield, Lock, Eye, ScrollText } from 'lucide-react';

const PrivacyPolicy = () => {
    return (
        <div className="pt-32 pb-20 px-6 min-h-screen">
            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-5xl font-black mb-6">Privacy <span className="text-gradient">Policy</span></h1>
                    <p className="text-gray-400 text-lg">Your privacy is our top priority. Learn how we handle your data.</p>
                </motion.div>

                <div className="space-y-8">
                    {[
                        {
                            icon: <Shield className="text-primary" />,
                            title: "Data Protection",
                            content: "We implement a variety of security measures to maintain the safety of your personal information when you place an order or enter, submit, or access your personal information. We use state-of-the-art encryption to protect sensitive data transmitted online."
                        },
                        {
                            icon: <Lock className="text-accent" />,
                            title: "Information Collection",
                            content: "We collect information from you when you register on our site, place an order, subscribe to our newsletter or fill out a form. This includes your name, email address, mailing address, phone number, and credit card information."
                        },
                        {
                            icon: <Eye className="text-blue-500" />,
                            title: "Use of Information",
                            content: "Any of the information we collect from you may be used to personalize your experience, improve our website, improve customer service, and process transactions. Your information will not be sold, exchanged, transferred, or given to any other company without your consent."
                        },
                        {
                            icon: <ScrollText className="text-green-500" />,
                            title: "Cookie Policy",
                            content: "We use cookies to help us remember and process the items in your shopping cart, understand and save your preferences for future visits and keep track of advertisements. You can choose to turn off all cookies via your browser settings."
                        }
                    ].map((section, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="glass p-8 rounded-[2rem] border border-white/10 hover:border-white/20 transition-all group"
                        >
                            <div className="flex items-start gap-6">
                                <div className="p-4 bg-white/5 rounded-2xl group-hover:scale-110 transition-transform">
                                    {section.icon}
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold mb-4">{section.title}</h2>
                                    <p className="text-gray-400 leading-relaxed">
                                        {section.content}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-16 p-8 bg-primary/5 rounded-[2rem] border border-primary/10 text-center"
                >
                    <p className="text-gray-400 italic">
                        Last Updated: February 22, 2026. By using our services, you agree to the terms outlined in this Privacy Policy.
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
