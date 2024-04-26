import { ObservableValue } from '../observable-value';
import { combine } from './combine';

function createCombined() {
  const firstName = new ObservableValue<string>('');
  const lastName = new ObservableValue<string>('');
  const fullName = combine(
    firstName,
    lastName,
    (first, last) => first + ' ' + last
  );

  return {
    firstName: firstName,
    lastName: lastName,
    fullName: fullName,
  };
}

describe('combine observable', function () {
  it('should notify on changes', function () {
    const data = createCombined();
    const results: (string | null)[] = [];

    data.fullName.listen(x => results.push(x));

    data.firstName.setValue('John');
    data.lastName.setValue('Smith');

    expect(results).toEqual([' ', 'John ', 'John Smith']);
  });

  it('should respect raiseInitial argument', function () {
    const data = createCombined();
    const results: (string | null)[] = [];

    data.fullName.listen(x => results.push(x), false);

    data.firstName.setValue('John');
    data.lastName.setValue('Smith');

    expect(results).toEqual(['John ', 'John Smith']);
  });

  it('should release links after disposing', function () {
    const data = createCombined(),
      results: (string | null)[] = [];

    const link = data.fullName.listen(x => results.push(x), false);

    expect(data.firstName.getListenersCount()).toBe(1);
    expect(data.lastName.getListenersCount()).toBe(1);

    link.dispose();

    expect(data.firstName.getListenersCount()).toBe(0);
    expect(data.lastName.getListenersCount()).toBe(0);
  });
});
