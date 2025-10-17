import { minFreePipe } from 'src/utils';

describe('minFreePipe', () => {
  it('should return the smaller value when value is less than threshold', () => {
    const clampTo100 = minFreePipe(100);
    expect(clampTo100(50)).toBe(50);
  });

  it('should return the threshold when value is greater than threshold', () => {
    const clampTo100 = minFreePipe(100);
    expect(clampTo100(150)).toBe(100);
  });

  it('should return the threshold when value equals threshold', () => {
    const clampTo100 = minFreePipe(100);
    expect(clampTo100(100)).toBe(100);
  });

  it('should work with negative numbers', () => {
    const clampToZero = minFreePipe(0);
    expect(clampToZero(-5)).toBe(-5);
    expect(clampToZero(5)).toBe(0);
  });

  it('should be curried and reusable', () => {
    const clampTo50 = minFreePipe(50);
    expect(clampTo50(100)).toBe(50);
    expect(clampTo50(25)).toBe(25);
    expect(clampTo50(50)).toBe(50);
  });

  it('should work with decimal numbers', () => {
    const clampTo10Point5 = minFreePipe(10.5);
    expect(clampTo10Point5(10.4)).toBe(10.4);
    expect(clampTo10Point5(10.6)).toBe(10.5);
  });
});
