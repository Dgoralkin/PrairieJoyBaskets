// CustomBasketSection.tsx is a React component that renders the custom basket building section of the web application.
// It triggers the CustomBasketBuilder component to build custom basket orders.

import { Sparkles, Wand2, Building2} from 'lucide-react';


type CustomBasketSectionProps = {
    isCustomBuilderOpen: boolean;
    setIsCustomBuilderOpen: React.Dispatch<React.SetStateAction<boolean>>;

    isCorporateDrawerOpen: boolean;
    setIsCorporateDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
};


export default function CustomBasketSection({ 
    setIsCustomBuilderOpen, 
    setIsCorporateDrawerOpen
}: CustomBasketSectionProps) {
    return (
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
                            className="flex items-center gap-2 rounded-xl border border-cream-200 bg-white px-5 py-3 text-sm font-semibold text-slate-800 transition hover:bg-cream-100 sm:hidden"
                        >
                            <Building2 className="h-4 w-4" />
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
    );
}