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
        <div className={`bg-white rounded-xl shadow-sm p-6 relative overflow-hidden flex flex-col ${isPopular ? 'border border-[#262ef2]/20 shadow-[#262ef2]/5 shadow-xl' : 'border border-[#e3e2e5]'}`}>
            {isPopular && (
                <div className="absolute top-0 right-0 p-3">
                    <span className="bg-[#262ef2]/10 text-[#262ef2] text-[10px] font-bold px-2 py-0.5 rounded-lg border border-[#262ef2]/10 uppercase tracking-wider">Most Popular</span>
                </div>
            )}
            <h3 className="text-xl font-semibold text-[#201f32]">{title}</h3>
            <div className="mt-1 flex items-baseline gap-1">
                <span className="text-3xl font-black text-[#201f32]">{typeof price === 'string' && price === 'Custom' ? price : `$${price}`}</span>
                {interval && <span className="text-sm text-[#4d5564]">{interval}</span>}
            </div>
            <ul className="mt-5 space-y-3 flex-1">
                {features.map((feat, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-[#4d5564]">
                        <HiShieldCheck className={`w-5 h-5 shrink-0 ${isPopular ? 'text-[#262ef2]' : 'text-[#a1a1a1]'}`} />
                        {feat}
                    </li>
                ))}
            </ul>
            <button
                onClick={onButtonClick}
                className={`text-sm font-medium mt-6 w-full py-2.5 rounded-lg transition-all ${isDisabled ? 'opacity-50 cursor-not-allowed bg-[#f3f3f9] text-[#a1a1a1] border border-[#e3e2e5]' : (isPopular ? 'text-white shadow-lg shadow-[#262ef2]/20 hover:-translate-y-0.5' : 'bg-white border border-[#e3e2e5] text-[#4d5564] hover:bg-[#f3f3f9] shadow-sm hover:-translate-y-0.5')}`}
                style={isPopular && !isDisabled ? { backgroundColor: "#262ef2" } : {}}
                disabled={isDisabled}
            >
                {buttonText}
            </button>
        </div>
    );
}
