/* ==========================================================================
   FOREVER FRIENDSHIP WEB APP - INTERACTIVE SCRIPT (RAI ↔ RATUL)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // --- State & Storage ---
    const state = {
        friendName: localStorage.getItem('ff_friendName') || 'Ratul',
        yourName: localStorage.getItem('ff_yourName') || 'Rai',
        hugCount: parseInt(localStorage.getItem('ff_hugCount')) || 108,
        isPlayingAudio: false,
        audioContext: null,
        soundGain: null,
        notes: [
            { text: "Ratul, take a deep breath right now. Relax your shoulders and un-clench your jaw. You're doing incredible work in Bangladesh! ☕", cat: "Self-Care Pause" },
            { text: "Ratul, do not ever worry about taking time to reply. My friendship comes with ZERO pressure. Focus on your hustle! 💪", cat: "Zero Pressure" },
            { text: "No border or work deadline can stop Rai and Ratul from being best friends forever! ❤️", cat: "Cross-Border Bond" },
            { text: "Ratul, drink a glass of water right now and stretch your back! Your health comes first.", cat: "Friendly Reminder" },
            { text: "I believe in your talent, your intelligence, and your heart, Ratul—even on days when work feels overwhelming. 🌟", cat: "Motivation Boost" },
            { text: "Distance is just a physical measurement. Connected hearts between Rai in India & Ratul in Bangladesh don't care about miles. 🚀", cat: "Forever Bond" },
            { text: "Rai is sending you a giant warm virtual hug right across the border! Hugs delivered to Ratul! 🤗", cat: "Virtual Hug" },
            { text: "Ratul, never feel like you are bothering me. 3 AM thoughts, rants, or memes are ALWAYS welcome! 📞", cat: "Open Hotline" },
            { text: "Your hard work today is building the amazing future you deserve, Ratul. Keep pushing, Rai is cheering for you! 🏆", cat: "Hustle Cheer" },
            { text: "Remember Ratul: It's okay to take a break. The world can wait while you recharge your batteries. 🌙", cat: "Rest Easy" }
        ],
        currentNoteIndex: 0
    };

    // --- DOM Element References ---
    const elements = {
        starCanvas: document.getElementById('starCanvas'),
        hugBtn: document.getElementById('hugBtn'),
        hugCountDisplay: document.getElementById('hugCount'),
        soundToggleBtn: document.getElementById('soundToggleBtn'),
        audioPlayToggle: document.getElementById('audioPlayToggle'),
        volumeSlider: document.getElementById('volumeSlider'),
        digitalJar: document.getElementById('digitalJar'),
        drawNoteBtn: document.getElementById('drawNoteBtn'),
        noteCard: document.getElementById('noteCard'),
        noteNumber: document.getElementById('noteNumber'),
        noteCategory: document.getElementById('noteCategory'),
        noteText: document.getElementById('noteText'),
        shareNoteBtn: document.getElementById('shareNoteBtn'),
        presetBtns: document.querySelectorAll('.preset-btn'),
        copyLetterBtn: document.getElementById('copyLetterBtn'),
        triggerHeartShower: document.getElementById('triggerHeartShower'),
        customizeBtn: document.getElementById('customizeBtn'),
        customizeModal: document.getElementById('customizeModal'),
        closeModalBtn: document.getElementById('closeModalBtn'),
        saveCustomizeBtn: document.getElementById('saveCustomizeBtn'),
        friendNameInput: document.getElementById('friendNameInput'),
        yourNameInput: document.getElementById('yourNameInput'),
        friendNameTexts: document.querySelectorAll('.friend-name-text'),
        waLauncher: document.getElementById('waLauncher'),
        tgLauncher: document.getElementById('tgLauncher'),
        copyCustomLinkBtn: document.getElementById('copyCustomLinkBtn'),
        indiaTime: document.getElementById('indiaTime'),
        bdTime: document.getElementById('bdTime'),
        toastContainer: document.getElementById('toastContainer')
    };

    // --- Toast Notification System ---
    function showToast(message, icon = 'fa-heart') {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${message}</span>`;
        elements.toastContainer.appendChild(toast);
        setTimeout(() => {
            toast.style.animation = 'toastIn 0.3s ease reverse forwards';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // --- Dynamic Clocks for Rai (India) & Ratul (Bangladesh) ---
    function updateClocks() {
        const now = new Date();
        
        // India Time (UTC + 5:30)
        const indiaDate = new Date(now.getTime() + (now.getTimezoneOffset() * 60000) + (330 * 60000));
        const indiaTimeString = indiaDate.toLocaleTimeString('en-US', { hour12: true, hour: '2-digit', minute: '2-digit', second: '2-digit' });
        if (elements.indiaTime) elements.indiaTime.textContent = indiaTimeString;

        // Bangladesh Time (UTC + 6:00)
        const bdDate = new Date(now.getTime() + (now.getTimezoneOffset() * 60000) + (360 * 60000));
        const bdTimeString = bdDate.toLocaleTimeString('en-US', { hour12: true, hour: '2-digit', minute: '2-digit', second: '2-digit' });
        if (elements.bdTime) elements.bdTime.textContent = bdTimeString;
    }
    setInterval(updateClocks, 1000);
    updateClocks();

    // --- Dynamic Name Personalization ---
    function updateNames() {
        elements.friendNameTexts.forEach(el => el.textContent = state.friendName);
        elements.friendNameInput.value = state.friendName;
        elements.yourNameInput.value = state.yourName;
        
        // Update direct messaging links if present
        const defaultMsg = encodeURIComponent(`Hey ${state.friendName}! ${state.yourName} here sending love! Hope your work is going awesome today! <3`);
        if (elements.waLauncher) elements.waLauncher.href = `https://wa.me/?text=${defaultMsg}`;
        if (elements.tgLauncher) elements.tgLauncher.href = `https://t.me/share/url?url=&text=${defaultMsg}`;
    }

    // Personalize Modal Events
    elements.customizeBtn.addEventListener('click', () => elements.customizeModal.classList.add('active'));
    elements.closeModalBtn.addEventListener('click', () => elements.customizeModal.classList.remove('active'));
    elements.saveCustomizeBtn.addEventListener('click', () => {
        state.friendName = elements.friendNameInput.value.trim() || 'Ratul';
        state.yourName = elements.yourNameInput.value.trim() || 'Rai';
        localStorage.setItem('ff_friendName', state.friendName);
        localStorage.setItem('ff_yourName', state.yourName);
        updateNames();
        elements.customizeModal.classList.remove('active');
        showToast('Personalized names updated!', 'fa-user-check');
    });

    // --- Hug Counter & Floating Hearts Particles ---
    elements.hugCountDisplay.textContent = state.hugCount;

    function createFloatingHeart(x, y) {
        const heart = document.createElement('div');
        heart.className = 'floating-heart';
        const icons = ['💖', '❤️', '✨', '🌸', '🤗', '💕'];
        heart.textContent = icons[Math.floor(Math.random() * icons.length)];
        
        const startX = x || (window.innerWidth / 2 + (Math.random() * 200 - 100));
        const startY = y || (window.innerHeight / 2 + 100);
        
        heart.style.left = `${startX}px`;
        heart.style.top = `${startY}px`;
        
        document.body.appendChild(heart);
        setTimeout(() => heart.remove(), 2500);
    }

    function triggerHugShower(e) {
        state.hugCount += 1;
        state.hugCountDisplay.textContent = state.hugCount;
        localStorage.setItem('ff_hugCount', state.hugCount);

        const rect = e ? e.target.getBoundingClientRect() : null;
        const clickX = rect ? rect.left + rect.width / 2 : window.innerWidth / 2;
        const clickY = rect ? rect.top : window.innerHeight / 2;

        for (let i = 0; i < 12; i++) {
            setTimeout(() => {
                const offsetX = clickX + (Math.random() * 160 - 80);
                createFloatingHeart(offsetX, clickY);
            }, i * 100);
        }

        playChimeSound();
        showToast(`Virtual Hug sent from Rai to ${state.friendName}! ❤️`, 'fa-heart');
    }

    elements.hugBtn.addEventListener('click', triggerHugShower);
    elements.triggerHeartShower.addEventListener('click', () => {
        for(let i = 0; i < 20; i++) {
            setTimeout(() => createFloatingHeart(Math.random() * window.innerWidth, window.innerHeight - 100), i * 120);
        }
        playChimeSound();
        showToast('Infinite Heart Wave Sent from Rai to Ratul! ✨', 'fa-sparkles');
    });

    // --- Web Audio Synthesizer (Lofi Ambient Music & Chimes) ---
    function playChimeSound() {
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            
            osc.type = 'sine';
            osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
            osc.frequency.exponentialRampToValueAtTime(1046.50, ctx.currentTime + 0.3); // C6
            
            gain.gain.setValueAtTime(0.3, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.8);
            
            osc.connect(gain);
            gain.connect(ctx.destination);
            
            osc.start();
            osc.stop(ctx.currentTime + 0.8);
        } catch(e) {
            console.log("Audio not allowed yet");
        }
    }

    const bgAudio = document.getElementById('bgMusic');
    let ytPlayer = null;
    let ytPlayerReady = false;

    // Load YouTube IFrame API dynamically
    const tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    window.onYouTubeIframeAPIReady = function() {
        ytPlayer = new YT.Player('ytPlayer', {
            height: '160',
            width: '100%',
            videoId: 'Qh2rvERynRo', // Tumi - Bengali Song
            playerVars: {
                'playsinline': 1,
                'controls': 1,
                'rel': 0,
                'modestbranding': 1
            },
            events: {
                'onReady': () => { ytPlayerReady = true; },
                'onStateChange': (e) => {
                    if (e.data === YT.PlayerState.PLAYING) {
                        state.isPlayingAudio = true;
                        elements.soundToggleBtn.classList.add('playing');
                        if (elements.audioPlayToggle) {
                            elements.audioPlayToggle.innerHTML = '<i class="fa-solid fa-pause"></i> Pause Tumi';
                        }
                    } else if (e.data === YT.PlayerState.PAUSED || e.data === YT.PlayerState.ENDED) {
                        state.isPlayingAudio = false;
                        elements.soundToggleBtn.classList.remove('playing');
                        if (elements.audioPlayToggle) {
                            elements.audioPlayToggle.innerHTML = '<i class="fa-solid fa-play"></i> Play Tumi';
                        }
                    }
                }
            }
        });
    };

    function toggleTumi() {
        // If local MP3 file is playing
        if (bgAudio && bgAudio.currentTime > 0 && !bgAudio.paused) {
            bgAudio.pause();
            state.isPlayingAudio = false;
            elements.soundToggleBtn.classList.remove('playing');
            if (elements.audioPlayToggle) elements.audioPlayToggle.innerHTML = '<i class="fa-solid fa-play"></i> Play Tumi';
            showToast('Tumi paused', 'fa-pause');
            return;
        }

        // Play via YouTube Player API
        if (ytPlayer && ytPlayerReady) {
            const playerState = ytPlayer.getPlayerState();
            if (playerState === YT.PlayerState.PLAYING) {
                ytPlayer.pauseVideo();
                showToast('Tumi paused', 'fa-pause');
            } else {
                ytPlayer.playVideo();
                showToast('Playing Tumi 🎵', 'fa-music');
            }
        } else if (bgAudio && bgAudio.src) {
            // Fallback HTML5 audio
            bgAudio.play().then(() => {
                state.isPlayingAudio = true;
                elements.soundToggleBtn.classList.add('playing');
                if (elements.audioPlayToggle) elements.audioPlayToggle.innerHTML = '<i class="fa-solid fa-pause"></i> Pause Tumi';
                showToast('Playing Tumi 🎵', 'fa-music');
            }).catch(() => {
                showToast('Click the YouTube player frame below to play Tumi 🎵', 'fa-circle-play');
            });
        }
    }

    // Local MP3 File Upload Handler for Tumi
    const mp3Input = document.getElementById('mp3FileInput');
    if (mp3Input) {
        mp3Input.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file && bgAudio) {
                const fileURL = URL.createObjectURL(file);
                bgAudio.src = fileURL;
                bgAudio.play().then(() => {
                    state.isPlayingAudio = true;
                    elements.soundToggleBtn.classList.add('playing');
                    if (elements.audioPlayToggle) {
                        elements.audioPlayToggle.innerHTML = '<i class="fa-solid fa-pause"></i> Pause Song';
                    }
                    showToast(`Playing "${file.name}" 🎵`, 'fa-music');
                }).catch(err => {
                    console.error("Audio playback error:", err);
                });
            }
        });
    }

    elements.soundToggleBtn.addEventListener('click', toggleTumi);
    if (elements.audioPlayToggle) elements.audioPlayToggle.addEventListener('click', toggleTumi);
    elements.volumeSlider.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        if (bgAudio) bgAudio.volume = val;
        if (state.soundGain && state.audioContext) {
            state.soundGain.gain.setValueAtTime(val, state.audioContext.currentTime);
        }
    });

    // --- Digital Encouragement Jar Note Drawer ---
    function drawNote() {
        if (!elements.noteCard) return;

        // Pick next or random note
        const randomIndex = Math.floor(Math.random() * state.notes.length);
        state.currentNoteIndex = (randomIndex === state.currentNoteIndex) ? (randomIndex + 1) % state.notes.length : randomIndex;
        const current = state.notes[state.currentNoteIndex];

        // Animate card scale & pop
        elements.noteCard.style.transform = 'scale(0.92)';
        elements.noteCard.style.opacity = '0.5';

        setTimeout(() => {
            elements.noteNumber.textContent = state.currentNoteIndex + 1;
            elements.noteCategory.textContent = current.cat;
            elements.noteText.textContent = `"${current.text}"`;

            elements.noteCard.style.transform = 'scale(1.03)';
            elements.noteCard.style.opacity = '1';

            setTimeout(() => {
                elements.noteCard.style.transform = 'scale(1)';
            }, 150);

            // Spawn floating star particles from the jar
            if (elements.digitalJar) {
                const jarRect = elements.digitalJar.getBoundingClientRect();
                for (let i = 0; i < 5; i++) {
                    createFloatingHeart(jarRect.left + jarRect.width / 2 + (Math.random() * 60 - 30), jarRect.top + 20);
                }
            }

            playChimeSound();
        }, 150);
    }

    // Expose drawNote globally for inline onclick
    window.drawNote = drawNote;

    if (elements.drawNoteBtn) elements.drawNoteBtn.addEventListener('click', drawNote);
    if (elements.digitalJar) elements.digitalJar.addEventListener('click', drawNote);
    elements.shareNoteBtn.addEventListener('click', () => {
        const textToCopy = elements.noteText.textContent;
        navigator.clipboard.writeText(textToCopy).then(() => {
            showToast('Note copied to clipboard!', 'fa-copy');
        });
    });

    // --- One-Tap Preset Text Copier ---
    elements.presetBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const text = btn.getAttribute('data-text');
            navigator.clipboard.writeText(text).then(() => {
                showToast('Preset text copied! Ready to send.', 'fa-paper-plane');
            });
        });
    });

    // Copy App Link
    if (elements.copyCustomLinkBtn) {
        elements.copyCustomLinkBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(window.location.href).then(() => {
                showToast('Website link copied to clipboard!', 'fa-link');
            });
        });
    }

    // Copy Personal Letter
    elements.copyLetterBtn.addEventListener('click', () => {
        const letterText = document.querySelector('.letter-body').innerText;
        navigator.clipboard.writeText(letterText).then(() => {
            showToast('Personal letter copied to clipboard!', 'fa-envelope');
        });
    });

    // --- Interactive Constellation Star Canvas (Rai ↔ Ratul Nodes) ---
    function initStarCanvas() {
        const canvas = elements.starCanvas;
        const ctx = canvas.getContext('2d');
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        });

        // Background stars
        const stars = Array.from({ length: 90 }, () => ({
            x: Math.random() * width,
            y: Math.random() * height,
            radius: Math.random() * 1.8 + 0.5,
            alpha: Math.random(),
            speed: Math.random() * 0.01 + 0.003
        }));

        let time = 0;

        function animate() {
            ctx.clearRect(0, 0, width, height);

            // Draw stars
            stars.forEach(star => {
                star.alpha += star.speed;
                if (star.alpha > 1 || star.alpha < 0) star.speed = -star.speed;
                ctx.fillStyle = `rgba(255, 255, 255, ${Math.abs(star.alpha)})`;
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
                ctx.fill();
            });

            // Connected nodes: Rai (Node 1) & Ratul (Node 2)
            time += 0.015;
            const node1 = { x: width * 0.22, y: height * 0.35 + Math.sin(time) * 12 };
            const node2 = { x: width * 0.78, y: height * 0.65 + Math.cos(time) * 12 };

            const control1 = { x: width * 0.45, y: height * 0.2 + Math.cos(time * 0.8) * 20 };
            const control2 = { x: width * 0.55, y: height * 0.8 + Math.sin(time * 0.8) * 20 };

            // Draw glowing golden bridge line
            ctx.strokeStyle = 'rgba(255, 192, 72, 0.35)';
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.moveTo(node1.x, node1.y);
            ctx.bezierCurveTo(control1.x, control1.y, control2.x, control2.y, node2.x, node2.y);
            ctx.stroke();

            // Traveling light pulse
            const t = (Math.sin(time * 1.4) + 1) / 2;
            const px = Math.pow(1 - t, 3) * node1.x + 3 * Math.pow(1 - t, 2) * t * control1.x + 3 * (1 - t) * Math.pow(t, 2) * control2.x + Math.pow(t, 3) * node2.x;
            const py = Math.pow(1 - t, 3) * node1.y + 3 * Math.pow(1 - t, 2) * t * control1.y + 3 * (1 - t) * Math.pow(t, 2) * control2.y + Math.pow(t, 3) * node2.y;

            // Pulse glowing dot
            const glowGradient = ctx.createRadialGradient(px, py, 0, px, py, 20);
            glowGradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
            glowGradient.addColorStop(0.4, 'rgba(255, 101, 132, 0.85)');
            glowGradient.addColorStop(1, 'rgba(138, 79, 255, 0)');
            ctx.fillStyle = glowGradient;
            ctx.beginPath();
            ctx.arc(px, py, 20, 0, Math.PI * 2);
            ctx.fill();

            // Label Rai Node
            ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
            ctx.font = '600 13px "Outfit", sans-serif';
            ctx.fillText('Rai (India)', node1.x - 20, node1.y - 14);

            // Label Ratul Node
            ctx.fillText('Ratul (Bangladesh)', node2.x - 35, node2.y + 28);

            requestAnimationFrame(animate);
        }

        animate();
    }

    // Clear old localStorage values to enforce clean Rai & Ratul names
    localStorage.setItem('ff_friendName', 'Ratul');
    localStorage.setItem('ff_yourName', 'Rai');

    // Initialize Canvas & Names
    initStarCanvas();
    updateNames();
});
