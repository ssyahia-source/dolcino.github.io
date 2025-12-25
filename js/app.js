// ============================================
// PROTECTION CONTRE LES ERREURS - CORRIGÉ POUR GITHUB
// ============================================

// FORÇAGE DES FONCTIONS GLOBALES POUR ÉVITER LES ERREURS
if (typeof window !== 'undefined') {
    // Fonctions temporaires jusqu'à ce que le vrai code charge
    window.scrollToProductsAndShowAll = function() {
        console.log("⏳ scrollToProductsAndShowAll - en attente du chargement...");
        setTimeout(function() {
            if (window._realScrollToProductsAndShowAll) {
                window._realScrollToProductsAndShowAll();
            } else {
                const productsSection = document.getElementById('products');
                if (productsSection) {
                    productsSection.scrollIntoView({ behavior: 'smooth' });
                }
            }
        }, 100);
    };

    window.showCategoryWithScroll = function(category) {
        console.log("⏳ showCategoryWithScroll - en attente du chargement...");
        setTimeout(function() {
            if (window._realShowCategoryWithScroll) {
                window._realShowCategoryWithScroll(category);
            }
        }, 100);
    };

    window.showCategory = function(category) {
        console.log("⏳ showCategory - en attente du chargement...");
        setTimeout(function() {
            if (window._realShowCategory) {
                window._realShowCategory(category);
            }
        }, 100);
    };

    window.toggleCart = function() {
        console.log("⏳ toggleCart - en attente du chargement...");
        setTimeout(function() {
            if (window._realToggleCart) {
                window._realToggleCart();
            }
        }, 100);
    };

    window.callNow = function() {
        if (confirm('Appeler Dolcino au 20 90 15 96 ?')) {
            window.open('tel:+21620901596');
        }
    };
}

// ============================================
// VARIABLES GLOBALES OPTIMISÉES
// ============================================
let products = [];
let cart = JSON.parse(localStorage.getItem('delices-cart')) || [];
let currentCategory = 'all';
let productsLoaded = false;
let productsHash = '';

// ============================================
// FONCTIONS DE NAVIGATION OPTIMISÉES
// ============================================
function scrollToProductsAndShowAll() {
    console.log("🎯 Défilement vers les produits...");
    
    showCategory('all');
    
    setTimeout(() => {
        const productsSection = document.getElementById('products');
        if (productsSection) {
            productsSection.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        }
    }, 100);
}

// Enregistrer la vraie fonction
window._realScrollToProductsAndShowAll = scrollToProductsAndShowAll;
window.scrollToProductsAndShowAll = scrollToProductsAndShowAll;

function showCategoryWithScroll(category) {
    showCategory(category);
    
    setTimeout(() => {
        const productsSection = document.getElementById('products');
        if (productsSection) {
            productsSection.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        }
    }, 50);
}

// Enregistrer la vraie fonction
window._realShowCategoryWithScroll = showCategoryWithScroll;
window.showCategoryWithScroll = showCategoryWithScroll;

// ============================================
// CHARGEMENT INTELLIGENT DES PRODUITS
// ============================================
function loadProducts() {
    if (productsLoaded) {
        const currentStored = localStorage.getItem('delices-gateaux');
        const newHash = currentStored ? btoa(currentStored).substring(0, 20) : '';
        
        if (newHash === productsHash) {
            console.log("📦 Utilisation du cache produits");
            return products;
        }
    }
    
    console.log("🔍 Chargement des produits...");
    
    const keys = ['delices-gateaux', 'sarsel-products', 'gateaux', 'products'];
    
    for (let key of keys) {
        const stored = localStorage.getItem(key);
        if (stored) {
            console.log(`✅ Trouvé avec clé: ${key}`);
            try {
                const newProducts = JSON.parse(stored);
                productsHash = btoa(stored).substring(0, 20);
                
                products = newProducts.map(product => {
                    return {
                        id: product.id || Date.now() + Math.random(),
                        name: product.name || 'Gâteau',
                        price: product.price || '0 DT',
                        category: product.category || 'quotidien',
                        image: product.image || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
                        description: product.description || 'Gâteau artisanal fait maison',
                        imageKey: product.imageKey
                    };
                });
                
                console.log(`${products.length} produits chargés`);
                productsLoaded = true;
                return products;
            } catch (e) {
                console.error(`❌ Erreur parsing ${key}:`, e);
            }
        }
    }
    
    if (products.length === 0) {
        console.log("⚠️ Aucun produit trouvé - produits par défaut");
        products = [
            {
                id: 1,
                name: "Gâteau Démo Chocolat",
                price: "49.99 DT",
                category: "anniversaire",
                image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
                description: "Gâteau artisanal au chocolat belge"
            }
        ];
        productsLoaded = true;
    }
    
    return products;
}

// ============================================
// AFFICHAGE DES PRODUITS OPTIMISÉ
// ============================================
function displayProducts() {
    loadProducts();
    
    const container = document.getElementById('products-container');
    if (!container) {
        console.log("❌ products-container non trouvé");
        return;
    }
    
    if (products.length === 0) {
        container.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 50px;">
                <h3 style="color: #8B4513;">🍰 Aucun gâteau disponible</h3>
                <p style="margin: 20px 0;">Ajoutez des gâteaux depuis l'administration</p>
                <button onclick="window.location.href='admin-login.html'" 
                        style="background: #FF6B8B; color: white; padding: 12px 25px; border: none; border-radius: 8px; cursor: pointer;">
                    Aller à l'admin
                </button>
            </div>
        `;
        return;
    }
    
    let html = '';
    products.forEach((product, index) => {
        let badgeClass = 'badge-anniversaire';
        let categoryName = 'Anniversaire';
        
        if (product.category === 'mariage') {
            badgeClass = 'badge-mariage';
            categoryName = 'Mariage';
        } else if (product.category === 'quotidien') {
            badgeClass = 'badge-quotidien';
            categoryName = 'Quotidien';
        }
        
        let imageSrc = product.image;
        if (product.imageKey) {
            const imageData = localStorage.getItem(product.imageKey);
            if (imageData && imageData.startsWith('data:image')) {
                imageSrc = imageData;
            }
        }
        
        html += `
            <div class="product-card" data-category="${product.category}" data-id="${product.id}" style="animation-delay: ${index * 0.1}s">
                <div class="product-badge ${badgeClass}">${categoryName}</div>
                <div class="image-container product-image-container">
                    <img src="${imageSrc}" 
                         alt="${product.name}" 
                         class="product-img"
                         loading="lazy"
                         onerror="this.src='https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80'">
                </div>
                <div class="product-info">
                    <h3 class="product-title">${product.name}</h3>
                    <p class="product-desc">${product.description}</p>
                    <div class="product-meta">
                        <div class="product-price">${product.price}</div>
                        <button class="add-to-cart" onclick="addToCart(${product.id})">Ajouter</button>
                    </div>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
    showCategory(currentCategory);
}

// ============================================
// FONCTION PRINCIPALE D'AFFICHAGE CATÉGORIE
// ============================================



function showCategory(category) {
    console.log("🔘 Changement de catégorie:", category);
    currentCategory = category;
    
    const productCards = document.querySelectorAll('.product-card');
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    console.log("📊 Cartes trouvées:", productCards.length);
    console.log("📊 Boutons trouvés:", filterButtons.length);
    
    // 1. Gérer les boutons de filtre
    filterButtons.forEach(btn => {
        btn.classList.remove('active');
        const btnText = btn.textContent.toLowerCase();
        
        if (category === 'all' && btnText.includes('tous')) {
            btn.classList.add('active');
            console.log("✅ Bouton 'Tous' activé");
        } else if (category === 'anniversaire' && btnText.includes('anniversaire')) {
            btn.classList.add('active');
        } else if (category === 'mariage' && btnText.includes('mariage')) {
            btn.classList.add('active');
        } else if (category === 'quotidien' && btnText.includes('quotidien')) {
            btn.classList.add('active');
        }
    });
    
    // 2. Gérer l'affichage des produits
    let visibleCount = 0;
    productCards.forEach(card => {
        if (category === 'all' || card.dataset.category === category) {
            card.style.display = 'block';
            card.style.opacity = '1';
            card.style.visibility = 'visible';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });
    
    console.log("👁️ Produits visibles:", visibleCount + "/" + productCards.length);
    
    // 3. Si rien n'est visible, tout afficher (sécurité)
    if (visibleCount === 0 && productCards.length > 0) {
        console.log("⚠️ Rien visible - forçage de l'affichage");
        productCards.forEach(card => {
            card.style.display = 'block';
            card.style.opacity = '1';
            card.style.visibility = 'visible';
        });
    }
}

// Enregistrer la vraie fonction
window._realShowCategory = showCategory;
window.showCategory = showCategory;

// ============================================
// FONCTIONS DU PANIER OPTIMISÉES
// ============================================
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1,
            image: product.image,
            category: product.category
        });
    }
    
    localStorage.setItem('delices-cart', JSON.stringify(cart));
    updateCart();
    showNotification(`✅ ${product.name} ajouté au panier !`);
}

function updateCart() {
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    const cartCount = document.getElementById('cart-count');
    
    if (!cartItems || !cartTotal || !cartCount) {
        console.log("❌ Éléments du panier non trouvés");
        return;
    }
    
    cartItems.innerHTML = '';
    let total = 0;
    
    cart.forEach((item, index) => {
        const priceMatch = item.price.match(/(\d+\.?\d*)/);
        const numericPrice = priceMatch ? parseFloat(priceMatch[0]) : 0;
        const itemTotal = numericPrice * item.quantity;
        total += itemTotal;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-image">
                <img src="${item.image}" 
                     alt="${item.name}"
                     loading="lazy">
            </div>
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <div class="cart-item-price">${item.price}</div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn" onclick="updateQuantity(${index}, ${item.quantity - 1})">-</button>
                    <span class="quantity-value">${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${index}, ${item.quantity + 1})">+</button>
                </div>
            </div>
            <button class="remove-item" onclick="removeFromCart(${index})">✕</button>
        `;
        
        cartItems.appendChild(cartItem);
    });
    
    cartTotal.textContent = total.toFixed(2) + ' DT';
    cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div style="text-align: center; padding: 40px 20px; color: #666;">
                <div style="font-size: 3em; margin-bottom: 20px;">🍰</div>
                <h4>Votre panier est vide</h4>
                <p>Ajoutez des gâteaux pour commencer</p>
            </div>
        `;
    }
    
    // Ajouter l'événement au bouton "Passer la commande"
    const checkoutBtn = document.querySelector('.checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.onclick = checkout;
    }
}

function updateQuantity(itemIndex, newQuantity) {
    if (newQuantity < 1) {
        removeFromCart(itemIndex);
        return;
    }
    cart[itemIndex].quantity = newQuantity;
    localStorage.setItem('delices-cart', JSON.stringify(cart));
    updateCart();
}

function removeFromCart(index) {
    const itemName = cart[index].name;
    cart.splice(index, 1);
    localStorage.setItem('delices-cart', JSON.stringify(cart));
    updateCart();
    showNotification(`🗑️ ${itemName} retiré du panier`);
}

function toggleCart() {
    const overlay = document.getElementById('cart-overlay');
    const sidebar = document.getElementById('cart-sidebar');
    
    if (!overlay || !sidebar) {
        console.log("❌ Éléments du panier non trouvés");
        return;
    }
    
    if (sidebar.classList.contains('active')) {
        sidebar.classList.remove('active');
        setTimeout(() => overlay.style.display = 'none', 400);
    } else {
        updateCart();
        overlay.style.display = 'block';
        setTimeout(() => sidebar.classList.add('active'), 10);
    }
}

// Enregistrer la vraie fonction
window._realToggleCart = toggleCart;
window.toggleCart = toggleCart;

// ============================================
// FONCTION CHECKOUT (PASSER LA COMMANDE)
// ============================================
function checkout() {
    if (cart.length === 0) {
        showNotification('🛒 Votre panier est vide !');
        return;
    }
    
    const total = cart.reduce((sum, item) => {
        const priceMatch = item.price.match(/(\d+\.?\d*)/);
        return sum + (priceMatch ? parseFloat(priceMatch[0]) * item.quantity : 0);
    }, 0);
    
    const orderNumber = 'DL-' + Date.now().toString().slice(-6);
    
    const orderSummary = document.getElementById('order-summary-items');
    if (orderSummary) {
        orderSummary.innerHTML = '';
    }
    
    cart.forEach(item => {
        const priceMatch = item.price.match(/(\d+\.?\d*)/);
        const itemTotal = (priceMatch ? parseFloat(priceMatch[0]) : 0) * item.quantity;
        const summaryItem = document.createElement('div');
        summaryItem.className = 'summary-item';
        summaryItem.innerHTML = `
            <span>${item.quantity} × ${item.name}</span>
            <span>${itemTotal.toFixed(2)} DT</span>
        `;
        if (orderSummary) {
            orderSummary.appendChild(summaryItem);
        }
    });
    
    const orderTotalEl = document.getElementById('order-total');
    const orderNumberEl = document.getElementById('order-number');
    
    if (orderTotalEl) orderTotalEl.textContent = total.toFixed(2) + ' DT';
    if (orderNumberEl) orderNumberEl.textContent = orderNumber;
    
    const orderForm = document.getElementById('order-form-modal');
    if (orderForm) {
        orderForm.style.display = 'flex';
    }
}

function closeOrderForm() {
    const orderForm = document.getElementById('order-form-modal');
    if (orderForm) {
        orderForm.style.display = 'none';
    }
}

function showConfirmationModal() {
    const orderNumberEl = document.getElementById('order-number');
    const orderNumber = orderNumberEl ? orderNumberEl.textContent : 'DL-000000';
    
    const confirmationNumberEl = document.getElementById('confirmation-number');
    if (confirmationNumberEl) {
        confirmationNumberEl.textContent = orderNumber;
    }
    
    closeOrderForm();
    const confirmationModal = document.getElementById('confirmation-modal');
    if (confirmationModal) {
        confirmationModal.style.display = 'flex';
    }
    
    // Créer la commande
    const order = {
        orderNumber: orderNumber,
        date: new Date().toISOString(),
        items: [...cart],
        total: cart.reduce((sum, item) => {
            const priceMatch = item.price.match(/(\d+\.?\d*)/);
            return sum + (priceMatch ? parseFloat(priceMatch[0]) * item.quantity : 0);
        }, 0),
        name: document.getElementById('customer-name') ? document.getElementById('customer-name').value || 'Client' : 'Client',
        phone: document.getElementById('customer-phone') ? document.getElementById('customer-phone').value || '' : '',
        email: document.getElementById('customer-email') ? document.getElementById('customer-email').value || '' : '',
        address: document.getElementById('customer-address') ? document.getElementById('customer-address').value || '' : '',
        notes: document.getElementById('customer-notes') ? document.getElementById('customer-notes').value || 'Aucune note' : 'Aucune note',
        paymentMethod: document.querySelector('input[name="payment"]:checked') ? document.querySelector('input[name="payment"]:checked').value || 'cash' : 'cash',
        status: 'En attente'
    };
    
    let orders = JSON.parse(localStorage.getItem('delices-commandes')) || [];
    orders.push(order);
    localStorage.setItem('delices-commandes', JSON.stringify(orders));
    
    // Vider le panier
    cart = [];
    localStorage.setItem('delices-cart', JSON.stringify(cart));
    updateCart();
    
    showNotification(`🎉 Commande ${orderNumber} confirmée !`);
    
    // Réinitialiser le formulaire
    const customerForm = document.getElementById('customer-form');
    if (customerForm) {
        customerForm.reset();
    }
}

function closeConfirmationModal() {
    const confirmationModal = document.getElementById('confirmation-modal');
    if (confirmationModal) {
        confirmationModal.style.display = 'none';
    }
}

// ============================================
// FONCTIONS UTILITAIRES
// ============================================
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// ============================================
// RAFRAÎCHISSEMENT INTELLIGENT
// ============================================
function setupSmartRefresh() {
    console.log("🚀 Configuration du rafraîchissement intelligent");
    
    let lastUpdate = Date.now();
    let isRefreshing = false;
    
    const refreshIfNeeded = () => {
        if (isRefreshing) return;
        
        const now = Date.now();
        if (now - lastUpdate < 5000) return;
        
        isRefreshing = true;
        
        const storedProducts = localStorage.getItem('delices-gateaux');
        const storedHash = storedProducts ? btoa(storedProducts).substring(0, 20) : '';
        
        if (storedHash !== productsHash) {
            console.log("🔄 Changement détecté, mise à jour des produits");
            lastUpdate = now;
            productsLoaded = false;
            displayProducts();
        }
        
        isRefreshing = false;
    };
    
    window.addEventListener('storage', function(e) {
        if (e.key === 'delices-gateaux' || e.key === 'sarsel-products') {
            console.log("📦 Changement détecté dans localStorage");
            setTimeout(refreshIfNeeded, 500);
        }
    });
    
    document.addEventListener('visibilitychange', function() {
        if (!document.hidden) {
            console.log("👁️ Page redevenue visible");
            setTimeout(refreshIfNeeded, 1000);
        }
    });
    
    setInterval(refreshIfNeeded, 30000);
}

// ============================================
// INITIALISATION SÉCURISÉE
// ============================================
function initApp() {
    console.log("🚀 Dolcino - Initialisation de l'application");
    
    try {
        // Afficher les produits
        displayProducts();
        
        // Mettre à jour le panier
        updateCart();
        
        // Configurer le rafraîchissement intelligent
        setupSmartRefresh();
        
        // Gérer le formulaire de commande
        const customerForm = document.getElementById('customer-form');
        if (customerForm) {
            customerForm.addEventListener('submit', function(e) {
                e.preventDefault();
                showConfirmationModal();
            });
        }
        
        // Navigation fluide
        document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
        
        // Notification de bienvenue
        setTimeout(() => {
            if (!localStorage.getItem('welcome-shown')) {
                showNotification('🎂 Bienvenue chez Dolcino !');
                localStorage.setItem('welcome-shown', 'true');
            }
        }, 1000);
        
        console.log("✅ Application Dolcino initialisée avec succès");
        
    } catch (error) {
        console.error("❌ Erreur lors de l'initialisation:", error);
    }
}

// Démarrer l'application quand le DOM est prêt
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    // DOM déjà chargé
    initApp();
}
