export default function decorate(block) {
  // Read background image URL from parent section's data-background attribute
  // (set by EDS decorateSections from Section Metadata)
  const section = block.closest('.section');
  if (section) {
    const bg = section.dataset.background;
    if (bg) {
      section.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.52),rgba(0,0,0,0.52)), url('${bg}')`;
    }
  }

  // Promote content wrapper
  const row = block.querySelector(':scope > div');
  if (row) {
    const cell = row.querySelector(':scope > div');
    if (cell) cell.className = 'hero-content';
  }

  // Unwrap strong links → pill CTAs
  block.querySelectorAll('strong a').forEach((a) => {
    a.classList.add('hero-cta');
    a.closest('strong').replaceWith(a);
  });
}
