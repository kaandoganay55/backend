"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllProducts = getAllProducts;
exports.getFilteredProducts = getFilteredProducts;
const products_json_1 = __importDefault(require("../data/products.json"));
const goldPrice_1 = require("./goldPrice");
async function getAllProducts() {
    const goldPrice = await (0, goldPrice_1.getGoldPrice)();
    return products_json_1.default.map((product) => {
        const price = calculatePrice(product, goldPrice);
        const rating = calculateRating(product.popularityScore);
        return {
            ...product,
            price,
            rating
        };
    });
}
async function getFilteredProducts(minPrice, maxPrice, minRating) {
    const allProducts = await getAllProducts();
    return allProducts.filter(product => {
        const priceInRange = (!minPrice || product.price >= minPrice) &&
            (!maxPrice || product.price <= maxPrice);
        const ratingInRange = !minRating || product.rating >= minRating;
        return priceInRange && ratingInRange;
    });
}
function calculatePrice(product, goldPrice) {
    const price = (product.popularityScore + 1) * product.weight * goldPrice;
    // Round to 2 decimal places
    return Math.round(price * 100) / 100;
}
function calculateRating(popularityScore) {
    // Convert popularity score (0-1) to rating (0-5)
    const rating = popularityScore * 5;
    // Round to 1 decimal place
    return Math.round(rating * 10) / 10;
}
