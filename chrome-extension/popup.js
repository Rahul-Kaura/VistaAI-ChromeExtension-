// AI Pitch Advisor Chrome Extension - Popup Script

class AIPitchAdvisor {
    constructor() {
        this.isStockMode = false;
        this.userName = '';
        this.init();
    }

    async init() {
        await this.loadUserData();
        this.setupEventListeners();
        this.updateWelcomeMessage();
        this.setupVideoBackground();
    }

    async loadUserData() {
        try {
            const result = await chrome.storage.local.get(['userName', 'isStockMode']);
            this.userName = result.userName || '';
            this.isStockMode = result.isStockMode || false;
            this.updateModeDisplay();
        } catch (error) {
            console.error('Error loading user data:', error);
        }
    }

    async saveUserData() {
        try {
            await chrome.storage.local.set({
                userName: this.userName,
                isStockMode: this.isStockMode
            });
        } catch (error) {
            console.error('Error saving user data:', error);
        }
    }

    setupEventListeners() {
        // Mode toggle
        document.getElementById('generalMode').addEventListener('click', () => {
            this.isStockMode = false;
            this.updateModeDisplay();
            this.saveUserData();
        });

        document.getElementById('stockMode').addEventListener('click', () => {
            this.isStockMode = true;
            this.updateModeDisplay();
            this.saveUserData();
        });

        // Search functionality
        document.getElementById('searchInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleSearch();
            }
        });

        // Action buttons
        document.getElementById('micBtn').addEventListener('click', () => {
            this.startVoiceRecognition();
        });

        document.getElementById('imageBtn').addEventListener('click', () => {
            this.handleImageUpload();
        });

        // Lock in button
        document.getElementById('lockInBtn').addEventListener('click', () => {
            this.playMotivationalAudio();
        });
    }

    updateModeDisplay() {
        const generalBtn = document.getElementById('generalMode');
        const stockBtn = document.getElementById('stockMode');
        
        if (this.isStockMode) {
            generalBtn.classList.remove('active');
            stockBtn.classList.add('active');
        } else {
            generalBtn.classList.add('active');
            stockBtn.classList.remove('active');
        }
    }

    updateWelcomeMessage() {
        const welcomeElement = document.getElementById('welcomeMessage');
        if (this.userName) {
            welcomeElement.textContent = `Welcome back, ${this.userName}!`;
        } else {
            welcomeElement.textContent = 'Welcome! Ready to dominate?';
        }
    }

    setupVideoBackground() {
        const video = document.getElementById('backgroundVideo');
        if (video) {
            video.addEventListener('error', () => {
                console.log('Video failed to load, using fallback');
                // Hide video background if it fails
                document.getElementById('videoBackground').style.display = 'none';
            });
        }
    }

    async handleSearch() {
        const searchInput = document.getElementById('searchInput');
        const query = searchInput.value.trim();
        
        if (!query) return;

        try {
            // Open new tab with search results
            const searchUrl = this.isStockMode 
                ? `https://www.google.com/search?q=stock+analysis+${encodeURIComponent(query)}`
                : `https://www.google.com/search?q=ai+pitch+advisor+${encodeURIComponent(query)}`;
            
            await chrome.tabs.create({ url: searchUrl });
            window.close(); // Close popup after opening search
        } catch (error) {
            console.error('Error handling search:', error);
        }
    }

    async startVoiceRecognition() {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            alert('Voice recognition not supported in this browser');
            return;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
            document.getElementById('micBtn').textContent = '🎤...';
        };

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            document.getElementById('searchInput').value = transcript;
            this.handleSearch();
        };

        recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            document.getElementById('micBtn').textContent = '🎤';
        };

        recognition.onend = () => {
            document.getElementById('micBtn').textContent = '🎤';
        };

        recognition.start();
    }

    handleImageUpload() {
        // Create file input
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        
        input.onchange = (event) => {
            const file = event.target.files[0];
            if (file) {
                // For now, just show a message
                alert(`Image selected: ${file.name}. This feature will be implemented in the full version.`);
            }
        };
        
        input.click();
    }

    playMotivationalAudio() {
        // David Goggins motivational quotes
        const quotes = [
            "Who's gonna carry the boats?",
            "You don't know me son!",
            "Stay hard!",
            "Can't hurt me!",
            "When you think you're done, you're only 40% done!",
            "You have to go to war with yourself!",
            "The only person who can stop you is you!",
            "Embrace the suck!",
            "No shortcuts!",
            "Be uncommon amongst uncommon people!"
        ];

        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        
        // Try to use speech synthesis
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(randomQuote);
            utterance.rate = 0.8;
            utterance.pitch = 0.9;
            utterance.volume = 0.8;
            speechSynthesis.speak(utterance);
        } else {
            // Fallback to alert
            alert(`🔥 ${randomQuote} 🔥`);
        }

        // Visual feedback
        const btn = document.getElementById('lockInBtn');
        const originalText = btn.textContent;
        btn.textContent = 'LOCKED IN!';
        btn.style.background = 'linear-gradient(45deg, #00ff00, #00cc00)';
        
        setTimeout(() => {
            btn.textContent = originalText;
            btn.style.background = 'linear-gradient(45deg, #ff6b6b, #ee5a24)';
        }, 2000);
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AIPitchAdvisor();
});
