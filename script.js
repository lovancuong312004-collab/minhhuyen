document.addEventListener('DOMContentLoaded', () => {
    // --- Web Audio API Synthesizer ---
    let audioCtx;
    let isAudioEnabled = true;
    const audioToggleBtn = document.getElementById('audio-toggle-btn');
    
    function initAudio() {
        if (!audioCtx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            audioCtx = new AudioContext();
        }
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
    }

    function playHoverSound() {
        if (!isAudioEnabled || !audioCtx) return;
        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(300, audioCtx.currentTime + 0.1);
        gainNode.gain.setValueAtTime(0.02, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);
        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.1);
    }

    function playClickSound() {
        if (!isAudioEnabled || !audioCtx) return;
        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1200, audioCtx.currentTime + 0.1);
        gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);
        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.1);
    }

    function playIntroSound() {
        if (!isAudioEnabled || !audioCtx) return;
        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(200, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(800, audioCtx.currentTime + 1.5);
        gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.1, audioCtx.currentTime + 0.2);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1.5);
        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 1.5);
    }

    if (audioToggleBtn) {
        audioToggleBtn.addEventListener('click', () => {
            isAudioEnabled = !isAudioEnabled;
            const icon = audioToggleBtn.querySelector('i');
            if (isAudioEnabled) {
                icon.className = 'ph ph-speaker-high';
                audioToggleBtn.classList.remove('muted');
                initAudio();
                playClickSound();
            } else {
                icon.className = 'ph ph-speaker-x';
                audioToggleBtn.classList.add('muted');
            }
        });
    }

    // 0. Intro Loading Screen
    const introLoader = document.querySelector('.intro-loader');
    const introStartBtn = document.getElementById('intro-start-btn');
    
    if (introLoader && introStartBtn) {
        introStartBtn.addEventListener('click', () => {
            initAudio();
            playIntroSound();
            introLoader.classList.add('fade-out');
            document.body.classList.remove('loading');
            setTimeout(() => {
                introLoader.remove();
            }, 1000);
        });
    }

    // Bind sounds to interactables
    document.querySelectorAll('a, button, .magnetic-btn, .nav-link, .nav-btn, .btn, .social-link').forEach(el => {
        el.addEventListener('mouseenter', () => playHoverSound());
        el.addEventListener('click', () => playClickSound());
    });

    // 1. Navbar scroll effect & ScrollSpy
    const navbar = document.querySelector('.navbar');
    const sections = document.querySelectorAll('section');
    const navLinksList = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            // Add offset to trigger slightly before reaching the section
            if (scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navLinksList.forEach(link => {
            link.classList.remove('active');
            if (current && link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });

        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 2. Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    mobileMenuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const icon = mobileMenuBtn.querySelector('i');
        if (navLinks.classList.contains('active')) {
            icon.classList.replace('ph-list', 'ph-x');
        } else {
            icon.classList.replace('ph-x', 'ph-list');
        }
    });

    // Close mobile menu when a link is clicked
    document.querySelectorAll('.nav-link, .nav-btn').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            mobileMenuBtn.querySelector('i').classList.replace('ph-x', 'ph-list');
        });
    });

    // 3. Scroll Reveal Animation
    const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
    
    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    revealElements.forEach(el => {
        revealOnScroll.observe(el);
    });

    // Trigger reveal on load for elements already in viewport
    setTimeout(() => {
        revealElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight) {
                el.classList.add('active');
            }
        });
    }, 100);

    // 4. Typing Effect for Subtitle
    const textToType = "Người truyền cảm hứng cho tương lai";
    const typingElement = document.querySelector('.typing-text');
    let charIndex = 0;

    function typeText() {
        if (charIndex < textToType.length) {
            typingElement.textContent += textToType.charAt(charIndex);
            charIndex++;
            setTimeout(typeText, 100);
        }
    }
    
    setTimeout(typeText, 1000); // Start typing after 1 second

    // 5. Generate Background Particles (Educational Icons)
    const particlesContainer = document.getElementById('particles');
    const icons = ['ph-pencil-simple', 'ph-book-open', 'ph-star', 'ph-apple-logo', 'ph-graduation-cap'];
    const particleCount = 15;

    for (let i = 0; i < particleCount; i++) {
        createParticle();
    }

    function createParticle() {
        const particle = document.createElement('i');
        const randomIcon = icons[Math.floor(Math.random() * icons.length)];
        particle.className = `ph ${randomIcon} particle`;
        
        // Random properties
        const size = Math.random() * 20 + 10; // 10px to 30px
        const left = Math.random() * 100; // 0% to 100%
        const animationDuration = Math.random() * 15 + 15; // 15s to 30s
        const animationDelay = Math.random() * 20; // 0s to 20s
        
        particle.style.fontSize = `${size}px`;
        particle.style.left = `${left}vw`;
        particle.style.animationDuration = `${animationDuration}s`;
        particle.style.animationDelay = `-${animationDelay}s`; // Negative delay to start at different heights
        
        particlesContainer.appendChild(particle);
    }
    
    // Parallax effect on mouse move for Hero Image
    const heroSection = document.querySelector('.hero');
    const heroImage = document.querySelector('.hero-image-wrapper');
    
    if (window.innerWidth > 768) {
        heroSection.addEventListener('mousemove', (e) => {
            const xAxis = (window.innerWidth / 2 - e.pageX) / 25;
            const yAxis = (window.innerHeight / 2 - e.pageY) / 25;
            heroImage.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
        });
        
        heroSection.addEventListener('mouseleave', () => {
            heroImage.style.transform = `rotateY(0deg) rotateX(0deg)`;
        });
    }

    // 7. Custom Cursor
    const cursor = document.querySelector('.custom-cursor');
    const cursorFollower = document.querySelector('.custom-cursor-follower');
    
    if (cursor && cursorFollower && window.matchMedia("(pointer: fine)").matches) {
        let mouseX = 0, mouseY = 0;
        let cursorX = 0, cursorY = 0;
        let followerX = 0, followerY = 0;
        let prevMouseX = 0;

        document.addEventListener('mousemove', (e) => {
            prevMouseX = mouseX;
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        // Smooth animation using requestAnimationFrame
        function animateCursor() {
            // Whale follows cursor almost instantly
            cursorX += (mouseX - cursorX) * 0.85;
            cursorY += (mouseY - cursorY) * 0.85;
            
            // Bubble trail follows with more delay
            followerX += (mouseX - followerX) * 0.08;
            followerY += (mouseY - followerY) * 0.08;
            
            cursor.style.left = `${cursorX}px`;
            cursor.style.top = `${cursorY}px`;

            // Flip whale when moving left
            const movingLeft = mouseX < prevMouseX;
            cursor.style.transform = movingLeft 
                ? 'translate(-75%, -50%) scaleX(-1)' 
                : 'translate(-25%, -50%)';
            
            cursorFollower.style.left = `${followerX}px`;
            cursorFollower.style.top = `${followerY}px`;
            
            requestAnimationFrame(animateCursor);
        }
        animateCursor();

        // Hover states for links and buttons
        const interactables = document.querySelectorAll('a, button, .magnetic-btn, .nav-link, .nav-btn, .btn, .social-link');
        interactables.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.classList.add('hover');
                cursorFollower.classList.add('hover');
            });
            el.addEventListener('mouseleave', () => {
                cursor.classList.remove('hover');
                cursorFollower.classList.remove('hover');
            });
        });
    }

    // 8. Magnetic Buttons (reduced intensity for better UX)
    const magneticButtons = document.querySelectorAll('.btn, .social-btn, .nav-btn');
    if (window.innerWidth > 768) {
        magneticButtons.forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const h = rect.width / 2;
                const v = rect.height / 2;
                const x = e.clientX - rect.left - h;
                const y = e.clientY - rect.top - v;
                
                // Reduced intensity (0.15 instead of 0.3) for smoother interaction
                btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
                btn.style.transition = 'transform 0.1s ease-out';
            });

            btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'translate(0px, 0px)';
                btn.style.transition = 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            });
        });
    }

    // 9. Mouse-tracking Card Glow
    const glowCards = document.querySelectorAll('.about-card, .timeline-content, .skill-card');
    glowCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    // 10. Count-Up Animation for Stats
    const statNumbers = document.querySelectorAll('.stat-number');
    let statsAnimated = false;

    function animateCountUp() {
        statNumbers.forEach(num => {
            const target = parseFloat(num.getAttribute('data-target'));
            const suffix = num.getAttribute('data-suffix') || '';
            const isDecimal = num.getAttribute('data-decimal') === 'true';
            const duration = 2000; // ms
            const startTime = performance.now();

            function updateCount(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                // Ease out cubic
                const ease = 1 - Math.pow(1 - progress, 3);
                const current = target * ease;

                if (isDecimal) {
                    num.textContent = current.toFixed(2) + suffix;
                } else {
                    num.textContent = Math.floor(current) + suffix;
                }

                if (progress < 1) {
                    requestAnimationFrame(updateCount);
                } else {
                    if (isDecimal) {
                        num.textContent = target.toFixed(2) + suffix;
                    } else {
                        num.textContent = target + suffix;
                    }
                }
            }
            requestAnimationFrame(updateCount);
        });
    }

    const statsSection = document.querySelector('.stats-section');
    if (statsSection) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !statsAnimated) {
                    statsAnimated = true;
                    animateCountUp();
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        statsObserver.observe(statsSection);
    }

    // 11. Tilt 3D Effect for Philosophy Cards & Skill Cards
    const tiltCards = document.querySelectorAll('.tilt-card, .skill-card');
    if (window.innerWidth > 768) {
        tiltCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = (y - centerY) / 10;
                const rotateY = (centerX - x) / 10;

                card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px) scale(1.02)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateY(0) scale(1)';
                card.style.transition = 'transform 0.5s ease';
            });

            card.addEventListener('mouseenter', () => {
                card.style.transition = 'none';
            });
        });
    }

    // 12. Timeline Scroll Progress (Animated Line)
    const timeline = document.querySelector('.timeline');
    if (timeline) {
        const timelineLine = timeline.querySelector('::before') || null;
        
        window.addEventListener('scroll', () => {
            const rect = timeline.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            const timelineTop = rect.top;
            const timelineHeight = rect.height;

            if (timelineTop < windowHeight && rect.bottom > 0) {
                const scrolled = Math.min(Math.max((windowHeight - timelineTop) / (timelineHeight + windowHeight), 0), 1);
                timeline.style.setProperty('--timeline-progress', `${scrolled * 100}%`);
            }
        });
    }

    // 13. Parallax Scrolling for Ambient Glows
    const glows = document.querySelectorAll('.ambient-glow');
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        glows.forEach((glow, i) => {
            const speed = i === 0 ? 0.03 : 0.02;
            glow.style.transform = `translateY(${scrollY * speed}px)`;
        });
    });

    // 14. Interactive Particles (Bubbles)
    const canvas = document.getElementById('particles-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width, height;
        let particles = [];
        let mouse = { x: -1000, y: -1000 };

        function resize() {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        }
        window.addEventListener('resize', resize);
        resize();

        window.addEventListener('mousemove', (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });

        class Particle {
            constructor() {
                this.reset();
                this.y = Math.random() * height; // initial random spread
            }
            reset() {
                this.x = Math.random() * width;
                this.y = height + Math.random() * 100;
                this.size = Math.random() * 4 + 1;
                this.baseX = this.x;
                this.speed = Math.random() * 1 + 0.5;
                this.angle = Math.random() * Math.PI * 2;
            }
            update() {
                this.y -= this.speed;
                // Wobble
                this.angle += 0.02;
                this.x = this.baseX + Math.sin(this.angle) * 20;

                // Mouse repel logic
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const maxDist = 100;

                if (dist < maxDist) {
                    const force = (maxDist - dist) / maxDist;
                    this.x -= (dx / dist) * force * 5;
                    this.y -= (dy / dist) * force * 5;
                    this.baseX -= (dx / dist) * force * 2; // permanently push base slightly
                }

                if (this.y < -50 || this.x < -50 || this.x > width + 50) {
                    this.reset();
                }
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(147, 197, 253, ${0.1 + (this.size / 10)})`; // #93C5FD with varying opacity
                ctx.fill();
            }
        }

        for (let i = 0; i < 40; i++) {
            particles.push(new Particle());
        }

        function animateParticles() {
            ctx.clearRect(0, 0, width, height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            requestAnimationFrame(animateParticles);
        }
        animateParticles();
    }
});
