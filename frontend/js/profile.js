document.addEventListener('DOMContentLoaded', function() {
  const socket = io('http://localhost:5000'); // Подключение к серверу по веб-сокетам

  // Обработчик отправки заявки на сервер
  document.getElementById('certificateForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const certificateDetails = document.getElementById('certificateDetails').value;
    socket.emit('certificateRequest', { details: certificateDetails }); // Отправка заявки на сервер
  });
});
