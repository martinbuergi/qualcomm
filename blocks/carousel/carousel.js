let currentSlide = 0;
let totalSlides = 0;
let autoplayTimer = null;
let blockRef = null;

function updateSlides(index) {
  const block = blockRef;
  const slides = block.querySelectorAll('.carousel-slide');
  const dots = block.querySelectorAll('.carousel-dot');
  const progressBars = block.querySelectorAll('.carousel-progress-bar');

  slides.forEach((slide, i) => {
    slide.classList.toggle('active', i === index);
    slide.setAttribute('aria-hidden', i !== index);
  });

  dots.forEach((dot, i) => {
    dot.classList.toggle('active', i === index);
  });

  // Reset all progress bars instantly
  progressBars.forEach((bar) => {
    bar.style.transition = 'none';
    bar.style.width = '0%';
  });

  // Animate the active bar after a reflow
  const activeBar = progressBars[index];
  if (activeBar) {
    // Double rAF ensures browser has painted before transition starts
    requestAnimationFrame(() => requestAnimationFrame(() => {
      activeBar.style.transition = 'width 5s linear';
      activeBar.style.width = '100%';
    }));
  }

  currentSlide = index;
}

function nextSlide() {
  updateSlides((currentSlide + 1) % totalSlides);
}

function startAutoplay() {
  stopAutoplay();
  autoplayTimer = setInterval(nextSlide, 5000);
}

function stopAutoplay() {
  if (autoplayTimer) clearInterval(autoplayTimer);
  autoplayTimer = null;
}

export default function decorate(block) {
  blockRef = block;
  const rows = [...block.children];
  totalSlides = rows.length;

  // Build slide wrapper
  const slideWrapper = document.createElement('div');
  slideWrapper.className = 'carousel-slides';

  rows.forEach((row, i) => {
    const slide = document.createElement('div');
    // Start all slides without active — we add it after mount via rAF
    slide.className = 'carousel-slide';
    slide.setAttribute('aria-hidden', 'true');

    const cells = [...row.children];
    const contentCell = cells[0];
    const bgCell = cells[1];

    if (bgCell) {
      const img = bgCell.querySelector('img');
      if (img) {
        slide.style.backgroundImage = `url(${img.src})`;
      } else {
        const bgValue = bgCell.textContent.trim();
        if (bgValue.startsWith('/') || bgValue.startsWith('http')) {
          slide.style.backgroundImage = `url(${bgValue})`;
        } else if (bgValue) {
          slide.style.backgroundColor = bgValue;
        }
      }
    }

    const content = document.createElement('div');
    content.className = 'carousel-slide-content';
    content.innerHTML = contentCell.innerHTML;

    slide.appendChild(content);
    slideWrapper.appendChild(slide);
  });

  // Build controls
  const controls = document.createElement('div');
  controls.className = 'carousel-controls';

  const dotsWrapper = document.createElement('div');
  dotsWrapper.className = 'carousel-dots';

  for (let i = 0; i < totalSlides; i += 1) {
    const dot = document.createElement('button');
    dot.className = 'carousel-dot';
    dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
    dot.setAttribute('type', 'button');

    const bar = document.createElement('div');
    bar.className = 'carousel-progress-bar';
    dot.appendChild(bar);

    dot.addEventListener('click', () => {
      stopAutoplay();
      updateSlides(i);
      startAutoplay();
    });

    dotsWrapper.appendChild(dot);
  }

  const prev = document.createElement('button');
  prev.className = 'carousel-prev';
  prev.setAttribute('aria-label', 'Previous slide');
  prev.setAttribute('type', 'button');
  prev.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/></svg>';
  prev.addEventListener('click', () => {
    stopAutoplay();
    updateSlides((currentSlide - 1 + totalSlides) % totalSlides);
    startAutoplay();
  });

  const next = document.createElement('button');
  next.className = 'carousel-next';
  next.setAttribute('aria-label', 'Next slide');
  next.setAttribute('type', 'button');
  next.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/></svg>';
  next.addEventListener('click', () => {
    stopAutoplay();
    updateSlides((currentSlide + 1) % totalSlides);
    startAutoplay();
  });

  controls.appendChild(prev);
  controls.appendChild(dotsWrapper);
  controls.appendChild(next);

  // Mount
  block.innerHTML = '';
  block.appendChild(slideWrapper);
  block.appendChild(controls);

  // Activate first slide AFTER paint — double rAF forces a real frame boundary
  // so the CSS transition from opacity:0/translateX(30px) → opacity:1/translateX(0) fires
  requestAnimationFrame(() => requestAnimationFrame(() => {
    updateSlides(0);
    startAutoplay();
  }));

  // Pause on hover
  block.addEventListener('mouseenter', stopAutoplay);
  block.addEventListener('mouseleave', startAutoplay);

  // Swipe support
  let touchStartX = 0;
  block.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });
  block.addEventListener('touchend', (e) => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      stopAutoplay();
      updateSlides(diff > 0
        ? (currentSlide + 1) % totalSlides
        : (currentSlide - 1 + totalSlides) % totalSlides);
      startAutoplay();
    }
  });
}
