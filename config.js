// config.js - FICHIER COMMUN POUR TOUTES LES PAGES
const DOLCINO_CONFIG = {
    // CLÉS DE STOCKAGE (DOIVENT ÊTRE IDENTIQUES PARTTOUT)
    STORAGE_KEYS: {
        PRODUCTS: 'dolcino-gateaux',      // PRODUITS
        CART: 'dolcino-cart',            // PANIER
        ORDERS: 'dolcino-orders',        // COMMANDES
        SETTINGS: 'dolcino-settings'     // PARAMÈTRES
    },
    
    // CATÉGORIES
    CATEGORIES: {
        ANNIVERSAIRE: 'anniversaire',
        MARIAGE: 'mariage',
        QUOTIDIEN: 'quotidien'
    },
    
    // IMAGES PAR DÉFAUT
    DEFAULT_IMAGES: {
        anniversaire: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="400" height="300" fill="%23FFD166"/><text x="200" y="150" font-family="Arial" font-size="20" fill="%238B4513" text-anchor="middle">🎂 Anniversaire</text></svg>',
        mariage: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="400" height="300" fill="%23FFD166"/><text x="200" y="150" font-family="Arial" font-size="20" fill="%238B4513" text-anchor="middle">💒 Mariage</text></svg>',
        quotidien: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="400" height="300" fill="%23FFD166"/><text x="200" y="150" font-family="Arial" font-size="20" fill="%238B4513" text-anchor="middle">🍰 Quotidien</text></svg>'
    },
    
    // CONTACT
    CONTACT: {
        PHONE: '+216 20 90 15 96',
        WHATSAPP: 'https://wa.me/21620901596',
        EMAIL: 'contact@dolcino.com'
    }
};

// Fonction de synchronisation universelle
function synchronizeData() {
    const mainKey = DOLCINO_CONFIG.STORAGE_KEYS.PRODUCTS;
    const stored = localStorage.getItem(mainKey);
    
    if (!stored) {
        // Chercher dans les anciennes clés
        const oldKeys = ['delices-gateaux', 'sarsel-products', 'gateaux'];
        for (const key of oldKeys) {
            const oldData = localStorage.getItem(key);
            if (oldData) {
                localStorage.setItem(mainKey, oldData);
                console.log(`🔄 Données migrées de "${key}" vers "${mainKey}"`);
                break;
            }
        }
    }
    
    return JSON.parse(localStorage.getItem(mainKey) || '[]');
}

// Exporter pour utilisation
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { DOLCINO_CONFIG, synchronizeData };
}
