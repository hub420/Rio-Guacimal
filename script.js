// Menu hamburguesa
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    // Cerrar menu al hacer click en un enlace
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });

    // Cerrar menu al hacer click fuera
    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        }
    });
}

// Scroll suave
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Animación al hacer scroll
const observerOptions = {
    threshold: 0.1,
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

// Aplicar animación a elementos
document.querySelectorAll('.problem-card, .action-item, .participate-card, .stat-box').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    observer.observe(el);
});

// Validación del formulario
const contactForm = document.querySelector('.contact-form');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Mostrar mensaje de éxito
        alert('¡Gracias por tu mensaje! Nos pondremos en contacto contigo pronto.');
        contactForm.reset();
    });
}

// Cambiar estilo del header al hacer scroll
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (window.scrollY > 100) {
        header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15)';
    } else {
        header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    }
});

// Contador animado para estadísticas
const animateCounter = (element, target) => {
    let current = 0;
    const increment = target / 100;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target.toLocaleString() + (element.dataset.suffix || '');
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current).toLocaleString();
        }
    }, 20);
};

// Observar las estadísticas para animarlas cuando sean visibles
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
            const statNumber = entry.target.querySelector('h3');
            const targetText = statNumber.textContent;
            const target = parseInt(targetText.replace(/\D/g, ''));
            const suffix = targetText.replace(/[0-9,]/g, '');
            
            statNumber.dataset.suffix = suffix;
            animateCounter(statNumber, target);
            entry.target.classList.add('counted');
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-box').forEach(stat => {
    statsObserver.observe(stat);
});

console.log('✅ Scripts cargados correctamente - Cuenca Verde');



(function () {
    const modal      = document.getElementById('imageModal');
    const scrollBox  = document.getElementById('modalScroll');
    const modalImg   = document.getElementById('modalImg');
    const zoomLabel  = document.getElementById('zoomLevel');
    const images     = document.querySelectorAll('.gallery-exhibitor .revista-img');

    let zoom = 1;                 // 1 = 100% del ancho disponible
    const MIN = 0.4, MAX = 4, STEP = 0.25;

    /* --- Asegura que el modal sea hijo directo del body
           (evita el bug de 'perspective'/'transform' en ancestros) --- */
    if (modal.parentElement !== document.body) document.body.appendChild(modal);

    function baseWidth() {
        // ancho de referencia: el área visible menos un margen
        return Math.min(scrollBox.clientWidth - 30, 1100);
    }

    function applyZoom() {
        modalImg.classList.remove('fit');
        modalImg.style.width = (baseWidth() * zoom) + 'px';
        zoomLabel.textContent = Math.round(zoom * 100) + '%';
    }

    function fitScreen() {
        modalImg.style.width = '';
        modalImg.classList.add('fit');
        zoomLabel.textContent = 'Ajuste';
    }

    function openModal(src, alt) {
        modalImg.src = src;
        modalImg.alt = alt || '';
        modal.classList.add('active');
        document.body.classList.add('modal-open');
        zoom = 1;
        modalImg.onload = () => { applyZoom(); scrollBox.scrollTop = 0; };
        if (modalImg.complete) { applyZoom(); scrollBox.scrollTop = 0; }
    }

    function closeModal() {
        modal.classList.remove('active');
        document.body.classList.remove('modal-open');
        modalImg.src = '';
    }

    images.forEach(img => img.addEventListener('click', () => openModal(img.src, img.alt)));

    /* --- Botones --- */
    document.getElementById('zoomIn').onclick  = () => { zoom = Math.min(MAX, zoom + STEP); applyZoom(); };
    document.getElementById('zoomOut').onclick = () => { zoom = Math.max(MIN, zoom - STEP); applyZoom(); };
    document.getElementById('fitBtn').onclick  = () => {
        modalImg.classList.contains('fit') ? (zoom = 1, applyZoom()) : fitScreen();
    };
    document.getElementById('closeBtn').onclick = closeModal;

    /* --- Clic en el fondo cierra; clic en la imagen alterna zoom --- */
    scrollBox.addEventListener('click', e => { if (e.target === scrollBox) closeModal(); });
    modalImg.addEventListener('click', () => {
        if (modalImg.classList.contains('fit')) { zoom = 1.5; applyZoom(); }
    });

    /* --- Teclado: Esc, flechas, +/- --- */
    document.addEventListener('keydown', e => {
        if (!modal.classList.contains('active')) return;
        if (e.key === 'Escape') closeModal();
        if (e.key === '+' || e.key === '=') { zoom = Math.min(MAX, zoom + STEP); applyZoom(); }
        if (e.key === '-') { zoom = Math.max(MIN, zoom - STEP); applyZoom(); }
    });

    /* --- Ctrl + rueda = zoom (rueda sola = scroll normal) --- */
    scrollBox.addEventListener('wheel', e => {
        if (!e.ctrlKey) return;
        e.preventDefault();
        zoom = Math.min(MAX, Math.max(MIN, zoom + (e.deltaY < 0 ? STEP : -STEP)));
        applyZoom();
    }, { passive: false });

    /* --- Arrastrar con el mouse para desplazarse (pan) --- */
    let down = false, sx, sy, sl, st;
    modalImg.addEventListener('mousedown', e => {
        down = true; sx = e.pageX; sy = e.pageY;
        sl = scrollBox.scrollLeft; st = scrollBox.scrollTop;
        modalImg.classList.add('grabbing'); e.preventDefault();
    });
    window.addEventListener('mousemove', e => {
        if (!down) return;
        scrollBox.scrollLeft = sl - (e.pageX - sx);
        scrollBox.scrollTop  = st - (e.pageY - sy);
    });
    window.addEventListener('mouseup', () => { down = false; modalImg.classList.remove('grabbing'); });

    window.addEventListener('resize', () => {
        if (modal.classList.contains('active') && !modalImg.classList.contains('fit')) applyZoom();
    });
})();
