// 3D Canvas Background with Abstract Flowing Shapes
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');

let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

// Particle system for flowing hair-like strands
class Particle {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.radius = Math.random() * 2 + 1;
        this.opacity = Math.random() * 0.5 + 0.2;
        this.color = this.getRandomColor();
    }

    getRandomColor() {
        const colors = [
            'rgba(196, 181, 216, ', // soft lavender
            'rgba(224, 224, 232, ', // chrome
            'rgba(45, 27, 61, ',    // deep plum
            'rgba(26, 26, 62, '     // midnight blue
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        // Wrap around edges
        if (this.x < 0) this.x = width;
        if (this.x > width) this.x = 0;
        if (this.y < 0) this.y = height;
        if (this.y > height) this.y = 0;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color + this.opacity + ')';
        ctx.fill();
    }
}

// Abstract flowing shapes
class FlowingShape {
    constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 200 + 100;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.002;
        this.opacity = Math.random() * 0.15 + 0.05;
        this.pulseSpeed = Math.random() * 0.02 + 0.01;
        this.pulseOffset = Math.random() * Math.PI * 2;
    }

    update(time) {
        this.rotation += this.rotationSpeed;
        const pulse = Math.sin(time * this.pulseSpeed + this.pulseOffset);
        this.currentSize = this.size + pulse * 20;
    }

    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);

        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.currentSize);
        gradient.addColorStop(0, `rgba(196, 181, 216, ${this.opacity})`);
        gradient.addColorStop(0.5, `rgba(45, 27, 61, ${this.opacity * 0.5})`);
        gradient.addColorStop(1, 'rgba(26, 26, 62, 0)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.ellipse(0, 0, this.currentSize, this.currentSize * 0.6, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }
}

// Initialize particles and shapes (reduced for performance)
const particles = [];
const shapes = [];

// Reduced particle count from 100 to 50 for better performance
for (let i = 0; i < 50; i++) {
    particles.push(new Particle());
}

// Reduced shape count from 5 to 3 for better performance
for (let i = 0; i < 3; i++) {
    shapes.push(new FlowingShape());
}

// Animation loop
let time = 0;
function animate() {
    ctx.fillStyle = 'rgba(45, 27, 61, 0.1)';
    ctx.fillRect(0, 0, width, height);

    time += 0.01;

    // Update and draw shapes
    shapes.forEach(shape => {
        shape.update(time);
        shape.draw();
    });

    // Update and draw particles
    particles.forEach(particle => {
        particle.update();
        particle.draw();
    });

    // Draw connections between close particles (optimized with frame skipping)
    // Only draw connections every other frame for better performance
    if (Math.floor(time * 100) % 2 === 0) {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 120) {  // Reduced from 150 for fewer connections
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(196, 181, 216, ${0.1 * (1 - distance / 120)})`;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }
        }
    }

    requestAnimationFrame(animate);
}

animate();

// Handle window resize with debouncing for better performance
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }, 150);
}, { passive: true });

// Parallax Scroll Effects (optimized version below, this section replaced by requestAnimationFrame version)
let scrollY = 0;

// Scroll-triggered animations for collection items
const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe collection items
document.querySelectorAll('.collection-item').forEach(item => {
    observer.observe(item);
});

// Observe story cards
document.querySelectorAll('.story-card').forEach(card => {
    observer.observe(card);
});

// Smooth scroll for navigation links
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            targetSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Form submission handler (demo)
const submitBtn = document.querySelector('.submit-btn');
if (submitBtn) {
    submitBtn.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Get form values
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const service = document.getElementById('service').value;
        const message = document.getElementById('message').value;
        
        // Basic validation
        if (!name || !email || !phone) {
            alert('Please fill in all required fields.');
            return;
        }
        
        // Demo success message
        submitBtn.innerHTML = '<span>Request Sent ✓</span>';
        submitBtn.style.background = 'linear-gradient(135deg, #4CAF50, #45a049)';
        
        setTimeout(() => {
            submitBtn.innerHTML = '<span>Submit Request</span><div class="btn-glow"></div>';
            submitBtn.style.background = 'linear-gradient(135deg, var(--soft-lavender), var(--midnight-blue))';
            
            // Clear form
            document.getElementById('name').value = '';
            document.getElementById('email').value = '';
            document.getElementById('phone').value = '';
            document.getElementById('message').value = '';
        }, 3000);
    });
}

// Add mouse movement parallax effect with throttling
let mouseX = 0;
let mouseY = 0;
let mouseMoveTicking = false;

document.addEventListener('mousemove', (e) => {
    if (!mouseMoveTicking) {
        mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
        
        window.requestAnimationFrame(() => {
            // Apply subtle mouse parallax to intro shape
            const introShape = document.querySelector('.intro-shape');
            if (introShape && window.scrollY < window.innerHeight) {
                introShape.style.transform = `translate(calc(-50% + ${mouseX * 20}px), calc(-50% + ${mouseY * 20}px))`;
            }
            mouseMoveTicking = false;
        });
        
        mouseMoveTicking = true;
    }
}, { passive: true });

// Add cursor glow effect
const cursorGlow = document.createElement('div');
cursorGlow.style.cssText = `
    position: fixed;
    width: 400px;
    height: 400px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(196, 181, 216, 0.1), transparent 70%);
    pointer-events: none;
    z-index: 9999;
    transform: translate(-50%, -50%);
    transition: opacity 0.3s ease;
    opacity: 0;
`;
document.body.appendChild(cursorGlow);

let cursorGlowTicking = false;
document.addEventListener('mousemove', (e) => {
    if (!cursorGlowTicking) {
        window.requestAnimationFrame(() => {
            cursorGlow.style.left = e.clientX + 'px';
            cursorGlow.style.top = e.clientY + 'px';
            cursorGlow.style.opacity = '1';
            cursorGlowTicking = false;
        });
        cursorGlowTicking = true;
    }
}, { passive: true });

document.addEventListener('mouseleave', () => {
    cursorGlow.style.opacity = '0';
});

// Add performance optimization for parallax with requestAnimationFrame
let ticking = false;
let cachedParallaxLayers = null;

function updateParallax() {
    // Cache layer selection to avoid repeated querySelectorAll
    if (!cachedParallaxLayers) {
        cachedParallaxLayers = document.querySelectorAll('.parallax-layer');
    }
    
    cachedParallaxLayers.forEach(layer => {
        const speed = parseFloat(layer.getAttribute('data-speed')) || 0.5;
        const rect = layer.getBoundingClientRect();
        const layerTop = rect.top + scrollY;
        const offset = (scrollY - layerTop) * speed;
        
        layer.style.transform = `translate3d(0, ${offset}px, 0)`;
    });
    
    // Handle intro scene rotation
    const introShape = document.querySelector('.intro-shape');
    if (introShape && scrollY < window.innerHeight) {
        introShape.style.transform = `translate(-50%, -50%) rotate(${scrollY * 0.1}deg) scale(${1 + scrollY * 0.0005})`;
    }

    // Floating shape morphing
    const floatingShape = document.querySelector('.floating-shape');
    if (floatingShape) {
        floatingShape.style.transform = `rotate(${scrollY * 0.05}deg)`;
    }
    
    ticking = false;
}

window.addEventListener('scroll', () => {
    scrollY = window.scrollY;
    
    if (!ticking) {
        window.requestAnimationFrame(updateParallax);
        ticking = true;
    }
}, { passive: true });

// Initialize on load
window.addEventListener('load', () => {
    // Trigger initial parallax calculation
    updateParallax();
    
    // Add loaded class for any entry animations
    document.body.classList.add('loaded');
});
