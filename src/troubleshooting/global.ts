import {Troubleshooter} from "./troubleshooter";
import '../global';

declare module '../global' {
    interface JsGlobal {
        TroubleShooterFactory?: () => Troubleshooter
    }
}
