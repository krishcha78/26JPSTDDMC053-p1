/**
 * ==========================================================================
 * ABC COLLEGE OF ENGINEERING — INTERACTIVE JAVASCRIPT
 * Features:
 *  1. Mobile Hamburger Menu & Active Nav Highlighter
 *  2. Courses Live Search & Category Filtering
 *  3. Admissions Form Validation & LocalStorage Persistence
 *  4. Contact Form Validation & Success Handling
 *  5. Testimonials Auto-Rotating Carousel with Controls
 *  6. Gallery Lightbox Modal
 *  7. Notices Auto-Rotating Ticker
 *  8. Events Upcoming / Past Tab Switcher
 *  9. FAQ Accessible Accordion
 * 10. Back-To-Top Smooth Scroll Button
 * 11. Dark Mode Toggle with LocalStorage Memory
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {

  // --------------------------------------------------------------------------
  // FEATURE 1: Mobile Hamburger Menu & Active Page Highlighting
  // --------------------------------------------------------------------------
  const menuToggle = document.getElementById('menuToggle');
  const navMenu = document.getElementById('navMenu');

  if (menuToggle && navMenu) {
    // Ensure mobile navigation drawer includes prominent Apply Now CTA
    if (!navMenu.querySelector('.mobile-cta-item')) {
      const ctaLi = document.createElement('li');
      ctaLi.className = 'mobile-cta-item';
      ctaLi.innerHTML = `
        <a href="admissions.html" class="btn btn-primary btn-mobile-apply">
          <span>Apply for Admissions 2026-27</span>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </a>
      `;
      navMenu.appendChild(ctaLi);
    }

    menuToggle.addEventListener('click', () => {
      const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', !isExpanded);
      navMenu.classList.toggle('active');
    });

    // Close menu when clicking outside or clicking any nav link
    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
        navMenu.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
      }
    });

    // Close menu when clicking any link inside it
    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Highlight current page link based on URL pathname
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
  });


  // --------------------------------------------------------------------------
  // FEATURE 2: Courses Page Live Search & Department Filter Buttons
  // --------------------------------------------------------------------------
  const courseSearchInput = document.getElementById('courseSearch');
  const filterButtons = document.querySelectorAll('.filter-btn');
  const courseCards = document.querySelectorAll('.course-card');

  function filterCourses() {
    if (!courseCards.length) return;
    
    const query = courseSearchInput ? courseSearchInput.value.toLowerCase().trim() : '';
    const activeFilterBtn = document.querySelector('.filter-btn.active');
    const selectedDepartment = activeFilterBtn ? activeFilterBtn.dataset.filter : 'all';

    let visibleCount = 0;

    courseCards.forEach(card => {
      const title = card.querySelector('.card-title')?.textContent.toLowerCase() || '';
      const desc = card.querySelector('.card-text')?.textContent.toLowerCase() || '';
      const department = card.dataset.department || '';

      const matchesSearch = title.includes(query) || desc.includes(query);
      const matchesDepartment = selectedDepartment === 'all' || department === selectedDepartment;

      if (matchesSearch && matchesDepartment) {
        card.style.display = 'flex';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    // Handle empty state if no courses match
    const emptyState = document.getElementById('noCoursesMessage');
    if (emptyState) {
      emptyState.style.display = visibleCount === 0 ? 'block' : 'none';
    }
  }

  if (courseSearchInput) {
    courseSearchInput.addEventListener('input', filterCourses);
  }

  if (filterButtons.length) {
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        filterCourses();
      });
    });
  }


  // --------------------------------------------------------------------------
  // FEATURE 3: Admissions Form Validation & LocalStorage Persistence
  // --------------------------------------------------------------------------
  const admissionsForm = document.getElementById('admissionsForm');
  const admissionsSuccess = document.getElementById('admissionsSuccess');

  if (admissionsForm) {
    admissionsForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      // Fields
      const fullName = document.getElementById('admName');
      const email = document.getElementById('admEmail');
      const phone = document.getElementById('admPhone');
      const course = document.getElementById('admCourse');
      const marks = document.getElementById('admMarks');

      // Validation logic
      if (!fullName.value.trim() || fullName.value.trim().length < 3) {
        showError(fullName, 'Please enter your full name (minimum 3 characters).');
        isValid = false;
      } else {
        clearError(fullName);
      }

      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email.value.trim() || !emailPattern.test(email.value.trim())) {
        showError(email, 'Please enter a valid email address.');
        isValid = false;
      } else {
        clearError(email);
      }

      const phonePattern = /^[0-9]{10}$/;
      if (!phone.value.trim() || !phonePattern.test(phone.value.replace(/[^0-9]/g, ''))) {
        showError(phone, 'Please enter a valid 10-digit mobile number.');
        isValid = false;
      } else {
        clearError(phone);
      }

      if (!course.value) {
        showError(course, 'Please select your preferred program.');
        isValid = false;
      } else {
        clearError(course);
      }

      if (!marks.value || Number(marks.value) < 45 || Number(marks.value) > 100) {
        showError(marks, 'Please enter valid qualifying marks between 45% and 100%.');
        isValid = false;
      } else {
        clearError(marks);
      }

      if (isValid) {
        // Save to LocalStorage
        const applicationData = {
          name: fullName.value.trim(),
          email: email.value.trim(),
          phone: phone.value.trim(),
          course: course.value,
          marks: marks.value,
          submittedAt: new Date().toISOString()
        };

        const existingApps = JSON.parse(localStorage.getItem('abc_admissions') || '[]');
        existingApps.push(applicationData);
        localStorage.setItem('abc_admissions', JSON.stringify(existingApps));

        // Show Confirmation
        if (admissionsSuccess) {
          admissionsSuccess.classList.add('visible');
          admissionsSuccess.innerHTML = `
            <div class="alert-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
            <div class="alert-content">
              <h3 class="alert-title">Application Submitted Successfully!</h3>
              <p class="alert-message">Thank you, <strong>${applicationData.name}</strong>. Your application for <em>${applicationData.course}</em> has been saved. Our admissions officer will contact you at <strong>${applicationData.email}</strong> within 48 hours.</p>
            </div>
          `;
          admissionsSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }

        admissionsForm.reset();
      }
    });
  }


  // --------------------------------------------------------------------------
  // FEATURE 4: Contact Form Validation & Success Notification
  // --------------------------------------------------------------------------
  const contactForm = document.getElementById('contactForm');
  const contactSuccess = document.getElementById('contactSuccess');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      const name = document.getElementById('cntName');
      const email = document.getElementById('cntEmail');
      const subject = document.getElementById('cntSubject');
      const message = document.getElementById('cntMessage');

      if (!name.value.trim()) {
        showError(name, 'Please enter your name.');
        isValid = false;
      } else {
        clearError(name);
      }

      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email.value.trim() || !emailPattern.test(email.value.trim())) {
        showError(email, 'Please enter a valid email address.');
        isValid = false;
      } else {
        clearError(email);
      }

      if (!subject.value.trim()) {
        showError(subject, 'Please enter a subject.');
        isValid = false;
      } else {
        clearError(subject);
      }

      if (!message.value.trim() || message.value.trim().length < 10) {
        showError(message, 'Please enter a message of at least 10 characters.');
        isValid = false;
      } else {
        clearError(message);
      }

      if (isValid) {
        // Save to LocalStorage
        const contactQueries = JSON.parse(localStorage.getItem('abc_contact_queries') || '[]');
        contactQueries.push({
          name: name.value.trim(),
          email: email.value.trim(),
          subject: subject.value.trim(),
          message: message.value.trim(),
          date: new Date().toISOString()
        });
        localStorage.setItem('abc_contact_queries', JSON.stringify(contactQueries));

        if (contactSuccess) {
          contactSuccess.classList.add('visible');
          contactSuccess.innerHTML = `
            <div class="alert-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
            <div class="alert-content">
              <h3 class="alert-title">Message Sent Successfully!</h3>
              <p class="alert-message">Thank you, <strong>${name.value.trim()}</strong>. We have received your query regarding "${subject.value.trim()}" and will respond to your email shortly.</p>
            </div>
          `;
        }
        contactForm.reset();
      }
    });
  }

  // Helper validation functions
  function showError(inputElement, message) {
    inputElement.classList.add('is-invalid');
    const parent = inputElement.closest('.form-group');
    if (parent) {
      let errSpan = parent.querySelector('.form-error');
      if (!errSpan) {
        errSpan = document.createElement('div');
        errSpan.className = 'form-error';
        parent.appendChild(errSpan);
      }
      errSpan.textContent = message;
      errSpan.classList.add('visible');
    }
  }

  function clearError(inputElement) {
    inputElement.classList.remove('is-invalid');
    const parent = inputElement.closest('.form-group');
    if (parent) {
      const errSpan = parent.querySelector('.form-error');
      if (errSpan) {
        errSpan.classList.remove('visible');
      }
    }
  }


  // --------------------------------------------------------------------------
  // FEATURE 5: Home Page Auto-Rotating Testimonial Slider
  // --------------------------------------------------------------------------
  const slides = document.querySelectorAll('.slider-container .slide');
  const prevBtn = document.getElementById('prevSlide');
  const nextBtn = document.getElementById('nextSlide');
  const sliderDotsContainer = document.getElementById('sliderDots');
  let currentSlideIndex = 0;
  let slideInterval = null;

  function showSlide(index) {
    if (!slides.length) return;
    slides.forEach(slide => slide.classList.remove('active'));
    currentSlideIndex = (index + slides.length) % slides.length;
    slides[currentSlideIndex].classList.add('active');

    // Update pagination dots
    if (sliderDotsContainer) {
      const dots = sliderDotsContainer.querySelectorAll('.slider-dot');
      dots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === currentSlideIndex);
        dot.setAttribute('aria-selected', idx === currentSlideIndex ? 'true' : 'false');
      });
    }
  }

  function startSlideTimer() {
    stopSlideTimer();
    slideInterval = setInterval(() => {
      showSlide(currentSlideIndex + 1);
    }, 5000);
  }

  function stopSlideTimer() {
    if (slideInterval) clearInterval(slideInterval);
  }

  if (slides.length > 0) {
    // Generate slider dots
    if (sliderDotsContainer) {
      sliderDotsContainer.innerHTML = '';
      slides.forEach((_, idx) => {
        const dot = document.createElement('button');
        dot.className = `slider-dot ${idx === 0 ? 'active' : ''}`;
        dot.setAttribute('aria-label', `Go to testimonial slide ${idx + 1} of ${slides.length}`);
        dot.setAttribute('role', 'tab');
        dot.setAttribute('aria-selected', idx === 0 ? 'true' : 'false');
        dot.addEventListener('click', () => {
          showSlide(idx);
          startSlideTimer();
        });
        sliderDotsContainer.appendChild(dot);
      });
    }

    showSlide(0);
    startSlideTimer();

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        showSlide(currentSlideIndex + 1);
        startSlideTimer();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        showSlide(currentSlideIndex - 1);
        startSlideTimer();
      });
    }

    const sliderContainer = document.querySelector('.slider-container');
    if (sliderContainer) {
      sliderContainer.addEventListener('mouseenter', stopSlideTimer);
      sliderContainer.addEventListener('mouseleave', startSlideTimer);
    }
  }


  // --------------------------------------------------------------------------
  // FEATURE 6: Gallery Lightbox Modal
  // --------------------------------------------------------------------------
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');

  if (galleryItems.length && lightboxModal) {
    galleryItems.forEach(item => {
      item.addEventListener('click', () => {
        const img = item.querySelector('img');
        const caption = item.dataset.caption || img?.alt || 'Campus View';
        if (img) {
          lightboxImg.src = img.src;
          lightboxImg.alt = caption;
          lightboxCaption.textContent = caption;
          lightboxModal.classList.add('active');
          document.body.style.overflow = 'hidden';
        }
      });
    });

    function closeLightbox() {
      lightboxModal.classList.remove('active');
      document.body.style.overflow = '';
    }

    if (lightboxClose) {
      lightboxClose.addEventListener('click', closeLightbox);
    }

    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) {
        closeLightbox();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightboxModal.classList.contains('active')) {
        closeLightbox();
      }
    });
  }


  // --------------------------------------------------------------------------
  // FEATURE 7: Home Page Notices Auto-Rotating Ticker
  // --------------------------------------------------------------------------
  const noticeTicker = document.getElementById('noticeTicker');
  if (noticeTicker) {
    const noticeItems = noticeTicker.querySelectorAll('.notice-item');
    if (noticeItems.length > 3) {
      let activeNoticeStart = 0;
      let tickerTimer = null;

      const cycleNotices = () => {
        activeNoticeStart = (activeNoticeStart + 1) % noticeItems.length;
        noticeItems.forEach((item, idx) => {
          if (idx >= activeNoticeStart && idx < activeNoticeStart + 3) {
            item.style.display = 'flex';
          } else {
            item.style.display = 'none';
          }
        });
      };

      const startTicker = () => {
        if (!tickerTimer) {
          tickerTimer = setInterval(cycleNotices, 4000);
        }
      };

      const stopTicker = () => {
        if (tickerTimer) {
          clearInterval(tickerTimer);
          tickerTimer = null;
        }
      };

      startTicker();

      const noticesCard = noticeTicker.closest('.notices-card');
      if (noticesCard) {
        noticesCard.addEventListener('mouseenter', stopTicker);
        noticesCard.addEventListener('mouseleave', startTicker);
      }
    }
  }


  // --------------------------------------------------------------------------
  // FEATURE 8: Events Page Tabs (Upcoming vs. Past Events)
  // --------------------------------------------------------------------------
  const eventTabs = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  if (eventTabs.length && tabContents.length) {
    eventTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        eventTabs.forEach(t => t.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));

        tab.classList.add('active');
        const targetId = tab.dataset.tab;
        const targetContent = document.getElementById(targetId);
        if (targetContent) {
          targetContent.classList.add('active');
        }
      });
    });
  }


  // --------------------------------------------------------------------------
  // FEATURE 9: Admissions Page FAQ Accordion
  // --------------------------------------------------------------------------
  const accordionHeaders = document.querySelectorAll('.accordion-header');

  if (accordionHeaders.length) {
    accordionHeaders.forEach(header => {
      header.addEventListener('click', () => {
        const item = header.parentElement;
        const isActive = item.classList.contains('active');

        // Close all other accordion items for clean single-view
        document.querySelectorAll('.accordion-item').forEach(i => i.classList.remove('active'));

        if (!isActive) {
          item.classList.add('active');
        }
      });
    });
  }


  // --------------------------------------------------------------------------
  // FEATURE 10: Back-To-Top Button & Smooth Scrolling
  // --------------------------------------------------------------------------
  const backToTopBtn = document.getElementById('backToTop');

  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 350) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }


  // --------------------------------------------------------------------------
  // FEATURE 11: Dark Mode Toggle with LocalStorage Memory
  // --------------------------------------------------------------------------
  const themeToggleBtn = document.getElementById('themeToggle');
  const savedTheme = localStorage.getItem('abc_theme') || 'light';

  // Apply saved theme on boot
  if (savedTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    updateThemeToggleState(true);
  } else {
    document.documentElement.setAttribute('data-theme', 'light');
    updateThemeToggleState(false);
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('abc_theme', newTheme);
      updateThemeToggleState(newTheme === 'dark');
    });
  }

  function updateThemeToggleState(isDark) {
    if (themeToggleBtn) {
      themeToggleBtn.setAttribute('aria-checked', isDark ? 'true' : 'false');
      themeToggleBtn.setAttribute('title', isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode');
      themeToggleBtn.setAttribute('aria-label', isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode');
    }
  }


  // --------------------------------------------------------------------------
  // FEATURE 12: Animated Counting Statistics
  // --------------------------------------------------------------------------
  const statValues = document.querySelectorAll('.stat-value[data-target]');
  if (statValues.length) {
    let animated = false;

    const animateStats = () => {
      statValues.forEach(stat => {
        const target = parseInt(stat.dataset.target, 10);
        const suffix = stat.dataset.suffix || '';
        const duration = 1600;
        const startTime = performance.now();

        const updateCount = (currentTime) => {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          // Ease out quint
          const easeOut = 1 - Math.pow(1 - progress, 5);
          const currentVal = Math.floor(easeOut * target);

          stat.textContent = currentVal.toLocaleString() + suffix;

          if (progress < 1) {
            requestAnimationFrame(updateCount);
          } else {
            stat.textContent = target.toLocaleString() + suffix;
          }
        };

        requestAnimationFrame(updateCount);
      });
    };

    const statsObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !animated) {
          animated = true;
          animateStats();
          observer.disconnect();
        }
      });
    }, { threshold: 0.2 });

    const statsBanner = document.querySelector('.stats-banner');
    if (statsBanner) {
      statsObserver.observe(statsBanner);
    }
  }


  // --------------------------------------------------------------------------
  // FEATURE 13: Interactive Scroll Reveal System
  // --------------------------------------------------------------------------
  const autoRevealTargets = document.querySelectorAll(
    '.card, .gallery-item, .notice-item, .section-header, .form-card, .cta-banner, .info-item, .tab-container'
  );
  autoRevealTargets.forEach((el, index) => {
    if (!el.classList.contains('reveal')) {
      el.classList.add('reveal');
      if (el.classList.contains('card') || el.classList.contains('gallery-item')) {
        const delayClass = `reveal-delay-${(index % 4) + 1}`;
        el.classList.add(delayClass);
      }
    }
  });

  const reveals = document.querySelectorAll('.reveal, .reveal-scale');
  if (reveals.length && 'IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -30px 0px'
    });

    reveals.forEach(el => revealObserver.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('revealed'));
  }

});
