import React, { useState } from 'react';
import { GoldenRecordCase } from '../../lib/types/funeral';
import { saveStripeTransaction, PaymentTransaction } from '../../lib/services/stripePaymentService';
import { 
  Flower2, 
  X, 
  Check, 
  Sparkles, 
  CreditCard, 
  Smartphone, 
  Heart, 
  ShieldCheck, 
  Clock, 
  MapPin, 
  Printer, 
  Info,
  ShoppingBag,
  Gift,
  Search
} from 'lucide-react';
import { BFH_FLORAL_CATALOG } from '../../lib/data/floralCatalog';

export interface FloralItem {
  id: string;
  name: string;
  category: 'casket_sprays' | 'standing_sprays' | 'wreaths' | 'hearts' | 'crosses' | 'urn_table' | 'sympathy_baskets' | 'living_plants' | 'danielas' | 'letter_tributes';
  categoryLabel: string;
  floristId: 'danielas' | 'barbaras';
  floristName: string;
  floristLocation: string;
  floristPhone: string;
  price: number;
  description: string;
  dimensions: string;
  leadTimeHours: number;
  imageUrl: string;
  popularRibbons: string[];
  suggestedPalettes: string[];
}

export const HARLEM_FLORAL_CATALOG: FloralItem[] = [
  ...BFH_FLORAL_CATALOG.map((bfhItem): FloralItem => {
    const isDaniela = bfhItem.category === 'danielas' || (bfhItem.floristPartner && bfhItem.floristPartner.includes('Daniela'));
    
    let cat: FloralItem['category'] = 'casket_sprays';
    if (bfhItem.category === 'casket_spray') cat = 'casket_sprays';
    else if (bfhItem.category === 'combo') cat = 'casket_sprays';
    else if (bfhItem.category === 'standing_spray') cat = 'standing_sprays';
    else if (bfhItem.category === 'wreath') cat = 'wreaths';
    else if (bfhItem.category === 'heart') cat = 'hearts';
    else if (bfhItem.category === 'cross') cat = 'crosses';
    else if (bfhItem.category === 'custom') cat = 'standing_sprays';
    else if (bfhItem.category === 'basket') cat = 'sympathy_baskets';
    else if (bfhItem.category === 'urn_surround') cat = 'urn_table';
    else if (bfhItem.category === 'inside_casket') cat = 'casket_sprays';
    else if (bfhItem.category === 'boutonniere_corsage') cat = 'urn_table';
    else if (bfhItem.category === 'letter_tribute') cat = 'letter_tributes';
    else if (bfhItem.category === 'danielas') cat = 'danielas';

    return {
      id: bfhItem.code.toLowerCase(),
      name: `[${bfhItem.code}] ${bfhItem.name}`,
      category: cat,
      categoryLabel: bfhItem.categoryLabel,
      floristId: isDaniela ? 'danielas' : 'barbaras',
      floristName: isDaniela ? "Daniela's Flower Shop (Broadway)" : "Barbara's Flowers (Harlem)",
      floristLocation: isDaniela ? '3650 Broadway (at W 150th St), Harlem, NY' : '2522 Frederick Douglass Blvd (at W 135th St), Harlem, NY',
      floristPhone: isDaniela ? '(212) 283-9300' : '(212) 234-3211',
      price: bfhItem.pricing.medium || bfhItem.pricing.small || 350,
      description: bfhItem.description,
      dimensions: bfhItem.dimensions.medium || bfhItem.dimensions.large || 'Standard Tribute',
      leadTimeHours: 12,
      imageUrl: bfhItem.imageUrl,
      popularRibbons: ['Loving Family', 'Beloved Mother', 'Beloved Father', 'To Our Beloved Papa', 'Forever in Our Hearts', 'In God’s Eternal Care'],
      suggestedPalettes: ['Classic Red & White', 'Pastel Garden Harmony', 'Pure Casablanca White']
    };
  }),
  {
    id: 'fl-dan-05',
    name: 'Gourmet Sympathy & Fruit Comfort Basket',
    category: 'sympathy_baskets',
    categoryLabel: 'Sympathy Gift Basket',
    floristId: 'danielas',
    floristName: "Daniela's Flower Shop (Broadway)",
    floristLocation: '3650 Broadway (at W 150th St), Harlem, NY',
    floristPhone: '(212) 283-9300',
    price: 165,
    description: 'A hand-woven wicker basket filled with fresh orchard fruits, gourmet cheeses, artisan crackers, honey, and herbal teas delivered to the family home or repast.',
    dimensions: 'Large Wicker Basket with Hand-Tied Satin Bow',
    leadTimeHours: 6,
    imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=800',
    popularRibbons: ['Thinking of You in Solace', 'Comfort for Your Family', 'With Deepest Love'],
    suggestedPalettes: ['Natural Harvest with Gold Ribbon', 'Navy & Silver Ribbon', 'Burgundy Comfort']
  },
  {
    id: 'fl-bar-05',
    name: 'Living Spathiphyllum Peace Lily in Ceramic Planter',
    category: 'living_plants',
    categoryLabel: 'Living Memorial Plant',
    floristId: 'barbaras',
    floristName: "Barbara's Flowers (Frederick Douglass Blvd)",
    floristLocation: '2522 Frederick Douglass Blvd (at W 135th St), Harlem, NY',
    floristPhone: '(212) 234-3211',
    price: 120,
    description: 'A lush, deep green blooming Peace Lily in an embossed ceramic container with Spanish moss and a personalized sympathy card. An enduring living keepsake.',
    dimensions: '8" Pot (Approx 32" Total Height)',
    leadTimeHours: 4,
    imageUrl: 'https://images.unsplash.com/photo-1596724855018-052445851410?auto=format&fit=crop&q=80&w=800',
    popularRibbons: ['May Peace Flourish', 'A Living Remembrance', 'In Our Prayers'],
    suggestedPalettes: ['Ceramic White Planter', 'Matte Bronze Ceramic', 'Natural Terracotta']
  }
];

interface FloralTributeShopModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeCase: GoldenRecordCase;
  onOrderPlaced?: (order: {
    orderId: string;
    item: FloralItem;
    totalAmount: number;
    ribbonText: string;
    cardMessage: string;
    deliveryLocation: string;
    senderName: string;
    senderPhone: string;
    paymentTxnId: string;
    chargeId: string;
    floristName: string;
    floristPhone: string;
    timestamp: string;
  }) => void;
}

export const FloralTributeShopModal: React.FC<FloralTributeShopModalProps> = ({
  isOpen,
  onClose,
  activeCase,
  onOrderPlaced
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [floristFilter, setFloristFilter] = useState<'all' | 'danielas' | 'barbaras'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedItem, setSelectedItem] = useState<FloralItem | null>(null);
  
  // Customization & Ordering form state
  const [ribbonText, setRibbonText] = useState<string>('');
  const [includeRibbon, setIncludeRibbon] = useState<boolean>(true);
  const [cardMessage, setCardMessage] = useState<string>(
    `Dear ${activeCase.informant.fullName.split(' ')[0] || 'Family'},\n\nOur hearts and prayers are with you during this time of sorrow. May ${activeCase.decedent.legalName}'s blessed memory bring peace and comfort to your hearts.\n\nWith love and sympathy,`
  );
  const [deliveryLocation, setDeliveryLocation] = useState<string>(
    `Benta's Funeral Home - Chapel 1 Sanctuary (630 Saint Nicholas Ave, New York, NY 10030)`
  );
  const [senderName, setSenderName] = useState<string>('The Community & Friends');
  const [senderEmail, setSenderEmail] = useState<string>('tributes@bentasfuneralhome.com');
  const [senderPhone, setSenderPhone] = useState<string>('(212) 281-8850');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'apple_pay' | 'split_pay'>('card');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [completedOrder, setCompletedOrder] = useState<any | null>(null);

  if (!isOpen) return null;

  const categories = [
    { id: 'all', label: `All Arrangements (${HARLEM_FLORAL_CATALOG.length})` },
    { id: 'casket_sprays', label: 'Casket Sprays & Covers' },
    { id: 'wreaths', label: 'Standing Wreaths' },
    { id: 'hearts', label: 'Standing Hearts' },
    { id: 'crosses', label: 'Standing Crosses' },
    { id: 'standing_sprays', label: 'Standing Easel Sprays' },
    { id: 'urn_table', label: 'Urn & Table Pieces' },
    { id: 'danielas', label: "Uptown Daniela's (34)" },
    { id: 'letter_tributes', label: 'Custom Letter Tributes' },
    { id: 'sympathy_baskets', label: 'Sympathy Baskets' },
    { id: 'living_plants', label: 'Living Plants' }
  ];

  const filteredItems = HARLEM_FLORAL_CATALOG.filter(item => {
    const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesFlorist = floristFilter === 'all' || item.floristId === floristFilter;
    const matchesSearch = !searchQuery.trim() || 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesFlorist && matchesSearch;
  });

  const handleSelectItemForCustomization = (item: FloralItem) => {
    setSelectedItem(item);
    setRibbonText(item.popularRibbons[0] || 'In Loving Memory');
    setCompletedOrder(null);
  };

  const handleProcessPayment = async () => {
    if (!selectedItem) return;
    setIsProcessing(true);

    // Simulate Stripe Payment & Vendor Dispatch
    await new Promise(r => setTimeout(r, 1400));

    const totalAmount = selectedItem.price + (includeRibbon && ribbonText ? 25 : 0);
    const txnId = `txn_fl_${Date.now()}`;
    const chargeId = `ch_stripe_fl_${Math.floor(Math.random() * 1000000)}`;

    const newTxn: PaymentTransaction = {
      id: txnId,
      caseId: activeCase.id,
      caseNumber: activeCase.caseNumber,
      decedentName: activeCase.decedent.legalName,
      payerName: senderName,
      payerEmail: senderEmail,
      payerPhone: senderPhone,
      amount: totalAmount,
      feeAmount: Number((totalAmount * 0.029 + 0.30).toFixed(2)),
      netPayout: Number((totalAmount - (totalAmount * 0.029 + 0.30)).toFixed(2)),
      paymentMethod: paymentMethod === 'apple_pay' ? 'apple_pay' : 'card',
      status: 'succeeded',
      chargeId: chargeId,
      receiptUrl: `https://pay.bentasfuneralhome.com/receipt/${txnId}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      tributeMessage: `Floral Order: ${selectedItem.name} via ${selectedItem.floristName}`,
      isSplitPay: paymentMethod === 'split_pay'
    };

    saveStripeTransaction(newTxn);

    const orderData = {
      orderId: `BFH-FL-${Date.now().toString().slice(-6)}`,
      item: selectedItem,
      totalAmount,
      ribbonText: includeRibbon ? ribbonText : 'None',
      cardMessage,
      deliveryLocation,
      senderName,
      senderPhone,
      paymentTxnId: txnId,
      chargeId,
      floristName: selectedItem.floristName,
      floristPhone: selectedItem.floristPhone,
      timestamp: new Date().toLocaleString()
    };

    setCompletedOrder(orderData);
    setIsProcessing(false);

    if (onOrderPlaced) {
      onOrderPlaced(orderData);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-stone-900 border border-amber-900/50 rounded-2xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto text-stone-100">
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-stone-950 via-stone-900 to-amber-950/40 border-b border-amber-900/40 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-inner">
              <Flower2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-serif font-bold text-amber-100">
                  Harlem Florist Guild & Sympathy Tribute Boutique
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-800/60 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Stripe 1-Click Pay
                </span>
              </div>
              <p className="text-xs text-stone-400 mt-0.5">
                Handcrafted for <strong className="text-stone-200">{activeCase.decedent.legalName}</strong> (Case #{activeCase.caseNumber}) • Uptown Daniela’s & Barbara’s Flowers
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-white rounded-lg bg-stone-800/60 hover:bg-stone-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {completedOrder ? (
            /* Order Success Receipt View */
            <div className="bg-stone-950/80 border border-emerald-500/40 rounded-2xl p-8 text-center space-y-6 max-w-2xl mx-auto shadow-2xl">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center mx-auto text-emerald-400">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>

              <div>
                <span className="text-xs uppercase font-bold tracking-widest text-emerald-400">Payment Succeeded & Dispatched</span>
                <h3 className="text-2xl font-serif font-bold text-stone-100 mt-1">Floral Tribute Order Confirmed</h3>
                <p className="text-sm text-stone-400 mt-1">
                  Order #{completedOrder.orderId} • Billed ${completedOrder.totalAmount}.00 to {completedOrder.senderName}
                </p>
              </div>

              <div className="bg-stone-900/90 rounded-xl p-5 border border-stone-800 text-left space-y-3 text-xs">
                <div className="flex justify-between items-center border-b border-stone-800 pb-2">
                  <span className="text-stone-400">Floral Arrangement:</span>
                  <span className="font-bold text-amber-200">{completedOrder.item.name}</span>
                </div>
                <div className="flex justify-between items-center border-b border-stone-800 pb-2">
                  <span className="text-stone-400">Partner Florist:</span>
                  <span className="font-medium text-stone-200">{completedOrder.floristName} ({completedOrder.floristPhone})</span>
                </div>
                <div className="flex justify-between items-center border-b border-stone-800 pb-2">
                  <span className="text-stone-400">Custom Ribbon Banner:</span>
                  <span className="font-medium text-amber-300">"{completedOrder.ribbonText}"</span>
                </div>
                <div className="flex justify-between items-center border-b border-stone-800 pb-2">
                  <span className="text-stone-400">Delivery Destination:</span>
                  <span className="font-medium text-stone-200">{completedOrder.deliveryLocation}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-stone-400">Stripe Live Auth ID:</span>
                  <span className="font-mono text-stone-400">{completedOrder.chargeId}</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-800/40 text-left flex items-start gap-3">
                <Info className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-200/90 leading-relaxed">
                  An instant dispatch notification with delivery instructions has been sent to <strong>{completedOrder.floristName}</strong>. The arrangement will be inspected by Director Jason Benta upon arrival at 630 St. Nicholas Ave.
                </p>
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => window.print()}
                  className="px-5 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold flex items-center gap-2 transition"
                >
                  <Printer className="w-4 h-4" /> Print Floral Receipt
                </button>
                <button
                  onClick={() => {
                    setCompletedOrder(null);
                    setSelectedItem(null);
                  }}
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold transition shadow-md"
                >
                  Browse More Arrangements
                </button>
              </div>
            </div>
          ) : selectedItem ? (
            /* Customization & Checkout Step */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left Column: Item Review */}
              <div className="lg:col-span-5 space-y-4">
                <div className="relative rounded-2xl overflow-hidden border border-stone-800 bg-stone-950 aspect-[4/3] group">
                  <img 
                    src={selectedItem.imageUrl} 
                    alt={selectedItem.name} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-transparent opacity-80" />
                  <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                    <div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 border border-amber-500/40 text-amber-300">
                        {selectedItem.categoryLabel}
                      </span>
                      <h4 className="text-base font-serif font-bold text-white mt-1">{selectedItem.name}</h4>
                    </div>
                    <span className="text-xl font-bold text-amber-400">${selectedItem.price}</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-stone-950/70 border border-stone-800/80 space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-stone-300 font-medium">
                    <MapPin className="w-4 h-4 text-amber-400" />
                    <span>Florist: <strong>{selectedItem.floristName}</strong></span>
                  </div>
                  <div className="flex items-center gap-2 text-stone-400">
                    <Clock className="w-4 h-4 text-emerald-400" />
                    <span>Lead time: {selectedItem.leadTimeHours} hrs • Dimensions: {selectedItem.dimensions}</span>
                  </div>
                  <p className="text-stone-400 pt-1 leading-relaxed border-t border-stone-900 mt-2">
                    {selectedItem.description}
                  </p>
                </div>

                <button
                  onClick={() => setSelectedItem(null)}
                  className="text-xs text-stone-400 hover:text-amber-300 flex items-center gap-1.5 transition"
                >
                  ← Choose a different floral piece
                </button>
              </div>

              {/* Right Column: Customization & Checkout Form */}
              <div className="lg:col-span-7 space-y-5 bg-stone-950/50 border border-stone-800/80 rounded-2xl p-6">
                
                {/* 1. Ribbon Customization */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-amber-200 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" /> 1. Gold Embossed Ribbon Banner
                    </label>
                    <label className="text-xs text-stone-400 flex items-center gap-1.5 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={includeRibbon} 
                        onChange={(e) => setIncludeRibbon(e.target.checked)} 
                        className="rounded border-stone-700 bg-stone-900 text-amber-500 focus:ring-0"
                      />
                      Include Satin Banner (+ $25)
                    </label>
                  </div>

                  {includeRibbon && (
                    <div className="space-y-2">
                      <input 
                        type="text"
                        value={ribbonText}
                        onChange={(e) => setRibbonText(e.target.value)}
                        placeholder="e.g. Beloved Mother, Rest in Heavenly Peace"
                        className="w-full px-3.5 py-2 rounded-xl bg-stone-900 border border-amber-900/60 text-stone-100 text-sm focus:outline-none focus:border-amber-500"
                      />
                      <div className="flex flex-wrap gap-1.5">
                        {selectedItem.popularRibbons.map((rib, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setRibbonText(rib)}
                            className="px-2 py-0.5 rounded-full text-[11px] bg-stone-900/90 border border-stone-800 text-stone-300 hover:border-amber-500/50 hover:text-amber-200 transition"
                          >
                            + "{rib}"
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* 2. Enclosure Card Message */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-amber-200 uppercase tracking-wider flex items-center gap-1.5">
                    <Heart className="w-3.5 h-3.5 text-amber-400" /> 2. Personal Sympathy Enclosure Card
                  </label>
                  <textarea 
                    rows={3}
                    value={cardMessage}
                    onChange={(e) => setCardMessage(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-stone-900 border border-stone-800 text-stone-100 text-xs focus:outline-none focus:border-amber-500"
                    placeholder="Write a heartfelt condolence note to the family..."
                  />
                </div>

                {/* 3. Delivery Venue Selection */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-amber-200 uppercase tracking-wider flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-amber-400" /> 3. Service Venue / Delivery Destination
                  </label>
                  <select 
                    value={deliveryLocation}
                    onChange={(e) => setDeliveryLocation(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-stone-900 border border-stone-800 text-stone-100 text-xs focus:outline-none focus:border-amber-500"
                  >
                    <option value="Benta's Funeral Home - Chapel 1 Sanctuary (630 Saint Nicholas Ave, New York, NY 10030)">
                      Benta's Funeral Home - Chapel 1 Main Sanctuary (630 St. Nicholas Ave)
                    </option>
                    <option value="Benta's Funeral Home - Chapel 2 Parlor (630 Saint Nicholas Ave, New York, NY 10030)">
                      Benta's Funeral Home - Chapel 2 Viewing Parlor
                    </option>
                    <option value="Family Residence (409 Edgecombe Ave, New York, NY 10032)">
                      Family Residence & Repast ({activeCase.informant.fullName})
                    </option>
                    <option value="Woodlawn Cemetery & Crematory (4199 Webster Ave, Bronx, NY 10470)">
                      Woodlawn Cemetery Gates & Committal (Bronx, NY)
                    </option>
                  </select>
                </div>

                {/* 4. Sender Contact & Payment */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div>
                    <label className="text-[11px] text-stone-400 block mb-1">Your Full Name</label>
                    <input 
                      type="text"
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-stone-900 border border-stone-800 text-xs text-stone-100 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-stone-400 block mb-1">Contact Email</label>
                    <input 
                      type="email"
                      value={senderEmail}
                      onChange={(e) => setSenderEmail(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-stone-900 border border-stone-800 text-xs text-stone-100 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-stone-400 block mb-1">Contact Phone</label>
                    <input 
                      type="text"
                      value={senderPhone}
                      onChange={(e) => setSenderPhone(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-stone-900 border border-stone-800 text-xs text-stone-100 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                {/* Payment Selector */}
                <div className="p-4 rounded-xl bg-stone-900/90 border border-amber-900/40 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-stone-400">Floral Piece Price:</span>
                    <span className="font-bold text-stone-200">${selectedItem.price}.00</span>
                  </div>
                  {includeRibbon && (
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-stone-400">Custom Embossed Ribbon Banner:</span>
                      <span className="font-bold text-stone-200">$25.00</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-sm font-bold border-t border-stone-800 pt-2 text-amber-300">
                    <span>Total Due (Tax & Delivery Included):</span>
                    <span>${selectedItem.price + (includeRibbon ? 25 : 0)}.00</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('card')}
                      className={`p-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 border transition ${
                        paymentMethod === 'card' 
                          ? 'bg-amber-500/20 border-amber-500 text-amber-300' 
                          : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-stone-200'
                      }`}
                    >
                      <CreditCard className="w-3.5 h-3.5" /> Credit Card
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('apple_pay')}
                      className={`p-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 border transition ${
                        paymentMethod === 'apple_pay' 
                          ? 'bg-amber-500/20 border-amber-500 text-amber-300' 
                          : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-stone-200'
                      }`}
                    >
                      <Smartphone className="w-3.5 h-3.5" /> Apple Pay
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('split_pay')}
                      className={`p-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 border transition ${
                        paymentMethod === 'split_pay' 
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300' 
                          : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-stone-200'
                      }`}
                    >
                      <Gift className="w-3.5 h-3.5" /> Split-Pay
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleProcessPayment}
                    disabled={isProcessing}
                    className="w-full mt-3 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-sm flex items-center justify-center gap-2 transition shadow-lg disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <>
                        <div className="w-4 h-4 border-2 border-stone-950 border-t-transparent rounded-full animate-spin" />
                        Authorizing Stripe & Dispatching to {selectedItem.floristName}...
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        Complete ${selectedItem.price + (includeRibbon ? 25 : 0)}.00 Floral Order
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Catalog Grid View */
            <div className="space-y-6">
              
              {/* Filter Tabs & Search */}
              <div className="space-y-3 border-b border-stone-800 pb-4">
                <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
                  <div className="relative flex-1 max-w-md">
                    <Search className="w-4 h-4 absolute left-3 top-2.5 text-stone-400" />
                    <input
                      type="text"
                      placeholder="Search 70+ arrangements, roses, lilies, sprays, or tribute codes..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-xs focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div className="flex items-center gap-2 text-xs self-end sm:self-center">
                    <span className="text-stone-400">Florist:</span>
                    <button
                      onClick={() => setFloristFilter('all')}
                      className={`px-2.5 py-1 rounded-lg border text-[11px] font-medium ${
                        floristFilter === 'all' 
                          ? 'border-amber-500 text-amber-300 bg-amber-500/10' 
                          : 'border-stone-800 text-stone-400 hover:text-stone-200'
                      }`}
                    >
                      All Harlem
                    </button>
                    <button
                      onClick={() => setFloristFilter('danielas')}
                      className={`px-2.5 py-1 rounded-lg border text-[11px] font-medium ${
                        floristFilter === 'danielas' 
                          ? 'border-amber-500 text-amber-300 bg-amber-500/10' 
                          : 'border-stone-800 text-stone-400 hover:text-stone-200'
                      }`}
                    >
                      Daniela's (Broadway)
                    </button>
                    <button
                      onClick={() => setFloristFilter('barbaras')}
                      className={`px-2.5 py-1 rounded-lg border text-[11px] font-medium ${
                        floristFilter === 'barbaras' 
                          ? 'border-amber-500 text-amber-300 bg-amber-500/10' 
                          : 'border-stone-800 text-stone-400 hover:text-stone-200'
                      }`}
                    >
                      Barbara's (FDB)
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {categories.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium transition ${
                        selectedCategory === cat.id 
                          ? 'bg-amber-500 text-stone-950 font-bold shadow' 
                          : 'bg-stone-950 text-stone-400 hover:bg-stone-800 hover:text-stone-200 border border-stone-800'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Items Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredItems.map(item => (
                  <div 
                    key={item.id}
                    className="bg-stone-950/70 border border-stone-800 hover:border-amber-500/60 rounded-2xl overflow-hidden flex flex-col transition group hover:shadow-xl hover:shadow-amber-950/20"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden bg-stone-900">
                      <img 
                        src={item.imageUrl} 
                        alt={item.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />
                      <div className="absolute top-2.5 left-2.5">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-stone-950/80 backdrop-blur-md text-amber-300 border border-amber-500/30">
                          {item.categoryLabel}
                        </span>
                      </div>
                      <div className="absolute top-2.5 right-2.5">
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-stone-950/90 text-amber-400 border border-stone-700">
                          ${item.price}
                        </span>
                      </div>
                    </div>

                    <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        <h4 className="font-serif font-bold text-stone-100 group-hover:text-amber-200 transition text-sm">
                          {item.name}
                        </h4>
                        <p className="text-xs text-stone-400 mt-1 line-clamp-2 leading-relaxed">
                          {item.description}
                        </p>
                      </div>

                      <div className="space-y-2 pt-2 border-t border-stone-900">
                        <div className="flex items-center justify-between text-[11px] text-stone-400">
                          <span>{item.floristName.split(' ')[0]} Flowers</span>
                          <span>{item.dimensions}</span>
                        </div>

                        <button
                          onClick={() => handleSelectItemForCustomization(item)}
                          className="w-full py-2 rounded-xl bg-stone-800 hover:bg-amber-500 hover:text-stone-950 text-stone-200 text-xs font-bold flex items-center justify-center gap-1.5 transition"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" /> Customize & Send Tribute
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-950 border-t border-stone-800/80 flex items-center justify-between text-xs text-stone-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>256-Bit SSL Encrypted • Direct Licensed Florist Dispatch • 100% Guaranteed Freshness</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-300 font-medium transition"
          >
            Close Boutique
          </button>
        </div>

      </div>
    </div>
  );
};
