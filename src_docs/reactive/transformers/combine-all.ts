import { ObservableValue } from 'john-smith/reactive';
import { combineAll } from 'john-smith/reactive/transformers/combine-all';

const firstName = new ObservableValue<string>('');
const lastName = new ObservableValue<string>('');
const age = new ObservableValue<number>(0);

const combined = combineAll([firstName, lastName, age]);

combined.listen(([firstNameValue, lastNameValue, ageValue]) =>
  console.log(`Name: ${firstNameValue} ${lastNameValue}, Age: ${ageValue}`)
);

firstName.setValue('John');
lastName.setValue('Smith');
age.setValue(30);

// outputs 'Name: John Smith, Age: 30'
