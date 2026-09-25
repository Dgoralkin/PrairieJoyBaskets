import { useMemo, useState } from 'react';
import {
  Building2,
  Check,
  CheckCircle2,
  MapPin,
  Minus,
  Plus,
  ShoppingBag,
  ShoppingCart,
  Sparkles,
  Star,
  Trash2,
  Truck,
  Wand2,
  X,
} from 'lucide-react';

type Basket = {
  id: string;
  title: string;
  category: string;
  price: number;
  rating: number;
  reviews: number;
  image: string;
  description: string;
  tags: string[];
  contents: string[];
};

type Addon = {
  id: string;
  name: string;
  price: number;
  category: string;
};

type Zone = {
  id: string;
  name: string;
  price: number;
  estDays: string;
};

type CartItem = Basket & {
  qty: number;
  isCustom?: boolean;
  contents?: string[];
};

const CATALOG_BASKETS: Basket[] = [
  {
    id: 'b1',
    title: 'Prairie Gourmet Feast',
    category: 'Gourmet Food',
    price: 115,
    rating: 4.9,
    reviews: 42,
    image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80',
    description:
      'A rich selection of Manitoba artisan cheeses, wild flower honey, smokehouse summer sausage, and stone-ground crackers.',
    tags: ['Local Classic', 'Best Seller'],
    contents: [
      'Manitoba Honey Co. Clover Honey',
      'Bothwell Smoked Gouda',
      'Prairie Smokehouse Sausage',
      'Cornell Cracker Co. Wafers',
    ],
  },
  {
    id: 'b2',
    title: 'Bison & Brews Craft Box',
    category: 'Craft Drinks',
    price: 95,
    rating: 4.8,
    reviews: 38,
    image: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=800&q=80',
    description:
      'Featuring local Winnipeg microbrew snacks, bison jerky strips, smoked almonds, and custom branded beer glasses.',
    tags: ['For Him', 'B2B Favorite'],
    contents: [
      'Winnipeg Bison Jerky (100g)',
      'Kilter Brewery Snacks',
      'Transcona Roasted Nuts',
      'Custom Cedar Crate',
    ],
  },
  {
    id: 'b3',
    title: 'Exchange District Delights',
    category: 'Sweet Treats',
    price: 85,
    rating: 5.0,
    reviews: 29,
    image: 'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?auto=format&fit=crop&w=800&q=80',
    description:
      'Inspired by the creative cobblestone district: hand-dipped truffles, single-origin espresso beans, and cinnamon-dusted pastries.',
    tags: ['Sweet Tooth', 'Artisan'],
    contents: [
      'DeLuca Espresso Whole Beans',
      'Asessippi Truffles (6pc)',
      'Wolseley Jam Co. Raspberry Jam',
    ],
  },
  {
    id: 'b4',
    title: 'Corporate Appreciation Bundle',
    category: 'Corporate',
    price: 140,
    rating: 4.9,
    reviews: 64,
    image: 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&w=800&q=80',
    description:
      'Impress clients or team members with an elegant wooden box packed with fair-trade coffee, gourmet cookies, and custom logo ribbon.',
    tags: ['Bulk Available', 'Corporate'],
    contents: [
      'Dogwood Coffee Beans',
      'Artisan Stroopwafels',
      'Forks Market Nut Mix',
      'Saskatoon Berry Jam',
    ],
  },
  {
    id: 'b5',
    title: 'St. Vital Spa & Botanical Relax',
    category: 'Self Care',
    price: 110,
    rating: 4.7,
    reviews: 19,
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
    description:
      'Nourishing local organic bath salts, lavender infused candles, artisan soaps, and soothing chamomile tea.',
    tags: ['Relaxation', 'Self Care'],
    contents: [
      'River Heights Botanical Soap',
      'Manitoba Lavender Candle',
      'Chamomile Tea Tins',
      'Organic Cotton Towel',
    ],
  },
  {
    id: 'b6',
    title: 'The Golden Boy Celebration Crate',
    category: 'Gourmet Food',
    price: 175,
    rating: 5.0,
    reviews: 51,
    image: 'https://images.unsplash.com/photo-1577998474517-7eeeed4e448a?auto=format&fit=crop&w=800&q=80',
    description:
      'Our ultimate luxury basket packed with premium wine jams, cured meats, artisan chocolates, and handcrafted wooden keepsake box.',
    tags: ['Luxury', 'VIP'],
    contents: [
      'Full Luxury Spread',
      'Custom Wooden Keepsake Box',
      'Manitoba Maple Syrup',
      'Artisan Cheese Knife Set',
    ],
  },
];

const CUSTOM_ADDONS: Addon[] = [
  { id: 'c1', name: 'Manitoba Wildflower Honey (250ml)', price: 12, category: 'Food' },
  { id: 'c2', name: 'Wolseley Artisan Strawberry Jam', price: 9, category: 'Food' },
  { id: 'c3', name: 'Exchange District Roast Coffee Beans', price: 16, category: 'Drink' },
  { id: 'c4', name: 'Handcrafted Bison Leather Coaster Set', price: 22, category: 'Keepsake' },
  { id: 'c5', name: 'Bothwell Smoked Cheddar Wedge', price: 11, category: 'Food' },
  { id: 'c6', name: 'Asessippi Dark Chocolate Truffles', price: 14, category: 'Food' },
  { id: 'c7', name: 'Winnipeg Craft Soda 4-Pack', price: 12, category: 'Drink' },
  { id: 'c8', name: 'Cedar Gift Crate Upgrade', price: 18, category: 'Packaging' },
];

const WINNIPEG_ZONES: Zone[] = [
  { id: 'z1', name: 'Downtown / Exchange District / Osborne', price: 10, estDays: 'Same-Day Available' },
  { id: 'z2', name: 'St. Vital / Linden Woods / Tuxedo', price: 12, estDays: 'Next-Day' },
  { id: 'z3', name: 'East Kildonan / Transcona / St. Boniface', price: 12, estDays: 'Next-Day' },
  { id: 'z4', name: 'River Heights / Fort Garry / Bridgewater', price: 10, estDays: 'Same-Day Available' },
  { id: 'z5', name: 'Outer Perimeter & Headingley', price: 18, estDays: '2-3 Business Days' },
];

const filterOptions = ['All', 'Gourmet Food', 'Craft Drinks', 'Sweet Treats', 'Corporate', 'Self Care'];

function App() {
  const [selectedZone, setSelectedZone] = useState<Zone>(WINNIPEG_ZONES[0]);
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCorporateDrawerOpen, setIsCorporateDrawerOpen] = useState(false);
  const [isCustomBuilderOpen, setIsCustomBuilderOpen] = useState(false);
  const [customBasketName, setCustomBasketName] = useState('My Winnipeg Custom Basket');
  const [customItems, setCustomItems] = useState<Addon[]>([CUSTOM_ADDONS[0], CUSTOM_ADDONS[2]]);
  const [corpForm, setCorpForm] = useState({
    companyName: '',
    contactEmail: '',
    quantity: 20,
    deliveryDate: '',
    notes: '',
  });
  const [corpSubmitted, setCorpSubmitted] = useState(false);

  const filteredCatalog = useMemo(() => {
    if (categoryFilter === 'All') {
      return CATALOG_BASKETS;
    }

    return CATALOG_BASKETS.filter((basket) => basket.category === categoryFilter);
  }, [categoryFilter]);

  const addToCart = (item: Basket) => {
    setCart((prev) => {
      const existing = prev.find((entry) => entry.id === item.id);
      if (existing) {
        return prev.map((entry) =>
          entry.id === item.id ? { ...entry, qty: entry.qty + 1 } : entry,
        );
      }

      return [...prev, { ...item, qty: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQty = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const nextQty = item.qty + delta;
            return nextQty > 0 ? { ...item, qty: nextQty } : null;
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null),
    );
  };

  const addCustomBasketToCart = () => {
    const totalCustomPrice = 20 + customItems.reduce((sum, item) => sum + item.price, 0);
    const newCustomItem: CartItem = {
      id: `custom-${Date.now()}`,
      title: customBasketName,
      price: totalCustomPrice,
      category: 'Custom',
      rating: 5,
      reviews: 0,
      image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=800&q=80',
      description: 'A custom Winnipeg gift basket assembled for your occasion.',
      tags: ['Custom', 'Handpicked'],
      contents: customItems.map((item) => item.name),
      isCustom: true,
      qty: 1,
    };

    setCart((prev) => [...prev, newCustomItem]);
    setIsCustomBuilderOpen(false);
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  return (
    <div className="flex min-h-screen flex-col bg-cream-50 text-slate-800 antialiased selection:bg-amber-100 selection:text-amber-900">
      <div className="bg-amber-900 px-4 py-2 text-center text-xs font-medium text-amber-100">
        <div className="mx-auto flex items-center justify-center gap-2">
          <Truck className="h-4 w-4" />
          <span>Hand-Delivered Across Winnipeg & Surrounding Areas | Free Local Pickup Available at The Forks</span>
        </div>
      </div>

    <header className="sticky top-0 z-30 border-b border-cream-200 bg-cream-50/90 backdrop-blur-md">
    <div className="mx-auto max-w-7xl px-4 py-2.5 sm:px-6 lg:px-8">
        
        {/* Row 1: Logo & Top Actions */}
        <div className="flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Brand Logo & Name */}
        <div 
            className="flex cursor-pointer items-center gap-2 sm:gap-3 min-w-0" 
            onClick={() => setCategoryFilter('All')}
        >
            <div className="h-10 w-10 sm:h-14 sm:w-14 flex-shrink-0 flex items-center justify-center">
            <img src="/PJB_Logo.png" alt="Prairie Joy Baskets Co. Logo" className="h-full w-full object-contain" />
            </div>

            <div className="min-w-0">
            <h1 className="font-serif text-sm sm:text-lg font-bold leading-tight text-slate-900 truncate">
                Prairie Joy Baskets Co.
            </h1>
            <p className="text-[10px] sm:text-xs font-medium text-amber-800 truncate">
                Local Prairie Artisans - Winnipeg
            </p>
            </div>
        </div>

        {/* Action Buttons (Corporate + Cart) */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            
            {/* Corporate Orders Button */}
            <button
            onClick={() => setIsCorporateDrawerOpen(true)}
            className="flex items-center gap-1.5 rounded-lg bg-slate-900 px-2.5 sm:px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-slate-800"
            title="Corporate Orders"
            >
            <Building2 className="h-4 w-4 text-amber-500 flex-shrink-0" />
            <span className="hidden xs:inline sm:inline">Corporate</span>
            </button>

            {/* Cart Icon */}
            <button
            onClick={() => setIsCartOpen(true)}
            className="relative flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-amber-100/60 text-amber-900 transition hover:bg-amber-100"
            >
            <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
            {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 sm:h-5 sm:w-5 items-center justify-center rounded-full bg-amber-600 text-[10px] font-bold text-white shadow">
                {cartCount}
                </span>
            )}
            </button>
        </div>
        </div>

        {/* Row 2: Delivery Zone Selector */}
        <div className="mt-2 flex items-center justify-center border-t border-cream-200/50 pt-2">
        <div className="flex items-center gap-1.5 sm:gap-2 rounded-full border border-cream-200 bg-white px-3 py-1 text-[11px] sm:text-xs shadow-sm max-w-full">
            <MapPin className="h-3.5 w-3.5 text-amber-600 flex-shrink-0" />
            <span className="font-medium text-slate-500 whitespace-nowrap">Delivery Zone:</span>
            <select
            className="cursor-pointer bg-transparent font-semibold text-slate-800 focus:outline-none truncate max-w-[160px] sm:max-w-none"
            value={selectedZone.id}
            onChange={(event) => {
                const nextZone = WINNIPEG_ZONES.find((zone) => zone.id === event.target.value);
                if (nextZone) setSelectedZone(nextZone);
            }}
            >
            {WINNIPEG_ZONES.map((zone) => (
                <option key={zone.id} value={zone.id}>
                {zone.name} (${zone.price})
                </option>
            ))}
            </select>
        </div>
        </div>

    </div>
    </header>


      <section className="relative overflow-hidden border-b border-cream-200 bg-gradient-to-b from-amber-50 to-cream-50 py-12 lg:py-16">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 px-4 sm:px-6 md:flex-row lg:px-8">
          <div className="max-w-xl space-y-4 text-center md:text-left">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
              <Sparkles className="h-3.5 w-3.5" />
              100% Handcrafted Manitoba Products
            </span>
            <h2 className="font-serif text-3xl font-bold leading-tight text-slate-900 sm:text-4xl lg:text-5xl">
              Thoughtful Gifts, Delivered Fresh in Winnipeg
            </h2>
            <p className="text-sm leading-relaxed text-slate-600 sm:text-base">
              Celebrate birthdays, team milestones, and holiday seasons with locally sourced artisan cheeses, craft beverages, and prairie delights.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2 md:justify-start">
              <button
                onClick={() => setIsCustomBuilderOpen(true)}
                className="flex items-center gap-2 rounded-xl bg-amber-600 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-amber-600/20 transition hover:bg-amber-700"
              >
                <Wand2 className="h-4 w-4" />
                Build Your Own Custom Basket
              </button>
              <button
                onClick={() => setIsCorporateDrawerOpen(true)}
                className="rounded-xl border border-cream-200 bg-white px-5 py-3 text-sm font-semibold text-slate-800 transition hover:bg-cream-100 sm:hidden"
              >
                Corporate Bulk Quotes
              </button>
            </div>
          </div>

          <div className="relative w-full max-w-md md:w-1/2">
            <div className="aspect-4/3 overflow-hidden rounded-2xl border-4 border-white shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80"
                alt="Winnipeg Gift Basket"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-4 -left-4 flex items-center gap-3 rounded-xl border border-cream-200 bg-white p-3 shadow-lg">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-xs font-bold text-amber-800">
                4.9 ★
              </div>
              <div className="text-xs">
                <p className="font-bold text-slate-900">Over 1,200+ Delivered</p>
                <p className="text-slate-500">Trusted by local corporations</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto flex w-full max-w-7xl flex-grow flex-col px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="font-serif text-2xl font-bold text-slate-900">Curated Collection</h3>
            <p className="mt-1 text-xs text-slate-500">Select from our signature pre-arranged gift packages</p>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {filterOptions.map((option) => (
              <button
                key={option}
                onClick={() => setCategoryFilter(option)}
                className={`whitespace-nowrap rounded-xl px-4 py-2 text-xs font-semibold transition ${
                  categoryFilter === option
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'border border-cream-200 bg-white text-slate-600 hover:bg-cream-100'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCatalog.map((basket) => (
            <div key={basket.id} className="group flex flex-col overflow-hidden rounded-2xl border border-cream-200 bg-white shadow-sm transition hover:shadow-md">
              <div className="relative aspect-4/3 overflow-hidden bg-cream-100">
                <img
                  src={basket.image}
                  alt={basket.title}
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  onError={(event) => {
                    event.currentTarget.src = 'https://placehold.co/600x400/f4efe6/78350f?text=Winnipeg+Basket+Co.';
                  }}
                />
                <div className="absolute left-3 top-3 flex flex-wrap gap-1">
                  {basket.tags.map((tag) => (
                    <span key={tag} className="rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold text-slate-800 shadow-sm backdrop-blur-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex flex-grow flex-col p-5">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-800">{basket.category}</span>
                  <div className="flex items-center gap-1 text-xs font-semibold text-slate-700">
                    <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                    <span>{basket.rating}</span>
                    <span className="text-slate-400">({basket.reviews})</span>
                  </div>
                </div>

                <h4 className="font-serif text-lg font-bold text-slate-900 transition group-hover:text-amber-800">
                  {basket.title}
                </h4>
                <p className="mt-2 text-xs text-slate-600">{basket.description}</p>

                <div className="mt-4 border-t border-cream-100 pt-3">
                  <p className="mb-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-500">Includes:</p>
                  <ul className="space-y-1 text-xs text-slate-600">
                    {basket.contents.map((item, index) => (
                      <li key={`${basket.id}-${index}`} className="flex items-center gap-1.5">
                        <Check className="h-3 w-3 flex-shrink-0 text-amber-600" />
                        <span className="truncate">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-auto flex items-center justify-between gap-2 pt-5">
                  <div>
                    <span className="block text-xs text-slate-400">Starting at</span>
                    <span className="text-xl font-bold text-slate-900">${basket.price} CAD</span>
                  </div>
                  <button
                    onClick={() => addToCart(basket)}
                    className="flex items-center gap-1.5 rounded-xl bg-amber-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-amber-700"
                  >
                    <Plus className="h-4 w-4" />
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {isCustomBuilderOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between bg-amber-900 p-5 text-white">
              <div className="flex items-center gap-2">
                <Wand2 className="h-5 w-5 text-amber-400" />
                <h3 className="font-serif text-lg font-bold">Custom Gift Basket Studio</h3>
              </div>
              <button onClick={() => setIsCustomBuilderOpen(false)} className="text-amber-200 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-grow space-y-6 overflow-y-auto p-6">
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-700">Basket Title</label>
                <input
                  type="text"
                  value={customBasketName}
                  onChange={(event) => setCustomBasketName(event.target.value)}
                  className="w-full rounded-xl border border-cream-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-700">Select Prairie Artisan Components</label>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {CUSTOM_ADDONS.map((addon) => {
                    const isSelected = customItems.some((item) => item.id === addon.id);

                    return (
                      <div
                        key={addon.id}
                        onClick={() => {
                          if (isSelected) {
                            setCustomItems((prev) => prev.filter((item) => item.id !== addon.id));
                            return;
                          }

                          setCustomItems((prev) => [...prev, addon]);
                        }}
                        className={`flex cursor-pointer items-center justify-between rounded-xl border p-3 transition ${
                          isSelected ? 'border-amber-600 bg-amber-50/60' : 'border-cream-200 hover:bg-cream-50'
                        }`}
                      >
                        <div>
                          <p className="text-xs font-bold text-slate-800">{addon.name}</p>
                          <span className="text-[11px] font-semibold text-amber-800">+${addon.price} CAD</span>
                        </div>
                        <div
                          className={`flex h-5 w-5 items-center justify-center rounded-md border ${
                            isSelected ? 'border-amber-600 bg-amber-600 text-white' : 'border-slate-300'
                          }`}
                        >
                          {isSelected && <Check className="h-3.5 w-3.5" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-2 rounded-xl bg-cream-100 p-4">
                <div className="flex justify-between text-xs text-slate-600">
                  <span>Handcrafted Cedar Box & Packaging Fee:</span>
                  <span className="font-semibold">$20 CAD</span>
                </div>
                <div className="flex justify-between text-xs text-slate-600">
                  <span>Selected Addons ({customItems.length}):</span>
                  <span className="font-semibold">${customItems.reduce((sum, item) => sum + item.price, 0)} CAD</span>
                </div>
                <div className="flex justify-between border-t border-cream-200 pt-2 text-sm font-bold text-slate-900">
                  <span>Total Custom Price:</span>
                  <span>${20 + customItems.reduce((sum, item) => sum + item.price, 0)} CAD</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-cream-200 bg-cream-50 p-4">
              <button onClick={() => setIsCustomBuilderOpen(false)} className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-cream-200">
                Cancel
              </button>
              <button
                onClick={addCustomBasketToCart}
                disabled={customItems.length === 0}
                className="rounded-xl bg-amber-600 px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-amber-700 disabled:opacity-50"
              >
                Add Custom Basket to Order
              </button>
            </div>
          </div>
        </div>
      )}

      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/50 backdrop-blur-sm">
          <div className="flex h-full w-full max-w-md flex-col bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-cream-200 p-5">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-amber-600" />
                <h3 className="font-serif text-lg font-bold text-slate-900">Your Basket Order</h3>
              </div>
              <button onClick={() => setIsCartOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-grow space-y-4 overflow-y-auto p-5">
              {cart.length === 0 ? (
                <div className="space-y-3 py-12 text-center">
                  <ShoppingCart className="mx-auto h-12 w-12 text-cream-200" />
                  <p className="text-sm font-medium text-slate-500">Your cart is currently empty.</p>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 rounded-xl border border-cream-200 bg-cream-50 p-3">
                    <div className="flex-grow">
                      <h5 className="text-xs font-bold text-slate-900">{item.title}</h5>
                      <span className="text-xs font-semibold text-amber-800">${item.price} CAD</span>
                      {item.contents && (
                        <p className="mt-1 truncate text-[10px] text-slate-500">{item.contents.join(', ')}</p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 rounded-lg border border-cream-200 bg-white px-2 py-1">
                      <button onClick={() => updateQty(item.id, -1)} className="text-slate-500 hover:text-slate-800">
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-4 text-center text-xs font-bold text-slate-800">{item.qty}</span>
                      <button onClick={() => updateQty(item.id, 1)} className="text-slate-500 hover:text-slate-800">
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>

                    <button onClick={() => removeFromCart(item.id)} className="text-slate-400 hover:text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="space-y-4 border-t border-cream-200 bg-cream-50/50 p-5">
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">Selected Delivery Area</label>
                  <div className="flex justify-between rounded-lg border border-cream-200 bg-white p-2.5 text-xs font-medium text-slate-800">
                    <span>{selectedZone.name}</span>
                    <span className="font-bold text-amber-800">${selectedZone.price} CAD</span>
                  </div>
                </div>

                <div className="space-y-1.5 border-t border-cream-200 pt-2 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-semibold text-slate-800">${cartTotal} CAD</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Winnipeg Local Delivery</span>
                    <span className="font-semibold text-slate-800">${selectedZone.price} CAD</span>
                  </div>
                  <div className="flex justify-between border-t border-cream-200 pt-2 text-sm font-bold text-slate-900">
                    <span>Total</span>
                    <span>${cartTotal + selectedZone.price} CAD</span>
                  </div>
                </div>

                <button className="w-full rounded-xl bg-amber-600 px-4 py-3 text-xs font-bold text-white shadow-md shadow-amber-600/20 transition hover:bg-amber-700">
                  Proceed to Local Checkout
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {isCorporateDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/60 backdrop-blur-sm">
          <div className="flex h-full w-full max-w-lg flex-col bg-white shadow-2xl">
            <div className="flex items-center justify-between bg-slate-900 p-5 text-white">
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-amber-400" />
                <h3 className="font-serif text-lg font-bold">Corporate & Bulk B2B Orders</h3>
              </div>
              <button onClick={() => setIsCorporateDrawerOpen(false)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-grow overflow-y-auto p-6">
              {corpSubmitted ? (
                <div className="space-y-4 py-12 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-700">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <h4 className="font-serif text-xl font-bold text-slate-900">Request Received!</h4>
                  <p className="text-xs text-slate-600">
                    Our Winnipeg corporate gifts team will prepare your Net-30 quote and contact you within 2 business hours.
                  </p>
                  <button
                    onClick={() => {
                      setCorpSubmitted(false);
                      setIsCorporateDrawerOpen(false);
                    }}
                    className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white"
                  >
                    Back to Shop
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={(event) => {
                    event.preventDefault();
                    setCorpSubmitted(true);
                  }}
                  className="space-y-4"
                >
                  <p className="text-xs leading-relaxed text-slate-600">
                    Sending gifts to 10+ clients or employees? We offer custom branded ribbons, CSV address batch uploads, and Net-30 invoicing.
                  </p>

                  <div>
                    <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-700">Company Name</label>
                    <input
                      type="text"
                      required
                      placeholder="Acme Corp Canada"
                      value={corpForm.companyName}
                      onChange={(event) => setCorpForm({ ...corpForm, companyName: event.target.value })}
                      className="w-full rounded-xl border border-cream-200 px-3.5 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-700">Business Contact Email</label>
                    <input
                      type="email"
                      required
                      placeholder="corporate@acme.ca"
                      value={corpForm.contactEmail}
                      onChange={(event) => setCorpForm({ ...corpForm, contactEmail: event.target.value })}
                      className="w-full rounded-xl border border-cream-200 px-3.5 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-700">Estimated Quantity</label>
                      <input
                        type="number"
                        min="5"
                        value={corpForm.quantity}
                        onChange={(event) => setCorpForm({ ...corpForm, quantity: Number(event.target.value) })}
                        className="w-full rounded-xl border border-cream-200 px-3.5 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-700">Target Delivery Date</label>
                      <input
                        type="date"
                        required
                        value={corpForm.deliveryDate}
                        onChange={(event) => setCorpForm({ ...corpForm, deliveryDate: event.target.value })}
                        className="w-full rounded-xl border border-cream-200 px-3.5 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-700">Special Branding or Notes</label>
                    <textarea
                      rows={3}
                      placeholder="e.g. Include custom logo greeting cards or specific diet restrictions..."
                      value={corpForm.notes}
                      onChange={(event) => setCorpForm({ ...corpForm, notes: event.target.value })}
                      className="w-full rounded-xl border border-cream-200 px-3.5 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <button type="submit" className="w-full rounded-xl bg-slate-900 px-4 py-3 text-xs font-bold text-white shadow-md transition hover:bg-slate-800">
                    Request Corporate Quote
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      <footer className="mt-auto border-t border-slate-800 bg-slate-900 py-10 text-xs text-cream-200">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 sm:px-6 md:grid-cols-3 lg:px-8">
          <div className="space-y-2">
            <h4 className="font-serif text-base font-bold text-white">Prairie Joy Baskets Co.</h4>
            <p className="text-slate-400">Handcrafted Prairie gift baskets featuring local Manitoba artisans. Delivered locally across Winnipeg.</p>
          </div>
          <div className="space-y-2">
            <h5 className="text-[11px] font-bold uppercase text-white">Local Winnipeg Pickup</h5>
            <p className="text-slate-400">The Forks Market - Artisan Kiosk #14</p>
            <p className="text-slate-400">1 Forks Market Rd, Winnipeg, MB R3C 4L9</p>
          </div>
          <div className="space-y-2">
            <h5 className="text-[11px] font-bold uppercase text-white">Customer Support</h5>
            <p className="text-slate-400">Email: hello@prairiejoybaskets.com</p>
            <p className="text-slate-400">Phone: (204) 555-GIFT</p>
          </div>
        </div>

        <div className="mx-auto mt-8 border-t border-slate-800 px-4 pt-6 text-center text-[11px] text-slate-500 sm:px-6 lg:max-w-7xl lg:px-8">
          © {new Date().getFullYear()} Prairie Joy Baskets Co. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

export default App;
