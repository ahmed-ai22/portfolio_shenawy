// ===== ADVANCED ANIMATIONS & INTERACTIONS =====

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function() {
    initAdvancedAnimations();
});

function initAdvancedAnimations() {
    initParticleSystem();
    initMouseFollower();
    initTextAnimations();
    initScrollReveal();
    initHoverEffects();
    initLoadingAnimations();
    initMorphingShapes();
    initInteractiveBackground();
}

// ===== PARTICLE SYSTEM =====
function initParticleSystem() {
    const canvas = document.createElement('canvas');
    canvas.id = 'particles-canvas';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '-1';
    canvas.style.opacity = '0.3';
    
    document.body.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouse = { x: 0, y: 0 };
    
    // Resize canvas
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    // Particle constructor
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 2;
            this.vy = (Math.random() - 0.5) * 2;
            this.radius = Math.random() * 3 + 1;
            this.opacity = Math.random() * 0.5 + 0.2;
        }
        
        update() {
            this.x += this.vx;
            this.y += this.vy;
            
            // Bounce off walls
            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
            
            // Mouse interaction
            const dx = mouse.x - this.x;
            const dy = mouse.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 100) {
                this.vx += dx * 0.0001;
                this.vy += dy * 0.0001;
            }
        }
        
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(99, 102, 241, ${this.opacity})`;
            ctx.fill();
        }
    }
    
    // Initialize particles
    function initParticles() {
        particles = [];
        const particleCount = Math.floor(canvas.width * canvas.height / 10000);
        
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }
    
    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        // Draw connections
        particles.forEach((particle, i) => {
            particles.slice(i + 1).forEach(otherParticle => {
                const dx = particle.x - otherParticle.x;
                const dy = particle.y - otherParticle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    ctx.beginPath();
                    ctx.moveTo(particle.x, particle.y);
                    ctx.lineTo(otherParticle.x, otherParticle.y);
                    ctx.strokeStyle = `rgba(99, 102, 241, ${0.1 * (1 - distance / 100)})`;
                    ctx.stroke();
                }
            });
        });
        
        requestAnimationFrame(animate);
    }
    
    // Event listeners
    window.addEventListener('resize', () => {
        resizeCanvas();
        initParticles();
    });
    
    document.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });
    
    // Initialize
    resizeCanvas();
    initParticles();
    animate();
}

// ===== MOUSE FOLLOWER =====
function initMouseFollower() {
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    cursor.style.cssText = `
        position: fixed;
        width: 20px;
        height: 20px;
        background: radial-gradient(circle, rgba(99, 102, 241, 0.8), transparent);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        transition: transform 0.1s ease;
        transform: translate(-50%, -50%);
    `;
    
    document.body.appendChild(cursor);
    
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });
    
    // Hover effects
    document.querySelectorAll('a, button, .btn').forEach(element => {
        element.addEventListener('mouseenter', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(2)';
            cursor.style.background = 'radial-gradient(circle, rgba(139, 92, 246, 0.8), transparent)';
        });
        
        element.addEventListener('mouseleave', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1)';
            cursor.style.background = 'radial-gradient(circle, rgba(99, 102, 241, 0.8), transparent)';
        });
    });
}

// ===== TEXT ANIMATIONS =====
function initTextAnimations() {
    // Split text into spans for character animation
    function splitText(element) {
        const text = element.textContent;
        element.innerHTML = '';
        
        text.split('').forEach((char, index) => {
            const span = document.createElement('span');
            span.textContent = char === ' ' ? '\u00A0' : char;
            span.style.display = 'inline-block';
            span.style.animationDelay = `${index * 0.05}s`;
            element.appendChild(span);
        });
    }
    
    // Animate text on scroll
    const textElements = document.querySelectorAll('.animate-text');
    
    const textObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                splitText(entry.target);
                entry.target.classList.add('text-animated');
                textObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    textElements.forEach(element => textObserver.observe(element));
}

// ===== SCROLL REVEAL =====
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.scroll-reveal');
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                
                // Stagger child elements
                const children = entry.target.querySelectorAll('.stagger');
                children.forEach((child, index) => {
                    child.style.animationDelay = `${index * 0.1}s`;
                    child.classList.add('stagger-animate');
                });
            }
        });
    }, { 
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    revealElements.forEach(element => revealObserver.observe(element));
}

// ===== HOVER EFFECTS =====
function initHoverEffects() {
    // 3D Tilt Effect
    document.querySelectorAll('.tilt-effect').forEach(element => {
        element.addEventListener('mousemove', (e) => {
            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
        });
        
        element.addEventListener('mouseleave', () => {
            element.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        });
    });
    
    // Magnetic Effect
    document.querySelectorAll('.magnetic').forEach(element => {
        element.addEventListener('mousemove', (e) => {
            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            element.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
        });
        
        element.addEventListener('mouseleave', () => {
            element.style.transform = 'translate(0px, 0px)';
        });
    });
    
    // Ripple Effect
    document.querySelectorAll('.ripple').forEach(element => {
        element.addEventListener('click', (e) => {
            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const ripple = document.createElement('span');
            ripple.className = 'ripple-effect';
            ripple.style.cssText = `
                position: absolute;
                left: ${x}px;
                top: ${y}px;
                width: 0;
                height: 0;
                background: rgba(255, 255, 255, 0.6);
                border-radius: 50%;
                transform: translate(-50%, -50%);
                animation: ripple-animation 0.6s ease-out;
                pointer-events: none;
            `;
            
            element.style.position = 'relative';
            element.style.overflow = 'hidden';
            element.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
    });
}

// ===== LOADING ANIMATIONS =====
function initLoadingAnimations() {
    // Skeleton loading
    const skeletonElements = document.querySelectorAll('.skeleton');
    
    setTimeout(() => {
        skeletonElements.forEach(element => {
            element.classList.remove('skeleton');
            element.classList.add('loaded');
        });
    }, 2000);
    
    // Progressive image loading
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                const loader = document.createElement('div');
                loader.className = 'image-loader';
                loader.style.cssText = `
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
                    background-size: 200% 100%;
                    animation: loading 1.5s infinite;
                `;
                
                img.parentElement.style.position = 'relative';
                img.parentElement.appendChild(loader);
                
                img.onload = () => {
                    loader.remove();
                    img.classList.add('loaded');
                };
                
                img.src = img.dataset.src;
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// ===== MORPHING SHAPES =====
function initMorphingShapes() {
    const shapes = document.querySelectorAll('.morphing-shape');
    
    shapes.forEach(shape => {
        let morphInterval = setInterval(() => {
            const borderRadius = [
                Math.random() * 50 + 25,
                Math.random() * 50 + 25,
                Math.random() * 50 + 25,
                Math.random() * 50 + 25
            ];
            
            shape.style.borderRadius = `${borderRadius[0]}% ${100 - borderRadius[0]}% ${borderRadius[1]}% ${100 - borderRadius[1]}% / ${borderRadius[2]}% ${borderRadius[3]}% ${100 - borderRadius[3]}% ${100 - borderRadius[2]}%`;
        }, 3000);
        
        // Pause on hover
        shape.addEventListener('mouseenter', () => {
            clearInterval(morphInterval);
        });
        
        shape.addEventListener('mouseleave', () => {
            morphInterval = setInterval(() => {
                const borderRadius = [
                    Math.random() * 50 + 25,
                    Math.random() * 50 + 25,
                    Math.random() * 50 + 25,
                    Math.random() * 50 + 25
                ];
                
                shape.style.borderRadius = `${borderRadius[0]}% ${100 - borderRadius[0]}% ${borderRadius[1]}% ${100 - borderRadius[1]}% / ${borderRadius[2]}% ${borderRadius[3]}% ${100 - borderRadius[3]}% ${100 - borderRadius[2]}%`;
            }, 3000);
        });
    });
}

// ===== INTERACTIVE BACKGROUND =====
function initInteractiveBackground() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    
    let mouseX = 0;
    let mouseY = 0;
    
    hero.addEventListener('mousemove', (e) => {
        mouseX = e.clientX / window.innerWidth;
        mouseY = e.clientY / window.innerHeight;
        
        const shapes = hero.querySelectorAll('.shape');
        shapes.forEach((shape, index) => {
            const speed = (index + 1) * 0.1;
            const x = mouseX * speed * 50;
            const y = mouseY * speed * 50;
            
            shape.style.transform = `translate(${x}px, ${y}px)`;
        });
    });
}

// ===== SCROLL PROGRESS INDICATOR =====
function initScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, #6366f1, #8b5cf6);
        z-index: 9999;
        transition: width 0.1s ease;
    `;
    
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        
        progressBar.style.width = scrolled + '%';
    });
}

// ===== INTERSECTION OBSERVER UTILITIES =====
function observeElements(selector, callback, options = {}) {
    const elements = document.querySelectorAll(selector);
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                callback(entry.target);
                if (options.once) {
                    observer.unobserve(entry.target);
                }
            }
        });
    }, {
        threshold: options.threshold || 0.1,
        rootMargin: options.rootMargin || '0px'
    });
    
    elements.forEach(element => observer.observe(element));
    
    return observer;
}

// ===== PERFORMANCE MONITORING =====
function initPerformanceMonitoring() {
    // Monitor animation frame rate
    let frames = 0;
    let lastTime = performance.now();
    
    function countFrames() {
        frames++;
        const currentTime = performance.now();
        
        if (currentTime - lastTime >= 1000) {
            const fps = Math.round((frames * 1000) / (currentTime - lastTime));
            
            // Reduce animations if FPS is low
            if (fps < 30) {
                document.body.classList.add('reduce-animations');
            } else {
                document.body.classList.remove('reduce-animations');
            }
            
            frames = 0;
            lastTime = currentTime;
        }
        
        requestAnimationFrame(countFrames);
    }
    
    requestAnimationFrame(countFrames);
}

// ===== GESTURE SUPPORT =====
function initGestureSupport() {
    let startX, startY, endX, endY;
    
    document.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
    });
    
    document.addEventListener('touchend', (e) => {
        endX = e.changedTouches[0].clientX;
        endY = e.changedTouches[0].clientY;
        
        const deltaX = endX - startX;
        const deltaY = endY - startY;
        
        // Swipe detection
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            if (Math.abs(deltaX) > 50) {
                if (deltaX > 0) {
                    // Swipe right
                    document.dispatchEvent(new CustomEvent('swiperight'));
                } else {
                    // Swipe left
                    document.dispatchEvent(new CustomEvent('swipeleft'));
                }
            }
        } else {
            if (Math.abs(deltaY) > 50) {
                if (deltaY > 0) {
                    // Swipe down
                    document.dispatchEvent(new CustomEvent('swipedown'));
                } else {
                    // Swipe up
                    document.dispatchEvent(new CustomEvent('swipeup'));
                }
            }
        }
    });
}

// Initialize additional features
initScrollProgress();
initPerformanceMonitoring();
initGestureSupport();

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple-animation {
        to {
            width: 400px;
            height: 400px;
            opacity: 0;
        }
    }
    
    @keyframes loading {
        0% { background-position: 200% 0; }
        100% { background-position: -200% 0; }
    }
    
    .scroll-reveal {
        opacity: 0;
        transform: translateY(50px);
        transition: all 0.8s ease;
    }
    
    .scroll-reveal.revealed {
        opacity: 1;
        transform: translateY(0);
    }
    
    .stagger {
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.6s ease;
    }
    
    .stagger.stagger-animate {
        opacity: 1;
        transform: translateY(0);
    }
    
    .tilt-effect {
        transition: transform 0.3s ease;
    }
    
    .magnetic {
        transition: transform 0.3s ease;
    }
    
    .image-loader {
        pointer-events: none;
    }
    
    .loaded {
        animation: fadeIn 0.5s ease;
    }
    
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    .reduce-animations * {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
    }
    
    @media (prefers-reduced-motion: reduce) {
        .custom-cursor {
            display: none;
        }
        
        #particles-canvas {
            display: none;
        }
    }
`;

document.head.appendChild(style);

// Export functions for external use
window.animations = {
    observeElements,
    initParticleSystem,
    initMouseFollower,
    initTextAnimations,
    initScrollReveal,
    initHoverEffects
};