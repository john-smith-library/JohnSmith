describe('unit - views - jquery - JQueryElement', function(){
    var element;

    beforeEach(function(){
        ui('<div id="target"></div>');
        element = new js.JQueryElement($('#target'));
    });

    describe('appendHtml', function(){
        it('throws error if html is null', function(){
            expect(function(){
                element.appendHtml(null);
            }).toThrowError();
        });

        it('throws error if html is undefined', function(){
            expect(function(){
                element.appendHtml();
            }).toThrowError();
        });

        it('throws error if html is not a string', function(){
            expect(function(){
                element.appendHtml({foo:'bar'});
            }).toThrowError();
        });
    });

    describe('getNodeName', function(){
        it('should return node name if target is single element', function(){
            $('#target').html('<input />');

            expect(element.getNodeName()).toBe('DIV');
        });
    });
});