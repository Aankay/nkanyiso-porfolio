window.addEventListener('load', () => {
            setTimeout(() => {
                document.getElementById('loader').classList.add('hidden');
            }, 1500);
        });

        const cursorDot = document.getElementById('cursor-dot');
        const cursorOutline = document.getElementById('cursor-outline');

        window.addEventListener('mousemove', (e) => {
            const posX = e.clientX;
            const posY = e.clientY;

            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;

            cursorOutline.animate({
                left: `${posX}px`,
                top: `${posY}px`
            }, { duration: 500, fill: 'forwards' });
        });

        const interactiveElements = document.querySelectorAll('a, button, .project-card, .skill-item, .contact-link');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursorOutline.style.transform = 'translate(-50%, -50%) scale(1.5)';
                cursorOutline.style.borderColor = '#ff3e00';
            });
            el.addEventListener('mouseleave', () => {
                cursorOutline.style.transform = 'translate(-50%, -50%) scale(1)';
                cursorOutline.style.borderColor = 'rgba(255, 62, 0, 0.3)';
            });
        });

        window.addEventListener('scroll', () => {
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            document.getElementById('scroll-progress').style.width = scrolled + '%';
        });

        const menuToggle = document.getElementById('menu-toggle');
        const menuClose = document.getElementById('menu-close');
        const mobileMenu = document.getElementById('mobile-menu');
        const mobileLinks = document.querySelectorAll('.mobile-link');

        menuToggle.addEventListener('click', () => {
            mobileMenu.classList.add('active');
            mobileMenu.setAttribute('aria-hidden', 'false');
            menuToggle.setAttribute('aria-expanded', 'true');
        });

        menuClose.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            mobileMenu.setAttribute('aria-hidden', 'true');
            menuToggle.setAttribute('aria-expanded', 'false');
        });

        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
                mobileMenu.setAttribute('aria-hidden', 'true');
                menuToggle.setAttribute('aria-expanded', 'false');
            });
        });

        const magneticBtns = document.querySelectorAll('.magnetic-btn');

        magneticBtns.forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;

                btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
            });

            btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'translate(0, 0)';
            });
        });

        function downloadCV() {
            const toast = document.getElementById('toast');
            toast.classList.add('show');

            const link = document.createElement('a');
            link.href = '/CV/Nkanyiso_Mavuso_CV.pdf';
            link.download = 'Nkanyiso_Mavuso_CV.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            setTimeout(() => {
                toast.classList.remove('show');
            }, 3000);
        }

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

        document.querySelectorAll('.timeline-item, .project-card, .skill-category').forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
            observer.observe(el);
        });

        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('.nav-link');

        window.addEventListener('scroll', () => {
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                if (scrollY >= sectionTop - 200) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href').slice(1) === current) {
                    link.classList.add('active');
                }
            });
        });

        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallax = document.querySelector('.hero-text');
            if (parallax) {
                parallax.style.transform = `translateY(${scrolled * 0.5}px)`;
            }
        });

        class TextScramble {
            constructor(el) {
                this.el = el;
                this.chars = '!<>-_\\/[]{}—=+*^?#________';
                this.update = this.update.bind(this);
            }

            setText(newText) {
                const oldText = this.el.innerText;
                const length = Math.max(oldText.length, newText.length);
                const promise = new Promise((resolve) => this.resolve = resolve);
                this.queue = [];

                for (let i = 0; i < length; i++) {
                    const from = oldText[i] || '';
                    const to = newText[i] || '';
                    const start = Math.floor(Math.random() * 40);
                    const end = start + Math.floor(Math.random() * 40);
                    this.queue.push({ from, to, start, end });
                }

                cancelAnimationFrame(this.frameRequest);
                this.frame = 0;
                this.update();
                return promise;
            }

            update() {
                let output = '';
                let complete = 0;

                for (let i = 0, n = this.queue.length; i < n; i++) {
                    let { from, to, start, end, char } = this.queue[i];

                    if (this.frame >= end) {
                        complete++;
                        output += to;
                    } else if (this.frame >= start) {
                        if (!char || Math.random() < 0.28) {
                            char = this.randomChar();
                            this.queue[i].char = char;
                        }
                        output += `<span class="text-[#ff3e00]">${char}</span>`;
                    } else {
                        output += from;
                    }
                }

                this.el.innerHTML = output;

                if (complete === this.queue.length) {
                    this.resolve();
                } else {
                    this.frameRequest = requestAnimationFrame(this.update);
                    this.frame++;
                }
            }

            randomChar() {
                return this.chars[Math.floor(Math.random() * this.chars.length)];
            }
        }

        const logo = document.getElementById('logo');
        const fx = new TextScramble(logo);

        logo.addEventListener('mouseenter', () => {
            fx.setText('NKANYISO.');
        });


        
   function initWeatherWidget() {
    const weatherContainer = document.getElementById('weatherContainer');

    if (!weatherContainer) return;

    // Check if geolocation is available
    if (!navigator.geolocation) {
        weatherContainer.innerHTML = `
            <div class="weather-error-inline">
                <span class="weather-error-icon-inline">📍</span>
                <p>Geolocation not supported by your browser</p>
            </div>
        `;
        return;
    }

    // Fetch weather data immediately on load
    navigator.geolocation.getCurrentPosition(
        async (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;

            try {
                const response = await fetch(url);
                const data = await response.json();

                if (data.current_weather) {
                    const temp = Math.round(data.current_weather.temperature);
                    const windSpeed = data.current_weather.windspeed;
                    const weatherCode = data.current_weather.weathercode;

                    // Map weather codes to emojis and conditions
                    const weatherMap = {
                        0: { emoji: '☀️', condition: 'Clear Sky' },
                        1: { emoji: '🌤️', condition: 'Mainly Clear' },
                        2: { emoji: '⛅', condition: 'Partly Cloudy' },
                        3: { emoji: '☁️', condition: 'Overcast' }
                    };

                    // Handle fog
                    if (weatherCode >= 45 && weatherCode <= 48) {
                        weatherMap[weatherCode] = { emoji: '🌫️', condition: 'Foggy' };
                    }
                    // Handle drizzle
                    else if (weatherCode >= 51 && weatherCode <= 55) {
                        weatherMap[weatherCode] = { emoji: '🌧️', condition: 'Drizzle' };
                    }
                    // Handle rain
                    else if (weatherCode >= 61 && weatherCode <= 65) {
                        weatherMap[weatherCode] = { emoji: '🌧️', condition: 'Rain' };
                    }
                    // Handle snow
                    else if (weatherCode >= 71 && weatherCode <= 75) {
                        weatherMap[weatherCode] = { emoji: '❄️', condition: 'Snow' };
                    }
                    // Handle thunderstorm
                    else if (weatherCode >= 95 && weatherCode <= 99) {
                        weatherMap[weatherCode] = { emoji: '⛈️', condition: 'Thunderstorm' };
                    }

                    const weather = weatherMap[weatherCode] || { emoji: '🌤️', condition: 'Clear' };

                    weatherContainer.innerHTML = `
                        <div class="weather-data-inline">
                            <span class="weather-emoji-inline" aria-hidden="true">${weather.emoji}</span>
                            <div class="weather-info-inline">
                                <span class="weather-temp-inline">${temp}°C</span>
                                <span class="weather-condition-inline">${weather.condition}</span>
                            </div>
                            <div class="weather-wind-inline" title="Wind Speed">
                                <svg class="weather-wind-icon-inline" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
                                </svg>
                                <span>${windSpeed} km/h</span>
                            </div>
                        </div>
                    `;
                }
            } catch (error) {
                console.error('Weather fetch error:', error);
                weatherContainer.innerHTML = `
                    <div class="weather-error-inline">
                        <span class="weather-error-icon-inline">⚠️</span>
                        <p>Unable to load weather data</p>
                    </div>
                `;
            }
        },
        (error) => {
            console.error('Geolocation error:', error);
            let errorMessage = 'Location access denied';
            if (error.code === 2) errorMessage = 'Location unavailable';
            if (error.code === 3) errorMessage = 'Location request timed out';
            
            weatherContainer.innerHTML = `
                <div class="weather-error-inline">
                    <span class="weather-error-icon-inline">📍</span>
                    <p>${errorMessage}</p>
                </div>
            `;
        },
        {
            enableHighAccuracy: false,
            timeout: 10000,
            maximumAge: 600000 // Cache for 10 minutes
        }
    );
}

// Initialize on page load
window.addEventListener('DOMContentLoaded', () => {
    initWeatherWidget();
});

// Initialize weather widget on page load
window.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        initWeatherWidget();
    }, 1000);
});

