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

describe('ownIfNotNull', () => {
   it("adds disposable if not null", () => {
       const owner = new Owner();
       const property = new DisposableMock();

       owner.ownIfNotNull(property);
       owner.dispose();

       expect(property.disposed).toBe(true);
   });

    it('does nothing if null', () => {
        const owner = new Owner();
        owner.ownIfNotNull(null);
        owner.dispose();
    });
});
