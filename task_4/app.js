const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const dbConfig = {
  host: process.env.DB_HOST || 'mysql',
  user: process.env.DB_USER || 'user',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'videodb',
};

app.get('/', async (req, res) => {
  res.send('Hello World');
});

app.post('/v1/api/rest/video/PAGINATE', async (req, res) => {
  try {
    const page = parseInt(req.body.page) || 1;
    const limit = parseInt(req.body.limit) || 10;
    const offset = (page - 1) * limit;

    const connection = await mysql.createConnection(dbConfig);

    // Get total count
    const [countResult] = await connection.execute('SELECT COUNT(*) as total FROM videos');
    const total = countResult[0].total;

    // Fetch paginated videos
    const [rows] = await connection.query(
      `SELECT 
        id, title, photo, user_id, created_at, updated_at, likes
       FROM videos
       LIMIT ?, ?`,
      [offset, limit]
    );

    await connection.end();

    res.status(200).json({
      error: false,
      list: rows,
      page,
      limit,
      total,
      num_pages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: true, message: 'Internal server error' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
