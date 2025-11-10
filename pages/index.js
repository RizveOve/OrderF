import { addDoc, collection, doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import Cart from "../components/Cart";
import MenuCard from "../components/MenuCard";
import OrderStatus from "../components/OrderStatus";
import { db } from "../lib/firebase";

const locations = [
  {
    id: 1,
    name: "CC Vest",
    address: "Lilleakerveien 16, 0283 Oslo",
    hours: "10:00 – 22:00",
  },
  {
    id: 2,
    name: "Carl Berner",
    address: "Trondheimsveien 113, 0565 Oslo",
    hours: "11:00 – 22:00",
  },
  {
    id: 3,
    name: "Storo",
    address: "Vitaminveien 31-33, 0484 Oslo",
    hours: "10:00 – 22:00",
  },
  {
    id: 4,
    name: "Steen & Strøm",
    address: "Kongens gate 23, 0153 Oslo",
    hours: "10:00 – 21:00",
  },
  {
    id: 5,
    name: "Majorstua",
    address: "Kirkeveien 59B, 0364 Oslo",
    hours: "11:00 – 23:00",
  },
  {
    id: 6,
    name: "Oslo City",
    address: "Stenersgata 1, 0050 Oslo",
    hours: "10:00 – 22:00",
  },
  {
    id: 7,
    name: "Torggata",
    address: "Torggata 9A, 0181 Oslo",
    hours: "11:00 – 22:00",
  },
  {
    id: 8,
    name: "Sandefjord",
    address: "Thor Dahls gate 1, 3210 Sandefjord",
    hours: "11:00 – 22:00",
  },
];

const defaultMenuItems = [
  // Combos & Salads
  {
    id: 1,
    name: "Fly Experience Menu",
    price: 295,
    category: "Combos & Salad",
    image:
      "https://cdn.heapsapp.com/files/shop-products/07ed0d9c-5ff5-4847-a7dd-2d16b9fc92a4/ff01e93c-8789-4061-acc1-e98090c5926c.x-small.png",
    fallbackEmoji: "🍗🍟",
    description:
      "1 fried chicken leg, 3 wings, 2 tenders, loaded cheddar fries, and 2 dips",
    available: true,
  },
  {
    id: 2,
    name: "Fly Caesar",
    price: 190,
    category: "Combos & Salad",
    image:
      "https://cdn.heapsapp.com/files/shop-products/d626c38c-a03a-4a09-baa8-72881ee0a768/3f05452a-51d1-48d4-b5e2-90652396ed1c.x-small.png",
    fallbackEmoji: "🥗🍗",
    description:
      "Fried chicken tenders, crispy Romano salad, Fly Caesar dressing, bacon, parmesan & croutons",
    available: true,
  },
  {
    id: 3,
    name: "Fly Kids Menu",
    price: 105,
    category: "Combos & Salad",
    image:
      "https://cdn.heapsapp.com/files/shop-products/2943b768-26ad-4e26-9de8-ee2de93b1627/19e3f9e9-1be2-4ae0-b45e-bf4464c89e5c.x-small.png",
    fallbackEmoji: "🧒🍗",
    description: "3 tenders, mini fries, and 1 dip. Perfect for children",
    available: true,
  },

  // Fried Chicken Tenders
  {
    id: 4,
    name: "4 Tenders",
    price: 100,
    category: "Fried Chicken Tenders",
    image:
      "https://cdn.heapsapp.com/files/shop-products/a9a013b9-8141-4f38-a91a-b17a32612ee3/e3279480-3817-4b65-942a-43923d47d4fb.x-small.png",
    fallbackEmoji: "🍗✨",
    description: "Hand-breaded fried tenders with your choice of dip",
    available: true,
  },
  {
    id: 5,
    name: "8 Tenders",
    price: 180,
    category: "Fried Chicken Tenders",
    image:
      "https://cdn.heapsapp.com/files/shop-products/a9a013b9-8141-4f38-a91a-b17a32612ee3/e3279480-3817-4b65-942a-43923d47d4fb.x-small.png",
    fallbackEmoji: "🍗🍗",
    description: "Hand-breaded fried tenders with your choice of dip",
    available: true,
  },
  {
    id: 6,
    name: "15 Tenders",
    price: 310,
    category: "Fried Chicken Tenders",
    image:
      "https://cdn.heapsapp.com/files/shop-products/a9a013b9-8141-4f38-a91a-b17a32612ee3/e3279480-3817-4b65-942a-43923d47d4fb.x-small.png",
    fallbackEmoji: "🍗🍗🍗",
    description: "Hand-breaded fried tenders with your choice of dip",
    available: true,
  },

  // Fried Chicken Wings
  {
    id: 7,
    name: "5 Wings",
    price: 100,
    category: "Fried Chicken Wings",
    image:
      "https://cdn.heapsapp.com/files/shop-products/a69db5f0-fdc6-4584-a80c-03f351fa22bc/d4faa533-3ed9-4a38-9c62-9cfe6e6c5e6f.x-small.png",
    fallbackEmoji: "🍗🔥",
    description: "Classic crispy wings served with dip",
    available: true,
  },
  {
    id: 8,
    name: "10 Wings",
    price: 175,
    category: "Fried Chicken Wings",
    image:
      "https://cdn.heapsapp.com/files/shop-products/a69db5f0-fdc6-4584-a80c-03f351fa22bc/d4faa533-3ed9-4a38-9c62-9cfe6e6c5e6f.x-small.png",
    fallbackEmoji: "🍗🍗",
    description: "Classic crispy wings served with dip",
    available: true,
  },
  {
    id: 9,
    name: "30 Wings",
    price: 395,
    category: "Fried Chicken Wings",
    image:
      "https://cdn.heapsapp.com/files/shop-products/a69db5f0-fdc6-4584-a80c-03f351fa22bc/d4faa533-3ed9-4a38-9c62-9cfe6e6c5e6f.x-small.png",
    fallbackEmoji: "🍗🍗🍗",
    description: "Classic crispy wings served with dip",
    available: true,
  },
  {
    id: 10,
    name: "Hot Wings (Spicy)",
    price: 130,
    category: "Fried Chicken Wings",
    image:
      "https://cdn.heapsapp.com/files/shop-products/1fc70a48-7776-4cfc-b9c4-615a12ae6bd0/539c3052-c3d3-4ccf-8e86-d27985cfa6a5.x-small.png",
    fallbackEmoji: "🍗🌶️🔥",
    description:
      "Coated in Fly Chicken's special spicy seasoning, served with Habanero Hot Sauce",
    available: true,
  },

  // Fried Chicken Legs
  {
    id: 11,
    name: "2 Chicken Legs",
    price: 175,
    category: "Fried Chicken Legs",
    image:
      "https://cdn.heapsapp.com/files/shop-products/b8422804-4db4-41b1-918d-27278aeab0a8/76ff2fe8-880d-4bd6-b176-c4ecc965aec2.x-small.png",
    fallbackEmoji: "🍖✨",
    description: "Boneless fried chicken legs, crispy outside, juicy inside",
    available: true,
  },
  {
    id: 12,
    name: "3 Chicken Legs",
    price: 245,
    category: "Fried Chicken Legs",
    image:
      "https://cdn.heapsapp.com/files/shop-products/b8422804-4db4-41b1-918d-27278aeab0a8/76ff2fe8-880d-4bd6-b176-c4ecc965aec2.x-small.png",
    fallbackEmoji: "🍖🍖",
    description: "Boneless fried chicken legs, crispy outside, juicy inside",
    available: true,
  },
  {
    id: 13,
    name: "4 Chicken Legs",
    price: 295,
    category: "Fried Chicken Legs",
    image:
      "https://cdn.heapsapp.com/files/shop-products/b8422804-4db4-41b1-918d-27278aeab0a8/76ff2fe8-880d-4bd6-b176-c4ecc965aec2.x-small.png",
    fallbackEmoji: "🍖🍖🍖",
    description: "Boneless fried chicken legs, crispy outside, juicy inside",
    available: true,
  },

  // Signature Burgers
  {
    id: 14,
    name: "Superfly Sandwich",
    price: 190,
    category: "Signature Burgers",
    image:
      "https://cdn.heapsapp.com/files/shop-products/fea2d89f-c58a-4a37-a919-1477d14871c7/ff186ea4-c7f0-4076-8648-d92e70b0f196.x-small.png",
    fallbackEmoji: "🍔👑",
    description:
      "Fried chicken, brioche bun, BBQ, bacon, onion rings, sour cream & crispy salad",
    available: true,
  },
  {
    id: 15,
    name: "Fly Cheese",
    price: 165,
    category: "Signature Burgers",
    image:
      "https://cdn.heapsapp.com/files/shop-products/b6cb9af5-45e2-4f8c-a8fa-355c3c4ee003/75b44793-f4d7-4911-a6d1-39559f4def9c.x-small.png",
    fallbackEmoji: "🍔🧀",
    description: "Fried chicken, cheddar, pickles, mustard, onions & ketchup",
    available: true,
  },
  {
    id: 16,
    name: "Fly Mandy",
    price: 195,
    category: "Signature Burgers",
    image:
      "https://cdn.heapsapp.com/files/shop-products/d6c48b22-d686-4e82-a37b-e06e93dacd3e/55596116-7e25-4a3e-88ad-d3f16df3e43f.x-small.png",
    fallbackEmoji: "🍔🥐",
    description:
      "Fried chicken, croissant bun, cheddar, bacon, smoked habanero ranch & onions",
    available: true,
  },
  {
    id: 17,
    name: "Fly Classic",
    price: 180,
    category: "Signature Burgers",
    image:
      "https://cdn.heapsapp.com/files/shop-products/b6cb9af5-45e2-4f8c-a8fa-355c3c4ee003/75b44793-f4d7-4911-a6d1-39559f4def9c.x-small.png",
    fallbackEmoji: "🍔⭐",
    description:
      "Fried chicken, brioche bun, Fly classic sauce, salad, onions, tomatoes & pickles",
    available: true,
  },

  // Loaded Fries & Sides
  {
    id: 18,
    name: "Loaded Chicken Fries",
    price: 195,
    category: "Loaded Fries & Sides",
    image:
      "https://cdn.heapsapp.com/files/shop-products/7b31898e-f1b9-4e41-9818-f85616cad976/7c17fe51-b4c8-4757-b60a-0266cfa52349.x-small.png",
    fallbackEmoji: "🍟🍗🧀",
    description:
      "Fries with fried chicken legs, bacon, cheddar, sour cream & jalapeños",
    available: true,
  },
  {
    id: 19,
    name: "Hot Chicken Fries",
    price: 195,
    category: "Loaded Fries & Sides",
    image:
      "https://cdn.heapsapp.com/files/shop-products/7b31898e-f1b9-4e41-9818-f85616cad976/7c17fe51-b4c8-4757-b60a-0266cfa52349.x-small.png",
    fallbackEmoji: "🍟🍗🌶️",
    description:
      "Fries with fried chicken, habanero hot sauce, smoked habanero ranch, parsley & fefferoni",
    available: true,
  },
  {
    id: 20,
    name: "Loaded Cheddar Fries (Large)",
    price: 115,
    category: "Loaded Fries & Sides",
    image:
      "https://cdn.heapsapp.com/files/shop-products/7b31898e-f1b9-4e41-9818-f85616cad976/7c17fe51-b4c8-4757-b60a-0266cfa52349.x-small.png",
    fallbackEmoji: "🍟🧀💛",
    description: "Fries with cheddar, sour cream, bacon & jalapeños",
    available: true,
  },
  {
    id: 21,
    name: "Loaded Cheddar Fries (Small)",
    price: 80,
    category: "Loaded Fries & Sides",
    image:
      "https://cdn.heapsapp.com/files/shop-products/7b31898e-f1b9-4e41-9818-f85616cad976/7c17fe51-b4c8-4757-b60a-0266cfa52349.x-small.png",
    fallbackEmoji: "🍟🧀",
    description: "Fries with cheddar, sour cream, bacon & jalapeños",
    available: true,
  },
  {
    id: 22,
    name: "Spicy Loaded Tender Fries (Small)",
    price: 140,
    category: "Loaded Fries & Sides",
    image:
      "https://cdn.heapsapp.com/files/shop-products/7b31898e-f1b9-4e41-9818-f85616cad976/7c17fe51-b4c8-4757-b60a-0266cfa52349.x-small.png",
    fallbackEmoji: "🍟🍗🔥",
    description:
      "Fries topped with tenders, red onion, pickles, classic sauce, crispy onions, parsley & Fly hot sauce",
    available: true,
  },
  {
    id: 23,
    name: "Plain Fries",
    price: 75,
    category: "Loaded Fries & Sides",
    image:
      "https://cdn.heapsapp.com/files/shop-products/477cddce-b7a0-4a9d-8494-3d2fc2d9064a/2810c492-b6d8-4701-a902-411bb165ec29.x-small.png",
    fallbackEmoji: "🍟✨",
    description: "Crispy golden fries",
    available: true,
  },
  {
    id: 24,
    name: "Onion Rings",
    price: 55,
    category: "Loaded Fries & Sides",
    image:
      "https://images.unsplash.com/photo-1639024471283-03518883512d?w=400&h=300&fit=crop&crop=center",
    fallbackEmoji: "🧅⭕",
    description: "Crispy golden onion rings",
    available: true,
  },
  {
    id: 25,
    name: "Chili Cheese Bites",
    price: 55,
    category: "Loaded Fries & Sides",
    image:
      "https://cdn.heapsapp.com/files/shop-products/ad25989e-93c9-46b6-baff-f0df624ffbc9/65cb8987-5706-4d34-aff3-b8f059050df5.x-small.png",
    fallbackEmoji: "🧀🌶️",
    description: "Crispy nuggets filled with cheddar cheese & green pepper",
    available: true,
  },

  // Desserts
  {
    id: 26,
    name: "Fly Cookie",
    price: 38,
    category: "Desserts",
    image:
      "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400&h=300&fit=crop&crop=center",
    fallbackEmoji: "🍪🍫",
    description:
      "Homemade chocolate chip cookie with Walters Almonds, sea salt & chocolate",
    available: true,
  },

  // Drinks
  {
    id: 27,
    name: "Coca-Cola (0.5 L)",
    price: 48,
    category: "Drinks",
    image:
      "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400&h=300&fit=crop&crop=center",
    fallbackEmoji: "🥤🔴",
    description: "Classic Coca-Cola",
    available: true,
  },
  {
    id: 28,
    name: "Coca-Cola Zero (0.5 L)",
    price: 48,
    category: "Drinks",
    image:
      "https://images.unsplash.com/photo-1581636625402-29b2a704ef13?w=400&h=300&fit=crop&crop=center",
    fallbackEmoji: "🥤⚫",
    description: "Zero sugar Coca-Cola",
    available: true,
  },
  {
    id: 29,
    name: "Fanta Orange (0.5 L)",
    price: 48,
    category: "Drinks",
    image:
      "https://images.unsplash.com/photo-1624552184280-8c3b10bbf3c5?w=400&h=300&fit=crop&crop=center",
    fallbackEmoji: "🥤🍊",
    description: "Orange flavored Fanta",
    available: true,
  },
  {
    id: 30,
    name: "Fanta Exotic (0.5 L)",
    price: 48,
    category: "Drinks",
    image:
      "https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=400&h=300&fit=crop&crop=center",
    fallbackEmoji: "🥤🌺",
    description: "Exotic flavored Fanta",
    available: true,
  },
  {
    id: 31,
    name: "Telemark Sparkling Water (0.5 L)",
    price: 43,
    category: "Drinks",
    image:
      "https://cdn.heapsapp.com/files/shop-products/8c7be840-7fec-4ffc-b359-b22db56281f5/301a58d9-cd8c-4bb6-a7a9-6ee36389dbe0.x-small.png",
    fallbackEmoji: "💧✨",
    description: "Refreshing sparkling water",
    available: true,
  },
];

export default function Home() {
  const [cart, setCart] = useState([]);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [orderStatus, setOrderStatus] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(locations[0]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [menuItems, setMenuItems] = useState(defaultMenuItems);
  const [loading, setLoading] = useState(false);

  const categories = [
    "All",
    ...new Set(menuItems.map((item) => item.category)),
  ];
  const filteredItems = menuItems.filter((item) => {
    // First check if item is available - strict boolean check
    if (item.available !== true) {
      return false;
    }
    
    // If "All" category is selected, show all available items
    if (selectedCategory === "All") {
      return true;
    }
    
    // For specific categories, normalize and compare
    const itemCategory = item.category?.trim();
    const selectedCat = selectedCategory?.trim();
    
    return itemCategory === selectedCat;
  });



  useEffect(() => {
    // Try to connect to Firebase, but don't block the UI
    const unsubscribe = onSnapshot(
      collection(db, "menuItems"),
      (snapshot) => {
        const items = [];
        snapshot.forEach((doc) => {
          items.push({ id: doc.id, ...doc.data() });
        });

        console.log('Firebase loaded items:', items.length);

        // Only update if we have items from Firebase
        if (items.length > 0) {
          setMenuItems(items);
          console.log('Using Firebase menu items');
        } else {
          console.log('No items in Firebase, keeping default menu');
        }
      },
      (error) => {
        console.error("Firebase connection error:", error);
        console.log('Using default menu items due to Firebase error');
        // Keep using default items on error
      }
    );

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (currentOrder) {
      const unsubscribe = onSnapshot(doc(db, "orders", currentOrder), (doc) => {
        if (doc.exists()) {
          setOrderStatus(doc.data().status);
        }
      });
      return () => unsubscribe();
    }
  }, [currentOrder]);

  const addToCart = (item) => {
    setCart((prev) => {
      const existing = prev.find((cartItem) => cartItem.id === item.id);
      if (existing) {
        return prev.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId) => {
    setCart((prev) => prev.filter((item) => item.id !== itemId));
  };

  const updateQuantity = (itemId, quantity) => {
    if (quantity === 0) {
      removeFromCart(itemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, quantity } : item))
    );
  };

  const placeOrder = async () => {
    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    console.log("Placing order...", cart);

    const orderData = {
      items: cart,
      total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
      status: "preparing",
      timestamp: new Date(),
      tableNumber: Math.floor(Math.random() * 20) + 1, // Random table for demo
    };

    console.log("Order data:", orderData);

    try {
      const docRef = await addDoc(collection(db, "orders"), orderData);
      console.log("Order placed successfully:", docRef.id);
      setCurrentOrder(docRef.id);
      setCart([]);
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Failed to place order. Please check your Firebase configuration.");
    }
  };

  if (currentOrder) {
    return <OrderStatus orderId={currentOrder} status={orderStatus} />;
  }

  if (loading) {
    return (
      <div className="container">
        <header className="header">
          <div className="logo-section">
            <div className="logo-container">
              <img 
                src="https://cdn.prod.website-files.com/6307266e269e4a08d8b311b7/6307266e269e4a7d28b3122e_Flychicken_vanlig_RGB_HvitClucking_Web.png"
                alt="Fly Chicken Logo"
                className="brand-logo"
              />
            </div>
            <div className="logo-text">

            </div>
          </div>
        </header>
      </div>
    );
  }

  return (
    <div className="container">
      <header className="header">
        <div className="logo-section">
          <div className="logo-container">
            <img 
              src="https://cdn.prod.website-files.com/6307266e269e4a08d8b311b7/6307266e269e4a7d28b3122e_Flychicken_vanlig_RGB_HvitClucking_Web.png"
              alt="Fly Chicken Logo"
              className="brand-logo"
            />
          </div>

        </div>

        <div className="location-selector">
          <label htmlFor="location">📍 Choose Location:</label>
          <select
            id="location"
            value={selectedLocation.id}
            onChange={(e) =>
              setSelectedLocation(
                locations.find((loc) => loc.id === parseInt(e.target.value))
              )
            }
            className="location-dropdown"
          >
            {locations.map((location) => (
              <option key={location.id} value={location.id}>
                Fly Chicken {location.name}
              </option>
            ))}
          </select>
          <div className="location-info">
            <p>📍 {selectedLocation.address}</p>
            <p>🕒 Open: {selectedLocation.hours}</p>
          </div>
        </div>
      </header>

      <main className="main">
        <section className="menu-section">
          <h2>Our Menu</h2>

          <div className="category-filter">
            {categories.map((category) => (
              <button
                key={category}
                className={`category-btn ${
                  selectedCategory === category ? "active" : ""
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
          <div className="menu-grid">
            {filteredItems.map((item) => (
              <MenuCard key={item.id} item={item} onAddToCart={addToCart} />
            ))}
          </div>
        </section>

        <Cart
          items={cart}
          onRemoveItem={removeFromCart}
          onUpdateQuantity={updateQuantity}
          onPlaceOrder={placeOrder}
        />
      </main>
    </div>
  );
}
