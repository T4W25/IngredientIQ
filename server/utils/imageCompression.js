// server/utils/imageCompression.js
const sharp = require('sharp');

const compressImage = async (base64String) => {
  try {
    // Extract the actual base64 data
    const base64Data = base64String.split(';base64,').pop();
    const buffer = Buffer.from(base64Data, 'base64');

    // Compress the image
    const compressedBuffer = await sharp(buffer)
      .resize(1200, 1200, { // Max dimensions
        fit: 'inside',
        withoutEnlargement: true
      })
      .jpeg({ quality: 80 }) // Adjust quality as needed
      .toBuffer();

    // Convert back to base64
    const compressedBase64 = `data:image/jpeg;base64,${compressedBuffer.toString('base64')}`;
    return compressedBase64;
  } catch (error) {
    console.error('Image compression error:', error);
    return base64String; // Return original if compression fails
  }
};

module.exports = { compressImage };