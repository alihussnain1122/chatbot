

let prompt = document.querySelector(".prompt");
let container = document.querySelector(".container");
let chatContainer = document.querySelector(".chat-container");
let btn = document.querySelector(".btn");
let userMessage = null;

// API URL (update with your correct API key)
let Api_url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyB0Y28Z_9xWsPcgpMlT3nVzVw1u50y5YCM';

// Create chat box function
function createChatBox(html, className) {
    const div = document.createElement("div");
    div.classList.add(className);
    div.innerHTML = html;
    return div;
}

// API Response function
async function generateApiResponse(aiChatBox) {
    const textElement = aiChatBox.querySelector(".text");
    try {
        const response = await fetch(Api_url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{
                    "role": "user",
                    "parts": [{ text: `${userMessage} in 10 words` }]
                }]
            })
        });

        const data = await response.json();
        const apiResponse = data?.candidates?.[0]?.content?.parts?.[0]?.text.trim();
        textElement.innerText = apiResponse || "No response from AI.";

    } catch (error) {
        console.error(error);
        textElement.innerText = "Error: Unable to fetch response.";
    } finally {
        aiChatBox.querySelector(".loading").style.display = "none";
    }
}

// Show loading animation
function showLoading() {
    const html = `
        <div id="img">
            <img src="ai.png" alt="">
        </div>
        <div class="text"></div>
        <img src="loading.gif" alt="" height="50" class="loading">
    `;
    let aiChatBox = createChatBox(html, "ai-chat-box");
    chatContainer.appendChild(aiChatBox);
    generateApiResponse(aiChatBox);
}

// Function to handle sending the message
function sendMessage() {
    userMessage = prompt.value.trim();
    if (!userMessage) return;  // Do nothing if no message

    container.style.display = "none"; // Hide the initial container

    const html = `
        <div id="img">
            <img src="user.png" alt="">
        </div>
        <div class="text">${userMessage}</div>
    `;
    let userChatBox = createChatBox(html, "user-chat-box");
    chatContainer.appendChild(userChatBox);
    prompt.value = ""; // Clear the input
    setTimeout(showLoading, 500); // Show loading and get AI response
}

// Trigger sendMessage on button click
btn.addEventListener("click", sendMessage);

// Trigger sendMessage on pressing "Enter" in the input field
prompt.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        sendMessage();
    }
});
