import geoip from 'geoip-lite';
import requestIp from 'request-ip';

export const getUserRegion = async (req, res) => {
  try {
    // 1. Get IP (works with app.set('trust proxy', true))
    const ip = req.clientIp || req.ip;

    // 2. Fallback for local testing
    const testIp = process.env.NODE_ENV === 'development' 
      ? '182.73.182.62' // Mumbai IP
      : ip;

    // 3. Get location
    const geo = geoip.lookup(testIp);
    
    // 4. Always return success with fallbacks
    res.json({
      success: true,
      country: geo?.country || 'IN',
      region: geo?.region || 'Unknown',
      city: geo?.city || 'Unknown'
    });

  } catch (error) {
    // 5. Critical: Never fail OTP flow
    res.json({
      success: true, // ← Note: Still success
      country: 'IN',
      region: 'Unknown',
      city: 'Unknown'
    });
  }
};