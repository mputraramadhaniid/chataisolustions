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

// Function to get the value of a query parameter from the URL
function getQueryParameter(name) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}

// Show the dialog to get 'kodeinput' from the user or use it from the URL
document.addEventListener("DOMContentLoaded", () => {
  const dialogBox = document.getElementById("dialog-box");
  kodeinput = getQueryParameter("kodeinput"); // Get 'kodeinput' from URL if available

  if (kodeinput) {
    // If 'kodeinput' is found in the URL, directly start fetching messages
    dialogBox.style.display = "none";
    fetchMessages(kodeinput); // Fetch messages for the given kodeinput folder
  } else {
    // Otherwise, show the dialog box for manual input
    dialogBox.style.display = "block";

    document.getElementById("set-kode-button").addEventListener("click", () => {
      kodeinput = document.getElementById("kode-input").value.trim();
      if (kodeinput === "") {
        alert("Please enter a valid kode.");
        return;
      }
      dialogBox.style.display = "none";
      fetchMessages(kodeinput); // Fetch messages for the given kodeinput folder
    });
  }
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

// Function to display messages with markdown support (e.g., **bold**)
function displayMessage(sender, message, id, kodeinput) {
  const chatBox = document.getElementById("chat-box");

  const newMessageContainer = document.createElement("div");
  newMessageContainer.classList.add("message-container");

  const usernameElement = document.createElement("div");
  usernameElement.classList.add("username");
  usernameElement.textContent = sender === "me" ? "You" : "Chat Ai";

  const profileImage = document.createElement("img");
  profileImage.src =
    sender === "me"
      ? "https://firebasestorage.googleapis.com/v0/b/usersai.appspot.com/o/images.png?alt=media&token=a7485730-b2dd-42b3-bebd-7591ce21ed6d"
      : "https://firebasestorage.googleapis.com/v0/b/usersai.appspot.com/o/20241126_064631.jpg?alt=media&token=5da7dbc3-de88-4621-966d-c48d5963d3d9";
  profileImage.classList.add("profile-image");

  const messageWrapper = document.createElement("div");
  messageWrapper.classList.add("message-wrapper");

  // Process markdown to convert **bold** into <strong> tags
  const formattedMessage = parseMarkdown(message);

  const newMessage = document.createElement("div");
  newMessage.classList.add("message");
  newMessage.innerHTML = formattedMessage; // Use innerHTML to support HTML tags (like <strong> for bold)

  messageWrapper.appendChild(usernameElement);
  messageWrapper.appendChild(newMessage);
  newMessageContainer.appendChild(profileImage);
  newMessageContainer.appendChild(messageWrapper);
  chatBox.appendChild(newMessageContainer);

  chatBox.scrollTop = chatBox.scrollHeight;
}

// Function to parse markdown text and convert to HTML
function parseMarkdown(message) {
  // Simple parser for **bold** text
  // Convert **bold** into <strong>bold</strong>
  return message.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
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
