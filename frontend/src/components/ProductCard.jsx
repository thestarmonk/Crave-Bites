import { motion } from 'framer-motion';
import { Plus, Minus, Leaf, Star, ArrowRight } from 'lucide-react';
import { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import toast from 'react-hot-toast';

const ProductCard = ({ product }) => {
    const { cartItems, addToCart, updateQuantity, removeFromCart } = useContext(CartContext);
    const cartItem = cartItems.find(item => item._id === product._id);

    const handleAddToCart = () => {
        addToCart(product);
        toast.success(`${product.name} added to cart!`, {
            icon: '🛒',
        });
    };

    const handleIncrement = () => {
        updateQuantity(product._id, cartItem.quantity + 1);
    };

    const handleDecrement = () => {
        if (cartItem.quantity > 1) {
            updateQuantity(product._id, cartItem.quantity - 1);
        } else {
            removeFromCart(product._id);
            toast.success(`${product.name} removed from cart`);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            whileHover={{ y: -8 }}
            className="glass-no-hover overflow-hidden rounded-[2.5rem] group border border-white/5 hover:border-primary/20 hover:shadow-[0_20px_50px_rgba(99,102,241,0.15)] transition-500 bg-[#0D0D12]"
        >
            <div className="relative h-56 overflow-hidden">
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-all duration-1000 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-500"></div>

                <div className="absolute top-4 left-4 flex items-center gap-2">
                    <div className="bg-black px-3 py-1.5 rounded-full flex items-center border border-white/10">
                        <Leaf size={12} className={product.isVeg ? 'text-green-400' : 'text-red-400'} fill="currentColor" />
                        <span className="text-[10px] font-black uppercase tracking-widest ml-1.5 text-white">
                            {product.isVeg ? 'Vegetarian' : 'Non-Veg'}
                        </span>
                    </div>
                </div>

                <div className="absolute bottom-4 left-4 right-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-1">Authentic Taste</p>
                    <h4 className="text-white font-black text-xl leading-tight">{product.name}</h4>
                </div>
            </div>

            <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-1.5 bg-[#1F1F00] px-2 py-1 rounded-lg">
                        <Star size={12} className="text-yellow-400" fill="currentColor" />
                        <span className="text-xs font-black text-yellow-400">4.9</span>
                    </div>
                    <span className="text-2xl font-black text-white">₹{product.price}</span>
                </div>

                <h3 className="font-extrabold text-white text-lg mb-2 group-hover:text-primary transition-500">{product.name}</h3>
                <p className="text-gray-500 text-sm mb-6 line-clamp-2 font-medium leading-relaxed">{product.description}</p>

                {cartItem ? (
                    <div className="flex items-center justify-between w-full glass-no-hover py-4 px-6 rounded-2xl border border-white/10">
                        <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={handleDecrement}
                            className="text-emerald-500 hover:text-emerald-400 transition-colors p-1"
                        >
                            <Minus size={24} />
                        </motion.button>

                        <span className="text-xl font-black text-emerald-500 min-w-[1.5rem] text-center">
                            {cartItem.quantity}
                        </span>

                        <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={handleIncrement}
                            className="text-emerald-500 hover:text-emerald-400 transition-colors p-1"
                        >
                            <Plus size={24} />
                        </motion.button>
                    </div>
                ) : (
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={handleAddToCart}
                        className="w-full btn-theme py-4 rounded-2xl font-black flex items-center justify-center gap-3 transition-500 group/btn"
                    >
                        <div className="relative w-5 h-5 overflow-hidden">
                            <Plus size={20} className="absolute inset-0 group-hover/btn:-translate-y-full transition-all duration-500" />
                            <ArrowRight size={20} className="absolute inset-0 translate-y-full group-hover/btn:translate-y-0 transition-all duration-500" />
                        </div>
                        <span className="text-sm uppercase tracking-widest">Add To Basket</span>
                    </motion.button>
                )}
            </div>
        </motion.div>
    );
};

export default ProductCard;
