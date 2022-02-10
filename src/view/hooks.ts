/**
 * @module view
 */

import {OptionalDisposables} from '../common';
import {RenderingContext } from './view-definition';

export type StandardHook<ViewModel> = (viewModel: ViewModel, context: RenderingContext) => OptionalDisposables;

/**
 * Defines On Before Init view hook.
 *
 * This hook is called after view markup composed and attached to the DOM
 * but before any bindings and listeners connected. This is a good point
 * to manually modify the DOM, setup manual bindings and so on.
 */
export interface OnBeforeInit<ViewModel> {
    onBeforeInit: StandardHook<ViewModel>
}

/**
 * Defines On Unrender view hook.
 */
export interface OnInit<ViewModel> {
    onInit(viewModel: ViewModel, context: RenderingContext): OptionalDisposables;
}

export interface OnUnrender<ViewModel> {
    onUnrender(viewModel: ViewModel, context: RenderingContext, unrender: () => void): void;
}