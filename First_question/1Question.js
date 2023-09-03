const express = require('express');
const axios = require('axios');

const app = express();
const port = 8008;

app.use(express.urlencoded({ extended: true }));

app.get('/numbers', async (req, res) => {
  const urls = req.query.url;

  if (!urls || !Array.isArray(urls)) {
    return res.status(400).json({ error: 'Invalid or missing "url" parameter(s)"' });
  }

  const uniqueNumbers = new Set();

  const fetchPromises = urls.map(async (url) => {
    try {
      const response = await axios.get(url, { timeout: 500 });
      const data = response.data.numbers;

      if (Array.isArray(data)) {
        data.forEach((num) => uniqueNumbers.add(num));
      }
    } catch (error) {
      console.error(`Error fetching from ${url}: ${error.message}`);
    }
  });

  try {
    await Promise.all(fetchPromises);
  } catch (error) {
    console.error('Error fetching data from one or more URLs:', error);
  }

  const mergedNumbers = Array.from(uniqueNumbers).sort((a, b) => a - b);

  res.json({ numbers: mergedNumbers });
});

app.listen(port, () => {
  console.log(`Number Management Service is listening on port ${port}`);
});