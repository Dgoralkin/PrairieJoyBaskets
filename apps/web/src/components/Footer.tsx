// Footer.tsx is a React component that renders the footer section of the web application.

export default function Footer() {
    return (
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
    );
}
