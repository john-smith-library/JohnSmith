import { DebugTroubleshooter } from './debug-troubleshooter';
import { DefaultViewRenderer } from '../view/default-view-renderer';
import { NativeDomEngine } from '../view/dom-engine-native';
import { DefaultBindingRegistry } from '../binding/registry';
import { NoopTroubleshooter } from '../troubleshooting/noop-troubleshooter';
import { ErrorsView } from './errors-view';
import { ErrorsViewModel } from './errors-view-model';

import '../troubleshooting/global';

const LOG = console ? console.log : () => undefined;
const ERROR = console ? console.error : () => undefined;

const debuggerViewModel = new ErrorsViewModel();

globalThis.JS.TroubleShooterFactory = () => {
  try {
    INITIALIZER();

    const domEngine = new NativeDomEngine();

    const root = domEngine.getRoot();

    if (!root) {
      throw new Error(
        'Cannot find page root element to attach JohnSmith debug tools.'
      );
    }

    return new DebugTroubleshooter(root, debuggerViewModel, () => {
      new DefaultViewRenderer(
        domEngine,
        new DefaultBindingRegistry(),
        new NoopTroubleshooter()
      ).render(root, ErrorsView, debuggerViewModel);
    });
  } catch (e) {
    ERROR(e);
    ERROR('Noop debugger will be used.');

    return new NoopTroubleshooter();
  }
};

const INITIALIZER = () => {
  LOG('');

  LOG(`========================================================== 
       _       _              _____           _ _   _     
      | |     | |            / ____|         (_) | | |    
      | | ___ | |__  _ __   | (___  _ __ ___  _| |_| |__  
  _   | |/ _ \\| '_ \\| '_ \\   \\___ \\| '_ \` _ \\| | __| '_ \\  
 | |__| | (_) | | | | | | |  ____) | | | | | | | |_| | | | 
  \\____/ \\___/|_| |_|_| |_| |_____/|_| |_| |_|_|\\__|_| |_| 
========================================================== `);

  const style = document.createElement('style');
  style.innerHTML = `
.js-debugger section,
.js-debugger header,
.js-debugger main,
.js-debugger div,
.js-debugger ul,
.js-debugger li {
    padding: 0;
    margin: 0;
    font-size: 12px;
    font-family: Arial;
}
    
.js-debugger {
    position: fixed;
    top: 50px;
    right: 50px;
    opacity: 0.5;
    width: 300px;
    transition: opacity 2s;
    border: 1px solid #333333;
    background: #FFFFFF;
    box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
    border-radius: 2px;
}

.js-debugger header {
    background: #333333;
    color: #FFFFFF;
    display: flex;
    height: 30px;
    flex-direction: row;
    align-items: center;
    color: #DDDDDD;
    padding-right: 5px;
}

.js-debugger header svg {
    fill: #666666;
    margin: 0 3px;
}

.js-debugger:hover {
    opacity: 1;
    transition: opacity 0.1s;
}

.js-debugger ul,
.js-debugger ul li {
    list-style-type: none;
}

.js-debugger ul li {
    padding: 5px;
    display: flex;
    flex-direction: row;
    border-bottom: 1px solid #DDDDDD;
}

.js-debugger ul li:last-child {
    border-bottom: none;
}

.js-debugger ul li:hover {
    background: rgba(255, 0, 0, 0.3);
}

.js-debugger ul li .js-debugger-error-index {
    flex: 0 0 25px;
    color: red;
}

.js-debugger-error {
    background: rgba(255, 0, 0, 0.3);
}

    `;
  document.getElementsByTagName('head')[0].appendChild(style);
};
