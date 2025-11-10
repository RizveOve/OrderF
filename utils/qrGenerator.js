import QRCode from 'qrcode';

export const generateQRCode = async (url) => {
  try {
    const qrCodeDataURL = await QRCode.toDataURL(url, {
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });
    return qrCodeDataURL;
  } catch (error) {
    console.error('Error generating QR code:', error);
    return null;
  }
};

export const downloadQRCode = (dataURL, filename = 'restaurant-qr-code.png') => {
  const link = document.createElement('a');
  link.download = filename;
  link.href = dataURL;
  link.click();
};