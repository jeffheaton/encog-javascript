/*
 * Encog(tm) Core v0.1 - Javascript Version
 * http://www.heatonresearch.com/encog/
 * http://code.google.com/p/encog-java/

 * Copyright 2008-2012 Heaton Research, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *   
 * For more information on Heaton Research copyrights, licenses 
 * and trademarks visit:
 * http://www.heatonresearch.com/copyright
 */

/**
 * The main Encog namespace.  This is the only global property created by Encog.
 * @type {*}
 */
var ENCOG = ENCOG || {
    /**
     * The version of Encog that this is.
     * @property property
     * @type String
     * @final
     */
    VERSION : '1.0',

    /**
     * The Encog platform being used.
     * @property property
     * @type String
     * @final
     */
    PLATFORM : 'javascript',

    /**
     * The precision that Encog uses.
     * @property precision
     * @type String
     * @final
     */
    precision : 1e-10,

    /**
     * A newline character.
     * @property property
     * @type String
     * @final
     */
    NEWLINE : '\n',

    /**
     * The Encog type for activation functions.
     * @property ENCOG_TYPE_ACTIVATION
     * @type String
     * @final
     */
    ENCOG_TYPE_ACTIVATION : 'ActivationFunction',

    /**
     * The Encog type for RBF functions.
     * @property ENCOG_TYPE_ACTIVATION
     * @type String
     * @final
     */
    ENCOG_TYPE_RBF : 'RBF'
};

/**
 * The namespace function, used to define new namespaces.
 * @param namespaceString The namespace that is to be defined.
 * @method namespace
 * @return {Object} The newly created namespace, or existing one.
 */
ENCOG.namespace = function (namespaceString) {
    'use strict';

    var parts = namespaceString.split('.'),
        parent = window,
        currentPart = '',
        i,
        length;

    for (i = 0, length = parts.length; i < length; i += 1) {
        currentPart = parts[i];
        parent[currentPart] = parent[currentPart] || {};
        parent = parent[currentPart];
    }

    return parent;
};

ENCOG.namespace('ENCOG.ActivationSigmoid');
ENCOG.namespace('ENCOG.ActivationTANH');
ENCOG.namespace('ENCOG.ActivationLinear');
ENCOG.namespace('ENCOG.ActivationElliott');
ENCOG.namespace('ENCOG.ActivationElliottSymmetric');
ENCOG.namespace('ENCOG.RadialGaussian');
ENCOG.namespace('ENCOG.RadialMexicanHat');
ENCOG.namespace('ENCOG.Util');
ENCOG.namespace('ENCOG.MathUtil');
ENCOG.namespace('ENCOG.ArrayUtil');
ENCOG.namespace('ENCOG.BasicLayer');
ENCOG.namespace('ENCOG.BasicNetwork');
ENCOG.namespace('ENCOG.PropagationTrainer');
ENCOG.namespace('ENCOG.LinearErrorFunction');
ENCOG.namespace('ENCOG.LinearErrorFunction');
ENCOG.namespace('ENCOG.Swarm');
ENCOG.namespace('ENCOG.Anneal');
ENCOG.namespace('ENCOG.Genetic');
ENCOG.namespace('ENCOG.SOM');
ENCOG.namespace('ENCOG.TrainSOM');
ENCOG.namespace('ENCOG.ReadCSV');
ENCOG.namespace('ENCOG.EGFILE');

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// MathUtil: The following code provides math utilities for Encog                                            //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * The math utilities for Encog.
 * @class MathUtil
 * @constructor
 */
ENCOG.MathUtil = function () {
    'use strict';
};

/**
 * Calculate the hyperbolic tangent.
 * Unfortunately, Javascript does not have this built in.
 * @method tanh
 * @param x The value to calculate for.
 * @return {Number} The result from the calculation.
 */
ENCOG.MathUtil.tanh = function (x) {
    'use strict';
    var pos, neg;

    pos = Math.exp(x);
    neg = Math.exp(-x);

    return (pos - neg) / (pos + neg);

};

/**
 * Calculate the sign of a number, return 0 for zero,
 * 1 for positive, -1 for negative.
 * @method sign
 * @param x The value to calculate for.
 * @return {Number} The result.
 */
ENCOG.MathUtil.sign = function (x) {
    'use strict';
    if (Math.abs(x) < ENCOG.precision) {
        return 0;
    } else if (x > 0) {
        return 1;
    } else {
        return -1;
    }
};

/**
 * Calculate the euclidean distance between a1 and a2.  Use the specified starting index and length.
 * @param a1 The first array to consider.
 * @param a2 The second array to consider.
 * @param startIndex The starting index.
 * @param len The length.
 * @method euclideanDistance
 * @return {Number}
 */
ENCOG.MathUtil.euclideanDistance = function (a1, a2, startIndex, len) {
    'use strict';

    var result = 0, i, diff;
    for (i = startIndex; i < (startIndex + len); i += 1) {
        diff = a1[i] - a2[i];
        result += diff * diff;
    }
    return Math.sqrt(result);
};

/**
 * Determine which multi-dimensional array element, from lst, is the nearest to a1.
 * @param a1 A single-dimension array that is searched for in lst.
 * @param lst A 2d array that contains arrays with the same length of a1.
 * @param k The number of neighbors to find.
 * @param maxDist The maximum distance to consider.
 * @param startIndex The starting index.
 * @param len The length.
 * @return {Array} The k elements from lst that were the closest to a1.
 */
ENCOG.MathUtil.kNearest = function (a1, lst, k, maxDist, startIndex, len) {
    'use strict';
    var result = [], tempDist = [], idx = 0, worstIdx = -1, dist, agent;

    while (idx < lst.length) {
        agent = lst[idx];
        if (a1 !== agent) {
            dist = ENCOG.MathUtil.euclideanDistance(a1, agent, startIndex, len);

            if (dist < maxDist) {
                if (result.length < k) {
                    result.push(agent);
                    tempDist.push(dist);
                    worstIdx = ENCOG.ArrayUtil.arrayMaxIndex(tempDist);
                } else {
                    if (dist < tempDist[worstIdx]) {
                        tempDist[worstIdx] = dist;
                        result[worstIdx] = agent;
                        worstIdx = ENCOG.ArrayUtil.arrayMaxIndex(tempDist);
                    }
                }
            }
        }

        idx += 1;
    }

    return result;
};

/**
 * Generate a random floating point number.
 * @param low The first array to consider.
 * @param high The second array to consider.
 * @method randomFloat
 * @return {Number}
 */
ENCOG.MathUtil.randomFloat = function (low, high) {
    'use strict';
    return (Math.random * (high - low)) + low;
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// ArrayUtil: The following code provides array utilities for Encog                                          //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * The Encog array utilities.
 * @class ArrayUtil
 * @constructor
 */
ENCOG.ArrayUtil = function () {
    'use strict';
};

/**
 * Fill an array with a specific value.
 * @method fillArray
 * @param arr The array to fill.
 * @param start The starting index.
 * @param stop The stopping index.
 * @param v The value to fill.
 */
ENCOG.ArrayUtil.fillArray = function (arr, start, stop, v) {
    'use strict';
    var i;

    for (i = start; i < stop; i += 1) {
        arr[i] = v;
    }
};

/**
 * Create a new floating point array.
 * @param sz The size of the array to create.
 * @method newFloatArray
 * @return {Array}
 */
ENCOG.ArrayUtil.newFloatArray = function (sz) {
    'use strict';
    var result;
    result = [];
    while (sz > 0) {
        result.push(0.0);
        sz-=1;
    }
    return result;
};

/**
 * Create a new int array.
 * @param sz The size of the array to create.
 * @method newIntArray
 * @return {Array}
 */
ENCOG.ArrayUtil.newIntArray = function (sz) {
    'use strict';
    var result;
    result = [];
    while ((sz -= 1) > 0) {
        result.push(0);
    }
    return result;
};

/**
 * Fill a 2D array.
 * @param arr The size of the array to create.
 * @param v The value to fill the array with.
 * @method fillArray2D
 */
ENCOG.ArrayUtil.fillArray2D = function (arr, v) {
    'use strict';
    var i, j, row;

    for (i = 0; i < arr.length; i += 1) {
        row = arr[i];
        for (j = 0; j < row.length; j += 1) {
            row[j] = v;
        }
    }
};


/**
 * Randomize an array.
 * @param arr The array to randomize.
 * @param start The starting index in the array.
 * @param stop The stopping index in the array.
 * @param low The low-end of the random range.
 * @param high The high-end of the random range.
 * @method randomizeArray
 */
ENCOG.ArrayUtil.randomizeArray = function (arr, start, stop, low, high) {
    'use strict';
    var i;

    for (i = start; i < stop; i += 1) {
        arr[i] = ENCOG.MathUtil.randomFloat(low, high);
    }
};

/**
 * Randomize a 2D array.
 * @param arr The array to randomize.
 * @param low The low-end of the random range.
 * @param high The high-end of the random range.
 * @method randomizeArray2D
 */
ENCOG.ArrayUtil.randomizeArray2D = function (arr, low, high) {
    'use strict';
    var i, j, row;

    for (i = 0; i < arr.length; i += 1) {
        row = arr[i];
        for (j = 0; j < row.length; j += 1) {
            row[j] = ENCOG.MathUtil.randomFloat(low, high);
        }
    }
};

/**
 * Allocate an array of zeros of the specified size.
 * @method allocate1D
 * @param x The size of the array.
 */
ENCOG.ArrayUtil.allocate1D = function (x) {
    'use strict';
    var i, result;

    result = [];
    for (i = 0; i < x; i += 1) {
        result[i] = 0;
    }

    return result;
};

/**
 * Allocate a 2D array of booleans.
 * @param rows The number of rows.
 * @param cols The number of columns.
 * @return {Array} The allocated array.
 */
ENCOG.ArrayUtil.allocateBoolean2D = function (rows, cols) {
    'use strict';
    var result, row, col, temp;

    result = [
        []
    ];

    for (row = 0; row < rows; row += 1) {
        temp = [];
        for (col = 0; col < cols; col += 1) {
            temp[col] = false;
        }
        result[row] = temp;
    }

    return result;
};

/**
 * Copy an array.
 * @method arrayCopy
 * @param source The source array.
 * @param sourceStart The index to start at in the source.
 * @param target The target array.
 * @param targetStart The target starting index.
 * @param count The count of values to copy.
 */
ENCOG.ArrayUtil.arrayCopy = function (source, sourceStart, target, targetStart, count) {
    'use strict';
    var i;

    for (i = 0; i < count; i += 1) {
        target[i + targetStart] = source[i + sourceStart];
    }
};

/**
 * Generate benchmark data.  This is a random training set.
 * @method generateBenchmarkData
 * @param rowCount The number of rows to generate.
 * @param colCount The number of columns to generate.
 * @return {Array} The resulting array.
 */
ENCOG.ArrayUtil.generateBenchmarkData = function (rowCount, colCount) {
    'use strict';
    var result, item, row, col;

    result = [
        []
    ];

    for (row = 0; row < rowCount; row += 1) {
        item = [];
        for (col = 0; col < colCount; col += 1) {
            item[col] = (Math.random() * 2) - 1;
        }
        result[row] = item;
    }

    return result;
};

/**
 * Calculate the mean of one dimension in the 2D array a1.
 * @method arrayMean
 * @param a1 A 2D array.
 * @param idx The second dimension in a1 to calculate the mean of.
 * @return {Number} The mean of each idx element of a1.
 */
ENCOG.ArrayUtil.arrayMean = function (a1, idx) {
    'use strict';
    var result, i;

    result = 0;
    for (i = 0; i < a1.length; i += 1) {
        result += a1[i][idx];
    }
    result /= a1.length;
    return result;
};

/**
 * Determine the index of the minimum value in an array.
 * @method arrayMinIndex
 * @param a1 A 1D array.
 * @return {Number} Index of the minimum value in the array.
 */
ENCOG.ArrayUtil.arrayMinIndex = function (a1) {
    'use strict';
    var result, resultIndex, i;

    result = Number.MAX_VALUE;
    resultIndex = -1;

    for (i = 0; i < a1.length; i += 1) {
        if (a1[i] < result) {
            result = a1[i];
            resultIndex = i;
        }
    }
    return resultIndex;
};

/**
 * Determine the index of the maximum value in an array.
 * @method arrayMinIndex
 * @param a1 A 1D array.
 * @return {Number} Index of the maximum value in the array.
 */
ENCOG.ArrayUtil.arrayMaxIndex = function (a1) {
    'use strict';
    var result, resultIndex, i;

    result = Number.MIN_VALUE;
    resultIndex = -1;

    for (i = 0; i < a1.length; i += 1) {
        if (a1[i] > result) {
            result = a1[i];
            resultIndex = i;
        }
    }
    return resultIndex;
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// Util: The following code provides general utilities for Encog                                             //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Strip leading, and ending, quotes from a string.  If the quotes are there.
 * @method stripQuotes
 * @param s The string to process.
 * @return {String} The string, with stripped quotes.
 */
ENCOG.Util.stripQuotes = function (s) {
    'use strict';
    var l = s.length;
    if (s[0] === '\"' || s[0] === '\'') {
        s = s.substr(1);
        l -= 1;
    }

    if (s[l - 1] === '\"' || s[l - 1] === '\'') {
        s = s.substr(0, l - 1);
    }

    return s;
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// Activation Functions: The following code implements activation functions used by Encog.                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * The sigmoid activation function takes on a sigmoidal shape. Only positive
 * numbers are generated. Do not use this activation function if negative number
 * output is desired.
 * @constructor
 * @class ActivationSigmoid
 */
ENCOG.ActivationSigmoid = function () {
    'use strict';
};
ENCOG.ActivationSigmoid.prototype = {
    /**
     * The name of this object.
     * @property NAME
     * @type String
     * @final
     */
    NAME : "ActivationSigmoid",

    /**
     * The Encog Type of this object.
     * @property encogType
     * @type String
     * @final
     */
    encogType : ENCOG.ENCOG_TYPE_ACTIVATION,

    /**
     * Calculate the activation function for the specified value.
     * @method activationFunction
     * @param x An array to calculate the values for.
     * @param start The starting point in the array to calculate.
     * @param size The size to calculate.
     */
    activationFunction : function (x, start, size) {
        'use strict';
        var i;

        for (i = start; i < start + size; i += 1) {
            x[i] = 1.0 / (1.0 + Math.exp(-1 * x[i]));
        }
    },

    /**
     * Calculate the derivative. For efficiency both the before and after
     * activation values are passed in.  Many activation derivatives can
     * be more efficiently calculated using the value after the regular
     * activation is calculated.
     * @param b The value before the regular activation was calculated.
     * @param a The value after the regular activation was calculated.
     * @return {Number} The result.
     */
    derivativeFunction : function (b, a) {
        'use strict';
        return a * (1.0 - a);
    }
};

/**
 * Create a Sigmoid activation function.
 * @method create
 * @return {ENCOG.ActivationSigmoid} The newly created activation function.
 */
ENCOG.ActivationSigmoid.create = function () {
    'use strict';
    return new ENCOG.ActivationSigmoid();
};

/**
 * The hyperbolic tangent activation function takes the curved shape of the
 * hyperbolic tangent. This activation function produces both positive and
 * negative output. Use this activation function if both negative and positive
 * output is desired.
 * @constructor
 * @class ActivationTANH
 */
ENCOG.ActivationTANH = function () {
    'use strict';
};

ENCOG.ActivationTANH.prototype = {
    /**
     * The name of this object.
     * @property NAME
     * @type String
     * @final
     */
    NAME : "ActivationTANH",
    encogType : ENCOG.ENCOG_TYPE_ACTIVATION,

    /**
     * Calculate the activation function for the specified value.
     * @method activationFunction
     * @param x An array to calculate the values for.
     * @param start The starting point in the array to calculate.
     * @param size The size to calculate.
     */
    activationFunction : function (x, start, size) {
        'use strict';
        var i;

        for (i = start; i < start + size; i += 1) {
            x[i] = ENCOG.MathUtil.tanh(x[i]);
        }
    },

    /**
     * Calculate the derivative. For efficiency both the before and after
     * activation values are passed in.  Many activation derivatives can
     * be more efficiently calculated using the value after the regular
     * activation is calculated.
     * @param b The value before the regular activation was calculated.
     * @param a The value after the regular activation was calculated.
     * @return {Number} The result.
     */
    derivativeFunction : function (b, a) {
        'use strict';
        return (1.0 - a * a);
    }
};

/**
 * Create a TANH activation function.
 * @method create
 * @return {ENCOG.ActivationTANH} The newly created activation function.
 */
ENCOG.ActivationTANH.create = function () {
    'use strict';
    return new ENCOG.ActivationTANH();
};

/**
 * The Linear layer is really not an activation function at all. The input is
 * simply passed on, unmodified, to the output. This activation function is
 * primarily theoretical and of little actual use. Usually an activation
 * function that scales between 0 and 1 or -1 and 1 should be used.
 * @constructor
 * @class ActivationLinear
 */
ENCOG.ActivationLinear = function () {
    'use strict';
};
ENCOG.ActivationLinear.prototype = {

    /**
     * The name of this object.
     * @property NAME
     * @type String
     * @final
     */
    NAME : "ActivationLinear",

    /**
     * The encog type of this object.
     * @property encogType
     * @type String
     * @final
     */
    encogType : ENCOG.ENCOG_TYPE_ACTIVATION,

    /**
     * Calculate the activation function for the specified value.
     * @method activationFunction
     */
    activationFunction : function () {
        'use strict';
    },

    /**
     * Calculate the derivative. For efficiency both the before and after
     * activation values are passed in.  Many activation derivatives can
     * be more efficiently calculated using the value after the regular
     * activation is calculated.
     * @return {Number} The result.
     */
    derivativeFunction : function () {
        'use strict';
        return 1.0;
    }
};

/**
 * Create a Linear activation function.
 * @method create
 * @return {ENCOG.ActivationTANH} The newly created activation function.
 */
ENCOG.ActivationLinear.create = function () {
    'use strict';
    return new ENCOG.ActivationLinear();
};

/**
 * Computationally efficient alternative to ActivationSigmoid.
 * Its output is in the range [0, 1], and it is derivable.
 *
 * It will approach the 0 and 1 more slowly than Sigmoid so it
 * might be more suitable to classification tasks than predictions tasks.
 *
 * Elliott, D.L. "A better activation function for artificial neural networks", 1993
 * http://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.46.7204&rep=rep1&type=pdf
 * @constructor
 * @class ActivationElliott
 */
ENCOG.ActivationElliott = function () {
    'use strict';
};

ENCOG.ActivationElliott.prototype = {

    /**
     * The name of this object.
     * @property NAME
     * @type String
     * @final
     */
    NAME : "ActivationElliott",

    /**
     * The encog type of this object.
     * @property encogType
     * @type String
     * @final
     */
    encogType : ENCOG.ENCOG_TYPE_ACTIVATION,
    slope : 1,

    /**
     * Calculate the activation function for the specified value.
     * @method activationFunction
     * @param x An array to calculate the values for.
     * @param start The starting point in the array to calculate.
     * @param size The size to calculate.
     */
    activationFunction : function (x, start, size) {
        'use strict';
        var i;

        for (i = start; i < start + size; i += 1) {
            x[i] = ((x[i] * this.slope) / 2) / (1 + Math.abs(x[i] * this.slope)) + 0.5;
        }
    },

    /**
     * Calculate the derivative. For efficiency both the before and after
     * activation values are passed in.  Many activation derivatives can
     * be more efficiently calculated using the value after the regular
     * activation is calculated.
     * @param b The value before the regular activation was calculated.
     * @param a The value after the regular activation was calculated.
     * @return {Number} The result.
     */
    derivativeFunction : function (b, a) {
        'use strict';
        return this.slope / (2.0 * (1.0 + Math.abs(b * this.slope)) * (1 + Math.abs(b * this.slope)));
    }
};

/**
 * Create a Elliott activation function.
 * @method create
 * @return {ENCOG.ActivationElliott} The newly created activation function.
 */
ENCOG.ActivationElliott.create = function (s) {
    'use strict';
    var result = new ENCOG.ActivationElliott();
    result.slope = s || 1;
    return result;
};

//

/**
 * Computationally efficient alternative to ActivationTANH.
 * Its output is in the range [-1, 1], and it is derivable.
 *
 * It will approach the -1 and 1 more slowly than Tanh so it
 * might be more suitable to classification tasks than predictions tasks.
 *
 * Elliott, D.L. "A better activation function for artificial neural networks", 1993
 * http://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.46.7204&rep=rep1&type=pdf
 * @constructor
 * @class ActivationElliottSymmetric
 */
ENCOG.ActivationElliottSymmetric = function () {
    'use strict';
};

ENCOG.ActivationElliottSymmetric.prototype = {

    /**
     * The name of this object.
     * @property NAME
     * @type String
     * @final
     */
    NAME : "ActivationElliottSymmetric",

    /**
     * The encog type of this object.
     * @property encogType
     * @type String
     * @final
     */
    encogType : ENCOG.ENCOG_TYPE_ACTIVATION,
    slope : 1,

    /**
     * Calculate the activation function for the specified value.
     * @method activationFunction
     * @param x An array to calculate the values for.
     * @param start The starting point in the array to calculate.
     * @param size The size to calculate.
     */
    activationFunction : function (x, start, size) {
        'use strict';
        var i;
        for (i = start; i < start + size; i += 1) {
            x[i] = (x[i] * this.slope) / (1 + Math.abs(x[i] * this.slope));
        }
    },

    /**
     * Calculate the derivative. For efficiency both the before and after
     * activation values are passed in.  Many activation derivatives can
     * be more efficiently calculated using the value after the regular
     * activation is calculated.
     * @param b The value before the regular activation was calculated.
     * @param a The value after the regular activation was calculated.
     * @return {Number} The result.
     */
    derivativeFunction : function (b, a) {
        'use strict';
        var d = (1.0 + Math.abs(b * this.slope));
        return this.slope / (d * d);
    }
};

/**
 * Create Elliott Symmetric activation function.
 * @method create
 * @return {ENCOG.ActivationElliottSymmetric} The newly created activation function.
 */
ENCOG.ActivationElliottSymmetric.create = function (s) {
    'use strict';
    var result = new ENCOG.ActivationElliottSymmetric();
    result.slope = s || 1;
    return result;
};


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// Radial Basis Functions: The following code implements Radial Basis Functions used by Encog                 //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

ENCOG.RadialGaussian = function () {
    'use strict';
};

ENCOG.RadialGaussian.prototype = {

    /**
     * The name of this object.
     * @property NAME
     * @type String
     * @final
     */
    NAME : "RadialGaussian",

    /**
     * The encog type of this object.
     * @property encogType
     * @type String
     * @final
     */
    encogType : ENCOG.ENCOG_TYPE_RBF,
    center : [],
    width : 1,
    peak : 1,

    /**
     * Calculate the activation function for the specified value.
     * @method calculate
     * @param x An array to calculate the values for.
     */
    calculate : function (x) {
        'use strict';

        var value = 0, i;

        for (i = 0; i < this.center.length; i += 1) {
            value += Math.pow(x[i] - this.center[i], 2) / (2.0 * this.width * this.width);
        }
        return this.peak * Math.exp(-value);
    }
};

/**
 * Create a gaussian RBF.
 * @method create
 * @return {ENCOG.ActivationElliottSymmetric} The newly created activation function.
 */
ENCOG.RadialGaussian.create = function (thePeak, theCenters, theWidth) {
    'use strict';
    var result = new ENCOG.RadialGaussian();
    result.peak = thePeak || 1;
    result.centers = theCenters;
    result.width = theWidth || 1;
    return result;
};

ENCOG.RadialMexicanHat = function () {
    'use strict';
};

ENCOG.RadialMexicanHat.prototype = {

    /**
     * The name of this object.
     * @property NAME
     * @type String
     * @final
     */
    NAME : "RadialMexicanHat",

    /**
     * The encog type of this object.
     * @property encogType
     * @type String
     * @final
     */
    encogType : ENCOG.ENCOG_TYPE_RBF,
    center : [],
    width : [],
    peak : 1,

    /**
     * Calculate the activation function for the specified value.
     * @method calculate
     * @param x An array to calculate the values for.
     */
    calculate : function (x) {
        'use strict';

        // calculate the "norm", but don't take square root
        // don't square because we are just going to square it
        var norm = 0, i;
        for (i = 0; i < this.center.length; i += 1) {
            norm += Math.pow(x[i] - this.center[i], 2);
        }

        // calculate the value

        return this.peak * (1 - norm) * Math.exp(-norm / 2);
    }
};

/**
 * Create a Mexican Hat RBF.
 * @method create
 * @return {ENCOG.ActivationElliottSymmetric} The newly created activation function.
 */
ENCOG.RadialMexicanHat.create = function (thePeak, theCenters, theWidth) {
    'use strict';
    var result = new ENCOG.RadialMexicanHat();
    result.peak = thePeak || 1;
    result.centers = theCenters;
    result.width = theWidth || 1;
    return result;
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// Error Functions: The following implements Error Functions ued by Encog                                     //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * The Linear Error function is used to calculate the value that propagation
 * training seeks to minimize. The linear function simply subtracts
 * desired from actual values.
 * @class LinearErrorFunction
 * @constructor
 */
ENCOG.LinearErrorFunction = function () {
    'use strict';
};

ENCOG.LinearErrorFunction.prototype = {
    /**
     * Calculate the error value for the ideal and actual results.
     * @method calculateError
     * @param ideal The ideal output.
     * @param actual The actual output.
     * @param error The resulting error.
     */
    calculateError : function (ideal, actual, error) {
        'use strict';
        var i;
        for (i = 0; i < actual.length; i += 1) {
            error[i] = ideal[i] - actual[i];
        }

    }
};

/**
 * Create the linear error function.
 * @return {ENCOG.LinearErrorFunction}
 */
ENCOG.LinearErrorFunction.create = function () {
    'use strict';
    return new ENCOG.LinearErrorFunction();
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// Feedforward Neural Network: The following code implements Feedforward neural networks for Encog            //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * The BasicLayer class is used to specify neural networks.  Once
 * the neural network is created, this class is no longer used.
 * @class BasicLayer
 * @constructor
 */
ENCOG.BasicLayer = function () {
    'use strict';
};

ENCOG.BasicLayer.prototype = {

    /**
     * The name of this object.
     * @property NAME
     * @type String
     * @final
     */
    NAME : 'BasicLayer',

    /**
     * The activation function to use for this layer.
     * @property activation
     * @type {Object}
     */
    activation : null,

    /**
     * The neuron count for this layer.
     * @property count The neuron count.
     * @type {number}
     */
    count : null,

    /**
     * The activation level for the bias neuron.  Typically 1
     * if there are bias neurons, or zero if none.
     * @property biasActivation
     * @type {number}
     */
    biasActivation : null,

    /**
     * If this layer has context fed by other layers, this
     * property points to those other layers.
     * @property contextFedBy
     * @type {number}
     */
    contextFedBy : null,

    /**
     * Calculate the total count, including bias, of neurons.
     * @method calcTotalCount
     * @return {*}
     */
    calcTotalCount : function () {
        'use strict';
        if (this.contextFedBy === null) {
            return this.count + (this.hasBias() ? 1 : 0);
        } else {
            return this.count + (this.hasBias() ? 1 : 0)
                + this.contextFedBy.count;
        }
    },

    /**
     * Determine if this layer has bias.
     * @return {Boolean} True, if this layer has bias.
     */
    hasBias : function () {
        'use strict';
        return Math.abs(this.biasActivation) > ENCOG.precision;
    },

    /**
     * Calculate the count of context neurons.
     * @return {*} The count of context neurons.
     */
    calcContextCount : function () {
        'use strict';
        if (this.contextFedBy === null) {
            return 0;
        } else {
            return this.contextFedBy.count;
        }
    }
};

/**
 * Create a BasicLayer.
 * @param activation The activation function used by this layer.
 * @param count The neuron count for this layer.
 * @param biasActivation The bias activation for this layer, specify
 * 1 (or desired activation) to have a bias neuron, or 0 for none.
 * @return {ENCOG.BasicLayer} The newly created layer.
 */
ENCOG.BasicLayer.create = function (activation, count, biasActivation) {
    'use strict';
    var result;

    if (activation.encogType !== ENCOG.ENCOG_TYPE_ACTIVATION) {
        throw new Error("Invalid activation function.");
    }
    result = new ENCOG.BasicLayer();
    result.activation = activation;
    result.count = count;
    result.biasActivation = biasActivation;
    result.contextFedBy = null;
    return result;
};

/**
 * Basic Network, provides neural network functionality.
 *
 * @class BasicNetwork
 * @constructor
 **/
ENCOG.BasicNetwork = function () {
    'use strict';
};
ENCOG.BasicNetwork.prototype = {
    /**
     * The name of this object.
     * @property NAME
     * @type String
     * @final
     */
    NAME : 'BasicNetwork',

    /**
     * The input neuron count.
     * @property inputCount
     * @type number
     */
    inputCount : null,

    /**
     * The output neuron count.
     * @property outputCount
     * @type number
     */
    outputCount : null,

    /**
     * The individual layer neuron counts.
     * @property layerCounts
     * @type Array
     */
    layerCounts : null,

    /**
     * The individual layer neuron context counts.
     * @property layerContextCount
     * @type Array
     */
    layerContextCount : null,

    /**
     * The weight indexes.
     * @property weightIndex
     * @type Array
     */
    weightIndex : null,

    /**
     * The individual layer indexes.
     * @property layerIndex
     * @type Array
     */
    layerIndex : null,

    /**
     * The activation functions.
     * @property activationFunctions
     * @type Array
     */
    activationFunctions : null,

    /**
     * The layer feed counts.  These are neurons that are actually fed from
     * the previous layer (i.e. not bias or context).
     * @property layerFeedCounts
     * @type Array
     */
    layerFeedCounts : null,

    /**
     * The context target feed counts.
     * @property contextTargetSize
     * @type Array
     */
    contextTargetOffset : null,

    /**
     * The context target sizes.
     * @property contextTargetSize
     * @type Array
     */
    contextTargetSize : null,

    /**
     * The activation level for bias neurons on this layer.
     * @property biasActivation
     * @type Array
     */
    biasActivation : null,

    /**
     * The layer to begin training at.
     * @property beginTraining
     * @type Number
     */
    beginTraining : null,

    /**
     * The layer to end training at.
     * @property endTraining
     * @type Number
     */
    endTraining : null,

    /**
     * The weights of the neural network.
     * @property weights
     * @type Array
     */
    weights : null,

    /**
     * The layer outputs.
     * @property layerOutput
     * @type Array
     */
    layerOutput : null,

    /**
     * The layer sums.
     * @property layerOutput
     * @type Array
     */
    layerSums : null,

    /**
     * The connection limit.
     * @property layerOutput
     * @type Number
     */
    connectionLimit : ENCOG.precision,

    clearContext : function () {
        'use strict';
        var index, i, hasBias;

        index = 0;
        for (i = 0; i < this.layerIndex.length; i += 1) {

            hasBias = (this.layerContextCount[i] + this.layerFeedCounts[i]) !== this.layerCounts[i];

            // fill in regular neurons
            ENCOG.ArrayUtil.fillArray(this.layerOutput, index, index + this.layerFeedCounts[i], 0);
            index += this.layerFeedCounts[i];

            // fill in the bias
            if (hasBias) {
                this.layerOutput[index] = this.biasActivation[i];
                index += 1;
            }

            // fill in context
            ENCOG.ArrayUtil.fillArray(this.layerOutput, index, index + this.layerContextCount[i], 0);
            index += this.layerContextCount[i];
        }
    },

    randomize : function () {
        'use strict';
        var i;
        for (i = 0; i < this.weights.length; i += 1) {
            this.weights[i] = (Math.random() * 2.0) - 1.0;
        }
    },

    computeLayer : function (currentLayer) {
        'use strict';
        var inputIndex, outputIndex, inputSize, outputSize, index, limitX, limitY,
            x, sum, offset, y;

        inputIndex = this.layerIndex[currentLayer];
        outputIndex = this.layerIndex[currentLayer - 1];
        inputSize = this.layerCounts[currentLayer];
        outputSize = this.layerFeedCounts[currentLayer - 1];

        index = this.weightIndex[currentLayer - 1];

        limitX = outputIndex + outputSize;
        limitY = inputIndex + inputSize;

        // weight values
        for (x = outputIndex; x < limitX; x += 1) {
            sum = 0;
            for (y = inputIndex; y < limitY; y += 1) {
                sum += this.weights[index] * this.layerOutput[y];
                index += 1;
            }
            this.layerSums[x] = sum;
            this.layerOutput[x] = sum;
        }

        this.activationFunctions[currentLayer - 1].activationFunction(
            this.layerOutput,
            outputIndex,
            outputSize
        );

        // update context values
        offset = this.contextTargetOffset[currentLayer];

        ENCOG.ArrayUtil.arrayCopy(this.layerOutput, outputIndex,
            this.layerOutput, offset, this.contextTargetSize[currentLayer]);
    },

    compute : function (input, output) {
        'use strict';
        var sourceIndex, i, offset;

        sourceIndex = this.layerOutput.length
            - this.layerCounts[this.layerCounts.length - 1];

        ENCOG.ArrayUtil.arrayCopy(input, 0, this.layerOutput, sourceIndex,
            this.inputCount);

        for (i = this.layerIndex.length - 1; i > 0; i -= 1) {
            this.computeLayer(i);
        }

        // update context values
        offset = this.contextTargetOffset[0];

        ENCOG.ArrayUtil.arrayCopy(this.layerOutput, 0, this.layerOutput,
            offset, this.contextTargetSize[0]);

        ENCOG.ArrayUtil.arrayCopy(this.layerOutput, 0, output, 0, this.outputCount);
    },
    evaluate : function (inputData, idealData) {
        'use strict';
        var i, j, input, ideal, output, diff, globalError, setSize;

        output = [];
        globalError = 0;
        setSize = 0;

        for (i = 0; i < inputData.length; i += 1) {
            input = inputData[i];
            ideal = idealData[i];
            this.compute(input, output);
            for (j = 0; j < ideal.length; j += 1) {
                diff = ideal[j] - output[j];
                globalError += diff * diff;
                setSize += 1;
            }
        }

        return globalError / setSize;
    }


};


ENCOG.BasicNetwork.create = function (layers) {
    'use strict';
    var layerCount, result, index, neuronCount, weightCount, i, j, layer, nextLayer, neuronIndex;

    result = new ENCOG.BasicNetwork();

    if( layers!=null ) {
        layerCount = layers.length;

        result.inputCount = layers[0].count;
        result.outputCount = layers[layerCount - 1].count;

        result.layerCounts = ENCOG.ArrayUtil.allocate1D(layerCount);
        result.layerContextCount = ENCOG.ArrayUtil.allocate1D(layerCount);
        result.weightIndex = ENCOG.ArrayUtil.allocate1D(layerCount);
        result.layerIndex = ENCOG.ArrayUtil.allocate1D(layerCount);
        result.activationFunctions = ENCOG.ArrayUtil.allocate1D(layerCount);
        result.layerFeedCounts = ENCOG.ArrayUtil.allocate1D(layerCount);
        result.contextTargetOffset = ENCOG.ArrayUtil.allocate1D(layerCount);
        result.contextTargetSize = ENCOG.ArrayUtil.allocate1D(layerCount);
        result.biasActivation = ENCOG.ArrayUtil.allocate1D(layerCount);

        index = 0;
        neuronCount = 0;
        weightCount = 0;

        for (i = layers.length - 1; i >= 0; i -= 1) {
            layer = layers[i];
            nextLayer = null;

            if (i > 0) {
                nextLayer = layers[i - 1];
            }

            result.biasActivation[index] = layer.biasActivation;
            result.layerCounts[index] = layer.calcTotalCount();
            result.layerFeedCounts[index] = layer.count;
            result.layerContextCount[index] = layer.calcContextCount();
            result.activationFunctions[index] = layer.activation;

            neuronCount += layer.calcTotalCount();

            if (nextLayer !== null) {
                weightCount += layer.count * nextLayer.calcTotalCount();
            }

            if (index === 0) {
                result.weightIndex[index] = 0;
                result.layerIndex[index] = 0;
            } else {
                result.weightIndex[index] = result.weightIndex[index - 1]
                    + (result.layerCounts[index] * result.layerFeedCounts[index - 1]);
                result.layerIndex[index] = result.layerIndex[index - 1]
                    + result.layerCounts[index - 1];
            }

            neuronIndex = 0;
            for (j = layers.length - 1; j >= 0; j -= 1) {
                if (layers[j].contextFedBy === layer) {
                    result.hasContext = true;
                    result.contextTargetSize[index] = layers[j].calcContextCount();
                    result.contextTargetOffset[index] = neuronIndex
                        + (layers[j].calcTotalCount() - layers[j]
                        .calcContextCount());
                }
                neuronIndex += layers[j].calcTotalCount();
            }

            index += 1;
        }

        result.beginTraining = 0;
        result.endTraining = result.layerCounts.length - 1;

        result.weights = ENCOG.ArrayUtil.allocate1D(weightCount);
        result.layerOutput = ENCOG.ArrayUtil.allocate1D(neuronCount);
        result.layerSums = ENCOG.ArrayUtil.allocate1D(neuronCount);

        result.clearContext();
    }
    return result;
};

/**
 * Propagation training, includes RPROP and Back Propagation.
 *
 * @class PropagationTrainer
 * @constructor
 **/
ENCOG.PropagationTrainer = function () {
    'use strict';
};

ENCOG.PropagationTrainer.prototype = {
    /**
     * The name of this object.
     * @property NAME
     * @type String
     * @final
     */
    NAME : 'PropagationTrainer',
    /**
     * The POSITIVE ETA value. This is specified by the resilient propagation
     * algorithm. This is the percentage by which the deltas are increased by if
     * the partial derivative is greater than zero.
     */
    POSITIVE_ETA : 1.2,

    /**
     * The NEGATIVE ETA value. This is specified by the resilient propagation
     * algorithm. This is the percentage by which the deltas are increased by if
     * the partial derivative is less than zero.
     */
    NEGATIVE_ETA : 0.5,

    /**
     * The minimum delta value for a weight matrix value.
     */
    DELTA_MIN : 1e-6,

    /**
     * The maximum amount a delta can reach.
     */
    MAX_STEP : 50,

    /**
     * The network that is being trained.
     *
     * @property network
     * @type Object
     * @default null
     **/
    network : null,

    /**
     * The input training data.
     *
     * @property trainingInput
     * @type Array
     * @default null
     **/
    trainingInput : null,

    /**
     * The ideal results from training.
     *
     * @property trainingIdeal
     * @type Array
     * @default null
     **/
    trainingIdeal : null,

    /**
     * The type of training:
     *
     * "BPROP" - Backpropagation.
     * "RPROP" - Resilient propagation.
     *
     * @property type
     * @type String
     * @default null
     **/
    type : null,

    /**
     * The learning rate.
     *
     * @property learningRate
     * @type number
     * @default null
     **/
    learningRate : null,

    /**
     * The momentum.
     *
     * @property momentum
     * @type number
     * @default null
     **/
    momentum : null,

    /**
     * The layer detla's, these are used to calculate the gradients.
     *
     * @property layerDelta
     * @type Array
     * @default null
     **/
    layerDelta : null,

    /**
     * The gradients.
     *
     * @property gradients
     * @type Array
     * @default null
     **/
    gradients : null,

    /**
     * The last gradients.
     *
     * @property lastGradient
     * @type Array
     * @default null
     **/
    lastGradient : null,

    /**
     * The last weight deltas.
     *
     * @property lastDelta
     * @type Array
     * @default null
     **/
    lastDelta : null,

    /**
     * The actual output from the neural network.
     *
     * @property actual
     * @type number
     * @default null
     **/
    actual : null,

    /**
     * The flat spot adjustment.
     *
     * @property flatSpot
     * @type number
     * @default null
     **/
    flatSpot : null,

    /**
     * The error function.
     *
     * @property errorFunction
     * @type Function
     * @default LinearErrorFunction
     **/
    errorFunction : ENCOG.LinearErrorFunction.create(),

    /**
     * The weight update values.
     *
     * @property updateValues
     * @type number
     * @default null
     **/
    updateValues : null,

    processLevel : function (currentLevel) {
        'use strict';
        var toLayerIndex, fromLayerIndex, index, fromLayerSize, toLayerSize, activation,
            currentFlatSpot, yi, output, sum, xi, wi, y, x;

        fromLayerIndex = this.network.layerIndex[currentLevel + 1];
        toLayerIndex = this.network.layerIndex[currentLevel];
        fromLayerSize = this.network.layerCounts[currentLevel + 1];
        toLayerSize = this.network.layerFeedCounts[currentLevel];

        index = this.network.weightIndex[currentLevel];
        activation = this.network.activationFunctions[currentLevel + 1];
        currentFlatSpot = this.flatSpot[currentLevel + 1];

        // handle weights
        yi = fromLayerIndex;
        for (y = 0; y < fromLayerSize; y += 1) {
            output = this.network.layerOutput[yi];
            sum = 0;
            xi = toLayerIndex;
            wi = index + y;
            for (x = 0; x < toLayerSize; x += 1) {
                this.gradients[wi] += output * this.layerDelta[xi];
                sum += this.network.weights[wi] * this.layerDelta[xi];
                wi += fromLayerSize;
                xi += 1;
            }

            this.layerDelta[yi] = sum
                * (activation.derivativeFunction(this.network.layerSums[yi], this.network.layerOutput[yi]) + currentFlatSpot);
            yi += 1;
        }
    },

    learnBPROP : function () {
        'use strict';
        var i, delta;

        for (i = 0; i < this.network.weights.length; i += 1) {
            delta = (this.gradients[i] * this.learningRate) + (this.lastDelta[i] * this.momentum);
            this.lastDelta[i] = delta;
            this.network.weights[i] += delta;
        }
    },

    learnRPROP : function () {
        'use strict';
        var delta, change, weightChange, i;

        for (i = 0; i < this.network.weights.length; i += 1) {
            // multiply the current and previous gradient, and take the
            // sign. We want to see if the gradient has changed its sign.
            change = ENCOG.MathUtil.sign(this.gradients[i] * this.lastGradient[i]);
            weightChange = 0;

            // if the gradient has retained its sign, then we increase the
            // delta so that it will converge faster
            if (change > 0) {
                delta = this.updateValues[i]
                    * this.POSITIVE_ETA;
                delta = Math.min(delta, this.MAX_STEP);
                weightChange = ENCOG.MathUtil.sign(this.gradients[i]) * delta;
                this.updateValues[i] = delta;
                this.lastGradient[i] = this.gradients[i];
            } else if (change < 0) {
                // if change<0, then the sign has changed, and the last
                // delta was too big
                delta = this.updateValues[i]
                    * this.NEGATIVE_ETA;
                delta = Math.max(delta, this.DELTA_MIN);
                this.updateValues[i] = delta;
                weightChange = -this.lastDelta[i];
                // set the previous gradient to zero so that there will be no
                // adjustment the next iteration
                this.lastGradient[i] = 0;
            } else if (change === 0) {
                // if change==0 then there is no change to the delta
                delta = this.updateValues[i];
                weightChange = ENCOG.MathUtil.sign(this.gradients[i]) * delta;
                this.lastGradient[i] = this.gradients[i];
            }

            this.network.weights[i] += weightChange;
        }
    },


    process : function (input, ideal, s) {
        'use strict';
        var i, j, delta;

        this.network.compute(input, this.actual);

        for (j = 0; j < ideal.length; j += 1) {
            delta = this.actual[j] - ideal[j];
            this.globalError = this.globalError + (delta * delta);
            this.setSize += 1;
        }

        this.errorFunction.calculateError(ideal, this.actual, this.layerDelta);

        for (i = 0; i < this.actual.length; i += 1) {
            this.layerDelta[i] = ((this.network.activationFunctions[0]
                .derivativeFunction(this.network.layerSums[i], this.network.layerOutput[i]) + this.flatSpot[0]))
                * (this.layerDelta[i] * s);
        }

        for (i = this.network.beginTraining; i < this.network.endTraining; i += 1) {
            this.processLevel(i);
        }
    },

    iteration : function () {
        'use strict';
        var i;
        this.globalError = 0;
        this.setSize = 0;
        this.actual = [];

        ENCOG.ArrayUtil.fillArray(this.gradients, 0, this.gradients.length, 0);
        ENCOG.ArrayUtil.fillArray(this.lastDelta, 0, this.lastDelta.length, 0);

        for (i = 0; i < this.trainingInput.length; i += 1) {
            this.process(this.trainingInput[i], this.trainingIdeal[i], 1.0);
        }

        if (this.type === "BPROP") {
            this.learnBPROP();
        } else if (this.type === "RPROP") {
            this.learnRPROP();
        }

        this.error = this.globalError / this.setSize;
    }

};

ENCOG.PropagationTrainer.create = function (network, input, ideal, type, learningRate, momentum) {
    'use strict';
    var result = new ENCOG.PropagationTrainer();
    result.network = network;
    result.trainingInput = input;
    result.trainingIdeal = ideal;
    result.type = type;
    result.learningRate = learningRate;
    result.momentum = momentum;

    result.layerDelta = ENCOG.ArrayUtil.newFloatArray(network.layerOutput.length);
    result.gradients = ENCOG.ArrayUtil.newFloatArray(network.weights.length);
    result.lastGradient = ENCOG.ArrayUtil.newFloatArray(network.weights.length);
    result.lastDelta = ENCOG.ArrayUtil.newFloatArray(network.weights.length);
    result.actual = ENCOG.ArrayUtil.newFloatArray(network.outputCount);
    result.flatSpot = ENCOG.ArrayUtil.newFloatArray(network.layerOutput.length);

    result.updateValues = ENCOG.ArrayUtil.newFloatArray(network.weights.length);

    ENCOG.ArrayUtil.fillArray(result.lastGradient, 0, result.lastGradient.length, 0);
    ENCOG.ArrayUtil.fillArray(result.updateValues, 0, result.updateValues.length, 0.1);
    ENCOG.ArrayUtil.fillArray(result.flatSpot, 0, network.weights.length, 0);

    return result;
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// Swarm: The following code implements Encog swarm                                                          //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Swarm algorithm.
 *
 * @class Swarm
 * @constructor
 **/
ENCOG.Swarm = function () {
    'use strict';
};


ENCOG.Swarm.prototype = {
    /**
     * The name of this object.
     * @property NAME
     * @type String
     * @final
     */
    NAME : 'Swarm',

    /**
     * An array of agents.
     * @property agents
     * @type Array
     */
    agents : null,

    /**
     * A call back that is called with the neighbors of each agent.
     * Format: callbackNeighbors(currentIndex,neighbors).
     * @property NAME
     * @type function
     * @final
     */
    callbackNeighbors : null,

    /**
     * The degree to which cohesion is applied to steering the agent.
     * Cohesion is the desire to move towards groups of other agents.
     * @property constCohesion
     * @type number
     */
    constCohesion : 0.01,

    /**
     * The degree to which alignment is applied to steering the agent.
     * Alignment is the desire to keep all particles moving in the same direction.
     * @property constAlignment
     * @type number
     */
    constAlignment : 0.5,

    /**
     * The degree to which separation is applied to steering the agent.
     * Separation is the desire to not be too close to another particle.
     * @property constSeparation
     * @type number
     */
    constSeparation : 0.25,

    iteration : function () {
        'use strict';
        var i, neighbors, meanX, meanY, dx, dy, targetAngle, nearest, separation, alignment, cohesion, turnAmount;

        // loop over all particles.
        for (i = 0; i < this.agents.length; i += 1) {
            ///////////////////////////////////////////////////////////////
            // Begin implementation of three very basic laws of flocking.
            ///////////////////////////////////////////////////////////////
            targetAngle = 0;

            neighbors = ENCOG.MathUtil.kNearest(this.agents[i], this.agents, 5, Number.MAX_VALUE, 0, 2);
            nearest = ENCOG.MathUtil.kNearest(this.agents[i], this.agents, 5, 10, 0, 2);

            // 1. Separation - avoid crowding neighbors (short range repulsion)
            separation = 0;
            if (nearest.length > 0) {
                meanX = ENCOG.ArrayUtil.arrayMean(nearest, 0);
                meanY = ENCOG.ArrayUtil.arrayMean(nearest, 1);
                dx = meanX - this.agents[i][0];
                dy = meanY - this.agents[i][1];
                separation = (Math.atan2(dx, dy) * 180 / Math.PI) - this.agents[i][2];
                separation += 180;
            }

            // 2. Alignment - steer towards average heading of neighbors
            alignment = 0;

            if (neighbors.length > 0) {
                alignment = ENCOG.ArrayUtil.arrayMean(neighbors, 2) - this.agents[i][2];
            }

            if (this.callbackNeighbors !== null) {
                this.callbackNeighbors(i, neighbors);
            }

            // 3. Cohesion - steer towards average position of neighbors (long range attraction)
            cohesion = 0;

            if (neighbors.length > 0) {
                meanX = ENCOG.ArrayUtil.arrayMean(this.agents, 0);
                meanY = ENCOG.ArrayUtil.arrayMean(this.agents, 1);
                dx = meanX - this.agents[i][0];
                dy = meanY - this.agents[i][1];
                cohesion = (Math.atan2(dx, dy) * 180 / Math.PI) - this.agents[i][2];
            }

            // perform the turn
            // The degree to which each of the three laws is applied is configurable.
            // The three default ratios that I provide work well.
            turnAmount = (cohesion * this.constCohesion) + (alignment * this.constAlignment) + (separation * this.constSeparation);

            this.agents[i][2] += turnAmount;

            ///////////////////////////////////////////////////////////////
            // End implementation of three very basic laws of flocking.
            ///////////////////////////////////////////////////////////////
        }
    }
};

ENCOG.Swarm.create = function (agents) {
    'use strict';
    var result = new ENCOG.Swarm();
    result.agents = agents;
    return result;
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// Anneal: The following code implements Simulated Annealing                                                 //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Simulated Annealing algorithm.
 *
 * @class Anneal
 * @constructor
 **/
ENCOG.Anneal = function () {
    'use strict';
};


ENCOG.Anneal.prototype = {
    /**
     * The name of this object.
     * @property NAME
     * @type String
     * @final
     */
    NAME : 'Anneal',

    /**
     * The current solution.
     * @property solution
     * @type Array
     */
    solution : null,

    /**
     * A function that is used to score the potential solutions. The score function
     * must accept an array of doubles and return a score.
     *
     * @property scoreSolution
     * @type Function
     * @default null
     **/
    scoreSolution : null,

    /**
     * Randomize a solution according to the specified temperature.  The higher the
     * temperature the more randomness.
     *
     * @property scoreSolution
     * @type Function
     * @default null
     **/
    randomize : null,

    /**
     * The starting temperature for each iteration.
     *
     * @property constStartTemp
     * @type number
     * @default 10.0
     **/
    constStartTemp : 10.0,

    /**
     * The stopping temperature for each iteration.
     *
     * @property constStopTemp
     * @type number
     * @default 2.0
     **/
    constStopTemp : 2.0,

    /**
     * The number of cycles to go from the starting temperature to the stopping.
     *
     * @property constCycles
     * @type number
     * @default 10.0
     **/
    constCycles : 10,


    iteration : function () {
        'use strict';

        var bestArray, temperature, bestScore, curScore, i;

        bestArray = this.solution.slice();

        temperature = this.constStartTemp;
        bestScore = this.scoreSolution(this.solution);

        for (i = 0; i < this.constCycles; i += 1) {
            this.randomize(this.solution, temperature);
            curScore = this.scoreSolution(this.solution);

            if (curScore < bestScore) {
                bestArray = this.solution.slice();
                bestScore = curScore;
            }

            this.solution = bestArray.slice();

            temperature *= Math.exp(Math.log(this.constStopTemp
                / this.constStartTemp)
                / (this.constCycles - 1));
        }
    }
};

ENCOG.Anneal.create = function (solution) {
    'use strict';
    var result = new ENCOG.Anneal();
    result.solution = solution;
    return result;
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// Genetic Algorithm: The following code implements a Genetic Algorithm                                       //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Genetic learning algorithm.
 *
 * @class Genetic
 * @constructor
 **/
ENCOG.Genetic = function () {
    'use strict';
};


ENCOG.Genetic.prototype = {
    /**
     * The name of this object.
     * @property NAME
     * @type String
     * @final
     */
    NAME : 'Genetic',

    /**
     * The current population.
     * @property solution
     * @type Array
     */
    population : null,

    /**
     * A function that is used to score the potential solutions. The score function
     * must accept an array of doubles and return a score.
     *
     * @property scoreSolution
     * @type Function
     * @default null
     **/
    scoreSolution : null,

    /**
     * A function that will mutate the specified solution.  The mutation method must
     * access an array of doubles that will be mutated.
     *
     * @property mutate
     * @type Function
     * @default null
     **/
    mutate : null,

    /**
     * Perform a crossover and return two offspring.  crossover should be called as follows:
     *
     * crossover(mother,father,child1,child2);
     *
     * @property crossover
     * @type Function
     * @default null
     **/
    crossover : null,

    /**
     * The percent of offspring that will be mutated.
     * @property constMutationPercent
     * @type number
     * @default 0.1
     **/
    constMutationPercent : 0.1,

    /**
     * The percent of the population that will mate.
     * @property constMatePercent
     * @type number
     * @default 0.24
     **/
    constMatePercent : 0.24,

    /**
     * The percent of the population that can be chosen for mating.
     * @property constMatingPopulationPercent
     * @type number
     * @default 0.5
     **/
    constMatingPopulationPercent : 0.5,

    iteration : function () {
        'use strict';

        var countToMate, offspringCount, offspringIndex, matingPopulationSize, motherID, fatherID;

        countToMate = Math.floor(this.population.length * this.constMatePercent);
        offspringCount = countToMate * 2;
        offspringIndex = this.population.length - offspringCount;
        matingPopulationSize = Math.floor(this.population.length * this.constMatingPopulationPercent);

        // mate and form the next generation

        for (motherID = 0; motherID < countToMate; motherID++) {
            fatherID = Math.floor(Math.random() * matingPopulationSize);
            this.crossover(
                this.population[motherID].data,
                this.population[fatherID].data,
                this.population[offspringIndex].data,
                this.population[offspringIndex + 1].data);

            // mutate, if needed
            if (Math.random() > this.constMutationPercent) {
                this.mutate(this.population[offspringIndex].data);
            }

            if (Math.random() > this.constMutationPercent) {
                this.mutate(this.population[offspringIndex].data);
            }

            // score the two new offspring
            this.population[offspringIndex].score = this.scoreSolution(this.population[offspringIndex].data);
            this.population[offspringIndex + 1].score = this.scoreSolution(this.population[offspringIndex + 1].data);

            // move to the next one
            offspringIndex += 2;
        }

        this.sortPopulation();
    },
    createPopulation : function (size, generate) {
        'use strict';
        var i, d, l;

        this.population = [];
        for (i = 0; i < size; i++) {
            d = generate();
            l = this.scoreSolution(d);
            this.population[i] = {
                'data' : d,
                'score' : l
            };
        }

        this.sortPopulation();
    },
    getSolution : function () {
        return this.population[0].data;
    },
    sortPopulation : function () {
        this.population.sort(function (a, b) {
            return a.score - b.score
        });
    }
};


ENCOG.Genetic.create = function () {
    return new ENCOG.Genetic();
};


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// SOM: The following code implements a Self Organizing Map                                                  //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * A self organizing map (SOM).
 *
 * @class SOM
 * @constructor
 **/
ENCOG.SOM = function () {
    'use strict';
};

ENCOG.SOM.prototype = {

    /**
     * The name of this object.
     * @property NAME
     * @type String
     * @final
     */
    NAME : "SOM",

    /**
     * Holds the weights for the SOM.
     *
     * @property weights
     * @type Array
     * @default null
     **/
    weights : null,

    /**
     * The input neuron count for the SOM
     *
     * @property inputCount
     * @type int
     * @default 0
     **/
    inputCount : 0,

    /**
     * The output neuron count for the SOM
     *
     * @property outputCount
     * @type int
     * @default 0
     **/
    outputCount : 0,

    /**
     * Determine which output neuron the input matches with best.
     * @method classify
     * @param inputData The input data.
     */
    classify : function (inputData) {
        'use strict';

        var minDist, result, i, dist;

        if (inputData.length > this.inputCount) {
            throw new Error(
                "Can't classify SOM with input size of " + this.inputCount
                    + " with input data of count " + inputData.length);
        }

        minDist = Number.POSITIVE_INFINITY;
        result = -1;

        for (i = 0; i < this.outputCount; i += 1) {
            dist = ENCOG.MathUtil.euclideanDistance(inputData, this.weights[i], 0, this.inputCount);
            if (dist < minDist) {
                minDist = dist;
                result = i;
            }
        }

        return result;
    }
};

/**
 * Create a SOM network.
 * @method create
 * @return {ENCOG.ActivationElliottSymmetric} The newly created activation function.
 */
ENCOG.SOM.create = function (theInputCount, theOutputCount) {
    'use strict';
    var result = new ENCOG.SOM();
    result.inputCount = theInputCount;
    result.outputCount = theOutputCount;
    result.weights = ENCOG.ArrayUtil.allocateBoolean2D(theOutputCount, theInputCount);
    return result;
};

// train SOM

ENCOG.TrainSOM = function () {
    'use strict';
};

ENCOG.TrainSOM.prototype = {

    /**
     * The name of this object.
     * @property NAME
     * @type String
     * @final
     */
    NAME : "SOM",

    weights : null,
    som : null,
    learningRate : 0.5,
    correctionMatrix : null,
    trainingInput : null,
    worstDistance : 0,


    /**
     * Perform a training iteration.
     * @method iteration
     */
    iteration : function () {
        'use strict';

        var i, input, bmu;

        // Reset the correction matrix for this synapse and iteration.
        ENCOG.ArrayUtil.fillArray2D(this.correctionMatrix, 0);

        // Determine the BMU for each training element.
        for (i = 0; i < this.trainingInput.length; i++) {
            input = this.trainingInput[i];

            bmu = this.calculateBMU(input);

            this.train(bmu, input);

            this.applyCorrection();
        }

        // update the error
        //setError(this.bmuUtil.getWorstDistance() / 100.0);

    },
    reset : function () {
        ENCOG.MathUtil.randomizeArray2D(this.weights, -1, 1);
    },
    calculateBMU : function (input) {
        var result, lowestDistance, i, distance;

        result = 0;

        if (input.length > this.som.inputCount) {
            throw new Error(
                "Can't train SOM with input size of " + this.inputCount
                    + " with input data of count " + input.length);
        }

        // Track the lowest distance so far.
        lowestDistance = Number.POSITIVE_INFINITY;

        for (i = 0; i < this.som.outputCount; i++) {
            distance = ENCOG.MathUtil.euclideanDistance(this.som.weights[i], input, 0, this.som.weights[i].length);

            // Track the lowest distance, this is the BMU.
            if (distance < lowestDistance) {
                lowestDistance = distance;
                result = i;
            }
        }

        // Track the worst distance, this is the error for the entire network.
        if (lowestDistance > this.worstDistance) {
            this.worstDistance = lowestDistance;
        }

        return result;
    },
    train : function (bmu, input) {

    },
    applyCorrection : function () {

    }
};

/**
 * Create trainer for a SOM.
 * @method create
 * @return {ENCOG.ActivationElliottSymmetric} The newly created activation function.
 */
ENCOG.TrainSOM.create = function (theSom, theLearningRate) {
    'use strict';
    var result = new ENCOG.TrainSOM();
    result.som = theSom;
    result.learningRate = theLearningRate;
    result.correctionMatrix = ENCOG.ArrayUtil.allocateBoolean2D(this.som.outputCount, this.som.inputCount);
    return result;
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// Read CSV: The following is used to read CSV files                                                         //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Read data that is in CSV format.
 *
 * @class ReadCSV
 * @constructor
 **/
ENCOG.ReadCSV = function () {
    'use strict';
};

ENCOG.ReadCSV.prototype = {
    /**
     * Holds the regular expression for parsing.
     *
     * @property regStr
     * @type String
     * @default null
     **/
    regStr : null,

    /**
     * The input data parsed from the CSV.
     *
     * @property inputData
     * @type Array
     * @default null
     **/
    inputData : null,

    /**
     * Holds the ideal data parsed from the CSV.
     *
     * @property idealData
     * @type Array
     * @default null
     **/
    idealData : null,

    /**
     * Holds the number of columns that make up the input data.
     *
     * @property inputCount
     * @type int
     * @default null
     **/
    inputCount : 0,

    /**
     * Holds the number of columns that make up the ideal data.
     *
     * @property idealCount
     * @type int
     * @default null
     **/
    idealCount : 0,

    /**
     * Holds the regular expression for parsing
     * @property delimiter
     * @type String
     * @default ','
     **/
    delimiter : ',',

    readCSV : function (csv, theInputCount, theIdealCount) {
        var currentIndex, regex, matches, value, d;

        this.inputCount = theInputCount;
        this.idealCount = theIdealCount;

        regex = new RegExp(this.regStr, "gi");

        // allocate input and ideal arrays
        this.inputData = [
            []
        ];
        this.idealData = [
            []
        ];

        currentIndex = 0;

        while (matches = regex.exec(csv)) {
            // obtain delimiter
            d = matches[ 1 ];

            // new row
            if (d.length && (d != this.delimiter)) {
                this.inputData.push([]);
                this.idealData.push([]);
                currentIndex = 0;
            }

            // do we need to remove quotes from value?
            if (matches[ 2 ]) {
                value = matches[ 2 ].replace(
                    new RegExp("\"\"", "g"),
                    "\""
                );

            } else {
                value = matches[ 3 ];
            }

            // add value to either input or ideal
            if (currentIndex < this.inputCount) {
                this.inputData[ this.inputData.length - 1 ].push(value);
            } else {
                this.idealData[ this.idealData.length - 1 ].push(value);
            }
            currentIndex += 1;
        }
    }
};

ENCOG.ReadCSV.create = function (theDelimiter) {
    'use strict';
    var result = new ENCOG.ReadCSV();

    result.delimiter = (theDelimiter || ",");

    result.regStr =
        // Delimiters
        "(\\" + result.delimiter + "|\\r?\\n|\\r|^)" +
            // Quoted fields
            "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +
            // Standard fields
            "([^\"\\" + result.delimiter + "\\r\\n]*))";
    return result;
};

ENCOG.ReadCSV.fromCommaListInt = function (str) {
    'use strict';
    var result, parts, i;

    result = [];
    parts = str.split(',');

    for (i = 0; i < parts.length; i+=1) {
        result.push(parseInt(parts[i],10));
    }


    return result;
};

ENCOG.ReadCSV.fromCommaListFloat = function (str) {
    'use strict';
    var result, parts, i;

    result = [];
    parts = str.split(',');

    for (i = 0; i < parts.length; i+=1) {
        result.push(parseFloat(parts[i]));
    }

    return result;
};

ENCOG.ReadCSV.toCommaList = function (arr) {
    'use strict';
    var result, i;

    result = '';

    for (i = 0; i < arr.length; i+=1) {
        if (i > 0) {
            result += ',';
        }
        result += arr[i];
    }

    return result;
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// EGFILE: The following code is used for the processing of EG files                                         //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Read data stored in the Encog EG format.
 *
 * @class EGFILE
 * @constructor
 **/
ENCOG.EGFILE = function () {
    'use strict';
};


ENCOG.EGFILE.save = function (obj) {
    'use strict';
    var result = "", now, i, af;

    now = (new Date()).getTime();

    result += 'encog,BasicNetwork,' + ENCOG.PLATFORM + ',3.1.0,1,' + now + ENCOG.NEWLINE;
    result += '[BASIC]' + ENCOG.NEWLINE;
    result += '[BASIC:PARAMS]' + ENCOG.NEWLINE;
    result += '[BASIC:NETWORK]' + ENCOG.NEWLINE;
    result += 'beginTraining=' + obj.beginTraining + ENCOG.NEWLINE;
    result += 'connectionLimit=' + obj.connectionLimit + ENCOG.NEWLINE;
    result += 'contextTargetOffset=' + ENCOG.ReadCSV.toCommaList(obj.contextTargetOffset) + ENCOG.NEWLINE;
    result += 'contextTargetSize=' + ENCOG.ReadCSV.toCommaList(obj.contextTargetSize) + ENCOG.NEWLINE;
    result += 'endTraining=' + obj.endTraining + ENCOG.NEWLINE;
    result += 'hasContext=' + (obj.hasContext ? 't' : 'f') + ENCOG.NEWLINE;
    result += 'inputCount=' + obj.inputCount + ENCOG.NEWLINE;
    result += 'layerCounts=' + ENCOG.ReadCSV.toCommaList(obj.layerCounts) + ENCOG.NEWLINE;
    result += 'layerFeedCounts=' + ENCOG.ReadCSV.toCommaList(obj.layerFeedCounts) + ENCOG.NEWLINE;
    result += 'layerContextCount=' + ENCOG.ReadCSV.toCommaList(obj.layerContextCount) + ENCOG.NEWLINE;
    result += 'layerIndex=' + ENCOG.ReadCSV.toCommaList(obj.layerIndex) + ENCOG.NEWLINE;
    result += 'output=' + ENCOG.ReadCSV.toCommaList(obj.layerOutput) + ENCOG.NEWLINE;
    result += 'outputCount=' + obj.outputCount + ENCOG.NEWLINE;
    result += 'weightIndex=' + ENCOG.ReadCSV.toCommaList(obj.weightIndex) + ENCOG.NEWLINE;
    result += 'weights=' + ENCOG.ReadCSV.toCommaList(obj.weights) + ENCOG.NEWLINE;
    result += 'biasActivation=' + ENCOG.ReadCSV.toCommaList(obj.biasActivation) + ENCOG.NEWLINE;
    result += '[BASIC:ACTIVATION]' + ENCOG.NEWLINE;
    for (i = 0; i < obj.activationFunctions.length; i+=1) {
        af = obj.activationFunctions[i];
        result += '\"';
        result += af.NAME;
        result += '\"' + ENCOG.NEWLINE;
    }
    return result;
};

ENCOG.EGFILE.load = function (str) {
    'use strict';
    var lines, currentLine, parts;

    currentLine = 0;

    lines = str.match(/^.*([\n\r]+|$)/gm);

    while (lines[currentLine].trim().length === 0) {
        currentLine+=1;
    }

    parts = lines[currentLine].trim().split(',');

    if (parts[0] !== 'encog') {
        throw new Error("Not a valid Encog EG file.");
    }

    if (parts[1] === 'BasicNetwork') {
        return ENCOG.EGFILE.loadBasicNetwork(str);
    } else {
        throw new Error("Encog Javascript does not support: " + parts[1]);
    }
};

ENCOG.EGFILE._loadNetwork = function (lines, currentLine, result) {
    var idx, line, name, value;

    while (currentLine < lines.length) {
        line = lines[currentLine].trim();

        if (line[0] == '[') {
            break;
        }

        currentLine++;
        idx = line.indexOf('=');

        if (idx == -1) {
            throw new Error("Invalid line in BasicNetwork file: " + line);
        }

        name = line.substr(0, idx).trim().toLowerCase();
        value = line.substr(idx + 1).trim();

        if (name == 'begintraining') {
            result.beginTraining = parseInt(value);
        }
        else if (name == 'connectionlimit') {
            result.connectionLimit = parseFloat(value);
        }
        else if (name == 'contexttargetoffset') {
            result.contextTargetOffset = ENCOG.ReadCSV.fromCommaListInt(value);
        }
        else if (name == 'contexttargetsize') {
            result.contextTargetSize = ENCOG.ReadCSV.fromCommaListInt(value);
        }
        else if (name == 'endtraining') {
            result.endTraining = parseInt(value);
        }
        else if (name == 'hascontext') {
            result.hasContext = (value.toLowerCase() == 'f');
        }
        else if (name == 'inputcount') {
            result.inputCount = parseInt(value);
        }
        else if (name == 'layercounts') {
            result.layerCounts = ENCOG.ReadCSV.fromCommaListInt(value);
        }
        else if (name == 'layerfeedcounts') {
            result.layerFeedCounts = ENCOG.ReadCSV.fromCommaListInt(value);
        }
        else if (name == 'layercontextcount') {
            result.layerContextCount = ENCOG.ReadCSV.fromCommaListInt(value);
        }
        else if (name == 'layerindex') {
            result.layerIndex = ENCOG.ReadCSV.fromCommaListInt(value);
        }
        else if (name == 'output') {
            result.layerOutput = ENCOG.ReadCSV.fromCommaListFloat(value);
        }
        else if (name == 'outputcount') {
            result.outputCount = parseInt(value);
        }
        else if (name == 'weightindex') {
            result.weightIndex = ENCOG.ReadCSV.fromCommaListInt(value);
        }
        else if (name == 'weights') {
            result.weights = ENCOG.ReadCSV.fromCommaListFloat(value);
        }
        else if (name == 'biasactivation') {
            result.biasActivation = ENCOG.ReadCSV.fromCommaListFloat(value);
        }
    }

    result.layerSums = [];
    ENCOG.ArrayUtil.fillArray(result.layerSums, 0, result.layerSums, 0);

    return currentLine;
};

ENCOG.EGFILE._loadActivation = function (lines, currentLine, result) {
    var i, line;

    result.activationFunctions = [];

    i = 0;
    while (currentLine < lines.length) {

        line = lines[currentLine++].trim();

        if (line[0] == '[') {
            break;
        }

        line = ENCOG.Util.stripQuotes(line);

        if (line == 'ActivationLinear') {
            result.activationFunctions[i] = ENCOG.ActivationLinear.create();
        } else if (line == 'ActivationSigmoid') {
            result.activationFunctions[i] = ENCOG.ActivationSigmoid.create();
        } else if (line == 'ActivationTANH') {
            result.activationFunctions[i] = ENCOG.ActivationTANH.create();
        } else if (line == 'ActivationElliott') {
            result.activationFunctions[i] = ENCOG.ActivationElliott.create();
        } else if (line == 'ActivationElliottSymmetric') {
            result.activationFunctions[i] = ENCOG.ActivationElliottSymmetric.create();
        }

        i += 1;
    }

    return currentLine;
};

ENCOG.EGFILE.loadBasicNetwork = function (str) {
    var lines, currentLine, line, parts, result;

    currentLine = 0;

    lines = str.match(/^.*([\n\r]+|$)/gm);

    while (lines[currentLine].trim().length == 0) {
        currentLine++;
    }

    parts = lines[currentLine++].trim().split(',');

    if (parts[0] != 'encog') {
        throw new Error("Not a valid Encog EG file.");
    }

    if (parts[1] != 'BasicNetwork') {
        throw new Error("Not a BasicNetwork EG file.");
    }

    result = new ENCOG.BasicNetwork();

    while (currentLine < lines.length) {
        line = lines[currentLine++].trim();

        if (line == '[BASIC:NETWORK]') {
            currentLine = this._loadNetwork(lines, currentLine, result);
        } else if (line == '[BASIC:ACTIVATION]') {
            currentLine = this._loadActivation(lines, currentLine, result);
        }
    }

    return result;
};