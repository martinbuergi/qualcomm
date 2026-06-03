import { createOptimizedPicture } from '../../scripts/aem.js';

let currentSlide = 0;
let totalSlides = 0;
let autoplayTimer = null;
let progressTimer = null;

function updateSlides(block, index) {
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

  // Reset progress bars
  progressBars.forEach((bar, i) => {
    bar.style.transition = 'none';
    bar.style.width = i < index ? '100%' : '0%';
  });

  // Animate active bar
  const activeBar = progressBars[index];
  if (activeBar) {
    requestAnimationFrame(() => {
      activeBar.style.transition = 'width 5s linear';
      activeBar.style.width = '100%';
    });
  }

  currentSlide = index;
}

function nextSlide(block) {
  const next = (currentSlide + 1) % totalSlides;
  updateSlides(block, next);
}

function startAutoplay(block) {
  stopAutoplay();
  autoplayTimer = setInterval(() => nextSlide(block), 5000);
}

function stopAutoplay() {
  if (autoplayTimer) clearInterval(autoplayTimer);
  autoplayTimer = null;
}

export default function decorate(block) {
  const rows = [...block.children];
  totalSlides = rows.length;

  // Build slide wrapper
  const slideWrapper = document.createElement('div');
  slideWrapper.className = 'carousel-slides';

  rows.forEach((row, i) => {
    const slide = document.createElement('div');
    slide.className = 'carousel-slide';
    slide.setAttribute('aria-hidden', i !== 0);

    // Each row has one or two cells: [content] or [content, bg-image]
    const cells = [...row.children];
    const contentCell = cells[0];
    const bgCell = cells[1];

    if (bgCell) {
      const img = bgCell.querySelector('img');
      if (img) {
        slide.style.backgroundImage = `url(${img.src})`;
      } else {
        const bgColor = bgCell.textContent.trim();
        if (bgColor) slide.style.backgroundColor = bgColor;
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

  // Progress bars / dots
  const dotsWrapper = document.createElement('div');
  dotsWrapper.className = 'carousel-dots';

  for (let i = 0; i < totalSlides; i++) {
    const dot = document.createElement('button');
    dot.className = 'carousel-dot';
    dot.setAttribute('aria-label', `Slide ${i + 1}`);

    const bar = document.createElement('div');
    bar.className = 'carousel-progress-bar';
    dot.appendChild(bar);

    dot.addEventListener('click', () => {
      stopAutoplay();
      updateSlides(block, i);
      startAutoplay(block);
    });

    dotsWrapper.appendChild(dot);
  }

  // Prev/Next arrows
  const prev = document.createElement('button');
  prev.className = 'carousel-prev';
  prev.setAttribute('aria-label', 'Previous slide');
  prev.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20"><path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/></svg>';
  prev.addEventListener('click', () => {
    stopAutoplay();
    updateSlides(block, (currentSlide - 1 + totalSlides) % totalSlides);
    startAutoplay(block);
  });

  const next = document.createElement('button');
  next.className = 'carousel-next';
  next.setAttribute('aria-label', 'Next slide');
  next.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20"><path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/></svg>';
  next.addEventListener('click', () => {
    stopAutoplay();
    updateSlides(block, (currentSlide + 1) % totalSlides);
    startAutoplay(block);
  });

  controls.appendChild(prev);
  controls.appendChild(dotsWrapper);
  controls.appendChild(next);

  // Clear block and rebuild
  block.innerHTML = '';
  block.appendChild(slideWrapper);
  block.appendChild(controls);

  // Init
  updateSlides(block, 0);
  startAutoplay(block);

  // Pause on hover
  block.addEventListener('mouseenter', stopAutoplay);
  block.addEventListener('mouseleave', () => startAutoplay(block));

  // Swipe support
  let touchStart = 0;
  block.addEventListener('touchstart', (e) => { touchStart = e.touches[0].clientX; }, { passive: true });
  block.addEventListener('touchend', (e) => {
    const diff = touchStart - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      stopAutoplay();
      updateSlides(block, diff > 0
        ? (currentSlide + 1) % totalSlides
        : (currentSlide - 1 + totalSlides) % totalSlides);
      startAutoplay(block);
    }
  });
}
