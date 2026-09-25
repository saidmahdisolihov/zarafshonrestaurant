/**
 * ZARAFSHON RESTAURANT - Main Client Script
 * Complete Mobile & Desktop Interactions
 */

document.addEventListener("DOMContentLoaded", () => {
    /* =====================================================
       1. PRELOADER
    ===================================================== */
    const preloader = document.getElementById("preloader");
    const hidePreloader = () => {
        if (preloader && !preloader.classList.contains("hide")) {
            preloader.classList.add("hide");
            setTimeout(() => {
                preloader.style.display = "none";
            }, 600);
        }
    };

    window.addEventListener("load", hidePreloader);
    setTimeout(hidePreloader, 1200); // Safety fallback

    /* =====================================================
       2. MOBILE NAVIGATION & HAMBURGER
    ===================================================== */
    const menuToggle = document.getElementById("menuToggle");
    const navbar = document.getElementById("navbar");
    const header = document.getElementById("header");

    // Create backdrop overlay for mobile menu
    let navOverlay = document.querySelector(".nav-overlay");
    if (!navOverlay) {
        navOverlay = document.createElement("div");
        navOverlay.className = "nav-overlay";
        document.body.appendChild(navOverlay);
    }

    const openMenu = () => {
        menuToggle?.classList.add("active");
        navbar?.classList.add("open");
        navOverlay.classList.add("active");
        document.body.classList.add("no-scroll");
    };

    const closeMenu = () => {
        menuToggle?.classList.remove("active");
        navbar?.classList.remove("open");
        navOverlay.classList.remove("active");
        document.body.classList.remove("no-scroll");
    };

    if (menuToggle && navbar) {
        menuToggle.addEventListener("click", (e) => {
            e.stopPropagation();
            if (navbar.classList.contains("open")) {
                closeMenu();
            } else {
                openMenu();
            }
        });

        // Close when clicking nav links
        navbar.querySelectorAll(".nav-link").forEach((link) => {
            link.addEventListener("click", () => {
                closeMenu();
            });
        });

        // Close when clicking overlay
        navOverlay.addEventListener("click", closeMenu);

        // Close on escape key
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && navbar.classList.contains("open")) {
                closeMenu();
            }
        });
    }

    /* =====================================================
       3. DARK / LIGHT THEME TOGGLE
    ===================================================== */
    const themeBtn = document.getElementById("themeBtn");
    const currentTheme = localStorage.getItem("zarafshon_theme");

    const setTheme = (isDark) => {
        if (isDark) {
            document.body.classList.add("dark-mode");
            if (themeBtn) themeBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
            localStorage.setItem("zarafshon_theme", "dark");
        } else {
            document.body.classList.remove("dark-mode");
            if (themeBtn) themeBtn.innerHTML = '<i class="fa-solid fa-moon"></i>';
            localStorage.setItem("zarafshon_theme", "light");
        }
    };

    // Initialize theme based on preference or system
    if (currentTheme === "dark" || (!currentTheme && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
        setTheme(true);
    } else {
        setTheme(false);
    }

    if (themeBtn) {
        themeBtn.addEventListener("click", () => {
            const isDark = document.body.classList.contains("dark-mode");
            setTheme(!isDark);
        });
    }

    /* =====================================================
       4. STICKY HEADER & BACK TO TOP
    ===================================================== */
    const backTop = document.getElementById("backTop");

    window.addEventListener("scroll", () => {
        const scrollY = window.scrollY;

        // Sticky header
        if (header) {
            if (scrollY > 50) {
                header.classList.add("scrolled");
            } else {
                header.classList.remove("scrolled");
            }
        }

        // Back to top button
        if (backTop) {
            if (scrollY > 400) {
                backTop.classList.add("show");
            } else {
                backTop.classList.remove("show");
            }
        }
    }, { passive: true });

    if (backTop) {
        backTop.addEventListener("click", () => {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
    }

    /* =====================================================
       5. SCROLL REVEAL ANIMATIONS (.reveal -> .visible)
    ===================================================== */
    const revealElements = document.querySelectorAll(".reveal");

    if ("IntersectionObserver" in window) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.12,
            rootMargin: "0px 0px -40px 0px"
        });

        revealElements.forEach((el) => revealObserver.observe(el));
    } else {
        // Fallback for older browsers
        revealElements.forEach((el) => el.classList.add("visible"));
    }

    /* =====================================================
       6. MENU CATEGORY FILTER TABS
    ===================================================== */
    const menuTabs = document.querySelectorAll(".menu-tab");
    const foodCards = document.querySelectorAll(".food-card");

    menuTabs.forEach((tab) => {
        tab.addEventListener("click", () => {
            menuTabs.forEach((t) => t.classList.remove("active"));
            tab.classList.add("active");

            const filter = tab.dataset.filter || "all";

            foodCards.forEach((card) => {
                const category = card.dataset.category;
                if (filter === "all" || category === filter) {
                    card.style.display = "block";
                    setTimeout(() => {
                        card.style.opacity = "1";
                        card.style.transform = "scale(1)";
                    }, 20);
                } else {
                    card.style.opacity = "0";
                    card.style.transform = "scale(0.95)";
                    setTimeout(() => {
                        card.style.display = "none";
                    }, 250);
                }
            });
        });
    });

    /* =====================================================
       7. REVIEWS SLIDER (WITH TOUCH SWIPE FOR MOBILE)
    ===================================================== */
    const reviews = document.querySelectorAll(".review");
    const prevBtn = document.getElementById("prevReview");
    const nextBtn = document.getElementById("nextReview");
    const dotsContainer = document.getElementById("reviewDots");
    const dots = dotsContainer ? dotsContainer.querySelectorAll(".dot") : [];

    let currentReview = 0;

    const showReview = (index) => {
        if (!reviews.length) return;
        if (index < 0) index = reviews.length - 1;
        if (index >= reviews.length) index = 0;

        reviews.forEach((r) => r.classList.remove("active"));
        dots.forEach((d) => d.classList.remove("active"));

        reviews[index].classList.add("active");
        if (dots[index]) dots[index].classList.add("active");
        currentReview = index;
    };

    if (prevBtn) {
        prevBtn.addEventListener("click", () => showReview(currentReview - 1));
    }
    if (nextBtn) {
        nextBtn.addEventListener("click", () => showReview(currentReview + 1));
    }

    dots.forEach((dot, idx) => {
        dot.addEventListener("click", () => showReview(idx));
    });

    // Touch Swipe support for Mobile
    const reviewContainer = document.querySelector(".review-container");
    if (reviewContainer) {
        let touchStartX = 0;
        let touchEndX = 0;

        reviewContainer.addEventListener("touchstart", (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        reviewContainer.addEventListener("touchend", (e) => {
            touchEndX = e.changedTouches[0].screenX;
            if (touchStartX - touchEndX > 50) {
                // Swipe Left -> Next
                showReview(currentReview + 1);
            } else if (touchEndX - touchStartX > 50) {
                // Swipe Right -> Prev
                showReview(currentReview - 1);
            }
        }, { passive: true });
    }

    /* =====================================================
       8. TABLE BOOKING FORM NOTIFICATION
    ===================================================== */
    const bookingForm = document.getElementById("bookingForm");
    if (bookingForm) {
        bookingForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const name = document.getElementById("name")?.value || "";
            const phone = document.getElementById("phone")?.value || "";
            const date = document.getElementById("date")?.value || "";
            const time = document.getElementById("time")?.value || "";
            const guests = document.getElementById("guests")?.value || "";

            alert(`Ташаккур, ${name}!\n\nДархости брон барои ${guests}, санаи ${date}, соати ${time} қабул шуд. Ресторан бо шумо тамос мегирад.`);
            bookingForm.reset();
        });
    }

    /* =====================================================
       9. ACTIVE LINK HIGHLIGHT ON SCROLL
    ===================================================== */
    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll(".nav-link");

    window.addEventListener("scroll", () => {
        const scrollY = window.pageYOffset + 150;

        sections.forEach((current) => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop;
            const sectionId = current.getAttribute("id");

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach((link) => {
                    link.classList.remove("active");
                    if (link.getAttribute("href") === `#${sectionId}`) {
                        link.classList.add("active");
                    }
                });
            }
        });
    }, { passive: true });
});
