// ========================================
// CORE APP LOGIC (Sidebar, Products, Cart)
// ========================================

// State
let cart = JSON.parse(localStorage.getItem('koojoo_cart')) || [];
let currentReelProduct = null;
let productsLimit = 20;
let productsOffset = 0;
let filteredProducts = [];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    setupCartUI();
    updateCartCount();
    setupIntersectionObserver();

    if (document.getElementById('home-categories')) {
        renderHomeCategories();
    }
    
    if (document.getElementById('products-grid')) {
        renderSidebarCategories();
        productsOffset = 0; // Reset on load
        renderProductsPage(true);
        window.addEventListener('popstate', () => {
            renderSidebarCategories();
            productsOffset = 0;
            renderProductsPage(true);
        });
    }

    if (document.getElementById('masterSearch')) {
        setupSearch();
    }

    if (document.getElementById('productReel')) {
        startProductReel();
    }

    if (document.getElementById('contactForm')) {
        setupContactForm();
    }
});

// High-performance Reveal Animations
function setupIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Once it's revealed, stop observing to save resources
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Initial scan and observation
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    
    // Mutation observer to watch for dynamically added products
    const mutationObserver = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === 1 && node.classList.contains('reveal')) {
                    observer.observe(node);
                } else if (node.nodeType === 1) {
                    node.querySelectorAll('.reveal').forEach(el => observer.observe(el));
                }
            });
        });
    });

    ['products-grid', 'home-categories'].forEach(id => {
        const el = document.getElementById(id);
        if (el) mutationObserver.observe(el, { childList: true });
    });
}

// Mobile Nav Toggle
function toggleMobileNav() {
    const navLinks = document.getElementById('navLinks');
    const toggleBtn = document.querySelector('.mobile-nav-toggle');
    navLinks.classList.toggle('active');
    toggleBtn.classList.toggle('active');
    
    // Prevent scrolling when menu is open
    document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
}

// Close mobile nav when clicking a link
document.addEventListener('click', (e) => {
    if (e.target.closest('.nav-links a')) {
        const navLinks = document.getElementById('navLinks');
        const toggleBtn = document.querySelector('.mobile-nav-toggle');
        if (navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            toggleBtn.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
});

function setupContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('contactName').value;
        const email = document.getElementById('contactEmail').value;
        const message = document.getElementById('contactMessage').value;
        const activeNumber = "233554411907";

        let whatsappMsg = `*NEW CONTACT MESSAGE*\n`;
        whatsappMsg += `--------------------------------\n`;
        whatsappMsg += `👤 *Name:* ${name}\n`;
        if (email) whatsappMsg += `📧 *Email:* ${email}\n`;
        whatsappMsg += `📝 *Message:* ${message}\n`;
        whatsappMsg += `--------------------------------\n`;
        whatsappMsg += `Sent from Koojoo Enterprise Website.`;

        const whatsappUrl = `https://wa.me/${activeNumber}?text=${encodeURIComponent(whatsappMsg)}`;
        
        console.log("Form submitted, redirecting to:", whatsappUrl);
        alert("Redirecting to WhatsApp...");
        
        // Use location.href instead of window.open to bypass popup blockers
        window.location.href = whatsappUrl;
        form.reset();
    });
}

function startProductReel() {
    const reel = document.getElementById('productReel');
    const content = document.getElementById('pipContent');
    const nameEl = document.getElementById('pipName');
    const priceEl = document.getElementById('pipPrice');

    // Flatten all products into one array
    let allProducts = [];
    for (const cat in categoryData) {
        categoryData[cat].items.forEach(item => {
            allProducts.push({ ...item, category: cat });
        });
    }

    if (allProducts.length === 0) return;

    function showRandomProduct() {
        const product = allProducts[Math.floor(Math.random() * allProducts.length)];
        currentReelProduct = product;
        const imgUrl = product.localImagePath || `https://via.placeholder.com/400x400.png?text=${encodeURIComponent(product.name)}`;
        
        // Apply blend effect
        content.classList.add('blending');
        
        setTimeout(() => {
            content.innerHTML = `<img src="${imgUrl}" alt="${product.name}" id="pipImg">`;
            nameEl.innerText = product.name;
            priceEl.innerText = `GH₵ ${typeof product.price === 'number' ? product.price.toFixed(2) : '0.00'}`;
            
            // Remove blend effect to fade in
            content.classList.remove('blending');
            
            // Trigger slow zoom effect
            const img = document.getElementById('pipImg');
            setTimeout(() => img.classList.add('zoom-effect'), 50);
        }, 1000); // Wait for the fade-out/blur to complete
    }

    // Initial show
    showRandomProduct();
    // Cycle every 5 seconds
    setInterval(showRandomProduct, 5000);
}

function goToReelProduct() {
    if (currentReelProduct) {
        window.location.href = `products.html?category=${encodeURIComponent(currentReelProduct.category)}&q=${encodeURIComponent(currentReelProduct.name)}`;
    }
}

function closeReel(e) {
    e.stopPropagation();
    document.getElementById('productReel').style.display = 'none';
}

function filterByCategory(categoryName) {
    // Update URL without page reload to preserve scroll position
    const url = categoryName === 'All' ? 'products.html' : `products.html?category=${encodeURIComponent(categoryName)}`;
    window.history.pushState({ category: categoryName }, '', url);
    renderSidebarCategories();
    productsOffset = 0;
    renderProductsPage(true);
}

function renderSidebarCategories() {
    const list = document.getElementById('sidebar-categories');
    if (!list) return;
    const params = new URLSearchParams(window.location.search);
    const activeCat = params.get('category') || 'All';
    const escapeAttr = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;');
    let html = `<li class="${activeCat === 'All' ? 'active' : ''}" data-category="All" onclick="filterByCategory(this.dataset.category)">All Products</li>`;
    for (const name in categoryData) {
        const categoryInfo = categoryData[name];
        html += `<li class="${activeCat === name ? 'active' : ''}" data-category="${escapeAttr(name)}" onclick="filterByCategory(this.dataset.category)">${categoryInfo.icon} ${name}</li>`;
    }
    list.innerHTML = html;
}

// Helper to prevent XSS by escaping HTML
function escapeHTML(str) {
    if (!str) return "";
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

function renderProductsPage(reset = false) {
    const container = document.getElementById('products-grid');
    const titleEl = document.getElementById('page-title');
    const loadMoreBtn = document.getElementById('load-more-btn');
    if (!container || !titleEl) return;

    if (reset) {
        productsOffset = 0;
        container.innerHTML = '';
        const params = new URLSearchParams(window.location.search);
        const categoryFilter = params.get('category');
        const rawSearchQ = params.get('q');
        const searchQ = rawSearchQ ? rawSearchQ.toLowerCase().trim() : null;
        
        filteredProducts = [];
        if (categoryFilter && categoryData[categoryFilter]) {
            titleEl.innerHTML = `${categoryData[categoryFilter].icon} <span class="highlight">${escapeHTML(categoryFilter)}</span>`;
            categoryData[categoryFilter].items.forEach(item => {
                filteredProducts.push({ ...item, category: categoryFilter });
            });
        } else {
            titleEl.innerHTML = `All <span class="highlight">Products</span>`;
            for (const [cat, data] of Object.entries(categoryData)) {
                data.items.forEach(item => {
                    filteredProducts.push({ ...item, category: cat });
                });
            }
        }

        if (searchQ) {
            filteredProducts = filteredProducts.filter(p => p.name.toLowerCase().includes(searchQ));
            titleEl.innerHTML = `Search results for "<span class="highlight">${escapeHTML(rawSearchQ)}</span>"`;
        }
    }

    const nextBatch = filteredProducts.slice(productsOffset, productsOffset + productsLimit);
    
    // Helper to safely escape strings for inline HTML attributes and JS function calls
    const safeStr = (str) => {
        if (!str) return '';
        return String(str).replace(/'/g, "\\'").replace(/"/g, '&quot;');
    };

    const newHtml = nextBatch.map((product, index) => {
        const color = getCategoryColor(product.category);
        const imageSrc = product.localImagePath || `https://via.placeholder.com/400x400.png?text=${encodeURIComponent(product.name)}`;
        const fullImageSrc = product.localImagePath
            ? imageSrc
            : `https://via.placeholder.com/1200x1200.png?text=${encodeURIComponent(product.name)}`;
        
        // Priority for the first 4 items in the very first load
        const priorityAttr = (productsOffset === productsLimit && index < 4) ? 'fetchpriority="high"' : '';

        return `
            <div class="card reveal" style="animation-delay: ${(index % productsLimit) * 0.05}s;">
                <div class="card-image">
                    <a href="javascript:void(0)" onclick="openLightbox(event, '${safeStr(fullImageSrc)}')">
                        <img src="${imageSrc}" alt="${safeStr(product.name)}" width="400" height="400" loading="lazy" ${priorityAttr} onerror="this.onerror=null; this.src='https://via.placeholder.com/400x400.png?text=Image+Not+Found'">
                    </a>
                </div>
                <div class="card-content">
                    <div style="font-size:0.75rem; color:${color}; font-weight:700;">${product.category}</div>
                    <h3 class="card-title">${product.name}</h3>
                    <div class="card-price">GH₵ ${typeof product.price === 'number' && !isNaN(product.price) ? product.price.toFixed(2) : '0.00'}</div>
                    <div style="display: flex; flex-direction: column; gap: 8px;">
                        <button class="btn-sm btn-add" onclick="addToCart('${safeStr(product.id || '')}', '${safeStr(product.name)}', ${product.price}, '${safeStr(product.category)}', '${safeStr(fullImageSrc)}')">
                            🛒 Add to Cart
                        </button>
                        <button class="btn-sm" onclick="quickOrderWhatsApp('${safeStr(product.id || '')}', '${safeStr(product.name)}', ${product.price}, '${safeStr(product.category)}', '${safeStr(fullImageSrc)}')" style="background: var(--success); color: white; border: none;">
                            💬 Order Now
                        </button>
                        <button class="btn-sm" onclick="window.open('${safeStr(imageSrc)}','_blank')" style="border:1px solid var(--border);">🔍 View</button>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    container.insertAdjacentHTML('beforeend', newHtml);
    productsOffset += productsLimit;

    if (loadMoreBtn) {
        loadMoreBtn.style.display = productsOffset < filteredProducts.length ? 'block' : 'none';
    }
}

function loadMoreProducts() {
    renderProductsPage(false);
}

function quickOrderWhatsApp(id, name, price, category, imageUrl) {
    const activeNumber = "233554411907";
    
    // Construct absolute URLs robustly
    const getAbsoluteUrl = (relPath) => {
        if (!relPath) return '';
        if (/^https?:\/\//i.test(relPath)) return relPath;
        return new URL(relPath, window.location.href).href;
    };

    const imgLink = getAbsoluteUrl(imageUrl);
    const viewLink = getAbsoluteUrl(`products.html?category=${encodeURIComponent(category)}&q=${encodeURIComponent(name)}`);

    let msg = `*NEW ORDER: ${name}*\n`;
    msg += `--------------------------------\n`;
    msg += `📁 *Category:* ${category}\n`;
    if (id) msg += `🔖 *ID:* ${id}\n`;
    msg += `💰 *PRICE:* GH₵ ${typeof price === 'number' && !isNaN(price) ? price.toFixed(2) : '0.00'}\n`;
    msg += `--------------------------------\n`;
    msg += `🔢 *QUANTITY:* 1\n`;
    msg += `🔗 *View Product:* ${viewLink}\n`;
    if (imgLink) msg += `🖼️ *Image:* ${imgLink}\n\n`;
    msg += `Please confirm availability and delivery options.`;

    const whatsappUrl = `https://api.whatsapp.com/send?phone=${activeNumber}&text=${encodeURIComponent(msg)}`;
    window.open(whatsappUrl, '_blank');
}

function addToCart(id, name, price, category, imageUrl) {
    const existing = id ? cart.find(i => i.id === id) : cart.find(i => i.name === name && i.category === category);
    if (existing) existing.qty++;
    else cart.push({ id: id || null, name, price: typeof price === 'number' && !isNaN(price) ? price : 0, category, qty: 1, image: imageUrl });
    localStorage.setItem('koojoo_cart', JSON.stringify(cart));
    updateCartCount();
}

function setupCartUI() {
    const overlay = document.createElement('div');
    overlay.className = 'cart-overlay';
    overlay.innerHTML = `<div class="cart-sidebar">
        <div class="cart-header"><h3>Cart</h3><button onclick="toggleCart()">&times;</button></div>
        <div class="cart-items" id="cartItemsContainer"></div>
        <div class="cart-footer">
            <div class="cart-total"><span>Total:</span><span id="cartTotalValue">GH₵ 0.00</span></div>
            <button class="btn-checkout" onclick="checkoutWhatsApp()">💬 Order Preview on WhatsApp</button>
        </div>
    </div>`;
    document.body.appendChild(overlay);
}

function toggleCart() {
    document.querySelector('.cart-overlay').classList.toggle('open');
    if (document.querySelector('.cart-overlay').classList.contains('open')) renderCartItems();
}

// Lightbox helper
function openLightbox(event, imgUrl) {
    event.preventDefault();
    let overlay = document.getElementById('lightboxOverlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'lightboxOverlay';
        overlay.style.cssText = `position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(0,0,0,0.92);display:flex;align-items:center;justify-content:center;z-index:3000;cursor:zoom-out;backdrop-filter:blur(10px);`;
        overlay.addEventListener('click', () => overlay.remove());
        const img = document.createElement('img');
        img.id = 'lightboxImage';
        img.style.cssText = `max-width:90vw;max-height:90vh;filter:contrast(1.05) brightness(1.02) saturate(1.1);transition:transform 0.3s;cursor:zoom-in;image-rendering:-webkit-optimize-contrast;image-rendering:crisp-edges;box-shadow:0 0 50px rgba(0,0,0,0.8);border-radius:8px;`;
        img.addEventListener('click', (e) => {
            e.stopPropagation();
            img.style.transform = img.style.transform === 'scale(1.5)' ? 'scale(1)' : 'scale(1.5)';
        });
        overlay.appendChild(img);
        document.body.appendChild(overlay);
    }
    const lbImg = document.getElementById('lightboxImage');
    if (lbImg) lbImg.src = imgUrl;
}


function updateCartCount() {
    const total = cart.reduce((acc, i) => acc + i.qty, 0);
    const badge = document.querySelector('.cart-count');
    if (badge) {
        badge.innerText = total;
        badge.style.display = total > 0 ? 'flex' : 'none';
    }
}

function renderCartItems() {
    const container = document.getElementById('cartItemsContainer');
    let total = 0;
    container.innerHTML = cart.map((item, index) => {
        total += item.price * item.qty;
        return `<div class="cart-item">
            <div class="cart-item-details">
                <div class="cart-item-title">${item.name}</div>
                <div class="cart-item-price">GH₵ ${item.price.toFixed(2)}</div>
                <div class="cart-controls">
                    <button onclick="updateQty(${index}, -1)">-</button>
                    <span>${item.qty}</span>
                    <button onclick="updateQty(${index}, 1)">+</button>
                </div>
            </div>
        </div>`;
    }).join('');
    document.getElementById('cartTotalValue').innerText = `GH₵ ${total.toFixed(2)}`;
}

function updateQty(index, change) {
    cart[index].qty += change;
    if (cart[index].qty <= 0) cart.splice(index, 1);
    localStorage.setItem('koojoo_cart', JSON.stringify(cart));
    renderCartItems();
    updateCartCount();
}

function checkoutWhatsApp() {
    if (cart.length === 0) return alert("Your cart is empty!");
    
    const activeNumber = "233554411907";
    // Show the first item's image as the main preview for the whole order
    let msg = `${cart[0].image}\n\n`;
    msg += `*🛒 MULTI-ITEM ORDER FROM KOOJOO*\n`;
    msg += `--------------------------------\n\n`;
    let total = 0;
    cart.forEach(i => {
        const subtotal = i.price * i.qty;
        msg += `📦 *ITEM:* ${i.name}\n`;
        msg += `🔢 *QUANTITY:* ${i.qty}\n`;
        msg += `💰 *SUBTOTAL:* GH₵ ${subtotal.toFixed(2)}\n\n`;
        total += subtotal;
    });
    msg += `--------------------------------\n`;
    msg += `✅ *TOTAL: GH₵ ${total.toFixed(2)}*\n\n`;
    msg += `I am ready to proceed with this order.`;
    
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${activeNumber}&text=${encodeURIComponent(msg)}`;
    window.open(whatsappUrl, '_blank');
}

function setupSearch() {
    const input = document.getElementById('masterSearch');
    const results = document.getElementById('searchResults');
    const flatData = [];
    for (const cat in categoryData) {
        categoryData[cat].items.forEach(i => flatData.push({ ...i, category: cat }));
    }
    input.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase().trim();
        if (term.length < 2) return results.classList.remove('active');
        const matches = flatData.filter(i => (i.name + i.category).toLowerCase().includes(term)).slice(0, 10);
        // Clicking a search result opens the products view filtered to that product (new tab)
        results.innerHTML = matches.map(m => `
            <div class="search-result-item" onclick="window.location.href='products.html?category=${encodeURIComponent(m.category)}&q=${encodeURIComponent(m.name)}'">
                <div><strong>${m.name}</strong> <small>${m.category}</small></div>
                <span>GH₵${m.price}</span>
            </div>
        `).join('');
        results.classList.add('active');
    });
}

function renderHomeCategories() {
    const container = document.getElementById('home-categories');
    if (!container) return;
    const cats = Object.keys(categoryData); // Show ALL categories, not just 12
    container.innerHTML = cats.map(cat => {
        const items = categoryData[cat].items;
        const img = items[0]?.localImagePath || `https://via.placeholder.com/400/400?text=${encodeURIComponent(cat)}`;
        return `
        <div class="card reveal" onclick="window.location.href='products.html?category=${encodeURIComponent(cat)}'" style="cursor:pointer;">
            <div class="card-image">
                <img src="${img}" alt="${cat}" width="400" height="400" loading="lazy" onerror="this.src='https://via.placeholder.com/400/400?text=${encodeURIComponent(cat)}'">
            </div>
            <div class="card-content" style="text-align:center;">
                <h3 style="color:var(--primary);">${cat}</h3>
                <p style="color:#888;">${items.length} Products</p>
            </div>
        </div>
    `}).join('');
}
