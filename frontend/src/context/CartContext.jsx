import { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
        try {
            const savedCart = localStorage.getItem('cartItems');
            const parsed = savedCart ? JSON.parse(savedCart) : [];
            return Array.isArray(parsed) ? parsed.filter(item => item && item._id) : [];
        } catch (e) {
            console.error("Cart corruption fixed");
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (product) => {
        setCartItems(prev => {
            const exists = prev.find(item => item._id === product._id);
            if (exists) {
                return prev.map(item =>
                    item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prev, { ...product, quantity: 1 }];
        });
    };

    const removeFromCart = (productId) => {
        setCartItems(prev => prev.filter(item => item._id !== productId));
    };

    const updateQuantity = (productId, quantity) => {
        if (quantity < 1) return;
        setCartItems(prev =>
            prev.map(item => item._id === productId ? { ...item, quantity } : item)
        );
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const tax = subtotal * 0.05; // 5% GST
    const deliveryCharges = subtotal > 500 ? 0 : 40;
    const total = subtotal + tax + deliveryCharges;

    return (
        <CartContext.Provider value={{
            cartItems, addToCart, removeFromCart, updateQuantity, clearCart,
            subtotal, tax, deliveryCharges, total
        }}>
            {children}
        </CartContext.Provider>
    );
};
