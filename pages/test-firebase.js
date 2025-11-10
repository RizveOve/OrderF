import { addDoc, collection, getDocs } from 'firebase/firestore';
import { useState } from 'react';
import { db } from '../lib/firebase';

export default function TestFirebase() {
  const [status, setStatus] = useState('');
  const [orders, setOrders] = useState([]);

  const testWrite = async () => {
    setStatus('Testing write...');
    try {
      const testData = {
        test: true,
        timestamp: new Date(),
        message: 'Firebase connection test'
      };
      
      const docRef = await addDoc(collection(db, 'orders'), testData);
      setStatus(`✅ Write successful! Document ID: ${docRef.id}`);
    } catch (error) {
      setStatus(`❌ Write failed: ${error.message}`);
      console.error('Firebase write error:', error);
    }
  };

  const testRead = async () => {
    setStatus('Testing read...');
    try {
      const querySnapshot = await getDocs(collection(db, 'orders'));
      const ordersData = [];
      querySnapshot.forEach((doc) => {
        ordersData.push({ id: doc.id, ...doc.data() });
      });
      setOrders(ordersData);
      setStatus(`✅ Read successful! Found ${ordersData.length} orders`);
    } catch (error) {
      setStatus(`❌ Read failed: ${error.message}`);
      console.error('Firebase read error:', error);
    }
  };

  return (
    <div className="container">
      <header className="header">
        <h1>🔧 Firebase Test</h1>
        <p>Test your Firebase connection</p>
      </header>

      <main className="main" style={{ gridTemplateColumns: '1fr' }}>
        <div style={{ background: 'white', padding: '30px', borderRadius: '12px' }}>
          <div style={{ marginBottom: '20px' }}>
            <button onClick={testWrite} className="btn-primary" style={{ marginRight: '10px' }}>
              Test Write
            </button>
            <button onClick={testRead} className="btn-secondary">
              Test Read
            </button>
          </div>

          <div style={{ marginBottom: '20px', padding: '15px', background: '#f8f9fa', borderRadius: '8px' }}>
            <strong>Status:</strong> {status || 'Click a button to test Firebase'}
          </div>

          {orders.length > 0 && (
            <div>
              <h3>Orders in Database:</h3>
              <pre style={{ background: '#f8f9fa', padding: '15px', borderRadius: '8px', overflow: 'auto' }}>
                {JSON.stringify(orders, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}