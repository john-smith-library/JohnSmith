var testCase = TestCase("system.JS_BIND.List_Selection");

var items = ["foo", "bar"];

var SimpleView = function(){
    this.template = "#listItemTemplate";
    this.init = function(viewModel){
        this.bind(viewModel).to("a");
    };
};

testCase.prototype.setUp = function(){
    /*:DOC += <script id="listItemTemplate" type="text/view">
                  <a href="#"></a>
              </script> */

    /*:DOC += <div id="listDestination"></div> */
};

// Extended list tests

testCase.prototype.testExtendedSelectableList_CanMarkSelectedItem = function(){
    var selectedItem = this.setUpExtendedList();
    this.assertCanMarkSelectedItem(selectedItem);
};

testCase.prototype.testExtendedSelectableList_CanChangeSelectionOnClick = function(){
    this.setUpExtendedList();
    this.assertCanChangeSelectionOnClick();
};

testCase.prototype.testExtendedSelectableList_CallsCustomCallbackOnClick = function(){
    var callbackWasCalled = false;
    var list = js.bindableList();
    var selectedItem = js.bindableValue();
    var setSelectedFunction = function(value){
        callbackWasCalled = true;
        selectedItem.setValue(value);
    };

    js.bind(list).to(
        "#listDestination",
        SimpleView,
        {
            selectedItem: selectedItem,
            setSelection: setSelectedFunction
        });

    list.setValue(items);

    this.getItemMarkup(1).click();

    assertTrue("Callback was called", callbackWasCalled);
};

// Simple list tests

testCase.prototype.testSimpleSelectableList_CanMarkSelectedItem = function(){
    var selectedItem = this.setUpSimpleList();
    this.assertCanMarkSelectedItem(selectedItem);
};

testCase.prototype.testSimpleSelectableList_CanChangeSelectionOnClick = function(){
    this.setUpSimpleList();
    this.assertCanChangeSelectionOnClick();
};

// Utils methods

testCase.prototype.setUpSimpleList = function(){
    var list = js.bindableList();

    js.bind(list).to("#listDestination", SimpleView, { selectable: true });
    list.setValue(items);

    return list.selectedItem();
};

testCase.prototype.setUpExtendedList = function(){
    var list = js.bindableList();
    var selectedItem = js.bindableValue();
    var setSelectedFunction = function(value){
        selectedItem.setValue(value);
    };

    js.bind(list).to(
        "#listDestination",
        SimpleView,
        {
            selectedItem: selectedItem,
            setSelection: setSelectedFunction
        });

    list.setValue(items);

    return selectedItem;
};

testCase.prototype.getItemMarkup = function(index){
    return $("#listDestination a:eq(" + index + ")");
};

testCase.prototype.isItemSelected = function(index){
    return this.getItemMarkup(index).is(".selected");
};

testCase.prototype.assertCanChangeSelectionOnClick = function(){
    this.getItemMarkup(0).click();

    assertTrue("First item is selected", this.isItemSelected(0));
    assertFalse("Second item is NOT selected", this.isItemSelected(1));

    this.getItemMarkup(1).click();

    assertFalse("First item is NOT selected", this.isItemSelected(0));
    assertTrue("Second item is selected", this.isItemSelected(1));
};

testCase.prototype.assertCanMarkSelectedItem = function(selectedItemBindable){
    selectedItemBindable.setValue(items[0]);

    assertTrue("First item is selected", this.isItemSelected(0));
    assertFalse("Second item is NOT selected", this.isItemSelected(1));

    selectedItemBindable.setValue(items[1]);

    assertFalse("First item is NOT selected", this.isItemSelected(0));
    assertTrue("Second item is selected", this.isItemSelected(1));

    selectedItemBindable.setValue(null);

    assertFalse("First item is NOT selected", this.isItemSelected(0));
    assertFalse("Second item is NOT selected", this.isItemSelected(1));
}