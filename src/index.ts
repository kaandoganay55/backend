import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { getAllProducts, getFilteredProducts } from './services/products';

// Load environment variables
dotenv.config();

const app = express();
// Render.com sets PORT environment variable automatically
const port = process.env.PORT || 10000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (_req: Request, res: Response) => {
  return res.json({ 
    message: 'Jewelry Store API',
    endpoints: {
      products: '/api/products',
      health: '/health'
    }
  });
});

app.get('/api/products', async (_req: Request, res: Response) => {
  try {
    const { minPrice, maxPrice, minRating } = _req.query;
    
    if (minPrice || maxPrice || minRating) {
      const products = await getFilteredProducts(
        minPrice ? Number(minPrice) : undefined,
        maxPrice ? Number(maxPrice) : undefined,
        minRating ? Number(minRating) : undefined
      );
      return res.json(products);
    }
    
    const products = await getAllProducts();
    return res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Health check endpoint
app.get('/health', (_req: Request, res: Response) => {
  return res.json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
    port: port
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log('Available routes:');
  console.log('- GET /');
  console.log('- GET /api/products');
  console.log('- GET /health');
}); 