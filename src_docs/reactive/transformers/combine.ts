import { ObservableValue } from 'john-smith/reactive';
import { combine } from 'john-smith/reactive/transformers/combine';

const firstName = new ObservableValue<string>('');
const lastName = new ObservableValue<string>('');

const combined = combine(
  firstName,
  lastName,
  (firstNameValue, lastNameValue) =>
    (firstNameValue || '') + ' ' + (lastNameValue || '')
);

combined.listen(v => console.log(v));

firstName.setValue('John');
lastName.setValue('Smith');

// outputs 'John Smith'
