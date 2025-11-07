// Smooth scroll for internal links
document.addEventListener('click', (e) => {
  const target = e.target.closest('a[href^="#"]');
  if (!target) return;
  const href = target.getAttribute('href');
  if (href && href.length > 1) {
    const el = document.querySelector(href);
    if (el) {
      e.preventDefault();
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
});

// Sticky header shadow on scroll is handled via CSS backdrop; add class if needed later

// Intersection Observer for reveal animations
const observer = new IntersectionObserver((entries) => {
  for (const entry of entries) {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  }
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

// Mobile nav toggle
const navToggle = document.querySelector('.nav-toggle');
const mainNav = document.querySelector('.main-nav');
if (navToggle && mainNav) {
  navToggle.addEventListener('click', () => {
    const open = mainNav.classList.toggle('open');
    navToggle.classList.toggle('active');
    navToggle.setAttribute('aria-expanded', String(open));
    
    // Close menu when clicking on a nav link
    if (open) {
      const navLinks = mainNav.querySelectorAll('.nav-link');
      navLinks.forEach(link => {
        link.addEventListener('click', () => {
          mainNav.classList.remove('open');
          navToggle.classList.remove('active');
          navToggle.setAttribute('aria-expanded', 'false');
        });
      });
    }
  });
  
  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!navToggle.contains(e.target) && !mainNav.contains(e.target)) {
      mainNav.classList.remove('open');
      navToggle.classList.remove('active');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });
}

// Auto-scroll Featured Products Gallery
function initFeaturedGallery() {
  const galleryTrack = document.querySelector('.gallery-track');
  if (!galleryTrack) return;

  let currentIndex = 0;
  let isScrolling = false;
  let scrollInterval;
  const scrollDelay = 600; // 600ms between slides

  function getItemWidth() {
    const firstItem = galleryTrack.querySelector('.product-item');
    if (!firstItem) return 320; // fallback width
    return firstItem.offsetWidth + 24; // width + gap
  }

  function startAutoScroll() {
    if (scrollInterval) return;
    
    scrollInterval = setInterval(() => {
      if (isScrolling) return;
      
      const itemWidth = getItemWidth();
      const maxItems = galleryTrack.children.length;
      
      currentIndex = (currentIndex + 1) % maxItems;
      const targetScroll = currentIndex * itemWidth;
      
      galleryTrack.scrollTo({
        left: targetScroll,
        behavior: 'smooth'
      });
    }, scrollDelay);
  }

  function stopAutoScroll() {
    if (scrollInterval) {
      clearInterval(scrollInterval);
      scrollInterval = null;
    }
  }

  function pauseAutoScroll() {
    isScrolling = true;
    stopAutoScroll();
  }

  function resumeAutoScroll() {
    isScrolling = false;
    setTimeout(() => {
      if (!scrollInterval) {
        startAutoScroll();
      }
    }, 2000); // Resume after 2 seconds
  }

  // Start auto-scroll when gallery comes into view
  const galleryObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        startAutoScroll();
      } else {
        stopAutoScroll();
        currentIndex = 0;
      }
    });
  }, { threshold: 0.3 });

  galleryObserver.observe(galleryTrack);

  // Pause on hover
  galleryTrack.addEventListener('mouseenter', pauseAutoScroll);
  galleryTrack.addEventListener('mouseleave', resumeAutoScroll);

  // Pause on touch/scroll
  galleryTrack.addEventListener('touchstart', pauseAutoScroll);
  galleryTrack.addEventListener('scroll', () => {
    // Update current index based on scroll position
    const itemWidth = getItemWidth();
    currentIndex = Math.round(galleryTrack.scrollLeft / itemWidth);
    pauseAutoScroll();
    resumeAutoScroll();
  });

  // Handle window resize
  window.addEventListener('resize', () => {
    currentIndex = 0;
    stopAutoScroll();
    setTimeout(startAutoScroll, 1000);
  });
}

// Initialize gallery when DOM is loaded
document.addEventListener('DOMContentLoaded', initFeaturedGallery);

// Simple Carousel (pure JS) - keeping for other carousels if needed
function initCarousel(root){
  const track = root.querySelector('.carousel-track');
  if (!track) return;
  
  const cards = Array.from(track.children);
  const prev = root.querySelector('.prev');
  const next = root.querySelector('.next');
  const dotsRoot = root.querySelector('.carousel-dots');
  const interval = Number(root.getAttribute('data-autoplay-interval') || 600);

  // Build dots
  const dots = cards.map((_, i) => {
    const b = document.createElement('button');
    b.setAttribute('aria-label', `Go to slide ${i+1}`);
    dotsRoot.appendChild(b);
    return b;
  });

  let index = 0;
  function update(){
    const cardWidth = cards[0].getBoundingClientRect().width + 16; // include gap
    track.scrollTo({ left: index * cardWidth, behavior: 'smooth' });
    dots.forEach((d, i) => d.setAttribute('aria-current', String(i===index)));
  }

  function go(delta){
    index = (index + delta + cards.length) % cards.length;
    update();
  }

  if (prev) prev.addEventListener('click', () => go(-1));
  if (next) next.addEventListener('click', () => go(1));
  dots.forEach((d, i) => d.addEventListener('click', () => { index = i; update(); }));

  // Autoplay
  let timer = setInterval(() => go(1), interval);
  root.addEventListener('mouseenter', () => clearInterval(timer));
  root.addEventListener('mouseleave', () => { timer = setInterval(() => go(1), interval); });

  // Resize re-align
  window.addEventListener('resize', update);
  update();
}

document.querySelectorAll('.carousel').forEach(initCarousel);

// Basic newsletter mock submit
const form = document.querySelector('.newsletter');
if (form) {
  form.addEventListener('submit', () => {
    const input = form.querySelector('input[type="email"]');
    if (input && input.checkValidity()) {
      form.reset();
      alert('Thanks for subscribing to KrrCare!');
    }
  });
}

