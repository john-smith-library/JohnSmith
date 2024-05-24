import { NoopTroubleshooter } from './noop-troubleshooter';

it('should do nothing', () => {
  const troubleshooter = new NoopTroubleshooter();
  troubleshooter.bindingNotFound();
  troubleshooter.unknownHtmlDefinition();
  troubleshooter.elementNotFound();
});
