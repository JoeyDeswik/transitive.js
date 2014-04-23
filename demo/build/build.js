/**
 * Require the module at `name`.
 *
 * @param {String} name
 * @return {Object} exports
 * @api public
 */

function require(name) {
  var module = require.modules[name];
  if (!module) throw new Error('failed to require "' + name + '"');

  if (!('exports' in module) && typeof module.definition === 'function') {
    module.client = module.component = true;
    module.definition.call(this, module.exports = {}, module);
    delete module.definition;
  }

  return module.exports;
}

/**
 * Registered modules.
 */

require.modules = {};

/**
 * Register module at `name` with callback `definition`.
 *
 * @param {String} name
 * @param {Function} definition
 * @api private
 */

require.register = function (name, definition) {
  require.modules[name] = {
    definition: definition
  };
};

/**
 * Define a module's exports immediately with `exports`.
 *
 * @param {String} name
 * @param {Generic} exports
 * @api private
 */

require.define = function (name, exports) {
  require.modules[name] = {
    exports: exports
  };
};
require.register("component~props@1.1.2", Function("exports, module",
"/**\n\
 * Global Names\n\
 */\n\
\n\
var globals = /\\b(this|Array|Date|Object|Math|JSON)\\b/g;\n\
\n\
/**\n\
 * Return immediate identifiers parsed from `str`.\n\
 *\n\
 * @param {String} str\n\
 * @param {String|Function} map function or prefix\n\
 * @return {Array}\n\
 * @api public\n\
 */\n\
\n\
module.exports = function(str, fn){\n\
  var p = unique(props(str));\n\
  if (fn && 'string' == typeof fn) fn = prefixed(fn);\n\
  if (fn) return map(str, p, fn);\n\
  return p;\n\
};\n\
\n\
/**\n\
 * Return immediate identifiers in `str`.\n\
 *\n\
 * @param {String} str\n\
 * @return {Array}\n\
 * @api private\n\
 */\n\
\n\
function props(str) {\n\
  return str\n\
    .replace(/\\.\\w+|\\w+ *\\(|\"[^\"]*\"|'[^']*'|\\/([^/]+)\\//g, '')\n\
    .replace(globals, '')\n\
    .match(/[$a-zA-Z_]\\w*/g)\n\
    || [];\n\
}\n\
\n\
/**\n\
 * Return `str` with `props` mapped with `fn`.\n\
 *\n\
 * @param {String} str\n\
 * @param {Array} props\n\
 * @param {Function} fn\n\
 * @return {String}\n\
 * @api private\n\
 */\n\
\n\
function map(str, props, fn) {\n\
  var re = /\\.\\w+|\\w+ *\\(|\"[^\"]*\"|'[^']*'|\\/([^/]+)\\/|[a-zA-Z_]\\w*/g;\n\
  return str.replace(re, function(_){\n\
    if ('(' == _[_.length - 1]) return fn(_);\n\
    if (!~props.indexOf(_)) return _;\n\
    return fn(_);\n\
  });\n\
}\n\
\n\
/**\n\
 * Return unique array.\n\
 *\n\
 * @param {Array} arr\n\
 * @return {Array}\n\
 * @api private\n\
 */\n\
\n\
function unique(arr) {\n\
  var ret = [];\n\
\n\
  for (var i = 0; i < arr.length; i++) {\n\
    if (~ret.indexOf(arr[i])) continue;\n\
    ret.push(arr[i]);\n\
  }\n\
\n\
  return ret;\n\
}\n\
\n\
/**\n\
 * Map with prefix `str`.\n\
 */\n\
\n\
function prefixed(str) {\n\
  return function(_){\n\
    return str + _;\n\
  };\n\
}\n\
\n\
//# sourceURL=components/component/props/1.1.2/index.js"
));

require.modules["component-props"] = require.modules["component~props@1.1.2"];
require.modules["component~props"] = require.modules["component~props@1.1.2"];
require.modules["props"] = require.modules["component~props@1.1.2"];


require.register("component~to-function@2.0.0", Function("exports, module",
"/**\n\
 * Module Dependencies\n\
 */\n\
\n\
var expr = require(\"component~props@1.1.2\");\n\
\n\
/**\n\
 * Expose `toFunction()`.\n\
 */\n\
\n\
module.exports = toFunction;\n\
\n\
/**\n\
 * Convert `obj` to a `Function`.\n\
 *\n\
 * @param {Mixed} obj\n\
 * @return {Function}\n\
 * @api private\n\
 */\n\
\n\
function toFunction(obj) {\n\
  switch ({}.toString.call(obj)) {\n\
    case '[object Object]':\n\
      return objectToFunction(obj);\n\
    case '[object Function]':\n\
      return obj;\n\
    case '[object String]':\n\
      return stringToFunction(obj);\n\
    case '[object RegExp]':\n\
      return regexpToFunction(obj);\n\
    default:\n\
      return defaultToFunction(obj);\n\
  }\n\
}\n\
\n\
/**\n\
 * Default to strict equality.\n\
 *\n\
 * @param {Mixed} val\n\
 * @return {Function}\n\
 * @api private\n\
 */\n\
\n\
function defaultToFunction(val) {\n\
  return function(obj){\n\
    return val === obj;\n\
  }\n\
}\n\
\n\
/**\n\
 * Convert `re` to a function.\n\
 *\n\
 * @param {RegExp} re\n\
 * @return {Function}\n\
 * @api private\n\
 */\n\
\n\
function regexpToFunction(re) {\n\
  return function(obj){\n\
    return re.test(obj);\n\
  }\n\
}\n\
\n\
/**\n\
 * Convert property `str` to a function.\n\
 *\n\
 * @param {String} str\n\
 * @return {Function}\n\
 * @api private\n\
 */\n\
\n\
function stringToFunction(str) {\n\
  // immediate such as \"> 20\"\n\
  if (/^ *\\W+/.test(str)) return new Function('_', 'return _ ' + str);\n\
\n\
  // properties such as \"name.first\" or \"age > 18\" or \"age > 18 && age < 36\"\n\
  return new Function('_', 'return ' + get(str));\n\
}\n\
\n\
/**\n\
 * Convert `object` to a function.\n\
 *\n\
 * @param {Object} object\n\
 * @return {Function}\n\
 * @api private\n\
 */\n\
\n\
function objectToFunction(obj) {\n\
  var match = {}\n\
  for (var key in obj) {\n\
    match[key] = typeof obj[key] === 'string'\n\
      ? defaultToFunction(obj[key])\n\
      : toFunction(obj[key])\n\
  }\n\
  return function(val){\n\
    if (typeof val !== 'object') return false;\n\
    for (var key in match) {\n\
      if (!(key in val)) return false;\n\
      if (!match[key](val[key])) return false;\n\
    }\n\
    return true;\n\
  }\n\
}\n\
\n\
/**\n\
 * Built the getter function. Supports getter style functions\n\
 *\n\
 * @param {String} str\n\
 * @return {String}\n\
 * @api private\n\
 */\n\
\n\
function get(str) {\n\
  var props = expr(str);\n\
  if (!props.length) return '_.' + str;\n\
\n\
  var val;\n\
  for(var i = 0, prop; prop = props[i]; i++) {\n\
    val = '_.' + prop;\n\
    val = \"('function' == typeof \" + val + \" ? \" + val + \"() : \" + val + \")\";\n\
    str = str.replace(new RegExp(prop, 'g'), val);\n\
  }\n\
\n\
  return str;\n\
}\n\
\n\
//# sourceURL=components/component/to-function/2.0.0/index.js"
));

require.modules["component-to-function"] = require.modules["component~to-function@2.0.0"];
require.modules["component~to-function"] = require.modules["component~to-function@2.0.0"];
require.modules["to-function"] = require.modules["component~to-function@2.0.0"];


require.register("component~type@c817c", Function("exports, module",
"/**\n\
 * toString ref.\n\
 */\n\
\n\
var toString = Object.prototype.toString;\n\
\n\
/**\n\
 * Return the type of `val`.\n\
 *\n\
 * @param {Mixed} val\n\
 * @return {String}\n\
 * @api public\n\
 */\n\
\n\
module.exports = function(val){\n\
  switch (toString.call(val)) {\n\
    case '[object Date]': return 'date';\n\
    case '[object RegExp]': return 'regexp';\n\
    case '[object Arguments]': return 'arguments';\n\
    case '[object Array]': return 'array';\n\
    case '[object Error]': return 'error';\n\
  }\n\
\n\
  if (val === null) return 'null';\n\
  if (val === undefined) return 'undefined';\n\
  if (val !== val) return 'nan';\n\
  if (val && val.nodeType === 1) return 'element';\n\
\n\
  return typeof val.valueOf();\n\
};\n\
\n\
//# sourceURL=components/component/type/c817c/index.js"
));

require.modules["component-type"] = require.modules["component~type@c817c"];
require.modules["component~type"] = require.modules["component~type@c817c"];
require.modules["type"] = require.modules["component~type@c817c"];


require.register("component~type@1.0.0", Function("exports, module",
"\n\
/**\n\
 * toString ref.\n\
 */\n\
\n\
var toString = Object.prototype.toString;\n\
\n\
/**\n\
 * Return the type of `val`.\n\
 *\n\
 * @param {Mixed} val\n\
 * @return {String}\n\
 * @api public\n\
 */\n\
\n\
module.exports = function(val){\n\
  switch (toString.call(val)) {\n\
    case '[object Function]': return 'function';\n\
    case '[object Date]': return 'date';\n\
    case '[object RegExp]': return 'regexp';\n\
    case '[object Arguments]': return 'arguments';\n\
    case '[object Array]': return 'array';\n\
    case '[object String]': return 'string';\n\
  }\n\
\n\
  if (val === null) return 'null';\n\
  if (val === undefined) return 'undefined';\n\
  if (val && val.nodeType === 1) return 'element';\n\
  if (val === Object(val)) return 'object';\n\
\n\
  return typeof val;\n\
};\n\
\n\
//# sourceURL=components/component/type/1.0.0/index.js"
));

require.modules["component-type"] = require.modules["component~type@1.0.0"];
require.modules["component~type"] = require.modules["component~type@1.0.0"];
require.modules["type"] = require.modules["component~type@1.0.0"];


require.register("component~each@0.2.3", Function("exports, module",
"\n\
/**\n\
 * Module dependencies.\n\
 */\n\
\n\
var type = require(\"component~type@1.0.0\");\n\
var toFunction = require(\"component~to-function@2.0.0\");\n\
\n\
/**\n\
 * HOP reference.\n\
 */\n\
\n\
var has = Object.prototype.hasOwnProperty;\n\
\n\
/**\n\
 * Iterate the given `obj` and invoke `fn(val, i)`\n\
 * in optional context `ctx`.\n\
 *\n\
 * @param {String|Array|Object} obj\n\
 * @param {Function} fn\n\
 * @param {Object} [ctx]\n\
 * @api public\n\
 */\n\
\n\
module.exports = function(obj, fn, ctx){\n\
  fn = toFunction(fn);\n\
  ctx = ctx || this;\n\
  switch (type(obj)) {\n\
    case 'array':\n\
      return array(obj, fn, ctx);\n\
    case 'object':\n\
      if ('number' == typeof obj.length) return array(obj, fn, ctx);\n\
      return object(obj, fn, ctx);\n\
    case 'string':\n\
      return string(obj, fn, ctx);\n\
  }\n\
};\n\
\n\
/**\n\
 * Iterate string chars.\n\
 *\n\
 * @param {String} obj\n\
 * @param {Function} fn\n\
 * @param {Object} ctx\n\
 * @api private\n\
 */\n\
\n\
function string(obj, fn, ctx) {\n\
  for (var i = 0; i < obj.length; ++i) {\n\
    fn.call(ctx, obj.charAt(i), i);\n\
  }\n\
}\n\
\n\
/**\n\
 * Iterate object keys.\n\
 *\n\
 * @param {Object} obj\n\
 * @param {Function} fn\n\
 * @param {Object} ctx\n\
 * @api private\n\
 */\n\
\n\
function object(obj, fn, ctx) {\n\
  for (var key in obj) {\n\
    if (has.call(obj, key)) {\n\
      fn.call(ctx, key, obj[key]);\n\
    }\n\
  }\n\
}\n\
\n\
/**\n\
 * Iterate array-ish.\n\
 *\n\
 * @param {Array|Object} obj\n\
 * @param {Function} fn\n\
 * @param {Object} ctx\n\
 * @api private\n\
 */\n\
\n\
function array(obj, fn, ctx) {\n\
  for (var i = 0; i < obj.length; ++i) {\n\
    fn.call(ctx, obj[i], i);\n\
  }\n\
}\n\
\n\
//# sourceURL=components/component/each/0.2.3/index.js"
));

require.modules["component-each"] = require.modules["component~each@0.2.3"];
require.modules["component~each"] = require.modules["component~each@0.2.3"];
require.modules["each"] = require.modules["component~each@0.2.3"];


require.register("component~emitter@1.1.2", Function("exports, module",
"\n\
/**\n\
 * Expose `Emitter`.\n\
 */\n\
\n\
module.exports = Emitter;\n\
\n\
/**\n\
 * Initialize a new `Emitter`.\n\
 *\n\
 * @api public\n\
 */\n\
\n\
function Emitter(obj) {\n\
  if (obj) return mixin(obj);\n\
};\n\
\n\
/**\n\
 * Mixin the emitter properties.\n\
 *\n\
 * @param {Object} obj\n\
 * @return {Object}\n\
 * @api private\n\
 */\n\
\n\
function mixin(obj) {\n\
  for (var key in Emitter.prototype) {\n\
    obj[key] = Emitter.prototype[key];\n\
  }\n\
  return obj;\n\
}\n\
\n\
/**\n\
 * Listen on the given `event` with `fn`.\n\
 *\n\
 * @param {String} event\n\
 * @param {Function} fn\n\
 * @return {Emitter}\n\
 * @api public\n\
 */\n\
\n\
Emitter.prototype.on =\n\
Emitter.prototype.addEventListener = function(event, fn){\n\
  this._callbacks = this._callbacks || {};\n\
  (this._callbacks[event] = this._callbacks[event] || [])\n\
    .push(fn);\n\
  return this;\n\
};\n\
\n\
/**\n\
 * Adds an `event` listener that will be invoked a single\n\
 * time then automatically removed.\n\
 *\n\
 * @param {String} event\n\
 * @param {Function} fn\n\
 * @return {Emitter}\n\
 * @api public\n\
 */\n\
\n\
Emitter.prototype.once = function(event, fn){\n\
  var self = this;\n\
  this._callbacks = this._callbacks || {};\n\
\n\
  function on() {\n\
    self.off(event, on);\n\
    fn.apply(this, arguments);\n\
  }\n\
\n\
  on.fn = fn;\n\
  this.on(event, on);\n\
  return this;\n\
};\n\
\n\
/**\n\
 * Remove the given callback for `event` or all\n\
 * registered callbacks.\n\
 *\n\
 * @param {String} event\n\
 * @param {Function} fn\n\
 * @return {Emitter}\n\
 * @api public\n\
 */\n\
\n\
Emitter.prototype.off =\n\
Emitter.prototype.removeListener =\n\
Emitter.prototype.removeAllListeners =\n\
Emitter.prototype.removeEventListener = function(event, fn){\n\
  this._callbacks = this._callbacks || {};\n\
\n\
  // all\n\
  if (0 == arguments.length) {\n\
    this._callbacks = {};\n\
    return this;\n\
  }\n\
\n\
  // specific event\n\
  var callbacks = this._callbacks[event];\n\
  if (!callbacks) return this;\n\
\n\
  // remove all handlers\n\
  if (1 == arguments.length) {\n\
    delete this._callbacks[event];\n\
    return this;\n\
  }\n\
\n\
  // remove specific handler\n\
  var cb;\n\
  for (var i = 0; i < callbacks.length; i++) {\n\
    cb = callbacks[i];\n\
    if (cb === fn || cb.fn === fn) {\n\
      callbacks.splice(i, 1);\n\
      break;\n\
    }\n\
  }\n\
  return this;\n\
};\n\
\n\
/**\n\
 * Emit `event` with the given args.\n\
 *\n\
 * @param {String} event\n\
 * @param {Mixed} ...\n\
 * @return {Emitter}\n\
 */\n\
\n\
Emitter.prototype.emit = function(event){\n\
  this._callbacks = this._callbacks || {};\n\
  var args = [].slice.call(arguments, 1)\n\
    , callbacks = this._callbacks[event];\n\
\n\
  if (callbacks) {\n\
    callbacks = callbacks.slice(0);\n\
    for (var i = 0, len = callbacks.length; i < len; ++i) {\n\
      callbacks[i].apply(this, args);\n\
    }\n\
  }\n\
\n\
  return this;\n\
};\n\
\n\
/**\n\
 * Return array of callbacks for `event`.\n\
 *\n\
 * @param {String} event\n\
 * @return {Array}\n\
 * @api public\n\
 */\n\
\n\
Emitter.prototype.listeners = function(event){\n\
  this._callbacks = this._callbacks || {};\n\
  return this._callbacks[event] || [];\n\
};\n\
\n\
/**\n\
 * Check if this emitter has `event` handlers.\n\
 *\n\
 * @param {String} event\n\
 * @return {Boolean}\n\
 * @api public\n\
 */\n\
\n\
Emitter.prototype.hasListeners = function(event){\n\
  return !! this.listeners(event).length;\n\
};\n\
\n\
//# sourceURL=components/component/emitter/1.1.2/index.js"
));

require.modules["component-emitter"] = require.modules["component~emitter@1.1.2"];
require.modules["component~emitter"] = require.modules["component~emitter@1.1.2"];
require.modules["emitter"] = require.modules["component~emitter@1.1.2"];


require.register("cristiandouce~merge-util@0.1.0", Function("exports, module",
"/**\n\
 * Module dependencies.\n\
 */\n\
\n\
var has = Object.prototype.hasOwnProperty;\n\
\n\
try {\n\
  var type = require(\"type-component\");\n\
} catch (err) {\n\
  var type = require(\"component~type@c817c\");\n\
}\n\
\n\
/**\n\
 * Expose merge\n\
 */\n\
\n\
module.exports = merge;\n\
\n\
/**\n\
 * Merge `b` into `a`.\n\
 *\n\
 * @param {Object} a\n\
 * @param {Object} b\n\
 * @param {Boolean} inheritance\n\
 * @return {Object} a\n\
 * @api public\n\
 */\n\
\n\
function merge (a, b, inheritance){\n\
  for (var key in b) {\n\
    var copy = !!inheritance\n\
     ? b[key] != null\n\
     : (has.call(b, key)) && b[key] != null\n\
\n\
    if (copy) {\n\
      if (!a) a = {};\n\
      if ('object' === type(b[key])) {\n\
        a[key] = merge(a[key], b[key], inheritance);\n\
      } else {\n\
        a[key] = b[key];\n\
      }\n\
    }\n\
  }\n\
  return a;\n\
};\n\
//# sourceURL=components/cristiandouce/merge-util/0.1.0/index.js"
));

require.modules["cristiandouce-merge-util"] = require.modules["cristiandouce~merge-util@0.1.0"];
require.modules["cristiandouce~merge-util"] = require.modules["cristiandouce~merge-util@0.1.0"];
require.modules["merge-util"] = require.modules["cristiandouce~merge-util@0.1.0"];


require.register("mbostock~d3@v3.4.6", Function("exports, module",
"!function() {\n\
  var d3 = {\n\
    version: \"3.4.6\"\n\
  };\n\
  if (!Date.now) Date.now = function() {\n\
    return +new Date();\n\
  };\n\
  var d3_arraySlice = [].slice, d3_array = function(list) {\n\
    return d3_arraySlice.call(list);\n\
  };\n\
  var d3_document = document, d3_documentElement = d3_document.documentElement, d3_window = window;\n\
  try {\n\
    d3_array(d3_documentElement.childNodes)[0].nodeType;\n\
  } catch (e) {\n\
    d3_array = function(list) {\n\
      var i = list.length, array = new Array(i);\n\
      while (i--) array[i] = list[i];\n\
      return array;\n\
    };\n\
  }\n\
  try {\n\
    d3_document.createElement(\"div\").style.setProperty(\"opacity\", 0, \"\");\n\
  } catch (error) {\n\
    var d3_element_prototype = d3_window.Element.prototype, d3_element_setAttribute = d3_element_prototype.setAttribute, d3_element_setAttributeNS = d3_element_prototype.setAttributeNS, d3_style_prototype = d3_window.CSSStyleDeclaration.prototype, d3_style_setProperty = d3_style_prototype.setProperty;\n\
    d3_element_prototype.setAttribute = function(name, value) {\n\
      d3_element_setAttribute.call(this, name, value + \"\");\n\
    };\n\
    d3_element_prototype.setAttributeNS = function(space, local, value) {\n\
      d3_element_setAttributeNS.call(this, space, local, value + \"\");\n\
    };\n\
    d3_style_prototype.setProperty = function(name, value, priority) {\n\
      d3_style_setProperty.call(this, name, value + \"\", priority);\n\
    };\n\
  }\n\
  d3.ascending = d3_ascending;\n\
  function d3_ascending(a, b) {\n\
    return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;\n\
  }\n\
  d3.descending = function(a, b) {\n\
    return b < a ? -1 : b > a ? 1 : b >= a ? 0 : NaN;\n\
  };\n\
  d3.min = function(array, f) {\n\
    var i = -1, n = array.length, a, b;\n\
    if (arguments.length === 1) {\n\
      while (++i < n && !((a = array[i]) != null && a <= a)) a = undefined;\n\
      while (++i < n) if ((b = array[i]) != null && a > b) a = b;\n\
    } else {\n\
      while (++i < n && !((a = f.call(array, array[i], i)) != null && a <= a)) a = undefined;\n\
      while (++i < n) if ((b = f.call(array, array[i], i)) != null && a > b) a = b;\n\
    }\n\
    return a;\n\
  };\n\
  d3.max = function(array, f) {\n\
    var i = -1, n = array.length, a, b;\n\
    if (arguments.length === 1) {\n\
      while (++i < n && !((a = array[i]) != null && a <= a)) a = undefined;\n\
      while (++i < n) if ((b = array[i]) != null && b > a) a = b;\n\
    } else {\n\
      while (++i < n && !((a = f.call(array, array[i], i)) != null && a <= a)) a = undefined;\n\
      while (++i < n) if ((b = f.call(array, array[i], i)) != null && b > a) a = b;\n\
    }\n\
    return a;\n\
  };\n\
  d3.extent = function(array, f) {\n\
    var i = -1, n = array.length, a, b, c;\n\
    if (arguments.length === 1) {\n\
      while (++i < n && !((a = c = array[i]) != null && a <= a)) a = c = undefined;\n\
      while (++i < n) if ((b = array[i]) != null) {\n\
        if (a > b) a = b;\n\
        if (c < b) c = b;\n\
      }\n\
    } else {\n\
      while (++i < n && !((a = c = f.call(array, array[i], i)) != null && a <= a)) a = undefined;\n\
      while (++i < n) if ((b = f.call(array, array[i], i)) != null) {\n\
        if (a > b) a = b;\n\
        if (c < b) c = b;\n\
      }\n\
    }\n\
    return [ a, c ];\n\
  };\n\
  d3.sum = function(array, f) {\n\
    var s = 0, n = array.length, a, i = -1;\n\
    if (arguments.length === 1) {\n\
      while (++i < n) if (!isNaN(a = +array[i])) s += a;\n\
    } else {\n\
      while (++i < n) if (!isNaN(a = +f.call(array, array[i], i))) s += a;\n\
    }\n\
    return s;\n\
  };\n\
  function d3_number(x) {\n\
    return x != null && !isNaN(x);\n\
  }\n\
  d3.mean = function(array, f) {\n\
    var s = 0, n = array.length, a, i = -1, j = n;\n\
    if (arguments.length === 1) {\n\
      while (++i < n) if (d3_number(a = array[i])) s += a; else --j;\n\
    } else {\n\
      while (++i < n) if (d3_number(a = f.call(array, array[i], i))) s += a; else --j;\n\
    }\n\
    return j ? s / j : undefined;\n\
  };\n\
  d3.quantile = function(values, p) {\n\
    var H = (values.length - 1) * p + 1, h = Math.floor(H), v = +values[h - 1], e = H - h;\n\
    return e ? v + e * (values[h] - v) : v;\n\
  };\n\
  d3.median = function(array, f) {\n\
    if (arguments.length > 1) array = array.map(f);\n\
    array = array.filter(d3_number);\n\
    return array.length ? d3.quantile(array.sort(d3_ascending), .5) : undefined;\n\
  };\n\
  function d3_bisector(compare) {\n\
    return {\n\
      left: function(a, x, lo, hi) {\n\
        if (arguments.length < 3) lo = 0;\n\
        if (arguments.length < 4) hi = a.length;\n\
        while (lo < hi) {\n\
          var mid = lo + hi >>> 1;\n\
          if (compare(a[mid], x) < 0) lo = mid + 1; else hi = mid;\n\
        }\n\
        return lo;\n\
      },\n\
      right: function(a, x, lo, hi) {\n\
        if (arguments.length < 3) lo = 0;\n\
        if (arguments.length < 4) hi = a.length;\n\
        while (lo < hi) {\n\
          var mid = lo + hi >>> 1;\n\
          if (compare(a[mid], x) > 0) hi = mid; else lo = mid + 1;\n\
        }\n\
        return lo;\n\
      }\n\
    };\n\
  }\n\
  var d3_bisect = d3_bisector(d3_ascending);\n\
  d3.bisectLeft = d3_bisect.left;\n\
  d3.bisect = d3.bisectRight = d3_bisect.right;\n\
  d3.bisector = function(f) {\n\
    return d3_bisector(f.length === 1 ? function(d, x) {\n\
      return d3_ascending(f(d), x);\n\
    } : f);\n\
  };\n\
  d3.shuffle = function(array) {\n\
    var m = array.length, t, i;\n\
    while (m) {\n\
      i = Math.random() * m-- | 0;\n\
      t = array[m], array[m] = array[i], array[i] = t;\n\
    }\n\
    return array;\n\
  };\n\
  d3.permute = function(array, indexes) {\n\
    var i = indexes.length, permutes = new Array(i);\n\
    while (i--) permutes[i] = array[indexes[i]];\n\
    return permutes;\n\
  };\n\
  d3.pairs = function(array) {\n\
    var i = 0, n = array.length - 1, p0, p1 = array[0], pairs = new Array(n < 0 ? 0 : n);\n\
    while (i < n) pairs[i] = [ p0 = p1, p1 = array[++i] ];\n\
    return pairs;\n\
  };\n\
  d3.zip = function() {\n\
    if (!(n = arguments.length)) return [];\n\
    for (var i = -1, m = d3.min(arguments, d3_zipLength), zips = new Array(m); ++i < m; ) {\n\
      for (var j = -1, n, zip = zips[i] = new Array(n); ++j < n; ) {\n\
        zip[j] = arguments[j][i];\n\
      }\n\
    }\n\
    return zips;\n\
  };\n\
  function d3_zipLength(d) {\n\
    return d.length;\n\
  }\n\
  d3.transpose = function(matrix) {\n\
    return d3.zip.apply(d3, matrix);\n\
  };\n\
  d3.keys = function(map) {\n\
    var keys = [];\n\
    for (var key in map) keys.push(key);\n\
    return keys;\n\
  };\n\
  d3.values = function(map) {\n\
    var values = [];\n\
    for (var key in map) values.push(map[key]);\n\
    return values;\n\
  };\n\
  d3.entries = function(map) {\n\
    var entries = [];\n\
    for (var key in map) entries.push({\n\
      key: key,\n\
      value: map[key]\n\
    });\n\
    return entries;\n\
  };\n\
  d3.merge = function(arrays) {\n\
    var n = arrays.length, m, i = -1, j = 0, merged, array;\n\
    while (++i < n) j += arrays[i].length;\n\
    merged = new Array(j);\n\
    while (--n >= 0) {\n\
      array = arrays[n];\n\
      m = array.length;\n\
      while (--m >= 0) {\n\
        merged[--j] = array[m];\n\
      }\n\
    }\n\
    return merged;\n\
  };\n\
  var abs = Math.abs;\n\
  d3.range = function(start, stop, step) {\n\
    if (arguments.length < 3) {\n\
      step = 1;\n\
      if (arguments.length < 2) {\n\
        stop = start;\n\
        start = 0;\n\
      }\n\
    }\n\
    if ((stop - start) / step === Infinity) throw new Error(\"infinite range\");\n\
    var range = [], k = d3_range_integerScale(abs(step)), i = -1, j;\n\
    start *= k, stop *= k, step *= k;\n\
    if (step < 0) while ((j = start + step * ++i) > stop) range.push(j / k); else while ((j = start + step * ++i) < stop) range.push(j / k);\n\
    return range;\n\
  };\n\
  function d3_range_integerScale(x) {\n\
    var k = 1;\n\
    while (x * k % 1) k *= 10;\n\
    return k;\n\
  }\n\
  function d3_class(ctor, properties) {\n\
    try {\n\
      for (var key in properties) {\n\
        Object.defineProperty(ctor.prototype, key, {\n\
          value: properties[key],\n\
          enumerable: false\n\
        });\n\
      }\n\
    } catch (e) {\n\
      ctor.prototype = properties;\n\
    }\n\
  }\n\
  d3.map = function(object) {\n\
    var map = new d3_Map();\n\
    if (object instanceof d3_Map) object.forEach(function(key, value) {\n\
      map.set(key, value);\n\
    }); else for (var key in object) map.set(key, object[key]);\n\
    return map;\n\
  };\n\
  function d3_Map() {}\n\
  d3_class(d3_Map, {\n\
    has: d3_map_has,\n\
    get: function(key) {\n\
      return this[d3_map_prefix + key];\n\
    },\n\
    set: function(key, value) {\n\
      return this[d3_map_prefix + key] = value;\n\
    },\n\
    remove: d3_map_remove,\n\
    keys: d3_map_keys,\n\
    values: function() {\n\
      var values = [];\n\
      this.forEach(function(key, value) {\n\
        values.push(value);\n\
      });\n\
      return values;\n\
    },\n\
    entries: function() {\n\
      var entries = [];\n\
      this.forEach(function(key, value) {\n\
        entries.push({\n\
          key: key,\n\
          value: value\n\
        });\n\
      });\n\
      return entries;\n\
    },\n\
    size: d3_map_size,\n\
    empty: d3_map_empty,\n\
    forEach: function(f) {\n\
      for (var key in this) if (key.charCodeAt(0) === d3_map_prefixCode) f.call(this, key.substring(1), this[key]);\n\
    }\n\
  });\n\
  var d3_map_prefix = \"\\x00\", d3_map_prefixCode = d3_map_prefix.charCodeAt(0);\n\
  function d3_map_has(key) {\n\
    return d3_map_prefix + key in this;\n\
  }\n\
  function d3_map_remove(key) {\n\
    key = d3_map_prefix + key;\n\
    return key in this && delete this[key];\n\
  }\n\
  function d3_map_keys() {\n\
    var keys = [];\n\
    this.forEach(function(key) {\n\
      keys.push(key);\n\
    });\n\
    return keys;\n\
  }\n\
  function d3_map_size() {\n\
    var size = 0;\n\
    for (var key in this) if (key.charCodeAt(0) === d3_map_prefixCode) ++size;\n\
    return size;\n\
  }\n\
  function d3_map_empty() {\n\
    for (var key in this) if (key.charCodeAt(0) === d3_map_prefixCode) return false;\n\
    return true;\n\
  }\n\
  d3.nest = function() {\n\
    var nest = {}, keys = [], sortKeys = [], sortValues, rollup;\n\
    function map(mapType, array, depth) {\n\
      if (depth >= keys.length) return rollup ? rollup.call(nest, array) : sortValues ? array.sort(sortValues) : array;\n\
      var i = -1, n = array.length, key = keys[depth++], keyValue, object, setter, valuesByKey = new d3_Map(), values;\n\
      while (++i < n) {\n\
        if (values = valuesByKey.get(keyValue = key(object = array[i]))) {\n\
          values.push(object);\n\
        } else {\n\
          valuesByKey.set(keyValue, [ object ]);\n\
        }\n\
      }\n\
      if (mapType) {\n\
        object = mapType();\n\
        setter = function(keyValue, values) {\n\
          object.set(keyValue, map(mapType, values, depth));\n\
        };\n\
      } else {\n\
        object = {};\n\
        setter = function(keyValue, values) {\n\
          object[keyValue] = map(mapType, values, depth);\n\
        };\n\
      }\n\
      valuesByKey.forEach(setter);\n\
      return object;\n\
    }\n\
    function entries(map, depth) {\n\
      if (depth >= keys.length) return map;\n\
      var array = [], sortKey = sortKeys[depth++];\n\
      map.forEach(function(key, keyMap) {\n\
        array.push({\n\
          key: key,\n\
          values: entries(keyMap, depth)\n\
        });\n\
      });\n\
      return sortKey ? array.sort(function(a, b) {\n\
        return sortKey(a.key, b.key);\n\
      }) : array;\n\
    }\n\
    nest.map = function(array, mapType) {\n\
      return map(mapType, array, 0);\n\
    };\n\
    nest.entries = function(array) {\n\
      return entries(map(d3.map, array, 0), 0);\n\
    };\n\
    nest.key = function(d) {\n\
      keys.push(d);\n\
      return nest;\n\
    };\n\
    nest.sortKeys = function(order) {\n\
      sortKeys[keys.length - 1] = order;\n\
      return nest;\n\
    };\n\
    nest.sortValues = function(order) {\n\
      sortValues = order;\n\
      return nest;\n\
    };\n\
    nest.rollup = function(f) {\n\
      rollup = f;\n\
      return nest;\n\
    };\n\
    return nest;\n\
  };\n\
  d3.set = function(array) {\n\
    var set = new d3_Set();\n\
    if (array) for (var i = 0, n = array.length; i < n; ++i) set.add(array[i]);\n\
    return set;\n\
  };\n\
  function d3_Set() {}\n\
  d3_class(d3_Set, {\n\
    has: d3_map_has,\n\
    add: function(value) {\n\
      this[d3_map_prefix + value] = true;\n\
      return value;\n\
    },\n\
    remove: function(value) {\n\
      value = d3_map_prefix + value;\n\
      return value in this && delete this[value];\n\
    },\n\
    values: d3_map_keys,\n\
    size: d3_map_size,\n\
    empty: d3_map_empty,\n\
    forEach: function(f) {\n\
      for (var value in this) if (value.charCodeAt(0) === d3_map_prefixCode) f.call(this, value.substring(1));\n\
    }\n\
  });\n\
  d3.behavior = {};\n\
  d3.rebind = function(target, source) {\n\
    var i = 1, n = arguments.length, method;\n\
    while (++i < n) target[method = arguments[i]] = d3_rebind(target, source, source[method]);\n\
    return target;\n\
  };\n\
  function d3_rebind(target, source, method) {\n\
    return function() {\n\
      var value = method.apply(source, arguments);\n\
      return value === source ? target : value;\n\
    };\n\
  }\n\
  function d3_vendorSymbol(object, name) {\n\
    if (name in object) return name;\n\
    name = name.charAt(0).toUpperCase() + name.substring(1);\n\
    for (var i = 0, n = d3_vendorPrefixes.length; i < n; ++i) {\n\
      var prefixName = d3_vendorPrefixes[i] + name;\n\
      if (prefixName in object) return prefixName;\n\
    }\n\
  }\n\
  var d3_vendorPrefixes = [ \"webkit\", \"ms\", \"moz\", \"Moz\", \"o\", \"O\" ];\n\
  function d3_noop() {}\n\
  d3.dispatch = function() {\n\
    var dispatch = new d3_dispatch(), i = -1, n = arguments.length;\n\
    while (++i < n) dispatch[arguments[i]] = d3_dispatch_event(dispatch);\n\
    return dispatch;\n\
  };\n\
  function d3_dispatch() {}\n\
  d3_dispatch.prototype.on = function(type, listener) {\n\
    var i = type.indexOf(\".\"), name = \"\";\n\
    if (i >= 0) {\n\
      name = type.substring(i + 1);\n\
      type = type.substring(0, i);\n\
    }\n\
    if (type) return arguments.length < 2 ? this[type].on(name) : this[type].on(name, listener);\n\
    if (arguments.length === 2) {\n\
      if (listener == null) for (type in this) {\n\
        if (this.hasOwnProperty(type)) this[type].on(name, null);\n\
      }\n\
      return this;\n\
    }\n\
  };\n\
  function d3_dispatch_event(dispatch) {\n\
    var listeners = [], listenerByName = new d3_Map();\n\
    function event() {\n\
      var z = listeners, i = -1, n = z.length, l;\n\
      while (++i < n) if (l = z[i].on) l.apply(this, arguments);\n\
      return dispatch;\n\
    }\n\
    event.on = function(name, listener) {\n\
      var l = listenerByName.get(name), i;\n\
      if (arguments.length < 2) return l && l.on;\n\
      if (l) {\n\
        l.on = null;\n\
        listeners = listeners.slice(0, i = listeners.indexOf(l)).concat(listeners.slice(i + 1));\n\
        listenerByName.remove(name);\n\
      }\n\
      if (listener) listeners.push(listenerByName.set(name, {\n\
        on: listener\n\
      }));\n\
      return dispatch;\n\
    };\n\
    return event;\n\
  }\n\
  d3.event = null;\n\
  function d3_eventPreventDefault() {\n\
    d3.event.preventDefault();\n\
  }\n\
  function d3_eventSource() {\n\
    var e = d3.event, s;\n\
    while (s = e.sourceEvent) e = s;\n\
    return e;\n\
  }\n\
  function d3_eventDispatch(target) {\n\
    var dispatch = new d3_dispatch(), i = 0, n = arguments.length;\n\
    while (++i < n) dispatch[arguments[i]] = d3_dispatch_event(dispatch);\n\
    dispatch.of = function(thiz, argumentz) {\n\
      return function(e1) {\n\
        try {\n\
          var e0 = e1.sourceEvent = d3.event;\n\
          e1.target = target;\n\
          d3.event = e1;\n\
          dispatch[e1.type].apply(thiz, argumentz);\n\
        } finally {\n\
          d3.event = e0;\n\
        }\n\
      };\n\
    };\n\
    return dispatch;\n\
  }\n\
  d3.requote = function(s) {\n\
    return s.replace(d3_requote_re, \"\\\\$&\");\n\
  };\n\
  var d3_requote_re = /[\\\\\\^\\$\\*\\+\\?\\|\\[\\]\\(\\)\\.\\{\\}]/g;\n\
  var d3_subclass = {}.__proto__ ? function(object, prototype) {\n\
    object.__proto__ = prototype;\n\
  } : function(object, prototype) {\n\
    for (var property in prototype) object[property] = prototype[property];\n\
  };\n\
  function d3_selection(groups) {\n\
    d3_subclass(groups, d3_selectionPrototype);\n\
    return groups;\n\
  }\n\
  var d3_select = function(s, n) {\n\
    return n.querySelector(s);\n\
  }, d3_selectAll = function(s, n) {\n\
    return n.querySelectorAll(s);\n\
  }, d3_selectMatcher = d3_documentElement[d3_vendorSymbol(d3_documentElement, \"matchesSelector\")], d3_selectMatches = function(n, s) {\n\
    return d3_selectMatcher.call(n, s);\n\
  };\n\
  if (typeof Sizzle === \"function\") {\n\
    d3_select = function(s, n) {\n\
      return Sizzle(s, n)[0] || null;\n\
    };\n\
    d3_selectAll = Sizzle;\n\
    d3_selectMatches = Sizzle.matchesSelector;\n\
  }\n\
  d3.selection = function() {\n\
    return d3_selectionRoot;\n\
  };\n\
  var d3_selectionPrototype = d3.selection.prototype = [];\n\
  d3_selectionPrototype.select = function(selector) {\n\
    var subgroups = [], subgroup, subnode, group, node;\n\
    selector = d3_selection_selector(selector);\n\
    for (var j = -1, m = this.length; ++j < m; ) {\n\
      subgroups.push(subgroup = []);\n\
      subgroup.parentNode = (group = this[j]).parentNode;\n\
      for (var i = -1, n = group.length; ++i < n; ) {\n\
        if (node = group[i]) {\n\
          subgroup.push(subnode = selector.call(node, node.__data__, i, j));\n\
          if (subnode && \"__data__\" in node) subnode.__data__ = node.__data__;\n\
        } else {\n\
          subgroup.push(null);\n\
        }\n\
      }\n\
    }\n\
    return d3_selection(subgroups);\n\
  };\n\
  function d3_selection_selector(selector) {\n\
    return typeof selector === \"function\" ? selector : function() {\n\
      return d3_select(selector, this);\n\
    };\n\
  }\n\
  d3_selectionPrototype.selectAll = function(selector) {\n\
    var subgroups = [], subgroup, node;\n\
    selector = d3_selection_selectorAll(selector);\n\
    for (var j = -1, m = this.length; ++j < m; ) {\n\
      for (var group = this[j], i = -1, n = group.length; ++i < n; ) {\n\
        if (node = group[i]) {\n\
          subgroups.push(subgroup = d3_array(selector.call(node, node.__data__, i, j)));\n\
          subgroup.parentNode = node;\n\
        }\n\
      }\n\
    }\n\
    return d3_selection(subgroups);\n\
  };\n\
  function d3_selection_selectorAll(selector) {\n\
    return typeof selector === \"function\" ? selector : function() {\n\
      return d3_selectAll(selector, this);\n\
    };\n\
  }\n\
  var d3_nsPrefix = {\n\
    svg: \"http://www.w3.org/2000/svg\",\n\
    xhtml: \"http://www.w3.org/1999/xhtml\",\n\
    xlink: \"http://www.w3.org/1999/xlink\",\n\
    xml: \"http://www.w3.org/XML/1998/namespace\",\n\
    xmlns: \"http://www.w3.org/2000/xmlns/\"\n\
  };\n\
  d3.ns = {\n\
    prefix: d3_nsPrefix,\n\
    qualify: function(name) {\n\
      var i = name.indexOf(\":\"), prefix = name;\n\
      if (i >= 0) {\n\
        prefix = name.substring(0, i);\n\
        name = name.substring(i + 1);\n\
      }\n\
      return d3_nsPrefix.hasOwnProperty(prefix) ? {\n\
        space: d3_nsPrefix[prefix],\n\
        local: name\n\
      } : name;\n\
    }\n\
  };\n\
  d3_selectionPrototype.attr = function(name, value) {\n\
    if (arguments.length < 2) {\n\
      if (typeof name === \"string\") {\n\
        var node = this.node();\n\
        name = d3.ns.qualify(name);\n\
        return name.local ? node.getAttributeNS(name.space, name.local) : node.getAttribute(name);\n\
      }\n\
      for (value in name) this.each(d3_selection_attr(value, name[value]));\n\
      return this;\n\
    }\n\
    return this.each(d3_selection_attr(name, value));\n\
  };\n\
  function d3_selection_attr(name, value) {\n\
    name = d3.ns.qualify(name);\n\
    function attrNull() {\n\
      this.removeAttribute(name);\n\
    }\n\
    function attrNullNS() {\n\
      this.removeAttributeNS(name.space, name.local);\n\
    }\n\
    function attrConstant() {\n\
      this.setAttribute(name, value);\n\
    }\n\
    function attrConstantNS() {\n\
      this.setAttributeNS(name.space, name.local, value);\n\
    }\n\
    function attrFunction() {\n\
      var x = value.apply(this, arguments);\n\
      if (x == null) this.removeAttribute(name); else this.setAttribute(name, x);\n\
    }\n\
    function attrFunctionNS() {\n\
      var x = value.apply(this, arguments);\n\
      if (x == null) this.removeAttributeNS(name.space, name.local); else this.setAttributeNS(name.space, name.local, x);\n\
    }\n\
    return value == null ? name.local ? attrNullNS : attrNull : typeof value === \"function\" ? name.local ? attrFunctionNS : attrFunction : name.local ? attrConstantNS : attrConstant;\n\
  }\n\
  function d3_collapse(s) {\n\
    return s.trim().replace(/\\s+/g, \" \");\n\
  }\n\
  d3_selectionPrototype.classed = function(name, value) {\n\
    if (arguments.length < 2) {\n\
      if (typeof name === \"string\") {\n\
        var node = this.node(), n = (name = d3_selection_classes(name)).length, i = -1;\n\
        if (value = node.classList) {\n\
          while (++i < n) if (!value.contains(name[i])) return false;\n\
        } else {\n\
          value = node.getAttribute(\"class\");\n\
          while (++i < n) if (!d3_selection_classedRe(name[i]).test(value)) return false;\n\
        }\n\
        return true;\n\
      }\n\
      for (value in name) this.each(d3_selection_classed(value, name[value]));\n\
      return this;\n\
    }\n\
    return this.each(d3_selection_classed(name, value));\n\
  };\n\
  function d3_selection_classedRe(name) {\n\
    return new RegExp(\"(?:^|\\\\s+)\" + d3.requote(name) + \"(?:\\\\s+|$)\", \"g\");\n\
  }\n\
  function d3_selection_classes(name) {\n\
    return name.trim().split(/^|\\s+/);\n\
  }\n\
  function d3_selection_classed(name, value) {\n\
    name = d3_selection_classes(name).map(d3_selection_classedName);\n\
    var n = name.length;\n\
    function classedConstant() {\n\
      var i = -1;\n\
      while (++i < n) name[i](this, value);\n\
    }\n\
    function classedFunction() {\n\
      var i = -1, x = value.apply(this, arguments);\n\
      while (++i < n) name[i](this, x);\n\
    }\n\
    return typeof value === \"function\" ? classedFunction : classedConstant;\n\
  }\n\
  function d3_selection_classedName(name) {\n\
    var re = d3_selection_classedRe(name);\n\
    return function(node, value) {\n\
      if (c = node.classList) return value ? c.add(name) : c.remove(name);\n\
      var c = node.getAttribute(\"class\") || \"\";\n\
      if (value) {\n\
        re.lastIndex = 0;\n\
        if (!re.test(c)) node.setAttribute(\"class\", d3_collapse(c + \" \" + name));\n\
      } else {\n\
        node.setAttribute(\"class\", d3_collapse(c.replace(re, \" \")));\n\
      }\n\
    };\n\
  }\n\
  d3_selectionPrototype.style = function(name, value, priority) {\n\
    var n = arguments.length;\n\
    if (n < 3) {\n\
      if (typeof name !== \"string\") {\n\
        if (n < 2) value = \"\";\n\
        for (priority in name) this.each(d3_selection_style(priority, name[priority], value));\n\
        return this;\n\
      }\n\
      if (n < 2) return d3_window.getComputedStyle(this.node(), null).getPropertyValue(name);\n\
      priority = \"\";\n\
    }\n\
    return this.each(d3_selection_style(name, value, priority));\n\
  };\n\
  function d3_selection_style(name, value, priority) {\n\
    function styleNull() {\n\
      this.style.removeProperty(name);\n\
    }\n\
    function styleConstant() {\n\
      this.style.setProperty(name, value, priority);\n\
    }\n\
    function styleFunction() {\n\
      var x = value.apply(this, arguments);\n\
      if (x == null) this.style.removeProperty(name); else this.style.setProperty(name, x, priority);\n\
    }\n\
    return value == null ? styleNull : typeof value === \"function\" ? styleFunction : styleConstant;\n\
  }\n\
  d3_selectionPrototype.property = function(name, value) {\n\
    if (arguments.length < 2) {\n\
      if (typeof name === \"string\") return this.node()[name];\n\
      for (value in name) this.each(d3_selection_property(value, name[value]));\n\
      return this;\n\
    }\n\
    return this.each(d3_selection_property(name, value));\n\
  };\n\
  function d3_selection_property(name, value) {\n\
    function propertyNull() {\n\
      delete this[name];\n\
    }\n\
    function propertyConstant() {\n\
      this[name] = value;\n\
    }\n\
    function propertyFunction() {\n\
      var x = value.apply(this, arguments);\n\
      if (x == null) delete this[name]; else this[name] = x;\n\
    }\n\
    return value == null ? propertyNull : typeof value === \"function\" ? propertyFunction : propertyConstant;\n\
  }\n\
  d3_selectionPrototype.text = function(value) {\n\
    return arguments.length ? this.each(typeof value === \"function\" ? function() {\n\
      var v = value.apply(this, arguments);\n\
      this.textContent = v == null ? \"\" : v;\n\
    } : value == null ? function() {\n\
      this.textContent = \"\";\n\
    } : function() {\n\
      this.textContent = value;\n\
    }) : this.node().textContent;\n\
  };\n\
  d3_selectionPrototype.html = function(value) {\n\
    return arguments.length ? this.each(typeof value === \"function\" ? function() {\n\
      var v = value.apply(this, arguments);\n\
      this.innerHTML = v == null ? \"\" : v;\n\
    } : value == null ? function() {\n\
      this.innerHTML = \"\";\n\
    } : function() {\n\
      this.innerHTML = value;\n\
    }) : this.node().innerHTML;\n\
  };\n\
  d3_selectionPrototype.append = function(name) {\n\
    name = d3_selection_creator(name);\n\
    return this.select(function() {\n\
      return this.appendChild(name.apply(this, arguments));\n\
    });\n\
  };\n\
  function d3_selection_creator(name) {\n\
    return typeof name === \"function\" ? name : (name = d3.ns.qualify(name)).local ? function() {\n\
      return this.ownerDocument.createElementNS(name.space, name.local);\n\
    } : function() {\n\
      return this.ownerDocument.createElementNS(this.namespaceURI, name);\n\
    };\n\
  }\n\
  d3_selectionPrototype.insert = function(name, before) {\n\
    name = d3_selection_creator(name);\n\
    before = d3_selection_selector(before);\n\
    return this.select(function() {\n\
      return this.insertBefore(name.apply(this, arguments), before.apply(this, arguments) || null);\n\
    });\n\
  };\n\
  d3_selectionPrototype.remove = function() {\n\
    return this.each(function() {\n\
      var parent = this.parentNode;\n\
      if (parent) parent.removeChild(this);\n\
    });\n\
  };\n\
  d3_selectionPrototype.data = function(value, key) {\n\
    var i = -1, n = this.length, group, node;\n\
    if (!arguments.length) {\n\
      value = new Array(n = (group = this[0]).length);\n\
      while (++i < n) {\n\
        if (node = group[i]) {\n\
          value[i] = node.__data__;\n\
        }\n\
      }\n\
      return value;\n\
    }\n\
    function bind(group, groupData) {\n\
      var i, n = group.length, m = groupData.length, n0 = Math.min(n, m), updateNodes = new Array(m), enterNodes = new Array(m), exitNodes = new Array(n), node, nodeData;\n\
      if (key) {\n\
        var nodeByKeyValue = new d3_Map(), dataByKeyValue = new d3_Map(), keyValues = [], keyValue;\n\
        for (i = -1; ++i < n; ) {\n\
          keyValue = key.call(node = group[i], node.__data__, i);\n\
          if (nodeByKeyValue.has(keyValue)) {\n\
            exitNodes[i] = node;\n\
          } else {\n\
            nodeByKeyValue.set(keyValue, node);\n\
          }\n\
          keyValues.push(keyValue);\n\
        }\n\
        for (i = -1; ++i < m; ) {\n\
          keyValue = key.call(groupData, nodeData = groupData[i], i);\n\
          if (node = nodeByKeyValue.get(keyValue)) {\n\
            updateNodes[i] = node;\n\
            node.__data__ = nodeData;\n\
          } else if (!dataByKeyValue.has(keyValue)) {\n\
            enterNodes[i] = d3_selection_dataNode(nodeData);\n\
          }\n\
          dataByKeyValue.set(keyValue, nodeData);\n\
          nodeByKeyValue.remove(keyValue);\n\
        }\n\
        for (i = -1; ++i < n; ) {\n\
          if (nodeByKeyValue.has(keyValues[i])) {\n\
            exitNodes[i] = group[i];\n\
          }\n\
        }\n\
      } else {\n\
        for (i = -1; ++i < n0; ) {\n\
          node = group[i];\n\
          nodeData = groupData[i];\n\
          if (node) {\n\
            node.__data__ = nodeData;\n\
            updateNodes[i] = node;\n\
          } else {\n\
            enterNodes[i] = d3_selection_dataNode(nodeData);\n\
          }\n\
        }\n\
        for (;i < m; ++i) {\n\
          enterNodes[i] = d3_selection_dataNode(groupData[i]);\n\
        }\n\
        for (;i < n; ++i) {\n\
          exitNodes[i] = group[i];\n\
        }\n\
      }\n\
      enterNodes.update = updateNodes;\n\
      enterNodes.parentNode = updateNodes.parentNode = exitNodes.parentNode = group.parentNode;\n\
      enter.push(enterNodes);\n\
      update.push(updateNodes);\n\
      exit.push(exitNodes);\n\
    }\n\
    var enter = d3_selection_enter([]), update = d3_selection([]), exit = d3_selection([]);\n\
    if (typeof value === \"function\") {\n\
      while (++i < n) {\n\
        bind(group = this[i], value.call(group, group.parentNode.__data__, i));\n\
      }\n\
    } else {\n\
      while (++i < n) {\n\
        bind(group = this[i], value);\n\
      }\n\
    }\n\
    update.enter = function() {\n\
      return enter;\n\
    };\n\
    update.exit = function() {\n\
      return exit;\n\
    };\n\
    return update;\n\
  };\n\
  function d3_selection_dataNode(data) {\n\
    return {\n\
      __data__: data\n\
    };\n\
  }\n\
  d3_selectionPrototype.datum = function(value) {\n\
    return arguments.length ? this.property(\"__data__\", value) : this.property(\"__data__\");\n\
  };\n\
  d3_selectionPrototype.filter = function(filter) {\n\
    var subgroups = [], subgroup, group, node;\n\
    if (typeof filter !== \"function\") filter = d3_selection_filter(filter);\n\
    for (var j = 0, m = this.length; j < m; j++) {\n\
      subgroups.push(subgroup = []);\n\
      subgroup.parentNode = (group = this[j]).parentNode;\n\
      for (var i = 0, n = group.length; i < n; i++) {\n\
        if ((node = group[i]) && filter.call(node, node.__data__, i, j)) {\n\
          subgroup.push(node);\n\
        }\n\
      }\n\
    }\n\
    return d3_selection(subgroups);\n\
  };\n\
  function d3_selection_filter(selector) {\n\
    return function() {\n\
      return d3_selectMatches(this, selector);\n\
    };\n\
  }\n\
  d3_selectionPrototype.order = function() {\n\
    for (var j = -1, m = this.length; ++j < m; ) {\n\
      for (var group = this[j], i = group.length - 1, next = group[i], node; --i >= 0; ) {\n\
        if (node = group[i]) {\n\
          if (next && next !== node.nextSibling) next.parentNode.insertBefore(node, next);\n\
          next = node;\n\
        }\n\
      }\n\
    }\n\
    return this;\n\
  };\n\
  d3_selectionPrototype.sort = function(comparator) {\n\
    comparator = d3_selection_sortComparator.apply(this, arguments);\n\
    for (var j = -1, m = this.length; ++j < m; ) this[j].sort(comparator);\n\
    return this.order();\n\
  };\n\
  function d3_selection_sortComparator(comparator) {\n\
    if (!arguments.length) comparator = d3_ascending;\n\
    return function(a, b) {\n\
      return a && b ? comparator(a.__data__, b.__data__) : !a - !b;\n\
    };\n\
  }\n\
  d3_selectionPrototype.each = function(callback) {\n\
    return d3_selection_each(this, function(node, i, j) {\n\
      callback.call(node, node.__data__, i, j);\n\
    });\n\
  };\n\
  function d3_selection_each(groups, callback) {\n\
    for (var j = 0, m = groups.length; j < m; j++) {\n\
      for (var group = groups[j], i = 0, n = group.length, node; i < n; i++) {\n\
        if (node = group[i]) callback(node, i, j);\n\
      }\n\
    }\n\
    return groups;\n\
  }\n\
  d3_selectionPrototype.call = function(callback) {\n\
    var args = d3_array(arguments);\n\
    callback.apply(args[0] = this, args);\n\
    return this;\n\
  };\n\
  d3_selectionPrototype.empty = function() {\n\
    return !this.node();\n\
  };\n\
  d3_selectionPrototype.node = function() {\n\
    for (var j = 0, m = this.length; j < m; j++) {\n\
      for (var group = this[j], i = 0, n = group.length; i < n; i++) {\n\
        var node = group[i];\n\
        if (node) return node;\n\
      }\n\
    }\n\
    return null;\n\
  };\n\
  d3_selectionPrototype.size = function() {\n\
    var n = 0;\n\
    this.each(function() {\n\
      ++n;\n\
    });\n\
    return n;\n\
  };\n\
  function d3_selection_enter(selection) {\n\
    d3_subclass(selection, d3_selection_enterPrototype);\n\
    return selection;\n\
  }\n\
  var d3_selection_enterPrototype = [];\n\
  d3.selection.enter = d3_selection_enter;\n\
  d3.selection.enter.prototype = d3_selection_enterPrototype;\n\
  d3_selection_enterPrototype.append = d3_selectionPrototype.append;\n\
  d3_selection_enterPrototype.empty = d3_selectionPrototype.empty;\n\
  d3_selection_enterPrototype.node = d3_selectionPrototype.node;\n\
  d3_selection_enterPrototype.call = d3_selectionPrototype.call;\n\
  d3_selection_enterPrototype.size = d3_selectionPrototype.size;\n\
  d3_selection_enterPrototype.select = function(selector) {\n\
    var subgroups = [], subgroup, subnode, upgroup, group, node;\n\
    for (var j = -1, m = this.length; ++j < m; ) {\n\
      upgroup = (group = this[j]).update;\n\
      subgroups.push(subgroup = []);\n\
      subgroup.parentNode = group.parentNode;\n\
      for (var i = -1, n = group.length; ++i < n; ) {\n\
        if (node = group[i]) {\n\
          subgroup.push(upgroup[i] = subnode = selector.call(group.parentNode, node.__data__, i, j));\n\
          subnode.__data__ = node.__data__;\n\
        } else {\n\
          subgroup.push(null);\n\
        }\n\
      }\n\
    }\n\
    return d3_selection(subgroups);\n\
  };\n\
  d3_selection_enterPrototype.insert = function(name, before) {\n\
    if (arguments.length < 2) before = d3_selection_enterInsertBefore(this);\n\
    return d3_selectionPrototype.insert.call(this, name, before);\n\
  };\n\
  function d3_selection_enterInsertBefore(enter) {\n\
    var i0, j0;\n\
    return function(d, i, j) {\n\
      var group = enter[j].update, n = group.length, node;\n\
      if (j != j0) j0 = j, i0 = 0;\n\
      if (i >= i0) i0 = i + 1;\n\
      while (!(node = group[i0]) && ++i0 < n) ;\n\
      return node;\n\
    };\n\
  }\n\
  d3_selectionPrototype.transition = function() {\n\
    var id = d3_transitionInheritId || ++d3_transitionId, subgroups = [], subgroup, node, transition = d3_transitionInherit || {\n\
      time: Date.now(),\n\
      ease: d3_ease_cubicInOut,\n\
      delay: 0,\n\
      duration: 250\n\
    };\n\
    for (var j = -1, m = this.length; ++j < m; ) {\n\
      subgroups.push(subgroup = []);\n\
      for (var group = this[j], i = -1, n = group.length; ++i < n; ) {\n\
        if (node = group[i]) d3_transitionNode(node, i, id, transition);\n\
        subgroup.push(node);\n\
      }\n\
    }\n\
    return d3_transition(subgroups, id);\n\
  };\n\
  d3_selectionPrototype.interrupt = function() {\n\
    return this.each(d3_selection_interrupt);\n\
  };\n\
  function d3_selection_interrupt() {\n\
    var lock = this.__transition__;\n\
    if (lock) ++lock.active;\n\
  }\n\
  d3.select = function(node) {\n\
    var group = [ typeof node === \"string\" ? d3_select(node, d3_document) : node ];\n\
    group.parentNode = d3_documentElement;\n\
    return d3_selection([ group ]);\n\
  };\n\
  d3.selectAll = function(nodes) {\n\
    var group = d3_array(typeof nodes === \"string\" ? d3_selectAll(nodes, d3_document) : nodes);\n\
    group.parentNode = d3_documentElement;\n\
    return d3_selection([ group ]);\n\
  };\n\
  var d3_selectionRoot = d3.select(d3_documentElement);\n\
  d3_selectionPrototype.on = function(type, listener, capture) {\n\
    var n = arguments.length;\n\
    if (n < 3) {\n\
      if (typeof type !== \"string\") {\n\
        if (n < 2) listener = false;\n\
        for (capture in type) this.each(d3_selection_on(capture, type[capture], listener));\n\
        return this;\n\
      }\n\
      if (n < 2) return (n = this.node()[\"__on\" + type]) && n._;\n\
      capture = false;\n\
    }\n\
    return this.each(d3_selection_on(type, listener, capture));\n\
  };\n\
  function d3_selection_on(type, listener, capture) {\n\
    var name = \"__on\" + type, i = type.indexOf(\".\"), wrap = d3_selection_onListener;\n\
    if (i > 0) type = type.substring(0, i);\n\
    var filter = d3_selection_onFilters.get(type);\n\
    if (filter) type = filter, wrap = d3_selection_onFilter;\n\
    function onRemove() {\n\
      var l = this[name];\n\
      if (l) {\n\
        this.removeEventListener(type, l, l.$);\n\
        delete this[name];\n\
      }\n\
    }\n\
    function onAdd() {\n\
      var l = wrap(listener, d3_array(arguments));\n\
      onRemove.call(this);\n\
      this.addEventListener(type, this[name] = l, l.$ = capture);\n\
      l._ = listener;\n\
    }\n\
    function removeAll() {\n\
      var re = new RegExp(\"^__on([^.]+)\" + d3.requote(type) + \"$\"), match;\n\
      for (var name in this) {\n\
        if (match = name.match(re)) {\n\
          var l = this[name];\n\
          this.removeEventListener(match[1], l, l.$);\n\
          delete this[name];\n\
        }\n\
      }\n\
    }\n\
    return i ? listener ? onAdd : onRemove : listener ? d3_noop : removeAll;\n\
  }\n\
  var d3_selection_onFilters = d3.map({\n\
    mouseenter: \"mouseover\",\n\
    mouseleave: \"mouseout\"\n\
  });\n\
  d3_selection_onFilters.forEach(function(k) {\n\
    if (\"on\" + k in d3_document) d3_selection_onFilters.remove(k);\n\
  });\n\
  function d3_selection_onListener(listener, argumentz) {\n\
    return function(e) {\n\
      var o = d3.event;\n\
      d3.event = e;\n\
      argumentz[0] = this.__data__;\n\
      try {\n\
        listener.apply(this, argumentz);\n\
      } finally {\n\
        d3.event = o;\n\
      }\n\
    };\n\
  }\n\
  function d3_selection_onFilter(listener, argumentz) {\n\
    var l = d3_selection_onListener(listener, argumentz);\n\
    return function(e) {\n\
      var target = this, related = e.relatedTarget;\n\
      if (!related || related !== target && !(related.compareDocumentPosition(target) & 8)) {\n\
        l.call(target, e);\n\
      }\n\
    };\n\
  }\n\
  var d3_event_dragSelect = \"onselectstart\" in d3_document ? null : d3_vendorSymbol(d3_documentElement.style, \"userSelect\"), d3_event_dragId = 0;\n\
  function d3_event_dragSuppress() {\n\
    var name = \".dragsuppress-\" + ++d3_event_dragId, click = \"click\" + name, w = d3.select(d3_window).on(\"touchmove\" + name, d3_eventPreventDefault).on(\"dragstart\" + name, d3_eventPreventDefault).on(\"selectstart\" + name, d3_eventPreventDefault);\n\
    if (d3_event_dragSelect) {\n\
      var style = d3_documentElement.style, select = style[d3_event_dragSelect];\n\
      style[d3_event_dragSelect] = \"none\";\n\
    }\n\
    return function(suppressClick) {\n\
      w.on(name, null);\n\
      if (d3_event_dragSelect) style[d3_event_dragSelect] = select;\n\
      if (suppressClick) {\n\
        function off() {\n\
          w.on(click, null);\n\
        }\n\
        w.on(click, function() {\n\
          d3_eventPreventDefault();\n\
          off();\n\
        }, true);\n\
        setTimeout(off, 0);\n\
      }\n\
    };\n\
  }\n\
  d3.mouse = function(container) {\n\
    return d3_mousePoint(container, d3_eventSource());\n\
  };\n\
  function d3_mousePoint(container, e) {\n\
    if (e.changedTouches) e = e.changedTouches[0];\n\
    var svg = container.ownerSVGElement || container;\n\
    if (svg.createSVGPoint) {\n\
      var point = svg.createSVGPoint();\n\
      point.x = e.clientX, point.y = e.clientY;\n\
      point = point.matrixTransform(container.getScreenCTM().inverse());\n\
      return [ point.x, point.y ];\n\
    }\n\
    var rect = container.getBoundingClientRect();\n\
    return [ e.clientX - rect.left - container.clientLeft, e.clientY - rect.top - container.clientTop ];\n\
  }\n\
  d3.touches = function(container, touches) {\n\
    if (arguments.length < 2) touches = d3_eventSource().touches;\n\
    return touches ? d3_array(touches).map(function(touch) {\n\
      var point = d3_mousePoint(container, touch);\n\
      point.identifier = touch.identifier;\n\
      return point;\n\
    }) : [];\n\
  };\n\
  d3.behavior.drag = function() {\n\
    var event = d3_eventDispatch(drag, \"drag\", \"dragstart\", \"dragend\"), origin = null, mousedown = dragstart(d3_noop, d3.mouse, d3_behavior_dragMouseSubject, \"mousemove\", \"mouseup\"), touchstart = dragstart(d3_behavior_dragTouchId, d3.touch, d3_behavior_dragTouchSubject, \"touchmove\", \"touchend\");\n\
    function drag() {\n\
      this.on(\"mousedown.drag\", mousedown).on(\"touchstart.drag\", touchstart);\n\
    }\n\
    function dragstart(id, position, subject, move, end) {\n\
      return function() {\n\
        var that = this, target = d3.event.target, parent = that.parentNode, dispatch = event.of(that, arguments), dragged = 0, dragId = id(), dragName = \".drag\" + (dragId == null ? \"\" : \"-\" + dragId), dragOffset, dragSubject = d3.select(subject()).on(move + dragName, moved).on(end + dragName, ended), dragRestore = d3_event_dragSuppress(), position0 = position(parent, dragId);\n\
        if (origin) {\n\
          dragOffset = origin.apply(that, arguments);\n\
          dragOffset = [ dragOffset.x - position0[0], dragOffset.y - position0[1] ];\n\
        } else {\n\
          dragOffset = [ 0, 0 ];\n\
        }\n\
        dispatch({\n\
          type: \"dragstart\"\n\
        });\n\
        function moved() {\n\
          var position1 = position(parent, dragId), dx, dy;\n\
          if (!position1) return;\n\
          dx = position1[0] - position0[0];\n\
          dy = position1[1] - position0[1];\n\
          dragged |= dx | dy;\n\
          position0 = position1;\n\
          dispatch({\n\
            type: \"drag\",\n\
            x: position1[0] + dragOffset[0],\n\
            y: position1[1] + dragOffset[1],\n\
            dx: dx,\n\
            dy: dy\n\
          });\n\
        }\n\
        function ended() {\n\
          if (!position(parent, dragId)) return;\n\
          dragSubject.on(move + dragName, null).on(end + dragName, null);\n\
          dragRestore(dragged && d3.event.target === target);\n\
          dispatch({\n\
            type: \"dragend\"\n\
          });\n\
        }\n\
      };\n\
    }\n\
    drag.origin = function(x) {\n\
      if (!arguments.length) return origin;\n\
      origin = x;\n\
      return drag;\n\
    };\n\
    return d3.rebind(drag, event, \"on\");\n\
  };\n\
  function d3_behavior_dragTouchId() {\n\
    return d3.event.changedTouches[0].identifier;\n\
  }\n\
  function d3_behavior_dragTouchSubject() {\n\
    return d3.event.target;\n\
  }\n\
  function d3_behavior_dragMouseSubject() {\n\
    return d3_window;\n\
  }\n\
  var π = Math.PI, τ = 2 * π, halfπ = π / 2, ε = 1e-6, ε2 = ε * ε, d3_radians = π / 180, d3_degrees = 180 / π;\n\
  function d3_sgn(x) {\n\
    return x > 0 ? 1 : x < 0 ? -1 : 0;\n\
  }\n\
  function d3_cross2d(a, b, c) {\n\
    return (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]);\n\
  }\n\
  function d3_acos(x) {\n\
    return x > 1 ? 0 : x < -1 ? π : Math.acos(x);\n\
  }\n\
  function d3_asin(x) {\n\
    return x > 1 ? halfπ : x < -1 ? -halfπ : Math.asin(x);\n\
  }\n\
  function d3_sinh(x) {\n\
    return ((x = Math.exp(x)) - 1 / x) / 2;\n\
  }\n\
  function d3_cosh(x) {\n\
    return ((x = Math.exp(x)) + 1 / x) / 2;\n\
  }\n\
  function d3_tanh(x) {\n\
    return ((x = Math.exp(2 * x)) - 1) / (x + 1);\n\
  }\n\
  function d3_haversin(x) {\n\
    return (x = Math.sin(x / 2)) * x;\n\
  }\n\
  var ρ = Math.SQRT2, ρ2 = 2, ρ4 = 4;\n\
  d3.interpolateZoom = function(p0, p1) {\n\
    var ux0 = p0[0], uy0 = p0[1], w0 = p0[2], ux1 = p1[0], uy1 = p1[1], w1 = p1[2];\n\
    var dx = ux1 - ux0, dy = uy1 - uy0, d2 = dx * dx + dy * dy, d1 = Math.sqrt(d2), b0 = (w1 * w1 - w0 * w0 + ρ4 * d2) / (2 * w0 * ρ2 * d1), b1 = (w1 * w1 - w0 * w0 - ρ4 * d2) / (2 * w1 * ρ2 * d1), r0 = Math.log(Math.sqrt(b0 * b0 + 1) - b0), r1 = Math.log(Math.sqrt(b1 * b1 + 1) - b1), dr = r1 - r0, S = (dr || Math.log(w1 / w0)) / ρ;\n\
    function interpolate(t) {\n\
      var s = t * S;\n\
      if (dr) {\n\
        var coshr0 = d3_cosh(r0), u = w0 / (ρ2 * d1) * (coshr0 * d3_tanh(ρ * s + r0) - d3_sinh(r0));\n\
        return [ ux0 + u * dx, uy0 + u * dy, w0 * coshr0 / d3_cosh(ρ * s + r0) ];\n\
      }\n\
      return [ ux0 + t * dx, uy0 + t * dy, w0 * Math.exp(ρ * s) ];\n\
    }\n\
    interpolate.duration = S * 1e3;\n\
    return interpolate;\n\
  };\n\
  d3.behavior.zoom = function() {\n\
    var view = {\n\
      x: 0,\n\
      y: 0,\n\
      k: 1\n\
    }, translate0, center, size = [ 960, 500 ], scaleExtent = d3_behavior_zoomInfinity, mousedown = \"mousedown.zoom\", mousemove = \"mousemove.zoom\", mouseup = \"mouseup.zoom\", mousewheelTimer, touchstart = \"touchstart.zoom\", touchtime, event = d3_eventDispatch(zoom, \"zoomstart\", \"zoom\", \"zoomend\"), x0, x1, y0, y1;\n\
    function zoom(g) {\n\
      g.on(mousedown, mousedowned).on(d3_behavior_zoomWheel + \".zoom\", mousewheeled).on(mousemove, mousewheelreset).on(\"dblclick.zoom\", dblclicked).on(touchstart, touchstarted);\n\
    }\n\
    zoom.event = function(g) {\n\
      g.each(function() {\n\
        var dispatch = event.of(this, arguments), view1 = view;\n\
        if (d3_transitionInheritId) {\n\
          d3.select(this).transition().each(\"start.zoom\", function() {\n\
            view = this.__chart__ || {\n\
              x: 0,\n\
              y: 0,\n\
              k: 1\n\
            };\n\
            zoomstarted(dispatch);\n\
          }).tween(\"zoom:zoom\", function() {\n\
            var dx = size[0], dy = size[1], cx = dx / 2, cy = dy / 2, i = d3.interpolateZoom([ (cx - view.x) / view.k, (cy - view.y) / view.k, dx / view.k ], [ (cx - view1.x) / view1.k, (cy - view1.y) / view1.k, dx / view1.k ]);\n\
            return function(t) {\n\
              var l = i(t), k = dx / l[2];\n\
              this.__chart__ = view = {\n\
                x: cx - l[0] * k,\n\
                y: cy - l[1] * k,\n\
                k: k\n\
              };\n\
              zoomed(dispatch);\n\
            };\n\
          }).each(\"end.zoom\", function() {\n\
            zoomended(dispatch);\n\
          });\n\
        } else {\n\
          this.__chart__ = view;\n\
          zoomstarted(dispatch);\n\
          zoomed(dispatch);\n\
          zoomended(dispatch);\n\
        }\n\
      });\n\
    };\n\
    zoom.translate = function(_) {\n\
      if (!arguments.length) return [ view.x, view.y ];\n\
      view = {\n\
        x: +_[0],\n\
        y: +_[1],\n\
        k: view.k\n\
      };\n\
      rescale();\n\
      return zoom;\n\
    };\n\
    zoom.scale = function(_) {\n\
      if (!arguments.length) return view.k;\n\
      view = {\n\
        x: view.x,\n\
        y: view.y,\n\
        k: +_\n\
      };\n\
      rescale();\n\
      return zoom;\n\
    };\n\
    zoom.scaleExtent = function(_) {\n\
      if (!arguments.length) return scaleExtent;\n\
      scaleExtent = _ == null ? d3_behavior_zoomInfinity : [ +_[0], +_[1] ];\n\
      return zoom;\n\
    };\n\
    zoom.center = function(_) {\n\
      if (!arguments.length) return center;\n\
      center = _ && [ +_[0], +_[1] ];\n\
      return zoom;\n\
    };\n\
    zoom.size = function(_) {\n\
      if (!arguments.length) return size;\n\
      size = _ && [ +_[0], +_[1] ];\n\
      return zoom;\n\
    };\n\
    zoom.x = function(z) {\n\
      if (!arguments.length) return x1;\n\
      x1 = z;\n\
      x0 = z.copy();\n\
      view = {\n\
        x: 0,\n\
        y: 0,\n\
        k: 1\n\
      };\n\
      return zoom;\n\
    };\n\
    zoom.y = function(z) {\n\
      if (!arguments.length) return y1;\n\
      y1 = z;\n\
      y0 = z.copy();\n\
      view = {\n\
        x: 0,\n\
        y: 0,\n\
        k: 1\n\
      };\n\
      return zoom;\n\
    };\n\
    function location(p) {\n\
      return [ (p[0] - view.x) / view.k, (p[1] - view.y) / view.k ];\n\
    }\n\
    function point(l) {\n\
      return [ l[0] * view.k + view.x, l[1] * view.k + view.y ];\n\
    }\n\
    function scaleTo(s) {\n\
      view.k = Math.max(scaleExtent[0], Math.min(scaleExtent[1], s));\n\
    }\n\
    function translateTo(p, l) {\n\
      l = point(l);\n\
      view.x += p[0] - l[0];\n\
      view.y += p[1] - l[1];\n\
    }\n\
    function rescale() {\n\
      if (x1) x1.domain(x0.range().map(function(x) {\n\
        return (x - view.x) / view.k;\n\
      }).map(x0.invert));\n\
      if (y1) y1.domain(y0.range().map(function(y) {\n\
        return (y - view.y) / view.k;\n\
      }).map(y0.invert));\n\
    }\n\
    function zoomstarted(dispatch) {\n\
      dispatch({\n\
        type: \"zoomstart\"\n\
      });\n\
    }\n\
    function zoomed(dispatch) {\n\
      rescale();\n\
      dispatch({\n\
        type: \"zoom\",\n\
        scale: view.k,\n\
        translate: [ view.x, view.y ]\n\
      });\n\
    }\n\
    function zoomended(dispatch) {\n\
      dispatch({\n\
        type: \"zoomend\"\n\
      });\n\
    }\n\
    function mousedowned() {\n\
      var that = this, target = d3.event.target, dispatch = event.of(that, arguments), dragged = 0, subject = d3.select(d3_window).on(mousemove, moved).on(mouseup, ended), location0 = location(d3.mouse(that)), dragRestore = d3_event_dragSuppress();\n\
      d3_selection_interrupt.call(that);\n\
      zoomstarted(dispatch);\n\
      function moved() {\n\
        dragged = 1;\n\
        translateTo(d3.mouse(that), location0);\n\
        zoomed(dispatch);\n\
      }\n\
      function ended() {\n\
        subject.on(mousemove, d3_window === that ? mousewheelreset : null).on(mouseup, null);\n\
        dragRestore(dragged && d3.event.target === target);\n\
        zoomended(dispatch);\n\
      }\n\
    }\n\
    function touchstarted() {\n\
      var that = this, dispatch = event.of(that, arguments), locations0 = {}, distance0 = 0, scale0, zoomName = \".zoom-\" + d3.event.changedTouches[0].identifier, touchmove = \"touchmove\" + zoomName, touchend = \"touchend\" + zoomName, target = d3.select(d3.event.target).on(touchmove, moved).on(touchend, ended), subject = d3.select(that).on(mousedown, null).on(touchstart, started), dragRestore = d3_event_dragSuppress();\n\
      d3_selection_interrupt.call(that);\n\
      started();\n\
      zoomstarted(dispatch);\n\
      function relocate() {\n\
        var touches = d3.touches(that);\n\
        scale0 = view.k;\n\
        touches.forEach(function(t) {\n\
          if (t.identifier in locations0) locations0[t.identifier] = location(t);\n\
        });\n\
        return touches;\n\
      }\n\
      function started() {\n\
        var changed = d3.event.changedTouches;\n\
        for (var i = 0, n = changed.length; i < n; ++i) {\n\
          locations0[changed[i].identifier] = null;\n\
        }\n\
        var touches = relocate(), now = Date.now();\n\
        if (touches.length === 1) {\n\
          if (now - touchtime < 500) {\n\
            var p = touches[0], l = locations0[p.identifier];\n\
            scaleTo(view.k * 2);\n\
            translateTo(p, l);\n\
            d3_eventPreventDefault();\n\
            zoomed(dispatch);\n\
          }\n\
          touchtime = now;\n\
        } else if (touches.length > 1) {\n\
          var p = touches[0], q = touches[1], dx = p[0] - q[0], dy = p[1] - q[1];\n\
          distance0 = dx * dx + dy * dy;\n\
        }\n\
      }\n\
      function moved() {\n\
        var touches = d3.touches(that), p0, l0, p1, l1;\n\
        for (var i = 0, n = touches.length; i < n; ++i, l1 = null) {\n\
          p1 = touches[i];\n\
          if (l1 = locations0[p1.identifier]) {\n\
            if (l0) break;\n\
            p0 = p1, l0 = l1;\n\
          }\n\
        }\n\
        if (l1) {\n\
          var distance1 = (distance1 = p1[0] - p0[0]) * distance1 + (distance1 = p1[1] - p0[1]) * distance1, scale1 = distance0 && Math.sqrt(distance1 / distance0);\n\
          p0 = [ (p0[0] + p1[0]) / 2, (p0[1] + p1[1]) / 2 ];\n\
          l0 = [ (l0[0] + l1[0]) / 2, (l0[1] + l1[1]) / 2 ];\n\
          scaleTo(scale1 * scale0);\n\
        }\n\
        touchtime = null;\n\
        translateTo(p0, l0);\n\
        zoomed(dispatch);\n\
      }\n\
      function ended() {\n\
        if (d3.event.touches.length) {\n\
          var changed = d3.event.changedTouches;\n\
          for (var i = 0, n = changed.length; i < n; ++i) {\n\
            delete locations0[changed[i].identifier];\n\
          }\n\
          for (var identifier in locations0) {\n\
            return void relocate();\n\
          }\n\
        }\n\
        target.on(zoomName, null);\n\
        subject.on(mousedown, mousedowned).on(touchstart, touchstarted);\n\
        dragRestore();\n\
        zoomended(dispatch);\n\
      }\n\
    }\n\
    function mousewheeled() {\n\
      var dispatch = event.of(this, arguments);\n\
      if (mousewheelTimer) clearTimeout(mousewheelTimer); else d3_selection_interrupt.call(this), \n\
      zoomstarted(dispatch);\n\
      mousewheelTimer = setTimeout(function() {\n\
        mousewheelTimer = null;\n\
        zoomended(dispatch);\n\
      }, 50);\n\
      d3_eventPreventDefault();\n\
      var point = center || d3.mouse(this);\n\
      if (!translate0) translate0 = location(point);\n\
      scaleTo(Math.pow(2, d3_behavior_zoomDelta() * .002) * view.k);\n\
      translateTo(point, translate0);\n\
      zoomed(dispatch);\n\
    }\n\
    function mousewheelreset() {\n\
      translate0 = null;\n\
    }\n\
    function dblclicked() {\n\
      var dispatch = event.of(this, arguments), p = d3.mouse(this), l = location(p), k = Math.log(view.k) / Math.LN2;\n\
      zoomstarted(dispatch);\n\
      scaleTo(Math.pow(2, d3.event.shiftKey ? Math.ceil(k) - 1 : Math.floor(k) + 1));\n\
      translateTo(p, l);\n\
      zoomed(dispatch);\n\
      zoomended(dispatch);\n\
    }\n\
    return d3.rebind(zoom, event, \"on\");\n\
  };\n\
  var d3_behavior_zoomInfinity = [ 0, Infinity ];\n\
  var d3_behavior_zoomDelta, d3_behavior_zoomWheel = \"onwheel\" in d3_document ? (d3_behavior_zoomDelta = function() {\n\
    return -d3.event.deltaY * (d3.event.deltaMode ? 120 : 1);\n\
  }, \"wheel\") : \"onmousewheel\" in d3_document ? (d3_behavior_zoomDelta = function() {\n\
    return d3.event.wheelDelta;\n\
  }, \"mousewheel\") : (d3_behavior_zoomDelta = function() {\n\
    return -d3.event.detail;\n\
  }, \"MozMousePixelScroll\");\n\
  function d3_Color() {}\n\
  d3_Color.prototype.toString = function() {\n\
    return this.rgb() + \"\";\n\
  };\n\
  d3.hsl = function(h, s, l) {\n\
    return arguments.length === 1 ? h instanceof d3_Hsl ? d3_hsl(h.h, h.s, h.l) : d3_rgb_parse(\"\" + h, d3_rgb_hsl, d3_hsl) : d3_hsl(+h, +s, +l);\n\
  };\n\
  function d3_hsl(h, s, l) {\n\
    return new d3_Hsl(h, s, l);\n\
  }\n\
  function d3_Hsl(h, s, l) {\n\
    this.h = h;\n\
    this.s = s;\n\
    this.l = l;\n\
  }\n\
  var d3_hslPrototype = d3_Hsl.prototype = new d3_Color();\n\
  d3_hslPrototype.brighter = function(k) {\n\
    k = Math.pow(.7, arguments.length ? k : 1);\n\
    return d3_hsl(this.h, this.s, this.l / k);\n\
  };\n\
  d3_hslPrototype.darker = function(k) {\n\
    k = Math.pow(.7, arguments.length ? k : 1);\n\
    return d3_hsl(this.h, this.s, k * this.l);\n\
  };\n\
  d3_hslPrototype.rgb = function() {\n\
    return d3_hsl_rgb(this.h, this.s, this.l);\n\
  };\n\
  function d3_hsl_rgb(h, s, l) {\n\
    var m1, m2;\n\
    h = isNaN(h) ? 0 : (h %= 360) < 0 ? h + 360 : h;\n\
    s = isNaN(s) ? 0 : s < 0 ? 0 : s > 1 ? 1 : s;\n\
    l = l < 0 ? 0 : l > 1 ? 1 : l;\n\
    m2 = l <= .5 ? l * (1 + s) : l + s - l * s;\n\
    m1 = 2 * l - m2;\n\
    function v(h) {\n\
      if (h > 360) h -= 360; else if (h < 0) h += 360;\n\
      if (h < 60) return m1 + (m2 - m1) * h / 60;\n\
      if (h < 180) return m2;\n\
      if (h < 240) return m1 + (m2 - m1) * (240 - h) / 60;\n\
      return m1;\n\
    }\n\
    function vv(h) {\n\
      return Math.round(v(h) * 255);\n\
    }\n\
    return d3_rgb(vv(h + 120), vv(h), vv(h - 120));\n\
  }\n\
  d3.hcl = function(h, c, l) {\n\
    return arguments.length === 1 ? h instanceof d3_Hcl ? d3_hcl(h.h, h.c, h.l) : h instanceof d3_Lab ? d3_lab_hcl(h.l, h.a, h.b) : d3_lab_hcl((h = d3_rgb_lab((h = d3.rgb(h)).r, h.g, h.b)).l, h.a, h.b) : d3_hcl(+h, +c, +l);\n\
  };\n\
  function d3_hcl(h, c, l) {\n\
    return new d3_Hcl(h, c, l);\n\
  }\n\
  function d3_Hcl(h, c, l) {\n\
    this.h = h;\n\
    this.c = c;\n\
    this.l = l;\n\
  }\n\
  var d3_hclPrototype = d3_Hcl.prototype = new d3_Color();\n\
  d3_hclPrototype.brighter = function(k) {\n\
    return d3_hcl(this.h, this.c, Math.min(100, this.l + d3_lab_K * (arguments.length ? k : 1)));\n\
  };\n\
  d3_hclPrototype.darker = function(k) {\n\
    return d3_hcl(this.h, this.c, Math.max(0, this.l - d3_lab_K * (arguments.length ? k : 1)));\n\
  };\n\
  d3_hclPrototype.rgb = function() {\n\
    return d3_hcl_lab(this.h, this.c, this.l).rgb();\n\
  };\n\
  function d3_hcl_lab(h, c, l) {\n\
    if (isNaN(h)) h = 0;\n\
    if (isNaN(c)) c = 0;\n\
    return d3_lab(l, Math.cos(h *= d3_radians) * c, Math.sin(h) * c);\n\
  }\n\
  d3.lab = function(l, a, b) {\n\
    return arguments.length === 1 ? l instanceof d3_Lab ? d3_lab(l.l, l.a, l.b) : l instanceof d3_Hcl ? d3_hcl_lab(l.l, l.c, l.h) : d3_rgb_lab((l = d3.rgb(l)).r, l.g, l.b) : d3_lab(+l, +a, +b);\n\
  };\n\
  function d3_lab(l, a, b) {\n\
    return new d3_Lab(l, a, b);\n\
  }\n\
  function d3_Lab(l, a, b) {\n\
    this.l = l;\n\
    this.a = a;\n\
    this.b = b;\n\
  }\n\
  var d3_lab_K = 18;\n\
  var d3_lab_X = .95047, d3_lab_Y = 1, d3_lab_Z = 1.08883;\n\
  var d3_labPrototype = d3_Lab.prototype = new d3_Color();\n\
  d3_labPrototype.brighter = function(k) {\n\
    return d3_lab(Math.min(100, this.l + d3_lab_K * (arguments.length ? k : 1)), this.a, this.b);\n\
  };\n\
  d3_labPrototype.darker = function(k) {\n\
    return d3_lab(Math.max(0, this.l - d3_lab_K * (arguments.length ? k : 1)), this.a, this.b);\n\
  };\n\
  d3_labPrototype.rgb = function() {\n\
    return d3_lab_rgb(this.l, this.a, this.b);\n\
  };\n\
  function d3_lab_rgb(l, a, b) {\n\
    var y = (l + 16) / 116, x = y + a / 500, z = y - b / 200;\n\
    x = d3_lab_xyz(x) * d3_lab_X;\n\
    y = d3_lab_xyz(y) * d3_lab_Y;\n\
    z = d3_lab_xyz(z) * d3_lab_Z;\n\
    return d3_rgb(d3_xyz_rgb(3.2404542 * x - 1.5371385 * y - .4985314 * z), d3_xyz_rgb(-.969266 * x + 1.8760108 * y + .041556 * z), d3_xyz_rgb(.0556434 * x - .2040259 * y + 1.0572252 * z));\n\
  }\n\
  function d3_lab_hcl(l, a, b) {\n\
    return l > 0 ? d3_hcl(Math.atan2(b, a) * d3_degrees, Math.sqrt(a * a + b * b), l) : d3_hcl(NaN, NaN, l);\n\
  }\n\
  function d3_lab_xyz(x) {\n\
    return x > .206893034 ? x * x * x : (x - 4 / 29) / 7.787037;\n\
  }\n\
  function d3_xyz_lab(x) {\n\
    return x > .008856 ? Math.pow(x, 1 / 3) : 7.787037 * x + 4 / 29;\n\
  }\n\
  function d3_xyz_rgb(r) {\n\
    return Math.round(255 * (r <= .00304 ? 12.92 * r : 1.055 * Math.pow(r, 1 / 2.4) - .055));\n\
  }\n\
  d3.rgb = function(r, g, b) {\n\
    return arguments.length === 1 ? r instanceof d3_Rgb ? d3_rgb(r.r, r.g, r.b) : d3_rgb_parse(\"\" + r, d3_rgb, d3_hsl_rgb) : d3_rgb(~~r, ~~g, ~~b);\n\
  };\n\
  function d3_rgbNumber(value) {\n\
    return d3_rgb(value >> 16, value >> 8 & 255, value & 255);\n\
  }\n\
  function d3_rgbString(value) {\n\
    return d3_rgbNumber(value) + \"\";\n\
  }\n\
  function d3_rgb(r, g, b) {\n\
    return new d3_Rgb(r, g, b);\n\
  }\n\
  function d3_Rgb(r, g, b) {\n\
    this.r = r;\n\
    this.g = g;\n\
    this.b = b;\n\
  }\n\
  var d3_rgbPrototype = d3_Rgb.prototype = new d3_Color();\n\
  d3_rgbPrototype.brighter = function(k) {\n\
    k = Math.pow(.7, arguments.length ? k : 1);\n\
    var r = this.r, g = this.g, b = this.b, i = 30;\n\
    if (!r && !g && !b) return d3_rgb(i, i, i);\n\
    if (r && r < i) r = i;\n\
    if (g && g < i) g = i;\n\
    if (b && b < i) b = i;\n\
    return d3_rgb(Math.min(255, ~~(r / k)), Math.min(255, ~~(g / k)), Math.min(255, ~~(b / k)));\n\
  };\n\
  d3_rgbPrototype.darker = function(k) {\n\
    k = Math.pow(.7, arguments.length ? k : 1);\n\
    return d3_rgb(~~(k * this.r), ~~(k * this.g), ~~(k * this.b));\n\
  };\n\
  d3_rgbPrototype.hsl = function() {\n\
    return d3_rgb_hsl(this.r, this.g, this.b);\n\
  };\n\
  d3_rgbPrototype.toString = function() {\n\
    return \"#\" + d3_rgb_hex(this.r) + d3_rgb_hex(this.g) + d3_rgb_hex(this.b);\n\
  };\n\
  function d3_rgb_hex(v) {\n\
    return v < 16 ? \"0\" + Math.max(0, v).toString(16) : Math.min(255, v).toString(16);\n\
  }\n\
  function d3_rgb_parse(format, rgb, hsl) {\n\
    var r = 0, g = 0, b = 0, m1, m2, color;\n\
    m1 = /([a-z]+)\\((.*)\\)/i.exec(format);\n\
    if (m1) {\n\
      m2 = m1[2].split(\",\");\n\
      switch (m1[1]) {\n\
       case \"hsl\":\n\
        {\n\
          return hsl(parseFloat(m2[0]), parseFloat(m2[1]) / 100, parseFloat(m2[2]) / 100);\n\
        }\n\
\n\
       case \"rgb\":\n\
        {\n\
          return rgb(d3_rgb_parseNumber(m2[0]), d3_rgb_parseNumber(m2[1]), d3_rgb_parseNumber(m2[2]));\n\
        }\n\
      }\n\
    }\n\
    if (color = d3_rgb_names.get(format)) return rgb(color.r, color.g, color.b);\n\
    if (format != null && format.charAt(0) === \"#\" && !isNaN(color = parseInt(format.substring(1), 16))) {\n\
      if (format.length === 4) {\n\
        r = (color & 3840) >> 4;\n\
        r = r >> 4 | r;\n\
        g = color & 240;\n\
        g = g >> 4 | g;\n\
        b = color & 15;\n\
        b = b << 4 | b;\n\
      } else if (format.length === 7) {\n\
        r = (color & 16711680) >> 16;\n\
        g = (color & 65280) >> 8;\n\
        b = color & 255;\n\
      }\n\
    }\n\
    return rgb(r, g, b);\n\
  }\n\
  function d3_rgb_hsl(r, g, b) {\n\
    var min = Math.min(r /= 255, g /= 255, b /= 255), max = Math.max(r, g, b), d = max - min, h, s, l = (max + min) / 2;\n\
    if (d) {\n\
      s = l < .5 ? d / (max + min) : d / (2 - max - min);\n\
      if (r == max) h = (g - b) / d + (g < b ? 6 : 0); else if (g == max) h = (b - r) / d + 2; else h = (r - g) / d + 4;\n\
      h *= 60;\n\
    } else {\n\
      h = NaN;\n\
      s = l > 0 && l < 1 ? 0 : h;\n\
    }\n\
    return d3_hsl(h, s, l);\n\
  }\n\
  function d3_rgb_lab(r, g, b) {\n\
    r = d3_rgb_xyz(r);\n\
    g = d3_rgb_xyz(g);\n\
    b = d3_rgb_xyz(b);\n\
    var x = d3_xyz_lab((.4124564 * r + .3575761 * g + .1804375 * b) / d3_lab_X), y = d3_xyz_lab((.2126729 * r + .7151522 * g + .072175 * b) / d3_lab_Y), z = d3_xyz_lab((.0193339 * r + .119192 * g + .9503041 * b) / d3_lab_Z);\n\
    return d3_lab(116 * y - 16, 500 * (x - y), 200 * (y - z));\n\
  }\n\
  function d3_rgb_xyz(r) {\n\
    return (r /= 255) <= .04045 ? r / 12.92 : Math.pow((r + .055) / 1.055, 2.4);\n\
  }\n\
  function d3_rgb_parseNumber(c) {\n\
    var f = parseFloat(c);\n\
    return c.charAt(c.length - 1) === \"%\" ? Math.round(f * 2.55) : f;\n\
  }\n\
  var d3_rgb_names = d3.map({\n\
    aliceblue: 15792383,\n\
    antiquewhite: 16444375,\n\
    aqua: 65535,\n\
    aquamarine: 8388564,\n\
    azure: 15794175,\n\
    beige: 16119260,\n\
    bisque: 16770244,\n\
    black: 0,\n\
    blanchedalmond: 16772045,\n\
    blue: 255,\n\
    blueviolet: 9055202,\n\
    brown: 10824234,\n\
    burlywood: 14596231,\n\
    cadetblue: 6266528,\n\
    chartreuse: 8388352,\n\
    chocolate: 13789470,\n\
    coral: 16744272,\n\
    cornflowerblue: 6591981,\n\
    cornsilk: 16775388,\n\
    crimson: 14423100,\n\
    cyan: 65535,\n\
    darkblue: 139,\n\
    darkcyan: 35723,\n\
    darkgoldenrod: 12092939,\n\
    darkgray: 11119017,\n\
    darkgreen: 25600,\n\
    darkgrey: 11119017,\n\
    darkkhaki: 12433259,\n\
    darkmagenta: 9109643,\n\
    darkolivegreen: 5597999,\n\
    darkorange: 16747520,\n\
    darkorchid: 10040012,\n\
    darkred: 9109504,\n\
    darksalmon: 15308410,\n\
    darkseagreen: 9419919,\n\
    darkslateblue: 4734347,\n\
    darkslategray: 3100495,\n\
    darkslategrey: 3100495,\n\
    darkturquoise: 52945,\n\
    darkviolet: 9699539,\n\
    deeppink: 16716947,\n\
    deepskyblue: 49151,\n\
    dimgray: 6908265,\n\
    dimgrey: 6908265,\n\
    dodgerblue: 2003199,\n\
    firebrick: 11674146,\n\
    floralwhite: 16775920,\n\
    forestgreen: 2263842,\n\
    fuchsia: 16711935,\n\
    gainsboro: 14474460,\n\
    ghostwhite: 16316671,\n\
    gold: 16766720,\n\
    goldenrod: 14329120,\n\
    gray: 8421504,\n\
    green: 32768,\n\
    greenyellow: 11403055,\n\
    grey: 8421504,\n\
    honeydew: 15794160,\n\
    hotpink: 16738740,\n\
    indianred: 13458524,\n\
    indigo: 4915330,\n\
    ivory: 16777200,\n\
    khaki: 15787660,\n\
    lavender: 15132410,\n\
    lavenderblush: 16773365,\n\
    lawngreen: 8190976,\n\
    lemonchiffon: 16775885,\n\
    lightblue: 11393254,\n\
    lightcoral: 15761536,\n\
    lightcyan: 14745599,\n\
    lightgoldenrodyellow: 16448210,\n\
    lightgray: 13882323,\n\
    lightgreen: 9498256,\n\
    lightgrey: 13882323,\n\
    lightpink: 16758465,\n\
    lightsalmon: 16752762,\n\
    lightseagreen: 2142890,\n\
    lightskyblue: 8900346,\n\
    lightslategray: 7833753,\n\
    lightslategrey: 7833753,\n\
    lightsteelblue: 11584734,\n\
    lightyellow: 16777184,\n\
    lime: 65280,\n\
    limegreen: 3329330,\n\
    linen: 16445670,\n\
    magenta: 16711935,\n\
    maroon: 8388608,\n\
    mediumaquamarine: 6737322,\n\
    mediumblue: 205,\n\
    mediumorchid: 12211667,\n\
    mediumpurple: 9662683,\n\
    mediumseagreen: 3978097,\n\
    mediumslateblue: 8087790,\n\
    mediumspringgreen: 64154,\n\
    mediumturquoise: 4772300,\n\
    mediumvioletred: 13047173,\n\
    midnightblue: 1644912,\n\
    mintcream: 16121850,\n\
    mistyrose: 16770273,\n\
    moccasin: 16770229,\n\
    navajowhite: 16768685,\n\
    navy: 128,\n\
    oldlace: 16643558,\n\
    olive: 8421376,\n\
    olivedrab: 7048739,\n\
    orange: 16753920,\n\
    orangered: 16729344,\n\
    orchid: 14315734,\n\
    palegoldenrod: 15657130,\n\
    palegreen: 10025880,\n\
    paleturquoise: 11529966,\n\
    palevioletred: 14381203,\n\
    papayawhip: 16773077,\n\
    peachpuff: 16767673,\n\
    peru: 13468991,\n\
    pink: 16761035,\n\
    plum: 14524637,\n\
    powderblue: 11591910,\n\
    purple: 8388736,\n\
    red: 16711680,\n\
    rosybrown: 12357519,\n\
    royalblue: 4286945,\n\
    saddlebrown: 9127187,\n\
    salmon: 16416882,\n\
    sandybrown: 16032864,\n\
    seagreen: 3050327,\n\
    seashell: 16774638,\n\
    sienna: 10506797,\n\
    silver: 12632256,\n\
    skyblue: 8900331,\n\
    slateblue: 6970061,\n\
    slategray: 7372944,\n\
    slategrey: 7372944,\n\
    snow: 16775930,\n\
    springgreen: 65407,\n\
    steelblue: 4620980,\n\
    tan: 13808780,\n\
    teal: 32896,\n\
    thistle: 14204888,\n\
    tomato: 16737095,\n\
    turquoise: 4251856,\n\
    violet: 15631086,\n\
    wheat: 16113331,\n\
    white: 16777215,\n\
    whitesmoke: 16119285,\n\
    yellow: 16776960,\n\
    yellowgreen: 10145074\n\
  });\n\
  d3_rgb_names.forEach(function(key, value) {\n\
    d3_rgb_names.set(key, d3_rgbNumber(value));\n\
  });\n\
  function d3_functor(v) {\n\
    return typeof v === \"function\" ? v : function() {\n\
      return v;\n\
    };\n\
  }\n\
  d3.functor = d3_functor;\n\
  function d3_identity(d) {\n\
    return d;\n\
  }\n\
  d3.xhr = d3_xhrType(d3_identity);\n\
  function d3_xhrType(response) {\n\
    return function(url, mimeType, callback) {\n\
      if (arguments.length === 2 && typeof mimeType === \"function\") callback = mimeType, \n\
      mimeType = null;\n\
      return d3_xhr(url, mimeType, response, callback);\n\
    };\n\
  }\n\
  function d3_xhr(url, mimeType, response, callback) {\n\
    var xhr = {}, dispatch = d3.dispatch(\"beforesend\", \"progress\", \"load\", \"error\"), headers = {}, request = new XMLHttpRequest(), responseType = null;\n\
    if (d3_window.XDomainRequest && !(\"withCredentials\" in request) && /^(http(s)?:)?\\/\\//.test(url)) request = new XDomainRequest();\n\
    \"onload\" in request ? request.onload = request.onerror = respond : request.onreadystatechange = function() {\n\
      request.readyState > 3 && respond();\n\
    };\n\
    function respond() {\n\
      var status = request.status, result;\n\
      if (!status && request.responseText || status >= 200 && status < 300 || status === 304) {\n\
        try {\n\
          result = response.call(xhr, request);\n\
        } catch (e) {\n\
          dispatch.error.call(xhr, e);\n\
          return;\n\
        }\n\
        dispatch.load.call(xhr, result);\n\
      } else {\n\
        dispatch.error.call(xhr, request);\n\
      }\n\
    }\n\
    request.onprogress = function(event) {\n\
      var o = d3.event;\n\
      d3.event = event;\n\
      try {\n\
        dispatch.progress.call(xhr, request);\n\
      } finally {\n\
        d3.event = o;\n\
      }\n\
    };\n\
    xhr.header = function(name, value) {\n\
      name = (name + \"\").toLowerCase();\n\
      if (arguments.length < 2) return headers[name];\n\
      if (value == null) delete headers[name]; else headers[name] = value + \"\";\n\
      return xhr;\n\
    };\n\
    xhr.mimeType = function(value) {\n\
      if (!arguments.length) return mimeType;\n\
      mimeType = value == null ? null : value + \"\";\n\
      return xhr;\n\
    };\n\
    xhr.responseType = function(value) {\n\
      if (!arguments.length) return responseType;\n\
      responseType = value;\n\
      return xhr;\n\
    };\n\
    xhr.response = function(value) {\n\
      response = value;\n\
      return xhr;\n\
    };\n\
    [ \"get\", \"post\" ].forEach(function(method) {\n\
      xhr[method] = function() {\n\
        return xhr.send.apply(xhr, [ method ].concat(d3_array(arguments)));\n\
      };\n\
    });\n\
    xhr.send = function(method, data, callback) {\n\
      if (arguments.length === 2 && typeof data === \"function\") callback = data, data = null;\n\
      request.open(method, url, true);\n\
      if (mimeType != null && !(\"accept\" in headers)) headers[\"accept\"] = mimeType + \",*/*\";\n\
      if (request.setRequestHeader) for (var name in headers) request.setRequestHeader(name, headers[name]);\n\
      if (mimeType != null && request.overrideMimeType) request.overrideMimeType(mimeType);\n\
      if (responseType != null) request.responseType = responseType;\n\
      if (callback != null) xhr.on(\"error\", callback).on(\"load\", function(request) {\n\
        callback(null, request);\n\
      });\n\
      dispatch.beforesend.call(xhr, request);\n\
      request.send(data == null ? null : data);\n\
      return xhr;\n\
    };\n\
    xhr.abort = function() {\n\
      request.abort();\n\
      return xhr;\n\
    };\n\
    d3.rebind(xhr, dispatch, \"on\");\n\
    return callback == null ? xhr : xhr.get(d3_xhr_fixCallback(callback));\n\
  }\n\
  function d3_xhr_fixCallback(callback) {\n\
    return callback.length === 1 ? function(error, request) {\n\
      callback(error == null ? request : null);\n\
    } : callback;\n\
  }\n\
  d3.dsv = function(delimiter, mimeType) {\n\
    var reFormat = new RegExp('[\"' + delimiter + \"\\n\
]\"), delimiterCode = delimiter.charCodeAt(0);\n\
    function dsv(url, row, callback) {\n\
      if (arguments.length < 3) callback = row, row = null;\n\
      var xhr = d3_xhr(url, mimeType, row == null ? response : typedResponse(row), callback);\n\
      xhr.row = function(_) {\n\
        return arguments.length ? xhr.response((row = _) == null ? response : typedResponse(_)) : row;\n\
      };\n\
      return xhr;\n\
    }\n\
    function response(request) {\n\
      return dsv.parse(request.responseText);\n\
    }\n\
    function typedResponse(f) {\n\
      return function(request) {\n\
        return dsv.parse(request.responseText, f);\n\
      };\n\
    }\n\
    dsv.parse = function(text, f) {\n\
      var o;\n\
      return dsv.parseRows(text, function(row, i) {\n\
        if (o) return o(row, i - 1);\n\
        var a = new Function(\"d\", \"return {\" + row.map(function(name, i) {\n\
          return JSON.stringify(name) + \": d[\" + i + \"]\";\n\
        }).join(\",\") + \"}\");\n\
        o = f ? function(row, i) {\n\
          return f(a(row), i);\n\
        } : a;\n\
      });\n\
    };\n\
    dsv.parseRows = function(text, f) {\n\
      var EOL = {}, EOF = {}, rows = [], N = text.length, I = 0, n = 0, t, eol;\n\
      function token() {\n\
        if (I >= N) return EOF;\n\
        if (eol) return eol = false, EOL;\n\
        var j = I;\n\
        if (text.charCodeAt(j) === 34) {\n\
          var i = j;\n\
          while (i++ < N) {\n\
            if (text.charCodeAt(i) === 34) {\n\
              if (text.charCodeAt(i + 1) !== 34) break;\n\
              ++i;\n\
            }\n\
          }\n\
          I = i + 2;\n\
          var c = text.charCodeAt(i + 1);\n\
          if (c === 13) {\n\
            eol = true;\n\
            if (text.charCodeAt(i + 2) === 10) ++I;\n\
          } else if (c === 10) {\n\
            eol = true;\n\
          }\n\
          return text.substring(j + 1, i).replace(/\"\"/g, '\"');\n\
        }\n\
        while (I < N) {\n\
          var c = text.charCodeAt(I++), k = 1;\n\
          if (c === 10) eol = true; else if (c === 13) {\n\
            eol = true;\n\
            if (text.charCodeAt(I) === 10) ++I, ++k;\n\
          } else if (c !== delimiterCode) continue;\n\
          return text.substring(j, I - k);\n\
        }\n\
        return text.substring(j);\n\
      }\n\
      while ((t = token()) !== EOF) {\n\
        var a = [];\n\
        while (t !== EOL && t !== EOF) {\n\
          a.push(t);\n\
          t = token();\n\
        }\n\
        if (f && !(a = f(a, n++))) continue;\n\
        rows.push(a);\n\
      }\n\
      return rows;\n\
    };\n\
    dsv.format = function(rows) {\n\
      if (Array.isArray(rows[0])) return dsv.formatRows(rows);\n\
      var fieldSet = new d3_Set(), fields = [];\n\
      rows.forEach(function(row) {\n\
        for (var field in row) {\n\
          if (!fieldSet.has(field)) {\n\
            fields.push(fieldSet.add(field));\n\
          }\n\
        }\n\
      });\n\
      return [ fields.map(formatValue).join(delimiter) ].concat(rows.map(function(row) {\n\
        return fields.map(function(field) {\n\
          return formatValue(row[field]);\n\
        }).join(delimiter);\n\
      })).join(\"\\n\
\");\n\
    };\n\
    dsv.formatRows = function(rows) {\n\
      return rows.map(formatRow).join(\"\\n\
\");\n\
    };\n\
    function formatRow(row) {\n\
      return row.map(formatValue).join(delimiter);\n\
    }\n\
    function formatValue(text) {\n\
      return reFormat.test(text) ? '\"' + text.replace(/\\\"/g, '\"\"') + '\"' : text;\n\
    }\n\
    return dsv;\n\
  };\n\
  d3.csv = d3.dsv(\",\", \"text/csv\");\n\
  d3.tsv = d3.dsv(\"\t\", \"text/tab-separated-values\");\n\
  d3.touch = function(container, touches, identifier) {\n\
    if (arguments.length < 3) identifier = touches, touches = d3_eventSource().changedTouches;\n\
    if (touches) for (var i = 0, n = touches.length, touch; i < n; ++i) {\n\
      if ((touch = touches[i]).identifier === identifier) {\n\
        return d3_mousePoint(container, touch);\n\
      }\n\
    }\n\
  };\n\
  var d3_timer_queueHead, d3_timer_queueTail, d3_timer_interval, d3_timer_timeout, d3_timer_active, d3_timer_frame = d3_window[d3_vendorSymbol(d3_window, \"requestAnimationFrame\")] || function(callback) {\n\
    setTimeout(callback, 17);\n\
  };\n\
  d3.timer = function(callback, delay, then) {\n\
    var n = arguments.length;\n\
    if (n < 2) delay = 0;\n\
    if (n < 3) then = Date.now();\n\
    var time = then + delay, timer = {\n\
      c: callback,\n\
      t: time,\n\
      f: false,\n\
      n: null\n\
    };\n\
    if (d3_timer_queueTail) d3_timer_queueTail.n = timer; else d3_timer_queueHead = timer;\n\
    d3_timer_queueTail = timer;\n\
    if (!d3_timer_interval) {\n\
      d3_timer_timeout = clearTimeout(d3_timer_timeout);\n\
      d3_timer_interval = 1;\n\
      d3_timer_frame(d3_timer_step);\n\
    }\n\
  };\n\
  function d3_timer_step() {\n\
    var now = d3_timer_mark(), delay = d3_timer_sweep() - now;\n\
    if (delay > 24) {\n\
      if (isFinite(delay)) {\n\
        clearTimeout(d3_timer_timeout);\n\
        d3_timer_timeout = setTimeout(d3_timer_step, delay);\n\
      }\n\
      d3_timer_interval = 0;\n\
    } else {\n\
      d3_timer_interval = 1;\n\
      d3_timer_frame(d3_timer_step);\n\
    }\n\
  }\n\
  d3.timer.flush = function() {\n\
    d3_timer_mark();\n\
    d3_timer_sweep();\n\
  };\n\
  function d3_timer_mark() {\n\
    var now = Date.now();\n\
    d3_timer_active = d3_timer_queueHead;\n\
    while (d3_timer_active) {\n\
      if (now >= d3_timer_active.t) d3_timer_active.f = d3_timer_active.c(now - d3_timer_active.t);\n\
      d3_timer_active = d3_timer_active.n;\n\
    }\n\
    return now;\n\
  }\n\
  function d3_timer_sweep() {\n\
    var t0, t1 = d3_timer_queueHead, time = Infinity;\n\
    while (t1) {\n\
      if (t1.f) {\n\
        t1 = t0 ? t0.n = t1.n : d3_timer_queueHead = t1.n;\n\
      } else {\n\
        if (t1.t < time) time = t1.t;\n\
        t1 = (t0 = t1).n;\n\
      }\n\
    }\n\
    d3_timer_queueTail = t0;\n\
    return time;\n\
  }\n\
  function d3_format_precision(x, p) {\n\
    return p - (x ? Math.ceil(Math.log(x) / Math.LN10) : 1);\n\
  }\n\
  d3.round = function(x, n) {\n\
    return n ? Math.round(x * (n = Math.pow(10, n))) / n : Math.round(x);\n\
  };\n\
  var d3_formatPrefixes = [ \"y\", \"z\", \"a\", \"f\", \"p\", \"n\", \"µ\", \"m\", \"\", \"k\", \"M\", \"G\", \"T\", \"P\", \"E\", \"Z\", \"Y\" ].map(d3_formatPrefix);\n\
  d3.formatPrefix = function(value, precision) {\n\
    var i = 0;\n\
    if (value) {\n\
      if (value < 0) value *= -1;\n\
      if (precision) value = d3.round(value, d3_format_precision(value, precision));\n\
      i = 1 + Math.floor(1e-12 + Math.log(value) / Math.LN10);\n\
      i = Math.max(-24, Math.min(24, Math.floor((i - 1) / 3) * 3));\n\
    }\n\
    return d3_formatPrefixes[8 + i / 3];\n\
  };\n\
  function d3_formatPrefix(d, i) {\n\
    var k = Math.pow(10, abs(8 - i) * 3);\n\
    return {\n\
      scale: i > 8 ? function(d) {\n\
        return d / k;\n\
      } : function(d) {\n\
        return d * k;\n\
      },\n\
      symbol: d\n\
    };\n\
  }\n\
  function d3_locale_numberFormat(locale) {\n\
    var locale_decimal = locale.decimal, locale_thousands = locale.thousands, locale_grouping = locale.grouping, locale_currency = locale.currency, formatGroup = locale_grouping ? function(value) {\n\
      var i = value.length, t = [], j = 0, g = locale_grouping[0];\n\
      while (i > 0 && g > 0) {\n\
        t.push(value.substring(i -= g, i + g));\n\
        g = locale_grouping[j = (j + 1) % locale_grouping.length];\n\
      }\n\
      return t.reverse().join(locale_thousands);\n\
    } : d3_identity;\n\
    return function(specifier) {\n\
      var match = d3_format_re.exec(specifier), fill = match[1] || \" \", align = match[2] || \">\", sign = match[3] || \"\", symbol = match[4] || \"\", zfill = match[5], width = +match[6], comma = match[7], precision = match[8], type = match[9], scale = 1, prefix = \"\", suffix = \"\", integer = false;\n\
      if (precision) precision = +precision.substring(1);\n\
      if (zfill || fill === \"0\" && align === \"=\") {\n\
        zfill = fill = \"0\";\n\
        align = \"=\";\n\
        if (comma) width -= Math.floor((width - 1) / 4);\n\
      }\n\
      switch (type) {\n\
       case \"n\":\n\
        comma = true;\n\
        type = \"g\";\n\
        break;\n\
\n\
       case \"%\":\n\
        scale = 100;\n\
        suffix = \"%\";\n\
        type = \"f\";\n\
        break;\n\
\n\
       case \"p\":\n\
        scale = 100;\n\
        suffix = \"%\";\n\
        type = \"r\";\n\
        break;\n\
\n\
       case \"b\":\n\
       case \"o\":\n\
       case \"x\":\n\
       case \"X\":\n\
        if (symbol === \"#\") prefix = \"0\" + type.toLowerCase();\n\
\n\
       case \"c\":\n\
       case \"d\":\n\
        integer = true;\n\
        precision = 0;\n\
        break;\n\
\n\
       case \"s\":\n\
        scale = -1;\n\
        type = \"r\";\n\
        break;\n\
      }\n\
      if (symbol === \"$\") prefix = locale_currency[0], suffix = locale_currency[1];\n\
      if (type == \"r\" && !precision) type = \"g\";\n\
      if (precision != null) {\n\
        if (type == \"g\") precision = Math.max(1, Math.min(21, precision)); else if (type == \"e\" || type == \"f\") precision = Math.max(0, Math.min(20, precision));\n\
      }\n\
      type = d3_format_types.get(type) || d3_format_typeDefault;\n\
      var zcomma = zfill && comma;\n\
      return function(value) {\n\
        var fullSuffix = suffix;\n\
        if (integer && value % 1) return \"\";\n\
        var negative = value < 0 || value === 0 && 1 / value < 0 ? (value = -value, \"-\") : sign;\n\
        if (scale < 0) {\n\
          var unit = d3.formatPrefix(value, precision);\n\
          value = unit.scale(value);\n\
          fullSuffix = unit.symbol + suffix;\n\
        } else {\n\
          value *= scale;\n\
        }\n\
        value = type(value, precision);\n\
        var i = value.lastIndexOf(\".\"), before = i < 0 ? value : value.substring(0, i), after = i < 0 ? \"\" : locale_decimal + value.substring(i + 1);\n\
        if (!zfill && comma) before = formatGroup(before);\n\
        var length = prefix.length + before.length + after.length + (zcomma ? 0 : negative.length), padding = length < width ? new Array(length = width - length + 1).join(fill) : \"\";\n\
        if (zcomma) before = formatGroup(padding + before);\n\
        negative += prefix;\n\
        value = before + after;\n\
        return (align === \"<\" ? negative + value + padding : align === \">\" ? padding + negative + value : align === \"^\" ? padding.substring(0, length >>= 1) + negative + value + padding.substring(length) : negative + (zcomma ? value : padding + value)) + fullSuffix;\n\
      };\n\
    };\n\
  }\n\
  var d3_format_re = /(?:([^{])?([<>=^]))?([+\\- ])?([$#])?(0)?(\\d+)?(,)?(\\.-?\\d+)?([a-z%])?/i;\n\
  var d3_format_types = d3.map({\n\
    b: function(x) {\n\
      return x.toString(2);\n\
    },\n\
    c: function(x) {\n\
      return String.fromCharCode(x);\n\
    },\n\
    o: function(x) {\n\
      return x.toString(8);\n\
    },\n\
    x: function(x) {\n\
      return x.toString(16);\n\
    },\n\
    X: function(x) {\n\
      return x.toString(16).toUpperCase();\n\
    },\n\
    g: function(x, p) {\n\
      return x.toPrecision(p);\n\
    },\n\
    e: function(x, p) {\n\
      return x.toExponential(p);\n\
    },\n\
    f: function(x, p) {\n\
      return x.toFixed(p);\n\
    },\n\
    r: function(x, p) {\n\
      return (x = d3.round(x, d3_format_precision(x, p))).toFixed(Math.max(0, Math.min(20, d3_format_precision(x * (1 + 1e-15), p))));\n\
    }\n\
  });\n\
  function d3_format_typeDefault(x) {\n\
    return x + \"\";\n\
  }\n\
  var d3_time = d3.time = {}, d3_date = Date;\n\
  function d3_date_utc() {\n\
    this._ = new Date(arguments.length > 1 ? Date.UTC.apply(this, arguments) : arguments[0]);\n\
  }\n\
  d3_date_utc.prototype = {\n\
    getDate: function() {\n\
      return this._.getUTCDate();\n\
    },\n\
    getDay: function() {\n\
      return this._.getUTCDay();\n\
    },\n\
    getFullYear: function() {\n\
      return this._.getUTCFullYear();\n\
    },\n\
    getHours: function() {\n\
      return this._.getUTCHours();\n\
    },\n\
    getMilliseconds: function() {\n\
      return this._.getUTCMilliseconds();\n\
    },\n\
    getMinutes: function() {\n\
      return this._.getUTCMinutes();\n\
    },\n\
    getMonth: function() {\n\
      return this._.getUTCMonth();\n\
    },\n\
    getSeconds: function() {\n\
      return this._.getUTCSeconds();\n\
    },\n\
    getTime: function() {\n\
      return this._.getTime();\n\
    },\n\
    getTimezoneOffset: function() {\n\
      return 0;\n\
    },\n\
    valueOf: function() {\n\
      return this._.valueOf();\n\
    },\n\
    setDate: function() {\n\
      d3_time_prototype.setUTCDate.apply(this._, arguments);\n\
    },\n\
    setDay: function() {\n\
      d3_time_prototype.setUTCDay.apply(this._, arguments);\n\
    },\n\
    setFullYear: function() {\n\
      d3_time_prototype.setUTCFullYear.apply(this._, arguments);\n\
    },\n\
    setHours: function() {\n\
      d3_time_prototype.setUTCHours.apply(this._, arguments);\n\
    },\n\
    setMilliseconds: function() {\n\
      d3_time_prototype.setUTCMilliseconds.apply(this._, arguments);\n\
    },\n\
    setMinutes: function() {\n\
      d3_time_prototype.setUTCMinutes.apply(this._, arguments);\n\
    },\n\
    setMonth: function() {\n\
      d3_time_prototype.setUTCMonth.apply(this._, arguments);\n\
    },\n\
    setSeconds: function() {\n\
      d3_time_prototype.setUTCSeconds.apply(this._, arguments);\n\
    },\n\
    setTime: function() {\n\
      d3_time_prototype.setTime.apply(this._, arguments);\n\
    }\n\
  };\n\
  var d3_time_prototype = Date.prototype;\n\
  function d3_time_interval(local, step, number) {\n\
    function round(date) {\n\
      var d0 = local(date), d1 = offset(d0, 1);\n\
      return date - d0 < d1 - date ? d0 : d1;\n\
    }\n\
    function ceil(date) {\n\
      step(date = local(new d3_date(date - 1)), 1);\n\
      return date;\n\
    }\n\
    function offset(date, k) {\n\
      step(date = new d3_date(+date), k);\n\
      return date;\n\
    }\n\
    function range(t0, t1, dt) {\n\
      var time = ceil(t0), times = [];\n\
      if (dt > 1) {\n\
        while (time < t1) {\n\
          if (!(number(time) % dt)) times.push(new Date(+time));\n\
          step(time, 1);\n\
        }\n\
      } else {\n\
        while (time < t1) times.push(new Date(+time)), step(time, 1);\n\
      }\n\
      return times;\n\
    }\n\
    function range_utc(t0, t1, dt) {\n\
      try {\n\
        d3_date = d3_date_utc;\n\
        var utc = new d3_date_utc();\n\
        utc._ = t0;\n\
        return range(utc, t1, dt);\n\
      } finally {\n\
        d3_date = Date;\n\
      }\n\
    }\n\
    local.floor = local;\n\
    local.round = round;\n\
    local.ceil = ceil;\n\
    local.offset = offset;\n\
    local.range = range;\n\
    var utc = local.utc = d3_time_interval_utc(local);\n\
    utc.floor = utc;\n\
    utc.round = d3_time_interval_utc(round);\n\
    utc.ceil = d3_time_interval_utc(ceil);\n\
    utc.offset = d3_time_interval_utc(offset);\n\
    utc.range = range_utc;\n\
    return local;\n\
  }\n\
  function d3_time_interval_utc(method) {\n\
    return function(date, k) {\n\
      try {\n\
        d3_date = d3_date_utc;\n\
        var utc = new d3_date_utc();\n\
        utc._ = date;\n\
        return method(utc, k)._;\n\
      } finally {\n\
        d3_date = Date;\n\
      }\n\
    };\n\
  }\n\
  d3_time.year = d3_time_interval(function(date) {\n\
    date = d3_time.day(date);\n\
    date.setMonth(0, 1);\n\
    return date;\n\
  }, function(date, offset) {\n\
    date.setFullYear(date.getFullYear() + offset);\n\
  }, function(date) {\n\
    return date.getFullYear();\n\
  });\n\
  d3_time.years = d3_time.year.range;\n\
  d3_time.years.utc = d3_time.year.utc.range;\n\
  d3_time.day = d3_time_interval(function(date) {\n\
    var day = new d3_date(2e3, 0);\n\
    day.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());\n\
    return day;\n\
  }, function(date, offset) {\n\
    date.setDate(date.getDate() + offset);\n\
  }, function(date) {\n\
    return date.getDate() - 1;\n\
  });\n\
  d3_time.days = d3_time.day.range;\n\
  d3_time.days.utc = d3_time.day.utc.range;\n\
  d3_time.dayOfYear = function(date) {\n\
    var year = d3_time.year(date);\n\
    return Math.floor((date - year - (date.getTimezoneOffset() - year.getTimezoneOffset()) * 6e4) / 864e5);\n\
  };\n\
  [ \"sunday\", \"monday\", \"tuesday\", \"wednesday\", \"thursday\", \"friday\", \"saturday\" ].forEach(function(day, i) {\n\
    i = 7 - i;\n\
    var interval = d3_time[day] = d3_time_interval(function(date) {\n\
      (date = d3_time.day(date)).setDate(date.getDate() - (date.getDay() + i) % 7);\n\
      return date;\n\
    }, function(date, offset) {\n\
      date.setDate(date.getDate() + Math.floor(offset) * 7);\n\
    }, function(date) {\n\
      var day = d3_time.year(date).getDay();\n\
      return Math.floor((d3_time.dayOfYear(date) + (day + i) % 7) / 7) - (day !== i);\n\
    });\n\
    d3_time[day + \"s\"] = interval.range;\n\
    d3_time[day + \"s\"].utc = interval.utc.range;\n\
    d3_time[day + \"OfYear\"] = function(date) {\n\
      var day = d3_time.year(date).getDay();\n\
      return Math.floor((d3_time.dayOfYear(date) + (day + i) % 7) / 7);\n\
    };\n\
  });\n\
  d3_time.week = d3_time.sunday;\n\
  d3_time.weeks = d3_time.sunday.range;\n\
  d3_time.weeks.utc = d3_time.sunday.utc.range;\n\
  d3_time.weekOfYear = d3_time.sundayOfYear;\n\
  function d3_locale_timeFormat(locale) {\n\
    var locale_dateTime = locale.dateTime, locale_date = locale.date, locale_time = locale.time, locale_periods = locale.periods, locale_days = locale.days, locale_shortDays = locale.shortDays, locale_months = locale.months, locale_shortMonths = locale.shortMonths;\n\
    function d3_time_format(template) {\n\
      var n = template.length;\n\
      function format(date) {\n\
        var string = [], i = -1, j = 0, c, p, f;\n\
        while (++i < n) {\n\
          if (template.charCodeAt(i) === 37) {\n\
            string.push(template.substring(j, i));\n\
            if ((p = d3_time_formatPads[c = template.charAt(++i)]) != null) c = template.charAt(++i);\n\
            if (f = d3_time_formats[c]) c = f(date, p == null ? c === \"e\" ? \" \" : \"0\" : p);\n\
            string.push(c);\n\
            j = i + 1;\n\
          }\n\
        }\n\
        string.push(template.substring(j, i));\n\
        return string.join(\"\");\n\
      }\n\
      format.parse = function(string) {\n\
        var d = {\n\
          y: 1900,\n\
          m: 0,\n\
          d: 1,\n\
          H: 0,\n\
          M: 0,\n\
          S: 0,\n\
          L: 0,\n\
          Z: null\n\
        }, i = d3_time_parse(d, template, string, 0);\n\
        if (i != string.length) return null;\n\
        if (\"p\" in d) d.H = d.H % 12 + d.p * 12;\n\
        var localZ = d.Z != null && d3_date !== d3_date_utc, date = new (localZ ? d3_date_utc : d3_date)();\n\
        if (\"j\" in d) date.setFullYear(d.y, 0, d.j); else if (\"w\" in d && (\"W\" in d || \"U\" in d)) {\n\
          date.setFullYear(d.y, 0, 1);\n\
          date.setFullYear(d.y, 0, \"W\" in d ? (d.w + 6) % 7 + d.W * 7 - (date.getDay() + 5) % 7 : d.w + d.U * 7 - (date.getDay() + 6) % 7);\n\
        } else date.setFullYear(d.y, d.m, d.d);\n\
        date.setHours(d.H + Math.floor(d.Z / 100), d.M + d.Z % 100, d.S, d.L);\n\
        return localZ ? date._ : date;\n\
      };\n\
      format.toString = function() {\n\
        return template;\n\
      };\n\
      return format;\n\
    }\n\
    function d3_time_parse(date, template, string, j) {\n\
      var c, p, t, i = 0, n = template.length, m = string.length;\n\
      while (i < n) {\n\
        if (j >= m) return -1;\n\
        c = template.charCodeAt(i++);\n\
        if (c === 37) {\n\
          t = template.charAt(i++);\n\
          p = d3_time_parsers[t in d3_time_formatPads ? template.charAt(i++) : t];\n\
          if (!p || (j = p(date, string, j)) < 0) return -1;\n\
        } else if (c != string.charCodeAt(j++)) {\n\
          return -1;\n\
        }\n\
      }\n\
      return j;\n\
    }\n\
    d3_time_format.utc = function(template) {\n\
      var local = d3_time_format(template);\n\
      function format(date) {\n\
        try {\n\
          d3_date = d3_date_utc;\n\
          var utc = new d3_date();\n\
          utc._ = date;\n\
          return local(utc);\n\
        } finally {\n\
          d3_date = Date;\n\
        }\n\
      }\n\
      format.parse = function(string) {\n\
        try {\n\
          d3_date = d3_date_utc;\n\
          var date = local.parse(string);\n\
          return date && date._;\n\
        } finally {\n\
          d3_date = Date;\n\
        }\n\
      };\n\
      format.toString = local.toString;\n\
      return format;\n\
    };\n\
    d3_time_format.multi = d3_time_format.utc.multi = d3_time_formatMulti;\n\
    var d3_time_periodLookup = d3.map(), d3_time_dayRe = d3_time_formatRe(locale_days), d3_time_dayLookup = d3_time_formatLookup(locale_days), d3_time_dayAbbrevRe = d3_time_formatRe(locale_shortDays), d3_time_dayAbbrevLookup = d3_time_formatLookup(locale_shortDays), d3_time_monthRe = d3_time_formatRe(locale_months), d3_time_monthLookup = d3_time_formatLookup(locale_months), d3_time_monthAbbrevRe = d3_time_formatRe(locale_shortMonths), d3_time_monthAbbrevLookup = d3_time_formatLookup(locale_shortMonths);\n\
    locale_periods.forEach(function(p, i) {\n\
      d3_time_periodLookup.set(p.toLowerCase(), i);\n\
    });\n\
    var d3_time_formats = {\n\
      a: function(d) {\n\
        return locale_shortDays[d.getDay()];\n\
      },\n\
      A: function(d) {\n\
        return locale_days[d.getDay()];\n\
      },\n\
      b: function(d) {\n\
        return locale_shortMonths[d.getMonth()];\n\
      },\n\
      B: function(d) {\n\
        return locale_months[d.getMonth()];\n\
      },\n\
      c: d3_time_format(locale_dateTime),\n\
      d: function(d, p) {\n\
        return d3_time_formatPad(d.getDate(), p, 2);\n\
      },\n\
      e: function(d, p) {\n\
        return d3_time_formatPad(d.getDate(), p, 2);\n\
      },\n\
      H: function(d, p) {\n\
        return d3_time_formatPad(d.getHours(), p, 2);\n\
      },\n\
      I: function(d, p) {\n\
        return d3_time_formatPad(d.getHours() % 12 || 12, p, 2);\n\
      },\n\
      j: function(d, p) {\n\
        return d3_time_formatPad(1 + d3_time.dayOfYear(d), p, 3);\n\
      },\n\
      L: function(d, p) {\n\
        return d3_time_formatPad(d.getMilliseconds(), p, 3);\n\
      },\n\
      m: function(d, p) {\n\
        return d3_time_formatPad(d.getMonth() + 1, p, 2);\n\
      },\n\
      M: function(d, p) {\n\
        return d3_time_formatPad(d.getMinutes(), p, 2);\n\
      },\n\
      p: function(d) {\n\
        return locale_periods[+(d.getHours() >= 12)];\n\
      },\n\
      S: function(d, p) {\n\
        return d3_time_formatPad(d.getSeconds(), p, 2);\n\
      },\n\
      U: function(d, p) {\n\
        return d3_time_formatPad(d3_time.sundayOfYear(d), p, 2);\n\
      },\n\
      w: function(d) {\n\
        return d.getDay();\n\
      },\n\
      W: function(d, p) {\n\
        return d3_time_formatPad(d3_time.mondayOfYear(d), p, 2);\n\
      },\n\
      x: d3_time_format(locale_date),\n\
      X: d3_time_format(locale_time),\n\
      y: function(d, p) {\n\
        return d3_time_formatPad(d.getFullYear() % 100, p, 2);\n\
      },\n\
      Y: function(d, p) {\n\
        return d3_time_formatPad(d.getFullYear() % 1e4, p, 4);\n\
      },\n\
      Z: d3_time_zone,\n\
      \"%\": function() {\n\
        return \"%\";\n\
      }\n\
    };\n\
    var d3_time_parsers = {\n\
      a: d3_time_parseWeekdayAbbrev,\n\
      A: d3_time_parseWeekday,\n\
      b: d3_time_parseMonthAbbrev,\n\
      B: d3_time_parseMonth,\n\
      c: d3_time_parseLocaleFull,\n\
      d: d3_time_parseDay,\n\
      e: d3_time_parseDay,\n\
      H: d3_time_parseHour24,\n\
      I: d3_time_parseHour24,\n\
      j: d3_time_parseDayOfYear,\n\
      L: d3_time_parseMilliseconds,\n\
      m: d3_time_parseMonthNumber,\n\
      M: d3_time_parseMinutes,\n\
      p: d3_time_parseAmPm,\n\
      S: d3_time_parseSeconds,\n\
      U: d3_time_parseWeekNumberSunday,\n\
      w: d3_time_parseWeekdayNumber,\n\
      W: d3_time_parseWeekNumberMonday,\n\
      x: d3_time_parseLocaleDate,\n\
      X: d3_time_parseLocaleTime,\n\
      y: d3_time_parseYear,\n\
      Y: d3_time_parseFullYear,\n\
      Z: d3_time_parseZone,\n\
      \"%\": d3_time_parseLiteralPercent\n\
    };\n\
    function d3_time_parseWeekdayAbbrev(date, string, i) {\n\
      d3_time_dayAbbrevRe.lastIndex = 0;\n\
      var n = d3_time_dayAbbrevRe.exec(string.substring(i));\n\
      return n ? (date.w = d3_time_dayAbbrevLookup.get(n[0].toLowerCase()), i + n[0].length) : -1;\n\
    }\n\
    function d3_time_parseWeekday(date, string, i) {\n\
      d3_time_dayRe.lastIndex = 0;\n\
      var n = d3_time_dayRe.exec(string.substring(i));\n\
      return n ? (date.w = d3_time_dayLookup.get(n[0].toLowerCase()), i + n[0].length) : -1;\n\
    }\n\
    function d3_time_parseMonthAbbrev(date, string, i) {\n\
      d3_time_monthAbbrevRe.lastIndex = 0;\n\
      var n = d3_time_monthAbbrevRe.exec(string.substring(i));\n\
      return n ? (date.m = d3_time_monthAbbrevLookup.get(n[0].toLowerCase()), i + n[0].length) : -1;\n\
    }\n\
    function d3_time_parseMonth(date, string, i) {\n\
      d3_time_monthRe.lastIndex = 0;\n\
      var n = d3_time_monthRe.exec(string.substring(i));\n\
      return n ? (date.m = d3_time_monthLookup.get(n[0].toLowerCase()), i + n[0].length) : -1;\n\
    }\n\
    function d3_time_parseLocaleFull(date, string, i) {\n\
      return d3_time_parse(date, d3_time_formats.c.toString(), string, i);\n\
    }\n\
    function d3_time_parseLocaleDate(date, string, i) {\n\
      return d3_time_parse(date, d3_time_formats.x.toString(), string, i);\n\
    }\n\
    function d3_time_parseLocaleTime(date, string, i) {\n\
      return d3_time_parse(date, d3_time_formats.X.toString(), string, i);\n\
    }\n\
    function d3_time_parseAmPm(date, string, i) {\n\
      var n = d3_time_periodLookup.get(string.substring(i, i += 2).toLowerCase());\n\
      return n == null ? -1 : (date.p = n, i);\n\
    }\n\
    return d3_time_format;\n\
  }\n\
  var d3_time_formatPads = {\n\
    \"-\": \"\",\n\
    _: \" \",\n\
    \"0\": \"0\"\n\
  }, d3_time_numberRe = /^\\s*\\d+/, d3_time_percentRe = /^%/;\n\
  function d3_time_formatPad(value, fill, width) {\n\
    var sign = value < 0 ? \"-\" : \"\", string = (sign ? -value : value) + \"\", length = string.length;\n\
    return sign + (length < width ? new Array(width - length + 1).join(fill) + string : string);\n\
  }\n\
  function d3_time_formatRe(names) {\n\
    return new RegExp(\"^(?:\" + names.map(d3.requote).join(\"|\") + \")\", \"i\");\n\
  }\n\
  function d3_time_formatLookup(names) {\n\
    var map = new d3_Map(), i = -1, n = names.length;\n\
    while (++i < n) map.set(names[i].toLowerCase(), i);\n\
    return map;\n\
  }\n\
  function d3_time_parseWeekdayNumber(date, string, i) {\n\
    d3_time_numberRe.lastIndex = 0;\n\
    var n = d3_time_numberRe.exec(string.substring(i, i + 1));\n\
    return n ? (date.w = +n[0], i + n[0].length) : -1;\n\
  }\n\
  function d3_time_parseWeekNumberSunday(date, string, i) {\n\
    d3_time_numberRe.lastIndex = 0;\n\
    var n = d3_time_numberRe.exec(string.substring(i));\n\
    return n ? (date.U = +n[0], i + n[0].length) : -1;\n\
  }\n\
  function d3_time_parseWeekNumberMonday(date, string, i) {\n\
    d3_time_numberRe.lastIndex = 0;\n\
    var n = d3_time_numberRe.exec(string.substring(i));\n\
    return n ? (date.W = +n[0], i + n[0].length) : -1;\n\
  }\n\
  function d3_time_parseFullYear(date, string, i) {\n\
    d3_time_numberRe.lastIndex = 0;\n\
    var n = d3_time_numberRe.exec(string.substring(i, i + 4));\n\
    return n ? (date.y = +n[0], i + n[0].length) : -1;\n\
  }\n\
  function d3_time_parseYear(date, string, i) {\n\
    d3_time_numberRe.lastIndex = 0;\n\
    var n = d3_time_numberRe.exec(string.substring(i, i + 2));\n\
    return n ? (date.y = d3_time_expandYear(+n[0]), i + n[0].length) : -1;\n\
  }\n\
  function d3_time_parseZone(date, string, i) {\n\
    return /^[+-]\\d{4}$/.test(string = string.substring(i, i + 5)) ? (date.Z = -string, \n\
    i + 5) : -1;\n\
  }\n\
  function d3_time_expandYear(d) {\n\
    return d + (d > 68 ? 1900 : 2e3);\n\
  }\n\
  function d3_time_parseMonthNumber(date, string, i) {\n\
    d3_time_numberRe.lastIndex = 0;\n\
    var n = d3_time_numberRe.exec(string.substring(i, i + 2));\n\
    return n ? (date.m = n[0] - 1, i + n[0].length) : -1;\n\
  }\n\
  function d3_time_parseDay(date, string, i) {\n\
    d3_time_numberRe.lastIndex = 0;\n\
    var n = d3_time_numberRe.exec(string.substring(i, i + 2));\n\
    return n ? (date.d = +n[0], i + n[0].length) : -1;\n\
  }\n\
  function d3_time_parseDayOfYear(date, string, i) {\n\
    d3_time_numberRe.lastIndex = 0;\n\
    var n = d3_time_numberRe.exec(string.substring(i, i + 3));\n\
    return n ? (date.j = +n[0], i + n[0].length) : -1;\n\
  }\n\
  function d3_time_parseHour24(date, string, i) {\n\
    d3_time_numberRe.lastIndex = 0;\n\
    var n = d3_time_numberRe.exec(string.substring(i, i + 2));\n\
    return n ? (date.H = +n[0], i + n[0].length) : -1;\n\
  }\n\
  function d3_time_parseMinutes(date, string, i) {\n\
    d3_time_numberRe.lastIndex = 0;\n\
    var n = d3_time_numberRe.exec(string.substring(i, i + 2));\n\
    return n ? (date.M = +n[0], i + n[0].length) : -1;\n\
  }\n\
  function d3_time_parseSeconds(date, string, i) {\n\
    d3_time_numberRe.lastIndex = 0;\n\
    var n = d3_time_numberRe.exec(string.substring(i, i + 2));\n\
    return n ? (date.S = +n[0], i + n[0].length) : -1;\n\
  }\n\
  function d3_time_parseMilliseconds(date, string, i) {\n\
    d3_time_numberRe.lastIndex = 0;\n\
    var n = d3_time_numberRe.exec(string.substring(i, i + 3));\n\
    return n ? (date.L = +n[0], i + n[0].length) : -1;\n\
  }\n\
  function d3_time_zone(d) {\n\
    var z = d.getTimezoneOffset(), zs = z > 0 ? \"-\" : \"+\", zh = ~~(abs(z) / 60), zm = abs(z) % 60;\n\
    return zs + d3_time_formatPad(zh, \"0\", 2) + d3_time_formatPad(zm, \"0\", 2);\n\
  }\n\
  function d3_time_parseLiteralPercent(date, string, i) {\n\
    d3_time_percentRe.lastIndex = 0;\n\
    var n = d3_time_percentRe.exec(string.substring(i, i + 1));\n\
    return n ? i + n[0].length : -1;\n\
  }\n\
  function d3_time_formatMulti(formats) {\n\
    var n = formats.length, i = -1;\n\
    while (++i < n) formats[i][0] = this(formats[i][0]);\n\
    return function(date) {\n\
      var i = 0, f = formats[i];\n\
      while (!f[1](date)) f = formats[++i];\n\
      return f[0](date);\n\
    };\n\
  }\n\
  d3.locale = function(locale) {\n\
    return {\n\
      numberFormat: d3_locale_numberFormat(locale),\n\
      timeFormat: d3_locale_timeFormat(locale)\n\
    };\n\
  };\n\
  var d3_locale_enUS = d3.locale({\n\
    decimal: \".\",\n\
    thousands: \",\",\n\
    grouping: [ 3 ],\n\
    currency: [ \"$\", \"\" ],\n\
    dateTime: \"%a %b %e %X %Y\",\n\
    date: \"%m/%d/%Y\",\n\
    time: \"%H:%M:%S\",\n\
    periods: [ \"AM\", \"PM\" ],\n\
    days: [ \"Sunday\", \"Monday\", \"Tuesday\", \"Wednesday\", \"Thursday\", \"Friday\", \"Saturday\" ],\n\
    shortDays: [ \"Sun\", \"Mon\", \"Tue\", \"Wed\", \"Thu\", \"Fri\", \"Sat\" ],\n\
    months: [ \"January\", \"February\", \"March\", \"April\", \"May\", \"June\", \"July\", \"August\", \"September\", \"October\", \"November\", \"December\" ],\n\
    shortMonths: [ \"Jan\", \"Feb\", \"Mar\", \"Apr\", \"May\", \"Jun\", \"Jul\", \"Aug\", \"Sep\", \"Oct\", \"Nov\", \"Dec\" ]\n\
  });\n\
  d3.format = d3_locale_enUS.numberFormat;\n\
  d3.geo = {};\n\
  function d3_adder() {}\n\
  d3_adder.prototype = {\n\
    s: 0,\n\
    t: 0,\n\
    add: function(y) {\n\
      d3_adderSum(y, this.t, d3_adderTemp);\n\
      d3_adderSum(d3_adderTemp.s, this.s, this);\n\
      if (this.s) this.t += d3_adderTemp.t; else this.s = d3_adderTemp.t;\n\
    },\n\
    reset: function() {\n\
      this.s = this.t = 0;\n\
    },\n\
    valueOf: function() {\n\
      return this.s;\n\
    }\n\
  };\n\
  var d3_adderTemp = new d3_adder();\n\
  function d3_adderSum(a, b, o) {\n\
    var x = o.s = a + b, bv = x - a, av = x - bv;\n\
    o.t = a - av + (b - bv);\n\
  }\n\
  d3.geo.stream = function(object, listener) {\n\
    if (object && d3_geo_streamObjectType.hasOwnProperty(object.type)) {\n\
      d3_geo_streamObjectType[object.type](object, listener);\n\
    } else {\n\
      d3_geo_streamGeometry(object, listener);\n\
    }\n\
  };\n\
  function d3_geo_streamGeometry(geometry, listener) {\n\
    if (geometry && d3_geo_streamGeometryType.hasOwnProperty(geometry.type)) {\n\
      d3_geo_streamGeometryType[geometry.type](geometry, listener);\n\
    }\n\
  }\n\
  var d3_geo_streamObjectType = {\n\
    Feature: function(feature, listener) {\n\
      d3_geo_streamGeometry(feature.geometry, listener);\n\
    },\n\
    FeatureCollection: function(object, listener) {\n\
      var features = object.features, i = -1, n = features.length;\n\
      while (++i < n) d3_geo_streamGeometry(features[i].geometry, listener);\n\
    }\n\
  };\n\
  var d3_geo_streamGeometryType = {\n\
    Sphere: function(object, listener) {\n\
      listener.sphere();\n\
    },\n\
    Point: function(object, listener) {\n\
      object = object.coordinates;\n\
      listener.point(object[0], object[1], object[2]);\n\
    },\n\
    MultiPoint: function(object, listener) {\n\
      var coordinates = object.coordinates, i = -1, n = coordinates.length;\n\
      while (++i < n) object = coordinates[i], listener.point(object[0], object[1], object[2]);\n\
    },\n\
    LineString: function(object, listener) {\n\
      d3_geo_streamLine(object.coordinates, listener, 0);\n\
    },\n\
    MultiLineString: function(object, listener) {\n\
      var coordinates = object.coordinates, i = -1, n = coordinates.length;\n\
      while (++i < n) d3_geo_streamLine(coordinates[i], listener, 0);\n\
    },\n\
    Polygon: function(object, listener) {\n\
      d3_geo_streamPolygon(object.coordinates, listener);\n\
    },\n\
    MultiPolygon: function(object, listener) {\n\
      var coordinates = object.coordinates, i = -1, n = coordinates.length;\n\
      while (++i < n) d3_geo_streamPolygon(coordinates[i], listener);\n\
    },\n\
    GeometryCollection: function(object, listener) {\n\
      var geometries = object.geometries, i = -1, n = geometries.length;\n\
      while (++i < n) d3_geo_streamGeometry(geometries[i], listener);\n\
    }\n\
  };\n\
  function d3_geo_streamLine(coordinates, listener, closed) {\n\
    var i = -1, n = coordinates.length - closed, coordinate;\n\
    listener.lineStart();\n\
    while (++i < n) coordinate = coordinates[i], listener.point(coordinate[0], coordinate[1], coordinate[2]);\n\
    listener.lineEnd();\n\
  }\n\
  function d3_geo_streamPolygon(coordinates, listener) {\n\
    var i = -1, n = coordinates.length;\n\
    listener.polygonStart();\n\
    while (++i < n) d3_geo_streamLine(coordinates[i], listener, 1);\n\
    listener.polygonEnd();\n\
  }\n\
  d3.geo.area = function(object) {\n\
    d3_geo_areaSum = 0;\n\
    d3.geo.stream(object, d3_geo_area);\n\
    return d3_geo_areaSum;\n\
  };\n\
  var d3_geo_areaSum, d3_geo_areaRingSum = new d3_adder();\n\
  var d3_geo_area = {\n\
    sphere: function() {\n\
      d3_geo_areaSum += 4 * π;\n\
    },\n\
    point: d3_noop,\n\
    lineStart: d3_noop,\n\
    lineEnd: d3_noop,\n\
    polygonStart: function() {\n\
      d3_geo_areaRingSum.reset();\n\
      d3_geo_area.lineStart = d3_geo_areaRingStart;\n\
    },\n\
    polygonEnd: function() {\n\
      var area = 2 * d3_geo_areaRingSum;\n\
      d3_geo_areaSum += area < 0 ? 4 * π + area : area;\n\
      d3_geo_area.lineStart = d3_geo_area.lineEnd = d3_geo_area.point = d3_noop;\n\
    }\n\
  };\n\
  function d3_geo_areaRingStart() {\n\
    var λ00, φ00, λ0, cosφ0, sinφ0;\n\
    d3_geo_area.point = function(λ, φ) {\n\
      d3_geo_area.point = nextPoint;\n\
      λ0 = (λ00 = λ) * d3_radians, cosφ0 = Math.cos(φ = (φ00 = φ) * d3_radians / 2 + π / 4), \n\
      sinφ0 = Math.sin(φ);\n\
    };\n\
    function nextPoint(λ, φ) {\n\
      λ *= d3_radians;\n\
      φ = φ * d3_radians / 2 + π / 4;\n\
      var dλ = λ - λ0, sdλ = dλ >= 0 ? 1 : -1, adλ = sdλ * dλ, cosφ = Math.cos(φ), sinφ = Math.sin(φ), k = sinφ0 * sinφ, u = cosφ0 * cosφ + k * Math.cos(adλ), v = k * sdλ * Math.sin(adλ);\n\
      d3_geo_areaRingSum.add(Math.atan2(v, u));\n\
      λ0 = λ, cosφ0 = cosφ, sinφ0 = sinφ;\n\
    }\n\
    d3_geo_area.lineEnd = function() {\n\
      nextPoint(λ00, φ00);\n\
    };\n\
  }\n\
  function d3_geo_cartesian(spherical) {\n\
    var λ = spherical[0], φ = spherical[1], cosφ = Math.cos(φ);\n\
    return [ cosφ * Math.cos(λ), cosφ * Math.sin(λ), Math.sin(φ) ];\n\
  }\n\
  function d3_geo_cartesianDot(a, b) {\n\
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];\n\
  }\n\
  function d3_geo_cartesianCross(a, b) {\n\
    return [ a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0] ];\n\
  }\n\
  function d3_geo_cartesianAdd(a, b) {\n\
    a[0] += b[0];\n\
    a[1] += b[1];\n\
    a[2] += b[2];\n\
  }\n\
  function d3_geo_cartesianScale(vector, k) {\n\
    return [ vector[0] * k, vector[1] * k, vector[2] * k ];\n\
  }\n\
  function d3_geo_cartesianNormalize(d) {\n\
    var l = Math.sqrt(d[0] * d[0] + d[1] * d[1] + d[2] * d[2]);\n\
    d[0] /= l;\n\
    d[1] /= l;\n\
    d[2] /= l;\n\
  }\n\
  function d3_geo_spherical(cartesian) {\n\
    return [ Math.atan2(cartesian[1], cartesian[0]), d3_asin(cartesian[2]) ];\n\
  }\n\
  function d3_geo_sphericalEqual(a, b) {\n\
    return abs(a[0] - b[0]) < ε && abs(a[1] - b[1]) < ε;\n\
  }\n\
  d3.geo.bounds = function() {\n\
    var λ0, φ0, λ1, φ1, λ_, λ__, φ__, p0, dλSum, ranges, range;\n\
    var bound = {\n\
      point: point,\n\
      lineStart: lineStart,\n\
      lineEnd: lineEnd,\n\
      polygonStart: function() {\n\
        bound.point = ringPoint;\n\
        bound.lineStart = ringStart;\n\
        bound.lineEnd = ringEnd;\n\
        dλSum = 0;\n\
        d3_geo_area.polygonStart();\n\
      },\n\
      polygonEnd: function() {\n\
        d3_geo_area.polygonEnd();\n\
        bound.point = point;\n\
        bound.lineStart = lineStart;\n\
        bound.lineEnd = lineEnd;\n\
        if (d3_geo_areaRingSum < 0) λ0 = -(λ1 = 180), φ0 = -(φ1 = 90); else if (dλSum > ε) φ1 = 90; else if (dλSum < -ε) φ0 = -90;\n\
        range[0] = λ0, range[1] = λ1;\n\
      }\n\
    };\n\
    function point(λ, φ) {\n\
      ranges.push(range = [ λ0 = λ, λ1 = λ ]);\n\
      if (φ < φ0) φ0 = φ;\n\
      if (φ > φ1) φ1 = φ;\n\
    }\n\
    function linePoint(λ, φ) {\n\
      var p = d3_geo_cartesian([ λ * d3_radians, φ * d3_radians ]);\n\
      if (p0) {\n\
        var normal = d3_geo_cartesianCross(p0, p), equatorial = [ normal[1], -normal[0], 0 ], inflection = d3_geo_cartesianCross(equatorial, normal);\n\
        d3_geo_cartesianNormalize(inflection);\n\
        inflection = d3_geo_spherical(inflection);\n\
        var dλ = λ - λ_, s = dλ > 0 ? 1 : -1, λi = inflection[0] * d3_degrees * s, antimeridian = abs(dλ) > 180;\n\
        if (antimeridian ^ (s * λ_ < λi && λi < s * λ)) {\n\
          var φi = inflection[1] * d3_degrees;\n\
          if (φi > φ1) φ1 = φi;\n\
        } else if (λi = (λi + 360) % 360 - 180, antimeridian ^ (s * λ_ < λi && λi < s * λ)) {\n\
          var φi = -inflection[1] * d3_degrees;\n\
          if (φi < φ0) φ0 = φi;\n\
        } else {\n\
          if (φ < φ0) φ0 = φ;\n\
          if (φ > φ1) φ1 = φ;\n\
        }\n\
        if (antimeridian) {\n\
          if (λ < λ_) {\n\
            if (angle(λ0, λ) > angle(λ0, λ1)) λ1 = λ;\n\
          } else {\n\
            if (angle(λ, λ1) > angle(λ0, λ1)) λ0 = λ;\n\
          }\n\
        } else {\n\
          if (λ1 >= λ0) {\n\
            if (λ < λ0) λ0 = λ;\n\
            if (λ > λ1) λ1 = λ;\n\
          } else {\n\
            if (λ > λ_) {\n\
              if (angle(λ0, λ) > angle(λ0, λ1)) λ1 = λ;\n\
            } else {\n\
              if (angle(λ, λ1) > angle(λ0, λ1)) λ0 = λ;\n\
            }\n\
          }\n\
        }\n\
      } else {\n\
        point(λ, φ);\n\
      }\n\
      p0 = p, λ_ = λ;\n\
    }\n\
    function lineStart() {\n\
      bound.point = linePoint;\n\
    }\n\
    function lineEnd() {\n\
      range[0] = λ0, range[1] = λ1;\n\
      bound.point = point;\n\
      p0 = null;\n\
    }\n\
    function ringPoint(λ, φ) {\n\
      if (p0) {\n\
        var dλ = λ - λ_;\n\
        dλSum += abs(dλ) > 180 ? dλ + (dλ > 0 ? 360 : -360) : dλ;\n\
      } else λ__ = λ, φ__ = φ;\n\
      d3_geo_area.point(λ, φ);\n\
      linePoint(λ, φ);\n\
    }\n\
    function ringStart() {\n\
      d3_geo_area.lineStart();\n\
    }\n\
    function ringEnd() {\n\
      ringPoint(λ__, φ__);\n\
      d3_geo_area.lineEnd();\n\
      if (abs(dλSum) > ε) λ0 = -(λ1 = 180);\n\
      range[0] = λ0, range[1] = λ1;\n\
      p0 = null;\n\
    }\n\
    function angle(λ0, λ1) {\n\
      return (λ1 -= λ0) < 0 ? λ1 + 360 : λ1;\n\
    }\n\
    function compareRanges(a, b) {\n\
      return a[0] - b[0];\n\
    }\n\
    function withinRange(x, range) {\n\
      return range[0] <= range[1] ? range[0] <= x && x <= range[1] : x < range[0] || range[1] < x;\n\
    }\n\
    return function(feature) {\n\
      φ1 = λ1 = -(λ0 = φ0 = Infinity);\n\
      ranges = [];\n\
      d3.geo.stream(feature, bound);\n\
      var n = ranges.length;\n\
      if (n) {\n\
        ranges.sort(compareRanges);\n\
        for (var i = 1, a = ranges[0], b, merged = [ a ]; i < n; ++i) {\n\
          b = ranges[i];\n\
          if (withinRange(b[0], a) || withinRange(b[1], a)) {\n\
            if (angle(a[0], b[1]) > angle(a[0], a[1])) a[1] = b[1];\n\
            if (angle(b[0], a[1]) > angle(a[0], a[1])) a[0] = b[0];\n\
          } else {\n\
            merged.push(a = b);\n\
          }\n\
        }\n\
        var best = -Infinity, dλ;\n\
        for (var n = merged.length - 1, i = 0, a = merged[n], b; i <= n; a = b, ++i) {\n\
          b = merged[i];\n\
          if ((dλ = angle(a[1], b[0])) > best) best = dλ, λ0 = b[0], λ1 = a[1];\n\
        }\n\
      }\n\
      ranges = range = null;\n\
      return λ0 === Infinity || φ0 === Infinity ? [ [ NaN, NaN ], [ NaN, NaN ] ] : [ [ λ0, φ0 ], [ λ1, φ1 ] ];\n\
    };\n\
  }();\n\
  d3.geo.centroid = function(object) {\n\
    d3_geo_centroidW0 = d3_geo_centroidW1 = d3_geo_centroidX0 = d3_geo_centroidY0 = d3_geo_centroidZ0 = d3_geo_centroidX1 = d3_geo_centroidY1 = d3_geo_centroidZ1 = d3_geo_centroidX2 = d3_geo_centroidY2 = d3_geo_centroidZ2 = 0;\n\
    d3.geo.stream(object, d3_geo_centroid);\n\
    var x = d3_geo_centroidX2, y = d3_geo_centroidY2, z = d3_geo_centroidZ2, m = x * x + y * y + z * z;\n\
    if (m < ε2) {\n\
      x = d3_geo_centroidX1, y = d3_geo_centroidY1, z = d3_geo_centroidZ1;\n\
      if (d3_geo_centroidW1 < ε) x = d3_geo_centroidX0, y = d3_geo_centroidY0, z = d3_geo_centroidZ0;\n\
      m = x * x + y * y + z * z;\n\
      if (m < ε2) return [ NaN, NaN ];\n\
    }\n\
    return [ Math.atan2(y, x) * d3_degrees, d3_asin(z / Math.sqrt(m)) * d3_degrees ];\n\
  };\n\
  var d3_geo_centroidW0, d3_geo_centroidW1, d3_geo_centroidX0, d3_geo_centroidY0, d3_geo_centroidZ0, d3_geo_centroidX1, d3_geo_centroidY1, d3_geo_centroidZ1, d3_geo_centroidX2, d3_geo_centroidY2, d3_geo_centroidZ2;\n\
  var d3_geo_centroid = {\n\
    sphere: d3_noop,\n\
    point: d3_geo_centroidPoint,\n\
    lineStart: d3_geo_centroidLineStart,\n\
    lineEnd: d3_geo_centroidLineEnd,\n\
    polygonStart: function() {\n\
      d3_geo_centroid.lineStart = d3_geo_centroidRingStart;\n\
    },\n\
    polygonEnd: function() {\n\
      d3_geo_centroid.lineStart = d3_geo_centroidLineStart;\n\
    }\n\
  };\n\
  function d3_geo_centroidPoint(λ, φ) {\n\
    λ *= d3_radians;\n\
    var cosφ = Math.cos(φ *= d3_radians);\n\
    d3_geo_centroidPointXYZ(cosφ * Math.cos(λ), cosφ * Math.sin(λ), Math.sin(φ));\n\
  }\n\
  function d3_geo_centroidPointXYZ(x, y, z) {\n\
    ++d3_geo_centroidW0;\n\
    d3_geo_centroidX0 += (x - d3_geo_centroidX0) / d3_geo_centroidW0;\n\
    d3_geo_centroidY0 += (y - d3_geo_centroidY0) / d3_geo_centroidW0;\n\
    d3_geo_centroidZ0 += (z - d3_geo_centroidZ0) / d3_geo_centroidW0;\n\
  }\n\
  function d3_geo_centroidLineStart() {\n\
    var x0, y0, z0;\n\
    d3_geo_centroid.point = function(λ, φ) {\n\
      λ *= d3_radians;\n\
      var cosφ = Math.cos(φ *= d3_radians);\n\
      x0 = cosφ * Math.cos(λ);\n\
      y0 = cosφ * Math.sin(λ);\n\
      z0 = Math.sin(φ);\n\
      d3_geo_centroid.point = nextPoint;\n\
      d3_geo_centroidPointXYZ(x0, y0, z0);\n\
    };\n\
    function nextPoint(λ, φ) {\n\
      λ *= d3_radians;\n\
      var cosφ = Math.cos(φ *= d3_radians), x = cosφ * Math.cos(λ), y = cosφ * Math.sin(λ), z = Math.sin(φ), w = Math.atan2(Math.sqrt((w = y0 * z - z0 * y) * w + (w = z0 * x - x0 * z) * w + (w = x0 * y - y0 * x) * w), x0 * x + y0 * y + z0 * z);\n\
      d3_geo_centroidW1 += w;\n\
      d3_geo_centroidX1 += w * (x0 + (x0 = x));\n\
      d3_geo_centroidY1 += w * (y0 + (y0 = y));\n\
      d3_geo_centroidZ1 += w * (z0 + (z0 = z));\n\
      d3_geo_centroidPointXYZ(x0, y0, z0);\n\
    }\n\
  }\n\
  function d3_geo_centroidLineEnd() {\n\
    d3_geo_centroid.point = d3_geo_centroidPoint;\n\
  }\n\
  function d3_geo_centroidRingStart() {\n\
    var λ00, φ00, x0, y0, z0;\n\
    d3_geo_centroid.point = function(λ, φ) {\n\
      λ00 = λ, φ00 = φ;\n\
      d3_geo_centroid.point = nextPoint;\n\
      λ *= d3_radians;\n\
      var cosφ = Math.cos(φ *= d3_radians);\n\
      x0 = cosφ * Math.cos(λ);\n\
      y0 = cosφ * Math.sin(λ);\n\
      z0 = Math.sin(φ);\n\
      d3_geo_centroidPointXYZ(x0, y0, z0);\n\
    };\n\
    d3_geo_centroid.lineEnd = function() {\n\
      nextPoint(λ00, φ00);\n\
      d3_geo_centroid.lineEnd = d3_geo_centroidLineEnd;\n\
      d3_geo_centroid.point = d3_geo_centroidPoint;\n\
    };\n\
    function nextPoint(λ, φ) {\n\
      λ *= d3_radians;\n\
      var cosφ = Math.cos(φ *= d3_radians), x = cosφ * Math.cos(λ), y = cosφ * Math.sin(λ), z = Math.sin(φ), cx = y0 * z - z0 * y, cy = z0 * x - x0 * z, cz = x0 * y - y0 * x, m = Math.sqrt(cx * cx + cy * cy + cz * cz), u = x0 * x + y0 * y + z0 * z, v = m && -d3_acos(u) / m, w = Math.atan2(m, u);\n\
      d3_geo_centroidX2 += v * cx;\n\
      d3_geo_centroidY2 += v * cy;\n\
      d3_geo_centroidZ2 += v * cz;\n\
      d3_geo_centroidW1 += w;\n\
      d3_geo_centroidX1 += w * (x0 + (x0 = x));\n\
      d3_geo_centroidY1 += w * (y0 + (y0 = y));\n\
      d3_geo_centroidZ1 += w * (z0 + (z0 = z));\n\
      d3_geo_centroidPointXYZ(x0, y0, z0);\n\
    }\n\
  }\n\
  function d3_true() {\n\
    return true;\n\
  }\n\
  function d3_geo_clipPolygon(segments, compare, clipStartInside, interpolate, listener) {\n\
    var subject = [], clip = [];\n\
    segments.forEach(function(segment) {\n\
      if ((n = segment.length - 1) <= 0) return;\n\
      var n, p0 = segment[0], p1 = segment[n];\n\
      if (d3_geo_sphericalEqual(p0, p1)) {\n\
        listener.lineStart();\n\
        for (var i = 0; i < n; ++i) listener.point((p0 = segment[i])[0], p0[1]);\n\
        listener.lineEnd();\n\
        return;\n\
      }\n\
      var a = new d3_geo_clipPolygonIntersection(p0, segment, null, true), b = new d3_geo_clipPolygonIntersection(p0, null, a, false);\n\
      a.o = b;\n\
      subject.push(a);\n\
      clip.push(b);\n\
      a = new d3_geo_clipPolygonIntersection(p1, segment, null, false);\n\
      b = new d3_geo_clipPolygonIntersection(p1, null, a, true);\n\
      a.o = b;\n\
      subject.push(a);\n\
      clip.push(b);\n\
    });\n\
    clip.sort(compare);\n\
    d3_geo_clipPolygonLinkCircular(subject);\n\
    d3_geo_clipPolygonLinkCircular(clip);\n\
    if (!subject.length) return;\n\
    for (var i = 0, entry = clipStartInside, n = clip.length; i < n; ++i) {\n\
      clip[i].e = entry = !entry;\n\
    }\n\
    var start = subject[0], points, point;\n\
    while (1) {\n\
      var current = start, isSubject = true;\n\
      while (current.v) if ((current = current.n) === start) return;\n\
      points = current.z;\n\
      listener.lineStart();\n\
      do {\n\
        current.v = current.o.v = true;\n\
        if (current.e) {\n\
          if (isSubject) {\n\
            for (var i = 0, n = points.length; i < n; ++i) listener.point((point = points[i])[0], point[1]);\n\
          } else {\n\
            interpolate(current.x, current.n.x, 1, listener);\n\
          }\n\
          current = current.n;\n\
        } else {\n\
          if (isSubject) {\n\
            points = current.p.z;\n\
            for (var i = points.length - 1; i >= 0; --i) listener.point((point = points[i])[0], point[1]);\n\
          } else {\n\
            interpolate(current.x, current.p.x, -1, listener);\n\
          }\n\
          current = current.p;\n\
        }\n\
        current = current.o;\n\
        points = current.z;\n\
        isSubject = !isSubject;\n\
      } while (!current.v);\n\
      listener.lineEnd();\n\
    }\n\
  }\n\
  function d3_geo_clipPolygonLinkCircular(array) {\n\
    if (!(n = array.length)) return;\n\
    var n, i = 0, a = array[0], b;\n\
    while (++i < n) {\n\
      a.n = b = array[i];\n\
      b.p = a;\n\
      a = b;\n\
    }\n\
    a.n = b = array[0];\n\
    b.p = a;\n\
  }\n\
  function d3_geo_clipPolygonIntersection(point, points, other, entry) {\n\
    this.x = point;\n\
    this.z = points;\n\
    this.o = other;\n\
    this.e = entry;\n\
    this.v = false;\n\
    this.n = this.p = null;\n\
  }\n\
  function d3_geo_clip(pointVisible, clipLine, interpolate, clipStart) {\n\
    return function(rotate, listener) {\n\
      var line = clipLine(listener), rotatedClipStart = rotate.invert(clipStart[0], clipStart[1]);\n\
      var clip = {\n\
        point: point,\n\
        lineStart: lineStart,\n\
        lineEnd: lineEnd,\n\
        polygonStart: function() {\n\
          clip.point = pointRing;\n\
          clip.lineStart = ringStart;\n\
          clip.lineEnd = ringEnd;\n\
          segments = [];\n\
          polygon = [];\n\
        },\n\
        polygonEnd: function() {\n\
          clip.point = point;\n\
          clip.lineStart = lineStart;\n\
          clip.lineEnd = lineEnd;\n\
          segments = d3.merge(segments);\n\
          var clipStartInside = d3_geo_pointInPolygon(rotatedClipStart, polygon);\n\
          if (segments.length) {\n\
            if (!polygonStarted) listener.polygonStart(), polygonStarted = true;\n\
            d3_geo_clipPolygon(segments, d3_geo_clipSort, clipStartInside, interpolate, listener);\n\
          } else if (clipStartInside) {\n\
            if (!polygonStarted) listener.polygonStart(), polygonStarted = true;\n\
            listener.lineStart();\n\
            interpolate(null, null, 1, listener);\n\
            listener.lineEnd();\n\
          }\n\
          if (polygonStarted) listener.polygonEnd(), polygonStarted = false;\n\
          segments = polygon = null;\n\
        },\n\
        sphere: function() {\n\
          listener.polygonStart();\n\
          listener.lineStart();\n\
          interpolate(null, null, 1, listener);\n\
          listener.lineEnd();\n\
          listener.polygonEnd();\n\
        }\n\
      };\n\
      function point(λ, φ) {\n\
        var point = rotate(λ, φ);\n\
        if (pointVisible(λ = point[0], φ = point[1])) listener.point(λ, φ);\n\
      }\n\
      function pointLine(λ, φ) {\n\
        var point = rotate(λ, φ);\n\
        line.point(point[0], point[1]);\n\
      }\n\
      function lineStart() {\n\
        clip.point = pointLine;\n\
        line.lineStart();\n\
      }\n\
      function lineEnd() {\n\
        clip.point = point;\n\
        line.lineEnd();\n\
      }\n\
      var segments;\n\
      var buffer = d3_geo_clipBufferListener(), ringListener = clipLine(buffer), polygonStarted = false, polygon, ring;\n\
      function pointRing(λ, φ) {\n\
        ring.push([ λ, φ ]);\n\
        var point = rotate(λ, φ);\n\
        ringListener.point(point[0], point[1]);\n\
      }\n\
      function ringStart() {\n\
        ringListener.lineStart();\n\
        ring = [];\n\
      }\n\
      function ringEnd() {\n\
        pointRing(ring[0][0], ring[0][1]);\n\
        ringListener.lineEnd();\n\
        var clean = ringListener.clean(), ringSegments = buffer.buffer(), segment, n = ringSegments.length;\n\
        ring.pop();\n\
        polygon.push(ring);\n\
        ring = null;\n\
        if (!n) return;\n\
        if (clean & 1) {\n\
          segment = ringSegments[0];\n\
          var n = segment.length - 1, i = -1, point;\n\
          if (n > 0) {\n\
            if (!polygonStarted) listener.polygonStart(), polygonStarted = true;\n\
            listener.lineStart();\n\
            while (++i < n) listener.point((point = segment[i])[0], point[1]);\n\
            listener.lineEnd();\n\
          }\n\
          return;\n\
        }\n\
        if (n > 1 && clean & 2) ringSegments.push(ringSegments.pop().concat(ringSegments.shift()));\n\
        segments.push(ringSegments.filter(d3_geo_clipSegmentLength1));\n\
      }\n\
      return clip;\n\
    };\n\
  }\n\
  function d3_geo_clipSegmentLength1(segment) {\n\
    return segment.length > 1;\n\
  }\n\
  function d3_geo_clipBufferListener() {\n\
    var lines = [], line;\n\
    return {\n\
      lineStart: function() {\n\
        lines.push(line = []);\n\
      },\n\
      point: function(λ, φ) {\n\
        line.push([ λ, φ ]);\n\
      },\n\
      lineEnd: d3_noop,\n\
      buffer: function() {\n\
        var buffer = lines;\n\
        lines = [];\n\
        line = null;\n\
        return buffer;\n\
      },\n\
      rejoin: function() {\n\
        if (lines.length > 1) lines.push(lines.pop().concat(lines.shift()));\n\
      }\n\
    };\n\
  }\n\
  function d3_geo_clipSort(a, b) {\n\
    return ((a = a.x)[0] < 0 ? a[1] - halfπ - ε : halfπ - a[1]) - ((b = b.x)[0] < 0 ? b[1] - halfπ - ε : halfπ - b[1]);\n\
  }\n\
  function d3_geo_pointInPolygon(point, polygon) {\n\
    var meridian = point[0], parallel = point[1], meridianNormal = [ Math.sin(meridian), -Math.cos(meridian), 0 ], polarAngle = 0, winding = 0;\n\
    d3_geo_areaRingSum.reset();\n\
    for (var i = 0, n = polygon.length; i < n; ++i) {\n\
      var ring = polygon[i], m = ring.length;\n\
      if (!m) continue;\n\
      var point0 = ring[0], λ0 = point0[0], φ0 = point0[1] / 2 + π / 4, sinφ0 = Math.sin(φ0), cosφ0 = Math.cos(φ0), j = 1;\n\
      while (true) {\n\
        if (j === m) j = 0;\n\
        point = ring[j];\n\
        var λ = point[0], φ = point[1] / 2 + π / 4, sinφ = Math.sin(φ), cosφ = Math.cos(φ), dλ = λ - λ0, sdλ = dλ >= 0 ? 1 : -1, adλ = sdλ * dλ, antimeridian = adλ > π, k = sinφ0 * sinφ;\n\
        d3_geo_areaRingSum.add(Math.atan2(k * sdλ * Math.sin(adλ), cosφ0 * cosφ + k * Math.cos(adλ)));\n\
        polarAngle += antimeridian ? dλ + sdλ * τ : dλ;\n\
        if (antimeridian ^ λ0 >= meridian ^ λ >= meridian) {\n\
          var arc = d3_geo_cartesianCross(d3_geo_cartesian(point0), d3_geo_cartesian(point));\n\
          d3_geo_cartesianNormalize(arc);\n\
          var intersection = d3_geo_cartesianCross(meridianNormal, arc);\n\
          d3_geo_cartesianNormalize(intersection);\n\
          var φarc = (antimeridian ^ dλ >= 0 ? -1 : 1) * d3_asin(intersection[2]);\n\
          if (parallel > φarc || parallel === φarc && (arc[0] || arc[1])) {\n\
            winding += antimeridian ^ dλ >= 0 ? 1 : -1;\n\
          }\n\
        }\n\
        if (!j++) break;\n\
        λ0 = λ, sinφ0 = sinφ, cosφ0 = cosφ, point0 = point;\n\
      }\n\
    }\n\
    return (polarAngle < -ε || polarAngle < ε && d3_geo_areaRingSum < 0) ^ winding & 1;\n\
  }\n\
  var d3_geo_clipAntimeridian = d3_geo_clip(d3_true, d3_geo_clipAntimeridianLine, d3_geo_clipAntimeridianInterpolate, [ -π, -π / 2 ]);\n\
  function d3_geo_clipAntimeridianLine(listener) {\n\
    var λ0 = NaN, φ0 = NaN, sλ0 = NaN, clean;\n\
    return {\n\
      lineStart: function() {\n\
        listener.lineStart();\n\
        clean = 1;\n\
      },\n\
      point: function(λ1, φ1) {\n\
        var sλ1 = λ1 > 0 ? π : -π, dλ = abs(λ1 - λ0);\n\
        if (abs(dλ - π) < ε) {\n\
          listener.point(λ0, φ0 = (φ0 + φ1) / 2 > 0 ? halfπ : -halfπ);\n\
          listener.point(sλ0, φ0);\n\
          listener.lineEnd();\n\
          listener.lineStart();\n\
          listener.point(sλ1, φ0);\n\
          listener.point(λ1, φ0);\n\
          clean = 0;\n\
        } else if (sλ0 !== sλ1 && dλ >= π) {\n\
          if (abs(λ0 - sλ0) < ε) λ0 -= sλ0 * ε;\n\
          if (abs(λ1 - sλ1) < ε) λ1 -= sλ1 * ε;\n\
          φ0 = d3_geo_clipAntimeridianIntersect(λ0, φ0, λ1, φ1);\n\
          listener.point(sλ0, φ0);\n\
          listener.lineEnd();\n\
          listener.lineStart();\n\
          listener.point(sλ1, φ0);\n\
          clean = 0;\n\
        }\n\
        listener.point(λ0 = λ1, φ0 = φ1);\n\
        sλ0 = sλ1;\n\
      },\n\
      lineEnd: function() {\n\
        listener.lineEnd();\n\
        λ0 = φ0 = NaN;\n\
      },\n\
      clean: function() {\n\
        return 2 - clean;\n\
      }\n\
    };\n\
  }\n\
  function d3_geo_clipAntimeridianIntersect(λ0, φ0, λ1, φ1) {\n\
    var cosφ0, cosφ1, sinλ0_λ1 = Math.sin(λ0 - λ1);\n\
    return abs(sinλ0_λ1) > ε ? Math.atan((Math.sin(φ0) * (cosφ1 = Math.cos(φ1)) * Math.sin(λ1) - Math.sin(φ1) * (cosφ0 = Math.cos(φ0)) * Math.sin(λ0)) / (cosφ0 * cosφ1 * sinλ0_λ1)) : (φ0 + φ1) / 2;\n\
  }\n\
  function d3_geo_clipAntimeridianInterpolate(from, to, direction, listener) {\n\
    var φ;\n\
    if (from == null) {\n\
      φ = direction * halfπ;\n\
      listener.point(-π, φ);\n\
      listener.point(0, φ);\n\
      listener.point(π, φ);\n\
      listener.point(π, 0);\n\
      listener.point(π, -φ);\n\
      listener.point(0, -φ);\n\
      listener.point(-π, -φ);\n\
      listener.point(-π, 0);\n\
      listener.point(-π, φ);\n\
    } else if (abs(from[0] - to[0]) > ε) {\n\
      var s = from[0] < to[0] ? π : -π;\n\
      φ = direction * s / 2;\n\
      listener.point(-s, φ);\n\
      listener.point(0, φ);\n\
      listener.point(s, φ);\n\
    } else {\n\
      listener.point(to[0], to[1]);\n\
    }\n\
  }\n\
  function d3_geo_clipCircle(radius) {\n\
    var cr = Math.cos(radius), smallRadius = cr > 0, notHemisphere = abs(cr) > ε, interpolate = d3_geo_circleInterpolate(radius, 6 * d3_radians);\n\
    return d3_geo_clip(visible, clipLine, interpolate, smallRadius ? [ 0, -radius ] : [ -π, radius - π ]);\n\
    function visible(λ, φ) {\n\
      return Math.cos(λ) * Math.cos(φ) > cr;\n\
    }\n\
    function clipLine(listener) {\n\
      var point0, c0, v0, v00, clean;\n\
      return {\n\
        lineStart: function() {\n\
          v00 = v0 = false;\n\
          clean = 1;\n\
        },\n\
        point: function(λ, φ) {\n\
          var point1 = [ λ, φ ], point2, v = visible(λ, φ), c = smallRadius ? v ? 0 : code(λ, φ) : v ? code(λ + (λ < 0 ? π : -π), φ) : 0;\n\
          if (!point0 && (v00 = v0 = v)) listener.lineStart();\n\
          if (v !== v0) {\n\
            point2 = intersect(point0, point1);\n\
            if (d3_geo_sphericalEqual(point0, point2) || d3_geo_sphericalEqual(point1, point2)) {\n\
              point1[0] += ε;\n\
              point1[1] += ε;\n\
              v = visible(point1[0], point1[1]);\n\
            }\n\
          }\n\
          if (v !== v0) {\n\
            clean = 0;\n\
            if (v) {\n\
              listener.lineStart();\n\
              point2 = intersect(point1, point0);\n\
              listener.point(point2[0], point2[1]);\n\
            } else {\n\
              point2 = intersect(point0, point1);\n\
              listener.point(point2[0], point2[1]);\n\
              listener.lineEnd();\n\
            }\n\
            point0 = point2;\n\
          } else if (notHemisphere && point0 && smallRadius ^ v) {\n\
            var t;\n\
            if (!(c & c0) && (t = intersect(point1, point0, true))) {\n\
              clean = 0;\n\
              if (smallRadius) {\n\
                listener.lineStart();\n\
                listener.point(t[0][0], t[0][1]);\n\
                listener.point(t[1][0], t[1][1]);\n\
                listener.lineEnd();\n\
              } else {\n\
                listener.point(t[1][0], t[1][1]);\n\
                listener.lineEnd();\n\
                listener.lineStart();\n\
                listener.point(t[0][0], t[0][1]);\n\
              }\n\
            }\n\
          }\n\
          if (v && (!point0 || !d3_geo_sphericalEqual(point0, point1))) {\n\
            listener.point(point1[0], point1[1]);\n\
          }\n\
          point0 = point1, v0 = v, c0 = c;\n\
        },\n\
        lineEnd: function() {\n\
          if (v0) listener.lineEnd();\n\
          point0 = null;\n\
        },\n\
        clean: function() {\n\
          return clean | (v00 && v0) << 1;\n\
        }\n\
      };\n\
    }\n\
    function intersect(a, b, two) {\n\
      var pa = d3_geo_cartesian(a), pb = d3_geo_cartesian(b);\n\
      var n1 = [ 1, 0, 0 ], n2 = d3_geo_cartesianCross(pa, pb), n2n2 = d3_geo_cartesianDot(n2, n2), n1n2 = n2[0], determinant = n2n2 - n1n2 * n1n2;\n\
      if (!determinant) return !two && a;\n\
      var c1 = cr * n2n2 / determinant, c2 = -cr * n1n2 / determinant, n1xn2 = d3_geo_cartesianCross(n1, n2), A = d3_geo_cartesianScale(n1, c1), B = d3_geo_cartesianScale(n2, c2);\n\
      d3_geo_cartesianAdd(A, B);\n\
      var u = n1xn2, w = d3_geo_cartesianDot(A, u), uu = d3_geo_cartesianDot(u, u), t2 = w * w - uu * (d3_geo_cartesianDot(A, A) - 1);\n\
      if (t2 < 0) return;\n\
      var t = Math.sqrt(t2), q = d3_geo_cartesianScale(u, (-w - t) / uu);\n\
      d3_geo_cartesianAdd(q, A);\n\
      q = d3_geo_spherical(q);\n\
      if (!two) return q;\n\
      var λ0 = a[0], λ1 = b[0], φ0 = a[1], φ1 = b[1], z;\n\
      if (λ1 < λ0) z = λ0, λ0 = λ1, λ1 = z;\n\
      var δλ = λ1 - λ0, polar = abs(δλ - π) < ε, meridian = polar || δλ < ε;\n\
      if (!polar && φ1 < φ0) z = φ0, φ0 = φ1, φ1 = z;\n\
      if (meridian ? polar ? φ0 + φ1 > 0 ^ q[1] < (abs(q[0] - λ0) < ε ? φ0 : φ1) : φ0 <= q[1] && q[1] <= φ1 : δλ > π ^ (λ0 <= q[0] && q[0] <= λ1)) {\n\
        var q1 = d3_geo_cartesianScale(u, (-w + t) / uu);\n\
        d3_geo_cartesianAdd(q1, A);\n\
        return [ q, d3_geo_spherical(q1) ];\n\
      }\n\
    }\n\
    function code(λ, φ) {\n\
      var r = smallRadius ? radius : π - radius, code = 0;\n\
      if (λ < -r) code |= 1; else if (λ > r) code |= 2;\n\
      if (φ < -r) code |= 4; else if (φ > r) code |= 8;\n\
      return code;\n\
    }\n\
  }\n\
  function d3_geom_clipLine(x0, y0, x1, y1) {\n\
    return function(line) {\n\
      var a = line.a, b = line.b, ax = a.x, ay = a.y, bx = b.x, by = b.y, t0 = 0, t1 = 1, dx = bx - ax, dy = by - ay, r;\n\
      r = x0 - ax;\n\
      if (!dx && r > 0) return;\n\
      r /= dx;\n\
      if (dx < 0) {\n\
        if (r < t0) return;\n\
        if (r < t1) t1 = r;\n\
      } else if (dx > 0) {\n\
        if (r > t1) return;\n\
        if (r > t0) t0 = r;\n\
      }\n\
      r = x1 - ax;\n\
      if (!dx && r < 0) return;\n\
      r /= dx;\n\
      if (dx < 0) {\n\
        if (r > t1) return;\n\
        if (r > t0) t0 = r;\n\
      } else if (dx > 0) {\n\
        if (r < t0) return;\n\
        if (r < t1) t1 = r;\n\
      }\n\
      r = y0 - ay;\n\
      if (!dy && r > 0) return;\n\
      r /= dy;\n\
      if (dy < 0) {\n\
        if (r < t0) return;\n\
        if (r < t1) t1 = r;\n\
      } else if (dy > 0) {\n\
        if (r > t1) return;\n\
        if (r > t0) t0 = r;\n\
      }\n\
      r = y1 - ay;\n\
      if (!dy && r < 0) return;\n\
      r /= dy;\n\
      if (dy < 0) {\n\
        if (r > t1) return;\n\
        if (r > t0) t0 = r;\n\
      } else if (dy > 0) {\n\
        if (r < t0) return;\n\
        if (r < t1) t1 = r;\n\
      }\n\
      if (t0 > 0) line.a = {\n\
        x: ax + t0 * dx,\n\
        y: ay + t0 * dy\n\
      };\n\
      if (t1 < 1) line.b = {\n\
        x: ax + t1 * dx,\n\
        y: ay + t1 * dy\n\
      };\n\
      return line;\n\
    };\n\
  }\n\
  var d3_geo_clipExtentMAX = 1e9;\n\
  d3.geo.clipExtent = function() {\n\
    var x0, y0, x1, y1, stream, clip, clipExtent = {\n\
      stream: function(output) {\n\
        if (stream) stream.valid = false;\n\
        stream = clip(output);\n\
        stream.valid = true;\n\
        return stream;\n\
      },\n\
      extent: function(_) {\n\
        if (!arguments.length) return [ [ x0, y0 ], [ x1, y1 ] ];\n\
        clip = d3_geo_clipExtent(x0 = +_[0][0], y0 = +_[0][1], x1 = +_[1][0], y1 = +_[1][1]);\n\
        if (stream) stream.valid = false, stream = null;\n\
        return clipExtent;\n\
      }\n\
    };\n\
    return clipExtent.extent([ [ 0, 0 ], [ 960, 500 ] ]);\n\
  };\n\
  function d3_geo_clipExtent(x0, y0, x1, y1) {\n\
    return function(listener) {\n\
      var listener_ = listener, bufferListener = d3_geo_clipBufferListener(), clipLine = d3_geom_clipLine(x0, y0, x1, y1), segments, polygon, ring;\n\
      var clip = {\n\
        point: point,\n\
        lineStart: lineStart,\n\
        lineEnd: lineEnd,\n\
        polygonStart: function() {\n\
          listener = bufferListener;\n\
          segments = [];\n\
          polygon = [];\n\
          clean = true;\n\
        },\n\
        polygonEnd: function() {\n\
          listener = listener_;\n\
          segments = d3.merge(segments);\n\
          var clipStartInside = insidePolygon([ x0, y1 ]), inside = clean && clipStartInside, visible = segments.length;\n\
          if (inside || visible) {\n\
            listener.polygonStart();\n\
            if (inside) {\n\
              listener.lineStart();\n\
              interpolate(null, null, 1, listener);\n\
              listener.lineEnd();\n\
            }\n\
            if (visible) {\n\
              d3_geo_clipPolygon(segments, compare, clipStartInside, interpolate, listener);\n\
            }\n\
            listener.polygonEnd();\n\
          }\n\
          segments = polygon = ring = null;\n\
        }\n\
      };\n\
      function insidePolygon(p) {\n\
        var wn = 0, n = polygon.length, y = p[1];\n\
        for (var i = 0; i < n; ++i) {\n\
          for (var j = 1, v = polygon[i], m = v.length, a = v[0], b; j < m; ++j) {\n\
            b = v[j];\n\
            if (a[1] <= y) {\n\
              if (b[1] > y && d3_cross2d(a, b, p) > 0) ++wn;\n\
            } else {\n\
              if (b[1] <= y && d3_cross2d(a, b, p) < 0) --wn;\n\
            }\n\
            a = b;\n\
          }\n\
        }\n\
        return wn !== 0;\n\
      }\n\
      function interpolate(from, to, direction, listener) {\n\
        var a = 0, a1 = 0;\n\
        if (from == null || (a = corner(from, direction)) !== (a1 = corner(to, direction)) || comparePoints(from, to) < 0 ^ direction > 0) {\n\
          do {\n\
            listener.point(a === 0 || a === 3 ? x0 : x1, a > 1 ? y1 : y0);\n\
          } while ((a = (a + direction + 4) % 4) !== a1);\n\
        } else {\n\
          listener.point(to[0], to[1]);\n\
        }\n\
      }\n\
      function pointVisible(x, y) {\n\
        return x0 <= x && x <= x1 && y0 <= y && y <= y1;\n\
      }\n\
      function point(x, y) {\n\
        if (pointVisible(x, y)) listener.point(x, y);\n\
      }\n\
      var x__, y__, v__, x_, y_, v_, first, clean;\n\
      function lineStart() {\n\
        clip.point = linePoint;\n\
        if (polygon) polygon.push(ring = []);\n\
        first = true;\n\
        v_ = false;\n\
        x_ = y_ = NaN;\n\
      }\n\
      function lineEnd() {\n\
        if (segments) {\n\
          linePoint(x__, y__);\n\
          if (v__ && v_) bufferListener.rejoin();\n\
          segments.push(bufferListener.buffer());\n\
        }\n\
        clip.point = point;\n\
        if (v_) listener.lineEnd();\n\
      }\n\
      function linePoint(x, y) {\n\
        x = Math.max(-d3_geo_clipExtentMAX, Math.min(d3_geo_clipExtentMAX, x));\n\
        y = Math.max(-d3_geo_clipExtentMAX, Math.min(d3_geo_clipExtentMAX, y));\n\
        var v = pointVisible(x, y);\n\
        if (polygon) ring.push([ x, y ]);\n\
        if (first) {\n\
          x__ = x, y__ = y, v__ = v;\n\
          first = false;\n\
          if (v) {\n\
            listener.lineStart();\n\
            listener.point(x, y);\n\
          }\n\
        } else {\n\
          if (v && v_) listener.point(x, y); else {\n\
            var l = {\n\
              a: {\n\
                x: x_,\n\
                y: y_\n\
              },\n\
              b: {\n\
                x: x,\n\
                y: y\n\
              }\n\
            };\n\
            if (clipLine(l)) {\n\
              if (!v_) {\n\
                listener.lineStart();\n\
                listener.point(l.a.x, l.a.y);\n\
              }\n\
              listener.point(l.b.x, l.b.y);\n\
              if (!v) listener.lineEnd();\n\
              clean = false;\n\
            } else if (v) {\n\
              listener.lineStart();\n\
              listener.point(x, y);\n\
              clean = false;\n\
            }\n\
          }\n\
        }\n\
        x_ = x, y_ = y, v_ = v;\n\
      }\n\
      return clip;\n\
    };\n\
    function corner(p, direction) {\n\
      return abs(p[0] - x0) < ε ? direction > 0 ? 0 : 3 : abs(p[0] - x1) < ε ? direction > 0 ? 2 : 1 : abs(p[1] - y0) < ε ? direction > 0 ? 1 : 0 : direction > 0 ? 3 : 2;\n\
    }\n\
    function compare(a, b) {\n\
      return comparePoints(a.x, b.x);\n\
    }\n\
    function comparePoints(a, b) {\n\
      var ca = corner(a, 1), cb = corner(b, 1);\n\
      return ca !== cb ? ca - cb : ca === 0 ? b[1] - a[1] : ca === 1 ? a[0] - b[0] : ca === 2 ? a[1] - b[1] : b[0] - a[0];\n\
    }\n\
  }\n\
  function d3_geo_compose(a, b) {\n\
    function compose(x, y) {\n\
      return x = a(x, y), b(x[0], x[1]);\n\
    }\n\
    if (a.invert && b.invert) compose.invert = function(x, y) {\n\
      return x = b.invert(x, y), x && a.invert(x[0], x[1]);\n\
    };\n\
    return compose;\n\
  }\n\
  function d3_geo_conic(projectAt) {\n\
    var φ0 = 0, φ1 = π / 3, m = d3_geo_projectionMutator(projectAt), p = m(φ0, φ1);\n\
    p.parallels = function(_) {\n\
      if (!arguments.length) return [ φ0 / π * 180, φ1 / π * 180 ];\n\
      return m(φ0 = _[0] * π / 180, φ1 = _[1] * π / 180);\n\
    };\n\
    return p;\n\
  }\n\
  function d3_geo_conicEqualArea(φ0, φ1) {\n\
    var sinφ0 = Math.sin(φ0), n = (sinφ0 + Math.sin(φ1)) / 2, C = 1 + sinφ0 * (2 * n - sinφ0), ρ0 = Math.sqrt(C) / n;\n\
    function forward(λ, φ) {\n\
      var ρ = Math.sqrt(C - 2 * n * Math.sin(φ)) / n;\n\
      return [ ρ * Math.sin(λ *= n), ρ0 - ρ * Math.cos(λ) ];\n\
    }\n\
    forward.invert = function(x, y) {\n\
      var ρ0_y = ρ0 - y;\n\
      return [ Math.atan2(x, ρ0_y) / n, d3_asin((C - (x * x + ρ0_y * ρ0_y) * n * n) / (2 * n)) ];\n\
    };\n\
    return forward;\n\
  }\n\
  (d3.geo.conicEqualArea = function() {\n\
    return d3_geo_conic(d3_geo_conicEqualArea);\n\
  }).raw = d3_geo_conicEqualArea;\n\
  d3.geo.albers = function() {\n\
    return d3.geo.conicEqualArea().rotate([ 96, 0 ]).center([ -.6, 38.7 ]).parallels([ 29.5, 45.5 ]).scale(1070);\n\
  };\n\
  d3.geo.albersUsa = function() {\n\
    var lower48 = d3.geo.albers();\n\
    var alaska = d3.geo.conicEqualArea().rotate([ 154, 0 ]).center([ -2, 58.5 ]).parallels([ 55, 65 ]);\n\
    var hawaii = d3.geo.conicEqualArea().rotate([ 157, 0 ]).center([ -3, 19.9 ]).parallels([ 8, 18 ]);\n\
    var point, pointStream = {\n\
      point: function(x, y) {\n\
        point = [ x, y ];\n\
      }\n\
    }, lower48Point, alaskaPoint, hawaiiPoint;\n\
    function albersUsa(coordinates) {\n\
      var x = coordinates[0], y = coordinates[1];\n\
      point = null;\n\
      (lower48Point(x, y), point) || (alaskaPoint(x, y), point) || hawaiiPoint(x, y);\n\
      return point;\n\
    }\n\
    albersUsa.invert = function(coordinates) {\n\
      var k = lower48.scale(), t = lower48.translate(), x = (coordinates[0] - t[0]) / k, y = (coordinates[1] - t[1]) / k;\n\
      return (y >= .12 && y < .234 && x >= -.425 && x < -.214 ? alaska : y >= .166 && y < .234 && x >= -.214 && x < -.115 ? hawaii : lower48).invert(coordinates);\n\
    };\n\
    albersUsa.stream = function(stream) {\n\
      var lower48Stream = lower48.stream(stream), alaskaStream = alaska.stream(stream), hawaiiStream = hawaii.stream(stream);\n\
      return {\n\
        point: function(x, y) {\n\
          lower48Stream.point(x, y);\n\
          alaskaStream.point(x, y);\n\
          hawaiiStream.point(x, y);\n\
        },\n\
        sphere: function() {\n\
          lower48Stream.sphere();\n\
          alaskaStream.sphere();\n\
          hawaiiStream.sphere();\n\
        },\n\
        lineStart: function() {\n\
          lower48Stream.lineStart();\n\
          alaskaStream.lineStart();\n\
          hawaiiStream.lineStart();\n\
        },\n\
        lineEnd: function() {\n\
          lower48Stream.lineEnd();\n\
          alaskaStream.lineEnd();\n\
          hawaiiStream.lineEnd();\n\
        },\n\
        polygonStart: function() {\n\
          lower48Stream.polygonStart();\n\
          alaskaStream.polygonStart();\n\
          hawaiiStream.polygonStart();\n\
        },\n\
        polygonEnd: function() {\n\
          lower48Stream.polygonEnd();\n\
          alaskaStream.polygonEnd();\n\
          hawaiiStream.polygonEnd();\n\
        }\n\
      };\n\
    };\n\
    albersUsa.precision = function(_) {\n\
      if (!arguments.length) return lower48.precision();\n\
      lower48.precision(_);\n\
      alaska.precision(_);\n\
      hawaii.precision(_);\n\
      return albersUsa;\n\
    };\n\
    albersUsa.scale = function(_) {\n\
      if (!arguments.length) return lower48.scale();\n\
      lower48.scale(_);\n\
      alaska.scale(_ * .35);\n\
      hawaii.scale(_);\n\
      return albersUsa.translate(lower48.translate());\n\
    };\n\
    albersUsa.translate = function(_) {\n\
      if (!arguments.length) return lower48.translate();\n\
      var k = lower48.scale(), x = +_[0], y = +_[1];\n\
      lower48Point = lower48.translate(_).clipExtent([ [ x - .455 * k, y - .238 * k ], [ x + .455 * k, y + .238 * k ] ]).stream(pointStream).point;\n\
      alaskaPoint = alaska.translate([ x - .307 * k, y + .201 * k ]).clipExtent([ [ x - .425 * k + ε, y + .12 * k + ε ], [ x - .214 * k - ε, y + .234 * k - ε ] ]).stream(pointStream).point;\n\
      hawaiiPoint = hawaii.translate([ x - .205 * k, y + .212 * k ]).clipExtent([ [ x - .214 * k + ε, y + .166 * k + ε ], [ x - .115 * k - ε, y + .234 * k - ε ] ]).stream(pointStream).point;\n\
      return albersUsa;\n\
    };\n\
    return albersUsa.scale(1070);\n\
  };\n\
  var d3_geo_pathAreaSum, d3_geo_pathAreaPolygon, d3_geo_pathArea = {\n\
    point: d3_noop,\n\
    lineStart: d3_noop,\n\
    lineEnd: d3_noop,\n\
    polygonStart: function() {\n\
      d3_geo_pathAreaPolygon = 0;\n\
      d3_geo_pathArea.lineStart = d3_geo_pathAreaRingStart;\n\
    },\n\
    polygonEnd: function() {\n\
      d3_geo_pathArea.lineStart = d3_geo_pathArea.lineEnd = d3_geo_pathArea.point = d3_noop;\n\
      d3_geo_pathAreaSum += abs(d3_geo_pathAreaPolygon / 2);\n\
    }\n\
  };\n\
  function d3_geo_pathAreaRingStart() {\n\
    var x00, y00, x0, y0;\n\
    d3_geo_pathArea.point = function(x, y) {\n\
      d3_geo_pathArea.point = nextPoint;\n\
      x00 = x0 = x, y00 = y0 = y;\n\
    };\n\
    function nextPoint(x, y) {\n\
      d3_geo_pathAreaPolygon += y0 * x - x0 * y;\n\
      x0 = x, y0 = y;\n\
    }\n\
    d3_geo_pathArea.lineEnd = function() {\n\
      nextPoint(x00, y00);\n\
    };\n\
  }\n\
  var d3_geo_pathBoundsX0, d3_geo_pathBoundsY0, d3_geo_pathBoundsX1, d3_geo_pathBoundsY1;\n\
  var d3_geo_pathBounds = {\n\
    point: d3_geo_pathBoundsPoint,\n\
    lineStart: d3_noop,\n\
    lineEnd: d3_noop,\n\
    polygonStart: d3_noop,\n\
    polygonEnd: d3_noop\n\
  };\n\
  function d3_geo_pathBoundsPoint(x, y) {\n\
    if (x < d3_geo_pathBoundsX0) d3_geo_pathBoundsX0 = x;\n\
    if (x > d3_geo_pathBoundsX1) d3_geo_pathBoundsX1 = x;\n\
    if (y < d3_geo_pathBoundsY0) d3_geo_pathBoundsY0 = y;\n\
    if (y > d3_geo_pathBoundsY1) d3_geo_pathBoundsY1 = y;\n\
  }\n\
  function d3_geo_pathBuffer() {\n\
    var pointCircle = d3_geo_pathBufferCircle(4.5), buffer = [];\n\
    var stream = {\n\
      point: point,\n\
      lineStart: function() {\n\
        stream.point = pointLineStart;\n\
      },\n\
      lineEnd: lineEnd,\n\
      polygonStart: function() {\n\
        stream.lineEnd = lineEndPolygon;\n\
      },\n\
      polygonEnd: function() {\n\
        stream.lineEnd = lineEnd;\n\
        stream.point = point;\n\
      },\n\
      pointRadius: function(_) {\n\
        pointCircle = d3_geo_pathBufferCircle(_);\n\
        return stream;\n\
      },\n\
      result: function() {\n\
        if (buffer.length) {\n\
          var result = buffer.join(\"\");\n\
          buffer = [];\n\
          return result;\n\
        }\n\
      }\n\
    };\n\
    function point(x, y) {\n\
      buffer.push(\"M\", x, \",\", y, pointCircle);\n\
    }\n\
    function pointLineStart(x, y) {\n\
      buffer.push(\"M\", x, \",\", y);\n\
      stream.point = pointLine;\n\
    }\n\
    function pointLine(x, y) {\n\
      buffer.push(\"L\", x, \",\", y);\n\
    }\n\
    function lineEnd() {\n\
      stream.point = point;\n\
    }\n\
    function lineEndPolygon() {\n\
      buffer.push(\"Z\");\n\
    }\n\
    return stream;\n\
  }\n\
  function d3_geo_pathBufferCircle(radius) {\n\
    return \"m0,\" + radius + \"a\" + radius + \",\" + radius + \" 0 1,1 0,\" + -2 * radius + \"a\" + radius + \",\" + radius + \" 0 1,1 0,\" + 2 * radius + \"z\";\n\
  }\n\
  var d3_geo_pathCentroid = {\n\
    point: d3_geo_pathCentroidPoint,\n\
    lineStart: d3_geo_pathCentroidLineStart,\n\
    lineEnd: d3_geo_pathCentroidLineEnd,\n\
    polygonStart: function() {\n\
      d3_geo_pathCentroid.lineStart = d3_geo_pathCentroidRingStart;\n\
    },\n\
    polygonEnd: function() {\n\
      d3_geo_pathCentroid.point = d3_geo_pathCentroidPoint;\n\
      d3_geo_pathCentroid.lineStart = d3_geo_pathCentroidLineStart;\n\
      d3_geo_pathCentroid.lineEnd = d3_geo_pathCentroidLineEnd;\n\
    }\n\
  };\n\
  function d3_geo_pathCentroidPoint(x, y) {\n\
    d3_geo_centroidX0 += x;\n\
    d3_geo_centroidY0 += y;\n\
    ++d3_geo_centroidZ0;\n\
  }\n\
  function d3_geo_pathCentroidLineStart() {\n\
    var x0, y0;\n\
    d3_geo_pathCentroid.point = function(x, y) {\n\
      d3_geo_pathCentroid.point = nextPoint;\n\
      d3_geo_pathCentroidPoint(x0 = x, y0 = y);\n\
    };\n\
    function nextPoint(x, y) {\n\
      var dx = x - x0, dy = y - y0, z = Math.sqrt(dx * dx + dy * dy);\n\
      d3_geo_centroidX1 += z * (x0 + x) / 2;\n\
      d3_geo_centroidY1 += z * (y0 + y) / 2;\n\
      d3_geo_centroidZ1 += z;\n\
      d3_geo_pathCentroidPoint(x0 = x, y0 = y);\n\
    }\n\
  }\n\
  function d3_geo_pathCentroidLineEnd() {\n\
    d3_geo_pathCentroid.point = d3_geo_pathCentroidPoint;\n\
  }\n\
  function d3_geo_pathCentroidRingStart() {\n\
    var x00, y00, x0, y0;\n\
    d3_geo_pathCentroid.point = function(x, y) {\n\
      d3_geo_pathCentroid.point = nextPoint;\n\
      d3_geo_pathCentroidPoint(x00 = x0 = x, y00 = y0 = y);\n\
    };\n\
    function nextPoint(x, y) {\n\
      var dx = x - x0, dy = y - y0, z = Math.sqrt(dx * dx + dy * dy);\n\
      d3_geo_centroidX1 += z * (x0 + x) / 2;\n\
      d3_geo_centroidY1 += z * (y0 + y) / 2;\n\
      d3_geo_centroidZ1 += z;\n\
      z = y0 * x - x0 * y;\n\
      d3_geo_centroidX2 += z * (x0 + x);\n\
      d3_geo_centroidY2 += z * (y0 + y);\n\
      d3_geo_centroidZ2 += z * 3;\n\
      d3_geo_pathCentroidPoint(x0 = x, y0 = y);\n\
    }\n\
    d3_geo_pathCentroid.lineEnd = function() {\n\
      nextPoint(x00, y00);\n\
    };\n\
  }\n\
  function d3_geo_pathContext(context) {\n\
    var pointRadius = 4.5;\n\
    var stream = {\n\
      point: point,\n\
      lineStart: function() {\n\
        stream.point = pointLineStart;\n\
      },\n\
      lineEnd: lineEnd,\n\
      polygonStart: function() {\n\
        stream.lineEnd = lineEndPolygon;\n\
      },\n\
      polygonEnd: function() {\n\
        stream.lineEnd = lineEnd;\n\
        stream.point = point;\n\
      },\n\
      pointRadius: function(_) {\n\
        pointRadius = _;\n\
        return stream;\n\
      },\n\
      result: d3_noop\n\
    };\n\
    function point(x, y) {\n\
      context.moveTo(x, y);\n\
      context.arc(x, y, pointRadius, 0, τ);\n\
    }\n\
    function pointLineStart(x, y) {\n\
      context.moveTo(x, y);\n\
      stream.point = pointLine;\n\
    }\n\
    function pointLine(x, y) {\n\
      context.lineTo(x, y);\n\
    }\n\
    function lineEnd() {\n\
      stream.point = point;\n\
    }\n\
    function lineEndPolygon() {\n\
      context.closePath();\n\
    }\n\
    return stream;\n\
  }\n\
  function d3_geo_resample(project) {\n\
    var δ2 = .5, cosMinDistance = Math.cos(30 * d3_radians), maxDepth = 16;\n\
    function resample(stream) {\n\
      return (maxDepth ? resampleRecursive : resampleNone)(stream);\n\
    }\n\
    function resampleNone(stream) {\n\
      return d3_geo_transformPoint(stream, function(x, y) {\n\
        x = project(x, y);\n\
        stream.point(x[0], x[1]);\n\
      });\n\
    }\n\
    function resampleRecursive(stream) {\n\
      var λ00, φ00, x00, y00, a00, b00, c00, λ0, x0, y0, a0, b0, c0;\n\
      var resample = {\n\
        point: point,\n\
        lineStart: lineStart,\n\
        lineEnd: lineEnd,\n\
        polygonStart: function() {\n\
          stream.polygonStart();\n\
          resample.lineStart = ringStart;\n\
        },\n\
        polygonEnd: function() {\n\
          stream.polygonEnd();\n\
          resample.lineStart = lineStart;\n\
        }\n\
      };\n\
      function point(x, y) {\n\
        x = project(x, y);\n\
        stream.point(x[0], x[1]);\n\
      }\n\
      function lineStart() {\n\
        x0 = NaN;\n\
        resample.point = linePoint;\n\
        stream.lineStart();\n\
      }\n\
      function linePoint(λ, φ) {\n\
        var c = d3_geo_cartesian([ λ, φ ]), p = project(λ, φ);\n\
        resampleLineTo(x0, y0, λ0, a0, b0, c0, x0 = p[0], y0 = p[1], λ0 = λ, a0 = c[0], b0 = c[1], c0 = c[2], maxDepth, stream);\n\
        stream.point(x0, y0);\n\
      }\n\
      function lineEnd() {\n\
        resample.point = point;\n\
        stream.lineEnd();\n\
      }\n\
      function ringStart() {\n\
        lineStart();\n\
        resample.point = ringPoint;\n\
        resample.lineEnd = ringEnd;\n\
      }\n\
      function ringPoint(λ, φ) {\n\
        linePoint(λ00 = λ, φ00 = φ), x00 = x0, y00 = y0, a00 = a0, b00 = b0, c00 = c0;\n\
        resample.point = linePoint;\n\
      }\n\
      function ringEnd() {\n\
        resampleLineTo(x0, y0, λ0, a0, b0, c0, x00, y00, λ00, a00, b00, c00, maxDepth, stream);\n\
        resample.lineEnd = lineEnd;\n\
        lineEnd();\n\
      }\n\
      return resample;\n\
    }\n\
    function resampleLineTo(x0, y0, λ0, a0, b0, c0, x1, y1, λ1, a1, b1, c1, depth, stream) {\n\
      var dx = x1 - x0, dy = y1 - y0, d2 = dx * dx + dy * dy;\n\
      if (d2 > 4 * δ2 && depth--) {\n\
        var a = a0 + a1, b = b0 + b1, c = c0 + c1, m = Math.sqrt(a * a + b * b + c * c), φ2 = Math.asin(c /= m), λ2 = abs(abs(c) - 1) < ε || abs(λ0 - λ1) < ε ? (λ0 + λ1) / 2 : Math.atan2(b, a), p = project(λ2, φ2), x2 = p[0], y2 = p[1], dx2 = x2 - x0, dy2 = y2 - y0, dz = dy * dx2 - dx * dy2;\n\
        if (dz * dz / d2 > δ2 || abs((dx * dx2 + dy * dy2) / d2 - .5) > .3 || a0 * a1 + b0 * b1 + c0 * c1 < cosMinDistance) {\n\
          resampleLineTo(x0, y0, λ0, a0, b0, c0, x2, y2, λ2, a /= m, b /= m, c, depth, stream);\n\
          stream.point(x2, y2);\n\
          resampleLineTo(x2, y2, λ2, a, b, c, x1, y1, λ1, a1, b1, c1, depth, stream);\n\
        }\n\
      }\n\
    }\n\
    resample.precision = function(_) {\n\
      if (!arguments.length) return Math.sqrt(δ2);\n\
      maxDepth = (δ2 = _ * _) > 0 && 16;\n\
      return resample;\n\
    };\n\
    return resample;\n\
  }\n\
  d3.geo.path = function() {\n\
    var pointRadius = 4.5, projection, context, projectStream, contextStream, cacheStream;\n\
    function path(object) {\n\
      if (object) {\n\
        if (typeof pointRadius === \"function\") contextStream.pointRadius(+pointRadius.apply(this, arguments));\n\
        if (!cacheStream || !cacheStream.valid) cacheStream = projectStream(contextStream);\n\
        d3.geo.stream(object, cacheStream);\n\
      }\n\
      return contextStream.result();\n\
    }\n\
    path.area = function(object) {\n\
      d3_geo_pathAreaSum = 0;\n\
      d3.geo.stream(object, projectStream(d3_geo_pathArea));\n\
      return d3_geo_pathAreaSum;\n\
    };\n\
    path.centroid = function(object) {\n\
      d3_geo_centroidX0 = d3_geo_centroidY0 = d3_geo_centroidZ0 = d3_geo_centroidX1 = d3_geo_centroidY1 = d3_geo_centroidZ1 = d3_geo_centroidX2 = d3_geo_centroidY2 = d3_geo_centroidZ2 = 0;\n\
      d3.geo.stream(object, projectStream(d3_geo_pathCentroid));\n\
      return d3_geo_centroidZ2 ? [ d3_geo_centroidX2 / d3_geo_centroidZ2, d3_geo_centroidY2 / d3_geo_centroidZ2 ] : d3_geo_centroidZ1 ? [ d3_geo_centroidX1 / d3_geo_centroidZ1, d3_geo_centroidY1 / d3_geo_centroidZ1 ] : d3_geo_centroidZ0 ? [ d3_geo_centroidX0 / d3_geo_centroidZ0, d3_geo_centroidY0 / d3_geo_centroidZ0 ] : [ NaN, NaN ];\n\
    };\n\
    path.bounds = function(object) {\n\
      d3_geo_pathBoundsX1 = d3_geo_pathBoundsY1 = -(d3_geo_pathBoundsX0 = d3_geo_pathBoundsY0 = Infinity);\n\
      d3.geo.stream(object, projectStream(d3_geo_pathBounds));\n\
      return [ [ d3_geo_pathBoundsX0, d3_geo_pathBoundsY0 ], [ d3_geo_pathBoundsX1, d3_geo_pathBoundsY1 ] ];\n\
    };\n\
    path.projection = function(_) {\n\
      if (!arguments.length) return projection;\n\
      projectStream = (projection = _) ? _.stream || d3_geo_pathProjectStream(_) : d3_identity;\n\
      return reset();\n\
    };\n\
    path.context = function(_) {\n\
      if (!arguments.length) return context;\n\
      contextStream = (context = _) == null ? new d3_geo_pathBuffer() : new d3_geo_pathContext(_);\n\
      if (typeof pointRadius !== \"function\") contextStream.pointRadius(pointRadius);\n\
      return reset();\n\
    };\n\
    path.pointRadius = function(_) {\n\
      if (!arguments.length) return pointRadius;\n\
      pointRadius = typeof _ === \"function\" ? _ : (contextStream.pointRadius(+_), +_);\n\
      return path;\n\
    };\n\
    function reset() {\n\
      cacheStream = null;\n\
      return path;\n\
    }\n\
    return path.projection(d3.geo.albersUsa()).context(null);\n\
  };\n\
  function d3_geo_pathProjectStream(project) {\n\
    var resample = d3_geo_resample(function(x, y) {\n\
      return project([ x * d3_degrees, y * d3_degrees ]);\n\
    });\n\
    return function(stream) {\n\
      return d3_geo_projectionRadians(resample(stream));\n\
    };\n\
  }\n\
  d3.geo.transform = function(methods) {\n\
    return {\n\
      stream: function(stream) {\n\
        var transform = new d3_geo_transform(stream);\n\
        for (var k in methods) transform[k] = methods[k];\n\
        return transform;\n\
      }\n\
    };\n\
  };\n\
  function d3_geo_transform(stream) {\n\
    this.stream = stream;\n\
  }\n\
  d3_geo_transform.prototype = {\n\
    point: function(x, y) {\n\
      this.stream.point(x, y);\n\
    },\n\
    sphere: function() {\n\
      this.stream.sphere();\n\
    },\n\
    lineStart: function() {\n\
      this.stream.lineStart();\n\
    },\n\
    lineEnd: function() {\n\
      this.stream.lineEnd();\n\
    },\n\
    polygonStart: function() {\n\
      this.stream.polygonStart();\n\
    },\n\
    polygonEnd: function() {\n\
      this.stream.polygonEnd();\n\
    }\n\
  };\n\
  function d3_geo_transformPoint(stream, point) {\n\
    return {\n\
      point: point,\n\
      sphere: function() {\n\
        stream.sphere();\n\
      },\n\
      lineStart: function() {\n\
        stream.lineStart();\n\
      },\n\
      lineEnd: function() {\n\
        stream.lineEnd();\n\
      },\n\
      polygonStart: function() {\n\
        stream.polygonStart();\n\
      },\n\
      polygonEnd: function() {\n\
        stream.polygonEnd();\n\
      }\n\
    };\n\
  }\n\
  d3.geo.projection = d3_geo_projection;\n\
  d3.geo.projectionMutator = d3_geo_projectionMutator;\n\
  function d3_geo_projection(project) {\n\
    return d3_geo_projectionMutator(function() {\n\
      return project;\n\
    })();\n\
  }\n\
  function d3_geo_projectionMutator(projectAt) {\n\
    var project, rotate, projectRotate, projectResample = d3_geo_resample(function(x, y) {\n\
      x = project(x, y);\n\
      return [ x[0] * k + δx, δy - x[1] * k ];\n\
    }), k = 150, x = 480, y = 250, λ = 0, φ = 0, δλ = 0, δφ = 0, δγ = 0, δx, δy, preclip = d3_geo_clipAntimeridian, postclip = d3_identity, clipAngle = null, clipExtent = null, stream;\n\
    function projection(point) {\n\
      point = projectRotate(point[0] * d3_radians, point[1] * d3_radians);\n\
      return [ point[0] * k + δx, δy - point[1] * k ];\n\
    }\n\
    function invert(point) {\n\
      point = projectRotate.invert((point[0] - δx) / k, (δy - point[1]) / k);\n\
      return point && [ point[0] * d3_degrees, point[1] * d3_degrees ];\n\
    }\n\
    projection.stream = function(output) {\n\
      if (stream) stream.valid = false;\n\
      stream = d3_geo_projectionRadians(preclip(rotate, projectResample(postclip(output))));\n\
      stream.valid = true;\n\
      return stream;\n\
    };\n\
    projection.clipAngle = function(_) {\n\
      if (!arguments.length) return clipAngle;\n\
      preclip = _ == null ? (clipAngle = _, d3_geo_clipAntimeridian) : d3_geo_clipCircle((clipAngle = +_) * d3_radians);\n\
      return invalidate();\n\
    };\n\
    projection.clipExtent = function(_) {\n\
      if (!arguments.length) return clipExtent;\n\
      clipExtent = _;\n\
      postclip = _ ? d3_geo_clipExtent(_[0][0], _[0][1], _[1][0], _[1][1]) : d3_identity;\n\
      return invalidate();\n\
    };\n\
    projection.scale = function(_) {\n\
      if (!arguments.length) return k;\n\
      k = +_;\n\
      return reset();\n\
    };\n\
    projection.translate = function(_) {\n\
      if (!arguments.length) return [ x, y ];\n\
      x = +_[0];\n\
      y = +_[1];\n\
      return reset();\n\
    };\n\
    projection.center = function(_) {\n\
      if (!arguments.length) return [ λ * d3_degrees, φ * d3_degrees ];\n\
      λ = _[0] % 360 * d3_radians;\n\
      φ = _[1] % 360 * d3_radians;\n\
      return reset();\n\
    };\n\
    projection.rotate = function(_) {\n\
      if (!arguments.length) return [ δλ * d3_degrees, δφ * d3_degrees, δγ * d3_degrees ];\n\
      δλ = _[0] % 360 * d3_radians;\n\
      δφ = _[1] % 360 * d3_radians;\n\
      δγ = _.length > 2 ? _[2] % 360 * d3_radians : 0;\n\
      return reset();\n\
    };\n\
    d3.rebind(projection, projectResample, \"precision\");\n\
    function reset() {\n\
      projectRotate = d3_geo_compose(rotate = d3_geo_rotation(δλ, δφ, δγ), project);\n\
      var center = project(λ, φ);\n\
      δx = x - center[0] * k;\n\
      δy = y + center[1] * k;\n\
      return invalidate();\n\
    }\n\
    function invalidate() {\n\
      if (stream) stream.valid = false, stream = null;\n\
      return projection;\n\
    }\n\
    return function() {\n\
      project = projectAt.apply(this, arguments);\n\
      projection.invert = project.invert && invert;\n\
      return reset();\n\
    };\n\
  }\n\
  function d3_geo_projectionRadians(stream) {\n\
    return d3_geo_transformPoint(stream, function(x, y) {\n\
      stream.point(x * d3_radians, y * d3_radians);\n\
    });\n\
  }\n\
  function d3_geo_equirectangular(λ, φ) {\n\
    return [ λ, φ ];\n\
  }\n\
  (d3.geo.equirectangular = function() {\n\
    return d3_geo_projection(d3_geo_equirectangular);\n\
  }).raw = d3_geo_equirectangular.invert = d3_geo_equirectangular;\n\
  d3.geo.rotation = function(rotate) {\n\
    rotate = d3_geo_rotation(rotate[0] % 360 * d3_radians, rotate[1] * d3_radians, rotate.length > 2 ? rotate[2] * d3_radians : 0);\n\
    function forward(coordinates) {\n\
      coordinates = rotate(coordinates[0] * d3_radians, coordinates[1] * d3_radians);\n\
      return coordinates[0] *= d3_degrees, coordinates[1] *= d3_degrees, coordinates;\n\
    }\n\
    forward.invert = function(coordinates) {\n\
      coordinates = rotate.invert(coordinates[0] * d3_radians, coordinates[1] * d3_radians);\n\
      return coordinates[0] *= d3_degrees, coordinates[1] *= d3_degrees, coordinates;\n\
    };\n\
    return forward;\n\
  };\n\
  function d3_geo_identityRotation(λ, φ) {\n\
    return [ λ > π ? λ - τ : λ < -π ? λ + τ : λ, φ ];\n\
  }\n\
  d3_geo_identityRotation.invert = d3_geo_equirectangular;\n\
  function d3_geo_rotation(δλ, δφ, δγ) {\n\
    return δλ ? δφ || δγ ? d3_geo_compose(d3_geo_rotationλ(δλ), d3_geo_rotationφγ(δφ, δγ)) : d3_geo_rotationλ(δλ) : δφ || δγ ? d3_geo_rotationφγ(δφ, δγ) : d3_geo_identityRotation;\n\
  }\n\
  function d3_geo_forwardRotationλ(δλ) {\n\
    return function(λ, φ) {\n\
      return λ += δλ, [ λ > π ? λ - τ : λ < -π ? λ + τ : λ, φ ];\n\
    };\n\
  }\n\
  function d3_geo_rotationλ(δλ) {\n\
    var rotation = d3_geo_forwardRotationλ(δλ);\n\
    rotation.invert = d3_geo_forwardRotationλ(-δλ);\n\
    return rotation;\n\
  }\n\
  function d3_geo_rotationφγ(δφ, δγ) {\n\
    var cosδφ = Math.cos(δφ), sinδφ = Math.sin(δφ), cosδγ = Math.cos(δγ), sinδγ = Math.sin(δγ);\n\
    function rotation(λ, φ) {\n\
      var cosφ = Math.cos(φ), x = Math.cos(λ) * cosφ, y = Math.sin(λ) * cosφ, z = Math.sin(φ), k = z * cosδφ + x * sinδφ;\n\
      return [ Math.atan2(y * cosδγ - k * sinδγ, x * cosδφ - z * sinδφ), d3_asin(k * cosδγ + y * sinδγ) ];\n\
    }\n\
    rotation.invert = function(λ, φ) {\n\
      var cosφ = Math.cos(φ), x = Math.cos(λ) * cosφ, y = Math.sin(λ) * cosφ, z = Math.sin(φ), k = z * cosδγ - y * sinδγ;\n\
      return [ Math.atan2(y * cosδγ + z * sinδγ, x * cosδφ + k * sinδφ), d3_asin(k * cosδφ - x * sinδφ) ];\n\
    };\n\
    return rotation;\n\
  }\n\
  d3.geo.circle = function() {\n\
    var origin = [ 0, 0 ], angle, precision = 6, interpolate;\n\
    function circle() {\n\
      var center = typeof origin === \"function\" ? origin.apply(this, arguments) : origin, rotate = d3_geo_rotation(-center[0] * d3_radians, -center[1] * d3_radians, 0).invert, ring = [];\n\
      interpolate(null, null, 1, {\n\
        point: function(x, y) {\n\
          ring.push(x = rotate(x, y));\n\
          x[0] *= d3_degrees, x[1] *= d3_degrees;\n\
        }\n\
      });\n\
      return {\n\
        type: \"Polygon\",\n\
        coordinates: [ ring ]\n\
      };\n\
    }\n\
    circle.origin = function(x) {\n\
      if (!arguments.length) return origin;\n\
      origin = x;\n\
      return circle;\n\
    };\n\
    circle.angle = function(x) {\n\
      if (!arguments.length) return angle;\n\
      interpolate = d3_geo_circleInterpolate((angle = +x) * d3_radians, precision * d3_radians);\n\
      return circle;\n\
    };\n\
    circle.precision = function(_) {\n\
      if (!arguments.length) return precision;\n\
      interpolate = d3_geo_circleInterpolate(angle * d3_radians, (precision = +_) * d3_radians);\n\
      return circle;\n\
    };\n\
    return circle.angle(90);\n\
  };\n\
  function d3_geo_circleInterpolate(radius, precision) {\n\
    var cr = Math.cos(radius), sr = Math.sin(radius);\n\
    return function(from, to, direction, listener) {\n\
      var step = direction * precision;\n\
      if (from != null) {\n\
        from = d3_geo_circleAngle(cr, from);\n\
        to = d3_geo_circleAngle(cr, to);\n\
        if (direction > 0 ? from < to : from > to) from += direction * τ;\n\
      } else {\n\
        from = radius + direction * τ;\n\
        to = radius - .5 * step;\n\
      }\n\
      for (var point, t = from; direction > 0 ? t > to : t < to; t -= step) {\n\
        listener.point((point = d3_geo_spherical([ cr, -sr * Math.cos(t), -sr * Math.sin(t) ]))[0], point[1]);\n\
      }\n\
    };\n\
  }\n\
  function d3_geo_circleAngle(cr, point) {\n\
    var a = d3_geo_cartesian(point);\n\
    a[0] -= cr;\n\
    d3_geo_cartesianNormalize(a);\n\
    var angle = d3_acos(-a[1]);\n\
    return ((-a[2] < 0 ? -angle : angle) + 2 * Math.PI - ε) % (2 * Math.PI);\n\
  }\n\
  d3.geo.distance = function(a, b) {\n\
    var Δλ = (b[0] - a[0]) * d3_radians, φ0 = a[1] * d3_radians, φ1 = b[1] * d3_radians, sinΔλ = Math.sin(Δλ), cosΔλ = Math.cos(Δλ), sinφ0 = Math.sin(φ0), cosφ0 = Math.cos(φ0), sinφ1 = Math.sin(φ1), cosφ1 = Math.cos(φ1), t;\n\
    return Math.atan2(Math.sqrt((t = cosφ1 * sinΔλ) * t + (t = cosφ0 * sinφ1 - sinφ0 * cosφ1 * cosΔλ) * t), sinφ0 * sinφ1 + cosφ0 * cosφ1 * cosΔλ);\n\
  };\n\
  d3.geo.graticule = function() {\n\
    var x1, x0, X1, X0, y1, y0, Y1, Y0, dx = 10, dy = dx, DX = 90, DY = 360, x, y, X, Y, precision = 2.5;\n\
    function graticule() {\n\
      return {\n\
        type: \"MultiLineString\",\n\
        coordinates: lines()\n\
      };\n\
    }\n\
    function lines() {\n\
      return d3.range(Math.ceil(X0 / DX) * DX, X1, DX).map(X).concat(d3.range(Math.ceil(Y0 / DY) * DY, Y1, DY).map(Y)).concat(d3.range(Math.ceil(x0 / dx) * dx, x1, dx).filter(function(x) {\n\
        return abs(x % DX) > ε;\n\
      }).map(x)).concat(d3.range(Math.ceil(y0 / dy) * dy, y1, dy).filter(function(y) {\n\
        return abs(y % DY) > ε;\n\
      }).map(y));\n\
    }\n\
    graticule.lines = function() {\n\
      return lines().map(function(coordinates) {\n\
        return {\n\
          type: \"LineString\",\n\
          coordinates: coordinates\n\
        };\n\
      });\n\
    };\n\
    graticule.outline = function() {\n\
      return {\n\
        type: \"Polygon\",\n\
        coordinates: [ X(X0).concat(Y(Y1).slice(1), X(X1).reverse().slice(1), Y(Y0).reverse().slice(1)) ]\n\
      };\n\
    };\n\
    graticule.extent = function(_) {\n\
      if (!arguments.length) return graticule.minorExtent();\n\
      return graticule.majorExtent(_).minorExtent(_);\n\
    };\n\
    graticule.majorExtent = function(_) {\n\
      if (!arguments.length) return [ [ X0, Y0 ], [ X1, Y1 ] ];\n\
      X0 = +_[0][0], X1 = +_[1][0];\n\
      Y0 = +_[0][1], Y1 = +_[1][1];\n\
      if (X0 > X1) _ = X0, X0 = X1, X1 = _;\n\
      if (Y0 > Y1) _ = Y0, Y0 = Y1, Y1 = _;\n\
      return graticule.precision(precision);\n\
    };\n\
    graticule.minorExtent = function(_) {\n\
      if (!arguments.length) return [ [ x0, y0 ], [ x1, y1 ] ];\n\
      x0 = +_[0][0], x1 = +_[1][0];\n\
      y0 = +_[0][1], y1 = +_[1][1];\n\
      if (x0 > x1) _ = x0, x0 = x1, x1 = _;\n\
      if (y0 > y1) _ = y0, y0 = y1, y1 = _;\n\
      return graticule.precision(precision);\n\
    };\n\
    graticule.step = function(_) {\n\
      if (!arguments.length) return graticule.minorStep();\n\
      return graticule.majorStep(_).minorStep(_);\n\
    };\n\
    graticule.majorStep = function(_) {\n\
      if (!arguments.length) return [ DX, DY ];\n\
      DX = +_[0], DY = +_[1];\n\
      return graticule;\n\
    };\n\
    graticule.minorStep = function(_) {\n\
      if (!arguments.length) return [ dx, dy ];\n\
      dx = +_[0], dy = +_[1];\n\
      return graticule;\n\
    };\n\
    graticule.precision = function(_) {\n\
      if (!arguments.length) return precision;\n\
      precision = +_;\n\
      x = d3_geo_graticuleX(y0, y1, 90);\n\
      y = d3_geo_graticuleY(x0, x1, precision);\n\
      X = d3_geo_graticuleX(Y0, Y1, 90);\n\
      Y = d3_geo_graticuleY(X0, X1, precision);\n\
      return graticule;\n\
    };\n\
    return graticule.majorExtent([ [ -180, -90 + ε ], [ 180, 90 - ε ] ]).minorExtent([ [ -180, -80 - ε ], [ 180, 80 + ε ] ]);\n\
  };\n\
  function d3_geo_graticuleX(y0, y1, dy) {\n\
    var y = d3.range(y0, y1 - ε, dy).concat(y1);\n\
    return function(x) {\n\
      return y.map(function(y) {\n\
        return [ x, y ];\n\
      });\n\
    };\n\
  }\n\
  function d3_geo_graticuleY(x0, x1, dx) {\n\
    var x = d3.range(x0, x1 - ε, dx).concat(x1);\n\
    return function(y) {\n\
      return x.map(function(x) {\n\
        return [ x, y ];\n\
      });\n\
    };\n\
  }\n\
  function d3_source(d) {\n\
    return d.source;\n\
  }\n\
  function d3_target(d) {\n\
    return d.target;\n\
  }\n\
  d3.geo.greatArc = function() {\n\
    var source = d3_source, source_, target = d3_target, target_;\n\
    function greatArc() {\n\
      return {\n\
        type: \"LineString\",\n\
        coordinates: [ source_ || source.apply(this, arguments), target_ || target.apply(this, arguments) ]\n\
      };\n\
    }\n\
    greatArc.distance = function() {\n\
      return d3.geo.distance(source_ || source.apply(this, arguments), target_ || target.apply(this, arguments));\n\
    };\n\
    greatArc.source = function(_) {\n\
      if (!arguments.length) return source;\n\
      source = _, source_ = typeof _ === \"function\" ? null : _;\n\
      return greatArc;\n\
    };\n\
    greatArc.target = function(_) {\n\
      if (!arguments.length) return target;\n\
      target = _, target_ = typeof _ === \"function\" ? null : _;\n\
      return greatArc;\n\
    };\n\
    greatArc.precision = function() {\n\
      return arguments.length ? greatArc : 0;\n\
    };\n\
    return greatArc;\n\
  };\n\
  d3.geo.interpolate = function(source, target) {\n\
    return d3_geo_interpolate(source[0] * d3_radians, source[1] * d3_radians, target[0] * d3_radians, target[1] * d3_radians);\n\
  };\n\
  function d3_geo_interpolate(x0, y0, x1, y1) {\n\
    var cy0 = Math.cos(y0), sy0 = Math.sin(y0), cy1 = Math.cos(y1), sy1 = Math.sin(y1), kx0 = cy0 * Math.cos(x0), ky0 = cy0 * Math.sin(x0), kx1 = cy1 * Math.cos(x1), ky1 = cy1 * Math.sin(x1), d = 2 * Math.asin(Math.sqrt(d3_haversin(y1 - y0) + cy0 * cy1 * d3_haversin(x1 - x0))), k = 1 / Math.sin(d);\n\
    var interpolate = d ? function(t) {\n\
      var B = Math.sin(t *= d) * k, A = Math.sin(d - t) * k, x = A * kx0 + B * kx1, y = A * ky0 + B * ky1, z = A * sy0 + B * sy1;\n\
      return [ Math.atan2(y, x) * d3_degrees, Math.atan2(z, Math.sqrt(x * x + y * y)) * d3_degrees ];\n\
    } : function() {\n\
      return [ x0 * d3_degrees, y0 * d3_degrees ];\n\
    };\n\
    interpolate.distance = d;\n\
    return interpolate;\n\
  }\n\
  d3.geo.length = function(object) {\n\
    d3_geo_lengthSum = 0;\n\
    d3.geo.stream(object, d3_geo_length);\n\
    return d3_geo_lengthSum;\n\
  };\n\
  var d3_geo_lengthSum;\n\
  var d3_geo_length = {\n\
    sphere: d3_noop,\n\
    point: d3_noop,\n\
    lineStart: d3_geo_lengthLineStart,\n\
    lineEnd: d3_noop,\n\
    polygonStart: d3_noop,\n\
    polygonEnd: d3_noop\n\
  };\n\
  function d3_geo_lengthLineStart() {\n\
    var λ0, sinφ0, cosφ0;\n\
    d3_geo_length.point = function(λ, φ) {\n\
      λ0 = λ * d3_radians, sinφ0 = Math.sin(φ *= d3_radians), cosφ0 = Math.cos(φ);\n\
      d3_geo_length.point = nextPoint;\n\
    };\n\
    d3_geo_length.lineEnd = function() {\n\
      d3_geo_length.point = d3_geo_length.lineEnd = d3_noop;\n\
    };\n\
    function nextPoint(λ, φ) {\n\
      var sinφ = Math.sin(φ *= d3_radians), cosφ = Math.cos(φ), t = abs((λ *= d3_radians) - λ0), cosΔλ = Math.cos(t);\n\
      d3_geo_lengthSum += Math.atan2(Math.sqrt((t = cosφ * Math.sin(t)) * t + (t = cosφ0 * sinφ - sinφ0 * cosφ * cosΔλ) * t), sinφ0 * sinφ + cosφ0 * cosφ * cosΔλ);\n\
      λ0 = λ, sinφ0 = sinφ, cosφ0 = cosφ;\n\
    }\n\
  }\n\
  function d3_geo_azimuthal(scale, angle) {\n\
    function azimuthal(λ, φ) {\n\
      var cosλ = Math.cos(λ), cosφ = Math.cos(φ), k = scale(cosλ * cosφ);\n\
      return [ k * cosφ * Math.sin(λ), k * Math.sin(φ) ];\n\
    }\n\
    azimuthal.invert = function(x, y) {\n\
      var ρ = Math.sqrt(x * x + y * y), c = angle(ρ), sinc = Math.sin(c), cosc = Math.cos(c);\n\
      return [ Math.atan2(x * sinc, ρ * cosc), Math.asin(ρ && y * sinc / ρ) ];\n\
    };\n\
    return azimuthal;\n\
  }\n\
  var d3_geo_azimuthalEqualArea = d3_geo_azimuthal(function(cosλcosφ) {\n\
    return Math.sqrt(2 / (1 + cosλcosφ));\n\
  }, function(ρ) {\n\
    return 2 * Math.asin(ρ / 2);\n\
  });\n\
  (d3.geo.azimuthalEqualArea = function() {\n\
    return d3_geo_projection(d3_geo_azimuthalEqualArea);\n\
  }).raw = d3_geo_azimuthalEqualArea;\n\
  var d3_geo_azimuthalEquidistant = d3_geo_azimuthal(function(cosλcosφ) {\n\
    var c = Math.acos(cosλcosφ);\n\
    return c && c / Math.sin(c);\n\
  }, d3_identity);\n\
  (d3.geo.azimuthalEquidistant = function() {\n\
    return d3_geo_projection(d3_geo_azimuthalEquidistant);\n\
  }).raw = d3_geo_azimuthalEquidistant;\n\
  function d3_geo_conicConformal(φ0, φ1) {\n\
    var cosφ0 = Math.cos(φ0), t = function(φ) {\n\
      return Math.tan(π / 4 + φ / 2);\n\
    }, n = φ0 === φ1 ? Math.sin(φ0) : Math.log(cosφ0 / Math.cos(φ1)) / Math.log(t(φ1) / t(φ0)), F = cosφ0 * Math.pow(t(φ0), n) / n;\n\
    if (!n) return d3_geo_mercator;\n\
    function forward(λ, φ) {\n\
      if (F > 0) {\n\
        if (φ < -halfπ + ε) φ = -halfπ + ε;\n\
      } else {\n\
        if (φ > halfπ - ε) φ = halfπ - ε;\n\
      }\n\
      var ρ = F / Math.pow(t(φ), n);\n\
      return [ ρ * Math.sin(n * λ), F - ρ * Math.cos(n * λ) ];\n\
    }\n\
    forward.invert = function(x, y) {\n\
      var ρ0_y = F - y, ρ = d3_sgn(n) * Math.sqrt(x * x + ρ0_y * ρ0_y);\n\
      return [ Math.atan2(x, ρ0_y) / n, 2 * Math.atan(Math.pow(F / ρ, 1 / n)) - halfπ ];\n\
    };\n\
    return forward;\n\
  }\n\
  (d3.geo.conicConformal = function() {\n\
    return d3_geo_conic(d3_geo_conicConformal);\n\
  }).raw = d3_geo_conicConformal;\n\
  function d3_geo_conicEquidistant(φ0, φ1) {\n\
    var cosφ0 = Math.cos(φ0), n = φ0 === φ1 ? Math.sin(φ0) : (cosφ0 - Math.cos(φ1)) / (φ1 - φ0), G = cosφ0 / n + φ0;\n\
    if (abs(n) < ε) return d3_geo_equirectangular;\n\
    function forward(λ, φ) {\n\
      var ρ = G - φ;\n\
      return [ ρ * Math.sin(n * λ), G - ρ * Math.cos(n * λ) ];\n\
    }\n\
    forward.invert = function(x, y) {\n\
      var ρ0_y = G - y;\n\
      return [ Math.atan2(x, ρ0_y) / n, G - d3_sgn(n) * Math.sqrt(x * x + ρ0_y * ρ0_y) ];\n\
    };\n\
    return forward;\n\
  }\n\
  (d3.geo.conicEquidistant = function() {\n\
    return d3_geo_conic(d3_geo_conicEquidistant);\n\
  }).raw = d3_geo_conicEquidistant;\n\
  var d3_geo_gnomonic = d3_geo_azimuthal(function(cosλcosφ) {\n\
    return 1 / cosλcosφ;\n\
  }, Math.atan);\n\
  (d3.geo.gnomonic = function() {\n\
    return d3_geo_projection(d3_geo_gnomonic);\n\
  }).raw = d3_geo_gnomonic;\n\
  function d3_geo_mercator(λ, φ) {\n\
    return [ λ, Math.log(Math.tan(π / 4 + φ / 2)) ];\n\
  }\n\
  d3_geo_mercator.invert = function(x, y) {\n\
    return [ x, 2 * Math.atan(Math.exp(y)) - halfπ ];\n\
  };\n\
  function d3_geo_mercatorProjection(project) {\n\
    var m = d3_geo_projection(project), scale = m.scale, translate = m.translate, clipExtent = m.clipExtent, clipAuto;\n\
    m.scale = function() {\n\
      var v = scale.apply(m, arguments);\n\
      return v === m ? clipAuto ? m.clipExtent(null) : m : v;\n\
    };\n\
    m.translate = function() {\n\
      var v = translate.apply(m, arguments);\n\
      return v === m ? clipAuto ? m.clipExtent(null) : m : v;\n\
    };\n\
    m.clipExtent = function(_) {\n\
      var v = clipExtent.apply(m, arguments);\n\
      if (v === m) {\n\
        if (clipAuto = _ == null) {\n\
          var k = π * scale(), t = translate();\n\
          clipExtent([ [ t[0] - k, t[1] - k ], [ t[0] + k, t[1] + k ] ]);\n\
        }\n\
      } else if (clipAuto) {\n\
        v = null;\n\
      }\n\
      return v;\n\
    };\n\
    return m.clipExtent(null);\n\
  }\n\
  (d3.geo.mercator = function() {\n\
    return d3_geo_mercatorProjection(d3_geo_mercator);\n\
  }).raw = d3_geo_mercator;\n\
  var d3_geo_orthographic = d3_geo_azimuthal(function() {\n\
    return 1;\n\
  }, Math.asin);\n\
  (d3.geo.orthographic = function() {\n\
    return d3_geo_projection(d3_geo_orthographic);\n\
  }).raw = d3_geo_orthographic;\n\
  var d3_geo_stereographic = d3_geo_azimuthal(function(cosλcosφ) {\n\
    return 1 / (1 + cosλcosφ);\n\
  }, function(ρ) {\n\
    return 2 * Math.atan(ρ);\n\
  });\n\
  (d3.geo.stereographic = function() {\n\
    return d3_geo_projection(d3_geo_stereographic);\n\
  }).raw = d3_geo_stereographic;\n\
  function d3_geo_transverseMercator(λ, φ) {\n\
    return [ Math.log(Math.tan(π / 4 + φ / 2)), -λ ];\n\
  }\n\
  d3_geo_transverseMercator.invert = function(x, y) {\n\
    return [ -y, 2 * Math.atan(Math.exp(x)) - halfπ ];\n\
  };\n\
  (d3.geo.transverseMercator = function() {\n\
    var projection = d3_geo_mercatorProjection(d3_geo_transverseMercator), center = projection.center, rotate = projection.rotate;\n\
    projection.center = function(_) {\n\
      return _ ? center([ -_[1], _[0] ]) : (_ = center(), [ -_[1], _[0] ]);\n\
    };\n\
    projection.rotate = function(_) {\n\
      return _ ? rotate([ _[0], _[1], _.length > 2 ? _[2] + 90 : 90 ]) : (_ = rotate(), \n\
      [ _[0], _[1], _[2] - 90 ]);\n\
    };\n\
    return projection.rotate([ 0, 0 ]);\n\
  }).raw = d3_geo_transverseMercator;\n\
  d3.geom = {};\n\
  function d3_geom_pointX(d) {\n\
    return d[0];\n\
  }\n\
  function d3_geom_pointY(d) {\n\
    return d[1];\n\
  }\n\
  d3.geom.hull = function(vertices) {\n\
    var x = d3_geom_pointX, y = d3_geom_pointY;\n\
    if (arguments.length) return hull(vertices);\n\
    function hull(data) {\n\
      if (data.length < 3) return [];\n\
      var fx = d3_functor(x), fy = d3_functor(y), i, n = data.length, points = [], flippedPoints = [];\n\
      for (i = 0; i < n; i++) {\n\
        points.push([ +fx.call(this, data[i], i), +fy.call(this, data[i], i), i ]);\n\
      }\n\
      points.sort(d3_geom_hullOrder);\n\
      for (i = 0; i < n; i++) flippedPoints.push([ points[i][0], -points[i][1] ]);\n\
      var upper = d3_geom_hullUpper(points), lower = d3_geom_hullUpper(flippedPoints);\n\
      var skipLeft = lower[0] === upper[0], skipRight = lower[lower.length - 1] === upper[upper.length - 1], polygon = [];\n\
      for (i = upper.length - 1; i >= 0; --i) polygon.push(data[points[upper[i]][2]]);\n\
      for (i = +skipLeft; i < lower.length - skipRight; ++i) polygon.push(data[points[lower[i]][2]]);\n\
      return polygon;\n\
    }\n\
    hull.x = function(_) {\n\
      return arguments.length ? (x = _, hull) : x;\n\
    };\n\
    hull.y = function(_) {\n\
      return arguments.length ? (y = _, hull) : y;\n\
    };\n\
    return hull;\n\
  };\n\
  function d3_geom_hullUpper(points) {\n\
    var n = points.length, hull = [ 0, 1 ], hs = 2;\n\
    for (var i = 2; i < n; i++) {\n\
      while (hs > 1 && d3_cross2d(points[hull[hs - 2]], points[hull[hs - 1]], points[i]) <= 0) --hs;\n\
      hull[hs++] = i;\n\
    }\n\
    return hull.slice(0, hs);\n\
  }\n\
  function d3_geom_hullOrder(a, b) {\n\
    return a[0] - b[0] || a[1] - b[1];\n\
  }\n\
  d3.geom.polygon = function(coordinates) {\n\
    d3_subclass(coordinates, d3_geom_polygonPrototype);\n\
    return coordinates;\n\
  };\n\
  var d3_geom_polygonPrototype = d3.geom.polygon.prototype = [];\n\
  d3_geom_polygonPrototype.area = function() {\n\
    var i = -1, n = this.length, a, b = this[n - 1], area = 0;\n\
    while (++i < n) {\n\
      a = b;\n\
      b = this[i];\n\
      area += a[1] * b[0] - a[0] * b[1];\n\
    }\n\
    return area * .5;\n\
  };\n\
  d3_geom_polygonPrototype.centroid = function(k) {\n\
    var i = -1, n = this.length, x = 0, y = 0, a, b = this[n - 1], c;\n\
    if (!arguments.length) k = -1 / (6 * this.area());\n\
    while (++i < n) {\n\
      a = b;\n\
      b = this[i];\n\
      c = a[0] * b[1] - b[0] * a[1];\n\
      x += (a[0] + b[0]) * c;\n\
      y += (a[1] + b[1]) * c;\n\
    }\n\
    return [ x * k, y * k ];\n\
  };\n\
  d3_geom_polygonPrototype.clip = function(subject) {\n\
    var input, closed = d3_geom_polygonClosed(subject), i = -1, n = this.length - d3_geom_polygonClosed(this), j, m, a = this[n - 1], b, c, d;\n\
    while (++i < n) {\n\
      input = subject.slice();\n\
      subject.length = 0;\n\
      b = this[i];\n\
      c = input[(m = input.length - closed) - 1];\n\
      j = -1;\n\
      while (++j < m) {\n\
        d = input[j];\n\
        if (d3_geom_polygonInside(d, a, b)) {\n\
          if (!d3_geom_polygonInside(c, a, b)) {\n\
            subject.push(d3_geom_polygonIntersect(c, d, a, b));\n\
          }\n\
          subject.push(d);\n\
        } else if (d3_geom_polygonInside(c, a, b)) {\n\
          subject.push(d3_geom_polygonIntersect(c, d, a, b));\n\
        }\n\
        c = d;\n\
      }\n\
      if (closed) subject.push(subject[0]);\n\
      a = b;\n\
    }\n\
    return subject;\n\
  };\n\
  function d3_geom_polygonInside(p, a, b) {\n\
    return (b[0] - a[0]) * (p[1] - a[1]) < (b[1] - a[1]) * (p[0] - a[0]);\n\
  }\n\
  function d3_geom_polygonIntersect(c, d, a, b) {\n\
    var x1 = c[0], x3 = a[0], x21 = d[0] - x1, x43 = b[0] - x3, y1 = c[1], y3 = a[1], y21 = d[1] - y1, y43 = b[1] - y3, ua = (x43 * (y1 - y3) - y43 * (x1 - x3)) / (y43 * x21 - x43 * y21);\n\
    return [ x1 + ua * x21, y1 + ua * y21 ];\n\
  }\n\
  function d3_geom_polygonClosed(coordinates) {\n\
    var a = coordinates[0], b = coordinates[coordinates.length - 1];\n\
    return !(a[0] - b[0] || a[1] - b[1]);\n\
  }\n\
  var d3_geom_voronoiEdges, d3_geom_voronoiCells, d3_geom_voronoiBeaches, d3_geom_voronoiBeachPool = [], d3_geom_voronoiFirstCircle, d3_geom_voronoiCircles, d3_geom_voronoiCirclePool = [];\n\
  function d3_geom_voronoiBeach() {\n\
    d3_geom_voronoiRedBlackNode(this);\n\
    this.edge = this.site = this.circle = null;\n\
  }\n\
  function d3_geom_voronoiCreateBeach(site) {\n\
    var beach = d3_geom_voronoiBeachPool.pop() || new d3_geom_voronoiBeach();\n\
    beach.site = site;\n\
    return beach;\n\
  }\n\
  function d3_geom_voronoiDetachBeach(beach) {\n\
    d3_geom_voronoiDetachCircle(beach);\n\
    d3_geom_voronoiBeaches.remove(beach);\n\
    d3_geom_voronoiBeachPool.push(beach);\n\
    d3_geom_voronoiRedBlackNode(beach);\n\
  }\n\
  function d3_geom_voronoiRemoveBeach(beach) {\n\
    var circle = beach.circle, x = circle.x, y = circle.cy, vertex = {\n\
      x: x,\n\
      y: y\n\
    }, previous = beach.P, next = beach.N, disappearing = [ beach ];\n\
    d3_geom_voronoiDetachBeach(beach);\n\
    var lArc = previous;\n\
    while (lArc.circle && abs(x - lArc.circle.x) < ε && abs(y - lArc.circle.cy) < ε) {\n\
      previous = lArc.P;\n\
      disappearing.unshift(lArc);\n\
      d3_geom_voronoiDetachBeach(lArc);\n\
      lArc = previous;\n\
    }\n\
    disappearing.unshift(lArc);\n\
    d3_geom_voronoiDetachCircle(lArc);\n\
    var rArc = next;\n\
    while (rArc.circle && abs(x - rArc.circle.x) < ε && abs(y - rArc.circle.cy) < ε) {\n\
      next = rArc.N;\n\
      disappearing.push(rArc);\n\
      d3_geom_voronoiDetachBeach(rArc);\n\
      rArc = next;\n\
    }\n\
    disappearing.push(rArc);\n\
    d3_geom_voronoiDetachCircle(rArc);\n\
    var nArcs = disappearing.length, iArc;\n\
    for (iArc = 1; iArc < nArcs; ++iArc) {\n\
      rArc = disappearing[iArc];\n\
      lArc = disappearing[iArc - 1];\n\
      d3_geom_voronoiSetEdgeEnd(rArc.edge, lArc.site, rArc.site, vertex);\n\
    }\n\
    lArc = disappearing[0];\n\
    rArc = disappearing[nArcs - 1];\n\
    rArc.edge = d3_geom_voronoiCreateEdge(lArc.site, rArc.site, null, vertex);\n\
    d3_geom_voronoiAttachCircle(lArc);\n\
    d3_geom_voronoiAttachCircle(rArc);\n\
  }\n\
  function d3_geom_voronoiAddBeach(site) {\n\
    var x = site.x, directrix = site.y, lArc, rArc, dxl, dxr, node = d3_geom_voronoiBeaches._;\n\
    while (node) {\n\
      dxl = d3_geom_voronoiLeftBreakPoint(node, directrix) - x;\n\
      if (dxl > ε) node = node.L; else {\n\
        dxr = x - d3_geom_voronoiRightBreakPoint(node, directrix);\n\
        if (dxr > ε) {\n\
          if (!node.R) {\n\
            lArc = node;\n\
            break;\n\
          }\n\
          node = node.R;\n\
        } else {\n\
          if (dxl > -ε) {\n\
            lArc = node.P;\n\
            rArc = node;\n\
          } else if (dxr > -ε) {\n\
            lArc = node;\n\
            rArc = node.N;\n\
          } else {\n\
            lArc = rArc = node;\n\
          }\n\
          break;\n\
        }\n\
      }\n\
    }\n\
    var newArc = d3_geom_voronoiCreateBeach(site);\n\
    d3_geom_voronoiBeaches.insert(lArc, newArc);\n\
    if (!lArc && !rArc) return;\n\
    if (lArc === rArc) {\n\
      d3_geom_voronoiDetachCircle(lArc);\n\
      rArc = d3_geom_voronoiCreateBeach(lArc.site);\n\
      d3_geom_voronoiBeaches.insert(newArc, rArc);\n\
      newArc.edge = rArc.edge = d3_geom_voronoiCreateEdge(lArc.site, newArc.site);\n\
      d3_geom_voronoiAttachCircle(lArc);\n\
      d3_geom_voronoiAttachCircle(rArc);\n\
      return;\n\
    }\n\
    if (!rArc) {\n\
      newArc.edge = d3_geom_voronoiCreateEdge(lArc.site, newArc.site);\n\
      return;\n\
    }\n\
    d3_geom_voronoiDetachCircle(lArc);\n\
    d3_geom_voronoiDetachCircle(rArc);\n\
    var lSite = lArc.site, ax = lSite.x, ay = lSite.y, bx = site.x - ax, by = site.y - ay, rSite = rArc.site, cx = rSite.x - ax, cy = rSite.y - ay, d = 2 * (bx * cy - by * cx), hb = bx * bx + by * by, hc = cx * cx + cy * cy, vertex = {\n\
      x: (cy * hb - by * hc) / d + ax,\n\
      y: (bx * hc - cx * hb) / d + ay\n\
    };\n\
    d3_geom_voronoiSetEdgeEnd(rArc.edge, lSite, rSite, vertex);\n\
    newArc.edge = d3_geom_voronoiCreateEdge(lSite, site, null, vertex);\n\
    rArc.edge = d3_geom_voronoiCreateEdge(site, rSite, null, vertex);\n\
    d3_geom_voronoiAttachCircle(lArc);\n\
    d3_geom_voronoiAttachCircle(rArc);\n\
  }\n\
  function d3_geom_voronoiLeftBreakPoint(arc, directrix) {\n\
    var site = arc.site, rfocx = site.x, rfocy = site.y, pby2 = rfocy - directrix;\n\
    if (!pby2) return rfocx;\n\
    var lArc = arc.P;\n\
    if (!lArc) return -Infinity;\n\
    site = lArc.site;\n\
    var lfocx = site.x, lfocy = site.y, plby2 = lfocy - directrix;\n\
    if (!plby2) return lfocx;\n\
    var hl = lfocx - rfocx, aby2 = 1 / pby2 - 1 / plby2, b = hl / plby2;\n\
    if (aby2) return (-b + Math.sqrt(b * b - 2 * aby2 * (hl * hl / (-2 * plby2) - lfocy + plby2 / 2 + rfocy - pby2 / 2))) / aby2 + rfocx;\n\
    return (rfocx + lfocx) / 2;\n\
  }\n\
  function d3_geom_voronoiRightBreakPoint(arc, directrix) {\n\
    var rArc = arc.N;\n\
    if (rArc) return d3_geom_voronoiLeftBreakPoint(rArc, directrix);\n\
    var site = arc.site;\n\
    return site.y === directrix ? site.x : Infinity;\n\
  }\n\
  function d3_geom_voronoiCell(site) {\n\
    this.site = site;\n\
    this.edges = [];\n\
  }\n\
  d3_geom_voronoiCell.prototype.prepare = function() {\n\
    var halfEdges = this.edges, iHalfEdge = halfEdges.length, edge;\n\
    while (iHalfEdge--) {\n\
      edge = halfEdges[iHalfEdge].edge;\n\
      if (!edge.b || !edge.a) halfEdges.splice(iHalfEdge, 1);\n\
    }\n\
    halfEdges.sort(d3_geom_voronoiHalfEdgeOrder);\n\
    return halfEdges.length;\n\
  };\n\
  function d3_geom_voronoiCloseCells(extent) {\n\
    var x0 = extent[0][0], x1 = extent[1][0], y0 = extent[0][1], y1 = extent[1][1], x2, y2, x3, y3, cells = d3_geom_voronoiCells, iCell = cells.length, cell, iHalfEdge, halfEdges, nHalfEdges, start, end;\n\
    while (iCell--) {\n\
      cell = cells[iCell];\n\
      if (!cell || !cell.prepare()) continue;\n\
      halfEdges = cell.edges;\n\
      nHalfEdges = halfEdges.length;\n\
      iHalfEdge = 0;\n\
      while (iHalfEdge < nHalfEdges) {\n\
        end = halfEdges[iHalfEdge].end(), x3 = end.x, y3 = end.y;\n\
        start = halfEdges[++iHalfEdge % nHalfEdges].start(), x2 = start.x, y2 = start.y;\n\
        if (abs(x3 - x2) > ε || abs(y3 - y2) > ε) {\n\
          halfEdges.splice(iHalfEdge, 0, new d3_geom_voronoiHalfEdge(d3_geom_voronoiCreateBorderEdge(cell.site, end, abs(x3 - x0) < ε && y1 - y3 > ε ? {\n\
            x: x0,\n\
            y: abs(x2 - x0) < ε ? y2 : y1\n\
          } : abs(y3 - y1) < ε && x1 - x3 > ε ? {\n\
            x: abs(y2 - y1) < ε ? x2 : x1,\n\
            y: y1\n\
          } : abs(x3 - x1) < ε && y3 - y0 > ε ? {\n\
            x: x1,\n\
            y: abs(x2 - x1) < ε ? y2 : y0\n\
          } : abs(y3 - y0) < ε && x3 - x0 > ε ? {\n\
            x: abs(y2 - y0) < ε ? x2 : x0,\n\
            y: y0\n\
          } : null), cell.site, null));\n\
          ++nHalfEdges;\n\
        }\n\
      }\n\
    }\n\
  }\n\
  function d3_geom_voronoiHalfEdgeOrder(a, b) {\n\
    return b.angle - a.angle;\n\
  }\n\
  function d3_geom_voronoiCircle() {\n\
    d3_geom_voronoiRedBlackNode(this);\n\
    this.x = this.y = this.arc = this.site = this.cy = null;\n\
  }\n\
  function d3_geom_voronoiAttachCircle(arc) {\n\
    var lArc = arc.P, rArc = arc.N;\n\
    if (!lArc || !rArc) return;\n\
    var lSite = lArc.site, cSite = arc.site, rSite = rArc.site;\n\
    if (lSite === rSite) return;\n\
    var bx = cSite.x, by = cSite.y, ax = lSite.x - bx, ay = lSite.y - by, cx = rSite.x - bx, cy = rSite.y - by;\n\
    var d = 2 * (ax * cy - ay * cx);\n\
    if (d >= -ε2) return;\n\
    var ha = ax * ax + ay * ay, hc = cx * cx + cy * cy, x = (cy * ha - ay * hc) / d, y = (ax * hc - cx * ha) / d, cy = y + by;\n\
    var circle = d3_geom_voronoiCirclePool.pop() || new d3_geom_voronoiCircle();\n\
    circle.arc = arc;\n\
    circle.site = cSite;\n\
    circle.x = x + bx;\n\
    circle.y = cy + Math.sqrt(x * x + y * y);\n\
    circle.cy = cy;\n\
    arc.circle = circle;\n\
    var before = null, node = d3_geom_voronoiCircles._;\n\
    while (node) {\n\
      if (circle.y < node.y || circle.y === node.y && circle.x <= node.x) {\n\
        if (node.L) node = node.L; else {\n\
          before = node.P;\n\
          break;\n\
        }\n\
      } else {\n\
        if (node.R) node = node.R; else {\n\
          before = node;\n\
          break;\n\
        }\n\
      }\n\
    }\n\
    d3_geom_voronoiCircles.insert(before, circle);\n\
    if (!before) d3_geom_voronoiFirstCircle = circle;\n\
  }\n\
  function d3_geom_voronoiDetachCircle(arc) {\n\
    var circle = arc.circle;\n\
    if (circle) {\n\
      if (!circle.P) d3_geom_voronoiFirstCircle = circle.N;\n\
      d3_geom_voronoiCircles.remove(circle);\n\
      d3_geom_voronoiCirclePool.push(circle);\n\
      d3_geom_voronoiRedBlackNode(circle);\n\
      arc.circle = null;\n\
    }\n\
  }\n\
  function d3_geom_voronoiClipEdges(extent) {\n\
    var edges = d3_geom_voronoiEdges, clip = d3_geom_clipLine(extent[0][0], extent[0][1], extent[1][0], extent[1][1]), i = edges.length, e;\n\
    while (i--) {\n\
      e = edges[i];\n\
      if (!d3_geom_voronoiConnectEdge(e, extent) || !clip(e) || abs(e.a.x - e.b.x) < ε && abs(e.a.y - e.b.y) < ε) {\n\
        e.a = e.b = null;\n\
        edges.splice(i, 1);\n\
      }\n\
    }\n\
  }\n\
  function d3_geom_voronoiConnectEdge(edge, extent) {\n\
    var vb = edge.b;\n\
    if (vb) return true;\n\
    var va = edge.a, x0 = extent[0][0], x1 = extent[1][0], y0 = extent[0][1], y1 = extent[1][1], lSite = edge.l, rSite = edge.r, lx = lSite.x, ly = lSite.y, rx = rSite.x, ry = rSite.y, fx = (lx + rx) / 2, fy = (ly + ry) / 2, fm, fb;\n\
    if (ry === ly) {\n\
      if (fx < x0 || fx >= x1) return;\n\
      if (lx > rx) {\n\
        if (!va) va = {\n\
          x: fx,\n\
          y: y0\n\
        }; else if (va.y >= y1) return;\n\
        vb = {\n\
          x: fx,\n\
          y: y1\n\
        };\n\
      } else {\n\
        if (!va) va = {\n\
          x: fx,\n\
          y: y1\n\
        }; else if (va.y < y0) return;\n\
        vb = {\n\
          x: fx,\n\
          y: y0\n\
        };\n\
      }\n\
    } else {\n\
      fm = (lx - rx) / (ry - ly);\n\
      fb = fy - fm * fx;\n\
      if (fm < -1 || fm > 1) {\n\
        if (lx > rx) {\n\
          if (!va) va = {\n\
            x: (y0 - fb) / fm,\n\
            y: y0\n\
          }; else if (va.y >= y1) return;\n\
          vb = {\n\
            x: (y1 - fb) / fm,\n\
            y: y1\n\
          };\n\
        } else {\n\
          if (!va) va = {\n\
            x: (y1 - fb) / fm,\n\
            y: y1\n\
          }; else if (va.y < y0) return;\n\
          vb = {\n\
            x: (y0 - fb) / fm,\n\
            y: y0\n\
          };\n\
        }\n\
      } else {\n\
        if (ly < ry) {\n\
          if (!va) va = {\n\
            x: x0,\n\
            y: fm * x0 + fb\n\
          }; else if (va.x >= x1) return;\n\
          vb = {\n\
            x: x1,\n\
            y: fm * x1 + fb\n\
          };\n\
        } else {\n\
          if (!va) va = {\n\
            x: x1,\n\
            y: fm * x1 + fb\n\
          }; else if (va.x < x0) return;\n\
          vb = {\n\
            x: x0,\n\
            y: fm * x0 + fb\n\
          };\n\
        }\n\
      }\n\
    }\n\
    edge.a = va;\n\
    edge.b = vb;\n\
    return true;\n\
  }\n\
  function d3_geom_voronoiEdge(lSite, rSite) {\n\
    this.l = lSite;\n\
    this.r = rSite;\n\
    this.a = this.b = null;\n\
  }\n\
  function d3_geom_voronoiCreateEdge(lSite, rSite, va, vb) {\n\
    var edge = new d3_geom_voronoiEdge(lSite, rSite);\n\
    d3_geom_voronoiEdges.push(edge);\n\
    if (va) d3_geom_voronoiSetEdgeEnd(edge, lSite, rSite, va);\n\
    if (vb) d3_geom_voronoiSetEdgeEnd(edge, rSite, lSite, vb);\n\
    d3_geom_voronoiCells[lSite.i].edges.push(new d3_geom_voronoiHalfEdge(edge, lSite, rSite));\n\
    d3_geom_voronoiCells[rSite.i].edges.push(new d3_geom_voronoiHalfEdge(edge, rSite, lSite));\n\
    return edge;\n\
  }\n\
  function d3_geom_voronoiCreateBorderEdge(lSite, va, vb) {\n\
    var edge = new d3_geom_voronoiEdge(lSite, null);\n\
    edge.a = va;\n\
    edge.b = vb;\n\
    d3_geom_voronoiEdges.push(edge);\n\
    return edge;\n\
  }\n\
  function d3_geom_voronoiSetEdgeEnd(edge, lSite, rSite, vertex) {\n\
    if (!edge.a && !edge.b) {\n\
      edge.a = vertex;\n\
      edge.l = lSite;\n\
      edge.r = rSite;\n\
    } else if (edge.l === rSite) {\n\
      edge.b = vertex;\n\
    } else {\n\
      edge.a = vertex;\n\
    }\n\
  }\n\
  function d3_geom_voronoiHalfEdge(edge, lSite, rSite) {\n\
    var va = edge.a, vb = edge.b;\n\
    this.edge = edge;\n\
    this.site = lSite;\n\
    this.angle = rSite ? Math.atan2(rSite.y - lSite.y, rSite.x - lSite.x) : edge.l === lSite ? Math.atan2(vb.x - va.x, va.y - vb.y) : Math.atan2(va.x - vb.x, vb.y - va.y);\n\
  }\n\
  d3_geom_voronoiHalfEdge.prototype = {\n\
    start: function() {\n\
      return this.edge.l === this.site ? this.edge.a : this.edge.b;\n\
    },\n\
    end: function() {\n\
      return this.edge.l === this.site ? this.edge.b : this.edge.a;\n\
    }\n\
  };\n\
  function d3_geom_voronoiRedBlackTree() {\n\
    this._ = null;\n\
  }\n\
  function d3_geom_voronoiRedBlackNode(node) {\n\
    node.U = node.C = node.L = node.R = node.P = node.N = null;\n\
  }\n\
  d3_geom_voronoiRedBlackTree.prototype = {\n\
    insert: function(after, node) {\n\
      var parent, grandpa, uncle;\n\
      if (after) {\n\
        node.P = after;\n\
        node.N = after.N;\n\
        if (after.N) after.N.P = node;\n\
        after.N = node;\n\
        if (after.R) {\n\
          after = after.R;\n\
          while (after.L) after = after.L;\n\
          after.L = node;\n\
        } else {\n\
          after.R = node;\n\
        }\n\
        parent = after;\n\
      } else if (this._) {\n\
        after = d3_geom_voronoiRedBlackFirst(this._);\n\
        node.P = null;\n\
        node.N = after;\n\
        after.P = after.L = node;\n\
        parent = after;\n\
      } else {\n\
        node.P = node.N = null;\n\
        this._ = node;\n\
        parent = null;\n\
      }\n\
      node.L = node.R = null;\n\
      node.U = parent;\n\
      node.C = true;\n\
      after = node;\n\
      while (parent && parent.C) {\n\
        grandpa = parent.U;\n\
        if (parent === grandpa.L) {\n\
          uncle = grandpa.R;\n\
          if (uncle && uncle.C) {\n\
            parent.C = uncle.C = false;\n\
            grandpa.C = true;\n\
            after = grandpa;\n\
          } else {\n\
            if (after === parent.R) {\n\
              d3_geom_voronoiRedBlackRotateLeft(this, parent);\n\
              after = parent;\n\
              parent = after.U;\n\
            }\n\
            parent.C = false;\n\
            grandpa.C = true;\n\
            d3_geom_voronoiRedBlackRotateRight(this, grandpa);\n\
          }\n\
        } else {\n\
          uncle = grandpa.L;\n\
          if (uncle && uncle.C) {\n\
            parent.C = uncle.C = false;\n\
            grandpa.C = true;\n\
            after = grandpa;\n\
          } else {\n\
            if (after === parent.L) {\n\
              d3_geom_voronoiRedBlackRotateRight(this, parent);\n\
              after = parent;\n\
              parent = after.U;\n\
            }\n\
            parent.C = false;\n\
            grandpa.C = true;\n\
            d3_geom_voronoiRedBlackRotateLeft(this, grandpa);\n\
          }\n\
        }\n\
        parent = after.U;\n\
      }\n\
      this._.C = false;\n\
    },\n\
    remove: function(node) {\n\
      if (node.N) node.N.P = node.P;\n\
      if (node.P) node.P.N = node.N;\n\
      node.N = node.P = null;\n\
      var parent = node.U, sibling, left = node.L, right = node.R, next, red;\n\
      if (!left) next = right; else if (!right) next = left; else next = d3_geom_voronoiRedBlackFirst(right);\n\
      if (parent) {\n\
        if (parent.L === node) parent.L = next; else parent.R = next;\n\
      } else {\n\
        this._ = next;\n\
      }\n\
      if (left && right) {\n\
        red = next.C;\n\
        next.C = node.C;\n\
        next.L = left;\n\
        left.U = next;\n\
        if (next !== right) {\n\
          parent = next.U;\n\
          next.U = node.U;\n\
          node = next.R;\n\
          parent.L = node;\n\
          next.R = right;\n\
          right.U = next;\n\
        } else {\n\
          next.U = parent;\n\
          parent = next;\n\
          node = next.R;\n\
        }\n\
      } else {\n\
        red = node.C;\n\
        node = next;\n\
      }\n\
      if (node) node.U = parent;\n\
      if (red) return;\n\
      if (node && node.C) {\n\
        node.C = false;\n\
        return;\n\
      }\n\
      do {\n\
        if (node === this._) break;\n\
        if (node === parent.L) {\n\
          sibling = parent.R;\n\
          if (sibling.C) {\n\
            sibling.C = false;\n\
            parent.C = true;\n\
            d3_geom_voronoiRedBlackRotateLeft(this, parent);\n\
            sibling = parent.R;\n\
          }\n\
          if (sibling.L && sibling.L.C || sibling.R && sibling.R.C) {\n\
            if (!sibling.R || !sibling.R.C) {\n\
              sibling.L.C = false;\n\
              sibling.C = true;\n\
              d3_geom_voronoiRedBlackRotateRight(this, sibling);\n\
              sibling = parent.R;\n\
            }\n\
            sibling.C = parent.C;\n\
            parent.C = sibling.R.C = false;\n\
            d3_geom_voronoiRedBlackRotateLeft(this, parent);\n\
            node = this._;\n\
            break;\n\
          }\n\
        } else {\n\
          sibling = parent.L;\n\
          if (sibling.C) {\n\
            sibling.C = false;\n\
            parent.C = true;\n\
            d3_geom_voronoiRedBlackRotateRight(this, parent);\n\
            sibling = parent.L;\n\
          }\n\
          if (sibling.L && sibling.L.C || sibling.R && sibling.R.C) {\n\
            if (!sibling.L || !sibling.L.C) {\n\
              sibling.R.C = false;\n\
              sibling.C = true;\n\
              d3_geom_voronoiRedBlackRotateLeft(this, sibling);\n\
              sibling = parent.L;\n\
            }\n\
            sibling.C = parent.C;\n\
            parent.C = sibling.L.C = false;\n\
            d3_geom_voronoiRedBlackRotateRight(this, parent);\n\
            node = this._;\n\
            break;\n\
          }\n\
        }\n\
        sibling.C = true;\n\
        node = parent;\n\
        parent = parent.U;\n\
      } while (!node.C);\n\
      if (node) node.C = false;\n\
    }\n\
  };\n\
  function d3_geom_voronoiRedBlackRotateLeft(tree, node) {\n\
    var p = node, q = node.R, parent = p.U;\n\
    if (parent) {\n\
      if (parent.L === p) parent.L = q; else parent.R = q;\n\
    } else {\n\
      tree._ = q;\n\
    }\n\
    q.U = parent;\n\
    p.U = q;\n\
    p.R = q.L;\n\
    if (p.R) p.R.U = p;\n\
    q.L = p;\n\
  }\n\
  function d3_geom_voronoiRedBlackRotateRight(tree, node) {\n\
    var p = node, q = node.L, parent = p.U;\n\
    if (parent) {\n\
      if (parent.L === p) parent.L = q; else parent.R = q;\n\
    } else {\n\
      tree._ = q;\n\
    }\n\
    q.U = parent;\n\
    p.U = q;\n\
    p.L = q.R;\n\
    if (p.L) p.L.U = p;\n\
    q.R = p;\n\
  }\n\
  function d3_geom_voronoiRedBlackFirst(node) {\n\
    while (node.L) node = node.L;\n\
    return node;\n\
  }\n\
  function d3_geom_voronoi(sites, bbox) {\n\
    var site = sites.sort(d3_geom_voronoiVertexOrder).pop(), x0, y0, circle;\n\
    d3_geom_voronoiEdges = [];\n\
    d3_geom_voronoiCells = new Array(sites.length);\n\
    d3_geom_voronoiBeaches = new d3_geom_voronoiRedBlackTree();\n\
    d3_geom_voronoiCircles = new d3_geom_voronoiRedBlackTree();\n\
    while (true) {\n\
      circle = d3_geom_voronoiFirstCircle;\n\
      if (site && (!circle || site.y < circle.y || site.y === circle.y && site.x < circle.x)) {\n\
        if (site.x !== x0 || site.y !== y0) {\n\
          d3_geom_voronoiCells[site.i] = new d3_geom_voronoiCell(site);\n\
          d3_geom_voronoiAddBeach(site);\n\
          x0 = site.x, y0 = site.y;\n\
        }\n\
        site = sites.pop();\n\
      } else if (circle) {\n\
        d3_geom_voronoiRemoveBeach(circle.arc);\n\
      } else {\n\
        break;\n\
      }\n\
    }\n\
    if (bbox) d3_geom_voronoiClipEdges(bbox), d3_geom_voronoiCloseCells(bbox);\n\
    var diagram = {\n\
      cells: d3_geom_voronoiCells,\n\
      edges: d3_geom_voronoiEdges\n\
    };\n\
    d3_geom_voronoiBeaches = d3_geom_voronoiCircles = d3_geom_voronoiEdges = d3_geom_voronoiCells = null;\n\
    return diagram;\n\
  }\n\
  function d3_geom_voronoiVertexOrder(a, b) {\n\
    return b.y - a.y || b.x - a.x;\n\
  }\n\
  d3.geom.voronoi = function(points) {\n\
    var x = d3_geom_pointX, y = d3_geom_pointY, fx = x, fy = y, clipExtent = d3_geom_voronoiClipExtent;\n\
    if (points) return voronoi(points);\n\
    function voronoi(data) {\n\
      var polygons = new Array(data.length), x0 = clipExtent[0][0], y0 = clipExtent[0][1], x1 = clipExtent[1][0], y1 = clipExtent[1][1];\n\
      d3_geom_voronoi(sites(data), clipExtent).cells.forEach(function(cell, i) {\n\
        var edges = cell.edges, site = cell.site, polygon = polygons[i] = edges.length ? edges.map(function(e) {\n\
          var s = e.start();\n\
          return [ s.x, s.y ];\n\
        }) : site.x >= x0 && site.x <= x1 && site.y >= y0 && site.y <= y1 ? [ [ x0, y1 ], [ x1, y1 ], [ x1, y0 ], [ x0, y0 ] ] : [];\n\
        polygon.point = data[i];\n\
      });\n\
      return polygons;\n\
    }\n\
    function sites(data) {\n\
      return data.map(function(d, i) {\n\
        return {\n\
          x: Math.round(fx(d, i) / ε) * ε,\n\
          y: Math.round(fy(d, i) / ε) * ε,\n\
          i: i\n\
        };\n\
      });\n\
    }\n\
    voronoi.links = function(data) {\n\
      return d3_geom_voronoi(sites(data)).edges.filter(function(edge) {\n\
        return edge.l && edge.r;\n\
      }).map(function(edge) {\n\
        return {\n\
          source: data[edge.l.i],\n\
          target: data[edge.r.i]\n\
        };\n\
      });\n\
    };\n\
    voronoi.triangles = function(data) {\n\
      var triangles = [];\n\
      d3_geom_voronoi(sites(data)).cells.forEach(function(cell, i) {\n\
        var site = cell.site, edges = cell.edges.sort(d3_geom_voronoiHalfEdgeOrder), j = -1, m = edges.length, e0, s0, e1 = edges[m - 1].edge, s1 = e1.l === site ? e1.r : e1.l;\n\
        while (++j < m) {\n\
          e0 = e1;\n\
          s0 = s1;\n\
          e1 = edges[j].edge;\n\
          s1 = e1.l === site ? e1.r : e1.l;\n\
          if (i < s0.i && i < s1.i && d3_geom_voronoiTriangleArea(site, s0, s1) < 0) {\n\
            triangles.push([ data[i], data[s0.i], data[s1.i] ]);\n\
          }\n\
        }\n\
      });\n\
      return triangles;\n\
    };\n\
    voronoi.x = function(_) {\n\
      return arguments.length ? (fx = d3_functor(x = _), voronoi) : x;\n\
    };\n\
    voronoi.y = function(_) {\n\
      return arguments.length ? (fy = d3_functor(y = _), voronoi) : y;\n\
    };\n\
    voronoi.clipExtent = function(_) {\n\
      if (!arguments.length) return clipExtent === d3_geom_voronoiClipExtent ? null : clipExtent;\n\
      clipExtent = _ == null ? d3_geom_voronoiClipExtent : _;\n\
      return voronoi;\n\
    };\n\
    voronoi.size = function(_) {\n\
      if (!arguments.length) return clipExtent === d3_geom_voronoiClipExtent ? null : clipExtent && clipExtent[1];\n\
      return voronoi.clipExtent(_ && [ [ 0, 0 ], _ ]);\n\
    };\n\
    return voronoi;\n\
  };\n\
  var d3_geom_voronoiClipExtent = [ [ -1e6, -1e6 ], [ 1e6, 1e6 ] ];\n\
  function d3_geom_voronoiTriangleArea(a, b, c) {\n\
    return (a.x - c.x) * (b.y - a.y) - (a.x - b.x) * (c.y - a.y);\n\
  }\n\
  d3.geom.delaunay = function(vertices) {\n\
    return d3.geom.voronoi().triangles(vertices);\n\
  };\n\
  d3.geom.quadtree = function(points, x1, y1, x2, y2) {\n\
    var x = d3_geom_pointX, y = d3_geom_pointY, compat;\n\
    if (compat = arguments.length) {\n\
      x = d3_geom_quadtreeCompatX;\n\
      y = d3_geom_quadtreeCompatY;\n\
      if (compat === 3) {\n\
        y2 = y1;\n\
        x2 = x1;\n\
        y1 = x1 = 0;\n\
      }\n\
      return quadtree(points);\n\
    }\n\
    function quadtree(data) {\n\
      var d, fx = d3_functor(x), fy = d3_functor(y), xs, ys, i, n, x1_, y1_, x2_, y2_;\n\
      if (x1 != null) {\n\
        x1_ = x1, y1_ = y1, x2_ = x2, y2_ = y2;\n\
      } else {\n\
        x2_ = y2_ = -(x1_ = y1_ = Infinity);\n\
        xs = [], ys = [];\n\
        n = data.length;\n\
        if (compat) for (i = 0; i < n; ++i) {\n\
          d = data[i];\n\
          if (d.x < x1_) x1_ = d.x;\n\
          if (d.y < y1_) y1_ = d.y;\n\
          if (d.x > x2_) x2_ = d.x;\n\
          if (d.y > y2_) y2_ = d.y;\n\
          xs.push(d.x);\n\
          ys.push(d.y);\n\
        } else for (i = 0; i < n; ++i) {\n\
          var x_ = +fx(d = data[i], i), y_ = +fy(d, i);\n\
          if (x_ < x1_) x1_ = x_;\n\
          if (y_ < y1_) y1_ = y_;\n\
          if (x_ > x2_) x2_ = x_;\n\
          if (y_ > y2_) y2_ = y_;\n\
          xs.push(x_);\n\
          ys.push(y_);\n\
        }\n\
      }\n\
      var dx = x2_ - x1_, dy = y2_ - y1_;\n\
      if (dx > dy) y2_ = y1_ + dx; else x2_ = x1_ + dy;\n\
      function insert(n, d, x, y, x1, y1, x2, y2) {\n\
        if (isNaN(x) || isNaN(y)) return;\n\
        if (n.leaf) {\n\
          var nx = n.x, ny = n.y;\n\
          if (nx != null) {\n\
            if (abs(nx - x) + abs(ny - y) < .01) {\n\
              insertChild(n, d, x, y, x1, y1, x2, y2);\n\
            } else {\n\
              var nPoint = n.point;\n\
              n.x = n.y = n.point = null;\n\
              insertChild(n, nPoint, nx, ny, x1, y1, x2, y2);\n\
              insertChild(n, d, x, y, x1, y1, x2, y2);\n\
            }\n\
          } else {\n\
            n.x = x, n.y = y, n.point = d;\n\
          }\n\
        } else {\n\
          insertChild(n, d, x, y, x1, y1, x2, y2);\n\
        }\n\
      }\n\
      function insertChild(n, d, x, y, x1, y1, x2, y2) {\n\
        var sx = (x1 + x2) * .5, sy = (y1 + y2) * .5, right = x >= sx, bottom = y >= sy, i = (bottom << 1) + right;\n\
        n.leaf = false;\n\
        n = n.nodes[i] || (n.nodes[i] = d3_geom_quadtreeNode());\n\
        if (right) x1 = sx; else x2 = sx;\n\
        if (bottom) y1 = sy; else y2 = sy;\n\
        insert(n, d, x, y, x1, y1, x2, y2);\n\
      }\n\
      var root = d3_geom_quadtreeNode();\n\
      root.add = function(d) {\n\
        insert(root, d, +fx(d, ++i), +fy(d, i), x1_, y1_, x2_, y2_);\n\
      };\n\
      root.visit = function(f) {\n\
        d3_geom_quadtreeVisit(f, root, x1_, y1_, x2_, y2_);\n\
      };\n\
      i = -1;\n\
      if (x1 == null) {\n\
        while (++i < n) {\n\
          insert(root, data[i], xs[i], ys[i], x1_, y1_, x2_, y2_);\n\
        }\n\
        --i;\n\
      } else data.forEach(root.add);\n\
      xs = ys = data = d = null;\n\
      return root;\n\
    }\n\
    quadtree.x = function(_) {\n\
      return arguments.length ? (x = _, quadtree) : x;\n\
    };\n\
    quadtree.y = function(_) {\n\
      return arguments.length ? (y = _, quadtree) : y;\n\
    };\n\
    quadtree.extent = function(_) {\n\
      if (!arguments.length) return x1 == null ? null : [ [ x1, y1 ], [ x2, y2 ] ];\n\
      if (_ == null) x1 = y1 = x2 = y2 = null; else x1 = +_[0][0], y1 = +_[0][1], x2 = +_[1][0], \n\
      y2 = +_[1][1];\n\
      return quadtree;\n\
    };\n\
    quadtree.size = function(_) {\n\
      if (!arguments.length) return x1 == null ? null : [ x2 - x1, y2 - y1 ];\n\
      if (_ == null) x1 = y1 = x2 = y2 = null; else x1 = y1 = 0, x2 = +_[0], y2 = +_[1];\n\
      return quadtree;\n\
    };\n\
    return quadtree;\n\
  };\n\
  function d3_geom_quadtreeCompatX(d) {\n\
    return d.x;\n\
  }\n\
  function d3_geom_quadtreeCompatY(d) {\n\
    return d.y;\n\
  }\n\
  function d3_geom_quadtreeNode() {\n\
    return {\n\
      leaf: true,\n\
      nodes: [],\n\
      point: null,\n\
      x: null,\n\
      y: null\n\
    };\n\
  }\n\
  function d3_geom_quadtreeVisit(f, node, x1, y1, x2, y2) {\n\
    if (!f(node, x1, y1, x2, y2)) {\n\
      var sx = (x1 + x2) * .5, sy = (y1 + y2) * .5, children = node.nodes;\n\
      if (children[0]) d3_geom_quadtreeVisit(f, children[0], x1, y1, sx, sy);\n\
      if (children[1]) d3_geom_quadtreeVisit(f, children[1], sx, y1, x2, sy);\n\
      if (children[2]) d3_geom_quadtreeVisit(f, children[2], x1, sy, sx, y2);\n\
      if (children[3]) d3_geom_quadtreeVisit(f, children[3], sx, sy, x2, y2);\n\
    }\n\
  }\n\
  d3.interpolateRgb = d3_interpolateRgb;\n\
  function d3_interpolateRgb(a, b) {\n\
    a = d3.rgb(a);\n\
    b = d3.rgb(b);\n\
    var ar = a.r, ag = a.g, ab = a.b, br = b.r - ar, bg = b.g - ag, bb = b.b - ab;\n\
    return function(t) {\n\
      return \"#\" + d3_rgb_hex(Math.round(ar + br * t)) + d3_rgb_hex(Math.round(ag + bg * t)) + d3_rgb_hex(Math.round(ab + bb * t));\n\
    };\n\
  }\n\
  d3.interpolateObject = d3_interpolateObject;\n\
  function d3_interpolateObject(a, b) {\n\
    var i = {}, c = {}, k;\n\
    for (k in a) {\n\
      if (k in b) {\n\
        i[k] = d3_interpolate(a[k], b[k]);\n\
      } else {\n\
        c[k] = a[k];\n\
      }\n\
    }\n\
    for (k in b) {\n\
      if (!(k in a)) {\n\
        c[k] = b[k];\n\
      }\n\
    }\n\
    return function(t) {\n\
      for (k in i) c[k] = i[k](t);\n\
      return c;\n\
    };\n\
  }\n\
  d3.interpolateNumber = d3_interpolateNumber;\n\
  function d3_interpolateNumber(a, b) {\n\
    b -= a = +a;\n\
    return function(t) {\n\
      return a + b * t;\n\
    };\n\
  }\n\
  d3.interpolateString = d3_interpolateString;\n\
  function d3_interpolateString(a, b) {\n\
    var bi = d3_interpolate_numberA.lastIndex = d3_interpolate_numberB.lastIndex = 0, am, bm, bs, i = -1, s = [], q = [];\n\
    a = a + \"\", b = b + \"\";\n\
    while ((am = d3_interpolate_numberA.exec(a)) && (bm = d3_interpolate_numberB.exec(b))) {\n\
      if ((bs = bm.index) > bi) {\n\
        bs = b.substring(bi, bs);\n\
        if (s[i]) s[i] += bs; else s[++i] = bs;\n\
      }\n\
      if ((am = am[0]) === (bm = bm[0])) {\n\
        if (s[i]) s[i] += bm; else s[++i] = bm;\n\
      } else {\n\
        s[++i] = null;\n\
        q.push({\n\
          i: i,\n\
          x: d3_interpolateNumber(am, bm)\n\
        });\n\
      }\n\
      bi = d3_interpolate_numberB.lastIndex;\n\
    }\n\
    if (bi < b.length) {\n\
      bs = b.substring(bi);\n\
      if (s[i]) s[i] += bs; else s[++i] = bs;\n\
    }\n\
    return s.length < 2 ? q[0] ? (b = q[0].x, function(t) {\n\
      return b(t) + \"\";\n\
    }) : function() {\n\
      return b;\n\
    } : (b = q.length, function(t) {\n\
      for (var i = 0, o; i < b; ++i) s[(o = q[i]).i] = o.x(t);\n\
      return s.join(\"\");\n\
    });\n\
  }\n\
  var d3_interpolate_numberA = /[-+]?(?:\\d+\\.?\\d*|\\.?\\d+)(?:[eE][-+]?\\d+)?/g, d3_interpolate_numberB = new RegExp(d3_interpolate_numberA.source, \"g\");\n\
  d3.interpolate = d3_interpolate;\n\
  function d3_interpolate(a, b) {\n\
    var i = d3.interpolators.length, f;\n\
    while (--i >= 0 && !(f = d3.interpolators[i](a, b))) ;\n\
    return f;\n\
  }\n\
  d3.interpolators = [ function(a, b) {\n\
    var t = typeof b;\n\
    return (t === \"string\" ? d3_rgb_names.has(b) || /^(#|rgb\\(|hsl\\()/.test(b) ? d3_interpolateRgb : d3_interpolateString : b instanceof d3_Color ? d3_interpolateRgb : Array.isArray(b) ? d3_interpolateArray : t === \"object\" && isNaN(b) ? d3_interpolateObject : d3_interpolateNumber)(a, b);\n\
  } ];\n\
  d3.interpolateArray = d3_interpolateArray;\n\
  function d3_interpolateArray(a, b) {\n\
    var x = [], c = [], na = a.length, nb = b.length, n0 = Math.min(a.length, b.length), i;\n\
    for (i = 0; i < n0; ++i) x.push(d3_interpolate(a[i], b[i]));\n\
    for (;i < na; ++i) c[i] = a[i];\n\
    for (;i < nb; ++i) c[i] = b[i];\n\
    return function(t) {\n\
      for (i = 0; i < n0; ++i) c[i] = x[i](t);\n\
      return c;\n\
    };\n\
  }\n\
  var d3_ease_default = function() {\n\
    return d3_identity;\n\
  };\n\
  var d3_ease = d3.map({\n\
    linear: d3_ease_default,\n\
    poly: d3_ease_poly,\n\
    quad: function() {\n\
      return d3_ease_quad;\n\
    },\n\
    cubic: function() {\n\
      return d3_ease_cubic;\n\
    },\n\
    sin: function() {\n\
      return d3_ease_sin;\n\
    },\n\
    exp: function() {\n\
      return d3_ease_exp;\n\
    },\n\
    circle: function() {\n\
      return d3_ease_circle;\n\
    },\n\
    elastic: d3_ease_elastic,\n\
    back: d3_ease_back,\n\
    bounce: function() {\n\
      return d3_ease_bounce;\n\
    }\n\
  });\n\
  var d3_ease_mode = d3.map({\n\
    \"in\": d3_identity,\n\
    out: d3_ease_reverse,\n\
    \"in-out\": d3_ease_reflect,\n\
    \"out-in\": function(f) {\n\
      return d3_ease_reflect(d3_ease_reverse(f));\n\
    }\n\
  });\n\
  d3.ease = function(name) {\n\
    var i = name.indexOf(\"-\"), t = i >= 0 ? name.substring(0, i) : name, m = i >= 0 ? name.substring(i + 1) : \"in\";\n\
    t = d3_ease.get(t) || d3_ease_default;\n\
    m = d3_ease_mode.get(m) || d3_identity;\n\
    return d3_ease_clamp(m(t.apply(null, d3_arraySlice.call(arguments, 1))));\n\
  };\n\
  function d3_ease_clamp(f) {\n\
    return function(t) {\n\
      return t <= 0 ? 0 : t >= 1 ? 1 : f(t);\n\
    };\n\
  }\n\
  function d3_ease_reverse(f) {\n\
    return function(t) {\n\
      return 1 - f(1 - t);\n\
    };\n\
  }\n\
  function d3_ease_reflect(f) {\n\
    return function(t) {\n\
      return .5 * (t < .5 ? f(2 * t) : 2 - f(2 - 2 * t));\n\
    };\n\
  }\n\
  function d3_ease_quad(t) {\n\
    return t * t;\n\
  }\n\
  function d3_ease_cubic(t) {\n\
    return t * t * t;\n\
  }\n\
  function d3_ease_cubicInOut(t) {\n\
    if (t <= 0) return 0;\n\
    if (t >= 1) return 1;\n\
    var t2 = t * t, t3 = t2 * t;\n\
    return 4 * (t < .5 ? t3 : 3 * (t - t2) + t3 - .75);\n\
  }\n\
  function d3_ease_poly(e) {\n\
    return function(t) {\n\
      return Math.pow(t, e);\n\
    };\n\
  }\n\
  function d3_ease_sin(t) {\n\
    return 1 - Math.cos(t * halfπ);\n\
  }\n\
  function d3_ease_exp(t) {\n\
    return Math.pow(2, 10 * (t - 1));\n\
  }\n\
  function d3_ease_circle(t) {\n\
    return 1 - Math.sqrt(1 - t * t);\n\
  }\n\
  function d3_ease_elastic(a, p) {\n\
    var s;\n\
    if (arguments.length < 2) p = .45;\n\
    if (arguments.length) s = p / τ * Math.asin(1 / a); else a = 1, s = p / 4;\n\
    return function(t) {\n\
      return 1 + a * Math.pow(2, -10 * t) * Math.sin((t - s) * τ / p);\n\
    };\n\
  }\n\
  function d3_ease_back(s) {\n\
    if (!s) s = 1.70158;\n\
    return function(t) {\n\
      return t * t * ((s + 1) * t - s);\n\
    };\n\
  }\n\
  function d3_ease_bounce(t) {\n\
    return t < 1 / 2.75 ? 7.5625 * t * t : t < 2 / 2.75 ? 7.5625 * (t -= 1.5 / 2.75) * t + .75 : t < 2.5 / 2.75 ? 7.5625 * (t -= 2.25 / 2.75) * t + .9375 : 7.5625 * (t -= 2.625 / 2.75) * t + .984375;\n\
  }\n\
  d3.interpolateHcl = d3_interpolateHcl;\n\
  function d3_interpolateHcl(a, b) {\n\
    a = d3.hcl(a);\n\
    b = d3.hcl(b);\n\
    var ah = a.h, ac = a.c, al = a.l, bh = b.h - ah, bc = b.c - ac, bl = b.l - al;\n\
    if (isNaN(bc)) bc = 0, ac = isNaN(ac) ? b.c : ac;\n\
    if (isNaN(bh)) bh = 0, ah = isNaN(ah) ? b.h : ah; else if (bh > 180) bh -= 360; else if (bh < -180) bh += 360;\n\
    return function(t) {\n\
      return d3_hcl_lab(ah + bh * t, ac + bc * t, al + bl * t) + \"\";\n\
    };\n\
  }\n\
  d3.interpolateHsl = d3_interpolateHsl;\n\
  function d3_interpolateHsl(a, b) {\n\
    a = d3.hsl(a);\n\
    b = d3.hsl(b);\n\
    var ah = a.h, as = a.s, al = a.l, bh = b.h - ah, bs = b.s - as, bl = b.l - al;\n\
    if (isNaN(bs)) bs = 0, as = isNaN(as) ? b.s : as;\n\
    if (isNaN(bh)) bh = 0, ah = isNaN(ah) ? b.h : ah; else if (bh > 180) bh -= 360; else if (bh < -180) bh += 360;\n\
    return function(t) {\n\
      return d3_hsl_rgb(ah + bh * t, as + bs * t, al + bl * t) + \"\";\n\
    };\n\
  }\n\
  d3.interpolateLab = d3_interpolateLab;\n\
  function d3_interpolateLab(a, b) {\n\
    a = d3.lab(a);\n\
    b = d3.lab(b);\n\
    var al = a.l, aa = a.a, ab = a.b, bl = b.l - al, ba = b.a - aa, bb = b.b - ab;\n\
    return function(t) {\n\
      return d3_lab_rgb(al + bl * t, aa + ba * t, ab + bb * t) + \"\";\n\
    };\n\
  }\n\
  d3.interpolateRound = d3_interpolateRound;\n\
  function d3_interpolateRound(a, b) {\n\
    b -= a;\n\
    return function(t) {\n\
      return Math.round(a + b * t);\n\
    };\n\
  }\n\
  d3.transform = function(string) {\n\
    var g = d3_document.createElementNS(d3.ns.prefix.svg, \"g\");\n\
    return (d3.transform = function(string) {\n\
      if (string != null) {\n\
        g.setAttribute(\"transform\", string);\n\
        var t = g.transform.baseVal.consolidate();\n\
      }\n\
      return new d3_transform(t ? t.matrix : d3_transformIdentity);\n\
    })(string);\n\
  };\n\
  function d3_transform(m) {\n\
    var r0 = [ m.a, m.b ], r1 = [ m.c, m.d ], kx = d3_transformNormalize(r0), kz = d3_transformDot(r0, r1), ky = d3_transformNormalize(d3_transformCombine(r1, r0, -kz)) || 0;\n\
    if (r0[0] * r1[1] < r1[0] * r0[1]) {\n\
      r0[0] *= -1;\n\
      r0[1] *= -1;\n\
      kx *= -1;\n\
      kz *= -1;\n\
    }\n\
    this.rotate = (kx ? Math.atan2(r0[1], r0[0]) : Math.atan2(-r1[0], r1[1])) * d3_degrees;\n\
    this.translate = [ m.e, m.f ];\n\
    this.scale = [ kx, ky ];\n\
    this.skew = ky ? Math.atan2(kz, ky) * d3_degrees : 0;\n\
  }\n\
  d3_transform.prototype.toString = function() {\n\
    return \"translate(\" + this.translate + \")rotate(\" + this.rotate + \")skewX(\" + this.skew + \")scale(\" + this.scale + \")\";\n\
  };\n\
  function d3_transformDot(a, b) {\n\
    return a[0] * b[0] + a[1] * b[1];\n\
  }\n\
  function d3_transformNormalize(a) {\n\
    var k = Math.sqrt(d3_transformDot(a, a));\n\
    if (k) {\n\
      a[0] /= k;\n\
      a[1] /= k;\n\
    }\n\
    return k;\n\
  }\n\
  function d3_transformCombine(a, b, k) {\n\
    a[0] += k * b[0];\n\
    a[1] += k * b[1];\n\
    return a;\n\
  }\n\
  var d3_transformIdentity = {\n\
    a: 1,\n\
    b: 0,\n\
    c: 0,\n\
    d: 1,\n\
    e: 0,\n\
    f: 0\n\
  };\n\
  d3.interpolateTransform = d3_interpolateTransform;\n\
  function d3_interpolateTransform(a, b) {\n\
    var s = [], q = [], n, A = d3.transform(a), B = d3.transform(b), ta = A.translate, tb = B.translate, ra = A.rotate, rb = B.rotate, wa = A.skew, wb = B.skew, ka = A.scale, kb = B.scale;\n\
    if (ta[0] != tb[0] || ta[1] != tb[1]) {\n\
      s.push(\"translate(\", null, \",\", null, \")\");\n\
      q.push({\n\
        i: 1,\n\
        x: d3_interpolateNumber(ta[0], tb[0])\n\
      }, {\n\
        i: 3,\n\
        x: d3_interpolateNumber(ta[1], tb[1])\n\
      });\n\
    } else if (tb[0] || tb[1]) {\n\
      s.push(\"translate(\" + tb + \")\");\n\
    } else {\n\
      s.push(\"\");\n\
    }\n\
    if (ra != rb) {\n\
      if (ra - rb > 180) rb += 360; else if (rb - ra > 180) ra += 360;\n\
      q.push({\n\
        i: s.push(s.pop() + \"rotate(\", null, \")\") - 2,\n\
        x: d3_interpolateNumber(ra, rb)\n\
      });\n\
    } else if (rb) {\n\
      s.push(s.pop() + \"rotate(\" + rb + \")\");\n\
    }\n\
    if (wa != wb) {\n\
      q.push({\n\
        i: s.push(s.pop() + \"skewX(\", null, \")\") - 2,\n\
        x: d3_interpolateNumber(wa, wb)\n\
      });\n\
    } else if (wb) {\n\
      s.push(s.pop() + \"skewX(\" + wb + \")\");\n\
    }\n\
    if (ka[0] != kb[0] || ka[1] != kb[1]) {\n\
      n = s.push(s.pop() + \"scale(\", null, \",\", null, \")\");\n\
      q.push({\n\
        i: n - 4,\n\
        x: d3_interpolateNumber(ka[0], kb[0])\n\
      }, {\n\
        i: n - 2,\n\
        x: d3_interpolateNumber(ka[1], kb[1])\n\
      });\n\
    } else if (kb[0] != 1 || kb[1] != 1) {\n\
      s.push(s.pop() + \"scale(\" + kb + \")\");\n\
    }\n\
    n = q.length;\n\
    return function(t) {\n\
      var i = -1, o;\n\
      while (++i < n) s[(o = q[i]).i] = o.x(t);\n\
      return s.join(\"\");\n\
    };\n\
  }\n\
  function d3_uninterpolateNumber(a, b) {\n\
    b = b - (a = +a) ? 1 / (b - a) : 0;\n\
    return function(x) {\n\
      return (x - a) * b;\n\
    };\n\
  }\n\
  function d3_uninterpolateClamp(a, b) {\n\
    b = b - (a = +a) ? 1 / (b - a) : 0;\n\
    return function(x) {\n\
      return Math.max(0, Math.min(1, (x - a) * b));\n\
    };\n\
  }\n\
  d3.layout = {};\n\
  d3.layout.bundle = function() {\n\
    return function(links) {\n\
      var paths = [], i = -1, n = links.length;\n\
      while (++i < n) paths.push(d3_layout_bundlePath(links[i]));\n\
      return paths;\n\
    };\n\
  };\n\
  function d3_layout_bundlePath(link) {\n\
    var start = link.source, end = link.target, lca = d3_layout_bundleLeastCommonAncestor(start, end), points = [ start ];\n\
    while (start !== lca) {\n\
      start = start.parent;\n\
      points.push(start);\n\
    }\n\
    var k = points.length;\n\
    while (end !== lca) {\n\
      points.splice(k, 0, end);\n\
      end = end.parent;\n\
    }\n\
    return points;\n\
  }\n\
  function d3_layout_bundleAncestors(node) {\n\
    var ancestors = [], parent = node.parent;\n\
    while (parent != null) {\n\
      ancestors.push(node);\n\
      node = parent;\n\
      parent = parent.parent;\n\
    }\n\
    ancestors.push(node);\n\
    return ancestors;\n\
  }\n\
  function d3_layout_bundleLeastCommonAncestor(a, b) {\n\
    if (a === b) return a;\n\
    var aNodes = d3_layout_bundleAncestors(a), bNodes = d3_layout_bundleAncestors(b), aNode = aNodes.pop(), bNode = bNodes.pop(), sharedNode = null;\n\
    while (aNode === bNode) {\n\
      sharedNode = aNode;\n\
      aNode = aNodes.pop();\n\
      bNode = bNodes.pop();\n\
    }\n\
    return sharedNode;\n\
  }\n\
  d3.layout.chord = function() {\n\
    var chord = {}, chords, groups, matrix, n, padding = 0, sortGroups, sortSubgroups, sortChords;\n\
    function relayout() {\n\
      var subgroups = {}, groupSums = [], groupIndex = d3.range(n), subgroupIndex = [], k, x, x0, i, j;\n\
      chords = [];\n\
      groups = [];\n\
      k = 0, i = -1;\n\
      while (++i < n) {\n\
        x = 0, j = -1;\n\
        while (++j < n) {\n\
          x += matrix[i][j];\n\
        }\n\
        groupSums.push(x);\n\
        subgroupIndex.push(d3.range(n));\n\
        k += x;\n\
      }\n\
      if (sortGroups) {\n\
        groupIndex.sort(function(a, b) {\n\
          return sortGroups(groupSums[a], groupSums[b]);\n\
        });\n\
      }\n\
      if (sortSubgroups) {\n\
        subgroupIndex.forEach(function(d, i) {\n\
          d.sort(function(a, b) {\n\
            return sortSubgroups(matrix[i][a], matrix[i][b]);\n\
          });\n\
        });\n\
      }\n\
      k = (τ - padding * n) / k;\n\
      x = 0, i = -1;\n\
      while (++i < n) {\n\
        x0 = x, j = -1;\n\
        while (++j < n) {\n\
          var di = groupIndex[i], dj = subgroupIndex[di][j], v = matrix[di][dj], a0 = x, a1 = x += v * k;\n\
          subgroups[di + \"-\" + dj] = {\n\
            index: di,\n\
            subindex: dj,\n\
            startAngle: a0,\n\
            endAngle: a1,\n\
            value: v\n\
          };\n\
        }\n\
        groups[di] = {\n\
          index: di,\n\
          startAngle: x0,\n\
          endAngle: x,\n\
          value: (x - x0) / k\n\
        };\n\
        x += padding;\n\
      }\n\
      i = -1;\n\
      while (++i < n) {\n\
        j = i - 1;\n\
        while (++j < n) {\n\
          var source = subgroups[i + \"-\" + j], target = subgroups[j + \"-\" + i];\n\
          if (source.value || target.value) {\n\
            chords.push(source.value < target.value ? {\n\
              source: target,\n\
              target: source\n\
            } : {\n\
              source: source,\n\
              target: target\n\
            });\n\
          }\n\
        }\n\
      }\n\
      if (sortChords) resort();\n\
    }\n\
    function resort() {\n\
      chords.sort(function(a, b) {\n\
        return sortChords((a.source.value + a.target.value) / 2, (b.source.value + b.target.value) / 2);\n\
      });\n\
    }\n\
    chord.matrix = function(x) {\n\
      if (!arguments.length) return matrix;\n\
      n = (matrix = x) && matrix.length;\n\
      chords = groups = null;\n\
      return chord;\n\
    };\n\
    chord.padding = function(x) {\n\
      if (!arguments.length) return padding;\n\
      padding = x;\n\
      chords = groups = null;\n\
      return chord;\n\
    };\n\
    chord.sortGroups = function(x) {\n\
      if (!arguments.length) return sortGroups;\n\
      sortGroups = x;\n\
      chords = groups = null;\n\
      return chord;\n\
    };\n\
    chord.sortSubgroups = function(x) {\n\
      if (!arguments.length) return sortSubgroups;\n\
      sortSubgroups = x;\n\
      chords = null;\n\
      return chord;\n\
    };\n\
    chord.sortChords = function(x) {\n\
      if (!arguments.length) return sortChords;\n\
      sortChords = x;\n\
      if (chords) resort();\n\
      return chord;\n\
    };\n\
    chord.chords = function() {\n\
      if (!chords) relayout();\n\
      return chords;\n\
    };\n\
    chord.groups = function() {\n\
      if (!groups) relayout();\n\
      return groups;\n\
    };\n\
    return chord;\n\
  };\n\
  d3.layout.force = function() {\n\
    var force = {}, event = d3.dispatch(\"start\", \"tick\", \"end\"), size = [ 1, 1 ], drag, alpha, friction = .9, linkDistance = d3_layout_forceLinkDistance, linkStrength = d3_layout_forceLinkStrength, charge = -30, chargeDistance2 = d3_layout_forceChargeDistance2, gravity = .1, theta2 = .64, nodes = [], links = [], distances, strengths, charges;\n\
    function repulse(node) {\n\
      return function(quad, x1, _, x2) {\n\
        if (quad.point !== node) {\n\
          var dx = quad.cx - node.x, dy = quad.cy - node.y, dw = x2 - x1, dn = dx * dx + dy * dy;\n\
          if (dw * dw / theta2 < dn) {\n\
            if (dn < chargeDistance2) {\n\
              var k = quad.charge / dn;\n\
              node.px -= dx * k;\n\
              node.py -= dy * k;\n\
            }\n\
            return true;\n\
          }\n\
          if (quad.point && dn && dn < chargeDistance2) {\n\
            var k = quad.pointCharge / dn;\n\
            node.px -= dx * k;\n\
            node.py -= dy * k;\n\
          }\n\
        }\n\
        return !quad.charge;\n\
      };\n\
    }\n\
    force.tick = function() {\n\
      if ((alpha *= .99) < .005) {\n\
        event.end({\n\
          type: \"end\",\n\
          alpha: alpha = 0\n\
        });\n\
        return true;\n\
      }\n\
      var n = nodes.length, m = links.length, q, i, o, s, t, l, k, x, y;\n\
      for (i = 0; i < m; ++i) {\n\
        o = links[i];\n\
        s = o.source;\n\
        t = o.target;\n\
        x = t.x - s.x;\n\
        y = t.y - s.y;\n\
        if (l = x * x + y * y) {\n\
          l = alpha * strengths[i] * ((l = Math.sqrt(l)) - distances[i]) / l;\n\
          x *= l;\n\
          y *= l;\n\
          t.x -= x * (k = s.weight / (t.weight + s.weight));\n\
          t.y -= y * k;\n\
          s.x += x * (k = 1 - k);\n\
          s.y += y * k;\n\
        }\n\
      }\n\
      if (k = alpha * gravity) {\n\
        x = size[0] / 2;\n\
        y = size[1] / 2;\n\
        i = -1;\n\
        if (k) while (++i < n) {\n\
          o = nodes[i];\n\
          o.x += (x - o.x) * k;\n\
          o.y += (y - o.y) * k;\n\
        }\n\
      }\n\
      if (charge) {\n\
        d3_layout_forceAccumulate(q = d3.geom.quadtree(nodes), alpha, charges);\n\
        i = -1;\n\
        while (++i < n) {\n\
          if (!(o = nodes[i]).fixed) {\n\
            q.visit(repulse(o));\n\
          }\n\
        }\n\
      }\n\
      i = -1;\n\
      while (++i < n) {\n\
        o = nodes[i];\n\
        if (o.fixed) {\n\
          o.x = o.px;\n\
          o.y = o.py;\n\
        } else {\n\
          o.x -= (o.px - (o.px = o.x)) * friction;\n\
          o.y -= (o.py - (o.py = o.y)) * friction;\n\
        }\n\
      }\n\
      event.tick({\n\
        type: \"tick\",\n\
        alpha: alpha\n\
      });\n\
    };\n\
    force.nodes = function(x) {\n\
      if (!arguments.length) return nodes;\n\
      nodes = x;\n\
      return force;\n\
    };\n\
    force.links = function(x) {\n\
      if (!arguments.length) return links;\n\
      links = x;\n\
      return force;\n\
    };\n\
    force.size = function(x) {\n\
      if (!arguments.length) return size;\n\
      size = x;\n\
      return force;\n\
    };\n\
    force.linkDistance = function(x) {\n\
      if (!arguments.length) return linkDistance;\n\
      linkDistance = typeof x === \"function\" ? x : +x;\n\
      return force;\n\
    };\n\
    force.distance = force.linkDistance;\n\
    force.linkStrength = function(x) {\n\
      if (!arguments.length) return linkStrength;\n\
      linkStrength = typeof x === \"function\" ? x : +x;\n\
      return force;\n\
    };\n\
    force.friction = function(x) {\n\
      if (!arguments.length) return friction;\n\
      friction = +x;\n\
      return force;\n\
    };\n\
    force.charge = function(x) {\n\
      if (!arguments.length) return charge;\n\
      charge = typeof x === \"function\" ? x : +x;\n\
      return force;\n\
    };\n\
    force.chargeDistance = function(x) {\n\
      if (!arguments.length) return Math.sqrt(chargeDistance2);\n\
      chargeDistance2 = x * x;\n\
      return force;\n\
    };\n\
    force.gravity = function(x) {\n\
      if (!arguments.length) return gravity;\n\
      gravity = +x;\n\
      return force;\n\
    };\n\
    force.theta = function(x) {\n\
      if (!arguments.length) return Math.sqrt(theta2);\n\
      theta2 = x * x;\n\
      return force;\n\
    };\n\
    force.alpha = function(x) {\n\
      if (!arguments.length) return alpha;\n\
      x = +x;\n\
      if (alpha) {\n\
        if (x > 0) alpha = x; else alpha = 0;\n\
      } else if (x > 0) {\n\
        event.start({\n\
          type: \"start\",\n\
          alpha: alpha = x\n\
        });\n\
        d3.timer(force.tick);\n\
      }\n\
      return force;\n\
    };\n\
    force.start = function() {\n\
      var i, n = nodes.length, m = links.length, w = size[0], h = size[1], neighbors, o;\n\
      for (i = 0; i < n; ++i) {\n\
        (o = nodes[i]).index = i;\n\
        o.weight = 0;\n\
      }\n\
      for (i = 0; i < m; ++i) {\n\
        o = links[i];\n\
        if (typeof o.source == \"number\") o.source = nodes[o.source];\n\
        if (typeof o.target == \"number\") o.target = nodes[o.target];\n\
        ++o.source.weight;\n\
        ++o.target.weight;\n\
      }\n\
      for (i = 0; i < n; ++i) {\n\
        o = nodes[i];\n\
        if (isNaN(o.x)) o.x = position(\"x\", w);\n\
        if (isNaN(o.y)) o.y = position(\"y\", h);\n\
        if (isNaN(o.px)) o.px = o.x;\n\
        if (isNaN(o.py)) o.py = o.y;\n\
      }\n\
      distances = [];\n\
      if (typeof linkDistance === \"function\") for (i = 0; i < m; ++i) distances[i] = +linkDistance.call(this, links[i], i); else for (i = 0; i < m; ++i) distances[i] = linkDistance;\n\
      strengths = [];\n\
      if (typeof linkStrength === \"function\") for (i = 0; i < m; ++i) strengths[i] = +linkStrength.call(this, links[i], i); else for (i = 0; i < m; ++i) strengths[i] = linkStrength;\n\
      charges = [];\n\
      if (typeof charge === \"function\") for (i = 0; i < n; ++i) charges[i] = +charge.call(this, nodes[i], i); else for (i = 0; i < n; ++i) charges[i] = charge;\n\
      function position(dimension, size) {\n\
        if (!neighbors) {\n\
          neighbors = new Array(n);\n\
          for (j = 0; j < n; ++j) {\n\
            neighbors[j] = [];\n\
          }\n\
          for (j = 0; j < m; ++j) {\n\
            var o = links[j];\n\
            neighbors[o.source.index].push(o.target);\n\
            neighbors[o.target.index].push(o.source);\n\
          }\n\
        }\n\
        var candidates = neighbors[i], j = -1, m = candidates.length, x;\n\
        while (++j < m) if (!isNaN(x = candidates[j][dimension])) return x;\n\
        return Math.random() * size;\n\
      }\n\
      return force.resume();\n\
    };\n\
    force.resume = function() {\n\
      return force.alpha(.1);\n\
    };\n\
    force.stop = function() {\n\
      return force.alpha(0);\n\
    };\n\
    force.drag = function() {\n\
      if (!drag) drag = d3.behavior.drag().origin(d3_identity).on(\"dragstart.force\", d3_layout_forceDragstart).on(\"drag.force\", dragmove).on(\"dragend.force\", d3_layout_forceDragend);\n\
      if (!arguments.length) return drag;\n\
      this.on(\"mouseover.force\", d3_layout_forceMouseover).on(\"mouseout.force\", d3_layout_forceMouseout).call(drag);\n\
    };\n\
    function dragmove(d) {\n\
      d.px = d3.event.x, d.py = d3.event.y;\n\
      force.resume();\n\
    }\n\
    return d3.rebind(force, event, \"on\");\n\
  };\n\
  function d3_layout_forceDragstart(d) {\n\
    d.fixed |= 2;\n\
  }\n\
  function d3_layout_forceDragend(d) {\n\
    d.fixed &= ~6;\n\
  }\n\
  function d3_layout_forceMouseover(d) {\n\
    d.fixed |= 4;\n\
    d.px = d.x, d.py = d.y;\n\
  }\n\
  function d3_layout_forceMouseout(d) {\n\
    d.fixed &= ~4;\n\
  }\n\
  function d3_layout_forceAccumulate(quad, alpha, charges) {\n\
    var cx = 0, cy = 0;\n\
    quad.charge = 0;\n\
    if (!quad.leaf) {\n\
      var nodes = quad.nodes, n = nodes.length, i = -1, c;\n\
      while (++i < n) {\n\
        c = nodes[i];\n\
        if (c == null) continue;\n\
        d3_layout_forceAccumulate(c, alpha, charges);\n\
        quad.charge += c.charge;\n\
        cx += c.charge * c.cx;\n\
        cy += c.charge * c.cy;\n\
      }\n\
    }\n\
    if (quad.point) {\n\
      if (!quad.leaf) {\n\
        quad.point.x += Math.random() - .5;\n\
        quad.point.y += Math.random() - .5;\n\
      }\n\
      var k = alpha * charges[quad.point.index];\n\
      quad.charge += quad.pointCharge = k;\n\
      cx += k * quad.point.x;\n\
      cy += k * quad.point.y;\n\
    }\n\
    quad.cx = cx / quad.charge;\n\
    quad.cy = cy / quad.charge;\n\
  }\n\
  var d3_layout_forceLinkDistance = 20, d3_layout_forceLinkStrength = 1, d3_layout_forceChargeDistance2 = Infinity;\n\
  d3.layout.hierarchy = function() {\n\
    var sort = d3_layout_hierarchySort, children = d3_layout_hierarchyChildren, value = d3_layout_hierarchyValue;\n\
    function recurse(node, depth, nodes) {\n\
      var childs = children.call(hierarchy, node, depth);\n\
      node.depth = depth;\n\
      nodes.push(node);\n\
      if (childs && (n = childs.length)) {\n\
        var i = -1, n, c = node.children = new Array(n), v = 0, j = depth + 1, d;\n\
        while (++i < n) {\n\
          d = c[i] = recurse(childs[i], j, nodes);\n\
          d.parent = node;\n\
          v += d.value;\n\
        }\n\
        if (sort) c.sort(sort);\n\
        if (value) node.value = v;\n\
      } else {\n\
        delete node.children;\n\
        if (value) {\n\
          node.value = +value.call(hierarchy, node, depth) || 0;\n\
        }\n\
      }\n\
      return node;\n\
    }\n\
    function revalue(node, depth) {\n\
      var children = node.children, v = 0;\n\
      if (children && (n = children.length)) {\n\
        var i = -1, n, j = depth + 1;\n\
        while (++i < n) v += revalue(children[i], j);\n\
      } else if (value) {\n\
        v = +value.call(hierarchy, node, depth) || 0;\n\
      }\n\
      if (value) node.value = v;\n\
      return v;\n\
    }\n\
    function hierarchy(d) {\n\
      var nodes = [];\n\
      recurse(d, 0, nodes);\n\
      return nodes;\n\
    }\n\
    hierarchy.sort = function(x) {\n\
      if (!arguments.length) return sort;\n\
      sort = x;\n\
      return hierarchy;\n\
    };\n\
    hierarchy.children = function(x) {\n\
      if (!arguments.length) return children;\n\
      children = x;\n\
      return hierarchy;\n\
    };\n\
    hierarchy.value = function(x) {\n\
      if (!arguments.length) return value;\n\
      value = x;\n\
      return hierarchy;\n\
    };\n\
    hierarchy.revalue = function(root) {\n\
      revalue(root, 0);\n\
      return root;\n\
    };\n\
    return hierarchy;\n\
  };\n\
  function d3_layout_hierarchyRebind(object, hierarchy) {\n\
    d3.rebind(object, hierarchy, \"sort\", \"children\", \"value\");\n\
    object.nodes = object;\n\
    object.links = d3_layout_hierarchyLinks;\n\
    return object;\n\
  }\n\
  function d3_layout_hierarchyChildren(d) {\n\
    return d.children;\n\
  }\n\
  function d3_layout_hierarchyValue(d) {\n\
    return d.value;\n\
  }\n\
  function d3_layout_hierarchySort(a, b) {\n\
    return b.value - a.value;\n\
  }\n\
  function d3_layout_hierarchyLinks(nodes) {\n\
    return d3.merge(nodes.map(function(parent) {\n\
      return (parent.children || []).map(function(child) {\n\
        return {\n\
          source: parent,\n\
          target: child\n\
        };\n\
      });\n\
    }));\n\
  }\n\
  d3.layout.partition = function() {\n\
    var hierarchy = d3.layout.hierarchy(), size = [ 1, 1 ];\n\
    function position(node, x, dx, dy) {\n\
      var children = node.children;\n\
      node.x = x;\n\
      node.y = node.depth * dy;\n\
      node.dx = dx;\n\
      node.dy = dy;\n\
      if (children && (n = children.length)) {\n\
        var i = -1, n, c, d;\n\
        dx = node.value ? dx / node.value : 0;\n\
        while (++i < n) {\n\
          position(c = children[i], x, d = c.value * dx, dy);\n\
          x += d;\n\
        }\n\
      }\n\
    }\n\
    function depth(node) {\n\
      var children = node.children, d = 0;\n\
      if (children && (n = children.length)) {\n\
        var i = -1, n;\n\
        while (++i < n) d = Math.max(d, depth(children[i]));\n\
      }\n\
      return 1 + d;\n\
    }\n\
    function partition(d, i) {\n\
      var nodes = hierarchy.call(this, d, i);\n\
      position(nodes[0], 0, size[0], size[1] / depth(nodes[0]));\n\
      return nodes;\n\
    }\n\
    partition.size = function(x) {\n\
      if (!arguments.length) return size;\n\
      size = x;\n\
      return partition;\n\
    };\n\
    return d3_layout_hierarchyRebind(partition, hierarchy);\n\
  };\n\
  d3.layout.pie = function() {\n\
    var value = Number, sort = d3_layout_pieSortByValue, startAngle = 0, endAngle = τ;\n\
    function pie(data) {\n\
      var values = data.map(function(d, i) {\n\
        return +value.call(pie, d, i);\n\
      });\n\
      var a = +(typeof startAngle === \"function\" ? startAngle.apply(this, arguments) : startAngle);\n\
      var k = ((typeof endAngle === \"function\" ? endAngle.apply(this, arguments) : endAngle) - a) / d3.sum(values);\n\
      var index = d3.range(data.length);\n\
      if (sort != null) index.sort(sort === d3_layout_pieSortByValue ? function(i, j) {\n\
        return values[j] - values[i];\n\
      } : function(i, j) {\n\
        return sort(data[i], data[j]);\n\
      });\n\
      var arcs = [];\n\
      index.forEach(function(i) {\n\
        var d;\n\
        arcs[i] = {\n\
          data: data[i],\n\
          value: d = values[i],\n\
          startAngle: a,\n\
          endAngle: a += d * k\n\
        };\n\
      });\n\
      return arcs;\n\
    }\n\
    pie.value = function(x) {\n\
      if (!arguments.length) return value;\n\
      value = x;\n\
      return pie;\n\
    };\n\
    pie.sort = function(x) {\n\
      if (!arguments.length) return sort;\n\
      sort = x;\n\
      return pie;\n\
    };\n\
    pie.startAngle = function(x) {\n\
      if (!arguments.length) return startAngle;\n\
      startAngle = x;\n\
      return pie;\n\
    };\n\
    pie.endAngle = function(x) {\n\
      if (!arguments.length) return endAngle;\n\
      endAngle = x;\n\
      return pie;\n\
    };\n\
    return pie;\n\
  };\n\
  var d3_layout_pieSortByValue = {};\n\
  d3.layout.stack = function() {\n\
    var values = d3_identity, order = d3_layout_stackOrderDefault, offset = d3_layout_stackOffsetZero, out = d3_layout_stackOut, x = d3_layout_stackX, y = d3_layout_stackY;\n\
    function stack(data, index) {\n\
      var series = data.map(function(d, i) {\n\
        return values.call(stack, d, i);\n\
      });\n\
      var points = series.map(function(d) {\n\
        return d.map(function(v, i) {\n\
          return [ x.call(stack, v, i), y.call(stack, v, i) ];\n\
        });\n\
      });\n\
      var orders = order.call(stack, points, index);\n\
      series = d3.permute(series, orders);\n\
      points = d3.permute(points, orders);\n\
      var offsets = offset.call(stack, points, index);\n\
      var n = series.length, m = series[0].length, i, j, o;\n\
      for (j = 0; j < m; ++j) {\n\
        out.call(stack, series[0][j], o = offsets[j], points[0][j][1]);\n\
        for (i = 1; i < n; ++i) {\n\
          out.call(stack, series[i][j], o += points[i - 1][j][1], points[i][j][1]);\n\
        }\n\
      }\n\
      return data;\n\
    }\n\
    stack.values = function(x) {\n\
      if (!arguments.length) return values;\n\
      values = x;\n\
      return stack;\n\
    };\n\
    stack.order = function(x) {\n\
      if (!arguments.length) return order;\n\
      order = typeof x === \"function\" ? x : d3_layout_stackOrders.get(x) || d3_layout_stackOrderDefault;\n\
      return stack;\n\
    };\n\
    stack.offset = function(x) {\n\
      if (!arguments.length) return offset;\n\
      offset = typeof x === \"function\" ? x : d3_layout_stackOffsets.get(x) || d3_layout_stackOffsetZero;\n\
      return stack;\n\
    };\n\
    stack.x = function(z) {\n\
      if (!arguments.length) return x;\n\
      x = z;\n\
      return stack;\n\
    };\n\
    stack.y = function(z) {\n\
      if (!arguments.length) return y;\n\
      y = z;\n\
      return stack;\n\
    };\n\
    stack.out = function(z) {\n\
      if (!arguments.length) return out;\n\
      out = z;\n\
      return stack;\n\
    };\n\
    return stack;\n\
  };\n\
  function d3_layout_stackX(d) {\n\
    return d.x;\n\
  }\n\
  function d3_layout_stackY(d) {\n\
    return d.y;\n\
  }\n\
  function d3_layout_stackOut(d, y0, y) {\n\
    d.y0 = y0;\n\
    d.y = y;\n\
  }\n\
  var d3_layout_stackOrders = d3.map({\n\
    \"inside-out\": function(data) {\n\
      var n = data.length, i, j, max = data.map(d3_layout_stackMaxIndex), sums = data.map(d3_layout_stackReduceSum), index = d3.range(n).sort(function(a, b) {\n\
        return max[a] - max[b];\n\
      }), top = 0, bottom = 0, tops = [], bottoms = [];\n\
      for (i = 0; i < n; ++i) {\n\
        j = index[i];\n\
        if (top < bottom) {\n\
          top += sums[j];\n\
          tops.push(j);\n\
        } else {\n\
          bottom += sums[j];\n\
          bottoms.push(j);\n\
        }\n\
      }\n\
      return bottoms.reverse().concat(tops);\n\
    },\n\
    reverse: function(data) {\n\
      return d3.range(data.length).reverse();\n\
    },\n\
    \"default\": d3_layout_stackOrderDefault\n\
  });\n\
  var d3_layout_stackOffsets = d3.map({\n\
    silhouette: function(data) {\n\
      var n = data.length, m = data[0].length, sums = [], max = 0, i, j, o, y0 = [];\n\
      for (j = 0; j < m; ++j) {\n\
        for (i = 0, o = 0; i < n; i++) o += data[i][j][1];\n\
        if (o > max) max = o;\n\
        sums.push(o);\n\
      }\n\
      for (j = 0; j < m; ++j) {\n\
        y0[j] = (max - sums[j]) / 2;\n\
      }\n\
      return y0;\n\
    },\n\
    wiggle: function(data) {\n\
      var n = data.length, x = data[0], m = x.length, i, j, k, s1, s2, s3, dx, o, o0, y0 = [];\n\
      y0[0] = o = o0 = 0;\n\
      for (j = 1; j < m; ++j) {\n\
        for (i = 0, s1 = 0; i < n; ++i) s1 += data[i][j][1];\n\
        for (i = 0, s2 = 0, dx = x[j][0] - x[j - 1][0]; i < n; ++i) {\n\
          for (k = 0, s3 = (data[i][j][1] - data[i][j - 1][1]) / (2 * dx); k < i; ++k) {\n\
            s3 += (data[k][j][1] - data[k][j - 1][1]) / dx;\n\
          }\n\
          s2 += s3 * data[i][j][1];\n\
        }\n\
        y0[j] = o -= s1 ? s2 / s1 * dx : 0;\n\
        if (o < o0) o0 = o;\n\
      }\n\
      for (j = 0; j < m; ++j) y0[j] -= o0;\n\
      return y0;\n\
    },\n\
    expand: function(data) {\n\
      var n = data.length, m = data[0].length, k = 1 / n, i, j, o, y0 = [];\n\
      for (j = 0; j < m; ++j) {\n\
        for (i = 0, o = 0; i < n; i++) o += data[i][j][1];\n\
        if (o) for (i = 0; i < n; i++) data[i][j][1] /= o; else for (i = 0; i < n; i++) data[i][j][1] = k;\n\
      }\n\
      for (j = 0; j < m; ++j) y0[j] = 0;\n\
      return y0;\n\
    },\n\
    zero: d3_layout_stackOffsetZero\n\
  });\n\
  function d3_layout_stackOrderDefault(data) {\n\
    return d3.range(data.length);\n\
  }\n\
  function d3_layout_stackOffsetZero(data) {\n\
    var j = -1, m = data[0].length, y0 = [];\n\
    while (++j < m) y0[j] = 0;\n\
    return y0;\n\
  }\n\
  function d3_layout_stackMaxIndex(array) {\n\
    var i = 1, j = 0, v = array[0][1], k, n = array.length;\n\
    for (;i < n; ++i) {\n\
      if ((k = array[i][1]) > v) {\n\
        j = i;\n\
        v = k;\n\
      }\n\
    }\n\
    return j;\n\
  }\n\
  function d3_layout_stackReduceSum(d) {\n\
    return d.reduce(d3_layout_stackSum, 0);\n\
  }\n\
  function d3_layout_stackSum(p, d) {\n\
    return p + d[1];\n\
  }\n\
  d3.layout.histogram = function() {\n\
    var frequency = true, valuer = Number, ranger = d3_layout_histogramRange, binner = d3_layout_histogramBinSturges;\n\
    function histogram(data, i) {\n\
      var bins = [], values = data.map(valuer, this), range = ranger.call(this, values, i), thresholds = binner.call(this, range, values, i), bin, i = -1, n = values.length, m = thresholds.length - 1, k = frequency ? 1 : 1 / n, x;\n\
      while (++i < m) {\n\
        bin = bins[i] = [];\n\
        bin.dx = thresholds[i + 1] - (bin.x = thresholds[i]);\n\
        bin.y = 0;\n\
      }\n\
      if (m > 0) {\n\
        i = -1;\n\
        while (++i < n) {\n\
          x = values[i];\n\
          if (x >= range[0] && x <= range[1]) {\n\
            bin = bins[d3.bisect(thresholds, x, 1, m) - 1];\n\
            bin.y += k;\n\
            bin.push(data[i]);\n\
          }\n\
        }\n\
      }\n\
      return bins;\n\
    }\n\
    histogram.value = function(x) {\n\
      if (!arguments.length) return valuer;\n\
      valuer = x;\n\
      return histogram;\n\
    };\n\
    histogram.range = function(x) {\n\
      if (!arguments.length) return ranger;\n\
      ranger = d3_functor(x);\n\
      return histogram;\n\
    };\n\
    histogram.bins = function(x) {\n\
      if (!arguments.length) return binner;\n\
      binner = typeof x === \"number\" ? function(range) {\n\
        return d3_layout_histogramBinFixed(range, x);\n\
      } : d3_functor(x);\n\
      return histogram;\n\
    };\n\
    histogram.frequency = function(x) {\n\
      if (!arguments.length) return frequency;\n\
      frequency = !!x;\n\
      return histogram;\n\
    };\n\
    return histogram;\n\
  };\n\
  function d3_layout_histogramBinSturges(range, values) {\n\
    return d3_layout_histogramBinFixed(range, Math.ceil(Math.log(values.length) / Math.LN2 + 1));\n\
  }\n\
  function d3_layout_histogramBinFixed(range, n) {\n\
    var x = -1, b = +range[0], m = (range[1] - b) / n, f = [];\n\
    while (++x <= n) f[x] = m * x + b;\n\
    return f;\n\
  }\n\
  function d3_layout_histogramRange(values) {\n\
    return [ d3.min(values), d3.max(values) ];\n\
  }\n\
  d3.layout.tree = function() {\n\
    var hierarchy = d3.layout.hierarchy().sort(null).value(null), separation = d3_layout_treeSeparation, size = [ 1, 1 ], nodeSize = false;\n\
    function tree(d, i) {\n\
      var nodes = hierarchy.call(this, d, i), root = nodes[0];\n\
      function firstWalk(node, previousSibling) {\n\
        var children = node.children, layout = node._tree;\n\
        if (children && (n = children.length)) {\n\
          var n, firstChild = children[0], previousChild, ancestor = firstChild, child, i = -1;\n\
          while (++i < n) {\n\
            child = children[i];\n\
            firstWalk(child, previousChild);\n\
            ancestor = apportion(child, previousChild, ancestor);\n\
            previousChild = child;\n\
          }\n\
          d3_layout_treeShift(node);\n\
          var midpoint = .5 * (firstChild._tree.prelim + child._tree.prelim);\n\
          if (previousSibling) {\n\
            layout.prelim = previousSibling._tree.prelim + separation(node, previousSibling);\n\
            layout.mod = layout.prelim - midpoint;\n\
          } else {\n\
            layout.prelim = midpoint;\n\
          }\n\
        } else {\n\
          if (previousSibling) {\n\
            layout.prelim = previousSibling._tree.prelim + separation(node, previousSibling);\n\
          }\n\
        }\n\
      }\n\
      function secondWalk(node, x) {\n\
        node.x = node._tree.prelim + x;\n\
        var children = node.children;\n\
        if (children && (n = children.length)) {\n\
          var i = -1, n;\n\
          x += node._tree.mod;\n\
          while (++i < n) {\n\
            secondWalk(children[i], x);\n\
          }\n\
        }\n\
      }\n\
      function apportion(node, previousSibling, ancestor) {\n\
        if (previousSibling) {\n\
          var vip = node, vop = node, vim = previousSibling, vom = node.parent.children[0], sip = vip._tree.mod, sop = vop._tree.mod, sim = vim._tree.mod, som = vom._tree.mod, shift;\n\
          while (vim = d3_layout_treeRight(vim), vip = d3_layout_treeLeft(vip), vim && vip) {\n\
            vom = d3_layout_treeLeft(vom);\n\
            vop = d3_layout_treeRight(vop);\n\
            vop._tree.ancestor = node;\n\
            shift = vim._tree.prelim + sim - vip._tree.prelim - sip + separation(vim, vip);\n\
            if (shift > 0) {\n\
              d3_layout_treeMove(d3_layout_treeAncestor(vim, node, ancestor), node, shift);\n\
              sip += shift;\n\
              sop += shift;\n\
            }\n\
            sim += vim._tree.mod;\n\
            sip += vip._tree.mod;\n\
            som += vom._tree.mod;\n\
            sop += vop._tree.mod;\n\
          }\n\
          if (vim && !d3_layout_treeRight(vop)) {\n\
            vop._tree.thread = vim;\n\
            vop._tree.mod += sim - sop;\n\
          }\n\
          if (vip && !d3_layout_treeLeft(vom)) {\n\
            vom._tree.thread = vip;\n\
            vom._tree.mod += sip - som;\n\
            ancestor = node;\n\
          }\n\
        }\n\
        return ancestor;\n\
      }\n\
      d3_layout_treeVisitAfter(root, function(node, previousSibling) {\n\
        node._tree = {\n\
          ancestor: node,\n\
          prelim: 0,\n\
          mod: 0,\n\
          change: 0,\n\
          shift: 0,\n\
          number: previousSibling ? previousSibling._tree.number + 1 : 0\n\
        };\n\
      });\n\
      firstWalk(root);\n\
      secondWalk(root, -root._tree.prelim);\n\
      var left = d3_layout_treeSearch(root, d3_layout_treeLeftmost), right = d3_layout_treeSearch(root, d3_layout_treeRightmost), deep = d3_layout_treeSearch(root, d3_layout_treeDeepest), x0 = left.x - separation(left, right) / 2, x1 = right.x + separation(right, left) / 2, y1 = deep.depth || 1;\n\
      d3_layout_treeVisitAfter(root, nodeSize ? function(node) {\n\
        node.x *= size[0];\n\
        node.y = node.depth * size[1];\n\
        delete node._tree;\n\
      } : function(node) {\n\
        node.x = (node.x - x0) / (x1 - x0) * size[0];\n\
        node.y = node.depth / y1 * size[1];\n\
        delete node._tree;\n\
      });\n\
      return nodes;\n\
    }\n\
    tree.separation = function(x) {\n\
      if (!arguments.length) return separation;\n\
      separation = x;\n\
      return tree;\n\
    };\n\
    tree.size = function(x) {\n\
      if (!arguments.length) return nodeSize ? null : size;\n\
      nodeSize = (size = x) == null;\n\
      return tree;\n\
    };\n\
    tree.nodeSize = function(x) {\n\
      if (!arguments.length) return nodeSize ? size : null;\n\
      nodeSize = (size = x) != null;\n\
      return tree;\n\
    };\n\
    return d3_layout_hierarchyRebind(tree, hierarchy);\n\
  };\n\
  function d3_layout_treeSeparation(a, b) {\n\
    return a.parent == b.parent ? 1 : 2;\n\
  }\n\
  function d3_layout_treeLeft(node) {\n\
    var children = node.children;\n\
    return children && children.length ? children[0] : node._tree.thread;\n\
  }\n\
  function d3_layout_treeRight(node) {\n\
    var children = node.children, n;\n\
    return children && (n = children.length) ? children[n - 1] : node._tree.thread;\n\
  }\n\
  function d3_layout_treeSearch(node, compare) {\n\
    var children = node.children;\n\
    if (children && (n = children.length)) {\n\
      var child, n, i = -1;\n\
      while (++i < n) {\n\
        if (compare(child = d3_layout_treeSearch(children[i], compare), node) > 0) {\n\
          node = child;\n\
        }\n\
      }\n\
    }\n\
    return node;\n\
  }\n\
  function d3_layout_treeRightmost(a, b) {\n\
    return a.x - b.x;\n\
  }\n\
  function d3_layout_treeLeftmost(a, b) {\n\
    return b.x - a.x;\n\
  }\n\
  function d3_layout_treeDeepest(a, b) {\n\
    return a.depth - b.depth;\n\
  }\n\
  function d3_layout_treeVisitAfter(node, callback) {\n\
    function visit(node, previousSibling) {\n\
      var children = node.children;\n\
      if (children && (n = children.length)) {\n\
        var child, previousChild = null, i = -1, n;\n\
        while (++i < n) {\n\
          child = children[i];\n\
          visit(child, previousChild);\n\
          previousChild = child;\n\
        }\n\
      }\n\
      callback(node, previousSibling);\n\
    }\n\
    visit(node, null);\n\
  }\n\
  function d3_layout_treeShift(node) {\n\
    var shift = 0, change = 0, children = node.children, i = children.length, child;\n\
    while (--i >= 0) {\n\
      child = children[i]._tree;\n\
      child.prelim += shift;\n\
      child.mod += shift;\n\
      shift += child.shift + (change += child.change);\n\
    }\n\
  }\n\
  function d3_layout_treeMove(ancestor, node, shift) {\n\
    ancestor = ancestor._tree;\n\
    node = node._tree;\n\
    var change = shift / (node.number - ancestor.number);\n\
    ancestor.change += change;\n\
    node.change -= change;\n\
    node.shift += shift;\n\
    node.prelim += shift;\n\
    node.mod += shift;\n\
  }\n\
  function d3_layout_treeAncestor(vim, node, ancestor) {\n\
    return vim._tree.ancestor.parent == node.parent ? vim._tree.ancestor : ancestor;\n\
  }\n\
  d3.layout.pack = function() {\n\
    var hierarchy = d3.layout.hierarchy().sort(d3_layout_packSort), padding = 0, size = [ 1, 1 ], radius;\n\
    function pack(d, i) {\n\
      var nodes = hierarchy.call(this, d, i), root = nodes[0], w = size[0], h = size[1], r = radius == null ? Math.sqrt : typeof radius === \"function\" ? radius : function() {\n\
        return radius;\n\
      };\n\
      root.x = root.y = 0;\n\
      d3_layout_treeVisitAfter(root, function(d) {\n\
        d.r = +r(d.value);\n\
      });\n\
      d3_layout_treeVisitAfter(root, d3_layout_packSiblings);\n\
      if (padding) {\n\
        var dr = padding * (radius ? 1 : Math.max(2 * root.r / w, 2 * root.r / h)) / 2;\n\
        d3_layout_treeVisitAfter(root, function(d) {\n\
          d.r += dr;\n\
        });\n\
        d3_layout_treeVisitAfter(root, d3_layout_packSiblings);\n\
        d3_layout_treeVisitAfter(root, function(d) {\n\
          d.r -= dr;\n\
        });\n\
      }\n\
      d3_layout_packTransform(root, w / 2, h / 2, radius ? 1 : 1 / Math.max(2 * root.r / w, 2 * root.r / h));\n\
      return nodes;\n\
    }\n\
    pack.size = function(_) {\n\
      if (!arguments.length) return size;\n\
      size = _;\n\
      return pack;\n\
    };\n\
    pack.radius = function(_) {\n\
      if (!arguments.length) return radius;\n\
      radius = _ == null || typeof _ === \"function\" ? _ : +_;\n\
      return pack;\n\
    };\n\
    pack.padding = function(_) {\n\
      if (!arguments.length) return padding;\n\
      padding = +_;\n\
      return pack;\n\
    };\n\
    return d3_layout_hierarchyRebind(pack, hierarchy);\n\
  };\n\
  function d3_layout_packSort(a, b) {\n\
    return a.value - b.value;\n\
  }\n\
  function d3_layout_packInsert(a, b) {\n\
    var c = a._pack_next;\n\
    a._pack_next = b;\n\
    b._pack_prev = a;\n\
    b._pack_next = c;\n\
    c._pack_prev = b;\n\
  }\n\
  function d3_layout_packSplice(a, b) {\n\
    a._pack_next = b;\n\
    b._pack_prev = a;\n\
  }\n\
  function d3_layout_packIntersects(a, b) {\n\
    var dx = b.x - a.x, dy = b.y - a.y, dr = a.r + b.r;\n\
    return .999 * dr * dr > dx * dx + dy * dy;\n\
  }\n\
  function d3_layout_packSiblings(node) {\n\
    if (!(nodes = node.children) || !(n = nodes.length)) return;\n\
    var nodes, xMin = Infinity, xMax = -Infinity, yMin = Infinity, yMax = -Infinity, a, b, c, i, j, k, n;\n\
    function bound(node) {\n\
      xMin = Math.min(node.x - node.r, xMin);\n\
      xMax = Math.max(node.x + node.r, xMax);\n\
      yMin = Math.min(node.y - node.r, yMin);\n\
      yMax = Math.max(node.y + node.r, yMax);\n\
    }\n\
    nodes.forEach(d3_layout_packLink);\n\
    a = nodes[0];\n\
    a.x = -a.r;\n\
    a.y = 0;\n\
    bound(a);\n\
    if (n > 1) {\n\
      b = nodes[1];\n\
      b.x = b.r;\n\
      b.y = 0;\n\
      bound(b);\n\
      if (n > 2) {\n\
        c = nodes[2];\n\
        d3_layout_packPlace(a, b, c);\n\
        bound(c);\n\
        d3_layout_packInsert(a, c);\n\
        a._pack_prev = c;\n\
        d3_layout_packInsert(c, b);\n\
        b = a._pack_next;\n\
        for (i = 3; i < n; i++) {\n\
          d3_layout_packPlace(a, b, c = nodes[i]);\n\
          var isect = 0, s1 = 1, s2 = 1;\n\
          for (j = b._pack_next; j !== b; j = j._pack_next, s1++) {\n\
            if (d3_layout_packIntersects(j, c)) {\n\
              isect = 1;\n\
              break;\n\
            }\n\
          }\n\
          if (isect == 1) {\n\
            for (k = a._pack_prev; k !== j._pack_prev; k = k._pack_prev, s2++) {\n\
              if (d3_layout_packIntersects(k, c)) {\n\
                break;\n\
              }\n\
            }\n\
          }\n\
          if (isect) {\n\
            if (s1 < s2 || s1 == s2 && b.r < a.r) d3_layout_packSplice(a, b = j); else d3_layout_packSplice(a = k, b);\n\
            i--;\n\
          } else {\n\
            d3_layout_packInsert(a, c);\n\
            b = c;\n\
            bound(c);\n\
          }\n\
        }\n\
      }\n\
    }\n\
    var cx = (xMin + xMax) / 2, cy = (yMin + yMax) / 2, cr = 0;\n\
    for (i = 0; i < n; i++) {\n\
      c = nodes[i];\n\
      c.x -= cx;\n\
      c.y -= cy;\n\
      cr = Math.max(cr, c.r + Math.sqrt(c.x * c.x + c.y * c.y));\n\
    }\n\
    node.r = cr;\n\
    nodes.forEach(d3_layout_packUnlink);\n\
  }\n\
  function d3_layout_packLink(node) {\n\
    node._pack_next = node._pack_prev = node;\n\
  }\n\
  function d3_layout_packUnlink(node) {\n\
    delete node._pack_next;\n\
    delete node._pack_prev;\n\
  }\n\
  function d3_layout_packTransform(node, x, y, k) {\n\
    var children = node.children;\n\
    node.x = x += k * node.x;\n\
    node.y = y += k * node.y;\n\
    node.r *= k;\n\
    if (children) {\n\
      var i = -1, n = children.length;\n\
      while (++i < n) d3_layout_packTransform(children[i], x, y, k);\n\
    }\n\
  }\n\
  function d3_layout_packPlace(a, b, c) {\n\
    var db = a.r + c.r, dx = b.x - a.x, dy = b.y - a.y;\n\
    if (db && (dx || dy)) {\n\
      var da = b.r + c.r, dc = dx * dx + dy * dy;\n\
      da *= da;\n\
      db *= db;\n\
      var x = .5 + (db - da) / (2 * dc), y = Math.sqrt(Math.max(0, 2 * da * (db + dc) - (db -= dc) * db - da * da)) / (2 * dc);\n\
      c.x = a.x + x * dx + y * dy;\n\
      c.y = a.y + x * dy - y * dx;\n\
    } else {\n\
      c.x = a.x + db;\n\
      c.y = a.y;\n\
    }\n\
  }\n\
  d3.layout.cluster = function() {\n\
    var hierarchy = d3.layout.hierarchy().sort(null).value(null), separation = d3_layout_treeSeparation, size = [ 1, 1 ], nodeSize = false;\n\
    function cluster(d, i) {\n\
      var nodes = hierarchy.call(this, d, i), root = nodes[0], previousNode, x = 0;\n\
      d3_layout_treeVisitAfter(root, function(node) {\n\
        var children = node.children;\n\
        if (children && children.length) {\n\
          node.x = d3_layout_clusterX(children);\n\
          node.y = d3_layout_clusterY(children);\n\
        } else {\n\
          node.x = previousNode ? x += separation(node, previousNode) : 0;\n\
          node.y = 0;\n\
          previousNode = node;\n\
        }\n\
      });\n\
      var left = d3_layout_clusterLeft(root), right = d3_layout_clusterRight(root), x0 = left.x - separation(left, right) / 2, x1 = right.x + separation(right, left) / 2;\n\
      d3_layout_treeVisitAfter(root, nodeSize ? function(node) {\n\
        node.x = (node.x - root.x) * size[0];\n\
        node.y = (root.y - node.y) * size[1];\n\
      } : function(node) {\n\
        node.x = (node.x - x0) / (x1 - x0) * size[0];\n\
        node.y = (1 - (root.y ? node.y / root.y : 1)) * size[1];\n\
      });\n\
      return nodes;\n\
    }\n\
    cluster.separation = function(x) {\n\
      if (!arguments.length) return separation;\n\
      separation = x;\n\
      return cluster;\n\
    };\n\
    cluster.size = function(x) {\n\
      if (!arguments.length) return nodeSize ? null : size;\n\
      nodeSize = (size = x) == null;\n\
      return cluster;\n\
    };\n\
    cluster.nodeSize = function(x) {\n\
      if (!arguments.length) return nodeSize ? size : null;\n\
      nodeSize = (size = x) != null;\n\
      return cluster;\n\
    };\n\
    return d3_layout_hierarchyRebind(cluster, hierarchy);\n\
  };\n\
  function d3_layout_clusterY(children) {\n\
    return 1 + d3.max(children, function(child) {\n\
      return child.y;\n\
    });\n\
  }\n\
  function d3_layout_clusterX(children) {\n\
    return children.reduce(function(x, child) {\n\
      return x + child.x;\n\
    }, 0) / children.length;\n\
  }\n\
  function d3_layout_clusterLeft(node) {\n\
    var children = node.children;\n\
    return children && children.length ? d3_layout_clusterLeft(children[0]) : node;\n\
  }\n\
  function d3_layout_clusterRight(node) {\n\
    var children = node.children, n;\n\
    return children && (n = children.length) ? d3_layout_clusterRight(children[n - 1]) : node;\n\
  }\n\
  d3.layout.treemap = function() {\n\
    var hierarchy = d3.layout.hierarchy(), round = Math.round, size = [ 1, 1 ], padding = null, pad = d3_layout_treemapPadNull, sticky = false, stickies, mode = \"squarify\", ratio = .5 * (1 + Math.sqrt(5));\n\
    function scale(children, k) {\n\
      var i = -1, n = children.length, child, area;\n\
      while (++i < n) {\n\
        area = (child = children[i]).value * (k < 0 ? 0 : k);\n\
        child.area = isNaN(area) || area <= 0 ? 0 : area;\n\
      }\n\
    }\n\
    function squarify(node) {\n\
      var children = node.children;\n\
      if (children && children.length) {\n\
        var rect = pad(node), row = [], remaining = children.slice(), child, best = Infinity, score, u = mode === \"slice\" ? rect.dx : mode === \"dice\" ? rect.dy : mode === \"slice-dice\" ? node.depth & 1 ? rect.dy : rect.dx : Math.min(rect.dx, rect.dy), n;\n\
        scale(remaining, rect.dx * rect.dy / node.value);\n\
        row.area = 0;\n\
        while ((n = remaining.length) > 0) {\n\
          row.push(child = remaining[n - 1]);\n\
          row.area += child.area;\n\
          if (mode !== \"squarify\" || (score = worst(row, u)) <= best) {\n\
            remaining.pop();\n\
            best = score;\n\
          } else {\n\
            row.area -= row.pop().area;\n\
            position(row, u, rect, false);\n\
            u = Math.min(rect.dx, rect.dy);\n\
            row.length = row.area = 0;\n\
            best = Infinity;\n\
          }\n\
        }\n\
        if (row.length) {\n\
          position(row, u, rect, true);\n\
          row.length = row.area = 0;\n\
        }\n\
        children.forEach(squarify);\n\
      }\n\
    }\n\
    function stickify(node) {\n\
      var children = node.children;\n\
      if (children && children.length) {\n\
        var rect = pad(node), remaining = children.slice(), child, row = [];\n\
        scale(remaining, rect.dx * rect.dy / node.value);\n\
        row.area = 0;\n\
        while (child = remaining.pop()) {\n\
          row.push(child);\n\
          row.area += child.area;\n\
          if (child.z != null) {\n\
            position(row, child.z ? rect.dx : rect.dy, rect, !remaining.length);\n\
            row.length = row.area = 0;\n\
          }\n\
        }\n\
        children.forEach(stickify);\n\
      }\n\
    }\n\
    function worst(row, u) {\n\
      var s = row.area, r, rmax = 0, rmin = Infinity, i = -1, n = row.length;\n\
      while (++i < n) {\n\
        if (!(r = row[i].area)) continue;\n\
        if (r < rmin) rmin = r;\n\
        if (r > rmax) rmax = r;\n\
      }\n\
      s *= s;\n\
      u *= u;\n\
      return s ? Math.max(u * rmax * ratio / s, s / (u * rmin * ratio)) : Infinity;\n\
    }\n\
    function position(row, u, rect, flush) {\n\
      var i = -1, n = row.length, x = rect.x, y = rect.y, v = u ? round(row.area / u) : 0, o;\n\
      if (u == rect.dx) {\n\
        if (flush || v > rect.dy) v = rect.dy;\n\
        while (++i < n) {\n\
          o = row[i];\n\
          o.x = x;\n\
          o.y = y;\n\
          o.dy = v;\n\
          x += o.dx = Math.min(rect.x + rect.dx - x, v ? round(o.area / v) : 0);\n\
        }\n\
        o.z = true;\n\
        o.dx += rect.x + rect.dx - x;\n\
        rect.y += v;\n\
        rect.dy -= v;\n\
      } else {\n\
        if (flush || v > rect.dx) v = rect.dx;\n\
        while (++i < n) {\n\
          o = row[i];\n\
          o.x = x;\n\
          o.y = y;\n\
          o.dx = v;\n\
          y += o.dy = Math.min(rect.y + rect.dy - y, v ? round(o.area / v) : 0);\n\
        }\n\
        o.z = false;\n\
        o.dy += rect.y + rect.dy - y;\n\
        rect.x += v;\n\
        rect.dx -= v;\n\
      }\n\
    }\n\
    function treemap(d) {\n\
      var nodes = stickies || hierarchy(d), root = nodes[0];\n\
      root.x = 0;\n\
      root.y = 0;\n\
      root.dx = size[0];\n\
      root.dy = size[1];\n\
      if (stickies) hierarchy.revalue(root);\n\
      scale([ root ], root.dx * root.dy / root.value);\n\
      (stickies ? stickify : squarify)(root);\n\
      if (sticky) stickies = nodes;\n\
      return nodes;\n\
    }\n\
    treemap.size = function(x) {\n\
      if (!arguments.length) return size;\n\
      size = x;\n\
      return treemap;\n\
    };\n\
    treemap.padding = function(x) {\n\
      if (!arguments.length) return padding;\n\
      function padFunction(node) {\n\
        var p = x.call(treemap, node, node.depth);\n\
        return p == null ? d3_layout_treemapPadNull(node) : d3_layout_treemapPad(node, typeof p === \"number\" ? [ p, p, p, p ] : p);\n\
      }\n\
      function padConstant(node) {\n\
        return d3_layout_treemapPad(node, x);\n\
      }\n\
      var type;\n\
      pad = (padding = x) == null ? d3_layout_treemapPadNull : (type = typeof x) === \"function\" ? padFunction : type === \"number\" ? (x = [ x, x, x, x ], \n\
      padConstant) : padConstant;\n\
      return treemap;\n\
    };\n\
    treemap.round = function(x) {\n\
      if (!arguments.length) return round != Number;\n\
      round = x ? Math.round : Number;\n\
      return treemap;\n\
    };\n\
    treemap.sticky = function(x) {\n\
      if (!arguments.length) return sticky;\n\
      sticky = x;\n\
      stickies = null;\n\
      return treemap;\n\
    };\n\
    treemap.ratio = function(x) {\n\
      if (!arguments.length) return ratio;\n\
      ratio = x;\n\
      return treemap;\n\
    };\n\
    treemap.mode = function(x) {\n\
      if (!arguments.length) return mode;\n\
      mode = x + \"\";\n\
      return treemap;\n\
    };\n\
    return d3_layout_hierarchyRebind(treemap, hierarchy);\n\
  };\n\
  function d3_layout_treemapPadNull(node) {\n\
    return {\n\
      x: node.x,\n\
      y: node.y,\n\
      dx: node.dx,\n\
      dy: node.dy\n\
    };\n\
  }\n\
  function d3_layout_treemapPad(node, padding) {\n\
    var x = node.x + padding[3], y = node.y + padding[0], dx = node.dx - padding[1] - padding[3], dy = node.dy - padding[0] - padding[2];\n\
    if (dx < 0) {\n\
      x += dx / 2;\n\
      dx = 0;\n\
    }\n\
    if (dy < 0) {\n\
      y += dy / 2;\n\
      dy = 0;\n\
    }\n\
    return {\n\
      x: x,\n\
      y: y,\n\
      dx: dx,\n\
      dy: dy\n\
    };\n\
  }\n\
  d3.random = {\n\
    normal: function(µ, σ) {\n\
      var n = arguments.length;\n\
      if (n < 2) σ = 1;\n\
      if (n < 1) µ = 0;\n\
      return function() {\n\
        var x, y, r;\n\
        do {\n\
          x = Math.random() * 2 - 1;\n\
          y = Math.random() * 2 - 1;\n\
          r = x * x + y * y;\n\
        } while (!r || r > 1);\n\
        return µ + σ * x * Math.sqrt(-2 * Math.log(r) / r);\n\
      };\n\
    },\n\
    logNormal: function() {\n\
      var random = d3.random.normal.apply(d3, arguments);\n\
      return function() {\n\
        return Math.exp(random());\n\
      };\n\
    },\n\
    bates: function(m) {\n\
      var random = d3.random.irwinHall(m);\n\
      return function() {\n\
        return random() / m;\n\
      };\n\
    },\n\
    irwinHall: function(m) {\n\
      return function() {\n\
        for (var s = 0, j = 0; j < m; j++) s += Math.random();\n\
        return s;\n\
      };\n\
    }\n\
  };\n\
  d3.scale = {};\n\
  function d3_scaleExtent(domain) {\n\
    var start = domain[0], stop = domain[domain.length - 1];\n\
    return start < stop ? [ start, stop ] : [ stop, start ];\n\
  }\n\
  function d3_scaleRange(scale) {\n\
    return scale.rangeExtent ? scale.rangeExtent() : d3_scaleExtent(scale.range());\n\
  }\n\
  function d3_scale_bilinear(domain, range, uninterpolate, interpolate) {\n\
    var u = uninterpolate(domain[0], domain[1]), i = interpolate(range[0], range[1]);\n\
    return function(x) {\n\
      return i(u(x));\n\
    };\n\
  }\n\
  function d3_scale_nice(domain, nice) {\n\
    var i0 = 0, i1 = domain.length - 1, x0 = domain[i0], x1 = domain[i1], dx;\n\
    if (x1 < x0) {\n\
      dx = i0, i0 = i1, i1 = dx;\n\
      dx = x0, x0 = x1, x1 = dx;\n\
    }\n\
    domain[i0] = nice.floor(x0);\n\
    domain[i1] = nice.ceil(x1);\n\
    return domain;\n\
  }\n\
  function d3_scale_niceStep(step) {\n\
    return step ? {\n\
      floor: function(x) {\n\
        return Math.floor(x / step) * step;\n\
      },\n\
      ceil: function(x) {\n\
        return Math.ceil(x / step) * step;\n\
      }\n\
    } : d3_scale_niceIdentity;\n\
  }\n\
  var d3_scale_niceIdentity = {\n\
    floor: d3_identity,\n\
    ceil: d3_identity\n\
  };\n\
  function d3_scale_polylinear(domain, range, uninterpolate, interpolate) {\n\
    var u = [], i = [], j = 0, k = Math.min(domain.length, range.length) - 1;\n\
    if (domain[k] < domain[0]) {\n\
      domain = domain.slice().reverse();\n\
      range = range.slice().reverse();\n\
    }\n\
    while (++j <= k) {\n\
      u.push(uninterpolate(domain[j - 1], domain[j]));\n\
      i.push(interpolate(range[j - 1], range[j]));\n\
    }\n\
    return function(x) {\n\
      var j = d3.bisect(domain, x, 1, k) - 1;\n\
      return i[j](u[j](x));\n\
    };\n\
  }\n\
  d3.scale.linear = function() {\n\
    return d3_scale_linear([ 0, 1 ], [ 0, 1 ], d3_interpolate, false);\n\
  };\n\
  function d3_scale_linear(domain, range, interpolate, clamp) {\n\
    var output, input;\n\
    function rescale() {\n\
      var linear = Math.min(domain.length, range.length) > 2 ? d3_scale_polylinear : d3_scale_bilinear, uninterpolate = clamp ? d3_uninterpolateClamp : d3_uninterpolateNumber;\n\
      output = linear(domain, range, uninterpolate, interpolate);\n\
      input = linear(range, domain, uninterpolate, d3_interpolate);\n\
      return scale;\n\
    }\n\
    function scale(x) {\n\
      return output(x);\n\
    }\n\
    scale.invert = function(y) {\n\
      return input(y);\n\
    };\n\
    scale.domain = function(x) {\n\
      if (!arguments.length) return domain;\n\
      domain = x.map(Number);\n\
      return rescale();\n\
    };\n\
    scale.range = function(x) {\n\
      if (!arguments.length) return range;\n\
      range = x;\n\
      return rescale();\n\
    };\n\
    scale.rangeRound = function(x) {\n\
      return scale.range(x).interpolate(d3_interpolateRound);\n\
    };\n\
    scale.clamp = function(x) {\n\
      if (!arguments.length) return clamp;\n\
      clamp = x;\n\
      return rescale();\n\
    };\n\
    scale.interpolate = function(x) {\n\
      if (!arguments.length) return interpolate;\n\
      interpolate = x;\n\
      return rescale();\n\
    };\n\
    scale.ticks = function(m) {\n\
      return d3_scale_linearTicks(domain, m);\n\
    };\n\
    scale.tickFormat = function(m, format) {\n\
      return d3_scale_linearTickFormat(domain, m, format);\n\
    };\n\
    scale.nice = function(m) {\n\
      d3_scale_linearNice(domain, m);\n\
      return rescale();\n\
    };\n\
    scale.copy = function() {\n\
      return d3_scale_linear(domain, range, interpolate, clamp);\n\
    };\n\
    return rescale();\n\
  }\n\
  function d3_scale_linearRebind(scale, linear) {\n\
    return d3.rebind(scale, linear, \"range\", \"rangeRound\", \"interpolate\", \"clamp\");\n\
  }\n\
  function d3_scale_linearNice(domain, m) {\n\
    return d3_scale_nice(domain, d3_scale_niceStep(d3_scale_linearTickRange(domain, m)[2]));\n\
  }\n\
  function d3_scale_linearTickRange(domain, m) {\n\
    if (m == null) m = 10;\n\
    var extent = d3_scaleExtent(domain), span = extent[1] - extent[0], step = Math.pow(10, Math.floor(Math.log(span / m) / Math.LN10)), err = m / span * step;\n\
    if (err <= .15) step *= 10; else if (err <= .35) step *= 5; else if (err <= .75) step *= 2;\n\
    extent[0] = Math.ceil(extent[0] / step) * step;\n\
    extent[1] = Math.floor(extent[1] / step) * step + step * .5;\n\
    extent[2] = step;\n\
    return extent;\n\
  }\n\
  function d3_scale_linearTicks(domain, m) {\n\
    return d3.range.apply(d3, d3_scale_linearTickRange(domain, m));\n\
  }\n\
  function d3_scale_linearTickFormat(domain, m, format) {\n\
    var range = d3_scale_linearTickRange(domain, m);\n\
    if (format) {\n\
      var match = d3_format_re.exec(format);\n\
      match.shift();\n\
      if (match[8] === \"s\") {\n\
        var prefix = d3.formatPrefix(Math.max(abs(range[0]), abs(range[1])));\n\
        if (!match[7]) match[7] = \".\" + d3_scale_linearPrecision(prefix.scale(range[2]));\n\
        match[8] = \"f\";\n\
        format = d3.format(match.join(\"\"));\n\
        return function(d) {\n\
          return format(prefix.scale(d)) + prefix.symbol;\n\
        };\n\
      }\n\
      if (!match[7]) match[7] = \".\" + d3_scale_linearFormatPrecision(match[8], range);\n\
      format = match.join(\"\");\n\
    } else {\n\
      format = \",.\" + d3_scale_linearPrecision(range[2]) + \"f\";\n\
    }\n\
    return d3.format(format);\n\
  }\n\
  var d3_scale_linearFormatSignificant = {\n\
    s: 1,\n\
    g: 1,\n\
    p: 1,\n\
    r: 1,\n\
    e: 1\n\
  };\n\
  function d3_scale_linearPrecision(value) {\n\
    return -Math.floor(Math.log(value) / Math.LN10 + .01);\n\
  }\n\
  function d3_scale_linearFormatPrecision(type, range) {\n\
    var p = d3_scale_linearPrecision(range[2]);\n\
    return type in d3_scale_linearFormatSignificant ? Math.abs(p - d3_scale_linearPrecision(Math.max(abs(range[0]), abs(range[1])))) + +(type !== \"e\") : p - (type === \"%\") * 2;\n\
  }\n\
  d3.scale.log = function() {\n\
    return d3_scale_log(d3.scale.linear().domain([ 0, 1 ]), 10, true, [ 1, 10 ]);\n\
  };\n\
  function d3_scale_log(linear, base, positive, domain) {\n\
    function log(x) {\n\
      return (positive ? Math.log(x < 0 ? 0 : x) : -Math.log(x > 0 ? 0 : -x)) / Math.log(base);\n\
    }\n\
    function pow(x) {\n\
      return positive ? Math.pow(base, x) : -Math.pow(base, -x);\n\
    }\n\
    function scale(x) {\n\
      return linear(log(x));\n\
    }\n\
    scale.invert = function(x) {\n\
      return pow(linear.invert(x));\n\
    };\n\
    scale.domain = function(x) {\n\
      if (!arguments.length) return domain;\n\
      positive = x[0] >= 0;\n\
      linear.domain((domain = x.map(Number)).map(log));\n\
      return scale;\n\
    };\n\
    scale.base = function(_) {\n\
      if (!arguments.length) return base;\n\
      base = +_;\n\
      linear.domain(domain.map(log));\n\
      return scale;\n\
    };\n\
    scale.nice = function() {\n\
      var niced = d3_scale_nice(domain.map(log), positive ? Math : d3_scale_logNiceNegative);\n\
      linear.domain(niced);\n\
      domain = niced.map(pow);\n\
      return scale;\n\
    };\n\
    scale.ticks = function() {\n\
      var extent = d3_scaleExtent(domain), ticks = [], u = extent[0], v = extent[1], i = Math.floor(log(u)), j = Math.ceil(log(v)), n = base % 1 ? 2 : base;\n\
      if (isFinite(j - i)) {\n\
        if (positive) {\n\
          for (;i < j; i++) for (var k = 1; k < n; k++) ticks.push(pow(i) * k);\n\
          ticks.push(pow(i));\n\
        } else {\n\
          ticks.push(pow(i));\n\
          for (;i++ < j; ) for (var k = n - 1; k > 0; k--) ticks.push(pow(i) * k);\n\
        }\n\
        for (i = 0; ticks[i] < u; i++) {}\n\
        for (j = ticks.length; ticks[j - 1] > v; j--) {}\n\
        ticks = ticks.slice(i, j);\n\
      }\n\
      return ticks;\n\
    };\n\
    scale.tickFormat = function(n, format) {\n\
      if (!arguments.length) return d3_scale_logFormat;\n\
      if (arguments.length < 2) format = d3_scale_logFormat; else if (typeof format !== \"function\") format = d3.format(format);\n\
      var k = Math.max(.1, n / scale.ticks().length), f = positive ? (e = 1e-12, Math.ceil) : (e = -1e-12, \n\
      Math.floor), e;\n\
      return function(d) {\n\
        return d / pow(f(log(d) + e)) <= k ? format(d) : \"\";\n\
      };\n\
    };\n\
    scale.copy = function() {\n\
      return d3_scale_log(linear.copy(), base, positive, domain);\n\
    };\n\
    return d3_scale_linearRebind(scale, linear);\n\
  }\n\
  var d3_scale_logFormat = d3.format(\".0e\"), d3_scale_logNiceNegative = {\n\
    floor: function(x) {\n\
      return -Math.ceil(-x);\n\
    },\n\
    ceil: function(x) {\n\
      return -Math.floor(-x);\n\
    }\n\
  };\n\
  d3.scale.pow = function() {\n\
    return d3_scale_pow(d3.scale.linear(), 1, [ 0, 1 ]);\n\
  };\n\
  function d3_scale_pow(linear, exponent, domain) {\n\
    var powp = d3_scale_powPow(exponent), powb = d3_scale_powPow(1 / exponent);\n\
    function scale(x) {\n\
      return linear(powp(x));\n\
    }\n\
    scale.invert = function(x) {\n\
      return powb(linear.invert(x));\n\
    };\n\
    scale.domain = function(x) {\n\
      if (!arguments.length) return domain;\n\
      linear.domain((domain = x.map(Number)).map(powp));\n\
      return scale;\n\
    };\n\
    scale.ticks = function(m) {\n\
      return d3_scale_linearTicks(domain, m);\n\
    };\n\
    scale.tickFormat = function(m, format) {\n\
      return d3_scale_linearTickFormat(domain, m, format);\n\
    };\n\
    scale.nice = function(m) {\n\
      return scale.domain(d3_scale_linearNice(domain, m));\n\
    };\n\
    scale.exponent = function(x) {\n\
      if (!arguments.length) return exponent;\n\
      powp = d3_scale_powPow(exponent = x);\n\
      powb = d3_scale_powPow(1 / exponent);\n\
      linear.domain(domain.map(powp));\n\
      return scale;\n\
    };\n\
    scale.copy = function() {\n\
      return d3_scale_pow(linear.copy(), exponent, domain);\n\
    };\n\
    return d3_scale_linearRebind(scale, linear);\n\
  }\n\
  function d3_scale_powPow(e) {\n\
    return function(x) {\n\
      return x < 0 ? -Math.pow(-x, e) : Math.pow(x, e);\n\
    };\n\
  }\n\
  d3.scale.sqrt = function() {\n\
    return d3.scale.pow().exponent(.5);\n\
  };\n\
  d3.scale.ordinal = function() {\n\
    return d3_scale_ordinal([], {\n\
      t: \"range\",\n\
      a: [ [] ]\n\
    });\n\
  };\n\
  function d3_scale_ordinal(domain, ranger) {\n\
    var index, range, rangeBand;\n\
    function scale(x) {\n\
      return range[((index.get(x) || (ranger.t === \"range\" ? index.set(x, domain.push(x)) : NaN)) - 1) % range.length];\n\
    }\n\
    function steps(start, step) {\n\
      return d3.range(domain.length).map(function(i) {\n\
        return start + step * i;\n\
      });\n\
    }\n\
    scale.domain = function(x) {\n\
      if (!arguments.length) return domain;\n\
      domain = [];\n\
      index = new d3_Map();\n\
      var i = -1, n = x.length, xi;\n\
      while (++i < n) if (!index.has(xi = x[i])) index.set(xi, domain.push(xi));\n\
      return scale[ranger.t].apply(scale, ranger.a);\n\
    };\n\
    scale.range = function(x) {\n\
      if (!arguments.length) return range;\n\
      range = x;\n\
      rangeBand = 0;\n\
      ranger = {\n\
        t: \"range\",\n\
        a: arguments\n\
      };\n\
      return scale;\n\
    };\n\
    scale.rangePoints = function(x, padding) {\n\
      if (arguments.length < 2) padding = 0;\n\
      var start = x[0], stop = x[1], step = (stop - start) / (Math.max(1, domain.length - 1) + padding);\n\
      range = steps(domain.length < 2 ? (start + stop) / 2 : start + step * padding / 2, step);\n\
      rangeBand = 0;\n\
      ranger = {\n\
        t: \"rangePoints\",\n\
        a: arguments\n\
      };\n\
      return scale;\n\
    };\n\
    scale.rangeBands = function(x, padding, outerPadding) {\n\
      if (arguments.length < 2) padding = 0;\n\
      if (arguments.length < 3) outerPadding = padding;\n\
      var reverse = x[1] < x[0], start = x[reverse - 0], stop = x[1 - reverse], step = (stop - start) / (domain.length - padding + 2 * outerPadding);\n\
      range = steps(start + step * outerPadding, step);\n\
      if (reverse) range.reverse();\n\
      rangeBand = step * (1 - padding);\n\
      ranger = {\n\
        t: \"rangeBands\",\n\
        a: arguments\n\
      };\n\
      return scale;\n\
    };\n\
    scale.rangeRoundBands = function(x, padding, outerPadding) {\n\
      if (arguments.length < 2) padding = 0;\n\
      if (arguments.length < 3) outerPadding = padding;\n\
      var reverse = x[1] < x[0], start = x[reverse - 0], stop = x[1 - reverse], step = Math.floor((stop - start) / (domain.length - padding + 2 * outerPadding)), error = stop - start - (domain.length - padding) * step;\n\
      range = steps(start + Math.round(error / 2), step);\n\
      if (reverse) range.reverse();\n\
      rangeBand = Math.round(step * (1 - padding));\n\
      ranger = {\n\
        t: \"rangeRoundBands\",\n\
        a: arguments\n\
      };\n\
      return scale;\n\
    };\n\
    scale.rangeBand = function() {\n\
      return rangeBand;\n\
    };\n\
    scale.rangeExtent = function() {\n\
      return d3_scaleExtent(ranger.a[0]);\n\
    };\n\
    scale.copy = function() {\n\
      return d3_scale_ordinal(domain, ranger);\n\
    };\n\
    return scale.domain(domain);\n\
  }\n\
  d3.scale.category10 = function() {\n\
    return d3.scale.ordinal().range(d3_category10);\n\
  };\n\
  d3.scale.category20 = function() {\n\
    return d3.scale.ordinal().range(d3_category20);\n\
  };\n\
  d3.scale.category20b = function() {\n\
    return d3.scale.ordinal().range(d3_category20b);\n\
  };\n\
  d3.scale.category20c = function() {\n\
    return d3.scale.ordinal().range(d3_category20c);\n\
  };\n\
  var d3_category10 = [ 2062260, 16744206, 2924588, 14034728, 9725885, 9197131, 14907330, 8355711, 12369186, 1556175 ].map(d3_rgbString);\n\
  var d3_category20 = [ 2062260, 11454440, 16744206, 16759672, 2924588, 10018698, 14034728, 16750742, 9725885, 12955861, 9197131, 12885140, 14907330, 16234194, 8355711, 13092807, 12369186, 14408589, 1556175, 10410725 ].map(d3_rgbString);\n\
  var d3_category20b = [ 3750777, 5395619, 7040719, 10264286, 6519097, 9216594, 11915115, 13556636, 9202993, 12426809, 15186514, 15190932, 8666169, 11356490, 14049643, 15177372, 8077683, 10834324, 13528509, 14589654 ].map(d3_rgbString);\n\
  var d3_category20c = [ 3244733, 7057110, 10406625, 13032431, 15095053, 16616764, 16625259, 16634018, 3253076, 7652470, 10607003, 13101504, 7695281, 10394312, 12369372, 14342891, 6513507, 9868950, 12434877, 14277081 ].map(d3_rgbString);\n\
  d3.scale.quantile = function() {\n\
    return d3_scale_quantile([], []);\n\
  };\n\
  function d3_scale_quantile(domain, range) {\n\
    var thresholds;\n\
    function rescale() {\n\
      var k = 0, q = range.length;\n\
      thresholds = [];\n\
      while (++k < q) thresholds[k - 1] = d3.quantile(domain, k / q);\n\
      return scale;\n\
    }\n\
    function scale(x) {\n\
      if (!isNaN(x = +x)) return range[d3.bisect(thresholds, x)];\n\
    }\n\
    scale.domain = function(x) {\n\
      if (!arguments.length) return domain;\n\
      domain = x.filter(d3_number).sort(d3_ascending);\n\
      return rescale();\n\
    };\n\
    scale.range = function(x) {\n\
      if (!arguments.length) return range;\n\
      range = x;\n\
      return rescale();\n\
    };\n\
    scale.quantiles = function() {\n\
      return thresholds;\n\
    };\n\
    scale.invertExtent = function(y) {\n\
      y = range.indexOf(y);\n\
      return y < 0 ? [ NaN, NaN ] : [ y > 0 ? thresholds[y - 1] : domain[0], y < thresholds.length ? thresholds[y] : domain[domain.length - 1] ];\n\
    };\n\
    scale.copy = function() {\n\
      return d3_scale_quantile(domain, range);\n\
    };\n\
    return rescale();\n\
  }\n\
  d3.scale.quantize = function() {\n\
    return d3_scale_quantize(0, 1, [ 0, 1 ]);\n\
  };\n\
  function d3_scale_quantize(x0, x1, range) {\n\
    var kx, i;\n\
    function scale(x) {\n\
      return range[Math.max(0, Math.min(i, Math.floor(kx * (x - x0))))];\n\
    }\n\
    function rescale() {\n\
      kx = range.length / (x1 - x0);\n\
      i = range.length - 1;\n\
      return scale;\n\
    }\n\
    scale.domain = function(x) {\n\
      if (!arguments.length) return [ x0, x1 ];\n\
      x0 = +x[0];\n\
      x1 = +x[x.length - 1];\n\
      return rescale();\n\
    };\n\
    scale.range = function(x) {\n\
      if (!arguments.length) return range;\n\
      range = x;\n\
      return rescale();\n\
    };\n\
    scale.invertExtent = function(y) {\n\
      y = range.indexOf(y);\n\
      y = y < 0 ? NaN : y / kx + x0;\n\
      return [ y, y + 1 / kx ];\n\
    };\n\
    scale.copy = function() {\n\
      return d3_scale_quantize(x0, x1, range);\n\
    };\n\
    return rescale();\n\
  }\n\
  d3.scale.threshold = function() {\n\
    return d3_scale_threshold([ .5 ], [ 0, 1 ]);\n\
  };\n\
  function d3_scale_threshold(domain, range) {\n\
    function scale(x) {\n\
      if (x <= x) return range[d3.bisect(domain, x)];\n\
    }\n\
    scale.domain = function(_) {\n\
      if (!arguments.length) return domain;\n\
      domain = _;\n\
      return scale;\n\
    };\n\
    scale.range = function(_) {\n\
      if (!arguments.length) return range;\n\
      range = _;\n\
      return scale;\n\
    };\n\
    scale.invertExtent = function(y) {\n\
      y = range.indexOf(y);\n\
      return [ domain[y - 1], domain[y] ];\n\
    };\n\
    scale.copy = function() {\n\
      return d3_scale_threshold(domain, range);\n\
    };\n\
    return scale;\n\
  }\n\
  d3.scale.identity = function() {\n\
    return d3_scale_identity([ 0, 1 ]);\n\
  };\n\
  function d3_scale_identity(domain) {\n\
    function identity(x) {\n\
      return +x;\n\
    }\n\
    identity.invert = identity;\n\
    identity.domain = identity.range = function(x) {\n\
      if (!arguments.length) return domain;\n\
      domain = x.map(identity);\n\
      return identity;\n\
    };\n\
    identity.ticks = function(m) {\n\
      return d3_scale_linearTicks(domain, m);\n\
    };\n\
    identity.tickFormat = function(m, format) {\n\
      return d3_scale_linearTickFormat(domain, m, format);\n\
    };\n\
    identity.copy = function() {\n\
      return d3_scale_identity(domain);\n\
    };\n\
    return identity;\n\
  }\n\
  d3.svg = {};\n\
  d3.svg.arc = function() {\n\
    var innerRadius = d3_svg_arcInnerRadius, outerRadius = d3_svg_arcOuterRadius, startAngle = d3_svg_arcStartAngle, endAngle = d3_svg_arcEndAngle;\n\
    function arc() {\n\
      var r0 = innerRadius.apply(this, arguments), r1 = outerRadius.apply(this, arguments), a0 = startAngle.apply(this, arguments) + d3_svg_arcOffset, a1 = endAngle.apply(this, arguments) + d3_svg_arcOffset, da = (a1 < a0 && (da = a0, \n\
      a0 = a1, a1 = da), a1 - a0), df = da < π ? \"0\" : \"1\", c0 = Math.cos(a0), s0 = Math.sin(a0), c1 = Math.cos(a1), s1 = Math.sin(a1);\n\
      return da >= d3_svg_arcMax ? r0 ? \"M0,\" + r1 + \"A\" + r1 + \",\" + r1 + \" 0 1,1 0,\" + -r1 + \"A\" + r1 + \",\" + r1 + \" 0 1,1 0,\" + r1 + \"M0,\" + r0 + \"A\" + r0 + \",\" + r0 + \" 0 1,0 0,\" + -r0 + \"A\" + r0 + \",\" + r0 + \" 0 1,0 0,\" + r0 + \"Z\" : \"M0,\" + r1 + \"A\" + r1 + \",\" + r1 + \" 0 1,1 0,\" + -r1 + \"A\" + r1 + \",\" + r1 + \" 0 1,1 0,\" + r1 + \"Z\" : r0 ? \"M\" + r1 * c0 + \",\" + r1 * s0 + \"A\" + r1 + \",\" + r1 + \" 0 \" + df + \",1 \" + r1 * c1 + \",\" + r1 * s1 + \"L\" + r0 * c1 + \",\" + r0 * s1 + \"A\" + r0 + \",\" + r0 + \" 0 \" + df + \",0 \" + r0 * c0 + \",\" + r0 * s0 + \"Z\" : \"M\" + r1 * c0 + \",\" + r1 * s0 + \"A\" + r1 + \",\" + r1 + \" 0 \" + df + \",1 \" + r1 * c1 + \",\" + r1 * s1 + \"L0,0\" + \"Z\";\n\
    }\n\
    arc.innerRadius = function(v) {\n\
      if (!arguments.length) return innerRadius;\n\
      innerRadius = d3_functor(v);\n\
      return arc;\n\
    };\n\
    arc.outerRadius = function(v) {\n\
      if (!arguments.length) return outerRadius;\n\
      outerRadius = d3_functor(v);\n\
      return arc;\n\
    };\n\
    arc.startAngle = function(v) {\n\
      if (!arguments.length) return startAngle;\n\
      startAngle = d3_functor(v);\n\
      return arc;\n\
    };\n\
    arc.endAngle = function(v) {\n\
      if (!arguments.length) return endAngle;\n\
      endAngle = d3_functor(v);\n\
      return arc;\n\
    };\n\
    arc.centroid = function() {\n\
      var r = (innerRadius.apply(this, arguments) + outerRadius.apply(this, arguments)) / 2, a = (startAngle.apply(this, arguments) + endAngle.apply(this, arguments)) / 2 + d3_svg_arcOffset;\n\
      return [ Math.cos(a) * r, Math.sin(a) * r ];\n\
    };\n\
    return arc;\n\
  };\n\
  var d3_svg_arcOffset = -halfπ, d3_svg_arcMax = τ - ε;\n\
  function d3_svg_arcInnerRadius(d) {\n\
    return d.innerRadius;\n\
  }\n\
  function d3_svg_arcOuterRadius(d) {\n\
    return d.outerRadius;\n\
  }\n\
  function d3_svg_arcStartAngle(d) {\n\
    return d.startAngle;\n\
  }\n\
  function d3_svg_arcEndAngle(d) {\n\
    return d.endAngle;\n\
  }\n\
  function d3_svg_line(projection) {\n\
    var x = d3_geom_pointX, y = d3_geom_pointY, defined = d3_true, interpolate = d3_svg_lineLinear, interpolateKey = interpolate.key, tension = .7;\n\
    function line(data) {\n\
      var segments = [], points = [], i = -1, n = data.length, d, fx = d3_functor(x), fy = d3_functor(y);\n\
      function segment() {\n\
        segments.push(\"M\", interpolate(projection(points), tension));\n\
      }\n\
      while (++i < n) {\n\
        if (defined.call(this, d = data[i], i)) {\n\
          points.push([ +fx.call(this, d, i), +fy.call(this, d, i) ]);\n\
        } else if (points.length) {\n\
          segment();\n\
          points = [];\n\
        }\n\
      }\n\
      if (points.length) segment();\n\
      return segments.length ? segments.join(\"\") : null;\n\
    }\n\
    line.x = function(_) {\n\
      if (!arguments.length) return x;\n\
      x = _;\n\
      return line;\n\
    };\n\
    line.y = function(_) {\n\
      if (!arguments.length) return y;\n\
      y = _;\n\
      return line;\n\
    };\n\
    line.defined = function(_) {\n\
      if (!arguments.length) return defined;\n\
      defined = _;\n\
      return line;\n\
    };\n\
    line.interpolate = function(_) {\n\
      if (!arguments.length) return interpolateKey;\n\
      if (typeof _ === \"function\") interpolateKey = interpolate = _; else interpolateKey = (interpolate = d3_svg_lineInterpolators.get(_) || d3_svg_lineLinear).key;\n\
      return line;\n\
    };\n\
    line.tension = function(_) {\n\
      if (!arguments.length) return tension;\n\
      tension = _;\n\
      return line;\n\
    };\n\
    return line;\n\
  }\n\
  d3.svg.line = function() {\n\
    return d3_svg_line(d3_identity);\n\
  };\n\
  var d3_svg_lineInterpolators = d3.map({\n\
    linear: d3_svg_lineLinear,\n\
    \"linear-closed\": d3_svg_lineLinearClosed,\n\
    step: d3_svg_lineStep,\n\
    \"step-before\": d3_svg_lineStepBefore,\n\
    \"step-after\": d3_svg_lineStepAfter,\n\
    basis: d3_svg_lineBasis,\n\
    \"basis-open\": d3_svg_lineBasisOpen,\n\
    \"basis-closed\": d3_svg_lineBasisClosed,\n\
    bundle: d3_svg_lineBundle,\n\
    cardinal: d3_svg_lineCardinal,\n\
    \"cardinal-open\": d3_svg_lineCardinalOpen,\n\
    \"cardinal-closed\": d3_svg_lineCardinalClosed,\n\
    monotone: d3_svg_lineMonotone\n\
  });\n\
  d3_svg_lineInterpolators.forEach(function(key, value) {\n\
    value.key = key;\n\
    value.closed = /-closed$/.test(key);\n\
  });\n\
  function d3_svg_lineLinear(points) {\n\
    return points.join(\"L\");\n\
  }\n\
  function d3_svg_lineLinearClosed(points) {\n\
    return d3_svg_lineLinear(points) + \"Z\";\n\
  }\n\
  function d3_svg_lineStep(points) {\n\
    var i = 0, n = points.length, p = points[0], path = [ p[0], \",\", p[1] ];\n\
    while (++i < n) path.push(\"H\", (p[0] + (p = points[i])[0]) / 2, \"V\", p[1]);\n\
    if (n > 1) path.push(\"H\", p[0]);\n\
    return path.join(\"\");\n\
  }\n\
  function d3_svg_lineStepBefore(points) {\n\
    var i = 0, n = points.length, p = points[0], path = [ p[0], \",\", p[1] ];\n\
    while (++i < n) path.push(\"V\", (p = points[i])[1], \"H\", p[0]);\n\
    return path.join(\"\");\n\
  }\n\
  function d3_svg_lineStepAfter(points) {\n\
    var i = 0, n = points.length, p = points[0], path = [ p[0], \",\", p[1] ];\n\
    while (++i < n) path.push(\"H\", (p = points[i])[0], \"V\", p[1]);\n\
    return path.join(\"\");\n\
  }\n\
  function d3_svg_lineCardinalOpen(points, tension) {\n\
    return points.length < 4 ? d3_svg_lineLinear(points) : points[1] + d3_svg_lineHermite(points.slice(1, points.length - 1), d3_svg_lineCardinalTangents(points, tension));\n\
  }\n\
  function d3_svg_lineCardinalClosed(points, tension) {\n\
    return points.length < 3 ? d3_svg_lineLinear(points) : points[0] + d3_svg_lineHermite((points.push(points[0]), \n\
    points), d3_svg_lineCardinalTangents([ points[points.length - 2] ].concat(points, [ points[1] ]), tension));\n\
  }\n\
  function d3_svg_lineCardinal(points, tension) {\n\
    return points.length < 3 ? d3_svg_lineLinear(points) : points[0] + d3_svg_lineHermite(points, d3_svg_lineCardinalTangents(points, tension));\n\
  }\n\
  function d3_svg_lineHermite(points, tangents) {\n\
    if (tangents.length < 1 || points.length != tangents.length && points.length != tangents.length + 2) {\n\
      return d3_svg_lineLinear(points);\n\
    }\n\
    var quad = points.length != tangents.length, path = \"\", p0 = points[0], p = points[1], t0 = tangents[0], t = t0, pi = 1;\n\
    if (quad) {\n\
      path += \"Q\" + (p[0] - t0[0] * 2 / 3) + \",\" + (p[1] - t0[1] * 2 / 3) + \",\" + p[0] + \",\" + p[1];\n\
      p0 = points[1];\n\
      pi = 2;\n\
    }\n\
    if (tangents.length > 1) {\n\
      t = tangents[1];\n\
      p = points[pi];\n\
      pi++;\n\
      path += \"C\" + (p0[0] + t0[0]) + \",\" + (p0[1] + t0[1]) + \",\" + (p[0] - t[0]) + \",\" + (p[1] - t[1]) + \",\" + p[0] + \",\" + p[1];\n\
      for (var i = 2; i < tangents.length; i++, pi++) {\n\
        p = points[pi];\n\
        t = tangents[i];\n\
        path += \"S\" + (p[0] - t[0]) + \",\" + (p[1] - t[1]) + \",\" + p[0] + \",\" + p[1];\n\
      }\n\
    }\n\
    if (quad) {\n\
      var lp = points[pi];\n\
      path += \"Q\" + (p[0] + t[0] * 2 / 3) + \",\" + (p[1] + t[1] * 2 / 3) + \",\" + lp[0] + \",\" + lp[1];\n\
    }\n\
    return path;\n\
  }\n\
  function d3_svg_lineCardinalTangents(points, tension) {\n\
    var tangents = [], a = (1 - tension) / 2, p0, p1 = points[0], p2 = points[1], i = 1, n = points.length;\n\
    while (++i < n) {\n\
      p0 = p1;\n\
      p1 = p2;\n\
      p2 = points[i];\n\
      tangents.push([ a * (p2[0] - p0[0]), a * (p2[1] - p0[1]) ]);\n\
    }\n\
    return tangents;\n\
  }\n\
  function d3_svg_lineBasis(points) {\n\
    if (points.length < 3) return d3_svg_lineLinear(points);\n\
    var i = 1, n = points.length, pi = points[0], x0 = pi[0], y0 = pi[1], px = [ x0, x0, x0, (pi = points[1])[0] ], py = [ y0, y0, y0, pi[1] ], path = [ x0, \",\", y0, \"L\", d3_svg_lineDot4(d3_svg_lineBasisBezier3, px), \",\", d3_svg_lineDot4(d3_svg_lineBasisBezier3, py) ];\n\
    points.push(points[n - 1]);\n\
    while (++i <= n) {\n\
      pi = points[i];\n\
      px.shift();\n\
      px.push(pi[0]);\n\
      py.shift();\n\
      py.push(pi[1]);\n\
      d3_svg_lineBasisBezier(path, px, py);\n\
    }\n\
    points.pop();\n\
    path.push(\"L\", pi);\n\
    return path.join(\"\");\n\
  }\n\
  function d3_svg_lineBasisOpen(points) {\n\
    if (points.length < 4) return d3_svg_lineLinear(points);\n\
    var path = [], i = -1, n = points.length, pi, px = [ 0 ], py = [ 0 ];\n\
    while (++i < 3) {\n\
      pi = points[i];\n\
      px.push(pi[0]);\n\
      py.push(pi[1]);\n\
    }\n\
    path.push(d3_svg_lineDot4(d3_svg_lineBasisBezier3, px) + \",\" + d3_svg_lineDot4(d3_svg_lineBasisBezier3, py));\n\
    --i;\n\
    while (++i < n) {\n\
      pi = points[i];\n\
      px.shift();\n\
      px.push(pi[0]);\n\
      py.shift();\n\
      py.push(pi[1]);\n\
      d3_svg_lineBasisBezier(path, px, py);\n\
    }\n\
    return path.join(\"\");\n\
  }\n\
  function d3_svg_lineBasisClosed(points) {\n\
    var path, i = -1, n = points.length, m = n + 4, pi, px = [], py = [];\n\
    while (++i < 4) {\n\
      pi = points[i % n];\n\
      px.push(pi[0]);\n\
      py.push(pi[1]);\n\
    }\n\
    path = [ d3_svg_lineDot4(d3_svg_lineBasisBezier3, px), \",\", d3_svg_lineDot4(d3_svg_lineBasisBezier3, py) ];\n\
    --i;\n\
    while (++i < m) {\n\
      pi = points[i % n];\n\
      px.shift();\n\
      px.push(pi[0]);\n\
      py.shift();\n\
      py.push(pi[1]);\n\
      d3_svg_lineBasisBezier(path, px, py);\n\
    }\n\
    return path.join(\"\");\n\
  }\n\
  function d3_svg_lineBundle(points, tension) {\n\
    var n = points.length - 1;\n\
    if (n) {\n\
      var x0 = points[0][0], y0 = points[0][1], dx = points[n][0] - x0, dy = points[n][1] - y0, i = -1, p, t;\n\
      while (++i <= n) {\n\
        p = points[i];\n\
        t = i / n;\n\
        p[0] = tension * p[0] + (1 - tension) * (x0 + t * dx);\n\
        p[1] = tension * p[1] + (1 - tension) * (y0 + t * dy);\n\
      }\n\
    }\n\
    return d3_svg_lineBasis(points);\n\
  }\n\
  function d3_svg_lineDot4(a, b) {\n\
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3];\n\
  }\n\
  var d3_svg_lineBasisBezier1 = [ 0, 2 / 3, 1 / 3, 0 ], d3_svg_lineBasisBezier2 = [ 0, 1 / 3, 2 / 3, 0 ], d3_svg_lineBasisBezier3 = [ 0, 1 / 6, 2 / 3, 1 / 6 ];\n\
  function d3_svg_lineBasisBezier(path, x, y) {\n\
    path.push(\"C\", d3_svg_lineDot4(d3_svg_lineBasisBezier1, x), \",\", d3_svg_lineDot4(d3_svg_lineBasisBezier1, y), \",\", d3_svg_lineDot4(d3_svg_lineBasisBezier2, x), \",\", d3_svg_lineDot4(d3_svg_lineBasisBezier2, y), \",\", d3_svg_lineDot4(d3_svg_lineBasisBezier3, x), \",\", d3_svg_lineDot4(d3_svg_lineBasisBezier3, y));\n\
  }\n\
  function d3_svg_lineSlope(p0, p1) {\n\
    return (p1[1] - p0[1]) / (p1[0] - p0[0]);\n\
  }\n\
  function d3_svg_lineFiniteDifferences(points) {\n\
    var i = 0, j = points.length - 1, m = [], p0 = points[0], p1 = points[1], d = m[0] = d3_svg_lineSlope(p0, p1);\n\
    while (++i < j) {\n\
      m[i] = (d + (d = d3_svg_lineSlope(p0 = p1, p1 = points[i + 1]))) / 2;\n\
    }\n\
    m[i] = d;\n\
    return m;\n\
  }\n\
  function d3_svg_lineMonotoneTangents(points) {\n\
    var tangents = [], d, a, b, s, m = d3_svg_lineFiniteDifferences(points), i = -1, j = points.length - 1;\n\
    while (++i < j) {\n\
      d = d3_svg_lineSlope(points[i], points[i + 1]);\n\
      if (abs(d) < ε) {\n\
        m[i] = m[i + 1] = 0;\n\
      } else {\n\
        a = m[i] / d;\n\
        b = m[i + 1] / d;\n\
        s = a * a + b * b;\n\
        if (s > 9) {\n\
          s = d * 3 / Math.sqrt(s);\n\
          m[i] = s * a;\n\
          m[i + 1] = s * b;\n\
        }\n\
      }\n\
    }\n\
    i = -1;\n\
    while (++i <= j) {\n\
      s = (points[Math.min(j, i + 1)][0] - points[Math.max(0, i - 1)][0]) / (6 * (1 + m[i] * m[i]));\n\
      tangents.push([ s || 0, m[i] * s || 0 ]);\n\
    }\n\
    return tangents;\n\
  }\n\
  function d3_svg_lineMonotone(points) {\n\
    return points.length < 3 ? d3_svg_lineLinear(points) : points[0] + d3_svg_lineHermite(points, d3_svg_lineMonotoneTangents(points));\n\
  }\n\
  d3.svg.line.radial = function() {\n\
    var line = d3_svg_line(d3_svg_lineRadial);\n\
    line.radius = line.x, delete line.x;\n\
    line.angle = line.y, delete line.y;\n\
    return line;\n\
  };\n\
  function d3_svg_lineRadial(points) {\n\
    var point, i = -1, n = points.length, r, a;\n\
    while (++i < n) {\n\
      point = points[i];\n\
      r = point[0];\n\
      a = point[1] + d3_svg_arcOffset;\n\
      point[0] = r * Math.cos(a);\n\
      point[1] = r * Math.sin(a);\n\
    }\n\
    return points;\n\
  }\n\
  function d3_svg_area(projection) {\n\
    var x0 = d3_geom_pointX, x1 = d3_geom_pointX, y0 = 0, y1 = d3_geom_pointY, defined = d3_true, interpolate = d3_svg_lineLinear, interpolateKey = interpolate.key, interpolateReverse = interpolate, L = \"L\", tension = .7;\n\
    function area(data) {\n\
      var segments = [], points0 = [], points1 = [], i = -1, n = data.length, d, fx0 = d3_functor(x0), fy0 = d3_functor(y0), fx1 = x0 === x1 ? function() {\n\
        return x;\n\
      } : d3_functor(x1), fy1 = y0 === y1 ? function() {\n\
        return y;\n\
      } : d3_functor(y1), x, y;\n\
      function segment() {\n\
        segments.push(\"M\", interpolate(projection(points1), tension), L, interpolateReverse(projection(points0.reverse()), tension), \"Z\");\n\
      }\n\
      while (++i < n) {\n\
        if (defined.call(this, d = data[i], i)) {\n\
          points0.push([ x = +fx0.call(this, d, i), y = +fy0.call(this, d, i) ]);\n\
          points1.push([ +fx1.call(this, d, i), +fy1.call(this, d, i) ]);\n\
        } else if (points0.length) {\n\
          segment();\n\
          points0 = [];\n\
          points1 = [];\n\
        }\n\
      }\n\
      if (points0.length) segment();\n\
      return segments.length ? segments.join(\"\") : null;\n\
    }\n\
    area.x = function(_) {\n\
      if (!arguments.length) return x1;\n\
      x0 = x1 = _;\n\
      return area;\n\
    };\n\
    area.x0 = function(_) {\n\
      if (!arguments.length) return x0;\n\
      x0 = _;\n\
      return area;\n\
    };\n\
    area.x1 = function(_) {\n\
      if (!arguments.length) return x1;\n\
      x1 = _;\n\
      return area;\n\
    };\n\
    area.y = function(_) {\n\
      if (!arguments.length) return y1;\n\
      y0 = y1 = _;\n\
      return area;\n\
    };\n\
    area.y0 = function(_) {\n\
      if (!arguments.length) return y0;\n\
      y0 = _;\n\
      return area;\n\
    };\n\
    area.y1 = function(_) {\n\
      if (!arguments.length) return y1;\n\
      y1 = _;\n\
      return area;\n\
    };\n\
    area.defined = function(_) {\n\
      if (!arguments.length) return defined;\n\
      defined = _;\n\
      return area;\n\
    };\n\
    area.interpolate = function(_) {\n\
      if (!arguments.length) return interpolateKey;\n\
      if (typeof _ === \"function\") interpolateKey = interpolate = _; else interpolateKey = (interpolate = d3_svg_lineInterpolators.get(_) || d3_svg_lineLinear).key;\n\
      interpolateReverse = interpolate.reverse || interpolate;\n\
      L = interpolate.closed ? \"M\" : \"L\";\n\
      return area;\n\
    };\n\
    area.tension = function(_) {\n\
      if (!arguments.length) return tension;\n\
      tension = _;\n\
      return area;\n\
    };\n\
    return area;\n\
  }\n\
  d3_svg_lineStepBefore.reverse = d3_svg_lineStepAfter;\n\
  d3_svg_lineStepAfter.reverse = d3_svg_lineStepBefore;\n\
  d3.svg.area = function() {\n\
    return d3_svg_area(d3_identity);\n\
  };\n\
  d3.svg.area.radial = function() {\n\
    var area = d3_svg_area(d3_svg_lineRadial);\n\
    area.radius = area.x, delete area.x;\n\
    area.innerRadius = area.x0, delete area.x0;\n\
    area.outerRadius = area.x1, delete area.x1;\n\
    area.angle = area.y, delete area.y;\n\
    area.startAngle = area.y0, delete area.y0;\n\
    area.endAngle = area.y1, delete area.y1;\n\
    return area;\n\
  };\n\
  d3.svg.chord = function() {\n\
    var source = d3_source, target = d3_target, radius = d3_svg_chordRadius, startAngle = d3_svg_arcStartAngle, endAngle = d3_svg_arcEndAngle;\n\
    function chord(d, i) {\n\
      var s = subgroup(this, source, d, i), t = subgroup(this, target, d, i);\n\
      return \"M\" + s.p0 + arc(s.r, s.p1, s.a1 - s.a0) + (equals(s, t) ? curve(s.r, s.p1, s.r, s.p0) : curve(s.r, s.p1, t.r, t.p0) + arc(t.r, t.p1, t.a1 - t.a0) + curve(t.r, t.p1, s.r, s.p0)) + \"Z\";\n\
    }\n\
    function subgroup(self, f, d, i) {\n\
      var subgroup = f.call(self, d, i), r = radius.call(self, subgroup, i), a0 = startAngle.call(self, subgroup, i) + d3_svg_arcOffset, a1 = endAngle.call(self, subgroup, i) + d3_svg_arcOffset;\n\
      return {\n\
        r: r,\n\
        a0: a0,\n\
        a1: a1,\n\
        p0: [ r * Math.cos(a0), r * Math.sin(a0) ],\n\
        p1: [ r * Math.cos(a1), r * Math.sin(a1) ]\n\
      };\n\
    }\n\
    function equals(a, b) {\n\
      return a.a0 == b.a0 && a.a1 == b.a1;\n\
    }\n\
    function arc(r, p, a) {\n\
      return \"A\" + r + \",\" + r + \" 0 \" + +(a > π) + \",1 \" + p;\n\
    }\n\
    function curve(r0, p0, r1, p1) {\n\
      return \"Q 0,0 \" + p1;\n\
    }\n\
    chord.radius = function(v) {\n\
      if (!arguments.length) return radius;\n\
      radius = d3_functor(v);\n\
      return chord;\n\
    };\n\
    chord.source = function(v) {\n\
      if (!arguments.length) return source;\n\
      source = d3_functor(v);\n\
      return chord;\n\
    };\n\
    chord.target = function(v) {\n\
      if (!arguments.length) return target;\n\
      target = d3_functor(v);\n\
      return chord;\n\
    };\n\
    chord.startAngle = function(v) {\n\
      if (!arguments.length) return startAngle;\n\
      startAngle = d3_functor(v);\n\
      return chord;\n\
    };\n\
    chord.endAngle = function(v) {\n\
      if (!arguments.length) return endAngle;\n\
      endAngle = d3_functor(v);\n\
      return chord;\n\
    };\n\
    return chord;\n\
  };\n\
  function d3_svg_chordRadius(d) {\n\
    return d.radius;\n\
  }\n\
  d3.svg.diagonal = function() {\n\
    var source = d3_source, target = d3_target, projection = d3_svg_diagonalProjection;\n\
    function diagonal(d, i) {\n\
      var p0 = source.call(this, d, i), p3 = target.call(this, d, i), m = (p0.y + p3.y) / 2, p = [ p0, {\n\
        x: p0.x,\n\
        y: m\n\
      }, {\n\
        x: p3.x,\n\
        y: m\n\
      }, p3 ];\n\
      p = p.map(projection);\n\
      return \"M\" + p[0] + \"C\" + p[1] + \" \" + p[2] + \" \" + p[3];\n\
    }\n\
    diagonal.source = function(x) {\n\
      if (!arguments.length) return source;\n\
      source = d3_functor(x);\n\
      return diagonal;\n\
    };\n\
    diagonal.target = function(x) {\n\
      if (!arguments.length) return target;\n\
      target = d3_functor(x);\n\
      return diagonal;\n\
    };\n\
    diagonal.projection = function(x) {\n\
      if (!arguments.length) return projection;\n\
      projection = x;\n\
      return diagonal;\n\
    };\n\
    return diagonal;\n\
  };\n\
  function d3_svg_diagonalProjection(d) {\n\
    return [ d.x, d.y ];\n\
  }\n\
  d3.svg.diagonal.radial = function() {\n\
    var diagonal = d3.svg.diagonal(), projection = d3_svg_diagonalProjection, projection_ = diagonal.projection;\n\
    diagonal.projection = function(x) {\n\
      return arguments.length ? projection_(d3_svg_diagonalRadialProjection(projection = x)) : projection;\n\
    };\n\
    return diagonal;\n\
  };\n\
  function d3_svg_diagonalRadialProjection(projection) {\n\
    return function() {\n\
      var d = projection.apply(this, arguments), r = d[0], a = d[1] + d3_svg_arcOffset;\n\
      return [ r * Math.cos(a), r * Math.sin(a) ];\n\
    };\n\
  }\n\
  d3.svg.symbol = function() {\n\
    var type = d3_svg_symbolType, size = d3_svg_symbolSize;\n\
    function symbol(d, i) {\n\
      return (d3_svg_symbols.get(type.call(this, d, i)) || d3_svg_symbolCircle)(size.call(this, d, i));\n\
    }\n\
    symbol.type = function(x) {\n\
      if (!arguments.length) return type;\n\
      type = d3_functor(x);\n\
      return symbol;\n\
    };\n\
    symbol.size = function(x) {\n\
      if (!arguments.length) return size;\n\
      size = d3_functor(x);\n\
      return symbol;\n\
    };\n\
    return symbol;\n\
  };\n\
  function d3_svg_symbolSize() {\n\
    return 64;\n\
  }\n\
  function d3_svg_symbolType() {\n\
    return \"circle\";\n\
  }\n\
  function d3_svg_symbolCircle(size) {\n\
    var r = Math.sqrt(size / π);\n\
    return \"M0,\" + r + \"A\" + r + \",\" + r + \" 0 1,1 0,\" + -r + \"A\" + r + \",\" + r + \" 0 1,1 0,\" + r + \"Z\";\n\
  }\n\
  var d3_svg_symbols = d3.map({\n\
    circle: d3_svg_symbolCircle,\n\
    cross: function(size) {\n\
      var r = Math.sqrt(size / 5) / 2;\n\
      return \"M\" + -3 * r + \",\" + -r + \"H\" + -r + \"V\" + -3 * r + \"H\" + r + \"V\" + -r + \"H\" + 3 * r + \"V\" + r + \"H\" + r + \"V\" + 3 * r + \"H\" + -r + \"V\" + r + \"H\" + -3 * r + \"Z\";\n\
    },\n\
    diamond: function(size) {\n\
      var ry = Math.sqrt(size / (2 * d3_svg_symbolTan30)), rx = ry * d3_svg_symbolTan30;\n\
      return \"M0,\" + -ry + \"L\" + rx + \",0\" + \" 0,\" + ry + \" \" + -rx + \",0\" + \"Z\";\n\
    },\n\
    square: function(size) {\n\
      var r = Math.sqrt(size) / 2;\n\
      return \"M\" + -r + \",\" + -r + \"L\" + r + \",\" + -r + \" \" + r + \",\" + r + \" \" + -r + \",\" + r + \"Z\";\n\
    },\n\
    \"triangle-down\": function(size) {\n\
      var rx = Math.sqrt(size / d3_svg_symbolSqrt3), ry = rx * d3_svg_symbolSqrt3 / 2;\n\
      return \"M0,\" + ry + \"L\" + rx + \",\" + -ry + \" \" + -rx + \",\" + -ry + \"Z\";\n\
    },\n\
    \"triangle-up\": function(size) {\n\
      var rx = Math.sqrt(size / d3_svg_symbolSqrt3), ry = rx * d3_svg_symbolSqrt3 / 2;\n\
      return \"M0,\" + -ry + \"L\" + rx + \",\" + ry + \" \" + -rx + \",\" + ry + \"Z\";\n\
    }\n\
  });\n\
  d3.svg.symbolTypes = d3_svg_symbols.keys();\n\
  var d3_svg_symbolSqrt3 = Math.sqrt(3), d3_svg_symbolTan30 = Math.tan(30 * d3_radians);\n\
  function d3_transition(groups, id) {\n\
    d3_subclass(groups, d3_transitionPrototype);\n\
    groups.id = id;\n\
    return groups;\n\
  }\n\
  var d3_transitionPrototype = [], d3_transitionId = 0, d3_transitionInheritId, d3_transitionInherit;\n\
  d3_transitionPrototype.call = d3_selectionPrototype.call;\n\
  d3_transitionPrototype.empty = d3_selectionPrototype.empty;\n\
  d3_transitionPrototype.node = d3_selectionPrototype.node;\n\
  d3_transitionPrototype.size = d3_selectionPrototype.size;\n\
  d3.transition = function(selection) {\n\
    return arguments.length ? d3_transitionInheritId ? selection.transition() : selection : d3_selectionRoot.transition();\n\
  };\n\
  d3.transition.prototype = d3_transitionPrototype;\n\
  d3_transitionPrototype.select = function(selector) {\n\
    var id = this.id, subgroups = [], subgroup, subnode, node;\n\
    selector = d3_selection_selector(selector);\n\
    for (var j = -1, m = this.length; ++j < m; ) {\n\
      subgroups.push(subgroup = []);\n\
      for (var group = this[j], i = -1, n = group.length; ++i < n; ) {\n\
        if ((node = group[i]) && (subnode = selector.call(node, node.__data__, i, j))) {\n\
          if (\"__data__\" in node) subnode.__data__ = node.__data__;\n\
          d3_transitionNode(subnode, i, id, node.__transition__[id]);\n\
          subgroup.push(subnode);\n\
        } else {\n\
          subgroup.push(null);\n\
        }\n\
      }\n\
    }\n\
    return d3_transition(subgroups, id);\n\
  };\n\
  d3_transitionPrototype.selectAll = function(selector) {\n\
    var id = this.id, subgroups = [], subgroup, subnodes, node, subnode, transition;\n\
    selector = d3_selection_selectorAll(selector);\n\
    for (var j = -1, m = this.length; ++j < m; ) {\n\
      for (var group = this[j], i = -1, n = group.length; ++i < n; ) {\n\
        if (node = group[i]) {\n\
          transition = node.__transition__[id];\n\
          subnodes = selector.call(node, node.__data__, i, j);\n\
          subgroups.push(subgroup = []);\n\
          for (var k = -1, o = subnodes.length; ++k < o; ) {\n\
            if (subnode = subnodes[k]) d3_transitionNode(subnode, k, id, transition);\n\
            subgroup.push(subnode);\n\
          }\n\
        }\n\
      }\n\
    }\n\
    return d3_transition(subgroups, id);\n\
  };\n\
  d3_transitionPrototype.filter = function(filter) {\n\
    var subgroups = [], subgroup, group, node;\n\
    if (typeof filter !== \"function\") filter = d3_selection_filter(filter);\n\
    for (var j = 0, m = this.length; j < m; j++) {\n\
      subgroups.push(subgroup = []);\n\
      for (var group = this[j], i = 0, n = group.length; i < n; i++) {\n\
        if ((node = group[i]) && filter.call(node, node.__data__, i, j)) {\n\
          subgroup.push(node);\n\
        }\n\
      }\n\
    }\n\
    return d3_transition(subgroups, this.id);\n\
  };\n\
  d3_transitionPrototype.tween = function(name, tween) {\n\
    var id = this.id;\n\
    if (arguments.length < 2) return this.node().__transition__[id].tween.get(name);\n\
    return d3_selection_each(this, tween == null ? function(node) {\n\
      node.__transition__[id].tween.remove(name);\n\
    } : function(node) {\n\
      node.__transition__[id].tween.set(name, tween);\n\
    });\n\
  };\n\
  function d3_transition_tween(groups, name, value, tween) {\n\
    var id = groups.id;\n\
    return d3_selection_each(groups, typeof value === \"function\" ? function(node, i, j) {\n\
      node.__transition__[id].tween.set(name, tween(value.call(node, node.__data__, i, j)));\n\
    } : (value = tween(value), function(node) {\n\
      node.__transition__[id].tween.set(name, value);\n\
    }));\n\
  }\n\
  d3_transitionPrototype.attr = function(nameNS, value) {\n\
    if (arguments.length < 2) {\n\
      for (value in nameNS) this.attr(value, nameNS[value]);\n\
      return this;\n\
    }\n\
    var interpolate = nameNS == \"transform\" ? d3_interpolateTransform : d3_interpolate, name = d3.ns.qualify(nameNS);\n\
    function attrNull() {\n\
      this.removeAttribute(name);\n\
    }\n\
    function attrNullNS() {\n\
      this.removeAttributeNS(name.space, name.local);\n\
    }\n\
    function attrTween(b) {\n\
      return b == null ? attrNull : (b += \"\", function() {\n\
        var a = this.getAttribute(name), i;\n\
        return a !== b && (i = interpolate(a, b), function(t) {\n\
          this.setAttribute(name, i(t));\n\
        });\n\
      });\n\
    }\n\
    function attrTweenNS(b) {\n\
      return b == null ? attrNullNS : (b += \"\", function() {\n\
        var a = this.getAttributeNS(name.space, name.local), i;\n\
        return a !== b && (i = interpolate(a, b), function(t) {\n\
          this.setAttributeNS(name.space, name.local, i(t));\n\
        });\n\
      });\n\
    }\n\
    return d3_transition_tween(this, \"attr.\" + nameNS, value, name.local ? attrTweenNS : attrTween);\n\
  };\n\
  d3_transitionPrototype.attrTween = function(nameNS, tween) {\n\
    var name = d3.ns.qualify(nameNS);\n\
    function attrTween(d, i) {\n\
      var f = tween.call(this, d, i, this.getAttribute(name));\n\
      return f && function(t) {\n\
        this.setAttribute(name, f(t));\n\
      };\n\
    }\n\
    function attrTweenNS(d, i) {\n\
      var f = tween.call(this, d, i, this.getAttributeNS(name.space, name.local));\n\
      return f && function(t) {\n\
        this.setAttributeNS(name.space, name.local, f(t));\n\
      };\n\
    }\n\
    return this.tween(\"attr.\" + nameNS, name.local ? attrTweenNS : attrTween);\n\
  };\n\
  d3_transitionPrototype.style = function(name, value, priority) {\n\
    var n = arguments.length;\n\
    if (n < 3) {\n\
      if (typeof name !== \"string\") {\n\
        if (n < 2) value = \"\";\n\
        for (priority in name) this.style(priority, name[priority], value);\n\
        return this;\n\
      }\n\
      priority = \"\";\n\
    }\n\
    function styleNull() {\n\
      this.style.removeProperty(name);\n\
    }\n\
    function styleString(b) {\n\
      return b == null ? styleNull : (b += \"\", function() {\n\
        var a = d3_window.getComputedStyle(this, null).getPropertyValue(name), i;\n\
        return a !== b && (i = d3_interpolate(a, b), function(t) {\n\
          this.style.setProperty(name, i(t), priority);\n\
        });\n\
      });\n\
    }\n\
    return d3_transition_tween(this, \"style.\" + name, value, styleString);\n\
  };\n\
  d3_transitionPrototype.styleTween = function(name, tween, priority) {\n\
    if (arguments.length < 3) priority = \"\";\n\
    function styleTween(d, i) {\n\
      var f = tween.call(this, d, i, d3_window.getComputedStyle(this, null).getPropertyValue(name));\n\
      return f && function(t) {\n\
        this.style.setProperty(name, f(t), priority);\n\
      };\n\
    }\n\
    return this.tween(\"style.\" + name, styleTween);\n\
  };\n\
  d3_transitionPrototype.text = function(value) {\n\
    return d3_transition_tween(this, \"text\", value, d3_transition_text);\n\
  };\n\
  function d3_transition_text(b) {\n\
    if (b == null) b = \"\";\n\
    return function() {\n\
      this.textContent = b;\n\
    };\n\
  }\n\
  d3_transitionPrototype.remove = function() {\n\
    return this.each(\"end.transition\", function() {\n\
      var p;\n\
      if (this.__transition__.count < 2 && (p = this.parentNode)) p.removeChild(this);\n\
    });\n\
  };\n\
  d3_transitionPrototype.ease = function(value) {\n\
    var id = this.id;\n\
    if (arguments.length < 1) return this.node().__transition__[id].ease;\n\
    if (typeof value !== \"function\") value = d3.ease.apply(d3, arguments);\n\
    return d3_selection_each(this, function(node) {\n\
      node.__transition__[id].ease = value;\n\
    });\n\
  };\n\
  d3_transitionPrototype.delay = function(value) {\n\
    var id = this.id;\n\
    if (arguments.length < 1) return this.node().__transition__[id].delay;\n\
    return d3_selection_each(this, typeof value === \"function\" ? function(node, i, j) {\n\
      node.__transition__[id].delay = +value.call(node, node.__data__, i, j);\n\
    } : (value = +value, function(node) {\n\
      node.__transition__[id].delay = value;\n\
    }));\n\
  };\n\
  d3_transitionPrototype.duration = function(value) {\n\
    var id = this.id;\n\
    if (arguments.length < 1) return this.node().__transition__[id].duration;\n\
    return d3_selection_each(this, typeof value === \"function\" ? function(node, i, j) {\n\
      node.__transition__[id].duration = Math.max(1, value.call(node, node.__data__, i, j));\n\
    } : (value = Math.max(1, value), function(node) {\n\
      node.__transition__[id].duration = value;\n\
    }));\n\
  };\n\
  d3_transitionPrototype.each = function(type, listener) {\n\
    var id = this.id;\n\
    if (arguments.length < 2) {\n\
      var inherit = d3_transitionInherit, inheritId = d3_transitionInheritId;\n\
      d3_transitionInheritId = id;\n\
      d3_selection_each(this, function(node, i, j) {\n\
        d3_transitionInherit = node.__transition__[id];\n\
        type.call(node, node.__data__, i, j);\n\
      });\n\
      d3_transitionInherit = inherit;\n\
      d3_transitionInheritId = inheritId;\n\
    } else {\n\
      d3_selection_each(this, function(node) {\n\
        var transition = node.__transition__[id];\n\
        (transition.event || (transition.event = d3.dispatch(\"start\", \"end\"))).on(type, listener);\n\
      });\n\
    }\n\
    return this;\n\
  };\n\
  d3_transitionPrototype.transition = function() {\n\
    var id0 = this.id, id1 = ++d3_transitionId, subgroups = [], subgroup, group, node, transition;\n\
    for (var j = 0, m = this.length; j < m; j++) {\n\
      subgroups.push(subgroup = []);\n\
      for (var group = this[j], i = 0, n = group.length; i < n; i++) {\n\
        if (node = group[i]) {\n\
          transition = Object.create(node.__transition__[id0]);\n\
          transition.delay += transition.duration;\n\
          d3_transitionNode(node, i, id1, transition);\n\
        }\n\
        subgroup.push(node);\n\
      }\n\
    }\n\
    return d3_transition(subgroups, id1);\n\
  };\n\
  function d3_transitionNode(node, i, id, inherit) {\n\
    var lock = node.__transition__ || (node.__transition__ = {\n\
      active: 0,\n\
      count: 0\n\
    }), transition = lock[id];\n\
    if (!transition) {\n\
      var time = inherit.time;\n\
      transition = lock[id] = {\n\
        tween: new d3_Map(),\n\
        time: time,\n\
        ease: inherit.ease,\n\
        delay: inherit.delay,\n\
        duration: inherit.duration\n\
      };\n\
      ++lock.count;\n\
      d3.timer(function(elapsed) {\n\
        var d = node.__data__, ease = transition.ease, delay = transition.delay, duration = transition.duration, timer = d3_timer_active, tweened = [];\n\
        timer.t = delay + time;\n\
        if (delay <= elapsed) return start(elapsed - delay);\n\
        timer.c = start;\n\
        function start(elapsed) {\n\
          if (lock.active > id) return stop();\n\
          lock.active = id;\n\
          transition.event && transition.event.start.call(node, d, i);\n\
          transition.tween.forEach(function(key, value) {\n\
            if (value = value.call(node, d, i)) {\n\
              tweened.push(value);\n\
            }\n\
          });\n\
          d3.timer(function() {\n\
            timer.c = tick(elapsed || 1) ? d3_true : tick;\n\
            return 1;\n\
          }, 0, time);\n\
        }\n\
        function tick(elapsed) {\n\
          if (lock.active !== id) return stop();\n\
          var t = elapsed / duration, e = ease(t), n = tweened.length;\n\
          while (n > 0) {\n\
            tweened[--n].call(node, e);\n\
          }\n\
          if (t >= 1) {\n\
            transition.event && transition.event.end.call(node, d, i);\n\
            return stop();\n\
          }\n\
        }\n\
        function stop() {\n\
          if (--lock.count) delete lock[id]; else delete node.__transition__;\n\
          return 1;\n\
        }\n\
      }, 0, time);\n\
    }\n\
  }\n\
  d3.svg.axis = function() {\n\
    var scale = d3.scale.linear(), orient = d3_svg_axisDefaultOrient, innerTickSize = 6, outerTickSize = 6, tickPadding = 3, tickArguments_ = [ 10 ], tickValues = null, tickFormat_;\n\
    function axis(g) {\n\
      g.each(function() {\n\
        var g = d3.select(this);\n\
        var scale0 = this.__chart__ || scale, scale1 = this.__chart__ = scale.copy();\n\
        var ticks = tickValues == null ? scale1.ticks ? scale1.ticks.apply(scale1, tickArguments_) : scale1.domain() : tickValues, tickFormat = tickFormat_ == null ? scale1.tickFormat ? scale1.tickFormat.apply(scale1, tickArguments_) : d3_identity : tickFormat_, tick = g.selectAll(\".tick\").data(ticks, scale1), tickEnter = tick.enter().insert(\"g\", \".domain\").attr(\"class\", \"tick\").style(\"opacity\", ε), tickExit = d3.transition(tick.exit()).style(\"opacity\", ε).remove(), tickUpdate = d3.transition(tick.order()).style(\"opacity\", 1), tickTransform;\n\
        var range = d3_scaleRange(scale1), path = g.selectAll(\".domain\").data([ 0 ]), pathUpdate = (path.enter().append(\"path\").attr(\"class\", \"domain\"), \n\
        d3.transition(path));\n\
        tickEnter.append(\"line\");\n\
        tickEnter.append(\"text\");\n\
        var lineEnter = tickEnter.select(\"line\"), lineUpdate = tickUpdate.select(\"line\"), text = tick.select(\"text\").text(tickFormat), textEnter = tickEnter.select(\"text\"), textUpdate = tickUpdate.select(\"text\");\n\
        switch (orient) {\n\
         case \"bottom\":\n\
          {\n\
            tickTransform = d3_svg_axisX;\n\
            lineEnter.attr(\"y2\", innerTickSize);\n\
            textEnter.attr(\"y\", Math.max(innerTickSize, 0) + tickPadding);\n\
            lineUpdate.attr(\"x2\", 0).attr(\"y2\", innerTickSize);\n\
            textUpdate.attr(\"x\", 0).attr(\"y\", Math.max(innerTickSize, 0) + tickPadding);\n\
            text.attr(\"dy\", \".71em\").style(\"text-anchor\", \"middle\");\n\
            pathUpdate.attr(\"d\", \"M\" + range[0] + \",\" + outerTickSize + \"V0H\" + range[1] + \"V\" + outerTickSize);\n\
            break;\n\
          }\n\
\n\
         case \"top\":\n\
          {\n\
            tickTransform = d3_svg_axisX;\n\
            lineEnter.attr(\"y2\", -innerTickSize);\n\
            textEnter.attr(\"y\", -(Math.max(innerTickSize, 0) + tickPadding));\n\
            lineUpdate.attr(\"x2\", 0).attr(\"y2\", -innerTickSize);\n\
            textUpdate.attr(\"x\", 0).attr(\"y\", -(Math.max(innerTickSize, 0) + tickPadding));\n\
            text.attr(\"dy\", \"0em\").style(\"text-anchor\", \"middle\");\n\
            pathUpdate.attr(\"d\", \"M\" + range[0] + \",\" + -outerTickSize + \"V0H\" + range[1] + \"V\" + -outerTickSize);\n\
            break;\n\
          }\n\
\n\
         case \"left\":\n\
          {\n\
            tickTransform = d3_svg_axisY;\n\
            lineEnter.attr(\"x2\", -innerTickSize);\n\
            textEnter.attr(\"x\", -(Math.max(innerTickSize, 0) + tickPadding));\n\
            lineUpdate.attr(\"x2\", -innerTickSize).attr(\"y2\", 0);\n\
            textUpdate.attr(\"x\", -(Math.max(innerTickSize, 0) + tickPadding)).attr(\"y\", 0);\n\
            text.attr(\"dy\", \".32em\").style(\"text-anchor\", \"end\");\n\
            pathUpdate.attr(\"d\", \"M\" + -outerTickSize + \",\" + range[0] + \"H0V\" + range[1] + \"H\" + -outerTickSize);\n\
            break;\n\
          }\n\
\n\
         case \"right\":\n\
          {\n\
            tickTransform = d3_svg_axisY;\n\
            lineEnter.attr(\"x2\", innerTickSize);\n\
            textEnter.attr(\"x\", Math.max(innerTickSize, 0) + tickPadding);\n\
            lineUpdate.attr(\"x2\", innerTickSize).attr(\"y2\", 0);\n\
            textUpdate.attr(\"x\", Math.max(innerTickSize, 0) + tickPadding).attr(\"y\", 0);\n\
            text.attr(\"dy\", \".32em\").style(\"text-anchor\", \"start\");\n\
            pathUpdate.attr(\"d\", \"M\" + outerTickSize + \",\" + range[0] + \"H0V\" + range[1] + \"H\" + outerTickSize);\n\
            break;\n\
          }\n\
        }\n\
        if (scale1.rangeBand) {\n\
          var x = scale1, dx = x.rangeBand() / 2;\n\
          scale0 = scale1 = function(d) {\n\
            return x(d) + dx;\n\
          };\n\
        } else if (scale0.rangeBand) {\n\
          scale0 = scale1;\n\
        } else {\n\
          tickExit.call(tickTransform, scale1);\n\
        }\n\
        tickEnter.call(tickTransform, scale0);\n\
        tickUpdate.call(tickTransform, scale1);\n\
      });\n\
    }\n\
    axis.scale = function(x) {\n\
      if (!arguments.length) return scale;\n\
      scale = x;\n\
      return axis;\n\
    };\n\
    axis.orient = function(x) {\n\
      if (!arguments.length) return orient;\n\
      orient = x in d3_svg_axisOrients ? x + \"\" : d3_svg_axisDefaultOrient;\n\
      return axis;\n\
    };\n\
    axis.ticks = function() {\n\
      if (!arguments.length) return tickArguments_;\n\
      tickArguments_ = arguments;\n\
      return axis;\n\
    };\n\
    axis.tickValues = function(x) {\n\
      if (!arguments.length) return tickValues;\n\
      tickValues = x;\n\
      return axis;\n\
    };\n\
    axis.tickFormat = function(x) {\n\
      if (!arguments.length) return tickFormat_;\n\
      tickFormat_ = x;\n\
      return axis;\n\
    };\n\
    axis.tickSize = function(x) {\n\
      var n = arguments.length;\n\
      if (!n) return innerTickSize;\n\
      innerTickSize = +x;\n\
      outerTickSize = +arguments[n - 1];\n\
      return axis;\n\
    };\n\
    axis.innerTickSize = function(x) {\n\
      if (!arguments.length) return innerTickSize;\n\
      innerTickSize = +x;\n\
      return axis;\n\
    };\n\
    axis.outerTickSize = function(x) {\n\
      if (!arguments.length) return outerTickSize;\n\
      outerTickSize = +x;\n\
      return axis;\n\
    };\n\
    axis.tickPadding = function(x) {\n\
      if (!arguments.length) return tickPadding;\n\
      tickPadding = +x;\n\
      return axis;\n\
    };\n\
    axis.tickSubdivide = function() {\n\
      return arguments.length && axis;\n\
    };\n\
    return axis;\n\
  };\n\
  var d3_svg_axisDefaultOrient = \"bottom\", d3_svg_axisOrients = {\n\
    top: 1,\n\
    right: 1,\n\
    bottom: 1,\n\
    left: 1\n\
  };\n\
  function d3_svg_axisX(selection, x) {\n\
    selection.attr(\"transform\", function(d) {\n\
      return \"translate(\" + x(d) + \",0)\";\n\
    });\n\
  }\n\
  function d3_svg_axisY(selection, y) {\n\
    selection.attr(\"transform\", function(d) {\n\
      return \"translate(0,\" + y(d) + \")\";\n\
    });\n\
  }\n\
  d3.svg.brush = function() {\n\
    var event = d3_eventDispatch(brush, \"brushstart\", \"brush\", \"brushend\"), x = null, y = null, xExtent = [ 0, 0 ], yExtent = [ 0, 0 ], xExtentDomain, yExtentDomain, xClamp = true, yClamp = true, resizes = d3_svg_brushResizes[0];\n\
    function brush(g) {\n\
      g.each(function() {\n\
        var g = d3.select(this).style(\"pointer-events\", \"all\").style(\"-webkit-tap-highlight-color\", \"rgba(0,0,0,0)\").on(\"mousedown.brush\", brushstart).on(\"touchstart.brush\", brushstart);\n\
        var background = g.selectAll(\".background\").data([ 0 ]);\n\
        background.enter().append(\"rect\").attr(\"class\", \"background\").style(\"visibility\", \"hidden\").style(\"cursor\", \"crosshair\");\n\
        g.selectAll(\".extent\").data([ 0 ]).enter().append(\"rect\").attr(\"class\", \"extent\").style(\"cursor\", \"move\");\n\
        var resize = g.selectAll(\".resize\").data(resizes, d3_identity);\n\
        resize.exit().remove();\n\
        resize.enter().append(\"g\").attr(\"class\", function(d) {\n\
          return \"resize \" + d;\n\
        }).style(\"cursor\", function(d) {\n\
          return d3_svg_brushCursor[d];\n\
        }).append(\"rect\").attr(\"x\", function(d) {\n\
          return /[ew]$/.test(d) ? -3 : null;\n\
        }).attr(\"y\", function(d) {\n\
          return /^[ns]/.test(d) ? -3 : null;\n\
        }).attr(\"width\", 6).attr(\"height\", 6).style(\"visibility\", \"hidden\");\n\
        resize.style(\"display\", brush.empty() ? \"none\" : null);\n\
        var gUpdate = d3.transition(g), backgroundUpdate = d3.transition(background), range;\n\
        if (x) {\n\
          range = d3_scaleRange(x);\n\
          backgroundUpdate.attr(\"x\", range[0]).attr(\"width\", range[1] - range[0]);\n\
          redrawX(gUpdate);\n\
        }\n\
        if (y) {\n\
          range = d3_scaleRange(y);\n\
          backgroundUpdate.attr(\"y\", range[0]).attr(\"height\", range[1] - range[0]);\n\
          redrawY(gUpdate);\n\
        }\n\
        redraw(gUpdate);\n\
      });\n\
    }\n\
    brush.event = function(g) {\n\
      g.each(function() {\n\
        var event_ = event.of(this, arguments), extent1 = {\n\
          x: xExtent,\n\
          y: yExtent,\n\
          i: xExtentDomain,\n\
          j: yExtentDomain\n\
        }, extent0 = this.__chart__ || extent1;\n\
        this.__chart__ = extent1;\n\
        if (d3_transitionInheritId) {\n\
          d3.select(this).transition().each(\"start.brush\", function() {\n\
            xExtentDomain = extent0.i;\n\
            yExtentDomain = extent0.j;\n\
            xExtent = extent0.x;\n\
            yExtent = extent0.y;\n\
            event_({\n\
              type: \"brushstart\"\n\
            });\n\
          }).tween(\"brush:brush\", function() {\n\
            var xi = d3_interpolateArray(xExtent, extent1.x), yi = d3_interpolateArray(yExtent, extent1.y);\n\
            xExtentDomain = yExtentDomain = null;\n\
            return function(t) {\n\
              xExtent = extent1.x = xi(t);\n\
              yExtent = extent1.y = yi(t);\n\
              event_({\n\
                type: \"brush\",\n\
                mode: \"resize\"\n\
              });\n\
            };\n\
          }).each(\"end.brush\", function() {\n\
            xExtentDomain = extent1.i;\n\
            yExtentDomain = extent1.j;\n\
            event_({\n\
              type: \"brush\",\n\
              mode: \"resize\"\n\
            });\n\
            event_({\n\
              type: \"brushend\"\n\
            });\n\
          });\n\
        } else {\n\
          event_({\n\
            type: \"brushstart\"\n\
          });\n\
          event_({\n\
            type: \"brush\",\n\
            mode: \"resize\"\n\
          });\n\
          event_({\n\
            type: \"brushend\"\n\
          });\n\
        }\n\
      });\n\
    };\n\
    function redraw(g) {\n\
      g.selectAll(\".resize\").attr(\"transform\", function(d) {\n\
        return \"translate(\" + xExtent[+/e$/.test(d)] + \",\" + yExtent[+/^s/.test(d)] + \")\";\n\
      });\n\
    }\n\
    function redrawX(g) {\n\
      g.select(\".extent\").attr(\"x\", xExtent[0]);\n\
      g.selectAll(\".extent,.n>rect,.s>rect\").attr(\"width\", xExtent[1] - xExtent[0]);\n\
    }\n\
    function redrawY(g) {\n\
      g.select(\".extent\").attr(\"y\", yExtent[0]);\n\
      g.selectAll(\".extent,.e>rect,.w>rect\").attr(\"height\", yExtent[1] - yExtent[0]);\n\
    }\n\
    function brushstart() {\n\
      var target = this, eventTarget = d3.select(d3.event.target), event_ = event.of(target, arguments), g = d3.select(target), resizing = eventTarget.datum(), resizingX = !/^(n|s)$/.test(resizing) && x, resizingY = !/^(e|w)$/.test(resizing) && y, dragging = eventTarget.classed(\"extent\"), dragRestore = d3_event_dragSuppress(), center, origin = d3.mouse(target), offset;\n\
      var w = d3.select(d3_window).on(\"keydown.brush\", keydown).on(\"keyup.brush\", keyup);\n\
      if (d3.event.changedTouches) {\n\
        w.on(\"touchmove.brush\", brushmove).on(\"touchend.brush\", brushend);\n\
      } else {\n\
        w.on(\"mousemove.brush\", brushmove).on(\"mouseup.brush\", brushend);\n\
      }\n\
      g.interrupt().selectAll(\"*\").interrupt();\n\
      if (dragging) {\n\
        origin[0] = xExtent[0] - origin[0];\n\
        origin[1] = yExtent[0] - origin[1];\n\
      } else if (resizing) {\n\
        var ex = +/w$/.test(resizing), ey = +/^n/.test(resizing);\n\
        offset = [ xExtent[1 - ex] - origin[0], yExtent[1 - ey] - origin[1] ];\n\
        origin[0] = xExtent[ex];\n\
        origin[1] = yExtent[ey];\n\
      } else if (d3.event.altKey) center = origin.slice();\n\
      g.style(\"pointer-events\", \"none\").selectAll(\".resize\").style(\"display\", null);\n\
      d3.select(\"body\").style(\"cursor\", eventTarget.style(\"cursor\"));\n\
      event_({\n\
        type: \"brushstart\"\n\
      });\n\
      brushmove();\n\
      function keydown() {\n\
        if (d3.event.keyCode == 32) {\n\
          if (!dragging) {\n\
            center = null;\n\
            origin[0] -= xExtent[1];\n\
            origin[1] -= yExtent[1];\n\
            dragging = 2;\n\
          }\n\
          d3_eventPreventDefault();\n\
        }\n\
      }\n\
      function keyup() {\n\
        if (d3.event.keyCode == 32 && dragging == 2) {\n\
          origin[0] += xExtent[1];\n\
          origin[1] += yExtent[1];\n\
          dragging = 0;\n\
          d3_eventPreventDefault();\n\
        }\n\
      }\n\
      function brushmove() {\n\
        var point = d3.mouse(target), moved = false;\n\
        if (offset) {\n\
          point[0] += offset[0];\n\
          point[1] += offset[1];\n\
        }\n\
        if (!dragging) {\n\
          if (d3.event.altKey) {\n\
            if (!center) center = [ (xExtent[0] + xExtent[1]) / 2, (yExtent[0] + yExtent[1]) / 2 ];\n\
            origin[0] = xExtent[+(point[0] < center[0])];\n\
            origin[1] = yExtent[+(point[1] < center[1])];\n\
          } else center = null;\n\
        }\n\
        if (resizingX && move1(point, x, 0)) {\n\
          redrawX(g);\n\
          moved = true;\n\
        }\n\
        if (resizingY && move1(point, y, 1)) {\n\
          redrawY(g);\n\
          moved = true;\n\
        }\n\
        if (moved) {\n\
          redraw(g);\n\
          event_({\n\
            type: \"brush\",\n\
            mode: dragging ? \"move\" : \"resize\"\n\
          });\n\
        }\n\
      }\n\
      function move1(point, scale, i) {\n\
        var range = d3_scaleRange(scale), r0 = range[0], r1 = range[1], position = origin[i], extent = i ? yExtent : xExtent, size = extent[1] - extent[0], min, max;\n\
        if (dragging) {\n\
          r0 -= position;\n\
          r1 -= size + position;\n\
        }\n\
        min = (i ? yClamp : xClamp) ? Math.max(r0, Math.min(r1, point[i])) : point[i];\n\
        if (dragging) {\n\
          max = (min += position) + size;\n\
        } else {\n\
          if (center) position = Math.max(r0, Math.min(r1, 2 * center[i] - min));\n\
          if (position < min) {\n\
            max = min;\n\
            min = position;\n\
          } else {\n\
            max = position;\n\
          }\n\
        }\n\
        if (extent[0] != min || extent[1] != max) {\n\
          if (i) yExtentDomain = null; else xExtentDomain = null;\n\
          extent[0] = min;\n\
          extent[1] = max;\n\
          return true;\n\
        }\n\
      }\n\
      function brushend() {\n\
        brushmove();\n\
        g.style(\"pointer-events\", \"all\").selectAll(\".resize\").style(\"display\", brush.empty() ? \"none\" : null);\n\
        d3.select(\"body\").style(\"cursor\", null);\n\
        w.on(\"mousemove.brush\", null).on(\"mouseup.brush\", null).on(\"touchmove.brush\", null).on(\"touchend.brush\", null).on(\"keydown.brush\", null).on(\"keyup.brush\", null);\n\
        dragRestore();\n\
        event_({\n\
          type: \"brushend\"\n\
        });\n\
      }\n\
    }\n\
    brush.x = function(z) {\n\
      if (!arguments.length) return x;\n\
      x = z;\n\
      resizes = d3_svg_brushResizes[!x << 1 | !y];\n\
      return brush;\n\
    };\n\
    brush.y = function(z) {\n\
      if (!arguments.length) return y;\n\
      y = z;\n\
      resizes = d3_svg_brushResizes[!x << 1 | !y];\n\
      return brush;\n\
    };\n\
    brush.clamp = function(z) {\n\
      if (!arguments.length) return x && y ? [ xClamp, yClamp ] : x ? xClamp : y ? yClamp : null;\n\
      if (x && y) xClamp = !!z[0], yClamp = !!z[1]; else if (x) xClamp = !!z; else if (y) yClamp = !!z;\n\
      return brush;\n\
    };\n\
    brush.extent = function(z) {\n\
      var x0, x1, y0, y1, t;\n\
      if (!arguments.length) {\n\
        if (x) {\n\
          if (xExtentDomain) {\n\
            x0 = xExtentDomain[0], x1 = xExtentDomain[1];\n\
          } else {\n\
            x0 = xExtent[0], x1 = xExtent[1];\n\
            if (x.invert) x0 = x.invert(x0), x1 = x.invert(x1);\n\
            if (x1 < x0) t = x0, x0 = x1, x1 = t;\n\
          }\n\
        }\n\
        if (y) {\n\
          if (yExtentDomain) {\n\
            y0 = yExtentDomain[0], y1 = yExtentDomain[1];\n\
          } else {\n\
            y0 = yExtent[0], y1 = yExtent[1];\n\
            if (y.invert) y0 = y.invert(y0), y1 = y.invert(y1);\n\
            if (y1 < y0) t = y0, y0 = y1, y1 = t;\n\
          }\n\
        }\n\
        return x && y ? [ [ x0, y0 ], [ x1, y1 ] ] : x ? [ x0, x1 ] : y && [ y0, y1 ];\n\
      }\n\
      if (x) {\n\
        x0 = z[0], x1 = z[1];\n\
        if (y) x0 = x0[0], x1 = x1[0];\n\
        xExtentDomain = [ x0, x1 ];\n\
        if (x.invert) x0 = x(x0), x1 = x(x1);\n\
        if (x1 < x0) t = x0, x0 = x1, x1 = t;\n\
        if (x0 != xExtent[0] || x1 != xExtent[1]) xExtent = [ x0, x1 ];\n\
      }\n\
      if (y) {\n\
        y0 = z[0], y1 = z[1];\n\
        if (x) y0 = y0[1], y1 = y1[1];\n\
        yExtentDomain = [ y0, y1 ];\n\
        if (y.invert) y0 = y(y0), y1 = y(y1);\n\
        if (y1 < y0) t = y0, y0 = y1, y1 = t;\n\
        if (y0 != yExtent[0] || y1 != yExtent[1]) yExtent = [ y0, y1 ];\n\
      }\n\
      return brush;\n\
    };\n\
    brush.clear = function() {\n\
      if (!brush.empty()) {\n\
        xExtent = [ 0, 0 ], yExtent = [ 0, 0 ];\n\
        xExtentDomain = yExtentDomain = null;\n\
      }\n\
      return brush;\n\
    };\n\
    brush.empty = function() {\n\
      return !!x && xExtent[0] == xExtent[1] || !!y && yExtent[0] == yExtent[1];\n\
    };\n\
    return d3.rebind(brush, event, \"on\");\n\
  };\n\
  var d3_svg_brushCursor = {\n\
    n: \"ns-resize\",\n\
    e: \"ew-resize\",\n\
    s: \"ns-resize\",\n\
    w: \"ew-resize\",\n\
    nw: \"nwse-resize\",\n\
    ne: \"nesw-resize\",\n\
    se: \"nwse-resize\",\n\
    sw: \"nesw-resize\"\n\
  };\n\
  var d3_svg_brushResizes = [ [ \"n\", \"e\", \"s\", \"w\", \"nw\", \"ne\", \"se\", \"sw\" ], [ \"e\", \"w\" ], [ \"n\", \"s\" ], [] ];\n\
  var d3_time_format = d3_time.format = d3_locale_enUS.timeFormat;\n\
  var d3_time_formatUtc = d3_time_format.utc;\n\
  var d3_time_formatIso = d3_time_formatUtc(\"%Y-%m-%dT%H:%M:%S.%LZ\");\n\
  d3_time_format.iso = Date.prototype.toISOString && +new Date(\"2000-01-01T00:00:00.000Z\") ? d3_time_formatIsoNative : d3_time_formatIso;\n\
  function d3_time_formatIsoNative(date) {\n\
    return date.toISOString();\n\
  }\n\
  d3_time_formatIsoNative.parse = function(string) {\n\
    var date = new Date(string);\n\
    return isNaN(date) ? null : date;\n\
  };\n\
  d3_time_formatIsoNative.toString = d3_time_formatIso.toString;\n\
  d3_time.second = d3_time_interval(function(date) {\n\
    return new d3_date(Math.floor(date / 1e3) * 1e3);\n\
  }, function(date, offset) {\n\
    date.setTime(date.getTime() + Math.floor(offset) * 1e3);\n\
  }, function(date) {\n\
    return date.getSeconds();\n\
  });\n\
  d3_time.seconds = d3_time.second.range;\n\
  d3_time.seconds.utc = d3_time.second.utc.range;\n\
  d3_time.minute = d3_time_interval(function(date) {\n\
    return new d3_date(Math.floor(date / 6e4) * 6e4);\n\
  }, function(date, offset) {\n\
    date.setTime(date.getTime() + Math.floor(offset) * 6e4);\n\
  }, function(date) {\n\
    return date.getMinutes();\n\
  });\n\
  d3_time.minutes = d3_time.minute.range;\n\
  d3_time.minutes.utc = d3_time.minute.utc.range;\n\
  d3_time.hour = d3_time_interval(function(date) {\n\
    var timezone = date.getTimezoneOffset() / 60;\n\
    return new d3_date((Math.floor(date / 36e5 - timezone) + timezone) * 36e5);\n\
  }, function(date, offset) {\n\
    date.setTime(date.getTime() + Math.floor(offset) * 36e5);\n\
  }, function(date) {\n\
    return date.getHours();\n\
  });\n\
  d3_time.hours = d3_time.hour.range;\n\
  d3_time.hours.utc = d3_time.hour.utc.range;\n\
  d3_time.month = d3_time_interval(function(date) {\n\
    date = d3_time.day(date);\n\
    date.setDate(1);\n\
    return date;\n\
  }, function(date, offset) {\n\
    date.setMonth(date.getMonth() + offset);\n\
  }, function(date) {\n\
    return date.getMonth();\n\
  });\n\
  d3_time.months = d3_time.month.range;\n\
  d3_time.months.utc = d3_time.month.utc.range;\n\
  function d3_time_scale(linear, methods, format) {\n\
    function scale(x) {\n\
      return linear(x);\n\
    }\n\
    scale.invert = function(x) {\n\
      return d3_time_scaleDate(linear.invert(x));\n\
    };\n\
    scale.domain = function(x) {\n\
      if (!arguments.length) return linear.domain().map(d3_time_scaleDate);\n\
      linear.domain(x);\n\
      return scale;\n\
    };\n\
    function tickMethod(extent, count) {\n\
      var span = extent[1] - extent[0], target = span / count, i = d3.bisect(d3_time_scaleSteps, target);\n\
      return i == d3_time_scaleSteps.length ? [ methods.year, d3_scale_linearTickRange(extent.map(function(d) {\n\
        return d / 31536e6;\n\
      }), count)[2] ] : !i ? [ d3_time_scaleMilliseconds, d3_scale_linearTickRange(extent, count)[2] ] : methods[target / d3_time_scaleSteps[i - 1] < d3_time_scaleSteps[i] / target ? i - 1 : i];\n\
    }\n\
    scale.nice = function(interval, skip) {\n\
      var domain = scale.domain(), extent = d3_scaleExtent(domain), method = interval == null ? tickMethod(extent, 10) : typeof interval === \"number\" && tickMethod(extent, interval);\n\
      if (method) interval = method[0], skip = method[1];\n\
      function skipped(date) {\n\
        return !isNaN(date) && !interval.range(date, d3_time_scaleDate(+date + 1), skip).length;\n\
      }\n\
      return scale.domain(d3_scale_nice(domain, skip > 1 ? {\n\
        floor: function(date) {\n\
          while (skipped(date = interval.floor(date))) date = d3_time_scaleDate(date - 1);\n\
          return date;\n\
        },\n\
        ceil: function(date) {\n\
          while (skipped(date = interval.ceil(date))) date = d3_time_scaleDate(+date + 1);\n\
          return date;\n\
        }\n\
      } : interval));\n\
    };\n\
    scale.ticks = function(interval, skip) {\n\
      var extent = d3_scaleExtent(scale.domain()), method = interval == null ? tickMethod(extent, 10) : typeof interval === \"number\" ? tickMethod(extent, interval) : !interval.range && [ {\n\
        range: interval\n\
      }, skip ];\n\
      if (method) interval = method[0], skip = method[1];\n\
      return interval.range(extent[0], d3_time_scaleDate(+extent[1] + 1), skip < 1 ? 1 : skip);\n\
    };\n\
    scale.tickFormat = function() {\n\
      return format;\n\
    };\n\
    scale.copy = function() {\n\
      return d3_time_scale(linear.copy(), methods, format);\n\
    };\n\
    return d3_scale_linearRebind(scale, linear);\n\
  }\n\
  function d3_time_scaleDate(t) {\n\
    return new Date(t);\n\
  }\n\
  var d3_time_scaleSteps = [ 1e3, 5e3, 15e3, 3e4, 6e4, 3e5, 9e5, 18e5, 36e5, 108e5, 216e5, 432e5, 864e5, 1728e5, 6048e5, 2592e6, 7776e6, 31536e6 ];\n\
  var d3_time_scaleLocalMethods = [ [ d3_time.second, 1 ], [ d3_time.second, 5 ], [ d3_time.second, 15 ], [ d3_time.second, 30 ], [ d3_time.minute, 1 ], [ d3_time.minute, 5 ], [ d3_time.minute, 15 ], [ d3_time.minute, 30 ], [ d3_time.hour, 1 ], [ d3_time.hour, 3 ], [ d3_time.hour, 6 ], [ d3_time.hour, 12 ], [ d3_time.day, 1 ], [ d3_time.day, 2 ], [ d3_time.week, 1 ], [ d3_time.month, 1 ], [ d3_time.month, 3 ], [ d3_time.year, 1 ] ];\n\
  var d3_time_scaleLocalFormat = d3_time_format.multi([ [ \".%L\", function(d) {\n\
    return d.getMilliseconds();\n\
  } ], [ \":%S\", function(d) {\n\
    return d.getSeconds();\n\
  } ], [ \"%I:%M\", function(d) {\n\
    return d.getMinutes();\n\
  } ], [ \"%I %p\", function(d) {\n\
    return d.getHours();\n\
  } ], [ \"%a %d\", function(d) {\n\
    return d.getDay() && d.getDate() != 1;\n\
  } ], [ \"%b %d\", function(d) {\n\
    return d.getDate() != 1;\n\
  } ], [ \"%B\", function(d) {\n\
    return d.getMonth();\n\
  } ], [ \"%Y\", d3_true ] ]);\n\
  var d3_time_scaleMilliseconds = {\n\
    range: function(start, stop, step) {\n\
      return d3.range(Math.ceil(start / step) * step, +stop, step).map(d3_time_scaleDate);\n\
    },\n\
    floor: d3_identity,\n\
    ceil: d3_identity\n\
  };\n\
  d3_time_scaleLocalMethods.year = d3_time.year;\n\
  d3_time.scale = function() {\n\
    return d3_time_scale(d3.scale.linear(), d3_time_scaleLocalMethods, d3_time_scaleLocalFormat);\n\
  };\n\
  var d3_time_scaleUtcMethods = d3_time_scaleLocalMethods.map(function(m) {\n\
    return [ m[0].utc, m[1] ];\n\
  });\n\
  var d3_time_scaleUtcFormat = d3_time_formatUtc.multi([ [ \".%L\", function(d) {\n\
    return d.getUTCMilliseconds();\n\
  } ], [ \":%S\", function(d) {\n\
    return d.getUTCSeconds();\n\
  } ], [ \"%I:%M\", function(d) {\n\
    return d.getUTCMinutes();\n\
  } ], [ \"%I %p\", function(d) {\n\
    return d.getUTCHours();\n\
  } ], [ \"%a %d\", function(d) {\n\
    return d.getUTCDay() && d.getUTCDate() != 1;\n\
  } ], [ \"%b %d\", function(d) {\n\
    return d.getUTCDate() != 1;\n\
  } ], [ \"%B\", function(d) {\n\
    return d.getUTCMonth();\n\
  } ], [ \"%Y\", d3_true ] ]);\n\
  d3_time_scaleUtcMethods.year = d3_time.year.utc;\n\
  d3_time.scale.utc = function() {\n\
    return d3_time_scale(d3.scale.linear(), d3_time_scaleUtcMethods, d3_time_scaleUtcFormat);\n\
  };\n\
  d3.text = d3_xhrType(function(request) {\n\
    return request.responseText;\n\
  });\n\
  d3.json = function(url, callback) {\n\
    return d3_xhr(url, \"application/json\", d3_json, callback);\n\
  };\n\
  function d3_json(request) {\n\
    return JSON.parse(request.responseText);\n\
  }\n\
  d3.html = function(url, callback) {\n\
    return d3_xhr(url, \"text/html\", d3_html, callback);\n\
  };\n\
  function d3_html(request) {\n\
    var range = d3_document.createRange();\n\
    range.selectNode(d3_document.body);\n\
    return range.createContextualFragment(request.responseText);\n\
  }\n\
  d3.xml = d3_xhrType(function(request) {\n\
    return request.responseXML;\n\
  });\n\
  if (typeof define === \"function\" && define.amd) {\n\
    define(d3);\n\
  } else if (typeof module === \"object\" && module.exports) {\n\
    module.exports = d3;\n\
  } else {\n\
    this.d3 = d3;\n\
  }\n\
}();\n\
//# sourceURL=components/mbostock/d3/v3.4.6/d3.js"
));

require.modules["mbostock-d3"] = require.modules["mbostock~d3@v3.4.6"];
require.modules["mbostock~d3"] = require.modules["mbostock~d3@v3.4.6"];
require.modules["d3"] = require.modules["mbostock~d3@v3.4.6"];


require.register("trevorgerhardt~stylesheet@master", Function("exports, module",
"\n\
/**\n\
 * Dependencies\n\
 */\n\
\n\
var merge = require(\"cristiandouce~merge-util@0.1.0\");\n\
\n\
/**\n\
 * Expose `StyleSheet`\n\
 */\n\
\n\
module.exports = StyleSheet;\n\
\n\
/**\n\
 * Create an instance of StyleSheet\n\
 *\n\
 * @param {Object} CSS rules\n\
 * @param {Object} variables to substitute\n\
 */\n\
\n\
function StyleSheet(rules, variables) {\n\
  if (!(this instanceof StyleSheet)) {\n\
    return new StyleSheet(rules, variables);\n\
  }\n\
\n\
  this.variables = {};\n\
  this.rules = {};\n\
\n\
  if (rules) {\n\
    this.add(rules);\n\
  }\n\
\n\
  if (variables) {\n\
    this.define(variables);\n\
  }\n\
}\n\
\n\
/**\n\
 * Define new variables.\n\
 *\n\
 * @param {Object}\n\
 */\n\
\n\
StyleSheet.prototype.define = function(variables) {\n\
  this.variables = merge(this.variables, variables);\n\
\n\
  return this;\n\
};\n\
\n\
/**\n\
 * Add new css but won't refresh the style element's content.\n\
 *\n\
 * @param {Object}\n\
 */\n\
\n\
StyleSheet.prototype.add = function(rules) {\n\
  this.rules = merge(this.rules, rules);\n\
\n\
  return this;\n\
};\n\
\n\
/**\n\
 * Append new css to the style element or refresh its content.\n\
 */\n\
\n\
StyleSheet.prototype.render = function() {\n\
  if (!this.el) {\n\
    this.el = createStyleSheetElement();\n\
  }\n\
\n\
  this.el.innerHTML = generateCSS(this.rules, this.variables);\n\
\n\
  return this;\n\
};\n\
\n\
/**\n\
 * Clear the styles & variables.\n\
 */\n\
\n\
StyleSheet.prototype.clear = function() {\n\
  this.el.innerHTML = '';\n\
  this.rules = '';\n\
  this.variables = {};\n\
\n\
  return this;\n\
};\n\
\n\
/**\n\
 * Remove the style element.\n\
 */\n\
\n\
StyleSheet.prototype.remove = function() {\n\
  var el = this.el;\n\
  if (el && el.parentNode) {\n\
    el.parentNode.removeChild(el);\n\
    this.el = null;\n\
  }\n\
\n\
  return this;\n\
};\n\
\n\
/*\n\
 * Create new stylesheet.\n\
 */\n\
\n\
function createStyleSheetElement() {\n\
  var elem = document.createElement('style');\n\
  var head = document.getElementsByTagName('head')[0];\n\
\n\
  head.appendChild(elem);\n\
  return elem;\n\
}\n\
\n\
/*\n\
 * Generate CSS subsituting in the variables\n\
 */\n\
\n\
function generateCSS(rules, variables) {\n\
  var list = '';\n\
  var value;\n\
  for (var selector in rules) {\n\
    list += selector + '{';\n\
    for (var rule in rules[selector]) {\n\
      value = rules[selector][rule];\n\
\n\
      if (isFunction(value)) {\n\
        value = value();\n\
      }\n\
\n\
      list += rule + ':' + value + ';';\n\
    }\n\
\n\
    list += '}';\n\
  }\n\
\n\
  // substitue in the variables\n\
  for (var name in variables) {\n\
    value = variables[name];\n\
\n\
    if (isFunction(value)) {\n\
      value = value();\n\
    }\n\
\n\
    list = list.replace(new RegExp('@' + name, 'gi'), value);\n\
  }\n\
\n\
  return list;\n\
}\n\
\n\
/**\n\
 * Is function?\n\
 */\n\
\n\
function isFunction(val) {\n\
  return Object.prototype.toString.call(val) === '[object Function]';\n\
}\n\
\n\
//# sourceURL=components/trevorgerhardt/stylesheet/master/index.js"
));

require.modules["trevorgerhardt-stylesheet"] = require.modules["trevorgerhardt~stylesheet@master"];
require.modules["trevorgerhardt~stylesheet"] = require.modules["trevorgerhardt~stylesheet@master"];
require.modules["stylesheet"] = require.modules["trevorgerhardt~stylesheet@master"];


require.register("visionmedia~debug@0.8.1", Function("exports, module",
"\n\
/**\n\
 * Expose `debug()` as the module.\n\
 */\n\
\n\
module.exports = debug;\n\
\n\
/**\n\
 * Create a debugger with the given `name`.\n\
 *\n\
 * @param {String} name\n\
 * @return {Type}\n\
 * @api public\n\
 */\n\
\n\
function debug(name) {\n\
  if (!debug.enabled(name)) return function(){};\n\
\n\
  return function(fmt){\n\
    fmt = coerce(fmt);\n\
\n\
    var curr = new Date;\n\
    var ms = curr - (debug[name] || curr);\n\
    debug[name] = curr;\n\
\n\
    fmt = name\n\
      + ' '\n\
      + fmt\n\
      + ' +' + debug.humanize(ms);\n\
\n\
    // This hackery is required for IE8\n\
    // where `console.log` doesn't have 'apply'\n\
    window.console\n\
      && console.log\n\
      && Function.prototype.apply.call(console.log, console, arguments);\n\
  }\n\
}\n\
\n\
/**\n\
 * The currently active debug mode names.\n\
 */\n\
\n\
debug.names = [];\n\
debug.skips = [];\n\
\n\
/**\n\
 * Enables a debug mode by name. This can include modes\n\
 * separated by a colon and wildcards.\n\
 *\n\
 * @param {String} name\n\
 * @api public\n\
 */\n\
\n\
debug.enable = function(name) {\n\
  try {\n\
    localStorage.debug = name;\n\
  } catch(e){}\n\
\n\
  var split = (name || '').split(/[\\s,]+/)\n\
    , len = split.length;\n\
\n\
  for (var i = 0; i < len; i++) {\n\
    name = split[i].replace('*', '.*?');\n\
    if (name[0] === '-') {\n\
      debug.skips.push(new RegExp('^' + name.substr(1) + '$'));\n\
    }\n\
    else {\n\
      debug.names.push(new RegExp('^' + name + '$'));\n\
    }\n\
  }\n\
};\n\
\n\
/**\n\
 * Disable debug output.\n\
 *\n\
 * @api public\n\
 */\n\
\n\
debug.disable = function(){\n\
  debug.enable('');\n\
};\n\
\n\
/**\n\
 * Humanize the given `ms`.\n\
 *\n\
 * @param {Number} m\n\
 * @return {String}\n\
 * @api private\n\
 */\n\
\n\
debug.humanize = function(ms) {\n\
  var sec = 1000\n\
    , min = 60 * 1000\n\
    , hour = 60 * min;\n\
\n\
  if (ms >= hour) return (ms / hour).toFixed(1) + 'h';\n\
  if (ms >= min) return (ms / min).toFixed(1) + 'm';\n\
  if (ms >= sec) return (ms / sec | 0) + 's';\n\
  return ms + 'ms';\n\
};\n\
\n\
/**\n\
 * Returns true if the given mode name is enabled, false otherwise.\n\
 *\n\
 * @param {String} name\n\
 * @return {Boolean}\n\
 * @api public\n\
 */\n\
\n\
debug.enabled = function(name) {\n\
  for (var i = 0, len = debug.skips.length; i < len; i++) {\n\
    if (debug.skips[i].test(name)) {\n\
      return false;\n\
    }\n\
  }\n\
  for (var i = 0, len = debug.names.length; i < len; i++) {\n\
    if (debug.names[i].test(name)) {\n\
      return true;\n\
    }\n\
  }\n\
  return false;\n\
};\n\
\n\
/**\n\
 * Coerce `val`.\n\
 */\n\
\n\
function coerce(val) {\n\
  if (val instanceof Error) return val.stack || val.message;\n\
  return val;\n\
}\n\
\n\
// persist\n\
\n\
try {\n\
  if (window.localStorage) debug.enable(localStorage.debug);\n\
} catch(e){}\n\
\n\
//# sourceURL=components/visionmedia/debug/0.8.1/debug.js"
));

require.modules["visionmedia-debug"] = require.modules["visionmedia~debug@0.8.1"];
require.modules["visionmedia~debug"] = require.modules["visionmedia~debug@0.8.1"];
require.modules["debug"] = require.modules["visionmedia~debug@0.8.1"];


require.register("yields~svg-attributes@master", Function("exports, module",
"\n\
/**\n\
 * SVG Attributes\n\
 *\n\
 * http://www.w3.org/TR/SVG/attindex.html\n\
 */\n\
\n\
module.exports = [\n\
  'height',\n\
  'target',\n\
  'title',\n\
  'width',\n\
  'y1',\n\
  'y2',\n\
  'x1',\n\
  'x2',\n\
  'cx',\n\
  'cy',\n\
  'dx',\n\
  'dy',\n\
  'rx',\n\
  'ry',\n\
  'd',\n\
  'r',\n\
  'y',\n\
  'x'\n\
];\n\
\n\
//# sourceURL=components/yields/svg-attributes/master/index.js"
));

require.modules["yields-svg-attributes"] = require.modules["yields~svg-attributes@master"];
require.modules["yields~svg-attributes"] = require.modules["yields~svg-attributes@master"];
require.modules["svg-attributes"] = require.modules["yields~svg-attributes@master"];


require.register("janogonzalez~priorityqueuejs@0.2.0", Function("exports, module",
"/**\n\
 * Expose `PriorityQueue`.\n\
 */\n\
module.exports = PriorityQueue;\n\
\n\
/**\n\
 * Initializes a new empty `PriorityQueue` with the given `comparator(a, b)`\n\
 * function, uses `.DEFAULT_COMPARATOR()` when no function is provided.\n\
 *\n\
 * The comparator function must return a positive number when `a > b`, 0 when\n\
 * `a == b` and a negative number when `a < b`.\n\
 *\n\
 * @param {Function}\n\
 * @return {PriorityQueue}\n\
 * @api public\n\
 */\n\
function PriorityQueue(comparator) {\n\
  this._comparator = comparator || PriorityQueue.DEFAULT_COMPARATOR;\n\
  this._elements = [];\n\
}\n\
\n\
/**\n\
 * Compares `a` and `b`, when `a > b` it returns a positive number, when\n\
 * it returns 0 and when `a < b` it returns a negative number.\n\
 *\n\
 * @param {String|Number} a\n\
 * @param {String|Number} b\n\
 * @return {Number}\n\
 * @api public\n\
 */\n\
PriorityQueue.DEFAULT_COMPARATOR = function(a, b) {\n\
  if (a instanceof Number && b instanceof Number) {\n\
    return a - b;\n\
  } else {\n\
    a = a.toString();\n\
    b = b.toString();\n\
\n\
    if (a == b) return 0;\n\
\n\
    return (a > b) ? 1 : -1;\n\
  }\n\
};\n\
\n\
/**\n\
 * Returns whether the priority queue is empty or not.\n\
 *\n\
 * @return {Boolean}\n\
 * @api public\n\
 */\n\
PriorityQueue.prototype.isEmpty = function() {\n\
  return this.size() === 0;\n\
};\n\
\n\
/**\n\
 * Peeks at the top element of the priority queue.\n\
 *\n\
 * @return {Object}\n\
 * @throws {Error} when the queue is empty.\n\
 * @api public\n\
 */\n\
PriorityQueue.prototype.peek = function() {\n\
  if (this.isEmpty()) throw new Error('PriorityQueue is empty');\n\
\n\
  return this._elements[0];\n\
};\n\
\n\
/**\n\
 * Dequeues the top element of the priority queue.\n\
 *\n\
 * @return {Object}\n\
 * @throws {Error} when the queue is empty.\n\
 * @api public\n\
 */\n\
PriorityQueue.prototype.deq = function() {\n\
  var first = this.peek();\n\
  var last = this._elements.pop();\n\
  var size = this.size();\n\
\n\
  if (size === 0) return first;\n\
\n\
  this._elements[0] = last;\n\
  var current = 0;\n\
\n\
  while (current < size) {\n\
    var largest = current;\n\
    var left = (2 * current) + 1;\n\
    var right = (2 * current) + 2;\n\
\n\
    if (left < size && this._compare(left, largest) > 0) {\n\
      largest = left;\n\
    }\n\
\n\
    if (right < size && this._compare(right, largest) > 0) {\n\
      largest = right;\n\
    }\n\
\n\
    if (largest === current) break;\n\
\n\
    this._swap(largest, current);\n\
    current = largest;\n\
  }\n\
\n\
  return first;\n\
};\n\
\n\
/**\n\
 * Enqueues the `element` at the priority queue and returns its new size.\n\
 *\n\
 * @param {Object} element\n\
 * @return {Number}\n\
 * @api public\n\
 */\n\
PriorityQueue.prototype.enq = function(element) {\n\
  var size = this._elements.push(element);\n\
  var current = size - 1;\n\
\n\
  while (current > 0) {\n\
    var parent = Math.floor((current - 1) / 2);\n\
\n\
    if (this._compare(current, parent) < 0) break;\n\
\n\
    this._swap(parent, current);\n\
    current = parent;\n\
  }\n\
\n\
  return size;\n\
};\n\
\n\
/**\n\
 * Returns the size of the priority queue.\n\
 *\n\
 * @return {Number}\n\
 * @api public\n\
 */\n\
PriorityQueue.prototype.size = function() {\n\
  return this._elements.length;\n\
};\n\
\n\
/**\n\
 *  Iterates over queue elements\n\
 *\n\
 *  @param {Function} fn\n\
 */\n\
PriorityQueue.prototype.forEach = function(fn) {\n\
  return this._elements.forEach(fn);\n\
};\n\
\n\
/**\n\
 * Compares the values at position `a` and `b` in the priority queue using its\n\
 * comparator function.\n\
 *\n\
 * @param {Number} a\n\
 * @param {Number} b\n\
 * @return {Number}\n\
 * @api private\n\
 */\n\
PriorityQueue.prototype._compare = function(a, b) {\n\
  return this._comparator(this._elements[a], this._elements[b]);\n\
};\n\
\n\
/**\n\
 * Swaps the values at position `a` and `b` in the priority queue.\n\
 *\n\
 * @param {Number} a\n\
 * @param {Number} b\n\
 * @api private\n\
 */\n\
PriorityQueue.prototype._swap = function(a, b) {\n\
  var aux = this._elements[a];\n\
  this._elements[a] = this._elements[b];\n\
  this._elements[b] = aux;\n\
};\n\
\n\
//# sourceURL=components/janogonzalez/priorityqueuejs/0.2.0/index.js"
));

require.modules["janogonzalez-priorityqueuejs"] = require.modules["janogonzalez~priorityqueuejs@0.2.0"];
require.modules["janogonzalez~priorityqueuejs"] = require.modules["janogonzalez~priorityqueuejs@0.2.0"];
require.modules["priorityqueuejs"] = require.modules["janogonzalez~priorityqueuejs@0.2.0"];


require.register("jashkenas~underscore@1.6.0", Function("exports, module",
"//     Underscore.js 1.6.0\n\
//     http://underscorejs.org\n\
//     (c) 2009-2014 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors\n\
//     Underscore may be freely distributed under the MIT license.\n\
\n\
(function() {\n\
\n\
  // Baseline setup\n\
  // --------------\n\
\n\
  // Establish the root object, `window` in the browser, or `exports` on the server.\n\
  var root = this;\n\
\n\
  // Save the previous value of the `_` variable.\n\
  var previousUnderscore = root._;\n\
\n\
  // Establish the object that gets returned to break out of a loop iteration.\n\
  var breaker = {};\n\
\n\
  // Save bytes in the minified (but not gzipped) version:\n\
  var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;\n\
\n\
  // Create quick reference variables for speed access to core prototypes.\n\
  var\n\
    push             = ArrayProto.push,\n\
    slice            = ArrayProto.slice,\n\
    concat           = ArrayProto.concat,\n\
    toString         = ObjProto.toString,\n\
    hasOwnProperty   = ObjProto.hasOwnProperty;\n\
\n\
  // All **ECMAScript 5** native function implementations that we hope to use\n\
  // are declared here.\n\
  var\n\
    nativeForEach      = ArrayProto.forEach,\n\
    nativeMap          = ArrayProto.map,\n\
    nativeReduce       = ArrayProto.reduce,\n\
    nativeReduceRight  = ArrayProto.reduceRight,\n\
    nativeFilter       = ArrayProto.filter,\n\
    nativeEvery        = ArrayProto.every,\n\
    nativeSome         = ArrayProto.some,\n\
    nativeIndexOf      = ArrayProto.indexOf,\n\
    nativeLastIndexOf  = ArrayProto.lastIndexOf,\n\
    nativeIsArray      = Array.isArray,\n\
    nativeKeys         = Object.keys,\n\
    nativeBind         = FuncProto.bind;\n\
\n\
  // Create a safe reference to the Underscore object for use below.\n\
  var _ = function(obj) {\n\
    if (obj instanceof _) return obj;\n\
    if (!(this instanceof _)) return new _(obj);\n\
    this._wrapped = obj;\n\
  };\n\
\n\
  // Export the Underscore object for **Node.js**, with\n\
  // backwards-compatibility for the old `require()` API. If we're in\n\
  // the browser, add `_` as a global object via a string identifier,\n\
  // for Closure Compiler \"advanced\" mode.\n\
  if (typeof exports !== 'undefined') {\n\
    if (typeof module !== 'undefined' && module.exports) {\n\
      exports = module.exports = _;\n\
    }\n\
    exports._ = _;\n\
  } else {\n\
    root._ = _;\n\
  }\n\
\n\
  // Current version.\n\
  _.VERSION = '1.6.0';\n\
\n\
  // Collection Functions\n\
  // --------------------\n\
\n\
  // The cornerstone, an `each` implementation, aka `forEach`.\n\
  // Handles objects with the built-in `forEach`, arrays, and raw objects.\n\
  // Delegates to **ECMAScript 5**'s native `forEach` if available.\n\
  var each = _.each = _.forEach = function(obj, iterator, context) {\n\
    if (obj == null) return obj;\n\
    if (nativeForEach && obj.forEach === nativeForEach) {\n\
      obj.forEach(iterator, context);\n\
    } else if (obj.length === +obj.length) {\n\
      for (var i = 0, length = obj.length; i < length; i++) {\n\
        if (iterator.call(context, obj[i], i, obj) === breaker) return;\n\
      }\n\
    } else {\n\
      var keys = _.keys(obj);\n\
      for (var i = 0, length = keys.length; i < length; i++) {\n\
        if (iterator.call(context, obj[keys[i]], keys[i], obj) === breaker) return;\n\
      }\n\
    }\n\
    return obj;\n\
  };\n\
\n\
  // Return the results of applying the iterator to each element.\n\
  // Delegates to **ECMAScript 5**'s native `map` if available.\n\
  _.map = _.collect = function(obj, iterator, context) {\n\
    var results = [];\n\
    if (obj == null) return results;\n\
    if (nativeMap && obj.map === nativeMap) return obj.map(iterator, context);\n\
    each(obj, function(value, index, list) {\n\
      results.push(iterator.call(context, value, index, list));\n\
    });\n\
    return results;\n\
  };\n\
\n\
  var reduceError = 'Reduce of empty array with no initial value';\n\
\n\
  // **Reduce** builds up a single result from a list of values, aka `inject`,\n\
  // or `foldl`. Delegates to **ECMAScript 5**'s native `reduce` if available.\n\
  _.reduce = _.foldl = _.inject = function(obj, iterator, memo, context) {\n\
    var initial = arguments.length > 2;\n\
    if (obj == null) obj = [];\n\
    if (nativeReduce && obj.reduce === nativeReduce) {\n\
      if (context) iterator = _.bind(iterator, context);\n\
      return initial ? obj.reduce(iterator, memo) : obj.reduce(iterator);\n\
    }\n\
    each(obj, function(value, index, list) {\n\
      if (!initial) {\n\
        memo = value;\n\
        initial = true;\n\
      } else {\n\
        memo = iterator.call(context, memo, value, index, list);\n\
      }\n\
    });\n\
    if (!initial) throw new TypeError(reduceError);\n\
    return memo;\n\
  };\n\
\n\
  // The right-associative version of reduce, also known as `foldr`.\n\
  // Delegates to **ECMAScript 5**'s native `reduceRight` if available.\n\
  _.reduceRight = _.foldr = function(obj, iterator, memo, context) {\n\
    var initial = arguments.length > 2;\n\
    if (obj == null) obj = [];\n\
    if (nativeReduceRight && obj.reduceRight === nativeReduceRight) {\n\
      if (context) iterator = _.bind(iterator, context);\n\
      return initial ? obj.reduceRight(iterator, memo) : obj.reduceRight(iterator);\n\
    }\n\
    var length = obj.length;\n\
    if (length !== +length) {\n\
      var keys = _.keys(obj);\n\
      length = keys.length;\n\
    }\n\
    each(obj, function(value, index, list) {\n\
      index = keys ? keys[--length] : --length;\n\
      if (!initial) {\n\
        memo = obj[index];\n\
        initial = true;\n\
      } else {\n\
        memo = iterator.call(context, memo, obj[index], index, list);\n\
      }\n\
    });\n\
    if (!initial) throw new TypeError(reduceError);\n\
    return memo;\n\
  };\n\
\n\
  // Return the first value which passes a truth test. Aliased as `detect`.\n\
  _.find = _.detect = function(obj, predicate, context) {\n\
    var result;\n\
    any(obj, function(value, index, list) {\n\
      if (predicate.call(context, value, index, list)) {\n\
        result = value;\n\
        return true;\n\
      }\n\
    });\n\
    return result;\n\
  };\n\
\n\
  // Return all the elements that pass a truth test.\n\
  // Delegates to **ECMAScript 5**'s native `filter` if available.\n\
  // Aliased as `select`.\n\
  _.filter = _.select = function(obj, predicate, context) {\n\
    var results = [];\n\
    if (obj == null) return results;\n\
    if (nativeFilter && obj.filter === nativeFilter) return obj.filter(predicate, context);\n\
    each(obj, function(value, index, list) {\n\
      if (predicate.call(context, value, index, list)) results.push(value);\n\
    });\n\
    return results;\n\
  };\n\
\n\
  // Return all the elements for which a truth test fails.\n\
  _.reject = function(obj, predicate, context) {\n\
    return _.filter(obj, function(value, index, list) {\n\
      return !predicate.call(context, value, index, list);\n\
    }, context);\n\
  };\n\
\n\
  // Determine whether all of the elements match a truth test.\n\
  // Delegates to **ECMAScript 5**'s native `every` if available.\n\
  // Aliased as `all`.\n\
  _.every = _.all = function(obj, predicate, context) {\n\
    predicate || (predicate = _.identity);\n\
    var result = true;\n\
    if (obj == null) return result;\n\
    if (nativeEvery && obj.every === nativeEvery) return obj.every(predicate, context);\n\
    each(obj, function(value, index, list) {\n\
      if (!(result = result && predicate.call(context, value, index, list))) return breaker;\n\
    });\n\
    return !!result;\n\
  };\n\
\n\
  // Determine if at least one element in the object matches a truth test.\n\
  // Delegates to **ECMAScript 5**'s native `some` if available.\n\
  // Aliased as `any`.\n\
  var any = _.some = _.any = function(obj, predicate, context) {\n\
    predicate || (predicate = _.identity);\n\
    var result = false;\n\
    if (obj == null) return result;\n\
    if (nativeSome && obj.some === nativeSome) return obj.some(predicate, context);\n\
    each(obj, function(value, index, list) {\n\
      if (result || (result = predicate.call(context, value, index, list))) return breaker;\n\
    });\n\
    return !!result;\n\
  };\n\
\n\
  // Determine if the array or object contains a given value (using `===`).\n\
  // Aliased as `include`.\n\
  _.contains = _.include = function(obj, target) {\n\
    if (obj == null) return false;\n\
    if (nativeIndexOf && obj.indexOf === nativeIndexOf) return obj.indexOf(target) != -1;\n\
    return any(obj, function(value) {\n\
      return value === target;\n\
    });\n\
  };\n\
\n\
  // Invoke a method (with arguments) on every item in a collection.\n\
  _.invoke = function(obj, method) {\n\
    var args = slice.call(arguments, 2);\n\
    var isFunc = _.isFunction(method);\n\
    return _.map(obj, function(value) {\n\
      return (isFunc ? method : value[method]).apply(value, args);\n\
    });\n\
  };\n\
\n\
  // Convenience version of a common use case of `map`: fetching a property.\n\
  _.pluck = function(obj, key) {\n\
    return _.map(obj, _.property(key));\n\
  };\n\
\n\
  // Convenience version of a common use case of `filter`: selecting only objects\n\
  // containing specific `key:value` pairs.\n\
  _.where = function(obj, attrs) {\n\
    return _.filter(obj, _.matches(attrs));\n\
  };\n\
\n\
  // Convenience version of a common use case of `find`: getting the first object\n\
  // containing specific `key:value` pairs.\n\
  _.findWhere = function(obj, attrs) {\n\
    return _.find(obj, _.matches(attrs));\n\
  };\n\
\n\
  // Return the maximum element or (element-based computation).\n\
  // Can't optimize arrays of integers longer than 65,535 elements.\n\
  // See [WebKit Bug 80797](https://bugs.webkit.org/show_bug.cgi?id=80797)\n\
  _.max = function(obj, iterator, context) {\n\
    if (!iterator && _.isArray(obj) && obj[0] === +obj[0] && obj.length < 65535) {\n\
      return Math.max.apply(Math, obj);\n\
    }\n\
    var result = -Infinity, lastComputed = -Infinity;\n\
    each(obj, function(value, index, list) {\n\
      var computed = iterator ? iterator.call(context, value, index, list) : value;\n\
      if (computed > lastComputed) {\n\
        result = value;\n\
        lastComputed = computed;\n\
      }\n\
    });\n\
    return result;\n\
  };\n\
\n\
  // Return the minimum element (or element-based computation).\n\
  _.min = function(obj, iterator, context) {\n\
    if (!iterator && _.isArray(obj) && obj[0] === +obj[0] && obj.length < 65535) {\n\
      return Math.min.apply(Math, obj);\n\
    }\n\
    var result = Infinity, lastComputed = Infinity;\n\
    each(obj, function(value, index, list) {\n\
      var computed = iterator ? iterator.call(context, value, index, list) : value;\n\
      if (computed < lastComputed) {\n\
        result = value;\n\
        lastComputed = computed;\n\
      }\n\
    });\n\
    return result;\n\
  };\n\
\n\
  // Shuffle an array, using the modern version of the\n\
  // [Fisher-Yates shuffle](http://en.wikipedia.org/wiki/Fisher–Yates_shuffle).\n\
  _.shuffle = function(obj) {\n\
    var rand;\n\
    var index = 0;\n\
    var shuffled = [];\n\
    each(obj, function(value) {\n\
      rand = _.random(index++);\n\
      shuffled[index - 1] = shuffled[rand];\n\
      shuffled[rand] = value;\n\
    });\n\
    return shuffled;\n\
  };\n\
\n\
  // Sample **n** random values from a collection.\n\
  // If **n** is not specified, returns a single random element.\n\
  // The internal `guard` argument allows it to work with `map`.\n\
  _.sample = function(obj, n, guard) {\n\
    if (n == null || guard) {\n\
      if (obj.length !== +obj.length) obj = _.values(obj);\n\
      return obj[_.random(obj.length - 1)];\n\
    }\n\
    return _.shuffle(obj).slice(0, Math.max(0, n));\n\
  };\n\
\n\
  // An internal function to generate lookup iterators.\n\
  var lookupIterator = function(value) {\n\
    if (value == null) return _.identity;\n\
    if (_.isFunction(value)) return value;\n\
    return _.property(value);\n\
  };\n\
\n\
  // Sort the object's values by a criterion produced by an iterator.\n\
  _.sortBy = function(obj, iterator, context) {\n\
    iterator = lookupIterator(iterator);\n\
    return _.pluck(_.map(obj, function(value, index, list) {\n\
      return {\n\
        value: value,\n\
        index: index,\n\
        criteria: iterator.call(context, value, index, list)\n\
      };\n\
    }).sort(function(left, right) {\n\
      var a = left.criteria;\n\
      var b = right.criteria;\n\
      if (a !== b) {\n\
        if (a > b || a === void 0) return 1;\n\
        if (a < b || b === void 0) return -1;\n\
      }\n\
      return left.index - right.index;\n\
    }), 'value');\n\
  };\n\
\n\
  // An internal function used for aggregate \"group by\" operations.\n\
  var group = function(behavior) {\n\
    return function(obj, iterator, context) {\n\
      var result = {};\n\
      iterator = lookupIterator(iterator);\n\
      each(obj, function(value, index) {\n\
        var key = iterator.call(context, value, index, obj);\n\
        behavior(result, key, value);\n\
      });\n\
      return result;\n\
    };\n\
  };\n\
\n\
  // Groups the object's values by a criterion. Pass either a string attribute\n\
  // to group by, or a function that returns the criterion.\n\
  _.groupBy = group(function(result, key, value) {\n\
    _.has(result, key) ? result[key].push(value) : result[key] = [value];\n\
  });\n\
\n\
  // Indexes the object's values by a criterion, similar to `groupBy`, but for\n\
  // when you know that your index values will be unique.\n\
  _.indexBy = group(function(result, key, value) {\n\
    result[key] = value;\n\
  });\n\
\n\
  // Counts instances of an object that group by a certain criterion. Pass\n\
  // either a string attribute to count by, or a function that returns the\n\
  // criterion.\n\
  _.countBy = group(function(result, key) {\n\
    _.has(result, key) ? result[key]++ : result[key] = 1;\n\
  });\n\
\n\
  // Use a comparator function to figure out the smallest index at which\n\
  // an object should be inserted so as to maintain order. Uses binary search.\n\
  _.sortedIndex = function(array, obj, iterator, context) {\n\
    iterator = lookupIterator(iterator);\n\
    var value = iterator.call(context, obj);\n\
    var low = 0, high = array.length;\n\
    while (low < high) {\n\
      var mid = (low + high) >>> 1;\n\
      iterator.call(context, array[mid]) < value ? low = mid + 1 : high = mid;\n\
    }\n\
    return low;\n\
  };\n\
\n\
  // Safely create a real, live array from anything iterable.\n\
  _.toArray = function(obj) {\n\
    if (!obj) return [];\n\
    if (_.isArray(obj)) return slice.call(obj);\n\
    if (obj.length === +obj.length) return _.map(obj, _.identity);\n\
    return _.values(obj);\n\
  };\n\
\n\
  // Return the number of elements in an object.\n\
  _.size = function(obj) {\n\
    if (obj == null) return 0;\n\
    return (obj.length === +obj.length) ? obj.length : _.keys(obj).length;\n\
  };\n\
\n\
  // Array Functions\n\
  // ---------------\n\
\n\
  // Get the first element of an array. Passing **n** will return the first N\n\
  // values in the array. Aliased as `head` and `take`. The **guard** check\n\
  // allows it to work with `_.map`.\n\
  _.first = _.head = _.take = function(array, n, guard) {\n\
    if (array == null) return void 0;\n\
    if ((n == null) || guard) return array[0];\n\
    if (n < 0) return [];\n\
    return slice.call(array, 0, n);\n\
  };\n\
\n\
  // Returns everything but the last entry of the array. Especially useful on\n\
  // the arguments object. Passing **n** will return all the values in\n\
  // the array, excluding the last N. The **guard** check allows it to work with\n\
  // `_.map`.\n\
  _.initial = function(array, n, guard) {\n\
    return slice.call(array, 0, array.length - ((n == null) || guard ? 1 : n));\n\
  };\n\
\n\
  // Get the last element of an array. Passing **n** will return the last N\n\
  // values in the array. The **guard** check allows it to work with `_.map`.\n\
  _.last = function(array, n, guard) {\n\
    if (array == null) return void 0;\n\
    if ((n == null) || guard) return array[array.length - 1];\n\
    return slice.call(array, Math.max(array.length - n, 0));\n\
  };\n\
\n\
  // Returns everything but the first entry of the array. Aliased as `tail` and `drop`.\n\
  // Especially useful on the arguments object. Passing an **n** will return\n\
  // the rest N values in the array. The **guard**\n\
  // check allows it to work with `_.map`.\n\
  _.rest = _.tail = _.drop = function(array, n, guard) {\n\
    return slice.call(array, (n == null) || guard ? 1 : n);\n\
  };\n\
\n\
  // Trim out all falsy values from an array.\n\
  _.compact = function(array) {\n\
    return _.filter(array, _.identity);\n\
  };\n\
\n\
  // Internal implementation of a recursive `flatten` function.\n\
  var flatten = function(input, shallow, output) {\n\
    if (shallow && _.every(input, _.isArray)) {\n\
      return concat.apply(output, input);\n\
    }\n\
    each(input, function(value) {\n\
      if (_.isArray(value) || _.isArguments(value)) {\n\
        shallow ? push.apply(output, value) : flatten(value, shallow, output);\n\
      } else {\n\
        output.push(value);\n\
      }\n\
    });\n\
    return output;\n\
  };\n\
\n\
  // Flatten out an array, either recursively (by default), or just one level.\n\
  _.flatten = function(array, shallow) {\n\
    return flatten(array, shallow, []);\n\
  };\n\
\n\
  // Return a version of the array that does not contain the specified value(s).\n\
  _.without = function(array) {\n\
    return _.difference(array, slice.call(arguments, 1));\n\
  };\n\
\n\
  // Split an array into two arrays: one whose elements all satisfy the given\n\
  // predicate, and one whose elements all do not satisfy the predicate.\n\
  _.partition = function(array, predicate) {\n\
    var pass = [], fail = [];\n\
    each(array, function(elem) {\n\
      (predicate(elem) ? pass : fail).push(elem);\n\
    });\n\
    return [pass, fail];\n\
  };\n\
\n\
  // Produce a duplicate-free version of the array. If the array has already\n\
  // been sorted, you have the option of using a faster algorithm.\n\
  // Aliased as `unique`.\n\
  _.uniq = _.unique = function(array, isSorted, iterator, context) {\n\
    if (_.isFunction(isSorted)) {\n\
      context = iterator;\n\
      iterator = isSorted;\n\
      isSorted = false;\n\
    }\n\
    var initial = iterator ? _.map(array, iterator, context) : array;\n\
    var results = [];\n\
    var seen = [];\n\
    each(initial, function(value, index) {\n\
      if (isSorted ? (!index || seen[seen.length - 1] !== value) : !_.contains(seen, value)) {\n\
        seen.push(value);\n\
        results.push(array[index]);\n\
      }\n\
    });\n\
    return results;\n\
  };\n\
\n\
  // Produce an array that contains the union: each distinct element from all of\n\
  // the passed-in arrays.\n\
  _.union = function() {\n\
    return _.uniq(_.flatten(arguments, true));\n\
  };\n\
\n\
  // Produce an array that contains every item shared between all the\n\
  // passed-in arrays.\n\
  _.intersection = function(array) {\n\
    var rest = slice.call(arguments, 1);\n\
    return _.filter(_.uniq(array), function(item) {\n\
      return _.every(rest, function(other) {\n\
        return _.contains(other, item);\n\
      });\n\
    });\n\
  };\n\
\n\
  // Take the difference between one array and a number of other arrays.\n\
  // Only the elements present in just the first array will remain.\n\
  _.difference = function(array) {\n\
    var rest = concat.apply(ArrayProto, slice.call(arguments, 1));\n\
    return _.filter(array, function(value){ return !_.contains(rest, value); });\n\
  };\n\
\n\
  // Zip together multiple lists into a single array -- elements that share\n\
  // an index go together.\n\
  _.zip = function() {\n\
    var length = _.max(_.pluck(arguments, 'length').concat(0));\n\
    var results = new Array(length);\n\
    for (var i = 0; i < length; i++) {\n\
      results[i] = _.pluck(arguments, '' + i);\n\
    }\n\
    return results;\n\
  };\n\
\n\
  // Converts lists into objects. Pass either a single array of `[key, value]`\n\
  // pairs, or two parallel arrays of the same length -- one of keys, and one of\n\
  // the corresponding values.\n\
  _.object = function(list, values) {\n\
    if (list == null) return {};\n\
    var result = {};\n\
    for (var i = 0, length = list.length; i < length; i++) {\n\
      if (values) {\n\
        result[list[i]] = values[i];\n\
      } else {\n\
        result[list[i][0]] = list[i][1];\n\
      }\n\
    }\n\
    return result;\n\
  };\n\
\n\
  // If the browser doesn't supply us with indexOf (I'm looking at you, **MSIE**),\n\
  // we need this function. Return the position of the first occurrence of an\n\
  // item in an array, or -1 if the item is not included in the array.\n\
  // Delegates to **ECMAScript 5**'s native `indexOf` if available.\n\
  // If the array is large and already in sort order, pass `true`\n\
  // for **isSorted** to use binary search.\n\
  _.indexOf = function(array, item, isSorted) {\n\
    if (array == null) return -1;\n\
    var i = 0, length = array.length;\n\
    if (isSorted) {\n\
      if (typeof isSorted == 'number') {\n\
        i = (isSorted < 0 ? Math.max(0, length + isSorted) : isSorted);\n\
      } else {\n\
        i = _.sortedIndex(array, item);\n\
        return array[i] === item ? i : -1;\n\
      }\n\
    }\n\
    if (nativeIndexOf && array.indexOf === nativeIndexOf) return array.indexOf(item, isSorted);\n\
    for (; i < length; i++) if (array[i] === item) return i;\n\
    return -1;\n\
  };\n\
\n\
  // Delegates to **ECMAScript 5**'s native `lastIndexOf` if available.\n\
  _.lastIndexOf = function(array, item, from) {\n\
    if (array == null) return -1;\n\
    var hasIndex = from != null;\n\
    if (nativeLastIndexOf && array.lastIndexOf === nativeLastIndexOf) {\n\
      return hasIndex ? array.lastIndexOf(item, from) : array.lastIndexOf(item);\n\
    }\n\
    var i = (hasIndex ? from : array.length);\n\
    while (i--) if (array[i] === item) return i;\n\
    return -1;\n\
  };\n\
\n\
  // Generate an integer Array containing an arithmetic progression. A port of\n\
  // the native Python `range()` function. See\n\
  // [the Python documentation](http://docs.python.org/library/functions.html#range).\n\
  _.range = function(start, stop, step) {\n\
    if (arguments.length <= 1) {\n\
      stop = start || 0;\n\
      start = 0;\n\
    }\n\
    step = arguments[2] || 1;\n\
\n\
    var length = Math.max(Math.ceil((stop - start) / step), 0);\n\
    var idx = 0;\n\
    var range = new Array(length);\n\
\n\
    while(idx < length) {\n\
      range[idx++] = start;\n\
      start += step;\n\
    }\n\
\n\
    return range;\n\
  };\n\
\n\
  // Function (ahem) Functions\n\
  // ------------------\n\
\n\
  // Reusable constructor function for prototype setting.\n\
  var ctor = function(){};\n\
\n\
  // Create a function bound to a given object (assigning `this`, and arguments,\n\
  // optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if\n\
  // available.\n\
  _.bind = function(func, context) {\n\
    var args, bound;\n\
    if (nativeBind && func.bind === nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));\n\
    if (!_.isFunction(func)) throw new TypeError;\n\
    args = slice.call(arguments, 2);\n\
    return bound = function() {\n\
      if (!(this instanceof bound)) return func.apply(context, args.concat(slice.call(arguments)));\n\
      ctor.prototype = func.prototype;\n\
      var self = new ctor;\n\
      ctor.prototype = null;\n\
      var result = func.apply(self, args.concat(slice.call(arguments)));\n\
      if (Object(result) === result) return result;\n\
      return self;\n\
    };\n\
  };\n\
\n\
  // Partially apply a function by creating a version that has had some of its\n\
  // arguments pre-filled, without changing its dynamic `this` context. _ acts\n\
  // as a placeholder, allowing any combination of arguments to be pre-filled.\n\
  _.partial = function(func) {\n\
    var boundArgs = slice.call(arguments, 1);\n\
    return function() {\n\
      var position = 0;\n\
      var args = boundArgs.slice();\n\
      for (var i = 0, length = args.length; i < length; i++) {\n\
        if (args[i] === _) args[i] = arguments[position++];\n\
      }\n\
      while (position < arguments.length) args.push(arguments[position++]);\n\
      return func.apply(this, args);\n\
    };\n\
  };\n\
\n\
  // Bind a number of an object's methods to that object. Remaining arguments\n\
  // are the method names to be bound. Useful for ensuring that all callbacks\n\
  // defined on an object belong to it.\n\
  _.bindAll = function(obj) {\n\
    var funcs = slice.call(arguments, 1);\n\
    if (funcs.length === 0) throw new Error('bindAll must be passed function names');\n\
    each(funcs, function(f) { obj[f] = _.bind(obj[f], obj); });\n\
    return obj;\n\
  };\n\
\n\
  // Memoize an expensive function by storing its results.\n\
  _.memoize = function(func, hasher) {\n\
    var memo = {};\n\
    hasher || (hasher = _.identity);\n\
    return function() {\n\
      var key = hasher.apply(this, arguments);\n\
      return _.has(memo, key) ? memo[key] : (memo[key] = func.apply(this, arguments));\n\
    };\n\
  };\n\
\n\
  // Delays a function for the given number of milliseconds, and then calls\n\
  // it with the arguments supplied.\n\
  _.delay = function(func, wait) {\n\
    var args = slice.call(arguments, 2);\n\
    return setTimeout(function(){ return func.apply(null, args); }, wait);\n\
  };\n\
\n\
  // Defers a function, scheduling it to run after the current call stack has\n\
  // cleared.\n\
  _.defer = function(func) {\n\
    return _.delay.apply(_, [func, 1].concat(slice.call(arguments, 1)));\n\
  };\n\
\n\
  // Returns a function, that, when invoked, will only be triggered at most once\n\
  // during a given window of time. Normally, the throttled function will run\n\
  // as much as it can, without ever going more than once per `wait` duration;\n\
  // but if you'd like to disable the execution on the leading edge, pass\n\
  // `{leading: false}`. To disable execution on the trailing edge, ditto.\n\
  _.throttle = function(func, wait, options) {\n\
    var context, args, result;\n\
    var timeout = null;\n\
    var previous = 0;\n\
    options || (options = {});\n\
    var later = function() {\n\
      previous = options.leading === false ? 0 : _.now();\n\
      timeout = null;\n\
      result = func.apply(context, args);\n\
      context = args = null;\n\
    };\n\
    return function() {\n\
      var now = _.now();\n\
      if (!previous && options.leading === false) previous = now;\n\
      var remaining = wait - (now - previous);\n\
      context = this;\n\
      args = arguments;\n\
      if (remaining <= 0) {\n\
        clearTimeout(timeout);\n\
        timeout = null;\n\
        previous = now;\n\
        result = func.apply(context, args);\n\
        context = args = null;\n\
      } else if (!timeout && options.trailing !== false) {\n\
        timeout = setTimeout(later, remaining);\n\
      }\n\
      return result;\n\
    };\n\
  };\n\
\n\
  // Returns a function, that, as long as it continues to be invoked, will not\n\
  // be triggered. The function will be called after it stops being called for\n\
  // N milliseconds. If `immediate` is passed, trigger the function on the\n\
  // leading edge, instead of the trailing.\n\
  _.debounce = function(func, wait, immediate) {\n\
    var timeout, args, context, timestamp, result;\n\
\n\
    var later = function() {\n\
      var last = _.now() - timestamp;\n\
      if (last < wait) {\n\
        timeout = setTimeout(later, wait - last);\n\
      } else {\n\
        timeout = null;\n\
        if (!immediate) {\n\
          result = func.apply(context, args);\n\
          context = args = null;\n\
        }\n\
      }\n\
    };\n\
\n\
    return function() {\n\
      context = this;\n\
      args = arguments;\n\
      timestamp = _.now();\n\
      var callNow = immediate && !timeout;\n\
      if (!timeout) {\n\
        timeout = setTimeout(later, wait);\n\
      }\n\
      if (callNow) {\n\
        result = func.apply(context, args);\n\
        context = args = null;\n\
      }\n\
\n\
      return result;\n\
    };\n\
  };\n\
\n\
  // Returns a function that will be executed at most one time, no matter how\n\
  // often you call it. Useful for lazy initialization.\n\
  _.once = function(func) {\n\
    var ran = false, memo;\n\
    return function() {\n\
      if (ran) return memo;\n\
      ran = true;\n\
      memo = func.apply(this, arguments);\n\
      func = null;\n\
      return memo;\n\
    };\n\
  };\n\
\n\
  // Returns the first function passed as an argument to the second,\n\
  // allowing you to adjust arguments, run code before and after, and\n\
  // conditionally execute the original function.\n\
  _.wrap = function(func, wrapper) {\n\
    return _.partial(wrapper, func);\n\
  };\n\
\n\
  // Returns a function that is the composition of a list of functions, each\n\
  // consuming the return value of the function that follows.\n\
  _.compose = function() {\n\
    var funcs = arguments;\n\
    return function() {\n\
      var args = arguments;\n\
      for (var i = funcs.length - 1; i >= 0; i--) {\n\
        args = [funcs[i].apply(this, args)];\n\
      }\n\
      return args[0];\n\
    };\n\
  };\n\
\n\
  // Returns a function that will only be executed after being called N times.\n\
  _.after = function(times, func) {\n\
    return function() {\n\
      if (--times < 1) {\n\
        return func.apply(this, arguments);\n\
      }\n\
    };\n\
  };\n\
\n\
  // Object Functions\n\
  // ----------------\n\
\n\
  // Retrieve the names of an object's properties.\n\
  // Delegates to **ECMAScript 5**'s native `Object.keys`\n\
  _.keys = function(obj) {\n\
    if (!_.isObject(obj)) return [];\n\
    if (nativeKeys) return nativeKeys(obj);\n\
    var keys = [];\n\
    for (var key in obj) if (_.has(obj, key)) keys.push(key);\n\
    return keys;\n\
  };\n\
\n\
  // Retrieve the values of an object's properties.\n\
  _.values = function(obj) {\n\
    var keys = _.keys(obj);\n\
    var length = keys.length;\n\
    var values = new Array(length);\n\
    for (var i = 0; i < length; i++) {\n\
      values[i] = obj[keys[i]];\n\
    }\n\
    return values;\n\
  };\n\
\n\
  // Convert an object into a list of `[key, value]` pairs.\n\
  _.pairs = function(obj) {\n\
    var keys = _.keys(obj);\n\
    var length = keys.length;\n\
    var pairs = new Array(length);\n\
    for (var i = 0; i < length; i++) {\n\
      pairs[i] = [keys[i], obj[keys[i]]];\n\
    }\n\
    return pairs;\n\
  };\n\
\n\
  // Invert the keys and values of an object. The values must be serializable.\n\
  _.invert = function(obj) {\n\
    var result = {};\n\
    var keys = _.keys(obj);\n\
    for (var i = 0, length = keys.length; i < length; i++) {\n\
      result[obj[keys[i]]] = keys[i];\n\
    }\n\
    return result;\n\
  };\n\
\n\
  // Return a sorted list of the function names available on the object.\n\
  // Aliased as `methods`\n\
  _.functions = _.methods = function(obj) {\n\
    var names = [];\n\
    for (var key in obj) {\n\
      if (_.isFunction(obj[key])) names.push(key);\n\
    }\n\
    return names.sort();\n\
  };\n\
\n\
  // Extend a given object with all the properties in passed-in object(s).\n\
  _.extend = function(obj) {\n\
    each(slice.call(arguments, 1), function(source) {\n\
      if (source) {\n\
        for (var prop in source) {\n\
          obj[prop] = source[prop];\n\
        }\n\
      }\n\
    });\n\
    return obj;\n\
  };\n\
\n\
  // Return a copy of the object only containing the whitelisted properties.\n\
  _.pick = function(obj) {\n\
    var copy = {};\n\
    var keys = concat.apply(ArrayProto, slice.call(arguments, 1));\n\
    each(keys, function(key) {\n\
      if (key in obj) copy[key] = obj[key];\n\
    });\n\
    return copy;\n\
  };\n\
\n\
   // Return a copy of the object without the blacklisted properties.\n\
  _.omit = function(obj) {\n\
    var copy = {};\n\
    var keys = concat.apply(ArrayProto, slice.call(arguments, 1));\n\
    for (var key in obj) {\n\
      if (!_.contains(keys, key)) copy[key] = obj[key];\n\
    }\n\
    return copy;\n\
  };\n\
\n\
  // Fill in a given object with default properties.\n\
  _.defaults = function(obj) {\n\
    each(slice.call(arguments, 1), function(source) {\n\
      if (source) {\n\
        for (var prop in source) {\n\
          if (obj[prop] === void 0) obj[prop] = source[prop];\n\
        }\n\
      }\n\
    });\n\
    return obj;\n\
  };\n\
\n\
  // Create a (shallow-cloned) duplicate of an object.\n\
  _.clone = function(obj) {\n\
    if (!_.isObject(obj)) return obj;\n\
    return _.isArray(obj) ? obj.slice() : _.extend({}, obj);\n\
  };\n\
\n\
  // Invokes interceptor with the obj, and then returns obj.\n\
  // The primary purpose of this method is to \"tap into\" a method chain, in\n\
  // order to perform operations on intermediate results within the chain.\n\
  _.tap = function(obj, interceptor) {\n\
    interceptor(obj);\n\
    return obj;\n\
  };\n\
\n\
  // Internal recursive comparison function for `isEqual`.\n\
  var eq = function(a, b, aStack, bStack) {\n\
    // Identical objects are equal. `0 === -0`, but they aren't identical.\n\
    // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).\n\
    if (a === b) return a !== 0 || 1 / a == 1 / b;\n\
    // A strict comparison is necessary because `null == undefined`.\n\
    if (a == null || b == null) return a === b;\n\
    // Unwrap any wrapped objects.\n\
    if (a instanceof _) a = a._wrapped;\n\
    if (b instanceof _) b = b._wrapped;\n\
    // Compare `[[Class]]` names.\n\
    var className = toString.call(a);\n\
    if (className != toString.call(b)) return false;\n\
    switch (className) {\n\
      // Strings, numbers, dates, and booleans are compared by value.\n\
      case '[object String]':\n\
        // Primitives and their corresponding object wrappers are equivalent; thus, `\"5\"` is\n\
        // equivalent to `new String(\"5\")`.\n\
        return a == String(b);\n\
      case '[object Number]':\n\
        // `NaN`s are equivalent, but non-reflexive. An `egal` comparison is performed for\n\
        // other numeric values.\n\
        return a != +a ? b != +b : (a == 0 ? 1 / a == 1 / b : a == +b);\n\
      case '[object Date]':\n\
      case '[object Boolean]':\n\
        // Coerce dates and booleans to numeric primitive values. Dates are compared by their\n\
        // millisecond representations. Note that invalid dates with millisecond representations\n\
        // of `NaN` are not equivalent.\n\
        return +a == +b;\n\
      // RegExps are compared by their source patterns and flags.\n\
      case '[object RegExp]':\n\
        return a.source == b.source &&\n\
               a.global == b.global &&\n\
               a.multiline == b.multiline &&\n\
               a.ignoreCase == b.ignoreCase;\n\
    }\n\
    if (typeof a != 'object' || typeof b != 'object') return false;\n\
    // Assume equality for cyclic structures. The algorithm for detecting cyclic\n\
    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.\n\
    var length = aStack.length;\n\
    while (length--) {\n\
      // Linear search. Performance is inversely proportional to the number of\n\
      // unique nested structures.\n\
      if (aStack[length] == a) return bStack[length] == b;\n\
    }\n\
    // Objects with different constructors are not equivalent, but `Object`s\n\
    // from different frames are.\n\
    var aCtor = a.constructor, bCtor = b.constructor;\n\
    if (aCtor !== bCtor && !(_.isFunction(aCtor) && (aCtor instanceof aCtor) &&\n\
                             _.isFunction(bCtor) && (bCtor instanceof bCtor))\n\
                        && ('constructor' in a && 'constructor' in b)) {\n\
      return false;\n\
    }\n\
    // Add the first object to the stack of traversed objects.\n\
    aStack.push(a);\n\
    bStack.push(b);\n\
    var size = 0, result = true;\n\
    // Recursively compare objects and arrays.\n\
    if (className == '[object Array]') {\n\
      // Compare array lengths to determine if a deep comparison is necessary.\n\
      size = a.length;\n\
      result = size == b.length;\n\
      if (result) {\n\
        // Deep compare the contents, ignoring non-numeric properties.\n\
        while (size--) {\n\
          if (!(result = eq(a[size], b[size], aStack, bStack))) break;\n\
        }\n\
      }\n\
    } else {\n\
      // Deep compare objects.\n\
      for (var key in a) {\n\
        if (_.has(a, key)) {\n\
          // Count the expected number of properties.\n\
          size++;\n\
          // Deep compare each member.\n\
          if (!(result = _.has(b, key) && eq(a[key], b[key], aStack, bStack))) break;\n\
        }\n\
      }\n\
      // Ensure that both objects contain the same number of properties.\n\
      if (result) {\n\
        for (key in b) {\n\
          if (_.has(b, key) && !(size--)) break;\n\
        }\n\
        result = !size;\n\
      }\n\
    }\n\
    // Remove the first object from the stack of traversed objects.\n\
    aStack.pop();\n\
    bStack.pop();\n\
    return result;\n\
  };\n\
\n\
  // Perform a deep comparison to check if two objects are equal.\n\
  _.isEqual = function(a, b) {\n\
    return eq(a, b, [], []);\n\
  };\n\
\n\
  // Is a given array, string, or object empty?\n\
  // An \"empty\" object has no enumerable own-properties.\n\
  _.isEmpty = function(obj) {\n\
    if (obj == null) return true;\n\
    if (_.isArray(obj) || _.isString(obj)) return obj.length === 0;\n\
    for (var key in obj) if (_.has(obj, key)) return false;\n\
    return true;\n\
  };\n\
\n\
  // Is a given value a DOM element?\n\
  _.isElement = function(obj) {\n\
    return !!(obj && obj.nodeType === 1);\n\
  };\n\
\n\
  // Is a given value an array?\n\
  // Delegates to ECMA5's native Array.isArray\n\
  _.isArray = nativeIsArray || function(obj) {\n\
    return toString.call(obj) == '[object Array]';\n\
  };\n\
\n\
  // Is a given variable an object?\n\
  _.isObject = function(obj) {\n\
    return obj === Object(obj);\n\
  };\n\
\n\
  // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp.\n\
  each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp'], function(name) {\n\
    _['is' + name] = function(obj) {\n\
      return toString.call(obj) == '[object ' + name + ']';\n\
    };\n\
  });\n\
\n\
  // Define a fallback version of the method in browsers (ahem, IE), where\n\
  // there isn't any inspectable \"Arguments\" type.\n\
  if (!_.isArguments(arguments)) {\n\
    _.isArguments = function(obj) {\n\
      return !!(obj && _.has(obj, 'callee'));\n\
    };\n\
  }\n\
\n\
  // Optimize `isFunction` if appropriate.\n\
  if (typeof (/./) !== 'function') {\n\
    _.isFunction = function(obj) {\n\
      return typeof obj === 'function';\n\
    };\n\
  }\n\
\n\
  // Is a given object a finite number?\n\
  _.isFinite = function(obj) {\n\
    return isFinite(obj) && !isNaN(parseFloat(obj));\n\
  };\n\
\n\
  // Is the given value `NaN`? (NaN is the only number which does not equal itself).\n\
  _.isNaN = function(obj) {\n\
    return _.isNumber(obj) && obj != +obj;\n\
  };\n\
\n\
  // Is a given value a boolean?\n\
  _.isBoolean = function(obj) {\n\
    return obj === true || obj === false || toString.call(obj) == '[object Boolean]';\n\
  };\n\
\n\
  // Is a given value equal to null?\n\
  _.isNull = function(obj) {\n\
    return obj === null;\n\
  };\n\
\n\
  // Is a given variable undefined?\n\
  _.isUndefined = function(obj) {\n\
    return obj === void 0;\n\
  };\n\
\n\
  // Shortcut function for checking if an object has a given property directly\n\
  // on itself (in other words, not on a prototype).\n\
  _.has = function(obj, key) {\n\
    return hasOwnProperty.call(obj, key);\n\
  };\n\
\n\
  // Utility Functions\n\
  // -----------------\n\
\n\
  // Run Underscore.js in *noConflict* mode, returning the `_` variable to its\n\
  // previous owner. Returns a reference to the Underscore object.\n\
  _.noConflict = function() {\n\
    root._ = previousUnderscore;\n\
    return this;\n\
  };\n\
\n\
  // Keep the identity function around for default iterators.\n\
  _.identity = function(value) {\n\
    return value;\n\
  };\n\
\n\
  _.constant = function(value) {\n\
    return function () {\n\
      return value;\n\
    };\n\
  };\n\
\n\
  _.property = function(key) {\n\
    return function(obj) {\n\
      return obj[key];\n\
    };\n\
  };\n\
\n\
  // Returns a predicate for checking whether an object has a given set of `key:value` pairs.\n\
  _.matches = function(attrs) {\n\
    return function(obj) {\n\
      if (obj === attrs) return true; //avoid comparing an object to itself.\n\
      for (var key in attrs) {\n\
        if (attrs[key] !== obj[key])\n\
          return false;\n\
      }\n\
      return true;\n\
    }\n\
  };\n\
\n\
  // Run a function **n** times.\n\
  _.times = function(n, iterator, context) {\n\
    var accum = Array(Math.max(0, n));\n\
    for (var i = 0; i < n; i++) accum[i] = iterator.call(context, i);\n\
    return accum;\n\
  };\n\
\n\
  // Return a random integer between min and max (inclusive).\n\
  _.random = function(min, max) {\n\
    if (max == null) {\n\
      max = min;\n\
      min = 0;\n\
    }\n\
    return min + Math.floor(Math.random() * (max - min + 1));\n\
  };\n\
\n\
  // A (possibly faster) way to get the current timestamp as an integer.\n\
  _.now = Date.now || function() { return new Date().getTime(); };\n\
\n\
  // List of HTML entities for escaping.\n\
  var entityMap = {\n\
    escape: {\n\
      '&': '&amp;',\n\
      '<': '&lt;',\n\
      '>': '&gt;',\n\
      '\"': '&quot;',\n\
      \"'\": '&#x27;'\n\
    }\n\
  };\n\
  entityMap.unescape = _.invert(entityMap.escape);\n\
\n\
  // Regexes containing the keys and values listed immediately above.\n\
  var entityRegexes = {\n\
    escape:   new RegExp('[' + _.keys(entityMap.escape).join('') + ']', 'g'),\n\
    unescape: new RegExp('(' + _.keys(entityMap.unescape).join('|') + ')', 'g')\n\
  };\n\
\n\
  // Functions for escaping and unescaping strings to/from HTML interpolation.\n\
  _.each(['escape', 'unescape'], function(method) {\n\
    _[method] = function(string) {\n\
      if (string == null) return '';\n\
      return ('' + string).replace(entityRegexes[method], function(match) {\n\
        return entityMap[method][match];\n\
      });\n\
    };\n\
  });\n\
\n\
  // If the value of the named `property` is a function then invoke it with the\n\
  // `object` as context; otherwise, return it.\n\
  _.result = function(object, property) {\n\
    if (object == null) return void 0;\n\
    var value = object[property];\n\
    return _.isFunction(value) ? value.call(object) : value;\n\
  };\n\
\n\
  // Add your own custom functions to the Underscore object.\n\
  _.mixin = function(obj) {\n\
    each(_.functions(obj), function(name) {\n\
      var func = _[name] = obj[name];\n\
      _.prototype[name] = function() {\n\
        var args = [this._wrapped];\n\
        push.apply(args, arguments);\n\
        return result.call(this, func.apply(_, args));\n\
      };\n\
    });\n\
  };\n\
\n\
  // Generate a unique integer id (unique within the entire client session).\n\
  // Useful for temporary DOM ids.\n\
  var idCounter = 0;\n\
  _.uniqueId = function(prefix) {\n\
    var id = ++idCounter + '';\n\
    return prefix ? prefix + id : id;\n\
  };\n\
\n\
  // By default, Underscore uses ERB-style template delimiters, change the\n\
  // following template settings to use alternative delimiters.\n\
  _.templateSettings = {\n\
    evaluate    : /<%([\\s\\S]+?)%>/g,\n\
    interpolate : /<%=([\\s\\S]+?)%>/g,\n\
    escape      : /<%-([\\s\\S]+?)%>/g\n\
  };\n\
\n\
  // When customizing `templateSettings`, if you don't want to define an\n\
  // interpolation, evaluation or escaping regex, we need one that is\n\
  // guaranteed not to match.\n\
  var noMatch = /(.)^/;\n\
\n\
  // Certain characters need to be escaped so that they can be put into a\n\
  // string literal.\n\
  var escapes = {\n\
    \"'\":      \"'\",\n\
    '\\\\':     '\\\\',\n\
    '\\r':     'r',\n\
    '\\n\
':     'n',\n\
    '\\t':     't',\n\
    '\\u2028': 'u2028',\n\
    '\\u2029': 'u2029'\n\
  };\n\
\n\
  var escaper = /\\\\|'|\\r|\\n\
|\\t|\\u2028|\\u2029/g;\n\
\n\
  // JavaScript micro-templating, similar to John Resig's implementation.\n\
  // Underscore templating handles arbitrary delimiters, preserves whitespace,\n\
  // and correctly escapes quotes within interpolated code.\n\
  _.template = function(text, data, settings) {\n\
    var render;\n\
    settings = _.defaults({}, settings, _.templateSettings);\n\
\n\
    // Combine delimiters into one regular expression via alternation.\n\
    var matcher = new RegExp([\n\
      (settings.escape || noMatch).source,\n\
      (settings.interpolate || noMatch).source,\n\
      (settings.evaluate || noMatch).source\n\
    ].join('|') + '|$', 'g');\n\
\n\
    // Compile the template source, escaping string literals appropriately.\n\
    var index = 0;\n\
    var source = \"__p+='\";\n\
    text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {\n\
      source += text.slice(index, offset)\n\
        .replace(escaper, function(match) { return '\\\\' + escapes[match]; });\n\
\n\
      if (escape) {\n\
        source += \"'+\\n\
((__t=(\" + escape + \"))==null?'':_.escape(__t))+\\n\
'\";\n\
      }\n\
      if (interpolate) {\n\
        source += \"'+\\n\
((__t=(\" + interpolate + \"))==null?'':__t)+\\n\
'\";\n\
      }\n\
      if (evaluate) {\n\
        source += \"';\\n\
\" + evaluate + \"\\n\
__p+='\";\n\
      }\n\
      index = offset + match.length;\n\
      return match;\n\
    });\n\
    source += \"';\\n\
\";\n\
\n\
    // If a variable is not specified, place data values in local scope.\n\
    if (!settings.variable) source = 'with(obj||{}){\\n\
' + source + '}\\n\
';\n\
\n\
    source = \"var __t,__p='',__j=Array.prototype.join,\" +\n\
      \"print=function(){__p+=__j.call(arguments,'');};\\n\
\" +\n\
      source + \"return __p;\\n\
\";\n\
\n\
    try {\n\
      render = new Function(settings.variable || 'obj', '_', source);\n\
    } catch (e) {\n\
      e.source = source;\n\
      throw e;\n\
    }\n\
\n\
    if (data) return render(data, _);\n\
    var template = function(data) {\n\
      return render.call(this, data, _);\n\
    };\n\
\n\
    // Provide the compiled function source as a convenience for precompilation.\n\
    template.source = 'function(' + (settings.variable || 'obj') + '){\\n\
' + source + '}';\n\
\n\
    return template;\n\
  };\n\
\n\
  // Add a \"chain\" function, which will delegate to the wrapper.\n\
  _.chain = function(obj) {\n\
    return _(obj).chain();\n\
  };\n\
\n\
  // OOP\n\
  // ---------------\n\
  // If Underscore is called as a function, it returns a wrapped object that\n\
  // can be used OO-style. This wrapper holds altered versions of all the\n\
  // underscore functions. Wrapped objects may be chained.\n\
\n\
  // Helper function to continue chaining intermediate results.\n\
  var result = function(obj) {\n\
    return this._chain ? _(obj).chain() : obj;\n\
  };\n\
\n\
  // Add all of the Underscore functions to the wrapper object.\n\
  _.mixin(_);\n\
\n\
  // Add all mutator Array functions to the wrapper.\n\
  each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {\n\
    var method = ArrayProto[name];\n\
    _.prototype[name] = function() {\n\
      var obj = this._wrapped;\n\
      method.apply(obj, arguments);\n\
      if ((name == 'shift' || name == 'splice') && obj.length === 0) delete obj[0];\n\
      return result.call(this, obj);\n\
    };\n\
  });\n\
\n\
  // Add all accessor Array functions to the wrapper.\n\
  each(['concat', 'join', 'slice'], function(name) {\n\
    var method = ArrayProto[name];\n\
    _.prototype[name] = function() {\n\
      return result.call(this, method.apply(this._wrapped, arguments));\n\
    };\n\
  });\n\
\n\
  _.extend(_.prototype, {\n\
\n\
    // Start chaining a wrapped Underscore object.\n\
    chain: function() {\n\
      this._chain = true;\n\
      return this;\n\
    },\n\
\n\
    // Extracts the result from a wrapped and chained object.\n\
    value: function() {\n\
      return this._wrapped;\n\
    }\n\
\n\
  });\n\
\n\
  // AMD registration happens at the end for compatibility with AMD loaders\n\
  // that may not enforce next-turn semantics on modules. Even though general\n\
  // practice for AMD registration is to be anonymous, underscore registers\n\
  // as a named module because, like jQuery, it is a base library that is\n\
  // popular enough to be bundled in a third party lib, but not be part of\n\
  // an AMD load request. Those cases could generate an error when an\n\
  // anonymous define() is called outside of a loader request.\n\
  if (typeof define === 'function' && define.amd) {\n\
    define('underscore', [], function() {\n\
      return _;\n\
    });\n\
  }\n\
}).call(this);\n\
\n\
//# sourceURL=components/jashkenas/underscore/1.6.0/underscore.js"
));

require.modules["jashkenas-underscore"] = require.modules["jashkenas~underscore@1.6.0"];
require.modules["jashkenas~underscore"] = require.modules["jashkenas~underscore@1.6.0"];
require.modules["underscore"] = require.modules["jashkenas~underscore@1.6.0"];


require.register("component~trim@0.0.1", Function("exports, module",
"\n\
exports = module.exports = trim;\n\
\n\
function trim(str){\n\
  if (str.trim) return str.trim();\n\
  return str.replace(/^\\s*|\\s*$/g, '');\n\
}\n\
\n\
exports.left = function(str){\n\
  if (str.trimLeft) return str.trimLeft();\n\
  return str.replace(/^\\s*/, '');\n\
};\n\
\n\
exports.right = function(str){\n\
  if (str.trimRight) return str.trimRight();\n\
  return str.replace(/\\s*$/, '');\n\
};\n\
\n\
//# sourceURL=components/component/trim/0.0.1/index.js"
));

require.modules["component-trim"] = require.modules["component~trim@0.0.1"];
require.modules["component~trim"] = require.modules["component~trim@0.0.1"];
require.modules["trim"] = require.modules["component~trim@0.0.1"];


require.register("component~querystring@1.3.0", Function("exports, module",
"\n\
/**\n\
 * Module dependencies.\n\
 */\n\
\n\
var encode = encodeURIComponent;\n\
var decode = decodeURIComponent;\n\
var trim = require(\"component~trim@0.0.1\");\n\
var type = require(\"component~type@1.0.0\");\n\
\n\
/**\n\
 * Parse the given query `str`.\n\
 *\n\
 * @param {String} str\n\
 * @return {Object}\n\
 * @api public\n\
 */\n\
\n\
exports.parse = function(str){\n\
  if ('string' != typeof str) return {};\n\
\n\
  str = trim(str);\n\
  if ('' == str) return {};\n\
  if ('?' == str.charAt(0)) str = str.slice(1);\n\
\n\
  var obj = {};\n\
  var pairs = str.split('&');\n\
  for (var i = 0; i < pairs.length; i++) {\n\
    var parts = pairs[i].split('=');\n\
    var key = decode(parts[0]);\n\
    var m;\n\
\n\
    if (m = /(\\w+)\\[(\\d+)\\]/.exec(key)) {\n\
      obj[m[1]] = obj[m[1]] || [];\n\
      obj[m[1]][m[2]] = decode(parts[1]);\n\
      continue;\n\
    }\n\
\n\
    obj[parts[0]] = null == parts[1]\n\
      ? ''\n\
      : decode(parts[1]);\n\
  }\n\
\n\
  return obj;\n\
};\n\
\n\
/**\n\
 * Stringify the given `obj`.\n\
 *\n\
 * @param {Object} obj\n\
 * @return {String}\n\
 * @api public\n\
 */\n\
\n\
exports.stringify = function(obj){\n\
  if (!obj) return '';\n\
  var pairs = [];\n\
\n\
  for (var key in obj) {\n\
    var value = obj[key];\n\
\n\
    if ('array' == type(value)) {\n\
      for (var i = 0; i < value.length; ++i) {\n\
        pairs.push(encode(key + '[' + i + ']') + '=' + encode(value[i]));\n\
      }\n\
      continue;\n\
    }\n\
\n\
    pairs.push(encode(key) + '=' + encode(obj[key]));\n\
  }\n\
\n\
  return pairs.join('&');\n\
};\n\
\n\
//# sourceURL=components/component/querystring/1.3.0/index.js"
));

require.modules["component-querystring"] = require.modules["component~querystring@1.3.0"];
require.modules["component~querystring"] = require.modules["component~querystring@1.3.0"];
require.modules["querystring"] = require.modules["component~querystring@1.3.0"];


require.register("jashkenas~backbone@1.1.2", Function("exports, module",
"//     Backbone.js 1.1.2\n\
\n\
//     (c) 2010-2014 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors\n\
//     Backbone may be freely distributed under the MIT license.\n\
//     For all details and documentation:\n\
//     http://backbonejs.org\n\
\n\
(function(root, factory) {\n\
\n\
  // Set up Backbone appropriately for the environment. Start with AMD.\n\
  if (typeof define === 'function' && define.amd) {\n\
    define(['underscore', 'jquery', 'exports'], function(_, $, exports) {\n\
      // Export global even in AMD case in case this script is loaded with\n\
      // others that may still expect a global Backbone.\n\
      root.Backbone = factory(root, exports, _, $);\n\
    });\n\
\n\
  // Next for Node.js or CommonJS. jQuery may not be needed as a module.\n\
  } else if (typeof exports !== 'undefined') {\n\
    var _ = require(\"jashkenas~underscore@1.6.0\");\n\
    factory(root, exports, _);\n\
\n\
  // Finally, as a browser global.\n\
  } else {\n\
    root.Backbone = factory(root, {}, root._, (root.jQuery || root.Zepto || root.ender || root.$));\n\
  }\n\
\n\
}(this, function(root, Backbone, _, $) {\n\
\n\
  // Initial Setup\n\
  // -------------\n\
\n\
  // Save the previous value of the `Backbone` variable, so that it can be\n\
  // restored later on, if `noConflict` is used.\n\
  var previousBackbone = root.Backbone;\n\
\n\
  // Create local references to array methods we'll want to use later.\n\
  var array = [];\n\
  var push = array.push;\n\
  var slice = array.slice;\n\
  var splice = array.splice;\n\
\n\
  // Current version of the library. Keep in sync with `package.json`.\n\
  Backbone.VERSION = '1.1.2';\n\
\n\
  // For Backbone's purposes, jQuery, Zepto, Ender, or My Library (kidding) owns\n\
  // the `$` variable.\n\
  Backbone.$ = $;\n\
\n\
  // Runs Backbone.js in *noConflict* mode, returning the `Backbone` variable\n\
  // to its previous owner. Returns a reference to this Backbone object.\n\
  Backbone.noConflict = function() {\n\
    root.Backbone = previousBackbone;\n\
    return this;\n\
  };\n\
\n\
  // Turn on `emulateHTTP` to support legacy HTTP servers. Setting this option\n\
  // will fake `\"PATCH\"`, `\"PUT\"` and `\"DELETE\"` requests via the `_method` parameter and\n\
  // set a `X-Http-Method-Override` header.\n\
  Backbone.emulateHTTP = false;\n\
\n\
  // Turn on `emulateJSON` to support legacy servers that can't deal with direct\n\
  // `application/json` requests ... will encode the body as\n\
  // `application/x-www-form-urlencoded` instead and will send the model in a\n\
  // form param named `model`.\n\
  Backbone.emulateJSON = false;\n\
\n\
  // Backbone.Events\n\
  // ---------------\n\
\n\
  // A module that can be mixed in to *any object* in order to provide it with\n\
  // custom events. You may bind with `on` or remove with `off` callback\n\
  // functions to an event; `trigger`-ing an event fires all callbacks in\n\
  // succession.\n\
  //\n\
  //     var object = {};\n\
  //     _.extend(object, Backbone.Events);\n\
  //     object.on('expand', function(){ alert('expanded'); });\n\
  //     object.trigger('expand');\n\
  //\n\
  var Events = Backbone.Events = {\n\
\n\
    // Bind an event to a `callback` function. Passing `\"all\"` will bind\n\
    // the callback to all events fired.\n\
    on: function(name, callback, context) {\n\
      if (!eventsApi(this, 'on', name, [callback, context]) || !callback) return this;\n\
      this._events || (this._events = {});\n\
      var events = this._events[name] || (this._events[name] = []);\n\
      events.push({callback: callback, context: context, ctx: context || this});\n\
      return this;\n\
    },\n\
\n\
    // Bind an event to only be triggered a single time. After the first time\n\
    // the callback is invoked, it will be removed.\n\
    once: function(name, callback, context) {\n\
      if (!eventsApi(this, 'once', name, [callback, context]) || !callback) return this;\n\
      var self = this;\n\
      var once = _.once(function() {\n\
        self.off(name, once);\n\
        callback.apply(this, arguments);\n\
      });\n\
      once._callback = callback;\n\
      return this.on(name, once, context);\n\
    },\n\
\n\
    // Remove one or many callbacks. If `context` is null, removes all\n\
    // callbacks with that function. If `callback` is null, removes all\n\
    // callbacks for the event. If `name` is null, removes all bound\n\
    // callbacks for all events.\n\
    off: function(name, callback, context) {\n\
      var retain, ev, events, names, i, l, j, k;\n\
      if (!this._events || !eventsApi(this, 'off', name, [callback, context])) return this;\n\
      if (!name && !callback && !context) {\n\
        this._events = void 0;\n\
        return this;\n\
      }\n\
      names = name ? [name] : _.keys(this._events);\n\
      for (i = 0, l = names.length; i < l; i++) {\n\
        name = names[i];\n\
        if (events = this._events[name]) {\n\
          this._events[name] = retain = [];\n\
          if (callback || context) {\n\
            for (j = 0, k = events.length; j < k; j++) {\n\
              ev = events[j];\n\
              if ((callback && callback !== ev.callback && callback !== ev.callback._callback) ||\n\
                  (context && context !== ev.context)) {\n\
                retain.push(ev);\n\
              }\n\
            }\n\
          }\n\
          if (!retain.length) delete this._events[name];\n\
        }\n\
      }\n\
\n\
      return this;\n\
    },\n\
\n\
    // Trigger one or many events, firing all bound callbacks. Callbacks are\n\
    // passed the same arguments as `trigger` is, apart from the event name\n\
    // (unless you're listening on `\"all\"`, which will cause your callback to\n\
    // receive the true name of the event as the first argument).\n\
    trigger: function(name) {\n\
      if (!this._events) return this;\n\
      var args = slice.call(arguments, 1);\n\
      if (!eventsApi(this, 'trigger', name, args)) return this;\n\
      var events = this._events[name];\n\
      var allEvents = this._events.all;\n\
      if (events) triggerEvents(events, args);\n\
      if (allEvents) triggerEvents(allEvents, arguments);\n\
      return this;\n\
    },\n\
\n\
    // Tell this object to stop listening to either specific events ... or\n\
    // to every object it's currently listening to.\n\
    stopListening: function(obj, name, callback) {\n\
      var listeningTo = this._listeningTo;\n\
      if (!listeningTo) return this;\n\
      var remove = !name && !callback;\n\
      if (!callback && typeof name === 'object') callback = this;\n\
      if (obj) (listeningTo = {})[obj._listenId] = obj;\n\
      for (var id in listeningTo) {\n\
        obj = listeningTo[id];\n\
        obj.off(name, callback, this);\n\
        if (remove || _.isEmpty(obj._events)) delete this._listeningTo[id];\n\
      }\n\
      return this;\n\
    }\n\
\n\
  };\n\
\n\
  // Regular expression used to split event strings.\n\
  var eventSplitter = /\\s+/;\n\
\n\
  // Implement fancy features of the Events API such as multiple event\n\
  // names `\"change blur\"` and jQuery-style event maps `{change: action}`\n\
  // in terms of the existing API.\n\
  var eventsApi = function(obj, action, name, rest) {\n\
    if (!name) return true;\n\
\n\
    // Handle event maps.\n\
    if (typeof name === 'object') {\n\
      for (var key in name) {\n\
        obj[action].apply(obj, [key, name[key]].concat(rest));\n\
      }\n\
      return false;\n\
    }\n\
\n\
    // Handle space separated event names.\n\
    if (eventSplitter.test(name)) {\n\
      var names = name.split(eventSplitter);\n\
      for (var i = 0, l = names.length; i < l; i++) {\n\
        obj[action].apply(obj, [names[i]].concat(rest));\n\
      }\n\
      return false;\n\
    }\n\
\n\
    return true;\n\
  };\n\
\n\
  // A difficult-to-believe, but optimized internal dispatch function for\n\
  // triggering events. Tries to keep the usual cases speedy (most internal\n\
  // Backbone events have 3 arguments).\n\
  var triggerEvents = function(events, args) {\n\
    var ev, i = -1, l = events.length, a1 = args[0], a2 = args[1], a3 = args[2];\n\
    switch (args.length) {\n\
      case 0: while (++i < l) (ev = events[i]).callback.call(ev.ctx); return;\n\
      case 1: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1); return;\n\
      case 2: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1, a2); return;\n\
      case 3: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1, a2, a3); return;\n\
      default: while (++i < l) (ev = events[i]).callback.apply(ev.ctx, args); return;\n\
    }\n\
  };\n\
\n\
  var listenMethods = {listenTo: 'on', listenToOnce: 'once'};\n\
\n\
  // Inversion-of-control versions of `on` and `once`. Tell *this* object to\n\
  // listen to an event in another object ... keeping track of what it's\n\
  // listening to.\n\
  _.each(listenMethods, function(implementation, method) {\n\
    Events[method] = function(obj, name, callback) {\n\
      var listeningTo = this._listeningTo || (this._listeningTo = {});\n\
      var id = obj._listenId || (obj._listenId = _.uniqueId('l'));\n\
      listeningTo[id] = obj;\n\
      if (!callback && typeof name === 'object') callback = this;\n\
      obj[implementation](name, callback, this);\n\
      return this;\n\
    };\n\
  });\n\
\n\
  // Aliases for backwards compatibility.\n\
  Events.bind   = Events.on;\n\
  Events.unbind = Events.off;\n\
\n\
  // Allow the `Backbone` object to serve as a global event bus, for folks who\n\
  // want global \"pubsub\" in a convenient place.\n\
  _.extend(Backbone, Events);\n\
\n\
  // Backbone.Model\n\
  // --------------\n\
\n\
  // Backbone **Models** are the basic data object in the framework --\n\
  // frequently representing a row in a table in a database on your server.\n\
  // A discrete chunk of data and a bunch of useful, related methods for\n\
  // performing computations and transformations on that data.\n\
\n\
  // Create a new model with the specified attributes. A client id (`cid`)\n\
  // is automatically generated and assigned for you.\n\
  var Model = Backbone.Model = function(attributes, options) {\n\
    var attrs = attributes || {};\n\
    options || (options = {});\n\
    this.cid = _.uniqueId('c');\n\
    this.attributes = {};\n\
    if (options.collection) this.collection = options.collection;\n\
    if (options.parse) attrs = this.parse(attrs, options) || {};\n\
    attrs = _.defaults({}, attrs, _.result(this, 'defaults'));\n\
    this.set(attrs, options);\n\
    this.changed = {};\n\
    this.initialize.apply(this, arguments);\n\
  };\n\
\n\
  // Attach all inheritable methods to the Model prototype.\n\
  _.extend(Model.prototype, Events, {\n\
\n\
    // A hash of attributes whose current and previous value differ.\n\
    changed: null,\n\
\n\
    // The value returned during the last failed validation.\n\
    validationError: null,\n\
\n\
    // The default name for the JSON `id` attribute is `\"id\"`. MongoDB and\n\
    // CouchDB users may want to set this to `\"_id\"`.\n\
    idAttribute: 'id',\n\
\n\
    // Initialize is an empty function by default. Override it with your own\n\
    // initialization logic.\n\
    initialize: function(){},\n\
\n\
    // Return a copy of the model's `attributes` object.\n\
    toJSON: function(options) {\n\
      return _.clone(this.attributes);\n\
    },\n\
\n\
    // Proxy `Backbone.sync` by default -- but override this if you need\n\
    // custom syncing semantics for *this* particular model.\n\
    sync: function() {\n\
      return Backbone.sync.apply(this, arguments);\n\
    },\n\
\n\
    // Get the value of an attribute.\n\
    get: function(attr) {\n\
      return this.attributes[attr];\n\
    },\n\
\n\
    // Get the HTML-escaped value of an attribute.\n\
    escape: function(attr) {\n\
      return _.escape(this.get(attr));\n\
    },\n\
\n\
    // Returns `true` if the attribute contains a value that is not null\n\
    // or undefined.\n\
    has: function(attr) {\n\
      return this.get(attr) != null;\n\
    },\n\
\n\
    // Set a hash of model attributes on the object, firing `\"change\"`. This is\n\
    // the core primitive operation of a model, updating the data and notifying\n\
    // anyone who needs to know about the change in state. The heart of the beast.\n\
    set: function(key, val, options) {\n\
      var attr, attrs, unset, changes, silent, changing, prev, current;\n\
      if (key == null) return this;\n\
\n\
      // Handle both `\"key\", value` and `{key: value}` -style arguments.\n\
      if (typeof key === 'object') {\n\
        attrs = key;\n\
        options = val;\n\
      } else {\n\
        (attrs = {})[key] = val;\n\
      }\n\
\n\
      options || (options = {});\n\
\n\
      // Run validation.\n\
      if (!this._validate(attrs, options)) return false;\n\
\n\
      // Extract attributes and options.\n\
      unset           = options.unset;\n\
      silent          = options.silent;\n\
      changes         = [];\n\
      changing        = this._changing;\n\
      this._changing  = true;\n\
\n\
      if (!changing) {\n\
        this._previousAttributes = _.clone(this.attributes);\n\
        this.changed = {};\n\
      }\n\
      current = this.attributes, prev = this._previousAttributes;\n\
\n\
      // Check for changes of `id`.\n\
      if (this.idAttribute in attrs) this.id = attrs[this.idAttribute];\n\
\n\
      // For each `set` attribute, update or delete the current value.\n\
      for (attr in attrs) {\n\
        val = attrs[attr];\n\
        if (!_.isEqual(current[attr], val)) changes.push(attr);\n\
        if (!_.isEqual(prev[attr], val)) {\n\
          this.changed[attr] = val;\n\
        } else {\n\
          delete this.changed[attr];\n\
        }\n\
        unset ? delete current[attr] : current[attr] = val;\n\
      }\n\
\n\
      // Trigger all relevant attribute changes.\n\
      if (!silent) {\n\
        if (changes.length) this._pending = options;\n\
        for (var i = 0, l = changes.length; i < l; i++) {\n\
          this.trigger('change:' + changes[i], this, current[changes[i]], options);\n\
        }\n\
      }\n\
\n\
      // You might be wondering why there's a `while` loop here. Changes can\n\
      // be recursively nested within `\"change\"` events.\n\
      if (changing) return this;\n\
      if (!silent) {\n\
        while (this._pending) {\n\
          options = this._pending;\n\
          this._pending = false;\n\
          this.trigger('change', this, options);\n\
        }\n\
      }\n\
      this._pending = false;\n\
      this._changing = false;\n\
      return this;\n\
    },\n\
\n\
    // Remove an attribute from the model, firing `\"change\"`. `unset` is a noop\n\
    // if the attribute doesn't exist.\n\
    unset: function(attr, options) {\n\
      return this.set(attr, void 0, _.extend({}, options, {unset: true}));\n\
    },\n\
\n\
    // Clear all attributes on the model, firing `\"change\"`.\n\
    clear: function(options) {\n\
      var attrs = {};\n\
      for (var key in this.attributes) attrs[key] = void 0;\n\
      return this.set(attrs, _.extend({}, options, {unset: true}));\n\
    },\n\
\n\
    // Determine if the model has changed since the last `\"change\"` event.\n\
    // If you specify an attribute name, determine if that attribute has changed.\n\
    hasChanged: function(attr) {\n\
      if (attr == null) return !_.isEmpty(this.changed);\n\
      return _.has(this.changed, attr);\n\
    },\n\
\n\
    // Return an object containing all the attributes that have changed, or\n\
    // false if there are no changed attributes. Useful for determining what\n\
    // parts of a view need to be updated and/or what attributes need to be\n\
    // persisted to the server. Unset attributes will be set to undefined.\n\
    // You can also pass an attributes object to diff against the model,\n\
    // determining if there *would be* a change.\n\
    changedAttributes: function(diff) {\n\
      if (!diff) return this.hasChanged() ? _.clone(this.changed) : false;\n\
      var val, changed = false;\n\
      var old = this._changing ? this._previousAttributes : this.attributes;\n\
      for (var attr in diff) {\n\
        if (_.isEqual(old[attr], (val = diff[attr]))) continue;\n\
        (changed || (changed = {}))[attr] = val;\n\
      }\n\
      return changed;\n\
    },\n\
\n\
    // Get the previous value of an attribute, recorded at the time the last\n\
    // `\"change\"` event was fired.\n\
    previous: function(attr) {\n\
      if (attr == null || !this._previousAttributes) return null;\n\
      return this._previousAttributes[attr];\n\
    },\n\
\n\
    // Get all of the attributes of the model at the time of the previous\n\
    // `\"change\"` event.\n\
    previousAttributes: function() {\n\
      return _.clone(this._previousAttributes);\n\
    },\n\
\n\
    // Fetch the model from the server. If the server's representation of the\n\
    // model differs from its current attributes, they will be overridden,\n\
    // triggering a `\"change\"` event.\n\
    fetch: function(options) {\n\
      options = options ? _.clone(options) : {};\n\
      if (options.parse === void 0) options.parse = true;\n\
      var model = this;\n\
      var success = options.success;\n\
      options.success = function(resp) {\n\
        if (!model.set(model.parse(resp, options), options)) return false;\n\
        if (success) success(model, resp, options);\n\
        model.trigger('sync', model, resp, options);\n\
      };\n\
      wrapError(this, options);\n\
      return this.sync('read', this, options);\n\
    },\n\
\n\
    // Set a hash of model attributes, and sync the model to the server.\n\
    // If the server returns an attributes hash that differs, the model's\n\
    // state will be `set` again.\n\
    save: function(key, val, options) {\n\
      var attrs, method, xhr, attributes = this.attributes;\n\
\n\
      // Handle both `\"key\", value` and `{key: value}` -style arguments.\n\
      if (key == null || typeof key === 'object') {\n\
        attrs = key;\n\
        options = val;\n\
      } else {\n\
        (attrs = {})[key] = val;\n\
      }\n\
\n\
      options = _.extend({validate: true}, options);\n\
\n\
      // If we're not waiting and attributes exist, save acts as\n\
      // `set(attr).save(null, opts)` with validation. Otherwise, check if\n\
      // the model will be valid when the attributes, if any, are set.\n\
      if (attrs && !options.wait) {\n\
        if (!this.set(attrs, options)) return false;\n\
      } else {\n\
        if (!this._validate(attrs, options)) return false;\n\
      }\n\
\n\
      // Set temporary attributes if `{wait: true}`.\n\
      if (attrs && options.wait) {\n\
        this.attributes = _.extend({}, attributes, attrs);\n\
      }\n\
\n\
      // After a successful server-side save, the client is (optionally)\n\
      // updated with the server-side state.\n\
      if (options.parse === void 0) options.parse = true;\n\
      var model = this;\n\
      var success = options.success;\n\
      options.success = function(resp) {\n\
        // Ensure attributes are restored during synchronous saves.\n\
        model.attributes = attributes;\n\
        var serverAttrs = model.parse(resp, options);\n\
        if (options.wait) serverAttrs = _.extend(attrs || {}, serverAttrs);\n\
        if (_.isObject(serverAttrs) && !model.set(serverAttrs, options)) {\n\
          return false;\n\
        }\n\
        if (success) success(model, resp, options);\n\
        model.trigger('sync', model, resp, options);\n\
      };\n\
      wrapError(this, options);\n\
\n\
      method = this.isNew() ? 'create' : (options.patch ? 'patch' : 'update');\n\
      if (method === 'patch') options.attrs = attrs;\n\
      xhr = this.sync(method, this, options);\n\
\n\
      // Restore attributes.\n\
      if (attrs && options.wait) this.attributes = attributes;\n\
\n\
      return xhr;\n\
    },\n\
\n\
    // Destroy this model on the server if it was already persisted.\n\
    // Optimistically removes the model from its collection, if it has one.\n\
    // If `wait: true` is passed, waits for the server to respond before removal.\n\
    destroy: function(options) {\n\
      options = options ? _.clone(options) : {};\n\
      var model = this;\n\
      var success = options.success;\n\
\n\
      var destroy = function() {\n\
        model.trigger('destroy', model, model.collection, options);\n\
      };\n\
\n\
      options.success = function(resp) {\n\
        if (options.wait || model.isNew()) destroy();\n\
        if (success) success(model, resp, options);\n\
        if (!model.isNew()) model.trigger('sync', model, resp, options);\n\
      };\n\
\n\
      if (this.isNew()) {\n\
        options.success();\n\
        return false;\n\
      }\n\
      wrapError(this, options);\n\
\n\
      var xhr = this.sync('delete', this, options);\n\
      if (!options.wait) destroy();\n\
      return xhr;\n\
    },\n\
\n\
    // Default URL for the model's representation on the server -- if you're\n\
    // using Backbone's restful methods, override this to change the endpoint\n\
    // that will be called.\n\
    url: function() {\n\
      var base =\n\
        _.result(this, 'urlRoot') ||\n\
        _.result(this.collection, 'url') ||\n\
        urlError();\n\
      if (this.isNew()) return base;\n\
      return base.replace(/([^\\/])$/, '$1/') + encodeURIComponent(this.id);\n\
    },\n\
\n\
    // **parse** converts a response into the hash of attributes to be `set` on\n\
    // the model. The default implementation is just to pass the response along.\n\
    parse: function(resp, options) {\n\
      return resp;\n\
    },\n\
\n\
    // Create a new model with identical attributes to this one.\n\
    clone: function() {\n\
      return new this.constructor(this.attributes);\n\
    },\n\
\n\
    // A model is new if it has never been saved to the server, and lacks an id.\n\
    isNew: function() {\n\
      return !this.has(this.idAttribute);\n\
    },\n\
\n\
    // Check if the model is currently in a valid state.\n\
    isValid: function(options) {\n\
      return this._validate({}, _.extend(options || {}, { validate: true }));\n\
    },\n\
\n\
    // Run validation against the next complete set of model attributes,\n\
    // returning `true` if all is well. Otherwise, fire an `\"invalid\"` event.\n\
    _validate: function(attrs, options) {\n\
      if (!options.validate || !this.validate) return true;\n\
      attrs = _.extend({}, this.attributes, attrs);\n\
      var error = this.validationError = this.validate(attrs, options) || null;\n\
      if (!error) return true;\n\
      this.trigger('invalid', this, error, _.extend(options, {validationError: error}));\n\
      return false;\n\
    }\n\
\n\
  });\n\
\n\
  // Underscore methods that we want to implement on the Model.\n\
  var modelMethods = ['keys', 'values', 'pairs', 'invert', 'pick', 'omit'];\n\
\n\
  // Mix in each Underscore method as a proxy to `Model#attributes`.\n\
  _.each(modelMethods, function(method) {\n\
    Model.prototype[method] = function() {\n\
      var args = slice.call(arguments);\n\
      args.unshift(this.attributes);\n\
      return _[method].apply(_, args);\n\
    };\n\
  });\n\
\n\
  // Backbone.Collection\n\
  // -------------------\n\
\n\
  // If models tend to represent a single row of data, a Backbone Collection is\n\
  // more analagous to a table full of data ... or a small slice or page of that\n\
  // table, or a collection of rows that belong together for a particular reason\n\
  // -- all of the messages in this particular folder, all of the documents\n\
  // belonging to this particular author, and so on. Collections maintain\n\
  // indexes of their models, both in order, and for lookup by `id`.\n\
\n\
  // Create a new **Collection**, perhaps to contain a specific type of `model`.\n\
  // If a `comparator` is specified, the Collection will maintain\n\
  // its models in sort order, as they're added and removed.\n\
  var Collection = Backbone.Collection = function(models, options) {\n\
    options || (options = {});\n\
    if (options.model) this.model = options.model;\n\
    if (options.comparator !== void 0) this.comparator = options.comparator;\n\
    this._reset();\n\
    this.initialize.apply(this, arguments);\n\
    if (models) this.reset(models, _.extend({silent: true}, options));\n\
  };\n\
\n\
  // Default options for `Collection#set`.\n\
  var setOptions = {add: true, remove: true, merge: true};\n\
  var addOptions = {add: true, remove: false};\n\
\n\
  // Define the Collection's inheritable methods.\n\
  _.extend(Collection.prototype, Events, {\n\
\n\
    // The default model for a collection is just a **Backbone.Model**.\n\
    // This should be overridden in most cases.\n\
    model: Model,\n\
\n\
    // Initialize is an empty function by default. Override it with your own\n\
    // initialization logic.\n\
    initialize: function(){},\n\
\n\
    // The JSON representation of a Collection is an array of the\n\
    // models' attributes.\n\
    toJSON: function(options) {\n\
      return this.map(function(model){ return model.toJSON(options); });\n\
    },\n\
\n\
    // Proxy `Backbone.sync` by default.\n\
    sync: function() {\n\
      return Backbone.sync.apply(this, arguments);\n\
    },\n\
\n\
    // Add a model, or list of models to the set.\n\
    add: function(models, options) {\n\
      return this.set(models, _.extend({merge: false}, options, addOptions));\n\
    },\n\
\n\
    // Remove a model, or a list of models from the set.\n\
    remove: function(models, options) {\n\
      var singular = !_.isArray(models);\n\
      models = singular ? [models] : _.clone(models);\n\
      options || (options = {});\n\
      var i, l, index, model;\n\
      for (i = 0, l = models.length; i < l; i++) {\n\
        model = models[i] = this.get(models[i]);\n\
        if (!model) continue;\n\
        delete this._byId[model.id];\n\
        delete this._byId[model.cid];\n\
        index = this.indexOf(model);\n\
        this.models.splice(index, 1);\n\
        this.length--;\n\
        if (!options.silent) {\n\
          options.index = index;\n\
          model.trigger('remove', model, this, options);\n\
        }\n\
        this._removeReference(model, options);\n\
      }\n\
      return singular ? models[0] : models;\n\
    },\n\
\n\
    // Update a collection by `set`-ing a new list of models, adding new ones,\n\
    // removing models that are no longer present, and merging models that\n\
    // already exist in the collection, as necessary. Similar to **Model#set**,\n\
    // the core operation for updating the data contained by the collection.\n\
    set: function(models, options) {\n\
      options = _.defaults({}, options, setOptions);\n\
      if (options.parse) models = this.parse(models, options);\n\
      var singular = !_.isArray(models);\n\
      models = singular ? (models ? [models] : []) : _.clone(models);\n\
      var i, l, id, model, attrs, existing, sort;\n\
      var at = options.at;\n\
      var targetModel = this.model;\n\
      var sortable = this.comparator && (at == null) && options.sort !== false;\n\
      var sortAttr = _.isString(this.comparator) ? this.comparator : null;\n\
      var toAdd = [], toRemove = [], modelMap = {};\n\
      var add = options.add, merge = options.merge, remove = options.remove;\n\
      var order = !sortable && add && remove ? [] : false;\n\
\n\
      // Turn bare objects into model references, and prevent invalid models\n\
      // from being added.\n\
      for (i = 0, l = models.length; i < l; i++) {\n\
        attrs = models[i] || {};\n\
        if (attrs instanceof Model) {\n\
          id = model = attrs;\n\
        } else {\n\
          id = attrs[targetModel.prototype.idAttribute || 'id'];\n\
        }\n\
\n\
        // If a duplicate is found, prevent it from being added and\n\
        // optionally merge it into the existing model.\n\
        if (existing = this.get(id)) {\n\
          if (remove) modelMap[existing.cid] = true;\n\
          if (merge) {\n\
            attrs = attrs === model ? model.attributes : attrs;\n\
            if (options.parse) attrs = existing.parse(attrs, options);\n\
            existing.set(attrs, options);\n\
            if (sortable && !sort && existing.hasChanged(sortAttr)) sort = true;\n\
          }\n\
          models[i] = existing;\n\
\n\
        // If this is a new, valid model, push it to the `toAdd` list.\n\
        } else if (add) {\n\
          model = models[i] = this._prepareModel(attrs, options);\n\
          if (!model) continue;\n\
          toAdd.push(model);\n\
          this._addReference(model, options);\n\
        }\n\
\n\
        // Do not add multiple models with the same `id`.\n\
        model = existing || model;\n\
        if (order && (model.isNew() || !modelMap[model.id])) order.push(model);\n\
        modelMap[model.id] = true;\n\
      }\n\
\n\
      // Remove nonexistent models if appropriate.\n\
      if (remove) {\n\
        for (i = 0, l = this.length; i < l; ++i) {\n\
          if (!modelMap[(model = this.models[i]).cid]) toRemove.push(model);\n\
        }\n\
        if (toRemove.length) this.remove(toRemove, options);\n\
      }\n\
\n\
      // See if sorting is needed, update `length` and splice in new models.\n\
      if (toAdd.length || (order && order.length)) {\n\
        if (sortable) sort = true;\n\
        this.length += toAdd.length;\n\
        if (at != null) {\n\
          for (i = 0, l = toAdd.length; i < l; i++) {\n\
            this.models.splice(at + i, 0, toAdd[i]);\n\
          }\n\
        } else {\n\
          if (order) this.models.length = 0;\n\
          var orderedModels = order || toAdd;\n\
          for (i = 0, l = orderedModels.length; i < l; i++) {\n\
            this.models.push(orderedModels[i]);\n\
          }\n\
        }\n\
      }\n\
\n\
      // Silently sort the collection if appropriate.\n\
      if (sort) this.sort({silent: true});\n\
\n\
      // Unless silenced, it's time to fire all appropriate add/sort events.\n\
      if (!options.silent) {\n\
        for (i = 0, l = toAdd.length; i < l; i++) {\n\
          (model = toAdd[i]).trigger('add', model, this, options);\n\
        }\n\
        if (sort || (order && order.length)) this.trigger('sort', this, options);\n\
      }\n\
\n\
      // Return the added (or merged) model (or models).\n\
      return singular ? models[0] : models;\n\
    },\n\
\n\
    // When you have more items than you want to add or remove individually,\n\
    // you can reset the entire set with a new list of models, without firing\n\
    // any granular `add` or `remove` events. Fires `reset` when finished.\n\
    // Useful for bulk operations and optimizations.\n\
    reset: function(models, options) {\n\
      options || (options = {});\n\
      for (var i = 0, l = this.models.length; i < l; i++) {\n\
        this._removeReference(this.models[i], options);\n\
      }\n\
      options.previousModels = this.models;\n\
      this._reset();\n\
      models = this.add(models, _.extend({silent: true}, options));\n\
      if (!options.silent) this.trigger('reset', this, options);\n\
      return models;\n\
    },\n\
\n\
    // Add a model to the end of the collection.\n\
    push: function(model, options) {\n\
      return this.add(model, _.extend({at: this.length}, options));\n\
    },\n\
\n\
    // Remove a model from the end of the collection.\n\
    pop: function(options) {\n\
      var model = this.at(this.length - 1);\n\
      this.remove(model, options);\n\
      return model;\n\
    },\n\
\n\
    // Add a model to the beginning of the collection.\n\
    unshift: function(model, options) {\n\
      return this.add(model, _.extend({at: 0}, options));\n\
    },\n\
\n\
    // Remove a model from the beginning of the collection.\n\
    shift: function(options) {\n\
      var model = this.at(0);\n\
      this.remove(model, options);\n\
      return model;\n\
    },\n\
\n\
    // Slice out a sub-array of models from the collection.\n\
    slice: function() {\n\
      return slice.apply(this.models, arguments);\n\
    },\n\
\n\
    // Get a model from the set by id.\n\
    get: function(obj) {\n\
      if (obj == null) return void 0;\n\
      return this._byId[obj] || this._byId[obj.id] || this._byId[obj.cid];\n\
    },\n\
\n\
    // Get the model at the given index.\n\
    at: function(index) {\n\
      return this.models[index];\n\
    },\n\
\n\
    // Return models with matching attributes. Useful for simple cases of\n\
    // `filter`.\n\
    where: function(attrs, first) {\n\
      if (_.isEmpty(attrs)) return first ? void 0 : [];\n\
      return this[first ? 'find' : 'filter'](function(model) {\n\
        for (var key in attrs) {\n\
          if (attrs[key] !== model.get(key)) return false;\n\
        }\n\
        return true;\n\
      });\n\
    },\n\
\n\
    // Return the first model with matching attributes. Useful for simple cases\n\
    // of `find`.\n\
    findWhere: function(attrs) {\n\
      return this.where(attrs, true);\n\
    },\n\
\n\
    // Force the collection to re-sort itself. You don't need to call this under\n\
    // normal circumstances, as the set will maintain sort order as each item\n\
    // is added.\n\
    sort: function(options) {\n\
      if (!this.comparator) throw new Error('Cannot sort a set without a comparator');\n\
      options || (options = {});\n\
\n\
      // Run sort based on type of `comparator`.\n\
      if (_.isString(this.comparator) || this.comparator.length === 1) {\n\
        this.models = this.sortBy(this.comparator, this);\n\
      } else {\n\
        this.models.sort(_.bind(this.comparator, this));\n\
      }\n\
\n\
      if (!options.silent) this.trigger('sort', this, options);\n\
      return this;\n\
    },\n\
\n\
    // Pluck an attribute from each model in the collection.\n\
    pluck: function(attr) {\n\
      return _.invoke(this.models, 'get', attr);\n\
    },\n\
\n\
    // Fetch the default set of models for this collection, resetting the\n\
    // collection when they arrive. If `reset: true` is passed, the response\n\
    // data will be passed through the `reset` method instead of `set`.\n\
    fetch: function(options) {\n\
      options = options ? _.clone(options) : {};\n\
      if (options.parse === void 0) options.parse = true;\n\
      var success = options.success;\n\
      var collection = this;\n\
      options.success = function(resp) {\n\
        var method = options.reset ? 'reset' : 'set';\n\
        collection[method](resp, options);\n\
        if (success) success(collection, resp, options);\n\
        collection.trigger('sync', collection, resp, options);\n\
      };\n\
      wrapError(this, options);\n\
      return this.sync('read', this, options);\n\
    },\n\
\n\
    // Create a new instance of a model in this collection. Add the model to the\n\
    // collection immediately, unless `wait: true` is passed, in which case we\n\
    // wait for the server to agree.\n\
    create: function(model, options) {\n\
      options = options ? _.clone(options) : {};\n\
      if (!(model = this._prepareModel(model, options))) return false;\n\
      if (!options.wait) this.add(model, options);\n\
      var collection = this;\n\
      var success = options.success;\n\
      options.success = function(model, resp) {\n\
        if (options.wait) collection.add(model, options);\n\
        if (success) success(model, resp, options);\n\
      };\n\
      model.save(null, options);\n\
      return model;\n\
    },\n\
\n\
    // **parse** converts a response into a list of models to be added to the\n\
    // collection. The default implementation is just to pass it through.\n\
    parse: function(resp, options) {\n\
      return resp;\n\
    },\n\
\n\
    // Create a new collection with an identical list of models as this one.\n\
    clone: function() {\n\
      return new this.constructor(this.models);\n\
    },\n\
\n\
    // Private method to reset all internal state. Called when the collection\n\
    // is first initialized or reset.\n\
    _reset: function() {\n\
      this.length = 0;\n\
      this.models = [];\n\
      this._byId  = {};\n\
    },\n\
\n\
    // Prepare a hash of attributes (or other model) to be added to this\n\
    // collection.\n\
    _prepareModel: function(attrs, options) {\n\
      if (attrs instanceof Model) return attrs;\n\
      options = options ? _.clone(options) : {};\n\
      options.collection = this;\n\
      var model = new this.model(attrs, options);\n\
      if (!model.validationError) return model;\n\
      this.trigger('invalid', this, model.validationError, options);\n\
      return false;\n\
    },\n\
\n\
    // Internal method to create a model's ties to a collection.\n\
    _addReference: function(model, options) {\n\
      this._byId[model.cid] = model;\n\
      if (model.id != null) this._byId[model.id] = model;\n\
      if (!model.collection) model.collection = this;\n\
      model.on('all', this._onModelEvent, this);\n\
    },\n\
\n\
    // Internal method to sever a model's ties to a collection.\n\
    _removeReference: function(model, options) {\n\
      if (this === model.collection) delete model.collection;\n\
      model.off('all', this._onModelEvent, this);\n\
    },\n\
\n\
    // Internal method called every time a model in the set fires an event.\n\
    // Sets need to update their indexes when models change ids. All other\n\
    // events simply proxy through. \"add\" and \"remove\" events that originate\n\
    // in other collections are ignored.\n\
    _onModelEvent: function(event, model, collection, options) {\n\
      if ((event === 'add' || event === 'remove') && collection !== this) return;\n\
      if (event === 'destroy') this.remove(model, options);\n\
      if (model && event === 'change:' + model.idAttribute) {\n\
        delete this._byId[model.previous(model.idAttribute)];\n\
        if (model.id != null) this._byId[model.id] = model;\n\
      }\n\
      this.trigger.apply(this, arguments);\n\
    }\n\
\n\
  });\n\
\n\
  // Underscore methods that we want to implement on the Collection.\n\
  // 90% of the core usefulness of Backbone Collections is actually implemented\n\
  // right here:\n\
  var methods = ['forEach', 'each', 'map', 'collect', 'reduce', 'foldl',\n\
    'inject', 'reduceRight', 'foldr', 'find', 'detect', 'filter', 'select',\n\
    'reject', 'every', 'all', 'some', 'any', 'include', 'contains', 'invoke',\n\
    'max', 'min', 'toArray', 'size', 'first', 'head', 'take', 'initial', 'rest',\n\
    'tail', 'drop', 'last', 'without', 'difference', 'indexOf', 'shuffle',\n\
    'lastIndexOf', 'isEmpty', 'chain', 'sample'];\n\
\n\
  // Mix in each Underscore method as a proxy to `Collection#models`.\n\
  _.each(methods, function(method) {\n\
    Collection.prototype[method] = function() {\n\
      var args = slice.call(arguments);\n\
      args.unshift(this.models);\n\
      return _[method].apply(_, args);\n\
    };\n\
  });\n\
\n\
  // Underscore methods that take a property name as an argument.\n\
  var attributeMethods = ['groupBy', 'countBy', 'sortBy', 'indexBy'];\n\
\n\
  // Use attributes instead of properties.\n\
  _.each(attributeMethods, function(method) {\n\
    Collection.prototype[method] = function(value, context) {\n\
      var iterator = _.isFunction(value) ? value : function(model) {\n\
        return model.get(value);\n\
      };\n\
      return _[method](this.models, iterator, context);\n\
    };\n\
  });\n\
\n\
  // Backbone.View\n\
  // -------------\n\
\n\
  // Backbone Views are almost more convention than they are actual code. A View\n\
  // is simply a JavaScript object that represents a logical chunk of UI in the\n\
  // DOM. This might be a single item, an entire list, a sidebar or panel, or\n\
  // even the surrounding frame which wraps your whole app. Defining a chunk of\n\
  // UI as a **View** allows you to define your DOM events declaratively, without\n\
  // having to worry about render order ... and makes it easy for the view to\n\
  // react to specific changes in the state of your models.\n\
\n\
  // Creating a Backbone.View creates its initial element outside of the DOM,\n\
  // if an existing element is not provided...\n\
  var View = Backbone.View = function(options) {\n\
    this.cid = _.uniqueId('view');\n\
    options || (options = {});\n\
    _.extend(this, _.pick(options, viewOptions));\n\
    this._ensureElement();\n\
    this.initialize.apply(this, arguments);\n\
    this.delegateEvents();\n\
  };\n\
\n\
  // Cached regex to split keys for `delegate`.\n\
  var delegateEventSplitter = /^(\\S+)\\s*(.*)$/;\n\
\n\
  // List of view options to be merged as properties.\n\
  var viewOptions = ['model', 'collection', 'el', 'id', 'attributes', 'className', 'tagName', 'events'];\n\
\n\
  // Set up all inheritable **Backbone.View** properties and methods.\n\
  _.extend(View.prototype, Events, {\n\
\n\
    // The default `tagName` of a View's element is `\"div\"`.\n\
    tagName: 'div',\n\
\n\
    // jQuery delegate for element lookup, scoped to DOM elements within the\n\
    // current view. This should be preferred to global lookups where possible.\n\
    $: function(selector) {\n\
      return this.$el.find(selector);\n\
    },\n\
\n\
    // Initialize is an empty function by default. Override it with your own\n\
    // initialization logic.\n\
    initialize: function(){},\n\
\n\
    // **render** is the core function that your view should override, in order\n\
    // to populate its element (`this.el`), with the appropriate HTML. The\n\
    // convention is for **render** to always return `this`.\n\
    render: function() {\n\
      return this;\n\
    },\n\
\n\
    // Remove this view by taking the element out of the DOM, and removing any\n\
    // applicable Backbone.Events listeners.\n\
    remove: function() {\n\
      this.$el.remove();\n\
      this.stopListening();\n\
      return this;\n\
    },\n\
\n\
    // Change the view's element (`this.el` property), including event\n\
    // re-delegation.\n\
    setElement: function(element, delegate) {\n\
      if (this.$el) this.undelegateEvents();\n\
      this.$el = element instanceof Backbone.$ ? element : Backbone.$(element);\n\
      this.el = this.$el[0];\n\
      if (delegate !== false) this.delegateEvents();\n\
      return this;\n\
    },\n\
\n\
    // Set callbacks, where `this.events` is a hash of\n\
    //\n\
    // *{\"event selector\": \"callback\"}*\n\
    //\n\
    //     {\n\
    //       'mousedown .title':  'edit',\n\
    //       'click .button':     'save',\n\
    //       'click .open':       function(e) { ... }\n\
    //     }\n\
    //\n\
    // pairs. Callbacks will be bound to the view, with `this` set properly.\n\
    // Uses event delegation for efficiency.\n\
    // Omitting the selector binds the event to `this.el`.\n\
    // This only works for delegate-able events: not `focus`, `blur`, and\n\
    // not `change`, `submit`, and `reset` in Internet Explorer.\n\
    delegateEvents: function(events) {\n\
      if (!(events || (events = _.result(this, 'events')))) return this;\n\
      this.undelegateEvents();\n\
      for (var key in events) {\n\
        var method = events[key];\n\
        if (!_.isFunction(method)) method = this[events[key]];\n\
        if (!method) continue;\n\
\n\
        var match = key.match(delegateEventSplitter);\n\
        var eventName = match[1], selector = match[2];\n\
        method = _.bind(method, this);\n\
        eventName += '.delegateEvents' + this.cid;\n\
        if (selector === '') {\n\
          this.$el.on(eventName, method);\n\
        } else {\n\
          this.$el.on(eventName, selector, method);\n\
        }\n\
      }\n\
      return this;\n\
    },\n\
\n\
    // Clears all callbacks previously bound to the view with `delegateEvents`.\n\
    // You usually don't need to use this, but may wish to if you have multiple\n\
    // Backbone views attached to the same DOM element.\n\
    undelegateEvents: function() {\n\
      this.$el.off('.delegateEvents' + this.cid);\n\
      return this;\n\
    },\n\
\n\
    // Ensure that the View has a DOM element to render into.\n\
    // If `this.el` is a string, pass it through `$()`, take the first\n\
    // matching element, and re-assign it to `el`. Otherwise, create\n\
    // an element from the `id`, `className` and `tagName` properties.\n\
    _ensureElement: function() {\n\
      if (!this.el) {\n\
        var attrs = _.extend({}, _.result(this, 'attributes'));\n\
        if (this.id) attrs.id = _.result(this, 'id');\n\
        if (this.className) attrs['class'] = _.result(this, 'className');\n\
        var $el = Backbone.$('<' + _.result(this, 'tagName') + '>').attr(attrs);\n\
        this.setElement($el, false);\n\
      } else {\n\
        this.setElement(_.result(this, 'el'), false);\n\
      }\n\
    }\n\
\n\
  });\n\
\n\
  // Backbone.sync\n\
  // -------------\n\
\n\
  // Override this function to change the manner in which Backbone persists\n\
  // models to the server. You will be passed the type of request, and the\n\
  // model in question. By default, makes a RESTful Ajax request\n\
  // to the model's `url()`. Some possible customizations could be:\n\
  //\n\
  // * Use `setTimeout` to batch rapid-fire updates into a single request.\n\
  // * Send up the models as XML instead of JSON.\n\
  // * Persist models via WebSockets instead of Ajax.\n\
  //\n\
  // Turn on `Backbone.emulateHTTP` in order to send `PUT` and `DELETE` requests\n\
  // as `POST`, with a `_method` parameter containing the true HTTP method,\n\
  // as well as all requests with the body as `application/x-www-form-urlencoded`\n\
  // instead of `application/json` with the model in a param named `model`.\n\
  // Useful when interfacing with server-side languages like **PHP** that make\n\
  // it difficult to read the body of `PUT` requests.\n\
  Backbone.sync = function(method, model, options) {\n\
    var type = methodMap[method];\n\
\n\
    // Default options, unless specified.\n\
    _.defaults(options || (options = {}), {\n\
      emulateHTTP: Backbone.emulateHTTP,\n\
      emulateJSON: Backbone.emulateJSON\n\
    });\n\
\n\
    // Default JSON-request options.\n\
    var params = {type: type, dataType: 'json'};\n\
\n\
    // Ensure that we have a URL.\n\
    if (!options.url) {\n\
      params.url = _.result(model, 'url') || urlError();\n\
    }\n\
\n\
    // Ensure that we have the appropriate request data.\n\
    if (options.data == null && model && (method === 'create' || method === 'update' || method === 'patch')) {\n\
      params.contentType = 'application/json';\n\
      params.data = JSON.stringify(options.attrs || model.toJSON(options));\n\
    }\n\
\n\
    // For older servers, emulate JSON by encoding the request into an HTML-form.\n\
    if (options.emulateJSON) {\n\
      params.contentType = 'application/x-www-form-urlencoded';\n\
      params.data = params.data ? {model: params.data} : {};\n\
    }\n\
\n\
    // For older servers, emulate HTTP by mimicking the HTTP method with `_method`\n\
    // And an `X-HTTP-Method-Override` header.\n\
    if (options.emulateHTTP && (type === 'PUT' || type === 'DELETE' || type === 'PATCH')) {\n\
      params.type = 'POST';\n\
      if (options.emulateJSON) params.data._method = type;\n\
      var beforeSend = options.beforeSend;\n\
      options.beforeSend = function(xhr) {\n\
        xhr.setRequestHeader('X-HTTP-Method-Override', type);\n\
        if (beforeSend) return beforeSend.apply(this, arguments);\n\
      };\n\
    }\n\
\n\
    // Don't process data on a non-GET request.\n\
    if (params.type !== 'GET' && !options.emulateJSON) {\n\
      params.processData = false;\n\
    }\n\
\n\
    // If we're sending a `PATCH` request, and we're in an old Internet Explorer\n\
    // that still has ActiveX enabled by default, override jQuery to use that\n\
    // for XHR instead. Remove this line when jQuery supports `PATCH` on IE8.\n\
    if (params.type === 'PATCH' && noXhrPatch) {\n\
      params.xhr = function() {\n\
        return new ActiveXObject(\"Microsoft.XMLHTTP\");\n\
      };\n\
    }\n\
\n\
    // Make the request, allowing the user to override any Ajax options.\n\
    var xhr = options.xhr = Backbone.ajax(_.extend(params, options));\n\
    model.trigger('request', model, xhr, options);\n\
    return xhr;\n\
  };\n\
\n\
  var noXhrPatch =\n\
    typeof window !== 'undefined' && !!window.ActiveXObject &&\n\
      !(window.XMLHttpRequest && (new XMLHttpRequest).dispatchEvent);\n\
\n\
  // Map from CRUD to HTTP for our default `Backbone.sync` implementation.\n\
  var methodMap = {\n\
    'create': 'POST',\n\
    'update': 'PUT',\n\
    'patch':  'PATCH',\n\
    'delete': 'DELETE',\n\
    'read':   'GET'\n\
  };\n\
\n\
  // Set the default implementation of `Backbone.ajax` to proxy through to `$`.\n\
  // Override this if you'd like to use a different library.\n\
  Backbone.ajax = function() {\n\
    return Backbone.$.ajax.apply(Backbone.$, arguments);\n\
  };\n\
\n\
  // Backbone.Router\n\
  // ---------------\n\
\n\
  // Routers map faux-URLs to actions, and fire events when routes are\n\
  // matched. Creating a new one sets its `routes` hash, if not set statically.\n\
  var Router = Backbone.Router = function(options) {\n\
    options || (options = {});\n\
    if (options.routes) this.routes = options.routes;\n\
    this._bindRoutes();\n\
    this.initialize.apply(this, arguments);\n\
  };\n\
\n\
  // Cached regular expressions for matching named param parts and splatted\n\
  // parts of route strings.\n\
  var optionalParam = /\\((.*?)\\)/g;\n\
  var namedParam    = /(\\(\\?)?:\\w+/g;\n\
  var splatParam    = /\\*\\w+/g;\n\
  var escapeRegExp  = /[\\-{}\\[\\]+?.,\\\\\\^$|#\\s]/g;\n\
\n\
  // Set up all inheritable **Backbone.Router** properties and methods.\n\
  _.extend(Router.prototype, Events, {\n\
\n\
    // Initialize is an empty function by default. Override it with your own\n\
    // initialization logic.\n\
    initialize: function(){},\n\
\n\
    // Manually bind a single named route to a callback. For example:\n\
    //\n\
    //     this.route('search/:query/p:num', 'search', function(query, num) {\n\
    //       ...\n\
    //     });\n\
    //\n\
    route: function(route, name, callback) {\n\
      if (!_.isRegExp(route)) route = this._routeToRegExp(route);\n\
      if (_.isFunction(name)) {\n\
        callback = name;\n\
        name = '';\n\
      }\n\
      if (!callback) callback = this[name];\n\
      var router = this;\n\
      Backbone.history.route(route, function(fragment) {\n\
        var args = router._extractParameters(route, fragment);\n\
        router.execute(callback, args);\n\
        router.trigger.apply(router, ['route:' + name].concat(args));\n\
        router.trigger('route', name, args);\n\
        Backbone.history.trigger('route', router, name, args);\n\
      });\n\
      return this;\n\
    },\n\
\n\
    // Execute a route handler with the provided parameters.  This is an\n\
    // excellent place to do pre-route setup or post-route cleanup.\n\
    execute: function(callback, args) {\n\
      if (callback) callback.apply(this, args);\n\
    },\n\
\n\
    // Simple proxy to `Backbone.history` to save a fragment into the history.\n\
    navigate: function(fragment, options) {\n\
      Backbone.history.navigate(fragment, options);\n\
      return this;\n\
    },\n\
\n\
    // Bind all defined routes to `Backbone.history`. We have to reverse the\n\
    // order of the routes here to support behavior where the most general\n\
    // routes can be defined at the bottom of the route map.\n\
    _bindRoutes: function() {\n\
      if (!this.routes) return;\n\
      this.routes = _.result(this, 'routes');\n\
      var route, routes = _.keys(this.routes);\n\
      while ((route = routes.pop()) != null) {\n\
        this.route(route, this.routes[route]);\n\
      }\n\
    },\n\
\n\
    // Convert a route string into a regular expression, suitable for matching\n\
    // against the current location hash.\n\
    _routeToRegExp: function(route) {\n\
      route = route.replace(escapeRegExp, '\\\\$&')\n\
                   .replace(optionalParam, '(?:$1)?')\n\
                   .replace(namedParam, function(match, optional) {\n\
                     return optional ? match : '([^/?]+)';\n\
                   })\n\
                   .replace(splatParam, '([^?]*?)');\n\
      return new RegExp('^' + route + '(?:\\\\?([\\\\s\\\\S]*))?$');\n\
    },\n\
\n\
    // Given a route, and a URL fragment that it matches, return the array of\n\
    // extracted decoded parameters. Empty or unmatched parameters will be\n\
    // treated as `null` to normalize cross-browser behavior.\n\
    _extractParameters: function(route, fragment) {\n\
      var params = route.exec(fragment).slice(1);\n\
      return _.map(params, function(param, i) {\n\
        // Don't decode the search params.\n\
        if (i === params.length - 1) return param || null;\n\
        return param ? decodeURIComponent(param) : null;\n\
      });\n\
    }\n\
\n\
  });\n\
\n\
  // Backbone.History\n\
  // ----------------\n\
\n\
  // Handles cross-browser history management, based on either\n\
  // [pushState](http://diveintohtml5.info/history.html) and real URLs, or\n\
  // [onhashchange](https://developer.mozilla.org/en-US/docs/DOM/window.onhashchange)\n\
  // and URL fragments. If the browser supports neither (old IE, natch),\n\
  // falls back to polling.\n\
  var History = Backbone.History = function() {\n\
    this.handlers = [];\n\
    _.bindAll(this, 'checkUrl');\n\
\n\
    // Ensure that `History` can be used outside of the browser.\n\
    if (typeof window !== 'undefined') {\n\
      this.location = window.location;\n\
      this.history = window.history;\n\
    }\n\
  };\n\
\n\
  // Cached regex for stripping a leading hash/slash and trailing space.\n\
  var routeStripper = /^[#\\/]|\\s+$/g;\n\
\n\
  // Cached regex for stripping leading and trailing slashes.\n\
  var rootStripper = /^\\/+|\\/+$/g;\n\
\n\
  // Cached regex for detecting MSIE.\n\
  var isExplorer = /msie [\\w.]+/;\n\
\n\
  // Cached regex for removing a trailing slash.\n\
  var trailingSlash = /\\/$/;\n\
\n\
  // Cached regex for stripping urls of hash.\n\
  var pathStripper = /#.*$/;\n\
\n\
  // Has the history handling already been started?\n\
  History.started = false;\n\
\n\
  // Set up all inheritable **Backbone.History** properties and methods.\n\
  _.extend(History.prototype, Events, {\n\
\n\
    // The default interval to poll for hash changes, if necessary, is\n\
    // twenty times a second.\n\
    interval: 50,\n\
\n\
    // Are we at the app root?\n\
    atRoot: function() {\n\
      return this.location.pathname.replace(/[^\\/]$/, '$&/') === this.root;\n\
    },\n\
\n\
    // Gets the true hash value. Cannot use location.hash directly due to bug\n\
    // in Firefox where location.hash will always be decoded.\n\
    getHash: function(window) {\n\
      var match = (window || this).location.href.match(/#(.*)$/);\n\
      return match ? match[1] : '';\n\
    },\n\
\n\
    // Get the cross-browser normalized URL fragment, either from the URL,\n\
    // the hash, or the override.\n\
    getFragment: function(fragment, forcePushState) {\n\
      if (fragment == null) {\n\
        if (this._hasPushState || !this._wantsHashChange || forcePushState) {\n\
          fragment = decodeURI(this.location.pathname + this.location.search);\n\
          var root = this.root.replace(trailingSlash, '');\n\
          if (!fragment.indexOf(root)) fragment = fragment.slice(root.length);\n\
        } else {\n\
          fragment = this.getHash();\n\
        }\n\
      }\n\
      return fragment.replace(routeStripper, '');\n\
    },\n\
\n\
    // Start the hash change handling, returning `true` if the current URL matches\n\
    // an existing route, and `false` otherwise.\n\
    start: function(options) {\n\
      if (History.started) throw new Error(\"Backbone.history has already been started\");\n\
      History.started = true;\n\
\n\
      // Figure out the initial configuration. Do we need an iframe?\n\
      // Is pushState desired ... is it available?\n\
      this.options          = _.extend({root: '/'}, this.options, options);\n\
      this.root             = this.options.root;\n\
      this._wantsHashChange = this.options.hashChange !== false;\n\
      this._wantsPushState  = !!this.options.pushState;\n\
      this._hasPushState    = !!(this.options.pushState && this.history && this.history.pushState);\n\
      var fragment          = this.getFragment();\n\
      var docMode           = document.documentMode;\n\
      var oldIE             = (isExplorer.exec(navigator.userAgent.toLowerCase()) && (!docMode || docMode <= 7));\n\
\n\
      // Normalize root to always include a leading and trailing slash.\n\
      this.root = ('/' + this.root + '/').replace(rootStripper, '/');\n\
\n\
      if (oldIE && this._wantsHashChange) {\n\
        var frame = Backbone.$('<iframe src=\"javascript:0\" tabindex=\"-1\">');\n\
        this.iframe = frame.hide().appendTo('body')[0].contentWindow;\n\
        this.navigate(fragment);\n\
      }\n\
\n\
      // Depending on whether we're using pushState or hashes, and whether\n\
      // 'onhashchange' is supported, determine how we check the URL state.\n\
      if (this._hasPushState) {\n\
        Backbone.$(window).on('popstate', this.checkUrl);\n\
      } else if (this._wantsHashChange && ('onhashchange' in window) && !oldIE) {\n\
        Backbone.$(window).on('hashchange', this.checkUrl);\n\
      } else if (this._wantsHashChange) {\n\
        this._checkUrlInterval = setInterval(this.checkUrl, this.interval);\n\
      }\n\
\n\
      // Determine if we need to change the base url, for a pushState link\n\
      // opened by a non-pushState browser.\n\
      this.fragment = fragment;\n\
      var loc = this.location;\n\
\n\
      // Transition from hashChange to pushState or vice versa if both are\n\
      // requested.\n\
      if (this._wantsHashChange && this._wantsPushState) {\n\
\n\
        // If we've started off with a route from a `pushState`-enabled\n\
        // browser, but we're currently in a browser that doesn't support it...\n\
        if (!this._hasPushState && !this.atRoot()) {\n\
          this.fragment = this.getFragment(null, true);\n\
          this.location.replace(this.root + '#' + this.fragment);\n\
          // Return immediately as browser will do redirect to new url\n\
          return true;\n\
\n\
        // Or if we've started out with a hash-based route, but we're currently\n\
        // in a browser where it could be `pushState`-based instead...\n\
        } else if (this._hasPushState && this.atRoot() && loc.hash) {\n\
          this.fragment = this.getHash().replace(routeStripper, '');\n\
          this.history.replaceState({}, document.title, this.root + this.fragment);\n\
        }\n\
\n\
      }\n\
\n\
      if (!this.options.silent) return this.loadUrl();\n\
    },\n\
\n\
    // Disable Backbone.history, perhaps temporarily. Not useful in a real app,\n\
    // but possibly useful for unit testing Routers.\n\
    stop: function() {\n\
      Backbone.$(window).off('popstate', this.checkUrl).off('hashchange', this.checkUrl);\n\
      if (this._checkUrlInterval) clearInterval(this._checkUrlInterval);\n\
      History.started = false;\n\
    },\n\
\n\
    // Add a route to be tested when the fragment changes. Routes added later\n\
    // may override previous routes.\n\
    route: function(route, callback) {\n\
      this.handlers.unshift({route: route, callback: callback});\n\
    },\n\
\n\
    // Checks the current URL to see if it has changed, and if it has,\n\
    // calls `loadUrl`, normalizing across the hidden iframe.\n\
    checkUrl: function(e) {\n\
      var current = this.getFragment();\n\
      if (current === this.fragment && this.iframe) {\n\
        current = this.getFragment(this.getHash(this.iframe));\n\
      }\n\
      if (current === this.fragment) return false;\n\
      if (this.iframe) this.navigate(current);\n\
      this.loadUrl();\n\
    },\n\
\n\
    // Attempt to load the current URL fragment. If a route succeeds with a\n\
    // match, returns `true`. If no defined routes matches the fragment,\n\
    // returns `false`.\n\
    loadUrl: function(fragment) {\n\
      fragment = this.fragment = this.getFragment(fragment);\n\
      return _.any(this.handlers, function(handler) {\n\
        if (handler.route.test(fragment)) {\n\
          handler.callback(fragment);\n\
          return true;\n\
        }\n\
      });\n\
    },\n\
\n\
    // Save a fragment into the hash history, or replace the URL state if the\n\
    // 'replace' option is passed. You are responsible for properly URL-encoding\n\
    // the fragment in advance.\n\
    //\n\
    // The options object can contain `trigger: true` if you wish to have the\n\
    // route callback be fired (not usually desirable), or `replace: true`, if\n\
    // you wish to modify the current URL without adding an entry to the history.\n\
    navigate: function(fragment, options) {\n\
      if (!History.started) return false;\n\
      if (!options || options === true) options = {trigger: !!options};\n\
\n\
      var url = this.root + (fragment = this.getFragment(fragment || ''));\n\
\n\
      // Strip the hash for matching.\n\
      fragment = fragment.replace(pathStripper, '');\n\
\n\
      if (this.fragment === fragment) return;\n\
      this.fragment = fragment;\n\
\n\
      // Don't include a trailing slash on the root.\n\
      if (fragment === '' && url !== '/') url = url.slice(0, -1);\n\
\n\
      // If pushState is available, we use it to set the fragment as a real URL.\n\
      if (this._hasPushState) {\n\
        this.history[options.replace ? 'replaceState' : 'pushState']({}, document.title, url);\n\
\n\
      // If hash changes haven't been explicitly disabled, update the hash\n\
      // fragment to store history.\n\
      } else if (this._wantsHashChange) {\n\
        this._updateHash(this.location, fragment, options.replace);\n\
        if (this.iframe && (fragment !== this.getFragment(this.getHash(this.iframe)))) {\n\
          // Opening and closing the iframe tricks IE7 and earlier to push a\n\
          // history entry on hash-tag change.  When replace is true, we don't\n\
          // want this.\n\
          if(!options.replace) this.iframe.document.open().close();\n\
          this._updateHash(this.iframe.location, fragment, options.replace);\n\
        }\n\
\n\
      // If you've told us that you explicitly don't want fallback hashchange-\n\
      // based history, then `navigate` becomes a page refresh.\n\
      } else {\n\
        return this.location.assign(url);\n\
      }\n\
      if (options.trigger) return this.loadUrl(fragment);\n\
    },\n\
\n\
    // Update the hash location, either replacing the current entry, or adding\n\
    // a new one to the browser history.\n\
    _updateHash: function(location, fragment, replace) {\n\
      if (replace) {\n\
        var href = location.href.replace(/(javascript:|#).*$/, '');\n\
        location.replace(href + '#' + fragment);\n\
      } else {\n\
        // Some browsers require that `hash` contains a leading #.\n\
        location.hash = '#' + fragment;\n\
      }\n\
    }\n\
\n\
  });\n\
\n\
  // Create the default Backbone.history.\n\
  Backbone.history = new History;\n\
\n\
  // Helpers\n\
  // -------\n\
\n\
  // Helper function to correctly set up the prototype chain, for subclasses.\n\
  // Similar to `goog.inherits`, but uses a hash of prototype properties and\n\
  // class properties to be extended.\n\
  var extend = function(protoProps, staticProps) {\n\
    var parent = this;\n\
    var child;\n\
\n\
    // The constructor function for the new subclass is either defined by you\n\
    // (the \"constructor\" property in your `extend` definition), or defaulted\n\
    // by us to simply call the parent's constructor.\n\
    if (protoProps && _.has(protoProps, 'constructor')) {\n\
      child = protoProps.constructor;\n\
    } else {\n\
      child = function(){ return parent.apply(this, arguments); };\n\
    }\n\
\n\
    // Add static properties to the constructor function, if supplied.\n\
    _.extend(child, parent, staticProps);\n\
\n\
    // Set the prototype chain to inherit from `parent`, without calling\n\
    // `parent`'s constructor function.\n\
    var Surrogate = function(){ this.constructor = child; };\n\
    Surrogate.prototype = parent.prototype;\n\
    child.prototype = new Surrogate;\n\
\n\
    // Add prototype properties (instance properties) to the subclass,\n\
    // if supplied.\n\
    if (protoProps) _.extend(child.prototype, protoProps);\n\
\n\
    // Set a convenience property in case the parent's prototype is needed\n\
    // later.\n\
    child.__super__ = parent.prototype;\n\
\n\
    return child;\n\
  };\n\
\n\
  // Set up inheritance for the model, collection, router, view and history.\n\
  Model.extend = Collection.extend = Router.extend = View.extend = History.extend = extend;\n\
\n\
  // Throw an error when a URL is needed, and none is supplied.\n\
  var urlError = function() {\n\
    throw new Error('A \"url\" property or function must be specified');\n\
  };\n\
\n\
  // Wrap an optional error callback with a fallback error event.\n\
  var wrapError = function(model, options) {\n\
    var error = options.error;\n\
    options.error = function(resp) {\n\
      if (error) error(model, resp, options);\n\
      model.trigger('error', model, resp, options);\n\
    };\n\
  };\n\
\n\
  return Backbone;\n\
\n\
}));\n\
\n\
//# sourceURL=components/jashkenas/backbone/1.1.2/backbone.js"
));

require.modules["jashkenas-backbone"] = require.modules["jashkenas~backbone@1.1.2"];
require.modules["jashkenas~backbone"] = require.modules["jashkenas~backbone@1.1.2"];
require.modules["backbone"] = require.modules["jashkenas~backbone@1.1.2"];


require.register("learnboost~jsonp@0.0.4", Function("exports, module",
"/**\n\
 * Module dependencies\n\
 */\n\
\n\
var debug = require(\"visionmedia~debug@0.8.1\")('jsonp');\n\
\n\
/**\n\
 * Module exports.\n\
 */\n\
\n\
module.exports = jsonp;\n\
\n\
/**\n\
 * Callback index.\n\
 */\n\
\n\
var count = 0;\n\
\n\
/**\n\
 * Noop function.\n\
 */\n\
\n\
function noop(){}\n\
\n\
/**\n\
 * JSONP handler\n\
 *\n\
 * Options:\n\
 *  - param {String} qs parameter (`callback`)\n\
 *  - timeout {Number} how long after a timeout error is emitted (`60000`)\n\
 *\n\
 * @param {String} url\n\
 * @param {Object|Function} optional options / callback\n\
 * @param {Function} optional callback\n\
 */\n\
\n\
function jsonp(url, opts, fn){\n\
  if ('function' == typeof opts) {\n\
    fn = opts;\n\
    opts = {};\n\
  }\n\
  if (!opts) opts = {};\n\
\n\
  var prefix = opts.prefix || '__jp';\n\
  var param = opts.param || 'callback';\n\
  var timeout = null != opts.timeout ? opts.timeout : 60000;\n\
  var enc = encodeURIComponent;\n\
  var target = document.getElementsByTagName('script')[0] || document.head;\n\
  var script;\n\
  var timer;\n\
\n\
  // generate a unique id for this request\n\
  var id = prefix + (count++);\n\
\n\
  if (timeout) {\n\
    timer = setTimeout(function(){\n\
      cleanup();\n\
      if (fn) fn(new Error('Timeout'));\n\
    }, timeout);\n\
  }\n\
\n\
  function cleanup(){\n\
    script.parentNode.removeChild(script);\n\
    window[id] = noop;\n\
  }\n\
\n\
  window[id] = function(data){\n\
    debug('jsonp got', data);\n\
    if (timer) clearTimeout(timer);\n\
    cleanup();\n\
    if (fn) fn(null, data);\n\
  };\n\
\n\
  // add qs component\n\
  url += (~url.indexOf('?') ? '&' : '?') + param + '=' + enc(id);\n\
  url = url.replace('?&', '?');\n\
\n\
  debug('jsonp req \"%s\"', url);\n\
\n\
  // create script\n\
  script = document.createElement('script');\n\
  script.src = url;\n\
  target.parentNode.insertBefore(script, target);\n\
}\n\
\n\
//# sourceURL=components/learnboost/jsonp/0.0.4/index.js"
));

require.modules["learnboost-jsonp"] = require.modules["learnboost~jsonp@0.0.4"];
require.modules["learnboost~jsonp"] = require.modules["learnboost~jsonp@0.0.4"];
require.modules["jsonp"] = require.modules["learnboost~jsonp@0.0.4"];


require.register("conveyal~otpprofiler.js@0.1.0", Function("exports, module",
"module.exports.models = require(\"conveyal~otpprofiler.js@0.1.0/lib/models.js\");\n\
\n\
module.exports.transitive = require(\"conveyal~otpprofiler.js@0.1.0/lib/transitive.js\");\n\
\n\
//# sourceURL=components/conveyal/otpprofiler.js/0.1.0/lib/index.js"
));

require.register("conveyal~otpprofiler.js@0.1.0/lib/models.js", Function("exports, module",
"/**\n\
 * Dependencies\n\
 */\n\
\n\
var Backbone = require(\"jashkenas~backbone@1.1.2\");\n\
var jsonp = require(\"learnboost~jsonp@0.0.4\");\n\
var querystring = require(\"component~querystring@1.3.0\");\n\
var _ = require(\"jashkenas~underscore@1.6.0\");\n\
\n\
module.exports.OtpProfileRequest = Backbone.Model.extend({\n\
\n\
  initialize: function(opts) {\n\
\n\
    _.bindAll(this, 'request', 'processRequest');\n\
\n\
    this.on('change', this.request);\n\
\n\
  },\n\
\n\
  defaults: {\n\
    from: null,\n\
    to: null,\n\
  },\n\
\n\
  request: function() {\n\
\n\
    var m = this;\n\
\n\
    // don't make incomplete requests\n\
    if (!this.attributes.from || !this.attributes.to)\n\
      return false;\n\
\n\
    request(this.urlRoot, this.attributes, function(err, data) {\n\
      m.trigger((err ? 'failure' : 'success'), m.processRequest(data));\n\
    });\n\
  },\n\
\n\
  processRequest: function(data) {\n\
\n\
    var response = new module.exports.OtpProfileResponse(data);\n\
\n\
    response.set('request', this);\n\
\n\
    return response;\n\
\n\
  }\n\
});\n\
\n\
module.exports.OtpProfileResponse = Backbone.Model.extend({\n\
\n\
  initialize: function(opts) {\n\
\n\
    var rawAttributes = arguments[0];\n\
\n\
    if (rawAttributes) {\n\
\n\
      var processedAttributes = _.omit(rawAttributes, ['options']);\n\
\n\
      processedAttributes.options = new module.exports.OtpProfileOptions();\n\
      processedAttributes.options.add(rawAttributes.options);\n\
\n\
      this.set(processedAttributes);\n\
\n\
    }\n\
\n\
  },\n\
\n\
  defaults: {\n\
    request: null,\n\
    options: []\n\
  }\n\
\n\
});\n\
\n\
module.exports.OtpProfileOption = Backbone.Model.extend({\n\
\n\
  initialize: function(opts) {\n\
\n\
    var rawAttributes = arguments[0];\n\
    var processedAttributes = _.omit(rawAttributes, ['segments']);\n\
\n\
    processedAttributes.segments = new module.exports.OtpProfileOptionSegments();\n\
    processedAttributes.segments.add(rawAttributes.segments);\n\
\n\
    this.set(processedAttributes);\n\
\n\
  },\n\
\n\
  defaults: {\n\
    finalWalkTime: null,\n\
    stats: null,\n\
    summary: null,\n\
    segments: []\n\
  },\n\
\n\
  getPatternIds: function(maxPerSegment) {\n\
    var patternIds = [];\n\
\n\
    _.each(this.get('segments').models, function(segment) {\n\
      var segmentPatternIds = segment.getPatternIds(maxPerSegment);\n\
      for (var i = 0; i < segmentPatternIds.length; i++) {\n\
        var patternId = segmentPatternIds[i];\n\
        if (!_.contains(patternIds, patternId)) patternIds.push(patternId);\n\
      }\n\
    });\n\
\n\
    return patternIds;\n\
  }\n\
\n\
});\n\
\n\
module.exports.OtpProfileOptions = Backbone.Collection.extend({\n\
\n\
  type: 'OtpProfileOptions',\n\
  model: module.exports.OtpProfileOption,\n\
\n\
  initialize: function() {},\n\
\n\
});\n\
\n\
module.exports.OtpProfileOptionSegment = Backbone.Model.extend({\n\
\n\
  initialize: function(opts) {\n\
\n\
    var rawAttributes = arguments[0];\n\
    var processedAttributes = _.omit(rawAttributes, ['segmentPatterns']);\n\
\n\
    processedAttributes.segmentPatterns = new module.exports.OtpProfileOptionSegmentPatterns();\n\
    processedAttributes.segmentPatterns.add(rawAttributes.segmentPatterns);\n\
\n\
    this.set(processedAttributes);\n\
\n\
  },\n\
\n\
  defaults: {\n\
    from: null,\n\
    fromName: null,\n\
    rideStats: null,\n\
    route: null,\n\
    routeLongName: null,\n\
    routeShortName: null,\n\
    segmentPatterns: [],\n\
    to: null,\n\
    toName: null,\n\
    waitStats: null,\n\
    walkTime: null\n\
  },\n\
\n\
  getPatternIds: function(max) {\n\
    var patternIds = [];\n\
    _.each(this.get('segmentPatterns').models, function(pattern, i) {\n\
      if (max && i >= max) return;\n\
      patternIds.push(pattern.get('patternId'));\n\
    });\n\
\n\
    return patternIds;\n\
  }\n\
\n\
});\n\
\n\
module.exports.OtpProfileOptionSegments = Backbone.Collection.extend({\n\
\n\
  type: 'OtpProfileOptionSegments',\n\
  model: module.exports.OtpProfileOptionSegment,\n\
\n\
  initialize: function() {},\n\
\n\
});\n\
\n\
module.exports.OtpProfileOptionSegmentPattern = Backbone.Model.extend({\n\
\n\
  initialize: function(opts) {\n\
\n\
    var rawAttributes = arguments[0];\n\
    this.set(rawAttributes);\n\
\n\
  },\n\
\n\
  defaults: {\n\
    fromIndex: null,\n\
    nTrips: null,\n\
    patternId: null,\n\
    toIndex: null,\n\
  }\n\
\n\
});\n\
\n\
module.exports.OtpProfileOptionSegmentPatterns = Backbone.Collection.extend({\n\
\n\
  type: 'OtpProfileOptionSegments',\n\
  model: module.exports.OtpProfileOptionSegmentPattern,\n\
\n\
  initialize: function() {},\n\
\n\
});\n\
\n\
/** index models **/\n\
\n\
module.exports.OtpIndexPatternRequest = Backbone.Model.extend({\n\
\n\
  initialize: function(opts) {\n\
\n\
    _.bindAll(this, 'request', 'processRequest');\n\
\n\
    this.on('change', this.request);\n\
\n\
  },\n\
\n\
  defaults: {\n\
    from: null,\n\
    to: null,\n\
  },\n\
\n\
  request: function() {\n\
    var m = this;\n\
\n\
    request(this.urlRoot, this.attributes, function(err, data) {\n\
      m.trigger((err ? 'failure' : 'success'), m.processRequest(data));\n\
    });\n\
  },\n\
\n\
  processRequest: function(data) {\n\
\n\
    var response = new module.exports.OtpIndexPattern(data);\n\
\n\
    response.set('request', this);\n\
\n\
    return response;\n\
  }\n\
});\n\
\n\
module.exports.OtpIndexPattern = Backbone.Model.extend({\n\
\n\
  initialize: function(opts) {\n\
\n\
    var rawAttributes = arguments[0];\n\
    var processedAttributes = _.omit(rawAttributes, ['stops', 'trips']);\n\
\n\
    processedAttributes.stops = new module.exports.OtpIndexStops();\n\
    processedAttributes.stops.add(rawAttributes.stops);\n\
\n\
    processedAttributes.trips = new module.exports.OtpIndexTrips();\n\
    processedAttributes.trips.add(rawAttributes.trips);\n\
\n\
    this.set(processedAttributes);\n\
\n\
  },\n\
\n\
  defaults: {\n\
    desc: null,\n\
    id: null,\n\
    routeId: null,\n\
    stops: [],\n\
    trips: []\n\
  }\n\
\n\
});\n\
\n\
module.exports.OtpIndexStop = Backbone.Model.extend({\n\
\n\
  initialize: function(opts) {\n\
\n\
    var rawAttributes = arguments[0];\n\
    this.set(rawAttributes);\n\
\n\
  },\n\
\n\
  defaults: {\n\
    agency: null,\n\
    id: null,\n\
    lat: null,\n\
    lon: null,\n\
    name: null\n\
  }\n\
\n\
});\n\
\n\
module.exports.OtpIndexStops = Backbone.Collection.extend({\n\
\n\
  type: 'OtpIndexStops',\n\
  model: module.exports.OtpIndexStop,\n\
\n\
  initialize: function() {}\n\
\n\
});\n\
\n\
module.exports.OtpIndexTrip = Backbone.Model.extend({\n\
\n\
  initialize: function(opts) {\n\
\n\
    var rawAttributes = arguments[0];\n\
    this.set(rawAttributes);\n\
\n\
  },\n\
\n\
  defaults: {\n\
    agency: null,\n\
    direction: null,\n\
    id: null,\n\
    serviceId: null,\n\
    shapeId: null,\n\
    tripHeadsign: null,\n\
  }\n\
\n\
});\n\
\n\
module.exports.OtpIndexTrips = Backbone.Collection.extend({\n\
\n\
  type: 'OtpIndexTrips',\n\
  model: module.exports.OtpIndexTrip,\n\
\n\
  initialize: function() {}\n\
\n\
});\n\
\n\
/**\n\
 * Make a `jsonp` request with `data`\n\
 */\n\
\n\
function request(url, data, callback) {\n\
  jsonp(url + '?' + querystring.stringify(data), callback);\n\
}\n\
\n\
//# sourceURL=components/conveyal/otpprofiler.js/0.1.0/lib/models.js"
));

require.register("conveyal~otpprofiler.js@0.1.0/lib/transitive.js", Function("exports, module",
"var _ = require(\"jashkenas~underscore@1.6.0\");\n\
\n\
var OtpProfiler = {};\n\
OtpProfiler.models = require(\"conveyal~otpprofiler.js@0.1.0/lib/models.js\");\n\
\n\
/**\n\
 * Expose `TransitiveLoader`\n\
 */\n\
\n\
module.exports.TransitiveLoader = TransitiveLoader;\n\
\n\
/**\n\
 *\n\
 */\n\
\n\
function TransitiveLoader(profileResponse, endpoint, callback, config) {\n\
\n\
  this.callback = callback;\n\
  this.endpoint = endpoint;\n\
  this.config = config || {};\n\
\n\
  this.options = [];\n\
  this.patterns = {};\n\
  this.stops = {};\n\
\n\
  // construct the list of patterns to load\n\
  _.each(profileResponse.get('options').models, function(optionModel, i) {\n\
    if (this.config.maxOptions && i >= this.config.maxOptions) return;\n\
\n\
    optionModel.getPatternIds(1).forEach(function(patternId) {\n\
      this.patterns[patternId] = null;\n\
    }, this);\n\
\n\
    this.options.push(optionModel);\n\
  }, this);\n\
\n\
  this.patternsLoaded = 0;\n\
  for (var patternId in this.patterns) {\n\
    this.loadPattern(patternId);\n\
  }\n\
\n\
}\n\
\n\
TransitiveLoader.prototype.loadPattern = function(patternId) {\n\
\n\
  var patternRequest = new OtpProfiler.models.OtpIndexPatternRequest();\n\
  patternRequest.urlRoot = this.endpoint + 'index/patterns/' + patternId;\n\
\n\
  patternRequest.on('success', _.bind(function(patternModel) {\n\
\n\
    this.patterns[patternId] = patternModel;\n\
\n\
    this.patternsLoaded++;\n\
    if (this.patternsLoaded === Object.keys(this.patterns).length) {\n\
      this.allPatternsLoaded();\n\
    }\n\
  }, this));\n\
  patternRequest.request();\n\
\n\
};\n\
\n\
TransitiveLoader.prototype.allPatternsLoaded = function() {\n\
\n\
  // initialize the stop key/value store\n\
  for (var patternId in this.patterns) {\n\
    var pattern = this.patterns[patternId];\n\
\n\
    for (var i = 0; i < pattern.get('stops').length; i++) {\n\
      var stop = pattern.get('stops').at(i);\n\
      if (this.stops.hasOwnProperty(stop.get('id'))) continue;\n\
      this.stops[stop.get('id')] = stop;\n\
    }\n\
  }\n\
\n\
  this.callback.call(this, this.getTransitiveData());\n\
};\n\
\n\
TransitiveLoader.prototype.getTransitiveData = function() {\n\
\n\
  var data = {};\n\
\n\
  // set up the stops collection\n\
  data.stops = [];\n\
  for (var stopId in this.stops) {\n\
    var stop = this.stops[stopId];\n\
    data.stops.push({\n\
      stop_id: stopId,\n\
      stop_name: stop.get('name'),\n\
      stop_lat: stop.get('lat'),\n\
      stop_lon: stop.get('lon')\n\
    });\n\
  }\n\
\n\
  // set up the patterns collection\n\
  data.patterns = [];\n\
  _.each(this.patterns, function(patternModel, patternId) {\n\
    var patternObj = {\n\
      pattern_id: patternId,\n\
      stops: []\n\
    };\n\
\n\
    if (patternModel.has('desc')) patternObj.pattern_name = patternModel.get(\n\
      'desc');\n\
    if (patternModel.has('routeId')) patternObj.route_id = patternModel.get(\n\
      'routeId');\n\
\n\
    patternModel.get('stops').models.forEach(function(stopModel) {\n\
      patternObj.stops.push({\n\
        stop_id: stopModel.get('id')\n\
      });\n\
    });\n\
\n\
    data.patterns.push(patternObj);\n\
  });\n\
\n\
  // set up places\n\
  data.places = [];\n\
  if (this.config.fromLocation) {\n\
    data.places.push({\n\
      place_id: 'from',\n\
      place_name: this.config.fromLocation.name,\n\
      place_lat: this.config.fromLocation.lat,\n\
      place_lon: this.config.fromLocation.lon\n\
    });\n\
  }\n\
  if (this.config.toLocation) {\n\
    data.places.push({\n\
      place_id: 'to',\n\
      place_name: this.config.toLocation.name,\n\
      place_lat: this.config.toLocation.lat,\n\
      place_lon: this.config.toLocation.lon\n\
    });\n\
  }\n\
\n\
  // set up journeys\n\
  data.journeys = [];\n\
  _.each(this.options, function(optionModel, i) {\n\
    var journey = {\n\
      journey_id: 'option_' + i,\n\
      journey_name: optionModel.get('summary') || 'Option ' + (i + 1),\n\
      segments: []\n\
    };\n\
\n\
    // add the start walk segment\n\
    if (this.config.fromLocation) {\n\
      var firstPattern = optionModel.get('segments').at(0).get(\n\
        'segmentPatterns').at(0);\n\
      var boardStop = this.patterns[firstPattern.get('patternId')].get(\n\
        'stops').at(firstPattern.get('fromIndex'));\n\
      var startSegment = {\n\
        type: 'WALK',\n\
        from: {\n\
          type: 'PLACE',\n\
          place_id: 'from'\n\
        },\n\
        to: {\n\
          type: 'STOP',\n\
          stop_id: boardStop.get('id')\n\
        }\n\
      };\n\
\n\
      journey.segments.push(startSegment);\n\
    }\n\
\n\
    // iterate through the transit segments\n\
    _.each(optionModel.get('segments').models, function(segmentModel,\n\
      segmentIndex) {\n\
\n\
      // add the transit segment to the journey object\n\
      var firstPattern = segmentModel.get('segmentPatterns').at(0);\n\
      var transitSegment = {\n\
        type: 'TRANSIT',\n\
        pattern_id: firstPattern.get('patternId'),\n\
        from_stop_index: firstPattern.get('fromIndex'),\n\
        to_stop_index: firstPattern.get('toIndex')\n\
      };\n\
      journey.segments.push(transitSegment);\n\
\n\
      // do we need a walk transfer segment?\n\
      if (optionModel.get('segments').length > segmentIndex + 1) {\n\
        var alightStop = this.patterns[firstPattern.get('patternId')].get(\n\
          'stops').at(firstPattern.get('toIndex'));\n\
\n\
        var nextSegment = optionModel.get('segments').at(segmentIndex + 1);\n\
        var nextFirstPattern = nextSegment.get('segmentPatterns').at(0);\n\
        var boardStop = this.patterns[nextFirstPattern.get('patternId')].get(\n\
          'stops').at(nextFirstPattern.get('fromIndex'));\n\
\n\
        if (alightStop.get('id') !== boardStop.get('id')) {\n\
          var transferSegment = {\n\
            type: 'WALK',\n\
            from: {\n\
              type: 'STOP',\n\
              stop_id: alightStop.get('id')\n\
            },\n\
            to: {\n\
              type: 'STOP',\n\
              stop_id: boardStop.get('id')\n\
            }\n\
          };\n\
\n\
          journey.segments.push(transferSegment);\n\
        }\n\
      }\n\
    }, this);\n\
\n\
    // add the end walk segment\n\
    if (this.config.fromLocation) {\n\
      var lastPattern = optionModel.get('segments').at(optionModel.get(\n\
        'segments').length - 1).get('segmentPatterns').at(0);\n\
      var alightStop = this.patterns[lastPattern.get('patternId')].get(\n\
        'stops').at(lastPattern.get('toIndex'));\n\
\n\
      var endSegment = {\n\
        type: 'WALK',\n\
        from: {\n\
          type: 'STOP',\n\
          stop_id: alightStop.get('id')\n\
        },\n\
        to: {\n\
          type: 'PLACE',\n\
          place_id: 'to'\n\
        }\n\
      };\n\
\n\
      journey.segments.push(endSegment);\n\
    }\n\
\n\
    data.journeys.push(journey);\n\
  }, this);\n\
\n\
  return data;\n\
};\n\
\n\
//# sourceURL=components/conveyal/otpprofiler.js/0.1.0/lib/transitive.js"
));

require.modules["conveyal-otpprofiler.js"] = require.modules["conveyal~otpprofiler.js@0.1.0"];
require.modules["conveyal~otpprofiler.js"] = require.modules["conveyal~otpprofiler.js@0.1.0"];
require.modules["otpprofiler.js"] = require.modules["conveyal~otpprofiler.js@0.1.0"];


require.register("javascript~augment@v4.0.1", Function("exports, module",
"(function (global, factory) {\n\
    if (typeof define === \"function\" && define.amd) define(factory);\n\
    else if (typeof module === \"object\") module.exports = factory();\n\
    else global.augment = factory();\n\
}(this, function () {\n\
    \"use strict\";\n\
\n\
    var Factory = function () {};\n\
    var slice = Array.prototype.slice;\n\
\n\
    return function (base, body) {\n\
        var uber = Factory.prototype = typeof base === \"function\" ? base.prototype : base;\n\
        var prototype = new Factory;\n\
        body.apply(prototype, slice.call(arguments, 2).concat(uber));\n\
        if (!prototype.hasOwnProperty(\"constructor\")) return prototype;\n\
        var constructor = prototype.constructor;\n\
        constructor.prototype = prototype;\n\
        return constructor;\n\
    }\n\
}));\n\
//# sourceURL=components/javascript/augment/v4.0.1/augment.js"
));

require.modules["javascript-augment"] = require.modules["javascript~augment@v4.0.1"];
require.modules["javascript~augment"] = require.modules["javascript~augment@v4.0.1"];
require.modules["augment"] = require.modules["javascript~augment@v4.0.1"];


require.register("component~set@1.0.0", Function("exports, module",
"\n\
/**\n\
 * Expose `Set`.\n\
 */\n\
\n\
module.exports = Set;\n\
\n\
/**\n\
 * Initialize a new `Set` with optional `vals`\n\
 *\n\
 * @param {Array} vals\n\
 * @api public\n\
 */\n\
\n\
function Set(vals) {\n\
  if (!(this instanceof Set)) return new Set(vals);\n\
  this.vals = [];\n\
  if (vals) {\n\
    for (var i = 0; i < vals.length; ++i) {\n\
      this.add(vals[i]);\n\
    }\n\
  }\n\
}\n\
\n\
/**\n\
 * Add `val`.\n\
 *\n\
 * @param {Mixed} val\n\
 * @api public\n\
 */\n\
\n\
Set.prototype.add = function(val){\n\
  if (this.has(val)) return;\n\
  this.vals.push(val);\n\
};\n\
\n\
/**\n\
 * Check if this set has `val`.\n\
 *\n\
 * @param {Mixed} val\n\
 * @return {Boolean}\n\
 * @api public\n\
 */\n\
\n\
Set.prototype.has = function(val){\n\
  return !! ~this.indexOf(val);\n\
};\n\
\n\
/**\n\
 * Return the indexof `val`.\n\
 *\n\
 * @param {Mixed} val\n\
 * @return {Number}\n\
 * @api private\n\
 */\n\
\n\
Set.prototype.indexOf = function(val){\n\
  for (var i = 0, len = this.vals.length; i < len; ++i) {\n\
    var obj = this.vals[i];\n\
    if (obj.equals && obj.equals(val)) return i;\n\
    if (obj == val) return i;\n\
  }\n\
  return -1;\n\
};\n\
\n\
/**\n\
 * Iterate each member and invoke `fn(val)`.\n\
 *\n\
 * @param {Function} fn\n\
 * @return {Set}\n\
 * @api public\n\
 */\n\
\n\
Set.prototype.each = function(fn){\n\
  for (var i = 0; i < this.vals.length; ++i) {\n\
    fn(this.vals[i]);\n\
  }\n\
  return this;\n\
};\n\
\n\
/**\n\
 * Return the values as an array.\n\
 *\n\
 * @return {Array}\n\
 * @api public\n\
 */\n\
\n\
Set.prototype.values = \n\
Set.prototype.toJSON = function(){\n\
  return this.vals;\n\
};\n\
\n\
/**\n\
 * Return the set size.\n\
 *\n\
 * @return {Number}\n\
 * @api public\n\
 */\n\
\n\
Set.prototype.size = function(){\n\
  return this.vals.length;\n\
};\n\
\n\
/**\n\
 * Empty the set and return old values.\n\
 *\n\
 * @return {Array}\n\
 * @api public\n\
 */\n\
\n\
Set.prototype.clear = function(){\n\
  var old = this.vals;\n\
  this.vals = [];\n\
  return old;\n\
};\n\
\n\
/**\n\
 * Remove `val`, returning __true__ when present, otherwise __false__.\n\
 *\n\
 * @param {Mixed} val\n\
 * @return {Mixed}\n\
 * @api public\n\
 */\n\
\n\
Set.prototype.remove = function(val){\n\
  var i = this.indexOf(val);\n\
  if (~i) this.vals.splice(i, 1);\n\
  return !! ~i;\n\
};\n\
\n\
/**\n\
 * Perform a union on `set`.\n\
 *\n\
 * @param {Set} set\n\
 * @return {Set} new set\n\
 * @api public\n\
 */\n\
\n\
Set.prototype.union = function(set){\n\
  var ret = new Set;\n\
  var a = this.vals;\n\
  var b = set.vals;\n\
  for (var i = 0; i < a.length; ++i) ret.add(a[i]);\n\
  for (var i = 0; i < b.length; ++i) ret.add(b[i]);\n\
  return ret;\n\
};\n\
\n\
/**\n\
 * Perform an intersection on `set`.\n\
 *\n\
 * @param {Set} set\n\
 * @return {Set} new set\n\
 * @api public\n\
 */\n\
\n\
Set.prototype.intersect = function(set){\n\
  var ret = new Set;\n\
  var a = this.vals;\n\
  var b = set.vals;\n\
\n\
  for (var i = 0; i < a.length; ++i) {\n\
    if (set.has(a[i])) {\n\
      ret.add(a[i]);\n\
    }\n\
  }\n\
\n\
  for (var i = 0; i < b.length; ++i) {\n\
    if (this.has(b[i])) {\n\
      ret.add(b[i]);\n\
    }\n\
  }\n\
\n\
  return ret;\n\
};\n\
\n\
/**\n\
 * Check if the set is empty.\n\
 *\n\
 * @return {Boolean}\n\
 * @api public\n\
 */\n\
\n\
Set.prototype.isEmpty = function(){\n\
  return 0 == this.vals.length;\n\
};\n\
\n\
\n\
//# sourceURL=components/component/set/1.0.0/index.js"
));

require.modules["component-set"] = require.modules["component~set@1.0.0"];
require.modules["component~set"] = require.modules["component~set@1.0.0"];
require.modules["set"] = require.modules["component~set@1.0.0"];


require.register("component~query@0.0.3", Function("exports, module",
"function one(selector, el) {\n\
  return el.querySelector(selector);\n\
}\n\
\n\
exports = module.exports = function(selector, el){\n\
  el = el || document;\n\
  return one(selector, el);\n\
};\n\
\n\
exports.all = function(selector, el){\n\
  el = el || document;\n\
  return el.querySelectorAll(selector);\n\
};\n\
\n\
exports.engine = function(obj){\n\
  if (!obj.one) throw new Error('.one callback required');\n\
  if (!obj.all) throw new Error('.all callback required');\n\
  one = obj.one;\n\
  exports.all = obj.all;\n\
  return exports;\n\
};\n\
\n\
//# sourceURL=components/component/query/0.0.3/index.js"
));

require.modules["component-query"] = require.modules["component~query@0.0.3"];
require.modules["component~query"] = require.modules["component~query@0.0.3"];
require.modules["query"] = require.modules["component~query@0.0.3"];


require.register("component~matches-selector@0.1.2", Function("exports, module",
"/**\n\
 * Module dependencies.\n\
 */\n\
\n\
var query = require(\"component~query@0.0.3\");\n\
\n\
/**\n\
 * Element prototype.\n\
 */\n\
\n\
var proto = Element.prototype;\n\
\n\
/**\n\
 * Vendor function.\n\
 */\n\
\n\
var vendor = proto.matches\n\
  || proto.webkitMatchesSelector\n\
  || proto.mozMatchesSelector\n\
  || proto.msMatchesSelector\n\
  || proto.oMatchesSelector;\n\
\n\
/**\n\
 * Expose `match()`.\n\
 */\n\
\n\
module.exports = match;\n\
\n\
/**\n\
 * Match `el` to `selector`.\n\
 *\n\
 * @param {Element} el\n\
 * @param {String} selector\n\
 * @return {Boolean}\n\
 * @api public\n\
 */\n\
\n\
function match(el, selector) {\n\
  if (vendor) return vendor.call(el, selector);\n\
  var nodes = query.all(selector, el.parentNode);\n\
  for (var i = 0; i < nodes.length; ++i) {\n\
    if (nodes[i] == el) return true;\n\
  }\n\
  return false;\n\
}\n\
\n\
//# sourceURL=components/component/matches-selector/0.1.2/index.js"
));

require.modules["component-matches-selector"] = require.modules["component~matches-selector@0.1.2"];
require.modules["component~matches-selector"] = require.modules["component~matches-selector@0.1.2"];
require.modules["matches-selector"] = require.modules["component~matches-selector@0.1.2"];


require.register("yields~traverse@0.1.1", Function("exports, module",
"\n\
/**\n\
 * dependencies\n\
 */\n\
\n\
var matches = require(\"component~matches-selector@0.1.2\");\n\
\n\
/**\n\
 * Traverse with the given `el`, `selector` and `len`.\n\
 *\n\
 * @param {String} type\n\
 * @param {Element} el\n\
 * @param {String} selector\n\
 * @param {Number} len\n\
 * @return {Array}\n\
 * @api public\n\
 */\n\
\n\
module.exports = function(type, el, selector, len){\n\
  var el = el[type]\n\
    , n = len || 1\n\
    , ret = [];\n\
\n\
  if (!el) return ret;\n\
\n\
  do {\n\
    if (n == ret.length) break;\n\
    if (1 != el.nodeType) continue;\n\
    if (matches(el, selector)) ret.push(el);\n\
    if (!selector) ret.push(el);\n\
  } while (el = el[type]);\n\
\n\
  return ret;\n\
}\n\
\n\
//# sourceURL=components/yields/traverse/0.1.1/index.js"
));

require.modules["yields-traverse"] = require.modules["yields~traverse@0.1.1"];
require.modules["yields~traverse"] = require.modules["yields~traverse@0.1.1"];
require.modules["traverse"] = require.modules["yields~traverse@0.1.1"];


require.register("ianstormtaylor~previous-sibling@0.0.1", Function("exports, module",
"\n\
var traverse = require(\"yields~traverse@0.1.1\");\n\
\n\
\n\
/**\n\
 * Expose `previousSibling`.\n\
 */\n\
\n\
module.exports = previousSibling;\n\
\n\
\n\
/**\n\
 * Get the previous sibling for an `el`.\n\
 *\n\
 * @param {Element} el\n\
 * @param {String} selector (optional)\n\
 */\n\
\n\
function previousSibling (el, selector) {\n\
  el = traverse('previousSibling', el, selector)[0];\n\
  return el || null;\n\
}\n\
//# sourceURL=components/ianstormtaylor/previous-sibling/0.0.1/index.js"
));

require.modules["ianstormtaylor-previous-sibling"] = require.modules["ianstormtaylor~previous-sibling@0.0.1"];
require.modules["ianstormtaylor~previous-sibling"] = require.modules["ianstormtaylor~previous-sibling@0.0.1"];
require.modules["previous-sibling"] = require.modules["ianstormtaylor~previous-sibling@0.0.1"];


require.register("ianstormtaylor~next-sibling@0.0.1", Function("exports, module",
"\n\
var traverse = require(\"yields~traverse@0.1.1\");\n\
\n\
\n\
/**\n\
 * Expose `nextSibling`.\n\
 */\n\
\n\
module.exports = nextSibling;\n\
\n\
\n\
/**\n\
 * Get the next sibling for an `el`.\n\
 *\n\
 * @param {Element} el\n\
 * @param {String} selector (optional)\n\
 */\n\
\n\
function nextSibling (el, selector) {\n\
  el = traverse('nextSibling', el, selector)[0];\n\
  return el || null;\n\
}\n\
//# sourceURL=components/ianstormtaylor/next-sibling/0.0.1/index.js"
));

require.modules["ianstormtaylor-next-sibling"] = require.modules["ianstormtaylor~next-sibling@0.0.1"];
require.modules["ianstormtaylor~next-sibling"] = require.modules["ianstormtaylor~next-sibling@0.0.1"];
require.modules["next-sibling"] = require.modules["ianstormtaylor~next-sibling@0.0.1"];


require.register("component~debounce@0.0.3", Function("exports, module",
"/**\n\
 * Debounces a function by the given threshold.\n\
 *\n\
 * @see http://unscriptable.com/2009/03/20/debouncing-javascript-methods/\n\
 * @param {Function} function to wrap\n\
 * @param {Number} timeout in ms (`100`)\n\
 * @param {Boolean} whether to execute at the beginning (`false`)\n\
 * @api public\n\
 */\n\
\n\
module.exports = function debounce(func, threshold, execAsap){\n\
  var timeout;\n\
\n\
  return function debounced(){\n\
    var obj = this, args = arguments;\n\
\n\
    function delayed () {\n\
      if (!execAsap) {\n\
        func.apply(obj, args);\n\
      }\n\
      timeout = null;\n\
    }\n\
\n\
    if (timeout) {\n\
      clearTimeout(timeout);\n\
    } else if (execAsap) {\n\
      func.apply(obj, args);\n\
    }\n\
\n\
    timeout = setTimeout(delayed, threshold || 100);\n\
  };\n\
};\n\
\n\
//# sourceURL=components/component/debounce/0.0.3/index.js"
));

require.modules["component-debounce"] = require.modules["component~debounce@0.0.3"];
require.modules["component~debounce"] = require.modules["component~debounce@0.0.3"];
require.modules["debounce"] = require.modules["component~debounce@0.0.3"];


require.register("component~event@0.1.3", Function("exports, module",
"var bind = window.addEventListener ? 'addEventListener' : 'attachEvent',\n\
    unbind = window.removeEventListener ? 'removeEventListener' : 'detachEvent',\n\
    prefix = bind !== 'addEventListener' ? 'on' : '';\n\
\n\
/**\n\
 * Bind `el` event `type` to `fn`.\n\
 *\n\
 * @param {Element} el\n\
 * @param {String} type\n\
 * @param {Function} fn\n\
 * @param {Boolean} capture\n\
 * @return {Function}\n\
 * @api public\n\
 */\n\
\n\
exports.bind = function(el, type, fn, capture){\n\
  el[bind](prefix + type, fn, capture || false);\n\
  return fn;\n\
};\n\
\n\
/**\n\
 * Unbind `el` event `type`'s callback `fn`.\n\
 *\n\
 * @param {Element} el\n\
 * @param {String} type\n\
 * @param {Function} fn\n\
 * @param {Boolean} capture\n\
 * @return {Function}\n\
 * @api public\n\
 */\n\
\n\
exports.unbind = function(el, type, fn, capture){\n\
  el[unbind](prefix + type, fn, capture || false);\n\
  return fn;\n\
};\n\
//# sourceURL=components/component/event/0.1.3/index.js"
));

require.modules["component-event"] = require.modules["component~event@0.1.3"];
require.modules["component~event"] = require.modules["component~event@0.1.3"];
require.modules["event"] = require.modules["component~event@0.1.3"];


require.register("discore~closest@0.1.2", Function("exports, module",
"var matches = require(\"component~matches-selector@0.1.2\")\n\
\n\
module.exports = function (element, selector, checkYoSelf, root) {\n\
  element = checkYoSelf ? {parentNode: element} : element\n\
\n\
  root = root || document\n\
\n\
  // Make sure `element !== document` and `element != null`\n\
  // otherwise we get an illegal invocation\n\
  while ((element = element.parentNode) && element !== document) {\n\
    if (matches(element, selector))\n\
      return element\n\
    // After `matches` on the edge case that\n\
    // the selector matches the root\n\
    // (when the root is not the document)\n\
    if (element === root)\n\
      return  \n\
  }\n\
}\n\
//# sourceURL=components/discore/closest/0.1.2/index.js"
));

require.modules["discore-closest"] = require.modules["discore~closest@0.1.2"];
require.modules["discore~closest"] = require.modules["discore~closest@0.1.2"];
require.modules["closest"] = require.modules["discore~closest@0.1.2"];


require.register("component~delegate@0.2.1", Function("exports, module",
"/**\n\
 * Module dependencies.\n\
 */\n\
\n\
var closest = require(\"discore~closest@0.1.2\")\n\
  , event = require(\"component~event@0.1.3\");\n\
\n\
/**\n\
 * Delegate event `type` to `selector`\n\
 * and invoke `fn(e)`. A callback function\n\
 * is returned which may be passed to `.unbind()`.\n\
 *\n\
 * @param {Element} el\n\
 * @param {String} selector\n\
 * @param {String} type\n\
 * @param {Function} fn\n\
 * @param {Boolean} capture\n\
 * @return {Function}\n\
 * @api public\n\
 */\n\
\n\
exports.bind = function(el, selector, type, fn, capture){\n\
  return event.bind(el, type, function(e){\n\
    var target = e.target || e.srcElement;\n\
    e.delegateTarget = closest(target, selector, true, el);\n\
    if (e.delegateTarget) fn.call(el, e);\n\
  }, capture);\n\
};\n\
\n\
/**\n\
 * Unbind event `type`'s callback `fn`.\n\
 *\n\
 * @param {Element} el\n\
 * @param {String} type\n\
 * @param {Function} fn\n\
 * @param {Boolean} capture\n\
 * @api public\n\
 */\n\
\n\
exports.unbind = function(el, type, fn, capture){\n\
  event.unbind(el, type, fn, capture);\n\
};\n\
\n\
//# sourceURL=components/component/delegate/0.2.1/index.js"
));

require.modules["component-delegate"] = require.modules["component~delegate@0.2.1"];
require.modules["component~delegate"] = require.modules["component~delegate@0.2.1"];
require.modules["delegate"] = require.modules["component~delegate@0.2.1"];


require.register("component~events@1.0.6", Function("exports, module",
"\n\
/**\n\
 * Module dependencies.\n\
 */\n\
\n\
var events = require(\"component~event@0.1.3\");\n\
var delegate = require(\"component~delegate@0.2.1\");\n\
\n\
/**\n\
 * Expose `Events`.\n\
 */\n\
\n\
module.exports = Events;\n\
\n\
/**\n\
 * Initialize an `Events` with the given\n\
 * `el` object which events will be bound to,\n\
 * and the `obj` which will receive method calls.\n\
 *\n\
 * @param {Object} el\n\
 * @param {Object} obj\n\
 * @api public\n\
 */\n\
\n\
function Events(el, obj) {\n\
  if (!(this instanceof Events)) return new Events(el, obj);\n\
  if (!el) throw new Error('element required');\n\
  if (!obj) throw new Error('object required');\n\
  this.el = el;\n\
  this.obj = obj;\n\
  this._events = {};\n\
}\n\
\n\
/**\n\
 * Subscription helper.\n\
 */\n\
\n\
Events.prototype.sub = function(event, method, cb){\n\
  this._events[event] = this._events[event] || {};\n\
  this._events[event][method] = cb;\n\
};\n\
\n\
/**\n\
 * Bind to `event` with optional `method` name.\n\
 * When `method` is undefined it becomes `event`\n\
 * with the \"on\" prefix.\n\
 *\n\
 * Examples:\n\
 *\n\
 *  Direct event handling:\n\
 *\n\
 *    events.bind('click') // implies \"onclick\"\n\
 *    events.bind('click', 'remove')\n\
 *    events.bind('click', 'sort', 'asc')\n\
 *\n\
 *  Delegated event handling:\n\
 *\n\
 *    events.bind('click li > a')\n\
 *    events.bind('click li > a', 'remove')\n\
 *    events.bind('click a.sort-ascending', 'sort', 'asc')\n\
 *    events.bind('click a.sort-descending', 'sort', 'desc')\n\
 *\n\
 * @param {String} event\n\
 * @param {String|function} [method]\n\
 * @return {Function} callback\n\
 * @api public\n\
 */\n\
\n\
Events.prototype.bind = function(event, method){\n\
  var e = parse(event);\n\
  var el = this.el;\n\
  var obj = this.obj;\n\
  var name = e.name;\n\
  var method = method || 'on' + name;\n\
  var args = [].slice.call(arguments, 2);\n\
\n\
  // callback\n\
  function cb(){\n\
    var a = [].slice.call(arguments).concat(args);\n\
    obj[method].apply(obj, a);\n\
  }\n\
\n\
  // bind\n\
  if (e.selector) {\n\
    cb = delegate.bind(el, e.selector, name, cb);\n\
  } else {\n\
    events.bind(el, name, cb);\n\
  }\n\
\n\
  // subscription for unbinding\n\
  this.sub(name, method, cb);\n\
\n\
  return cb;\n\
};\n\
\n\
/**\n\
 * Unbind a single binding, all bindings for `event`,\n\
 * or all bindings within the manager.\n\
 *\n\
 * Examples:\n\
 *\n\
 *  Unbind direct handlers:\n\
 *\n\
 *     events.unbind('click', 'remove')\n\
 *     events.unbind('click')\n\
 *     events.unbind()\n\
 *\n\
 * Unbind delegate handlers:\n\
 *\n\
 *     events.unbind('click', 'remove')\n\
 *     events.unbind('click')\n\
 *     events.unbind()\n\
 *\n\
 * @param {String|Function} [event]\n\
 * @param {String|Function} [method]\n\
 * @api public\n\
 */\n\
\n\
Events.prototype.unbind = function(event, method){\n\
  if (0 == arguments.length) return this.unbindAll();\n\
  if (1 == arguments.length) return this.unbindAllOf(event);\n\
\n\
  // no bindings for this event\n\
  var bindings = this._events[event];\n\
  if (!bindings) return;\n\
\n\
  // no bindings for this method\n\
  var cb = bindings[method];\n\
  if (!cb) return;\n\
\n\
  events.unbind(this.el, event, cb);\n\
};\n\
\n\
/**\n\
 * Unbind all events.\n\
 *\n\
 * @api private\n\
 */\n\
\n\
Events.prototype.unbindAll = function(){\n\
  for (var event in this._events) {\n\
    this.unbindAllOf(event);\n\
  }\n\
};\n\
\n\
/**\n\
 * Unbind all events for `event`.\n\
 *\n\
 * @param {String} event\n\
 * @api private\n\
 */\n\
\n\
Events.prototype.unbindAllOf = function(event){\n\
  var bindings = this._events[event];\n\
  if (!bindings) return;\n\
\n\
  for (var method in bindings) {\n\
    this.unbind(event, method);\n\
  }\n\
};\n\
\n\
/**\n\
 * Parse `event`.\n\
 *\n\
 * @param {String} event\n\
 * @return {Object}\n\
 * @api private\n\
 */\n\
\n\
function parse(event) {\n\
  var parts = event.split(/ +/);\n\
  return {\n\
    name: parts.shift(),\n\
    selector: parts.join(' ')\n\
  }\n\
}\n\
\n\
//# sourceURL=components/component/events/1.0.6/index.js"
));

require.modules["component-events"] = require.modules["component~events@1.0.6"];
require.modules["component~events"] = require.modules["component~events@1.0.6"];
require.modules["events"] = require.modules["component~events@1.0.6"];


require.register("component~keyname@0.0.1", Function("exports, module",
"\n\
/**\n\
 * Key name map.\n\
 */\n\
\n\
var map = {\n\
  8: 'backspace',\n\
  9: 'tab',\n\
  13: 'enter',\n\
  16: 'shift',\n\
  17: 'ctrl',\n\
  18: 'alt',\n\
  20: 'capslock',\n\
  27: 'esc',\n\
  32: 'space',\n\
  33: 'pageup',\n\
  34: 'pagedown',\n\
  35: 'end',\n\
  36: 'home',\n\
  37: 'left',\n\
  38: 'up',\n\
  39: 'right',\n\
  40: 'down',\n\
  45: 'ins',\n\
  46: 'del',\n\
  91: 'meta',\n\
  93: 'meta',\n\
  224: 'meta'\n\
};\n\
\n\
/**\n\
 * Return key name for `n`.\n\
 *\n\
 * @param {Number} n\n\
 * @return {String}\n\
 * @api public\n\
 */\n\
\n\
module.exports = function(n){\n\
  return map[n];\n\
};\n\
//# sourceURL=components/component/keyname/0.0.1/index.js"
));

require.modules["component-keyname"] = require.modules["component~keyname@0.0.1"];
require.modules["component~keyname"] = require.modules["component~keyname@0.0.1"];
require.modules["keyname"] = require.modules["component~keyname@0.0.1"];


require.register("component~pillbox@1.3.1", Function("exports, module",
"\n\
/**\n\
 * Module dependencies.\n\
 */\n\
\n\
var Emitter = require(\"component~emitter@1.1.2\")\n\
  , keyname = require(\"component~keyname@0.0.1\")\n\
  , events = require(\"component~events@1.0.6\")\n\
  , each = require(\"component~each@0.2.3\")\n\
  , Set = require(\"component~set@1.0.0\");\n\
\n\
/**\n\
 * Expose `Pillbox`.\n\
 */\n\
\n\
module.exports = Pillbox\n\
\n\
/**\n\
 * Initialize a `Pillbox` with the given\n\
 * `input` element and `options`.\n\
 *\n\
 * @param {Element} input\n\
 * @param {Object} options\n\
 * @api public\n\
 */\n\
\n\
function Pillbox(input, options) {\n\
  if (!(this instanceof Pillbox)) return new Pillbox(input, options);\n\
  var self = this\n\
  this.options = options || {}\n\
  this.input = input;\n\
  this.tags = new Set;\n\
  this.el = document.createElement('div');\n\
  this.el.className = 'pillbox';\n\
  this.el.style = input.style;\n\
  input.parentNode.insertBefore(this.el, input);\n\
  input.parentNode.removeChild(input);\n\
  this.el.appendChild(input);\n\
  this.events = events(this.el, this);\n\
  this.bind();\n\
}\n\
\n\
/**\n\
 * Mixin emitter.\n\
 */\n\
\n\
Emitter(Pillbox.prototype);\n\
\n\
/**\n\
 * Bind internal events.\n\
 *\n\
 * @return {Pillbox}\n\
 * @api public\n\
 */\n\
\n\
Pillbox.prototype.bind = function(){\n\
  this.events.bind('click');\n\
  this.events.bind('keydown');\n\
  return this;\n\
};\n\
\n\
/**\n\
 * Unbind internal events.\n\
 *\n\
 * @return {Pillbox}\n\
 * @api public\n\
 */\n\
\n\
Pillbox.prototype.unbind = function(){\n\
  this.events.unbind();\n\
  return this;\n\
};\n\
\n\
/**\n\
 * Handle keyup.\n\
 *\n\
 * @api private\n\
 */\n\
\n\
Pillbox.prototype.onkeydown = function(e){\n\
  switch (keyname(e.which)) {\n\
    case 'enter':\n\
      e.preventDefault();\n\
      this.add(e.target.value);\n\
      e.target.value = '';\n\
      break;\n\
    case 'space':\n\
      if (!this.options.space) return;\n\
      e.preventDefault();\n\
      this.add(e.target.value);\n\
      e.target.value = '';\n\
      break;\n\
    case 'backspace':\n\
      if ('' == e.target.value) {\n\
        this.remove(this.last());\n\
      }\n\
      break;\n\
  }\n\
};\n\
\n\
/**\n\
 * Handle click.\n\
 *\n\
 * @api private\n\
 */\n\
\n\
Pillbox.prototype.onclick = function(){\n\
  this.input.focus();\n\
};\n\
\n\
/**\n\
 * Set / Get all values.\n\
 *\n\
 * @param {Array} vals\n\
 * @return {Array|Pillbox}\n\
 * @api public\n\
 */\n\
\n\
Pillbox.prototype.values = function(vals){\n\
  var self = this;\n\
\n\
  if (0 == arguments.length) {\n\
    return this.tags.values();\n\
  }\n\
\n\
  each(vals, function(value){\n\
    self.add(value);\n\
  });\n\
\n\
  return this;\n\
};\n\
\n\
/**\n\
 * Return the last member of the set.\n\
 *\n\
 * @return {String}\n\
 * @api private\n\
 */\n\
\n\
Pillbox.prototype.last = function(){\n\
  return this.tags.vals[this.tags.vals.length - 1];\n\
};\n\
\n\
/**\n\
 * Add `tag`.\n\
 *\n\
 * @param {String} tag\n\
 * @return {Pillbox} self\n\
 * @api public\n\
 */\n\
\n\
Pillbox.prototype.add = function(tag) {\n\
  var self = this\n\
  tag = tag.trim();\n\
\n\
  // blank\n\
  if ('' == tag) return;\n\
\n\
  // exists\n\
  if (this.tags.has(tag)) return;\n\
\n\
  // lowercase\n\
  if (this.options.lowercase) tag = tag.toLowerCase();\n\
\n\
  // add it\n\
  this.tags.add(tag);\n\
\n\
  // list item\n\
  var span = document.createElement('span');\n\
  span.setAttribute('data', tag);\n\
  span.appendChild(document.createTextNode(tag));\n\
  span.onclick = function(e) {\n\
    e.preventDefault();\n\
    self.input.focus();\n\
  };\n\
\n\
  // delete link\n\
  var del = document.createElement('a');\n\
  del.appendChild(document.createTextNode('✕'));\n\
  del.href = '#';\n\
  del.onclick = this.remove.bind(this, tag);\n\
  span.appendChild(del);\n\
\n\
  this.el.insertBefore(span, this.input);\n\
  this.emit('add', tag);\n\
\n\
  return this;\n\
}\n\
\n\
/**\n\
 * Remove `tag`.\n\
 *\n\
 * @param {String} tag\n\
 * @return {Pillbox} self\n\
 * @api public\n\
 */\n\
\n\
Pillbox.prototype.remove = function(tag) {\n\
  if (!this.tags.has(tag)) return this;\n\
  this.tags.remove(tag);\n\
\n\
  var span;\n\
  for (var i = 0; i < this.el.childNodes.length; ++i) {\n\
    span = this.el.childNodes[i];\n\
    if (tag == span.getAttribute('data')) break;\n\
  }\n\
\n\
  this.el.removeChild(span);\n\
  this.emit('remove', tag);\n\
\n\
  return this;\n\
}\n\
\n\
\n\
//# sourceURL=components/component/pillbox/1.3.1/index.js"
));

require.modules["component-pillbox"] = require.modules["component~pillbox@1.3.1"];
require.modules["component~pillbox"] = require.modules["component~pillbox@1.3.1"];
require.modules["pillbox"] = require.modules["component~pillbox@1.3.1"];


require.register("component~indexof@0.0.3", Function("exports, module",
"module.exports = function(arr, obj){\n\
  if (arr.indexOf) return arr.indexOf(obj);\n\
  for (var i = 0; i < arr.length; ++i) {\n\
    if (arr[i] === obj) return i;\n\
  }\n\
  return -1;\n\
};\n\
//# sourceURL=components/component/indexof/0.0.3/index.js"
));

require.modules["component-indexof"] = require.modules["component~indexof@0.0.3"];
require.modules["component~indexof"] = require.modules["component~indexof@0.0.3"];
require.modules["indexof"] = require.modules["component~indexof@0.0.3"];


require.register("component~classes@1.2.1", Function("exports, module",
"/**\n\
 * Module dependencies.\n\
 */\n\
\n\
var index = require(\"component~indexof@0.0.3\");\n\
\n\
/**\n\
 * Whitespace regexp.\n\
 */\n\
\n\
var re = /\\s+/;\n\
\n\
/**\n\
 * toString reference.\n\
 */\n\
\n\
var toString = Object.prototype.toString;\n\
\n\
/**\n\
 * Wrap `el` in a `ClassList`.\n\
 *\n\
 * @param {Element} el\n\
 * @return {ClassList}\n\
 * @api public\n\
 */\n\
\n\
module.exports = function(el){\n\
  return new ClassList(el);\n\
};\n\
\n\
/**\n\
 * Initialize a new ClassList for `el`.\n\
 *\n\
 * @param {Element} el\n\
 * @api private\n\
 */\n\
\n\
function ClassList(el) {\n\
  if (!el) throw new Error('A DOM element reference is required');\n\
  this.el = el;\n\
  this.list = el.classList;\n\
}\n\
\n\
/**\n\
 * Add class `name` if not already present.\n\
 *\n\
 * @param {String} name\n\
 * @return {ClassList}\n\
 * @api public\n\
 */\n\
\n\
ClassList.prototype.add = function(name){\n\
  // classList\n\
  if (this.list) {\n\
    this.list.add(name);\n\
    return this;\n\
  }\n\
\n\
  // fallback\n\
  var arr = this.array();\n\
  var i = index(arr, name);\n\
  if (!~i) arr.push(name);\n\
  this.el.className = arr.join(' ');\n\
  return this;\n\
};\n\
\n\
/**\n\
 * Remove class `name` when present, or\n\
 * pass a regular expression to remove\n\
 * any which match.\n\
 *\n\
 * @param {String|RegExp} name\n\
 * @return {ClassList}\n\
 * @api public\n\
 */\n\
\n\
ClassList.prototype.remove = function(name){\n\
  if ('[object RegExp]' == toString.call(name)) {\n\
    return this.removeMatching(name);\n\
  }\n\
\n\
  // classList\n\
  if (this.list) {\n\
    this.list.remove(name);\n\
    return this;\n\
  }\n\
\n\
  // fallback\n\
  var arr = this.array();\n\
  var i = index(arr, name);\n\
  if (~i) arr.splice(i, 1);\n\
  this.el.className = arr.join(' ');\n\
  return this;\n\
};\n\
\n\
/**\n\
 * Remove all classes matching `re`.\n\
 *\n\
 * @param {RegExp} re\n\
 * @return {ClassList}\n\
 * @api private\n\
 */\n\
\n\
ClassList.prototype.removeMatching = function(re){\n\
  var arr = this.array();\n\
  for (var i = 0; i < arr.length; i++) {\n\
    if (re.test(arr[i])) {\n\
      this.remove(arr[i]);\n\
    }\n\
  }\n\
  return this;\n\
};\n\
\n\
/**\n\
 * Toggle class `name`, can force state via `force`.\n\
 *\n\
 * For browsers that support classList, but do not support `force` yet,\n\
 * the mistake will be detected and corrected.\n\
 *\n\
 * @param {String} name\n\
 * @param {Boolean} force\n\
 * @return {ClassList}\n\
 * @api public\n\
 */\n\
\n\
ClassList.prototype.toggle = function(name, force){\n\
  // classList\n\
  if (this.list) {\n\
    if (\"undefined\" !== typeof force) {\n\
      if (force !== this.list.toggle(name, force)) {\n\
        this.list.toggle(name); // toggle again to correct\n\
      }\n\
    } else {\n\
      this.list.toggle(name);\n\
    }\n\
    return this;\n\
  }\n\
\n\
  // fallback\n\
  if (\"undefined\" !== typeof force) {\n\
    if (!force) {\n\
      this.remove(name);\n\
    } else {\n\
      this.add(name);\n\
    }\n\
  } else {\n\
    if (this.has(name)) {\n\
      this.remove(name);\n\
    } else {\n\
      this.add(name);\n\
    }\n\
  }\n\
\n\
  return this;\n\
};\n\
\n\
/**\n\
 * Return an array of classes.\n\
 *\n\
 * @return {Array}\n\
 * @api public\n\
 */\n\
\n\
ClassList.prototype.array = function(){\n\
  var str = this.el.className.replace(/^\\s+|\\s+$/g, '');\n\
  var arr = str.split(re);\n\
  if ('' === arr[0]) arr.shift();\n\
  return arr;\n\
};\n\
\n\
/**\n\
 * Check if class `name` is present.\n\
 *\n\
 * @param {String} name\n\
 * @return {ClassList}\n\
 * @api public\n\
 */\n\
\n\
ClassList.prototype.has =\n\
ClassList.prototype.contains = function(name){\n\
  return this.list\n\
    ? this.list.contains(name)\n\
    : !! ~index(this.array(), name);\n\
};\n\
\n\
//# sourceURL=components/component/classes/1.2.1/index.js"
));

require.modules["component-classes"] = require.modules["component~classes@1.2.1"];
require.modules["component~classes"] = require.modules["component~classes@1.2.1"];
require.modules["classes"] = require.modules["component~classes@1.2.1"];


require.register("component~domify@1.2.2", Function("exports, module",
"\n\
/**\n\
 * Expose `parse`.\n\
 */\n\
\n\
module.exports = parse;\n\
\n\
/**\n\
 * Wrap map from jquery.\n\
 */\n\
\n\
var map = {\n\
  legend: [1, '<fieldset>', '</fieldset>'],\n\
  tr: [2, '<table><tbody>', '</tbody></table>'],\n\
  col: [2, '<table><tbody></tbody><colgroup>', '</colgroup></table>'],\n\
  _default: [0, '', '']\n\
};\n\
\n\
map.td =\n\
map.th = [3, '<table><tbody><tr>', '</tr></tbody></table>'];\n\
\n\
map.option =\n\
map.optgroup = [1, '<select multiple=\"multiple\">', '</select>'];\n\
\n\
map.thead =\n\
map.tbody =\n\
map.colgroup =\n\
map.caption =\n\
map.tfoot = [1, '<table>', '</table>'];\n\
\n\
map.text =\n\
map.circle =\n\
map.ellipse =\n\
map.line =\n\
map.path =\n\
map.polygon =\n\
map.polyline =\n\
map.rect = [1, '<svg xmlns=\"http://www.w3.org/2000/svg\" version=\"1.1\">','</svg>'];\n\
\n\
/**\n\
 * Parse `html` and return the children.\n\
 *\n\
 * @param {String} html\n\
 * @return {Array}\n\
 * @api private\n\
 */\n\
\n\
function parse(html) {\n\
  if ('string' != typeof html) throw new TypeError('String expected');\n\
  \n\
  // tag name\n\
  var m = /<([\\w:]+)/.exec(html);\n\
  if (!m) return document.createTextNode(html);\n\
\n\
  html = html.replace(/^\\s+|\\s+$/g, ''); // Remove leading/trailing whitespace\n\
\n\
  var tag = m[1];\n\
\n\
  // body support\n\
  if (tag == 'body') {\n\
    var el = document.createElement('html');\n\
    el.innerHTML = html;\n\
    return el.removeChild(el.lastChild);\n\
  }\n\
\n\
  // wrap map\n\
  var wrap = map[tag] || map._default;\n\
  var depth = wrap[0];\n\
  var prefix = wrap[1];\n\
  var suffix = wrap[2];\n\
  var el = document.createElement('div');\n\
  el.innerHTML = prefix + html + suffix;\n\
  while (depth--) el = el.lastChild;\n\
\n\
  // one element\n\
  if (el.firstChild == el.lastChild) {\n\
    return el.removeChild(el.firstChild);\n\
  }\n\
\n\
  // several elements\n\
  var fragment = document.createDocumentFragment();\n\
  while (el.firstChild) {\n\
    fragment.appendChild(el.removeChild(el.firstChild));\n\
  }\n\
\n\
  return fragment;\n\
}\n\
\n\
//# sourceURL=components/component/domify/1.2.2/index.js"
));

require.modules["component-domify"] = require.modules["component~domify@1.2.2"];
require.modules["component~domify"] = require.modules["component~domify@1.2.2"];
require.modules["domify"] = require.modules["component~domify@1.2.2"];


require.register("yields~select@0.5.1", Function("exports, module",
"/**\n\
 * dependencies\n\
 */\n\
\n\
var previous = require(\"ianstormtaylor~previous-sibling@0.0.1\");\n\
var template = require(\"yields~select@0.5.1/template.html\");\n\
var next = require(\"ianstormtaylor~next-sibling@0.0.1\");\n\
var debounce = require(\"component~debounce@0.0.3\");\n\
var Pillbox = require(\"component~pillbox@1.3.1\");\n\
var classes = require(\"component~classes@1.2.1\");\n\
var Emitter = require(\"component~emitter@1.1.2\");\n\
var keyname = require(\"component~keyname@0.0.1\");\n\
var events = require(\"component~events@1.0.6\");\n\
var domify = require(\"component~domify@1.2.2\");\n\
var query = require(\"component~query@0.0.3\");\n\
var each = require(\"component~each@0.2.3\");\n\
var tpl = domify(template);\n\
\n\
/**\n\
 * Export `Select`\n\
 */\n\
\n\
module.exports = Select;\n\
\n\
/**\n\
 * Initialize `Select`.\n\
 *\n\
 * @api public\n\
 */\n\
\n\
function Select(){\n\
  if (!(this instanceof Select)) return new Select;\n\
  this.el = tpl.cloneNode(true);\n\
  this.classes = classes(this.el);\n\
  this.opts = query('.select-options', this.el);\n\
  this.dropdown = query('.select-dropdown', this.el);\n\
  this.input = query('.select-input', this.el);\n\
  this.inputEvents = events(this.input, this);\n\
  this.docEvents = events(document, this);\n\
  this.events = events(this.el, this);\n\
  this._selected = [];\n\
  this.options = {};\n\
  this.bind();\n\
}\n\
\n\
/**\n\
 * Mixins.\n\
 */\n\
\n\
Emitter(Select.prototype);\n\
\n\
/**\n\
 * Bind internal events.\n\
 *\n\
 * @return {Select}\n\
 * @api private\n\
 */\n\
\n\
Select.prototype.bind = function(){\n\
  this.events.bind('click .select-box', 'focus');\n\
  this.events.bind('mouseover .select-option');\n\
  var onsearch = this.onsearch.bind(this);\n\
  this.input.onkeyup = debounce(onsearch, 300);\n\
  this.docEvents.bind('touchstart', 'blur');\n\
  this.inputEvents.bind('focus', 'show');\n\
  this.events.bind('touchstart');\n\
  this.inputEvents.bind('blur');\n\
  this.events.bind('keydown');\n\
  return this;\n\
};\n\
\n\
/**\n\
 * Unbind internal events.\n\
 *\n\
 * @return {Select}\n\
 * @api public\n\
 */\n\
\n\
Select.prototype.unbind = function(){\n\
  this.inputEvents.unbind();\n\
  this.docEvents.unbind();\n\
  this.events.unbind();\n\
  return this;\n\
};\n\
\n\
/**\n\
 * Set the select label.\n\
 *\n\
 * @param {String} label\n\
 * @return {Select}\n\
 * @api public\n\
 */\n\
\n\
Select.prototype.label = function(label){\n\
  this._label = label;\n\
  this.input.placeholder = label;\n\
  return this;\n\
};\n\
\n\
/**\n\
 * Allow multiple.\n\
 *\n\
 * @param {String} label\n\
 * @param {Object} opts\n\
 * @return {Select}\n\
 * @api public\n\
 */\n\
\n\
Select.prototype.multiple = function(label, opts){\n\
  if (this._multiple) return;\n\
  this._multiple = true;\n\
  this.classes.remove('select-single');\n\
  this.classes.add('select-multiple');\n\
  this.box = new Pillbox(this.input, opts);\n\
  this.box.events.unbind('keydown');\n\
  this.box.on('remove', this.deselect.bind(this));\n\
  return this;\n\
};\n\
\n\
/**\n\
 * Add an option with `name` and `value`.\n\
 *\n\
 * @param {String|Object} name\n\
 * @param {Mixed} value\n\
 * @return {Select}\n\
 * @api public\n\
 */\n\
\n\
Select.prototype.add = function(name, value){\n\
  var opt = option.apply(null, arguments);\n\
  opt.el.onmousedown = this.select.bind(this, name);\n\
  this.opts.appendChild(opt.el);\n\
  this.options[opt.name] = opt;\n\
  this.emit('add', opt);\n\
  return this;\n\
};\n\
\n\
/**\n\
 * Remove an option with `name`.\n\
 *\n\
 * @param {String} name\n\
 * @return {Select}\n\
 * @api public\n\
 */\n\
\n\
Select.prototype.remove = function(name){\n\
  name = name.toLowerCase();\n\
  var opt = this.get(name);\n\
  this.emit('remove', opt);\n\
  this.opts.removeChild(opt.el);\n\
\n\
  // selected\n\
  if (opt.selected) {\n\
    this.deselect(opt.name);\n\
  }\n\
\n\
  delete this.options[name];\n\
\n\
  return this;\n\
};\n\
\n\
/**\n\
 * Remove all options.\n\
 *\n\
 * @return {Select}\n\
 * @api public\n\
 */\n\
\n\
Select.prototype.empty = function(){\n\
  each(this.options, this.remove.bind(this));\n\
  return this;\n\
};\n\
\n\
/**\n\
 * Select `name`.\n\
 *\n\
 * @param {String} name\n\
 * @return {Select}\n\
 * @api public\n\
 */\n\
\n\
Select.prototype.select = function(name){\n\
  var opt = this.get(name);\n\
\n\
  // state\n\
  if (!this.classes.has('selected')) {\n\
    this.classes.add('selected');\n\
  }\n\
\n\
  // select\n\
  this.emit('select', opt);\n\
  opt.selected = true;\n\
\n\
  // hide\n\
  opt.el.setAttribute('hidden', '');\n\
  classes(opt.el).add('selected');\n\
\n\
  // multiple\n\
  if (this._multiple) {\n\
    this.box.add(opt.label);\n\
    this._selected.push(opt);\n\
    this.input.value = '';\n\
    this.dehighlight();\n\
    this.change();\n\
    this.hide();\n\
    return this;\n\
  }\n\
\n\
  // single\n\
  var prev = this._selected[0];\n\
  if (prev) this.deselect(prev.name);\n\
  this._selected = [opt];\n\
  this.input.value = opt.label;\n\
  this.hide();\n\
  this.change();\n\
  return this;\n\
};\n\
\n\
/**\n\
 * Deselect `name`.\n\
 *\n\
 * @param {String} name\n\
 * @return {Select}\n\
 * @api public\n\
 */\n\
\n\
Select.prototype.deselect = function(name){\n\
  var opt = this.get(name);\n\
\n\
  // deselect\n\
  this.emit('deselect', opt);\n\
  opt.selected = false;\n\
\n\
  // show\n\
  opt.el.removeAttribute('hidden');\n\
  classes(opt.el).remove('selected');\n\
\n\
  // multiple\n\
  if (this._multiple) {\n\
    this.box.remove(opt.label);\n\
    var i = this._selected.indexOf(opt);\n\
    if (!~i) return this;\n\
    this._selected.splice(i, 1);\n\
    this.change();\n\
    return this;\n\
  }\n\
\n\
  // deselect\n\
  this.classes.remove('selected');\n\
\n\
  // single\n\
  this.label(this._label);\n\
  this._selected = [];\n\
  this.change();\n\
  return this;\n\
};\n\
\n\
/**\n\
 * Get an option `name` or dropdown.\n\
 *\n\
 * @param {String} name\n\
 * @return {Element}\n\
 * @api public\n\
 */\n\
\n\
Select.prototype.get = function(name){\n\
  if ('string' == typeof name) {\n\
    name = name.toLowerCase();\n\
    var opt = this.options[name];\n\
    if (!opt) throw new Error('option \"' + name + '\" does not exist');\n\
    return opt;\n\
  }\n\
\n\
  return { el: this.dropdown };\n\
};\n\
\n\
/**\n\
 * Show options or `name`\n\
 *\n\
 * @param {String} name\n\
 * @return {Select}\n\
 * @api public\n\
 */\n\
\n\
Select.prototype.show = function(name){\n\
  var opt = this.get(name);\n\
\n\
  // visible\n\
  if (this.visible(name)) return this;\n\
\n\
  // show\n\
  opt.el.removeAttribute('hidden');\n\
\n\
  // focus\n\
  if (!this._multiple && !this._searchable) {\n\
    this.el.focus();\n\
  }\n\
\n\
  // option\n\
  if ('string' == typeof name) return this;\n\
\n\
  // show\n\
  this.emit('show');\n\
  this.classes.add('open');\n\
\n\
  // highlight\n\
  var el = query('.select-option:not([hidden]):not(.selected)', this.opts);\n\
  if (el) this.highlight(el);\n\
\n\
  return this;\n\
};\n\
\n\
/**\n\
 * Hide options or `name`.\n\
 *\n\
 * @param {String} name\n\
 * @return {Select}\n\
 * @api public\n\
 */\n\
\n\
Select.prototype.hide = function(name){\n\
  var opt = this.get(name);\n\
  opt.el.setAttribute('hidden', '');\n\
  if ('string' == typeof name) return this;\n\
  this.emit('hide');\n\
  this.classes.remove('open');\n\
  this.showAll();\n\
  return this;\n\
};\n\
\n\
/**\n\
 * Check if options or `name` is visible.\n\
 *\n\
 * @param {String} name\n\
 * @return {Boolean}\n\
 * @api public\n\
 */\n\
\n\
Select.prototype.visible = function(name){\n\
  return ! this.get(name).el.hasAttribute('hidden');\n\
};\n\
\n\
/**\n\
 * Toggle show / hide with optional `name`.\n\
 *\n\
 * @param {String} name\n\
 * @return {Select}\n\
 * @api public\n\
 */\n\
\n\
Select.prototype.toggle = function(name){\n\
  if ('string' != typeof name) name = null;\n\
\n\
  return this.visible(name)\n\
    ? this.hide(name)\n\
    : this.show(name);\n\
};\n\
\n\
/**\n\
 * Disable `name`.\n\
 *\n\
 * @param {String} name\n\
 * @return {Select}\n\
 * @api public\n\
 */\n\
\n\
Select.prototype.disable = function(name){\n\
  var opt = this.get(name);\n\
  opt.el.setAttribute('disabled', true);\n\
  opt.disabled = true;\n\
  return this;\n\
};\n\
\n\
/**\n\
 * Enable `name`.\n\
 *\n\
 * @param {String} name\n\
 * @return {Select}\n\
 * @api public\n\
 */\n\
\n\
Select.prototype.enable = function(name){\n\
  var opt = this.get(name);\n\
  opt.el.removeAttribute('disabled');\n\
  opt.disabled = false;\n\
  return this;\n\
};\n\
\n\
/**\n\
 * Set / get the selected options.\n\
 *\n\
 * @param {Array} opts\n\
 * @return {Select}\n\
 * @api public\n\
 */\n\
\n\
Select.prototype.selected = function(arr){\n\
  if (1 == arguments.length) {\n\
    arr.forEach(this.select, this);\n\
    return this;\n\
  }\n\
\n\
  return this._selected;\n\
};\n\
\n\
/**\n\
 * Get the values.\n\
 *\n\
 * @return {Array}\n\
 * @api public\n\
 */\n\
\n\
Select.prototype.values = function(){\n\
  return this._selected.map(function(opt){\n\
    return opt.value;\n\
  });\n\
};\n\
\n\
/**\n\
 * Search `term`.\n\
 *\n\
 * @param {String} term\n\
 * @return {Search}\n\
 * @api public\n\
 */\n\
\n\
Select.prototype.search = function(term){\n\
  var expr = term.toLowerCase()\n\
    , opts = this.options\n\
    , self = this\n\
    , found = 0;\n\
\n\
  // show\n\
  if (!this.visible()) {\n\
    this.show()\n\
  }\n\
\n\
  // custom search\n\
  this.emit('search', term, opts);\n\
\n\
  // abort\n\
  if (this.hasListeners('search')) return this;\n\
\n\
  // search\n\
  each(opts, function(name, opt){\n\
    if (opt.disabled) return;\n\
    if (opt.selected) return;\n\
\n\
    if (~name.indexOf(expr)) {\n\
      self.show(name);\n\
      if (1 == ++found) self.highlight(opt.el);\n\
    } else {\n\
      self.hide(opt.name);\n\
    }\n\
  });\n\
\n\
  // all done\n\
  return this.emit('found', found);\n\
};\n\
\n\
/**\n\
 * Highlight the given `name`.\n\
 *\n\
 * @param {String|Element} el\n\
 * @return {Select}\n\
 * @api private\n\
 */\n\
\n\
Select.prototype.highlight = function(el){\n\
  if ('string' == typeof el) el = this.get(el).el;\n\
  this.dehighlight();\n\
  classes(el).add('highlighted');\n\
  this.active = el;\n\
  return this;\n\
};\n\
\n\
/**\n\
 * De-highlight.\n\
 *\n\
 * @return {Select}\n\
 * @api public\n\
 */\n\
\n\
Select.prototype.dehighlight = function(){\n\
  if (!this.active) return this;\n\
  classes(this.active).remove('highlighted');\n\
  this.active = null;\n\
  return this;\n\
};\n\
\n\
/**\n\
 * Focus input.\n\
 *\n\
 * @return {Select}\n\
 * @api public\n\
 */\n\
\n\
Select.prototype.focus = function(){\n\
  this.input.focus();\n\
  return this;\n\
};\n\
\n\
/**\n\
 * Blur input.\n\
 *\n\
 * @return {Select}\n\
 * @api public\n\
 */\n\
\n\
Select.prototype.blur = function(){\n\
  this.input.blur();\n\
  return this;\n\
};\n\
\n\
/**\n\
 * Highlight next element.\n\
 *\n\
 * @api private\n\
 */\n\
\n\
Select.prototype.next = function(){\n\
  if (!this.active) return;\n\
  var el = next(this.active, ':not([hidden]):not(.selected)');\n\
  el = el || query('.select-option:not([hidden])', this.opts);\n\
  if (el) this.highlight(el);\n\
};\n\
\n\
/**\n\
 * Highlight previous element.\n\
 *\n\
 * @api private\n\
 */\n\
\n\
Select.prototype.previous = function(){\n\
  if (!this.active) return;\n\
  var el = previous(this.active, ':not([hidden]):not(.selected)');\n\
  el = el || query.all('.select-option:not([hidden])', this.el);\n\
  if (el.length) el = el[el.length - 1];\n\
  if (el.className) this.highlight(el);\n\
};\n\
\n\
/**\n\
 * on-input\n\
 *\n\
 * @param {Event} e\n\
 * @api private\n\
 */\n\
\n\
Select.prototype.onsearch = function(e){\n\
  var key = keyname(e.which);\n\
\n\
  // ignore\n\
  if ('down' == key) return;\n\
  if ('up' == key) return;\n\
  if ('enter' == key) return;\n\
  if ('left' == key) return;\n\
  if ('right' == key) return;\n\
\n\
  // search\n\
  if (e.target.value) {\n\
    this.search(e.target.value);\n\
  } else {\n\
    this.showAll();\n\
  }\n\
};\n\
\n\
/**\n\
 * on-keydown.\n\
 *\n\
 * @param {Event} e\n\
 * @api private\n\
 */\n\
\n\
Select.prototype.onkeydown = function(e){\n\
  var visible = this.visible()\n\
    , box = this.box;\n\
\n\
  // actions\n\
  switch (keyname(e.which)) {\n\
    case 'down':\n\
      e.preventDefault();\n\
      visible\n\
        ? this.next()\n\
        : this.show();\n\
      break;\n\
    case 'up':\n\
      e.preventDefault();\n\
      visible\n\
        ? this.previous()\n\
        : this.show();\n\
      break;\n\
    case 'esc':\n\
      this.hide();\n\
      this.input.value = '';\n\
      break;\n\
    case 'enter':\n\
      if (!this.active || !visible) return;\n\
      var name = this.active.getAttribute('data-name');\n\
      this.select(name);\n\
      break;\n\
    case 'backspace':\n\
      if (box) return box.onkeydown(e);\n\
      var all = this._selected;\n\
      var item = all[all.length - 1];\n\
      if (!item) return;\n\
      this.deselect(item.name);\n\
      break;\n\
  }\n\
};\n\
\n\
/**\n\
 * on-mouseover\n\
 *\n\
 * @param {Event} e\n\
 * @api private\n\
 */\n\
\n\
Select.prototype.onmouseover = function(e){\n\
  var name = e.target.getAttribute('data-name');\n\
  this.highlight(name);\n\
};\n\
\n\
/**\n\
 * Emit change.\n\
 *\n\
 * @api private\n\
 */\n\
\n\
Select.prototype.change = function(){\n\
  this.emit('change', this);\n\
};\n\
\n\
/**\n\
 * on-blur.\n\
 *\n\
 * @param {Event} e\n\
 * @api public\n\
 */\n\
\n\
Select.prototype.onblur = function(e){\n\
  this.showAll();\n\
  this.hide();\n\
\n\
  if (this._multiple) {\n\
    this.input.value = '';\n\
  } else if (!this._selected.length) {\n\
    this.input.value = '';\n\
  }\n\
};\n\
\n\
/**\n\
 * Show all options.\n\
 *\n\
 * @return {Select}\n\
 * @api private\n\
 */\n\
\n\
Select.prototype.showAll = function(){\n\
  var els = query.all('[hidden]:not(.selected)', this.opts);\n\
\n\
  for (var i = 0; i < els.length; ++i) {\n\
    els[i].removeAttribute('hidden');\n\
  }\n\
\n\
  return this;\n\
};\n\
\n\
/**\n\
 * on-touchstart.\n\
 *\n\
 * @param {Event} e\n\
 * @api public\n\
 */\n\
\n\
Select.prototype.ontouchstart = function(e){\n\
  e.stopImmediatePropagation();\n\
};\n\
\n\
/**\n\
 * Create an option.\n\
 *\n\
 * @param {String|Object} obj\n\
 * @param {Mixed} value\n\
 * @param {Element} el\n\
 * @return {Object}\n\
 * @api private\n\
 */\n\
\n\
function option(obj, value, el){\n\
  if ('string' == typeof obj) {\n\
    return option({\n\
      value: value,\n\
      name: obj,\n\
      el: el\n\
    });\n\
  }\n\
\n\
  // option\n\
  obj.label = obj.name;\n\
  obj.name = obj.name.toLowerCase();\n\
  obj.value = obj.value == null \n\
    ? obj.name\n\
    : obj.value;\n\
\n\
  // element\n\
  if (!obj.el) {\n\
    obj.el = document.createElement('li');\n\
    obj.el.textContent = obj.label;\n\
  }\n\
\n\
  // domify\n\
  if ('string' == typeof obj.el) {\n\
    obj.el = domify(obj.el);\n\
  }\n\
\n\
  // setup element\n\
  obj.el.setAttribute('data-name', obj.name);\n\
  classes(obj.el).add('select-option');\n\
  classes(obj.el).add('show');\n\
\n\
  // opt\n\
  return obj;\n\
}\n\
\n\
//# sourceURL=components/yields/select/0.5.1/index.js"
));

require.define("yields~select@0.5.1/template.html", "<div class='select select-single'>\n  <div class='select-box'>\n    <input type='text' class='select-input'>\n  </div>\n  <div class='select-dropdown' hidden>\n    <ul class='select-options'></ul>\n  </div>\n</div>\n");

require.modules["yields-select"] = require.modules["yields~select@0.5.1"];
require.modules["yields~select"] = require.modules["yields~select@0.5.1"];
require.modules["select"] = require.modules["yields~select@0.5.1"];


require.register("transitive/lib/graph/index.js", Function("exports, module",
"\n\
/**\n\
 * Dependencies\n\
 */\n\
\n\
var Edge = require(\"transitive/lib/graph/edge.js\");\n\
var Vertex = require(\"transitive/lib/graph/vertex.js\");\n\
var MultiPoint = require(\"transitive/lib/point/multipoint.js\");\n\
\n\
var PriorityQueue = require(\"janogonzalez~priorityqueuejs@0.2.0\");\n\
\n\
/**\n\
 * Expose `Graph`\n\
 */\n\
\n\
module.exports = NetworkGraph;\n\
\n\
/**\n\
 *  An graph representing the underlying 'wireframe' network\n\
 */\n\
\n\
function NetworkGraph() {\n\
  this.vertices = [];\n\
  this.edges = [];\n\
}\n\
\n\
/**\n\
 * Add Vertex\n\
 */\n\
\n\
NetworkGraph.prototype.addVertex = function(point, x, y) {\n\
  if(x === undefined || y === undefined) {\n\
    var xy = latLonToSphericalMercator(point.getLat(), point.getLon());\n\
    x = xy[0];\n\
    y = xy[1];\n\
  }\n\
  var vertex = new Vertex(point, x, y);\n\
  this.vertices.push(vertex);\n\
  return vertex;\n\
};\n\
\n\
/**\n\
 * Add Edge\n\
 */\n\
\n\
NetworkGraph.prototype.addEdge = function(stopArray, fromVertex, toVertex) {\n\
  if (this.vertices.indexOf(fromVertex) === -1) {\n\
    console.log('Error: NetworkGraph does not contain Edge fromVertex');\n\
    return;\n\
  }\n\
\n\
  if (this.vertices.indexOf(toVertex) === -1) {\n\
    console.log('Error: NetworkGraph does not contain Edge toVertex');\n\
    return;\n\
  }\n\
\n\
  var edge = new Edge(stopArray, fromVertex, toVertex);\n\
  this.edges.push(edge);\n\
  fromVertex.edges.push(edge);\n\
  toVertex.edges.push(edge);\n\
\n\
  return edge;\n\
};\n\
\n\
NetworkGraph.prototype.removeEdge = function(edge) {\n\
  var edgeIndex = this.edges.indexOf(edge);\n\
  if(edgeIndex !== -1) this.edges.splice(edgeIndex, 1);\n\
  edge.pathSegments.forEach(function(segment) {\n\
    segment.removeEdge(edge);\n\
  });\n\
};\n\
\n\
NetworkGraph.prototype.mergeVertices = function(vertexArray) {\n\
\n\
  var xTotal = 0, yTotal = 0;\n\
\n\
  var multiPoint = new MultiPoint();\n\
  var mergedVertex = new Vertex(multiPoint, 0, 0);\n\
\n\
  var origPoints = [];\n\
  vertexArray.forEach(function(vertex) {\n\
    origPoints.push(vertex.point);\n\
    xTotal += vertex.x;\n\
    yTotal += vertex.y;\n\
    vertex.edges.forEach(function(edge) {\n\
      if(vertexArray.indexOf(edge.fromVertex) !== -1 && vertexArray.indexOf(edge.toVertex) !== -1) {\n\
        this.removeEdge(edge);\n\
        return;\n\
      }\n\
      edge.replaceVertex(vertex, mergedVertex);\n\
      mergedVertex.addEdge(edge);\n\
    }, this);\n\
    var index = this.vertices.indexOf(vertex);\n\
    if(index !== -1) this.vertices.splice(index, 1);\n\
  }, this);\n\
\n\
  mergedVertex.x = xTotal / vertexArray.length;\n\
  mergedVertex.y = yTotal / vertexArray.length;\n\
  mergedVertex.oldVertices = vertexArray;\n\
  origPoints.forEach(function(point) {\n\
    multiPoint.addPoint(point);\n\
  });\n\
\n\
  this.vertices.push(mergedVertex);\n\
};\n\
\n\
\n\
/**\n\
 * Get the equivalent edge\n\
 */\n\
\n\
NetworkGraph.prototype.getEquivalentEdge = function(pointArray, from, to) {\n\
  for (var e = 0; e < this.edges.length; e++) {\n\
    var edge = this.edges[e];\n\
    if (edge.fromVertex === from\n\
      && edge.toVertex === to\n\
      && pointArray.length === edge.pointArray.length\n\
      && equal(pointArray, edge.pointArray)) {\n\
      return edge;\n\
    }\n\
  }\n\
};\n\
\n\
/**\n\
 * Convert the graph coordinates to a linear 1-d display. Assumes a branch-based, acyclic graph\n\
 */\n\
\n\
NetworkGraph.prototype.convertTo1D = function(stopArray, from, to) {\n\
  if (this.edges.length === 0) return;\n\
\n\
  // find the \"trunk\" edge; i.e. the one with the most patterns\n\
  var trunkEdge = null;\n\
  var maxPatterns = 0;\n\
\n\
  for (var e = 0; e < this.edges.length; e++) {\n\
    var edge = this.edges[e];\n\
    if(edge.patterns.length > maxPatterns) {\n\
      trunkEdge = edge;\n\
      maxPatterns = edge.patterns.length;\n\
    }\n\
  }\n\
  this.exploredVertices = [trunkEdge.fromVertex, trunkEdge.toVertex];\n\
\n\
  //console.log('trunk edge: ');\n\
  //console.log(trunkEdge);\n\
  trunkEdge.setStopLabelPosition(-1);\n\
\n\
  // determine the direction relative to the trunk edge\n\
  var llDir = trunkEdge.toVertex.x - trunkEdge.fromVertex.x;\n\
  if(llDir === 0) llDir = trunkEdge.toVertex.y - trunkEdge.fromVertex.y;\n\
\n\
  if(llDir > 0) {\n\
    // make the trunk edge from (0,0) to (x,0)\n\
    trunkEdge.fromVertex.moveTo(0, 0);\n\
    trunkEdge.toVertex.moveTo(trunkEdge.stopArray.length + 1, 0);\n\
\n\
    // explore the graph in both directions\n\
    this.extend1D(trunkEdge, trunkEdge.fromVertex, -1, 0);\n\
    this.extend1D(trunkEdge, trunkEdge.toVertex, 1, 0);\n\
  }\n\
  else {\n\
    // make the trunk edge from (x,0) to (0,0)\n\
    trunkEdge.toVertex.moveTo(0, 0);\n\
    trunkEdge.fromVertex.moveTo(trunkEdge.stopArray.length + 1, 0);\n\
\n\
    // explore the graph in both directions\n\
    this.extend1D(trunkEdge, trunkEdge.fromVertex, 1, 0);\n\
    this.extend1D(trunkEdge, trunkEdge.toVertex, -1, 0);\n\
  }\n\
\n\
  this.apply1DOffsets();\n\
};\n\
\n\
NetworkGraph.prototype.extend1D = function(edge, vertex, direction, y) {\n\
\n\
  var edges = vertex.incidentEdges(edge);\n\
  if(edges.length === 0) { // no additional edges to explore; we're done\n\
    return;\n\
  }\n\
  else if(edges.length === 1) { // exactly one other edge to explore\n\
    var extEdge = edges[0];\n\
    var oppVertex = extEdge.oppositeVertex(vertex);\n\
    extEdge.setStopLabelPosition((y > 0) ? 1 : -1, vertex);\n\
\n\
    if(this.exploredVertices.indexOf(oppVertex) !== -1) {\n\
      console.log('Warning: found cycle in 1d graph');\n\
      return;\n\
    }\n\
    this.exploredVertices.push(oppVertex);\n\
\n\
    oppVertex.moveTo(vertex.x + (extEdge.stopArray.length + 1) * direction, y);\n\
    this.extend1D(extEdge, oppVertex, direction, y);\n\
  }\n\
  else { // branch case\n\
    //console.log('branch:');\n\
\n\
    // iterate through the branches\n\
    edges.forEach(function(extEdge, i) {\n\
      var oppVertex = extEdge.oppositeVertex(vertex);\n\
\n\
      if(this.exploredVertices.indexOf(oppVertex) !== -1) {\n\
        console.log('Warning: found cycle in 1d graph (branch)');\n\
        return;\n\
      }\n\
      this.exploredVertices.push(oppVertex);\n\
\n\
      // the first branch encountered is rendered as the straight line\n\
      // TODO: apply logic to this based on trip count, etc.\n\
      if(i === 0) {\n\
        oppVertex.moveTo(vertex.x + (extEdge.stopArray.length + 1) * direction, y);\n\
        extEdge.setStopLabelPosition((y > 0) ? 1 : -1, vertex);\n\
        this.extend1D(extEdge, oppVertex, direction, y);\n\
      }\n\
      else { // subsequent branches\n\
\n\
        //console.log('branch y+'+i);\n\
        var branchY = y+i;\n\
\n\
        if(extEdge.stopArray.length === 0) {\n\
          oppVertex.moveTo(vertex.x + 1 * direction, branchY);\n\
          return;\n\
        }\n\
\n\
        var newVertexStop;\n\
        if(extEdge.fromVertex === vertex) {\n\
          newVertexStop = extEdge.stopArray[0];\n\
          extEdge.stopArray.splice(0, 1);\n\
        }\n\
        else if(extEdge.toVertex === vertex) {\n\
          newVertexStop = extEdge.stopArray[extEdge.stopArray.length-1];\n\
          extEdge.stopArray.splice(extEdge.stopArray.length-1, 1);\n\
        }\n\
\n\
        var newVertex = this.addVertex(newVertexStop, vertex.x+direction, branchY);\n\
\n\
        this.splitEdge(extEdge, newVertex, vertex);\n\
        extEdge.setStopLabelPosition((branchY > 0) ? 1 : -1, vertex);\n\
\n\
        oppVertex.moveTo(newVertex.x + (extEdge.stopArray.length + 1) * direction, branchY);\n\
        this.extend1D(extEdge, oppVertex, direction, branchY);\n\
      }\n\
      //console.log(extEdge);\n\
    }, this);\n\
  }\n\
};\n\
\n\
\n\
/**\n\
 *\n\
 */\n\
\n\
NetworkGraph.prototype.splitEdge = function(edge, newVertex, adjacentVertex) {\n\
\n\
  var newEdge;\n\
  // attach the existing edge to the inserted vertex\n\
  if(edge.fromVertex === adjacentVertex) {\n\
    newEdge = this.addEdge([], adjacentVertex, newVertex);\n\
    edge.fromVertex = newVertex;\n\
  }\n\
  else if(edge.toVertex === adjacentVertex) {\n\
    newEdge = this.addEdge([], newVertex, adjacentVertex);\n\
    edge.toVertex = newVertex;\n\
  }\n\
  else { // invalid params\n\
    console.log('Warning: invalid params to graph.splitEdge');\n\
    return;\n\
  }\n\
\n\
  // de-associate the existing edge from the adjacentVertex\n\
  adjacentVertex.removeEdge(edge);\n\
\n\
  // create new edge and copy the patterns\n\
  //var newEdge = this.addEdge([], adjacentVertex, newVertex);\n\
  edge.patterns.forEach(function(pattern) {\n\
    newEdge.addPattern(pattern);\n\
  });\n\
\n\
  // associate both edges with the new vertex\n\
  newVertex.edges = [newEdge, edge];\n\
\n\
  // update the affected patterns' edge lists\n\
  edge.patterns.forEach(function(pattern) {\n\
    var i = pattern.graphEdges.indexOf(edge);\n\
    pattern.insertEdge(i, newEdge);\n\
  });\n\
\n\
};\n\
\n\
\n\
/**\n\
 *  Compute offsets for a 1.5D line map rendering\n\
 */\n\
\n\
NetworkGraph.prototype.apply1DOffsets = function() {\n\
\n\
  // initialize the bundle comparisons\n\
  this.bundleComparisons = {};\n\
\n\
  // loop through all vertices with order of 3+ (i.e. where pattern convergence/divergence is possible)\n\
  this.vertices.forEach(function(vertex) {\n\
    if(vertex.edges.length <= 2) return;\n\
\n\
    // loop through the incident edges with 2+ patterns\n\
    vertex.edges.forEach(function(edge) {\n\
      if(edge.patterns.length < 2) return;\n\
\n\
      // compare each pattern pair sharing this edge\n\
      for(var i = 0; i < edge.patterns.length; i++) {\n\
        for(var j = i+1; j < edge.patterns.length; j++) {\n\
          var p1 = edge.patterns[i], p2 = edge.patterns[j];\n\
          var adjEdge1 = p1.getAdjacentEdge(edge, vertex);\n\
          var adjEdge2 = p2.getAdjacentEdge(edge, vertex);\n\
          if(adjEdge1 !== null && adjEdge2 !== null || adjEdge1 !== adjEdge2) {\n\
            var oppVertex1 = adjEdge1.oppositeVertex(vertex);\n\
            var oppVertex2 = adjEdge2.oppositeVertex(vertex);\n\
\n\
            var dx = edge.toVertex.x - edge.fromVertex.x;\n\
            if(dx > 0 && oppVertex1.y < oppVertex2.y) {\n\
              this.bundleComparison(p2, p1);\n\
            }\n\
            else if(dx > 0 && oppVertex1.y > oppVertex2.y) {\n\
              this.bundleComparison(p1, p2);\n\
            }\n\
            else if(dx < 0 && oppVertex1.y < oppVertex2.y) {\n\
              this.bundleComparison(p1, p2);\n\
            }\n\
            else if(dx < 0 && oppVertex1.y > oppVertex2.y) {\n\
              this.bundleComparison(p2, p1);\n\
            }\n\
          }\n\
        }\n\
      }\n\
    }, this);\n\
  }, this);\n\
\n\
  // create a copy of the array, sorted by bundle size (decreasing)\n\
  var sortedEdges = this.edges.concat().sort(function compare(a,b) {\n\
    if(a.patterns.length > b.patterns.length) return -1;\n\
    if(a.patterns.length < b.patterns.length) return 1;\n\
    return 0;\n\
  });\n\
\n\
  sortedEdges.forEach(function(edge) {\n\
    if(edge.toVertex.y !== edge.fromVertex.y) return;\n\
    //console.log('edge w/ ' + edge.patterns.length + ' to offset');\n\
    if(edge.patterns.length === 1) {\n\
      edge.patterns[0].setEdgeOffset(edge, 0);\n\
    }\n\
    else { // 2+ patterns\n\
      var this_ = this;\n\
\n\
      // compute the offsets for this buncle\n\
      var sortedPatterns = edge.patterns.concat().sort(function compare(a, b) {\n\
        var key = a.pattern_id + ',' + b.pattern_id;\n\
        var compValue = this_.bundleComparisons[key];\n\
        if(compValue < 0) return -1;\n\
        if(compValue > 0) return 1;\n\
        return 0;\n\
      });\n\
      sortedPatterns.forEach(function(pattern, i) {\n\
        pattern.setEdgeOffset(edge, (-i + (edge.patterns.length-1)/2) * -1.2, i, true);\n\
      });\n\
    }\n\
  }, this);\n\
};\n\
\n\
\n\
NetworkGraph.prototype.apply2DOffsets = function(transitive) {\n\
\n\
  // initialize the bundle comparisons\n\
  this.bundleComparisons = {};\n\
\n\
  // loop through all vertices with order of 3+ (i.e. where pattern convergence/divergence is possible)\n\
  this.vertices.forEach(function(vertex) {\n\
    if(vertex.edges.length <= 2) return;\n\
\n\
    // loop through the incident edges with 2+ patterns\n\
    vertex.edges.forEach(function(edge) {\n\
      //console.log(edge);\n\
      if(edge.pathSegments.length < 2) return;\n\
\n\
      // compare each pattern pair sharing this edge\n\
      for(var i = 0; i < edge.pathSegments.length; i++) {\n\
        for(var j = i+1; j < edge.pathSegments.length; j++) {\n\
          var p1 = edge.pathSegments[i], p2 = edge.pathSegments[j];\n\
          var adjEdge1 = p1.getAdjacentEdge(edge, vertex);\n\
          var adjEdge2 = p2.getAdjacentEdge(edge, vertex);\n\
\n\
          if(adjEdge1 !== null && adjEdge2 !== null && adjEdge1 !== adjEdge2) {\n\
            var oppVertex1 = adjEdge1.oppositeVertex(vertex);\n\
            var oppVertex2 = adjEdge2.oppositeVertex(vertex);\n\
\n\
            var dx = edge.toVertex.x - edge.fromVertex.x;\n\
            if(dx > 0 && oppVertex1.y < oppVertex2.y) {\n\
              this.bundleComparison(p2, p1);\n\
            }\n\
            else if(dx > 0 && oppVertex1.y > oppVertex2.y) {\n\
              this.bundleComparison(p1, p2);\n\
            }\n\
            else if(dx < 0 && oppVertex1.y < oppVertex2.y) {\n\
              this.bundleComparison(p1, p2);\n\
            }\n\
            else if(dx < 0 && oppVertex1.y > oppVertex2.y) {\n\
              this.bundleComparison(p2, p1);\n\
            }\n\
          }\n\
        }\n\
      }\n\
    }, this);\n\
  }, this);\n\
\n\
\n\
\n\
  this.edges.forEach(function(edge) {\n\
    edge.calculateGridEdges(transitive.gridCellSize);\n\
  }, this);\n\
\n\
  var gridEdgeSegments = {};\n\
\n\
  transitive.renderSegments.forEach(function(segment) {\n\
    segment.gridEdgeLookup = {};\n\
    segment.graphEdges.forEach(function(edge) {\n\
      if(!edge.gridEdges) return;\n\
      edge.gridEdges.forEach(function(gridEdgeId) {\n\
\n\
        if(!(gridEdgeId in gridEdgeSegments)) {\n\
          gridEdgeSegments[gridEdgeId] = [];\n\
        }\n\
        \n\
        var segmentList = gridEdgeSegments[gridEdgeId];\n\
        if(segmentList.indexOf(segment) === -1) {\n\
          segmentList.push(segment);\n\
          segment.gridEdgeLookup[gridEdgeId] = edge;\n\
        }\n\
      });\n\
    });\n\
  });\n\
  \n\
  this.gridEdgeSegments = gridEdgeSegments;\n\
\n\
\n\
  //var graphEdgeBundles = {};\n\
\n\
  var axisBundles = {}; // maps axis discriptor (e.g x_VAL or y_VAL) to array of segments bundled on that axis\n\
\n\
  for(var gridEdgeId in gridEdgeSegments) {\n\
\n\
    var gridSegments = gridEdgeSegments[gridEdgeId];\n\
    //if(gridSegments.length <= 1) continue;\n\
    \n\
    var gridEdgeCoords = gridEdgeId.split('_');\n\
    var axis;\n\
    if(gridEdgeCoords[0] === gridEdgeCoords[2]) { // x coords equal\n\
      axis = 'x_' + gridEdgeCoords[0];\n\
    }\n\
    else if(gridEdgeCoords[1] === gridEdgeCoords[3]) { // y coords equal\n\
      axis = 'y_' + gridEdgeCoords[1];\n\
    }\n\
    else {\n\
      // handle diagonal grid edges later\n\
      continue;\n\
    }\n\
\n\
    if(!(axis in axisBundles)) {\n\
      axisBundles[axis] = [];\n\
    }\n\
    var axisSegments = axisBundles[axis];\n\
\n\
    for(var i =0; i < gridSegments.length; i++) {\n\
      var segment = gridSegments[i];\n\
      addSegmentToAxis(segment, axisSegments);\n\
    }\n\
  }\n\
\n\
\n\
  var bundleSorter = (function(a, b) {\n\
    var key = a.getId() + ',' + b.getId();\n\
    var compValue = this.bundleComparisons[key];\n\
    if(compValue < 0) return -1;\n\
    if(compValue > 0) return 1;\n\
    return 0;\n\
  }).bind(this);\n\
\n\
  for(var axisId in axisBundles) {\n\
    var segments = axisBundles[axisId];\n\
    var lw = 1.2;\n\
    var bundleWidth = lw * (segments.length - 1);\n\
\n\
    var sortedSegments = segments.concat().sort(bundleSorter);\n\
\n\
    for(var s = 0; s < sortedSegments.length; s++) {\n\
      var seg = sortedSegments[s];\n\
      var offset = (-bundleWidth / 2) + s * lw;\n\
      var edge = seg.graphEdges[0];\n\
      var dx = edge.toVertex.x - edge.fromVertex.x, dy = edge.toVertex.y - edge.fromVertex.y;\n\
      if((axisId.charAt(0) === 'x' && dy > 0) || (axisId.charAt(0) === 'y' && dx > 0)) {\n\
        //console.log('fw');\n\
      }\n\
      else {\n\
        //console.log('bw');\n\
        offset = -offset;\n\
      }\n\
      transitive.offsetSegment(seg, axisId, offset);\n\
    }\n\
  }\n\
};\n\
\n\
\n\
function addSegmentToAxis(segment, axisSegments) {\n\
  var axisHasPattern = false;\n\
  for(var s = 0; s < axisSegments.length; s++) {\n\
    if(segment.pattern && axisSegments[s].pattern.getId() === segment.pattern.getId()) {\n\
      axisHasPattern = true;\n\
    }\n\
  }\n\
  if(!axisHasPattern && segment.getType() === 'TRANSIT') {\n\
    axisSegments.push(segment);\n\
  }\n\
}\n\
\n\
/*NetworkGraph.prototype.apply2DOffsets = function() {\n\
\n\
  // initialize the bundle comparisons\n\
  this.bundleComparisons = {};\n\
\n\
  // loop through all vertices with order of 3+ (i.e. where pattern convergence/divergence is possible)\n\
  this.vertices.forEach(function(vertex) {\n\
    if(vertex.edges.length <= 2) return;\n\
\n\
    // loop through the incident edges with 2+ patterns\n\
    vertex.edges.forEach(function(edge) {\n\
      if(edge.paths.length < 2) return;\n\
\n\
      // compare each pattern pair sharing this edge\n\
      for(var i = 0; i < edge.paths.length; i++) {\n\
        for(var j = i+1; j < edge.paths.length; j++) {\n\
          var p1 = edge.paths[i], p2 = edge.paths[j];\n\
          var adjEdge1 = p1.getAdjacentEdge(edge, vertex);\n\
          var adjEdge2 = p2.getAdjacentEdge(edge, vertex);\n\
\n\
          if(adjEdge1 !== null && adjEdge2 !== null && adjEdge1 !== adjEdge2) {\n\
            var oppVertex1 = adjEdge1.oppositeVertex(vertex);\n\
            var oppVertex2 = adjEdge2.oppositeVertex(vertex);\n\
\n\
            var dx = edge.toVertex.x - edge.fromVertex.x;\n\
            if(dx > 0 && oppVertex1.y < oppVertex2.y) {\n\
              this.bundleComparison(p2, p1);\n\
            }\n\
            else if(dx > 0 && oppVertex1.y > oppVertex2.y) {\n\
              this.bundleComparison(p1, p2);\n\
            }\n\
            else if(dx < 0 && oppVertex1.y < oppVertex2.y) {\n\
              this.bundleComparison(p1, p2);\n\
            }\n\
            else if(dx < 0 && oppVertex1.y > oppVertex2.y) {\n\
              this.bundleComparison(p2, p1);\n\
            }\n\
          }\n\
        }\n\
      }\n\
    }, this);\n\
  }, this);\n\
\n\
  // create a copy of the array, sorted by bundle size (decreasing)\n\
  var sortedEdges = this.edges.concat().sort(function compare(a,b) {\n\
    if(a.paths.length > b.paths.length) return -1;\n\
    if(a.paths.length < b.paths.length) return 1;\n\
    return 0;\n\
  });\n\
\n\
  sortedEdges.forEach(function(edge) {\n\
    //if(edge.toVertex.y !== edge.fromVertex.y) return;\n\
    if(edge.paths.length === 1) {\n\
      edge.paths[0].setEdgeOffset(edge, 0);\n\
    }\n\
    else { // 2+ paths\n\
      var this_ = this;\n\
\n\
      // compute the offsets for this buncle\n\
      var sortedPaths = edge.paths.concat().sort(function compare(a, b) {\n\
        var key = a.pattern_id + ',' + b.pattern_id;\n\
        var compValue = this_.bundleComparisons[key];\n\
        if(compValue < 0) return -1;\n\
        if(compValue > 0) return 1;\n\
        return 0;\n\
      });\n\
      sortedPaths.forEach(function(pattern, i) {\n\
        pattern.setEdgeOffset(edge, (-i + (edge.paths.length-1)/2) * -1.2, i, true);\n\
      });\n\
    }\n\
  }, this);\n\
};*/\n\
\n\
/**\n\
 *  Helper method for creating comparisons between patterns for bundle offsetting\n\
 */\n\
\n\
NetworkGraph.prototype.bundleComparison = function(p1, p2) {\n\
\n\
  var key = p1.getId() + ',' + p2.getId();\n\
  if(!(key in this.bundleComparisons)) this.bundleComparisons[key] = 0;\n\
  this.bundleComparisons[key] += 1;\n\
\n\
  key = p2.getId() + ',' + p1.getId();\n\
  if(!(key in this.bundleComparisons)) this.bundleComparisons[key] = 0;\n\
  this.bundleComparisons[key] -= 1;\n\
};\n\
\n\
NetworkGraph.prototype.collapseTransfers = function(threshold) {\n\
  threshold = threshold || 200;\n\
  this.edges.forEach(function(edge) {\n\
    if(edge.getLength() > threshold) return;\n\
    //if(edge.fromVertex.point.getType() === 'PLACE' || edge.toVertex.point.getType() === 'PLACE') return;\n\
    var walk = true;\n\
    edge.pathSegments.forEach(function(segment) {\n\
      walk = walk && segment.type === 'WALK';\n\
    });\n\
    if(walk) {\n\
      this.mergeVertices([edge.fromVertex, edge.toVertex]);\n\
    }\n\
  }, this);\n\
};\n\
\n\
\n\
NetworkGraph.prototype.snapToGrid = function(cellSize) {\n\
  this.cellSize = cellSize;\n\
\n\
  this.recenter();\n\
\n\
  var xCoords = [], yCoords = [];\n\
  this.vertices.forEach(function(vertex) {\n\
    xCoords.push(vertex.x);\n\
    yCoords.push(vertex.y);\n\
  });\n\
\n\
  var medianX = median(xCoords), medianY = median(yCoords);\n\
\n\
  // set up priority-queue of all vertices, sorted by distance from median point\n\
  var vertexQueue = new PriorityQueue(function(a, b) {\n\
    return b.dist - a.dist;\n\
  });\n\
  this.vertices.forEach(function(vertex) {\n\
    var dx = vertex.x - medianX, dy = vertex.y - medianY;\n\
    vertexQueue.enq({\n\
      dist: Math.sqrt(dx*dx + dy*dy),\n\
      dx: dx,\n\
      dy: dy,\n\
      vertex: vertex\n\
    });\n\
  });\n\
\n\
  this.orderedVertices = [];\n\
  while(vertexQueue.size() > 0) {\n\
    var vertexInfo = vertexQueue.deq();\n\
\n\
    this.orderedVertices.push(vertexInfo.vertex);\n\
  }\n\
\n\
  var coords = {}; // maps \"X_Y\"-format ID to the vertex object\n\
  this.snapVertex(this.orderedVertices[0], null, coords);\n\
};\n\
\n\
\n\
NetworkGraph.prototype.snapVertex = function(vertex, inEdge, coords) {\n\
  var cellSize = this.cellSize;\n\
\n\
  if(vertex.snapped) return;\n\
\n\
  var newx = Math.round(vertex.x / cellSize) * cellSize;\n\
  var newy = Math.round(vertex.y / cellSize) * cellSize;\n\
\n\
  var coordId = newx + '_' + newy;\n\
  if(coordId in coords) { // grid coordinate already in use\n\
\n\
    // set up priority-queue of potential alternates\n\
    var queue = new PriorityQueue(function(a, b) {\n\
      return b.dist - a.dist;\n\
    });\n\
\n\
    var r = 3;\n\
    for(var xr = -r; xr <= r; xr++) {\n\
      for(var yr = -r; yr <= r; yr++) {\n\
        if(xr === 0 && yr === 0) continue;\n\
        var x = newx + xr * cellSize;\n\
        var y = newy + yr * cellSize;\n\
        var dist = Math.sqrt((newx-x)*(newx-x) + (newy-y)*(newy-y));\n\
        queue.enq({\n\
          dist: dist,\n\
          x: x,\n\
          y: y\n\
        });\n\
      }\n\
    }\n\
\n\
    while(queue.size() > 0) {\n\
      var next = queue.deq();\n\
      coordId = next.x + '_' + next.y;\n\
      if(!(coordId in coords)) {\n\
        newx = next.x;\n\
        newy = next.y;\n\
        break;\n\
      }\n\
    }\n\
    coords[newx + '_' + newy] = vertex;\n\
  }\n\
  else {\n\
    coords[coordId] = vertex;\n\
  }\n\
\n\
  vertex.x = newx;\n\
  vertex.y = newy;\n\
\n\
  vertex.snapped = true;\n\
  vertex.edges.forEach(function(edge) {\n\
    if(edge.fromVertex.snapped && edge.toVertex.snapped) {\n\
      var edgeGridPoints = edge.getGridPoints(cellSize);\n\
      edgeGridPoints.forEach(function(gridPointArr) {\n\
        var gridPointId = gridPointArr[0] + '_' + gridPointArr[1];\n\
        coords[gridPointId] = edge;\n\
      });\n\
    }\n\
  });\n\
\n\
  // recurse through the remaining edges of this vertex\n\
  vertex.incidentEdges(inEdge).forEach(function(edge) {\n\
    var oppVertex = edge.oppositeVertex(vertex);\n\
    if(!oppVertex.snapped) this.snapVertex(oppVertex, edge, coords);\n\
  }, this);\n\
};\n\
\n\
/*function coordInUse(x, y, inEdge, toVertex, coords, cellSize) {\n\
  var coordId = x + '_' + y;\n\
  if(!inEdge) return coordId in coords;\n\
\n\
  var fromVertex = inEdge.oppositeVertex(toVertex);\n\
  var edgeCoords = inEdge.getGridPointsFromCoords(fromVertex.x, fromVertex.y, x, y, cellSize);\n\
  console.log(edgeCoords);\n\
\n\
  edgeCoords.forEach(function(coord) {\n\
    coordId = coord[0] + '_' + coord[1];\n\
    if(coordId in coords) return true;\n\
  });\n\
\n\
  return false;\n\
}*/\n\
\n\
\n\
NetworkGraph.prototype.calculateGeometry = function(cellSize) {\n\
  this.edges.forEach(function(edge) {\n\
    edge.calculateGeometry(cellSize);\n\
  });\n\
};\n\
\n\
\n\
NetworkGraph.prototype.optimizeCurvature = function() {\n\
\n\
  // optimize same-pattern neighbors of axial edges first\n\
  this.edges.forEach(function(edge) {\n\
    if(edge.isAxial()) {\n\
      edge.renderSegments.forEach(function(segment) {\n\
        if(segment.getType() === 'TRANSIT') {\n\
          this.alignPatternIncidentEdges(edge.fromVertex, edge, segment.pattern);\n\
          this.alignPatternIncidentEdges(edge.toVertex, edge, segment.pattern);\n\
        }\n\
      }, this);\n\
    }\n\
  }, this);\n\
\n\
  // optimize other neighbors of axial edges\n\
  this.edges.forEach(function(edge) {\n\
    if(edge.isAxial()) {\n\
      edge.renderSegments.forEach(function(segment) {\n\
        if(segment.getType() === 'TRANSIT') {\n\
          this.alignOtherIncidentEdges(edge.fromVertex, edge, segment.pattern);\n\
          this.alignOtherIncidentEdges(edge.toVertex, edge, segment.pattern);\n\
        }\n\
      }, this);\n\
    }\n\
  }, this);\n\
\n\
};\n\
\n\
\n\
NetworkGraph.prototype.alignPatternIncidentEdges = function(vertex, inEdge, pattern) {\n\
  vertex.incidentEdges(inEdge).forEach(function(edge) {\n\
    edge.renderSegments.forEach(function(segment) {\n\
      if(!edge.aligned && segment.getType() === 'TRANSIT' && segment.pattern === pattern) {\n\
        edge.align(vertex, inEdge.getVector(vertex));\n\
      }\n\
    });\n\
  });\n\
};\n\
\n\
\n\
NetworkGraph.prototype.alignOtherIncidentEdges = function(vertex, inEdge, pattern) {\n\
  vertex.incidentEdges(inEdge).forEach(function(edge) {\n\
    edge.renderSegments.forEach(function(segment) {\n\
      if(!edge.aligned && segment.getType() === 'TRANSIT' && segment.pattern === pattern) {\n\
        var vector = inEdge.getVector(vertex);\n\
        edge.align(vertex, { x: vector.y, y: -vector.x });\n\
      }\n\
    });\n\
\n\
    /*var segment = edge.renderSegment;\n\
    if(!edge.aligned && segment.getType() === 'TRANSIT' && segment.pattern !== pattern) {\n\
      var vector = inEdge.getVector(vertex);\n\
      edge.align(vertex, { x: vector.y, y: -vector.x });\n\
    }*/\n\
  });\n\
};\n\
\n\
\n\
NetworkGraph.prototype.resetCoordinates = function() {\n\
  this.vertices.forEach(function(vertex) {\n\
    //console.log(vertex);\n\
    vertex.x = vertex.origX;\n\
    vertex.y = vertex.origY;\n\
  });\n\
};\n\
\n\
\n\
NetworkGraph.prototype.recenter = function() {\n\
\n\
  var xCoords = [], yCoords = [];\n\
  this.vertices.forEach(function(v) {\n\
    xCoords.push(v.x);\n\
    yCoords.push(v.y);\n\
  });\n\
\n\
  var mx = median(xCoords), my = median(yCoords);\n\
\n\
  this.vertices.forEach(function(v) {\n\
    v.x = v.x - mx;\n\
    v.y = v.y - my;\n\
  });\n\
};\n\
\n\
/**\n\
 * Check if arrays are equal\n\
 */\n\
\n\
function equal(a, b) {\n\
  if (a.length !== b.length) {\n\
    return false;\n\
  }\n\
\n\
  for (var i in a) {\n\
    if (a[i] !== b[i]) {\n\
      return false;\n\
    }\n\
  }\n\
\n\
  return true;\n\
}\n\
\n\
\n\
/**\n\
 * Compute the median of an array of values\n\
 */\n\
\n\
function median(values) {\n\
\n\
  values.sort(function(a, b) {\n\
    return a - b;\n\
  });\n\
\n\
  var half = Math.floor(values.length / 2);\n\
\n\
  if(values.length % 2) {\n\
    return values[half];\n\
  }\n\
  else {\n\
    return (values[half - 1] + values[half]) / 2.0;\n\
  }\n\
}\n\
\n\
\n\
/**\n\
 * Convert lat/lon coords to spherical mercator meter x/y coords\n\
 */\n\
\n\
function latLonToSphericalMercator(lat, lon) {\n\
  var r = 6378137;\n\
  var x = r * lon * Math.PI/180;\n\
  var y = r * Math.log(Math.tan(Math.PI/4 + lat * Math.PI/360));\n\
  return [x,y];\n\
}\n\
//# sourceURL=lib/graph/index.js"
));

require.register("transitive/lib/graph/edge.js", Function("exports, module",
"\n\
/**\n\
 * Expose `Edge`\n\
 */\n\
\n\
module.exports = Edge;\n\
\n\
/**\n\
 * Initialize a new edge\n\
 *\n\
 * @param {Array}\n\
 * @param {Vertex}\n\
 * @param {Vertex}\n\
 */\n\
\n\
function Edge(pointArray, fromVertex, toVertex) {\n\
  this.pointArray = pointArray;\n\
  this.fromVertex = fromVertex;\n\
  this.toVertex = toVertex;\n\
  this.paths = [];\n\
  this.pathSegments = [];\n\
  this.renderSegments = [];\n\
\n\
  this.curveAngle = 90;\n\
\n\
  //this.calculateVectors();\n\
}\n\
\n\
\n\
/**\n\
 *\n\
 */\n\
\n\
Edge.prototype.getLength = function() {\n\
  var dx = this.toVertex.x - this.fromVertex.x, dy = this.toVertex.y - this.fromVertex.y;\n\
  return Math.sqrt(dx * dx + dy * dy);\n\
};\n\
\n\
\n\
/**\n\
 *\n\
 */\n\
\n\
Edge.prototype.isAxial = function() {\n\
  return (this.toVertex.x === this.fromVertex.x) || (this.toVertex.y === this.fromVertex.y);\n\
};\n\
\n\
\n\
/**\n\
 *\n\
 */\n\
\n\
Edge.prototype.hasCurvature = function() {\n\
  return this.elbow !== null;\n\
};\n\
\n\
\n\
/**\n\
 *\n\
 */\n\
\n\
Edge.prototype.replaceVertex = function(oldVertex, newVertex) {\n\
  if(oldVertex === this.fromVertex) this.fromVertex = newVertex;\n\
  if(oldVertex === this.toVertex) this.toVertex = newVertex;\n\
};\n\
\n\
\n\
/**\n\
 *  Add a path that traverses this edge\n\
 */\n\
\n\
Edge.prototype.addPath = function(path) {\n\
  if (this.paths.indexOf(path) === -1) this.paths.push(path);\n\
};\n\
\n\
\n\
Edge.prototype.addPathSegment = function(segment) {\n\
  for(var i = 0; i < this.pathSegments.length; i++) {\n\
    if(this.pathSegments[i].pattern && segment.pattern\n\
       && this.pathSegments[i].pattern === segment.pattern) {\n\
      return;\n\
    }\n\
  }\n\
  this.pathSegments.push(segment);\n\
};\n\
\n\
\n\
/**\n\
 *\n\
 */\n\
\n\
Edge.prototype.addRenderSegment = function(segment) {\n\
  if(this.renderSegments.indexOf(segment) !== -1) return;\n\
  this.renderSegments.push(segment);\n\
};\n\
\n\
\n\
/** internal geometry functions **/\n\
\n\
Edge.prototype.calculateGeometry = function(cellSize) {\n\
\n\
  this.elbow = this.getCurveElbow(cellSize);\n\
\n\
  this.calculateVectors();\n\
\n\
  this.curvaturePoints = [];\n\
  if(this.elbow !== null) this.calculateCurvaturePoints();\n\
\n\
};\n\
\n\
\n\
Edge.prototype.calculateCurvaturePoints = function() {\n\
\n\
  // construct the curvature points\n\
  var x1 = this.fromVertex.x, y1 = this.fromVertex.y;\n\
  var x2 = this.toVertex.x, y2 = this.toVertex.y;\n\
  var dx = x2 - x1, dy = y2 - y1;\n\
  \n\
  var dex1 = x1 - this.elbow.x, dex2 = x2 - this.elbow.x, dey1 = y1 - this.elbow.y, dey2 = y2 - this.elbow.y;\n\
  var e1len = Math.sqrt(dex1 * dex1 + dey1 * dey1);\n\
  var e2len = Math.sqrt(dex2 * dex2 + dey2 * dey2);\n\
\n\
  // unit vector from elbow to 'from' point\n\
  var e1Vector = {\n\
    x: dex1 / e1len,\n\
    y: dey1 / e1len\n\
  };\n\
\n\
  // unit vector from elbow to 'to' point\n\
  var e2Vector = {\n\
    x: dex2 / e2len,\n\
    y: dey2 / e2len\n\
  };\n\
\n\
  this.radius = Math.min(250, Math.min(Math.abs(dx), Math.abs(dy)));\n\
\n\
\n\
  this.curvaturePoints.push({\n\
    x : this.elbow.x + e1Vector.x * this.radius,\n\
    y : this.elbow.y + e1Vector.y * this.radius\n\
  });\n\
  this.curvaturePoints.push({\n\
    x : this.elbow.x + e2Vector.x * this.radius,\n\
    y : this.elbow.y + e2Vector.y * this.radius,\n\
    arc: this.curveAngle\n\
  });\n\
};\n\
\n\
\n\
Edge.prototype.getCurveElbow = function(cellSize) {\n\
  return this.getCurveElbowFromCoords(this.fromVertex.x, this.fromVertex.y, this.toVertex.x, this.toVertex.y, cellSize);\n\
};\n\
\n\
\n\
Edge.prototype.getCurveElbowFromCoords = function(x1, y1, x2, y2, cellSize) {\n\
  var dx = x2 - x1, dy = y2 - y1;\n\
\n\
  // keep diagonal edges that traverse a single grid cell straight\n\
  if(Math.abs(dx) === cellSize && Math.abs(dy) === cellSize && !this.hasTransit()) return null;\n\
\n\
  var inQ1 = (dx > 0 && dy > 0);\n\
  var inQ2 = (dx < 0 && dy > 0);\n\
  var inQ3 = (dx < 0 && dy < 0);\n\
  var inQ4 = (dx > 0 && dy < 0);\n\
\n\
  if(this.curveAngle === 90 && (inQ1 || inQ3)) return { x: x2, y: y1 };\n\
  if(this.curveAngle === 90 && (inQ2 || inQ4)) return { x: x1, y: y2 };\n\
  if(this.curveAngle === -90 && (inQ1 || inQ3)) return { x: x1, y: y2 };\n\
  if(this.curveAngle === -90 && (inQ2 || inQ4)) return { x: x2, y: y1 };\n\
\n\
  return null;\n\
};\n\
\n\
\n\
Edge.prototype.hasTransit = function(cellSize) {\n\
  for(var i = 0; i < this.renderSegments.length; i++) {\n\
    if(this.renderSegments[i].getType() === 'TRANSIT') {\n\
      return true;\n\
    }\n\
  }\n\
  return false;\n\
};\n\
\n\
Edge.prototype.calculateVectors = function(cellSize) {\n\
\n\
  var dx = this.elbow ? (this.elbow.x - this.fromVertex.x) : (this.toVertex.x - this.fromVertex.x);\n\
  var dy = this.elbow ? (this.elbow.y - this.fromVertex.y) : (this.toVertex.y - this.fromVertex.y);\n\
  var l = Math.sqrt(dx * dx + dy * dy);\n\
\n\
  this.fromVector = {\n\
    x: dx / l,\n\
    y: dy / l\n\
  };\n\
\n\
  this.fromleftVector = {\n\
    x : -this.fromVector.y,\n\
    y : this.fromVector.x\n\
  };\n\
\n\
  this.fromRightVector = {\n\
    x : this.fromVector.y,\n\
    y : -this.fromVector.x\n\
  };\n\
\n\
\n\
  dx = this.elbow ? (this.toVertex.x - this.elbow.x) : (this.toVertex.x - this.fromVertex.x);\n\
  dy = this.elbow ? (this.toVertex.y - this.elbow.y) : (this.toVertex.y - this.fromVertex.y);\n\
  l = Math.sqrt(dx * dx + dy * dy);\n\
\n\
  this.toVector = {\n\
    x: dx / l,\n\
    y: dy / l\n\
  };\n\
\n\
  this.toleftVector = {\n\
    x : -this.toVector.y,\n\
    y : this.toVector.x\n\
  };\n\
\n\
  this.toRightVector = {\n\
    x : this.toVector.y,\n\
    y : -this.toVector.x\n\
  };\n\
\n\
};\n\
\n\
\n\
Edge.prototype.getGridPoints = function(cellSize) {\n\
  return this.getGridPointsFromCoords(this.fromVertex.x, this.fromVertex.y, this.toVertex.x, this.toVertex.y, cellSize);\n\
  /*var gridPoints = [];\n\
\n\
  var elbow = this.elbow;\n\
  \n\
  gridPoints.push([ this.fromVertex.x, this.fromVertex.y ]);\n\
\n\
  //console.log(this);\n\
\n\
  if(elbow && elbow.x === this.fromVertex.x) { // follows y-axis first\n\
    gridPoints = gridPoints.concat(this.getYAxisGridPoints(cellSize, this.fromVertex.x));\n\
    gridPoints.push([ elbow.x, elbow.y ]);\n\
    gridPoints = gridPoints.concat(this.getXAxisGridPoints(cellSize, this.toVertex.y));\n\
  }\n\
  else if(elbow && elbow.y == this.fromVertex.y) { // follows x-axis first\n\
    gridPoints = gridPoints.concat(this.getXAxisGridPoints(cellSize, this.fromVertex.y));\n\
    gridPoints.push([ elbow.x, elbow.y ]);\n\
    gridPoints = gridPoints.concat(this.getYAxisGridPoints(cellSize, this.toVertex.x));\n\
  }\n\
  else if(this.fromVertex.x === this.toVertex.x) { // vertical edge\n\
    gridPoints = gridPoints.concat(this.getYAxisGridPoints(cellSize, this.fromVertex.x));\n\
  }\n\
  else if(this.fromVertex.y === this.toVertex.y) { // horizontal edge\n\
    gridPoints = gridPoints.concat(this.getXAxisGridPoints(cellSize, this.fromVertex.y));\n\
  }\n\
\n\
  gridPoints.push([ this.toVertex.x, this.toVertex.y ]);\n\
\n\
  //console.log(gridPoints);\n\
  return gridPoints;*/\n\
};\n\
\n\
\n\
Edge.prototype.getGridPointsFromCoords = function(fx, fy, tx, ty, cellSize) {\n\
  var gridPoints = [];\n\
\n\
  var elbow = this.elbow ? this.elbow : this.getCurveElbowFromCoords(fx, fy, tx, ty, cellSize);\n\
  gridPoints.push([ fx, fy ]);\n\
\n\
  if(elbow && elbow.x === fx) { // follows y-axis first\n\
    gridPoints = gridPoints.concat(this.getYAxisGridPoints(fy, ty, fx, cellSize));\n\
    gridPoints.push([ elbow.x, elbow.y ]);\n\
    gridPoints = gridPoints.concat(this.getXAxisGridPoints(fx, tx, ty, cellSize));\n\
  }\n\
  else if(elbow && elbow.y === fy) { // follows x-axis first\n\
    gridPoints = gridPoints.concat(this.getXAxisGridPoints(fx, tx, fy, cellSize));\n\
    gridPoints.push([ elbow.x, elbow.y ]);\n\
    gridPoints = gridPoints.concat(this.getYAxisGridPoints(fy, ty, tx, cellSize));\n\
  }\n\
  else if(fx === tx) { // vertical edge\n\
    gridPoints = gridPoints.concat(this.getYAxisGridPoints(fy, ty, fx, cellSize));\n\
  }\n\
  else if(fy === ty) { // horizontal edge\n\
    gridPoints = gridPoints.concat(this.getXAxisGridPoints(fx, tx, fy, cellSize));\n\
  }\n\
\n\
  gridPoints.push([ tx, ty ]);\n\
\n\
  return gridPoints;\n\
};\n\
\n\
Edge.prototype.getXAxisGridPoints = function(fx, tx, y, cellSize) {\n\
  var gridPoints = [];\n\
  var dx = tx - fx;\n\
  var xCellCount = Math.abs(dx) / cellSize;\n\
\n\
  for(var xc = 1; xc < xCellCount; xc++) {\n\
    gridPoints.push([\n\
      fx + xc * cellSize * (dx / Math.abs(dx)),\n\
      y\n\
    ]);\n\
  }\n\
\n\
  return gridPoints;\n\
};\n\
\n\
Edge.prototype.getYAxisGridPoints = function(fy, ty, x, cellSize) {\n\
  var gridPoints = [];\n\
  var dy = ty - fy;\n\
  var yCellCount = Math.abs(dy) / cellSize;\n\
\n\
  for(var yc = 1; yc < yCellCount; yc++) {\n\
    gridPoints.push([\n\
      x,\n\
      fy + yc * cellSize * (dy / Math.abs(dy))\n\
    ]);\n\
  }\n\
  return gridPoints;\n\
};\n\
\n\
Edge.prototype.calculateGridEdges = function(cellSize) {\n\
  this.gridEdges = [];\n\
  this.gridPoints = this.getGridPoints(cellSize);\n\
  for(var i=0; i < this.gridPoints.length-1; i++) {\n\
    var x1 = this.gridPoints[i][0], y1 = this.gridPoints[i][1];\n\
    var x2 = this.gridPoints[i+1][0], y2 = this.gridPoints[i+1][1];\n\
    var id = Math.min(x1, x2) + '_' + Math.min(y1, y2) + '_' + Math.max(x1, x2) + '_' + Math.max(y1, y2);\n\
    this.gridEdges.push(id);\n\
  }\n\
\n\
};\n\
\n\
\n\
Edge.prototype.align = function(vertex, vector) {\n\
  if(this.aligned || !this.hasCurvature()) return;\n\
  var currentVector = this.getVector(vertex);\n\
  if(Math.abs(currentVector.x) !== Math.abs(vector.x) || Math.abs(currentVector.y) !== Math.abs(vector.y)) {\n\
    this.curveAngle = -this.curveAngle;\n\
    this.calculateGeometry();\n\
  }\n\
  this.aligned = true;\n\
};\n\
\n\
\n\
Edge.prototype.getCurvaturePoints = function(fromOffsetX, fromOffsetY, toOffsetX, toOffsetY) {\n\
  var offsetPoints = [];\n\
\n\
  var offsets = this.getCurveOffsets(fromOffsetX, fromOffsetY, toOffsetX, toOffsetY);\n\
\n\
  offsetPoints.push({\n\
    x: this.curvaturePoints[0].x,\n\
    y: this.curvaturePoints[0].y,\n\
    offsetX: offsets.x,\n\
    offsetY: offsets.y\n\
  });\n\
\n\
  offsetPoints.push({\n\
    x: this.curvaturePoints[1].x,\n\
    y: this.curvaturePoints[1].y,\n\
    arc: this.curvaturePoints[1].arc,\n\
    offsetX: offsets.x,\n\
    offsetY: offsets.y\n\
  });\n\
\n\
  return offsetPoints;\n\
};\n\
\n\
Edge.prototype.renderInternalPoints = function(segment, fromOffsetX, fromOffsetY, toOffsetX, toOffsetY) {\n\
\n\
  var pointInfo, pointIndex = 1;\n\
\n\
  this.pointArray.forEach(function (point, i) {\n\
    var t = (i + 1) / (this.pointArray.length + 1);\n\
    //console.log(point);\n\
    if(this.curvaturePoints.length > 0) {\n\
      pointInfo = this.pointAlongEdgeCurve(t, fromOffsetX, fromOffsetY, toOffsetX, toOffsetY, point.getId() === '8040');\n\
    }\n\
    else {\n\
      pointInfo = this.pointAlongEdge(t);\n\
      pointInfo.offsetX = fromOffsetX;\n\
      pointInfo.offsetY = fromOffsetY;\n\
    }\n\
    pointInfo.segment = segment;\n\
    pointInfo.path = this.paths[0];\n\
    pointInfo.point = point;\n\
    pointInfo.inEdge = pointInfo.outEdge = this;\n\
    pointInfo.index = pointIndex++;\n\
\n\
    point.addRenderData(pointInfo);\n\
  }, this);\n\
};\n\
\n\
\n\
/**\n\
 *\n\
 */\n\
\n\
Edge.prototype.pointAlongEdge = function(t) {\n\
  var x = this.fromVertex.x + t * (this.toVertex.x - this.fromVertex.x);\n\
  var y = this.fromVertex.y + t * (this.toVertex.y - this.fromVertex.y);\n\
  return {\n\
    x: x,\n\
    y: y\n\
  };\n\
};\n\
\n\
\n\
Edge.prototype.pointAlongEdgeCurve = function(t, fromOffsetX, fromOffsetY, toOffsetX, toOffsetY, debug) {\n\
  var fx = this.fromVertex.x, fy = this.fromVertex.y;\n\
  var tx = this.toVertex.x, ty = this.toVertex.y;\n\
  var dx = tx - fx, dy = ty - fy;\n\
  var c0x = this.curvaturePoints[0].x, c0y = this.curvaturePoints[0].y;\n\
  var c1x = this.curvaturePoints[1].x, c1y = this.curvaturePoints[1].y;\n\
  var elbow = this.getCurveElbow();\n\
  var leg0len = Math.sqrt((c0x - fx) * (c0x - fx) + (c0y - fy) * (c0y - fy));\n\
  var leg1len = Math.sqrt((tx - c1x) * (tx - c1x) + (ty - c1y) * (ty - c1y));\n\
\n\
  var r = this.radius;\n\
\n\
  var curvelen = Math.PI * r / 2;\n\
  var len = leg0len + leg1len + curvelen;\n\
\n\
  var pos = t * len;\n\
\n\
  if(pos <= leg0len) {\n\
    return {\n\
      x: fx + (c0x - fx) * (pos / leg0len),\n\
      y: fy + (c0y - fy) * (pos / leg0len),\n\
      offsetX: fromOffsetX,\n\
      offsetY: fromOffsetY\n\
    };\n\
  }\n\
\n\
  if(pos >= len - leg1len) {\n\
    return {\n\
      x: c1x + (tx - c1x) * ((pos - leg0len - curvelen) / leg1len),\n\
      y: c1y + (ty - c1y) * ((pos - leg0len - curvelen) / leg1len),\n\
      offsetX: toOffsetX,\n\
      offsetY: toOffsetY\n\
    };\n\
  }\n\
\n\
  var ct = (pos - leg0len) / curvelen;\n\
\n\
  var cx = (this.fromVector.x !== 0) ? c0x : c1x;\n\
  var cy = (this.fromVector.x !== 0) ? c1y : c0y;\n\
\n\
  var theta = this.getCurveTheta(ct);\n\
\n\
  var offsets = this.getCurveOffsets(fromOffsetX, fromOffsetY, toOffsetX, toOffsetY);\n\
\n\
  var p = {\n\
    x: cx + r * Math.cos(theta),\n\
    y: cy + r * Math.sin(theta),\n\
    offsetX: offsets.x,\n\
    offsetY: offsets.y\n\
  };\n\
\n\
  return p;\n\
};\n\
\n\
\n\
Edge.prototype.getCurveTheta = function(ct) {\n\
  if(this.fromVector.x > 0 && this.curveAngle < 0) return (1 - ct) * Math.PI/2;\n\
  if(this.fromVector.x > 0 && this.curveAngle > 0) return (3 + ct) * Math.PI/2;\n\
\n\
  if(this.fromVector.y > 0 && this.curveAngle < 0) return (2 - ct) * Math.PI/2;\n\
  if(this.fromVector.y > 0 && this.curveAngle > 0) return ct * Math.PI/2;\n\
\n\
  if(this.fromVector.x < 0 && this.curveAngle < 0) return (3 - ct) * Math.PI/2;\n\
  if(this.fromVector.x < 0 && this.curveAngle > 0) return (1 + ct) * Math.PI/2;\n\
\n\
  if(this.fromVector.y < 0 && this.curveAngle < 0) return (4 - ct) * Math.PI/2;\n\
  if(this.fromVector.y < 0 && this.curveAngle > 0) return (2 + ct) * Math.PI/2;\n\
};\n\
\n\
Edge.prototype.getCurveOffsets = function(fromOffsetX, fromOffsetY, toOffsetX, toOffsetY) {\n\
  var elbow = this.getCurveElbow();\n\
  var xOffset = 0, yOffset = 0;\n\
\n\
  if(elbow && elbow.y === this.fromVertex.y) {\n\
    yOffset = fromOffsetY;\n\
    xOffset = toOffsetX;\n\
  }\n\
  else if(elbow && elbow.x === this.fromVertex.x) {\n\
    yOffset = toOffsetY;\n\
    xOffset = fromOffsetX;\n\
  }\n\
\n\
  return {\n\
    x: xOffset,\n\
    y: yOffset\n\
  };\n\
};\n\
\n\
\n\
Edge.prototype.pointAlongEdgeCurveX = function(t, r) {\n\
  var dx = this.toVertex.x - this.fromVertex.x;\n\
  var dy = this.toVertex.y - this.fromVertex.y;\n\
  var len = Math.abs(dx) + Math.abs(dy) - 2 * r + Math.PI * r / 2;\n\
\n\
  var pos = t * len;\n\
  var curveStartPos = Math.abs(dx) - r, curveEndPos = len - (Math.abs(dy) - r);\n\
  if(pos <= curveStartPos) {\n\
    return {\n\
      x: this.fromVertex.x + (dx / Math.abs(dx)) * pos,\n\
      y: this.fromVertex.y\n\
    };\n\
  }\n\
  if(pos >= curveEndPos) {\n\
    return {\n\
      x: this.toVertex.x,\n\
      y: this.toVertex.y - (dy / Math.abs(dy)) * (len - pos)\n\
    };\n\
  }\n\
\n\
  var ct = (pos - curveStartPos) / (curveEndPos - curveStartPos);\n\
\n\
  var cx = this.toVertex.x - r * (dx / Math.abs(dx));\n\
  var cy = this.fromVertex.y + r * (dy / Math.abs(dy));\n\
  var theta = 0;\n\
\n\
  if(dx > 0 && dy > 0) theta = (3 + ct) * (Math.PI / 2);\n\
  if(dx > 0 && dy < 0) theta = (1 - ct) * (Math.PI / 2);\n\
  if(dx < 0 && dy > 0) theta = (3 - ct) * (Math.PI / 2);\n\
  if(dx < 0 && dy < 0) theta = (1 + ct) * (Math.PI / 2);\n\
\n\
  return {\n\
    x: cx + r * Math.cos(theta),\n\
    y: cy + r * Math.sin(theta)\n\
  };\n\
\n\
};\n\
\n\
\n\
Edge.prototype.getVector = function(vertex) {\n\
  if(vertex === this.fromVertex) return this.fromVector;\n\
  if(vertex === this.toVertex) return this.toVector;\n\
};\n\
\n\
\n\
/**\n\
 *  Gets the vertex opposite another vertex on an edge\n\
 */\n\
\n\
Edge.prototype.oppositeVertex = function(vertex) {\n\
  if (vertex === this.toVertex) return this.fromVertex;\n\
  if (vertex === this.fromVertex) return this.toVertex;\n\
  return null;\n\
};\n\
\n\
/**\n\
 *\n\
 */\n\
\n\
Edge.prototype.setPointLabelPosition = function(pos, skip) {\n\
  if (this.fromVertex.point !== skip) this.fromVertex.point.labelPosition = pos;\n\
  if (this.toVertex.point !== skip) this.toVertex.point.labelPosition = pos;\n\
\n\
  this.pointArray.forEach(function(point) {\n\
    if (point !== skip) point.labelPosition = pos;\n\
  });\n\
};\n\
\n\
/**\n\
 *\n\
 */\n\
\n\
Edge.prototype.toString = function() {\n\
  return this.fromVertex.point.getId() + '_' + this.toVertex.point.getId();\n\
};\n\
\n\
//# sourceURL=lib/graph/edge.js"
));

require.register("transitive/lib/graph/vertex.js", Function("exports, module",
"\n\
/**\n\
 * Expose `Vertex`\n\
 */\n\
\n\
module.exports = Vertex;\n\
\n\
/**\n\
 * Initialize new Vertex\n\
 *\n\
 * @param {Stop/Place}\n\
 * @param {Number}\n\
 * @param {Number}\n\
 */\n\
\n\
function Vertex(point, x, y) {\n\
  this.point = point;\n\
  this.point.graphVertex = this;\n\
  this.x = this.origX = x;\n\
  this.y = this.origY = y;\n\
  this.edges = [];\n\
}\n\
\n\
\n\
/**\n\
 * Move to new coordinate\n\
 *\n\
 * @param {Number}\n\
 * @param {Number}\n\
 */\n\
\n\
Vertex.prototype.moveTo = function(x, y) {\n\
  this.x = x;\n\
  this.y = y;\n\
  /*this.edges.forEach(function (edge) {\n\
    edge.calculateVectors();\n\
  });*/\n\
};\n\
\n\
\n\
/**\n\
 * Get array of edges incident to vertex. Allows specification of \"incoming\" edge that will not be included in results\n\
 *\n\
 * @param {Edge}\n\
 */\n\
\n\
Vertex.prototype.incidentEdges = function(inEdge) {\n\
\tvar results = [];\n\
\tthis.edges.forEach(function(edge) {\n\
\t\tif(edge !== inEdge) results.push(edge);\n\
\t});\n\
\treturn results;\n\
};\n\
\n\
\n\
/**\n\
 * Add an edge to the vertex's edge list\n\
 *\n\
 * @param {Edge}\n\
 */\n\
\n\
Vertex.prototype.addEdge = function(edge) {\n\
  var index = this.edges.indexOf(edge);\n\
  if(index === -1) this.edges.push(edge);\n\
};\n\
\n\
/**\n\
 * Remove an edge from the vertex's edge list\n\
 *\n\
 * @param {Edge}\n\
 */\n\
\n\
Vertex.prototype.removeEdge = function(edge) {\n\
  var index = this.edges.indexOf(edge);\n\
  if(index !== -1) this.edges.splice(index, 1);\n\
};\n\
//# sourceURL=lib/graph/vertex.js"
));

require.register("transitive/lib/styler/index.js", Function("exports, module",
"\n\
/**\n\
 * Dependencies\n\
 */\n\
\n\
var each = require(\"component~each@0.2.3\");\n\
var merge = require(\"cristiandouce~merge-util@0.1.0\");\n\
var styles = require(\"transitive/lib/styler/styles.js\");\n\
var StyleSheet = require(\"trevorgerhardt~stylesheet@master\");\n\
var svgAttributes = require(\"yields~svg-attributes@master\");\n\
\n\
/**\n\
 * Element Types\n\
 */\n\
\n\
var types = [ 'labels',\n\
              'segments',\n\
              'segments_front',\n\
              'segment_labels',\n\
              'segment_label_containers',\n\
              'stops_merged',\n\
              'stops_pattern',\n\
              'places',\n\
              'multipoints_merged',\n\
              'multipoints_pattern'\n\
            ];\n\
\n\
/**\n\
 * Add transform\n\
 */\n\
\n\
svgAttributes.push('transform');\n\
\n\
/**\n\
 * Expose `Styler`\n\
 */\n\
\n\
module.exports = Styler;\n\
\n\
/**\n\
 * Styler object\n\
 */\n\
\n\
function Styler(styles) {\n\
  if (!(this instanceof Styler)) return new Styler(styles);\n\
\n\
  // reset styles\n\
  this.reset();\n\
\n\
  // load styles\n\
  if (styles) this.load(styles);\n\
}\n\
\n\
/**\n\
 * Clear all current styles\n\
 */\n\
\n\
Styler.prototype.clear = function () {\n\
  types.forEach(function (type) {\n\
    this[type] = {};\n\
  }, this);\n\
};\n\
\n\
/**\n\
 * Reset to the predefined styles\n\
 */\n\
\n\
Styler.prototype.reset = function () {\n\
  types.forEach(function (type) {\n\
    this[type] = merge({}, styles[type]);\n\
  }, this);\n\
};\n\
\n\
/**\n\
 * Load rules\n\
 *\n\
 * @param {Object} a set of style rules\n\
 */\n\
\n\
Styler.prototype.load = function(styles) {\n\
  var self = this;\n\
  each(types, function(type) {\n\
    if (styles[type]) {\n\
      each(styles[type], function (key, val) {\n\
        self[type][key] = (self[type][key] || []).concat(val);\n\
      });\n\
    }\n\
  });\n\
};\n\
\n\
/**\n\
 * Render pattern\n\
 *\n\
 * @param {Display} display\n\
 * @param {Pattern} pattern\n\
 */\n\
\n\
Styler.prototype.renderSegment = function(display, segment) {\n\
  this.applyAttrAndStyle(\n\
    display,\n\
    segment.lineGraph,\n\
    this.segments\n\
  );\n\
  this.applyAttrAndStyle(\n\
    display,\n\
    segment.lineGraphFront,\n\
    this.segments_front\n\
  );\n\
};\n\
\n\
\n\
\n\
/**\n\
 * Render elements against these rules\n\
 *\n\
 * @param {Display} a D3 list of elements\n\
 * @param {Point} Transitive Point object\n\
 */\n\
\n\
Styler.prototype.renderPoint = function(display, point) {\n\
  if(point.getType() === 'STOP') this.renderStop(display, point);\n\
  if(point.getType() === 'PLACE') this.renderPlace(display, point);\n\
  if(point.getType() === 'MULTI') this.renderMultiPoint(display, point);\n\
};\n\
\n\
\n\
/**\n\
 * Render elements against these rules\n\
 *\n\
 * @param {Display} a D3 list of elements\n\
 * @param {Stop} Transitive Stop object\n\
 */\n\
\n\
Styler.prototype.renderStop = function(display, stop) {\n\
\n\
  this.applyAttrAndStyle(\n\
    display,\n\
    stop.patternMarkers,//stop.svgGroup.selectAll('.transitive-stop-marker-pattern'),\n\
    this.stops_pattern\n\
  );\n\
\n\
  this.applyAttrAndStyle(\n\
    display,\n\
    stop.mergedMarker,//svgGroup.selectAll('.transitive-stop-marker-merged'),\n\
    this.stops_merged\n\
  );\n\
\n\
  this.applyAttrAndStyle(\n\
    display,\n\
    stop.svgGroup.selectAll('.transitive-stop-label'),\n\
    this.labels\n\
  );\n\
};\n\
\n\
\n\
/**\n\
 * Render elements against these rules\n\
 *\n\
 * @param {Display} a D3 list of elements\n\
 * @param {Place} Transitive Place object\n\
 */\n\
\n\
Styler.prototype.renderPlace = function(display, place) {\n\
  this.applyAttrAndStyle(\n\
    display,\n\
    place.svgGroup.selectAll('.transitive-place-circle'),\n\
    this.places\n\
  );\n\
\n\
  this.applyAttrAndStyle(\n\
    display,\n\
    place.svgGroup.selectAll('.transitive-place-label'),\n\
    this.labels\n\
  );\n\
};\n\
\n\
\n\
/**\n\
 * Render elements against these rules\n\
 *\n\
 * @param {Display} a D3 list of elements\n\
 * @param {MultiPoint} Transitive MultiPoint object\n\
 */\n\
\n\
Styler.prototype.renderMultiPoint = function(display, multipoint) {\n\
\n\
  this.applyAttrAndStyle(\n\
    display,\n\
    multipoint.svgGroup.selectAll('.transitive-multipoint-marker-pattern'),\n\
    this.multipoints_pattern\n\
  );\n\
\n\
  this.applyAttrAndStyle(\n\
    display,\n\
    multipoint.svgGroup.selectAll('.transitive-multipoint-marker-merged'),\n\
    this.multipoints_merged\n\
  );\n\
\n\
  this.applyAttrAndStyle(\n\
    display,\n\
    multipoint.svgGroup.selectAll('.transitive-multi-label'),\n\
    this.labels\n\
  );\n\
};\n\
\n\
\n\
/**\n\
 * Render elements against these rules\n\
 *\n\
 * @param {Display} a D3 list of elements\n\
 * @param {Point} Transitive Point object\n\
 */\n\
\n\
Styler.prototype.renderPointLabel = function(display, point) {\n\
  if(point.getType() === 'STOP') this.renderStopLabel(display, point);\n\
  if(point.getType() === 'PLACE') this.renderPlaceLabel(display, point);\n\
  if(point.getType() === 'MULTI') this.renderMultiPointLabel(display, point);\n\
};\n\
\n\
\n\
/**\n\
 * Render elements against these rules\n\
 *\n\
 * @param {Display} a D3 list of elements\n\
 * @param {Stop} Transitive Stop object\n\
 */\n\
\n\
Styler.prototype.renderStopLabel = function(display, stop) {\n\
\n\
  this.applyAttrAndStyle(\n\
    display,\n\
    stop.svgGroup.selectAll('.transitive-stop-label'),\n\
    this.labels\n\
  );\n\
};\n\
\n\
\n\
/**\n\
 * Render elements against these rules\n\
 *\n\
 * @param {Display} a D3 list of elements\n\
 * @param {Place} Transitive Place object\n\
 */\n\
\n\
Styler.prototype.renderPlaceLabel = function(display, place) {\n\
\n\
  this.applyAttrAndStyle(\n\
    display,\n\
    place.svgGroup.selectAll('.transitive-place-label'),\n\
    this.labels\n\
  );\n\
};\n\
\n\
\n\
/**\n\
 * Render elements against these rules\n\
 *\n\
 * @param {Display} a D3 list of elements\n\
 * @param {MultiPoint} Transitive MultiPoint object\n\
 */\n\
\n\
Styler.prototype.renderMultiPointLabel = function(display, multipoint) {\n\
\n\
  this.applyAttrAndStyle(\n\
    display,\n\
    multipoint.svgGroup.selectAll('.transitive-multi-label'),\n\
    this.labels\n\
  );\n\
};\n\
\n\
\n\
Styler.prototype.renderSegmentLabel = function(display, segment) {\n\
\n\
  this.applyAttrAndStyle(\n\
    display,\n\
    segment.label.svgGroup.selectAll('.transitive-segment-label-container'),\n\
    this.segment_label_containers\n\
  );\n\
  this.applyAttrAndStyle(\n\
    display,\n\
    segment.label.svgGroup.selectAll('.transitive-segment-label'),\n\
    this.segment_labels\n\
  );\n\
};\n\
\n\
\n\
/**\n\
 * Check if it's an attribute or a style and apply accordingly\n\
 *\n\
 * @param {Display} the Display object\n\
 * @param {Object} a D3 list of elements\n\
 * @param {Object} the list of attributes\n\
 */\n\
\n\
Styler.prototype.applyAttrAndStyle = function(display, elements, attributes) {\n\
  var self = this;\n\
  each(attributes, function(name, rules) {\n\
    var fn = svgAttributes.indexOf(name) === -1\n\
      ? 'style'\n\
      : 'attr';\n\
\n\
    elements[fn](name, function(data, index) {\n\
      return self.compute(rules, display, data, index);\n\
    });\n\
  });\n\
};\n\
\n\
/**\n\
 * Compute a style rule based on the current display and data\n\
 *\n\
 * @param {Array} array of rules\n\
 * @param {Object} the Display object\n\
 * @param {Object} data associated with this object\n\
 * @param {Number} index of this object\n\
 */\n\
\n\
Styler.prototype.compute = function(rules, display, data, index) {\n\
  var computed, self = this;\n\
  each(rules, function(rule) {\n\
    var val = isFunction(rule)\n\
      ? rule.call(self, display, data, index, styles.utils)\n\
      : rule;\n\
    if (val !== undefined && val !== null) computed = val;\n\
  });\n\
  return computed;\n\
};\n\
\n\
/**\n\
 * Is function?\n\
 */\n\
\n\
function isFunction(val) {\n\
  return Object.prototype.toString.call(val) === '[object Function]';\n\
}\n\
\n\
//# sourceURL=lib/styler/index.js"
));

require.register("transitive/lib/styler/styles.js", Function("exports, module",
"\n\
/**\n\
 * Dependencies\n\
 */\n\
\n\
var d3 = require(\"mbostock~d3@v3.4.6\");\n\
\n\
/**\n\
 * Scales for utility functions to use\n\
 */\n\
\n\
var zoomScale = d3.scale.linear().domain([ 0.25, 1, 4 ]);\n\
var strokeScale = d3.scale.linear().domain([ 0.25, 1, 4 ]).range([ 5, 12, 19 ]);\n\
var fontScale = d3.scale.linear().domain([ 0.25, 1, 4 ]).range([ 10, 14, 18 ]);\n\
\n\
/**\n\
 * Scales for utility functions to use\n\
 */\n\
\n\
var notFocusedColor = '#e0e0e0';\n\
\n\
/**\n\
 * Expose `utils` for the style functions to use\n\
 */\n\
\n\
exports.utils = {\n\
  pixels: function(zoom, min, normal, max) {\n\
    return zoomScale.range([ min, normal, max ])(zoom);\n\
  },\n\
  strokeWidth: function(display) {\n\
    return strokeScale(display.zoom.scale());\n\
  },\n\
  fontSize: function(display, data) {\n\
    return fontScale(display.zoom.scale());\n\
  }\n\
};\n\
\n\
/**\n\
 * Default stop rules\n\
 */\n\
\n\
exports.stops_merged = {\n\
  fill: [\n\
    '#fff'\n\
  ],\n\
  stroke: [\n\
    '#000',\n\
    function (display, data, index, utils) {\n\
      if(!data.owner.isFocused()) return notFocusedColor;\n\
    }\n\
  ],\n\
  'stroke-width': [\n\
    2,\n\
  ]\n\
};\n\
\n\
exports.stops_pattern = {\n\
  cx: [\n\
    0\n\
  ],\n\
  cy: [\n\
    0\n\
  ],\n\
  fill: [\n\
    '#fff'\n\
  ],\n\
  r: [\n\
    4,\n\
    function (display, data, index, utils) {\n\
      return utils.pixels(display.zoom.scale(), 2, 4, 6.5);\n\
    },\n\
    function (display, data, index, utils) {\n\
      if (data.point.isEndPoint) {\n\
        var width = data.point.renderData.length * utils.strokeWidth(display) / 2;\n\
        return 1.75 * width;\n\
      }\n\
    },\n\
    function (display, data, index, utils) {\n\
      var busOnly = true;\n\
      data.point.patterns.forEach(function(pattern) {\n\
        if(pattern.route.route_type !== 3) busOnly = false;\n\
      });\n\
      if(busOnly && !data.point.isSegmentEndPoint) {\n\
        return 0.5 * utils.pixels(display.zoom.scale(), 2, 4, 6.5);\n\
      }\n\
    }\n\
  ],\n\
  stroke: [\n\
    '#000',\n\
    function (display, data) {\n\
      if(!data.point.focused || !data.point.isPatternFocused(data.segment.pattern.getId())) return notFocusedColor;\n\
      if (data.point.isEndPoint && data.path.parent.route && data.path.parent.route.route_color) {\n\
        return '#' + data.pattern.route.route_color;\n\
      } else if (data.path.parent.route && data.path.parent.route.route_color) {\n\
        return 'gray';\n\
      }\n\
    }\n\
  ],\n\
  'stroke-width': [\n\
    1,\n\
    function (display, data, index, utils) {\n\
      return utils.pixels(display.zoom.scale(), 0.5, 1, 1.5) + 'px';\n\
    },\n\
    function (display, data, index, utils) {\n\
      if (data.point.isSegmentEndPoint) {\n\
        return '2px';\n\
      }\n\
    }\n\
  ],\n\
  visibility: [ function(display, data) {\n\
    if(data.point.isSegmentEndPoint && data.point.patternCount > 1) return 'hidden';\n\
    if (data.point.renderData.length > 1) {\n\
      if (data.point.renderData[0].displayed && data.point.isEndPoint) return 'hidden';\n\
      data.point.renderData[0].displayed = true;\n\
    }\n\
  }]\n\
};\n\
\n\
\n\
\n\
/**\n\
 * Default place rules\n\
 */\n\
\n\
exports.places = {\n\
  cx: [\n\
    0\n\
  ],\n\
  cy: [\n\
    0,\n\
  ],\n\
  fill: [\n\
    '#fff',\n\
    function (display, data) {\n\
      if(!data.point.focused) return notFocusedColor;\n\
      if(data.point.getId() === 'from') return '#0f0';\n\
      if(data.point.getId() === 'to') return '#f00';\n\
    }\n\
  ],\n\
  r: [\n\
    10\n\
  ],\n\
  stroke: [\n\
    '#2EB1E6',\n\
    function (display, data) {\n\
      if(data.point.getId() === 'from' || data.point.getId() === 'to') return '#fff';\n\
    }\n\
  ],\n\
  'stroke-width': [\n\
    3\n\
  ],\n\
  visibility: [ function(display, data) {\n\
    return true;\n\
  }]\n\
};\n\
\n\
\n\
/**\n\
 * Default MultiPoint rules\n\
 */\n\
\n\
exports.multipoints_merged = {\n\
  fill: [\n\
    '#fff',\n\
    function (display, data) {\n\
      var point = data.owner;\n\
      if(point.containsFromPoint()) return '#0f0';\n\
      if(point.containsToPoint()) return '#f00';\n\
    }\n\
  ],\n\
  r: [\n\
    6,\n\
    function (display, data) {\n\
      var point = data.owner;\n\
      if(point.containsFromPoint() || point.containsToPoint()) return 10;\n\
    }\n\
  ],\n\
  stroke: [\n\
    '#000',\n\
    function (display, data) {\n\
      var point = data.owner;\n\
      if(point.containsFromPoint() || point.containsToPoint()) return '#fff';\n\
      if(!point.focused) return notFocusedColor;\n\
    }\n\
  ],\n\
  'stroke-width': [\n\
    4,\n\
    function (display, data) {\n\
      var point = data.owner;\n\
      if(point.containsFromPoint() || point.containsToPoint()) return 3;\n\
    }\n\
  ],\n\
  visibility: [ function(display, data) {\n\
    return 'visible';\n\
  }]\n\
};\n\
\n\
\n\
exports.multipoints_pattern = {\n\
  fill: [\n\
    '#fff'\n\
  ],\n\
  r: [\n\
    6\n\
  ],\n\
  stroke: [\n\
    '#000'\n\
  ],\n\
  'stroke-width': [\n\
    4\n\
  ],\n\
  visibility: [ function(display, data) {\n\
    return 'hidden';\n\
  }]\n\
};\n\
\n\
\n\
/**\n\
 * Default label rules\n\
 */\n\
\n\
exports.labels = {\n\
  color: [\n\
    '#1a1a1a'\n\
  ],\n\
  'font-family': [\n\
    '\\'Lato\\', sans-serif'\n\
  ],\n\
  'font-size': [\n\
    14,\n\
    function(display, data, index, utils) {\n\
      return utils.fontSize(display, data) + 'px';\n\
    }\n\
  ],\n\
  /*visibility: [\n\
    'hidden',\n\
    function (display, data) {\n\
      if(data.point.getType() === 'STOP' && data.point.isSegmentEndPoint) return 'visible';\n\
      if(data.point.getType() === 'MULTI' || data.point.getType() === 'PLACE') return 'visible';\n\
      /*if (display.zoom.scale() > 1) return 'visible';\n\
      if (display.zoom.scale() >= 0.6 && data.point && data.point.isBranchPoint) return 'visible';\n\
      if (display.zoom.scale() >= 0.4 && data.point && data.point.isSegmentEndPoint) return 'visible';\n\
    }\n\
  ],*/\n\
  /*'text-transform': [\n\
    'capitalize',\n\
    function (display, data) {\n\
      if (data.point && (data.point.isSegmentEndPoint || data.point.containsToPoint() || data.point.containsFromPoint())) return 'uppercase';\n\
    }\n\
  ]*/\n\
};\n\
\n\
/**\n\
 * All path segments\n\
 * TODO: update old route-pattern-specific code below\n\
 */\n\
\n\
exports.segments = {\n\
  stroke: [\n\
    '#008',\n\
    function (display, data) {\n\
      var segment = data;\n\
      if(!segment.focused) return notFocusedColor;\n\
      if(segment.type === 'TRANSIT') {\n\
        if(segment.pattern && segment.pattern.route) {\n\
          if(segment.pattern.route.route_short_name.toLowerCase().substring(0, 2) === 'dc') return '#f00';\n\
          return segment.pattern.route.getColor();\n\
        }\n\
      }\n\
      else if(segment.type === 'WALK') {\n\
        return '#444';\n\
      }\n\
    }\n\
  ],\n\
  'stroke-dasharray': [\n\
    false,\n\
    function (display, data) {\n\
      var segment = data;\n\
      if (segment.type !== 'TRANSIT') {\n\
        return '5, 5';\n\
      }\n\
\n\
      if (segment.frequency && segment.frequency.average < 12) {\n\
        if (segment.frequency.average > 6) return '12px, 12px';\n\
        return '12px, 2px';\n\
      }\n\
    }\n\
  ],\n\
  'stroke-width': [\n\
    '12px',\n\
    function (display, data, index, utils) {\n\
      var segment = data;\n\
      if (segment.type !== 'TRANSIT') {\n\
        return '5px';\n\
      }\n\
      if(segment.pattern.route.route_type === 3) {\n\
        return utils.pixels(display.zoom.scale(), 3, 6, 10) + 'px';\n\
      }\n\
      return utils.pixels(display.zoom.scale(), 5, 12, 19) + 'px';\n\
    }\n\
  ],\n\
  fill: [ 'none' ],\n\
  envelope: [\n\
    function (display, data, index, utils) {\n\
      var segment = data;\n\
      if (segment.type !== 'TRANSIT') {\n\
        return '5px';\n\
      }\n\
      if(segment.pattern && segment.pattern.route.route_type === 3) {\n\
        return utils.pixels(display.zoom.scale(), 9, 18, 30) + 'px';\n\
      }\n\
      return utils.pixels(display.zoom.scale(), 7, 14, 21) + 'px';\n\
    }\n\
  ]\n\
};\n\
\n\
\n\
exports.segments_front = {\n\
  stroke: [\n\
    '#008'\n\
  ],\n\
  'stroke-width': [\n\
    function(display, data, index, utils) {\n\
      return utils.pixels(display.zoom.scale(), 3, 6, 10)/2 + 'px';\n\
    }\n\
  ],\n\
  fill: [ 'none' ],\n\
  display : [\n\
    'none',\n\
    function(display, data, index, utils) {\n\
      if(data.pattern && data.pattern.route.route_type === 3 &&\n\
         data.pattern.route.route_short_name.toLowerCase().substring(0, 2) === 'dc') {\n\
        return 'inline';\n\
      }\n\
    }\n\
  ]\n\
};\n\
\n\
\n\
exports.segment_label_containers = {\n\
  fill: [\n\
    '#008',\n\
    function (display, data) {\n\
      if(!data.isFocused()) return notFocusedColor;\n\
    }\n\
  ],\n\
  stroke: [\n\
    '#f00'\n\
  ],\n\
  'stroke-width': [\n\
    function (display, data) {\n\
      if(data.parent.pattern && data.parent.pattern.route.route_short_name.toLowerCase().substring(0, 2) === 'dc') return 1;\n\
      return 0;\n\
    }\n\
  ],\n\
  rx: [\n\
    3\n\
  ],\n\
  ry: [\n\
    3\n\
  ]\n\
};\n\
\n\
\n\
exports.segment_labels = {\n\
  fill: [\n\
    '#fff'\n\
  ],\n\
  'font-family': [\n\
    '\\'Lato\\', sans-serif'\n\
  ],\n\
  'font-weight': [\n\
    'bold'\n\
  ],\n\
  'font-size': [\n\
    '13px'\n\
  ],\n\
  'vertical-align': [\n\
    'text-top'\n\
  ]\n\
\n\
};\n\
\n\
//# sourceURL=lib/styler/styles.js"
));

require.register("transitive/lib/point/index.js", Function("exports, module",
"var augment = require(\"javascript~augment@v4.0.1\");\n\
\n\
var PointLabel = require(\"transitive/lib/labeler/pointlabel.js\");\n\
\n\
\n\
var Point = augment(Object, function () {\n\
\n\
  this.constructor = function(data) {\n\
    for (var key in data) {\n\
      this[key] = data[key];\n\
    }\n\
\n\
    this.paths = [];\n\
    this.renderData = [];\n\
\n\
    this.label = new PointLabel(this);\n\
    this.renderLabel = true;\n\
\n\
    this.focused = true;\n\
    this.sortableType = 'POINT';\n\
  };\n\
\n\
\n\
  /**\n\
   * Get unique ID for point -- must be defined by subclass\n\
   */\n\
\n\
  this.getId = function() { };\n\
\n\
  this.getElementId = function() {\n\
    return this.getType().toLowerCase() + '-' + this.getId();\n\
  };\n\
\n\
\n\
  /**\n\
   * Get Point type -- must be defined by subclass\n\
   */\n\
\n\
  this.getType = function() { };\n\
\n\
\n\
  /**\n\
   * Get Point name\n\
   */\n\
\n\
  this.getName = function() {\n\
    return this.getType() + ' point (ID=' + this.getId() + ')';\n\
  };\n\
\n\
\n\
  /**\n\
   * Get latitude\n\
   */\n\
\n\
  this.getLat = function() {\n\
    return 0;\n\
  };\n\
\n\
\n\
  /**\n\
   * Get longitude\n\
   */\n\
\n\
  this.getLon = function() {\n\
    return 0;\n\
  };\n\
\n\
\n\
  /**\n\
   * Draw the point\n\
   *\n\
   * @param {Display} display\n\
   */\n\
\n\
  this.draw = function(display) { };\n\
\n\
\n\
  /**\n\
   * Refresh a previously drawn point\n\
   *\n\
   * @param {Display} display\n\
   */\n\
\n\
  this.refresh = function(display) { };\n\
\n\
  this.clearRenderData = function() { };\n\
\n\
  this.containsFromPoint = function() {\n\
    return false;\n\
  };\n\
\n\
  this.containsToPoint = function() {\n\
    return false;\n\
  };\n\
\n\
  this.initSvg = function(display) {\n\
    // set up the main svg group for this stop\n\
    this.svgGroup = display.svg.append('g')\n\
      .attr('id', 'transitive-' + this.getType().toLowerCase() + '-' + this.getId())\n\
      //.attr('class', 'transitive-sortable')\n\
      .datum(this);\n\
\n\
    this.markerSvg = this.svgGroup.append('g');\n\
    this.labelSvg = this.svgGroup.append('g');\n\
  };\n\
\n\
  //** Shared geom utility functions **//\n\
\n\
  this.constructMergedCircle = function(display, patternStylerKey) {\n\
    console.log('cmc: '+ this.getName());\n\
\n\
    var debug = (this.getId() === '5742');\n\
    var dataArray = this.getRenderDataArray();\n\
\n\
    var xValues = [], yValues = [];\n\
    dataArray.forEach(function(data) {\n\
      var x = display.xScale(data.x) + data.offsetX;\n\
      var y = display.yScale(data.y) - data.offsetY;\n\
      //if(debug) console.log(x + ', ' + y);\n\
      xValues.push(x);\n\
      yValues.push(y);\n\
    });\n\
    var minX = Math.min.apply(Math, xValues), minY = Math.min.apply(Math, yValues);\n\
    var maxX = Math.max.apply(Math, xValues), maxY = Math.max.apply(Math, yValues);\n\
    var baseRadius = Math.max( (maxX - minX), (maxY - minY) ) / 2;\n\
\n\
    var patternRadius = display.styler.compute(display.styler[patternStylerKey].r, display, { 'point': this });\n\
    var padding = parseFloat(patternRadius);//.substring(0, patternRadius.length - 2), 10) - 2;\n\
\n\
    return {\n\
      'cx': (minX+maxX)/2,\n\
      'cy': (minY+maxY)/2,\n\
      'r': baseRadius + padding\n\
    };\n\
  };\n\
\n\
  this.constructMergedPolygon = function(display, patternStylerKey) {\n\
\n\
    var dataArray = this.getRenderDataArray();\n\
\n\
    var xValues = [], yValues = [];\n\
    dataArray.forEach(function(data) {\n\
      var x = display.xScale(data.x) + data.offsetX;\n\
      var y = display.yScale(data.y) - data.offsetY;\n\
      xValues.push(x);\n\
      yValues.push(y);\n\
    });\n\
    var minX = Math.min.apply(Math, xValues), minY = Math.min.apply(Math, yValues);\n\
    var maxX = Math.max.apply(Math, xValues), maxY = Math.max.apply(Math, yValues);\n\
\n\
    var patternRadius = display.styler.compute(display.styler[patternStylerKey].r, display, { 'point': this });\n\
    var r = parseFloat(patternRadius); //.substring(0, patternRadius.length - 2), 10) - 2;\n\
\n\
    var x0, y0, x1, y1, x2, y2, x3, y3, pathStr;\n\
    var dx = maxX - minX;\n\
    var dy = maxY - minY;\n\
    var l = Math.sqrt(dx * dx + dy * dy);\n\
    if(l === 0) {\n\
      x0 = minX + r;\n\
      y0 = minY;\n\
      x1 = minX - r;\n\
      y1 = minY;\n\
      pathStr = 'M ' + x0 + ' ' + y0;\n\
      pathStr += ' A ' + r + ' ' + r + ' 0 0 0 ' + x1 + ' ' + y1;\n\
      pathStr += ' A ' + r + ' ' + r + ' 0 0 0 ' + x0 + ' ' + y0;\n\
      pathStr += ' Z';\n\
      return {\n\
        'd': pathStr\n\
      };\n\
    }\n\
\n\
    var vector = {\n\
      x: dx / l,\n\
      y: dy / l\n\
    };\n\
\n\
    var leftVector = {\n\
      x : -vector.y,\n\
      y : vector.x\n\
    };\n\
\n\
    var rightVector = {\n\
      x : vector.y,\n\
      y : -vector.x\n\
    };\n\
\n\
    x0 = minX + r * leftVector.x;\n\
    y0 = minY + r * leftVector.y;\n\
    x1 = maxX + r * leftVector.x;\n\
    y1 = maxY + r * leftVector.y;\n\
    x2 = maxX + r * rightVector.x;\n\
    y2 = maxY + r * rightVector.y;\n\
    x3 = minX + r * rightVector.x;\n\
    y3 = minY + r * rightVector.y;\n\
\n\
    pathStr = 'M ' + x0 + ' ' + y0;\n\
    pathStr += ' L ' + x1 + ' ' + y1;\n\
    pathStr += ' A ' + r + ' ' + r + ' 0 0 0 ' + x2 + ' ' + y2;\n\
    pathStr += ' L ' + x3 + ' ' + y3;\n\
    pathStr += ' A ' + r + ' ' + r + ' 0 0 0 ' + x0 + ' ' + y0;\n\
    pathStr += ' Z';\n\
    return {\n\
      'd': pathStr\n\
    };\n\
  };\n\
\n\
  \n\
  this.refreshLabel = function(display) {\n\
\n\
    if(!this.renderLabel) return; //|| !this.labelAnchor) return;\n\
    this.label.refresh(display);\n\
  };\n\
\n\
\n\
  this.getMarkerBBox = function() {\n\
    //console.log(this.markerSvg.node());\n\
    return this.markerSvg.node().getBBox();\n\
  };\n\
\n\
\n\
  this.setFocused = function(focused) {\n\
    this.focused = focused;\n\
  };\n\
\n\
\n\
  this.isFocused = function() {\n\
    return (this.focused === true);\n\
  };\n\
\n\
\n\
  this.getZIndex = function() {\n\
    return 10000;\n\
  };\n\
\n\
});\n\
\n\
\n\
/**\n\
 * Expose `Point`\n\
 */\n\
\n\
module.exports = Point;\n\
//# sourceURL=lib/point/index.js"
));

require.register("transitive/lib/point/stop.js", Function("exports, module",
"\n\
/**\n\
 * Dependencies\n\
 */\n\
\n\
var augment = require(\"javascript~augment@v4.0.1\");\n\
\n\
var Point = require(\"transitive/lib/point/index.js\");\n\
\n\
/**\n\
 *  Place: a Point subclass representing a 'place' that can be rendered on the\n\
 *  map. A place is a point *other* than a transit stop/station, e.g. a home/work\n\
 *  location, a point of interest, etc.\n\
 */\n\
\n\
var Stop = augment(Point, function(base) {\n\
\n\
  this.constructor =  function(data) {\n\
    base.constructor.call(this, data);\n\
\n\
    this.patterns = [];\n\
\n\
    // flag indicating whether this stop is the endpoint of a pattern\n\
    this.isEndPoint = false;\n\
\n\
    // flag indicating whether this stop is a point of convergence/divergence between 2+ patterns\n\
    this.isBranchPoint = false;\n\
\n\
    this.patternRenderData = {};\n\
    this.patternFocused = {};\n\
    this.patternCount = 0;\n\
    \n\
    this.mergedType = 'POLYGON';\n\
  };\n\
\n\
  /**\n\
   * Get id\n\
   */\n\
\n\
  this.getId = function() {\n\
    return this.stop_id;\n\
  };\n\
\n\
  /**\n\
   * Get type\n\
   */\n\
\n\
  this.getType = function() {\n\
    return 'STOP';\n\
  };\n\
\n\
\n\
  /**\n\
   * Get name\n\
   */\n\
\n\
  this.getName = function() {\n\
    return this.stop_name.replace('METRO STATION', '');\n\
  };\n\
\n\
\n\
  /**\n\
   * Get lat\n\
   */\n\
\n\
  this.getLat = function() {\n\
    return this.stop_lat;\n\
  };\n\
\n\
\n\
  /**\n\
   * Get lon\n\
   */\n\
\n\
  this.getLon = function() {\n\
    return this.stop_lon;\n\
  };\n\
\n\
\n\
  this.addPattern = function(pattern) {\n\
    if(this.patterns.indexOf(pattern) === -1) this.patterns.push(pattern);\n\
  };\n\
\n\
  /**\n\
   * Add render data\n\
   *\n\
   * @param {Object} stopInfo\n\
   */\n\
\n\
  this.addRenderData = function(stopInfo) {\n\
    if(stopInfo.segment.getType() === 'TRANSIT') {\n\
\n\
      var s = {\n\
        sortableType : 'POINT_STOP_PATTERN',\n\
        owner : this,\n\
        getZIndex : function() {\n\
          return this.segment.getZIndex() + 1;\n\
        }\n\
      };\n\
\n\
      for(var key in stopInfo)\n\
        s[key] = stopInfo[key];\n\
\n\
      this.patternRenderData[stopInfo.segment.pattern.pattern_id] = s;\n\
      this.addPattern(stopInfo.segment.pattern);\n\
      //console.log('added to '+ this.getName());\n\
      //console.log(stopInfo);\n\
    }\n\
    this.patternCount = Object.keys(this.patternRenderData).length;\n\
  };\n\
\n\
\n\
  this.isPatternFocused = function(patternId) {\n\
    if(!(patternId in this.patternFocused)) return true;\n\
    return(this.patternFocused[patternId]);\n\
  };\n\
\n\
  this.setPatternFocused = function(patternId, focused) {\n\
    this.patternFocused[patternId] = focused;\n\
  };\n\
\n\
\n\
  this.setAllPatternsFocused = function(focused) {\n\
    for(var key in this.patternRenderData) {\n\
      this.patternFocused[key] = focused;\n\
    }\n\
  };\n\
\n\
\n\
  /**\n\
   * Draw a stop\n\
   *\n\
   * @param {Display} display\n\
   */\n\
\n\
  this.draw = function(display) {\n\
\n\
    if(Object.keys(this.patternRenderData).length === 0) return;\n\
    //if (this.renderData.length === 0) return;\n\
\n\
    var renderDataArray = this.getRenderDataArray();\n\
\n\
    this.initSvg(display);\n\
\n\
    // set up a visible merged marker\n\
    if(this.patternCount > 1 && this.isSegmentEndPoint) {\n\
      if(this.mergedType === 'CIRCLE') {\n\
        this.mergedMarker = this.markerSvg.append('g').append('circle');\n\
      }\n\
      else if(this.mergedType === 'POLYGON') {\n\
        this.mergedMarker = this.markerSvg.append('g').append('path');\n\
      }\n\
    }\n\
    else { // create an invisible merged marker to serve as the label anchor only\n\
      this.mergedMarker = this.markerSvg.append('g').append('path')\n\
        .attr({ visibility: 'hidden' });\n\
    }\n\
\n\
    this.mergedMarker\n\
      .attr('class', 'transitive-sortable transitive-stop-marker-merged')\n\
      .datum(this.getMergedRenderData());\n\
\n\
    // set up the pattern-specific markers\n\
    this.patternMarkers = this.markerSvg.append('g').selectAll('circle')\n\
      .data(renderDataArray)\n\
      .enter()\n\
      .append('circle')\n\
      .attr('class', 'transitive-sortable transitive-stop-marker-pattern');\n\
\n\
  };\n\
\n\
  /**\n\
   * Refresh the stop\n\
   *\n\
   * @param {Display} display\n\
   */\n\
\n\
  this.refresh = function(display) {\n\
\n\
    if(this.patternCount === 0) return;\n\
\n\
    // refresh the pattern-level markers\n\
    this.patternMarkers.data(this.getRenderDataArray());\n\
    this.patternMarkers.attr('transform', function (d, i) {\n\
      var x = display.xScale(d.x) + d.offsetX;\n\
      var y = display.yScale(d.y) - d.offsetY;\n\
      return 'translate(' + x +', ' + y +')';\n\
    });\n\
\n\
    // refresh the merged marker\n\
    if(this.mergedMarker) {\n\
      this.mergedMarker.datum(this.getMergedRenderData());\n\
      if(this.mergedType === 'CIRCLE') {\n\
        this.mergedMarker.attr(this.constructMergedCircle(display, 'stops_pattern'));\n\
      }\n\
      else if(this.mergedType === 'POLYGON') {\n\
        this.mergedMarker.attr(this.constructMergedPolygon(display, 'stops_pattern'));\n\
      }\n\
    }\n\
\n\
  };\n\
\n\
  this.getMergedRenderData = function() {\n\
    return {\n\
      owner: this,\n\
      sortableType : 'POINT_STOP_MERGED'\n\
    };\n\
  };\n\
\n\
  this.getRenderDataArray = function() {\n\
    var dataArray = [];\n\
    for(var key in this.patternRenderData) {\n\
      dataArray.push(this.patternRenderData[key]);\n\
    }\n\
    return dataArray;\n\
  };\n\
\n\
  this.getMarkerBBox = function() {\n\
    //console.log('q');\n\
    if(this.mergedMarker) return this.mergedMarker.node().getBBox();\n\
    console.log(this.patternMarkers[0]);\n\
    return this.patternMarkers.node().getBBox();\n\
  };\n\
\n\
  this.isFocused = function() {\n\
    if(this.mergedMarker || !this.patternRenderData) return (this.focused === true);\n\
\n\
    var focused = true;\n\
    for(var key in this.patternRenderData) {\n\
      focused = this && this.isPatternFocused(this.patternRenderData[key].segment.pattern.getId());\n\
    }\n\
    return focused;\n\
  };\n\
\n\
});\n\
\n\
\n\
/**\n\
 * Expose `Stop`\n\
 */\n\
\n\
module.exports = Stop;\n\
\n\
//# sourceURL=lib/point/stop.js"
));

require.register("transitive/lib/point/place.js", Function("exports, module",
"\n\
/**\n\
 * Dependencies\n\
 */\n\
\n\
var augment = require(\"javascript~augment@v4.0.1\");\n\
var d3 = require(\"mbostock~d3@v3.4.6\");\n\
\n\
var Point = require(\"transitive/lib/point/index.js\");\n\
\n\
/**\n\
 *  Place: a Point subclass representing a 'place' that can be rendered on the\n\
 *  map. A place is a point *other* than a transit stop/station, e.g. a home/work\n\
 *  location, a point of interest, etc.\n\
 */\n\
\n\
var Place = augment(Point, function(base) {\n\
\n\
  /**\n\
   *  the constructor\n\
   */\n\
\n\
  this.constructor = function(data) {\n\
    base.constructor.call(this, data);\n\
  };\n\
\n\
\n\
  /**\n\
   * Get Type\n\
   */\n\
\n\
  this.getType = function() {\n\
    return 'PLACE';\n\
  };\n\
\n\
\n\
  /**\n\
   * Get ID\n\
   */\n\
\n\
  this.getId = function() {\n\
    return this.place_id;\n\
  };\n\
\n\
\n\
  /**\n\
   * Get Name\n\
   */\n\
\n\
  this.getName = function() {\n\
    return this.place_name;\n\
  };\n\
\n\
  /**\n\
   * Get lat\n\
   */\n\
\n\
  this.getLat = function() {\n\
    return this.place_lat;\n\
  };\n\
\n\
\n\
  /**\n\
   * Get lon\n\
   */\n\
\n\
  this.getLon = function() {\n\
    return this.place_lon;\n\
  };\n\
\n\
\n\
  this.containsFromPoint = function() {\n\
    return (this.getId() === 'from');\n\
  };\n\
\n\
\n\
  this.containsToPoint = function() {\n\
    return (this.getId() === 'to');\n\
  };\n\
\n\
\n\
  this.addRenderData = function(pointInfo) {\n\
    this.renderData = [ pointInfo ];\n\
  };\n\
\n\
\n\
  /**\n\
   * Draw a place\n\
   *\n\
   * @param {Display} display\n\
   */\n\
\n\
  this.draw = function(display) {\n\
    if (!this.renderData) return;\n\
\n\
    this.initSvg(display);\n\
    this.svgGroup\n\
      .attr('class', 'transitive-sortable')\n\
      .datum({\n\
        owner: this,\n\
        sortableType: 'POINT_PLACE'\n\
      });\n\
\n\
    // set up the markers\n\
    this.marker = this.markerSvg.selectAll('circle')\n\
      .data(this.renderData)\n\
      .enter()\n\
      .append('circle')\n\
      .attr('class', 'transitive-place-circle');\n\
\n\
  };\n\
\n\
  /**\n\
   * Refresh the place\n\
   *\n\
   * @param {Display} display\n\
   */\n\
\n\
  this.refresh = function(display) {\n\
    if (!this.renderData) return;\n\
\n\
    // refresh the pattern-level markers\n\
    this.marker.data(this.renderData);\n\
    this.marker.attr('transform', (function (d, i) {\n\
      var x = display.xScale(d.x) + d.offsetX;\n\
      var y = display.yScale(d.y) - d.offsetY;\n\
      return 'translate(' + x +', ' + y +')';\n\
    }).bind(this));\n\
\n\
  };\n\
});\n\
\n\
\n\
/**\n\
 * Expose `Place`\n\
 */\n\
\n\
module.exports = Place;\n\
\n\
\n\
//# sourceURL=lib/point/place.js"
));

require.register("transitive/lib/point/multipoint.js", Function("exports, module",
"\n\
/**\n\
 * Dependencies\n\
 */\n\
\n\
var augment = require(\"javascript~augment@v4.0.1\");\n\
\n\
var Point = require(\"transitive/lib/point/index.js\");\n\
\n\
/**\n\
 *  MultiPoint: a Point subclass representing a collection of multiple points\n\
 *  that have been merged into one for display purposes.\n\
 */\n\
\n\
var MultiPoint = augment(Point, function(base) {\n\
\n\
  this.constructor = function(pointArray) {\n\
    base.constructor.call(this);\n\
    this.points = [];\n\
    if(pointArray) {\n\
      pointArray.forEach(function(point) {\n\
        this.addPoint(point);\n\
      }, this);\n\
    }\n\
    this.mergedType = 'POLYGON';\n\
    this.renderData = [];\n\
    this.id = 'multi';\n\
    this.toPoint = this.fromPoint = null;\n\
  };\n\
\n\
  /**\n\
   * Get id\n\
   */\n\
\n\
  this.getId = function() {\n\
    return this.id;\n\
  };\n\
\n\
  /**\n\
   * Get type\n\
   */\n\
\n\
  this.getType = function() {\n\
    return 'MULTI';\n\
  };\n\
\n\
\n\
  this.getName = function() {\n\
    if(this.fromPoint) return this.fromPoint.getName();\n\
    if(this.toPoint) return this.toPoint.getName();\n\
    var shortest = null;\n\
    this.points.forEach(function(point) {\n\
      if(!shortest || point.getName().length < shortest.length) shortest = point.getName();\n\
    });\n\
    return shortest + ' AREA';\n\
  };\n\
\n\
\n\
  this.containsFromPoint = function() {\n\
    return (this.fromPoint !== null);\n\
  };\n\
\n\
\n\
  this.containsToPoint = function() {\n\
    return (this.toPoint !== null);\n\
  };\n\
\n\
\n\
  this.addPoint = function(point) {\n\
    if(this.points.indexOf(point) !== -1) return;\n\
    this.points.push(point);\n\
    this.id += '-' + point.getId();\n\
    if(point.containsFromPoint()) { // getType() === 'PLACE' && point.getId() === 'from') {\n\
      this.fromPoint = point;\n\
    }\n\
    if(point.containsToPoint()) { // getType() === 'PLACE' && point.getId() === 'to') {\n\
      this.toPoint = point;\n\
    }\n\
  };\n\
\n\
\n\
  /**\n\
   * Add render data\n\
   *\n\
   * @param {Object} stopInfo\n\
   */\n\
\n\
  this.addRenderData = function(pointInfo) {\n\
    if(pointInfo.offsetX !== 0 || pointInfo.offsetY !==0) this.hasOffsetPoints = true;\n\
    this.renderData.push(pointInfo);\n\
  };\n\
\n\
\n\
  this.clearRenderData = function() {\n\
    this.hasOffsetPoints = false;\n\
    this.renderData = [];\n\
  };\n\
\n\
\n\
  /**\n\
   * Draw a multipoint\n\
   *\n\
   * @param {Display} display\n\
   */\n\
\n\
  this.draw = function(display) {\n\
\n\
    if (!this.renderData) return;\n\
\n\
    // set up the main svg group for this stop\n\
    this.initSvg(display);\n\
    this.svgGroup\n\
      .attr('class', 'transitive-sortable')\n\
      .datum({\n\
        owner: this,\n\
        sortableType: 'POINT_MULTI'\n\
      });\n\
\n\
    this.initMergedMarker(display);\n\
\n\
    // set up the pattern markers\n\
    /*this.marker = this.markerSvg.selectAll('circle')\n\
      .data(this.renderData)\n\
      .enter()\n\
      .append('circle')\n\
      .attr('class', 'transitive-multipoint-marker-pattern');*/\n\
  };\n\
\n\
\n\
  this.initMergedMarker = function(display) {\n\
    // set up the merged marker\n\
    if(this.fromPoint || this.toPoint) {\n\
      this.mergedMarker = this.markerSvg.append('g').append('circle')\n\
        .datum({ owner : this })\n\
        .attr('class', 'transitive-multipoint-marker-merged');\n\
    }\n\
    else if(this.hasOffsetPoints || this.renderData.length > 1) {\n\
      if(this.mergedType === 'CIRCLE') {\n\
        this.mergedMarker = this.markerSvg.append('g').append('circle')\n\
          .datum({ owner : this })\n\
          .attr('class', 'transitive-multipoint-marker-merged');\n\
      }\n\
      else if(this.mergedType === 'POLYGON') {\n\
        this.mergedMarker = this.markerSvg.append('g').append('path')\n\
          .datum({ owner : this })\n\
          .attr('class', 'transitive-multipoint-marker-merged');\n\
      }\n\
    }\n\
  };\n\
\n\
\n\
  /**\n\
   * Refresh the point\n\
   *\n\
   * @param {Display} display\n\
   */\n\
\n\
  this.refresh = function(display) {\n\
    if (!this.renderData) return;\n\
\n\
    var data;\n\
    // refresh the merged marker\n\
    if(this.mergedMarker) {\n\
      if(this.fromPoint || this.toPoint) {\n\
        data = this.renderData[0];\n\
        this.mergedMarker\n\
          .attr({\n\
            'cx' : display.xScale(data.x) + data.offsetX,\n\
            'cy' : display.yScale(data.y) - data.offsetY\n\
          });\n\
      }\n\
      else {\n\
        if(this.mergedType === 'CIRCLE') {\n\
          this.mergedMarker\n\
            .datum({ owner : this })\n\
            .attr(this.constructMergedCircle(display, 'multipoints_pattern'));\n\
        }\n\
        else if(this.mergedType === 'POLYGON') {\n\
          this.mergedMarker\n\
            .datum({ owner : this })\n\
            .attr(this.constructMergedPolygon(display, 'multipoints_pattern'));\n\
        }\n\
      }\n\
    }\n\
\n\
    \n\
    /*var cx, cy;\n\
    // refresh the pattern-level markers\n\
    this.marker.data(this.renderData);\n\
    this.marker.attr('transform', function (d, i) {\n\
      cx = d.x;\n\
      cy = d.y;\n\
      var x = display.xScale(d.x) + d.offsetX;\n\
      var y = display.yScale(d.y) - d.offsetY;\n\
      return 'translate(' + x +', ' + y +')';\n\
    });*/\n\
\n\
  };\n\
\n\
  this.getRenderDataArray = function() {\n\
    return this.renderData;\n\
  };\n\
});\n\
\n\
/**\n\
 * Expose `MultiPoint`\n\
 */\n\
\n\
module.exports = MultiPoint;\n\
//# sourceURL=lib/point/multipoint.js"
));

require.register("transitive/lib/labeler/index.js", Function("exports, module",
"\n\
/**\n\
 * Dependencies\n\
 */\n\
\n\
var augment = require(\"javascript~augment@v4.0.1\");\n\
var d3 = require(\"mbostock~d3@v3.4.6\");\n\
\n\
\n\
/**\n\
 * Labeler object\n\
 */\n\
\n\
var Labeler = augment(Object, function () {\n\
\n\
  this.constructor = function(transitive) {\n\
\n\
    this.transitive = transitive;\n\
    this.points = [];\n\
\n\
  };\n\
\n\
\n\
  this.updateLabelList = function() {\n\
\n\
    this.points = [];\n\
    this.transitive.graph.vertices.forEach(function(vertex) {\n\
      var point = vertex.point;\n\
      if(point.getType() === 'PLACE' || point.getType() === 'MULTI' || (point.getType() === 'STOP' && point.isSegmentEndPoint)) {\n\
        this.points.push(point);\n\
      }\n\
    }, this);\n\
\n\
    this.points.sort(function compare(a, b) {\n\
      if (a.containsFromPoint() || a.containsToPoint()) return -1;\n\
      if (b.containsFromPoint() || b.containsToPoint()) return 1;\n\
      return 0;\n\
    });\n\
  };\n\
\n\
\n\
  this.updateQuadtree = function() {\n\
\n\
    this.quadtree = d3.geom.quadtree().extent([[-this.width, -this.height], [this.width*2, this.height*2]])([]);\n\
\n\
    this.points.forEach(function(point) {\n\
      this.addBBoxToQuadtree(point.getMarkerBBox());\n\
    }, this);\n\
\n\
    var disp = this.transitive.display;\n\
    this.transitive.renderSegments.forEach(function(segment) {\n\
\n\
      if(segment.getType() !== 'TRANSIT') return;\n\
\n\
      var lw = this.transitive.style.compute(this.transitive.style.segments['stroke-width'], this.transitive.display, segment);\n\
      lw = parseFloat(lw.substring(0, lw.length - 2), 10) - 2;\n\
\n\
      var x, x1, x2, y, y1, y2;\n\
      if(segment.renderData.length === 2) { // basic straight segment\n\
        if(segment.renderData[0].x === segment.renderData[1].x) { // vertical\n\
          x = disp.xScale(segment.renderData[0].x) + segment.renderData[0].offsetX - lw / 2;\n\
          y1 = disp.yScale(segment.renderData[0].y);\n\
          y2 = disp.yScale(segment.renderData[1].y);\n\
          this.addBBoxToQuadtree({\n\
            x : x,\n\
            y : Math.min(y1, y2),\n\
            width : lw,\n\
            height: Math.abs(y1 - y2)\n\
          });\n\
        }\n\
        else if(segment.renderData[0].y === segment.renderData[1].y) { // horizontal\n\
          x1 = disp.xScale(segment.renderData[0].x);\n\
          x2 = disp.xScale(segment.renderData[1].x);\n\
          y = disp.yScale(segment.renderData[0].y) - segment.renderData[0].offsetY - lw / 2;\n\
          this.addBBoxToQuadtree({\n\
            x : Math.min(x1, x2),\n\
            y : y,\n\
            width : Math.abs(x1 - x2),\n\
            height: lw\n\
          });\n\
        }\n\
      }\n\
\n\
      if(segment.renderData.length === 4) { // basic curved segment\n\
\n\
        if(segment.renderData[0].x === segment.renderData[1].x) { // vertical first\n\
          x = disp.xScale(segment.renderData[0].x) + segment.renderData[0].offsetX - lw / 2;\n\
          y1 = disp.yScale(segment.renderData[0].y);\n\
          y2 = disp.yScale(segment.renderData[3].y);\n\
          this.addBBoxToQuadtree({\n\
            x : x,\n\
            y : Math.min(y1, y2),\n\
            width : lw,\n\
            height: Math.abs(y1 - y2)\n\
          });\n\
\n\
          x1 = disp.xScale(segment.renderData[0].x);\n\
          x2 = disp.xScale(segment.renderData[3].x);\n\
          y = disp.yScale(segment.renderData[3].y) - segment.renderData[3].offsetY - lw / 2;\n\
          this.addBBoxToQuadtree({\n\
            x : Math.min(x1, x2),\n\
            y : y,\n\
            width : Math.abs(x1 - x2),\n\
            height: lw\n\
          });\n\
\n\
        }\n\
        else if(segment.renderData[0].y === segment.renderData[1].y) { // horiz first\n\
          x1 = disp.xScale(segment.renderData[0].x);\n\
          x2 = disp.xScale(segment.renderData[3].x);\n\
          y = disp.yScale(segment.renderData[0].y) - segment.renderData[0].offsetY - lw / 2;\n\
          this.addBBoxToQuadtree({\n\
            x : Math.min(x1, x2),\n\
            y : y,\n\
            width : Math.abs(x1 - x2),\n\
            height: lw\n\
          });\n\
\n\
          x = disp.xScale(segment.renderData[3].x) + segment.renderData[3].offsetX - lw / 2;\n\
          y1 = disp.yScale(segment.renderData[0].y);\n\
          y2 = disp.yScale(segment.renderData[3].y);\n\
          this.addBBoxToQuadtree({\n\
            x : x,\n\
            y : Math.min(y1, y2),\n\
            width : lw,\n\
            height: Math.abs(y1 - y2)\n\
          });\n\
        }\n\
      }\n\
\n\
    }, this);\n\
  };\n\
\n\
  this.addBBoxToQuadtree = function(bbox) {\n\
    //console.log(bbox);\n\
    this.quadtree.add([bbox.x + bbox.width/2, bbox.y + bbox.height/2, bbox]);\n\
\n\
    this.maxBBoxWidth = Math.max(this.maxBBoxWidth, bbox.width);\n\
    this.maxBBoxHeight = Math.max(this.maxBBoxHeight, bbox.height);\n\
  };\n\
\n\
\n\
  this.doLayout = function() {\n\
\n\
    this.width = this.transitive.el.clientWidth;\n\
    this.height = this.transitive.el.clientHeight;\n\
\n\
    this.maxBBoxWidth = 0;\n\
    this.maxBBoxHeight = 0;\n\
\n\
    this.updateQuadtree();\n\
\n\
    var labeledSegments = this.placeSegmentLabels();\n\
    var labeledPoints = this.placePointLabels();\n\
    \n\
    return {\n\
      segments: labeledSegments,\n\
      points: labeledPoints\n\
    };\n\
  };\n\
\n\
\n\
  this.placeSegmentLabels = function() {\n\
\n\
    var styler = this.transitive.style;\n\
\n\
    var labeledSegments = [];\n\
\n\
    this.transitive.renderSegments.forEach(function(segment) {\n\
      if(segment.getType() === 'TRANSIT' && segment.pattern.route.route_type === 3) {\n\
  \n\
        var labelText = segment.label.getText();\n\
        var fontFamily = styler.compute(styler.segment_labels['font-family'], this.transitive.display, {segment: segment});\n\
        var fontSize = styler.compute(styler.segment_labels['font-size'], this.transitive.display, {segment: segment});\n\
        var textBBox = this.getTextBBox(labelText, {\n\
          'font-size' : fontSize,\n\
          'font-family' : fontFamily,\n\
        });\n\
        segment.label.textWidth = textBBox.width;\n\
        segment.label.textHeight = textBBox.height;\n\
        var labelAnchors = segment.getLabelAnchors(this.transitive.display);\n\
        segment.label.labelAnchor = labelAnchors[0]; /*{\n\
          x : this.transitive.display.xScale(segment.renderData[0].x) + segment.renderData[0].offsetX,\n\
          y : this.transitive.display.yScale(segment.renderData[0].y) - segment.renderData[0].offsetY\n\
        };*/\n\
\n\
        labeledSegments.push(segment);\n\
\n\
        this.quadtree.add([segment.label.labelAnchor.x, segment.label.labelAnchor.y, segment.label]);\n\
\n\
      }\n\
    }, this);\n\
\n\
    return labeledSegments;\n\
  };\n\
\n\
\n\
  this.placePointLabels = function() {\n\
\n\
    var styler = this.transitive.style;\n\
\n\
    var labeledPoints = [];\n\
\n\
    this.points.forEach(function(point) {\n\
\n\
      //console.log(' ' + point.getName());\n\
      var labelText = point.label.getText();\n\
      var fontFamily = styler.compute(styler.labels['font-family'], this.transitive.display, {point: point});\n\
      var fontSize = styler.compute(styler.labels['font-size'], this.transitive.display, {point: point});\n\
      var textBBox = this.getTextBBox(labelText, {\n\
        'font-size' : fontSize,\n\
        'font-family' : fontFamily,\n\
      });\n\
      point.label.textWidth = textBBox.width;\n\
      point.label.textHeight = textBBox.height;\n\
\n\
      var orientations = ['E', 'W', 'NE', 'SE', 'NW', 'SW', 'N', 'S'];\n\
\n\
      var placedLabel = false;\n\
      for(var i = 0; i < orientations.length; i++) {\n\
        \n\
        point.label.setOrientation(orientations[i]);\n\
        if(!point.focused) continue;\n\
        \n\
        if(!point.label.labelAnchor) continue;\n\
\n\
        var lx = point.label.labelAnchor.x, ly = point.label.labelAnchor.y;\n\
\n\
        // do not place label if out of range\n\
        if(lx <= 0 || ly <= 0 || lx >= this.width || ly > this.height) continue;\n\
        \n\
\n\
        var labelBBox = point.label.getBBox();\n\
\n\
        var overlaps = this.findOverlaps(point.label, labelBBox);\n\
\n\
        // do not place label if it overlaps with others\n\
        if(overlaps.length > 0) continue;\n\
\n\
        // if we reach this point, the label is good to place\n\
\n\
        point.label.setVisibility(true);\n\
        labeledPoints.push(point);\n\
\n\
        this.quadtree.add([labelBBox.x + labelBBox.width/2, labelBBox.y + labelBBox.height/2, point.label]);\n\
\n\
        this.maxBBoxWidth = Math.max(this.maxBBoxWidth, labelBBox.width);\n\
        this.maxBBoxHeight = Math.max(this.maxBBoxHeight, labelBBox.height);\n\
\n\
        placedLabel = true;\n\
        break; // do not consider any other orientations after places\n\
\n\
      } // end of orientation loop\n\
\n\
      // if label not placed at all, hide the element\n\
      if(!placedLabel) {\n\
        point.label.setVisibility(false);\n\
      }\n\
\n\
    }, this);\n\
    \n\
    return labeledPoints;\n\
  };\n\
\n\
  this.findOverlaps = function(label, labelBBox) {\n\
    var minX = labelBBox.x - this.maxBBoxWidth/2;\n\
    var minY = labelBBox.y - this.maxBBoxHeight/2;\n\
    var maxX = labelBBox.x + labelBBox.width + this.maxBBoxWidth/2;\n\
    var maxY = labelBBox.y + labelBBox.height + this.maxBBoxHeight/2;\n\
\n\
    var matchItems = [];\n\
    this.quadtree.visit(function(node, x1, y1, x2, y2) {\n\
      var p = node.point;\n\
      if((p) && (p[0] >= minX) && (p[0] < maxX) && (p[1] >= minY) && (p[1] < maxY) && label.intersects(p[2])) {\n\
        matchItems.push(p[2]);\n\
      }\n\
      return x1 > maxX || y1 > maxY || x2 < minX || y2 < minY;\n\
    });\n\
    return matchItems;\n\
  };\n\
\n\
  this.getTextBBox = function(text, attrs) {\n\
    var container = d3.select('body').append('svg');\n\
    container.append('text')\n\
      .attr({ x: -1000, y: -1000 })\n\
      .attr(attrs)\n\
      .text(text);\n\
    var bbox = container.node().getBBox();\n\
    container.remove();\n\
\n\
    return { height: bbox.height, width: bbox.width };\n\
  };\n\
\n\
});\n\
\n\
\n\
/**\n\
 * Expose `Labeler`\n\
 */\n\
\n\
module.exports = Labeler;\n\
//# sourceURL=lib/labeler/index.js"
));

require.register("transitive/lib/labeler/label.js", Function("exports, module",
"\n\
/**\n\
 * Dependencies\n\
 */\n\
\n\
var augment = require(\"javascript~augment@v4.0.1\");\n\
\n\
\n\
/**\n\
 * Label object\n\
 */\n\
\n\
var Label = augment(Object, function () {\n\
\n\
  this.constructor = function(parent) {\n\
    this.parent = parent;\n\
    this.sortableType = 'LABEL';\n\
  };\n\
\n\
\n\
  this.getText = function() {\n\
    if(!this.labelText) this.labelText = this.initText();\n\
    return this.labelText;\n\
  };\n\
\n\
\n\
  this.initText = function() {\n\
    return this.parent.getName();\n\
  };\n\
\n\
\n\
  this.render = function() {\n\
  };\n\
\n\
\n\
  this.refresh = function() {\n\
  };\n\
\n\
\n\
  this.setVisibility = function(visibility) {\n\
    if(this.svgGroup) this.svgGroup.attr('visibility', visibility ? 'visible' : 'hidden');\n\
  };\n\
\n\
\n\
  this.getBBox = function() {\n\
    return null;\n\
  };\n\
\n\
\n\
  this.intersects = function(obj) {\n\
    return null;\n\
  };\n\
\n\
\n\
  this.intersectsBBox = function(bbox) {\n\
    var thisBBox = this.getBBox(this.orientation);\n\
    var r = (thisBBox.x <= bbox.x + bbox.width &&\n\
            bbox.x <= thisBBox.x + thisBBox.width &&\n\
            thisBBox.y <= bbox.y + bbox.height &&\n\
            bbox.y <= thisBBox.y + thisBBox.height);\n\
    return r;\n\
  };\n\
\n\
\n\
  this.isFocused = function() {\n\
    return this.parent.isFocused();\n\
  };\n\
\n\
\n\
  this.getZIndex = function() {\n\
    return 20000;\n\
  };\n\
\n\
});\n\
\n\
\n\
/**\n\
 * Expose `Label`\n\
 */\n\
\n\
module.exports = Label;\n\
//# sourceURL=lib/labeler/label.js"
));

require.register("transitive/lib/labeler/pointlabel.js", Function("exports, module",
"\n\
/**\n\
 * Dependencies\n\
 */\n\
\n\
var augment = require(\"javascript~augment@v4.0.1\");\n\
\n\
var Label = require(\"transitive/lib/labeler/label.js\");\n\
\n\
\n\
/**\n\
 * Label object\n\
 */\n\
\n\
var PointLabel = augment(Label, function(base) {\n\
\n\
  this.constructor = function(parent) {\n\
\n\
    base.constructor.call(this, parent);\n\
\n\
    this.labelAngle = 0;\n\
    this.labelPosition = 1;\n\
  };\n\
\n\
\n\
  this.initText = function() {\n\
    return this.transformText(this.parent.getName());\n\
  };\n\
\n\
\n\
  this.render = function() {\n\
    this.svgGroup = this.parent.labelSvg.append('g');\n\
\n\
    var typeStr = this.parent.getType().toLowerCase();\n\
\n\
    this.mainLabel = this.svgGroup.append('text')\n\
      .datum({ point: this.parent })\n\
      .attr('id', 'transitive-' + typeStr + '-label-' + this.parent.getId())\n\
      .text(this.getText())\n\
      .attr('class', 'transitive-' + typeStr + '-label');\n\
  };\n\
\n\
\n\
  this.refresh = function() {\n\
    if(!this.labelAnchor) return;\n\
\n\
    if(!this.svgGroup) this.render();\n\
\n\
    this.svgGroup\n\
      .attr('text-anchor', this.labelPosition > 0 ? 'start' : 'end')\n\
      //.attr('visibility', this.visibility ? 'visible' : 'hidden')\n\
      .attr('transform', (function (d, i) {\n\
        return 'translate(' + this.labelAnchor.x +',' + this.labelAnchor.y +')';\n\
      }).bind(this));\n\
\n\
    this.mainLabel\n\
      .attr('transform', (function (d, i) {\n\
        return 'rotate(' + this.labelAngle + ', 0, 0)';\n\
      }).bind(this));\n\
  };\n\
\n\
\n\
  this.setOrientation = function(orientation) {\n\
    //console.log('lab anch: '+ this.parent.getName());\n\
    this.orientation = orientation;\n\
\n\
    var markerBBox = this.parent.getMarkerBBox();\n\
    if(!markerBBox) return;\n\
\n\
    var x, y;\n\
    var offset = 5;\n\
\n\
    if(orientation === 'E') {\n\
      x = markerBBox.x + markerBBox.width + offset;\n\
      y = markerBBox.y + markerBBox.height / 2;\n\
      this.labelPosition = 1;\n\
      this.labelAngle = 0;\n\
    }\n\
\n\
    else if(orientation === 'W') {\n\
      x = markerBBox.x - offset;\n\
      y = markerBBox.y + markerBBox.height / 2;\n\
      this.labelPosition = -1;\n\
      this.labelAngle = 0;\n\
    }\n\
\n\
    else if(orientation === 'NE') {\n\
      x = markerBBox.x + markerBBox.width + offset;\n\
      y = markerBBox.y - offset;\n\
      this.labelPosition = 1;\n\
      this.labelAngle = -45;\n\
    }\n\
\n\
    else if(orientation === 'SE') {\n\
      x = markerBBox.x + markerBBox.width + offset;\n\
      y = markerBBox.y + markerBBox.height + offset;\n\
      this.labelPosition = 1;\n\
      this.labelAngle = 45;\n\
    }\n\
\n\
    else if(orientation === 'NW') {\n\
      x = markerBBox.x - offset;\n\
      y = markerBBox.y - offset;\n\
      this.labelPosition = -1;\n\
      this.labelAngle = 45;\n\
    }\n\
\n\
    else if(orientation === 'SW') {\n\
      x = markerBBox.x - offset;\n\
      y = markerBBox.y + markerBBox.height + offset;\n\
      this.labelPosition = -1;\n\
      this.labelAngle = -45;\n\
    }\n\
\n\
    else if(orientation === 'N') {\n\
      x = markerBBox.x + markerBBox.width / 2;\n\
      y = markerBBox.y - offset;\n\
      this.labelPosition = 1;\n\
      this.labelAngle = -90;\n\
    }\n\
\n\
    else if(orientation === 'S') {\n\
      x = markerBBox.x + markerBBox.width / 2;\n\
      y = markerBBox.y + markerBBox.height + offset;\n\
      this.labelPosition = -1;\n\
      this.labelAngle = -90;\n\
    }\n\
\n\
    this.labelAnchor = { x : x, y : y };\n\
  };\n\
\n\
\n\
  this.getBBox = function() {\n\
\n\
    if(this.orientation === 'E') {\n\
      return {\n\
        x : this.labelAnchor.x,\n\
        y : this.labelAnchor.y - this.textHeight,\n\
        width : this.textWidth,\n\
        height : this.textHeight\n\
      };\n\
    }\n\
\n\
    if(this.orientation === 'W') {\n\
      return {\n\
        x : this.labelAnchor.x - this.textWidth,\n\
        y : this.labelAnchor.y - this.textHeight,\n\
        width : this.textWidth,\n\
        height : this.textHeight\n\
      };\n\
    }\n\
\n\
    if(this.orientation === 'N') {\n\
      return {\n\
        x : this.labelAnchor.x - this.textHeight,\n\
        y : this.labelAnchor.y - this.textWidth,\n\
        width : this.textHeight,\n\
        height : this.textWidth\n\
      };\n\
    }\n\
\n\
    if(this.orientation === 'S') {\n\
      return {\n\
        x : this.labelAnchor.x - this.textHeight,\n\
        y : this.labelAnchor.y,\n\
        width : this.textHeight,\n\
        height : this.textWidth\n\
      };\n\
    }\n\
\n\
    var bboxSide = this.textWidth * Math.sqrt(2)/2;\n\
    \n\
    if(this.orientation === 'NE') {\n\
      return {\n\
        x : this.labelAnchor.x,\n\
        y : this.labelAnchor.y - bboxSide,\n\
        width : bboxSide,\n\
        height : bboxSide\n\
      };\n\
    }\n\
\n\
    if(this.orientation === 'SE') {\n\
      return {\n\
        x : this.labelAnchor.x,\n\
        y : this.labelAnchor.y,\n\
        width : bboxSide,\n\
        height : bboxSide\n\
      };\n\
    }\n\
\n\
    if(this.orientation === 'NW') {\n\
      return {\n\
        x : this.labelAnchor.x - bboxSide,\n\
        y : this.labelAnchor.y - bboxSide,\n\
        width : bboxSide,\n\
        height : bboxSide\n\
      };\n\
    }\n\
\n\
    if(this.orientation === 'SW') {\n\
      return {\n\
        x : this.labelAnchor.x - bboxSide,\n\
        y : this.labelAnchor.y,\n\
        width : bboxSide,\n\
        height : bboxSide\n\
      };\n\
    }\n\
\n\
  };\n\
\n\
\n\
  this.intersects = function(obj) {\n\
    if(obj instanceof Label) {\n\
      // todo: handle label-label intersection for diagonally placed labels separately\n\
      return this.intersectsBBox(obj.getBBox());\n\
    }\n\
    else if(obj.x && obj.y && obj.width && obj.height) {\n\
      return this.intersectsBBox(obj);\n\
    }\n\
\n\
    return false;\n\
  };\n\
\n\
\n\
  this.transformText = function(str) {\n\
    // basic 'title case' for now\n\
    return str.replace(/\\w\\S*/g, function(txt) {\n\
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();\n\
    });\n\
  };\n\
\n\
});\n\
\n\
\n\
/**\n\
 * Expose `PointLabel`\n\
 */\n\
\n\
module.exports = PointLabel;\n\
//# sourceURL=lib/labeler/pointlabel.js"
));

require.register("transitive/lib/labeler/segmentlabel.js", Function("exports, module",
"\n\
/**\n\
 * Dependencies\n\
 */\n\
\n\
var augment = require(\"javascript~augment@v4.0.1\");\n\
\n\
var Label = require(\"transitive/lib/labeler/label.js\");\n\
\n\
\n\
/**\n\
 * SegmentLabel object\n\
 */\n\
\n\
var SegmentLabel = augment(Label, function(base) {\n\
\n\
  this.constructor = function(parent) {\n\
\n\
    base.constructor.call(this, parent);\n\
\n\
  };\n\
\n\
\n\
  this.initText = function() {\n\
    return this.parent.pattern.route.route_short_name;\n\
  };\n\
\n\
\n\
  this.render = function() {\n\
    this.svgGroup = this.parent.labelSvg.append('g')\n\
      .attr('class', 'transitive-sortable')\n\
      .datum({\n\
        owner: this,\n\
        sortableType: 'LABEL'\n\
      });\n\
\n\
    var typeStr = this.parent.getType().toLowerCase();\n\
\n\
    var padding = this.textHeight * 0.1;\n\
\n\
    this.containerWidth = this.textWidth + padding * 2;\n\
    this.containerHeight = this.textHeight;\n\
\n\
    this.containerSvg = this.svgGroup.append('rect')\n\
      .datum(this) //{ segment: this.parent })\n\
      .attr({\n\
        width: this.containerWidth,\n\
        height: this.containerHeight\n\
      })\n\
      .attr('id', 'transitive-segment-label-container-' + this.parent.getId())\n\
      .text(this.getText())\n\
      .attr('class', 'transitive-segment-label-container');\n\
\n\
\n\
    this.textSvg = this.svgGroup.append('text')\n\
      .datum(this) //{ segment: this.parent })\n\
      .attr('id', 'transitive-segment-label-' + this.parent.getId())\n\
      .text(this.getText())\n\
      .attr('class', 'transitive-segment-label')\n\
      .attr('transform', (function (d, i) {\n\
        return 'translate(' + padding + ', ' + (this.textHeight - padding * 2) + ')';\n\
      }).bind(this));\n\
\n\
  };\n\
\n\
\n\
  this.refresh = function() {\n\
    if(!this.labelAnchor) return;\n\
\n\
    if(!this.svgGroup) this.render();\n\
\n\
    this.svgGroup\n\
      .attr('transform', (function (d, i) {\n\
        var tx = (this.labelAnchor.x - this.containerWidth / 2);\n\
        var ty = (this.labelAnchor.y - this.containerHeight / 2);\n\
        return 'translate(' + tx + ',' + ty + ')';\n\
      }).bind(this));\n\
  };\n\
\n\
\n\
  this.getBBox = function() {\n\
    return {\n\
      x : this.labelAnchor.x - this.containerWidth / 2,\n\
      y : this.labelAnchor.y - this.containerHeight / 2,\n\
      width : this.containerWidth,\n\
      height : this.containerHeight\n\
    };\n\
  };\n\
\n\
\n\
  this.intersects = function(obj) {\n\
    if(obj instanceof Label) {\n\
      // todo: handle label-label intersection for diagonally placed labels separately\n\
      return this.intersectsBBox(obj.getBBox());\n\
    }\n\
    else if(obj.x && obj.y && obj.width && obj.height) {\n\
      return this.intersectsBBox(obj);\n\
    }\n\
\n\
    return false;\n\
  };\n\
\n\
\n\
});\n\
\n\
\n\
/**\n\
 * Expose `SegmentLabel`\n\
 */\n\
\n\
module.exports = SegmentLabel;\n\
//# sourceURL=lib/labeler/segmentlabel.js"
));

require.register("transitive/lib/display.js", Function("exports, module",
"\n\
/**\n\
 * Dependencies\n\
 */\n\
\n\
var d3 = require(\"mbostock~d3@v3.4.6\");\n\
\n\
/**\n\
 * Expose `Display`\n\
 */\n\
\n\
module.exports = Display;\n\
\n\
/**\n\
 *  The D3-based SVG display.\n\
 */\n\
\n\
function Display(el, zoom) {\n\
  // set up the pan/zoom behavior\n\
  this.zoom = zoom || d3.behavior.zoom()\n\
    .scaleExtent([ 0.25, 4 ]);\n\
\n\
  // set up the svg display\n\
  this.svg = d3.select(el)\n\
    .append('svg')\n\
    .append('g');\n\
\n\
  this.grid = this.svg.append('g')\n\
    .attr('class', 'doNotEmpty');\n\
\n\
  // call the zoom behavior\n\
  this.svg.call(this.zoom);\n\
\n\
  // append an overlay to capture pan/zoom events on entire viewport\n\
  this.svg.append('rect')\n\
    .style('fill', 'none')\n\
    .style('pointer-events', 'all')\n\
    .attr('class', 'doNotEmpty');\n\
\n\
}\n\
\n\
/**\n\
 * Empty the display\n\
 */\n\
\n\
Display.prototype.empty = function() {\n\
  this.svg.selectAll(':not(.doNotEmpty)').remove();\n\
};\n\
\n\
/**\n\
 * Set the scale\n\
 */\n\
\n\
Display.prototype.setScale = function(height, width, graph) {\n\
  setScales(this, height, width, graph);\n\
\n\
  this.xScale.range([ 0, width ]);\n\
  this.yScale.range([ height, 0 ]);\n\
\n\
  this.zoom\n\
    .x(this.xScale)\n\
    .y(this.yScale);\n\
\n\
  this.svg\n\
    .attr('width', width)\n\
    .attr('height', height);\n\
\n\
  this.svg.select('rect')\n\
    .attr('width', width)\n\
    .attr('height', height);\n\
};\n\
\n\
\n\
/**\n\
 * draw the underlying grid used for snapping\n\
 */\n\
\n\
Display.prototype.drawGrid = function(cellSize) {\n\
\n\
  d3.selectAll('.gridline').remove();\n\
\n\
  var xRange = this.xScale.range(), yRange = this.yScale.range();\n\
  //console.log(yRange);\n\
  \n\
  var xDomain = this.xScale.domain(), yDomain = this.yScale.domain();\n\
  \n\
  var xMin = Math.round(xDomain[0] / cellSize) * cellSize;\n\
  var xMax = Math.round(xDomain[1] / cellSize) * cellSize;\n\
  for(var x = xMin; x <= xMax; x += cellSize) {\n\
    this.grid.append('line')\n\
      .attr({\n\
        'class': 'gridline',\n\
        'x1' : this.xScale(x),\n\
        'x2' : this.xScale(x),\n\
        'y1' : yRange[0],\n\
        'y2' : yRange[1],\n\
        'fill' : 'none',\n\
        'stroke' : '#ccc',\n\
        'stroke-width' : '1px'\n\
      });\n\
  }\n\
\n\
  var yMin = Math.round(yDomain[0] / cellSize) * cellSize;\n\
  var yMax = Math.round(yDomain[1] / cellSize) * cellSize;\n\
  for(var y = yMin; y <= yMax; y += cellSize) {\n\
    this.grid.append('line')\n\
      .attr({\n\
        'class': 'gridline',\n\
        'x1' : xRange[0],\n\
        'x2' : xRange[1],\n\
        'y1' : this.yScale(y),\n\
        'y2' : this.yScale(y),\n\
        'fill' : 'none',\n\
        'stroke' : '#ccc',\n\
        'stroke-width' : '1px'\n\
      });\n\
  }\n\
\n\
};\n\
\n\
\n\
\n\
Display.prototype.lineInterpolator = function(points) {\n\
  if(points.length === 2) return points.join(' ');\n\
\n\
  //console.log('LI');\n\
  //console.log(points);\n\
  \n\
  var str = points[0];\n\
  for(var i = 1; i < points.length; i++) {\n\
    //console.log(this.renderData[i]);\n\
    if(this.renderData[i].arc) {//points[i][0] !== points[i-1][0] && points[i][1] !== points[i-1][1]) {\n\
      var dx  = points[i][0] - points[i-1][0];\n\
      var dy  = points[i][1] - points[i-1][1];\n\
      var sweep = (this.renderData[i].arc > 0) ? 0 : 1;\n\
      //var sweep = (dx/Math.abs(dx) === dy/Math.abs(dy)) ? 1 : 0;\n\
      str += 'A ' + Math.abs(dx) + ',' + Math.abs(dy) + ' 0 0 ' + sweep + ' ' + points[i];\n\
    }\n\
    else {\n\
      str += 'L' + points[i];\n\
    }\n\
  }\n\
  return str;\n\
};\n\
\n\
\n\
\n\
/**\n\
 * Initialize the x/y coordinate space domain to fit the graph.\n\
 */\n\
\n\
function setScales(display, height, width, graph) {\n\
  var minX = Number.MAX_VALUE, maxX = -Number.MAX_VALUE;\n\
  var minY = Number.MAX_VALUE, maxY = -Number.MAX_VALUE;\n\
\n\
  graph.vertices.forEach(function(vertex) {\n\
    minX = Math.min(minX, vertex.x);\n\
    maxX = Math.max(maxX, vertex.x);\n\
    minY = Math.min(minY, vertex.y);\n\
    maxY = Math.max(maxY, vertex.y);\n\
  });\n\
\n\
  var xRange = maxX - minX, yRange = maxY - minY;\n\
  var displayAspect = width / height;\n\
  var graphAspect = xRange / (yRange === 0 ? Number.MIN_VALUE : yRange);\n\
\n\
  var paddingFactor = 0.5, padding;\n\
  var dispX1, dispX2, dispY1, dispY2;\n\
\n\
  if (displayAspect > graphAspect) { // y-axis is dominant\n\
    padding = paddingFactor * yRange;\n\
    dispY1 = minY - padding;\n\
    dispY2 = maxY + padding;\n\
    var dispXRange = (yRange + 2 * padding) * displayAspect;\n\
    var xMidpoint = (maxX + minX) / 2;\n\
    dispX1 = xMidpoint - dispXRange / 2;\n\
    dispX2 = xMidpoint + dispXRange / 2;\n\
  } else { // x-axis dominant\n\
    padding = paddingFactor * xRange;\n\
    dispX1 = minX - padding;\n\
    dispX2 = maxX + padding;\n\
    var dispYRange = (xRange + 2 * padding) / displayAspect;\n\
    var yMidpoint = (maxY + minY) / 2;\n\
    dispY1 = yMidpoint - dispYRange / 2;\n\
    dispY2 = yMidpoint + dispYRange / 2;\n\
  }\n\
\n\
  // set up the scales\n\
  display.xScale = d3.scale.linear()\n\
    .domain([ dispX1, dispX2 ]);\n\
\n\
  display.yScale = d3.scale.linear()\n\
    .domain([ dispY1, dispY2 ]);\n\
}\n\
\n\
\n\
\n\
//# sourceURL=lib/display.js"
));

require.register("transitive/lib/path.js", Function("exports, module",
"\n\
/**\n\
 * Dependencies\n\
 */\n\
\n\
var d3 = require(\"mbostock~d3@v3.4.6\");\n\
\n\
/**\n\
 * Expose `NetworkPath`\n\
 */\n\
\n\
module.exports = NetworkPath;\n\
\n\
/**\n\
 * A Route NetworkPath -- a unique sequence of network points (Stops or Places)\n\
 *\n\
 * @param {Object} the parent onject (a RoutePattern or Journey)\n\
 */\n\
\n\
function NetworkPath(parent) { //id, data) {\n\
  /*this.id = id;\n\
  for (var key in data) {\n\
    if (key === 'stops') continue;\n\
    this[key] = data[key];\n\
  }\n\
\n\
  this.stops = [];*/\n\
  this.parent = parent;\n\
\n\
  // The NetworkPath as an ordered sequence of edges in the graph w/ associated metadata.\n\
  // Array of objects containing the following fields:\n\
  //  - edge : the Edge object\n\
  //  - offset : the offset for rendering, expressed as a factor of the line width and relative to the 'forward' direction of the NetworkPath\n\
  this.graphEdges = [];\n\
\n\
  this.segments = [];\n\
  this.transferPoints = [];\n\
\n\
  // temporarily hardcoding the line width; need to get this from the styler\n\
  this.lineWidth = 10;\n\
}\n\
\n\
/**\n\
 * addSegment: add a new segment to the end of this NetworkPath\n\
 */\n\
\n\
NetworkPath.prototype.addSegment = function(segment) {\n\
  this.segments.push(segment);\n\
  segment.points.forEach(function(point) {\n\
    point.paths.push(this);\n\
  }, this);\n\
  this.addTransferPoint(segment.points[0]);\n\
  this.addTransferPoint(segment.points[segment.points.length-1]);\n\
};\n\
\n\
\n\
NetworkPath.prototype.addTransferPoint = function(point) {\n\
  if(this.transferPoints.indexOf(point) !== -1) return;\n\
  this.transferPoints.push(point);\n\
};\n\
\n\
\n\
NetworkPath.prototype.isTransferPoint = function(point) {\n\
  return this.transferPoints.indexOf(point) !== -1;\n\
};\n\
\n\
/**\n\
 * addEdge: add a new edge to the end of this NetworkPath's edge list\n\
 */\n\
\n\
NetworkPath.prototype.addEdge = function(edge) {\n\
  this.graphEdges.push({\n\
    edge: edge,\n\
    offset: null\n\
  });\n\
};\n\
\n\
/**\n\
 * insertEdge: insert an edge into this NetworkPaths edge list at a specified index\n\
 */\n\
\n\
NetworkPath.prototype.insertEdge = function(index, edge) {\n\
  this.graphEdges.splice(index, 0, {\n\
    edge: edge,\n\
    offset: null\n\
  });\n\
};\n\
\n\
/**\n\
 * clearOffsets\n\
 */\n\
\n\
NetworkPath.prototype.clearOffsets = function() {\n\
  this.graphEdges.forEach(function(edgeInfo, i) {\n\
    edgeInfo.offset = null;\n\
    edgeInfo.bundleIndex = null;\n\
  }, this);\n\
};\n\
\n\
\n\
/**\n\
 * setEdgeOffset: applies a specified offset to a specified edge in the NetworkPath\n\
 */\n\
\n\
NetworkPath.prototype.setEdgeOffset = function(edge, offset, bundleIndex, extend) {\n\
  this.graphEdges.forEach(function(edgeInfo, i) {\n\
    if(edgeInfo.edge === edge && edgeInfo.offset === null) {\n\
      edgeInfo.offset = offset;\n\
      edgeInfo.bundleIndex = bundleIndex;\n\
      if(extend) this.extend1DEdgeOffset(i);\n\
    }\n\
  }, this);\n\
};\n\
\n\
/**\n\
 * extend1DEdgeOffset\n\
 */\n\
\n\
NetworkPath.prototype.extend1DEdgeOffset = function(edgeIndex) {\n\
  var offset = this.graphEdges[edgeIndex].offset;\n\
  var bundleIndex = this.graphEdges[edgeIndex].bundleIndex;\n\
  var edgeInfo;\n\
  for(var i = edgeIndex; i < this.graphEdges.length; i++) {\n\
    edgeInfo = this.graphEdges[i];\n\
    if(edgeInfo.edge.fromVertex.y !== edgeInfo.edge.toVertex.y) break;\n\
    if(edgeInfo.offset === null) {\n\
      edgeInfo.offset = offset;\n\
      edgeInfo.bundleIndex = bundleIndex;\n\
    }\n\
  }\n\
  for(i = edgeIndex; i >= 0; i--) {\n\
    edgeInfo = this.graphEdges[i];\n\
    if(edgeInfo.edge.fromVertex.y !== edgeInfo.edge.toVertex.y) break;\n\
    if(edgeInfo.offset === null) {\n\
      edgeInfo.offset = offset;\n\
      edgeInfo.bundleIndex = bundleIndex;\n\
    }\n\
  }\n\
};\n\
\n\
\n\
/** highlight **/\n\
\n\
NetworkPath.prototype.drawHighlight = function(display, capExtension) {\n\
\n\
  this.line = d3.svg.line() // the line translation function\n\
    .x(function (pointInfo, i) {\n\
      return display.xScale(pointInfo.x) + (pointInfo.offsetX || 0);\n\
    })\n\
    .y(function (pointInfo, i) {\n\
      return display.yScale(pointInfo.y) - (pointInfo.offsetY || 0);\n\
    })\n\
    .interpolate(display.lineInterpolator.bind(this));\n\
\n\
  this.lineGraph = display.svg.append('path')\n\
    .attr('id', 'transitive-path-highlight-' +this.parent.getElementId())\n\
    .attr('class', 'transitive-path-highlight')\n\
    .style('stroke-width', 24).style('stroke', '#ff4')\n\
    .style('fill', 'none')\n\
    .style('visibility', 'hidden')\n\
    .data([ this ]);\n\
};\n\
\n\
\n\
NetworkPath.prototype.refreshHighlight = function(display, capExtension) {\n\
  this.renderData = [];\n\
  var renderSegments = this.getRenderSegments();\n\
  for(var i = 0; i < renderSegments.length; i++) {\n\
    var segment = renderSegments[i];\n\
    segment.refreshRenderData(false);\n\
    this.renderData = this.renderData.concat(segment.renderData);\n\
  }\n\
  this.lineGraph.attr('d', this.line(this.renderData));\n\
};\n\
\n\
\n\
NetworkPath.prototype.getRenderSegments = function() {\n\
  var renderSegments = [];\n\
  this.segments.forEach(function(pathSegment) {\n\
    renderSegments = renderSegments.concat(pathSegment.renderSegments);\n\
  });\n\
  return renderSegments;\n\
};\n\
\n\
\n\
/**\n\
 * getPointArray\n\
 */\n\
\n\
NetworkPath.prototype.getPointArray = function() {\n\
  var points = [];\n\
  for(var i = 0; i < this.segments.length; i++) {\n\
    var segment = this.segments[i];\n\
    if(i > 0 && segment.points[0] === this.segments[i-1].points[this.segments[i-1].points.length-1]) {\n\
      points.concat(segment.points.slice(1));\n\
    }\n\
    else {\n\
      points.concat(segment.points);\n\
    }\n\
  }\n\
  return points;\n\
};\n\
\n\
\n\
/**\n\
 * Returns an array of \"point info\" objects, each consisting of the point x/y\n\
 * coordinates in the Display coordinate space, and a reference to the original\n\
 * Stop/Place instance\n\
 */\n\
\n\
NetworkPath.prototype.refreshRenderData = function() {\n\
  this.renderData = [];\n\
  var pointIndex = 0, edgeIndex = 0;\n\
\n\
  this.segments.forEach(function (segment, i) {\n\
\n\
    if(segment.graphEdges.length > 1) {\n\
      console.log('skipping multi-edge segment');\n\
      return;\n\
    }\n\
    var edge = segment.graphEdges[0]; // edgeInfo.edge;\n\
\n\
    var edgeRenderData = [];\n\
\n\
    var nextEdgeInfo = i < this.graphEdges.length - 1\n\
      ? this.graphEdges[i + 1]\n\
      : null;\n\
\n\
    var pointInfo;\n\
\n\
    // the \"from\" vertex point for this edge (first edge only)\n\
    //if (i === 0) {\n\
    pointInfo = {\n\
      path: this,\n\
      x: edge.fromVertex.x,\n\
      y: edge.fromVertex.y,\n\
      point: edge.fromVertex.point,\n\
      inEdge: null,\n\
      outEdge: edge,\n\
      index: pointIndex++\n\
    };\n\
\n\
    /*pointInfo.offsetX = edgeInfo.offset\n\
      ? edge.rightVector.x * this.lineWidth * edgeInfo.offset\n\
      : 0;\n\
\n\
    pointInfo.offsetY = edgeInfo.offset\n\
      ? edge.rightVector.y * this.lineWidth * edgeInfo.offset\n\
      : 0;*/\n\
    pointInfo.offsetX = pointInfo.offsetY = 0;\n\
\n\
    edgeRenderData.push(pointInfo);\n\
    edge.fromVertex.point.addRenderData(pointInfo);\n\
\n\
    // construct the \n\
    var x1 = edge.fromVertex.x, y1 = edge.fromVertex.y;\n\
    var x2 = edge.toVertex.x, y2 = edge.toVertex.y;\n\
    var tol = 0.001;\n\
    var dx = x2 - x1, dy = y2 - y1;\n\
    var r = null;\n\
    if(Math.abs(dx) > tol && Math.abs(dy) > tol && Math.abs(dx) - Math.abs(dy) > tol) {\n\
      r = 0.005;\n\
      // horiz first\n\
      var e = {\n\
        x: x2,\n\
        y: y1\n\
      };\n\
\n\
      edgeRenderData.push({\n\
        x : x2 - r * (dx/Math.abs(dx)),\n\
        y : y1\n\
      });\n\
      edgeRenderData.push({\n\
        x : x2,\n\
        y : y1 + r * (dy/Math.abs(dy))\n\
      });\n\
    }\n\
\n\
\n\
    // the internal points for this edge\n\
    edge.pointArray.forEach(function (point, i) {\n\
      var t = (i + 1) / (edge.pointArray.length + 1);\n\
      if(r) pointInfo = edge.pointAlongEdgeCurveX(t, r);\n\
      else pointInfo = edge.pointAlongEdge(t);\n\
      pointInfo.path = this;\n\
      pointInfo.point = point;\n\
      pointInfo.inEdge = pointInfo.outEdge = edge;\n\
      /*if (edgeInfo.offset) {\n\
        pointInfo.offsetX = edge.rightVector.x * this.lineWidth * edgeInfo.offset;\n\
        pointInfo.offsetY = edge.rightVector.y * this.lineWidth * edgeInfo.offset;\n\
      } else {\n\
        pointInfo.offsetX = pointInfo.offsetY = 0;\n\
      }\n\
      if (edgeInfo.bundleIndex === 0) pointInfo.showLabel = true;*/\n\
      pointInfo.offsetX = pointInfo.offsetY = 0;\n\
      pointInfo.index = pointIndex++;\n\
\n\
      //edgeRenderData.push(pointInfo);\n\
      point.addRenderData(pointInfo);\n\
    }, this);\n\
\n\
\n\
    // the \"to\" vertex point for this edge. handles the 'corner' case between adjacent edges\n\
    //pointInfo = this.constructCornerPointInfo(edgeInfo, edge.toVertex, nextEdgeInfo);\n\
    //pointInfo.index = pointIndex;\n\
  \n\
    // temp: disregard offsetting\n\
    pointInfo = {\n\
      path: this,\n\
      x: edge.toVertex.x,\n\
      y: edge.toVertex.y,\n\
      point: edge.toVertex.point,\n\
      index: pointIndex,\n\
      offsetX: 0,\n\
      offsetY: 0\n\
    };\n\
\n\
    edgeRenderData.push(pointInfo);\n\
\n\
    edge.toVertex.point.addRenderData(pointInfo);\n\
\n\
    segment.renderData = edgeRenderData;\n\
    //console.log('set rrd:');\n\
    //console.log(segment);\n\
    edgeIndex++;\n\
\n\
  }, this);\n\
};\n\
\n\
\n\
NetworkPath.prototype.constructCornerPointInfo = function(edgeInfo1, vertex, edgeInfo2) {\n\
  var edge1 = edgeInfo1 ? edgeInfo1.edge : null;\n\
  var edge2 = edgeInfo2 ? edgeInfo2.edge : null;\n\
\n\
  var pointInfo = {\n\
    path: this,\n\
    x: vertex.x,\n\
    y: vertex.y,\n\
    point: vertex.point,\n\
    inEdge: edge1,\n\
    outEdge: edge2\n\
  };\n\
\n\
  var offset = null;\n\
  if(edgeInfo1 && edgeInfo1.offset) offset = edgeInfo1.offset;\n\
  if(edgeInfo2 && edgeInfo2.offset) offset = edgeInfo2.offset;\n\
\n\
  if(offset === null) {\n\
    pointInfo.offsetX = pointInfo.offsetY = 0;\n\
    return pointInfo;\n\
  }\n\
\n\
  if (edge2\n\
    && edge2.rightVector.x !== edge1.rightVector.x\n\
    && edge2.rightVector.y !== edge1.rightVector.y) {\n\
\n\
    var added = {\n\
      x: edge2.rightVector.x + edge1.rightVector.x,\n\
      y: edge2.rightVector.y + edge1.rightVector.y,\n\
    };\n\
\n\
    var len = Math.sqrt(added.x * added.x + added.y * added.y);\n\
    var normalized = { x : added.x / len, y : added.y / len };\n\
\n\
    var opp = Math.sqrt(\n\
      Math.pow(edge2.rightVector.x - edge1.rightVector.x, 2)\n\
      + Math.pow(edge2.rightVector.y - edge1.rightVector.y, 2)\n\
      ) / 2;\n\
\n\
    var l = 1 / Math.sqrt(1 - opp * opp); // sqrt(1-x*x) = sin(acos(x))\n\
\n\
    pointInfo.offsetX = normalized.x * this.lineWidth * offset * l;\n\
    pointInfo.offsetY = normalized.y * this.lineWidth * offset * l;\n\
  } else {\n\
    pointInfo.offsetX = edge1.rightVector.x * this.lineWidth * offset;\n\
    pointInfo.offsetY = edge1.rightVector.y * this.lineWidth * offset;\n\
  }\n\
\n\
  return pointInfo;\n\
};\n\
\n\
\n\
/**\n\
 * Get graph vertices\n\
 */\n\
\n\
NetworkPath.prototype.getGraphVertices = function() {\n\
  var vertices = [];\n\
  this.graphEdges.forEach(function (edge, i) {\n\
    if (i === 0) {\n\
      vertices.push(edge.fromVertex);\n\
    }\n\
    vertices.push(edge.toVertex);\n\
  });\n\
  return vertices;\n\
};\n\
\n\
NetworkPath.prototype.getEdgeIndex = function(edge) {\n\
  for(var i = 0; i < this.graphEdges.length; i++) {\n\
    if(this.graphEdges[i].edge === edge) return i;\n\
  }\n\
  return -1;\n\
};\n\
\n\
NetworkPath.prototype.getAdjacentEdge = function(edge, vertex) {\n\
\n\
  // ensure that edge/vertex pair is valid\n\
  if(edge.toVertex !== vertex && edge.fromVertex !== vertex) return null;\n\
\n\
  var index = this.getEdgeIndex(edge);\n\
  if(index === -1) return null;\n\
\n\
  // check previous edge\n\
  if(index > 0) {\n\
    var prevEdge = this.graphEdges[index-1].edge;\n\
    if(prevEdge.toVertex === vertex || prevEdge.fromVertex === vertex) return prevEdge;\n\
  }\n\
\n\
  // check next edge\n\
  if(index < this.graphEdges.length-1) {\n\
    var nextEdge = this.graphEdges[index+1].edge;\n\
    if(nextEdge.toVertex === vertex || nextEdge.fromVertex === vertex) return nextEdge;\n\
  }\n\
\n\
  return null;\n\
};\n\
\n\
\n\
NetworkPath.prototype.vertexArray = function() {\n\
\n\
  var vertex = this.startVertex();\n\
  var array = [ vertex ];\n\
\n\
  this.graphEdges.forEach(function(edgeInfo) {\n\
    vertex = edgeInfo.edge.oppositeVertex(vertex);\n\
    array.push(vertex);\n\
  });\n\
\n\
  return array;\n\
};\n\
\n\
NetworkPath.prototype.startVertex = function() {\n\
  if(!this.graphEdges || this.graphEdges.length === 0) return null;\n\
  if(this.graphEdges.length === 1) return this.graphEdges[0].fromVertex;\n\
  var first = this.graphEdges[0].edge, next = this.graphEdges[1].edge;\n\
  if(first.toVertex == next.toVertex || first.toVertex == next.fromVertex) return first.fromVertex;\n\
  if(first.fromVertex == next.toVertex || first.fromVertex == next.fromVertex) return first.toVertex;\n\
  return null;\n\
};\n\
\n\
NetworkPath.prototype.endVertex = function() {\n\
  if(!this.graphEdges || this.graphEdges.length === 0) return null;\n\
  if(this.graphEdges.length === 1) return this.graphEdges[0].toVertex;\n\
  var last = this.graphEdges[this.graphEdges.length-1].edge, prev = this.graphEdges[this.graphEdges.length-2].edge;\n\
  if(last.toVertex == prev.toVertex || last.toVertex == prev.fromVertex) return last.fromVertex;\n\
  if(last.fromVertex == prev.toVertex || last.fromVertex == prev.fromVertex) return last.toVertex;\n\
  return null;\n\
};\n\
\n\
NetworkPath.prototype.toString = function() {\n\
  return this.startVertex().stop.stop_name + ' to ' + this.endVertex().stop.stop_name;\n\
};\n\
//# sourceURL=lib/path.js"
));

require.register("transitive/lib/pattern.js", Function("exports, module",
"var d3 = require(\"mbostock~d3@v3.4.6\");\n\
\n\
/**\n\
 * Expose `RoutePattern`\n\
 */\n\
\n\
module.exports = RoutePattern;\n\
\n\
/**\n\
 * A RoutePattern\n\
 *\n\
 * @param {Object} RoutePattern data object from the transitive.js input\n\
 */\n\
\n\
function RoutePattern(data, transitive) {\n\
  for (var key in data) {\n\
    if (key === 'stops') continue;\n\
    this[key] = data[key];\n\
  }\n\
\n\
  this.stops = [];\n\
  for(var i = 0; i < data.stops.length; i++) {\n\
    this.stops.push(transitive.stops[data.stops[i].stop_id]);\n\
  }\n\
\n\
  // create path\n\
}\n\
\n\
RoutePattern.prototype.getId = function() {\n\
  return this.pattern_id;\n\
};\n\
\n\
RoutePattern.prototype.getElementId = function() {\n\
  return 'pattern-' + this.pattern_id;\n\
};\n\
\n\
RoutePattern.prototype.getName = function() {\n\
  return this.pattern_name;\n\
};\n\
\n\
//# sourceURL=lib/pattern.js"
));

require.register("transitive/lib/route.js", Function("exports, module",
"\n\
/**\n\
 * Expose `Route`\n\
 */\n\
\n\
module.exports = Route;\n\
\n\
/**\n\
 * A transit Route, as defined in the input data.\n\
 * Routes contain one or more Patterns.\n\
 *\n\
 * @param {Object}\n\
 */\n\
\n\
function Route(data) {\n\
  for (var key in data) {\n\
    if (key === 'patterns') continue;\n\
    this[key] = data[key];\n\
  }\n\
\n\
  this.patterns = [];\n\
}\n\
\n\
/**\n\
 * Add Pattern\n\
 *\n\
 * @param {Pattern}\n\
 */\n\
\n\
Route.prototype.addPattern = function(pattern) {\n\
  this.patterns.push(pattern);\n\
  pattern.route = this;\n\
};\n\
\n\
\n\
Route.prototype.getColor = function() {\n\
  if(this.route_color) {\n\
    if(this.route_color.charAt(0) === '#') return this.route_color;\n\
    return '#' + this.route_color;\n\
  }\n\
\n\
  // assign a random shade of gray\n\
  /*var c = 128 + Math.floor(64 * Math.random());\n\
  var hex = c.toString(16);\n\
  hex = (hex.length === 1) ? '0' + hex : hex;\n\
\n\
  this.route_color = '#' + hex + hex + hex;\n\
\n\
  return this.route_color;*/\n\
};\n\
\n\
//# sourceURL=lib/route.js"
));

require.register("transitive/lib/journey.js", Function("exports, module",
"var Segment = require(\"transitive/lib/segment.js\");\n\
var NetworkPath = require(\"transitive/lib/path.js\");\n\
\n\
/**\n\
 * Expose `Journey`\n\
 */\n\
\n\
module.exports = Journey;\n\
\n\
/**\n\
 * \n\
 */\n\
\n\
function Journey(data, transitive) {\n\
\n\
  this.transitive = transitive;\n\
\n\
  for(var key in data) {\n\
    //if(key === 'segments') continue;\n\
    this[key] = data[key];\n\
  }\n\
  \n\
  this.path = new NetworkPath(this);\n\
\n\
  for(var i = 0; i < this.segments.length; i++) {\n\
    var segmentInfo = this.segments[i];\n\
\n\
    var pathSegment = new Segment(segmentInfo.type);\n\
    pathSegment.journeySegment = segmentInfo;\n\
\n\
    if(segmentInfo.type === 'TRANSIT') {\n\
      var pattern = transitive.patterns[segmentInfo.pattern_id];\n\
      for(var s = segmentInfo.from_stop_index; s <= segmentInfo.to_stop_index; s++) {\n\
        pathSegment.points.push(pattern.stops[s]);\n\
      }\n\
      pathSegment.pattern = pattern;\n\
    }\n\
    else if(segmentInfo.type === 'WALK') {\n\
      if(segmentInfo.from.type === 'PLACE') pathSegment.points.push(transitive.places[segmentInfo.from.place_id]);\n\
      else if(segmentInfo.from.type === 'STOP') pathSegment.points.push(transitive.stops[segmentInfo.from.stop_id]);\n\
\n\
      if(segmentInfo.to.type === 'PLACE') pathSegment.points.push(transitive.places[segmentInfo.to.place_id]);\n\
      else if(segmentInfo.to.type === 'STOP') pathSegment.points.push(transitive.stops[segmentInfo.to.stop_id]);\n\
    }\n\
\n\
    this.path.addSegment(pathSegment);\n\
\n\
  }\n\
\n\
}\n\
\n\
Journey.prototype.getElementId = function() {\n\
  return 'journey-' + this.journey_id;\n\
};\n\
\n\
/*Journey.prototype.addPattern = function(pattern) {\n\
  this.patterns.push(pattern);\n\
  pattern.journey = this;\n\
};*/\n\
\n\
//# sourceURL=lib/journey.js"
));

require.register("transitive", Function("exports, module",
"\n\
/**\n\
 * Dependencies\n\
 */\n\
\n\
var d3 = require(\"mbostock~d3@v3.4.6\");\n\
var debug = require(\"visionmedia~debug@0.8.1\")('transitive');\n\
var Display = require(\"transitive/lib/display.js\");\n\
var Emitter = require(\"component~emitter@1.1.2\");\n\
var Graph = require(\"transitive/lib/graph/index.js\");\n\
var NetworkPath = require(\"transitive/lib/path.js\");\n\
var Route = require(\"transitive/lib/route.js\");\n\
var RoutePattern = require(\"transitive/lib/pattern.js\");\n\
var Journey = require(\"transitive/lib/journey.js\");\n\
var Stop = require(\"transitive/lib/point/stop.js\");\n\
var Place = require(\"transitive/lib/point/place.js\");\n\
var Styler = require(\"transitive/lib/styler/index.js\");\n\
var Segment = require(\"transitive/lib/segment.js\");\n\
var Labeler = require(\"transitive/lib/labeler/index.js\");\n\
var Label = require(\"transitive/lib/labeler/label.js\");\n\
\n\
var toFunction = require(\"component~to-function@2.0.0\");\n\
var each = require(\"component~each@0.2.3\");\n\
\n\
/**\n\
 * Expose `Transitive`\n\
 */\n\
\n\
module.exports = Transitive;\n\
\n\
/**\n\
 * Expose `d3`\n\
 */\n\
\n\
module.exports.d3 = Transitive.prototype.d3 = d3;\n\
\n\
/**\n\
 * Expose `version`\n\
 */\n\
\n\
module.exports.version = '0.0.0';\n\
\n\
/**\n\
 * Create a new instance of `Transitive`\n\
 *\n\
 * @param {Element} element to render to\n\
 * @param {Object} data to render\n\
 * @param {Object} styles to apply\n\
 * @param {Object} options object\n\
 */\n\
\n\
function Transitive(el, data, styles, options) {\n\
  if (!(this instanceof Transitive)) {\n\
    return new Transitive(el, data, styles, options);\n\
  }\n\
\n\
  this.clearFilters();\n\
  this.data = data;\n\
  this.setElement(el);\n\
  this.style = new Styler(styles);\n\
  this.labeler = new Labeler(this);\n\
  \n\
  this.options = options;\n\
  this.gridCellSize = this.options.gridCellSize || 500;\n\
\n\
  this.paths = [];\n\
}\n\
\n\
/**\n\
 * Mixin `Emitter`\n\
 */\n\
\n\
Emitter(Transitive.prototype);\n\
\n\
/**\n\
 * Add a data filter\n\
 *\n\
 * @param {String} type\n\
 * @param {String|Object|Function} filter, gets passed to `to-function`\n\
 */\n\
\n\
Transitive.prototype.addFilter =\n\
Transitive.prototype.filter = function(type, filter) {\n\
  if (!this._filter[type]) this._filter[type] = [];\n\
  this._filter[type].push(toFunction(filter));\n\
\n\
  return this;\n\
};\n\
\n\
/**\n\
 * Clear all data filters\n\
 *\n\
 * @param {String} filter type\n\
 */\n\
\n\
Transitive.prototype.clearFilters = function(type) {\n\
  if (type) {\n\
    this._filter[type] = [];\n\
  } else {\n\
    this._filter = {\n\
      patterns: [],\n\
      routes: [],\n\
      stops: []\n\
    };\n\
  }\n\
\n\
  this.emit('clear filters', this);\n\
  return this;\n\
};\n\
\n\
/**\n\
 * Load\n\
 *\n\
 * @param {Object} data\n\
 */\n\
\n\
Transitive.prototype.load = function(data) {\n\
  debug('load', data);\n\
\n\
  this.graph = new Graph();\n\
\n\
  // A list of points (stops & places) that will become vertices in the network graph. This\n\
  // includes all stops that serve as a pattern endpoint and/or a\n\
  // convergence/divergence point between patterns\n\
  this.vertexPoints = [];\n\
\n\
  // object maps stop ids to arrays of unique stop_ids reachable from that stop\n\
  this.adjacentStops = {};\n\
\n\
  // Generate the route objects\n\
  this.routes = {};\n\
  applyFilters(data.routes, this._filter.routes).forEach(function (data) {\n\
    this.routes[data.route_id] = new Route(data);\n\
  }, this);\n\
\n\
  // Generate the stop objects\n\
  this.stops = {};\n\
  applyFilters(data.stops, this._filter.stops).forEach(function (data) {\n\
    this.stops[data.stop_id] = new Stop(data);\n\
  }, this);\n\
\n\
  // Generate the pattern objects\n\
  this.patterns = {};\n\
  applyFilters(data.patterns, this._filter.patterns).forEach(function (data) {\n\
    var pattern = new RoutePattern(data, this);\n\
    this.patterns[data.pattern_id] = pattern;\n\
    var route = this.routes[data.route_id];\n\
    route.addPattern(pattern);\n\
    pattern.route = route;\n\
  }, this);\n\
\n\
  // Generate the place objects\n\
  this.places = {};\n\
  data.places.forEach(function (data) {\n\
    var place = this.places[data.place_id] = new Place(data, this);\n\
    this.addVertexPoint(place);\n\
  }, this);\n\
\n\
  // Generate the routes & patterns\n\
  /*this.routes = {};\n\
  this.patterns = {};\n\
\n\
  if(data.routes) {\n\
    applyFilters(data.routes, this._filter.routes).forEach(function (routeData) {\n\
      var route = this.routes[routeData.route_id] = new Route(routeData);\n\
      // iterate through the Route's constituent Patterns\n\
      applyFilters(routeData.patterns, this._filter.patterns).forEach(function (patternData, i) {\n\
        var pattern = this.processStopSequence(patternData, patternData.pattern_id, vertexStops, adjacentStops);\n\
        pattern.route = route;\n\
      }, this);\n\
    }, this);\n\
  }*/\n\
\n\
  // Generate the internal Journey objects\n\
  this.journeys = {};\n\
  if(data.journeys) {\n\
    data.journeys.forEach((function(journeyData) {\n\
      var journey = new Journey(journeyData, this);\n\
      //var pattern = this.processStopSequence(journeyData, journeyData.journey_id, vertexStops, adjacentStops);\n\
      //journey.addPattern(pattern);\n\
      //journey.combinedPattern = pattern;\n\
      this.journeys[journeyData.journey_id] = journey;\n\
      this.paths.push(journey.path);\n\
\n\
    }).bind(this));\n\
  }\n\
\n\
  // process the path segments\n\
  for(var p = 0; p < this.paths.length; p++) {\n\
    var path = this.paths[p];\n\
    for(var s = 0; s < path.segments.length; s++) {\n\
      this.processSegment(path.segments[s]);\n\
    }\n\
  }\n\
\n\
\n\
  // determine the convergence/divergence vertex stops by looking for stops w/ >2 adjacent stops\n\
  for (var stopId in this.adjacentStops) {\n\
    if (this.adjacentStops[stopId].length > 2) {\n\
      this.addVertexPoint(this.stops[stopId]);\n\
      this.stops[stopId].isBranchPoint = true;\n\
    }\n\
  }\n\
\n\
  // populate the vertices in the graph object\n\
  for(var i = 0; i < this.vertexPoints.length; i++) {\n\
    var point = this.vertexPoints[i];\n\
    var vertex = this.graph.addVertex(point);\n\
    //point.graphVertex = vertex;\n\
  }\n\
\n\
  this.populateGraphEdges(); //this.patterns, this.graph);\n\
  this.graph.collapseTransfers();\n\
  this.populateRenderSegments();\n\
  this.labeler.updateLabelList();\n\
\n\
  this.updateGeometry(true);\n\
  this.setScale();\n\
\n\
  this.emit('load', this);\n\
  return this;\n\
};\n\
\n\
Transitive.prototype.updateGeometry = function(snapGrid) {\n\
\n\
  if(snapGrid) this.graph.snapToGrid(this.gridCellSize);\n\
\n\
  // clear the stop render data\n\
  for (var key in this.stops) this.stops[key].renderData = [];\n\
\n\
  this.graph.vertices.forEach(function(vertex) {\n\
    vertex.snapped = false;\n\
    vertex.point.clearRenderData();\n\
  });\n\
\n\
  this.graph.calculateGeometry(this.gridCellSize);\n\
  this.graph.optimizeCurvature();\n\
\n\
  this.renderSegments.forEach(function(segment) {\n\
    segment.clearOffsets();\n\
  });\n\
  this.graph.apply2DOffsets(this);\n\
\n\
};\n\
\n\
/**\n\
 *\n\
 */\n\
\n\
\n\
Transitive.prototype.processSegment = function(segment) {\n\
\n\
  // iterate through this pattern's stops, associating stops/patterns with\n\
  // each other and initializing the adjacentStops table\n\
  var previousStop = null;\n\
  for(var i=0; i < segment.points.length; i++) {\n\
    var point = segment.points[i];\n\
    \n\
    // called for each pair of adjacent stops in sequence\n\
    if(previousStop && point.getType() === 'STOP') {\n\
      this.addStopAdjacency(point.getId(), previousStop.getId());\n\
      this.addStopAdjacency(previousStop.getId(), point.getId());\n\
    }\n\
\n\
    previousStop = (point.getType() === 'STOP') ? point : null;\n\
    \n\
    // add the start and end points to the vertexStops collection\n\
    var startPoint = segment.points[0];\n\
    this.addVertexPoint(startPoint);\n\
    startPoint.isSegmentEndPoint = true;\n\
\n\
    var endPoint = segment.points[segment.points.length-1];\n\
    this.addVertexPoint(endPoint);\n\
    endPoint.isSegmentEndPoint = true;\n\
\n\
  }\n\
};\n\
\n\
\n\
Transitive.prototype.addVertexPoint = function(point) {\n\
  if(this.vertexPoints.indexOf(point) !== -1) return;\n\
  this.vertexPoints.push(point);\n\
};\n\
\n\
\n\
/**\n\
 * Render\n\
 */\n\
\n\
Transitive.prototype.render = function() {\n\
  this.load(this.data);\n\
  var display = this.display;\n\
  display.styler = this.style;\n\
\n\
  var offsetLeft = this.el.offsetLeft;\n\
  var offsetTop = this.el.offsetTop;\n\
\n\
  // remove all old svg elements\n\
  this.display.empty();\n\
\n\
\n\
  // draw the path highlights\n\
  for(var p = 0; p < this.paths.length; p++) {\n\
    this.paths[p].drawHighlight(this.display);\n\
  }\n\
\n\
  // draw the segments\n\
  for(var s = 0; s < this.renderSegments.length; s++) {\n\
    var segment = this.renderSegments[s];\n\
    segment.refreshRenderData(true, this.style, this.display);\n\
    segment.draw(this.display, 0); // 10);\n\
  }\n\
\n\
  // draw the vertex-based points\n\
  this.graph.vertices.forEach(function(vertex) {\n\
    vertex.point.draw(this.display);\n\
  }, this);\n\
\n\
  // draw the edge-based points\n\
  this.graph.edges.forEach(function(edge) {\n\
    edge.pointArray.forEach(function(point) {\n\
      point.draw(this.display);\n\
    }, this);\n\
  }, this);\n\
\n\
\n\
  this.refresh();\n\
\n\
  this.emit('render', this);\n\
  return this;\n\
};\n\
\n\
/**\n\
 * Render to\n\
 *\n\
 * @param {Element} el\n\
 */\n\
\n\
Transitive.prototype.renderTo = function(el) {\n\
  this.setElement(el);\n\
  this.render();\n\
\n\
  this.emit('render to', this);\n\
  return this;\n\
};\n\
\n\
/**\n\
 * Refresh\n\
 */\n\
\n\
Transitive.prototype.refresh = function() {\n\
\n\
  this.graph.vertices.forEach(function(vertex) {\n\
    vertex.point.clearRenderData();\n\
  });\n\
\n\
  // draw the grid, if necessary\n\
  if(this.options.drawGrid) this.display.drawGrid(this.gridCellSize);\n\
\n\
  // refresh the segments\n\
  for(var s = 0; s < this.renderSegments.length; s++) {\n\
    var segment = this.renderSegments[s];\n\
    segment.refreshRenderData(true, this.style, this.display);\n\
    segment.refresh(this.display);\n\
  }\n\
\n\
  // refresh the path highlights\n\
  for(var p = 0; p < this.paths.length; p++) {\n\
    this.paths[p].refreshHighlight(this.display);\n\
  }\n\
\n\
\n\
  // refresh the vertex-based points\n\
  this.graph.vertices.forEach(function(vertex) {\n\
    var point = vertex.point;\n\
    if (!point.svgGroup) return; // check if this point is not currently rendered\n\
    this.style.renderPoint(this.display, point);\n\
    point.refresh(this.display);\n\
  }, this);\n\
\n\
  // refresh the edge-based points\n\
  this.graph.edges.forEach(function(edge) {\n\
    edge.pointArray.forEach(function(point) {\n\
      if (!point.svgGroup) return; // check if this point is not currently rendered\n\
      this.style.renderStop(this.display, point);\n\
      point.refresh(this.display);\n\
    }, this);\n\
  }, this);\n\
\n\
  // refresh the label layout\n\
  var labeledElements = this.labeler.doLayout();\n\
  labeledElements.points.forEach(function(point) {\n\
    point.refreshLabel(this.display);\n\
    this.style.renderPointLabel(this.display, point);\n\
  }, this);\n\
  labeledElements.segments.forEach(function(segment) {\n\
    segment.refreshLabel(this.display);\n\
    this.style.renderSegmentLabel(this.display, segment);\n\
  }, this);\n\
\n\
  this.sortElements();\n\
\n\
  this.emit('refresh', this);\n\
  return this;\n\
};\n\
\n\
\n\
Transitive.prototype.sortElements = function(journeyId) {\n\
\n\
  this.renderSegments.sort(function(a, b) {\n\
    if(a.isFocused() && !b.isFocused()) return 1;\n\
    if(b.isFocused() && !a.isFocused()) return -1;\n\
    return(a.compareTo(b));\n\
  });\n\
\n\
  this.renderSegments.forEach(function(segment, index) {\n\
    segment.zIndex = index * 10;\n\
  });\n\
\n\
  this.display.svg.selectAll('.transitive-sortable').sort(function(a, b) {\n\
    var aIndex = (typeof a.getZIndex === 'function') ? a.getZIndex() : a.owner.getZIndex();\n\
    var bIndex = (typeof b.getZIndex === 'function') ? b.getZIndex() : b.owner.getZIndex();\n\
    return aIndex - bIndex;\n\
  });\n\
};\n\
\n\
\n\
Transitive.prototype.focusJourney = function(journeyId) {\n\
  var journeyRenderSegments = [];\n\
\n\
  if(journeyId) {\n\
    var journey = this.journeys[journeyId];\n\
    journeyRenderSegments = journey.path.getRenderSegments();\n\
\n\
    this.graph.edges.forEach(function(edge) {\n\
      edge.pointArray.forEach(function (point, i) {\n\
        point.setAllPatternsFocused(false);\n\
      });\n\
    }, this);\n\
  }\n\
  else {\n\
    this.graph.edges.forEach(function(edge) {\n\
      edge.pointArray.forEach(function (point, i) {\n\
        point.setAllPatternsFocused(true);\n\
      });\n\
    }, this);\n\
  }\n\
\n\
  var focusedVertexPoints = [];\n\
  //var focusedInternalPoints = [];\n\
  this.renderSegments.forEach(function(segment) {\n\
    if(journeyId && journeyRenderSegments.indexOf(segment) === -1) {\n\
      segment.setFocused(false);\n\
    }\n\
    else {\n\
      segment.setFocused(true);\n\
      segment.graphEdges.forEach(function(edge, edgeIndex) {\n\
        focusedVertexPoints.push(edge.fromVertex.point);\n\
        focusedVertexPoints.push(edge.toVertex.point);\n\
        edge.pointArray.forEach(function (point, i) {\n\
          point.setPatternFocused(segment.pattern.getId(), true);\n\
        });\n\
      });\n\
\n\
    }\n\
  });\n\
\n\
  this.graph.vertices.forEach(function(vertex) {\n\
    var point = vertex.point;\n\
    point.setFocused(focusedVertexPoints.indexOf(point) !== -1);\n\
  }, this);\n\
\n\
  this.refresh();\n\
};\n\
\n\
/**\n\
 * Set element\n\
 */\n\
\n\
Transitive.prototype.setElement = function(el) {\n\
  if (this.el) this.el.innerHTML = null;\n\
\n\
  this.el = el;\n\
\n\
  this.display = new Display(el);\n\
  this.display.zoom.on('zoom', this.refresh.bind(this));\n\
\n\
  this.setScale();\n\
\n\
  this.emit('set element', this);\n\
  return this;\n\
};\n\
\n\
/**\n\
 * Set scale\n\
 */\n\
\n\
Transitive.prototype.setScale = function() {\n\
  if (this.display && this.el && this.graph) {\n\
    this.display.setScale(this.el.clientHeight, this.el.clientWidth,\n\
      this.graph);\n\
  }\n\
\n\
  this.emit('set scale', this);\n\
  return this;\n\
};\n\
\n\
\n\
/**\n\
 * Helper function for stopAjacency table\n\
 *\n\
 * @param {Stop} adjacent stops list\n\
 * @param {Stop} stopA\n\
 * @param {Stop} stopB\n\
 */\n\
\n\
Transitive.prototype.addStopAdjacency = function(stopIdA, stopIdB) {\n\
  if (!this.adjacentStops[stopIdA]) this.adjacentStops[stopIdA] = [];\n\
  if (this.adjacentStops[stopIdA].indexOf(stopIdB) === -1) this.adjacentStops[stopIdA].push(stopIdB);\n\
};\n\
\n\
\n\
/**\n\
 * Populate the graph edges\n\
 *\n\
 * @param {Object} patterns\n\
 * @param {Graph} graph\n\
 */\n\
\n\
Transitive.prototype.populateGraphEdges = function() {\n\
  // vertex associated with the last vertex point we passed in this sequence\n\
  var lastVertex = null;\n\
\n\
  // collection of 'internal' (i.e. non-vertex) points passed\n\
  // since the last vertex point\n\
  var internalPoints = [];\n\
\n\
  for(var p = 0; p < this.paths.length; p++) {\n\
    var path = this.paths[p];\n\
    for(var s = 0; s < path.segments.length; s++) {\n\
      var segment = path.segments[s];\n\
\n\
      lastVertex = null;\n\
      var lastVertexIndex = 0;\n\
\n\
      for(var i=0; i< segment.points.length; i++) {\n\
        var point = segment.points[i];\n\
        if (point.graphVertex) { // this is a vertex point\n\
          if (lastVertex !== null) {\n\
            var edge = this.graph.getEquivalentEdge(internalPoints, lastVertex,\n\
              point.graphVertex);\n\
\n\
            if (!edge) {\n\
              edge = this.graph.addEdge(internalPoints, lastVertex, point.graphVertex);\n\
\n\
              // calculate the angle and apply to edge stops\n\
              var dx = point.graphVertex.x - lastVertex.x;\n\
              var dy = point.graphVertex.y - lastVertex.y;\n\
              var angle = Math.atan2(dy, dx) * 180 / Math.PI;\n\
              point.angle = lastVertex.point.angle = angle;\n\
              for(var is = 0; is < internalPoints.length; is++) {\n\
                internalPoints[is].angle = angle;\n\
              }\n\
            }\n\
\n\
            path.addEdge(edge);\n\
            segment.graphEdges.push(edge);\n\
            edge.addPath(path);\n\
            edge.addPathSegment(segment);\n\
\n\
          }\n\
\n\
          lastVertex = point.graphVertex;\n\
          lastVertexIndex = i;\n\
          internalPoints = [];\n\
        } else { // this is an internal point\n\
          internalPoints.push(point);\n\
        }\n\
      }\n\
    }\n\
  }\n\
};\n\
\n\
Transitive.prototype.populateRenderSegments = function() {\n\
  this.renderSegments = [];\n\
\n\
  this.paths.forEach(function(path) {\n\
    path.segments.forEach(function(pathSegment) {\n\
      pathSegment.renderSegments = [];\n\
      pathSegment.graphEdges.forEach(function(edge) {\n\
        var renderSegment = new Segment(pathSegment.type);\n\
        renderSegment.pattern = pathSegment.pattern;\n\
        renderSegment.addEdge(edge);\n\
        renderSegment.points.push(edge.fromVertex.point);\n\
        renderSegment.points.push(edge.toVertex.point);\n\
        edge.addRenderSegment(renderSegment);\n\
\n\
        this.renderSegments.push(renderSegment);\n\
        pathSegment.renderSegments.push(renderSegment);\n\
      }, this);\n\
    }, this);\n\
  }, this);\n\
\n\
};\n\
\n\
\n\
Transitive.prototype.offsetSegment = function(segment, axisId, offset) {\n\
  if(segment.pattern) {\n\
    this.renderSegments.forEach(function(rseg) {\n\
      if(rseg.pattern && rseg.pattern.pattern_id === segment.pattern.pattern_id) {\n\
        rseg.offsetAxis(axisId, offset);\n\
      }\n\
    });\n\
  }\n\
  else segment.offsetAxis(axisId, offset);\n\
};\n\
\n\
/**\n\
 * Apply an array of filters to an array of data\n\
 *\n\
 * @param {Array} data\n\
 * @param {Array} filters\n\
 */\n\
\n\
function applyFilters(data, filters) {\n\
  filters.forEach(function (filter) {\n\
    data = data.filter(filter);\n\
  });\n\
\n\
  return data;\n\
}\n\
//# sourceURL=lib/transitive.js"
));

require.register("transitive/lib/segment.js", Function("exports, module",
"/**\n\
 * Dependencies\n\
 */\n\
\n\
var d3 = require(\"mbostock~d3@v3.4.6\");\n\
\n\
var SegmentLabel = require(\"transitive/lib/labeler/segmentlabel.js\");\n\
\n\
\n\
var segmentId = 0;\n\
\n\
/**\n\
 * Expose `Segment`\n\
 */\n\
\n\
module.exports = Segment;\n\
\n\
/**\n\
 * \n\
 */\n\
\n\
function Segment(type) {\n\
  this.id = segmentId++;\n\
  this.type = type;\n\
  this.points = [];\n\
  this.graphEdges = [];\n\
  this.edgeFromOffsets = {};\n\
  this.edgeToOffsets = {};\n\
  this.focused = true;\n\
\n\
  this.label = new SegmentLabel(this);\n\
  this.renderLabel = true;\n\
\n\
  this.sortableType = 'SEGMENT';\n\
\n\
}\n\
\n\
\n\
Segment.prototype.getId = function() {\n\
  return this.id;\n\
};\n\
\n\
Segment.prototype.getType = function() {\n\
  return this.type;\n\
};\n\
\n\
Segment.prototype.addEdge = function(edge) {\n\
  this.graphEdges.push(edge);\n\
};\n\
\n\
\n\
Segment.prototype.removeEdge = function(edge) {\n\
  while(this.graphEdges.indexOf(edge) !== -1) {\n\
    this.graphEdges.splice(this.graphEdges.indexOf(edge), 1);\n\
  }\n\
};\n\
\n\
\n\
Segment.prototype.getEdgeIndex = function(edge) {\n\
  for(var i = 0; i < this.graphEdges.length; i++) {\n\
    if(this.graphEdges[i].edge === edge) return i;\n\
  }\n\
  return -1;\n\
};\n\
\n\
\n\
Segment.prototype.getAdjacentEdge = function(edge, vertex) {\n\
\n\
  // ensure that edge/vertex pair is valid\n\
  if(edge.toVertex !== vertex && edge.fromVertex !== vertex) return null;\n\
\n\
  var index = this.getEdgeIndex(edge);\n\
  if(index === -1) return null;\n\
\n\
  // check previous edge\n\
  if(index > 0) {\n\
    var prevEdge = this.graphEdges[index-1].edge;\n\
    if(prevEdge.toVertex === vertex || prevEdge.fromVertex === vertex) return prevEdge;\n\
  }\n\
\n\
  // check next edge\n\
  if(index < this.graphEdges.length-1) {\n\
    var nextEdge = this.graphEdges[index+1].edge;\n\
    if(nextEdge.toVertex === vertex || nextEdge.fromVertex === vertex) return nextEdge;\n\
  }\n\
\n\
  return null;\n\
};\n\
\n\
\n\
Segment.prototype.setEdgeFromOffset = function(edge, offset) {\n\
  this.edgeFromOffsets[edge] = offset;\n\
};\n\
\n\
Segment.prototype.setEdgeToOffset = function(edge, offset) {\n\
  this.edgeToOffsets[edge] = offset;\n\
};\n\
\n\
Segment.prototype.clearOffsets = function() {\n\
  this.edgeFromOffsets = {};\n\
  this.edgeToOffsets = {};\n\
};\n\
\n\
Segment.prototype.offsetAxis = function(axisId, offset) {\n\
  var axisInfo = axisId.split('_');\n\
  var axisVal = parseFloat(axisInfo[1]);\n\
  this.graphEdges.forEach(function(graphEdge) {\n\
    \n\
    if(axisInfo[0] === 'y') {\n\
      if(axisVal === graphEdge.fromVertex.y && graphEdge.fromVector.y === 0) {\n\
        this.setEdgeFromOffset(graphEdge, offset);\n\
      }\n\
      if(axisVal === graphEdge.toVertex.y && graphEdge.toVector.y === 0) {\n\
        this.setEdgeToOffset(graphEdge, offset);\n\
      }\n\
    }\n\
\n\
    if(axisInfo[0] === 'x') {\n\
      if(axisVal === graphEdge.fromVertex.x && graphEdge.fromVector.x === 0) {\n\
        this.setEdgeFromOffset(graphEdge, offset);\n\
      }\n\
      if(axisVal === graphEdge.toVertex.x && graphEdge.toVector.x === 0) {\n\
        this.setEdgeToOffset(graphEdge, offset);\n\
      }\n\
    }\n\
\n\
  }, this);\n\
};\n\
\n\
\n\
/**\n\
 * Draw\n\
 */\n\
\n\
Segment.prototype.draw = function(display, capExtension) {\n\
  //var stops = this.points;\n\
\n\
  // add the line to the NetworkPath\n\
  this.line = d3.svg.line() // the line translation function\n\
    .x(function (pointInfo, i) {\n\
      var vx = pointInfo.x, x;\n\
\n\
      // if first/last element, extend the line slightly\n\
      var edgeIndex = i === 0\n\
        ? 0\n\
        : i - 1;\n\
\n\
      x = display.xScale(vx);\n\
\n\
      if (pointInfo.offsetX) {\n\
        x += pointInfo.offsetX;\n\
      }\n\
\n\
      return x;\n\
    })\n\
    .y(function (pointInfo, i) {\n\
      var vy = pointInfo.y, y;\n\
\n\
      var edgeIndex = (i === 0) ? 0 : i - 1;\n\
\n\
      y = display.yScale(vy);\n\
\n\
      if (pointInfo.offsetY) {\n\
        y -= pointInfo.offsetY;\n\
      }\n\
\n\
      return y;\n\
    })\n\
    .interpolate(display.lineInterpolator.bind(this));\n\
\n\
  this.svgGroup = display.svg.append('g');\n\
\n\
  this.lineSvg = this.svgGroup.append('g')\n\
    .attr('class', 'transitive-sortable')\n\
    .datum({\n\
      owner: this,\n\
      sortableType: 'SEGMENT'\n\
    });\n\
\n\
  this.labelSvg = this.svgGroup.append('g');\n\
\n\
  this.lineGraph = this.lineSvg.append('path');\n\
\n\
  this.lineGraph\n\
    //.attr('id', 'transitive-path-' +this.parent.getElementId())\n\
    .attr('class', 'transitive-line')\n\
    .data([this]);\n\
    //.data([{ owner: this, element : this.lineGraph }]);\n\
\n\
  this.lineGraphFront = this.lineSvg.append('path');\n\
\n\
  this.lineGraphFront\n\
    .attr('class', 'transitive-line-front')\n\
    .data([this]);\n\
    //.data([{ owner: this, element: this.lineGraphFront }]);\n\
};\n\
\n\
\n\
Segment.prototype.setFocused = function(focused) {\n\
  this.focused = focused;\n\
};\n\
\n\
\n\
/**\n\
 * Refresh\n\
 */\n\
\n\
Segment.prototype.refresh = function(display) {\n\
\n\
  // update the line\n\
  if(!this.renderData || this.renderData.length === 0) return;\n\
  this.lineGraph.attr('d', this.line(this.renderData));\n\
  this.lineGraphFront.attr('d', this.line(this.renderData));\n\
  display.styler.renderSegment(display, this);\n\
};\n\
\n\
\n\
Segment.prototype.refreshRenderData = function(updatePoints, styler, display) {\n\
  this.renderData = [];\n\
\n\
  var pointIndex = 0;\n\
\n\
  if(styler && display) {\n\
    // compute the line width\n\
    var env = styler.compute(styler.segments.envelope, display, this);\n\
    if(env) {\n\
      this.lineWidth = parseFloat(env.substring(0, env.length - 2), 10) - 2;\n\
    }\n\
    else {\n\
      var lw = styler.compute(styler.segments['stroke-width'], display, this);\n\
      this.lineWidth = parseFloat(lw.substring(0, lw.length - 2), 10) - 2;\n\
    }\n\
  }\n\
\n\
  this.graphEdges.forEach(function(edge, edgeIndex) {\n\
\n\
    var edgeRenderData = [];\n\
\n\
    var pointInfo;\n\
\n\
    var fromOffsetX = 0, fromOffsetY = 0, toOffsetX = 0, toOffsetY = 0;\n\
\n\
    if(edge in this.edgeFromOffsets) {\n\
      var fromOffset = this.edgeFromOffsets[edge] * this.lineWidth;\n\
      fromOffsetX = fromOffset * edge.fromRightVector.x;\n\
      fromOffsetY = fromOffset * edge.fromRightVector.y;\n\
    }\n\
\n\
    if(edge in this.edgeToOffsets) {\n\
      var toOffset = this.edgeToOffsets[edge] * this.lineWidth;\n\
      toOffsetX = toOffset * edge.toRightVector.x;\n\
      toOffsetY = toOffset * edge.toRightVector.y;\n\
    }\n\
\n\
    if(this.getType() === 'WALK') {\n\
\n\
      var fromOffsets = getAveragePointOffsets(this.points[0]);\n\
      if(fromOffsets) {\n\
        fromOffsetX = fromOffsets.x;\n\
        fromOffsetY = fromOffsets.y;\n\
      }\n\
\n\
      var toOffsets = getAveragePointOffsets(this.points[this.points.length - 1]);\n\
      if(toOffsets) {\n\
        toOffsetX = toOffsets.x;\n\
        toOffsetY = toOffsets.y;\n\
      }\n\
    }\n\
\n\
    // the \"from\" vertex point for this edge\n\
    pointInfo = {\n\
      segment: this,\n\
      path: edge.paths[0],\n\
      x: edge.fromVertex.x,\n\
      y: edge.fromVertex.y,\n\
      point: edge.fromVertex.point,\n\
      inEdge: null,\n\
      outEdge: edge,\n\
      index: pointIndex++,\n\
      offsetX: fromOffsetX,\n\
      offsetY: fromOffsetY\n\
    };\n\
\n\
    edgeRenderData.push(pointInfo);\n\
\n\
    if(updatePoints) edge.fromVertex.point.addRenderData(pointInfo);\n\
\n\
\n\
    // the internal points for this edge\n\
    if(edge.curvaturePoints && edge.curvaturePoints.length > 0) {\n\
      var cpoints = edge.getCurvaturePoints(fromOffsetX, fromOffsetY, toOffsetX, toOffsetY);\n\
      edgeRenderData = edgeRenderData.concat(cpoints);\n\
    }\n\
\n\
    if(updatePoints) edge.renderInternalPoints(this, fromOffsetX, fromOffsetY, toOffsetX, toOffsetY);\n\
\n\
\n\
    // the \"to\" vertex point for this edge.\n\
\n\
    pointInfo = {\n\
      segment: this,\n\
      path: edge.paths[0],\n\
      x: edge.toVertex.x,\n\
      y: edge.toVertex.y,\n\
      point: edge.toVertex.point,\n\
      index: pointIndex,\n\
      offsetX: toOffsetX,\n\
      offsetY: toOffsetY\n\
    };\n\
\n\
    edgeRenderData.push(pointInfo);\n\
\n\
    if(updatePoints) edge.toVertex.point.addRenderData(pointInfo);\n\
\n\
    this.renderData = this.renderData.concat(edgeRenderData);\n\
  }, this);\n\
\n\
};\n\
\n\
Segment.prototype.refreshLabel = function(display) {\n\
  if(!this.renderLabel) return;\n\
  this.label.refresh(display);\n\
};\n\
\n\
\n\
\n\
Segment.prototype.getLabelAnchors = function(display) {\n\
\n\
  var labelAnchors = [];\n\
  var x, x1, x2, y, y1, y2;\n\
\n\
\n\
  if(this.renderData.length === 2) { // basic straight segment\n\
    if(this.renderData[0].x === this.renderData[1].x) { // vertical\n\
      x = display.xScale(this.renderData[0].x) + this.renderData[0].offsetX;\n\
      y1 = display.yScale(this.renderData[0].y);\n\
      y2 = display.yScale(this.renderData[1].y);\n\
      labelAnchors.push({ x : x, y: (y1 + y2) / 2 });\n\
    }\n\
    else if(this.renderData[0].y === this.renderData[1].y) { // horizontal\n\
      x1 = display.xScale(this.renderData[0].x);\n\
      x2 = display.xScale(this.renderData[1].x);\n\
      y = display.yScale(this.renderData[0].y) - this.renderData[0].offsetY;\n\
      labelAnchors.push({ x : (x1 + x2) / 2, y: y });\n\
    }\n\
  }\n\
\n\
  if(this.renderData.length === 4) { // basic curved segment\n\
\n\
    if(this.renderData[0].x === this.renderData[1].x) { // vertical first\n\
      x = display.xScale(this.renderData[0].x) + this.renderData[0].offsetX;\n\
      y1 = display.yScale(this.renderData[0].y);\n\
      y2 = display.yScale(this.renderData[3].y);\n\
      labelAnchors.push({ x : x, y: (y1 + y2) / 2 });\n\
\n\
    }\n\
    else if(this.renderData[0].y === this.renderData[1].y) { // horiz first\n\
      x1 = display.xScale(this.renderData[0].x);\n\
      x2 = display.xScale(this.renderData[3].x);\n\
      y = display.yScale(this.renderData[0].y) - this.renderData[0].offsetY;\n\
      labelAnchors.push({ x : (x1 + x2) / 2, y: y });\n\
    }\n\
  }\n\
\n\
  return labelAnchors;\n\
\n\
};\n\
\n\
\n\
Segment.prototype.compareTo = function(other) {\n\
\n\
  // if segments are equal, then we are comparing the main and foreground elements\n\
  if(this === other) {\n\
    console.log('eq seg');\n\
  }\n\
  \n\
  // show transit segments in front of other types\n\
  if(this.type === 'TRANSIT' && other.type !== 'TRANSIT') return 1;\n\
  if(other.type === 'TRANSIT' && this.type !== 'TRANSIT') return -1;\n\
\n\
  if(this.type === 'TRANSIT' && other.type === 'TRANSIT') {\n\
\n\
    // for two transit segments, try sorting transit mode first\n\
    if(this.pattern.route.route_type !== other.pattern.route.route_type) {\n\
      return (this.pattern.route.route_type < other.pattern.route.route_type);\n\
    }\n\
\n\
    // for two transit segments of the same mode, sort by id (for display consistency)\n\
    return (this.getId() < other.getId());\n\
  }\n\
};\n\
\n\
\n\
Segment.prototype.isFocused = function() {\n\
  return (this.focused === true);\n\
};\n\
\n\
\n\
Segment.prototype.getZIndex = function() {\n\
  return this.zIndex;\n\
};\n\
\n\
\n\
function getAveragePointOffsets(point) {\n\
  var count = 0;\n\
  var offsetXTotal = 0, offsetYTotal = 0;\n\
\n\
  if(point.patternRenderData) {\n\
    for(var pattern in point.patternRenderData) {\n\
      var patternRenderInfo = point.patternRenderData[pattern];\n\
      offsetXTotal += patternRenderInfo.offsetX;\n\
      offsetYTotal += patternRenderInfo.offsetY;\n\
      count++;\n\
    }\n\
  }\n\
  else if(point.renderData) {\n\
    point.renderData.forEach(function(renderData) {\n\
      offsetXTotal += renderData.offsetX;\n\
      offsetYTotal += renderData.offsetY;\n\
      count++;\n\
    });\n\
  }\n\
\n\
  if(count > 0) {\n\
    return {\n\
      x: offsetXTotal / count,\n\
      y: offsetYTotal / count\n\
    };\n\
  }\n\
\n\
  return null;\n\
}\n\
//# sourceURL=lib/segment.js"
));

require.modules["transitive"] = require.modules["transitive"];


require("transitive")