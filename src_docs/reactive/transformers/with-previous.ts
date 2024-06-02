import { ObservableValue } from 'john-smith/reactive';
import { withPrevious } from 'john-smith/reactive/transformers/with-previous';

const original = new ObservableValue<string>('John');
const transformed = withPrevious(original);

transformed.listen(({ current, previous }) => {
  console.log(current, previous);
});

original.setValue('Joe');

// Outputs
// "John" undefined
// "Joe" "John"
