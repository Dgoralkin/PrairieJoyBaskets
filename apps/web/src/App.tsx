import { useEffect, useMemo, useState } from 'react';
import {
  Building2,
  Check,
  CheckCircle2,
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
import { apiClient } from '@repo/api-client';
import type { Basket, Category, CartItem, Zone, Addon, CorpForm } from '@repo/types';
import CustomBasketVideo from './components/CustomBasketVideo';
import HeroVideo from './components/HomepageHeroClip';
import Header from './components/Header';
import Footer from './components/Footer';
import CorporateOrders from './components/CorporateOrders';



const CUSTOM_BASKET_PACKAGING_FEE = 9.99;

function App() {
  const [zones, setZones] = useState<Zone[]>([]);                                   // State to hold the list of delivery zones fetched from the API
  const [selectedZone, setSelectedZone] = useState<Zone | undefined>(undefined);    // State to hold the currently selected delivery zone
  
  const [catalogItems, setCatalogItems] = useState<Addon[]>([]);                    // State to hold the list of available addons/products for custom baskets
  const [baskets, setBaskets] = useState<Basket[]>([]);                             // State to hold the list of baskets fetched from the API
  const [categories, setCategories] = useState<Category[]>([]);                     // State to hold the list of categories fetched from the API
  const [categoryFilter, setCategoryFilter] = useState<string>('All');              // State to hold the currently selected category filter
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);               // State to hold the IDs of the currently selected addons for a custom basket

  const [cart, setCart] = useState<CartItem[]>([]);                                 // State to hold the items currently in the shopping cart

  const [customBasketName, setCustomBasketName] = useState('My Lovely Custom Basket');
  
             // State to hold the current values of the corporate order form
  const [corpSubmitted, setCorpSubmitted] = useState(false);                        // State to track whether the corporate order form has been successfully submitted  const [errorMsg, setErrorMsg] = useState<string | null>(null);                    // State to hold any error messages encountered during data fetching

  const [isCartOpen, setIsCartOpen] = useState(false);                              // State to control the visibility of the shopping cart drawer
  const [isCorporateDrawerOpen, setIsCorporateDrawerOpen] = useState(false);        // State to control the visibility of the corporate order form drawer
  const [isCustomBuilderOpen, setIsCustomBuilderOpen] = useState(false);            // State to control the visibility of the custom basket builder drawer
  
  const [isLoadingData, setIsLoadingData] = useState(true);                         // State to track whether the app is currently loading data from the API
  const [errorMsg, setErrorMsg] = useState<string | null>(null);                    // State to hold any error messages encountered during data fetching

  // Memorized filtered catalog based on the selected category filter
  const filteredCatalog = useMemo(() => {
    if (categoryFilter === 'All') {
      return baskets;
    }
    return baskets.filter((basket) => basket.category === categoryFilter);
  }, [baskets, categoryFilter]);

  // Helper that returns the full Addon/catalogItems objects currently selected
  const customItems = catalogItems.filter((a) => selectedAddons.includes(a.id));
  // Toggle an add‑on by its id
  const toggleAddon = (id: string) => {
    setSelectedAddons((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // Function to add an item to the cart, incrementing quantity if it already exists
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

  // Function to remove an item from the cart by its ID
  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  // Function to update the quantity of an item in the cart by its ID and a delta value
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

  // Function to add a custom basket to the cart, calculating its total price based on selected addons
  const addCustomBasketToCart = () => {
    const totalCustomPrice = CUSTOM_BASKET_PACKAGING_FEE + customItems.reduce((sum, item) => sum + item.msrp, 0);
    const newCustomItem: CartItem = {
      id: `custom-${Date.now()}`,
      title: customBasketName,
      price: totalCustomPrice,
      category: 'Custom',
      rating: 5,
      reviews: 0,
      image: '/custom_gift_basket_img.jpg',
      description: 'A custom Winnipeg gift basket assembled for your occasion.',
      tags: ['Custom', 'Handpicked'],
      contents: customItems.map((item) => item.name),
      pricedContents: customItems.map((item) => ({ name: item.name, price: item.msrp })),
      isCustom: true,
      qty: 1,
      categoryId: 'custom',
      isActive: true,
    };

    setCart((prev) => [...prev, newCustomItem]);
    setIsCustomBuilderOpen(false);
    setSelectedAddons([]);
  };

  // Calculate the total price and total quantity of items in the cart
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  // Helper that returns a safe “fallback” zone when the real one isn’t loaded yet.
  // You can keep this in the component body (just above the JSX) or in a separate utils file.
  const safeZone: Zone = selectedZone ?? {
    id: '',
    name: '',
    price: 0,
    estDays: '',
  };

  // Load categories & catalog baskets from Cloud SQL via API call.
  useEffect(() => {
    async function loadCatalog() {
      try {
        setIsLoadingData(true);
        setErrorMsg(null);
        const [catData, basketData, zoneData, addonData] = await Promise.all([
          apiClient.getCategories(),
          apiClient.getBaskets(),
          apiClient.getZones(),
          apiClient.getAddons(),  
        ]);
        setCategories(catData);                                                   // Set categories from API response
        setBaskets(basketData);                                                   // Set baskets from API response
        setZones(zoneData);                                                       // Set delivery zones from API response
        if (zoneData.length > 0) setSelectedZone(zoneData[0]);                    // Safely set the first zone if one exists.
        setCatalogItems(addonData);                                               // Set available addons/products for custom baskets from API response
      } catch (err: any) {
        console.error('Error fetching catalog data:', err);
        setErrorMsg('Unable to load gift baskets. Please check if the API and database are running.');
      } finally {
        setIsLoadingData(false);
      }
    }
    loadCatalog();
  }, []);

  // Compute dynamic filterOptions array: ensure 'All' is first and not duplicated
  const filterOptions = useMemo(() => {
    const names = categories.map((c) => c.name);
    return names.includes('All') ? names : ['All', ...names];
  }, [categories]);

  return (
    <div className="flex min-h-screen flex-col bg-cream-50 text-slate-800 antialiased selection:bg-amber-100 selection:text-amber-900">
      <div className="bg-amber-900 px-4 py-2 text-center text-xs font-medium text-amber-100">
        <div className="mx-auto flex items-center justify-center gap-2">
          <Truck className="h-4 w-4" />
          <span>Hand-Delivered Across Winnipeg & Surrounding Areas | Free Local Pickup Available at The Forks</span>
        </div>
      </div>

      {/* Import and render the Header component from the components directory */}
      <Header 
      isCorporateDrawerOpen={isCorporateDrawerOpen} setIsCorporateDrawerOpen={setIsCorporateDrawerOpen}
      isCartOpen={isCartOpen} setIsCartOpen={setIsCartOpen}
      isCustomBuilderOpen={isCustomBuilderOpen} setIsCustomBuilderOpen={setIsCustomBuilderOpen}
      categoryFilter={categoryFilter} setCategoryFilter={setCategoryFilter}
      selectedZone={selectedZone} setSelectedZone={setSelectedZone}
      zones={zones}
      cart={cart}
      setCart={setCart}
      />

      {/* Import and render the HeroVideo component from the components directory */}
      <HeroVideo className="mt-6" />

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
                src="/custom_gift_basket_img.jpg"
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


      {/* Shop by Category - Insert baskets from Postgre DB here !*/}
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

        {isLoadingData ? (
          <div className="py-20 text-center text-slate-500">
            <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-amber-600 border-t-transparent" />
            <p className="font-medium">Assembling your gift baskets...</p>
          </div>
        ) : errorMsg ? (
          <div className="my-10 rounded-xl bg-red-50 p-6 text-center text-red-700">
            <p>{errorMsg}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredCatalog.map((basket) => (
              <div key={basket.id} className="group flex flex-col overflow-hidden rounded-2xl border border-cream-200 bg-white shadow-sm transition hover:shadow-md">
                <div className="relative aspect-4/3 overflow-hidden bg-cream-100">
                  <img
                    src={basket.image}
                    alt={basket.title}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    onError={(event) => {
                      event.currentTarget.src = '/PJB_bskt_placeholder.png';
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
        )}
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
              {/* Import and render the CustomBasketVideo component at the top of the custom basket builder drawer */}
              <CustomBasketVideo />

              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-amber-600">Name Your Basket</label>
                <input
                  type="text"
                  value={customBasketName}
                  onChange={(event) => setCustomBasketName(event.target.value)}
                  className="w-full rounded-xl border border-cream-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-amber-600 mt-4">Add items to your custom basket</label>
              </div>

              {/* Add‑on selector – starts with nothing selected */}
              <div className="grid grid-cols-2 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {catalogItems.map((addon) => {
                  const isSelected = selectedAddons.includes(addon.id);
                  return (
                    <button
                      key={addon.id}
                      type="button"
                      className={`
                        flex flex-col items-center rounded-lg border p-2
                        ${isSelected ? 'border-amber-600 bg-amber-100' : 'border-gray-300'}
                        hover:border-amber-500
                      `}
                      onClick={() => toggleAddon(addon.id)}
                    >
                      <span className="font-medium">{addon.name}</span>
                      {/* An icon or image for the addon, placeholder */}
                      <div className="mb-1 h-12 w-12 rounded-full bg-cream-200 flex items-center justify-center text-amber-600">
                        <img src={addon.image_url || '/Add-on-item-placeholder.png'} alt={addon.name} className="h-full w-full object-cover" />
                      </div>
                      <span className="text-sm text-slate-600">
                        ${addon.msrp.toFixed(2)}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="space-y-2 rounded-xl bg-cream-100 p-4">
                <div className="flex justify-between text-xs text-slate-600">
                  <span>Handcrafted Custom Box &amp; Packaging Fee:</span>
                  <span className="font-semibold">${CUSTOM_BASKET_PACKAGING_FEE.toFixed(2)} CAD</span>
                </div>

                <div className="flex justify-between text-xs text-slate-600">
                  <span>
                    Selected Addons ({customItems.length}):
                  </span>
                  <span className="font-semibold">
                    ${customItems.reduce((sum, item) => sum + item.msrp, 0)} CAD
                  </span>
                </div>

                {/* list the names of selected add‑ons */}
                {customItems.length > 0 && (
                  <ul className="mt-2 list-disc pl-5 text-xs text-slate-600">
                    {customItems.map((item) => (
                      <li key={item.id}>{item.name} + ${item.msrp}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-cream-200 bg-cream-50 p-4">
              <button onClick={() => setIsCustomBuilderOpen(false)} className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-cream-200">
                Cancel
              </button>
              <button
                onClick={addCustomBasketToCart}
                disabled={catalogItems.length === 0}
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
                      <span className="text-xs font-semibold text-amber-800">${item.price.toFixed(2)} CAD</span>
                      {item.contents && (
                        <ul className="mt-1 space-y-0.5 text-[10px] text-slate-500">
                          {item.contents.map((c, idx) => (
                            <li key={idx} className="flex justify-between">
                              <span className="flex items-center gap-2 truncate">
                                <Check size={24} color="green" />
                                {c}
                              </span>
                              {item.pricedContents?.[idx] && (
                                <span className="whitespace-nowrap font-semibold">
                                  ${item.pricedContents[idx].price.toFixed(2)} CAD
                                </span>
                              )}
                            </li>
                          ))}
                          {item.isCustom && (
                            <li className="flex justify-between">
                              <span className="flex items-center gap-2 truncate">
                                <Check size={24} color="green" />
                                Custom Box &amp; Packaging Fee:
                              </span>
                              <span className="whitespace-nowrap font-semibold">
                                ${CUSTOM_BASKET_PACKAGING_FEE.toFixed(2)} CAD
                              </span>
                            </li>
                          )}
                        </ul>
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
                    <span>{safeZone.name}</span>
                    <span className="font-bold text-amber-800">${safeZone.price} CAD</span>
                  </div>
                </div>

                <div className="space-y-1.5 border-t border-cream-200 pt-2 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-semibold text-slate-800">${cartTotal.toFixed(2)} CAD</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Winnipeg Local Delivery</span>
                    <span className="font-semibold text-slate-800">${safeZone.price} CAD</span>
                  </div>
                  <div className="flex justify-between border-t border-cream-200 pt-2 text-sm font-bold text-slate-900">
                    <span>Total</span>
                    <span>${(cartTotal + safeZone.price).toFixed(2)} CAD</span>
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

      <CorporateOrders
      IsCorporateDrawerOpen={isCorporateDrawerOpen} setIsCorporateDrawerOpen={setIsCorporateDrawerOpen}
      corpSubmitted={corpSubmitted} setCorpSubmitted={setCorpSubmitted}
      />

      // Render the Footer component from ./components at the bottom of the page
      < Footer />
    </div>
  );
}

export default App;
