// UTILITIES
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

// CUSTOM CURSOR
const cursorGlow = document.getElementById("cursorGlow");
if (cursorGlow) {
    document.addEventListener("mousemove", (e) => {
        cursorGlow.style.left = e.clientX + "px";
        cursorGlow.style.top  = e.clientY + "px";
    });
}

// HERO PARTICLES
window.addEventListener("load", () => {
    const container = $(".hero-particles");
    if (!container) return;

    const frag = document.createDocumentFragment();
    for (let i = 0; i < 25; i++) {
        const s = document.createElement("span");
        const size = Math.random() * 4 + 2;
        Object.assign(s.style, {
            width:             size + "px",
            height:            size + "px",
            left:              Math.random() * 100 + "%",
            bottom:            Math.random() * -40 + "px",
            animationDuration: (4 + Math.random() * 4) + "s"
        });
        frag.appendChild(s);
    }
    container.appendChild(frag);
});

// MOBILE MENU
const hamburger  = $(".hamburger");
const mobileMenu = $(".mobile-menu");

if (hamburger && mobileMenu) {
    const toggleMenu = () => {
        hamburger.classList.toggle("active");
        mobileMenu.classList.toggle("open");
    };

    hamburger.addEventListener("click", toggleMenu);
    hamburger.addEventListener("keydown", (e) => {
        if (["Enter", " "].includes(e.key)) {
            e.preventDefault();
            toggleMenu();
        }
    });

    $$(".mobile-menu a").forEach(a =>
        a.addEventListener("click", () => {
            hamburger.classList.remove("active");
            mobileMenu.classList.remove("open");
        })
    );
}

// SCROLL EFFECTS
const header = $(".top-nav");
const hero   = $(".hero");
const bar    = $(".scroll-progress-bar");

window.addEventListener("scroll", () => {
    const y = window.scrollY;

    if (header) header.classList.toggle("scrolled", y > 50);
    if (hero)   hero.style.backgroundPositionY = `calc(50% + ${y * 0.4}px)`;

    if (bar) {
        const h = document.documentElement.scrollHeight - innerHeight;
        bar.style.width = (h > 0 ? (y / h) * 100 : 0) + "%";
    }
});

// FADE-UP REVEAL (for .fade-up sections)
const fadeUpEls = $$(".fade-up");
if (fadeUpEls.length) {
    const fadeObs = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
            if (e.isIntersecting) {
                e.target.classList.add("visible");
                fadeObs.unobserve(e.target);
            }
        });
    }, { threshold: 0.15 });

    fadeUpEls.forEach((el) => fadeObs.observe(el));
}

// PORTFOLIO REVEAL
const portfolioItems = $$(".portfolio-item");
if (portfolioItems.length) {
    const obs = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
            if (e.isIntersecting) {
                e.target.classList.add("visible");
                obs.unobserve(e.target);
            }
        });
    }, { threshold: 0.2 });

    portfolioItems.forEach((el) => obs.observe(el));
}

// 3D TILT EFFECT
function applyTilt(selector) {
    $$(selector).forEach((el) => {
        el.addEventListener("mousemove", (e) => {
            const r = el.getBoundingClientRect();
            const x = (e.clientX - r.left  - r.width  / 2) / (r.width  / 2);
            const y = (e.clientY - r.top   - r.height / 2) / (r.height / 2);
            el.style.transform = `rotateX(${y * -4}deg) rotateY(${x * 4}deg) scale(1.03)`;
        });
        el.addEventListener("mouseleave", () => {
            el.style.transform = "";
        });
    });
}
applyTilt(".tilt");

// LIGHTBOX
const lightbox = $("#lightbox");
if (lightbox) {
    const img   = lightbox.querySelector("img");
    const close = lightbox.querySelector(".lightbox-close");

    if (img && close) {
        portfolioItems.forEach((item) =>
            item.addEventListener("click", () => {
                const full = item.querySelector("img")?.dataset.full;
                if (full) {
                    img.src = full;
                    lightbox.classList.add("open");
                }
            })
        );

        close.addEventListener("click", () => lightbox.classList.remove("open"));
        lightbox.addEventListener("click", (e) => {
            if (e.target === lightbox) lightbox.classList.remove("open");
        });
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape") lightbox.classList.remove("open");
        });
    }
}

// FAQ ACCORDION
const faqItems = $$(".faq-item");
faqItems.forEach((item) => {
    const btn = item.querySelector(".faq-question");
    if (!btn) return;

    btn.addEventListener("click", () => {
        const isOpen = item.classList.contains("open");

        // Close all
        faqItems.forEach((i) => {
            i.classList.remove("open");
            const b = i.querySelector(".faq-question");
            if (b) b.setAttribute("aria-expanded", "false");
        });

        // Toggle clicked one
        if (!isOpen) {
            item.classList.add("open");
            btn.setAttribute("aria-expanded", "true");
        }
    });
});

// STATS COUNTER — safe for any target value including small ones
$$(".stat-number").forEach((counter) => {
    const target = +counter.dataset.target;

    if (target === 0) {
        counter.innerText = "0";
        return;
    }

    const duration = 1500; // ms
    const steps    = 60;
    const inc      = target / steps;
    let current    = 0;
    let step       = 0;

    const tick = () => {
        step++;
        current = step >= steps ? target : Math.ceil(step * inc);
        counter.innerText = current;
        if (step < steps) setTimeout(tick, duration / steps);
    };

    const obs = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            tick();
            obs.disconnect();
        }
    }, { threshold: 0.5 });

    obs.observe(counter);
});

// TESTIMONIALS
const testimonials = $$(".testimonial");
const dots         = $$(".testimonials-dots .dot");
let current        = 0;

function showTestimonial(i) {
    testimonials.forEach((t) => t.classList.remove("active"));
    dots.forEach((d) => d.classList.remove("active"));
    if (testimonials[i]) testimonials[i].classList.add("active");
    if (dots[i])         dots[i].classList.add("active");
}

if (testimonials.length) {
    const autoPlay = setInterval(() => {
        current = (current + 1) % testimonials.length;
        showTestimonial(current);
    }, 5000);

    dots.forEach((dot, i) =>
        dot.addEventListener("click", () => {
            current = i;
            showTestimonial(i);
            clearInterval(autoPlay); // pause auto-play on manual click
        })
    );
}