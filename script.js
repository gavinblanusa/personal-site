document.documentElement.classList.add('js');

const cards = document.querySelectorAll('.glow-card');
const revealElements = document.querySelectorAll('.reveal');
const bgManager = document.getElementById('bg-manager');
const bgLayers = document.querySelectorAll('.bg-layer');
const timelineProgress = document.getElementById('timeline-progress');
const journeySection = document.querySelector('.journey-section');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

cards.forEach(card => {
    card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
        card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
    });
});

const revealOnScroll = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
    });
}, {
    threshold: 0.14,
    rootMargin: '0px 0px -48px 0px'
});

revealElements.forEach(el => revealOnScroll.observe(el));

const altitudeImages = [
    'images/IMG_7827.JPG',
    'images/IMG_7953.JPG',
    'images/IMG_7980.JPG',
    'images/IMG_8029.JPG'
];

bgLayers.forEach((layer, index) => {
    layer.style.setProperty('--bg-img', `url('${altitudeImages[index] || altitudeImages[0]}')`);
});

function updateTimeline() {
    const scrollPosition = window.scrollY;

    if (bgManager && !reducedMotion && scrollPosition < window.innerHeight * 2) {
        bgManager.style.transform = `translateY(${scrollPosition * 0.18}px)`;
    }

    if (!journeySection || !timelineProgress) return;

    const journeyRect = journeySection.getBoundingClientRect();
    const startPoint = window.innerHeight / 2;
    let completionPercentage = 0;

    if (journeyRect.top < startPoint) {
        const scrollDistance = startPoint - journeyRect.top;
        const fillHeight = Math.min(scrollDistance, journeyRect.height);
        timelineProgress.style.height = `${fillHeight}px`;
        completionPercentage = Math.max(0, Math.min(1, scrollDistance / journeyRect.height));
    } else {
        timelineProgress.style.height = '0px';
    }

    let activeIndex = 0;
    if (completionPercentage > 0.75) activeIndex = 3;
    else if (completionPercentage > 0.50) activeIndex = 2;
    else if (completionPercentage > 0.25) activeIndex = 1;

    bgLayers.forEach((layer, index) => {
        layer.classList.toggle('active', index === activeIndex);
    });
}

window.addEventListener('scroll', updateTimeline, { passive: true });
window.addEventListener('resize', updateTimeline);
updateTimeline();
