export default function decorate(block) {
  // In the two-row pattern: row[0] = picture, row[1] = text
  // EDS converts rows to divs. Grab the picture from the first child div.
  const rows = [...block.children];
  if (rows.length >= 2) {
    const picRow = rows[0];
    const textRow = rows[1];
    const picture = picRow.querySelector('picture');
    if (picture) {
      // Move picture to block level (sibling of content, not child of row)
      block.prepend(picture);
      picRow.remove();
      // Make the text wrapper the default-content-wrapper
      textRow.className = 'default-content-wrapper';
      const img = picture.querySelector('img');
      if (img) {
        img.setAttribute('loading', 'eager');
        img.setAttribute('fetchpriority', 'high');
      }
    }
  } else if (rows.length === 1) {
    // Single row: picture + text in same cell
    rows[0].className = 'default-content-wrapper';
    const picture = rows[0].querySelector('picture');
    if (picture) {
      picture.closest('p')?.replaceWith(picture);
      block.prepend(picture);
      const img = picture.querySelector('img');
      if (img) {
        img.setAttribute('loading', 'eager');
        img.setAttribute('fetchpriority', 'high');
      }
    }
  }
}
