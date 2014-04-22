(function(){
    var now = Date.now || function() {
        return new Date();
    };

    var theCSSPrefix = '';
    var theDashedCSSPrefix = '';

    var detectCSSPrefix = function() {
        var rxPrefixes = /^(?:O|Moz|webkit|ms)|(?:-(?:o|moz|webkit|ms)-)/;
        if(!getStyle) {
            return;
        }

        var style = getStyle(body, null);

        for(var k in style) {
            theCSSPrefix = (k.match(rxPrefixes) || (+k == k && style[k].match(rxPrefixes)));
            if(theCSSPrefix) {
                break;
            }
        }

        if(!theCSSPrefix) {
            theCSSPrefix = theDashedCSSPrefix = '';
            return;
        }

        theCSSPrefix = theCSSPrefix[0];
        if(theCSSPrefix.slice(0,1) === '-') {
            theDashedCSSPrefix = theCSSPrefix;
            theCSSPrefix = ({
                '-webkit-': 'webkit',
                '-moz-': 'Moz',
                '-ms-': 'ms',
                '-o-': 'O'
            })[theCSSPrefix];
        } else {
            theDashedCSSPrefix = '-' + theCSSPrefix.toLowerCase() + '-';
        }
    };

    var polyfillRequestAnimFrame = function() {
        var requestAnimFrame = window.requestAnimationFrame || window[theCSSPrefix.toLowerCase() + 'RequestAnimationFrame'];

        var lastTime = now();

        if(_isMobile || !requestAnimFrame) {
            requestAnimFrame = function(callback) {
                //How long did it take to render?
                var deltaTime = now() - lastTime;
                var delay = Math.max(0, 1000 / 60 - deltaTime);

                return window.setTimeout(function() {
                    lastTime = now();
                    callback();
                }, delay);
            };
        }

        return requestAnimFrame;
    };

    $(function(){

    });
})();
