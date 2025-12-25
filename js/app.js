
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
            if (!container) return;
            
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
            currentCategory = category;
            const productCards = document.querySelectorAll('.product-card');
            const filterButtons = document.querySelectorAll('.filter-btn');
            
            filterButtons.forEach(btn => {
                btn.classList.remove('active');
                const btnText = btn.textContent.toLowerCase();
                
                if (category === 'all' && btnText.includes('tous')) {
                    btn.classList.add('active');
                } else if (category === 'anniversaire' && btnText.includes('anniversaire')) {
                    btn.classList.add('active');
                } else if (category === 'mariage' && btnText.includes('mariage')) {
                    btn.classList.add('active');
                } else if (category === 'quotidien' && btnText.includes('quotidien')) {
                    btn.classList.add('active');
                }
            });
            
            productCards.forEach(card => {
                if (category === 'all' || card.dataset.category === category) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        }

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
            document.querySelector('.checkout-btn').onclick = checkout;
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
            
            if (sidebar.classList.contains('active')) {
                sidebar.classList.remove('active');
                setTimeout(() => overlay.style.display = 'none', 400);
            } else {
                updateCart();
                overlay.style.display = 'block';
                setTimeout(() => sidebar.classList.add('active'), 10);
            }
        }

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
            orderSummary.innerHTML = '';
            
            cart.forEach(item => {
                const priceMatch = item.price.match(/(\d+\.?\d*)/);
                const itemTotal = (priceMatch ? parseFloat(priceMatch[0]) : 0) * item.quantity;
                const summaryItem = document.createElement('div');
                summaryItem.className = 'summary-item';
                summaryItem.innerHTML = `
                    <span>${item.quantity} × ${item.name}</span>
                    <span>${itemTotal.toFixed(2)} DT</span>
                `;
                orderSummary.appendChild(summaryItem);
            });
            
            document.getElementById('order-total').textContent = total.toFixed(2) + ' DT';
            document.getElementById('order-number').textContent = orderNumber;
            
            document.getElementById('order-form-modal').style.display = 'flex';
        }

        function closeOrderForm() {
            document.getElementById('order-form-modal').style.display = 'none';
        }

        function showConfirmationModal() {
            const orderNumber = document.getElementById('order-number').textContent;
            document.getElementById('confirmation-number').textContent = orderNumber;
            
            closeOrderForm();
            document.getElementById('confirmation-modal').style.display = 'flex';
            
            const order = {
                orderNumber: orderNumber,
                date: new Date().toISOString(),
                items: [...cart],
                total: cart.reduce((sum, item) => {
                    const priceMatch = item.price.match(/(\d+\.?\d*)/);
                    return sum + (priceMatch ? parseFloat(priceMatch[0]) * item.quantity : 0);
                }, 0),
                name: document.getElementById('customer-name').value || 'Client',
                phone: document.getElementById('customer-phone').value || '',
                email: document.getElementById('customer-email').value || '',
                address: document.getElementById('customer-address').value || '',
                notes: document.getElementById('customer-notes').value || 'Aucune note',
                paymentMethod: document.querySelector('input[name="payment"]:checked').value || 'cash',
                status: 'En attente'
            };
            
            let orders = JSON.parse(localStorage.getItem('delices-commandes')) || [];
            orders.push(order);
            localStorage.setItem('delices-commandes', JSON.stringify(orders));
            
            cart = [];
            localStorage.setItem('delices-cart', JSON.stringify(cart));
            updateCart();
            
            showNotification(`🎉 Commande ${orderNumber} confirmée !`);
            
            document.getElementById('customer-form').reset();
        }

        function closeConfirmationModal() {
            document.getElementById('confirmation-modal').style.display = 'none';
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

        function callNow() {
            if (confirm('Appeler Dolcino au 20 90 15 96 ?')) {
                window.open('tel:+21620901596');
            }
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
        // INITIALISATION
        // ============================================
        document.addEventListener('DOMContentLoaded', function() {
            console.log("🚀 Dolcino - Site chargé");
            
            displayProducts();
            updateCart();
            setupSmartRefresh();
            
            document.getElementById('customer-form').addEventListener('submit', function(e) {
                e.preventDefault();
                showConfirmationModal();
            });
            
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
            
            setTimeout(() => {
                if (!localStorage.getItem('welcome-shown')) {
                    showNotification('🎂 Bienvenue chez Dolcino !');
                    localStorage.setItem('welcome-shown', 'true');
                }
            }, 1000);
        });



