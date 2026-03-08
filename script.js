// Mouse Hover Glow for Timeline Cards
const cards = document.querySelectorAll('.glow-card');

cards.forEach(card => {
    card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Pass coordinates to CSS variables
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
    });
});

// Intersection Observer for the Journey Nodes
const revealElements = document.querySelectorAll('.reveal');

const revealOptions = {
    threshold: 0.15, // Wait until 15% of the card is visible
    rootMargin: "0px 0px -40px 0px" // Trigger slightly before the bottom
};

const revealOnScroll = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        
        // Add 'active' class to trigger CSS side-sliding transitions
        entry.target.classList.add('active');
        
        // Only run animation once by un-observing
        observer.unobserve(entry.target);
    });
}, revealOptions);

// Adding slight delay to observer start so preloader hides first
setTimeout(() => {
    revealElements.forEach(el => revealOnScroll.observe(el));
}, 1000);

// All Authentic Personal Hiking Photos
const authenticImages = [
    'images/IMG_7700.JPG', 'images/IMG_7786.JPG', 'images/IMG_7801.JPG',
    'images/IMG_7827.JPG', 'images/IMG_7829.JPG', 'images/IMG_7858.JPG',
    'images/IMG_7880.JPG', 'images/IMG_7914.JPG', 'images/IMG_7915.JPG',
    'images/IMG_7931.JPG', 'images/IMG_7949.JPG', 'images/IMG_7953.JPG',
    'images/IMG_7973.JPG', 'images/IMG_7980.JPG', 'images/IMG_7998.JPG',
    'images/IMG_8029.JPG'
];

// Shuffle array utilizing Fisher-Yates
function shuffleImages(array) {
    let currentIndex = array.length, randomIndex;
    while (currentIndex != 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
}

// Background Manager & Timeline Progress
const bgManager = document.getElementById('bg-manager');
const bgLayers = document.querySelectorAll('.bg-layer');

// Initialize Randomized Backgrounds immediately
if (bgLayers.length === 4) {
    const shuffledPool = shuffleImages([...authenticImages]);
    bgLayers[0].style.setProperty('--bg-img', `url('${shuffledPool[0]}')`);
    bgLayers[1].style.setProperty('--bg-img', `url('${shuffledPool[1]}')`);
    bgLayers[2].style.setProperty('--bg-img', `url('${shuffledPool[2]}')`);
    bgLayers[3].style.setProperty('--bg-img', `url('${shuffledPool[3]}')`);
}
const timelineProgress = document.getElementById('timeline-progress');
const journeySection = document.querySelector('.journey-section');

window.addEventListener('scroll', () => {
    const scrollPosition = window.scrollY;
    
    // Parallax logic for the entire background manager
    if (bgManager && scrollPosition < window.innerHeight * 2) {
        bgManager.style.transform = `translateY(${scrollPosition * 0.4}px)`;
    }

    // Timeline progress filling AND Background Transitions
    if (journeySection && timelineProgress) {
        const journeyRect = journeySection.getBoundingClientRect();
        const startPoint = window.innerHeight / 2;
        
        let completionPercentage = 0;

        // Calculate progress line
        if (journeyRect.top < startPoint) {
            let scrollDistance = startPoint - journeyRect.top;
            const maxFill = journeyRect.height;
            const fillHeight = Math.min(scrollDistance, maxFill);
            
            timelineProgress.style.height = `${fillHeight}px`;
            
            // Calculate percentage of journey completed (0 to 1)
            completionPercentage = Math.max(0, Math.min(1, scrollDistance / maxFill));
        } else {
            timelineProgress.style.height = `0px`;
        }

        // Manage Multi-Stage Background Altitude Transitions based on scroll percentage
        // 0-25% Valley, 25-50% Ascent, 50-75% Clouds, 75-100% Peak
        let activeIndex = 0;
        if (completionPercentage > 0.75) activeIndex = 3;
        else if (completionPercentage > 0.50) activeIndex = 2;
        else if (completionPercentage > 0.25) activeIndex = 1;

        // Crossfade
        bgLayers.forEach((layer, idx) => {
            if (idx === activeIndex) {
                layer.classList.add('active');
            } else {
                layer.classList.remove('active');
            }
        });
    }
});

// Cinematic Preloader Fade Out
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        // Slight artificial delay to build dramatic tension
        setTimeout(() => {
            preloader.style.opacity = '0';
            preloader.style.visibility = 'hidden';
            
            // Re-trigger animations for elements already in viewport
            document.querySelectorAll('.reveal-on-load').forEach(el => {
                el.style.animation = 'none';
                el.offsetHeight; /* trigger reflow */
                el.style.animation = null; 
            });
        }, 800);
    }
    
    initParticles();
});

// Hero Particles (Floating Embers/Snow)
function initParticles() {
    const canvas = document.getElementById('hero-particles');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let width, height;
    let particles = [];
    
    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
    }
    
    window.addEventListener('resize', resize);
    resize();

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            // Particles drift upwards slowly
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() * -0.5) - 0.2; 
            this.radius = Math.random() * 2;
            // Golden sunlight dust / snow particles for upbeat theme
            const colors = ['rgba(255, 255, 255, 0.8)', 'rgba(253, 224, 71, 0.6)', 'rgba(250, 204, 21, 0.4)'];
            this.color = colors[Math.floor(Math.random() * colors.length)];
        }
        
        update() {
            this.x += this.vx;
            this.y += this.vy;
            
            // Wrap around bottom to top
            if (this.y < 0) {
                this.y = height;
                this.x = Math.random() * width;
            }
            if (this.x < 0) this.x = width;
            if (this.x > width) this.x = 0;
        }
        
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
        }
    }

    // Create 100 particles for the atmosphere
    for (let i = 0; i < 100; i++) {
        particles.push(new Particle());
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        
        requestAnimationFrame(animate);
    }
    
    animate();
}
