document.addEventListener('DOMContentLoaded', () => {
    // Reveal animations on scroll
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach(el => {
        observer.observe(el);
    });

    // Floating Particles (Hearts/Petals)
    const particlesContainer = document.getElementById('particles-container');
    const particleIcons = ['fa-heart', 'fa-leaf'];
    
    function createParticle() {
        const particle = document.createElement('i');
        const icon = particleIcons[Math.floor(Math.random() * particleIcons.length)];
        
        particle.className = `fas ${icon} floating-asset`;
        particle.style.left = Math.random() * 100 + 'vw';
        particle.style.fontSize = (Math.random() * 10 + 10) + 'px';
        particle.style.color = Math.random() > 0.5 ? '#D4AF37' : '#E5D3B3';
        particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
        
        particlesContainer.appendChild(particle);
        
        setTimeout(() => {
            particle.remove();
        }, 20000);
    }

    setInterval(createParticle, 2000);

    // Countdown Timer
    const weddingDate = new Date("August 29, 2026 13:00:00").getTime();
    
    const countdownInterval = setInterval(() => {
        const now = new Date().getTime();
        const distance = weddingDate - now;
        
        if (distance < 0) {
            clearInterval(countdownInterval);
            const countdownEl = document.getElementById("countdown");
            if (countdownEl) countdownEl.innerHTML = "<div class='section-title reveal active'><h2>It's Time!</h2></div>";
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        const updateNumber = (id, value) => {
            const el = document.getElementById(id);
            if (!el) return;
            const strValue = value < 10 ? "0" + value : String(value);
            if (el.innerText !== strValue) {
                el.innerText = strValue;
                el.classList.remove('number-pop');
                void el.offsetWidth; // Trigger reflow
                el.classList.add('number-pop');
            }
        };

        updateNumber("days", days);
        updateNumber("hours", hours);
        updateNumber("minutes", minutes);
        updateNumber("seconds", seconds);
    }, 1000);

    // Parallax Effect for Hero
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const heroBg = document.querySelector('.hero-bg');
        if (heroBg) {
            heroBg.style.transform = `translateY(${scrolled * 0.5}px) scale(1.1)`;
        }
    });

    // Carousel Logic
    const track = document.querySelector('.carousel-track');
    if (track) {
        const slides = Array.from(track.children);
        const nextButton = document.querySelector('.carousel-btn.next');
        const prevButton = document.querySelector('.carousel-btn.prev');
        const dotsNav = document.querySelector('.carousel-indicators');
        const dots = Array.from(dotsNav.children);

        let currentSlideIndex = 0;

        const moveToSlide = (index) => {
            const slideWidth = slides[0].getBoundingClientRect().width;
            track.style.transform = 'translateX(-' + index * slideWidth + 'px)';
            
            slides.forEach(s => s.classList.remove('active'));
            slides[index].classList.add('active');
            
            dots.forEach(d => d.classList.remove('active'));
            dots[index].classList.add('active');
            
            currentSlideIndex = index;
        };

        nextButton.addEventListener('click', () => {
            let nextIndex = currentSlideIndex + 1;
            if (nextIndex >= slides.length) nextIndex = 0;
            moveToSlide(nextIndex);
        });

        prevButton.addEventListener('click', () => {
            let prevIndex = currentSlideIndex - 1;
            if (prevIndex < 0) prevIndex = slides.length - 1;
            moveToSlide(prevIndex);
        });

        dotsNav.addEventListener('click', e => {
            const targetDot = e.target.closest('span');
            if (!targetDot) return;
            const targetIndex = dots.findIndex(dot => dot === targetDot);
            moveToSlide(targetIndex);
        });

        // Auto-play carousel
        setInterval(() => {
            let nextIndex = currentSlideIndex + 1;
            if (nextIndex >= slides.length) nextIndex = 0;
            moveToSlide(nextIndex);
        }, 5000);
    }

    // Pet Collision Logic
    const petContainer1 = document.querySelector('.running-pet-container');
    const petContainer2 = document.querySelector('.running-pet-container-2');
    
    if (petContainer1 && petContainer2) {
        const bearContainer = document.createElement('div');
        bearContainer.id = 'cute-bear-container';
        bearContainer.style.display = 'none';
        bearContainer.style.position = 'absolute';
        bearContainer.style.bottom = '5px';
        bearContainer.style.width = '100px';
        bearContainer.style.zIndex = '10';
        bearContainer.innerHTML = '<img src="assets/cute-bears.gif" alt="Cute Bears" style="width: 100%;">';
        document.querySelector('footer').appendChild(bearContainer);

        let isColliding = false;

        function checkPetCollision() {
            if (!isColliding) {
                const rect1 = petContainer1.getBoundingClientRect();
                const rect2 = petContainer2.getBoundingClientRect();

                // Check for overlap
                if (rect1.right > rect2.left && rect1.left < rect2.right && rect1.width > 0) {
                    // Make sure they are visible on screen
                    if (rect1.right > 0 && rect2.left < window.innerWidth && rect2.right > 0 && rect1.left < window.innerWidth) {
                        isColliding = true;
                        
                        // Hide running pets
                        petContainer1.style.display = 'none';
                        petContainer2.style.display = 'none';
                        
                        // Position the bears exactly where they collided
                        const collisionX = (rect1.left + rect1.width / 2);
                        bearContainer.style.left = `${collisionX}px`;
                        bearContainer.style.transform = 'translateX(-50%)';
                        bearContainer.style.display = 'block';

                        // Show bears for 3 seconds, then reset
                        setTimeout(() => {
                            bearContainer.style.display = 'none';
                            
                            // Reset animations
                            petContainer1.style.animation = 'none';
                            petContainer2.style.animation = 'none';
                            petContainer1.style.display = 'block';
                            petContainer2.style.display = 'block';
                            
                            // Trigger reflow
                            void petContainer1.offsetWidth;
                            void petContainer2.offsetWidth;
                            
                            // Restore animations
                            petContainer1.style.animation = '';
                            petContainer2.style.animation = '';
                            
                            // Prevent immediate re-collision
                            setTimeout(() => {
                                isColliding = false;
                            }, 2000);
                        }, 3000);
                    }
                }
            }
            requestAnimationFrame(checkPetCollision);
        }
        
        checkPetCollision();
    }

    // Copy to clipboard functionality
    document.querySelectorAll('.copy-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const textToCopy = btn.getAttribute('data-copy');
            if (!textToCopy) return;
            
            navigator.clipboard.writeText(textToCopy).then(() => {
                const originalContent = btn.innerHTML;
                btn.innerHTML = '<i class="fas fa-check"></i> Copied!';
                btn.classList.add('copied');
                btn.style.pointerEvents = 'none';
                
                setTimeout(() => {
                    btn.innerHTML = originalContent;
                    btn.classList.remove('copied');
                    btn.style.pointerEvents = 'auto';
                }, 2000);
            }).catch(err => {
                console.error('Could not copy text: ', err);
            });
        });
    });
});
