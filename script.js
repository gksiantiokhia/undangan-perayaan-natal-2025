// Configuration
const CONFIG = {
    PASSWORD: '2512', // DDMM format
    EVENT_DATE: 'December 25, 2025 16:00:00 GMT+0700',
    ADMIN_EMAIL: 'panitia@gksi-antiochia.org'
};

// Global Variables
let currentSection = 'home';
let guestbookEntries = JSON.parse(localStorage.getItem('guestbookEntries')) || [];
let rsvpData = JSON.parse(localStorage.getItem('rsvpData')) || [];

// Initialize Application
function initApp() {
    checkFirstVisit();
    setupEventListeners();
    loadGuestbookEntries();
    updateStats();
    startCountdowns();
    
    // Hide loading screen after 2 seconds
    setTimeout(() => {
        document.getElementById('loadingScreen').style.display = 'none';
    }, 2000);
}

// Password Protection
function checkPassword() {
    const password = document.getElementById('passwordInput').value;
    if (password === CONFIG.PASSWORD) {
        document.getElementById('passwordModal').style.display = 'none';
        document.getElementById('nameInputPage').classList.add('active');
        localStorage.setItem('invitationAccessed', 'true');
    } else {
        alert('Password salah! Silakan coba lagi.\nHint: Tanggal acara (DDMM)');
    }
}

function checkFirstVisit() {
    if (!localStorage.getItem('invitationAccessed')) {
        document.getElementById('passwordModal').style.display = 'flex';
    } else {
        document.getElementById('nameInputPage').classList.add('active');
    }
}

// Countdown Function
function startCountdowns() {
    updateCountdown('preview');
    updateCountdown();
    
    setInterval(() => {
        updateCountdown('preview');
        updateCountdown();
    }, 1000);
}

function updateCountdown(prefix = '') {
    const countdownDate = new Date(CONFIG.EVENT_DATE).getTime();
    const now = new Date().getTime();
    const distance = countdownDate - now;
    
    if (distance < 0) {
        document.getElementById(prefix + 'days').innerHTML = '00';
        document.getElementById(prefix + 'hours').innerHTML = '00';
        document.getElementById(prefix + 'minutes').innerHTML = '00';
        document.getElementById(prefix + 'seconds').innerHTML = '00';
        return;
    }
    
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
    document.getElementById(prefix + 'days').innerHTML = days.toString().padStart(2, '0');
    document.getElementById(prefix + 'hours').innerHTML = hours.toString().padStart(2, '0');
    document.getElementById(prefix + 'minutes').innerHTML = minutes.toString().padStart(2, '0');
    document.getElementById(prefix + 'seconds').innerHTML = seconds.toString().padStart(2, '0');
}

// Page Navigation
function enterInvitation() {
    const guestName = document.getElementById('guestName').value.trim();
    
    if (guestName === '') {
        showAlert('Silakan masukkan nama Anda terlebih dahulu.', 'error');
        return;
    }
    
    localStorage.setItem('guestName', guestName);
    switchPage('nameInputPage', 'mainInvitationPage');
    document.getElementById('displayName').textContent = guestName;
    
    // Track view
    trackView();
}

function backToWelcome() {
    switchPage('mainInvitationPage', 'nameInputPage');
}

function switchPage(from, to) {
    document.getElementById(from).classList.remove('active');
    document.getElementById(to).classList.add('active');
}

// Section Navigation
function showSection(sectionName) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Remove active class from all nav buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected section
    document.getElementById(sectionName + 'Section').classList.add('active');
    
    // Add active class to clicked button
    event.target.classList.add('active');
    
    currentSection = sectionName;
}

// RSVP System
function setupRSVPListeners() {
    const attendanceSelect = document.getElementById('rsvpAttendance');
    const guestCountGroup = document.getElementById('guestCountGroup');
    
    attendanceSelect.addEventListener('change', function() {
        if (this.value === 'hadir' || this.value === 'mungkin') {
            guestCountGroup.style.display = 'block';
        } else {
            guestCountGroup.style.display = 'none';
        }
    });
}

function submitRSVP(event) {
    event.preventDefault();
    
    const rsvpData = {
        name: document.getElementById('rsvpName').value,
        attendance: document.getElementById('rsvpAttendance').value,
        guests: document.getElementById('rsvpGuests').value || 1,
        food: document.getElementById('rsvpFood').value,
        message: document.getElementById('rsvpMessage').value,
        timestamp: new Date().toISOString()
    };
    
    // Save to localStorage
    let allRSVP = JSON.parse(localStorage.getItem('rsvpData')) || [];
    allRSVP.push(rsvpData);
    localStorage.setItem('rsvpData', JSON.stringify(allRSVP));
    
    // Show success message
    document.getElementById('rsvpResponse').innerHTML = `
        <div class="response-message success">
            <i class="fas fa-check-circle"></i>
            Terima kasih ${rsvpData.name}! Konfirmasi kehadiran Anda telah tercatat.
        </div>
    `;
    
    // Reset form
    document.getElementById('rsvpForm').reset();
    document.getElementById('guestCountGroup').style.display = 'none';
    
    // Update stats
    updateStats();
    
    // Scroll to response
    document.getElementById('rsvpResponse').scrollIntoView({ behavior: 'smooth' });
}

// Guestbook System
function loadGuestbookEntries() {
    const guestbookList = document.getElementById('guestbookList');
    guestbookList.innerHTML = '';
    
    if (guestbookEntries.length === 0) {
        guestbookList.innerHTML = '<p class="no-entries">Belum ada ucapan. Jadilah yang pertama!</p>';
        return;
    }
    
    guestbookEntries.forEach(entry => {
        const entryElement = document.createElement('div');
        entryElement.className = 'guestbook-entry';
        entryElement.innerHTML = `
            <div class="entry-header">
                <span class="entry-name">${escapeHtml(entry.name)}</span>
                <span class="entry-date">${new Date(entry.timestamp).toLocaleDateString('id-ID')}</span>
            </div>
            <div class="entry-message">${escapeHtml(entry.message)}</div>
        `;
        guestbookList.appendChild(entryElement);
    });
}

function submitGuestbook(event) {
    event.preventDefault();
    
    const entry = {
        name: document.getElementById('gbName').value,
        message: document.getElementById('gbMessage').value,
        timestamp: new Date().toISOString()
    };
    
    // Add to entries array
    guestbookEntries.unshift(entry);
    
    // Save to localStorage
    localStorage.setItem('guestbookEntries', JSON.stringify(guestbookEntries));
    
    // Reload entries
    loadGuestbookEntries();
    
    // Show success message
    showAlert('Ucapan Anda telah terkirim! Terima kasih.', 'success');
    
    // Reset form
    document.getElementById('guestbookForm').reset();
}

// Music Player
function setupMusicPlayer() {
    const musicToggle = document.getElementById('musicToggle');
    const backgroundMusic = document.getElementById('backgroundMusic');
    const musicStatus = document.getElementById('musicStatus');
    
    musicToggle.addEventListener('click', function() {
        if (backgroundMusic.paused) {
            backgroundMusic.play();
            musicStatus.textContent = 'Musik: ON';
            musicToggle.style.background = 'rgba(178, 31, 31, 0.9)';
            musicToggle.style.color = 'white';
        } else {
            backgroundMusic.pause();
            musicStatus.textContent = 'Musik: OFF';
            musicToggle.style.background = 'rgba(255, 255, 255, 0.9)';
            musicToggle.style.color = 'inherit';
        }
    });
}

// Social Share
function shareWhatsApp() {
    const text = 'Undangan Perayaan Natal GKSI Jemaat Antiokhia Jakarta - 25 Desember 2025';
    const url = window.location.href;
    window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
}

function shareTelegram() {
    const text = 'Undangan Perayaan Natal GKSI Jemaat Antiokhia Jakarta - 25 Desember 2025';
    const url = window.location.href;
    window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, '_blank');
}

function shareFacebook() {
    const url = window.location.href;
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
}

function copyLink() {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
        showAlert('Link undangan berhasil disalin!', 'success');
    });
}

// Maps and Calendar
function openMaps() {
    window.open('https://maps.google.com/?q=Taman+Kuliner+Kalimalang+Jakarta+Timur', '_blank');
}

function addToCalendar() {
    const eventDetails = {
        title: 'Perayaan Natal GKSI Jemaat Antiokhia Jakarta',
        description: 'Undangan Perayaan Natal 2025 - "Kasih yang Turun ke Dunia"',
        location: 'Taman Kuliner Kalimalang, Jakarta Timur',
        start: '20251225T160000',
        end: '20251225T200000'
    };
    
    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventDetails.title)}&dates=${eventDetails.start}/${eventDetails.end}&details=${encodeURIComponent(eventDetails.description)}&location=${encodeURIComponent(eventDetails.location)}`;
    
    window.open(googleCalendarUrl, '_blank');
}

// Analytics and Stats
function trackView() {
    let views = parseInt(localStorage.getItem('pageViews')) || 0;
    views++;
    localStorage.setItem('pageViews', views);
    updateStats();
}

function updateStats() {
    const views = parseInt(localStorage.getItem('pageViews')) || 0;
    const rsvps = JSON.parse(localStorage.getItem('rsvpData')) || [];
    const confirmed = rsvps.filter(r => r.attendance === 'hadir').length;
    
    document.getElementById('viewCount').textContent = views;
    document.getElementById('rsvpCount').textContent = confirmed;
}

// Utility Functions
function showAlert(message, type = 'info') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `response-message ${type}`;
    alertDiv.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check' : 'info'}-circle"></i>
        ${message}
    `;
    
    document.body.appendChild(alertDiv);
    
    setTimeout(() => {
        alertDiv.remove();
    }, 5000);
}

function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// Event Listeners Setup
function setupEventListeners() {
    // Enter key for name input
    document.getElementById('guestName').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') enterInvitation();
    });
    
    // Password input enter key
    document.getElementById('passwordInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') checkPassword();
    });
    
    // Setup RSVP listeners
    setupRSVPListeners();
    
    // Setup music player
    setupMusicPlayer();
    
    // Auto-focus on name input
    document.getElementById('guestName').focus();
}

// Snow Animation
function createSnowflake() {
    const snowflake = document.createElement('div');
    snowflake.classList.add('snowflake');
    snowflake.innerHTML = '❄';
    snowflake.style.left = Math.random() * 100 + 'vw';
    snowflake.style.animationDuration = Math.random() * 3 + 2 + 's';
    snowflake.style.opacity = Math.random() * 0.6 + 0.4;
    snowflake.style.fontSize = Math.random() * 10 + 10 + 'px';
    
    document.body.appendChild(snowflake);
    
    setTimeout(() => {
        snowflake.remove();
    }, 5000);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initApp();
    
    // Load saved name
    const savedName = localStorage.getItem('guestName');
    if (savedName) {
        document.getElementById('guestName').value = savedName;
    }
    
    // Start snow animation
    setInterval(createSnowflake, 100);
    
    // Add some sample guestbook entries if empty
    if (guestbookEntries.length === 0) {
        guestbookEntries = [
            {
                name: "Panitia Natal",
                message: "Selamat datang! Kami tidak sabar untuk merayakan Natal bersama Anda semua. Tuhan Yesus memberkati.",
                timestamp: new Date().toISOString()
            }
        ];
        localStorage.setItem('guestbookEntries', JSON.stringify(guestbookEntries));
        loadGuestbookEntries();
    }
});
