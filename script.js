// Animação de Partículas em Escala de Cinza
const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');

let particles = [];
let animationId;
let mouse = { x: null, y: null, radius: 150 };

// Configurações
const config = {
    particleCount: window.innerWidth < 768 ? 30 : 60,
    connectionDistance: 120,
    mouseDistance: 200,
    speed: 0.3,
    size: 1.5
};

// Redimensionar canvas
function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener('resize', () => {
    resize();
    init();
});

// Classe Partícula
class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * config.speed;
        this.vy = (Math.random() - 0.5) * config.speed;
        this.size = Math.random() * config.size + 0.5;
        this.opacity = Math.random() * 0.5 + 0.1;
    }

    update() {
        // Movimento base
        this.x += this.vx;
        this.y += this.vy;

        // Interação com mouse
        if (mouse.x != null) {
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < config.mouseDistance) {
                const force = (config.mouseDistance - distance) / config.mouseDistance;
                const directionX = dx / distance;
                const directionY = dy / distance;
                this.vx += directionX * force * 0.02;
                this.vy += directionY * force * 0.02;
            }
        }

        // Limitar velocidade
        const maxSpeed = 1;
        const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
        if (speed > maxSpeed) {
            this.vx = (this.vx / speed) * maxSpeed;
            this.vy = (this.vy / speed) * maxSpeed;
        }

        // Bordas - wrap around
        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.fill();
    }
}

// Inicializar partículas
function init() {
    particles = [];
    for (let i = 0; i < config.particleCount; i++) {
        particles.push(new Particle());
    }
}

// Desenhar conexões entre partículas próximas
function connect() {
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < config.connectionDistance) {
                const opacity = (1 - distance / config.connectionDistance) * 0.15;
                ctx.beginPath();
                ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
                ctx.lineWidth = 0.5;
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    }
}

// Animação principal
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach(particle => {
        particle.update();
        particle.draw();
    });
    
    connect();
    
    animationId = requestAnimationFrame(animate);
}

// Event listeners de mouse
window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
});

window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
});

// Efeito de parallax sutil no header
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallax = document.querySelector('header');
    const speed = scrolled * 0.5;
    parallax.style.transform = `translateY(${speed}px)`;
});

// Iniciar
resize();
init();
animate();

// Efeito de "glitch" sutil no título ao carregar (opcional, muito sutil)
document.addEventListener('DOMContentLoaded', () => {
    const title = document.querySelector('h1');
    title.style.opacity = '0';
    
    setTimeout(() => {
        title.style.transition = 'opacity 2s ease-out';
        title.style.opacity = '1';
    }, 100);
});
