import { useCallback, useEffect, useState } from "react";
import { Clock } from "lucide-react";
import { products } from "../data/products";
import type { Product } from "../types";
import ProductCard from "./ProductCard";

const DURATION = 6 * 60 * 60;
const DEALS_PER_PAGE = 6;

const allDeals = products.filter((p) => p.originalPrice);

function pickDeals(): Product[] {
  const arr = [...allDeals];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.slice(0, DEALS_PER_PAGE);
}

function Countdown({ onEnd }: { onEnd: () => void }) {
  const [seconds, setSeconds] = useState(DURATION);

  useEffect(() => {
    const t = setInterval(() => setSeconds((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (seconds <= 0) {
      setSeconds(DURATION);
      onEnd();
    }
  }, [seconds, onEnd]);

  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div className="flex items-center gap-2 text-white">
      <Clock size={16} className="text-orange" />
      <span className="text-sm font-medium">Ends in:</span>
      <div className="flex items-center gap-1 font-display text-lg font-bold">
        <span className="rounded bg-navy px-2 py-0.5">{pad(h)}</span>
        <span className="text-orange">:</span>
        <span className="rounded bg-navy px-2 py-0.5">{pad(m)}</span>
        <span className="text-orange">:</span>
        <span className="rounded bg-navy px-2 py-0.5">{pad(s)}</span>
      </div>
    </div>
  );
}

export default function DealsSection({
  onAdd,
}: {
  onAdd: (product: Product) => void;
}) {
  const [deals, setDeals] = useState<Product[]>(pickDeals);

  const handleEnd = useCallback(() => setDeals(pickDeals()), []);

  return (
    <section className="py-6">
      <div className="mx-auto max-w-375 px-4">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-4">
            <h2 className="font-display text-xl font-bold text-[#0F1111] dark:text-[#E7E9EA]">
              Today's Deals
            </h2>
            <Countdown onEnd={handleEnd} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {deals.map((product) => (
            <ProductCard key={product.id} product={product} onAdd={onAdd} />
          ))}
        </div>
      </div>
    </section>
  );
}
