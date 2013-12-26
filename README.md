<p align="center">
    <img src='https://raw.github.com/guryanovev/JohnSmith/master/src_examples/assets/images/logo_large.png' alt='JohnSmith' />
</p>

JohnSmith is a lightweight JavaScript UI library that utilizes the concepts of _anti-declarative binding_ and
_self-contained reusable views_ to provide simple yet powerful basis for complex client-side applications.

[![Build Status](https://travis-ci.org/guryanovev/JohnSmith.png?branch=master)](https://travis-ci.org/guryanovev/JohnSmith)

Quick Samples to meet JohnSmith
-------
- [User Greeter](http://john-smith-js.com/index.html)
- [File System Tree](http://john-smith-js.com/filetree.html)

Binding
-------

*Binding* feature allow you to wire JavaScript object properties to UI elements. The special thing about JohnSmith's binding is
that it's anti-declarative, all configuration goes to the code. That means the markup is clear of binding related attributes
and elements:

```javascript
/***************************
 * Bind static value
 ***************************/
js.bind("John").to("#myFirstName");    // It is actually the same as $("#myFirstName").text("John");

/***************************
 * Bind dynamic value
 ***************************/
var firstName = js.bindableValue();    // Create observable variable.
js.bind(firstName).to("#myFirstName"); // Setup binding.
firstName.setValue("John");            // Changing the value will cause corresponding UI changes.

/***************************
 * Bind with view rendering
 ***************************/
var me = js.bindableValue();
js.bind(me).to("#me", PersonView);      // PersonView is a view "class". Views described later
me.setValue(personViewModel);           // personViewModel is some kind of object with person data

/***************************
 * Bind lists
 ***************************/
var myFriends = js.bindableList();                   // create observable list
js.bind(myFriends).to("#friendsList", FriendView);   // every list item will be rendered using FriendView view
myFriends.add(friend1, friend2);                     // add some friends. JohnSmith will detect this and change the UI
myFriends.remove(friend2);                           // remove the item. Again JohnSmith will react on this change.
```

View Model
----------
*View Model* is a bridge between Business Logic and View Logic. *View Model* exposes properties and methods that are
indented to be  consumed by the view. The properties could be regular fields or they could be bindable variables if
the View wants to track changes.

```javascript
var PersonViewModel = function(){
    this.firstName = "John";                        // this is going to be static
    this.lastName = js.bindableValue("Smith")       // this is bindable, so UI can track changes
};
```

Views
-----

*View* is a reusable block of UI with attached behaviour. In a nutshell *View* is a combination of _template_
and _rendering logic_:

```javascript
var PersonView = function(){
    this.template = "..template goes here...";
    this.init = function() {
        // rendering logic does here
    };
};
```

_Template_ is a simple HTML markup (or jQuery selector referencing this markup) and _rendering logic_ is usually a
bunch of binding configuration and events subscriptions:

```javascript
var PersonView = function(){
    // here we use plain html as view template
    this.template = "<span class='firstName' /> <span class='lastName' />";

    this.init = function(view) {
        // NOTE that .firstName and .lastName selectors
        // will be searched within the rendered template. It helps
        // to keep the view fully reusable and independent from the outside markup.

        view.bind("John").to(".firstName");
        view.bind("Smith").to(".lastName");
    };
};
```

View is supposed to work with a particular *[View Model](#view-model)*:

```javascript
var PersonView = function(){
    this.template = "#personViewTemplate";  // here we use jQuery selector to reference template
    this.init = function(view, viewModel) {
        view.bind(viewModel.firstName).to(".firstName");
        view.bind(viewModel.lastName).to(".lastName");
    };
};
```

Once you have a *View* class defined you can:

- render the view:

```javascript
js.renderView(PersonView, personViewModel).to("#me");
```

- attach the view to existing markup (template could be avoided in this case):

```javascript
js.attachView(PersonView, personViewModel).to("#me");
```

- use the view for binding:

```javascript
js.bind(joeBlogs).to("#myFriend", PersonView);
```

- add the view as a child to another view:

```javascript
var PersonDetailsView = function(){
    // ...
};

var PersonView = function(){
    this.template = "...";
    this.init = function(viewModel) {
        // ...

        this.addChild(".details", PersonDetailsView, viewModel.createDetailsViewModel());
    };
};
```

Binding + Views
---------------

You can setup binding to use a View for rendering. And a View could configure new bindings. These infinite cycle allow you
to build composite interface and use Views as reusable UI bricks.


---

[Discover more samples here](http://john-smith-js.com/)
