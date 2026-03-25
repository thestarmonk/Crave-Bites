import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import { CartContext } from '../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';

const Cart = () => {
    const { cartItems, removeFromCart, updateQuantity, subtotal, tax, deliveryCharges, total } = useContext(CartContext);

    if (cartItems.length === 0) {
        return (
            <div className="pt-32 pb-20 px-6 flex flex-col items-center justify-center min-h-[70vh]">
                <div className="bg-white/5 p-8 rounded-full mb-6">
                    <ShoppingBag size={80} className="text-gray-600" />
                </div>
                <h2 className="text-3xl font-bold mb-4">Your cart is empty</h2>
                <p className="text-gray-400 mb-8 max-w-xs text-center">Looks like you haven't added anything to your cart yet.</p>
                <Link to="/menu" className="bg-primary hover:bg-primary-dark px-10 py-4 rounded-2xl font-bold transition-300 shadow-lg shadow-primary/20">
                    Browse Menu
                </Link>
            </div>
        );
    }

    return (
        <div className="pt-32 pb-40 px-6 max-w-7xl mx-auto">
            <h1 className="text-4xl font-extrabold mb-12">Shopping <span className="text-gradient">Cart</span></h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-6">
                    <AnimatePresence>
                        {cartItems.map((item) => (
                            <motion.div
                                key={item._id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="glass p-4 rounded-2xl flex items-center gap-6"
                            >
                                <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-xl" />

                                <div className="flex-1">
                                    <h3 className="font-bold text-lg mb-1">{item.name}</h3>
                                    <p className="text-gray-400 text-sm mb-3">{item.category}</p>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4 bg-[#0D0D12] rounded-xl px-4 py-2 border border-white/5">
                                            <button
                                                onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                                className="text-emerald-500 hover:text-emerald-400 p-1 transition-colors"
                                            >
                                                <Minus size={20} />
                                            </button>
                                            <span className="w-6 text-center font-black text-emerald-500 text-lg">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                                className="text-emerald-500 hover:text-emerald-400 p-1 transition-colors"
                                            >
                                                <Plus size={20} />
                                            </button>
                                        </div>
                                        <span className="font-bold text-accent">₹{item.price * item.quantity}</span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => removeFromCart(item._id)}
                                    className="p-2 text-gray-500 hover:text-red-500 transition-300"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                    <div className="glass p-8 rounded-3xl sticky top-28 border border-white/10">
                        <h2 className="text-2xl font-bold mb-8">Order Summary</h2>

                        <div className="space-y-4 mb-8">
                            <div className="flex justify-between text-gray-400">
                                <span>Subtotal</span>
                                <span>₹{subtotal}</span>
                            </div>
                            <div className="flex justify-between text-gray-400">
                                <span>Tax (GST 5%)</span>
                                <span>₹{tax.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-gray-400">
                                <span>Delivery Charges</span>
                                <span>₹{deliveryCharges}</span>
                            </div>
                            <div className="border-t border-white/10 pt-4 flex justify-between font-bold text-xl">
                                <span>Total</span>
                                <span className="text-primary">₹{total.toFixed(2)}</span>
                            </div>
                        </div>

                        <Link to="/checkout" className="w-full btn-theme py-4 rounded-2xl font-bold flex items-center justify-center space-x-3">
                            <span>Checkout</span>
                            <ArrowRight size={20} />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
