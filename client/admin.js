const triggerSend = document.querySelector('.trigger-send');
const titreVal = document.querySelector('.input-titre');
const messageVal = document.querySelector('.input-message');




async function triggerSendNotification(message, titre) {
  let formData = {
    "titre": titre,
    "message": message
  }

  await fetch('/subscribe', {
    method: 'POST',
    body: JSON.stringify(formData),
    headers: {
      'Content-Type': 'application/json',
    },
  });
}



triggerSend.addEventListener('click', () => {
  let titre = titreVal.value;
  let message = messageVal.value;
  triggerSendNotification(message, titre).catch(error => console.error(error));
});