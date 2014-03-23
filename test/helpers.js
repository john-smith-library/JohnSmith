function expectCodeToRenderText(payload){
    ui('<div id="target"></div>');

    var selector = '#target';
    var value = '<b>foo</b>';

    payload(selector, value);

    expect($(selector).text()).toBe(value);
}

function expectCodeToRenderHtml(payload){
    ui('<div id="target"></div>');

    var selector = '#target';
    var value = '<b>foo</b>';

    payload(selector, value);

    expect($(selector).html()).toBe(value);
}
