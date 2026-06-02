export default function decorate(block) {
  const picture = block.querySelector('picture');
  if (picture) {
    // Move picture out of paragraph, make it a full-bleed background
    picture.closest('p')?.remove();
    block.prepend(picture);
    // Mark image as eager (LCP)
    const img = picture.querySelector('img');
    if (img) {
      img.setAttribute('loading', 'eager');
      img.setAttribute('fetchpriority', 'high');
    }
  }
}
