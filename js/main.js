/**
 * SELBY MV - MAIN JAVASCRIPT
 * Handles: loader, hero slider, mobile menu, scroll-to-top,
 *          animations, form submission, WhatsApp links, touch fixes
 */
(function () {
    'use strict';

    // ==================== LOADER ====================
    function removeLoader() {
        var loader = document.getElementById('load');
        if (loader && !loader.classList.contains('loader-removed')) {
            setTimeout(function () {
                loader.classList.add('loader-removed');
                document.body.classList.remove('loading');
            }, 400);
        }
    }

    window.addEventListener('load', function () {
        setTimeout(removeLoader, 400);
    });

    setTimeout(removeLoader, 3000);

    // ==================== HERO SLIDER ====================
    function initHeroSlider() {
        var slides = document.querySelectorAll('.hero-slide');
        var dotsContainer = document.querySelector('.hero-dots');
        var heroSlider = document.getElementById('hero');

        if (slides.length === 0) return;

        var currentSlide = 0;
        var slideInterval = null;

        // Create dots
        slides.forEach(function (_, index) {
            var dot = document.createElement('button');
            dot.classList.add('hero-dot');
            dot.setAttribute('aria-label', 'Slide ' + (index + 1));
            dot.addEventListener('click', function () {
                goToSlide(index);
            });
            dotsContainer.appendChild(dot);
        });

        var dots = document.querySelectorAll('.hero-dot');

        function goToSlide(index) {
            slides[currentSlide].classList.remove('active');
            dots[currentSlide].classList.remove('active');
            currentSlide = index;
            slides[currentSlide].classList.add('active');
            dots[currentSlide].classList.add('active');
        }

        function nextSlide() {
            var next = (currentSlide + 1) % slides.length;
            goToSlide(next);
        }

        function prevSlide() {
            var prev = (currentSlide - 1 + slides.length) % slides.length;
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

        goToSlide(0);
        startAutoplay();

        if (heroSlider) {
            heroSlider.addEventListener('mouseenter', stopAutoplay);
            heroSlider.addEventListener('mouseleave', startAutoplay);
        }

        document.addEventListener('keydown', function (e) {
            if (e.key === 'ArrowLeft') prevSlide();
            else if (e.key === 'ArrowRight') nextSlide();
        });

        // Touch swipe support with scroll prevention
        var touchStartX = 0;
        var touchStartY = 0;
        var touchEndX = 0;
        var isSwiping = false;

        heroSlider.addEventListener('touchstart', function (e) {
            touchStartX = e.changedTouches[0].screenX;
            touchStartY = e.changedTouches[0].screenY;
            isSwiping = true;
        }, { passive: true });

        heroSlider.addEventListener('touchmove', function (e) {
            if (isSwiping) {
                var diffX = e.changedTouches[0].screenX - touchStartX;
                var diffY = e.changedTouches[0].screenY - touchStartY;
                if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 7 && e.cancelable) {
                    e.preventDefault();
                }
            }
        }, { passive: false });

        heroSlider.addEventListener('touchend', function (e) {
            touchEndX = e.changedTouches[0].screenX;
            var diff = touchStartX - touchEndX;
            var diffY = Math.abs(e.changedTouches[0].screenY - touchStartY);

            if (Math.abs(diff) > 50 && diffY < 50) {
                if (diff > 0) nextSlide();
                else prevSlide();
            }
            isSwiping = false;
        });
    }

    // ==================== MOBILE MENU ====================
    function initMobileMenu() {
        var toggle = document.querySelector('.mobile-menu-toggle');
        var nav = document.querySelector('.main-navigation');

        if (!toggle || !nav) return;

        toggle.addEventListener('click', function () {
            var isOpen = nav.classList.toggle('open');
            toggle.setAttribute('aria-expanded', isOpen);
            var spans = toggle.querySelectorAll('span');
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

        var menuLinks = nav.querySelectorAll('a');
        menuLinks.forEach(function (link) {
            link.addEventListener('click', function () {
                nav.classList.remove('open');
                toggle.setAttribute('aria-expanded', 'false');
                var spans = toggle.querySelectorAll('span');
                spans[0].style.transform = '';
                spans[1].style.opacity = '';
                spans[2].style.transform = '';
            });
        });

        document.addEventListener('click', function (e) {
            if (!toggle.contains(e.target) && !nav.contains(e.target)) {
                nav.classList.remove('open');
                toggle.setAttribute('aria-expanded', 'false');
                var spans = toggle.querySelectorAll('span');
                spans[0].style.transform = '';
                spans[1].style.opacity = '';
                spans[2].style.transform = '';
            }
        });
    }

    // ==================== SCROLL TO TOP ====================
    function initScrollTop() {
        var scrollBtn = document.getElementById('scrollTop');
        if (!scrollBtn) return;

        function toggleVisibility() {
            if (window.scrollY > 400) scrollBtn.classList.add('visible');
            else scrollBtn.classList.remove('visible');
        }

        window.addEventListener('scroll', toggleVisibility, { passive: true });
        scrollBtn.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
        toggleVisibility();
    }

    // ==================== SCROLL ANIMATIONS ====================
    function initScrollAnimations() {
        var animatedElements = document.querySelectorAll('.fade-in-up');
        if (animatedElements.length === 0) return;

        var observer = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) entry.target.classList.add('visible');
                });
            },
            { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
        );

        animatedElements.forEach(function (el) { observer.observe(el); });
    }

    // ==================== CONTACT FORM ====================
    function initContactForm() {
        var form = document.getElementById('contactForm');
        var submitBtn = document.getElementById('submitBtn');
        var formMessage = document.getElementById('form-message');

        if (!form || !submitBtn) return;

        form.addEventListener('submit', async function (e) {
            e.preventDefault();
            var formData = new FormData(form);
            var data = {
                name: formData.get('name'),
                email: formData.get('email'),
                message: formData.get('message')
            };

            if (!data.name || !data.email || !data.message) {
                showFormMessage('Please fill in all fields.', 'error');
                return;
            }

            if (!isValidEmail(data.email)) {
                showFormMessage('Please enter a valid email address.', 'error');
                return;
            }

            submitBtn.classList.add('loading');
            submitBtn.disabled = true;

            try {
                var action = form.getAttribute('action');
                if (action.includes('YOUR-FORM-ID')) {
                    await new Promise(function (resolve) { return setTimeout(resolve, 1500); });
                    showFormMessage('✅ Demo mode: Form would be sent here. Replace YOUR-FORM-ID with your actual Formspree endpoint.', 'success');
                    form.reset();
                } else {
                    var response = await fetch(action, {
                        method: 'POST',
                        body: formData,
                        headers: { 'Accept': 'application/json' }
                    });
                    if (response.ok) {
                        showFormMessage('Thank you! Your message has been sent. We will get back to you soon.', 'success');
                        form.reset();
                    } else {
                        var result = await response.json();
                        throw new Error(result.error || 'Something went wrong.');
                    }
                }
            } catch (error) {
                showFormMessage('Sorry, there was a problem sending your message. Please try again or email us directly at sales@selbymv.com.', 'error');
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
            setTimeout(function () { formMessage.style.display = 'none'; }, 8000);
        }

        function isValidEmail(email) {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        }
    }

    // ==================== WHATSAPP LINK FIXER ====================
    function fixWhatsAppLinks() {
        var isMobile = /Android|webOS|iPhone|iPad|iPod|Windows Phone|IEMobile|Mobile|BlackBerry/i.test(navigator.userAgent);
        var links = document.querySelectorAll('a[href*="whatsapp.com"]');
        links.forEach(function (link) {
            var href = link.getAttribute('href');
            if (isMobile && href.includes('web.whatsapp.com')) {
                link.setAttribute('href', href.replace('web.whatsapp.com', 'api.whatsapp.com'));
            } else if (!isMobile && href.includes('api.whatsapp.com')) {
                link.setAttribute('href', href.replace('api.whatsapp.com', 'web.whatsapp.com'));
            }
        });
    }

    // ==================== STICKY HEADER ====================
    function initStickyHeader() {
        var header = document.querySelector('.masthead');
        if (!header) return;
        window.addEventListener('scroll', function () {
            if (window.scrollY > 10) {
                header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.15)';
            } else {
                header.style.boxShadow = '0 2px 15px rgba(0, 0, 0, 0.1)';
            }
        }, { passive: true });
    }

    // ==================== INIT ====================
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

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
