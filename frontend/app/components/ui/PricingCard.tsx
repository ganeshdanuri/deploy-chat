import { Check } from "lucide-react";

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
    isDisabled,
}: PricingCardProps) {
    return (
        <div
            className="relative bg-background rounded-xl p-6 flex flex-col"
            style={{
                border: isPopular ? "2px solid var(--brand)" : "1px solid var(--border)",
            }}
>
            {isPopular && (
                <div
                    className="absolute -top-2.5 left-5 text-[11px] font-medium px-2.5 py-0.5 rounded-md"
                    style={{ background: "var(--brand-bg)", color: "var(--brand)" }}
>
                    Most popular
                </div>
            )}
            <h3 className="text-base font-medium text-foreground">{title}</h3>
            <div className="mt-1 flex items-baseline gap-1">
                <span className="text-3xl font-medium tracking-tight text-foreground">
                    {typeof price === "string" && price === "Custom" ? price : `$${price}`}
                </span>
                {interval && <span className="text-sm text-muted-foreground">{interval}</span>}
            </div>
            <ul className="mt-5 space-y-2.5 flex-1">
                {features.map((feat, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                        <Check
                            className="w-4 h-4 mt-0.5 shrink-0"
                            style={{ color: isPopular ? "var(--brand)" : "var(--muted-foreground)" }}
                        />
                        {feat}
                    </li>
                ))}
            </ul>
            <Button
                variant={isPopular ? "default" : "outline"}
                onClick={onButtonClick}
                className="mt-6 w-full"
                disabled={isDisabled}
>
                {buttonText}
            </Button>
        </div>
    );
}
