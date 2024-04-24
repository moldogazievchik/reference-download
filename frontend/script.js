document.addEventListener('DOMContentLoaded', function() {
  const registerForm = document.getElementById('registrationForm');
  const loginForm = document.getElementById('loginForm');
  const switchToLoginButton = document.getElementById('switchToLogin');
  const switchToRegisterButton = document.getElementById('switchToRegister');

  loginForm.style.display = 'none';

  switchToLoginButton.addEventListener('click', function(event) {
    event.preventDefault();
    registerForm.style.display = 'none';
    loginForm.style.display = 'block';
  });

  switchToRegisterButton.addEventListener('click', function(event) {
    event.preventDefault();
    loginForm.style.display = 'none';
    registerForm.style.display = 'block';
  });

  const loginButton = document.getElementById('loginButton');
  loginButton.addEventListener('click', function(event) {
    event.preventDefault();
    const loginPhoneNumber = document.getElementById('loginPhoneNumber').value;
    const password = document.getElementById('password').value;

    // Отправляем запрос на сервер для авторизации
    fetch('http://localhost:5000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email: loginPhoneNumber, password: password })
    })
    .then(response => response.json())
    .then(data => {
      // Выводим ответ сервера в консоль для отладки
      console.log(data);
      
      // В случае успешной авторизации скрываем форму и выполняем дополнительные действия
      loginForm.style.display = 'none';
      // Например, перенаправляем пользователя на страницу личного кабинета
      window.location.href = '/frontend/personal_cabinet.html';
    })
    .catch(error => console.error('Ошибка:', error));
  });
});
