document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Navbar Scroll Effect ---
    const header = document.querySelector('.site-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // --- 2. Intersection Observer (Scroll Reveal) ---
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // --- 3. Dark Mode Toggle ---
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;
    const icon = themeToggle ? themeToggle.querySelector('i') : null;

    const currentTheme = localStorage.getItem('theme');
    if (currentTheme) {
        body.setAttribute('data-theme', currentTheme);
        updateIcon(currentTheme);
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const isDark = body.getAttribute('data-theme') === 'dark';
            if (isDark) {
                body.removeAttribute('data-theme');
                localStorage.setItem('theme', 'light');
                updateIcon('light');
            } else {
                body.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
                updateIcon('dark');
            }
        });
    }

    function updateIcon(theme) {
        if (!icon) return;
        if (theme === 'dark') {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }
    }

    // --- 4. Reading Progress Bar (Single Post Only) ---
    const article = document.querySelector('.article-content');
    if (article) {
        const progressBar = document.createElement('div');
        progressBar.className = 'progress-bar';
        document.body.prepend(progressBar);

        window.addEventListener('scroll', () => {
            const scrollTop = window.scrollY;
            const docHeight = document.body.offsetHeight;
            const winHeight = window.innerHeight;
            const scrollPercent = scrollTop / (docHeight - winHeight);
            const scrollPercentRounded = Math.round(scrollPercent * 100);
            progressBar.style.width = `${scrollPercentRounded}%`;
        });
    }

    // --- 5. Inline Search & Suggestions ---
    const searchWrapper = document.getElementById('searchWrapper');
    const searchInput = document.getElementById('searchInput');
    const searchToggle = document.getElementById('searchToggle');
    const suggestionsBox = document.getElementById('searchSuggestions');

    if (searchToggle && searchWrapper) {
        // Toggle Expansion
        searchToggle.addEventListener('click', (e) => {
            // Check if it's expanded and input has text
            if (searchWrapper.classList.contains('expanded') && searchInput.value.trim() !== "") {
                searchWrapper.submit();
            } else {
                e.preventDefault(); // Prevent submit if just toggling
                searchWrapper.classList.toggle('expanded');
                if (searchWrapper.classList.contains('expanded')) {
                    searchInput.focus();
                } else {
                    suggestionsBox.classList.remove('active');
                }
            }
        });

        // Close when clicking outside
        document.addEventListener('click', (e) => {
            if (!searchWrapper.contains(e.target) && searchWrapper.classList.contains('expanded')) {
                searchWrapper.classList.remove('expanded');
                suggestionsBox.classList.remove('active');
            }
        });

        // Live Suggestions
        let timeout = null;
        searchInput.addEventListener('input', function () {
            const query = this.value.trim();

            if (timeout) clearTimeout(timeout);

            if (query.length < 2) {
                suggestionsBox.classList.remove('active');
                return;
            }

            timeout = setTimeout(async () => {
                try {
                    const res = await fetch(`/api/search-suggestions?q=${query}`);
                    const results = await res.json();

                    if (results.length > 0) {
                        suggestionsBox.innerHTML = results.map(post =>
                            `<a href="/post/${post._id}" class="suggestion-item">${post.title}</a>`
                        ).join('');
                        suggestionsBox.classList.add('active');
                    } else {
                        suggestionsBox.classList.remove('active');
                    }
                } catch (error) {
                    console.error('Search error:', error);
                }
            }, 300); // 300ms debounce
        });
    }

    // --- 6. Mobile Menu Toggle ---
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
    const mobileMenuClose = document.getElementById('mobileMenuClose');

    if (mobileMenuBtn && mobileMenuOverlay) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenuOverlay.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        });

        mobileMenuClose.addEventListener('click', () => {
            mobileMenuOverlay.classList.remove('active');
            document.body.style.overflow = '';
        });

        // Close when clicking a link
        mobileMenuOverlay.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuOverlay.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

});
