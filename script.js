/*
 * File: script.js
 * Fungsi: Countdown Timer, RSVP Interaksi, dan Musik Latar (Opsional)
 */

document.addEventListener('DOMContentLoaded', () => {
    // Tanggal Natal (Ganti dengan tanggal acara Anda jika berbeda)
    const natalDate = new Date("December 25, 2025 18:00:00").getTime();
    const timerDisplay = document.getElementById('timer-display');
    const rsvpForm = document.getElementById('rsvp-form');
    const rsvpStatus = document.getElementById('rsvp-status');
    // const openButton = document.getElementById('open-undangan');

    // 1. Fungsi Countdown Timer
    const updateCountdown = setInterval(() => {
        const now = new Date().getTime();
        const distance = natalDate - now;

        // Perhitungan waktu
        const hari = Math.floor(distance / (1000 * 60 * 60 * 24));
        const jam = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const menit = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const detik = Math.floor((distance % (1000 * 60)) / 1000);

        // Tampilkan hasil
        timerDisplay.innerHTML = `${hari} Hari ${jam} Jam ${menit} Menit ${detik} Detik`;

        // Jika hitungan mundur selesai
        if (distance < 0) {
            clearInterval(updateCountdown);
            timerDisplay.innerHTML = "WAKTU NATAL TELAH TIBA! Selamat Datang.";
        }
    }, 1000);

    // 2. Interaksi Tombol "Buka Undangan" (Opsional, untuk menyembunyikan konten)
    /* openButton.addEventListener('click', () => {
        document.querySelectorAll('section, footer').forEach(el => {
            el.style.display = 'block'; // Tampilkan semua bagian setelah tombol diklik
        });
        openButton.style.display = 'none'; // Sembunyikan tombol
        // document.getElementById('background-music').play(); // Mulai musik
    });
    */

    // 3. Penanganan Form RSVP (Frontend Saja)
    rsvpForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const nama = document.getElementById('nama').value;
        const jumlah = document.getElementById('jumlah-hadir').value;

        // Logika sederhana untuk konfirmasi (Tanpa Database/Backend)
        if (nama && jumlah) {
            rsvpStatus.textContent = `Terima kasih, ${nama}! Konfirmasi ${jumlah} orang telah diterima. Sampai jumpa di Perayaan Natal!`;
            rsvpStatus.style.color = 'green';
            rsvpForm.reset(); // Kosongkan formulir
        } else {
            rsvpStatus.textContent = "Mohon lengkapi semua data.";
            rsvpStatus.style.color = 'red';
        }
        
        // CATATAN: Untuk menyimpan data RSVP secara permanen, Anda memerlukan layanan backend (misalnya Google Sheets/Form atau layanan khusus undangan)
    });
});
