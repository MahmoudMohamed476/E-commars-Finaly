import { useEffect, useMemo, useState } from "react";
import { Clock } from "lucide-react";
import { products } from "../data/products";
import type { Product } from "../types";
import ProductCard from "./ProductCard";

const DURATION = 6 * 60 * 60; 
const DEALS_PER_PAGE = 6;

const allDeals = products.filter((p) => p.originalPrice);


const getRound = (now: number) => Math.floor(now / (DURATION * 1000));


const getSecondsLeft = (now: number) =>
  DURATION - Math.floor((now % (DURATION * 1000)) / 1000);


function seededRandom(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}


function pickDeals(round: number): Product[] {
  const rand = seededRandom(round);
  const arr = [...allDeals];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.slice(0, DEALS_PER_PAGE);
}

function Countdown({ seconds }: { seconds: number }) {
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
  const [now, setNow] = useState(() => Date.now());


  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 500);
    return () => clearInterval(t);
  }, []);

  const round = getRound(now);
  const seconds = getSecondsLeft(now);


  const deals = useMemo(() => pickDeals(round), [round]);

  return (
    <section className="py-6">
      <div className="mx-auto max-w-375 px-4">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-4">
            <h2 className="font-display text-xl font-bold text-[#0F1111] dark:text-[#E7E9EA]">
              Today's Deals
            </h2>
            <Countdown seconds={seconds} />
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