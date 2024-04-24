async function login() {
  const phoneNumber = document.getElementById('phoneNumber').value;
  const password = document.getElementById('password').value;

  const response = await fetch('http://localhost:5000/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ phoneNumber, password })
  });

  const result = await response.json();
  const { token, role } = result;

  localStorage.setItem('token', token);
  localStorage.setItem('role', role); // Сохраняем роль пользователя в локальном хранилище

  // Перенаправление на соответствующую страницу в зависимости от роли
  if (role === 'admin') {
    window.location.href = '/frontend/profileadmin.html'; // Замените на путь к странице администратора
  } else if (role === 'user') {
    window.location.href = '/frontend/profileuser.html'; // Замените на путь к странице пользователя
  } else {
    // Обработка случая, когда роль не определена или неизвестна
    console.error('Unknown role:', role);
  }
}
