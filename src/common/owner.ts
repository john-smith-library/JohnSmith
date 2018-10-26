import { Disposable } from "./disposable";

export class Owner implements Disposable {
    private _properties: Disposable[];

    constructor(properties?: Disposable[]) {
        this._properties = properties || [];
    }

    own<T extends Disposable>(property: T): T {
        this._properties.push(property);
        return property;
    }

    dispose(){
        for (let i = 0; i < this._properties.length; i++) {
            this._properties[i].dispose();
        }
    }
}