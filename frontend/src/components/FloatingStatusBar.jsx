import { useContext, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, ArrowRight, Clock, CheckCircle2, Truck, Utensils } from 'lucide-react';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

const FloatingStatusBar = () => {
    const { cartItems, total } = useContext(CartContext);
    const { user } = useContext(AuthContext);
    const [activeOrder, setActiveOrder] = useState(null);
    const location = useLocation();

    // Fetch latest active order
    useEffect(() => {
        const fetchActiveOrder = async () => {
            if (!user) return;
            try {
                const { data } = await api.get('/orders/myorders');
                const latest = data[0];
                if (latest && latest.orderStatus !== 'Delivered' && latest.orderStatus !== 'Cancelled') {
                    setActiveOrder(latest);
                } else {
                    setActiveOrder(null);
                }
            } catch (err) {
                console.error("Failed to fetch active order", err);
            }
        };

        fetchActiveOrder();
        const interval = setInterval(fetchActiveOrder, 30000); // 30s polling
        return () => clearInterval(interval);
    }, [user, location.pathname]);

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Preparing': return <Utensils size={18} className="animate-pulse" />;
            case 'Out for delivery': return <Truck size={18} className="animate-bounce" />;
            case 'Placed': return <CheckCircle2 size={18} />;
            default: return <Clock size={18} />;
        }
    };

    // Don't show on checkout or cart page as they have their own summaries
    const hiddenPages = ['/cart', '/checkout'];
    if (hiddenPages.includes(location.pathname)) return null;

    return (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-full max-w-xl px-6">
            <AnimatePresence mode="wait">
                {activeOrder ? (
                    <motion.div
                        key="order-status"
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 100, opacity: 0 }}
                    >
                        <Link
                            to={`/order/${activeOrder._id}`}
                            className="flex items-center justify-between bg-[#0D0D12] border border-white/20 p-4 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.8)] group hover:scale-[1.02] transition-all duration-500"
                        >
                            <div className="flex items-center gap-4">
                                <div className="bg-[#110A19] p-3 rounded-2xl text-primary">
                                    {getStatusIcon(activeOrder.orderStatus)}
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-1">Live Order Status</p>
                                    <p className="text-white font-bold text-sm">Your order is <span className="text-primary capitalize">{activeOrder.orderStatus}</span></p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 bg-[#1A1A24] px-4 py-2 rounded-xl group-hover:bg-primary transition-all">
                                <span className="text-xs font-bold text-white">View Details</span>
                                <ArrowRight size={14} className="text-white" />
                            </div>
                        </Link>
                    </motion.div>
                ) : cartItems.length > 0 ? (
                    <motion.div
                        key="cart-summary"
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 100, opacity: 0 }}
                    >
                        <Link
                            to="/cart"
                            className="flex items-center justify-between bg-[#0D0D12] border border-primary/30 p-4 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.8)] group hover:scale-[1.02] transition-all duration-500"
                        >
                            <div className="flex items-center gap-4">
                                <div className="bg-primary/20 p-3 rounded-2xl text-primary">
                                    <ShoppingBag size={20} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-1">{cartItems.length} Items Added</p>
                                    <p className="text-white font-black text-base italic">₹{total.toFixed(2)}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 text-primary font-black uppercase tracking-widest text-xs group-hover:bg-primary group-hover:text-white px-4 py-2 rounded-xl transition-all">
                                <span>View Basket</span>
                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </div>
                        </Link>
                    </motion.div>
                ) : null}
            </AnimatePresence>
        </div>
    );
};

export default FloatingStatusBar;
