// Initialize SpeechRecognition
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = "en-US";
recognition.interimResults = false;
recognition.continuous = false;

const indicator = document.getElementById("indicator");
const chat = document.getElementById("chat");
const speakBtn = document.getElementById("speakBtn");

// OpenAI API Key 
const OPENAI_API_KEY = '6baa45d8c8msha899d5d06fe13b4p14696ajsn8b9fd7ef4ff6';

// Tap-to-Speak button event
speakBtn.addEventListener("click", () => {
  recognition.start();
  indicator.classList.add("listening");
  console.log("Listening...");
});

// Listen for voice input
recognition.onresult = function (event) {
  const transcript = event.results[0][0].transcript;
  console.log("User said:", transcript);
  addMessage(transcript, "user");
  sendToOpenAI(transcript);
};

// Stop indicator when done listening
recognition.onend = function () {
  indicator.classList.remove("listening");
};

// Add messages to the chat
function addMessage(text, sender) {
  const messageDiv = document.createElement("div");
  messageDiv.classList.add("message", sender);
  messageDiv.innerText = text;
  chat.appendChild(messageDiv);
  chat.scrollTop = chat.scrollHeight;
}

// Send user input to OpenAI API
async function sendToOpenAI(prompt) {
  try {
    const response = await fetch(
      'https://cheapest-gpt-4-turbo-gpt-4-vision-chatgpt-openai-ai-api.p.rapidapi.com/v1/chat/completions',
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: [{ role: "user", content: prompt }],
          max_tokens: 150,
        }),
      }
    );

    const data = await response.json();
    const responseText = data.choices[0].message.content.trim();
    console.log("Bot says:", responseText);
    addMessage(responseText, "bot");
    speak(responseText);
  } catch (error) {
    console.error("Error with OpenAI API:", error);
  }
}

// Speak the response
function speak(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  window.speechSynthesis.speak(utterance);
}

// Handle recognition errors
recognition.onerror = function (event) {
  console.error("Recognition error:", event.error);
};
