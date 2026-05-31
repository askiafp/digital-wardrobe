// Color System
export const colors = {
  background: '#FAFAF8',
  surface: '#F5F2EE',
  surfaceAlt: '#EDE9E3',
  border: '#E5E0D8',
  heading: '#1A1714',
  body: '#5A5450',
  muted: '#9E9890',
  accent: '#C9A09A',
};

// Wardrobe Categories
export const categories = ['All', 'Tops', 'Bottoms', 'Outerwear', 'Shoes', 'Bags', 'Accessories'];

export const initialWardrobeData = [
  { 
    id: 1, 
    name: 'Long Strips Black & Grey', 
    category: 'Tops', 
    color: '#FFFFFF', 
    image: '/images/long-strips-top.png', 
    lastWorn: '2 days ago', 
    style: 'minimalist' 
  },
  { 
    id: 2, 
    name: 'Polkadot Top Black & White', 
    category: 'Tops', 
    color: '#F5E6D3', 
    image: '/images/polkadot-top.png', 
    lastWorn: '5 days ago', 
    style: 'minimalist' 
  },
  { 
    id: 3, 
    name: 'Cutbray Jeans', 
    category: 'Bottoms', 
    color: '#1A1714', 
    image: '/images/cutbray-jeans.png', 
    lastWorn: '3 days ago', 
    style: 'formal' 
  },
  { 
    id: 4, 
    name: 'Short Skirt Jeans', 
    category: 'Bottoms', 
    color: '#C4A080', 
    image: '/images/short-skirt.png', 
    lastWorn: '1 week ago', 
    style: 'minimalist' 
  },
  { 
    id: 5, 
    name: 'Grey Jacket', 
    category: 'Outerwear', 
    color: '#D4B5A0', 
    image: '/images/grey-jacket.png', 
    lastWorn: '6 days ago', 
    style: 'minimalist' 
  },
  { 
    id: 6, 
    name: 'White Boots', 
    category: 'Shoes', 
    color: '#FFFFFF', 
    image: '/images/white-boots.png', 
    lastWorn: '2 days ago', 
    style: 'casual' 
  },
  { 
    id: 7, 
    name: 'White Bag', 
    category: 'Bags', 
    color: '#6B4423', 
    image: '/images/white-bag.png', 
    lastWorn: '1 day ago', 
    style: 'formal' 
  },
  { 
    id: 8, 
    name: 'Broken White with Vest', 
    category: 'Tops', 
    color: '#6B4423', 
    image: '/images/broken-white-with-vest.png', 
    lastWorn: '1 day ago', 
    style: 'formal' 
  },
  { 
    id: 9, 
    name: 'Brown FLower Cut Out Belt', 
    category: 'Accessories', 
    color: '#6B4423', 
    image: '/images/brown-flower-cut-out-belt.png', 
    lastWorn: '1 day ago', 
    style: 'formal' 
  },
  { 
    id: 10, 
    name: 'Brown Long Skirt', 
    category: 'Bottoms', 
    color: '#6B4423', 
    image: '/images/brown-long-skirt.png', 
    lastWorn: '1 day ago', 
    style: 'formal' 
  },
  { 
    id: 11, 
    name: 'Brown Boots', 
    category: 'Shoes', 
    color: '#6B4423', 
    image: '/images/brown-boots.png', 
    lastWorn: '1 day ago', 
    style: 'formal' 
  },
  { 
    id: 12, 
    name: 'Brown Plaid Mini Skirt', 
    category: 'Bottoms', 
    color: '#6B4423', 
    image: '/images/brown-plaid-mini-skirt.png', 
    lastWorn: '1 day ago', 
    style: 'formal' 
  },
  { 
    id: 13, 
    name: 'Coquette Lace Trim Mary Jane Flats', 
    category: 'Shoes', 
    color: '#6B4423', 
    image: '/images/coquette-lace-trim-mary-jane-flats.png', 
    lastWorn: '1 day ago', 
    style: 'formal' 
  },
  { 
    id: 14, 
    name: 'ESQ Brown Bag', 
    category: 'Bags', 
    color: '#6B4423', 
    image: '/images/ESQ-brown-bag.png', 
    lastWorn: '1 day ago', 
    style: 'formal' 
  },
  { 
    id: 15, 
    name: 'Love Gold Necklace', 
    category: 'Accessories', 
    color: '#6B4423', 
    image: '/images/love-necklace-gold.png', 
    lastWorn: '1 day ago', 
    style: 'formal' 
  },
  { 
    id: 16, 
    name: 'Navy Star Pattern Knit Sweater', 
    category: 'Outerwear', 
    color: '#6B4423', 
    image: '/images/navy-star-pattern-knit-sweater.png', 
    lastWorn: '1 day ago', 
    style: 'formal' 
  },
    { 
    id: 17, 
    name: 'Plaid Pink Top', 
    category: 'Tops', 
    color: '#6B4423', 
    image: '/images/plaid-pink-top.png', 
    lastWorn: '1 day ago', 
    style: 'formal' 
  },
];

// Analytics Data
export const analyticsData = [
  { day: 'Mon', worn: 4 },
  { day: 'Tue', worn: 3 },
  { day: 'Wed', worn: 5 },
  { day: 'Thu', worn: 3 },
  { day: 'Fri', worn: 6 },
  { day: 'Sat', worn: 2 },
  { day: 'Sun', worn: 2 },
];

// Days of Week
export const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

// Style Types
export const styleTypes = ['casual', 'formal', 'minimalist', 'sporty', 'streetwear'];