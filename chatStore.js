/**
 * chatStore.js
 * localStorage-based storage for chat history
 * No backend database - all data stored in browser localStorage
 */

// Constants
const CHAT_STORAGE_KEY = 'internai_chat_history';

/**
 * Generate a unique ID for a chat message
 * @returns {string} Unique ID
 */
function generateMessageId() {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 100000);
    return `msg_${timestamp}_${random}`;
}

/**
 * Load chat history from localStorage
 * @returns {Array} Array of message objects
 */
function loadChatHistory() {
    try {
        const historyJSON = localStorage.getItem(CHAT_STORAGE_KEY);
        
        if (!historyJSON) {
            return [];
        }
        
        const history = JSON.parse(historyJSON);
        
        // Validate that it's an array
        if (!Array.isArray(history)) {
            console.error('Chat history is not an array, resetting...');
            localStorage.removeItem(CHAT_STORAGE_KEY);
            return [];
        }
        
        return history;
    } catch (error) {
        console.error('Error loading chat history:', error);
        // Clear corrupted data
        localStorage.removeItem(CHAT_STORAGE_KEY);
        return [];
    }
}

/**
 * Save chat history to localStorage
 * @param {Array} messages - Array of message objects
 * @returns {boolean} True if saved successfully
 */
function saveChatHistory(messages) {
    try {
        if (!Array.isArray(messages)) {
            console.error('Messages must be an array');
            return false;
        }
        
        const historyJSON = JSON.stringify(messages);
        localStorage.setItem(CHAT_STORAGE_KEY, historyJSON);
        return true;
    } catch (error) {
        console.error('Error saving chat history:', error);
        
        // Check if quota exceeded
        if (error.name === 'QuotaExceededError') {
            console.error('localStorage quota exceeded. Consider clearing old messages.');
            alert('Storage limit reached. Please clear some chat history to continue.');
        }
        
        return false;
    }
}

/**
 * Add a new message to chat history
 * @param {string} role - Message role: "user" or "assistant"
 * @param {string} text - Message text content
 * @returns {Object|null} The created message object or null if failed
 */
function addMessageToHistory(role, text) {
    try {
        // Validate role
        if (role !== 'user' && role !== 'assistant') {
            console.error('Role must be "user" or "assistant"');
            return null;
        }
        
        // Validate text
        if (!text || typeof text !== 'string') {
            console.error('Text must be a non-empty string');
            return null;
        }
        
        // Create new message object
        const newMessage = {
            id: generateMessageId(),
            role: role,
            text: text,
            createdAt: new Date().toISOString()
        };
        
        // Load existing history
        const history = loadChatHistory();
        
        // Add new message
        history.push(newMessage);
        
        // Save back to localStorage
        if (saveChatHistory(history)) {
            console.log('Message added to history:', newMessage.id);
            return newMessage;
        }
        
        return null;
    } catch (error) {
        console.error('Error adding message to history:', error);
        return null;
    }
}

/**
 * Get the last N messages from history
 * @param {number} count - Number of messages to retrieve
 * @returns {Array} Array of message objects
 */
function getRecentMessages(count = 10) {
    try {
        const history = loadChatHistory();
        
        if (count >= history.length) {
            return history;
        }
        
        return history.slice(-count);
    } catch (error) {
        console.error('Error getting recent messages:', error);
        return [];
    }
}

/**
 * Clear all chat history
 * @returns {boolean} True if cleared successfully
 */
function clearChatHistory() {
    try {
        localStorage.removeItem(CHAT_STORAGE_KEY);
        console.log('Chat history cleared');
        return true;
    } catch (error) {
        console.error('Error clearing chat history:', error);
        return false;
    }
}

/**
 * Get chat message count
 * @returns {number} Number of messages in history
 */
function getMessageCount() {
    try {
        const history = loadChatHistory();
        return history.length;
    } catch (error) {
        return 0;
    }
}

/**
 * Delete a specific message by ID
 * @param {string} messageId - ID of the message to delete
 * @returns {boolean} True if deleted successfully
 */
function deleteMessage(messageId) {
    try {
        const history = loadChatHistory();
        const filteredHistory = history.filter(msg => msg.id !== messageId);
        
        if (filteredHistory.length === history.length) {
            console.error('Message not found:', messageId);
            return false;
        }
        
        return saveChatHistory(filteredHistory);
    } catch (error) {
        console.error('Error deleting message:', error);
        return false;
    }
}

/**
 * Export chat history as JSON
 * @returns {string} JSON string of chat history
 */
function exportChatHistory() {
    try {
        const history = loadChatHistory();
        return JSON.stringify(history, null, 2);
    } catch (error) {
        console.error('Error exporting chat history:', error);
        return '[]';
    }
}

/**
 * Import chat history from JSON
 * @param {string} jsonString - JSON string of messages
 * @returns {boolean} True if imported successfully
 */
function importChatHistory(jsonString) {
    try {
        const messages = JSON.parse(jsonString);
        
        if (!Array.isArray(messages)) {
            console.error('Invalid chat history format');
            return false;
        }
        
        return saveChatHistory(messages);
    } catch (error) {
        console.error('Error importing chat history:', error);
        return false;
    }
}

// For vanilla JS / browser globals, attach to window
if (typeof window !== 'undefined') {
    window.chatStore = {
        loadChatHistory,
        saveChatHistory,
        addMessageToHistory,
        getRecentMessages,
        clearChatHistory,
        getMessageCount,
        deleteMessage,
        exportChatHistory,
        importChatHistory
    };
}

/**
 * EXAMPLE USAGE:
 * 
 * // 1. Load chat history (returns empty array if none exists)
 * const history = chatStore.loadChatHistory();
 * console.log('Chat history:', history);
 * 
 * // 2. Add a user message
 * const userMsg = chatStore.addMessageToHistory('user', 'What should I add to my resume?');
 * 
 * // 3. Add an assistant response
 * const aiMsg = chatStore.addMessageToHistory('assistant', 'Here are some suggestions...');
 * 
 * // 4. Get recent messages
 * const recent = chatStore.getRecentMessages(5);
 * 
 * // 5. Get message count
 * console.log('Total messages:', chatStore.getMessageCount());
 * 
 * // 6. Export chat history
 * const exportedData = chatStore.exportChatHistory();
 * console.log(exportedData);
 * 
 * // 7. Clear all history
 * // chatStore.clearChatHistory();
 * 
 */
