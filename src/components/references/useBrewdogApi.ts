'use client';
import { useState, useCallback } from 'react';
import { PunkBeer, BJCPStyle } from '@/lib/types';

const BASE_URL = 'https://punkapi-alxiw.amvera.io/v3';

interface UseBrewdogApiReturn {
  beers: PunkBeer[];
  loading: boolean;
  error: string | null;
  fetchForStyle: (style: BJCPStyle, page?: number) => Promise<void>;
  reset: () => void;
}

export function useBrewdogApi(): UseBrewdogApiReturn {
  const [beers, setBeers]     = useState<PunkBeer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  const reset = useCallback(() => { setBeers([]); setError(null); }, []);

  const fetchForStyle = useCallback(async (style: BJCPStyle, page = 1) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: String(page),
        per_page: '12',
        ibu_gt: String(Math.max(0, style.ibu[0] - 10)),
        ibu_lt: String(style.ibu[1] + 10),
        abv_gt: String(Math.max(0, style.abv[0] - 0.5)),
        abv_lt: String(style.abv[1] + 0.5),
      });
      if (style.srm[1] > 3) {
        const ebcMin = Math.round(style.srm[0] * 1.97);
        const ebcMax = Math.round(style.srm[1] * 1.97);
        params.set('ebc_gt', String(Math.max(0, ebcMin - 5)));
        params.set('ebc_lt', String(ebcMax + 5));
      }
      const res = await fetch(`${BASE_URL}/beers?${params}`);
      if (!res.ok) throw new Error(`API error: ${res.status}`);
      const data: PunkBeer[] = await res.json();
      const filtered = data.filter(b =>
        b.target_og >= style.og[0] * 1000 - 5 &&
        b.target_og <= style.og[1] * 1000 + 5
      );
      setBeers(page === 1 ? filtered : prev => [...prev, ...filtered]);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao buscar receitas');
    } finally {
      setLoading(false);
    }
  }, []);

  return { beers, loading, error, fetchForStyle, reset };
}
