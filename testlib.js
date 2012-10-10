/**
 * This is the top level global variable that this example is stored under.
 * For this example, it is MYAPP.
 *
 * @module MYAPP
 */
var TESTLIB = TESTLIB || {};

/**
 * The namespace function, used to define new namespaces.
 * @param ns_string The namespace that is to be defined.
 * @method namespace
 * @return {Object} The newly created namespace, or existing one.
 */
TESTLIB.namespace = function (ns_string) {
    'use strict';
    var parts = ns_string.split('.'),
        parent = TESTLIB,
        i;

    if (parts[0] === "TESTLIB") {
        parts = parts.slice(1);
    }

    for (i = 0; i < parts.length; i += 1) {
        // create a property if it doesn't exist
        if (parent[parts[i]] === "undefined") {
            parent[parts[i]] = {};
        }
        parent = parent[parts[i]];
    }

    return parent;
};

TESTLIB.namespace('TESTLIB.Vector');
TESTLIB.namespace('TESTLIB.VectorUtil');

/**
 * The vector class.
 * @class Vector
 * @constructor
 */
TESTLIB.Vector = function () {
    'use strict';
};

TESTLIB.Vector.prototype = {


    /**
     * The vector's data.
     *
     * @property data
     * @type Array
     * @default {}
     **/
    data: {},

    /**
     * Sum all of the values in the vector.
     * @method sum
     * @return {Number} The sum of all of the vector values.
     */
    sum: function () {
        'use strict';
        var result = 0, i;
        for (i = 0; i < this.data.length; i += 1) {
            result += this.data[i];
        }
        return result;
    },

    /**
     * The number of elements in this vector.
     * @method sum
     * @return {Number} The number of elements in this vector.
     */
    count: function () {
        'use strict';
        return this.data.length;
    },

    /**
     * The vector length.
     *
     * @method length
     * @return {Number} The vector length.
     */
    length: function () {
        'use strict';
        var i, result;

        result = 0;

        for (i = 0; i < this.data.length; i += 1) {
            result += Math.pow(this.data[i], 2);
        }

        return Math.sqrt(result);
    },

    /**
     * Clear all of the vector elements to zero.
     *
     * @method clear
     * @param len The length, if omitted, length stays the same.
     */
    clear: function (len) {
        'use strict';
        var i, len2;

        this.data = [];
        len2 = len || this.data.length;
        for (i = 0; i < len2; i += 1) {
            this.data[i] = 0;
        }
    },
    /**
     * Format the vector as a string.
     * @method toString
     * @return {String} The string.
     */
    toString: function () {
        'use strict';
        return '[' + this.data.join(',') + ']';
    }
};

/**
 * Create a new vector.
 * @param a If a number, then the length of the vector.  If an array, the initial value of the vector.
 * @method create
 * @static
 * @return {TESTLIB.Vector} The newly created vector.
 */
TESTLIB.Vector.create = function (a) {
    'use strict';
    var result = new TESTLIB.Vector();

    if (a instanceof Array) {
        result.data = a.splice(0);
    } else {
        result.clear(a || 0);
    }


    return result;
};

/**
 * A class that provides utilities for vectors.
 * @class VectorUtil
 * @constructor
 */
TESTLIB.VectorUtil = function () {
    'use strict';
};

/**
 * Calculate the distance between two vectors.
 * @param a The first vector.
 * @param b The second vector.
 * @method distance
 * @return {Number} The distance.
 */
TESTLIB.VectorUtil.distance = function (a, b) {
    'use strict';
    var result = 0, i, d;

    if (!(a instanceof TESTLIB.Vector) || !(b instanceof  TESTLIB.Vector)) {
        throw new Error("Only Vector objects can have have their distance compared.");
    }

    if (a.count() !== b.count()) {
        throw new Error("Only Vector objects of the same size can calculate a distance.");
    }

    for (i = 0; i < a.data.length; i += 1) {
        d = a.data[i] - b.data[i];
        result += d * d;
    }

    return Math.sqrt(result);
};

/**
 * Calculate the distance between two vectors.
 * @param a The first vector to add.
 * @param b The second vector to add.
 * @method distance
 * @return {TESTLIB.Vector} The distance.
 */
TESTLIB.VectorUtil.add = function (a, b) {
    'use strict';
    var result, i;

    if (!(a instanceof TESTLIB.Vector) || !(b instanceof  TESTLIB.Vector)) {
        throw new Error("Only Vector objects can be added.");
    }

    if (a.count() !== b.count()) {
        throw new Error("Only Vector objects of the same size can be added.");
    }

    result = TESTLIB.Vector.create(a.count());

    for (i = 0; i < a.data.length; i += 1) {
        result.data[i] = a.data[i] + b.data[i];
    }

    return result;
};
