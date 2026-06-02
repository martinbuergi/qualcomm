export default function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  const firstRow = rows[0];
  const cells = [...firstRow.children];

  // Two-column pattern: col[0] = text, col[1] = background image URL
  if (cells.length >= 2) {
    const bgUrl = cells[1].textContent.trim();
    if (bgUrl) {
      block.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.52),rgba(0,0,0,0.52)), url('${bgUrl}')`;
      cells[1].remove();
    }
  }

  // Promote first (now only) cell as content wrapper
  firstRow.className = 'hero-content';

  // Button decoration: make the first strong link a pill button
  firstRow.querySelectorAll('strong a').forEach((a) => {
    a.className = 'hero-cta';
    a.closest('strong').replaceWith(a);
  });
}
