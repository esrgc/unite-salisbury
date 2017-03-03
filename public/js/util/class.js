/*
Tu Hoang
ESRGC
2014

class.js
utility functions that implements OOP
*/

/*
function that defines a new class by passing a new
prototype object (literal) as parameter. New classes
can extend/inherit from other classes by passing the 
inherit class name to extend property of the new class 
prototype object

Example:
var newClass = dx.define({
extend: OtherClass,
initialize: function(options){
};
});
*/
var define = function(child) {
  var ch = child;
  var p = ch.extend;
  var _class_ = null;
  if (p == null || typeof p == 'undefined') {
    _class_ = function() {
      if (typeof this.initialize != 'undefined')
        this.initialize.apply(this, arguments);
    };
    _class_.prototype = ch;
  } else {
    _class_ = function() {
      var init = typeof this.initialize == 'function' ? this.initialize : 'undefined';
      //run child initialize function if exists
      if (typeof init == 'function') {
        init.apply(this, arguments);
      }
    };
    extend(_class_, p); //inherit prototype
    copy(_class_.prototype, ch); //augment prototype
  }
  return _class_;
};
/*
Deep copy object prototype by new keyword.
This method creates a new prototype object, whose prototype 
is a copy of the parent's prototype, and assign it to the child prototype.
Finally, sets the child's prototype constructor to the child's constructor
*/
var extend = function(child, parent) {
  var F = function() {};
  F.prototype = parent.prototype;
  child.prototype = new F();
  child.prototype.constructor = child;
  child.parent = parent.prototype;
};
//copy object properties
var copy = function(dest, source) {
  dest = dest || {};
  if (source) {
    for (var property in source) {
      var value = source[property];
      if (value !== undefined) {
        dest[property] = value;
      }
    }
    /**
     * IE doesn't include the toString property when iterating over an object's
     * properties with the for(property in object) syntax.  Explicitly check if
     * the source has its own toString property.
     */
    /*
     * FF/Windows < 2.0.0.13 reports "Illegal operation on WrappedNative
     * prototype object" when calling hawOwnProperty if the source object
     * is an instance of window.Event.
     */

    var sourceIsEvt = typeof window.Event == "function" && source instanceof window.Event;

    if (!sourceIsEvt &&
      source.hasOwnProperty && source.hasOwnProperty("toString")) {
      dest.toString = source.toString;
    }
  }
  return dest;
};
