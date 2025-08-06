
const express = require('express');
const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');
const base64 = require('base-64');
const multer = require('multer')
const cors = require("cors");


dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

let db;

async function connectToMongo() {
  const client = new MongoClient(process.env.MONGO_URI);
  try {
    await client.connect();
    db = client.db('cognition-berries'); 
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
  }
}

connectToMongo();

// ---- Basic Authentication ----

async function basicAuth(req, res, next) {
  if (req.method === 'POST' && req.path === '/users') return next();

  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return res.status(401).json({ error: 'Missing Authorization Header' });
  }

  const base64Credentials = authHeader.split(' ')[1];
  const decoded = base64.decode(base64Credentials);
  const [email, password] = decoded.split(':');

  try {
    const user = await db.collection('Users').findOne({ email });
    if (!user || base64.decode(user.password) !== password) {
      return res.status(401).json({ error: 'Invalid Credentials' });
    }
    next(); // Authenticated
     user.joined_date = new Date().toISOString().split('T')[0]; // "YYYY-MM-DD"
    user.is_active = true;
  } catch (err) {
    res.status(500).json({ error: 'Authentication error' });
  }
}

// --- Apply middleware before routes ---


const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) =>
    cb(null, `${Date.now()}-${file.originalname}`),
});

const upload = multer({ storage });

app.post('/api/upload-profile', upload.single('profilePicture'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded.' });
  const imageUrl = `http://localhost:3000/uploads/${req.file.filename}`;
  return res.status(200).json({ imageUrl });
});

app.use('/uploads', express.static('uploads'));

app.use(basicAuth);

// === USERS ===
app.post('/users', async (req, res) => {
  const user = req.body;
  try {
    user.password = base64.encode(user.password);
    const result = await db.collection('Users').insertOne(user);
    res.status(201).json(result.ops ? result.ops[0] : user);
  } catch (err) {
    if (!user.email || !user.password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    res.status(500).json({ error: 'Failed to create user' });
  }
});

app.get('/protected', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return res.status(401).json({ error: 'Missing Authorization header' });
  }

  try {
    const encoded = authHeader.split(' ')[1];
    const decoded = Buffer.from(encoded, 'base64').toString('ascii'); // e.g., "user@example.com:password123"
    const [email, password] = decoded.split(':');

    const user = await db.collection('Users').findOne({ email });

    if (!user) {
      return res.status(401).json({ error: 'Invalid user' });
    }

   if (base64.decode(user.password) !== password) {
  return res.status(401).json({ error: 'Invalid password' });
}

    res.json({ message: 'Access granted' });
  } catch (err) {
    console.error('Error during auth:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.get('/users', async (req, res) => {
  try {
    const users = await db.collection('Users').find().toArray();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

app.get('/users/:email', async (req, res) => {
  try {
    const user = await db.collection('Users').findOne({ email: req.params.email });
    user ? res.json(user) : res.status(404).json({ message: 'User not found' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to get user' });
  }
});

app.put('/users/:email', async (req, res) => {
  try {
    const updates = req.body;
    if (updates.password) updates.password = base64.encode(updates.password);
    const result = await db.collection('Users').findOneAndUpdate(
      { email: req.params.email },
      { $set: updates },
      { returnDocument: 'after' }
    );
    result.value ? res.json(result.value) : res.status(404).json({ message: 'User updated' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update user' });
  }
});

app.delete('/users/:email', async (req, res) => {
  try {
    const result = await db.collection('Users').deleteOne({ email: req.params.email });
    result.deletedCount ? res.json({ message: 'User deleted' }) : res.status(404).json({ message: 'User not found' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// === COURSES ===
app.post('/courses', async (req, res) => {
  try {
    const course = req.body;
    const result = await db.collection('material-courses').insertOne(course);
    res.status(201).json(result.ops ? result.ops[0] : course);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create course' });
  }
});

app.get('/courses', async (req, res) => {
  try {
    const courses = await db.collection('material-courses').find().toArray();
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
});

app.get('/courses/:id', async (req, res) => {
  try {
    const course = await db.collection('material-courses').findOne({ course_id: req.params.id });
    course ? res.json(course) : res.status(404).json({ message: 'Course not found' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to get course' });
  }
});

app.put('/courses/:id', async (req, res) => {
  try {
    const updates = req.body;
    const result = await db.collection('material-courses').findOneAndUpdate(
      { course_id: req.params.id },
      { $set: updates },
      { returnOriginal: 'after' } 
    );
    result.value ? res.json(result.value) : res.status(404).json({ message: 'Course not found' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update course' });
  }
});

app.delete('/courses/:id', async (req, res) => {
  try {
    const result = await db.collection('material-courses').deleteOne({ course_id: req.params.id });
    result.deletedCount ? res.json({ message: 'Course deleted' }) : res.status(404).json({ message: 'Course not found' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete course' });
  }
});

// === TRANSACTIONS ===
app.post('/transactions', async (req, res) => {
  try {
    const txn = req.body;
    const result = await db.collection('transactions').insertOne(txn);
    res.status(201).json(result.ops ? result.ops[0] : txn);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create transaction' });
  }
});

app.get('/transactions', async (req, res) => {
  try {
    const txns = await db.collection('transactions').find().toArray();
    res.json(txns);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

app.get('/transactions/:payment_id', async (req, res) => {
  try {
    const txn = await db.collection('transactions').findOne({ payment_id: req.params.payment_id });
    txn ? res.json(txn) : res.status(404).json({ message: 'Transaction not found' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to get transaction' });
  }
});

app.put('/transactions/:payment_id', async (req, res) => {
  try {
    const updates = req.body;
    const result = await db.collection('transactions').findOneAndUpdate(
      { payment_id: req.params.payment_id },
      { $set: updates },
      { returnDocument: 'after' }
    );
    result.value ? res.json(result.value) : res.status(404).json({ message: 'Transaction not found' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update transaction' });
  }
});

app.delete('/transactions/:payment_id', async (req, res) => {
  try {
    const result = await db.collection('transactions').deleteOne({ payment_id: req.params.payment_id });
    result.deletedCount ? res.json({ message: 'Transaction deleted' }) : res.status(404).json({ message: 'Transaction not found' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete transaction' });
  }
});

// === CART ===
app.post('/cart', async (req, res) => {
  try {
    const item = req.body;
    const result = await db.collection('Cart').insertOne(item);
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add to cart' });
  }
});

app.get('/cart', async (req, res) => {
  try {
    const items = await db.collection('Cart').find().toArray();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: 'Failed to get cart items' });
  }
});

app.put('/cart/:id', async (req, res) => {
  try {
    const result = await db.collection('Cart').findOneAndUpdate(
      { id: req.params.id },
      { $set: req.body },
      { returnDocument: 'after' }
    );
    result.value
      ? res.json(result.value)
      : res.status(404).json({ message: 'Cart item not found' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update cart item' });
  }
});

app.delete('/cart/:id', async (req, res) => {
  try {
    const result = await db.collection('Cart').deleteOne({ id: req.params.id });
    result.deletedCount
      ? res.json({ message: 'Cart item deleted' })
      : res.status(404).json({ message: 'Cart item not found' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete cart item' });
  }
});

// === FORUM POSTS ===
app.post('/forum-posts', async (req, res) => {
  try {
    const post = req.body;
    const result = await db.collection('forum-posts').insertOne(post);
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create forum post' });
  }
});

app.get('/forum-posts', async (req, res) => {
  try {
    const posts = await db.collection('forum-posts').find().toArray();
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: 'Failed to get forum posts' });
  }
});

app.put('/forum-posts/:id', async (req, res) => {
  try {
    const result = await db.collection('forum-posts').findOneAndUpdate(
      { post_id: req.params.id },
      { $set: req.body },
      { returnDocument: 'after' }
    );
    result.value
      ? res.json(result.value)
      : res.status(404).json({ message: 'Forum post not found' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update forum post' });
  }
});

app.delete('/forum-posts/:id', async (req, res) => {
  try {
    const result = await db.collection('forum-posts').deleteOne({ post_id: req.params.id });
    result.deletedCount
      ? res.json({ message: 'Forum post deleted' })
      : res.status(404).json({ message: 'Forum post not found' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete forum post' });
  }
});

// === FORUM REPLIES ===
app.post('/forum-replies', async (req, res) => {
  try {
    const reply = req.body;
    const result = await db.collection('forum-replies').insertOne(reply);
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create reply' });
  }
});

app.get('/forum-replies', async (req, res) => {
  try {
    const replies = await db.collection('forum-replies').find().toArray();
    res.json(replies);
  } catch (err) {
    res.status(500).json({ error: 'Failed to get replies' });
  }
});

app.put('/forum-replies/:id', async (req, res) => {
  try {
    const result = await db.collection('forum-replies').findOneAndUpdate(
      { reply_id: req.params.id },
      { $set: req.body },
      { returnDocument: 'after' }
    );
    result.value
      ? res.json(result.value)
      : res.status(404).json({ message: 'Reply not found' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update reply' });
  }
});

app.delete('/forum-replies/:id', async (req, res) => {
  
  try {
    const result = await db.collection('forum-replies').deleteOne({ reply_id: req.params.id });
    result.deletedCount
      ? res.json({ message: 'Reply deleted' })
      : res.status(404).json({ message: 'Reply not found' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete reply' });
  }
});

// === LIVE SESSIONS ===
app.post('/live-sessions', async (req, res) => {
  try {
    const session = req.body;
    const result = await db.collection('live-sessions').insertOne(session);
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create live session' });
  }
});

app.get('/live-sessions', async (req, res) => {
  try {
    const sessions = await db.collection('live-sessions').find().toArray();
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ error: 'Failed to get sessions' });
  }
});

app.put('/live-sessions/:id', async (req, res) => {
  try {
    const result = await db.collection('live-sessions').findOneAndUpdate(
      { session_id: req.params.id },
      { $set: req.body },
      { returnDocument: 'after' }
    );
    result.value
      ? res.json(result.value)
      : res.status(404).json({ message: 'Session not found' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update session' });
  }
});

app.delete('/live-sessions/:id', async (req, res) => {
  try {
    const result = await db.collection('live-sessions').deleteOne({ session_id: req.params.id });
    result.deletedCount
      ? res.json({ message: 'Session deleted' })
      : res.status(404).json({ message: 'Session not found' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete session' });
  }
});

// === MATERIAL BOOKS ===
app.post('/material-books', async (req, res) => {
  try {
    const book = req.body;
    const result = await db.collection('material-books').insertOne(book);
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create book' });
  }
});

app.get('/material-books', async (req, res) => {
  try {
    const books = await db.collection('material-books').find().toArray();
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: 'Failed to get books' });
  }
});

app.put('/material-books/:id', async (req, res) => {
  try {
    const result = await db.collection('material-books').findOneAndUpdate(
      { book_id: req.params.id },
      { $set: req.body },
      { returnDocument: 'after' }
    );
    result.value
      ? res.json(result.value)
      : res.status(404).json({ message: 'Book not found' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update book' });
  }
});

app.delete('/material-books/:id', async (req, res) => {
  try {
    const result = await db.collection('material-books').deleteOne({ book_id: req.params.id });
    result.deletedCount
      ? res.json({ message: 'Book deleted' })
      : res.status(404).json({ message: 'Book not found' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete book' });
  }
});


app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
