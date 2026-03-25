import { useState, useEffect, useContext, useCallback, useRef, useMemo } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import Loader from '../components/Loader';
import {
    LayoutDashboard, ShoppingBag, UtensilsCrossed, Users, Settings,
    Plus, Edit2, Trash2, CheckCircle, XCircle, Search,
    TrendingUp, Package, IndianRupee, Clock, ChevronRight, X, Phone,
    Mail, User as UserIcon, Home as HomeIcon, MapPin, LogOut, Bell
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const DashboardStats = () => {
    const navigate = useNavigate();
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [stats, setStats] = useState({
        orders: [],
        revenue: 0,
        products: 0,
        users: 0,
        dailyData: [],
        monthlyData: []
    });
    const [loading, setLoading] = useState(true);
    const [timeframe, setTimeframe] = useState('days'); // 'days' or 'months'

    const fetchStats = async () => {
        try {
            const { data: orders } = await api.get('/orders/admin');
            const { data: products } = await api.get('/products');
            const { data: users } = await api.get('/auth/admin/users');

            // Total Revenue
            const totalRevenue = orders
                .filter(o => o.paymentStatus === 'Paid' || o.orderStatus === 'Delivered')
                .reduce((acc, o) => acc + o.totalAmount, 0);

            // Daily Revenue (Last 7 Days)
            const last7Days = [...Array(7)].map((_, i) => {
                const d = new Date();
                d.setDate(d.getDate() - (6 - i));
                return d.toISOString().split('T')[0];
            });

            const dailyRev = last7Days.map(date => {
                const amount = orders
                    .filter(o => o.createdAt.startsWith(date) && (o.paymentStatus === 'Paid' || o.orderStatus === 'Delivered'))
                    .reduce((acc, o) => acc + o.totalAmount, 0);
                return {
                    date,
                    amount,
                    label: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase()
                };
            });

            // Monthly Revenue (Last 6 Months)
            const last6Months = [...Array(6)].map((_, i) => {
                const d = new Date();
                d.setMonth(d.getMonth() - (5 - i));
                return {
                    month: d.getMonth(),
                    year: d.getFullYear(),
                    label: d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()
                };
            });

            const monthlyRev = last6Months.map(m => {
                const amount = orders
                    .filter(o => {
                        const od = new Date(o.createdAt);
                        return od.getMonth() === m.month && od.getFullYear() === m.year && (o.paymentStatus === 'Paid' || o.orderStatus === 'Delivered');
                    })
                    .reduce((acc, o) => acc + o.totalAmount, 0);
                return { ...m, amount };
            });

            const maxDaily = Math.max(...dailyRev.map(d => d.amount), 1000);
            const maxMonthly = Math.max(...monthlyRev.map(m => m.amount), 1000);

            setStats({
                orders: orders,
                revenue: totalRevenue,
                products: products.length,
                users: users.length,
                dailyData: dailyRev.map(d => ({ ...d, height: (d.amount / maxDaily) * 100 })),
                monthlyData: monthlyRev.map(m => ({ ...m, height: (m.amount / maxMonthly) * 100 }))
            });
        } catch (err) {
            console.error(err);
            toast.error('Failed to update analytics');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchStats(); }, []);

    const handleAcceptOrder = async (id) => {
        try {
            await api.put(`/orders/${id}/status`, { orderStatus: 'Preparing' });
            toast.success('Order accepted! Moved to preparation.');
            fetchStats();
        } catch (err) {
            toast.error('Failed to accept order');
        }
    };

    if (loading) return <Loader />;

    const recentOrders = stats.orders.slice(0, 5);
    const chartData = timeframe === 'days' ? stats.dailyData : stats.monthlyData;

    return (
        <div className="space-y-12 relative">

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                {[
                    { label: 'Total Revenue', value: stats.revenue, color: 'text-emerald-400', icon: <IndianRupee />, bg: 'bg-emerald-400/10', path: '/admin/revenue' },
                    { label: 'Total Orders', value: stats.orders.length, color: 'text-primary', icon: <Package />, bg: 'bg-primary/10', path: '/admin/orders' },
                    { label: 'Live Products', value: stats.products, color: 'text-berry', icon: <UtensilsCrossed />, bg: 'bg-berry/10', path: '/admin/menu' },
                    { label: 'Total Users', value: stats.users, color: 'text-accent', icon: <Users />, bg: 'bg-accent/10', path: '/admin/users' }
                ].map((stat, i) => (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        key={i}
                        className="glass p-8 rounded-3xl border border-white/10 relative overflow-hidden group cursor-pointer"
                        onClick={() => navigate(stat.path)}
                    >
                        <div className={`p-4 rounded-2xl w-fit mb-6 transition-transform group-hover:scale-110 ${stat.bg} ${stat.color}`}>{stat.icon}</div>
                        <p className="text-gray-400 font-medium mb-1">{stat.label}</p>
                        <h3 className="text-3xl font-black">{stat.label === 'Total Revenue' ? `₹${stat.value.toLocaleString()}` : stat.value}</h3>
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <TrendingUp size={64} />
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
                <div className="glass p-8 rounded-3xl border border-white/10">
                    <h3 className="text-xl font-bold mb-8 flex justify-between items-center">
                        Recent Orders
                        <Link to="/admin/orders" className="text-primary text-sm font-bold flex items-center gap-1">View All <ChevronRight size={16} /></Link>
                    </h3>
                    <div className="space-y-4">
                        {recentOrders.map(order => (
                            <div
                                key={order._id}
                                className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 group/order cursor-pointer hover:bg-white/10 transition-all"
                                onClick={() => setSelectedOrder(order)}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center font-bold text-primary group-hover/order:scale-110 transition-transform">
                                        {order.userId?.name?.charAt(0) || 'G'}
                                    </div>
                                    <div>
                                        <p className="font-bold text-white group-hover/order:text-primary transition-colors">{order.userId?.name || 'Guest User'}</p>
                                        <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="text-right">
                                        <p className="font-bold text-accent">₹{order.totalAmount}</p>
                                        <p className="text-[10px] uppercase font-bold text-gray-500">{order.orderStatus}</p>
                                    </div>
                                    {order.orderStatus === 'Placed' && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleAcceptOrder(order._id);
                                            }}
                                            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2 animate-pulse hover:animate-none"
                                        >
                                            <CheckCircle size={14} /> Accept
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Dashboard Order Detail Modal */}
                <OrderDetailsModal
                    selectedOrder={selectedOrder}
                    setSelectedOrder={setSelectedOrder}
                    updateStatus={(id, status) => {
                        handleAcceptOrder(id);
                        setSelectedOrder(null);
                    }}
                />

                <div className="glass p-8 rounded-3xl border border-white/10">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-xl font-bold flex items-center gap-2">
                            <TrendingUp className="text-primary" />
                            Sales Analytics
                        </h3>
                        <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
                            <button
                                onClick={() => setTimeframe('days')}
                                className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${timeframe === 'days' ? 'bg-primary text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
                            >
                                Days
                            </button>
                            <button
                                onClick={() => setTimeframe('months')}
                                className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${timeframe === 'months' ? 'bg-primary text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
                            >
                                Months
                            </button>
                        </div>
                    </div>
                    <div className="h-64 flex items-end justify-between gap-2 px-4">
                        {chartData.map((d, i) => (
                            <div key={i} className="w-full bg-white/5 rounded-t-xl group relative cursor-pointer">
                                <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: `${d.height}%` }}
                                    className="bg-primary/40 group-hover:bg-primary transition-all rounded-t-lg"
                                />
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-black text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 shadow-xl font-bold">
                                    ₹{d.amount.toLocaleString()}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-6 text-[10px] text-gray-500 font-black px-2 uppercase tracking-tighter">
                        {chartData.map((d, i) => <span key={i}>{d.label}</span>)}
                    </div>
                </div>
            </div>
        </div>
    );
};

const OrderManagement = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [statusFilter, setStatusFilter] = useState('All');

    const fetchOrders = async () => {
        try {
            const { data } = await api.get('/orders/admin');
            setOrders(data);
        } catch (err) {
            toast.error('Failed to fetch orders');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchOrders(); }, []);

    const updateStatus = async (id, status) => {
        try {
            await api.put(`/orders/${id}/status`, { orderStatus: status });
            toast.success(`Order marked as ${status}`);
            fetchOrders();
            if (selectedOrder?._id === id) {
                setSelectedOrder(prev => ({ ...prev, orderStatus: status }));
            }
        } catch (err) {
            toast.error('Failed to update status');
        }
    };

    const filteredOrders = orders
        .filter(o => {
            const matchesSearch = o._id.includes(searchTerm) || (o.userId?.name || '').toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === 'All' || o.orderStatus === statusFilter;
            return matchesSearch && matchesStatus;
        })
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const statusOptions = ['All', 'Placed', 'Preparing', 'Out for delivery', 'Delivered', 'Cancelled'];

    if (loading) return <Loader />;

    return (
        <div className="space-y-8">
            <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between bg-white/5 p-6 rounded-[2rem] border border-white/10">
                <div className="relative w-full max-w-md group/search">
                    <Search className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${searchTerm ? 'text-primary' : 'text-gray-500'}`} size={18} />
                    <input
                        type="text"
                        placeholder="Search by ID or Customer..."
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-12 focus:outline-none focus:border-primary transition-all placeholder:text-gray-600 font-bold text-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {searchTerm && (
                        <button
                            onClick={() => setSearchTerm('')}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                        >
                            <X size={16} />
                        </button>
                    )}
                </div>

                <div className="flex flex-wrap gap-2">
                    {statusOptions.map(status => (
                        <button
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${statusFilter === status
                                ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20'
                                : 'bg-white/5 border-white/10 text-gray-500 hover:text-white hover:border-white/20'
                                }`}
                        >
                            {status === 'Out for delivery' ? 'Delivery' : status}
                            <span className={`ml-2 px-1.5 py-0.5 rounded-md text-[8px] ${statusFilter === status ? 'bg-white/20 text-white' : 'bg-white/10 text-gray-500'
                                }`}>
                                {status === 'All' ? orders.length : orders.filter(o => o.orderStatus === status).length}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="glass rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-white/5 text-gray-400 text-xs font-black uppercase tracking-widest border-b border-white/5">
                            <tr>
                                <th className="px-8 py-6 w-16">Sl.</th>
                                <th className="px-8 py-6">Order Details</th>
                                <th className="px-8 py-6">Customer</th>
                                <th className="px-8 py-6">Status</th>
                                <th className="px-8 py-6 text-right">Bill</th>
                                <th className="px-8 py-6 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredOrders.map((order) => (
                                <tr key={order._id} className="group hover:bg-white/5 transition-all duration-300">
                                    <td className="px-8 py-6">
                                        <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center font-black text-xs text-gray-500 group-hover:bg-primary/10 group-hover:border-primary/30 group-hover:text-primary transition-all">
                                            {orders.length - orders.findIndex(o => o._id === order._id)}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <p className="font-mono text-[10px] text-gray-500 mb-2 tracking-tighter">#{order._id.slice(-8)}</p>
                                        <div className="space-y-1">
                                            {order.items.slice(0, 2).map((it, i) => (
                                                <div key={i} className="flex items-center gap-2">
                                                    <span className="text-[10px] font-black text-primary bg-primary/10 w-5 h-5 flex items-center justify-center rounded">
                                                        {it.quantity}
                                                    </span>
                                                    <span className="text-[11px] font-bold text-gray-300 truncate max-w-[120px]">
                                                        {it.productId?.name || 'Dish'}
                                                    </span>
                                                </div>
                                            ))}
                                            {order.items.length > 2 && (
                                                <p className="text-[10px] text-primary font-black ml-7">+{order.items.length - 2} more items</p>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col">
                                            <p className="font-black text-white text-sm">{order.userId?.name || 'Guest'}</p>
                                            <a href={`tel:${order.userId?.phone}`} className="text-[11px] text-primary font-bold hover:underline flex items-center gap-1 mt-1">
                                                <Phone size={10} /> {order.userId?.phone || 'No Phone'}
                                            </a>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`status-badge ${order.orderStatus === 'Delivered' ? 'status-delivered' :
                                            order.orderStatus === 'Out for delivery' ? 'status-out-for-delivery' :
                                                order.orderStatus === 'Preparing' ? 'status-preparing' :
                                                    order.orderStatus === 'Cancelled' ? 'status-cancelled' : 'status-placed'
                                            }`}>
                                            <div className={`w-1.5 h-1.5 rounded-full ${order.orderStatus === 'Delivered' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' :
                                                order.orderStatus === 'Out for delivery' ? 'bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]' :
                                                    order.orderStatus === 'Preparing' ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]' :
                                                        order.orderStatus === 'Cancelled' ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]' : 'bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.5)]'
                                                }`} />
                                            {order.orderStatus}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <p className="font-black text-accent text-lg">₹{order.totalAmount}</p>
                                        <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">{order.paymentMethod}</p>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-3 justify-end">
                                            {order.orderStatus === 'Placed' && (
                                                <button
                                                    onClick={() => updateStatus(order._id, 'Preparing')}
                                                    className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2 animate-pulse hover:animate-none"
                                                >
                                                    <CheckCircle size={14} /> Accept
                                                </button>
                                            )}
                                            <div className="relative group/select">
                                                <select
                                                    disabled={order.orderStatus === 'Delivered'}
                                                    onChange={(e) => updateStatus(order._id, e.target.value)}
                                                    value={order.orderStatus}
                                                    className="appearance-none bg-white/5 border border-white/10 rounded-xl pl-4 pr-10 py-2.5 text-[10px] font-black uppercase tracking-widest outline-none focus:border-primary focus:bg-primary/5 disabled:opacity-50 transition-all cursor-pointer relative z-10 [color-scheme:dark]"
                                                >
                                                    <option value="Placed" className="bg-[#1A1A1A]">Placed</option>
                                                    <option value="Preparing" className="bg-[#1A1A1A]">Preparing</option>
                                                    <option value="Out for delivery" className="bg-[#1A1A1A]">Delivery</option>
                                                    <option value="Delivered" className="bg-[#1A1A1A]">Delivered</option>
                                                </select>
                                                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none z-20 group-focus-within/select:text-primary transition-colors">
                                                    <Package size={14} />
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => setSelectedOrder(order)}
                                                className="p-2.5 bg-primary/10 hover:bg-primary border border-primary/20 hover:border-primary text-primary hover:text-white rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-primary/20"
                                                title="View Full Details"
                                            >
                                                <ChevronRight size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {filteredOrders.length === 0 && (
                    <EmptyState message={searchTerm ? `No orders found matching "${searchTerm}"` : "No orders have been placed yet."} icon={ShoppingBag} />
                )}
            </div>

            {/* Order Details Modal */}
            <OrderDetailsModal
                selectedOrder={selectedOrder}
                setSelectedOrder={setSelectedOrder}
                updateStatus={updateStatus}
            />

        </div>
    );
};

const OrderDetailsModal = ({ selectedOrder, setSelectedOrder, updateStatus }) => (
    <AnimatePresence>
        {selectedOrder && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/90 backdrop-blur-md"
                    onClick={() => setSelectedOrder(null)}
                />
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="glass w-full max-w-2xl p-10 rounded-[2.5rem] border border-white/10 relative z-10 max-h-[90vh] overflow-y-auto custom-scrollbar"
                >
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <h3 className="text-2xl font-black mb-1">Order <span className="text-gradient">#{selectedOrder._id.slice(-8)}</span></h3>
                            <p className="text-gray-400 text-sm">{new Date(selectedOrder.createdAt).toLocaleString()}</p>
                        </div>
                        <button onClick={() => setSelectedOrder(null)} className="p-3 hover:bg-white/10 rounded-full transition-300"><X /></button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <section className="space-y-6">
                            <div className="bg-white/5 p-6 rounded-3xl border border-white/5 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <UserIcon size={48} />
                                </div>
                                <h4 className="text-xs font-black text-primary uppercase tracking-[0.2em] mb-4">Customer Info</h4>
                                <div className="space-y-4">
                                    <div>
                                        <p className="flex items-center gap-3 font-black text-white text-lg">
                                            <UserIcon size={18} className="text-primary" />
                                            {selectedOrder.userId?.name || selectedOrder.address?.name || 'Guest Customer'}
                                        </p>
                                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1 ml-7">
                                            {selectedOrder.userId ? 'Registered Member' : 'Guest Checkout'}
                                        </p>
                                    </div>

                                    {(selectedOrder.userId?.phone || selectedOrder.address?.phone) && (
                                        <div className="flex gap-2 ml-7">
                                            <button
                                                onClick={() => window.open(`tel:${selectedOrder.userId?.phone || selectedOrder.address?.phone}`)}
                                                className="px-4 py-2 bg-accent/10 hover:bg-accent text-accent hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-accent/20 flex items-center gap-2"
                                            >
                                                <Phone size={12} /> Call
                                            </button>
                                            {(selectedOrder.userId?.email) && (
                                                <button
                                                    onClick={() => window.open(`mailto:${selectedOrder.userId.email}`)}
                                                    className="px-4 py-2 bg-white/5 hover:bg-white text-gray-400 hover:text-black rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-white/10 flex items-center gap-2"
                                                >
                                                    <Mail size={12} /> Email
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="bg-white/5 p-6 rounded-3xl border border-white/5 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <MapPin size={48} />
                                </div>
                                <h4 className="text-xs font-black text-primary uppercase tracking-[0.2em] mb-4">Delivery Address</h4>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <span className="px-2 py-1 bg-primary/20 text-primary text-[10px] font-black rounded uppercase tracking-widest">
                                            {selectedOrder.address?.type || 'Home'}
                                        </span>
                                    </div>
                                    <p className="text-white font-bold leading-relaxed">{selectedOrder.address?.street}</p>
                                    {selectedOrder.address?.landmark && (
                                        <div className="flex items-center gap-2 text-accent">
                                            <HomeIcon size={14} />
                                            <p className="text-xs font-bold italic">Near {selectedOrder.address.landmark}</p>
                                        </div>
                                    )}
                                    <p className="text-gray-400 text-sm flex items-center gap-2">
                                        <MapPin size={14} className="text-gray-600" />
                                        {selectedOrder.address?.city}, {selectedOrder.address?.pincode}
                                    </p>
                                </div>
                            </div>
                        </section>

                        <section className="space-y-6">
                            <div className="bg-white/5 p-6 rounded-3xl border border-white/5">
                                <h4 className="text-xs font-black text-primary uppercase tracking-[0.2em] mb-4">Items Summary</h4>
                                <div className="space-y-4 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                                    {selectedOrder.items.map((item, i) => (
                                        <div key={i} className="flex justify-between items-center gap-4 group/item p-2 hover:bg-white/5 rounded-2xl transition-all">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center font-bold text-gray-500 overflow-hidden border border-white/10 group-hover/item:border-primary/50 transition-colors">
                                                    {item.productId?.image ? (
                                                        <img src={item.productId.image} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <UtensilsCrossed size={20} className="text-gray-700" />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black text-white group-hover/item:text-primary transition-colors">{item.productId?.name}</p>
                                                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">₹{item.price} × {item.quantity}</p>
                                                </div>
                                            </div>
                                            <p className="font-black text-sm text-white">₹{item.price * item.quantity}</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-6 pt-6 border-t border-white/10">
                                    <div className="space-y-2 mb-6">
                                        <div className="flex justify-between text-[11px] font-bold text-gray-500 uppercase tracking-widest">
                                            <span>Subtotal</span>
                                            <span>₹{(selectedOrder.totalAmount - (selectedOrder.taxAmount || 0)).toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-[11px] font-bold text-accent uppercase tracking-widest">
                                            <span>Tax & Charges</span>
                                            <span>₹{(selectedOrder.taxAmount || 0).toFixed(2)}</span>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center p-4 bg-primary/10 rounded-2xl border border-primary/20">
                                        <p className="font-black uppercase text-xs tracking-[0.2em] text-primary">Final Bill</p>
                                        <p className="text-3xl font-black text-white">₹{selectedOrder.totalAmount.toFixed(2)}</p>
                                    </div>
                                    <div className="mt-4 flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-gray-600">
                                        <span>{selectedOrder.paymentMethod}</span>
                                        <span className={selectedOrder.paymentStatus === 'Paid' ? 'text-emerald-500' : 'text-amber-500'}>
                                            ● {selectedOrder.paymentStatus}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>

                    <div className="mt-10 pt-8 border-t border-white/10 flex flex-col md:flex-row gap-6">
                        <div className="flex-1 space-y-2">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Current Order Status</label>
                            <div className="flex gap-4">
                                <select
                                    className="flex-1 bg-white/5 border border-white/10 p-4 rounded-2xl outline-none focus:border-primary font-black text-sm transition-all"
                                    value={selectedOrder.orderStatus}
                                    onChange={(e) => updateStatus(selectedOrder._id, e.target.value)}
                                >
                                    <option value="Placed">Mark as Placed</option>
                                    <option value="Preparing">Mark as Preparing</option>
                                    <option value="Out for delivery">Mark as Out for delivery</option>
                                    <option value="Delivered">Mark as Delivered</option>
                                    <option value="Cancelled">Mark as Cancelled</option>
                                </select>
                                <button
                                    onClick={() => window.print()}
                                    className="px-6 bg-white/5 hover:bg-white text-white hover:text-black border border-white/10 rounded-2xl transition-all flex items-center justify-center gap-3 font-bold text-sm"
                                >
                                    <ShoppingBag size={18} /> Print
                                </button>
                            </div>
                        </div>
                        <div className="flex items-end mb-1 gap-4">
                            {selectedOrder.orderStatus === 'Placed' && (
                                <button
                                    onClick={() => updateStatus(selectedOrder._id, 'Preparing')}
                                    className="px-8 py-4 bg-emerald-500 rounded-2xl font-black shadow-2xl shadow-emerald-500/30 hover:scale-105 transition-all text-sm uppercase tracking-widest text-white flex items-center gap-2 animate-pulse"
                                >
                                    <CheckCircle size={18} /> Accept
                                </button>
                            )}
                            <button
                                onClick={() => setSelectedOrder(null)}
                                className="px-10 py-4 bg-primary rounded-2xl font-black shadow-2xl shadow-primary/30 hover:scale-105 transition-all text-sm uppercase tracking-widest"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        )}
    </AnimatePresence>
);

const MenuManagement = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: '', description: '', price: '', category: 'Pizza', image: '', isVeg: true
    });

    const fetchProducts = async () => {
        try {
            const { data } = await api.get('/products');
            setProducts(data);
        } catch (err) {
            toast.error('Failed to fetch products');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchProducts(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await api.put(`/products/${formData._id}`, formData);
                toast.success('Product updated');
            } else {
                await api.post('/products', formData);
                toast.success('Product added');
            }
            setShowForm(false);
            setFormData({ name: '', description: '', price: '', category: 'Pizza', image: '', isVeg: true });
            fetchProducts();
        } catch (err) {
            toast.error('Action failed');
        }
    };

    const deleteProduct = async (id) => {
        if (!window.confirm('Are you sure you want to delete this menu item?')) return;
        try {
            await api.delete(`/products/${id}`);
            toast.success('Deleted successfully');
            fetchProducts();
        } catch (err) {
            toast.error('Delete failed');
        }
    };

    if (loading) return <Loader />;

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Menu <span className="text-gradient">Manager</span></h2>
                <button
                    onClick={() => { setIsEditing(false); setFormData({ name: '', description: '', price: '', category: 'Pizza', image: '', isVeg: true }); setShowForm(true); }}
                    className="bg-primary hover:bg-primary-dark px-8 py-3 rounded-2xl font-bold flex items-center gap-2 transition-300 shadow-xl shadow-primary/30"
                >
                    <Plus size={20} /> Add New Dish
                </button>
            </div>

            <AnimatePresence>
                {showForm && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center px-6">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowForm(false)} />
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass w-full max-w-2xl p-10 rounded-[2.5rem] border border-white/10 relative z-10 max-h-[90vh] overflow-y-auto">
                            <div className="flex justify-between items-center mb-8">
                                <h3 className="text-2xl font-black">{isEditing ? 'Edit Dish' : 'Add New Dish'}</h3>
                                <button onClick={() => setShowForm(false)} className="p-2 hover:bg-white/10 rounded-full"><X /></button>
                            </div>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2 col-span-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase ml-2">Dish Name</label>
                                        <input type="text" className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl focus:border-primary outline-none" placeholder="e.g. Truffle Mushroom Pizza" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase ml-2">Price (₹)</label>
                                        <input type="number" className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl focus:border-primary outline-none" placeholder="499" required value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase ml-2">Category</label>
                                        <select className="w-full bg-white/10 border border-white/10 p-4 rounded-2xl focus:border-primary outline-none" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}>
                                            {['Pizza', 'Burgers', 'Pasta', 'Sushi', 'Asian', 'Sides', 'Desserts', 'Drinks'].map(c => <option key={c} value={c}>{c}</option>)}
                                        </select>
                                    </div>
                                    <div className="space-y-2 col-span-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase ml-2">Image URL</label>
                                        <input type="text" className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl focus:border-primary outline-none" placeholder="https://unsplash.com/..." required value={formData.image} onChange={e => setFormData({ ...formData, image: e.target.value })} />
                                    </div>
                                    <div className="space-y-2 col-span-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase ml-2">Description</label>
                                        <textarea className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl focus:border-primary outline-none h-32" placeholder="Tell us about the ingredients..." required value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                                    </div>
                                    <div className="flex items-center gap-4 px-4 col-span-2">
                                        <input type="checkbox" id="isVeg" className="w-5 h-5 accent-primary" checked={formData.isVeg} onChange={e => setFormData({ ...formData, isVeg: e.target.checked })} />
                                        <label htmlFor="isVeg" className="font-bold text-gray-400">This is a Vegetarian dish</label>
                                    </div>
                                </div>
                                <button type="submit" className="w-full bg-primary py-5 rounded-2xl font-black text-lg transition-all hover:bg-primary-dark shadow-2xl shadow-primary/30 mt-4">
                                    {isEditing ? 'Save Changes' : 'Create Dish'}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                {products.map(product => (
                    <motion.div layout key={product._id} className="glass p-6 rounded-3xl border border-white/10 group">
                        <div className="relative h-40 mb-6 overflow-hidden rounded-2xl">
                            <img src={product.image} className="w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 transition-all duration-500 group-hover:scale-110" />
                            <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${product.isVeg ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                                {product.isVeg ? 'VEG' : 'Non-Veg'}
                            </div>
                        </div>
                        <h4 className="font-black text-lg mb-1 truncate">{product.name}</h4>
                        <p className="text-accent font-black mb-6">₹{product.price}</p>
                        <div className="flex gap-3 pt-6 border-t border-white/5">
                            <button
                                onClick={() => { setFormData(product); setIsEditing(true); setShowForm(true); }}
                                className="flex-1 bg-blue-500/10 hover:bg-blue-500 border border-blue-500/20 hover:border-blue-500 text-blue-400 hover:text-white py-3 rounded-xl flex items-center justify-center gap-2 transition-all font-black uppercase text-[10px] tracking-widest"
                            >
                                <Edit2 size={16} /> Edit
                            </button>
                            <button
                                onClick={() => deleteProduct(product._id)}
                                className="flex-1 bg-red-500/10 hover:bg-red-500 border border-red-500/20 hover:border-red-500 text-red-500 hover:text-white py-3 rounded-xl flex items-center justify-center gap-2 transition-all font-black uppercase text-[10px] tracking-widest"
                            >
                                <Trash2 size={16} /> Delete
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [confirmDelete, setConfirmDelete] = useState({ isOpen: false, userId: null });

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/auth/admin/users');
            setUsers(data);
        } catch (err) {
            toast.error('Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchUsers(); }, []);

    const deleteUser = async (id) => {
        try {
            await api.delete(`/auth/admin/users/${id}`);
            toast.success('User account has been deleted');
            fetchUsers();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Delete operation failed');
        }
    };

    const updateRole = async (id, role) => {
        try {
            await api.put(`/auth/admin/users/${id}/role`, { role });
            toast.success(`User role updated to ${role}`);
            fetchUsers();
        } catch (err) {
            toast.error('Failed to update role');
        }
    };

    const filteredUsers = users.filter(u =>
        (u.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (u.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (u.phone || '').includes(searchTerm)
    );

    if (loading) return <Loader />;

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h2 className="text-3xl font-black">User <span className="text-gradient">Management</span></h2>
                    <p className="text-gray-400">Monitor and manage access for all registered users.</p>
                </div>
                <div className="relative w-full md:w-80 group/search">
                    <Search className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${searchTerm ? 'text-primary' : 'text-gray-500'}`} size={18} />
                    <input
                        type="text"
                        placeholder="Search users..."
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-12 focus:border-primary outline-none transition-all placeholder:text-gray-600 font-bold text-sm"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                    {searchTerm && (
                        <button onClick={() => setSearchTerm('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
                            <X size={16} />
                        </button>
                    )}
                </div>
            </div>

            <div className="glass rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left font-medium">
                        <thead className="bg-white/5 text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] border-b border-white/5">
                            <tr>
                                <th className="px-8 py-6">User Details</th>
                                <th className="px-8 py-6">Joined On</th>
                                <th className="px-8 py-6 text-right">Role & Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredUsers.map((u) => (
                                <tr key={u._id} className="group hover:bg-white/5 transition-all">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-primary border border-white/5">
                                                <UserIcon size={20} />
                                            </div>
                                            <div>
                                                <p className="font-bold text-white mb-0.5">{u.name}</p>
                                                <p className="text-xs text-gray-500">{u.email}</p>
                                                <p className="text-[10px] text-primary font-black mt-1 uppercase tracking-tighter">{u.phone}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-sm text-gray-400">
                                        {new Date(u.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex items-center justify-end gap-3">
                                            <div className="relative group/role">
                                                <select
                                                    className={`appearance-none bg-white/5 border border-white/10 rounded-xl pl-4 pr-10 py-2.5 text-[10px] font-black uppercase tracking-[0.1em] outline-none focus:border-primary transition-all cursor-pointer [color-scheme:dark] ${u.role === 'admin' ? 'text-accent border-accent/30 bg-accent/5' : 'text-gray-400'}`}
                                                    value={u.role}
                                                    onChange={(e) => updateRole(u._id, e.target.value)}
                                                >
                                                    <option value="user" className="bg-[#1A1A1A]">User</option>
                                                    <option value="admin" className="bg-[#1A1A1A]">Admin</option>
                                                </select>
                                                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none group-focus-within/role:text-primary transition-colors">
                                                    <Users size={12} />
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => setConfirmDelete({ isOpen: true, userId: u._id })}
                                                className="p-2.5 bg-red-500/10 hover:bg-red-500 border border-red-500/20 hover:border-red-500 text-red-500 hover:text-white rounded-xl transition-all transform hover:scale-105 shadow-xl shadow-red-500/5 hover:shadow-red-500/20"
                                                title="Delete User Account"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {filteredUsers.length === 0 && (
                    <EmptyState message={searchTerm ? `No users found matching "${searchTerm}"` : "No registered users found."} icon={Users} />
                )}
            </div>

            <ConfirmationModal
                isOpen={confirmDelete.isOpen}
                onClose={() => setConfirmDelete({ isOpen: false, userId: null })}
                onConfirm={() => deleteUser(confirmDelete.userId)}
                title="Delete User Account?"
                message="This will permanently delete the user's account and all associated data. This action cannot be reversed."
                type="danger"
            />
        </div>
    );
};


const AdminSettings = () => {
    const { user, fetchProfile } = useContext(AuthContext);
    const [editForm, setEditForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        if (user) {
            setEditForm(prev => ({ ...prev, name: user.name, email: user.email, phone: user.phone }));
        }
    }, [user]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        if (editForm.password && editForm.password !== editForm.confirmPassword) {
            return toast.error('Passwords do not match');
        }

        setIsProcessing(true);
        try {
            const updateData = {
                name: editForm.name,
                email: editForm.email,
                phone: editForm.phone
            };
            if (editForm.password) updateData.password = editForm.password;

            await api.put('/auth/profile', updateData);
            await fetchProfile();
            toast.success('Admin profile updated successfully');
            setEditForm(prev => ({ ...prev, password: '', confirmPassword: '' }));
        } catch (err) {
            toast.error(err.response?.data?.message || 'Update failed');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="max-w-4xl space-y-12">
            <div className="flex flex-col gap-4">
                <h2 className="text-3xl font-black">Admin <span className="text-gradient">Settings</span></h2>
                <p className="text-gray-400">Update your administrative credentials and security preferences.</p>
            </div>

            <div className="glass p-10 rounded-[2.5rem] border border-white/10 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                    <ShieldCheck size={120} />
                </div>

                <form onSubmit={handleUpdate} className="space-y-8 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-2">Full Name</label>
                            <input
                                type="text"
                                className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl focus:border-primary outline-none transition-all"
                                value={editForm.name}
                                onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-2">Email Address</label>
                            <input
                                type="email"
                                className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl focus:border-primary outline-none transition-all"
                                value={editForm.email}
                                onChange={e => setEditForm({ ...editForm, email: e.target.value })}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-2">Phone Number</label>
                            <input
                                type="tel"
                                className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl focus:border-primary outline-none transition-all"
                                value={editForm.phone}
                                onChange={e => setEditForm({ ...editForm, phone: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div className="border-t border-white/5 pt-8">
                        <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                            <Clock size={20} className="text-primary" />
                            Security (Leave blank to keep current password)
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-2">New Password</label>
                                <input
                                    type="password"
                                    className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl focus:border-primary outline-none transition-all"
                                    placeholder="••••••••"
                                    value={editForm.password}
                                    onChange={e => setEditForm({ ...editForm, password: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-2">Confirm New Password</label>
                                <input
                                    type="password"
                                    className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl focus:border-primary outline-none transition-all"
                                    placeholder="••••••••"
                                    value={editForm.confirmPassword}
                                    onChange={e => setEditForm({ ...editForm, confirmPassword: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isProcessing}
                        className="w-full bg-primary hover:bg-primary-dark py-5 rounded-2xl font-black text-lg transition-all shadow-xl shadow-primary/30 flex items-center justify-center gap-3 disabled:opacity-50"
                    >
                        {isProcessing ? 'Updating...' : 'Save Admin Changes'}
                    </button>
                </form>
            </div>
        </div>
    );
};

const RevenueAnalytics = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [dateRange, setDateRange] = useState({
        start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        end: new Date().toISOString().split('T')[0]
    });
    const [viewMode, setViewMode] = useState('daily'); // daily, monthly, yearly

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const { data } = await api.get('/orders/admin');
                const successfulOrders = data.filter(o => o.paymentStatus === 'Paid' || o.orderStatus === 'Delivered');
                setOrders(successfulOrders);
            } catch (err) {
                toast.error('Failed to fetch revenue data');
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const filteredOrders = orders.filter(o => {
        const orderDate = o.createdAt.split('T')[0];
        return orderDate >= dateRange.start && orderDate <= dateRange.end;
    });

    const stats = {
        totalRevenue: filteredOrders.reduce((acc, o) => acc + o.totalAmount, 0),
        totalOrders: filteredOrders.length,
        avgOrderValue: filteredOrders.length > 0
            ? filteredOrders.reduce((acc, o) => acc + o.totalAmount, 0) / filteredOrders.length
            : 0
    };

    const chartData = useMemo(() => {
        const groups = {};
        filteredOrders.forEach(o => {
            let key;
            const d = new Date(o.createdAt);
            if (viewMode === 'daily') {
                key = o.createdAt.split('T')[0];
            } else if (viewMode === 'monthly') {
                key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
            } else {
                key = `${d.getFullYear()}`;
            }
            groups[key] = (groups[key] || 0) + o.totalAmount;
        });

        const sortedKeys = Object.keys(groups).sort();
        const maxVal = Math.max(...Object.values(groups), 1);

        return sortedKeys.map(key => ({
            label: key,
            amount: groups[key],
            height: (groups[key] / maxVal) * 100
        }));
    }, [filteredOrders, viewMode]);

    if (loading) return <Loader />;

    return (
        <div className="space-y-12">
            <div className="glass p-8 rounded-3xl border border-white/10 flex flex-wrap gap-6 items-end justify-between">
                <div className="flex flex-wrap gap-6 items-end">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Start Date</label>
                        <input
                            type="date"
                            className="bg-white/5 border border-white/10 p-4 rounded-2xl outline-none focus:border-primary font-bold text-sm text-white transition-all block"
                            value={dateRange.start}
                            onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">End Date</label>
                        <input
                            type="date"
                            className="bg-white/5 border border-white/10 p-4 rounded-2xl outline-none focus:border-primary font-bold text-sm text-white transition-all block"
                            value={dateRange.end}
                            onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                        />
                    </div>
                    <div className="flex bg-white/5 p-1 rounded-xl border border-white/10 h-[58px]">
                        {['daily', 'monthly', 'yearly'].map(mode => (
                            <button
                                key={mode}
                                onClick={() => setViewMode(mode)}
                                className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === mode ? 'bg-primary text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
                            >
                                {mode}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Period Revenue', value: `₹${stats.totalRevenue.toLocaleString()}`, icon: <IndianRupee />, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
                    { label: 'Period Orders', value: stats.totalOrders, icon: <Package />, color: 'text-primary', bg: 'bg-primary/10' },
                    { label: 'Avg. Order Value', value: `₹${stats.avgOrderValue.toFixed(2)}`, icon: <TrendingUp />, color: 'text-accent', bg: 'bg-accent/10' }
                ].map((s, i) => (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} key={i} className="glass p-8 rounded-3xl border border-white/10">
                        <div className={`p-4 rounded-2xl w-fit mb-6 ${s.bg} ${s.color}`}>{s.icon}</div>
                        <p className="text-gray-400 font-medium mb-1">{s.label}</p>
                        <h3 className="text-3xl font-black">{s.value}</h3>
                    </motion.div>
                ))}
            </div>

            <div className="glass p-10 rounded-[2.5rem] border border-white/10">
                <h3 className="text-xl font-black mb-12 flex items-center gap-3">
                    <TrendingUp className="text-primary" />
                    Revenue Breakdown ({viewMode})
                </h3>
                <div className="h-80 flex items-end justify-between gap-2 px-4 relative">
                    {chartData.length > 0 ? chartData.map((d, i) => (
                        <div key={i} className="flex-1 bg-white/5 rounded-t-xl group relative cursor-pointer min-w-[20px]">
                            <motion.div
                                initial={{ height: 0 }}
                                animate={{ height: `${d.height}%` }}
                                className="bg-primary/40 group-hover:bg-primary transition-all rounded-t-lg"
                            />
                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white text-black text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 shadow-xl font-black">
                                ₹{d.amount.toLocaleString()}
                            </div>
                            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[10px] text-gray-500 font-black uppercase tracking-tighter whitespace-nowrap rotate-45 origin-left">
                                {d.label}
                            </div>
                        </div>
                    )) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-500 font-bold italic">No data for selected period</div>
                    )}
                </div>
                <div className="h-12" />
            </div>

            <div className="glass rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl">
                <div className="px-8 py-6 border-b border-white/5 bg-white/5">
                    <h4 className="text-xs font-black text-primary uppercase tracking-[0.2em]">Detailed Record</h4>
                </div>
                <div className="overflow-x-auto max-h-[500px] custom-scrollbar">
                    <table className="w-full text-left">
                        <thead className="bg-white/5 text-gray-400 text-[10px] font-black uppercase tracking-widest sticky top-0 z-10">
                            <tr>
                                <th className="px-8 py-4">Period</th>
                                <th className="px-8 py-4 text-right">Revenue</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {[...chartData].reverse().map((d, i) => (
                                <tr key={i} className="hover:bg-white/5 transition-colors">
                                    <td className="px-8 py-4 font-bold text-gray-300">{d.label}</td>
                                    <td className="px-8 py-4 text-right font-black text-white">₹{d.amount.toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
const AdminDashboard = () => {
    const location = useLocation();
    const currentPath = location.pathname;
    const [showNotifications, setShowNotifications] = useState(false);
    const [orders, setOrders] = useState([]);
    const prevOrderCountRef = useRef(0);

    const fetchAllOrders = useCallback(async () => {
        try {
            const { data } = await api.get('/orders/admin');
            const newPlacedOrders = data.filter(o => o.orderStatus === 'Placed');

            // Trigger toast if new orders arrived
            const currentPlacedCount = newPlacedOrders.length;
            if (prevOrderCountRef.current > 0 && currentPlacedCount > prevOrderCountRef.current) {
                const latest = newPlacedOrders[0];
                toast.custom((t) => (
                    <motion.div
                        initial={{ opacity: 0, x: 50, scale: 0.9 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        className={`${t.visible ? 'block' : 'hidden'} max-w-md w-full glass shadow-2xl rounded-[2.5rem] pointer-events-auto flex ring-1 ring-primary/20 p-6 border border-primary/30 z-[999]`}
                    >
                        <div className="flex-1 w-0">
                            <div className="flex items-start">
                                <div className="flex-shrink-0 pt-0.5">
                                    <div className="h-12 w-12 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center text-primary animate-pulse">
                                        <Bell size={24} />
                                    </div>
                                </div>
                                <div className="ml-5 flex-1 text-left">
                                    <p className="text-xs font-black text-primary uppercase tracking-[0.2em]">New Order Received!</p>
                                    <p className="mt-1 text-sm font-black text-white">
                                        Order from {latest.userId?.name || 'Guest'}
                                    </p>
                                    <p className="mt-1 text-xs text-gray-400 font-bold">
                                        Total: ₹{latest.totalAmount} • {latest.items.length} items
                                    </p>
                                    <Link to="/admin/orders" onClick={() => toast.dismiss(t.id)} className="inline-block mt-3 text-[10px] font-black text-primary uppercase tracking-widest hover:underline">View Queue →</Link>
                                </div>
                            </div>
                        </div>
                        <div className="ml-4 flex-shrink-0 flex">
                            <button
                                onClick={() => toast.dismiss(t.id)}
                                className="w-full border border-transparent rounded-none rounded-r-lg p-2 flex items-center justify-center text-sm font-medium text-gray-500 hover:text-white"
                            >
                                <X size={20} />
                            </button>
                        </div>
                    </motion.div>
                ), { duration: 6000, position: 'bottom-right' });
            }

            setOrders(data);
            prevOrderCountRef.current = currentPlacedCount;
        } catch (err) {
            console.error('Notification fetch failed', err);
        }
    }, []);

    useEffect(() => {
        fetchAllOrders();
        const interval = setInterval(fetchAllOrders, 15000); // Check every 15s
        return () => clearInterval(interval);
    }, [fetchAllOrders]);

    const menuItems = [
        { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/admin' },
        { icon: <TrendingUp size={20} />, label: 'Revenue', path: '/admin/revenue' },
        { icon: <ShoppingBag size={20} />, label: 'Orders', path: '/admin/orders' },
        { icon: <UtensilsCrossed size={20} />, label: 'Menu', path: '/admin/menu' },
        { icon: <Users size={20} />, label: 'Users', path: '/admin/users' },
        { icon: <Settings size={20} />, label: 'Settings', path: '/admin/settings' },
    ];

    const pendingOrdersCount = orders.filter(o => o.orderStatus === 'Placed').length;
    const preparingOrdersCount = orders.filter(o => o.orderStatus === 'Preparing').length;
    const latestPendingOrders = orders.filter(o => o.orderStatus === 'Placed').slice(0, 5);

    return (
        <div className="flex h-screen bg-[#0A0A0A] overflow-hidden" onClick={() => setShowNotifications(false)}>
            {/* Sidebar */}
            <div className="w-80 h-full border-r border-white/5 flex flex-col p-8 shrink-0 bg-[#0F0F0F] relative z-[100]">
                <Link to="/" className="mb-12 block group">
                    <h2 className="text-primary font-black text-3xl mb-1 group-hover:scale-105 transition-transform origin-left tracking-tighter">Crave <span className="text-white">Admin</span></h2>
                    <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.3em] ml-1">Control Center 2.0</p>
                </Link>

                <div className="flex-1 space-y-2 overflow-y-auto pr-2 custom-scrollbar">
                    {menuItems.map((item) => (
                        <Link
                            key={item.label}
                            to={item.path}
                            className={`flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all duration-300 ${currentPath === item.path
                                || (item.path !== '/admin' && currentPath.startsWith(item.path))
                                ? 'bg-primary text-white shadow-2xl shadow-primary/30'
                                : 'text-gray-500 hover:bg-white/5 hover:text-white'
                                }`}
                        >
                            <span className={currentPath === item.path || (item.path !== '/admin' && currentPath.startsWith(item.path)) ? 'text-white' : 'text-primary'}>
                                {item.icon}
                            </span>
                            {item.label}
                        </Link>
                    ))}
                </div>

                {/* Kitchen Status Monitor */}
                <div className="mt-8">
                    <div className="p-[1px] rounded-[2rem] bg-gradient-to-br from-white/10 to-transparent border border-white/5 overflow-hidden">
                        <div className="p-6 bg-[#121212] rounded-[1.9rem]">
                            <div className="flex items-center gap-3 mb-6">
                                <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${pendingOrdersCount > 0 ? 'bg-primary/20 text-primary animate-pulse' : 'bg-white/5 text-gray-500'}`}>
                                    <Clock size={16} />
                                </div>
                                <h4 className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Kitchen Monitor</h4>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className={`p-4 rounded-2xl border transition-all duration-500 ${pendingOrdersCount > 0 ? 'bg-primary/10 border-primary/20 shadow-[0_0_20px_rgba(var(--primary-rgb),0.1)]' : 'bg-white/5 border-white/5'}`}>
                                    <p className={`text-[9px] font-black uppercase mb-1 tracking-widest ${pendingOrdersCount > 0 ? 'text-primary' : 'text-gray-500'}`}>New</p>
                                    <p className="text-xl font-black text-white">{pendingOrdersCount}</p>
                                </div>
                                <div className={`p-4 rounded-2xl border transition-all duration-500 ${preparingOrdersCount > 0 ? 'bg-amber-500/10 border-amber-500/20 shadow-[0_0_20px_rgba(245,158,11,0.1)]' : 'bg-white/5 border-white/5'}`}>
                                    <p className={`text-[9px] font-black uppercase mb-1 tracking-widest ${preparingOrdersCount > 0 ? 'text-amber-500' : 'text-gray-500'}`}>Cooking</p>
                                    <p className="text-xl font-black text-white">{preparingOrdersCount}</p>
                                </div>
                            </div>

                            {(pendingOrdersCount > 0 || preparingOrdersCount > 0) && (
                                <Link
                                    to="/admin/orders"
                                    className="mt-4 w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl flex items-center justify-center gap-2 text-[9px] font-black text-gray-400 hover:text-white transition-all group"
                                >
                                    MANAGE QUEUE <ChevronRight size={12} className="group-hover:translate-x-1 transition-transform" />
                                </Link>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mt-8 pt-8 border-t border-white/5">
                    <button
                        onClick={() => {
                            localStorage.removeItem('userInfo');
                            window.location.href = '/login';
                        }}
                        className="w-full flex items-center justify-between px-6 py-4 rounded-2xl bg-white/5 hover:bg-red-500/10 hover:text-red-500 text-gray-400 font-bold transition-all group"
                    >
                        <span className="flex items-center gap-3">
                            <LogOut size={18} /> Logout
                        </span>
                        <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 h-full overflow-y-auto bg-[#0A0A0A] custom-scrollbar relative flex flex-col">
                <div className="p-12 flex-1 relative">
                    <div className="max-w-[1400px] mx-auto">
                        <div className="mb-12 flex justify-between items-center">
                            <div>
                                <p className="text-primary font-black uppercase tracking-[0.2em] text-[10px] mb-2">Systems Overview</p>
                                <h1 className="text-4xl font-black text-white">
                                    {menuItems.find(item => currentPath === item.path || (item.path !== '/admin' && currentPath.startsWith(item.path)))?.label || 'Dashboard'}
                                </h1>
                            </div>
                            <div className="flex items-center gap-8">
                                {/* Notification Toggle */}
                                <div className="relative" onClick={(e) => e.stopPropagation()}>
                                    <button
                                        onClick={() => setShowNotifications(!showNotifications)}
                                        className={`p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/50 transition-all relative group ${showNotifications ? 'border-primary bg-primary/5' : ''}`}
                                    >
                                        <Bell size={24} className={pendingOrdersCount > 0 ? 'text-primary animate-pulse' : 'text-gray-500 group-hover:text-white'} />
                                        {pendingOrdersCount > 0 && (
                                            <span className="absolute -top-1 -right-1 w-6 h-6 bg-primary text-white text-[10px] font-black rounded-full flex items-center justify-center border-4 border-[#0A0A0A] shadow-lg">
                                                {pendingOrdersCount}
                                            </span>
                                        )}
                                    </button>

                                    {/* Notification Dropdown */}
                                    <AnimatePresence>
                                        {showNotifications && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                className="absolute right-0 mt-4 w-[400px] glass border border-white/10 shadow-2xl rounded-[2.5rem] p-8 z-[500]"
                                            >
                                                <div className="flex items-center justify-between mb-8">
                                                    <h4 className="text-xl font-black">Notifications</h4>
                                                    <span className="text-[10px] font-black text-primary bg-primary/10 px-3 py-1 rounded-full uppercase tracking-widest">{pendingOrdersCount} New</span>
                                                </div>
                                                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                                    {latestPendingOrders.length > 0 ? latestPendingOrders.map((order) => (
                                                        <Link
                                                            key={order._id}
                                                            to="/admin/orders"
                                                            onClick={() => setShowNotifications(false)}
                                                            className="flex items-start gap-4 p-4 hover:bg-white/5 rounded-2xl border border-transparent hover:border-white/10 transition-all group"
                                                        >
                                                            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                                                <ShoppingBag size={20} />
                                                            </div>
                                                            <div className="flex-1 text-left">
                                                                <p className="text-sm font-bold text-white mb-0.5">New Order #{order._id.slice(-6)}</p>
                                                                <p className="text-xs text-gray-400">From {order.userId?.name || 'Guest'} • ₹{order.totalAmount}</p>
                                                                <p className="text-[10px] text-primary font-black mt-2 uppercase tracking-widest">Awaiting Acceptance</p>
                                                            </div>
                                                        </Link>
                                                    )) : (
                                                        <div className="text-center py-10">
                                                            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-700">
                                                                <Bell size={32} />
                                                            </div>
                                                            <p className="text-gray-500 font-bold uppercase text-xs tracking-widest">No New Notifications</p>
                                                        </div>
                                                    )}
                                                </div>
                                                {pendingOrdersCount > 0 && (
                                                    <Link
                                                        to="/admin/orders"
                                                        onClick={() => setShowNotifications(false)}
                                                        className="block text-center mt-8 text-[10px] font-black text-primary uppercase tracking-[0.3em] hover:text-white transition-colors"
                                                    >
                                                        View All Orders
                                                    </Link>
                                                )}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                <div className="flex items-center gap-6">
                                    <div className="text-right">
                                        <p className="text-xs text-gray-500 font-bold">Logged in as</p>
                                        <p className="text-sm font-black text-white">Administrator</p>
                                    </div>
                                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-accent p-[1px]">
                                        <div className="w-full h-full rounded-2xl bg-[#0A0A0A] flex items-center justify-center text-white">
                                            <UserIcon size={20} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Routes>
                            <Route index element={<DashboardStats />} />
                            <Route path="revenue" element={<RevenueAnalytics />} />
                            <Route path="orders" element={<OrderManagement />} />
                            <Route path="menu" element={<MenuManagement />} />
                            <Route path="users" element={<UserManagement />} />
                            <Route path="settings" element={<AdminSettings />} />
                        </Routes>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, type = 'danger' }) => (
    <AnimatePresence>
        {isOpen && (
            <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 z-[300] flex items-center justify-center px-6 bg-black/80 backdrop-blur-sm"
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                    className="glass max-w-md w-full p-10 rounded-[2.5rem] border-white/10 shadow-2xl relative overflow-hidden text-center"
                >
                    <div className={`w-20 h-20 rounded-3xl mx-auto mb-8 flex items-center justify-center ${type === 'danger' ? 'bg-red-500/20 text-red-500' : 'bg-primary/20 text-primary'}`}>
                        {type === 'danger' ? <Trash2 size={40} /> : <AlertCircle size={40} />}
                    </div>
                    <h3 className="text-2xl font-black mb-4 text-white">{title}</h3>
                    <p className="text-gray-400 mb-10 leading-relaxed font-medium">{message}</p>
                    <div className="flex gap-4">
                        <button onClick={onClose} className="flex-1 px-8 py-4 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-black transition-all">Cancel</button>
                        <button onClick={() => { onConfirm(); onClose(); }} className={`flex-1 px-8 py-4 rounded-2xl font-black transition-all shadow-xl ${type === 'danger' ? 'bg-red-500 hover:bg-red-600 shadow-red-500/20' : 'bg-primary hover:bg-primary-dark shadow-primary/20'}`}>Confirm</button>
                    </div>
                </motion.div>
            </motion.div>
        )}
    </AnimatePresence>
);

const EmptyState = ({ message, icon: Icon = Package }) => (
    <div className="py-20 flex flex-col items-center text-center">
        <div className="w-24 h-24 bg-white/5 rounded-[2rem] flex items-center justify-center text-gray-700 mb-8 border border-white/5">
            <Icon size={48} />
        </div>
        <p className="text-xl font-bold text-gray-500 max-w-xs">{message}</p>
    </div>
);

// Mock icons missed in imports
const ShieldCheck = ({ size, className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" /><path d="m9 12 2 2 4-4" />
    </svg>
);

const AlertCircle = ({ size, className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
);

export default AdminDashboard;
