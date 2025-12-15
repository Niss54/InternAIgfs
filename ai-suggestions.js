// AI Suggestions Page - JavaScript

// DOM Elements
const plusButton = document.getElementById('plusButton');
const attachmentPopup = document.getElementById('attachmentPopup');
const uploadImageBtn = document.getElementById('uploadImageBtn');
const uploadDocumentBtn = document.getElementById('uploadDocumentBtn');
const imageInput = document.getElementById('imageInput');
const documentInput = document.getElementById('documentInput');
const fileStatus = document.getElementById('fileStatus');
const fileStatusName = document.getElementById('fileStatusName');
const fileStatusRemove = document.getElementById('fileStatusRemove');
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');
const chatContainer = document.getElementById('chatContainer');

// Current uploaded file
let currentFile = null;

// Typing indicator element
let typingIndicator = null;

// Initialize
function init() {
    setupEventListeners();
    autoResizeTextarea();
    
    // Initialize resume store
    if (typeof resumeStore !== 'undefined') {
        resumeStore.initStore();
        
        // Display current resume if exists
        const currentResume = resumeStore.getCurrentResume();
        if (currentResume) {
            displayCurrentResume();
        }
    }
    
    // Load and render chat history
    if (typeof chatStore !== 'undefined') {
        loadAndRenderChatHistory();
    }
    
    scrollToBottom();
}

// Setup Event Listeners
function setupEventListeners() {
    // Plus button popup menu
    plusButton.addEventListener('click', (e) => {
        e.stopPropagation();
        attachmentPopup.classList.toggle('show');
    });
    
    // Close popup when clicking outside
    document.addEventListener('click', (e) => {
        if (!attachmentPopup.contains(e.target) && !plusButton.contains(e.target)) {
            attachmentPopup.classList.remove('show');
        }
    });
    
    // Image upload
    uploadImageBtn.addEventListener('click', () => {
        imageInput.click();
        attachmentPopup.classList.remove('show');
    });
    imageInput.addEventListener('change', handleFileSelect);
    
    // Document upload
    uploadDocumentBtn.addEventListener('click', () => {
        documentInput.click();
        attachmentPopup.classList.remove('show');
    });
    documentInput.addEventListener('change', handleFileSelect);
    
    // Remove file
    fileStatusRemove.addEventListener('click', () => {
        currentFile = null;
        fileStatus.style.display = 'none';
        imageInput.value = '';
        documentInput.value = '';
    });
    
    // Send message events
    sendButton.addEventListener('click', sendMessage);
    messageInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
    
    // Auto-resize textarea
    messageInput.addEventListener('input', autoResizeTextarea);
}

// File Upload Handlers
function handleFileSelect(e) {
    const file = e.target.files[0];
    if (file) {
        currentFile = file;
        fileStatusName.textContent = file.name;
        fileStatus.style.display = 'flex';
        processAndSaveFile(file);
    }
}

// Process and save file to resumeStore
function processAndSaveFile(file) {
    addSystemMessage(`File uploaded: ${file.name}`);
    
    // Check if file is a text file
    const isTextFile = file.type === 'text/plain' || file.name.endsWith('.txt');
    
    if (isTextFile) {
        // Read text content from .txt files
        const reader = new FileReader();
        
        reader.onload = function(e) {
            const textContent = e.target.result;
            const savedResume = resumeStore.saveNewResume(file, textContent);
            
            if (savedResume) {
                addSystemMessage(`Resume saved successfully! ID: ${savedResume.id}`);
                displayCurrentResume();
            }
        };
        
        reader.onerror = function() {
            console.error('Error reading file');
            // Save with placeholder text
            const placeholder = `Content of file ${file.name} (text extraction failed).`;
            resumeStore.saveNewResume(file, placeholder);
            displayCurrentResume();
        };
        
        reader.readAsText(file);
    } else {
        // For PDF, DOC, DOCX, JPG, PNG - save with placeholder
        const placeholder = `Content of file ${file.name} (to be extracted later).`;
        const savedResume = resumeStore.saveNewResume(file, placeholder);
        
        if (savedResume) {
            addSystemMessage(`Resume saved to storage! You can now ask questions about it.`);
            displayCurrentResume();
        }
    }
}

// Display current resume info
function displayCurrentResume() {
    const currentResume = resumeStore.getCurrentResume();
    
    if (currentResume) {
        const resumeInfo = document.createElement('div');
        resumeInfo.style.cssText = `
            margin-top: 0.5rem;
            padding: 0.5rem;
            background: rgba(102, 126, 234, 0.1);
            border-radius: 8px;
            font-size: 0.85rem;
            color: #667eea;
        `;
        resumeInfo.innerHTML = `
            <strong>Current Resume:</strong> ${currentResume.fileName}<br>
            <small>Uploaded: ${new Date(currentResume.uploadedAt).toLocaleString()}</small>
        `;
        
        // Remove previous resume info if exists
        const existingInfo = document.querySelector('.current-resume-info');
        if (existingInfo) {
            existingInfo.remove();
        }
        
        resumeInfo.className = 'current-resume-info';
        fileName.parentElement.appendChild(resumeInfo);
    }
}

// Message Functions
function sendMessage() {
    const message = messageInput.value.trim();
    
    console.log('🔵 sendMessage called:', message);
    
    if (!message) {
        console.log('❌ Empty message, returning');
        return; // Nothing to send
    }
    
    console.log('✅ Message valid, adding to history');
    
    // Add user message to chat
    const userMsg = chatStore.addMessageToHistory('user', message);
    console.log('📝 User message added:', userMsg);
    
    if (userMsg) {
        console.log('🎨 Rendering user message');
        renderMessage(userMsg);
    }
    
    // Clear input
    messageInput.value = '';
    autoResizeTextarea();
    
    // Show typing indicator
    console.log('⏳ Showing typing indicator');
    showTypingIndicator();
    
    // Send message to backend
    console.log('🚀 Sending to backend...');
    sendMessageToBackend(message);
}

// Render a single message in the chat UI
function renderMessage(messageObj) {
    console.log('🎨 renderMessage called:', messageObj);
    
    const messageDiv = document.createElement('div');
    const messageType = messageObj.role === 'user' ? 'user' : 'ai';
    messageDiv.className = `chat-message ${messageType}-message`;
    messageDiv.setAttribute('data-message-id', messageObj.id);
    
    const bubbleDiv = document.createElement('div');
    bubbleDiv.className = 'message-bubble';
    
    const textP = document.createElement('p');
    textP.textContent = messageObj.text;
    
    const timeSpan = document.createElement('span');
    timeSpan.className = 'message-time';
    timeSpan.textContent = formatMessageTime(messageObj.createdAt);
    
    bubbleDiv.appendChild(textP);
    bubbleDiv.appendChild(timeSpan);
    messageDiv.appendChild(bubbleDiv);
    
    console.log('📦 Appending message to chatContainer');
    chatContainer.appendChild(messageDiv);
    scrollToBottom();
    console.log('✅ Message rendered successfully');
}

// Add system message (doesn't save to history)
function addSystemMessage(text) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'chat-message ai-message';
    
    const bubbleDiv = document.createElement('div');
    bubbleDiv.className = 'message-bubble';
    bubbleDiv.style.background = '#e6fffa';
    bubbleDiv.style.borderColor = '#81e6d9';
    
    const textP = document.createElement('p');
    textP.textContent = text;
    textP.style.color = '#234e52';
    textP.style.fontSize = '0.9rem';
    
    bubbleDiv.appendChild(textP);
    messageDiv.appendChild(bubbleDiv);
    
    chatContainer.appendChild(messageDiv);
    scrollToBottom();
}

// Load and render chat history from localStorage
function loadAndRenderChatHistory() {
    const history = chatStore.loadChatHistory();
    
    // Clear chat container except the initial AI message
    const initialMessages = chatContainer.querySelectorAll('.chat-message');
    initialMessages.forEach(msg => msg.remove());
    
    // Render all messages from history
    history.forEach(messageObj => {
        renderMessage(messageObj);
    });
    
    // If no history, show welcome message
    if (history.length === 0) {
        const welcomeMsg = {
            id: 'welcome',
            role: 'assistant',
            text: "Hi! I'm your AI mentor. Upload your resume or ask me any questions about internships!",
            createdAt: new Date().toISOString()
        };
        renderMessage(welcomeMsg);
    }
}

// Show typing indicator
function showTypingIndicator() {
    if (typingIndicator) {
        return; // Already showing
    }
    
    const messageDiv = document.createElement('div');
    messageDiv.className = 'chat-message ai-message';
    messageDiv.id = 'typing-indicator';
    
    const bubbleDiv = document.createElement('div');
    bubbleDiv.className = 'message-bubble';
    
    const textP = document.createElement('p');
    textP.innerHTML = '<span class="typing-dots">AI is thinking<span>.</span><span>.</span><span>.</span></span>';
    textP.style.fontStyle = 'italic';
    textP.style.color = '#718096';
    
    bubbleDiv.appendChild(textP);
    messageDiv.appendChild(bubbleDiv);
    
    chatContainer.appendChild(messageDiv);
    typingIndicator = messageDiv;
    scrollToBottom();
}

// Hide typing indicator
function hideTypingIndicator() {
    if (typingIndicator) {
        typingIndicator.remove();
        typingIndicator = null;
    }
}

// Send message to backend API
async function sendMessageToBackend(messageText) {
    try {
        // Get user profile from profileStore
        const userProfile = (typeof profileStore !== 'undefined') 
            ? profileStore.getProfile() 
            : null;
        
        // Get current resume from resumeStore
        const currentResume = (typeof resumeStore !== 'undefined') 
            ? resumeStore.getCurrentResume() 
            : null;
        
        // Prepare request body
        const requestBody = {
            message: messageText,
            userProfile: userProfile,
            resume: currentResume
        };
        
        // Make API call
        const response = await fetch('http://localhost:8080/api/ai/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });
        
        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Hide typing indicator
        hideTypingIndicator();
        
        // Add AI response to chat (backend returns 'reply' key)
        const aiResponse = data.reply || data.response || data.message || 'Sorry, I could not process your request.';
        const aiMsg = chatStore.addMessageToHistory('assistant', aiResponse);
        
        if (aiMsg) {
            renderMessage(aiMsg);
        }
        
    } catch (error) {
        console.error('Backend API call failed:', error);
        
        // Hide typing indicator
        hideTypingIndicator();
        
        // Demo mode - generate fake response
        const demoResponse = generateDemoResponse(messageText, 
            (typeof resumeStore !== 'undefined') ? resumeStore.getCurrentResume() : null,
            (typeof profileStore !== 'undefined') ? profileStore.getProfile() : null
        );
        
        const aiMsg = chatStore.addMessageToHistory('assistant', demoResponse);
        
        if (aiMsg) {
            renderMessage(aiMsg);
        }
    }
}

// Generate demo response when backend is not available
function generateDemoResponse(userMessage, resume, profile) {
    const demoResponses = [
        `Great question! Based on your message about "${userMessage.substring(0, 30)}...", I can help you with that.`,
        "I'd recommend focusing on building projects that showcase your skills and align with your target internship roles.",
        "Your resume shows potential! Consider adding more quantifiable achievements to make it stand out to recruiters.",
        "For internship applications, tailor your resume to each position and highlight relevant experience and skills.",
        "Based on current industry trends, I'd suggest developing skills in cloud technologies, AI, and data analysis."
    ];
    
    let response = "**Demo Mode**: No backend connected. ";
    
    if (resume) {
        response += `I can see you've uploaded "${resume.fileName}". `;
    }
    
    if (profile) {
        response += `I know your profile (${profile.name}). `;
    }
    
    response += demoResponses[Math.floor(Math.random() * demoResponses.length)];
    response += "\n\n*Note: This is a demo response. When the backend is connected, I'll provide personalized suggestions based on your actual profile and resume content.*";
    
    return response;
}

// Format message timestamp
function formatMessageTime(isoString) {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) {
        return 'Just now';
    } else if (diffMins < 60) {
        return `${diffMins}m ago`;
    } else if (diffMins < 1440) {
        const hours = Math.floor(diffMins / 60);
        return `${hours}h ago`;
    } else {
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    }
}

function scrollToBottom() {
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Auto-resize textarea
function autoResizeTextarea() {
    messageInput.style.height = 'auto';
    const newHeight = Math.min(messageInput.scrollHeight, 120);
    messageInput.style.height = newHeight + 'px';
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', init);

// Prevent page reload on form submission
document.addEventListener('submit', (e) => {
    e.preventDefault();
});
