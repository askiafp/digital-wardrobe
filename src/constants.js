// Color System
export const colors = {
  background: '#FAFAF8',
  surface: '#F5F2EE',
  surfaceAlt: '#EDE9E3',
  border: '#E5E0D8',
  heading: '#1A1714',
  body: '#5A5450',
  muted: '#9E9890',
  accent: '#800020',
};

// Wardrobe Categories
export const categories = ['All', 'Tops', 'Bottoms', 'Outerwear', 'Shoes', 'Bags', 'Accessories'];

export const initialWardrobeData = [
  { 
    id: 1, 
    name: 'Long Strips Black & Grey', 
    category: 'Tops', 
    color: '#4A4A4A', // Dark grey/charcoal for black & grey stripes
    image: '/images/long-strips-top.png', 
    lastWorn: '2 days ago', 
    style: 'casual' 
  },
  { 
    id: 2, 
    name: 'Polkadot Top Black & White', 
    category: 'Tops', 
    color: '#E8E8E8', // Light white/near-white for black & white polkadot
    image: '/images/polkadot-top.png', 
    lastWorn: '5 days ago', 
    style: 'casual' 
  },
  { 
    id: 3, 
    name: 'Cutbray Jeans', 
    category: 'Bottoms', 
    color: '#3B5998', // Classic denim blue for jeans
    image: '/images/cutbray-jeans.png', 
    lastWorn: '3 days ago', 
    style: 'casual' 
  },
  { 
    id: 4, 
    name: 'Short Skirt Jeans', 
    category: 'Bottoms', 
    color: '#5B7DB1', // Lighter denim blue for jeans skirt
    image: '/images/short-skirt.png', 
    lastWorn: '1 week ago', 
    style: 'casual' 
  },
  { 
    id: 5, 
    name: 'Grey Jacket', 
    category: 'Outerwear', 
    color: '#9E9E9E', // Medium grey for grey jacket
    image: '/images/grey-jacket.png', 
    lastWorn: '6 days ago', 
    style: 'comfy' 
  },
  { 
    id: 6, 
    name: 'White Boots', 
    category: 'Shoes', 
    color: '#F5F5F5', // Off-white for white boots
    image: '/images/white-boots.png', 
    lastWorn: '2 days ago', 
    style: 'casual' 
  },
  { 
    id: 7, 
    name: 'White Bag', 
    category: 'Bags', 
    color: '#FAFAFA', // Pure white for white bag
    image: '/images/white-bag.png', 
    lastWorn: '1 day ago', 
    style: 'formal' 
  },
  { 
    id: 8, 
    name: 'Broken White with Vest', 
    category: 'Tops', 
    color: '#F0EDE0', // Warm off-white / broken white
    image: '/images/broken-white-with-vest.png', 
    lastWorn: '1 day ago', 
    style: 'formal' 
  },
  { 
    id: 9, 
    name: 'Brown Flower Cut Out Belt', 
    category: 'Accessories', 
    color: '#8B5E3C', // Warm brown for brown belt
    image: '/images/brown-flower-cut-out-belt.png', 
    lastWorn: '1 day ago', 
    style: 'casual' 
  },
  { 
    id: 10, 
    name: 'Brown Long Skirt', 
    category: 'Bottoms', 
    color: '#7A5230', // Rich earthy brown for brown skirt
    image: '/images/brown-long-skirt.png', 
    lastWorn: '1 day ago', 
    style: 'formal' 
  },
  { 
    id: 11, 
    name: 'Brown Boots', 
    category: 'Shoes', 
    color: '#6B4226', // Deep warm brown for brown boots
    image: '/images/brown-boots.png', 
    lastWorn: '1 day ago', 
    style: 'formal' 
  },
  { 
    id: 12, 
    name: 'Brown Plaid Mini Skirt', 
    category: 'Bottoms', 
    color: '#9C6B3C', // Medium tan-brown for plaid
    image: '/images/brown-plaid-mini-skirt.png', 
    lastWorn: '1 day ago', 
    style: 'casual' 
  },
  { 
    id: 13, 
    name: 'Coquette Lace Trim Mary Jane Flats', 
    category: 'Shoes', 
    color: '#F2C4CE', // Soft blush/pink for coquette style
    image: '/images/coquette-lace-trim-mary-jane-flats.png', 
    lastWorn: '1 day ago', 
    style: 'casual' 
  },
  { 
    id: 14, 
    name: 'ESQ Brown Bag', 
    category: 'Bags', 
    color: '#8B6343', // Saddle brown for ESQ bag
    image: '/images/ESQ-brown-bag.png', 
    lastWorn: '1 day ago', 
    style: 'formal' 
  },
  { 
    id: 15, 
    name: 'Love Gold Necklace', 
    category: 'Accessories', 
    color: '#D4A843', // Gold/yellow-gold for gold necklace
    image: '/images/love-necklace-gold.png', 
    lastWorn: '1 day ago', 
    style: 'casual' 
  },
  { 
    id: 16, 
    name: 'Navy Star Pattern Knit Sweater', 
    category: 'Outerwear', 
    color: '#1B2A5C', // Dark navy blue for navy sweater
    image: '/images/navy-star-pattern-knit-sweater.png', 
    lastWorn: '1 day ago', 
    style: 'comfy' 
  },
  { 
    id: 17, 
    name: 'Plaid Pink Top', 
    category: 'Tops', 
    color: '#E8A0B0', // Soft pink for plaid pink top
    image: '/images/plaid-pink-top.png', 
    lastWorn: '1 day ago', 
    style: 'casual' 
  },
  { 
    id: 18, 
    name: 'Victorian Gothic Collared', 
    category: 'Tops', 
    color: '#1A1A1A', // Deep gothic black for collared top
    image: '/images/victorian-gothic-collared-top.png', 
    lastWorn: '1 day ago', 
    style: 'formal' 
  },
  { 
    id: 19, 
    name: 'Tooth Powder Mini Bag', 
    category: 'Bags', 
    color: '#E8A0B0', // Soft pink for tooth powder mini bag
    image: '/images/tooth.powder-mini-bag.png', 
    lastWorn: '1 day ago', 
    style: 'casual' 
  },
  { 
    id: 20, 
    name: 'Tabi Black Shoes', 
    category: 'Shoes', 
    color: '#111111', // Matte black for tabi shoes
    image: '/images/tabi-black-shoes.png', 
    lastWorn: '3 day ago', 
    style: 'casual' 
  },
  { 
    id: 21, 
    name: 'Short Afghan Jacket', 
    category: 'Outerwear', 
    color: '#5C4033', // Earthy dark brown for short afghan jacket
    image: '/images/short-afghan-jacket.png', 
    lastWorn: '5 day ago', 
    style: 'casual' 
  },
  { 
    id: 22, 
    name: 'Sai Corazon Fireman Clasps Jackets', 
    category: 'Outerwear', 
    color: '#1C1C1C', // Obsidian black for fireman clasps jacket
    image: '/images/sai-corazon-fireman-clasps-jackets.png', 
    lastWorn: '4 day ago', 
    style: 'casual' 
  },
  { 
    id: 23, 
    name: 'Rae Ruffle Shoulder Bag', 
    category: 'Bags', 
    color: '#252525', // Charcoal black for ruffle shoulder bag
    image: '/images/rae-ruffle-shoulder-bag.png', 
    lastWorn: '4 day ago', 
    style: 'casual' 
  },
  { 
    id: 24, 
    name: 'Puma Speedcat Black Mauve', 
    category: 'Shoes', 
    color: '#2B1A2F', // Deep black and mauve fusion for speedcat shoes
    image: '/images/puma-speedcat-black-mauve.png', 
    lastWorn: '4 day ago', 
    style: 'comfy' 
  },
  { 
    id: 25, 
    name: 'Polkadot Top Taobao', 
    category: 'Tops', 
    color: '#181818', // Base black with white spots for polkadot top
    image: '/images/polkadot-top-taobao.png', 
    lastWorn: '2 day ago', 
    style: 'casual' 
  },
  { 
    id: 26, 
    name: 'Polkadot Skinny Scarf', 
    category: 'Accessories', 
    color: '#FAFAFA', // Clean crisp white for skinny scarf
    image: '/images/polka-dot-skinny-scarf.png', 
    lastWorn: '2 day ago', 
    style: 'casual' 
  },
  { 
    id: 27, 
    name: 'Hei Hei Corduroy Loungers Olive', 
    category: 'Bottoms', 
    color: '#3B3C36', // Olive green tinted brown for corduroy loungers
    image: '/images/heihei-corduroy-loungers-olive.png', 
    lastWorn: '1 day ago', 
    style: 'comfy' 
  },
  { 
    id: 28, 
    name: 'Elevenses Harbormaster Trousers', 
    category: 'Bottoms', 
    color: '#0F0F0F', // Midnight black for harbormaster trousers
    image: '/images/elevenses-harbormaster-trousers.png', 
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