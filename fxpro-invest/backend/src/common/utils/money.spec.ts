import { money, moneyString } from './money';

describe('money utilities', () => {
  it('calculates a 12 percent weekly return without floating point drift', () => {
    const weeklyReturn = money('2000').mul('12').div(100);
    expect(moneyString(weeklyReturn)).toBe('240.00');
  });
});
