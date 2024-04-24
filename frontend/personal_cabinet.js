document.addEventListener('DOMContentLoaded', function() {
  // Получаем данные пользователя из базы данных или localStorage (в зависимости от вашей реализации)
  const userData = JSON.parse(localStorage.getItem('userData')); // Предполагается, что данные пользователя сохранены в localStorage после авторизации

  // Отображаем приветственное сообщение с ФИО пользователя
  const welcomeMessageElement = document.getElementById('welcomeMessage');
  welcomeMessageElement.textContent = `Добро пожаловать, ${userData.fullName}! Это ваш личный кабинет.`;
});
