export default function decorate(block) {
  // Background image is applied by applySectionBackgrounds() in scripts.js
  // via data-background attribute from Section Metadata.
  // Hero block only needs to handle content layout.

  // Unwrap strong links → pill CTAs
  block.querySelectorAll('strong a').forEach((a) => {
    a.classList.add('hero-cta');
    a.closest('strong').replaceWith(a);
  });
}
