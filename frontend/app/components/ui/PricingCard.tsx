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
    isDisabled?: boolean;
}

export function PricingCard({
    title,
    price,
    interval,
    features,
    isPopular,
    buttonText,
    onButtonClick,
    isDisabled
}: PricingCardProps) {
    return (
        <div className={`bg-white rounded-lg shadow-sm p-6 relative overflow-hidden flex flex-col ${isPopular ? 'border border-indigo-200' : 'border border-slate-200'}`}>
            {isPopular && (
                <div className="absolute top-0 right-0 p-3">
                    <span className="bg-indigo-50 text-indigo-600 text-[10px] font-bold px-2 py-0.5 rounded-lg border border-indigo-100 uppercase tracking-wider">Most Popular</span>
                </div>
            )}
            <h3 className="text-xl font-semibold text-slate-900">{title}</h3>
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
                className={`text-sm font-medium mt-6 w-full py-2.5 rounded-lg transition-all ${isDisabled ? 'opacity-50 cursor-not-allowed bg-slate-100 text-slate-400 border border-slate-200' : (isPopular ? 'text-white shadow-lg shadow-indigo-500/20 hover:-translate-y-0.5' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm hover:-translate-y-0.5')}`}
                style={isPopular && !isDisabled ? { backgroundColor: "#4667ff" } : {}}
                disabled={isDisabled}
            >
                {buttonText}
            </button>
        </div>
    );
}
