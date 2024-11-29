import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getDatabase, ref, set, onChildAdded, get } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js";

// Firebase configuration object
const firebaseConfig = {
  apiKey: "AIzaSyD5nyFcSk4UP9bEsxoHpsrpX0KKDV-Z5Pk",
  authDomain: "usersai.firebaseapp.com",
  databaseURL: "https://usersai-default-rtdb.firebaseio.com",
  projectId: "usersai",
  storageBucket: "usersai.appspot.com",
  messagingSenderId: "755207786553",
  appId: "1:755207786553:android:660de8edf0e99ddd08fde8",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

let kodeinput = null; // Variable to hold the user-input 'kodeinput'

// Show the dialog to get 'kodeinput' from the user
document.addEventListener("DOMContentLoaded", () => {
  const dialogBox = document.getElementById("dialog-box");
  dialogBox.style.display = "block";

  // When the user clicks "Set Kode", hide the dialog and start interacting with the chat
  document.getElementById("set-kode-button").addEventListener("click", () => {
    kodeinput = document.getElementById("kode-input").value.trim();
    if (kodeinput === "") {
      alert("Please enter a valid kode.");
      return;
    }
    dialogBox.style.display = "none";
    fetchMessages(kodeinput); // Fetch messages for the given kodeinput folder
  });
});

// Function to get the next message ID
async function getNextMessageId(kodeinput) {
  const messagesRef = ref(database, `putra03/${kodeinput}`);
  const snapshot = await get(messagesRef);
  const data = snapshot.val();

  let lastId = 0;
  if (data) {
    const ids = Object.keys(data);
    lastId = Math.max(...ids.map((id) => parseInt(id, 10)));
  }

  return String(lastId + 1).padStart(4, "0");
}

// Function to send a message
async function sendMessage() {
  const userInput = document.getElementById("user-input");
  const message = userInput.value.trim();
  if (message === "" || !kodeinput) return;

  const newId = await getNextMessageId(kodeinput);

  const messageRef = ref(database, `putra03/${kodeinput}/${newId}`);
  set(messageRef, {
    sender: "me",
    content: message,
    timestamp: Date.now(),
  });

  displayMessage("me", message, newId, kodeinput);

  userInput.value = ""; // Clear input field
}

// Function to display messages
function displayMessage(sender, message, id, kodeinput) {
  const chatBox = document.getElementById("chat-box");

  const newMessageContainer = document.createElement("div");
  newMessageContainer.classList.add("message-container");

  const usernameElement = document.createElement("div");
  usernameElement.classList.add("username");
  usernameElement.textContent = sender === "me" ? "MPutraRamadhani" : "Chat Ai";

  const profileImage = document.createElement("img");
  profileImage.src =
    sender === "me"
      ? "https://firebasestorage.googleapis.com/v0/b/usersai.appspot.com/o/images.png?alt=media&token=a7485730-b2dd-42b3-bebd-7591ce21ed6d"
      : "https://firebasestorage.googleapis.com/v0/b/usersai.appspot.com/o/20241126_064631.jpg?alt=media&token=5da7dbc3-de88-4621-966d-c48d5963d3d9";
  profileImage.classList.add("profile-image");

  const messageWrapper = document.createElement("div");
  messageWrapper.classList.add("message-wrapper");

  const newMessage = document.createElement("div");
  newMessage.classList.add("message");
  newMessage.textContent = message;

  messageWrapper.appendChild(usernameElement);
  messageWrapper.appendChild(newMessage);
  newMessageContainer.appendChild(profileImage);
  newMessageContainer.appendChild(messageWrapper);
  chatBox.appendChild(newMessageContainer);

  chatBox.scrollTop = chatBox.scrollHeight;
}

// Function to fetch messages for the selected `kodeinput`
function fetchMessages(kodeinput) {
  const messagesRef = ref(database, `putra03/${kodeinput}`);
  onChildAdded(messagesRef, (snapshot) => {
    const messageData = snapshot.val();
    displayMessage(messageData.sender, messageData.content, snapshot.key, kodeinput);
  });
}

// Attach event to send message button
document.getElementById("send-button").addEventListener("click", sendMessage);
