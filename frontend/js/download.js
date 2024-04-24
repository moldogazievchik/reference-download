async function downloadFile() {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token is missing');
    }

    // Раскодируем токен
    const tokenPayload = JSON.parse(atob(token.split('.')[1]));

    // Получаем ID пользователя из токена
    const userId = tokenPayload.userId;

    // Используем ID пользователя в качестве fileId
    const fileId = userId;

    const response = await fetch(`http://localhost:5000/downloadFile/${fileId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    if (response.ok) {
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'file.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } else {
      throw new Error('Failed to download file');
    }
  } catch (error) {
    console.error('Error downloading file:', error);
    alert('Failed to download file');
  }
}


// Получаем кнопку "Download File"
const downloadButton = document.getElementById('downloadButton');

// Проверяем, существует ли кнопка
if (downloadButton) {
  // Если кнопка существует, добавляем обработчик события клика на нее
  downloadButton.addEventListener('click', async () => {
    downloadFile();
  });
} else {
  console.error('Download button not found');
}
