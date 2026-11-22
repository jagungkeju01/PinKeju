document.addEventListener('DOMContentLoaded', () => {
  const V = window.Venari;
  if (!V) return;
  const grid = document.querySelector('#shop-grid');
  const count = document.querySelector('#result-count');
  const empty = document.querySelector('#empty-state');
  let category = new URLSearchParams(location.search).get('category') || 'All';
  let query = new URLSearchParams(location.search).get('q') || '';
  let sort = 'featured';

  const isFootwear = p => p.category === 'Sneakers';
  const isApparel = p => ['Hoodies','Sweaters','T-shirts','Jackets','Jerseys','Pants'].includes(p.category);
  const isAccessory = p => ['Caps','Hats','Accessories'].includes(p.category);
  const matches = (p, selected) => {
    if (selected === 'All') return true;
    if (selected === 'Apparel') return isApparel(p);
    if (selected === 'Accessories') return isAccessory(p);
    return p.category === selected;
  };
  const photoCount = p => (p.images || []).length;

  function render() {
    let list = V.products.filter(p => matches(p, category) && `${p.name} ${p.category}`.toLowerCase().includes(query.toLowerCase()));
    if (sort === 'name-asc') list.sort((a, b) => a.name.localeCompare(b.name));
    else if (sort === 'price-asc') list.sort((a, b) => a.price - b.price);
    else if (sort === 'price-desc') list.sort((a, b) => b.price - a.price);
    else list.sort((a, b) => photoCount(b) - photoCount(a) || a.name.localeCompare(b.name));
    grid.innerHTML = list.map(V.card).join('');
    count.textContent = `${list.length} PRODUK`;
    empty.hidden = list.length > 0;
    document.querySelectorAll('.filter-chip').forEach(button => button.classList.toggle('active', button.dataset.category === category));
  }
  document.querySelectorAll('.filter-chip').forEach(button => button.addEventListener('click', () => { category = button.dataset.category; render(); }));
  document.querySelector('#sort-select')?.addEventListener('change', event => { sort = event.target.value; render(); });
  document.addEventListener('venari-search', event => { query = event.detail; render(); });
  render();
});