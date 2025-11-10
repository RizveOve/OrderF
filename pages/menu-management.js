import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../lib/firebase";

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

export default function MenuManagement() {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [newItem, setNewItem] = useState({
    name: "",
    price: "",
    category: "Combos & Salad",
    image: "",
    fallbackEmoji: "🍽️",
    description: "",
    available: true,
  });

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
    const unsubscribe = onSnapshot(
      collection(db, "menuItems"),
      (snapshot) => {
        const items = [];
        snapshot.forEach((doc) => {
          items.push({ id: doc.id, ...doc.data() });
        });

        console.log("Menu management loaded items:", items.length);

        // If no items in database and we haven't initialized yet, initialize with default items
        if (items.length === 0 && loading) {
          console.log("Initializing default menu...");
          initializeDefaultMenu();
        } else {
          setMenuItems(items);
          setLoading(false);
        }
      },
      (error) => {
        console.error("Error loading menu items:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [loading]);

  const initializeDefaultMenu = async () => {
    try {
      for (const item of defaultMenuItems) {
        await addDoc(collection(db, "menuItems"), item);
      }
      // Real-time listener will automatically update the menu
    } catch (error) {
      console.error("Error initializing menu:", error);
    }
  };

  const toggleAvailability = async (itemId, currentStatus) => {
    try {
      await updateDoc(doc(db, "menuItems", itemId), {
        available: !currentStatus,
      });

      setMenuItems((prev) =>
        prev.map((item) =>
          item.id === itemId ? { ...item, available: !currentStatus } : item
        )
      );
    } catch (error) {
      console.error("Error updating availability:", error);
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

  const cancelEdit = () => {
    setEditingItem(null);
  };

  const initializeAllItems = async () => {
    if (!confirm('This will add all 31 menu items to Firebase. Continue?')) return;
    
    try {
      console.log('Adding all menu items to Firebase...');
      for (const item of defaultMenuItems) {
        // Remove the id field since Firebase will generate its own
        const { id, ...itemData } = item;
        await addDoc(collection(db, 'menuItems'), itemData);
      }
      console.log('All menu items added successfully!');
      alert('All 31 menu items have been added to Firebase!');
    } catch (error) {
      console.error('Error adding menu items:', error);
      alert('Error adding menu items. Check console for details.');
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading menu items...</div>
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
          <div className="logo-text">
            <h1>Menu Management</h1>

          </div>
        </div>
      </header>

      <main className="main" style={{ gridTemplateColumns: "1fr" }}>
        <div className="admin-navigation">
          <a href="/admin" className="nav-link">
            📋 Orders
          </a>
          <a href="/menu-management" className="nav-link active">
            🍽️ Menu Management
          </a>
          <a href="/qr-generator" className="nav-link">
            📱 QR Generator
          </a>
        </div>

        <div className="menu-management-section">
          <div className="management-header">
            <h2>Menu Items ({menuItems.length})</h2>
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
            {menuItems.length < 31 && (
              <button 
                className="btn-success"
                onClick={initializeAllItems}
                style={{ marginLeft: '10px' }}
              >
                Initialize All 31 Items
              </button>
            )}
          </div>

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
                      setNewItem({ ...newItem, fallbackEmoji: e.target.value })
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
                      setEditingItem({ ...editingItem, price: e.target.value })
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
                      setEditingItem({ ...editingItem, image: e.target.value })
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
                  onClick={cancelEdit}
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
                      item.available ? "available" : "unavailable"
                    }`}
                    onClick={() => toggleAvailability(item.id, item.available)}
                  >
                    {item.available ? "✅ Available" : "❌ Unavailable"}
                  </button>
                  <button className="btn-edit" onClick={() => startEdit(item)}>
                    ✏️ Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
