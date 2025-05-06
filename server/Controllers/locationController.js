import geoip from 'geoip-lite';

export const getUserRegion = (req, res) => {
  let ip = req.headers['x-forwarded-for']?.split(',')[0]  || req.connection.remoteAddress;

  // console.log('IP from request:', req.ip);
  // console.log('Detected IP address:', ip);

  // For localhost testing
  if (ip === '::1' || ip === '127.0.0.1' || ip === '::ffff:127.0.0.1') {
    ip = '182.73.182.62'; // Example IP from India for testing
  }

  const geo = geoip.lookup(ip);
  // console.log('Geo lookup result:', geo);

  if (geo) {
    res.status(200).json({
      region: geo.region,
      country: geo.country,
      city: geo.city,
    });
  } else {
    res.status(500).json({ message: 'Could not determine location' });
  }
};
