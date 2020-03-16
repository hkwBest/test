/**
 *
 * zy.$.js
 * Minimalist js library follow jQuery v3.2.0
 * DOM、events、ajax
 *
 * Version: 1.0.0
 * Copyright 2016-2017, iReader FE(掌阅书城研发--前端组)
 * License: MIT
 * 
 */

/* jshint expr: true */
/* jshint maxparams: false */
/* jshint -W018 */



;
(function() {

    'use strict';

    var slice = [].slice;
    var concat = [].concat;
    // Use a stripped-down indexOf as it's faster than native
    // https://jsperf.com/thor-indexof-vs-for/5
    var indexOf = function(list, elem) {
        for (var i = 0; i < list.length; i++) {
            if (list[i] === elem) {
                return i;
            }
        }
        return -1;
    };

    var class2type = {};
    var toString = class2type.toString;
    var hasOwn = class2type.hasOwnProperty;
    var fnToString = hasOwn.toString;

    var doc = window.document;
    var docElem = doc.documentElement;


    var zy$ = function(selector) {
        return new zy$.fn.init(selector)
    };


    zy$.fn = zy$.prototype = {

        constructor: zy$,

        // The default length of a zy$ object is 0
        length: 0,

        // Get the Nth element in the matched element set OR
        // Get the whole matched element set as a clean array
        get: function(num) {

            // Return all the elements in a clean array
            if (num == null) {
                return slice.call(this);
            }

            return num < 0 ? this[num + this.length] : this[num];
        },

        // Take an array of elements and push it onto the stack
        // (returning the new matched element set)
        pushStack: function(elems) {

            // Build a new zy$ matched element set
            var ret = zy$.merge(this.constructor(), elems);

            // Return the newly-formed element set
            return ret;
        },

        // Execute a callback for every element in the matched set.
        each: function(callback) {
            return zy$.each(this, callback)
        },

        map: function(callback) {
            return this.pushStack(zy$.map(this, function(elem, i) {
                return callback.call(elem, i, elem)
            }));
        },

        slice: function() {
            return this.pushStack(slice.apply(this, arguments))
        },

        eq: function(i) {
            var len = this.length,
                j = +i + (i < 0 ? len : 0);
            return this.pushStack(j >= 0 && j < len ? [this[j]] : [])
        }
    };


    zy$.extend = zy$.fn.extend = function() {
        var options, name, src, copy, copyIsArray, clone,
            target = arguments[0] || {},
            i = 1,
            length = arguments.length,
            deep = false;

        // Handle a deep copy situation
        if (typeof target === 'boolean') {
            deep = target;

            // Skip the boolean and the target
            target = arguments[i] || {};
            i++;
        }

        // Handle case when target is a string or something (possible in deep copy)
        if (typeof target !== 'object' && !zy$.isFunction(target)) {
            target = {}
        }

        // Extend zy$ itself if only one argument is passed
        if (i === length) {
            target = this;
            i--;
        }

        for (; i < length; i++) {

            // Only deal with non-null/undefined values
            if ((options = arguments[i]) != null) {

                // Extend the base object
                for (name in options) {
                    src = target[name];
                    copy = options[name];

                    // Prevent never-ending loop
                    if (target === copy) {
                        continue;
                    }

                    // Recurse if we're merging plain objects or arrays
                    if (deep && copy && (zy$.isPlainObject(copy) ||
                            (copyIsArray = Array.isArray(copy)))) {

                        if (copyIsArray) {
                            copyIsArray = false;
                            clone = src && Array.isArray(src) ? src : [];
                        } else {
                            clone = src && zy$.isPlainObject(src) ? src : {};
                        }

                        // Never move original objects, clone them
                        target[name] = zy$.extend(deep, clone, copy);

                        // Don't bring in undefined values
                    } else if (copy !== undefined) {
                        target[name] = copy;
                    }
                }
            }
        }

        // Return the modified object
        return target;
    };


    zy$.extend({
        // Unique for each copy of zy$ on the page
        expando: 'zyz' + Math.random().toString().replace(/\D/g, ''),

        isFunction: function(obj) {
            return zy$.type(obj) === 'function';
        },

        isWindow: function(obj) {
            return obj != null && obj === obj.window;
        },

        isPlainObject: function(obj) {
            var proto, Ctor;

            // Detect obvious negatives
            if (!obj || toString.call(obj) !== '[object Object]') {
                return false;
            }

            proto = Object.getPrototypeOf(obj);

            // Objects with no prototype (e.g., `Object.create( null )`) are plain
            if (!proto) {
                return true;
            }

            // Objects with prototype are plain if they were constructed by a global Object function
            Ctor = hasOwn.call(proto, 'constructor') && proto.constructor;
            return typeof Ctor === 'function' && fnToString.call(Ctor) === fnToString.call(Object);
        },

        isEmptyObject: function(obj) {
            for (var name in obj) {
                return false;
            }
            return true;
        },

        type: function(obj) {
            if (obj == null) {
                return obj + '';
            }

            // Android <=2.3, functionish RegExp
            return class2type[toString.call(obj)] || 'object'
        },

        // Convert dashed to camelCase; used by the css and data modules
        camelCase: function(string) {
            return string.replace(/-([a-z])/g, function(all, letter) {
                return letter.toUpperCase()
            });
        },

        each: function(obj, callback) {
            var i = 0;

            if (isArrayLike(obj)) {
                for (; i < obj.length; i++) {
                    if (callback.call(obj[i], i, obj[i]) === false) {
                        break;
                    }
                }
            } else {
                for (i in obj) {
                    if (callback.call(obj[i], i, obj[i]) === false) {
                        break;
                    }
                }
            }

            return obj;
        },

        makeArray: function(arr, results) {
            var ret = results || [];

            if (arr != null) {
                if (isArrayLike(Object(arr))) {
                    zy$.merge(ret, arr)
                } else if (zy$.isWindow(arr)) {
                    [].push.call(ret, arr)
                }
            }

            return ret;
        },

        // Support: Android <=4.0 only, PhantomJS 1 only
        merge: function(first, second) {
            var len = +second.length,
                j = 0,
                i = first.length;

            for (; j < len; j++) {
                first[i++] = second[j];
            }

            first.length = i;

            return first;
        },

        grep: function(elems, callback, invert) {
            var matches = [];

            for (var i = 0; i < elems.length; i++) {
                // undefined -> false
                if (callback(elems[i], i) !== !!invert) {
                    matches.push(elems[i])
                }
            }

            return matches;
        },

        // arg is for internal usage only
        map: function(elems, callback, arg) {
            var value,
                i = 0,
                ret = [];

            // Go through the array, translating each of the items to their new values
            if (isArrayLike(elems)) {
                for (; i < elems.length; i++) {
                    value = callback(elems[i], i, arg);

                    if (value != null) {
                        ret.push(value);
                    }
                }

                // Go through every key on the object,
            } else {
                for (i in elems) {
                    value = callback(elems[i], i, arg);

                    if (value != null) {
                        ret.push(value)
                    }
                }
            }

            // Flatten any nested arrays
            return concat.apply([], ret);
        },

        contains: function(a, b) {
            var adown = a.nodeType === 9 ? a.documentElement : a,
                bup = b && b.parentNode;
            return a === bup || !!(bup && bup.nodeType === 1 && (
                adown.contains ?
                adown.contains(bup) :
                a.compareDocumentPosition && a.compareDocumentPosition(bup) & 16
            ));
        },

        /**
         * removing duplicates
         * @param {ArrayLike} results
         */
        unique: function(results) {
            var elem,
                duplicates = [],
                j = 0,
                i = 0;

            while ((elem = results[i++])) {
                if (elem === results[i]) {
                    j = duplicates.push(i)
                }
            }
            while (j--) {
                results.splice(duplicates[j], 1)
            }

            return results;
        }
    });


    // Populate the class2type map
    zy$.each('Boolean Number String Function Array Date RegExp Object'.split(' '),
        function(i, name) {
            class2type['[object ' + name + ']'] = name.toLowerCase();
        });


    function isArrayLike(obj) {

        // Support: real iOS 8.2 only (not reproducible in simulator)
        // `in` check used to prevent JIT error (gh-2145)
        // hasOwn isn't used here due to false negatives
        // regarding Nodelist length in IE
        var length = !!obj && 'length' in obj && obj.length,
            type = zy$.type(obj);

        if (type === 'function' || zy$.isWindow(obj)) {
            return false;
        }
        return type === 'array' || length === 0 ||
            typeof length === 'number' && length > 0 && (length - 1) in obj;
    }



    // ----------------------------------------------------------------------------------------------- DOM

    var // http://www.w3.org/TR/css3-selectors/#whitespace
        whitespace = '[\\x20\\t\\r\\n\\f]',
        // Instance-specific data
        rattributeQuotes = new RegExp('=' + whitespace + "*([^\\]'\"]*?)" + whitespace + '*\\]', 'g');

    /*
     * Simplify Sizzle CSS Selector Engine v2.3.3
     */
    zy$.find = function(selector, context, results) {
        var m, i, elem, match, groups, newSelector,
            newContext = context && doc,

            // nodeType defaults to 9, since context defaults to document
            nodeType = context ? context.nodeType : 9;

        results = results || [];

        // Return early from calls with invalid selector or context
        if (typeof selector !== 'string' || !selector ||
            nodeType !== 1 && nodeType !== 9 && nodeType !== 11) {

            return results;
        }

        context = context || doc;

        // If the selector(ID or TAG or CLASS) is sufficiently simple,
        // try using a 'get*By*' DOM method
        // (excepting DocumentFragment context, where the methods don't exist)
        if (nodeType !== 11 && (match = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/.exec(selector))) {
            // ID selector
            if ((m = match[1])) {

                // Document context
                if (nodeType === 9) {
                    if ((elem = context.getElementById(m))) {
                        [].push.call(results, elem);
                    }
                    return results;

                    // Element context
                } else {
                    if (newContext && (elem = newContext.getElementById(m)) &&
                        zy$.contains(context, elem)) {
                        [].push.call(results, elem);
                        return results;
                    }
                }

                // Type selector
            } else if (match[2]) {
                zy$.merge(results, context.getElementsByTagName(selector))
                return results;

                // Class selector
            } else if ((m = match[3]) & context.getElementsByClassName) {
                zy$.merge(results, context.getElementsByClassName(m));
                return results;
            }
        }

        // Make sure that attribute selectors are quoted
        selector = selector.replace(rattributeQuotes, "='$1']");

        if (nodeType !== 1) {
            newSelector = selector;

            // qSA looks outside Element context
            // Exclude object elements
        } else if (context.nodeName.toLowerCase() !== 'object') {

            // Separated by comma
            // Don't consume trailing commas as valid
            groups = selector.replace(/,\s*$/, '').split(',');
            newSelector = groups.join();
        }

        if (newSelector) {
            try {
                zy$.merge(results, context.querySelectorAll(newSelector));
                return results;
            } catch (exp) {}
        }

        // All others
        throw new Error('Syntax error, unrecognized expression: ' + selector)
    };


    zy$.find.matchesSelector = function(elem, expr) {
        var ret = zy$.find(expr, doc, null);

        for (var i = 0; i < ret.length; i++) {
            if (elem == ret[i]) {
                return true;
            }
        }

        return false;
    };


    var dir = function(elem, dir) {
        var matched = [];

        while ((elem = elem[dir]) && elem.nodeType !== 9) {
            if (elem.nodeType === 1) {
                matched.push(elem)
            }
        }
        return matched;
    };


    // Implement the identical functionality for filter and not
    function winnow(elements, qualifier, not) {
        // Element (zy$, arguments, Array)
        if (typeof qualifier !== 'string') {
            return zy$.grep(elements, function(elem) {
                return (indexOf(qualifier, elem) > -1) !== not;
            });
        }

        // Simple selector that can be filtered directly, removing non-Elements
        if (/^.[^:#\[\.,]*$/.test(qualifier)) {
            return zy$.filter(qualifier, elements, not);
        }

        // Complex selector, compare the two sets, removing non-Elements
        qualifier = zy$.filter(qualifier, elements);
        return zy$.grep(elements, function(elem) {
            return (indexOf(qualifier, elem) > -1) !== not && elem.nodeType === 1;
        });
    }


    zy$.filter = function(expr, elems, not) {
        var matchElems = zy$.find(expr, null, null);

        matchElems = zy$.grep(elems, function(elem) {
            for (var i = 0; i < matchElems.length; i++) {
                if (elem === matchElems[i]) {
                    return not ? false : true;
                }
            }
            return not ? true : false;
        })

        return matchElems;
    };


    zy$.fn.extend({

        find: function(selector) {
            var i, ret,
                len = this.length,
                self = this;

            if (typeof selector !== 'string') {
                return this.pushStack(zy$(selector).filter(function() {
                    for (i = 0; i < len; i++) {
                        if (zy$.contains(self[i], this)) {
                            return true;
                        }
                    }
                }));
            }

            ret = this.pushStack([]);

            for (i = 0; i < len; i++) {
                zy$.find(selector, self[i], ret)
            }

            return len > 1 ? zy$.unique(ret) : ret;
        },

        filter: function(selector) {
            return this.pushStack(winnow(this, selector || [], false))
        },

        not: function(selector) {
            return this.pushStack(winnow(this, selector || [], true))
        },

        is: function(selector) {
            return !!winnow(
                this,
                selector || [],
                false
            ).length;
        }
    });


    zy$.fn.init = function(selector) {
        var match, elem;

        // Handle: $(''), $(null), $(undefined), $(false)
        if (!selector) {
            return this
        }

        // Handle HTML strings
        if (typeof selector === 'string') {
            if (selector[0] === '<' &&
                selector[selector.length - 1] === '>' &&
                selector.length >= 3) {

                // Assume that strings that start and end with <> are HTML and skip the regex check
                match = [null, selector, null];

            } else {
                // A simple way to check for HTML strings
                // Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
                // Strict HTML recognition (#11290: must start with <)
                match = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/.exec(selector)
            }

            // Match html or #id
            if (match) {

                // handle: $(html) -> $(array)
                if (match[1]) {

                    // Option to run scripts is true for back-compat
                    // Intentionally let the error be thrown if parseHTML is not present
                    zy$.merge(this, zy$.parseHTML(
                        match[1]
                    ));

                    return this;

                    // handle: $(#id)
                } else {
                    elem = doc.getElementById(match[2]);

                    if (elem) {
                        this[0] = elem;
                        this.length = 1
                    }
                    return this;
                }

                // Handle: $(expr)
            } else {
                return this.constructor(doc).find(selector)
            }

            // HANDLE: $(DOMElement)
        } else if (selector.nodeType) {

            this[0] = selector;
            this.length = 1;
            return this;

            // Handle: $(function)
        } else if (zy$.isFunction(selector)) {
            doc.addEventListener('DOMContentLoaded', function() {
                selector()
            });
        }

        return zy$.makeArray(selector, this)
    };

    // Give the init function the zy$ prototype for later instantiation
    zy$.fn.init.prototype = zy$.fn;


    // Methods guaranteed to produce a unique set when starting from a unique set
    var guaranteedUnique = {
        children: true,
        next: true,
        prev: true
    };

    zy$.fn.extend({
        has: function(target) {
            var targets = zy$(this).find(target),
                l = targets.length;

            return this.filter(function() {
                var i = 0;
                for (; i < l; i++) {
                    if (zy$.contains(this, targets[i])) {
                        return true;
                    }
                }
            });
        },

        closest: function(selectors, context) {
            var cur,
                i = 0,
                matched = [],
                targets = typeof selectors !== 'string' && zy$(selectors);

            // Positional selectors never match, since there's no _selection_ context
            for (; i < this.length; i++) {
                for (cur = this[i]; cur && cur !== context; cur = cur.parentNode) {

                    // Always skip document fragments and non-elements
                    if (cur.nodeType < 11 && (targets ?
                            targets.index(cur) > -1 :
                            cur.nodeType === 1 &&
                            zy$.find.matchesSelector(cur, selectors))) {

                        matched.push(cur);
                        break;
                    }
                }
            }

            return this.pushStack(matched.length > 1 ? zy$.unique(matched) : matched);
        },

        // Determine the position of an element within the set
        index: function(elem) {

            // No argument, return index in parent
            if (!elem) {
                return (this[0] && this[0].parentNode) ? this.eq(0).prevAll().length : -1;
            }

            // Index in selector
            if (typeof elem === 'string') {
                return indexOf(zy$(elem), this[0]);
            }

            // Locate the position of the desired element
            return indexOf(this,

                // If it receives a zy$ object, the first element is used
                elem instanceof zy$ ? elem[0] : elem
            );
        }
    });


    function sibling(cur, dir) {
        while ((cur = cur[dir]) && cur.nodeType !== 1) {}
        return cur;
    }


    var siblings = function(n, elem) {
        var matched = [];

        for (; n; n = n.nextSibling) {
            if (n.nodeType === 1 && n !== elem) {
                matched.push(n);
            }
        }

        return matched;
    };


    zy$.each({
        parent: function(elem) {
            var parent = elem.parentNode;
            return parent && parent.nodeType !== 11 ? parent : null;
        },

        parents: function(elem) {
            return dir(elem, 'parentNode');
        },

        next: function(elem) {
            return sibling(elem, 'nextSibling');
        },

        prev: function(elem) {
            return sibling(elem, 'previousSibling');
        },

        nextAll: function(elem) {
            return dir(elem, 'nextSibling');
        },

        prevAll: function(elem) {
            return dir(elem, 'previousSibling');
        },

        siblings: function(elem) {
            return siblings((elem.parentNode || {}).firstChild, elem);
        },

        children: function(elem) {
            return siblings(elem.firstChild);
        }
    }, function(name, fn) {
        zy$.fn[name] = function(selector) {

            var matched = zy$.map(this, fn);

            if (selector && typeof selector === 'string') {
                matched = zy$.filter(selector, matched)
            }

            if (this.length > 1) {
                // Remove duplicates
                if (!guaranteedUnique[name]) {
                    zy$.unique(matched)
                }
            }

            return this.pushStack(matched);
        };
    });



    // Multifunctional method to get and set values of a collection
    // The value/s can optionally be executed if it's a function
    var access = function(elems, fn, key, value, chainable) {
        var i = 0,
            len = elems.length,
            bulk = key == null;

        // Sets many values
        if (zy$.type(key) === 'object') {
            chainable = true;
            for (i in key) {
                access(elems, fn, i, key[i], true);
            }

            // Sets one value
        } else if (value !== undefined) {
            chainable = true;

            if (bulk) {
                bulk = fn;
                fn = function(elem, key, value) {
                    return bulk.call(zy$(elem), value)
                }
            }

            if (fn) {
                for (; i < len; i++) {
                    fn(elems[i], key, value)
                }
            }
        }

        if (chainable) {
            return elems;
        }

        // Gets
        if (bulk) {
            return fn.call(elems)
        }

        return len ? fn(elems[0], key) : undefined;
    };

    var isHiddenWithinTree = function(elem) {
        // Inline style trumps all
        return elem.style.display === 'none' ||
            elem.style.display === '' &&
            zy$.css(elem, 'display') === 'none';
    };


    function showHide(elements, show) {
        var elem;

        // Determine new display value for elements that need to change
        for (var i = 0; i < elements.length; i++) {
            elem = elements[i];
            if (!elem.style) {
                continue;
            }

            if (show) {
                if (isHiddenWithinTree(elem)) {
                    elem.style.display = 'block'
                }
            } else {
                elem.style.display = 'none'
            }
        }

        return elements;
    }


    zy$.fn.extend({
        show: function() {
            return showHide(this, true);
        },

        hide: function() {
            return showHide(this);
        }
    });


    function buildFragment(elems) {
        var elem, tmp,
            fragment = doc.createDocumentFragment(),
            nodes = [],
            i = 0;

        for (; i < elems.length; i++) {
            elem = elems[i];

            if (elem || elem === 0) {

                // Add nodes directly
                if (zy$.type(elem) === 'object') {

                    zy$.merge(nodes, elem.nodeType ? [elem] : elem);

                    // Convert non-html into a text node
                } else if (!/<|&#?\w+;/.test(elem)) {
                    nodes.push(doc.createTextNode(elem));

                    // Convert html into DOM nodes
                } else {
                    tmp = tmp || fragment.appendChild(doc.createElement('div'));
                    tmp.innerHTML = elem;

                    zy$.merge(nodes, tmp.childNodes);

                    // Remember the top-level container
                    tmp = fragment.firstChild;

                    // Ensure the created nodes are orphaned (#12392)
                    tmp.textContent = '';
                }
            }
        }

        // Remove wrapper from fragment
        fragment.textContent = '';

        i = 0;
        while ((elem = nodes[i++])) {
            fragment.appendChild(elem);
        }

        return fragment;
    }


    function getAll(context, tag) {
        var ret = [];
        tag = tag || '*';

        if (typeof context.getElementsByTagName !== 'undefined') {
            ret = context.getElementsByTagName(tag)
        } else if (typeof context.querySelectorAll !== 'undefined') {
            ret = context.querySelectorAll(tag)
        }

        return ret;
    }


    function domManip(collection, args, callback) {
        // Flatten any nested arrays
        args = concat.apply([], args);

        var fragment, first, node, scripts, hasScripts,
            i = 0,
            l = collection.length,
            iNoClone = l - 1;

        if (l) {
            fragment = buildFragment(args);
            first = fragment.firstChild;

            // Require either new content to invoke the callback
            if (first) {
                scripts = getAll(fragment, 'script');
                hasScripts = scripts.length;

                // Use the original fragment for the last item
                // instead of the first because it can end up
                // being emptied incorrectly in certain situations (#8070).
                for (; i < l; i++) {
                    node = fragment;

                    if (i !== iNoClone) {
                        node = node.cloneNode(true)
                    }

                    callback.call(collection[i], node, i)
                }

                if (hasScripts) {
                    for (i = 0; i < hasScripts; i++) {
                        node = scripts[i];

                        if (!node.src) {
                            eval.call(window, node.textContent)
                        }

                    }
                }
            }
        }

        return collection;
    }


    function remove(elem, selector) {
        var node,
            nodes = selector ? zy$.filter(selector, elem) : elem,
            i = 0;

        for (;
            (node = nodes[i]) != null; i++) {
            if (node.parentNode) {
                node.parentNode.removeChild(node);
            }
        }

        return elem;
    }


    zy$.fn.extend({
        remove: function(selector) {
            return remove(this, selector);
        },

        text: function(value) {
            return access(this, function(value) {
                return value === undefined ?
                    // return firstChild's textContent simplify
                    this[0] ? this[0].textContent : '' :
                    this.empty().each(function() {
                        if (this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9) {
                            this.textContent = value
                        }
                    });
            }, null, value, arguments.length);
        },

        append: function() {
            return domManip(this, arguments, function(elem) {
                if (this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9) {
                    this.appendChild(elem)
                }
            });
        },

        prepend: function() {
            return domManip(this, arguments, function(elem) {
                if (this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9) {
                    this.insertBefore(elem, this.firstChild)
                }
            });
        },

        before: function() {
            return domManip(this, arguments, function(elem) {
                if (this.parentNode) {
                    this.parentNode.insertBefore(elem, this)
                }
            });
        },

        after: function() {
            return domManip(this, arguments, function(elem) {
                if (this.parentNode) {
                    this.parentNode.insertBefore(elem, this.nextSibling);
                }
            });
        },

        empty: function() {
            var elem,
                i = 0;

            for (;
                (elem = this[i]) != null; i++) {
                if (elem.nodeType === 1) {
                    // Remove any remaining nodes
                    elem.textContent = '';
                }
            }

            return this;
        },

        html: function(value) {
            return access(this, function(value) {
                var elem = this[0] || {},
                    i = 0,
                    l = this.length;

                if (value === undefined && elem.nodeType === 1) {
                    return elem.innerHTML;
                }

                // See if we can take a shortcut and just use innerHTML
                if (typeof value === 'string' && !/<script|<style|<link/i.test(value)) {

                    try {
                        for (; i < l; i++) {
                            elem = this[i] || {};

                            if (elem.nodeType === 1) {
                                elem.innerHTML = value;
                            }
                        }

                        elem = 0;

                        // If using innerHTML throws an exception, use the fallback method
                    } catch (exp) {}
                }

                if (elem) {
                    this.empty().append(value);
                }
            }, null, value, arguments.length);
        }
    });


    function curCSS(elem, name, computed) {
        var ret,
            style = elem.style;

        computed = computed || window.getComputedStyle(elem);

        // Support: Chrome
        // transform return matrix
        if (/transform/i.test(name)) {
            ret = style[name]
        }

        if (ret === undefined) {
            ret = computed.getPropertyValue(name) || computed[name]
        }

        if (ret === '' && !zy$.contains(elem.ownerDocument, elem)) {
            ret = zy$.style(elem, name)
        }

        return ret !== undefined ?

            // Support: IE <=9 - 11 only
            // IE returns zIndex value as an integer.
            ret + '' :
            ret;
    }


    var cssPrefixes = ['Webkit', 'Moz', 'ms'],
        emptyStyle = doc.createElement('div').style;

    // Return a css property mapped to a potentially vendor prefixed property
    function vendorPropName(name) {

        // Shortcut for names that are not vendor prefixed
        if (name in emptyStyle) {
            return name;
        }

        // Check for vendor prefixed names
        var capName = name[0].toUpperCase() + name.slice(1),
            i = cssPrefixes.length;

        while (i--) {
            name = cssPrefixes[i] + capName;
            if (name in emptyStyle) {
                return name;
            }
        }
    }

    var rnothtmlwhite = (/[^\x20\t\r\n\f]+/g);

    var cssProps = {
        float: "cssFloat"
    }

    // Return a property mapped along what zy$.cssProps suggests or to
    // a vendor prefixed property.
    function finalPropName(name) {
        var ret = cssProps[name];
        if (!ret) {
            ret = cssProps[name] = vendorPropName(name) || name
        }
        return ret;
    }


    zy$.extend({

        // Don't automatically add 'px' to these possibly-unitless properties
        cssNumber: {
            "animationIterationCount": true,
            "columnCount": true,
            "fillOpacity": true,
            "flexGrow": true,
            "flexShrink": true,
            "fontWeight": true,
            "lineHeight": true,
            "opacity": true,
            "order": true,
            // "orphans": true,
            // "widows": true,
            "zIndex": true,
            "zoom": true
        },

        // Get and set the style property on a DOM Node
        style: function(elem, name, value) {

            // Don't set styles on text and comment nodes
            if (!elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style) {
                return;
            }

            // Make sure that we're working with the right name
            var type,
                origName = zy$.camelCase(name),
                style = elem.style;

            name = finalPropName(origName);

            // Check if we're setting a value
            if (value !== undefined) {

                // Make sure that null and NaN values aren't set
                if (value == null || value !== value) {
                    return;
                }

                type = typeof value;

                // If a number was passed in, add the unit (except for certain CSS properties)
                if (type === 'number') {
                    value += zy$.cssNumber[origName] ? '' : 'px'
                }

                style[name] = value
            } else {
                return style[name]
            }
        },

        css: function(elem, name, styles) {
            name = finalPropName(zy$.camelCase(name));
            return curCSS(elem, name, styles);
        },

        scrollTop: function(val) {
            if (val === undefined) {
                return window.pageYOffset;
            }

            window.scrollTo(window.pageXOffset, val)
        }

    });


    zy$.fn.extend({

        css: function(name, value) {
            return access(this, function(elem, name, value) {
                var styles,
                    map = {};

                if (Array.isArray(name)) {
                    styles = window.getComputedStyle(elem);

                    for (var i = 0; i < name.length; i++) {
                        map[name[i]] = zy$.css(elem, name[i], styles)
                    }

                    return map;
                }

                return value !== undefined ?
                    zy$.style(elem, name, value) :
                    zy$.css(elem, name);
            }, name, value, arguments.length > 1);
        },

        attr: function(name, value) {
            return access(this, function(elem, name, value) {
                var ret,
                    nType = elem.nodeType;

                // Don't get/set attributes on text and comment nodes
                if (nType === 3 || nType === 8) {
                    return;
                }

                if (value !== undefined) {
                    elem.setAttribute(name, value + '');
                    return value;
                }

                ret = elem.getAttribute(name.toLowerCase());

                // Non-existent attributes return null, we normalize to undefined
                return ret == null ? undefined : ret;
            }, name, value, arguments.length > 1);
        },

        removeAttr: function(name) {
            return this.each(function() {
                var newName,
                    i = 0,
                    // Attribute names can contain non-HTML whitespace characters
                    // https://html.spec.whatwg.org/multipage/syntax.html#attributes-2
                    attrNames = name && name.match(rnothtmlwhite);

                if (attrNames && this.nodeType === 1) {
                    while ((newName = attrNames[i++])) {
                        this.removeAttribute(newName)
                    }
                }
            });
        }
    });


    // Strip and collapse whitespace according to HTML spec
    // https://html.spec.whatwg.org/multipage/infrastructure.html#strip-and-collapse-whitespace
    function stripAndCollapse(value) {
        var tokens = value.match(rnothtmlwhite) || [];
        return tokens.join(' ');
    }


    function getClass(elem) {
        return elem.getAttribute('class') || '';
    }


    zy$.fn.extend({
        addClass: function(value) {
            var classes, elem, cur, curValue, clazz, j, finalValue,
                i = 0;

            if (typeof value === 'string' && value) {
                classes = value.match(rnothtmlwhite) || [];

                while ((elem = this[i++])) {
                    curValue = getClass(elem);
                    cur = elem.nodeType === 1 && (' ' + stripAndCollapse(curValue) + ' ');

                    if (cur) {
                        j = 0;
                        while ((clazz = classes[j++])) {
                            if (cur.indexOf(' ' + clazz + ' ') < 0) {
                                cur += clazz + ' '
                            }
                        }

                        // Only assign if different to avoid unneeded rendering.
                        finalValue = stripAndCollapse(cur);
                        if (curValue !== finalValue) {
                            elem.setAttribute('class', finalValue)
                        }
                    }
                }
            }

            return this;
        },

        removeClass: function(value) {
            var classes, elem, cur, curValue, clazz, j, finalValue,
                i = 0;

            if (!arguments.length) {
                return this.attr('class', '');
            }

            if (typeof value === 'string' && value) {
                classes = value.match(rnothtmlwhite) || [];

                while ((elem = this[i++])) {
                    curValue = getClass(elem);

                    // This expression is here for better compressibility (see addClass)
                    cur = elem.nodeType === 1 && (' ' + stripAndCollapse(curValue) + ' ');

                    if (cur) {
                        j = 0;
                        while ((clazz = classes[j++])) {

                            // Remove *all* instances
                            while (cur.indexOf(' ' + clazz + ' ') > -1) {
                                cur = cur.replace(' ' + clazz + ' ', ' ')
                            }
                        }

                        // Only assign if different to avoid unneeded rendering.
                        finalValue = stripAndCollapse(cur);
                        if (curValue !== finalValue) {
                            elem.setAttribute('class', finalValue)
                        }
                    }
                }
            }

            return this;
        },

        toggleClass: function(value) {
            var type = typeof value;

            return this.each(function() {
                var className, classNames,
                    i = 0,
                    self = zy$(this);

                if (type === 'string') {

                    // Toggle individual class names
                    classNames = value.match(rnothtmlwhite) || [];

                    while ((className = classNames[i++])) {

                        // Check each className given, space separated list
                        if (self.hasClass(className)) {
                            self.removeClass(className)
                        } else {
                            self.addClass(className)
                        }
                    }

                    // Toggle whole class name
                } else if (value === undefined || type === 'boolean') {

                    className = getClass(this);
                    if (className) {

                        // Store className if set
                        self.data('class_name', className)
                    }

                    // If the element has a class name or if we're passed `false`,
                    // then remove the whole classname (if there was one, the above saved it).
                    // Otherwise bring back whatever was previously saved (if anything),
                    // falling back to the empty string if nothing was stored.
                    this.setAttribute('class',
                        className || value === false ?
                        '' :
                        self.data('class_name') || ''
                    );
                }
            });
        },

        hasClass: function(selector) {
            var className, elem,
                i = 0;

            className = ' ' + selector + ' ';
            while ((elem = this[i++])) {
                if (elem.nodeType === 1 &&
                    (' ' + stripAndCollapse(getClass(elem)) + ' ').indexOf(className) > -1) {
                    return true;
                }
            }

            return false;
        }
    });


    // Argument 'data' should be string of html
    zy$.parseHTML = function(data) {
        if (typeof data !== 'string') {
            return [];
        }

        var parsed = /^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i.exec(data);

        // Single tag
        if (parsed) {
            return [doc.createElement(parsed[1])];
        }

        parsed = buildFragment([data]);

        return zy$.merge([], parsed.childNodes);
    };


    function getData(data) {
        if (data === 'true') {
            return true;
        }

        if (data === 'false') {
            return false;
        }

        if (data === 'null') {
            return null;
        }

        // Only convert to a number if it doesn't change the string
        if (data === +data + '') {
            return +data;
        }

        if (/^(?:\{[\w\W]*\}|\[[\w\W]*\])$/.test(data)) {
            return JSON.parse(data);
        }

        return data;
    }


    zy$.fn.extend({
        val: function(value) {
            var ret,
                elem = this[0];

            if (!arguments.length) {
                if (elem) {
                    ret = elem.value;

                    // Handle most common string cases
                    if (typeof ret === 'string') {
                        return ret.replace(/\r/g, '');
                    }

                    // Handle cases where value is null/undef or number
                    return ret == null ? '' : ret;
                }

                return;
            }

            return this.each(function(i) {

                if (this.nodeType !== 1) {
                    return;
                }

                // Treat null/undefined as ''; convert numbers to string
                if (value == null) {
                    value = '';

                } else if (typeof value === 'number') {
                    value += '';
                }

                this.value = value
            });
        },

        data: function(key, value) {
            var elem = this[0];

            if (key !== undefined && elem) {
                var name = 'data-' + key;

                if (value === undefined && elem.nodeType === 1) {
                    value = elem.getAttribute(name);

                    if (typeof value === 'string') {
                        try {
                            value = getData(value);
                        } catch (exp) {}
                    } else {
                        value = undefined;
                    }

                    return value;
                } else {
                    elem.setAttribute(name, value);
                    return this;
                }
            }
        },

        offset: function() {

            var rect,
                elem = this[0];

            if (!elem) {
                return;
            }

            rect = elem.getBoundingClientRect();

            return {
                top: rect.top + doc.defaultView.pageYOffset - docElem.clientTop,
                left: rect.left + doc.defaultView.pageXOffset - docElem.clientLeft,
                width: rect.width,
                height: rect.height
            };
        }
    });


    // Create width, height methods
    zy$.each(['width', 'height'], function(i, name) {
        zy$.fn[name] = function() {
            return access(this, function(elem, name) {
                var capName = name[0].toUpperCase() + name.slice(1);
                // window
                if (zy$.isWindow(elem)) {
                    return docElem['client' + capName];
                }
                // document
                if (elem.nodeType === 9) {
                    return Math.max(
                        elem.body['scroll' + capName], docElem['scroll' + capName],
                        elem.body['offset' + capName], docElem['offset' + capName],
                        docElem['client' + capName]
                    );
                }

                return parseInt(zy$.css(elem, name))
            }, name)
        }
    });



    // ----------------------------------------------------------------------------------------------- Event



    function on(elem, types, selector, handler, params) {
        var t, type;

        if (zy$.type(selector) == 'function') {

            // ( types, fn )
            params = handler;
            handler = selector;
            selector = undefined;
        }

        var useCapture = params && params.useCapture,
            useStopPropagation = params && params.useStopPropagation;

        // Ensure that invalid selectors throw exceptions at attach time
        if (selector) {
            zy$.find(selector, doc, null)
        }

        // Handle multiple events separated by a space
        types = (types || '').match(rnothtmlwhite) || [''];

        if (useCapture === undefined) {
            useCapture = false
        }

        return elem.each(function() {
            t = types.length;

            while (t--) {
                type = types[t];

                if (!type) {
                    continue;
                }

                if (!selector && handler.name) {
                    this.addEventListener(type, handler, useCapture)
                } else {
                    this.addEventListener(type, function(e) {
                        if (!selector) {
                            handler.call(this, e);
                            if (useStopPropagation) {
                                e.stopImmediatePropagation();
                                e.stopPropagation()
                            }
                        } else {
                            var ret = zy$(e.target).closest(selector).get(0);
                            if (ret) {
                                handler.call(ret, e);
                                if (useStopPropagation) {
                                    e.stopImmediatePropagation();
                                    e.stopPropagation()
                                }
                            }
                        }
                    }, useCapture)
                }
            }
        });
    }


    function off(elem, types, handler) {

        var t, type;

        types = (types || '').match(rnothtmlwhite) || [''];
        t = types.length;

        while (t--) {
            type = types[t];

            // Unbind all events for the element
            if (!type) {
                continue;
            }
            elem.removeEventListener(type, handler)
        }
    }


    zy$.fn.extend({

        on: function(types, selector, fn, params) {
            return on(this, types, selector, fn, params);
        },

        // fn must has name
        off: function(types, fn) {
            return this.each(function() {
                off(this, types, fn)
            });
        },

        trigger: function(type) {
            var event;
            return this.each(function() {
                event = document.createEvent('Event');
                event.initEvent(type, true, true);
                // event = new Event(type);
                this.dispatchEvent(event)
            });
        }
    });



    // -------------------------------------------------------------------------------------------------------- ajax


    var originAnchor = document.createElement('a');
    originAnchor.href = location.href;

    function triggerGlobal(context, eventName) {
        zy$(context || doc).trigger(eventName)
    }

    // Number of active Ajax requests
    var ajaxActive = 0;

    function ajaxStart() {
        if (ajaxActive++ === 0) {
            triggerGlobal(null, 'ajaxStart')
        }
    }

    function ajaxStop() {
        if (!(--ajaxActive)) {
            triggerGlobal(null, 'ajaxStop')
        }
    }

    function ajaxSuccess(data, xhr, settings) {
        var context = settings.context,
            status = 'success';
        settings.success.call(context, data, status, xhr);
        triggerGlobal(context, 'ajaxSuccess');
        ajaxComplete(status, xhr, settings)
    }

    // type: "timeout", "error", "abort", "parsererror"
    function ajaxError(error, type, xhr, settings) {
        var context = settings.context;
        settings.error.call(context, xhr, type, error);
        triggerGlobal(context, 'ajaxError');
        ajaxComplete(type, xhr, settings)
    }

    // status: "success", "error", "timeout", "abort", "parsererror"
    function ajaxComplete(status, xhr, settings) {
        var context = settings.context;
        settings.complete.call(context, xhr, status);
        triggerGlobal(context, 'ajaxComplete');
        ajaxStop(settings)
    }

    // Empty function, used as default callback
    function empty() {}

    zy$.ajaxSettings = {
        url: location.href,
        // Default type of request
        type: 'GET',
        contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
        // Callback that is executed if the request succeeds
        success: empty,
        // Callback that is executed the the server drops error
        error: empty,
        // Callback that is executed on request complete (both: error and success)
        complete: empty,
        // The context for the callbacks
        context: null,
        // Whether the request is to another domain
        crossDomain: false,
        // Default timeout
        timeout: 0,
        // Whether data should be serialized to string
        processData: true,
        // Whether the browser should be allowed to cache GET responses
        cache: true
    }

    // TODO: delete
    function ajaxJSONP(options) {

        var _callbackName = options.jsonpCallback,
            callbackName = (zy$.isFunction(_callbackName) ?
                _callbackName() : _callbackName) || ('zy' + Date.now()),
            script = document.createElement('script'),
            originalCallback = window[callbackName],
            responseData,
            abort = function(errorType) {
                zy$(script).triggerHandler('error', errorType || 'abort')
            },
            xhr = {
                abort: abort
            },
            abortTimeout;

        zy$(script).on('load error', function(e, errorType) {
            clearTimeout(abortTimeout);
            zy$(script).off().remove();

            if (e.type == 'error' || !responseData) {
                ajaxError(null, errorType || 'error', xhr, options)
            } else {
                ajaxSuccess(responseData[0], xhr, options)
            }

            window[callbackName] = originalCallback
            if (responseData && zy$.isFunction(originalCallback)) {
                originalCallback(responseData[0])
            }

            originalCallback = responseData = undefined
        });

        window[callbackName] = function() {
            responseData = arguments
        }

        script.src = options.url.replace(/\?(.+)=\?/, '?$1=' + callbackName);
        document.head.appendChild(script);

        if (options.timeout > 0) {
            abortTimeout = setTimeout(function() {
                abort('timeout')
            }, options.timeout)
        }

    }

    function appendQuery(url, query) {
        return (url + '&' + query).replace(/[&?]{1,2}/, '?')
    }

    // serialize payload and append it to the URL for GET requests
    function serializeData(options) {
        if (options.processData && options.data && zy$.type(options.data) != 'string') {
            options.data = zy$.param(options.data, options.traditional)
        }

        if (options.data && (options.type.toUpperCase() == 'GET' || 'jsonp' == options.dataType)) {
            options.url = appendQuery(options.url, options.data);
            options.data = undefined
        }
    }

    zy$.ajax = function(options) {
        var settings = zy$.extend({}, zy$.ajaxSettings, options),
            urlAnchor;

        ajaxStart(settings);

        if (!settings.crossDomain) {
            urlAnchor = document.createElement('a');
            urlAnchor.href = settings.url;
            // cleans up URL for .href (IE only)
            urlAnchor.href = urlAnchor.href;
            settings.crossDomain = (originAnchor.protocol + '//' + originAnchor.host) !== (urlAnchor.protocol + '//' + urlAnchor.host)
        }

        // Remove hash to simplify url manipulation
        settings.url = settings.url.replace(/#.*$/, '');

        serializeData(settings);

        var dataType = settings.dataType;

        if (settings.cache === false || (
                (!options || options.cache !== true) && 'jsonp' == dataType)) {
            settings.url = appendQuery(settings.url, '_=' + Date.now())
        }

        if ('jsonp' == dataType) {
            settings.url = appendQuery(settings.url,
                settings.jsonp ? (settings.jsonp + '=?') : settings.jsonp === false ? '' : 'callback=?')
            return ajaxJSONP(settings)
        }

        var xhr = new window.XMLHttpRequest(),
            setHeader = function(name, value) {
                xhr.setRequestHeader(name, value)
            },
            protocol = /^([\w-]+:)\/\//.test(settings.url) ? RegExp.$1 : location.protocol,
            abortTimeout;

        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {
                xhr.onreadystatechange = empty;
                clearTimeout(abortTimeout);
                var result, error = false;
                if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304 || (xhr.status == 0 && protocol == 'file:')) {
                    if (xhr.responseType == 'arraybuffer' || xhr.responseType == 'blob')
                        result = xhr.response
                    else {
                        result = xhr.responseText

                        try {
                            if (dataType == 'json') {
                                result = !result ? null : JSON.parse(result)
                            } else if (dataType == 'xml') {
                                result = xhr.responseXML
                            }
                        } catch (exp) {
                            error = exp
                        }

                        if (error) return ajaxError(error, 'parsererror', xhr, settings)
                    }

                    ajaxSuccess(result, xhr, settings)
                } else {
                    ajaxError(xhr.statusText || null, xhr.status ? 'error' : 'abort', xhr, settings)
                }
            }
        }

        var async = 'async' in settings ? settings.async : true;
        xhr.open(settings.type, settings.url, async, settings.username, settings.password);

        if (!settings.crossDomain) {
            setHeader('X-Requested-With', 'XMLHttpRequest')
        }

        // Avoid comment-prolog char sequence; must appease lint and evade compression
        setHeader('Accept', '*/'.concat('*'));
        setHeader('Content-Type', settings.contentType);

        for (var name in settings.headers) {
            setHeader(name, settings.headers[name])
        }

        if (settings.timeout > 0) {
            abortTimeout = setTimeout(function() {
                xhr.onreadystatechange = empty;
                xhr.abort();
                ajaxError(null, 'timeout', xhr, settings)
            }, settings.timeout)
        }

        xhr.send(settings.data ? settings.data : null);
    }


    function serialize(params, obj, scope) {
        var type;

        zy$.each(obj, function(key, value) {
            type = zy$.type(value);
            if (scope) {
                key = scope + '[' + key + ']'
            }

            if (type == 'object') {
                serialize(params, value, key)
            } else {
                params.add(key, value)
            }
        })
    }

    zy$.param = function(obj) {
        var params = [];
        params.add = function(key, value) {
            if (value == null) {
                value = ''
            }
            this.push(encodeURIComponent(key) + '=' + encodeURIComponent(value))
        }
        serialize(params, obj);
        return params.join('&').replace(/%20/g, '+')
    }



    window.$ = zy$;


})();