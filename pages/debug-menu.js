import { collection, getDocs, onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from '../lib/firebase';

export default function DebugMenu() {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('Starting Firebase connection test...');
    
    // Test with getDocs first
    const testConnection = async () => {
      try {
        console.log('Testing getDocs...');
        const querySnapshot = await getDocs(collection(db, 'menuItems'));
        const items = [];
        querySnapshot.forEach((doc) => {
          items.push({ id: doc.id, ...doc.data() });
        });
        console.log('getDocs result:', items.length, 'items');
        setMenuItems(items);
        setLoading(false);
      } catch (err) {
        console.error('getDocs error:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    testConnection();

    // Also test real-time listener
    const unsubscribe = onSnapshot(
      collection(db, 'menuItems'), 
      (snapshot) => {
        console.log('onSnapshot triggered, docs:', snapshot.docs.length);
        const items = [];
        snapshot.forEach((doc) => {
          console.log('Doc:', doc.id, doc.data());
          items.push({ id: doc.id, ...doc.data() });
        });
        console.log('onSnapshot result:', items.length, 'items');
      },
      (err) => {
        console.error('onSnapshot error:', err);
        setError(err.message);
      }
    );

    return () => unsubscribe();
  }, []);

  return (
    <div className="container">
      <header className="header">
        <h1>🔧 Debug Menu</h1>
        <p>Testing Firebase connection and menu loading</p>
      </header>

      <main className="main" style={{ gridTemplateColumns: '1fr' }}>
        <div style={{ background: 'white', padding: '30px', borderRadius: '12px' }}>
          <h2>Debug Information</h2>
          
          {loading && <p>Loading...</p>}
          {error && <p style={{ color: 'red' }}>Error: {error}</p>}
          
          <div style={{ marginTop: '20px' }}>
            <h3>Menu Items Found: {menuItems.length}</h3>
            {menuItems.map((item, index) => (
              <div key={item.id || index} style={{ 
                border: '1px solid #ccc', 
                padding: '10px', 
                margin: '10px 0',
                borderRadius: '5px'
              }}>
                <strong>{item.name}</strong> - {item.price} NOK<br/>
                <small>Category: {item.category} | Available: {item.available ? 'Yes' : 'No'}</small><br/>
                <small>ID: {item.id}</small>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '30px' }}>
            <h3>Browser Console</h3>
            <p>Check the browser console (F12) for detailed logs</p>
          </div>
        </div>
      </main>
    </div>
  );
}