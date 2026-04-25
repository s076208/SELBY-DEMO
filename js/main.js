/**
 * SELBY MV - MAIN JAVASCRIPT
 * Handles: loader, hero slider, mobile menu, scroll-to-top,
 *          animations, and form submission
 */
(function () {
    'use strict';

    // ==================== LOADER ====================
    function removeLoader() {
        const loader = document.getElementById('load');
        if (loader && !loader.classList.contains('loader-removed')) {
            setTimeout(function () {
                loader.classList.add('loader-removed');
                document.body.classList.remove('loading');
            }, 400);
        }
    }

    // Remove loader after page is ready
    window.addEventListener('load', function () {
        // Ensure loader shows for at least 400ms
        setTimeout(removeLoader, 400);
    });

    // Fallback: remove loader after 3 seconds max
    setTimeout(removeLoader, 3000);

    // ==================== HERO SLIDER ====================
    function initHeroSlider() {
        const slides = document.querySelectorAll('.hero-slide');
        const dotsContainer = document.querySelector('.hero-dots');

        if (slides.length === 0) return;

        let currentSlide = 0;
        let slideInterval = null;

        // Create navigation dots
        slides.forEach(function (_, index) {
            const dot = document.createElement('button');
            dot.classList.add('hero-dot');
            dot.setAttribute('aria-label', 'Slide ' + (index + 1));
            dot.addEventListener('click', function () {
                goToSlide(index);
            });
            dotsContainer.appendChild(dot);
        });

        const dots = document.querySelectorAll('.hero-dot');

        function goToSlide(index) {
            slides[currentSlide].classList.remove('active');
            dots[currentSlide].classList.remove('active');

            currentSlide = index;

            slides[currentSlide].classList.add('active');
            dots[currentSlide].classList.add('active');
        }

        function nextSlide() {
            const next = (currentSlide + 1) % slides.length;
            goToSlide(next);
        }

        function prevSlide() {
            const prev = (currentSlide - 1 + slides.length) % slides.length;
            goToSlide(prev);
        }

        function startAutoplay() {
            stopAutoplay();
            slideInterval = setInterval(nextSlide, 5000);
        }

        function stopAutoplay() {
            if (slideInterval) {
                clearInterval(slideInterval);
                slideInterval = null;
            }
        }

        // Initialize first slide
        goToSlide(0);
        startAutoplay();

        // Pause on hover
        const heroSlider = document.getElementById('hero');
        if (heroSlider) {
            heroSlider.addEventListener('mouseenter', stopAutoplay);
            heroSlider.addEventListener('mouseleave', startAutoplay);
        }

        // Keyboard navigation
        document.addEventListener('keydown', function (e) {
            if (e.key === 'ArrowLeft') {
                prevSlide();
            } else if (e.key === 'ArrowRight') {
                nextSlide();
            }
        });

        // Touch swipe support
        let touchStartX = 0;
        let touchEndX = 0;

        heroSlider.addEventListener('touchstart', function (e) {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        heroSlider.addEventListener('touchend', function (e) {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        });

        function handleSwipe() {
            const swipeThreshold = 50;
            const diff = touchStartX - touchEndX;

            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    nextSlide(); // Swipe left
                } else {
                    prevSlide(); // Swipe right
                }
            }
        }
    }

    // ==================== MOBILE MENU ====================
    function initMobileMenu() {
        const toggle = document.querySelector('.mobile-menu-toggle');
        const nav = document.querySelector('.main-navigation');

        if (!toggle || !nav) return;

        toggle.addEventListener('click', function () {
            const isOpen = nav.classList.toggle('open');
            toggle.setAttribute('aria-expanded', isOpen);

            // Animate hamburger
            const spans = toggle.querySelectorAll('span');
            if (isOpen) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
            } else {
                spans[0].style.transform = '';
                spans[1].style.opacity = '';
                spans[2].style.transform = '';
            }
        });

        // Close menu when clicking a link
        const menuLinks = nav.querySelectorAll('a');
        menuLinks.forEach(function (link) {
            link.addEventListener('click', function () {
                nav.classList.remove('open');
                toggle.setAttribute('aria-expanded', 'false');
                const spans = toggle.querySelectorAll('span');
                spans[0].style.transform = '';
                spans[1].style.opacity = '';
                spans[2].style.transform = '';
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function (e) {
            if (!toggle.contains(e.target) && !nav.contains(e.target)) {
                nav.classList.remove('open');
                toggle.setAttribute('aria-expanded', 'false');
                const spans = toggle.querySelectorAll('span');
                spans[0].style.transform = '';
                spans[1].style.opacity = '';
                spans[2].style.transform = '';
            }
        });
    }

    // ==================== SCROLL TO TOP ====================
    function initScrollTop() {
        const scrollBtn = document.getElementById('scrollTop');

        if (!scrollBtn) return;

        function toggleVisibility() {
            if (window.scrollY > 400) {
                scrollBtn.classList.add('visible');
            } else {
                scrollBtn.classList.remove('visible');
            }
        }

        window.addEventListener('scroll', toggleVisibility, { passive: true });

        scrollBtn.addEventListener('click', function () {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

        // Initial check
        toggleVisibility();
    }

    // ==================== SCROLL ANIMATIONS ====================
    function initScrollAnimations() {
        const animatedElements = document.querySelectorAll('.fade-in-up');

        if (animatedElements.length === 0) return;

        const observer = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                    }
                });
            },
            {
                threshold: 0.15,
                rootMargin: '0px 0px -50px 0px'
            }
        );

        animatedElements.forEach(function (el) {
            observer.observe(el);
        });
    }

    // ==================== CONTACT FORM ====================
    function initContactForm() {
        const form = document.getElementById('contactForm');
        const submitBtn = document.getElementById('submitBtn');
        const formMessage = document.getElementById('form-message');

        if (!form || !submitBtn) return;

        form.addEventListener('submit', async function (e) {
            e.preventDefault();

            // Get form data
            const formData = new FormData(form);
            const data = {
                name: formData.get('name'),
                email: formData.get('email'),
                message: formData.get('message'),
                _gotcha: formData.get('_gotcha'),
                _subject: formData.get('_subject')
            };

            // Basic validation
            if (!data.name || !data.email || !data.message) {
                showFormMessage('Please fill in all fields.', 'error');
                return;
            }

            if (!isValidEmail(data.email)) {
                showFormMessage('Please enter a valid email address.', 'error');
                return;
            }

            // Show loading state
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;

            try {
                // If no Formspree ID is set, show a demo message
                const action = form.getAttribute('action');
                if (action.includes('YOUR-FORM-ID')) {
                    // Demo mode - simulate success
                    await new Promise(resolve => setTimeout(resolve, 1500));
                    showFormMessage(
                        '✅ Demo mode: Form would be sent here. Replace YOUR-FORM-ID with your actual Formspree endpoint.',
                        'success'
                    );
                    form.reset();
                } else {
                    // Actually submit to Formspree
                    const response = await fetch(action, {
                        method: 'POST',
                        body: formData,
                        headers: {
                            'Accept': 'application/json'
                        }
                    });

                    if (response.ok) {
                        showFormMessage('Thank you! Your message has been sent. We will get back to you soon.', 'success');
                        form.reset();
                    } else {
                        const result = await response.json();
                        throw new Error(result.error || 'Something went wrong.');
                    }
                }
            } catch (error) {
                showFormMessage(
                    'Sorry, there was a problem sending your message. Please try again or email us directly at sales@selbymv.com.',
                    'error'
                );
                console.error('Form submission error:', error);
            } finally {
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;
            }
        });

        function showFormMessage(msg, type) {
            if (!formMessage) return;
            formMessage.textContent = msg;
            formMessage.className = 'form-feedback ' + type;
            formMessage.style.display = 'block';

            // Auto hide after 8 seconds
            setTimeout(function () {
                formMessage.style.display = 'none';
            }, 8000);
        }

        function isValidEmail(email) {
            const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return re.test(email);
        }
    }

    // ==================== WHATSAPP LINK FIXER ====================
    function fixWhatsAppLinks() {
        // Switch between web.whatsapp.com and api.whatsapp.com based on device
        const isMobile = /Android|webOS|iPhone|iPad|iPod|Windows Phone|IEMobile|Mobile|BlackBerry/i.test(
            navigator.userAgent
        );

        const links = document.querySelectorAll('a[href*="whatsapp.com"]');
        links.forEach(function (link) {
            let href = link.getAttribute('href');
            if (isMobile && href.includes('web.whatsapp.com')) {
                link.setAttribute('href', href.replace('web.whatsapp.com', 'api.whatsapp.com'));
            } else if (!isMobile && href.includes('api.whatsapp.com')) {
                link.setAttribute('href', href.replace('api.whatsapp.com', 'web.whatsapp.com'));
            }
        });
    }

    // ==================== STICKY HEADER SHADOW ====================
    function initStickyHeader() {
        const header = document.querySelector('.masthead');
        if (!header) return;

        window.addEventListener('scroll', function () {
            if (window.scrollY > 10) {
                header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.15)';
            } else {
                header.style.boxShadow = '0 2px 15px rgba(0, 0, 0, 0.1)';
            }
        }, { passive: true });
    }

    // ==================== INITIALIZATION ====================
    function init() {
        removeLoader();
        initHeroSlider();
        initMobileMenu();
        initScrollTop();
        initScrollAnimations();
        initContactForm();
        initStickyHeader();
        fixWhatsAppLinks();
    }

    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();