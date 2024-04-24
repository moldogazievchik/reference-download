$(document).ready(function() {
  $('#registerForm').submit(function(event) {
      event.preventDefault(); // Предотвращаем стандартное поведение формы (отправку данных и перезагрузку страницы)

      // Получаем данные формы
      var formData = {
          fullName: $('#fullName').val(),
          email: $('#email').val(),
          address: $('#address').val(),
          dob: $('#dob').val(),
          gender: $('#gender').val(),
          passportNumber: $('#passportNumber').val(),
          phoneNumber: $('#phoneNumber').val(),
          password: $('#password').val()
      };

      // Отправляем POST-запрос на сервер для регистрации
      $.ajax({
          type: 'POST',
          url: 'http://localhost:5000/register', // Замените на URL вашего сервера
          data: JSON.stringify(formData),
          contentType: 'application/json',
          success: function(response) {
              // При успешной регистрации выводим сообщение и перенаправляем на страницу входа
              alert(response.message);
              window.location.href = 'login.html'; // Замените на URL страницы входа
          },
          error: function(xhr, status, error) {
              // В случае ошибки выводим сообщение об ошибке
              var errorMessage = xhr.responseJSON ? xhr.responseJSON.message : 'Произошла ошибка при регистрации';
              alert(errorMessage);
          }
      });
  });
});
