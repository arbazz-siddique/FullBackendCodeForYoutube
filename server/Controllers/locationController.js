import geoip from 'geoip-lite';

// locationController.js
export const getUserRegion = (req, res) => {
  // Better IP detection for cloud environments
  const ip = req.ip || 
             req.headers['x-forwarded-for']?.split(',')[0] || 
             req.socket?.remoteAddress;

  // Test IPs should include Render's IP ranges
  if (ip === '::1' || ip === '127.0.0.1' || ip === '::ffff:127.0.0.1') {
    return res.status(200).json({
      region: 'Maharashtra', // Default Indian region
      country: 'IN',
      city: 'Mumbai'
    });
  }

  const geo = geoip.lookup(ip);
  if (geo) {
    return res.status(200).json(geo);
  }

  // Allow fallback when location can't be determined
  return res.status(200).json({
    region: 'Unknown',
    country: 'IN', // Default to India
    city: 'Unknown'
  });
};