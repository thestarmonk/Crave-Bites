import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import Loader from '../components/Loader';
import { Package, Clock, MapPin, Edit3, Save, X, Plus, Trash2, Phone, Mail, User as UserIcon, Home as HomeIcon, Pencil, Navigation } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const Profile = () => {
    const { user, logout, fetchProfile } = useContext(AuthContext);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({ name: '', phone: '', email: '' });
    const [addresses, setAddresses] = useState([]);
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [isEditingAddress, setIsEditingAddress] = useState(false);
    const [editAddressId, setEditAddressId] = useState(null);
    const [isDetecting, setIsDetecting] = useState(false);
    const [newAddress, setNewAddress] = useState({ type: 'Home', street: '', landmark: '', city: '', pincode: '' });

    useEffect(() => {
        if (user) {
            setEditForm({ name: user.name, phone: user.phone, email: user.email });
            setAddresses(user.address || []);
        }
    }, [user]);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const { data } = await api.get('/orders/myorders');
                setOrders(data);
            } catch (error) {
                console.error("Error fetching orders", error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        try {
            const { data } = await api.put('/auth/profile', editForm);
            localStorage.setItem('userInfo', JSON.stringify(data));
            setIsEditing(false);
            toast.success('Profile updated successfully');
            window.location.reload();
        } catch (error) {
            toast.error('Failed to update profile');
        }
    };

    const handleAddressSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditingAddress && editAddressId) {
                await api.put(`/auth/address/${editAddressId}`, newAddress);
                toast.success('Address updated');
            } else {
                await api.post('/auth/address', newAddress);
                toast.success('Address added');
            }
            await fetchProfile();
            resetAddressForm();
        } catch (error) {
            toast.error('Failed to save address');
        }
    };

    const resetAddressForm = () => {
        setShowAddressForm(false);
        setIsEditingAddress(false);
        setEditAddressId(null);
        setNewAddress({ type: 'Home', street: '', landmark: '', city: '', pincode: '' });
    };

    const startEditingAddress = (addr) => {
        setNewAddress({
            type: addr.type,
            street: addr.street,
            landmark: addr.landmark || '',
            city: addr.city,
            pincode: addr.pincode
        });
        setEditAddressId(addr._id);
        setIsEditingAddress(true);
        setShowAddressForm(true);
    };

    const handleDeleteAddress = async (id) => {
        if (!window.confirm('Remove this address?')) return;
        try {
            await api.delete(`/auth/address/${id}`);
            await fetchProfile();
            toast.success('Address removed');
        } catch (error) {
            toast.error('Failed to remove address');
        }
    };

    const detectCurrentLocation = () => {
        if (!navigator.geolocation) {
            toast.error("Geolocation not supported");
            return;
        }
        setIsDetecting(true);
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const { latitude, longitude } = position.coords;
                    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`);
                    const data = await res.json();
                    if (data.address) {
                        const addr = data.address;
                        const street = [addr.house_number, addr.road, addr.suburb].filter(Boolean).join(', ');
                        setNewAddress({
                            type: newAddress.type,
                            street: street || '',
                            city: addr.city || addr.town || addr.village || addr.state_district || addr.county || '',
                            pincode: addr.postcode || '',
                            landmark: addr.suburb || addr.neighbourhood || addr.road || ''
                        });
                        toast.success("Location detected!");
                    }
                } catch (err) {
                    toast.error("Failed to detect location details");
                } finally {
                    setIsDetecting(false);
                }
            },
            (error) => {
                let msg = "Failed to get location";
                if (error.code === 1) msg = "Location access denied. Please allow it in browser settings.";
                if (error.code === 2) msg = "Position unavailable. Please try again.";
                if (error.code === 3) msg = "Location request timed out.";
                toast.error(msg);
                setIsDetecting(false);
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
        );
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Delivered': return 'text-green-500 bg-green-500/10';
            case 'Out for delivery': return 'text-blue-500 bg-blue-500/10';
            case 'Preparing': return 'text-yellow-500 bg-yellow-500/10';
            case 'Placed': return 'text-primary bg-primary/10';
            default: return 'text-gray-500 bg-gray-500/10';
        }
    };

    const tabs = ['Order History', 'My Addresses', 'Settings'];
    const [activeTab, setActiveTab] = useState('Order History');

    return (
        <div className="pt-32 pb-40 px-6 max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                <div className="lg:col-span-1 space-y-6">
                    <div className="glass p-8 rounded-3xl border border-white/10 text-center relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-accent"></div>
                        <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-white/5 shadow-inner">
                            <span className="text-4xl font-extrabold text-primary">{user?.name?.charAt(0)}</span>
                        </div>
                        <h2 className="text-2xl font-bold mb-1 truncate">{user?.name}</h2>
                        <p className="text-gray-400 text-sm mb-8 truncate">{user?.email}</p>
                        <div className="space-y-2">
                            {tabs.map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`w-full text-left px-6 py-3 rounded-2xl font-bold transition-300 flex items-center gap-4 ${activeTab === tab ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
                                >
                                    {tab === 'Order History' && <Package size={18} />}
                                    {tab === 'My Addresses' && <MapPin size={18} />}
                                    {tab === 'Settings' && <Edit3 size={18} />}
                                    {tab}
                                </button>
                            ))}
                        </div>
                        <button onClick={logout} className="w-full mt-12 border border-white/10 hover:bg-red-500/10 py-3 rounded-2xl font-bold transition-300 text-red-500 flex items-center justify-center gap-2">
                            <X size={18} /> Sign Out
                        </button>
                    </div>
                </div>

                <div className="lg:col-span-3">
                    <AnimatePresence mode="wait">
                        {activeTab === 'Order History' && (
                            <motion.div key="orders" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                                <h2 className="text-3xl font-extrabold mb-8 flex items-center gap-4">
                                    Recent <span className="text-gradient">Orders</span>
                                    <span className="text-sm font-normal text-gray-500 px-3 py-1 bg-white/5 rounded-full">{orders.length}</span>
                                </h2>
                                {loading ? <Loader /> : (
                                    <div className="space-y-6">
                                        {orders.length > 0 ? orders.map((order) => (
                                            <div key={order._id} className="glass p-8 rounded-3xl border border-white/10 hover:border-white/20 transition-all duration-500 group">
                                                <div className="flex flex-wrap justify-between items-start gap-6 mb-8">
                                                    <div className="flex gap-4 items-center">
                                                        <div className="p-4 bg-white/5 rounded-2xl group-hover:scale-110 transition-300">
                                                            <Package className="text-primary" />
                                                        </div>
                                                        <div>
                                                            <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Order ID: {order._id.slice(-8)}</p>
                                                            <p className="font-bold flex items-center gap-2 mt-1">
                                                                <Clock size={16} className="text-gray-400" />
                                                                {new Date(order.createdAt).toLocaleString()}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusColor(order.orderStatus)}`}>
                                                        {order.orderStatus}
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center pt-6 border-t border-white/5">
                                                    <div>
                                                        <p className="text-xs text-gray-500 mb-1">Items Ordered</p>
                                                        <p className="font-bold">{order.items.length} Delicious Dishes</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-gray-500 mb-1">Total Paid</p>
                                                        <p className="text-2xl font-black text-accent">₹{order.totalAmount.toFixed(2)}</p>
                                                    </div>
                                                    <Link to={`/order/${order._id}`} className="bg-white/5 group-hover:bg-primary group-hover:text-white py-3 rounded-2xl font-bold transition-all duration-300 border border-white/10 flex items-center justify-center gap-2">
                                                        View Full Details <ChevronRight size={18} />
                                                    </Link>
                                                </div>
                                            </div>
                                        )) : (
                                            <div className="text-center py-24 bg-white/5 rounded-3xl border border-dashed border-white/10">
                                                <p className="text-gray-400 text-lg">You haven't placed any orders yet.</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {activeTab === 'My Addresses' && (
                            <motion.div key="address" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                                <div className="flex justify-between items-center mb-8">
                                    <h2 className="text-3xl font-extrabold">Address <span className="text-gradient">Book</span></h2>
                                    <button onClick={() => showAddressForm ? resetAddressForm() : setShowAddressForm(true)} className="bg-primary hover:bg-primary-dark p-3 rounded-2xl transition-300 shadow-lg shadow-primary/20">
                                        {showAddressForm ? <X /> : <Plus />}
                                    </button>
                                </div>

                                {showAddressForm && (
                                    <motion.form initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="glass rounded-[2.5rem] border border-white/10 mb-8 overflow-hidden" onSubmit={handleAddressSubmit}>
                                        <div className="p-8 space-y-6">
                                            <div className="flex justify-between items-center mb-2">
                                                <p className="text-xs font-black text-gray-500 uppercase tracking-widest">{isEditingAddress ? 'Edit Address' : 'New Address'}</p>
                                                <button type="button" onClick={detectCurrentLocation} disabled={isDetecting} className="text-[10px] font-black text-primary border border-primary/30 px-3 py-1.5 rounded-lg flex items-center gap-2">
                                                    <Navigation size={12} className={isDetecting ? 'animate-spin' : ''} />
                                                    {isDetecting ? 'Detecting...' : 'Use Current Location'}
                                                </button>
                                            </div>
                                            <div className="divide-y divide-white/5 border border-white/10 rounded-3xl overflow-hidden bg-white/5">
                                                <div className="p-4"><input type="text" className="w-full bg-transparent p-2 focus:outline-none text-sm" placeholder="Street / Flat No." required value={newAddress.street} onChange={e => setNewAddress({ ...newAddress, street: e.target.value })} /></div>
                                                <div className="p-4"><input type="text" className="w-full bg-transparent p-2 focus:outline-none text-sm" placeholder="Landmark" value={newAddress.landmark} onChange={e => setNewAddress({ ...newAddress, landmark: e.target.value })} /></div>
                                                <div className="grid grid-cols-2 divide-x divide-white/5">
                                                    <div className="p-4"><input type="text" className="w-full bg-transparent p-2 focus:outline-none text-sm" placeholder="City" required value={newAddress.city} onChange={e => setNewAddress({ ...newAddress, city: e.target.value })} /></div>
                                                    <div className="p-4"><input type="text" className="w-full bg-transparent p-2 focus:outline-none text-sm" placeholder="Pincode" required value={newAddress.pincode} onChange={e => setNewAddress({ ...newAddress, pincode: e.target.value })} /></div>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-3 gap-0 border border-white/10 rounded-2xl overflow-hidden bg-white/5">
                                                {['Home', 'Work', 'Other'].map(t => (
                                                    <button key={t} type="button" onClick={() => setNewAddress({ ...newAddress, type: t })} className={`py-4 flex flex-col items-center gap-2 transition-all border-r last:border-r-0 border-white/10 ${newAddress.type === t ? 'bg-primary text-white' : 'text-gray-500 hover:bg-white/5'}`}>
                                                        {t === 'Home' ? <HomeIcon size={16} /> : t === 'Work' ? <Package size={16} /> : <MapPin size={16} />}
                                                        <span className="text-[10px] font-bold uppercase tracking-widest">{t}</span>
                                                    </button>
                                                ))}
                                            </div>
                                            <button className="w-full bg-primary hover:bg-primary-dark py-5 rounded-2xl font-black text-lg transition-300 shadow-xl shadow-primary/20">
                                                {isEditingAddress ? 'Update Address' : 'Save Address'}
                                            </button>
                                        </div>
                                    </motion.form>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {addresses.map((addr) => (
                                        <div key={addr._id} className="glass p-6 rounded-3xl border border-white/10 relative group hover:border-primary/30 transition-all duration-500">
                                            <div className="flex gap-4 items-start">
                                                <div className="p-3 bg-primary/10 rounded-2xl">
                                                    {addr.type === 'Home' ? <HomeIcon className="text-primary" size={20} /> : addr.type === 'Work' ? <Package className="text-primary" size={20} /> : <MapPin className="text-primary" size={20} />}
                                                </div>
                                                <div className="flex-1">
                                                    <p className="font-black text-lg mb-1">{addr.type}</p>
                                                    <p className="text-gray-400 text-sm leading-relaxed truncate">{addr.street}</p>
                                                    {addr.landmark && <p className="text-gray-500 text-[10px] font-bold mt-1 italic">Near {addr.landmark}</p>}
                                                    <p className="text-gray-400 text-sm mt-1">{addr.city}, {addr.pincode}</p>
                                                </div>
                                            </div>
                                            <div className="absolute top-6 right-6 flex gap-2">
                                                <button onClick={() => startEditingAddress(addr)} className="p-2 text-gray-500 hover:text-primary transition-300">
                                                    <Pencil size={18} />
                                                </button>
                                                <button onClick={() => handleDeleteAddress(addr._id)} className="p-2 text-gray-500 hover:text-red-500 transition-300">
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                    {addresses.length === 0 && !showAddressForm && (
                                        <div className="md:col-span-2 text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
                                            <p className="text-gray-400">No saved addresses found.</p>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'Settings' && (
                            <motion.div key="settings" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                                <div className="flex justify-between items-center mb-12">
                                    <h2 className="text-3xl font-extrabold">Account <span className="text-gradient">Settings</span></h2>
                                    {!isEditing && (
                                        <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 text-primary font-bold hover:underline">
                                            <Edit3 size={18} /> Edit Profile
                                        </button>
                                    )}
                                </div>
                                <div className="glass p-10 rounded-[2.5rem] border border-white/10">
                                    <form onSubmit={handleUpdateProfile} className="space-y-8">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="space-y-3">
                                                <label className="text-xs font-black text-gray-500 uppercase tracking-widest flex items-center gap-2"><UserIcon size={14} /> Full Name</label>
                                                <input type="text" disabled={!isEditing} className={`w-full bg-white/5 border border-white/10 p-5 rounded-2xl focus:outline-none transition-300 ${!isEditing ? 'opacity-60 cursor-not-allowed' : 'ring-2 ring-primary/20 bg-white/10'}`} value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} />
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-xs font-black text-gray-500 uppercase tracking-widest flex items-center gap-2"><Mail size={14} /> Email</label>
                                                <input type="email" disabled={!isEditing} className={`w-full bg-white/5 border border-white/10 p-5 rounded-2xl focus:outline-none transition-300 ${!isEditing ? 'opacity-60 cursor-not-allowed' : 'ring-2 ring-primary/20 bg-white/10'}`} value={editForm.email} onChange={e => setEditForm({ ...editForm, email: e.target.value })} />
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-xs font-black text-gray-500 uppercase tracking-widest flex items-center gap-2"><Phone size={14} /> Phone</label>
                                                <input type="tel" disabled={!isEditing} className={`w-full bg-white/5 border border-white/10 p-5 rounded-2xl focus:outline-none transition-300 ${!isEditing ? 'opacity-60 cursor-not-allowed' : 'ring-2 ring-primary/20 bg-white/10'}`} value={editForm.phone} onChange={e => setEditForm({ ...editForm, phone: e.target.value })} />
                                            </div>
                                        </div>
                                        {isEditing && (
                                            <div className="flex gap-4 pt-6">
                                                <button type="submit" className="flex-1 bg-primary hover:bg-primary-dark text-white py-5 rounded-2xl font-bold transition-300 shadow-2xl flex items-center justify-center gap-3">
                                                    <Save size={20} /> Save Changes
                                                </button>
                                                <button type="button" onClick={() => setIsEditing(false)} className="px-10 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-bold transition-all border border-white/10">Cancel</button>
                                            </div>
                                        )}
                                    </form>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default Profile;
