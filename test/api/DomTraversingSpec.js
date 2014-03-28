input(
    '(selector)',
    function(){
        return js.dom('body');
    });

input(
    '.find(selector)',
    function(){
        return js.dom.find('body');
    });

describeInputs('api - js.dom', function(dom){
    it('should return object', function(){
        expect(dom()).toBeTruthy();
    });

    it('has $', function(){
        expect(dom().$).toBeTruthy();
        expect(dom().$.length).toBe(1);
    });
});

