import { CheckCircle2, AlertTriangle, HelpCircle } from "lucide-react";

export function AccuracyMeter() {
  const accuracy = 94.6;
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (accuracy / 100) * circumference;

  const topSigns = [
    { word: "Hello", count: 489, accuracy: 98 },
    { word: "Thank You", count: 356, accuracy: 96 },
    { word: "Help", count: 212, accuracy: 91 },
    { word: "Sign Language", count: 184, accuracy: 89 },
  ];

  return (
    <div className="rounded-xl bg-white/[0.02] border border-white/[0.08] p-6 shadow-xl backdrop-blur-md flex flex-col justify-between h-full">
      <div>
        <h3 className="font-bold text-white text-lg">Translation Quality</h3>
        <p className="text-sm text-gray-400 mb-6">AI Sign Recognition Metrics</p>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-6 justify-center my-4">
        {/* Radial Meter */}
        <div className="relative h-32 w-32 flex items-center justify-center">
          <svg className="absolute transform -rotate-90 w-full h-full">
            {/* Background ring */}
            <circle
              cx="64"
              cy="64"
              r={radius}
              className="stroke-white/[0.04] fill-none"
              strokeWidth="10"
            />
            {/* Foreground progress */}
            <circle
              cx="64"
              cy="64"
              r={radius}
              className="stroke-primary fill-none transition-all duration-1000 ease-out"
              strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
            />
          </svg>
          <div className="text-center">
            <span className="text-2xl font-extrabold text-white">{accuracy}%</span>
            <p className="text-[10px] uppercase font-bold tracking-wider text-gray-400 mt-0.5">Accuracy</p>
          </div>
        </div>

        {/* Legend / Metrics breakdown */}
        <div className="space-y-3 flex-1 min-w-[150px]">
          <div className="flex items-center text-xs justify-between">
            <span className="flex items-center gap-1.5 text-gray-400">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              Successful
            </span>
            <span className="font-semibold text-white">4.1k</span>
          </div>
          <div className="flex items-center text-xs justify-between">
            <span className="flex items-center gap-1.5 text-gray-400">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              Low Confidence
            </span>
            <span className="font-semibold text-white">189</span>
          </div>
          <div className="flex items-center text-xs justify-between">
            <span className="flex items-center gap-1.5 text-gray-400">
              <HelpCircle className="h-4 w-4 text-rose-500" />
              Failed
            </span>
            <span className="font-semibold text-white">32</span>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-white/[0.06]">
        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Top Translated Words</h4>
        <div className="space-y-2">
          {topSigns.map((sign, index) => (
            <div key={index} className="flex items-center justify-between text-xs py-1">
              <span className="font-medium text-gray-300">{sign.word}</span>
              <div className="flex items-center gap-3">
                <span className="text-gray-500">{sign.count} hits</span>
                <span
                  className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                    sign.accuracy >= 95
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                  }`}
                >
                  {sign.accuracy}% acc
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
