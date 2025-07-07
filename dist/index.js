"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const products_1 = require("./services/products");
// Load environment variables
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3001;
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Routes
app.get('/api/products', async (req, res) => {
    try {
        const { minPrice, maxPrice, minRating } = req.query;
        if (minPrice || maxPrice || minRating) {
            const products = await (0, products_1.getFilteredProducts)(minPrice ? Number(minPrice) : undefined, maxPrice ? Number(maxPrice) : undefined, minRating ? Number(minRating) : undefined);
            return res.json(products);
        }
        const products = await (0, products_1.getAllProducts)();
        res.json(products);
    }
    catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
