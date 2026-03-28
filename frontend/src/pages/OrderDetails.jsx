import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import Loader from '../components/Loader';
import { Package, MapPin, CreditCard, Clock, ChevronLeft, CheckCircle2, Truck, Utensils, Timer, X } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const OrderDetails = () => {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const { data } = await api.get(`/orders/${id}`);
                setOrder(data);
            } catch (error) {
                console.error("Error fetching order details", error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrder();

        // Optional: Poll for live status updates every 30 seconds
        const interval = setInterval(fetchOrder, 30000);
        return () => clearInterval(interval);
    }, [id]);

    const getStatusStep = (status) => {
        const steps = ['Placed', 'Preparing', 'Out for delivery', 'Delivered'];
        return steps.indexOf(status);
    };

    const statusConfig = {
        'Placed': { icon: <CheckCircle2 className="text-primary" />, color: 'bg-primary/20', text: 'Order Placed' },
        'Preparing': { icon: <Utensils className="text-yellow-500" />, color: 'bg-yellow-500/20', text: 'Preparing Food' },
        'Out for delivery': { icon: <Truck className="text-blue-500" />, color: 'bg-blue-500/20', text: 'On the Way' },
        'Delivered': { icon: <Package className="text-green-500" />, color: 'bg-green-500/20', text: 'Delivered' },
        'Cancelled': { icon: <X className="text-red-500" />, color: 'bg-red-500/20', text: 'Cancelled' }
    };

    const handleCancelOrder = async () => {
        if (window.confirm("Are you sure you want to cancel this order?")) {
            try {
                await api.put(`/orders/${id}/cancel`);
                toast.success("Order cancelled successfully");
                // Refresh order
                const { data } = await api.get(`/orders/${id}`);
                setOrder(data);
            } catch (error) {
                toast.error(error.response?.data?.message || "Failed to cancel order");
            }
        }
    };

    if (loading) return <div className="pt-40"><Loader /></div>;
    if (!order) return <div className="pt-40 text-center">Order not found</div>;

    const currentStep = getStatusStep(order.orderStatus);

    return (
        <div className="pt-32 pb-40 px-6 max-w-5xl mx-auto">
            <Link to="/profile" className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-300 w-fit">
                <ChevronLeft size={20} /> Back to Orders
            </Link>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                <div>
                    <h1 className="text-3xl font-extrabold mb-2">Order <span className="text-gradient">#{order._id.slice(-8)}</span></h1>
                    <p className="text-gray-400 flex items-center gap-2">
                        <Clock size={16} /> Placed on {new Date(order.createdAt).toLocaleString()}
                    </p>
                </div>
                <div className={`px-6 py-2 rounded-full text-sm font-bold flex items-center gap-2 ${statusConfig[order.orderStatus]?.color || 'bg-gray-500/20'}`}>
                    {statusConfig[order.orderStatus]?.icon}
                    {order.orderStatus}
                </div>
            </div>

            {/* Live Status Tracker */}
            {order.orderStatus !== 'Cancelled' && (
                <section className="glass p-8 rounded-[2.5rem] border border-white/10 mb-12 overflow-hidden relative">
                    <div className="flex flex-col md:flex-row justify-between relative z-10 gap-8">
                        {['Placed', 'Preparing', 'Out for delivery', 'Delivered'].map((step, index) => (
                            <div key={step} className="flex flex-col items-center flex-1 relative">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-all duration-700 ${index <= currentStep ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'bg-white/5 text-gray-500'
                                    }`}>
                                    {index === 0 && <CheckCircle2 size={24} />}
                                    {index === 1 && <Utensils size={24} />}
                                    {index === 2 && <Truck size={24} />}
                                    {index === 3 && <Package size={24} />}
                                </div>
                                <p className={`text-xs font-black uppercase tracking-widest ${index <= currentStep ? 'text-white' : 'text-gray-600'}`}>{step}</p>

                                {index < 3 && (
                                    <div className="hidden md:block absolute top-6 left-[calc(50%+2rem)] w-[calc(100%-4rem)] h-0.5 bg-white/5">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: index < currentStep ? '100%' : '0%' }}
                                            className="h-full bg-primary shadow-[0_0_10px_rgba(255,77,77,0.5)]"
                                        />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                    {order.orderStatus !== 'Delivered' && (
                        <div className="mt-10 pt-8 border-t border-white/5 flex items-center gap-4 text-sm text-gray-400 bg-primary/5 -mx-8 -mb-8 p-8">
                            <Timer size={18} className="text-primary animate-pulse" />
                            <span>Estimated arrival: <b className="text-white">25-35 mins</b> • Live tracking enabled</span>
                        </div>
                    )}
                </section>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Items & Summary */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="glass p-8 rounded-3xl border border-white/10">
                        <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                            <Package size={22} className="text-primary" />
                            Order Items
                        </h3>
                        <div className="divide-y divide-white/5">
                            {order.items.map((item, index) => (
                                <div key={index} className="py-6 first:pt-0 last:pb-0 flex justify-between items-center group">
                                    <div className="flex gap-4 items-center">
                                        <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center font-bold text-gray-500 overflow-hidden">
                                            {item.productId?.image ? (
                                                <img src={item.productId.image} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                <Package />
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-bold group-hover:text-primary transition-300">{item.productId?.name || 'Delicious Dish'}</p>
                                            <p className="text-sm text-gray-500">₹{item.price} × {item.quantity}</p>
                                        </div>
                                    </div>
                                    <p className="font-black">₹{item.price * item.quantity}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="glass p-8 rounded-3xl border border-white/10">
                        <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                            <MapPin size={22} className="text-primary" />
                            Delivery Address
                        </h3>
                        <div className="bg-white/5 p-6 rounded-2xl border border-white/5 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-12 -mt-12"></div>
                            <p className="font-black text-lg mb-2">{order.address?.type || 'Delivery Address'}</p>
                            <p className="text-gray-400 leading-relaxed">{order.address?.street}</p>
                            {order.address?.landmark && <p className="text-primary/70 text-xs font-bold mt-2 uppercase tracking-widest">Near {order.address.landmark}</p>}
                            <p className="text-gray-400 mt-1">{order.address?.city}, {order.address?.pincode}</p>
                        </div>
                    </div>
                </div>

                {/* Bill Summary */}
                <div className="space-y-8">
                    <div className="glass p-8 rounded-3xl border border-white/10 sticky top-28">
                        <h3 className="text-xl font-bold mb-8">Bill Summary</h3>
                        <div className="space-y-4 mb-8">
                            <div className="flex justify-between text-gray-400 text-sm">
                                <span>Item Total</span>
                                <span>₹{(order.totalAmount - (order.taxAmount || 0) - (order.deliveryCharges || 0)).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-gray-400 text-sm">
                                <span>Taxes & Charges</span>
                                <span>₹{(order.taxAmount || 0).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-gray-400 text-sm">
                                <span>Delivery Fee</span>
                                <span className={order.deliveryCharges === 0 ? 'text-green-500' : ''}>
                                    {order.deliveryCharges === 0 ? 'FREE' : `₹${order.deliveryCharges}`}
                                </span>
                            </div>
                            <div className="flex justify-between font-black text-2xl text-primary pt-4 border-t border-white/5">
                                <span>Total Paid</span>
                                <span>₹{order.totalAmount.toFixed(2)}</span>
                            </div>
                        </div>

                        <div className="p-4 bg-white/5 rounded-2xl flex items-center gap-4 text-xs mb-4">
                            <div className="p-2 bg-primary/10 rounded-xl">
                                <CreditCard size={18} className="text-primary" />
                            </div>
                            <div>
                                <p className="text-gray-500 uppercase font-black tracking-widest text-[10px]">Payment Mode</p>
                                <p className="font-bold">{order.paymentMethod} • <span className="text-green-500">{order.paymentStatus}</span></p>
                            </div>
                        </div>

                        <div className="p-6 bg-accent/5 rounded-3xl border border-accent/10">
                            <h4 className="text-xs font-black text-accent uppercase tracking-widest mb-4">Help & Support</h4>
                            <div className="space-y-4">
                                <p className="text-xs text-gray-400">Facing issues with your order? Our team is available 24/7.</p>
                                <button className="w-full py-3 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-bold transition-300">
                                    Chat with Support
                                </button>
                                {['Placed', 'Preparing'].includes(order.orderStatus) && (
                                    <button
                                        onClick={handleCancelOrder}
                                        className="w-full py-3 btn-theme-red rounded-xl text-xs font-bold mt-2"
                                    >
                                        Cancel Order
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};


export default OrderDetails;
