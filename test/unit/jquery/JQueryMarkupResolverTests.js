var testCase = TestCase("unit.jquery.JQueryMarkupResolverTests");

testCase.prototype.setUp = function(){
    this.resolver = new JohnSmith.JQuery.JQueryMarkupResolver();
};

testCase.prototype.testResolve_JQuerySelector_ShouldReturnInnerHtml = function(){
    /*:DOC += <script id="template" type="text/view">
                <div class="container">content</div>
              </script> */

    var resolvedHtml = this.resolver.resolve("#template");

    assertNotNull("Resolved markup", resolvedHtml);
    assertString("Resolved markup", resolvedHtml);
    assertEquals("Resolved markup", '<div class="container">content</div>', resolvedHtml.trim());
};

testCase.prototype.testResolve_JQueryObject_ShouldReturnInnerHtml = function(){
    /*:DOC += <script id="template" type="text/view">
                <div class="container">content</div>
              </script> */

    var resolvedHtml = this.resolver.resolve($("#template"));

    assertNotNull("Resolved markup", resolvedHtml);
    assertString("Resolved markup", resolvedHtml);
    assertEquals("Resolved markup", '<div class="container">content</div>', resolvedHtml.trim());
};

testCase.prototype.testResolve_PlainMarkup_ShouldReturnInnerHtml = function(){
    var resolvedHtml = this.resolver.resolve('<div class="container">content</div>');

    assertNotNull("Resolved markup", resolvedHtml);
    assertString("Resolved markup", resolvedHtml);
    assertEquals("Resolved markup", '<div class="container">content</div>', resolvedHtml.trim());
};

testCase.prototype.testResolve_OrphanJQueryObject_ShouldReturnInnerHtml = function(){
    var resolvedHtml = this.resolver.resolve($('<div class="container">content</div>'));

    assertNotNull("Resolved markup", resolvedHtml);
    assertString("Resolved markup", resolvedHtml);
    assertEquals("Resolved markup", '<div class="container">content</div>', resolvedHtml.trim());
};

testCase.prototype.testResolve_OrphanConstructedJQueryObject_ShouldReturnInnerHtml = function(){
    var resolvedHtml = this.resolver.resolve($("<div>").addClass("container").text("content"));

    assertNotNull("Resolved markup", resolvedHtml);
    assertString("Resolved markup", resolvedHtml);
    assertEquals("Resolved markup", '<div class="container">content</div>', resolvedHtml.trim());
};
