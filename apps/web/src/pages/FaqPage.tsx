import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Search } from 'lucide-react';
import { Badge } from '../components/ui/Badge.js';

interface FaqItem {
  id: string;
  category: 'booking' | 'pricing' | 'fleet' | 'safety';
  question: string;
  answer: string;
}

export const FaqPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [openFaqId, setOpenFaqId] = useState<string | null>('faq-1');

  const faqs: FaqItem[] = [
    {
      id: 'faq-1',
      category: 'pricing',
      question: 'How are freight fares calculated on AARVIX Transport?',
      answer:
        'Freight charges are calculated transparently using an official deterministic formula based on: (1) Vehicle category base tariff and included base kilometers, (2) Incremental per-kilometer rate for the official highway distance, (3) Loading/unloading labor assistance if requested (₹450/helper), (4) Dynamic fuel surcharge index (~6%), (5) National highway Fastag tolls, and (6) 5% Goods Transport Agency (GTA) GST.',
    },
    {
      id: 'faq-2',
      category: 'pricing',
      question: 'Is GST charged under Forward Charge or Reverse Charge Mechanism (RCM)?',
      answer:
        'Under Section 9(3) of the CGST Act, Goods Transport Agency services supplied to registered corporate entities are subject to GST at 5% under Reverse Charge Mechanism (RCM), payable directly by the consignor or consignee. For unregistered entities, AARVIX charges 5% under Forward Charge with full tax compliance.',
    },
    {
      id: 'faq-3',
      category: 'booking',
      question: 'How quickly is a lorry placed after booking confirmation?',
      answer:
        'For intra-city and regional express bookings (Tata Ace, Bolero, Tata 407), vehicle placement occurs within 45 to 90 minutes. For inter-state long-haul full truck load (14ft to 32ft trailers), loading appointment windows are scheduled within 2 to 4 hours.',
    },
    {
      id: 'faq-4',
      category: 'safety',
      question: 'How does AARVIX verify driver credentials and vehicle fitness?',
      answer:
        'Every vehicle undergoes a mandatory document audit: active Registration Certificate (RC), commercial insurance policy, fitness certificate from the regional RTO, and all-India national permits. Drivers must hold a valid Heavy Goods Vehicle (HGV) licence with commercial transport badge and verified Aadhaar credentials.',
    },
    {
      id: 'faq-5',
      category: 'safety',
      question: 'How does the digital Proof of Delivery (POD) work?',
      answer:
        'When the vehicle arrives at the destination warehouse, the recipient inspects the seals and generates a 4-digit delivery verification OTP. The driver enters this OTP and uploads a timestamped, geo-tagged photograph of the delivered cargo, generating an instantaneous digital POD.',
    },
    {
      id: 'faq-6',
      category: 'fleet',
      question: 'Can fleet owners and transporters register multiple vehicles?',
      answer:
        'Yes. Fleet owners can register unlimited commercial trucks through our Transporter Portal. Once RC books and national permits are approved by our compliance team, you can assign drivers and accept high-volume return loads.',
    },
    {
      id: 'faq-7',
      category: 'booking',
      question: 'Can I cancel a booking after dispatch?',
      answer:
        'Cancellations prior to vehicle dispatch are free of penalty. If a cancellation occurs after an assigned lorry has arrived at the loading warehouse, a standardized dry-run compensation fee is payable to reimburse driver fuel and placement expenses.',
    },
    {
      id: 'faq-8',
      category: 'fleet',
      question: 'What happens during a mechanical breakdown or puncture on the highway?',
      answer:
        'AARVIX operates a 24x7 pan-India emergency highway assistance desk. If a breakdown cannot be resolved within 3 hours, a replacement relief truck from our regional network is dispatched immediately to transfer cargo.',
    },
  ];

  const filteredFaqs = faqs.filter((faq) => {
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
    const matchesQuery =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  return (
    <div className="py-12 space-y-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <Badge variant="gold">Knowledge Base & FAQs</Badge>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-forest-950 tracking-tight">
          Frequently Asked Questions
        </h1>
        <p className="text-sm text-neutral-600">
          Clear answers on freight billing, GST compliance, vehicle placement SLAs, and safety standards.
        </p>
      </div>

      {/* Search & Category Filter */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5 pointer-events-none" />
          <input
            type="text"
            placeholder="Search keywords (e.g. GST, POD, cancellation, insurance)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border border-warm-300 rounded-xl text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-forest-600 shadow-sm"
          />
        </div>

        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-1">
          {[
            { id: 'all', label: 'All Topics' },
            { id: 'pricing', label: 'Pricing & GST' },
            { id: 'booking', label: 'Booking & Dispatch' },
            { id: 'safety', label: 'Safety & POD' },
            { id: 'fleet', label: 'Fleet Owners' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                activeCategory === cat.id
                  ? 'bg-forest-800 text-white shadow-sm'
                  : 'bg-white text-neutral-700 border border-warm-300 hover:bg-neutral-50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Accordion List */}
      <div className="space-y-3">
        {filteredFaqs.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-warm-200">
            <HelpCircle className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
            <p className="text-sm font-semibold text-neutral-800">No matching questions found</p>
            <p className="text-xs text-neutral-500 mt-1">Try another search keyword or contact our 24x7 control room.</p>
          </div>
        ) : (
          filteredFaqs.map((faq) => {
            const isOpen = openFaqId === faq.id;
            return (
              <div
                key={faq.id}
                className="bg-white border border-warm-200 rounded-xl overflow-hidden transition-all shadow-subtle"
              >
                <button
                  onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                  className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 hover:bg-warm-50/60 transition-colors focus:outline-none"
                >
                  <span className="text-sm font-bold text-forest-950">{faq.question}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-forest-800 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-gold-600' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs text-neutral-600 leading-relaxed border-t border-warm-100 bg-neutral-50/30">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
