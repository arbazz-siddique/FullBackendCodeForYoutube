import geoip from 'geoip-lite';
import requestIp from 'request-ip';

export const getUserRegion = async (req, res) => {
  try {
    // 1. Get IP address (works on Render.com)
    const clientIp = requestIp.getClientIp(req); 
    
    // 2. Use test IPs during development
    const testIps = {
      localhost: '182.73.182.62', // Mumbai IP
      render: '54.210.1.100'      // Sample AWS IP (Virginia)
    };
    
    const ip = process.env.NODE_ENV === 'development' 
      ? testIps.localhost 
      : clientIp;

    // 3. Get location from IP
    const geo = geoip.lookup(ip);
    
    // 4. Return structured response
    res.json({
      source: 'ip-api',
      country: geo?.country || 'IN',
      region: geo?.region || 'Unknown',
      city: geo?.city || 'Unknown',
      ip: ip
    });

  } catch (error) {
    // 5. Fallback response
    res.json({
      source: 'fallback',
      country: 'IN',
      region: 'Unknown',
      city: 'Unknown',
      ip: null
    });
  }
};