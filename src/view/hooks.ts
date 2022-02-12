import {OptionalDisposables} from '../common';
import {RenderingContext } from './view-definition';

export type StandardHook = (context: RenderingContext) => OptionalDisposables;

/**
 * Defines On Before Init view hook.
 *
 * This hook is called after view markup composed and attached to the DOM
 * but before any bindings and listeners connected. This is a good point
 * to manually modify the DOM, setup manual bindings and so on.
 */
export interface OnBeforeInit {
    onBeforeInit: StandardHook;
}


export interface OnInit {
    onInit: StandardHook;
}

/**
 * Defines On Unrender view hook.
 */
export interface OnUnrender {
    onUnrender(context: RenderingContext, unrender: () => void): void;
}
