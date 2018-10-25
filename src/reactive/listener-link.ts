import {ListenerCallback} from "./listenable";
import {Disposable} from "../common";
import {ArrayUtils} from "../utils/array";

export class ListenerLink<T> implements Disposable {
    constructor(private allListeners:  ListenerCallback<T>[], private currentListener: ListenerCallback<T>){
    }

    dispose(){
        ArrayUtils.removeItem(this.allListeners, this.currentListener);
    }
}