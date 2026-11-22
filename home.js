// Homepage interactions: featured products, campaign gallery navigation, and scroll reveals.
document.addEventListener('DOMContentLoaded', () => {
  const grid = document.querySelector('#home-featured-grid');
  const V = window.Venari;
  if (grid && V?.products?.length) {
    const featured = [...V.products]
      .sort((a, b) => {
        const rank = p => /samba|speedcat|jordan|adlv|travis|fear of god|cartier|omega/i.test(p.name) ? 0 : 1;
        return rank(a) - rank(b) || a.name.localeCompare(b.name);
      })
      .slice(0, 4);
    grid.innerHTML = featured.map(V.card).join('');
  }

  const cards = [...document.querySelectorAll('.campaign-gallery .gallery-card')];
  const status = document.querySelector('#gallery-status');
  let current = 0;
  function setCampaign(index) {
    if (!cards.length) return;
    current = (index + cards.length) % cards.length;
    cards.forEach((card, i) => {
      card.classList.toggle('campaign-current', i === current);
      card.setAttribute('aria-current', i === current ? 'true' : 'false');
    });
    if (status) status.textContent = `${String(current + 1).padStart(2, '0')} — ${String(cards.length).padStart(2, '0')} / CAMPAIGN SELECTED`;
    cards[current].scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'nearest', inline: 'nearest' });
  }
  document.querySelector('#gallery-prev')?.addEventListener('click', () => setCampaign(current - 1));
  document.querySelector('#gallery-next')?.addEventListener('click', () => setCampaign(current + 1));
  cards.forEach((card, i) => card.addEventListener('mouseenter', () => {
    current = i;
    if (status) status.textContent = `${String(i + 1).padStart(2, '0')} — ${String(cards.length).padStart(2, '0')} / CAMPAIGN SELECTED`;
    cards.forEach((item, j) => item.classList.toggle('campaign-current', i === j));
  }));
  if (cards.length) setCampaign(0);

  const revealItems = document.querySelectorAll('.home-editorial, .home-featured, .category-tile, .brand-note');
  revealItems.forEach(el => el.classList.add('js-reveal'));
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    }), { threshold: 0.08 });
    revealItems.forEach(el => observer.observe(el));
  } else revealItems.forEach(el => el.classList.add('is-visible'));
});
