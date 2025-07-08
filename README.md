# Jewelry Store Backend

This is the backend service for the Jewelry Store application. It provides APIs for product management and real-time gold prices.

## Tech Stack

- Node.js
- Express.js
- TypeScript
- Gold API Integration

## Prerequisites

- Node.js >= 18.0.0
- npm or yarn

## Environment Variables

```env
PORT=3001 # Optional, defaults to 10000
GOLD_API_KEY=your_api_key # Required for gold price fetching
```

## Installation

```bash
# Install dependencies
npm install

# or using yarn
yarn install
```

## Development

```bash
# Run in development mode
npm run dev

# or using yarn
yarn dev
```

## Production Build

```bash
# Build the project
npm run build

# Start the production server
npm start

# or using yarn
yarn build
yarn start
```

## API Endpoints

### Products

- `GET /api/products` - Get all products
  - Query Parameters:
    - `minPrice`: Filter products with price >= minPrice
    - `maxPrice`: Filter products with price <= maxPrice
    - `minRating`: Filter products with rating >= minRating

### Gold Prices

- Gold prices are fetched from Gold API and converted to different types:
  - 24 Ayar Gram Altın
  - 22 Ayar Bilezik
  - 18 Ayar Altın
  - Çeyrek Altın
  - Yarım Altın
  - Tam Altın

### Health Check

- `GET /health` - Check API health status

## Deployment

The backend is deployed on Render.com. To deploy:

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set build command: `npm install && npm run build`
4. Set start command: `npm start`
5. Add environment variables:
   - `goldapi-45f3dsmctdrn5r-io`: Your Gold API key

## Live URL

The API is live at:  https://backend-6-pw1u.onrender.com
