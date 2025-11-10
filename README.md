# Restaurant Ordering System

A modern QR code-based restaurant ordering system built with React, Next.js, and Firebase.

## Features

- 🍽️ **Customer Menu**: Browse menu items and add to cart
- 🛒 **Shopping Cart**: Manage orders with quantity controls
- 📱 **QR Code Integration**: Customers scan QR codes to access menu
- 📊 **Admin Dashboard**: Real-time order management for restaurant staff
- 🔄 **Live Updates**: Real-time order status updates using Firebase
- 📋 **Order Tracking**: Customers can track their order status

## Tech Stack

- **Frontend**: React.js with Next.js
- **Database**: Firebase Firestore
- **Styling**: CSS with responsive design
- **QR Codes**: qrcode library for generation

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Firebase Configuration

1. Create a Firebase project at [https://console.firebase.google.com](https://console.firebase.google.com)
2. Enable Firestore Database
3. Copy your Firebase config and update `lib/firebase.js`:

```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id",
};
```

### 3. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to see the customer menu.

## Usage

### For Customers

1. Scan the QR code at your table
2. Browse the menu and add items to cart
3. Place your order
4. Track order status in real-time

### For Restaurant Staff

1. Visit `/admin` to access the admin dashboard
2. View incoming orders in real-time
3. Update order status (preparing → ready → completed)
4. Generate QR codes at `/qr-generator`

## Pages

- `/` - Customer menu and ordering
- `/admin` - Restaurant admin dashboard
- `/qr-generator` - Generate QR codes for tables

## Firebase Collections

### Orders Collection

```javascript
{
  items: [
    {
      id: number,
      name: string,
      price: number,
      quantity: number
    }
  ],
  total: number,
  status: 'preparing' | 'ready' | 'completed',
  timestamp: Date,
  tableNumber: number
}
```

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add your Firebase environment variables
4. Deploy!

### Environment Variables

Add these to your deployment platform:

- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

## Customization

### Menu Items

Edit the `menuItems` array in `pages/index.js` to customize your restaurant's menu.

### Styling

Modify `styles/globals.css` to match your restaurant's branding.

### Features to Add

- User authentication
- Payment integration
- Order history
- Menu management interface
- Table management
- Analytics dashboard

## License

MIT License - feel free to use this for your restaurant!
