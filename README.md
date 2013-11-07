JohnSmith
=========

[![Build Status](https://travis-ci.org/guryanovev/JohnSmith.png?branch=master)](https://travis-ci.org/guryanovev/JohnSmith)

JohnSmith is a lightweight JavaScript UI library that utilizes the concepts of _anti-declarative binding_ and
_self-contained reusable views_ to provide simple yet powerful basis for complex client-side applications.

Binding
-------

*Binding feature* allow you to wire JavaScript objects properties to UI elements. The special thing about JohnSmith's binding is
that it's anti-declarative, all configuration goes to code. That means the markup is clear of binding related attributes
and elements.

```javascript
/***************************
 * Bind static value
 ***************************/
js.bind("John").to("#myFirstName");     // It is actually the same as $("#myFirstName").text("John");

/***************************
 * Bind dynamic value
 ***************************/
var firstName = js.bindableValue();     // Create observable variable.
js.bind(firstName).to("#myFirstName");  // Setup binding.
firstName.setValue("John");             // Changing the value will cause corresponding UI changes.

/***************************
 * Bind with view rendering
 ***************************/
var me = js.bindableValue();
js.bind(me).to("#me", PersonView);       // PersonView is a view "class". Views described later
me.setValue(personViewModel);            // personViewModel is some kind of object with person data

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
*ViewModel* is bridge between Business Logic and View Logic. ViewModel exposes properties and methods that are indended to be
 consumed by the view. The properties could be regular fields or they could be bindable variables if the View wants to track changes.

```javascript
var PersonViewModel = function(){
    this.firstName = "John";                        // this is going to be static
    this.lastName = js.bindableValue("Smith")       // this is bindable, so UI can track changes
};
```

Views
-----

*View* is a reusable block of UI with attached behaviour. In a nutshell *View* is a combination of _template_
and _rendering logic_. _Template_ is a simple HTML markup (or jQuery selector referencing this markup) and _rendering logic_ is usually a bunch of binding configuration
and events subscriptions. View could be nested to each other.

Binding + Views
---------------

You can setup binding to use a View for rendering. And a View could configure new bindings. These infinite circle allow you
to use Views as bricks for building composite application UI.



[JohnSmith Docs](http://john-smith-js.com/)
