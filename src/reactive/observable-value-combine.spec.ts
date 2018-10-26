import {ObservableValue} from "./observable-value";
import '../reactive-extensions/observable/combine';

function createCombined() {
    const
        firstName = new ObservableValue<string>(),
        lastName = new ObservableValue<string>(),
        fullName = firstName.combine(lastName, (first, last) => first + ' ' + last);

    return {
        firstName: firstName,
        lastName: lastName,
        fullName: fullName
    };
}

describe('combine observable', function () {
    it('getValue should be transformed', function () {
        const data = createCombined();

        data.firstName.setValue('John');
        data.lastName.setValue('Smith');

        expect(data.fullName.getValue()).toBe('John Smith');
    });

    it('should notify on changes', function () {
        const
            data = createCombined(),
            results: (string|null)[] = [];

        data.fullName.listen(x => results.push(x));

        data.firstName.setValue('John');
        data.lastName.setValue('Smith');

        expect(results).toEqual([
            'null null',
            'John null',
            'John Smith'
        ]);
    });

    it('should respect raiseInitial argument', function () {
        const
            data = createCombined(),
            results: (string|null)[] = [];

        data.fullName.listen(x => results.push(x), false);

        data.firstName.setValue('John');
        data.lastName.setValue('Smith');

        expect(results).toEqual(['John null', 'John Smith']);
    });

    it('should release links after disposing', function () {
        const
            data = createCombined(),
            results: (string|null)[] = [];

        const link = data.fullName.listen(x => results.push(x), false);

        expect(data.firstName.getListenersCount()).toBe(1);
        expect(data.lastName.getListenersCount()).toBe(1);

        link.dispose();

        expect(data.firstName.getListenersCount()).toBe(0);
        expect(data.lastName.getListenersCount()).toBe(0);
    });
});