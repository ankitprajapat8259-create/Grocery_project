# Grocery Frontend

React frontend for the Grocery application.

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the root directory:
```
VITE_API_BASE_URL=http://localhost:8000/api
```

For production, update the API base URL to your deployed backend URL.

### 3. Run Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Features

- **User Authentication**: Register, login, logout, forgot password
- **Product Browsing**: Browse products by category
- **Shopping Cart**: Add, update, remove items from cart
- **Order Management**: Place orders, view order history, track order status
- **User Profile**: Update profile, delete account
- **Admin Dashboard**: Manage products, categories, orders, and users

## Deployment

### Vercel
1. Push this repository to GitHub
2. Connect to Vercel
3. Configure environment variable `VITE_API_BASE_URL` to your backend URL
4. Deploy

The `vercel.json` file is included for deployment configuration.

## Backend

The backend API is a separate repository. Make sure the backend is running and accessible before using this frontend.

Backend repository should be deployed separately (e.g., on Render, Railway, or similar platform).

## Environment Variables

- `VITE_API_BASE_URL`: Base URL for the backend API (default: `http://localhost:8000/api`)
