import { Event } from './event';

describe('trigger', () => {
    it('passes argument to listener', () => {
        const
            event = new Event<string>(),
            listener = jasmine.createSpy();

        event.listen(listener);
        event.trigger('foo');

        expect(listener).toHaveBeenCalled();
        expect(listener.calls.first().args[0]).toBe('foo');
    });
});

describe('getListenersCount', () => {
    it('should increase on adding listeners', () => {
        const event = new Event();

        expect(event.getListenersCount()).toBe(0);

        event.listen(function(){});
        expect(event.getListenersCount()).toBe(1);

        event.listen(function(){});
        expect(event.getListenersCount()).toBe(2);
    });

    it('should decrease on disposing listeners', () => {
        const event = new Event();

        expect(event.getListenersCount()).toBe(0);

        const link = event.listen(function () {
        });
        expect(event.getListenersCount()).toBe(1);

        link.dispose();
        expect(event.getListenersCount()).toBe(0);
    });
});