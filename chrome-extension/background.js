// AI Pitch Advisor Chrome Extension - Background Script

chrome.runtime.onInstalled.addListener((details) => {
    console.log('AI Pitch Advisor extension installed');
    
    // Set default values
    chrome.storage.local.set({
        userName: '',
        isStockMode: false,
        lastUsed: Date.now()
    });
});

// Handle extension icon click
chrome.action.onClicked.addListener((tab) => {
    // This will open the popup automatically due to manifest configuration
    console.log('Extension icon clicked');
});

// Handle messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getUserData') {
        chrome.storage.local.get(['userName', 'isStockMode'], (result) => {
            sendResponse(result);
        });
        return true; // Keep message channel open for async response
    }
    
    if (request.action === 'saveUserData') {
        chrome.storage.local.set(request.data, () => {
            sendResponse({ success: true });
        });
        return true;
    }
    
    if (request.action === 'openSearch') {
        chrome.tabs.create({ url: request.url });
        sendResponse({ success: true });
    }
});

// Periodic cleanup (optional)
chrome.alarms.create('cleanup', { periodInMinutes: 60 });

chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === 'cleanup') {
        // Clean up old data if needed
        console.log('Running periodic cleanup');
    }
});
