
interface Movable {
    updatePosition(relativeTop: number, relativeTopPercent: number): void;
    updateSize(width:number, height:number): void;
}

interface ValueTarget {
    setValue(value: any): void;
    updateSize(width:number, height:number): void;
}

class RangeMovable implements Movable {
    private _fromScrolPercent: number;
    private _toScrollPercent: number;

    updatePosition(relativeTop: number, relativeTopPercent: number):void {
    }

    updateSize(width:Number, height:Number):void {
    }

}