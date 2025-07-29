// api/tmdb.js

module.exports = async (req, res) => {
    const TMDB_API_KEY = process.env.TMDB_API_KEY;
  
    if (!TMDB_API_KEY) {
      return res.status(500).json({ error: 'Server configuration error: TMDB_API_KEY not set.' });
    }
  
    const path = req.url.split('/api/tmdb')[1];
    const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
    const fullTmdbUrl = `${TMDB_BASE_URL}${path}&api_key=${TMDB_API_KEY}`;
  
    console.log(`Proxying request to: ${fullTmdbUrl}`);
  
    try {
      const tmdbResponse = await fetch(fullTmdbUrl, {
        method: req.method,
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!tmdbResponse.ok) {
        const errorText = await tmdbResponse.text();
        console.error(`TMDb API returned an error: ${tmdbResponse.status} ${errorText}`);
        return res.status(tmdbResponse.status).json({
          error: `TMDb API error: ${tmdbResponse.statusText}`,
          details: errorText,
        });
      }
  
      const data = await tmdbResponse.json();
      res.status(200).json(data);
  
    } catch (error) {
      console.error('Proxy request failed:', error);
      res.status(500).json({ error: 'Failed to proxy request to TMDb.', details: error.message });
    }
  };