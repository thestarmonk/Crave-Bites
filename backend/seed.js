require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');
const Coupon = require('./models/Coupon');
const User = require('./models/User');

const products = [
    // PIZZAS
    { name: "Margherita Pizza", description: "Classic tomato sauce, mozzarella, and fresh basil on a thin crust.", price: 299, category: "Pizza", image: "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=800", isAvailable: true, isVeg: true },
    { name: "Double Cheese Margherita", description: "Classic Margherita with extra loads of mozzarella cheese.", price: 399, category: "Pizza", image: "https://images.unsplash.com/photo-1574071318508-1cdbad80ad38?w=800", isAvailable: true, isVeg: true },
    { name: "Peppy Paneer", description: "Flavorful paneer, capsicum, and red paprika for a mild spicy kick.", price: 449, category: "Pizza", image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800", isAvailable: true, isVeg: true },
    { name: "Veggie Paradise", description: "Gold corn, black olives, capsicum, and red paprika.", price: 429, category: "Pizza", image: "https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=800", isAvailable: true, isVeg: true },
    { name: "Pepper BBQ Chicken", description: "Pepper barbecue chicken for that smoky flavor.", price: 499, category: "Pizza", image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800", isAvailable: true, isVeg: false },
    { name: "Chicken Dominator", description: "Loaded with double pepper barbecue chicken, peri-peri chicken, and chicken sausage.", price: 599, category: "Pizza", image: "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=800", isAvailable: true, isVeg: false },
    { name: "Indi Tandoori Paneer", description: "Tandoori paneer with capsicum, red paprika and mint mayo.", price: 489, category: "Pizza", image: "https://images.unsplash.com/photo-1594007654729-407eedc4be65?w=800", isAvailable: true, isVeg: true },
    { name: "Farmhouse Pizza", description: "Delightful combination of onion, capsicum, tomato & grilled mushroom.", price: 459, category: "Pizza", image: "https://images.unsplash.com/photo-1576458088443-04a19bb13da6?w=800", isAvailable: true, isVeg: true },

    // BURGERS
    { name: "Classic Veg Burger", description: "Crispy veg patty with lettuce, onion, and mayonnaise.", price: 129, category: "Burgers", image: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=800", isAvailable: true, isVeg: true },
    { name: "Spicy Paneer Burger", description: "Deep-fried spicy paneer patty with peri-peri sauce.", price: 189, category: "Burgers", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800", isAvailable: true, isVeg: true },
    { name: "Maharaja Mac Veg", description: "Double decker burger with double patties and extra veggies.", price: 249, category: "Burgers", image: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=800", isAvailable: true, isVeg: true },
    { name: "Chicken Crisp Burger", description: "Crunchy chicken patty with thousand island dressing.", price: 169, category: "Burgers", image: "https://images.unsplash.com/photo-1610444583731-9020498b8493?w=800", isAvailable: true, isVeg: false },
    { name: "Bacon Beef Burger", description: "Juicy beef patty with crispy bacon and melted cheddar.", price: 349, category: "Burgers", image: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=800", isAvailable: true, isVeg: false },
    { name: "Grilled Mushroom Burger", description: "Savory grilled mushrooms with swiss cheese.", price: 219, category: "Burgers", image: "https://images.unsplash.com/photo-1520072959219-c595dc870360?w=800", isAvailable: true, isVeg: true },
    { name: "Cheeseburger Deluxe", description: "The classic cheeseburger with extra pickles and onions.", price: 149, category: "Burgers", image: "https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=800", isAvailable: true, isVeg: false },

    // PASTA
    { name: "White Sauce Pasta", description: "Penne tossed in creamy alfredo sauce with garlic and herbs.", price: 249, category: "Pasta", image: "https://images.unsplash.com/photo-1645112481338-3560e99b3224?w=800", isAvailable: true, isVeg: true },
    { name: "Pink Sauce Pasta", description: "Combination of red and white sauce for a tangy creamy flavor.", price: 269, category: "Pasta", image: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=800", isAvailable: true, isVeg: true },
    { name: "Arrabbiata Pasta", description: "Spicy tomato sauce with chili flakes and garlic.", price: 229, category: "Pasta", image: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=800", isAvailable: true, isVeg: true },
    { name: "Chicken Alfredo", description: "Creamy white sauce pasta with grilled chicken chunks.", price: 329, category: "Pasta", image: "https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=800", isAvailable: true, isVeg: false },
    { name: "Lasagna Bolognese", description: "Layered pasta with minced meat, cheese, and bechamel sauce.", price: 449, category: "Pasta", image: "https://images.unsplash.com/photo-1629115916087-7e8c114a24ed?w=800", isAvailable: true, isVeg: false },
    { name: "Pesto Pasta", description: "Pasta tossed in fresh basil pesto with pine nuts.", price: 349, category: "Pasta", image: "https://images.unsplash.com/photo-1473093226795-af9932fe5856?w=800", isAvailable: true, isVeg: true },

    // SUSHI & ASIAN
    { name: "California Roll", description: "Crab sticks, avocado, and cucumber rolled in seaweed.", price: 399, category: "Sushi", image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800", isAvailable: true, isVeg: false },
    { name: "Veggie Maki", description: "Fresh cucumber, carrot, and pickled radish sushi.", price: 299, category: "Sushi", image: "https://images.unsplash.com/photo-1553621042-f6e147245754?w=800", isAvailable: true, isVeg: true },
    { name: "Salmon Nigiri", description: "Fresh slices of salmon over seasoned rice.", price: 499, category: "Sushi", image: "https://images.unsplash.com/photo-1583623025817-d180a2221d0a?w=800", isAvailable: true, isVeg: false },
    { name: "Dragon Roll", description: "Tempura shrimp with avocado and unagi sauce.", price: 549, category: "Sushi", image: "https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=800", isAvailable: true, isVeg: false },
    { name: "Paneer Tikka Roll", description: "Spicy paneer tikka with onions and mint sauce.", price: 149, category: "Asian", image: "https://images.unsplash.com/photo-1626777553733-41f87910549c?w=800", isAvailable: true, isVeg: true },
    { name: "Chicken Hakka Noodles", description: "Stir-fried noodles with chicken and colorful veggies.", price: 229, category: "Asian", image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=800", isAvailable: true, isVeg: false },

    // SIDES & DRINKS
    { name: "French Fries", description: "Classic salted crispy fries.", price: 99, category: "Sides", image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=800", isAvailable: true, isVeg: true },
    { name: "Garlic Breadsticks", description: "Freshly baked bread with garlic butter and herbs.", price: 129, category: "Sides", image: "https://images.unsplash.com/photo-1619531019973-10e302521e64?w=800", isAvailable: true, isVeg: true },
    { name: "Chicken Wings", description: "Spicy BBQ marinated deep fried wings.", price: 249, category: "Sides", image: "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=800", isAvailable: true, isVeg: false },
    { name: "Choco Lava Cake", description: "Warm molten chocolate cake with a gooey center.", price: 109, category: "Desserts", image: "https://images.unsplash.com/photo-1563805042-df68a16617c7?w=800", isAvailable: true, isVeg: true },
    { name: "Classic Lemonade", description: "Pure refreshness with lemon and mint.", price: 89, category: "Drinks", image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=800", isAvailable: true, isVeg: true },
    { name: "Iced Coffee", description: "Perfectly brewed cold coffee with milk.", price: 149, category: "Drinks", image: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=800", isAvailable: true, isVeg: true },
    { name: "Mango Smoothie", description: "Creamy mango pulp blended with yogurt.", price: 169, category: "Drinks", image: "https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=800", isAvailable: true, isVeg: true },
    { name: "Vanilla Milkshake", description: "Rich vanilla ice cream blended with fresh milk.", price: 159, category: "Drinks", image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=800", isAvailable: true, isVeg: true },
    { name: "Red Velvet Pastry", description: "Soft cake with cream cheese frosting.", price: 119, category: "Desserts", image: "https://images.unsplash.com/photo-1586788680434-30d324634bf6?w=800", isAvailable: true, isVeg: true },
    { name: "Blueberry Cheesecake", description: "Baked cheesecake with fresh blueberry compote.", price: 249, category: "Desserts", image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=800", isAvailable: true, isVeg: true },

    // MORE PIZZAS (Filling to 50)
    { name: "Mexican Green Wave", description: "Onion, capsicum, tomato, and jalapeño with spicy sprinkle.", price: 469, category: "Pizza", image: "https://images.unsplash.com/photo-1548365314-159491f24d31?w=800", isAvailable: true, isVeg: true },
    { name: "Veg Extravaganza", description: "Black olives, onion, capsicum, mushroom, corn, and jalapeño.", price: 529, category: "Pizza", image: "https://images.unsplash.com/photo-1590947132387-155cc02f3212?w=800", isAvailable: true, isVeg: true },
    { name: "Chicken Fiesta", description: "Grilled chicken, mushrooms, onions, and spicy capsicum.", price: 499, category: "Pizza", image: "https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?w=800", isAvailable: true, isVeg: false },
    { name: "Indi Chicken Tikka", description: "Chicken tikka with red paprika and mint mayo.", price: 549, category: "Pizza", image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800", isAvailable: true, isVeg: false },
    { name: "Non-Veg Supreme", description: "Chicken sausage, barbecue chicken, and peri-peri chicken.", price: 589, category: "Pizza", image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800", isAvailable: true, isVeg: false },

    // MORE APPETIZERS
    { name: "Paneer Popcorn", description: "Mini paneer cubes fried with spicy coating.", price: 169, category: "Sides", image: "https://images.unsplash.com/photo-1606471659766-07a5870a9af0?w=800", isAvailable: true, isVeg: true },
    { name: "Onion Rings", description: "Crispy breaded onion rings with dip.", price: 139, category: "Sides", image: "https://images.unsplash.com/photo-1639024471283-03518883512d?w=800", isAvailable: true, isVeg: true },
    { name: "Stuffed Garlic Bread", description: "Garlic bread filled with jalapeños and sweet corn.", price: 199, category: "Sides", image: "https://images.unsplash.com/photo-1573140401532-c59ce50e47ea?w=800", isAvailable: true, isVeg: true },

    // MORE MAIN COURSE
    { name: "Veg Biryani", description: "Aromatic basmati rice cooked with fresh vegetables.", price: 299, category: "Asian", image: "https://images.unsplash.com/photo-1563379091339-03b21bc4a4f8?w=800", isAvailable: true, isVeg: true },
    { name: "Chicken Biryani", description: "Classic Hyderabadi style chicken biryani.", price: 399, category: "Asian", image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=800", isAvailable: true, isVeg: false },
    { name: "Butter Chicken", description: "Creamy tomato based curry with tender chicken chunks.", price: 349, category: "Asian", image: "https://images.unsplash.com/photo-1603894584714-74399e84638f?w=800", isAvailable: true, isVeg: false },
    { name: "Dal Makhani", description: "Slow cooked black lentils with cream and butter.", price: 249, category: "Asian", image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800", isAvailable: true, isVeg: true },
    { name: "Garlic Naan", description: "Soft clay oven baked bread with garlic and butter.", price: 49, category: "Asian", image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800", isAvailable: true, isVeg: true },
    { name: "Tandoori Chicken Full", description: "Whole chicken marinated and roasted in clay oven.", price: 599, category: "Asian", image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=800", isAvailable: true, isVeg: false },
    { name: "Hot Chocolate", description: "Rich cocoa with frothed milk and marshmallows.", price: 129, category: "Drinks", image: "https://images.unsplash.com/photo-1544787210-2211d7c928c7?w=800", isAvailable: true, isVeg: true }
];

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to DB...");

        await User.deleteMany();
        await User.create({
            name: "Admin User",
            email: "admin@cravebites.com",
            phone: "9876543210",
            password: "adminpassword",
            role: "admin"
        });
        console.log("Admin User Created: admin@cravebites.com / adminpassword");

        await Product.deleteMany();
        console.log("Cleared old products...");

        await Product.insertMany(products);
        console.log(`${products.length} Products Seeded Successfully!`);

        process.exit();
    } catch (error) {
        console.error("Error seeding data:", error);
        process.exit(1);
    }
};

seedData();
