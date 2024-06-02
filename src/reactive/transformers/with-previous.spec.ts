import { withPrevious } from './with-previous';
import { ObservableValue } from '../observable-value';

describe('withPrevious', () => {
  it('creates listenable', () => {
    const value = withPrevious(new ObservableValue<string>('initial'));

    expect(value.listen).toBeDefined();
  });

  describe('listen', () => {
    it('should subscribe to initial values', () => {
      const value = withPrevious(new ObservableValue<string>('John'));

      let listenResult: {
        current: string;
        previous: string | undefined;
      } | null = null;

      value.listen(x => {
        listenResult = x;
      });

      expect(listenResult).not.toBeNull();
      expect(listenResult!.current).toBe('John');
      expect(listenResult!.previous).toBe(undefined);
    });

    it('should subscribe to updated values', () => {
      const originalValue = new ObservableValue<string>('John');
      const value = withPrevious(originalValue);

      let listenResult: {
        current: string;
        previous: string | undefined;
      } | null = null;

      value.listen(x => {
        listenResult = x;
      });

      originalValue.setValue('Joe');

      expect(listenResult).not.toBeNull();
      expect(listenResult!.current).toBe('Joe');
      expect(listenResult!.previous).toBe('John');
    });
  });
});
