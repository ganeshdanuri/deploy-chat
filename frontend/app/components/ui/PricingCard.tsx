import { HiShieldCheck } from "react-icons/hi";

export interface PricingCardProps {
    title: string;
    price: string | number;
    interval?: string;
    description?: string;
    features: string[];
    isPopular?: boolean;
    buttonText: string;
    onButtonClick?: () => void;
}

export function PricingCard({
    title,
    price,
    interval,
    features,
    isPopular,
    buttonText,
    onButtonClick
}: PricingCardProps) {
    return (
        <div className={`bg-white rounded-xl shadow-sm p-6 relative overflow-hidden flex flex-col ${isPopular ? 'border border-indigo-200' : 'border border-slate-200'}`}>
            {isPopular && (
                <div className="absolute top-0 right-0 p-3">
                    <span className="bg-indigo-50 text-indigo-600 text-[10px] font-bold px-2 py-0.5 rounded-full border border-indigo-100 uppercase tracking-wider">Most Popular</span>
                </div>
            )}
            <h3 className="text-lg font-bold text-slate-900">{title}</h3>
            <div className="mt-1 flex items-baseline gap-1">
                <span className="text-3xl font-black text-slate-900">{typeof price === 'string' && price === 'Custom' ? price : `$${price}`}</span>
                {interval && <span className="text-sm text-slate-500">{interval}</span>}
            </div>
            <ul className="mt-5 space-y-3 flex-1">
                {features.map((feat, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-slate-600">
                        <HiShieldCheck className={`w-5 h-5 shrink-0 ${isPopular ? 'text-indigo-500' : 'text-slate-400'}`} />
                        {feat}
                    </li>
                ))}
            </ul>
            <button
                onClick={onButtonClick}
                className={`mt-6 w-full py-2.5 text-sm font-bold rounded-lg transition-all ${isPopular
                        ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-100'
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
            >
                {buttonText}
            </button>
        </div>
    );
}
