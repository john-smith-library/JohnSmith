import { Event } from './event';

describe('trigger', () => {
    it('passes argument to listener', () => {
        const
            event = new Event<string>(),
            listener = jest.fn();

        event.listen(listener);
        event.trigger('foo');

        expect(listener).toHaveBeenCalled();
        expect(listener.mock.calls[0][0]).toBe('foo');
    });
});

describe('getListenersCount', () => {
    it('should increase on adding listeners', () => {
        const event = new Event();

        expect(event.getListenersCount()).toBe(0);

        event.listen(jest.fn());
        expect(event.getListenersCount()).toBe(1);

        event.listen(jest.fn());
        expect(event.getListenersCount()).toBe(2);
    });

    it('should decrease on disposing listeners', () => {
        const event = new Event();

        expect(event.getListenersCount()).toBe(0);

        const link = event.listen(jest.fn());
        expect(event.getListenersCount()).toBe(1);

        link.dispose();
        expect(event.getListenersCount()).toBe(0);
    });
});
