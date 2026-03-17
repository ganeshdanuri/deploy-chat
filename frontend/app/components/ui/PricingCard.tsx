import { HiShieldCheck } from "react-icons/hi";
import { Button } from "@/components/ui/button";

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
        <div className={`bg-white rounded-2xl shadow-sm p-6 relative overflow-hidden flex flex-col ${isPopular ? 'border border-primary/20 shadow-primary/5 shadow-xl' : 'border border-border'}`}>
            {isPopular && (
                <div className="absolute top-0 right-0 p-3">
                    <span className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded-lg border border-primary/10 uppercase tracking-wider">Most Popular</span>
                </div>
            )}
            <h3 className="text-xl font-semibold text-secondary">{title}</h3>
            <div className="mt-1 flex items-baseline gap-1">
                <span className="text-3xl font-black text-secondary">{typeof price === 'string' && price === 'Custom' ? price : `$${price}`}</span>
                {interval && <span className="text-sm text-foreground">{interval}</span>}
            </div>
            <ul className="mt-5 space-y-3 flex-1">
                {features.map((feat, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-foreground">
                        <HiShieldCheck className={`w-5 h-5 shrink-0 ${isPopular ? 'text-primary' : 'text-muted-foreground'}`} />
                        {feat}
                    </li>
                ))}
            </ul>
            <Button
                variant={isPopular ? "primary" : "outline-secondary"}
                onClick={onButtonClick}
                className={`mt-6 w-full py-2.5 ${isDisabled ? 'opacity-50 cursor-not-allowed bg-muted text-muted-foreground border border-border' : ''}`}
                disabled={isDisabled}
            >
                {buttonText}
            </Button>
        </div>
    );
}
