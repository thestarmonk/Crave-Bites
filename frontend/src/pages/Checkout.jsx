import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import { CreditCard, MapPin, CheckCircle, Home as HomeIcon, Briefcase, Plus, X, Landmark, Pencil, Navigation } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Checkout = () => {
    const { cartItems, total, subtotal, tax, deliveryCharges, clearCart } = useContext(CartContext);
    const { user, fetchProfile } = useContext(AuthContext);
    const navigate = useNavigate();

    const [selectedAddress, setSelectedAddress] = useState(null);
    const [isAddingNew, setIsAddingNew] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editAddressId, setEditAddressId] = useState(null);
    const [saveNewAddress, setSaveNewAddress] = useState(false);
    const [isDetecting, setIsDetecting] = useState(false);

    const [newAddress, setNewAddress] = useState({
        type: 'Home',
        street: '',
        landmark: '',
        city: '',
        pincode: ''
    });

    const [paymentMethod, setPaymentMethod] = useState('Online');
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        if (cartItems.length === 0) {
            navigate('/menu');
        }
        fetchProfile();
    }, [cartItems, navigate]);

    useEffect(() => {
        if (user?.address?.length > 0 && !selectedAddress && !isAddingNew) {
            setSelectedAddress(user.address[0]);
        }
    }, [user, selectedAddress, isAddingNew]);

    const detectCurrentLocation = () => {
        if (!navigator.geolocation) {
            toast.error("Geolocation is not supported by your browser");
            return;
        }

        setIsDetecting(true);
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const { latitude, longitude } = position.coords;
                    const response = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
                    );
                    const data = await response.json();

                    if (data.address) {
                        const addr = data.address;
                        const street = [
                            addr.house_number,
                            addr.road,
                            addr.suburb,
                            addr.neighbourhood
                        ].filter(Boolean).join(', ');

                        setNewAddress({
                            type: newAddress.type,
                            street: street || '',
                            city: addr.city || addr.town || addr.village || addr.state_district || addr.county || '',
                            pincode: addr.postcode || '',
                            landmark: addr.suburb || addr.neighbourhood || addr.road || ''
                        });
                        toast.success("Location detected!");
                    }
                } catch (error) {
                    console.error("Error detecting location:", error);
                    toast.error("Failed to fetch address details");
                } finally {
                    setIsDetecting(false);
                }
            },
            (error) => {
                console.error("Geolocation error:", error);
                let msg = "Failed to get location";
                if (error.code === 1) msg = "Location access denied. Please allow it in browser settings.";
                if (error.code === 2) msg = "Position unavailable. Please try again or fill manually.";
                if (error.code === 3) msg = "Timeout getting location. Please try again.";
                toast.error(msg);
                setIsDetecting(false);
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
        );
    };

    const startEditing = (addr) => {
        setNewAddress({
            type: addr.type,
            street: addr.street,
            landmark: addr.landmark || '',
            city: addr.city,
            pincode: addr.pincode
        });
        setEditAddressId(addr._id);
        setIsEditing(true);
        setIsAddingNew(true);
        setSaveNewAddress(true);
    };

    const handleCancelForm = () => {
        setIsAddingNew(false);
        setIsEditing(false);
        setEditAddressId(null);
        setNewAddress({ type: 'Home', street: '', landmark: '', city: '', pincode: '' });
    };

    const loadRazorpay = () => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        setIsProcessing(true);

        try {
            let finalAddress = isAddingNew ? newAddress : selectedAddress;

            if (!finalAddress) {
                toast.error('Please select or add a delivery address');
                setIsProcessing(false);
                return;
            }

            // Save or Update address if needed
            if (isAddingNew && saveNewAddress) {
                try {
                    if (isEditing && editAddressId) {
                        await api.put(`/auth/address/${editAddressId}`, newAddress);
                    } else {
                        await api.post('/auth/address', newAddress);
                    }
                    await fetchProfile(); // Refresh context
                } catch (err) {
                    console.error('Failed to save address to profile', err);
                }
            }

            // 1. Create Order in Backend
            const orderData = {
                items: cartItems.filter(item => item && item._id).map(item => ({
                    productId: item._id,
                    quantity: item.quantity,
                    price: item.price
                })),
                address: finalAddress,
                paymentMethod,
                totalAmount: total,
                taxAmount: tax,
                deliveryCharges,
                discountAmount: 0
            };

            const { data: createdOrder } = await api.post('/orders', orderData);

            if (paymentMethod === 'Online') {
                const res = await loadRazorpay();
                if (!res) {
                    toast.error('Razorpay SDK failed to load');
                    setIsProcessing(false);
                    return;
                }

                const { data: razorpayOrder } = await api.post('/payment/create-order', { amount: total });

                const options = {
                    key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'your_razorpay_key_id',
                    amount: razorpayOrder.amount,
                    currency: razorpayOrder.currency,
                    name: "CraveBites",
                    description: "Order Payment",
                    order_id: razorpayOrder.id,
                    handler: async (response) => {
                        try {
                            const verifyData = {
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                                orderId: createdOrder?._id
                            };
                            await api.post('/payment/verify', verifyData);
                            toast.success('Payment Successful!');
                            clearCart();
                            navigate('/profile');
                        } catch (err) {
                            toast.error('Payment verification failed');
                        }
                    },
                    prefill: {
                        name: user.name,
                        email: user.email,
                        contact: user.phone
                    },
                    theme: { color: "#FF4D4D" }
                };

                const paymentObject = new window.Razorpay(options);
                paymentObject.open();
            } else {
                toast.success('Order placed successfully (COD)');
                clearCart();
                navigate('/profile');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to place order');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
            <h1 className="text-4xl font-extrabold mb-12">Checkout</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="space-y-8">
                    <section className="glass p-8 rounded-3xl border border-white/10">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold flex items-center gap-3">
                                <MapPin size={22} className="text-primary" />
                                Delivery Address
                            </h2>
                            <button
                                onClick={() => isAddingNew ? handleCancelForm() : setIsAddingNew(true)}
                                className="text-primary font-bold flex items-center gap-2 hover:underline transition-300"
                            >
                                {isAddingNew ? <><X size={18} /> Cancel</> : <><Plus size={18} /> Add New</>}
                            </button>
                        </div>

                        {!isAddingNew ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {user?.address?.filter(addr => addr && addr._id).map((addr) => (
                                    <div
                                        key={addr._id}
                                        onClick={() => setSelectedAddress(addr)}
                                        className={`p-5 rounded-2xl border cursor-pointer transition-all duration-300 relative group ${selectedAddress?._id === addr._id
                                            ? 'bg-primary/10 border-primary shadow-lg shadow-primary/10'
                                            : 'bg-white/5 border-white/10 hover:border-white/30'
                                            }`}
                                    >
                                        <div className="flex gap-4 items-start">
                                            <div className={`p-3 rounded-xl ${selectedAddress?._id === addr._id ? 'bg-primary text-white' : 'bg-white/10 text-gray-400'}`}>
                                                {addr.type === 'Home' ? <HomeIcon size={18} /> : addr.type === 'Work' ? <Briefcase size={18} /> : <MapPin size={18} />}
                                            </div>
                                            <div className="flex-1 overflow-hidden">
                                                <div className="flex justify-between items-center mb-1">
                                                    <p className="font-bold text-sm">{addr.type}</p>
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); startEditing(addr); }}
                                                        className="p-1.5 opacity-0 group-hover:opacity-100 hover:bg-white/10 rounded-lg transition-all text-gray-400 hover:text-primary"
                                                    >
                                                        <Pencil size={12} />
                                                    </button>
                                                </div>
                                                <p className="text-gray-400 text-xs truncate">{addr.street}</p>
                                                <p className="text-gray-500 text-[10px] mt-1 italic">
                                                    {addr.city}, {addr.pincode}
                                                </p>
                                            </div>
                                        </div>
                                        {selectedAddress?._id === addr._id && (
                                            <div className="absolute top-4 right-4 text-primary">
                                                <CheckCircle size={16} fill="currentColor" className="text-primary" />
                                            </div>
                                        )}
                                    </div>
                                ))}
                                {(!user?.address || user?.address.length === 0) && (
                                    <div className="md:col-span-2 text-center py-8 border border-dashed border-white/10 rounded-2xl">
                                        <p className="text-gray-500 text-sm">No saved addresses found.</p>
                                        <button onClick={() => setIsAddingNew(true)} className="text-primary font-bold mt-2 hover:underline transition-300">
                                            Add your first address
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                                <div className="flex justify-between items-center mb-2">
                                    <p className="text-xs font-black text-gray-500 uppercase tracking-widest">
                                        {isEditing ? 'Edit Address' : 'New Address Details'}
                                    </p>
                                    <button
                                        type="button"
                                        onClick={detectCurrentLocation}
                                        disabled={isDetecting}
                                        className="text-[10px] font-black text-primary uppercase border border-primary/30 px-3 py-1.5 rounded-lg hover:bg-primary/10 transition-all flex items-center gap-2 group"
                                    >
                                        <Navigation size={12} className={isDetecting ? 'animate-spin' : 'group-hover:rotate-12 transition-all'} />
                                        {isDetecting ? 'Detecting...' : 'Use Current Location'}
                                    </button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="md:col-span-2 relative">
                                        <HomeIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                        <input
                                            type="text"
                                            placeholder="Street Address / Flat No."
                                            required
                                            className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3.5 focus:outline-none focus:border-primary transition-300"
                                            value={newAddress.street}
                                            onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                                        />
                                    </div>
                                    <div className="relative">
                                        <Landmark className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                        <input
                                            type="text"
                                            placeholder="Landmark (Optional)"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3.5 focus:outline-none focus:border-primary transition-300"
                                            value={newAddress.landmark}
                                            onChange={(e) => setNewAddress({ ...newAddress, landmark: e.target.value })}
                                        />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="City"
                                        required
                                        className="bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 focus:outline-none focus:border-primary transition-300"
                                        value={newAddress.city}
                                        onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Pincode"
                                        required
                                        className="bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 focus:outline-none focus:border-primary transition-300"
                                        value={newAddress.pincode}
                                        onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })}
                                    />
                                </div>

                                <div className="flex gap-4 items-center pt-2">
                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Tag as:</p>
                                    <div className="flex gap-2">
                                        {['Home', 'Work', 'Other'].map(type => (
                                            <button
                                                key={type}
                                                type="button"
                                                onClick={() => setNewAddress({ ...newAddress, type })}
                                                className={`px-4 py-2 rounded-full text-xs font-bold transition-300 border ${newAddress.type === type ? 'bg-primary border-primary text-white' : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/30'}`}
                                            >
                                                {type}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <label className="flex items-center gap-3 cursor-pointer group pt-2">
                                    <div className="relative">
                                        <input
                                            type="checkbox"
                                            className="peer hidden"
                                            checked={saveNewAddress}
                                            onChange={(e) => setSaveNewAddress(e.target.checked)}
                                        />
                                        <div className="w-5 h-5 border-2 border-white/20 rounded-md peer-checked:bg-primary peer-checked:border-primary transition-300 flex items-center justify-center">
                                            {saveNewAddress && <CheckCircle size={14} className="text-white" />}
                                        </div>
                                    </div>
                                    <span className="text-sm text-gray-400 group-hover:text-gray-300 transition-300">
                                        {isEditing ? 'Update this address' : 'Save this address for future orders'}
                                    </span>
                                </label>
                            </motion.div>
                        )}
                    </section>

                    <section className="glass p-8 rounded-3xl border border-white/10">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                            <CreditCard size={22} className="text-primary" />
                            Payment Method
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <button
                                type="button"
                                onClick={() => setPaymentMethod('Online')}
                                className={`p-4 rounded-2xl border transition-300 flex items-center justify-center gap-3 font-semibold ${paymentMethod === 'Online' ? 'bg-primary/10 border-primary text-primary' : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/30'}`}
                            >
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'Online' ? 'border-primary' : 'border-gray-500'}`}>
                                    {paymentMethod === 'Online' && <div className="w-2.5 h-2.5 bg-primary rounded-full"></div>}
                                </div>
                                Razorpay (Online)
                            </button>
                            <button
                                type="button"
                                onClick={() => setPaymentMethod('COD')}
                                className={`p-4 rounded-2xl border transition-300 flex items-center justify-center gap-3 font-semibold ${paymentMethod === 'COD' ? 'bg-primary/10 border-primary text-primary' : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/30'}`}
                            >
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'COD' ? 'border-primary' : 'border-gray-500'}`}>
                                    {paymentMethod === 'COD' && <div className="w-2.5 h-2.5 bg-primary rounded-full"></div>}
                                </div>
                                Cash on Delivery
                            </button>
                        </div>
                    </section>
                </div>

                <div>
                    <div className="glass p-8 rounded-3xl sticky top-28 border border-white/10">
                        <h2 className="text-2xl font-bold mb-8">Order Summary</h2>

                        <div className="space-y-4 mb-8 overflow-y-auto max-h-60 pr-2">
                            {cartItems.map(item => (
                                <div key={item._id} className="flex justify-between items-center text-sm">
                                    <span className="text-gray-400">{item.name} x {item.quantity}</span>
                                    <span className="font-semibold">₹{item.price * item.quantity}</span>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-4 border-t border-white/10 pt-6 mb-8">
                            <div className="flex justify-between text-gray-400 text-sm">
                                <span>Subtotal</span>
                                <span>₹{subtotal}</span>
                            </div>
                            <div className="flex justify-between text-gray-400 text-sm">
                                <span>Tax & Fees</span>
                                <span>₹{tax.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-gray-400 text-sm">
                                <span>Delivery</span>
                                <span className={deliveryCharges === 0 ? 'text-green-500' : ''}>
                                    {deliveryCharges === 0 ? 'FREE' : `₹${deliveryCharges}`}
                                </span>
                            </div>
                            <div className="flex justify-between font-bold text-xl text-primary pt-2">
                                <span>Total Amount</span>
                                <span>₹{total.toFixed(2)}</span>
                            </div>
                        </div>

                        <button
                            disabled={isProcessing || (isAddingNew ? (!newAddress.street || !newAddress.city || !newAddress.pincode) : !selectedAddress)}
                            onClick={handlePlaceOrder}
                            className={`w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 transition-500 ${isProcessing || (isAddingNew ? (!newAddress.street || !newAddress.city || !newAddress.pincode) : !selectedAddress) ? 'bg-gray-800 text-gray-500 cursor-not-allowed' : 'btn-theme shadow-lg shadow-primary/20'}`}
                        >
                            {isProcessing ? (
                                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                            ) : (
                                <CheckCircle size={20} />
                            )}
                            <span>{isProcessing ? 'Processing...' : 'Place Order'}</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
