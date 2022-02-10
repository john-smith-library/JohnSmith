import {BidirectionalValue} from './bidirectional-value';

describe('requestChange', () => {
    it ('should call changeHandler', () => {
        const
            changeHandlerSpy = jest.fn(),
            value = new BidirectionalValue<string>(changeHandlerSpy);

        value.requestUpdate('1');

        expect(changeHandlerSpy).toHaveBeenCalled();
        expect(changeHandlerSpy).toHaveBeenCalledWith('1');
    });

    it ('should accept change on void changeHandler', () => {
        const value = new BidirectionalValue<string>(() => {});

        value.requestUpdate('1');
        expect(value.getValue()).toBe('1');
    });

    it ('should accept change on null changeHandler result', () => {
        const value = new BidirectionalValue<string>(() => null);

        value.requestUpdate('1');
        expect(value.getValue()).toBe('1');
    });

    it ('should accept change on true changeHandler result', () => {
        const value = new BidirectionalValue<string>(() => true);

        value.requestUpdate('1');
        expect(value.getValue()).toBe('1');
    });

    it ('should ignore change on false changeHandler result', () => {
        const value = new BidirectionalValue<string>(() => false, 'initial');

        value.requestUpdate('updated');
        expect(value.getValue()).toBe('initial');
    });

    it ('should set value to provided changeHandler result value', () => {
        const value = new BidirectionalValue<string>(() => ({ newValue: 'validated' }), 'initial');

        value.requestUpdate('updated');

        expect(value.getValue()).toBe('validated');
    });
});
