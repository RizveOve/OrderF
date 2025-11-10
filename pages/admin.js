import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { useAuth } from "../components/AuthProvider";
import OrderCard from "../components/OrderCard";
import ProtectedRoute from "../components/ProtectedRoute";
import UserManagement from "../components/UserManagement";
import { db } from "../lib/firebase";

// QR Generator functions - with dynamic import to avoid SSR issues
const generateQRCode = async (url) => {
  try {
    if (typeof window === "undefined") {
      return null; // Skip on server side
    }

    // Dynamic import to avoid SSR issues
    const QRCode = await import("qrcode");
    const qrCodeDataURL = await QRCode.default.toDataURL(url, {
      width: 300,
      margin: 2,
      color: {
        dark: "#000000",
        light: "#FFFFFF",
      },
    });
    return qrCodeDataURL;
  } catch (error) {
    console.error("Error generating QR code:", error);

    // Fallback to canvas-based placeholder
    try {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = 300;
      canvas.height = 300;

      // Fill with white background
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, 300, 300);

      // Add border
      ctx.strokeStyle = "#000000";
      ctx.lineWidth = 2;
      ctx.strokeRect(10, 10, 280, 280);

      // Add text
      ctx.fillStyle = "#000000";
      ctx.font = "16px Arial";
      ctx.textAlign = "center";
      ctx.fillText("QR Code Placeholder", 150, 140);
      ctx.fillText("Scan for menu access", 150, 160);

      return canvas.toDataURL();
    } catch (fallbackError) {
      console.error("Fallback QR generation failed:", fallbackError);
      return null;
    }
  }
};

const downloadQRCode = (dataURL, filename = "restaurant-qr-code.png") => {
  if (typeof window !== "undefined") {
    const link = document.createElement("a");
    link.download = filename;
    link.href = dataURL;
    link.click();
  }
};

const defaultMenuItems = [
  // Combos & Salads
  {
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

function AdminDashboard() {
  const { user, userRole, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("orders");
  const [orders, setOrders] = useState([]);

  // Menu Management State
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [isResetting, setIsResetting] = useState(false); // Flag to prevent auto-initialization during reset
  const [newItem, setNewItem] = useState({
    name: "",
    price: "",
    category: "Combos & Salad",
    image: "",
    fallbackEmoji: "🍽️",
    description: "",
    available: true,
  });

  // QR Generator State
  const [qrCode, setQrCode] = useState("");
  const [url, setUrl] = useState("");

  const categories = [
    "Combos & Salad",
    "Fried Chicken Tenders",
    "Fried Chicken Wings",
    "Fried Chicken Legs",
    "Signature Burgers",
    "Loaded Fries & Sides",
    "Desserts",
    "Drinks",
  ];

  useEffect(() => {
    // Orders listener
    const unsubscribeOrders = onSnapshot(
      collection(db, "orders"),
      (snapshot) => {
        const ordersData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        ordersData.sort(
          (a, b) => b.timestamp?.toDate() - a.timestamp?.toDate()
        );
        setOrders(ordersData);
      }
    );

    // Menu items listener
    const unsubscribeMenu = onSnapshot(
      collection(db, "menuItems"),
      (snapshot) => {
        const items = [];
        snapshot.forEach((doc) => {
          items.push({ id: doc.id, ...doc.data() });
        });

        console.log(
          "Firebase listener received items:",
          items.length,
          "isResetting:",
          isResetting
        );

        if (items.length === 0 && loading && !isResetting) {
          console.log("No items found, initializing default menu...");
          initializeDefaultMenu();
        } else {
          console.log("Updating menu items from Firebase...");
          setMenuItems(items);
          setLoading(false);
        }
      },
      (error) => {
        console.error("Error loading menu items:", error);
        setLoading(false);
      }
    );

    // QR Code generation
    if (typeof window !== "undefined") {
      const currentUrl = window.location.origin;
      setUrl(currentUrl);
      generateQR(currentUrl);
    }

    return () => {
      unsubscribeOrders();
      unsubscribeMenu();
    };
  }, [loading]);

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await updateDoc(doc(db, "orders", orderId), {
        status: newStatus,
      });
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  // Menu Management Functions
  const initializeDefaultMenu = async () => {
    try {
      for (const item of defaultMenuItems) {
        // Remove the id field since Firebase will generate its own
        const { id, ...itemData } = item;
        await addDoc(collection(db, "menuItems"), itemData);
      }
    } catch (error) {
      console.error("Error initializing menu:", error);
    }
  };

  const toggleAvailability = async (itemId, currentStatus) => {
    console.log(
      "Toggling availability for item:",
      itemId,
      "Current status:",
      currentStatus,
      "Type:",
      typeof currentStatus
    );

    // Ensure itemId is a string (Firebase document IDs must be strings)
    const docId = String(itemId);
    console.log("Document ID (as string):", docId);

    // Ensure we have a proper boolean value
    const isCurrentlyAvailable = currentStatus === true;
    const newStatus = !isCurrentlyAvailable;

    console.log("Calculated new status:", newStatus);

    try {
      // Update in Firebase - ensure we use string ID
      await updateDoc(doc(db, "menuItems", docId), {
        available: newStatus,
      });

      console.log(
        "Successfully updated Firebase for item:",
        docId,
        "New status:",
        newStatus
      );

      // Note: We don't update local state here because the Firebase listener will handle it
      // This prevents race conditions and ensures consistency
    } catch (error) {
      console.error("Error updating availability for item", docId, ":", error);
      console.error("Full error object:", error);
      alert(
        `Failed to update availability for item ${docId}. Error: ${error.message}`
      );
    }
  };

  const addNewItem = async (e) => {
    e.preventDefault();
    if (!newItem.name || !newItem.price) {
      alert("Please fill in name and price");
      return;
    }

    try {
      const docRef = await addDoc(collection(db, "menuItems"), {
        ...newItem,
        price: parseFloat(newItem.price),
        createdAt: new Date(),
      });

      setMenuItems((prev) => [
        ...prev,
        { id: docRef.id, ...newItem, price: parseFloat(newItem.price) },
      ]);
      setNewItem({
        name: "",
        price: "",
        category: "Combos & Salad",
        image: "",
        fallbackEmoji: "🍽️",
        description: "",
        available: true,
      });
      setShowAddForm(false);
    } catch (error) {
      console.error("Error adding new item:", error);
    }
  };

  const startEdit = (item) => {
    setEditingItem({
      id: item.id,
      name: item.name,
      price: item.price,
      category: item.category,
      image: item.image || "",
      fallbackEmoji: item.fallbackEmoji || "🍽️",
      description: item.description || "",
      available: item.available,
    });
    setShowAddForm(false);
  };

  const saveEdit = async (e) => {
    e.preventDefault();
    if (!editingItem.name || !editingItem.price) {
      alert("Please fill in name and price");
      return;
    }

    try {
      await updateDoc(doc(db, "menuItems", editingItem.id), {
        name: editingItem.name,
        price: parseFloat(editingItem.price),
        category: editingItem.category,
        image: editingItem.image,
        fallbackEmoji: editingItem.fallbackEmoji,
        description: editingItem.description,
        available: editingItem.available,
      });

      setEditingItem(null);
    } catch (error) {
      console.error("Error updating item:", error);
    }
  };

  // Database Reset Functions
  const resetDatabase = async () => {
    const confirmMessage = `⚠️ RESET DATABASE ⚠️\n\nThis will:\n1. DELETE ALL existing menu items from Firebase\n2. Add ${defaultMenuItems.length} fresh menu items with proper IDs\n3. All items will be editable with working availability toggles\n\nThis action cannot be undone!\n\nContinue?`;

    if (!confirm(confirmMessage)) {
      return;
    }

    const doubleConfirm = confirm(
      "Are you absolutely sure? This will delete ALL current menu data!"
    );
    if (!doubleConfirm) {
      return;
    }

    try {
      console.log("Starting database reset...");
      setIsResetting(true); // Prevent auto-initialization
      setLoading(true);

      // Step 1: Delete all existing menu items
      console.log("Deleting all existing menu items...");
      const querySnapshot = await getDocs(collection(db, "menuItems"));
      const deletePromises = [];

      querySnapshot.forEach((doc) => {
        deletePromises.push(deleteDoc(doc.ref));
      });

      await Promise.all(deletePromises);
      console.log(`Deleted ${deletePromises.length} existing items`);

      // Small delay to ensure deletion is processed
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Step 2: Add fresh menu items
      console.log("Adding fresh menu items...");
      const addPromises = [];

      for (const item of defaultMenuItems) {
        addPromises.push(
          addDoc(collection(db, "menuItems"), {
            ...item,
            createdAt: new Date(),
          })
        );
      }

      await Promise.all(addPromises);
      console.log(`Added ${defaultMenuItems.length} fresh items`);

      setLoading(false);
      setIsResetting(false); // Reset complete, allow normal operations
      alert(
        `✅ Database reset successful!\n\nDeleted all old items and added ${defaultMenuItems.length} fresh items.\nAll items now have proper Firebase IDs and working availability toggles!`
      );
    } catch (error) {
      console.error("Error during database reset:", error);
      setLoading(false);
      setIsResetting(false); // Reset flag on error too
      alert(`❌ Error during database reset: ${error.message}`);
    }
  };

  const getItemsWithNumericIds = () => {
    return menuItems.filter((item) => typeof item.id === "number");
  };

  // QR Generator Functions
  const generateQR = async (targetUrl) => {
    const qrDataURL = await generateQRCode(targetUrl);
    if (qrDataURL) {
      setQrCode(qrDataURL);
    }
  };

  const handleDownload = () => {
    if (qrCode) {
      downloadQRCode(qrCode, "restaurant-menu-qr.png");
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "orders":
        return (
          <div className="menu-management-section">
            <div className="management-header">
              <h2>
                Active Orders (
                {orders.filter((o) => o.status !== "completed").length})
              </h2>
            </div>
            <div className="orders-grid">
              {orders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onUpdateStatus={updateOrderStatus}
                />
              ))}
            </div>
          </div>
        );

      case "menu":
        if (loading) {
          return (
            <div className="menu-management-section">
              <div className="loading">Loading menu items...</div>
            </div>
          );
        }

        const numericIdItems = getItemsWithNumericIds();

        return (
          <div className="menu-management-section">
            <div className="management-header">
              <h2>Menu Items ({menuItems.length})</h2>
              <div
                style={{ display: "flex", gap: "10px", alignItems: "center" }}
              >
                <button
                  className="btn-secondary"
                  onClick={resetDatabase}
                  style={{
                    background:
                      "linear-gradient(135deg, #dc3545 0%, #c82333 100%)",
                    borderColor: "#dc3545",
                    color: "#fff",
                  }}
                  title="Delete all items and add fresh clean data"
                >
                  🗑️ Reset Database
                </button>
                <button
                  className="btn-primary"
                  onClick={() => {
                    setShowAddForm(!showAddForm);
                    setEditingItem(null);
                  }}
                  disabled={editingItem !== null}
                >
                  {showAddForm ? "Cancel" : "Add New Item"}
                </button>
              </div>
            </div>

            {numericIdItems.length > 0 && (
              <div
                className="add-item-form"
                style={{
                  background:
                    "linear-gradient(135deg, #dc3545 0%, #c82333 100%)",
                  borderColor: "#dc3545",
                }}
              >
                <h3 style={{ color: "#fff" }}>⚠️ Database Has Issues</h3>
                <p style={{ color: "#fff", marginBottom: "15px" }}>
                  {numericIdItems.length} items have numeric IDs and cannot be
                  edited. Click "Reset Database" to delete all data and add
                  clean items.
                </p>
                <div style={{ fontSize: "0.9rem", color: "#fff" }}>
                  <strong>Problematic items:</strong>{" "}
                  {numericIdItems.map((item) => item.name).join(", ")}
                </div>
              </div>
            )}

            {showAddForm && (
              <form onSubmit={addNewItem} className="add-item-form">
                <h3>Add New Menu Item</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Name *</label>
                    <input
                      type="text"
                      value={newItem.name}
                      onChange={(e) =>
                        setNewItem({ ...newItem, name: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Price (NOK) *</label>
                    <input
                      type="number"
                      value={newItem.price}
                      onChange={(e) =>
                        setNewItem({ ...newItem, price: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Category</label>
                    <select
                      value={newItem.category}
                      onChange={(e) =>
                        setNewItem({ ...newItem, category: e.target.value })
                      }
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Image URL</label>
                    <input
                      type="url"
                      value={newItem.image}
                      onChange={(e) =>
                        setNewItem({ ...newItem, image: e.target.value })
                      }
                      placeholder="https://..."
                    />
                  </div>
                  <div className="form-group">
                    <label>Fallback Emoji</label>
                    <input
                      type="text"
                      value={newItem.fallbackEmoji}
                      onChange={(e) =>
                        setNewItem({
                          ...newItem,
                          fallbackEmoji: e.target.value,
                        })
                      }
                      placeholder="🍽️"
                    />
                  </div>
                  <div className="form-group full-width">
                    <label>Description</label>
                    <textarea
                      value={newItem.description}
                      onChange={(e) =>
                        setNewItem({ ...newItem, description: e.target.value })
                      }
                      rows="3"
                    />
                  </div>
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn-success">
                    Add Item
                  </button>
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => setShowAddForm(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {editingItem && (
              <form onSubmit={saveEdit} className="add-item-form">
                <h3>Edit Menu Item</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Name *</label>
                    <input
                      type="text"
                      value={editingItem.name}
                      onChange={(e) =>
                        setEditingItem({ ...editingItem, name: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Price (NOK) *</label>
                    <input
                      type="number"
                      value={editingItem.price}
                      onChange={(e) =>
                        setEditingItem({
                          ...editingItem,
                          price: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Category</label>
                    <select
                      value={editingItem.category}
                      onChange={(e) =>
                        setEditingItem({
                          ...editingItem,
                          category: e.target.value,
                        })
                      }
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Image URL</label>
                    <input
                      type="url"
                      value={editingItem.image}
                      onChange={(e) =>
                        setEditingItem({
                          ...editingItem,
                          image: e.target.value,
                        })
                      }
                      placeholder="https://..."
                    />
                  </div>
                  <div className="form-group">
                    <label>Fallback Emoji</label>
                    <input
                      type="text"
                      value={editingItem.fallbackEmoji}
                      onChange={(e) =>
                        setEditingItem({
                          ...editingItem,
                          fallbackEmoji: e.target.value,
                        })
                      }
                      placeholder="🍽️"
                    />
                  </div>
                  <div className="form-group full-width">
                    <label>Description</label>
                    <textarea
                      value={editingItem.description}
                      onChange={(e) =>
                        setEditingItem({
                          ...editingItem,
                          description: e.target.value,
                        })
                      }
                      rows="3"
                    />
                  </div>
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn-success">
                    Save Changes
                  </button>
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => setEditingItem(null)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            <div className="menu-items-grid">
              {menuItems.map((item) => (
                <div
                  key={item.id}
                  className={`menu-management-card ${
                    !item.available ? "unavailable" : ""
                  }`}
                >
                  <div className="item-image">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.nextSibling.style.display = "block";
                        }}
                      />
                    ) : null}
                    <div
                      className="emoji-fallback"
                      style={{ display: item.image ? "none" : "block" }}
                    >
                      {item.fallbackEmoji}
                    </div>
                  </div>

                  <div className="item-info">
                    <h3>{item.name}</h3>
                    <p className="category">{item.category}</p>
                    <p className="price">{item.price} NOK</p>
                    <p className="description">{item.description}</p>
                  </div>

                  <div className="item-actions">
                    <button
                      className={`availability-toggle ${
                        item.available === true ? "available" : "unavailable"
                      }`}
                      onClick={() => {
                        console.log(
                          "Button clicked for item:",
                          item.name,
                          "ID:",
                          item.id,
                          "ID Type:",
                          typeof item.id,
                          "Current available:",
                          item.available
                        );

                        // Check if this is a Firebase document (string ID) or default item (numeric ID)
                        if (typeof item.id === "number") {
                          console.warn(
                            "Item has numeric ID - this is likely a default item that needs to be properly added to Firebase"
                          );
                          const shouldReset = confirm(
                            `This item (${item.name}) has a numeric ID and cannot be updated.\n\nWould you like to reset the database with clean data?\n\nThis will delete ALL current items and add fresh ones.`
                          );
                          if (shouldReset) {
                            resetDatabase();
                          }
                          return;
                        }

                        toggleAvailability(item.id, item.available === true);
                      }}
                    >
                      {item.available === true
                        ? "✅ Available"
                        : "❌ Unavailable"}
                    </button>
                    <button
                      className="btn-edit"
                      onClick={() => startEdit(item)}
                    >
                      ✏️ Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case "qr":
        return (
          <div className="menu-management-section">
            <div className="management-header">
              <h2>QR Code Generator</h2>
            </div>

            <div className="add-item-form">
              <h3>Generate QR Code for Menu</h3>
              <div
                className="qr-display"
                style={{ textAlign: "center", margin: "30px 0" }}
              >
                {qrCode && (
                  <div className="qr-code-container">
                    <img
                      src={qrCode}
                      alt="Restaurant Menu QR Code"
                      style={{
                        border: "2px solid #ffd700",
                        borderRadius: "8px",
                        padding: "20px",
                        background: "white",
                        maxWidth: "300px",
                        width: "100%",
                      }}
                    />
                    <p
                      style={{
                        marginTop: "15px",
                        color: "#ffd700",
                        fontWeight: "bold",
                      }}
                    >
                      Scan to view menu and place order
                    </p>
                  </div>
                )}
              </div>

              <div className="form-grid">
                <div className="form-group full-width">
                  <label htmlFor="url">Menu URL:</label>
                  <input
                    type="url"
                    id="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://your-restaurant.com"
                  />
                </div>
              </div>

              <div className="form-actions">
                <button className="btn-primary" onClick={() => generateQR(url)}>
                  Generate QR Code
                </button>
                {qrCode && (
                  <button className="btn-success" onClick={handleDownload}>
                    Download QR Code
                  </button>
                )}
              </div>
            </div>

            <div className="add-item-form">
              <h3>How to use:</h3>
              <ol
                style={{ marginLeft: "20px", marginTop: "10px", color: "#fff" }}
              >
                <li style={{ margin: "8px 0" }}>
                  Print the QR code and place it on your restaurant tables
                </li>
                <li style={{ margin: "8px 0" }}>
                  Customers scan the code with their phone camera
                </li>
                <li style={{ margin: "8px 0" }}>
                  They'll be directed to your menu to place orders
                </li>
                <li style={{ margin: "8px 0" }}>
                  Monitor orders in the Orders tab
                </li>
              </ol>
            </div>
          </div>
        );

      case "users":
        // Only show user management for master admin
        if (userRole !== 'master') {
          return (
            <div className="menu-management-section">
              <div className="management-header">
                <h2>Access Denied</h2>
              </div>
              <div className="add-item-form">
                <h3>⚠️ Insufficient Permissions</h3>
                <p style={{ color: '#fff', textAlign: 'center' }}>
                  User management is only available to master admin users.
                </p>
              </div>
            </div>
          );
        }
        
        return (
          <div className="menu-management-section">
            <UserManagement />
          </div>
        );

      default:
        return null;
    }
  };

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
            <h1>Admin Dashboard</h1>
          </div>
        </div>

        <div className="admin-info">
          <div className="user-info">
            <span className="user-role">
              {userRole === "master" ? "👑 Master Admin" : "👤 Staff Admin"}
            </span>
            <span className="user-name">
              {user?.username || user?.email || "Admin"}
            </span>
          </div>
          <button className="logout-button" onClick={logout} title="Logout">
            🚪 Logout
          </button>
        </div>
      </header>

      <main className="main" style={{ gridTemplateColumns: "1fr" }}>
        <div className="admin-navigation">
          <button
            className={`nav-link ${activeTab === "orders" ? "active" : ""}`}
            onClick={() => setActiveTab("orders")}
          >
            📋 Orders
          </button>
          <button
            className={`nav-link ${activeTab === "menu" ? "active" : ""}`}
            onClick={() => setActiveTab("menu")}
          >
            🍽️ Menu Management
          </button>
          <button
            className={`nav-link ${activeTab === "qr" ? "active" : ""}`}
            onClick={() => setActiveTab("qr")}
          >
            📱 QR Generator
          </button>
          {userRole === 'master' && (
            <button
              className={`nav-link ${activeTab === "users" ? "active" : ""}`}
              onClick={() => setActiveTab("users")}
            >
              👥 User Management
            </button>
          )}
        </div>

        {renderTabContent()}
      </main>
    </div>
  );
}

export default function Admin() {
  return (
    <ProtectedRoute>
      <AdminDashboard />
    </ProtectedRoute>
  );
}
