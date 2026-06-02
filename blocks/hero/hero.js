export default function decorate(block) {
  const rows = [...block.children];

  if (rows.length < 2) return;

  const picRow = rows[0];
  const textRow = rows[1];

  // Extract picture from first row
  const picture = picRow.querySelector('picture');
  if (!picture) return;

  // Create background wrapper
  const bg = document.createElement('div');
  bg.className = 'hero-bg';
  bg.append(picture);
  block.prepend(bg);
  picRow.remove();

  // Style the text row
  textRow.className = 'hero-text';

  // Eager-load the LCP image
  const img = picture.querySelector('img');
  if (img) {
    img.setAttribute('loading', 'eager');
    img.setAttribute('fetchpriority', 'high');
    img.removeAttribute('srcset');
    // Use full-size source
    const sources = picture.querySelectorAll('source[media="(min-width: 600px)"]');
    sources.forEach((s) => {
      const srcset = s.getAttribute('srcset');
      if (srcset) {
        img.src = srcset.split('?')[0];
      }
    });
  }
}
