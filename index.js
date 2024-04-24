const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;

// Регистрация клиента
app.post('/register', (req, res) => {
  // Ваш код обработки регистрации здесь
  res.send('Клиент успешно зарегистрирован');
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
