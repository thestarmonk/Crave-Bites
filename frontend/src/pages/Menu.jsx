import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import ProductCard from '../components/ProductCard';
import { CardSkeleton } from '../components/Skeleton';
import { Search, Filter, ShoppingBag, X } from 'lucide-react';

const Menu = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');

    const categories = ['All', 'Pizza', 'Burgers', 'Pasta', 'Sushi', 'Drinks', 'Desserts'];

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const { data } = await api.get('/products');
                setProducts(data);
            } catch (error) {
                console.error("Error fetching products", error);
            } finally {
                // Artificial delay for smooth loading experience
                setTimeout(() => setLoading(false), 800);
            }
        };
        fetchProducts();
    }, []);

    const filteredProducts = products.filter(p =>
        (filter === 'All' || p.category === filter) &&
        (p.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="pt-32 pb-40 px-6 max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-12 gap-8">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    <h1 className="text-5xl font-extrabold mb-4">Explore Our <span className="text-gradient">Menu</span></h1>
                    <p className="text-gray-400 text-lg">Indulge in our curated selection of gourmet dishes.</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto"
                >
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary transition-300" size={18} />
                        <input
                            type="text"
                            placeholder="Search for happiness..."
                            className="bg-[#0D0D12] border border-white/10 rounded-2xl py-3.5 pl-12 pr-10 focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-500 w-full sm:w-80 text-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm('')}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-300"
                            >
                                <X size={16} />
                            </button>
                        )}
                    </div>
                </motion.div>
            </div>

            {/* Categories */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex items-center gap-4 mb-10 overflow-hidden"
            >
                <div className="flex items-center gap-2 text-gray-500 mr-2">
                    <Filter size={16} />
                    <span className="text-sm font-bold uppercase tracking-wider">Filters:</span>
                </div>
                <div className="flex overflow-x-auto pb-2 no-scrollbar gap-3 flex-1">
                    {categories.map((cat, idx) => (
                        <button
                            key={cat}
                            onClick={() => setFilter(cat)}
                            className={`px-6 py-2.5 rounded-2xl font-semibold whitespace-nowrap transition-500 border-2 ${filter === cat
                                ? 'bg-[#1A1A24] border-primary text-primary shadow-lg shadow-primary/10'
                                : 'bg-[#0D0D12] border-transparent text-gray-400 hover:bg-[#1A1A24] hover:text-white'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </motion.div>

            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {[...Array(8)].map((_, i) => (
                        <CardSkeleton key={i} />
                    ))}
                </div>
            ) : (
                <motion.div
                    layout
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
                >
                    <AnimatePresence mode="popLayout">
                        {filteredProducts.map(product => (
                            <motion.div
                                layout
                                key={product._id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.3 }}
                            >
                                <ProductCard product={product} />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
            )}

            {!loading && filteredProducts.length === 0 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-32 glass rounded-[3rem] border border-dashed border-white/10 bg-[#0D0D12]"
                >
                    <div className="bg-[#1A1A24] w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <ShoppingBag className="text-gray-600" size={32} />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">No results found</h3>
                    <p className="text-gray-400 mb-8 max-w-xs mx-auto">We couldn't find any dishes matching your current filters or search.</p>
                    <button
                        onClick={() => { setSearchTerm(''); setFilter('All'); }}
                        className="bg-[#1A1A24] hover:bg-[#262626] px-8 py-3 rounded-2xl font-bold transition-300 text-sm"
                    >
                        Reset Filters
                    </button>
                </motion.div>
            )}
        </div>
    );
};

export default Menu;
