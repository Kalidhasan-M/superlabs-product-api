const productsContainer = document.getElementById('productsContainer');
const brandFilters = document.getElementById('brandFilters');
const resultCount = document.getElementById('resultCount');
const sortSelect = document.getElementById('sortSelect');
const searchInput = document.getElementById('searchInput');
const cartCount = document.getElementById('cartCount');

let cart = JSON.parse(localStorage.getItem('cart')) || [];
let currentFilters = { page: 1, limit: 10, brand: '', rating: '', q: '', sort: '' };

// Event Listeners
sortSelect.addEventListener('change', (e) => {
  currentFilters.sort = e.target.value;
  currentFilters.page = 1;
  fetchProducts();
});

searchInput.addEventListener('input', debounce((e) => {
  currentFilters.q = e.target.value;
  currentFilters.page = 1;
  fetchProducts();
}, 500));

document.querySelectorAll('input[name="rating"]').forEach(radio => {
  radio.addEventListener('change', (e) => {
    currentFilters.rating = e.target.value;
    currentFilters.page = 1;
    fetchProducts();
  });
});

function debounce(func, delay) {
  let timeoutId;
  return function(...args) {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => { func.apply(null, args); }, delay);
  };
}

async function fetchBrands() {
  try {
    const res = await fetch('/api/brands');
    const brands = await res.json();
    brandFilters.innerHTML = brands.map(b => `
      <label class="flex items-center space-x-2 cursor-pointer mt-2">
        <input type="radio" name="brand" value="${b.id}" class="text-pink-600 focus:ring-pink-500 rounded brand-filter" onchange="handleBrandChange(this)">
        <span class="text-gray-600">${b.name}</span>
      </label>
    `).join('') + `
      <label class="flex items-center space-x-2 cursor-pointer mt-2">
        <input type="radio" name="brand" value="" class="text-pink-600 focus:ring-pink-500 rounded brand-filter" checked onchange="handleBrandChange(this)">
        <span class="text-gray-600">All Brands</span>
      </label>
    `;
  } catch (error) {
    console.error('Error fetching brands', error);
  }
}

window.handleBrandChange = (el) => {
  currentFilters.brand = el.value;
  currentFilters.page = 1;
  fetchProducts();
};

async function fetchProducts() {
  const query = new URLSearchParams();
  Object.keys(currentFilters).forEach(key => {
    if (currentFilters[key]) query.append(key, currentFilters[key]);
  });

  try {
    const res = await fetch(`/api/products?${query.toString()}`);
    const data = await res.json();
    
    resultCount.textContent = `${data.total || 0} results`;
    renderProducts(data.products || []);
    renderPagination(data.page, data.totalPages);
  } catch (error) {
    console.error('Error fetching products', error);
    productsContainer.innerHTML = '<p class="text-red-500 col-span-full">Failed to load products.</p>';
  }
}

function renderProducts(products) {
  if (products.length === 0) {
    productsContainer.innerHTML = '<p class="text-gray-500 col-span-full text-center py-10">No products found for the selected criteria.</p>';
    return;
  }

  productsContainer.innerHTML = products.map(p => `
    <div class="product-card bg-white rounded-xl shadow-sm border p-4 flex flex-col transition-all cursor-pointer relative h-full">
      ${p.discount_price ? `<span class="absolute top-4 left-4 bg-yellow-300 text-yellow-900 text-xs font-bold px-2 py-1 rounded">SAVE BIG!</span>` : ''}
      <button class="absolute top-4 right-4 text-gray-400 hover:text-pink-500"><i class="far fa-heart"></i></button>
      
      <div class="flex-grow flex items-center justify-center p-4">
        <img src="${p.image_url || 'https://via.placeholder.com/200'}" alt="${p.name}" class="mask object-contain max-h-48 w-full transition-transform duration-300 hover:scale-105">
      </div>
      
      <div class="mt-4 flex flex-col flex-grow">
        <h3 class="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">${p.Brand ? p.Brand.name : 'Unknown Brand'}</h3>
        <h2 class="text-sm font-semibold text-gray-800 mb-2 line-clamp-2">${p.name}</h2>
        
        <div class="flex items-center space-x-1 mb-2">
          <span class="text-yellow-400 text-xs"><i class="fas fa-star"></i></span>
          <span class="text-xs font-bold text-gray-700">${parseFloat(p.rating).toFixed(1)}</span>
        </div>
        
        <div class="mt-auto flex items-end justify-between">
          <div>
            ${p.discount_price 
              ? `<p class="text-lg font-bold text-gray-900">₹ ${p.discount_price} <span class="text-sm text-gray-400 line-through font-normal">₹ ${p.price}</span></p>`
              : `<p class="text-lg font-bold text-gray-900">₹ ${p.price}</p>`
            }
          </div>
        </div>
        
        <button onclick="addToCart(${p.id}, '${p.name.replace(/'/g, "\\'")}', ${p.discount_price || p.price})" class="mt-4 w-full py-2 border border-pink-600 text-pink-600 font-semibold rounded-md hover:bg-pink-600 hover:text-white transition-colors uppercase tracking-wide text-xs">
          Add to Bag
        </button>
      </div>
    </div>
  `).join('');
}

function renderPagination(currentPage, totalPages) {
  const pagination = document.getElementById('pagination');
  if (totalPages <= 1) {
    pagination.innerHTML = '';
    return;
  }
  
  let btns = '';
  for (let i = 1; i <= totalPages; i++) {
    btns += `<button onclick="changePage(${i})" class="px-3 py-1 border rounded ${currentPage === i ? 'bg-pink-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}">${i}</button>`;
  }
  pagination.innerHTML = btns;
}

window.changePage = (page) => {
  currentFilters.page = page;
  fetchProducts();
};

window.addToCart = (id, name, price) => {
  const existingProduct = cart.find(item => item.id === id);
  if (existingProduct) {
    existingProduct.quantity += 1;
  } else {
    cart.push({ id, name, price, quantity: 1 });
  }
  
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  
  alert(`Added ${name} to cart!`);
};

function updateCartCount() {
  const count = cart.reduce((acc, item) => acc + item.quantity, 0);
  cartCount.textContent = count;
}

// Initial Load
updateCartCount();
fetchBrands();
fetchProducts();
