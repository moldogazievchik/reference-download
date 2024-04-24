const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
require('dotenv').config();
const multer = require('multer');
const path = require('path');
const fs = require('fs');


const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors({
  origin: 'http://localhost:3000'
}));

// Подключение к базе данных PostgreSQL
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'base',
  password: '(101010)',
  port: 5432,
});

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

function generateToken(userId) {
  const token = jwt.sign({ userId }, 'your_secret_key');
  return token;
}

// Middleware для проверки авторизации пользователя
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1]; 
    const decodedToken = jwt.verify(token, 'your_secret_key'); 
    const userId = decodedToken.userId;
    req.user = { id: userId };
    next(); 
  } catch (error) {
    console.error('Error verifying token:', error);
    res.status(401).json({ message: 'Unauthorized' });
  }
};

// Обработчик для регистрации нового пользователя
app.post('/register', async (req, res) => {
  try {
    const { fullName, email, address, dob, gender, passportNumber, phoneNumber, password } = req.body;
    const result = await pool.query('INSERT INTO users (full_name, email, address, dob, gender, passport_number, phone_number, password) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)', 
      [fullName, email, address, dob, gender, passportNumber, phoneNumber, password]);
    res.status(200).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Обработчик для входа пользователя
app.post('/login', async (req, res) => {
  try {
    const { phoneNumber, password } = req.body;
    const user = await pool.query('SELECT id, role FROM users WHERE phone_number = $1 AND password = $2', [phoneNumber, password]);
    if (user.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid phone number or password' });
    }
    const role = user.rows[0].role;
    const token = generateToken(user.rows[0].id); 
    res.status(200).json({ token, role });
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Обработчик для получения информации о пользователе по токену
app.get('/getUserInfo', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
    if (user.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    const userData = user.rows[0];
    res.status(200).json(userData);
  } catch (error) {
    console.error('Error getting user info:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Обработчик для отправки заявления админу
app.post('/submitRequest', authMiddleware, async (req, res) => {
  try {
    const { requestText } = req.body;
    const adminEmailQuery = await pool.query('SELECT email FROM users WHERE role = $1', ['admin']);
    const adminEmail = adminEmailQuery.rows[0].email;
    const mailOptions = {
      from: 'crazyakti.ru@gmail.com',
      to: adminEmail,
      subject: 'Request',
      text: requestText
    };
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Request submitted successfully.' });
  } catch (error) {
    console.error('Error submitting request:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

app.post('/upload', authMiddleware, upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: 'File is required' });
    }
    // Сохранение пути к файлу в базе данных
    const filePath = `/uploads/${file.originalname}`;
    const result = await pool.query(
      'INSERT INTO files (name, user_id) VALUES ($1, $2)', [filePath, req.user.id]
    );
    // Сохранение файла на файловой системе
    fs.writeFileSync(path.join(__dirname, 'uploads', file.originalname), file.buffer);
    res.status(200).json({ message: 'File uploaded successfully' });
  } catch (error) { 
    console.error('Error uploading file to database:', error); 
    res.status(500).json({ message: 'Internal server error' }); 
  } 
});



app.get('/downloadFile/:fileId', authMiddleware, async (req, res) => {
  try {
    const fileId = req.params.fileId;
    // Получение пути к файлу из базы данных
    const result = await pool.query('SELECT name FROM files WHERE user_id = $1', [req.user.id]);
    if (result.rows.length === 0) {
      throw new Error('File not found');
    }
    const filePath = result.rows[0].name;
    res.download(path.join(__dirname, filePath)); // Отправка файла клиенту
  } catch (error) {
    console.error('Error downloading file:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});



app.listen(port, () => { 
  console.log(`Server is running on port ${port}`); 
});
