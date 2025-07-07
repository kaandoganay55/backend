import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { getAllProducts, getFilteredProducts } from './services/products';

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the Next.js build
const isDevelopment = process.env.NODE_ENV !== 'production';
const frontendPath = path.join(__dirname, '../../frontend/.next/standalone');
const publicPath = path.join(__dirname, '../../frontend/public');
const staticPath = path.join(__dirname, '../../frontend/.next/static');

// Serve static files only in production
if (!isDevelopment) {
  app.use('/public', express.static(publicPath));
  app.use('/_next/static', express.static(staticPath));
  app.use('/_next/image', express.static(path.join(__dirname, '../../frontend/.next/cache/images')));
}

// API Routes
app.get('/api/products', async (req: Request, res: Response) => {
  try {
    const { minPrice, maxPrice, minRating } = req.query;
    
    if (minPrice || maxPrice || minRating) {
      const products = await getFilteredProducts(
        minPrice ? Number(minPrice) : undefined,
        maxPrice ? Number(maxPrice) : undefined,
        minRating ? Number(minRating) : undefined
      );
      return res.json(products);
    }
    
    const products = await getAllProducts();
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({ 
    status: 'ok', 
    environment: process.env.NODE_ENV || 'development',
    port: port 
  });
});

// Serve Next.js pages for all other routes (only in production)
app.get('*', (req: Request, res: Response) => {
  if (isDevelopment) {
    return res.json({ 
      message: 'Development mode - Frontend should run separately on port 3000',
      api: '/api/products',
      health: '/health'
    });
  }

  try {
    // Try to serve the index.html from Next.js build
    const fs = require('fs');
    const indexPath = path.join(__dirname, '../../frontend/.next/standalone/frontend/server.js');
    
    if (fs.existsSync(indexPath)) {
      const nextApp = require(indexPath);
      return nextApp.getRequestHandler()(req, res);
    } else {
      // Fallback to static index.html
      const staticIndexPath = path.join(__dirname, '../../frontend/out/index.html');
      if (fs.existsSync(staticIndexPath)) {
        return res.sendFile(staticIndexPath);
      }
    }
  } catch (error) {
    console.error('Error serving Next.js:', error);
  }

  // Final fallback
  res.status(200).send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Jewelry Store</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; }
          .card { border: 1px solid #ddd; padding: 20px; border-radius: 8px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <h1>🏺 Jewelry Store API</h1>
        <div class="card">
          <h2>Welcome!</h2>
          <p>The application is running successfully.</p>
          <p><strong>Available endpoints:</strong></p>
          <ul>
            <li><a href="/api/products">🔗 /api/products</a> - Get all products</li>
            <li><a href="/health">💚 /health</a> - Health check</li>
          </ul>
        </div>
        <div class="card">
          <h3>Frontend Status</h3>
          <p>Frontend files are being prepared. If you're seeing this page, the API is working correctly.</p>
        </div>
      </body>
    </html>
  `);
});

app.listen(port, () => {
  console.log(`🚀 Server is running on port ${port}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📍 Health check: http://localhost:${port}/health`);
  console.log(`📦 API: http://localhost:${port}/api/products`);
}); 