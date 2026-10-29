// Header.tsx is a React component that renders the header section of the web application.
// It includes the brand logo, corporate orders button, cart icon with item count, and a delivery zone selector.
// The component receives various state variables and their setters as props to manage the state of the header elements.

import { Building2, MapPin, ShoppingCart} from 'lucide-react';
import { Zone, CartItem } from '@repo/types';

// Define the props for the Header component, including state variables and their setters
type HeaderProps = {
  isCorporateDrawerOpen: boolean;
  setIsCorporateDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;

  isCartOpen: boolean;
  setIsCartOpen: React.Dispatch<React.SetStateAction<boolean>>;

  isCustomBuilderOpen: boolean;
  setIsCustomBuilderOpen: React.Dispatch<React.SetStateAction<boolean>>;

  categoryFilter: string;
  setCategoryFilter: React.Dispatch<React.SetStateAction<string>>;

  selectedZone: Zone | undefined;
  setSelectedZone: React.Dispatch<React.SetStateAction<Zone | undefined>>;

  cart: CartItem[]; 
  zones: Zone[];
};

export default function Header({
  setIsCorporateDrawerOpen,
  setIsCartOpen,
  setCategoryFilter,
  selectedZone,
  setSelectedZone,
  zones,
  cart
}: HeaderProps) {
    const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);

    return (
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
                            // Provide a fallback value while zones are loading.
                            value={selectedZone?.id ?? ''} 
                            onChange={(event) => {
                            const nextZone = zones.find((zone) => zone.id === event.target.value);
                            if (nextZone) setSelectedZone(nextZone);
                            }}
                        >
                            {zones.map((zone) => (
                            <option key={zone.id} value={zone.id}>
                                {zone.name} (${zone.price})
                            </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
        </header>
    );
}