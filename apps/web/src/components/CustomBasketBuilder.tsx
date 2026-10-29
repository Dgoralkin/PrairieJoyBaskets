// CustomBasketBuilder.tsx is a React component that renders the custom basket building engine.
// It runs the CustomBasketBuilder component to build custom basket orders and and baskets to the shopping cart.

import type { Addon, CartItem } from '@repo/types';
import { useState } from 'react';
import { Wand2, X } from 'lucide-react';
import CustomBasketVideo from './CustomBasketVideo';

type CustomBasketBuilderProps = {
    CUSTOM_BASKET_PACKAGING_FEE: number;
    isCustomBuilderOpen: boolean;
    setIsCustomBuilderOpen: React.Dispatch<React.SetStateAction<boolean>>;
    catalogItems: Addon[];
    setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;

};

export default function CustomBuilderOpen ({
    CUSTOM_BASKET_PACKAGING_FEE,
    isCustomBuilderOpen,
    setIsCustomBuilderOpen,
    catalogItems,
    setCart
}: CustomBasketBuilderProps) {
    const [customBasketName, setCustomBasketName] = useState('My Lovely Custom Basket');
    const [selectedAddons, setSelectedAddons] = useState<string[]>([]);

    // Helper that returns the full Addon/catalogItems objects currently selected
    const customItems = catalogItems.filter((a) => selectedAddons.includes(a.id));
  
    // Toggle an add‑on by its id
    const toggleAddon = (id: string) => {
        setSelectedAddons((prev) =>
        prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
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

    return isCustomBuilderOpen ? (
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
    ) : null ;
}