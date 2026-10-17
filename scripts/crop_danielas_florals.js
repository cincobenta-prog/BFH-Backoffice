import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const outDir = path.join(rootDir, 'public/images/florals/danielas');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// Page definitions with all 192 floral arrangements from Daniela's Flower Shop Book
export const PAGE_SPECS = [
  // ============================================================================
  // CASKET SPRAYS & COVERS (Pages 3–8: 42 Items | Small $300 / Med $350 / Large $400)
  // ============================================================================
  {
    page: '3.jpg',
    items: [
      { code: 'BFH-CC-001', name: 'Emerald & Ivory Garden Casket Spray', cat: 'casket_spray', price: 350, small: 300, med: 350, large: 400 },
      { code: 'BFH-CC-002', name: 'Regal Orchid & White Rose Casket Spray', cat: 'casket_spray', price: 350, small: 300, med: 350, large: 400 },
      { code: 'BFH-CC-003', name: 'Graceful Lavender & Blush Casket Spray', cat: 'casket_spray', price: 350, small: 300, med: 350, large: 400 },
      { code: 'BFH-CC-004', name: 'Sunset Peach & Cream Casket Spray', cat: 'casket_spray', price: 350, small: 300, med: 350, large: 400 },
      { code: 'BFH-CC-005', name: 'Spring Pastel Harmony Casket Spray', cat: 'casket_spray', price: 350, small: 300, med: 350, large: 400 },
      { code: 'BFH-CC-006', name: 'Crimson Velvet Rose Casket Blanket', cat: 'casket_spray', price: 350, small: 300, med: 350, large: 400 },
      { code: 'BFH-CC-007', name: 'Royal Gold & White Casablanca Spray', cat: 'casket_spray', price: 350, small: 300, med: 350, large: 400 },
      { code: 'BFH-CC-008', name: 'Celestial Blue & White Rose Casket Cover', cat: 'casket_spray', price: 350, small: 300, med: 350, large: 400 }
    ]
  },
  {
    page: '4.jpg',
    items: [
      { code: 'BFH-CC-009', name: 'Tangerine Sunset & Oriental Lily Casket Spray', cat: 'casket_spray', price: 350, small: 300, med: 350, large: 400 },
      { code: 'BFH-CC-0010', name: 'Pure Peace White Lily & Snapdragon Spray', cat: 'casket_spray', price: 350, small: 300, med: 350, large: 400 },
      { code: 'BFH-CC-0011', name: 'Magenta & Violet Royalty Casket Spray', cat: 'casket_spray', price: 350, small: 300, med: 350, large: 400 },
      { code: 'BFH-CC-0012', name: 'Autumn Amber & Terracotta Garden Cover', cat: 'casket_spray', price: 350, small: 300, med: 350, large: 400 },
      { code: 'BFH-CC-0013', name: 'Sweetheart Coral & Pink Floral Blanket', cat: 'casket_spray', price: 350, small: 300, med: 350, large: 400 },
      { code: 'BFH-CC-0014', name: 'Classic Deep Red Rose Half-Casket Spray', cat: 'casket_spray', price: 350, small: 300, med: 350, large: 400 },
      { code: 'BFH-CC-0015', name: 'Serenity Sky Blue & White Hydrangea Spray', cat: 'casket_spray', price: 350, small: 300, med: 350, large: 400 },
      { code: 'BFH-CC-0016', name: 'Grand Rose & Carnation Pink Casket Blanket', cat: 'casket_spray', price: 350, small: 300, med: 350, large: 400 }
    ]
  },
  {
    page: '5.jpg',
    items: [
      { code: 'BFH-CC-0017', name: 'Garden Whisper Soft Peach & Cream Spray', cat: 'casket_spray', price: 350, small: 300, med: 350, large: 400 },
      { code: 'BFH-CC-0018', name: 'Burgundy Grandeur Velvet Rose Casket Cover', cat: 'casket_spray', price: 350, small: 300, med: 350, large: 400 },
      { code: 'BFH-CC-0019', name: 'Sunny Meadow Yellow Sunflower & Lily Spray', cat: 'casket_spray', price: 350, small: 300, med: 350, large: 400 },
      { code: 'BFH-CC-0020', name: 'Lilac Elegance Lavender Rose Casket Cover', cat: 'casket_spray', price: 350, small: 300, med: 350, large: 400 },
      { code: 'BFH-CC-0021', name: 'Eternal Devotion Red & White Rose Spray', cat: 'casket_spray', price: 350, small: 300, med: 350, large: 400 },
      { code: 'BFH-CC-0022', name: 'Paradise Tropical Bird of Paradise & Anthurium', cat: 'casket_spray', price: 350, small: 300, med: 350, large: 400 },
      { code: 'BFH-CC-0023', name: 'Angelic Blush Orchid & Carnation Spray', cat: 'casket_spray', price: 350, small: 300, med: 350, large: 400 },
      { code: 'BFH-CC-0024', name: 'Harlem Heritage Grand Mixed Blossom Blanket', cat: 'casket_spray', price: 350, small: 300, med: 350, large: 400 }
    ]
  },
  {
    page: '6.jpg',
    items: [
      { code: 'BFH-CC-0025', name: 'Opulent White Calla Lily & Rose Cover', cat: 'casket_spray', price: 350, small: 300, med: 350, large: 400 },
      { code: 'BFH-CC-0026', name: 'Vibrant Sunrise Orange & Gold Spray', cat: 'casket_spray', price: 350, small: 300, med: 350, large: 400 },
      { code: 'BFH-CC-0027', name: 'Royal Purple Iris & Lavender Rose Cover', cat: 'casket_spray', price: 350, small: 300, med: 350, large: 400 },
      { code: 'BFH-CC-0028', name: 'Blush Radiance Pink Carnation & Rose Spray', cat: 'casket_spray', price: 350, small: 300, med: 350, large: 400 },
      { code: 'BFH-CC-0029', name: 'Ruby Glow Grand Red Carnation Blanket', cat: 'casket_spray', price: 350, small: 300, med: 350, large: 400 },
      { code: 'BFH-CC-0030', name: 'Golden Light Yellow Rose & Lily Cover', cat: 'casket_spray', price: 350, small: 300, med: 350, large: 400 },
      { code: 'BFH-CC-0031', name: 'Whispering Willow White & Emerald Garland Spray', cat: 'casket_spray', price: 350, small: 300, med: 350, large: 400 },
      { code: 'BFH-CC-0032', name: 'Majestic Fuchsia & Violet Blossom Spray', cat: 'casket_spray', price: 350, small: 300, med: 350, large: 400 }
    ]
  },
  {
    page: '7.jpg',
    items: [
      { code: 'BFH-CC-0033', name: 'Sweet Remembrances Pink Lily & Rose Spray', cat: 'casket_spray', price: 350, small: 300, med: 350, large: 400 },
      { code: 'BFH-CC-0034', name: 'Autumn Glory Terracotta & Amber Spray', cat: 'casket_spray', price: 350, small: 300, med: 350, large: 400 },
      { code: 'BFH-CC-0035', name: 'Pure Devotion Solid White Rose Blanket', cat: 'casket_spray', price: 350, small: 300, med: 350, large: 400 },
      { code: 'BFH-CC-0036', name: 'Sunkissed Yellow Snapdragon & Daisy Spray', cat: 'casket_spray', price: 350, small: 300, med: 350, large: 400 },
      { code: 'BFH-CC-0037', name: 'Enchanted Meadow Wildflower & Lavender Spray', cat: 'casket_spray', price: 350, small: 300, med: 350, large: 400 },
      { code: 'BFH-CC-0038', name: 'Deep Crimson & White Ribboned Casket Spray', cat: 'casket_spray', price: 350, small: 300, med: 350, large: 400 },
      { code: 'BFH-CC-0039', name: 'Orchid Dream White & Violet Cascading Spray', cat: 'casket_spray', price: 350, small: 300, med: 350, large: 400 },
      { code: 'BFH-CC-0040', name: 'Coral Horizon Rose & Gladiolus Spray', cat: 'casket_spray', price: 350, small: 300, med: 350, large: 400 }
    ]
  },
  {
    page: '8.jpg',
    items: [
      { code: 'BFH-CC-0041', name: 'Victorian Rose Pastel Symphony Casket Cover', cat: 'casket_spray', price: 350, small: 300, med: 350, large: 400 },
      { code: 'BFH-CC-0042', name: 'Timeless Grace Ivory & Eucalyptus Casket Spray', cat: 'casket_spray', price: 350, small: 300, med: 350, large: 400 }
    ]
  },

  // ============================================================================
  // GRAND FLORAL COMBOS (Page 10: 5 Items | Specific stickered prices $700–$1,000)
  // ============================================================================
  {
    page: '10.jpg',
    items: [
      { code: 'BFH-CC-043', name: 'Grand Remembrance Trio Combo Package', cat: 'combo', price: 700, small: 700, med: 700, large: 700, desc: 'Complete 3-piece tribute package with matching Casket Spray, Standing Easel Spray, and Table Pedestal.' },
      { code: 'BFH-CC-0044', name: 'Royal Heritage 4-Piece Grand Tribute Combo', cat: 'combo', price: 1000, small: 1000, med: 1000, large: 1000, desc: 'Majestic 4-piece family collection: Casket Cover, Standing Heart, Faith Cross, and Side Urn Garland.' },
      { code: 'BFH-CC-045', name: 'Imperial Red Rose Complete Family Ensemble', cat: 'combo', price: 1000, small: 1000, med: 1000, large: 1000, desc: 'Luxury red rose package featuring full Casket Blanket, Matching Standing Wreath, and Dual Pedestal Baskets.' },
      { code: 'BFH-CC-046', name: 'Harlem Serenity Pastel Family Tribute Combo', cat: 'combo', price: 900, small: 900, med: 900, large: 900, desc: 'Full pastel service ensemble: Casket Spray, Standing Easel Spray, and Broken Heart Tribute.' },
      { code: 'BFH-CC-047', name: 'Pure Light White Lily & Orchid Deluxe Package', cat: 'combo', price: 900, small: 900, med: 900, large: 900, desc: 'Pristine white sympathy suite: Grand Casablanca Casket Spray, Standing Cross, and Altar Baskets.' }
    ]
  },

  // ============================================================================
  // STANDING EASEL SPRAYS (Pages 12–18: 56 Items | Small $300 / Med $350 / Large $400)
  // ============================================================================
  {
    page: '12.jpg',
    items: [
      { code: 'BFH-SP-001', name: 'Golden Radiance Standing Easel Spray', cat: 'standing_spray', price: 350, small: 300, med: 350, large: 400 },
      { code: 'BFH-SP-002', name: 'Pastel Whisper Sympathy Easel Spray', cat: 'standing_spray', price: 350, small: 300, med: 350, large: 400 },
      { code: 'BFH-SP-003', name: 'Scarlet Passion Red Rose Easel Spray', cat: 'standing_spray', price: 350, small: 300, med: 350, large: 400 },
      { code: 'BFH-SP-004', name: 'Celestial White Casablanca Standing Spray', cat: 'standing_spray', price: 350, small: 300, med: 350, large: 400 },
      { code: 'BFH-SP-005', name: 'Royal Violet & Lavender Tribute Spray', cat: 'standing_spray', price: 350, small: 300, med: 350, large: 400 },
      { code: 'BFH-SP-006', name: 'Sunny Daybreak Yellow Lily Standing Spray', cat: 'standing_spray', price: 350, small: 300, med: 350, large: 400 },
      { code: 'BFH-SP-007', name: 'Coral Sunset Warmth Easel Spray', cat: 'standing_spray', price: 350, small: 300, med: 350, large: 400 },
      { code: 'BFH-SP-008', name: 'Harlem Pride Blue & Ivory Standing Spray', cat: 'standing_spray', price: 350, small: 300, med: 350, large: 400 }
    ]
  },
  {
    page: '13.jpg',
    items: [
      { code: 'BFH-SP-009', name: 'Graceful Meadow Mixed Blossom Spray', cat: 'standing_spray', price: 350, small: 300, med: 350, large: 400 },
      { code: 'BFH-SP-0010', name: 'Pure Devotion All-White Rose Easel Spray', cat: 'standing_spray', price: 350, small: 300, med: 350, large: 400 },
      { code: 'BFH-SP-0011', name: 'Vibrant Magenta Orchid Standing Spray', cat: 'standing_spray', price: 350, small: 300, med: 350, large: 400 },
      { code: 'BFH-SP-0012', name: 'Autumn Harmony Bronze Mum & Rose Spray', cat: 'standing_spray', price: 350, small: 300, med: 350, large: 400 },
      { code: 'BFH-SP-0013', name: 'Soft Blush Carnation & Lily Tribute Spray', cat: 'standing_spray', price: 350, small: 300, med: 350, large: 400 },
      { code: 'BFH-SP-0014', name: 'Crimson Majesty Deep Red Spray', cat: 'standing_spray', price: 350, small: 300, med: 350, large: 400 },
      { code: 'BFH-SP-0015', name: 'Skyview Blue Hydrangea & White Spray', cat: 'standing_spray', price: 350, small: 300, med: 350, large: 400 },
      { code: 'BFH-SP-0016', name: 'Sweetheart Pink Rose Fan Easel Spray', cat: 'standing_spray', price: 350, small: 300, med: 350, large: 400 }
    ]
  },
  {
    page: '14.jpg',
    items: [
      { code: 'BFH-SP-0017', name: 'Golden Glow Gladiolus & Mum Spray', cat: 'standing_spray', price: 350, small: 300, med: 350, large: 400 },
      { code: 'BFH-SP-0018', name: 'Regal Lavender Orchid & Lily Spray', cat: 'standing_spray', price: 350, small: 300, med: 350, large: 400 },
      { code: 'BFH-SP-0019', name: 'Tropical Paradise Bird of Paradise Spray', cat: 'standing_spray', price: 350, small: 300, med: 350, large: 400 },
      { code: 'BFH-SP-0020', name: 'Eternal Peace Pure White Standing Spray', cat: 'standing_spray', price: 350, small: 300, med: 350, large: 400 },
      { code: 'BFH-SP-0021', name: 'Ruby Velvet Rose & Carnation Spray', cat: 'standing_spray', price: 350, small: 300, med: 350, large: 400 },
      { code: 'BFH-SP-0022', name: 'Spring Symphony Pastel Mixed Spray', cat: 'standing_spray', price: 350, small: 300, med: 350, large: 400 },
      { code: 'BFH-SP-0023', name: 'Sunrise Burst Orange & Yellow Lily Spray', cat: 'standing_spray', price: 350, small: 300, med: 350, large: 400 },
      { code: 'BFH-SP-0024', name: 'Navy & Ivory Dignified Standing Spray', cat: 'standing_spray', price: 350, small: 300, med: 350, large: 400 }
    ]
  },
  {
    page: '15.jpg',
    items: [
      { code: 'BFH-SP-0025', name: 'Opulent Pink Blossom Easel Spray', cat: 'standing_spray', price: 350, small: 300, med: 350, large: 400 },
      { code: 'BFH-SP-0026', name: 'Emerald Forest White Lily Spray', cat: 'standing_spray', price: 350, small: 300, med: 350, large: 400 },
      { code: 'BFH-SP-0027', name: 'Sunset Romance Coral & Rose Spray', cat: 'standing_spray', price: 350, small: 300, med: 350, large: 400 },
      { code: 'BFH-SP-0028', name: 'Royal Purple Aster & Violet Spray', cat: 'standing_spray', price: 350, small: 300, med: 350, large: 400 },
      { code: 'BFH-SP-0029', name: 'Sunkissed Sunflower Tribute Spray', cat: 'standing_spray', price: 350, small: 300, med: 350, large: 400 },
      { code: 'BFH-SP-0030', name: 'Classic Red Carnation & Rose Spray', cat: 'standing_spray', price: 350, small: 300, med: 350, large: 400 },
      { code: 'BFH-SP-0031', name: 'Angelic Ivory & Lace Spray', cat: 'standing_spray', price: 350, small: 300, med: 350, large: 400 },
      { code: 'BFH-SP-0032', name: 'Soft Lavender Garden Standing Spray', cat: 'standing_spray', price: 350, small: 300, med: 350, large: 400 }
    ]
  },
  {
    page: '16.jpg',
    items: [
      { code: 'BFH-SP-0033', name: 'Autumn Flame Copper & Gold Spray', cat: 'standing_spray', price: 350, small: 300, med: 350, large: 400 },
      { code: 'BFH-SP-0034', name: 'Pastel Reverie Pink & Cream Spray', cat: 'standing_spray', price: 350, small: 300, med: 350, large: 400 },
      { code: 'BFH-SP-0035', name: 'Majestic White Orchid Fan Spray', cat: 'standing_spray', price: 350, small: 300, med: 350, large: 400 },
      { code: 'BFH-SP-0036', name: 'Crimson Glory Bold Red Spray', cat: 'standing_spray', price: 350, small: 300, med: 350, large: 400 },
      { code: 'BFH-SP-0037', name: 'Peaceful Horizon Blue & White Spray', cat: 'standing_spray', price: 350, small: 300, med: 350, large: 400 },
      { code: 'BFH-SP-0038', name: 'Golden Harvest Warm Sympathy Spray', cat: 'standing_spray', price: 350, small: 300, med: 350, large: 400 },
      { code: 'BFH-SP-0039', name: 'Violet Splendor Purple Lily Spray', cat: 'standing_spray', price: 350, small: 300, med: 350, large: 400 },
      { code: 'BFH-SP-0040', name: 'Blush & Ivory Gentle Memorial Spray', cat: 'standing_spray', price: 350, small: 300, med: 350, large: 400 }
    ]
  },
  {
    page: '17.jpg',
    items: [
      { code: 'BFH-SP-0041', name: 'Harlem Horizon Tri-Color Easel Spray', cat: 'standing_spray', price: 350, small: 300, med: 350, large: 400 },
      { code: 'BFH-SP-0042', name: 'Pure Casablanca Lily Regal Spray', cat: 'standing_spray', price: 350, small: 300, med: 350, large: 400 },
      { code: 'BFH-SP-0043', name: 'Scarlet Devotion Red Rose Fan Spray', cat: 'standing_spray', price: 350, small: 300, med: 350, large: 400 },
      { code: 'BFH-SP-0044', name: 'Sunny Blessing Yellow & Orange Spray', cat: 'standing_spray', price: 350, small: 300, med: 350, large: 400 },
      { code: 'BFH-SP-0045', name: 'Lavender Mist Peaceful Easel Spray', cat: 'standing_spray', price: 350, small: 300, med: 350, large: 400 },
      { code: 'BFH-SP-0046', name: 'Pink Ribbon of Hope Tribute Spray', cat: 'standing_spray', price: 350, small: 300, med: 350, large: 400 },
      { code: 'BFH-SP-0047', name: 'Royal Amethyst Purple & Gold Spray', cat: 'standing_spray', price: 350, small: 300, med: 350, large: 400 },
      { code: 'BFH-SP-0048', name: 'White Serenade Sympathy Easel Spray', cat: 'standing_spray', price: 350, small: 300, med: 350, large: 400 }
    ]
  },
  {
    page: '18.jpg',
    items: [
      { code: 'BFH-SP-0049', name: 'Grand Celebration Mixed Color Spray', cat: 'standing_spray', price: 350, small: 300, med: 350, large: 400 },
      { code: 'BFH-SP-0050', name: 'Deep Crimson & White Fan Spray', cat: 'standing_spray', price: 350, small: 300, med: 350, large: 400 },
      { code: 'BFH-SP-0051', name: 'Golden Sunlight Daisy & Lily Spray', cat: 'standing_spray', price: 350, small: 300, med: 350, large: 400 },
      { code: 'BFH-SP-0052', name: 'Pastel Garden Grace Easel Spray', cat: 'standing_spray', price: 350, small: 300, med: 350, large: 400 },
      { code: 'BFH-SP-0053', name: 'Ocean Breeze Blue Hydrangea Spray', cat: 'standing_spray', price: 350, small: 300, med: 350, large: 400 },
      { code: 'BFH-SP-0054', name: 'Imperial Red & Purple Standing Spray', cat: 'standing_spray', price: 350, small: 300, med: 350, large: 400 },
      { code: 'BFH-SP-0055', name: 'Ivory Cascade Calla Lily Spray', cat: 'standing_spray', price: 350, small: 300, med: 350, large: 400 },
      { code: 'BFH-SP-0056', name: 'Sunset Coral & Gold Standing Spray', cat: 'standing_spray', price: 350, small: 300, med: 350, large: 400 }
    ]
  },

  // ============================================================================
  // STANDING HEARTS (Pages 20–24: 39 Items | Fixed $600)
  // ============================================================================
  {
    page: '20.jpg',
    items: [
      { code: 'BFH-H-001', name: 'Pure White Rose Solid Heart Tribute', cat: 'heart', price: 600, small: 600, med: 600, large: 600 },
      { code: 'BFH-H-002', name: 'Scarlet Rose Open Heart Tribute', cat: 'heart', price: 600, small: 600, med: 600, large: 600 },
      { code: 'BFH-H-003', name: 'Pink & Ivory Broken Heart Sympathy Tribute', cat: 'heart', price: 600, small: 600, med: 600, large: 600 },
      { code: 'BFH-H-004', name: 'Royal Purple & Lavender Open Heart', cat: 'heart', price: 600, small: 600, med: 600, large: 600 },
      { code: 'BFH-H-005', name: 'Golden Yellow Rose & Lily Heart', cat: 'heart', price: 600, small: 600, med: 600, large: 600 },
      { code: 'BFH-H-006', name: 'Sky Blue & White Solid Heart', cat: 'heart', price: 600, small: 600, med: 600, large: 600 },
      { code: 'BFH-H-007', name: 'Crimson & Gold Regal Heart Tribute', cat: 'heart', price: 600, small: 600, med: 600, large: 600 },
      { code: 'BFH-H-008', name: 'Sweetheart Pastel Mixed Blossom Heart', cat: 'heart', price: 600, small: 600, med: 600, large: 600 }
    ]
  },
  {
    page: '21.jpg',
    items: [
      { code: 'BFH-H-009', name: 'All-Red Velvet Rose Solid Heart', cat: 'heart', price: 600, small: 600, med: 600, large: 600 },
      { code: 'BFH-H-0010', name: 'Graceful Pink Rose Open Heart', cat: 'heart', price: 600, small: 600, med: 600, large: 600 },
      { code: 'BFH-H-0011', name: 'Ivory Casablanca Open Heart on Easel', cat: 'heart', price: 600, small: 600, med: 600, large: 600 },
      { code: 'BFH-H-0012', name: 'Red & White Devotion Broken Heart', cat: 'heart', price: 600, small: 600, med: 600, large: 600 },
      { code: 'BFH-H-0013', name: 'Lavender Serenity Solid Floral Heart', cat: 'heart', price: 600, small: 600, med: 600, large: 600 },
      { code: 'BFH-H-0014', name: 'Sunburst Gold & Orange Open Heart', cat: 'heart', price: 600, small: 600, med: 600, large: 600 },
      { code: 'BFH-H-0015', name: 'Midnight Blue & Crimson Heart Tribute', cat: 'heart', price: 600, small: 600, med: 600, large: 600 },
      { code: 'BFH-H-0016', name: 'Coral & Peach Blossom Open Heart', cat: 'heart', price: 600, small: 600, med: 600, large: 600 }
    ]
  },
  {
    page: '22.jpg',
    items: [
      { code: 'BFH-H-0017', name: 'Eternal White Orchid Open Heart', cat: 'heart', price: 600, small: 600, med: 600, large: 600 },
      { code: 'BFH-H-0018', name: 'Deep Ruby Rose & Baby Breath Heart', cat: 'heart', price: 600, small: 600, med: 600, large: 600 },
      { code: 'BFH-H-0019', name: 'Blush Carnation Solid Heart', cat: 'heart', price: 600, small: 600, med: 600, large: 600 },
      { code: 'BFH-H-0020', name: 'Purple Majesty Lavender Rose Heart', cat: 'heart', price: 600, small: 600, med: 600, large: 600 },
      { code: 'BFH-H-0021', name: 'Golden Sunrise Solid Rose Heart', cat: 'heart', price: 600, small: 600, med: 600, large: 600 },
      { code: 'BFH-H-0022', name: 'Skyward Blue & White Open Heart', cat: 'heart', price: 600, small: 600, med: 600, large: 600 },
      { code: 'BFH-H-0023', name: 'Burgundy & Champagne Broken Heart', cat: 'heart', price: 600, small: 600, med: 600, large: 600 },
      { code: 'BFH-H-0024', name: 'Spring Garden Multi-Color Heart', cat: 'heart', price: 600, small: 600, med: 600, large: 600 }
    ]
  },
  {
    page: '23.jpg',
    items: [
      { code: 'BFH-H-0025', name: 'Pure Grace White Rose Broken Heart', cat: 'heart', price: 600, small: 600, med: 600, large: 600 },
      { code: 'BFH-H-0026', name: 'Scarlet Ribbon & Red Carnation Heart', cat: 'heart', price: 600, small: 600, med: 600, large: 600 },
      { code: 'BFH-H-0027', name: 'Soft Pink Rose & Daisy Heart', cat: 'heart', price: 600, small: 600, med: 600, large: 600 },
      { code: 'BFH-H-0028', name: 'Violet Cascade Open Heart Tribute', cat: 'heart', price: 600, small: 600, med: 600, large: 600 },
      { code: 'BFH-H-0029', name: 'Yellow Sunshine Solid Heart', cat: 'heart', price: 600, small: 600, med: 600, large: 600 },
      { code: 'BFH-H-0030', name: 'Royal Blue Sapphire Rose Heart', cat: 'heart', price: 600, small: 600, med: 600, large: 600 },
      { code: 'BFH-H-0031', name: 'Coral Horizon Blossom Heart', cat: 'heart', price: 600, small: 600, med: 600, large: 600 },
      { code: 'BFH-H-0032', name: 'Harlem Heritage Grand Solid Heart', cat: 'heart', price: 600, small: 600, med: 600, large: 600 }
    ]
  },
  {
    page: '24.jpg',
    items: [
      { code: 'BFH-H-0033', name: 'Angelic White Carnation Open Heart', cat: 'heart', price: 600, small: 600, med: 600, large: 600 },
      { code: 'BFH-H-0034', name: 'Crimson Elegance Solid Red Rose Heart', cat: 'heart', price: 600, small: 600, med: 600, large: 600 },
      { code: 'BFH-H-0035', name: 'Blush & White Serenity Open Heart', cat: 'heart', price: 600, small: 600, med: 600, large: 600 },
      { code: 'BFH-H-0036', name: 'Lavender Ribbon Memorial Heart', cat: 'heart', price: 600, small: 600, med: 600, large: 600 },
      { code: 'BFH-H-0037', name: 'Golden Amber Solid Rose Heart', cat: 'heart', price: 600, small: 600, med: 600, large: 600 },
      { code: 'BFH-H-0038', name: 'Blue Sky & Cloud Open Heart', cat: 'heart', price: 600, small: 600, med: 600, large: 600 },
      { code: 'BFH-H-0039', name: 'Eternal Devotion Multi-Color Rose Heart', cat: 'heart', price: 600, small: 600, med: 600, large: 600 }
    ]
  },

  // ============================================================================
  // FAITH CROSSES (Page 26: 8 Items | Fixed $550)
  // ============================================================================
  {
    page: '26.jpg',
    items: [
      { code: 'BFH-C-001', name: 'Pure White Carnation & Red Rose Cross', cat: 'cross', price: 550, small: 550, med: 550, large: 550 },
      { code: 'BFH-C-002', name: 'Solid Red Velvet Rose Standing Cross', cat: 'cross', price: 550, small: 550, med: 550, large: 550 },
      { code: 'BFH-C-003', name: 'Ivory Casablanca & White Orchid Cross', cat: 'cross', price: 550, small: 550, med: 550, large: 550 },
      { code: 'BFH-C-004', name: 'Pink Rose & White Mum Faith Cross', cat: 'cross', price: 550, small: 550, med: 550, large: 550 },
      { code: 'BFH-C-005', name: 'Lavender & Purple Majesty Standing Cross', cat: 'cross', price: 550, small: 550, med: 550, large: 550 },
      { code: 'BFH-C-006', name: 'Golden Sunlight Yellow Rose Cross', cat: 'cross', price: 550, small: 550, med: 550, large: 550 },
      { code: 'BFH-C-007', name: 'Royal Blue & White Faith Cross', cat: 'cross', price: 550, small: 550, med: 550, large: 550 },
      { code: 'BFH-C-008', name: 'Crimson & Gold Grand Standing Cross', cat: 'cross', price: 550, small: 550, med: 550, large: 550 }
    ]
  },

  // ============================================================================
  // CUSTOM & EMBLEM / SPECIALTY PIECES (Pages 28–30: 18 Items | Fixed $600)
  // ============================================================================
  {
    page: '28.jpg',
    items: [
      { code: 'BFH-PC-001', name: 'Custom Masonic Square & Compass Floral Emblem', cat: 'custom', price: 600, small: 600, med: 600, large: 600 },
      { code: 'BFH-PC-002', name: 'Eastern Star 5-Pointed Floral Emblem', cat: 'custom', price: 600, small: 600, med: 600, large: 600 },
      { code: 'BFH-PC-003', name: 'Grand Sports Jersey / Baseball Tribute Piece', cat: 'custom', price: 600, small: 600, med: 600, large: 600 },
      { code: 'BFH-PC-004', name: 'Musical Treble Clef & Note Tribute', cat: 'custom', price: 600, small: 600, med: 600, large: 600 },
      { code: 'BFH-PC-005', name: 'Praying Hands Solid Floral Sculpture', cat: 'custom', price: 600, small: 600, med: 600, large: 600 },
      { code: 'BFH-PC-006', name: 'Open Bible Scripture Floral Tribute', cat: 'custom', price: 600, small: 600, med: 600, large: 600 },
      { code: 'BFH-PC-007', name: 'Gates of Heaven Floral Arch Tribute', cat: 'custom', price: 600, small: 600, med: 600, large: 600 },
      { code: 'BFH-PC-008', name: 'Star of David Faith Floral Tribute', cat: 'custom', price: 600, small: 600, med: 600, large: 600 }
    ]
  },
  {
    page: '29.jpg',
    items: [
      { code: 'BFH-PC-009', name: 'Anchor of Hope Nautical Floral Tribute', cat: 'custom', price: 600, small: 600, med: 600, large: 600 },
      { code: 'BFH-PC-0010', name: 'Peace Dove in Flight Sympathy Piece', cat: 'custom', price: 600, small: 600, med: 600, large: 600 },
      { code: 'BFH-PC-0011', name: 'Crown of Glory Royal Floral Tribute', cat: 'custom', price: 600, small: 600, med: 600, large: 600 },
      { code: 'BFH-PC-0012', name: 'Butterfly Wings Metamorphosis Tribute', cat: 'custom', price: 600, small: 600, med: 600, large: 600 },
      { code: 'BFH-PC-0013', name: 'Guitar / Instrument Custom Floral Tribute', cat: 'custom', price: 600, small: 600, med: 600, large: 600 },
      { code: 'BFH-PC-0014', name: 'Automobile / Motorcycle Emblem Piece', cat: 'custom', price: 600, small: 600, med: 600, large: 600 },
      { code: 'BFH-PC-0015', name: 'Angel Wings Solid White Rose Sculpture', cat: 'custom', price: 600, small: 600, med: 600, large: 600 },
      { code: 'BFH-PC-0016', name: 'Pillow of Rest Inscription Floral Tribute', cat: 'custom', price: 600, small: 600, med: 600, large: 600 }
    ]
  },
  {
    page: '30.jpg',
    items: [
      { code: 'BFH-PC-0017', name: 'Custom Number / Year Memorial Piece', cat: 'custom', price: 600, small: 600, med: 600, large: 600 },
      { code: 'BFH-PC-0018', name: 'Harlem Bespoke Commission Tribute Piece', cat: 'custom', price: 600, small: 600, med: 600, large: 600 }
    ]
  },

  // ============================================================================
  // ALTAR & PEDESTAL BASKETS (Pages 32–34: 24 Items | Fixed $175)
  // ============================================================================
  {
    page: '32.jpg',
    items: [
      { code: 'BFH-B-001', name: 'Golden Sunlight Gladiolus & Lily Altar Basket', cat: 'basket', price: 175, small: 175, med: 175, large: 175 },
      { code: 'BFH-B-002', name: 'Pure Serenity All-White Mum & Rose Basket', cat: 'basket', price: 175, small: 175, med: 175, large: 175 },
      { code: 'BFH-B-003', name: 'Crimson Velvet Rose & Carnation Basket', cat: 'basket', price: 175, small: 175, med: 175, large: 175 },
      { code: 'BFH-B-004', name: 'Pastel Garden Whisper Mixed Blossom Basket', cat: 'basket', price: 175, small: 175, med: 175, large: 175 },
      { code: 'BFH-B-005', name: 'Lavender Mist & Purple Snapdragon Basket', cat: 'basket', price: 175, small: 175, med: 175, large: 175 },
      { code: 'BFH-B-006', name: 'Sweetheart Pink Rose & Lily Pedestal Basket', cat: 'basket', price: 175, small: 175, med: 175, large: 175 },
      { code: 'BFH-B-007', name: 'Autumn Glory Copper Mum & Daisy Basket', cat: 'basket', price: 175, small: 175, med: 175, large: 175 },
      { code: 'BFH-B-008', name: 'Skyward Blue Hydrangea & Ivory Altar Basket', cat: 'basket', price: 175, small: 175, med: 175, large: 175 }
    ]
  },
  {
    page: '33.jpg',
    items: [
      { code: 'BFH-B-009', name: 'Sunrise Burst Orange Lily & Carnation Basket', cat: 'basket', price: 175, small: 175, med: 175, large: 175 },
      { code: 'BFH-B-0010', name: 'Pure Peace Casablanca Lily White Basket', cat: 'basket', price: 175, small: 175, med: 175, large: 175 },
      { code: 'BFH-B-0011', name: 'Royal Fuchsia & Violet Blossom Basket', cat: 'basket', price: 175, small: 175, med: 175, large: 175 },
      { code: 'BFH-B-0012', name: 'Golden Harvest Sunflower & Daisy Basket', cat: 'basket', price: 175, small: 175, med: 175, large: 175 },
      { code: 'BFH-B-0013', name: 'Blush & Coral Garden Pedestal Basket', cat: 'basket', price: 175, small: 175, med: 175, large: 175 },
      { code: 'BFH-B-0014', name: 'Deep Ruby Red Rose Sympathy Basket', cat: 'basket', price: 175, small: 175, med: 175, large: 175 },
      { code: 'BFH-B-0015', name: 'Ocean Mist Blue & White Floral Basket', cat: 'basket', price: 175, small: 175, med: 175, large: 175 },
      { code: 'BFH-B-0016', name: 'Spring Symphony Pastel Mixed Pedestal Basket', cat: 'basket', price: 175, small: 175, med: 175, large: 175 }
    ]
  },
  {
    page: '34.jpg',
    items: [
      { code: 'BFH-B-0017', name: 'Victorian Rose Lavender & Cream Basket', cat: 'basket', price: 175, small: 175, med: 175, large: 175 },
      { code: 'BFH-B-0018', name: 'Emerald & Ivory Gladiolus Altar Basket', cat: 'basket', price: 175, small: 175, med: 175, large: 175 },
      { code: 'BFH-B-0019', name: 'Scarlet & Gold Celebration Basket', cat: 'basket', price: 175, small: 175, med: 175, large: 175 },
      { code: 'BFH-B-0020', name: 'Soft Peach & White Rose Pedestal Basket', cat: 'basket', price: 175, small: 175, med: 175, large: 175 },
      { code: 'BFH-B-0021', name: 'Purple Splendor Orchid & Mum Basket', cat: 'basket', price: 175, small: 175, med: 175, large: 175 },
      { code: 'BFH-B-0022', name: 'Sunkissed Yellow Snapdragon Basket', cat: 'basket', price: 175, small: 175, med: 175, large: 175 },
      { code: 'BFH-B-0023', name: 'Harlem Serenade White Rose & Lily Basket', cat: 'basket', price: 175, small: 175, med: 175, large: 175 },
      { code: 'BFH-B-0024', name: 'Grand Finale Sympathy Altar Basket', cat: 'basket', price: 175, small: 175, med: 175, large: 175 }
    ]
  }
];

async function runCrop() {
  console.log('Starting automated floral cropping for Daniela\'s Original Catalog...');
  let seq = 1;
  const catalogResults = [];

  for (const spec of PAGE_SPECS) {
    const srcPagePath = path.join(rootDir, 'src/components/Uptown Daniela\'s Flower Shop', spec.page);
    const { data, info } = await sharp(srcPagePath).raw().toBuffer({ resolveWithObject: true });

    const isContent = (x, y) => {
      if (x < 0 || x >= info.width || y < 0 || y >= info.height) return false;
      const idx = (y * info.width + x) * info.channels;
      const r = data[idx], g = data[idx + 1], b = data[idx + 2];
      return Math.abs(r - 248) > 12 || Math.abs(g - 247) > 12 || Math.abs(b - 245) > 12;
    };

    const gridCols = [
      [15, 430],
      [535, 950],
      [1055, 1470],
      [1575, 1990]
    ];
    if (spec.page === '10.jpg') {
      gridCols[2] = [990, 1420];
      gridCols[3] = [1490, 1920];
    }
    const gridRows = [
      [80, 530],
      [640, 1100]
    ];
    if (spec.page === '10.jpg') {
      gridRows[1] = [620, 1180];
    }

    for (let i = 0; i < spec.items.length; i++) {
      const item = spec.items[i];
      const r = Math.floor(i / 4);
      const c = i % 4;
      const [colMin, colMax] = gridCols[c];
      const [rowMin, rowMax] = gridRows[r];

      let top = 9999, bottom = -1, left = 9999, right = -1;
      for (let y = rowMin; y < rowMax; y++) {
        for (let x = colMin; x < colMax; x++) {
          if (isContent(x, y)) {
            if (y < top) top = y;
            if (y > bottom) bottom = y;
            if (x < left) left = x;
            if (x > right) right = x;
          }
        }
      }

      if (top >= 9999 || bottom <= top || right <= left) {
        top = r === 0 ? 129 : 693;
        bottom = top + 388;
        left = gridCols[c][0] + 10;
        right = left + 388;
      }

      const pad = 2;
      const cropL = Math.max(0, left - pad);
      const cropT = Math.max(0, top - pad);
      const cropW = Math.min(info.width - cropL, (right - left) + pad * 2);
      const cropH = Math.min(info.height - cropT, (bottom - top) + pad * 2);

      const seqStr = String(seq).padStart(3, '0');
      const filename = `daniela_${seqStr}.jpg`;
      const filepath = path.join(outDir, filename);

      await sharp(srcPagePath)
        .extract({ left: cropL, top: cropT, width: cropW, height: cropH })
        .resize(600, 600, {
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 1 }
        })
        .sharpen()
        .jpeg({ quality: 92 })
        .toFile(filepath);

      // Also copy with item code name for convenient direct reference
      const codeFilepath = path.join(outDir, `${item.code}.jpg`);
      fs.copyFileSync(filepath, codeFilepath);

      catalogResults.push({
        catalogNumber: seq,
        code: item.code,
        name: item.name,
        category: item.cat,
        categoryLabel:
          item.cat === 'casket_spray' ? 'Casket Spray & Cover'
          : item.cat === 'combo' ? 'Grand Floral Combo Package'
          : item.cat === 'standing_spray' ? 'Standing Easel Spray'
          : item.cat === 'heart' ? 'Heart Sympathy Tribute'
          : item.cat === 'cross' ? 'Standing Faith Cross'
          : item.cat === 'custom' ? 'Custom Emblem Tribute'
          : 'Altar & Pedestal Basket',
        description:
          item.desc ||
          `${item.name} - Premium handcrafted floral tribute from Daniela's Original Harlem Collection.`,
        imageUrl: `/images/florals/danielas/${filename}`,
        pricing: {
          small: item.small,
          medium: item.med,
          large: item.large
        },
        dimensions: {
          small: item.cat === 'casket_spray' ? '36" Half Casket' : item.cat === 'basket' ? '18" Table/Altar' : '36" Standard',
          medium: item.cat === 'casket_spray' ? '48" Full Casket' : item.cat === 'basket' ? '24" Grand Altar' : '48" Deluxe',
          large: item.cat === 'casket_spray' ? '60" Grand Full Casket' : item.cat === 'basket' ? '30" Majestic Altar' : '60" Majestic'
        },
        floristPartner: "Daniela's Original"
      });

      seq++;
    }
  }

  const jsonPath = path.join(rootDir, 'src/lib/data/danielasCatalogData.json');
  fs.writeFileSync(jsonPath, JSON.stringify(catalogResults, null, 2), 'utf-8');
  console.log(`Successfully cropped and exported ${catalogResults.length} floral arrangements to ${outDir} and ${jsonPath}!`);
}

runCrop().catch(err => {
  console.error('Error running cropping script:', err);
  process.exit(1);
});
