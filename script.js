// Animasi salju
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

// Buat salju setiap 100ms
setInterval(createSnowflake, 100);

// Animasi untuk elemen detail
document.addEventListener('DOMContentLoaded', function() {
    const detailItems = document.querySelectorAll('.detail-item');
    
    detailItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            item.style.transition = 'all 0.6s ease';
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }, index * 200 + 500);
    });
    
    // Animasi untuk judul
    const titles = document.querySelectorAll('.church-logo h1, .natal-title h2');
    titles.forEach((title, index) => {
        title.style.opacity = '0';
        setTimeout(() => {
            title.style.transition = 'opacity 1s ease';
            title.style.opacity = '1';
        }, index * 300);
    });
});

// Konfirmasi pembukaan undangan
window.onload = function() {
    setTimeout(() => {
        alert('Selamat datang di undangan digital Perayaan Natal GKSI Jemaat Antiokhia Jakarta 2025!');
    }, 1000);
};
