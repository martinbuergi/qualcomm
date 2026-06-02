export default function decorate(block) {
  // Structure: .hero > div (row) > div (col1=text), div (col2=bg-url)
  const row = block.querySelector(':scope > div');
  if (!row) return;

  const cols = [...row.children];
  if (cols.length >= 2) {
    const bgUrl = cols[1].textContent.trim();
    if (bgUrl) {
      block.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.52),rgba(0,0,0,0.52)), url('${bgUrl}')`;
      cols[1].remove();
    }
  }

  // Style text column
  if (cols[0]) cols[0].className = 'hero-content';

  // Unwrap strong around CTA links
  block.querySelectorAll('strong a').forEach((a) => {
    a.classList.add('hero-cta');
    a.closest('strong').replaceWith(a);
  });
}
