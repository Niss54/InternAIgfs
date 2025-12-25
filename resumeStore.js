/**
 * resumeStore.js
 * localStorage-based storage for uploaded resumes and documents
 * No backend database - all data stored in browser localStorage
 */

// Constants
const RESUME_STORAGE_KEY = 'internai_resume_store';

/**
 * Initialize resume store in localStorage if it doesn't exist
 * @returns {Object} The initialized store object
 */
function initStore() {
    try {
        const existingStore = localStorage.getItem(RESUME_STORAGE_KEY);
        
        if (!existingStore) {
            const initialStore = {
                currentResumeId: null,
                resumes: []
            };
            
            localStorage.setItem(RESUME_STORAGE_KEY, JSON.stringify(initialStore));
            console.log('Resume store initialized');
            return initialStore;
        }
        
        return JSON.parse(existingStore);
    } catch (error) {
        console.error('Error initializing resume store:', error);
        // Clear corrupted data and reinitialize
        localStorage.removeItem(RESUME_STORAGE_KEY);
        return initStore();
    }
}

/**
 * Get the resume store from localStorage
 * @returns {Object} The resume store object
 */
function getStore() {
    try {
        const storeJSON = localStorage.getItem(RESUME_STORAGE_KEY);
        
        if (!storeJSON) {
            return initStore();
        }
        
        return JSON.parse(storeJSON);
    } catch (error) {
        console.error('Error reading resume store:', error);
        localStorage.removeItem(RESUME_STORAGE_KEY);
        return initStore();
    }
}

/**
 * Save the resume store to localStorage
 * @param {Object} store - The store object to save
 * @returns {boolean} True if saved successfully
 */
function saveStore(store) {
    try {
        localStorage.setItem(RESUME_STORAGE_KEY, JSON.stringify(store));
        return true;
    } catch (error) {
        console.error('Error saving resume store:', error);
        
        // Check if quota exceeded
        if (error.name === 'QuotaExceededError') {
            console.error('localStorage quota exceeded. Consider clearing old resumes.');
            alert('Storage limit reached. Please delete some old resumes to continue.');
        }
        
        return false;
    }
}

/**
 * Generate a unique ID for a resume
 * @returns {string} Unique ID
 */
function generateId() {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    return `resume_${timestamp}_${random}`;
}

/**
 * Save a new resume to the store
 * @param {File} file - The file object
 * @param {string} extractedText - Text content extracted from the file
 * @param {string} category - File category: "resume", "cv", "certificate", "other"
 * @returns {Object|null} The created resume object or null if failed
 */
function saveNewResume(file, extractedText, category = 'resume') {
    try {
        if (!file || !file.name) {
            console.error('Invalid file object');
            return null;
        }
        
        // Validate category
        const validCategories = ['resume', 'cv', 'certificate', 'other'];
        if (!validCategories.includes(category)) {
            console.warn(`Invalid category: ${category}. Using 'other'.`);
            category = 'other';
        }
        
        const store = getStore();
        
        // Create new resume object
        const newResume = {
            id: generateId(),
            fileName: file.name,
            fileType: file.type || 'unknown',
            fileSize: file.size,
            category: category,
            uploadedAt: new Date().toISOString(),
            rawContent: extractedText || `Content of file ${file.name} (to be extracted later).`,
            notes: null
        };
        
        // Add to resumes array
        store.resumes.push(newResume);
        
        // Set as current resume
        store.currentResumeId = newResume.id;
        
        // Save to localStorage
        if (saveStore(store)) {
            console.log('Resume saved successfully:', newResume.fileName);
            return newResume;
        }
        
        return null;
    } catch (error) {
        console.error('Error saving new resume:', error);
        return null;
    }
}

/**
 * Set the current active resume by ID
 * @param {string} id - Resume ID
 * @returns {boolean} True if set successfully
 */
function setCurrentResume(id) {
    try {
        const store = getStore();
        
        // Check if resume with this ID exists
        const resumeExists = store.resumes.some(resume => resume.id === id);
        
        if (!resumeExists) {
            console.error(`Resume with ID ${id} not found`);
            return false;
        }
        
        store.currentResumeId = id;
        return saveStore(store);
    } catch (error) {
        console.error('Error setting current resume:', error);
        return false;
    }
}

/**
 * Get the current active resume
 * @returns {Object|null} Current resume object or null
 */
function getCurrentResume() {
    try {
        const store = getStore();
        
        if (!store.currentResumeId) {
            return null;
        }
        
        const currentResume = store.resumes.find(
            resume => resume.id === store.currentResumeId
        );
        
        return currentResume || null;
    } catch (error) {
        console.error('Error getting current resume:', error);
        return null;
    }
}

/**
 * Get all resumes in the store
 * @returns {Array} Array of resume objects
 */
function getAllResumes() {
    try {
        const store = getStore();
        return store.resumes || [];
    } catch (error) {
        console.error('Error getting all resumes:', error);
        return [];
    }
}

/**
 * Delete a resume by ID
 * @param {string} id - Resume ID to delete
 * @returns {boolean} True if deleted successfully
 */
function deleteResume(id) {
    try {
        const store = getStore();
        
        // Find index of resume
        const index = store.resumes.findIndex(resume => resume.id === id);
        
        if (index === -1) {
            console.error(`Resume with ID ${id} not found`);
            return false;
        }
        
        // Remove from array
        store.resumes.splice(index, 1);
        
        // If this was the current resume, clear currentResumeId
        if (store.currentResumeId === id) {
            // Set to the most recent resume if available
            if (store.resumes.length > 0) {
                store.currentResumeId = store.resumes[store.resumes.length - 1].id;
            } else {
                store.currentResumeId = null;
            }
        }
        
        return saveStore(store);
    } catch (error) {
        console.error('Error deleting resume:', error);
        return false;
    }
}

/**
 * Update notes for a resume
 * @param {string} id - Resume ID
 * @param {string} notes - Notes text
 * @returns {boolean} True if updated successfully
 */
function updateResumeNotes(id, notes) {
    try {
        const store = getStore();
        
        const resume = store.resumes.find(r => r.id === id);
        
        if (!resume) {
            console.error(`Resume with ID ${id} not found`);
            return false;
        }
        
        resume.notes = notes;
        return saveStore(store);
    } catch (error) {
        console.error('Error updating resume notes:', error);
        return false;
    }
}

/**
 * Clear all resumes from the store
 * @returns {boolean} True if cleared successfully
 */
function clearResumes() {
    try {
        const emptyStore = {
            currentResumeId: null,
            resumes: []
        };
        
        localStorage.setItem(RESUME_STORAGE_KEY, JSON.stringify(emptyStore));
        console.log('All resumes cleared from store');
        return true;
    } catch (error) {
        console.error('Error clearing resumes:', error);
        return false;
    }
}

/**
 * Get resume count
 * @returns {number} Number of resumes in store
 */
function getResumeCount() {
    try {
        const store = getStore();
        return store.resumes.length;
    } catch (error) {
        return 0;
    }
}

/**
 * Get total storage size (approximate)
 * @returns {number} Size in bytes
 */
function getStorageSize() {
    try {
        const storeJSON = localStorage.getItem(RESUME_STORAGE_KEY);
        return storeJSON ? new Blob([storeJSON]).size : 0;
    } catch (error) {
        return 0;
    }
}

// For vanilla JS / browser globals, attach to window
if (typeof window !== 'undefined') {
    window.resumeStore = {
        initStore,
        getStore,
        saveNewResume,
        setCurrentResume,
        getCurrentResume,
        getAllResumes,
        deleteResume,
        updateResumeNotes,
        clearResumes,
        getResumeCount,
        getStorageSize
    };
}

// Initialize store on load
initStore();

/**
 * EXAMPLE USAGE:
 * 
 * // 1. Initialize the store (automatically done on load)
 * resumeStore.initStore();
 * 
 * // 2. Save a new resume after file upload
 * const file = ... // File object from input
 * const extractedText = "This is the text content of my resume...";
 * const savedResume = resumeStore.saveNewResume(file, extractedText);
 * console.log('Saved resume:', savedResume);
 * 
 * // 3. Get the current active resume
 * const currentResume = resumeStore.getCurrentResume();
 * if (currentResume) {
 *     console.log('Current resume:', currentResume.fileName);
 *     console.log('Content:', currentResume.rawContent);
 * }
 * 
 * // 4. Get all resumes
 * const allResumes = resumeStore.getAllResumes();
 * console.log('Total resumes:', allResumes.length);
 * 
 * // 5. Switch to a different resume
 * if (allResumes.length > 0) {
 *     resumeStore.setCurrentResume(allResumes[0].id);
 * }
 * 
 * // 6. Add notes to a resume
 * if (currentResume) {
 *     resumeStore.updateResumeNotes(currentResume.id, 'Updated for software engineer role');
 * }
 * 
 * // 7. Delete a resume
 * // resumeStore.deleteResume(someResumeId);
 * 
 * // 8. Get resume count and storage info
 * console.log('Resume count:', resumeStore.getResumeCount());
 * console.log('Storage size:', resumeStore.getStorageSize(), 'bytes');
 * 
 * // 9. Clear all resumes (be careful!)
 * // resumeStore.clearResumes();
 * 
 */
