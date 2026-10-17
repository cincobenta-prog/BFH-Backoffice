// ============================================================================
// BENTA'S FUNERAL HOME (EST. 1928) - MASTER FLORAL CATALOG SYSTEM
// Featuring:
// 1. "Daniela's. Original" (Official 192-Arrangement Daniela's Flower Shop Harlem Book)
// 2. "Other Floral Book" (General & Partner Sympathy Floral Collections)
// ============================================================================

import danielasData from './danielasCatalogData.json';

export type FloralBookType = 'danielas_original' | 'other_floral_book';

export type FloralCategory = 
  | 'casket_spray'
  | 'combo'
  | 'standing_spray'
  | 'heart'
  | 'cross'
  | 'custom'
  | 'basket'
  | 'wreath'
  | 'urn_surround'
  | 'inside_casket'
  | 'boutonniere_corsage'
  | 'letter_tribute'
  | 'danielas';

export type FloralSize = 'small' | 'medium' | 'large';

export interface BFHFloralProduct {
  catalogNumber?: number; // 1 through 192 for Daniela's Original
  code: string;
  name: string;
  category: FloralCategory;
  categoryLabel: string;
  description: string;
  imageUrl: string;
  pricing: {
    small: number;
    medium: number;
    large: number;
  };
  dimensions: {
    small: string;
    medium: string;
    large: string;
  };
  floristPartner?: string;
  bookSource?: "Daniela's. Original" | "Other Floral Book";
  isCombo?: boolean;
}

// ============================================================================
// 1. DANIELA'S ORIGINAL CATALOG (192 Arranged Pieces, #1 through #192)
// Cleaned, cropped, high-resolution imagery and verified Harlem book pricing
// ============================================================================
export const DANIELAS_ORIGINAL_CATALOG: BFHFloralProduct[] = (danielasData as any[]).map(item => ({
  catalogNumber: item.catalogNumber,
  code: item.code,
  name: item.name,
  category: item.category as FloralCategory,
  categoryLabel: item.categoryLabel,
  description: item.description,
  imageUrl: item.imageUrl,
  pricing: {
    small: item.pricing.small,
    medium: item.pricing.medium,
    large: item.pricing.large,
  },
  dimensions: {
    small: item.dimensions.small,
    medium: item.dimensions.medium,
    large: item.dimensions.large,
  },
  floristPartner: "Daniela's Original",
  bookSource: "Daniela's. Original",
  isCombo: item.category === 'combo',
}));

// ============================================================================
// 2. OTHER FLORAL BOOK CATALOG (General & Partner Floral Collection)
// ============================================================================
export const OTHER_FLORAL_CATALOG: BFHFloralProduct[] = [
  // Casket Sprays
  {
    code: 'BFH-CS-001',
    name: 'Pure White Rose & Fragrant Lily Eternal Casket Spray',
    category: 'casket_spray',
    categoryLabel: 'Casket Spray',
    description: 'Classic, pure white sympathy casket spray with pristine ivory roses, Casablanca lilies, gladioli, and seeded eucalyptus.',
    imageUrl: '/images/daniela/1.jpg',
    pricing: { small: 300, medium: 350, large: 400 },
    dimensions: { small: '36" Half Casket', medium: '48" Full Casket', large: '60" Grand Full Casket' },
    floristPartner: 'Harlem Heritage Florist',
    bookSource: 'Other Floral Book'
  },
  {
    code: 'BFH-CS-002',
    name: 'Deep Crimson Freedom Rose Majestic Casket Cover',
    category: 'casket_spray',
    categoryLabel: 'Casket Spray',
    description: 'Rich velvet freedom red roses intertwined with dark burgundy carnations, salal leaves, and cascading Italian ruscus.',
    imageUrl: '/images/daniela/2.jpg',
    pricing: { small: 300, medium: 350, large: 400 },
    dimensions: { small: '36" Half Casket', medium: '48" Full Casket', large: '60" Grand Full Casket' },
    floristPartner: 'Harlem Heritage Florist',
    bookSource: 'Other Floral Book'
  },
  {
    code: 'BFH-CS-003',
    name: 'Pastel Garden Solace Casket Spray',
    category: 'casket_spray',
    categoryLabel: 'Casket Spray',
    description: 'Gentle arrangement of lavender roses, blush carnations, soft pink snapdragons, and white stock.',
    imageUrl: '/images/daniela/3.jpg',
    pricing: { small: 300, medium: 350, large: 400 },
    dimensions: { small: '36" Half Casket', medium: '48" Full Casket', large: '60" Grand Full Casket' },
    floristPartner: 'Harlem Heritage Florist',
    bookSource: 'Other Floral Book'
  },
  {
    code: 'BFH-CS-004',
    name: 'Golden Light Autumn Harvest Casket Blanket',
    category: 'casket_spray',
    categoryLabel: 'Casket Spray',
    description: 'Vibrant golden sunflowers, yellow roses, burnt orange lilies, and seasonal autumn foliage.',
    imageUrl: '/images/daniela/4.jpg',
    pricing: { small: 300, medium: 350, large: 400 },
    dimensions: { small: '36" Half Casket', medium: '48" Full Casket', large: '60" Grand Full Casket' },
    floristPartner: 'Harlem Heritage Florist',
    bookSource: 'Other Floral Book'
  },
  {
    code: 'BFH-CS-005',
    name: 'Royal Purple & Lavender Elegance Casket Cover',
    category: 'casket_spray',
    categoryLabel: 'Casket Spray',
    description: 'Regal purple gladioli, lavender roses, violet orchids, and silver dollar eucalyptus.',
    imageUrl: '/images/daniela/5.jpg',
    pricing: { small: 300, medium: 350, large: 400 },
    dimensions: { small: '36" Half Casket', medium: '48" Full Casket', large: '60" Grand Full Casket' },
    floristPartner: 'Harlem Heritage Florist',
    bookSource: 'Other Floral Book'
  },
  {
    code: 'BFH-CS-006',
    name: 'Heavenly Peach & Cream Orchid Casket Spray',
    category: 'casket_spray',
    categoryLabel: 'Casket Spray',
    description: 'Delicate peach spray roses, white cymbidium orchids, cream carnations, and dusty miller.',
    imageUrl: '/images/daniela/6.jpg',
    pricing: { small: 300, medium: 350, large: 400 },
    dimensions: { small: '36" Half Casket', medium: '48" Full Casket', large: '60" Grand Full Casket' },
    floristPartner: 'Harlem Heritage Florist',
    bookSource: 'Other Floral Book'
  },

  // Wreaths
  {
    code: 'BFH-WR-001',
    name: 'Circle of Eternal Light White Sympathy Wreath',
    category: 'wreath',
    categoryLabel: 'Standing Wreath',
    description: 'Full standing wreath on wooden easel crafted with white hydrangeas, ivory roses, and white carnations.',
    imageUrl: '/images/daniela/7.jpg',
    pricing: { small: 275, medium: 350, large: 450 },
    dimensions: { small: '20" Wreath (54" Easel)', medium: '24" Wreath (60" Easel)', large: '30" Wreath (66" Easel)' },
    floristPartner: 'Harlem Heritage Florist',
    bookSource: 'Other Floral Book'
  },
  {
    code: 'BFH-WR-002',
    name: 'Red Devotion Open Ring Memorial Wreath',
    category: 'wreath',
    categoryLabel: 'Standing Wreath',
    description: 'Vibrant red freedom roses and carnations surrounding an open ring with premium salal leaves.',
    imageUrl: '/images/daniela/8.jpg',
    pricing: { small: 295, medium: 375, large: 475 },
    dimensions: { small: '20" Wreath (54" Easel)', medium: '24" Wreath (60" Easel)', large: '30" Wreath (66" Easel)' },
    floristPartner: 'Harlem Heritage Florist',
    bookSource: 'Other Floral Book'
  },
  {
    code: 'BFH-WR-003',
    name: 'Lavender & White Graceful Serenade Wreath',
    category: 'wreath',
    categoryLabel: 'Standing Wreath',
    description: 'Soft lavender mums, lilac roses, white snapdragons, and ivy accents on a standing easel.',
    imageUrl: '/images/daniela/9.jpg',
    pricing: { small: 275, medium: 350, large: 450 },
    dimensions: { small: '20" Wreath (54" Easel)', medium: '24" Wreath (60" Easel)', large: '30" Wreath (66" Easel)' },
    floristPartner: 'Harlem Heritage Florist',
    bookSource: 'Other Floral Book'
  },
  {
    code: 'BFH-WR-004',
    name: 'Imperial Gold & Ivory Standing Wreath',
    category: 'wreath',
    categoryLabel: 'Standing Wreath',
    description: 'Yellow roses, gold ribbons, white lilies, and solidago forming a stately celebration of life ring.',
    imageUrl: '/images/daniela/10.jpg',
    pricing: { small: 285, medium: 360, large: 460 },
    dimensions: { small: '20" Wreath (54" Easel)', medium: '24" Wreath (60" Easel)', large: '30" Wreath (66" Easel)' },
    floristPartner: 'Harlem Heritage Florist',
    bookSource: 'Other Floral Book'
  },
  {
    code: 'BFH-WR-005',
    name: 'Pink Rose Radiance Memorial Wreath',
    category: 'wreath',
    categoryLabel: 'Standing Wreath',
    description: 'Blush pink roses, magenta spray carnations, baby breath, and emerald leatherleaf greenery.',
    imageUrl: '/images/daniela/11.jpg',
    pricing: { small: 275, medium: 350, large: 450 },
    dimensions: { small: '20" Wreath (54" Easel)', medium: '24" Wreath (60" Easel)', large: '30" Wreath (66" Easel)' },
    floristPartner: 'Harlem Heritage Florist',
    bookSource: 'Other Floral Book'
  },
  {
    code: 'BFH-WR-006',
    name: 'Harlem Heritage Grand Multicolor Tribute Wreath',
    category: 'wreath',
    categoryLabel: 'Standing Wreath',
    description: 'Rich tapestry of jewel-toned blooms: crimson roses, purple orchids, yellow lilies, and orange snapdragons.',
    imageUrl: '/images/daniela/12.jpg',
    pricing: { small: 310, medium: 395, large: 495 },
    dimensions: { small: '20" Wreath (54" Easel)', medium: '24" Wreath (60" Easel)', large: '30" Wreath (66" Easel)' },
    floristPartner: 'Harlem Heritage Florist',
    bookSource: 'Other Floral Book'
  },

  // Hearts
  {
    code: 'BFH-HT-001',
    name: 'Bleeding Heart Solid Red & White Tribute',
    category: 'heart',
    categoryLabel: 'Standing Heart',
    description: 'Solid white carnation heart pierced with a dramatic diagonal break of crimson velvet roses.',
    imageUrl: '/images/daniela/13.jpg',
    pricing: { small: 325, medium: 425, large: 525 },
    dimensions: { small: '20" Solid Heart', medium: '24" Solid Heart', large: '28" Solid Heart' },
    floristPartner: 'Harlem Heritage Florist',
    bookSource: 'Other Floral Book'
  },
  {
    code: 'BFH-HT-002',
    name: 'Everlasting Devotion Open Red Rose Heart',
    category: 'heart',
    categoryLabel: 'Standing Heart',
    description: 'Open heart silhouette covered in premium red roses, seeded eucalyptus, and organza ribbon.',
    imageUrl: '/images/daniela/14.jpg',
    pricing: { small: 295, medium: 395, large: 495 },
    dimensions: { small: '20" Open Heart', medium: '24" Open Heart', large: '28" Open Heart' },
    floristPartner: 'Harlem Heritage Florist',
    bookSource: 'Other Floral Book'
  },
  {
    code: 'BFH-HT-003',
    name: 'Pure Angelic Solid White Heart',
    category: 'heart',
    categoryLabel: 'Standing Heart',
    description: 'Solid white carnations and white rose cluster accent, edged with ruffled white ribbon.',
    imageUrl: '/images/daniela/15.jpg',
    pricing: { small: 295, medium: 395, large: 495 },
    dimensions: { small: '20" Solid Heart', medium: '24" Solid Heart', large: '28" Solid Heart' },
    floristPartner: 'Harlem Heritage Florist',
    bookSource: 'Other Floral Book'
  },
  {
    code: 'BFH-HT-004',
    name: 'Sweet Solace Pink & Peach Open Heart',
    category: 'heart',
    categoryLabel: 'Standing Heart',
    description: 'Open heart frame filled with blush pink roses, peach carnations, and cascading ivy tendrils.',
    imageUrl: '/images/daniela/16.jpg',
    pricing: { small: 285, medium: 385, large: 485 },
    dimensions: { small: '20" Open Heart', medium: '24" Open Heart', large: '28" Open Heart' },
    floristPartner: 'Harlem Heritage Florist',
    bookSource: 'Other Floral Book'
  },

  // Crosses
  {
    code: 'BFH-CR-001',
    name: 'Faith & Glory Solid White Carnation Cross with Red Rose Sash',
    category: 'cross',
    categoryLabel: 'Standing Cross',
    description: 'Traditional standing cross of dense white carnations adorned with a diagonal sash of deep red roses.',
    imageUrl: '/images/daniela/17.jpg',
    pricing: { small: 285, medium: 375, large: 475 },
    dimensions: { small: '30" Cross on 54" Easel', medium: '36" Cross on 60" Easel', large: '42" Cross on 66" Easel' },
    floristPartner: 'Harlem Heritage Florist',
    bookSource: 'Other Floral Book'
  },
  {
    code: 'BFH-CR-002',
    name: 'Crimson Redeemer Solid Red Rose Cross',
    category: 'cross',
    categoryLabel: 'Standing Cross',
    description: 'Majestic Christian cross completely blanketed in red freedom roses and emerald greens.',
    imageUrl: '/images/daniela/18.jpg',
    pricing: { small: 325, medium: 425, large: 525 },
    dimensions: { small: '30" Cross on 54" Easel', medium: '36" Cross on 60" Easel', large: '42" Cross on 66" Easel' },
    floristPartner: 'Harlem Heritage Florist',
    bookSource: 'Other Floral Book'
  },

  // Urn Surrounds
  {
    code: 'BFH-URN-001',
    name: 'Eternal Tranquility White Rose & Lily Urn Garland',
    category: 'urn_surround',
    categoryLabel: 'Urn Surround',
    description: 'Circular floral garland designed to frame a cremation urn, featuring white roses, dendrobium orchids, and waxflowers.',
    imageUrl: '/images/daniela/19.jpg',
    pricing: { small: 175, medium: 225, large: 295 },
    dimensions: { small: '14" Inner Circle', medium: '18" Inner Circle', large: '22" Inner Circle' },
    floristPartner: 'Harlem Heritage Florist',
    bookSource: 'Other Floral Book'
  },

  // Inside Casket
  {
    code: 'BFH-IC-001',
    name: 'Sweet Rest Satin Floral Pillow with Rose Spray',
    category: 'inside_casket',
    categoryLabel: 'Inside Casket',
    description: 'White satin pillow tribute trimmed with lace and centered with a tender spray of pink sweetheart roses.',
    imageUrl: '/images/daniela/20.jpg',
    pricing: { small: 95, medium: 135, large: 175 },
    dimensions: { small: '9" x 12" Pillow', medium: '12" x 16" Pillow', large: '14" x 18" Pillow' },
    floristPartner: 'Harlem Heritage Florist',
    bookSource: 'Other Floral Book'
  },

  // Boutonnieres & Corsages
  {
    code: 'BFH-BC-001',
    name: 'Dignified White Rosebud Pallbearer Boutonniere (Set of 6)',
    category: 'boutonniere_corsage',
    categoryLabel: 'Boutonniere & Corsage',
    description: 'Set of six matching single white rosebud boutonnieres with Italian ruscus and pearl head pins.',
    imageUrl: '/images/daniela/21.jpg',
    pricing: { small: 90, medium: 120, large: 150 },
    dimensions: { small: 'Set of 6', medium: 'Set of 8', large: 'Set of 10' },
    floristPartner: 'Harlem Heritage Florist',
    bookSource: 'Other Floral Book'
  },

  // Letter Tributes
  {
    code: 'BFH-LT-001',
    name: 'MOM Standing Floral Letter Tribute',
    category: 'letter_tribute',
    categoryLabel: 'Letter Tribute',
    description: 'Three 24" floral letters spelling MOM on individual easel bars, crafted in white carnations with pink rose clusters.',
    imageUrl: '/images/daniela/22.jpg',
    pricing: { small: 350, medium: 450, large: 550 },
    dimensions: { small: '3-Letter 18" Frame', medium: '3-Letter 24" Frame', large: '3-Letter 30" Frame' },
    floristPartner: 'Harlem Heritage Florist',
    bookSource: 'Other Floral Book'
  },
  {
    code: 'BFH-LT-002',
    name: 'DAD Standing Floral Letter Tribute',
    category: 'letter_tribute',
    categoryLabel: 'Letter Tribute',
    description: 'Three 24" floral letters spelling DAD on easel frame, crafted in white carnations with red rose clusters.',
    imageUrl: '/images/daniela/23.jpg',
    pricing: { small: 350, medium: 450, large: 550 },
    dimensions: { small: '3-Letter 18" Frame', medium: '3-Letter 24" Frame', large: '3-Letter 30" Frame' },
    floristPartner: 'Harlem Heritage Florist',
    bookSource: 'Other Floral Book'
  },

  // Custom
  {
    code: 'BFH-CUST-FLORAL',
    name: 'Custom Florist Commission / Special Family Request',
    category: 'custom',
    categoryLabel: 'Custom Floral',
    description: 'Custom bespoke floral tribute tailored to family specifications, colors, and floral varieties with master florist.',
    imageUrl: '/images/florals/bfh_cc_005.jpg',
    pricing: { small: 250, medium: 350, large: 500 },
    dimensions: { small: 'Custom Standard', medium: 'Custom Deluxe', large: 'Custom Grand Estate' },
    floristPartner: 'Harlem Heritage Florist',
    bookSource: 'Other Floral Book'
  }
];

// Default master list contains all items
export const BFH_FLORAL_CATALOG: BFHFloralProduct[] = [
  ...DANIELAS_ORIGINAL_CATALOG,
  ...OTHER_FLORAL_CATALOG
];

// Categories for Daniela's Original Book
export const DANIELAS_CATEGORIES: Array<{ id: FloralCategory | 'all'; label: string; count?: number }> = [
  { id: 'all', label: "All Daniela's Designs (192 Arranged Pieces, #1–#192)" },
  { id: 'casket_spray', label: 'Casket Sprays & Covers (Small $300 / Med $350 / Lrg $400)' },
  { id: 'combo', label: 'Grand Floral Combo Packages ($700 – $1,000)' },
  { id: 'standing_spray', label: 'Standing Easel Sprays (Small $300 / Med $350 / Lrg $400)' },
  { id: 'heart', label: 'Standing Hearts ($600 Fixed)' },
  { id: 'cross', label: 'Standing Faith Crosses ($550 Fixed)' },
  { id: 'custom', label: 'Custom Emblem & Specialty Tributes ($600 Fixed)' },
  { id: 'basket', label: 'Altar & Pedestal Baskets ($175 Fixed)' }
];

// Categories for Other Floral Book
export const OTHER_FLORAL_CATEGORIES: Array<{ id: FloralCategory | 'all'; label: string; count?: number }> = [
  { id: 'all', label: 'All Other Floral Book Tributes' },
  { id: 'casket_spray', label: 'Casket Sprays & Blankets' },
  { id: 'wreath', label: 'Standing Wreaths' },
  { id: 'heart', label: 'Standing Hearts' },
  { id: 'cross', label: 'Faith Crosses' },
  { id: 'urn_surround', label: 'Urn Garlands' },
  { id: 'inside_casket', label: 'Inside Casket' },
  { id: 'boutonniere_corsage', label: 'Boutonnieres' },
  { id: 'letter_tribute', label: 'Letter Tributes' },
  { id: 'custom', label: 'Custom Florist Requests' }
];

// Backward compatibility categories list
export const BFH_FLORAL_CATEGORIES = DANIELAS_CATEGORIES;

export function getFloralCatalog(book: FloralBookType = 'danielas_original'): BFHFloralProduct[] {
  if (book === 'other_floral_book') {
    return OTHER_FLORAL_CATALOG;
  }
  return DANIELAS_ORIGINAL_CATALOG;
}

export function getFloralByCode(code: string, book?: FloralBookType): BFHFloralProduct | undefined {
  if (!code) return undefined;
  const lower = code.toLowerCase().trim();
  
  if (book === 'danielas_original') {
    return DANIELAS_ORIGINAL_CATALOG.find(f => f.code.toLowerCase() === lower);
  }
  if (book === 'other_floral_book') {
    return OTHER_FLORAL_CATALOG.find(f => f.code.toLowerCase() === lower);
  }
  
  // Search in Daniela's Original first, then Other Floral Book
  return (
    DANIELAS_ORIGINAL_CATALOG.find(f => f.code.toLowerCase() === lower) ||
    OTHER_FLORAL_CATALOG.find(f => f.code.toLowerCase() === lower)
  );
}

export function calculateFloralPrice(code: string, size: FloralSize = 'medium', book?: FloralBookType): number {
  const item = getFloralByCode(code, book);
  if (!item) return 350;
  return item.pricing[size] ?? item.pricing.medium ?? item.pricing.small ?? 350;
}
