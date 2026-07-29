import { useQuery } from '@tanstack/react-query';

async function fetchJSON<T>(path: string): Promise<T> {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`Failed to fetch ${path}`);
  return res.json();
}

export function useSolarData() {
  return useQuery({ queryKey: ['solar'], queryFn: () => fetchJSON('/data/capacity/solar.json') });
}

export function useWindData() {
  return useQuery({ queryKey: ['wind'], queryFn: () => fetchJSON('/data/capacity/wind.json') });
}

export function useHistoricalData() {
  return useQuery({ queryKey: ['historical'], queryFn: () => fetchJSON('/data/capacity/historical-re.json') });
}

export function useMarketPlayers() {
  return useQuery({ queryKey: ['players'], queryFn: () => fetchJSON('/data/capacity/market-players.json') });
}

export function useGeography() {
  return useQuery({ queryKey: ['geography'], queryFn: () => fetchJSON('/data/geography/state-re.json') });
}

export function useSolarRisks() {
  return useQuery({ queryKey: ['solarRisks'], queryFn: () => fetchJSON('/data/risks/solar-risks.json') });
}

export function useWindRisks() {
  return useQuery({ queryKey: ['windRisks'], queryFn: () => fetchJSON('/data/risks/wind-risks.json') });
}

export function useNews() {
  return useQuery({ queryKey: ['news'], queryFn: () => fetchJSON('/data/news/re-news.json') });
}
