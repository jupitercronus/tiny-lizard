// api/tmdb.js

// This is a Vercel Serverless Function for Node.js
// It acts as a proxy to hide your TMDb API key.

// IMPORTANT: Your TMDb API key should be stored as an Environment Variable in Vercel.
// Name: TMDB_API_KEY
// Value: Your actual TMDb API Key (v3 auth)

module.exports = async (req, res) => {
    // Get the TMDb API key from Vercel's environment variables
    const TMDB_API_KEY = process.env.TMDB_API_KEY;
  
    // Basic validation for the API key
    if (!TMDB_API_KEY) {
      return res.status(500).json({ error: 'Server configuration error: TMDB_API_KEY not set.' });
    }
  
    // Extract the TMDb endpoint and query from the request path
    // Example: /api/tmdb/search/movie?query=Inception
    // We want: /search/movie?query=Inception
    const path = req.url.split('/api/tmdb')[1]; // Get everything after /api/tmdb
    
    // Construct the full TMDb URL
    // The base URL for TMDb API
    const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
    const fullTmdbUrl = `${TMDB_BASE_URL}${path}&api_key=${TMDB_API_KEY}`;
  
    console.log(`Proxying request to: ${fullTmdbUrl}`);
  
    try {
      // Make the request to TMDb
      const tmdbResponse = await fetch(fullTmdbUrl, {
        method: req.method, // Use the same HTTP method as the incoming request (GET)
        headers: {
          'Content-Type': 'application/json',
          // Forward any other relevant headers if needed, but for GET, usually not.
        },
      });
  
      // Handle TMDb's response
      if (!tmdbResponse.ok) {
        const errorText = await tmdbResponse.text();
        console.error(`TMDb API returned an error: ${tmdbResponse.status} ${errorText}`);
        return res.status(tmdbResponse.status).json({
          error: `TMDb API error: ${tmdbResponse.statusText}`,
          details: errorText,
        });
      }
  
      const data = await tmdbResponse.json();
  
      // Send TMDb's response back to the client
      res.status(200).json(data);
  
    } catch (error) {
      console.error('Proxy request failed:', error);
      res.status(500).json({ error: 'Failed to proxy request to TMDb.', details: error.message });
    }
  };