// ============================================
// DOLCINO - APP.JS FONCTIONNEL
// Version garantie sans erreur de syntaxe
// ============================================

console.log("=== DOLCINO JS DÉMARRÉ ===");

// Variables
let products = [];
let cart = [];
let currentCategory = 'all';

// ============================================
// 1. FONCTIONS DE BASE (GARANTIES)
// ============================================

function scrollToProductsAndShowAll() {
    console.log("Fonction scroll appelée");
    showCategory('all');
    const section = document.getElementById('products');
    if (section) {
        setTimeout(() => {
            section.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    }
}

function showCategoryWithScroll(category) {
    console.log("Navigation vers:", category);
    showCategory(category);
    const section = document.getElementById('products');
    if (section) {
        setTimeout(() => {
            section.scrollIntoView({ behavior: 'smooth' });
        }, 50);
    }
}

function showCategory(category) {
    console.log("Affichage catégorie:", category);
    currentCategory = category;
    
    // Mettre à jour les boutons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
        const text = btn.textContent.toLowerCase();
        if (category === 'all' && text.includes('tous')) btn.classList.add('active');
        if (category === 'anniversaire' && text.includes('anniversaire')) btn.classList.add('active');
        if (category === 'mariage' && text.includes('mariage')) btn.classList.add('active');
        if (category === 'quotidien' && text.includes('quotidien')) btn.classList.add('active');
    });
    
    // Afficher/masquer les produits
    document.querySelectorAll('.product-card').forEach(card => {
        if (category === 'all' || card.dataset.category === category) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

function toggleCart() {
    console.log("Panier toggle");
    const overlay = document.getElementById('cart-overlay');
    const sidebar = document.getElementById('cart-sidebar');
    if (!overlay || !sidebar) return;
    
    if (sidebar.classList.contains('active')) {
        sidebar.classList.remove('active');
        setTimeout(() => { overlay.style.display = 'none'; }, 400);
    } else {
        overlay.style.display = 'block';
        setTimeout(() => { sidebar.classList.add('active'); }, 10);
    }
}

function callNow() {
    if (confirm('Appeler Dolcino au 20 90 15 96 ?')) {
        window.open('tel:+21620901596');
    }
}

// ============================================
// 2. PRODUITS
// ============================================

function createDefaultProducts() {
    return [
        {
            id: 1,
            name: "Gâteau Chocolat Fondant",
            price: "45.00 DT",
            category: "anniversaire",
            image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
            description: "Gâteau au chocolat belge avec cœur fondant"
        },
        {
            id: 2,
            name: "Gâteau de Mariage Classique",
            price: "120.00 DT",
            category: "mariage",
            image: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
            description: "Élégant gâteau à étages pour mariage"
        },
       // Dans createDefaultProducts(), modifiez le 3ème produit :
{
    id: 3,
    name: "Gâteau Carotte Quotidien",
    price: "25.00 DT",
    category: "quotidien",
    // REMPLACEZ cette ligne :
    // image: "https://images.unsplash.com/photo-1596223575327-99a5d1b5c58e?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
    // PAR :
    image: "https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
    description: "Parfait pour le goûter familial"
}
    ];
}

function displayProducts() {
    console.log("Affichage des produits");
    
    const container = document.getElementById('products-container');
    if (!container) {
        console.error("ERREUR: products-container non trouvé");
        return;
    }
    
    // Créer produits si vide
    if (products.length === 0) {
        products = createDefaultProducts();
    }
    
    // Générer HTML
    let html = '';
    products.forEach((product, index) => {
        let badge = 'badge-anniversaire';
        let catName = 'Anniversaire';
        
        if (product.category === 'mariage') {
            badge = 'badge-mariage';
            catName = 'Mariage';
        } else if (product.category === 'quotidien') {
            badge = 'badge-quotidien';
            catName = 'Quotidien';
        }
        
        html += `
        <div class="product-card" data-category="${product.category}" data-id="${product.id}">
            <div class="product-badge ${badge}">${catName}</div>
            <div class="image-container product-image-container">
                <img src="${product.image}" alt="${product.name}" class="product-img">
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
    
    // Afficher tous les produits
    setTimeout(() => {
        showCategory('all');
        console.log(products.length + " produits affichés");
    }, 100);
}

function addToCart(productId) {
    console.log("Ajout au panier:", productId);
    const countElement = document.getElementById('cart-count');
    if (countElement) {
        const current = parseInt(countElement.textContent) || 0;
        countElement.textContent = current + 1;
    }
    alert("Produit ajouté au panier !");
}

// ============================================
// 3. INITIALISATION
// ============================================

function initializeApp() {
    console.log("Initialisation Dolcino...");
    
    // Afficher produits
    displayProducts();
    
    // Initialiser panier
    const countElement = document.getElementById('cart-count');
    if (countElement) {
        countElement.textContent = '0';
    }
    
    console.log("✅ Dolcino prêt !");
}

// ============================================
// 4. DÉMARRAGE
// ============================================

// Vérifier si le DOM est déjà chargé
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    // DOM déjà chargé
    initializeApp();
}

// FIN DU FICHIER - PAS D'ERREUR DE SYNTAXE
