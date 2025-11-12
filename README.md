# 🍗 OrderF - Modern Restaurant Ordering System

[![Live Demo](https://img.shields.io/badge/Live%20Demo-orderf.netlify.app-brightgreen)](https://orderf.netlify.app/)
[![Next.js](https://img.shields.io/badge/Next.js-15.0.0-black)](https://nextjs.org/)
[![Firebase](https://img.shields.io/badge/Firebase-10.13.0-orange)](https://firebase.google.com/)
[![React](https://img.shields.io/badge/React-18.3.0-blue)](https://reactjs.org/)

A cutting-edge, mobile-first restaurant ordering system designed for modern dining experiences. Built with React, Next.js, and Firebase, featuring real-time order management and an intuitive user interface.

## 🌟 Live Demo

**Experience the app live:** [https://orderf.netlify.app/](https://orderf.netlify.app/)

_Try adding items to your cart and experience the smooth, mobile-optimized interface!_

## ✨ Key Features

### 🎯 **Customer Experience**

- **📱 Mobile-First Design**: Optimized for smartphones and tablets
- **🍽️ Interactive Menu**: Browse categorized menu items with high-quality images
- **👆 Tap-to-View Details**: Click any item for detailed descriptions and nutritional info
- **🛒 Smart Floating Cart**: Invisible until items are added, then appears as a sleek floating widget
- **⚡ Real-Time Updates**: Live order status tracking with Firebase integration
- **🎨 Modern UI**: Glass-morphism effects and smooth animations

### 🔧 **Admin Features**

- **📊 Real-Time Dashboard**: Monitor incoming orders instantly
- **🔄 Order Management**: Update order status (preparing → ready → completed)
- **📋 Menu Management**: Add, edit, and manage menu items dynamically
- **📱 QR Code Generator**: Create QR codes for table-based ordering
- **👥 Multi-Location Support**: Manage multiple restaurant locations

### 🚀 **Technical Excellence**

- **⚡ Next.js 15**: Latest React framework with optimal performance
- **🔥 Firebase Integration**: Real-time database with offline support
- **📱 Responsive Design**: Seamless experience across all devices
- **🎭 Modern Animations**: Smooth transitions and micro-interactions
- **🔒 Environment Variables**: Secure configuration management

## 🛠️ Tech Stack

| Technology   | Version | Purpose                        |
| ------------ | ------- | ------------------------------ |
| **Next.js**  | 15.0.0  | React framework with SSR/SSG   |
| **React**    | 18.3.0  | Frontend library               |
| **Firebase** | 10.13.0 | Real-time database & hosting   |
| **CSS3**     | Latest  | Modern styling with animations |
| **QRCode**   | 1.5.3   | QR code generation             |

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Firebase account

### 1. Clone & Install

```bash
git clone <repository-url>
cd OrderF
npm install
```

### 2. Firebase Setup

1. **Create Firebase Project**

   ```bash
   # Visit https://console.firebase.google.com
   # Create new project → Enable Firestore Database
   ```

2. **Configure Environment Variables**

   ```bash
   # Copy the example file
   cp .env.local.example .env.local

   # Update with your Firebase credentials
   NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
   NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
   ```

3. **Initialize Firestore Collections**
   ```bash
   # The app will automatically create collections on first use
   # Or manually create: orders, menuItems
   ```

### 3. Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

**🌐 Open [http://localhost:3000](http://localhost:3000) to view the customer interface**

## 📱 User Guide

### 👥 **For Customers**

1. **🔗 Access Menu**

   - Scan QR code at your table, or
   - Visit the direct link: [orderf.netlify.app](https://orderf.netlify.app/)

2. **🍽️ Browse & Order**

   - Tap menu categories to filter items
   - Click any item to view detailed information
   - Use "Add to Cart" for quick additions
   - Cart appears automatically when items are added

3. **🛒 Manage Cart**

   - Click cart to expand/collapse items
   - Adjust quantities with +/- buttons
   - Remove items with × button
   - Place order with prominent green button

4. **📊 Track Order**
   - Real-time status updates
   - Visual progress indicators
   - Estimated completion time

### 👨‍💼 **For Restaurant Staff**

1. **📊 Admin Dashboard** (`/admin`)

   - Real-time order monitoring
   - Order status management
   - Customer order details

2. **🍽️ Menu Management** (`/menu-management`)

   - Add/edit menu items
   - Update prices and descriptions
   - Toggle item availability
   - Upload item images

3. **📱 QR Code Generator** (`/qr-generator`)
   - Generate table-specific QR codes
   - Customize for different locations
   - Print-ready formats

## 🗂️ Application Structure

| Route              | Purpose         | Features                             |
| ------------------ | --------------- | ------------------------------------ |
| `/`                | Customer Menu   | Mobile-optimized ordering interface  |
| `/admin`           | Admin Dashboard | Order management & real-time updates |
| `/menu-management` | Menu Control    | CRUD operations for menu items       |
| `/qr-generator`    | QR Codes        | Generate table-specific codes        |
| `/admin-login`     | Authentication  | Secure admin access                  |

## 🗄️ Database Schema

### Firebase Collections

#### **Orders Collection**

```typescript
interface Order {
  id: string;
  items: OrderItem[];
  total: number;
  status: "preparing" | "ready" | "completed";
  timestamp: Timestamp;
  tableNumber: number;
  location?: string;
}

interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  category: string;
}
```

#### **Menu Items Collection**

```typescript
interface MenuItem {
  id: number;
  name: string;
  price: number;
  category: string;
  description: string;
  image: string;
  fallbackEmoji: string;
  available: boolean;
}
```

## 🚀 Deployment

### **Netlify (Recommended)**

```bash
# Build the project
npm run build

# Deploy to Netlify
# Connect your GitHub repo to Netlify
# Set environment variables in Netlify dashboard
```

### **Vercel**

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### **Environment Variables**

**Required for all deployments:**

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id

# Admin Credentials (Optional)
MASTER_ADMIN_EMAIL=admin@yourrestaurant.com
MASTER_ADMIN_PASSWORD=your-secure-password

# Security
NEXTAUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=https://yourdomain.com
```

## 🎨 Customization

### **Menu Configuration**

```javascript
// pages/index.js - Default menu items
const defaultMenuItems = [
  {
    id: 1,
    name: "Your Item Name",
    price: 199,
    category: "Your Category",
    image: "https://your-image-url.com/image.jpg",
    fallbackEmoji: "🍗",
    description: "Detailed description of your item",
    available: true,
  },
];
```

### **Branding & Styling**

```css
/* styles/globals.css - Key variables */
:root {
  --primary-color: #ffd700; /* Golden yellow */
  --secondary-color: #e31e24; /* Red accent */
  --background: #1a1a1a; /* Dark background */
  --text-primary: #ffffff; /* White text */
}
```

### **Location Configuration**

```javascript
// Update restaurant locations in pages/index.js
const locations = [
  {
    id: 1,
    name: "Your Location",
    address: "Your Address",
    hours: "10:00 – 22:00",
  },
];
```

## 🔮 Roadmap & Future Features

### **Phase 1: Core Enhancements**

- [ ] Payment integration (Stripe/PayPal)
- [ ] Customer authentication
- [ ] Order history tracking
- [ ] Push notifications

### **Phase 2: Advanced Features**

- [ ] Multi-language support
- [ ] Analytics dashboard
- [ ] Inventory management
- [ ] Staff scheduling

### **Phase 3: Enterprise Features**

- [ ] Multi-tenant architecture
- [ ] Advanced reporting
- [ ] API for third-party integrations
- [ ] White-label solutions

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### **Development Workflow**

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Fly Chicken** - Inspiration for the demo restaurant
- **Firebase** - Real-time database and hosting
- **Next.js Team** - Amazing React framework
- **Netlify** - Seamless deployment platform

---

**Built with ❤️ for the restaurant industry**

[![GitHub stars](https://img.shields.io/github/stars/yourusername/orderf?style=social)](https://github.com/yourusername/orderf)
[![Twitter Follow](https://img.shields.io/twitter/follow/yourusername?style=social)](https://twitter.com/yourusername)
