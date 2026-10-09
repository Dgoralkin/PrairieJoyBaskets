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



      {/* Shop by Category - Insert items from Postgre DB here !*/}
      <main className="mx-auto flex w-full max-w-7xl flex-grow flex-col px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="font-serif text-2xl font-bold text-slate-900">Curated Collection</h3>
            <p className="mt-1 text-xs text-slate-500">Select from our signature pre-arranged gift packages</p>
          </div>
        </div>


        {/* Filter Options Feature - filter baskets by category */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {filterOptions.map((option) => (
            <button
              key={option}
              onClick={() => setCategoryFilter(option)}
              className={`whitespace-nowrap rounded-xl px-4 py-2 text-xs font-semibold transition ${categoryFilter === option
                ? 'bg-slate-900 text-white shadow-sm'
                : 'border border-cream-200 bg-white text-slate-600 hover:bg-cream-100'
                }`}
            >
              {option}
            </button>
          ))}
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
