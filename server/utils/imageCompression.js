const sharp = require('sharp');

const compressImage = async (base64String, quality = 80, maxDimensions = 1200) => {
  try {
    // Extract the actual base64 data
    const base64Data = base64String.split(';base64,').pop();
    const buffer = Buffer.from(base64Data, 'base64');

    // Compress the image
    const compressedBuffer = await sharp(buffer)
      .resize(maxDimensions, maxDimensions, { // Max dimensions
        fit: 'inside',
        withoutEnlargement: true
      })
      .jpeg({ quality: quality }) // Adjustable quality
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
