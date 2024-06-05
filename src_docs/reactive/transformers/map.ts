import { ObservableValue } from 'john-smith/reactive';
import { map } from 'john-smith/reactive/transformers/map';

const name = new ObservableValue<string>('');

const uppercaseName = map(name, n => n?.toUpperCase());

uppercaseName.listen(x => console.log(x));
name.setValue('John');

// outputs: 'JOHN'
