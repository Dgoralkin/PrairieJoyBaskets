// CorporateOrders.tsx is a React component that renders the corporate orders section of the web application.
// It includes a form for corporate users to submit their orders, and it manages the state of the form inputs and submission status.

import { Building2, CheckCircle2, X} from 'lucide-react';
import type { CorpForm } from "@repo/types";
import { useState } from 'react';

// Define a template for the corporate order form with default values
const corpFormTemplate: CorpForm = {
  companyName: '',
  contactEmail: '',
  quantity: 20,
  deliveryDate: '',
  notes: '',
};

// Define the props for the CorporateOrders component, including state variables and their setters
type CorporateOrdersProps = {
    IsCorporateDrawerOpen: boolean;
    setIsCorporateDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
    corpSubmitted: boolean;
    setCorpSubmitted: React.Dispatch<React.SetStateAction<boolean>>;
}

// The CorporateOrders component renders a drawer that allows corporate users to submit their orders.
export default function CorporateOrders({
    IsCorporateDrawerOpen,
    setIsCorporateDrawerOpen,
    corpSubmitted,
    setCorpSubmitted
}: CorporateOrdersProps) {
    const [corpForm, setCorpForm] = useState<CorpForm>(corpFormTemplate);

    return IsCorporateDrawerOpen ? (
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
                            Our Winnipeg corporate gifts team will prepare your Net-30 quote and contact you within several business hours.
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
                        placeholder="Your Corp Name - Canada"
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
    ) : null ;   
}