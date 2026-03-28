require('dotenv').config();
const mongoose = require('mongoose');

const test = async () => {
    try {
        console.log("Connecting to:", process.env.MONGODB_URI);
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("SUCCESS!");
        process.exit(0);
    } catch (err) {
        console.error("FAIL:", err.message);
        process.exit(1);
    }
};

test();
