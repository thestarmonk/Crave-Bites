const Product = require('../models/Product');

const fs = require('fs');
const path = require('path');

exports.getProducts = async (req, res) => {
    try {
        let products = await Product.find({});
        if (products.length === 0) {
            // Fallback to local data if DB is empty for development
            const localData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/products.json'), 'utf8'));
            return res.json(localData);
        }
        res.json(products);
    } catch (error) {
        // Even if DB fails, try to return local data for demo/dev
        try {
            const localData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/products.json'), 'utf8'));
            return res.json(localData);
        } catch (e) {
            res.status(500).json({ message: error.message });
        }
    }
};


exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createProduct = async (req, res) => {
    try {
        const product = new Product(req.body);
        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            Object.assign(product, req.body);
            const updatedProduct = await product.save();
            res.json(updatedProduct);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            await product.deleteOne();
            res.json({ message: 'Product removed' });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
