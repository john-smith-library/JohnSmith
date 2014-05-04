describe('unit- observable - DependentObservableValue', function(){
    'use strict';

    it('calls listener on dependencies change', function() {
        var firstName = new js.ObservableValue();
        var lastName = new js.ObservableValue();
        var fullName = new js.DependentValue(
            function(){ return null; },
            [firstName, lastName]);

        var changeSpy = jasmine.createSpy();
        fullName.listen(changeSpy);

        firstName.setValue('John');
        expect(changeSpy).toHaveBeenCalled();
        expect(changeSpy.calls.count()).toBe(2);

        lastName.setValue('Smith');
        expect(changeSpy.calls.count()).toBe(3);
    });

    describe('getValue()', function(){
        it('should return evaluated value', function(){
            var firstName = new js.ObservableValue();
            var lastName = new js.ObservableValue();
            var fullName = new js.DependentValue(
                function(firstNameValue, lastNameValue){
                    return firstNameValue + ' ' + lastNameValue;
                },
                [firstName, lastName]);

            firstName.setValue('John');
            lastName.setValue('Smith');
            
            expect(fullName.getValue()).toBe('John Smith');
        });
    });
});