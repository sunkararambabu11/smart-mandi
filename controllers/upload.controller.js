const cloudinary = require('../config/cloudinary');

exports.uploadProductMedia = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'File is required' });
    }

    const base64 = req.file.buffer.toString('base64');
    const dataUri = `data:${req.file.mimetype};base64,${base64}`;

    const result = await cloudinary.uploader.upload(dataUri, {
      folder: 'smart-mandi/products',
      resource_type: 'auto'
    });

    return res.status(200).json({
      message: 'Uploaded successfully',
      url: result.secure_url,
      publicId: result.public_id,
      type: req.file.mimetype.startsWith('video') ? 'VIDEO' : 'IMAGE'
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};
