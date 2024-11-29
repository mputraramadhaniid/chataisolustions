document.addEventListener("DOMContentLoaded", function () {
  const inputField = document.getElementById("user-input");
  const sendButton = document.querySelector("button");

  // Disable both the input and button initially
  inputField.disabled = true;
  sendButton.disabled = true;

  // Example: Enable the input field and button after a certain action (e.g., user selects a chat)
  // This is just an example; you could replace it with any event you want
  setTimeout(() => {
    inputField.disabled = false;
    sendButton.disabled = false;
  }, 3000); // This will enable the input and button after 3 seconds
});
