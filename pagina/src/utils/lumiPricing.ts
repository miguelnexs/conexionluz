export function getLumiPriceForService(priceCOP?: number | null): number {
  if (!priceCOP || priceCOP <= 0) return 0;
  // 1 Lumi = $50 COP exact conversion
  return Math.round(priceCOP / 50);
}

export function notifyLumiBalanceUpdated(newBalance: number) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('conexionluz:lumi_wallet_balance', String(newBalance));
    window.dispatchEvent(new CustomEvent('lumi-balance-updated', { detail: newBalance }));
  }
}
