"use client";

interface Stat {
  id: number;
  value: string;
  label: string;
  color: string;
  bgColor: string;
}

interface BannerProps {
  stats: Stat[];
  onStartNow: () => void;
}

export default function Banner({ stats, onStartNow }: BannerProps) {
  return (
    <div
      className="w-full p-6"
      style={{ backgroundColor: stats[0].color }}
    >
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-center justify-between gap-4 text-sm font-semibold text-white">
          <div className="flex items-center gap-2">
            <span>Unlimited Conversations</span>
            <span>✱</span>
          </div>
          <div className="flex items-center gap-2">
            <span>30 Days Free Trial</span>
            <span>→</span>
          </div>
          <div className="flex items-center gap-2">
            <span>24/7 AI Support</span>
            <span>✱</span>
          </div>
          <div className="flex items-center gap-2">
            <span>Easy Website Integration</span>
            <span>→</span>
          </div>
          <button 
            onClick={onStartNow}
            className="rounded-lg bg-white px-6 py-2 font-semibold text-black transition-all hover:shadow-lg"
          >
            Start Now
          </button>
        </div>
      </div>
    </div>
  );
}
