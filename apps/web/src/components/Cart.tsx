import { ShoppingBag, X, ShoppingCart, Check, Minus, Plus, Trash2 } from 'lucide-react';
import type { Zone, CartItem } from '@repo/types';

type CartProps = {
    isCartOpen: boolean;
    setIsCartOpen: React.Dispatch<React.SetStateAction<boolean>>;
    cart: CartItem[];
    setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
    selectedZone: Zone | undefined;
    CUSTOM_BASKET_PACKAGING_FEE: number;
}

export default function Cart({
    isCartOpen,
    setIsCartOpen,
    cart,
    setCart,
    selectedZone,
    CUSTOM_BASKET_PACKAGING_FEE,
}: CartProps) {

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

    return isCartOpen ? (
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
    ) : null ;
}