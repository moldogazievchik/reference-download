
document.addEventListener('DOMContentLoaded', function() {
  const requestForm = document.getElementById('requestForm');
  requestForm.addEventListener('submit', async function(event) {
      event.preventDefault();
      
      const requestText = document.getElementById('requestText').value;

      const token = localStorage.getItem('token');
      if (!token) {
          // Если пользователь не авторизован, перенаправляем его на страницу входа
          window.location.href = '/frontend/login.html';
          return;
      }

      try {
          const response = await fetch('http://localhost:5000/submitRequest', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({ requestText })
          });

          if (response.ok) {
              alert('Request submitted successfully!');
          } else {
              console.error('Failed to submit request:', response.statusText);
          }
      } catch (error) {
          console.error('Error submitting request:', error);
      }
  });
});

