// GENERATED CATEGORY DATA - FINAL PROFESSIONAL SYNC
const categoryNames = [
    'Agriculture', 'Art Prints', 'Business Cards', 'Automotive', 'Books & Booklets',
    'Flyers & Brochures', 'Banners & Posters', 'Campaign', 'Catering', 'Certificates & Awards',
    'Church Materials', 'Cleaning', 'Construction', 'Corporate Branding', 'Custom Gifts',
    'Eco Friendly', 'Ecommerce', 'Education', 'Event Materials', 'Financial',
    'Hotel', 'Industrial', 'Large Format', 'Photography', 'Wedding Stationery'
];

function randomPrice(min, max) { return parseFloat((Math.random() * (max - min) + min).toFixed(2)); }

const categoryIcons = {
    'Agriculture': '🌾', 'Art Prints': '🖼️', 'Automotive': '🚗', 'Business Cards': '💼',
    'Flyers & Brochures': '📄', 'Banners & Posters': '📣', 'Campaign': '🗳️', 'Catering': '🍽️',
    'Certificates & Awards': '🎖️', 'Church Materials': '⛪', 'Cleaning': '🧹', 'Construction': '🏗️',
    'Corporate Branding': '🏢', 'Custom Gifts': '🎁', 'Eco Friendly': '🌿', 'Ecommerce': '🛒',
    'Education': '📚', 'Event Materials': '🎉', 'Financial': '💰', 'Hotel': '🏨',
    'Industrial': '⚙️', 'Large Format': '📐', 'Photography': '📷', 'Wedding Stationery': '💌'
};

const colorPalette = {
    'Agriculture': '#3AB795', 'Art Prints': '#F4A261', 'Automotive': '#2A9D8F', 'Business Cards': '#FFD166',
    'Flyers & Brochures': '#06D6A0', 'Banners & Posters': '#118AB2', 'Campaign': '#FF6B6B', 'Catering': '#FF9500',
    'Certificates & Awards': '#4D96FF', 'Church Materials': '#9B59B6', 'Cleaning': '#3498DB', 'Construction': '#E67E22',
    'Corporate Branding': '#1ABC9C', 'Custom Gifts': '#E91E63', 'Eco Friendly': '#27AE60', 'Ecommerce': '#8E44AD',
    'Education': '#2980B9', 'Event Materials': '#E74C3C', 'Financial': '#2ECC71', 'Hotel': '#F39C12',
    'Industrial': '#7F8C8D', 'Large Format': '#16A085', 'Photography': '#9B59B6', 'Wedding Stationery': '#FFB4A2'
};

const categoryData = {};

function createCategory(catName, folderName, prefix, count, icon, priceMin, priceMax) {
    const items = [];
    for (let i = 1; i <= count; i++) {
        items.push({
            id: `${catName.replace(/\s+/g, '_')}_${i}`,
            name: `${catName} Design ${i}`,
            price: randomPrice(priceMin, priceMax),
            localImagePath: `images/products/${folderName}/${prefix}${i}.jpg`
        });
    }
    categoryData[catName] = { icon: icon, items: items };
}

// Map categories with VERIFIED SYNCED prefixes and counts
try {
    createCategory('Agriculture', 'Agriculture', 'agric', 12, '🌾', 15, 120);
    createCategory('Art Prints', 'Art Prints', 'artp', 20, '🖼️', 20, 220);
    createCategory('Automotive', 'Automotive', 'autom', 10, '🚗', 25, 250);
    createCategory('Baby Kids', 'Baby Kids', 'baby', 2, '👶', 10, 150);
    createCategory('Banners & Posters', 'Banners Posters', 'banne', 12, '📣', 40, 300);
    createCategory('Beauty Salon', 'Beauty Salon', 'beaut', 21, '💇‍♀️', 15, 200);
    createCategory('Books & Booklets', 'Books Booklets', 'books', 18, '📚', 20, 180);
    createCategory('Business Cards', 'Business Cards', 'busin', 23, '💼', 50, 150);
    createCategory('Campaign', 'Campaign', 'campa', 18, '🗳️', 10, 150);
    createCategory('Catering', 'Catering', 'cater', 41, '🍽️', 40, 250);
    createCategory('Certificates & Awards', 'Certificates Awards', 'certi', 17, '🎖️', 30, 180);
    createCategory('Church Materials', 'Church Materials', 'churc', 28, '⛪', 15, 150);
    createCategory('Cleaning', 'Cleaning', 'clean', 4, '🧹', 20, 120);
    createCategory('Construction', 'Construction', 'const', 14, '🏗️', 30, 200);
    createCategory('Corporate Branding', 'Corporate Branding', 'corpo', 18, '🏢', 50, 300);
    createCategory('Custom Gifts', 'Custom Gifts', 'custo', 11, '🎁', 25, 180);
    createCategory('Eco Friendly', 'Eco Friendly', 'ecof', 8, '🌿', 20, 150);
    createCategory('Ecommerce', 'Ecommerce', 'ecomm', 15, '🛒', 25, 200);
    createCategory('Education', 'Education', 'educa', 8, '📚', 20, 150);
    createCategory('Event Materials', 'Event Materials', 'event', 16, '🎉', 25, 180);
    createCategory('Financial', 'Financial', 'finan', 9, '💰', 30, 200);
    createCategory('Flyers & Brochures', 'Flyers Brochures', 'flyer', 28, '📄', 25, 250);
    createCategory('Hotel', 'Hotel', 'hotel', 9, '🏨', 40, 220);
    createCategory('Industrial', 'Industrial', 'indus', 14, '⚙️', 35, 200);
    createCategory('Large Format', 'Large Format', 'large', 3, '📐', 80, 500);
    createCategory('Photography', 'Photography', 'photo', 9, '📷', 30, 200);
    createCategory('Wedding Stationery', 'Wedding Stationery', 'weddi', 24, '💌', 40, 300);
} catch (e) {
    console.error("Error mapping categories:", e);
}

function getCategoryColor(cat) { return colorPalette[cat] || '#00E5FF'; }
