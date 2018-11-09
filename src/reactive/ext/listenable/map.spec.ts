import {ObservableValue} from '../../observable-value';
import './map';

function createMap() {
    const source = new ObservableValue<string>();

    return {
        source: source,
        mapped: source.map(x => x == null ? null : x.toUpperCase())
    };
}

describe('listen', () => {
    it('should produce listenable', () => {
        const data = createMap();

        let lastResult: string|null = null;

        data.mapped.listen(value => lastResult = value);

        data.source.setValue('john');

        expect(lastResult).toBe('JOHN');
    });

    it('should call callback for initial value', () => {
        const data = createMap();

        let lastResult: string|null = null;

        data.source.setValue('john');
        data.mapped.listen(value => lastResult = value);

        expect(lastResult).toBe('JOHN');
    });

    it('should remove parent listener on dispose', () => {
        const data = createMap();

        data.source.setValue('john');
        const link = data.mapped.listen(() => {});

        expect(data.source.getListenersCount()).toBe(1);

        link.dispose();

        expect(data.source.getListenersCount()).toBe(0);
    });
});

describe('getListenersCount', () => {
    it('should increment on listen', () => {
        const data = createMap();

        expect(data.mapped.getListenersCount()).toBe(0);

        data.mapped.listen(() => {});

        expect(data.mapped.getListenersCount()).toBe(1);
    });
});
