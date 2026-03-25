import { motion } from 'framer-motion';
import { Scale, FileText, AlertCircle, HelpCircle } from 'lucide-react';

const TermsOfService = () => {
    return (
        <div className="pt-32 pb-20 px-6 min-h-screen">
            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-5xl font-black mb-6">Terms of <span className="text-gradient">Service</span></h1>
                    <p className="text-gray-400 text-lg">Please read these terms carefully before using CraveBites.</p>
                </motion.div>

                <div className="space-y-8">
                    {[
                        {
                            icon: <FileText className="text-primary" />,
                            title: "1. Acceptance of Terms",
                            content: "By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement. In addition, when using these particular services, you shall be subject to any posted guidelines or rules applicable to such services."
                        },
                        {
                            icon: <Scale className="text-accent" />,
                            title: "2. User Conduct",
                            content: "You agree to use CraveBites only for lawful purposes. You are prohibited from posting or transmitting any unlawful, threatening, abusive, libelous, defamatory, obscene, vulgar, pornographic, profane or indecent information of any kind."
                        },
                        {
                            icon: <AlertCircle className="text-blue-500" />,
                            title: "3. Order & Delivery",
                            content: "While we strive to provide accurate delivery times, these are estimates and not guarantees. We are not responsible for delays caused by traffic, weather, or restaurant delays. All sales are final once the restaurant begins preparing the food."
                        },
                        {
                            icon: <HelpCircle className="text-green-500" />,
                            title: "4. Intellectual Property",
                            content: "The content, organization, graphics, design, compilation, magnetic translation, digital conversion and other matters related to the Site are protected under applicable copyrights, trademarks and other proprietary rights."
                        }
                    ].map((section, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.1 }}
                            className="glass p-8 rounded-[2rem] border border-white/10 hover:shadow-2xl hover:shadow-primary/5 transition-all"
                        >
                            <div className="flex items-start gap-6">
                                <div className="p-4 bg-white/5 rounded-2xl">
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

                <div className="mt-16 p-10 glass rounded-[3rem] border border-white/10 text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-accent"></div>
                    <h3 className="text-2xl font-black mb-4">Questions about our Terms?</h3>
                    <p className="text-gray-400 mb-8 max-w-lg mx-auto">
                        If you have any questions or concerns regarding our Terms of Service, please don't hesitate to reach out to our legal team.
                    </p>
                    <button className="bg-primary hover:bg-primary-dark px-10 py-4 rounded-2xl font-black transition-all transform hover:scale-105 shadow-xl shadow-primary/20">
                        Contact Legal
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TermsOfService;
