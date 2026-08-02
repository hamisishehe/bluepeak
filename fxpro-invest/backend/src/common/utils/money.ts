import Decimal from 'decimal.js';

Decimal.set({ precision: 28, rounding: Decimal.ROUND_HALF_UP });

export function money(value: string | number | Decimal): Decimal {
  return new Decimal(value);
}

export function moneyString(value: string | number | Decimal): string {
  return money(value).toDecimalPlaces(2).toFixed(2);
}

