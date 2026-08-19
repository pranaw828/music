// SONORA Mockup Application JavaScript
document.addEventListener("DOMContentLoaded", () => {

    // Navbar Scroll Density Transition
    const navbar = document.getElementById("navbar");
    window.addEventListener("scroll", () => {
        if (window.scrollY > 40) {
            navbar.classList.add("scrolled");
        } else {
            navbar.classList.remove("scrolled");
        }
    });

    // Track Data
    const tracks = [
        {
            id: 0,
            title: "Afterglow",
            artist: "Nova Vale",
            duration: "3:18",
            durationSec: 198,
            color: "url('cover_discover.png') center / cover no-repeat",
            mood: "chill"
        },
        {
            id: 1,
            title: "Neon Skies",
            artist: "Aria North",
            duration: "4:05",
            durationSec: 245,
            color: "url('cover_tothits.png') center / cover no-repeat",
            mood: "focus"
        },
        {
            id: 2,
            title: "Slow Motion",
            artist: "The Midnight Club",
            duration: "2:52",
            durationSec: 172,
            color: "url('cover_rap.png') center / cover no-repeat",
            mood: "hype"
        },
        {
            id: 3,
            title: "Midnight Echo",
            artist: "Lost Orbit",
            duration: "3:40",
            durationSec: 220,
            color: "url('cover_allout.png') center / cover no-repeat",
            mood: "late-night"
        },
        {
            id: 4,
            title: "Warm Embrace",
            artist: "Acoustic Hearts",
            duration: "3:10",
            durationSec: 190,
            color: "url('cover_daily.png') center / cover no-repeat",
            mood: "love"
        }
    ];

    // State Variables
    let currentTrackIndex = 0;
    let isPlaying = false;
    let playProgress = 0; // in seconds
    let progressInterval = null;

    // Selector references
    const heroPlayerCover = document.getElementById("hero-player-cover");
    const heroPlayerTitle = document.getElementById("hero-player-title");
    const heroPlayerArtist = document.getElementById("hero-player-artist");
    const heroPlayerPlay = document.getElementById("hero-player-play");
    const heroPlayerFill = document.getElementById("hero-player-fill");
    const heroPlayerProgress = document.getElementById("hero-player-progress");
    const heroPlayerTime = document.getElementById("hero-player-time");
    const heroPlayerTotal = document.getElementById("hero-player-total");

    // Dynamic Atmosphere Changer (updates CSS variables smoothly)
    function changeAtmosphere(moodName) {
        const root = document.documentElement;
        let pColor, sColor;

        switch (moodName) {
            case "chill":
                pColor = "#60a5fa"; // blue
                sColor = "#8b5cf6"; // purple
                break;
            case "hype":
                pColor = "#f59e0b"; // gold
                sColor = "#ec4899"; // pink
                break;
            case "focus":
                pColor = "#1ed760"; // premium emerald
                sColor = "#06b6d4"; // cyan
                break;
            case "love":
                pColor = "#f43f5e"; // rose
                sColor = "#fb7185"; // coral
                break;
            case "late-night":
                pColor = "#6366f1"; // indigo
                sColor = "#8b5cf6"; // violet
                break;
            default:
                pColor = "#1ed760";
                sColor = "#8b5cf6";
        }

        root.style.setProperty("--color-emerald", pColor);
        root.style.setProperty("--color-purple", sColor);
        root.style.setProperty("--color-emerald-glow", pColor + "66");
        root.style.setProperty("--color-purple-glow", sColor + "66");
    }

    // Load Track into floating Player
    function loadTrack(index, autostart = false) {
        currentTrackIndex = index;
        const track = tracks[index];

        // Update player elements
        if (heroPlayerTitle) heroPlayerTitle.textContent = track.title;
        if (heroPlayerArtist) heroPlayerArtist.textContent = track.artist;
        if (heroPlayerCover) heroPlayerCover.style.background = track.color;
        if (heroPlayerTotal) heroPlayerTotal.textContent = track.duration;

        playProgress = 0;
        updateProgressBar();
        changeAtmosphere(track.mood);

        if (autostart) {
            play();
        } else {
            pause();
        }
    }

    function play() {
        isPlaying = true;
        if (heroPlayerPlay) {
            heroPlayerPlay.innerHTML = `<svg viewBox="0 0 24 24" width="14" height="14" fill="#000000"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>`;
        }

        if (progressInterval) clearInterval(progressInterval);

        progressInterval = setInterval(() => {
            playProgress++;
            if (playProgress >= tracks[currentTrackIndex].durationSec) {
                nextTrack();
            }
            updateProgressBar();
        }, 1000);
    }

    function pause() {
        isPlaying = false;
        if (heroPlayerPlay) {
            heroPlayerPlay.innerHTML = `<svg viewBox="0 0 24 24" width="14" height="14" fill="#000000"><path d="M8 5v14l11-7z"/></svg>`;
        }
        if (progressInterval) {
            clearInterval(progressInterval);
            progressInterval = null;
        }
    }

    function togglePlay() {
        if (isPlaying) {
            pause();
        } else {
            play();
        }
    }

    function nextTrack() {
        const nextIndex = (currentTrackIndex + 1) % tracks.length;
        loadTrack(nextIndex, isPlaying);
    }

    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }

    function updateProgressBar() {
        const track = tracks[currentTrackIndex];
        const pct = (playProgress / track.durationSec) * 100;
        if (heroPlayerFill) heroPlayerFill.style.width = `${pct}%`;
        if (heroPlayerTime) heroPlayerTime.textContent = formatTime(playProgress);
    }

    // Scrubbing event
    if (heroPlayerProgress) {
        heroPlayerProgress.addEventListener("click", (e) => {
            const rect = heroPlayerProgress.getBoundingClientRect();
            const pct = (e.clientX - rect.left) / rect.width;
            const track = tracks[currentTrackIndex];
            playProgress = Math.floor(pct * track.durationSec);
            updateProgressBar();
        });
    }

    // Toggle Play Event
    if (heroPlayerPlay) {
        heroPlayerPlay.addEventListener("click", togglePlay);
    }

    // Vibe Vertical Card Click triggers
    document.querySelectorAll(".vibe-card-vertical").forEach(card => {
        card.addEventListener("click", () => {
            const trackId = parseInt(card.getAttribute("data-track-id"));
            loadTrack(trackId, true);
            // Scroll to top to see the player react
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });

    // Album Playlist Click triggers
    document.querySelectorAll(".playlist-card").forEach(card => {
        card.addEventListener("click", () => {
            const trackId = parseInt(card.getAttribute("data-track-id"));
            loadTrack(trackId, true);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });

    // Vibe button play trigger
    const playVibeBtn = document.getElementById("btn-play-vibe");
    if (playVibeBtn) {
        playVibeBtn.addEventListener("click", () => {
            // Pick a random track and play
            const randIndex = Math.floor(Math.random() * tracks.length);
            loadTrack(randIndex, true);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ==========================================
    // CANVAS AUDIO WAVEFORM
    // ==========================================
    function initConnectingWaveform() {
        const waveCanvas = document.getElementById("connecting-waveform-moment");
        if (!waveCanvas) return;

        const ctx = waveCanvas.getContext("2d");

        function resizeCanvas() {
            waveCanvas.width = waveCanvas.parentElement.clientWidth;
            waveCanvas.height = 80;
        }

        resizeCanvas();
        window.addEventListener("resize", resizeCanvas);

        let phase = 0;

        function animateWave() {
            phase += 0.02;
            const w = waveCanvas.width;
            const h = waveCanvas.height;
            ctx.clearRect(0, 0, w, h);

            // Set glowing gradient line
            const grad = ctx.createLinearGradient(0, 0, w, 0);
            grad.addColorStop(0, "rgba(236, 72, 153, 0.6)"); // pink
            grad.addColorStop(0.5, "rgba(139, 92, 246, 0.8)"); // purple
            grad.addColorStop(1, "rgba(30, 215, 96, 0.6)"); // green

            ctx.strokeStyle = grad;
            ctx.lineWidth = 3;
            ctx.shadowColor = "rgba(139, 92, 246, 0.5)";
            ctx.shadowBlur = 10;
            ctx.beginPath();

            for (let x = 0; x < w; x++) {
                const angle = (x / w) * Math.PI * 4 + phase;
                const amp = isPlaying ? 22 : 10;
                const y = h / 2 + Math.sin(angle) * amp * Math.cos(angle * 0.25);
                if (x === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.stroke();

            // Draw a subtle second wave line
            ctx.shadowBlur = 0;
            ctx.strokeStyle = "rgba(255, 255, 255, 0.06)";
            ctx.lineWidth = 1;
            ctx.beginPath();
            for (let x = 0; x < w; x++) {
                const angle = (x / w) * Math.PI * 6.5 - phase * 0.8;
                const amp = isPlaying ? 14 : 6;
                const y = h / 2 + Math.sin(angle) * amp;
                if (x === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.stroke();

            requestAnimationFrame(animateWave);
        }

        animateWave();
    }

    // ==========================================
    // SCROLL REVEAL OBSERVER
    // ==========================================
    const revealElements = document.querySelectorAll(".reveal-on-scroll");

    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("revealed");
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.02,
            rootMargin: "0px 0px -20px 0px"
        });

        revealElements.forEach(el => {
            revealObserver.observe(el);
        });
    } else {
        revealElements.forEach(el => el.classList.add("revealed"));
    }

    // Fallback for immediate reveals on scroll
    function revealOnScrollFallback() {
        revealElements.forEach(el => {
            if (!el.classList.contains("revealed")) {
                const rect = el.getBoundingClientRect();
                const windowHeight = window.innerHeight || document.documentElement.clientHeight;
                if (rect.top <= windowHeight * 0.92) {
                    el.classList.add("revealed");
                }
            }
        });
    }
    window.addEventListener("scroll", revealOnScrollFallback);
    window.addEventListener("resize", revealOnScrollFallback);
    setTimeout(revealOnScrollFallback, 150);

    // ==========================================
    // MAGICAL OVERLAY (GLITTER & BUTTERFLIES)
    // ==========================================
    function initMagicalOverlay() {
        const canvas = document.getElementById("magical-overlay");
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        let w = canvas.width = window.innerWidth;
        let h = canvas.height = window.innerHeight;

        window.addEventListener("resize", () => {
            w = canvas.width = window.innerWidth;
            h = canvas.height = window.innerHeight;
        });

        // Sparkle / Glitter Particle Class
        class Sparkle {
            constructor(x, y, isButterflyTrail = false) {
                this.x = x;
                this.y = y;
                this.size = Math.random() * 4 + (isButterflyTrail ? 2 : 1);
                this.vx = (Math.random() - 0.5) * 1.5;
                this.vy = isButterflyTrail ? (Math.random() - 0.3) * 1.2 : -Math.random() * 1.5 - 0.5;
                this.alpha = 1;
                this.fadeSpeed = Math.random() * 0.015 + 0.008;
                const colors = ["#1ed760", "#8b5cf6", "#ec4899", "#06b6d4", "#ffffff"];
                this.color = colors[Math.floor(Math.random() * colors.length)];
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;
                this.alpha -= this.fadeSpeed;
            }

            draw() {
                ctx.save();
                ctx.globalAlpha = this.alpha;
                ctx.fillStyle = this.color;
                ctx.shadowColor = this.color;
                ctx.shadowBlur = this.size * 2;

                // Draw 4-point sparkle star
                ctx.beginPath();
                ctx.moveTo(this.x, this.y - this.size);
                ctx.quadraticCurveTo(this.x, this.y, this.x + this.size, this.y);
                ctx.quadraticCurveTo(this.x, this.y, this.x, this.y + this.size);
                ctx.quadraticCurveTo(this.x, this.y, this.x - this.size, this.y);
                ctx.quadraticCurveTo(this.x, this.y, this.x, this.y - this.size);
                ctx.closePath();
                ctx.fill();

                ctx.restore();
            }
        }

        // Floating Music Note Class
        class MusicNote {
            constructor(x, y) {
                this.x = x || Math.random() * w;
                this.y = y || h + 20;
                this.size = Math.random() * 12 + 12; // size between 12px and 24px
                this.vx = (Math.random() - 0.5) * 1.0;
                this.vy = -Math.random() * 1.5 - 0.5; // drift upwards
                this.alpha = 1;
                this.fadeSpeed = Math.random() * 0.01 + 0.006;
                this.rotation = Math.random() * Math.PI * 2;
                this.rotationSpeed = (Math.random() - 0.5) * 0.03;

                const noteSymbols = ["🎵", "🎶", "♩", "♫", "♬", "♭", "♮"];
                this.char = noteSymbols[Math.floor(Math.random() * noteSymbols.length)];

                const colors = ["#1ed760", "#8b5cf6", "#ec4899", "#06b6d4", "#ffffff"];
                this.color = colors[Math.floor(Math.random() * colors.length)];
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;
                this.rotation += this.rotationSpeed;
                this.alpha -= this.fadeSpeed;
            }

            draw() {
                ctx.save();
                ctx.globalAlpha = this.alpha;
                ctx.translate(this.x, this.y);
                ctx.rotate(this.rotation);

                ctx.fillStyle = this.color;
                ctx.shadowColor = this.color;
                ctx.shadowBlur = 10;
                ctx.font = `${this.size}px sans-serif`;
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillText(this.char, 0, 0);

                ctx.restore();
            }
        }

        // Updated Butterfly with Music Note Trail
        class Butterfly {
            constructor() {
                this.reset();
                this.x = -50 - Math.random() * 500;
            }

            reset() {
                this.x = -50;
                this.y = Math.random() * (h * 0.7) + h * 0.1;
                this.vx = Math.random() * 1.5 + 1.2;
                this.vy = 0;
                this.baseY = this.y;
                this.anglePhase = Math.random() * Math.PI * 2;
                this.wingFlapPhase = Math.random() * Math.PI * 2;
                this.wingFlapSpeed = Math.random() * 0.15 + 0.18;
                const colors = ["#1ed760", "#8b5cf6", "#ec4899", "#06b6d4"];
                this.color = colors[Math.floor(Math.random() * colors.length)];
                this.size = Math.random() * 6 + 10;
            }

            update() {
                this.x += this.vx;
                this.anglePhase += 0.03;
                this.wingFlapPhase += this.wingFlapSpeed;

                this.vy = Math.sin(this.anglePhase) * 1.5;
                this.y = this.baseY + Math.sin(this.anglePhase * 0.8) * 80;

                if (this.x > w + 50) {
                    this.reset();
                }

                // Spawn sparkles and music notes
                if (Math.random() < 0.3) {
                    sparkles.push(new Sparkle(this.x, this.y, true));
                }
                if (Math.random() < 0.06) {
                    musicNotes.push(new MusicNote(this.x, this.y));
                }
            }

            draw() {
                ctx.save();
                ctx.translate(this.x, this.y);

                const angle = Math.atan2(this.vy, this.vx);
                ctx.rotate(angle);

                const flap = Math.abs(Math.sin(this.wingFlapPhase));

                ctx.shadowColor = this.color;
                ctx.shadowBlur = 12;
                ctx.fillStyle = this.color;

                ctx.beginPath();
                ctx.ellipse(-3, -3, this.size * flap, this.size * 0.6, -Math.PI / 6, 0, Math.PI * 2);
                ctx.ellipse(-3, 3, this.size * 0.7 * flap, this.size * 0.45, Math.PI / 6, 0, Math.PI * 2);
                ctx.fill();

                ctx.beginPath();
                ctx.ellipse(3, -3, this.size * flap, this.size * 0.6, Math.PI / 6, 0, Math.PI * 2);
                ctx.ellipse(3, 3, this.size * 0.7 * flap, this.size * 0.45, -Math.PI / 6, 0, Math.PI * 2);
                ctx.fill();

                ctx.strokeStyle = "#ffffff";
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(-1, -5);
                ctx.quadraticCurveTo(-4, -10, -6, -12);
                ctx.moveTo(1, -5);
                ctx.quadraticCurveTo(4, -10, 6, -12);
                ctx.stroke();

                ctx.fillStyle = "#ffffff";
                ctx.shadowBlur = 0;
                ctx.beginPath();
                ctx.ellipse(0, 0, 1.8, this.size * 0.6, 0, 0, Math.PI * 2);
                ctx.fill();

                ctx.restore();
            }
        }

        const sparkles = [];
        const musicNotes = [];
        const butterflies = [new Butterfly(), new Butterfly(), new Butterfly()];

        function spawnAmbientGlitter() {
            if (sparkles.length < 120 && Math.random() < 0.08) {
                sparkles.push(new Sparkle(Math.random() * w, Math.random() * h));
            }
            if (musicNotes.length < 25 && Math.random() < 0.015) {
                musicNotes.push(new MusicNote());
            }
        }

        function animate() {
            ctx.clearRect(0, 0, w, h);

            spawnAmbientGlitter();

            // Sparkles
            for (let i = sparkles.length - 1; i >= 0; i--) {
                const s = sparkles[i];
                s.update();
                if (s.alpha <= 0) {
                    sparkles.splice(i, 1);
                } else {
                    s.draw();
                }
            }

            // Music Notes
            for (let i = musicNotes.length - 1; i >= 0; i--) {
                const n = musicNotes[i];
                n.update();
                if (n.alpha <= 0) {
                    musicNotes.splice(i, 1);
                } else {
                    n.draw();
                }
            }

            // Butterflies
            butterflies.forEach(b => {
                b.update();
                b.draw();
            });

            requestAnimationFrame(animate);
        }

        animate();
    }

    // ==========================================
    // INITIALIZATION RUNNER
    // ==========================================
    loadTrack(0);
    initConnectingWaveform();
    initMagicalOverlay();
});
