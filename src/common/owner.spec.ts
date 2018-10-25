import {Disposable} from "./disposable";
import {Owner} from "./owner";

class DisposableMock implements Disposable{
    disposed: boolean = false;

    dispose() {
        this.disposed = true;
    }
}

test('disposes properties', () => {
    const
        property = new DisposableMock(),
        owner = new Owner();

    owner.own(property);
    owner.dispose();

    expect(property.disposed).toBe(true);
});