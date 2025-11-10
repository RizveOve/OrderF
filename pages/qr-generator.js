import { useEffect, useState } from 'react';
import { downloadQRCode, generateQRCode } from '../utils/qrGenerator';

export default function QRGenerator() {
  const [qrCode, setQrCode] = useState('');
  const [url, setUrl] = useState('');

  useEffect(() => {
    // Get the current domain for the QR code
    if (typeof window !== 'undefined') {
      const currentUrl = window.location.origin;
      setUrl(currentUrl);
      generateQR(currentUrl);
    }
  }, []);

  const generateQR = async (targetUrl) => {
    const qrDataURL = await generateQRCode(targetUrl);
    if (qrDataURL) {
      setQrCode(qrDataURL);
    }
  };

  const handleDownload = () => {
    if (qrCode) {
      downloadQRCode(qrCode, 'restaurant-menu-qr.png');
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
            <h1>QR Generator</h1>

          </div>
        </div>
      </header>

      <main className="main" style={{ gridTemplateColumns: '1fr' }}>
        <div className="qr-generator-section">
          <div className="qr-display">
            {qrCode && (
              <div className="qr-code-container">
                <img src={qrCode} alt="Restaurant Menu QR Code" />
                <p>Scan to view menu and place order</p>
              </div>
            )}
          </div>

          <div className="qr-controls">
            <div className="url-input">
              <label htmlFor="url">Menu URL:</label>
              <input
                type="url"
                id="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://your-restaurant.com"
              />
              <button 
                className="btn-primary"
                onClick={() => generateQR(url)}
              >
                Generate QR Code
              </button>
            </div>

            {qrCode && (
              <button 
                className="btn-success btn-large"
                onClick={handleDownload}
              >
                Download QR Code
              </button>
            )}
          </div>

          <div className="instructions">
            <h3>How to use:</h3>
            <ol>
              <li>Print the QR code and place it on your restaurant tables</li>
              <li>Customers scan the code with their phone camera</li>
              <li>They'll be directed to your menu to place orders</li>
              <li>Monitor orders in the admin dashboard</li>
            </ol>
          </div>
        </div>
      </main>

      <style jsx>{`
        .qr-generator-section {
          background: white;
          padding: 40px;
          border-radius: 12px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          text-align: center;
        }

        .qr-code-container {
          margin: 30px 0;
        }

        .qr-code-container img {
          border: 1px solid #eee;
          border-radius: 8px;
          padding: 20px;
          background: white;
        }

        .qr-controls {
          margin: 30px 0;
        }

        .url-input {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-bottom: 20px;
        }

        .url-input input {
          padding: 12px;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 1rem;
        }

        .instructions {
          text-align: left;
          background: #f8f9fa;
          padding: 20px;
          border-radius: 8px;
          margin-top: 30px;
        }

        .instructions ol {
          margin-left: 20px;
          margin-top: 10px;
        }

        .instructions li {
          margin: 8px 0;
        }
      `}</style>
    </div>
  );
}