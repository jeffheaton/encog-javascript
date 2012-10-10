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

ENCOG.namespace('ENCOG.GUI.Console');
ENCOG.namespace('ENCOG.GUI.CellGrid');
ENCOG.namespace('ENCOG.GUI.Drawing');
ENCOG.namespace('ENCOG.GUI.Agents2D');
ENCOG.namespace('ENCOG.GUI.TSP');

ENCOG.GUI.Console = function () {
    'use strict'
};

ENCOG.GUI.Console.prototype =
{
    consoleDiv:{},
    textarea:{},
    name:"Console",
    write:function (str) {
        'use strict';
        this.textarea.value += (str);
        this.textarea.scrollTop = this.textarea.scrollHeight;
    },
    writeLine:function (str) {
        'use strict';
        this.textarea.value += (str + '\n');
        this.textarea.scrollTop = this.textarea.scrollHeight;
    },
    clear:function () {
        'use strict';
        this.textarea.value = "";
    }
};

ENCOG.GUI.Console.create = function (id) {
    'use strict';
    var result = new ENCOG.GUI.Console();
    result.consoleDiv = document.getElementById(id);
    result.consoleDiv.innerHTML = '<textarea></textarea>';
    result.textarea = result.consoleDiv.getElementsByTagName('textarea')[0];
    return result;
};

ENCOG.GUI.CellGrid = function () {
    'use strict'
};

ENCOG.GUI.CellGrid.prototype =
{
    canvas:null,
    drawingContext:null,
    canvasDiv:null,
    canvasWidth:null,
    canvasHeight:null,
    gridWidth:null,
    gridHeight:null,
    determineColor:null,
    pointerDown:null,
    pointerUp:null,
    pointerMove:null,
    pointerMode:0,
    captureTouch:true,
    outline:false,
    NAME:"CellGrid",

    render:function () {
        var output, row, col, r, g, b, c;

        this.drawingContext.strokeStyle = 'grey';

        for (row = 0; row < this.gridHeight; row += 1) {
            for (col = 0; col < this.gridWidth; col += 1) {
                this.drawingContext.fillStyle = this.determineColor(row, col);
                this.drawingContext.fillRect(col * this.pixW, row * this.pixH, this.pixW, this.pixH);
                if (this.outline) {
                    this.drawingContext.strokeRect(col * this.pixW, row * this.pixH, this.pixW, this.pixW);
                }
            }
        }

        this.drawingContext.strokeStyle = "black";
    },
    ev_canvas:function (ev) {

        var row, col;

        if (ev.layerX || ev.layerX == 0) {
            ev._x = ev.layerX;
            ev._y = ev.layerY;
        }
        // Opera
        else if (ev.offsetX || ev.offsetX == 0) {
            ev._x = ev.offsetX;
            ev._y = ev.offsetY;
        }

        switch (this.pointerMode) {
            case ENCOG.GUI.CellGrid.MODE_XY:
                row = ev._y;
                col = ev._x;
                break;
            case ENCOG.GUI.CellGrid.MODE_CELL:
                row = Math.floor(ev._y / this.pixH);
                col = Math.floor(ev._x / this.pixW);
                break;
            case ENCOG.GUI.CellGrid.MODE_PCT:
                row = ev._y / this.canvas.height;
                col = ev._x / this.canvas.width;
                break;
        }

        if (ev.type == 'mousedown' || ev.type == 'touchstart') {
            if (this.pointerDown != null) {
                this.pointerDown(row, col);
            }
        }
        else if (ev.type == 'mouseup' || ev.type == 'touchend') {
            if (this.pointerUp != null) {
                this.pointerUp(row, col);
            }
        }
        else if (ev.type == 'mousemove' || ev.type == 'touchmove') {
            if (this.pointerMove != null) {
                this.pointerMove(row, col);
            }
            if (this.captureTouch && ev.type == 'touchmove') {
                ev.preventDefault();
            }
        }
    },
    clear:function () {
        this.canvas.width = this.canvas.width;
    }
};

ENCOG.GUI.CellGrid.MODE_XY = 0;
ENCOG.GUI.CellGrid.MODE_CELL = 1;
ENCOG.GUI.CellGrid.MODE_PCT = 2;

ENCOG.GUI.CellGrid.create = function (id, gridWidth, gridHeight, canvasWidth, canvasHeight) {
    'use strict';
    var result = new ENCOG.GUI.CellGrid();
    result.canvasDiv = document.getElementById(id);
    result.canvasWidth = canvasWidth;
    result.canvasHeight = canvasHeight;
    result.gridWidth = gridWidth;
    result.gridHeight = gridHeight;
    result.canvasDiv.innerHTML = '<canvas width="'
        + canvasWidth + '" height="' + canvasHeight + '">Browser not supported.</canvas>';
    result.canvas = result.canvasDiv.getElementsByTagName('canvas')[0];
    result.drawingContext = result.canvas.getContext('2d');
    result.pixW = Math.floor(result.canvas.width / result.gridWidth);
    result.pixH = Math.floor(result.canvas.height / result.gridHeight);

    result.canvas.addEventListener('mousedown', function (e) {
        result.ev_canvas(e);
    }, true);
    result.canvas.addEventListener('mousemove', function (e) {
        result.ev_canvas(e);
    }, true);
    result.canvas.addEventListener('mouseup', function (e) {
        result.ev_canvas(e);
    }, true);
    result.canvas.addEventListener('touchstart', function (e) {
        result.ev_canvas(e);
    }, true);
    result.canvas.addEventListener('touchend', function (e) {
        result.ev_canvas(e);
    }, true);
    result.canvas.addEventListener('touchmove', function (e) {
        result.ev_canvas(e);
    }, true);
    result.canvas.addEventListener('mouseout', function (e) {
        result.ev_canvas(e);
    }, true);
    return result;
};


ENCOG.GUI.Drawing = function () {
    'use strict'
};

ENCOG.GUI.Drawing.create = function (id, canvasWidth, canvasHeight) {
    'use strict';
    var result = new ENCOG.GUI.Drawing();

    result.canvasDiv = document.getElementById(id);
    result.canvasWidth = canvasWidth;
    result.canvasHeight = canvasHeight;
    result.canvasDiv.innerHTML = '<canvas width="'
        + canvasWidth + '" height="' + canvasHeight + '">Browser not supported.</canvas>';
    result.canvas = result.canvasDiv.getElementsByTagName('canvas')[0];
    result.drawingContext = result.canvas.getContext('2d');

    // Attach the mousedown, mousemove and mouseup event listeners.
    result.canvas.addEventListener('mousedown', function (e) {
        result.ev_canvas(e)
    }, true);
    result.canvas.addEventListener('mousemove', function (e) {
        result.ev_canvas(e)
    }, true);
    result.canvas.addEventListener('mouseup', function (e) {
        result.ev_canvas(e)
    }, true);
    result.canvas.addEventListener('touchstart', function (e) {
        result.ev_canvas(e)
    }, true);
    result.canvas.addEventListener('touchend', function (e) {
        result.ev_canvas(e)
    }, true);
    result.canvas.addEventListener('touchmove', function (e) {
        result.ev_canvas(e)
    }, true);
    result.canvas.addEventListener('mouseout', function (e) {
        result.ev_canvas(e)
    }, true);


    return result;
};

ENCOG.GUI.Drawing.prototype =
{
    canvas:null,
    drawingContext:null,
    canvasDiv:null,
    NAME:"Drawing",
    canvasWidth:null,
    canvasHeight:null,
    started:false,
    downsampleHeight:8,
    downsampleWidth:5,


    // Handle events to the canvas.  This allows drawing to occur.
    ev_canvas:function (ev) {
        // Firefox
        if (ev.layerX || ev.layerX == 0) {
            ev._x = ev.layerX;
            ev._y = ev.layerY;
        }
        // Opera
        else if (ev.offsetX || ev.offsetX == 0) {
            ev._x = ev.offsetX;
            ev._y = ev.offsetY;
        }

// This is called when you start holding down the mouse button.
// This starts the pencil drawing.
        if (ev.type === 'mousedown') {
            this.drawingContext.beginPath();
            this.drawingContext.moveTo(ev._x, ev._y);
            this.started = true;
        }

// This function is called every time you move the mouse. Obviously, it only
// draws if the tool.started state is set to true (when you are holding down
// the mouse button).
        else if (ev.type === 'mousemove') {
            if (this.started) {
                this.drawingContext.lineTo(ev._x, ev._y);
                this.drawingContext.stroke();
            }
        }

// This is called when you release the mouse button.
        else if (ev.type === 'mouseup') {
            if (this.started) {
                this.drawingContext.lineTo(ev._x, ev._y);
                this.drawingContext.stroke();
                this.started = false;
            }
        }
        else if (ev.type === 'mouseout') {
            if (this.started) {
                this.drawingContext.lineTo(ev._x, ev._y);
                this.drawingContext.stroke();
                this.started = false;
            }
        }
        else if (ev.type === 'touchstart') {
            this.drawingContext.beginPath();
            this.drawingContext.moveTo(ev._x, ev._y);
            this.started = true;
        }
        else if (ev.type === 'touchend') {
            if (this.started) {
                this.started = false;
            }
        }
        else if (ev.type === 'touchmove') {
            if (this.started) {
                this.drawingContext.lineTo(ev._x, ev._y);
                this.drawingContext.stroke();
                ev.preventDefault();
            }
        }
    },
    // Determine if the specificed horizontal line is clear.
    // This is used to find the top and bottom cropping lines.
    isHLineClear:function (row) {
        var imgd = this.drawingContext.getImageData(0, row, this.canvas.width, 1);
        var pix = imgd.data;

        for (var i = 0; i < pix.length; i++) {
            if (pix[i] > 0) {
                return false;
            }
        }

        return true;
    },

// Determine if the specificed vertical line is clear.
// This is used to find the left and right cropping lines.
    isVLineClear:function (col) {
        var imgd = this.drawingContext.getImageData(col, 0, 1, this.canvas.height);
        var pix = imgd.data;

        for (var i = 0; i < pix.length; i++) {
            if (pix[i] > 0) {
                return false;
            }
        }

        return true;
    },

// Downsample the drawing area.
    performDownSample:function () {
        'use strict';
        var top, bottom, left, right, cellWidth, cellHeight, result, resultIndex, row, col, pix, x, y, d, i, imgd;

        // first find a bounding rectangle so that we can crop out unused space
        top = 0;

        while (this.isHLineClear(top) && top < this.canvas.height) {
            top++;
        }

        bottom = this.canvas.height;

        while (this.isHLineClear(bottom) && bottom > 0) {
            bottom--;
        }

        left = 0;

        while (this.isVLineClear(left) && left < this.canvas.width) {
            left++;
        }

        right = this.canvas.width;

        while (this.isVLineClear(right) && right > 0) {
            right--;
        }

        if (bottom < top) {
            result = ENCOG.ArrayUtil.allocate1D(this.downsampleHeight * this.downsampleWidth);
            ENCOG.ArrayUtil.fillArray(result, 0, result.length, -1);
            return result;
        }
        //uncomment this if you want to see the cropping rectangle
        //drawingContext.strokeRect(left,top,right-left,bottom-top);

        // now downsample

        cellWidth = (right - left) / this.downsampleWidth;
        cellHeight = (bottom - top) / this.downsampleHeight;
        result = new Array();
        resultIndex = 0;

        // to downsample we are going to lay a "grid" over the drawing
        // the grid's dimensions are defined by DOWNSAMPLE_HEIGHT and
        // DOWNSAMPLE_WIDTH.  Typically 5x8.  If even one pixel is
        // present in a grid square, it is downsampled to "black".

        for (row = 0; row < this.downsampleHeight; row++) {
            for (col = 0; col < this.downsampleWidth; col++) {
                x = (cellWidth * col) + left;
                y = (cellHeight * row) + top;

                // obtain pixel data for the grid square
                imgd = this.drawingContext.getImageData(x, y, cellWidth, cellHeight);
                pix = imgd.data;

                d = false;
                // see if at least one pixel is "black"
                for (i = 0; i < pix.length; i++) {
                    if (pix[i] > 0) {
                        d = true;
                        break;
                    }
                }

                // we are downsampling to an array where 1.0 is black, and -1.0 is white.
                // this will be used for Euclidean distance measuring.
                if (d) {
                    result[resultIndex++] = 1.0;
                } else {
                    result[resultIndex++] = -1.0;
                }
            }
        }

        return result;
    },
    clear:function () {
        this.canvas.width = this.canvas.width;
    }
};


////////////////////////////////////

ENCOG.GUI.Agents2D = function () {
    'use strict'
};

ENCOG.GUI.Agents2D.create = function (id, canvasWidth, canvasHeight) {
    'use strict';
    var result = new ENCOG.GUI.Agents2D();

    result.canvasDiv = document.getElementById(id);
    result.canvasWidth = canvasWidth;
    result.canvasHeight = canvasHeight;
    result.canvasDiv.innerHTML = '<canvas width="'
        + canvasWidth + '" height="' + canvasHeight + '">Browser not supported.</canvas>';
    result.canvas = result.canvasDiv.getElementsByTagName('canvas')[0];
    result.drawingContext = result.canvas.getContext('2d');

    // Attach the mousedown, mousemove and mouseup event listeners.
    result.canvas.addEventListener('mousedown', function (e) {
        result.ev_canvas(e)
    }, true);
    result.canvas.addEventListener('mousemove', function (e) {
        result.ev_canvas(e)
    }, true);
    result.canvas.addEventListener('mouseup', function (e) {
        result.ev_canvas(e)
    }, true);
    result.canvas.addEventListener('touchstart', function (e) {
        result.ev_canvas(e)
    }, true);
    result.canvas.addEventListener('touchend', function (e) {
        result.ev_canvas(e)
    }, true);
    result.canvas.addEventListener('touchmove', function (e) {
        result.ev_canvas(e)
    }, true);
    result.canvas.addEventListener('mouseout', function (e) {
        result.ev_canvas(e)
    }, true);


    return result;
};

ENCOG.GUI.Agents2D.prototype =
{
    canvas:null,
    drawingContext:null,
    canvasDiv:null,
    NAME:"Agents2D",
    canvasWidth:null,
    canvasHeight:null,
    agents:null,
    agentSize:10,
    agentSpeed:5,
    pointerDown:null,
    pointerUp:null,
    pointerMove:null,
    captureTouch:true,


    // Handle events to the canvas.  This allows drawing to occur.
    ev_canvas:function (ev) {

    },
    reset:function (count) {
        'use strict';
        this.agents = [];
        for (var i = 0; i < count; i++) {
            this.agents[i] = [
                Math.floor(Math.random() * this.canvas.width),
                Math.floor(Math.random() * this.canvas.height),
                Math.floor(Math.random() * 360)];
        }
        this.render();
    },
    advance:function () {
        'use strict';
        var aff, r, r2, dy, dx, x, y, x2, y2, x3, y3, meanX, meanY, dx, dy, targetAngle, neighbors, nearest;
        var separation, alignment, cohesion, turnAmount;

        // loop over all agents
        for (var i = 0; i < this.agents.length; i++) {
            // Each particle is moving in a fixed speed in a direction
            // specified by the 2nd array element of the particle.
            // Adjust the X & Y (stored in the first/second array element)
            // to reflect this movement.
            r = this.agents[i][2] * (Math.PI / 180.0);
            dy = Math.cos(r);
            dx = Math.sin(r);
            this.agents[i][0] += (dx * this.agentSpeed);
            this.agents[i][1] += (dy * this.agentSpeed);

            // Bound.  Handle particles that fly off the edge of the universe.
            // These particles will loop to the other side of the universe.
            if (this.agents[i][0] < 0) {
                this.agents[i][0] = this.canvas.width;
            }
            else if (this.agents[i][0] > this.canvas.width) {
                this.agents[i][0] = 0;
            }

            if (this.agents[i][1] < 0) {
                this.agents[i][1] = this.canvas.height;
            }
            else if (this.agents[i][1] > this.canvas.height) {
                this.agents[i][1] = 0;
            }
        }
    },
    render:function () {
        'use strict';
        var aff, r, r2, dy, dx, x, y, x2, y2, x3, y3, meanX, meanY, dx, dy, targetAngle, neighbors, nearest, i;
        var separation, alignment, cohesion, turnAmount;

        // clear the canvas.
        this.canvas.width = this.canvas.width;

        // loop over all particles.
        for (i = 0; i < this.agents.length; i++) {
            // Draw the particle.  Each particle is s small traingle that
            // points in the direction that it is moving.
            x = this.agents[i][0];
            y = this.agents[i][1];

            r = (this.agents[i][2] + 180 - 15) * (Math.PI / 180.0);
            x2 = x + (Math.sin(r) * this.agentSize);
            y2 = y + (Math.cos(r) * this.agentSize);

            r2 = (this.agents[i][2] + 180 + 15) * (Math.PI / 180.0);
            x3 = x + (Math.sin(r2) * this.agentSize);
            y3 = y + (Math.cos(r2) * this.agentSize);

            this.drawingContext.strokeStyle = "#000000";
            this.drawingContext.beginPath();
            this.drawingContext.moveTo(x2, y2);
            this.drawingContext.lineTo(x, y);
            this.drawingContext.lineTo(x3, y3);
            this.drawingContext.closePath();
            this.drawingContext.stroke();
        }
    },
    // Plot gray lines to show an affinity group.  This is a particle and
    // all other particles that are neighbors.  If two flocks have no lines
    // between them, they have become independant.
    plotGroup:function (idx, others) {
        'use strict';
        var x1 = this.agents[idx][0];
        var y1 = this.agents[idx][1];

        for (var i = 0; i < others.length; i++) {
            var x2 = others[i][0];
            var y2 = others[i][1];

            this.drawingContext.strokeStyle = "#f0f0f0";
            this.drawingContext.beginPath();
            this.drawingContext.moveTo(x1, y1);
            this.drawingContext.lineTo(x2, y2);
            this.drawingContext.closePath();
            this.drawingContext.stroke();
        }
    },
    ev_canvas:function (ev) {

        if (ev.layerX || ev.layerX == 0) {
            ev._x = ev.layerX;
            ev._y = ev.layerY;
        }
        // Opera
        else if (ev.offsetX || ev.offsetX == 0) {
            ev._x = ev.offsetX;
            ev._y = ev.offsetY;
        }

        if (ev.type == 'mousedown' || ev.type == 'touchstart') {
            if (this.pointerDown != null) {
                this.pointerDown(ev._x, ev._y);
            }
        }
        else if (ev.type == 'mouseup' || ev.type == 'touchend') {
            if (this.pointerUp != null) {
                this.pointerUp(ev._x, ev._y);
            }
        }
        else if (ev.type == 'mousemove' || ev.type == 'touchmove') {
            if (this.pointerMove != null) {
                this.pointerMove(ev._x, ev._y);
            }
            if (this.captureTouch && ev.type == 'touchmove') {
                ev.preventDefault();
            }
        }
    }

};


////////////////////////////////////

ENCOG.GUI.TSP = function () {
    'use strict'
};

ENCOG.GUI.TSP.create = function (id, canvasWidth, canvasHeight) {
    'use strict';
    var result = new ENCOG.GUI.TSP();

    result.canvasDiv = document.getElementById(id);
    result.canvasWidth = canvasWidth;
    result.canvasHeight = canvasHeight;
    result.canvasDiv.innerHTML = '<canvas width="'
        + result.canvasWidth + '" height="' + result.canvasHeight + '">Browser not supported.</canvas>';
    result.canvas = result.canvasDiv.getElementsByTagName('canvas')[0];
    result.drawingContext = result.canvas.getContext('2d');

    // Attach the mousedown, mousemove and mouseup event listeners.
    result.canvas.addEventListener('mousedown', function (e) {
        result.ev_canvas(e)
    }, true);
    result.canvas.addEventListener('mousemove', function (e) {
        result.ev_canvas(e)
    }, true);
    result.canvas.addEventListener('mouseup', function (e) {
        result.ev_canvas(e)
    }, true);
    result.canvas.addEventListener('touchstart', function (e) {
        result.ev_canvas(e)
    }, true);
    result.canvas.addEventListener('touchend', function (e) {
        result.ev_canvas(e)
    }, true);
    result.canvas.addEventListener('touchmove', function (e) {
        result.ev_canvas(e)
    }, true);
    result.canvas.addEventListener('mouseout', function (e) {
        result.ev_canvas(e)
    }, true);


    return result;
};

ENCOG.GUI.TSP.prototype =
{
    canvas:null,
    drawingContext:null,
    canvasDiv:null,
    NAME:"TSP",
    canvasWidth:null,
    canvasHeight:null,
    pointerDown:null,
    pointerUp:null,
    pointerMove:null,
    captureTouch:true,
    cities:null,
    currentPath:null,
    tspMargin:10,

    // Handle events to the canvas.  This allows drawing to occur.
    ev_canvas:function (ev) {

    },
    reset:function (count) {
        'use strict';
        var marginWidth, marginHeight;

        this.cities = [];
        marginWidth = this.canvas.width - (this.tspMargin * 2);
        marginHeight = this.canvas.height - (this.tspMargin * 2);

        for (var i = 0; i < count; i++) {
            this.cities[i] = new Array(
                Math.floor(Math.random() * marginWidth) + this.tspMargin,
                Math.floor(Math.random() * marginHeight) + this.tspMargin);
        }

        this.currentPath = this.generatePath();
        this.render();

    },

    resetCircle: function(count) {
        // reset the cities
        this.cities = [];
        var ratio = (2 * Math.PI) / count;
        var marginWidth = this.canvas.width - (this.tspMargin * 2);
        var marginHeight = this.canvas.height - (this.tspMargin * 2);

        for (var i = 0; i < count; i++) {
            var x = Math.floor(Math.cos(ratio * i) * (marginWidth / 2) + (marginWidth / 2)) + this.tspMargin;
            var y = Math.floor(Math.sin(ratio * i) * (marginHeight / 2) + (marginHeight / 2)) + this.tspMargin;
            this.cities[i] = [x, y];
        }

        this.currentPath = this.generatePath();
        this.render();
    },

    pathDistance:function (path, i1, i2) {
        return this.distance(this.cities[path[i1]], this.cities[path[i2]]);
    },
    distance:function (a1, a2) {
        var result = 0;
        for (var i = 0; i < a1.length; i++) {
            var diff = a1[i] - a2[i];
            result += diff * diff;
        }
        return Math.sqrt(result);
    },
    calculatePathLength:function (path) {
        var result = 0;

        for (var i = 0; i < path.length - 1; i++) {
            result += this.distance(this.cities[path[i]], this.cities[path[i + 1]]);
        }

        return result;
    },
    generatePath:function () {
        var taken = new Array(this.cities.length);
        var path = new Array(this.cities.length);

        for (var i = 0; i < this.cities.length; i++) {
            taken[i] = false;
        }

        for (var i = 0; i < this.cities.length - 1; i++) {
            var icandidate;
            do
            {
                icandidate = Math.floor(Math.random() * path.length);
            } while (taken[icandidate]);

            path[i] = icandidate;
            taken[icandidate] = true;

            if (i == path.length - 2) {
                icandidate = 0;
                while (taken[icandidate]) {
                    icandidate++;
                }
                path[i + 1] = icandidate;
            }
        }

        return path;
    },
    render:function () {
        'use strict';

        this.canvas.width = this.canvas.width;

        for (var i = 0; i < this.cities.length; i++) {
            this.drawingContext.fillStyle = "#0000FF";
            this.drawingContext.beginPath();
            this.drawingContext.arc(this.cities[i][0], this.cities[i][1], 5, 0, Math.PI * 2, true);
            this.drawingContext.closePath();
            this.drawingContext.fill();
        }

        for (var i = 0; i < this.cities.length - 1; i++) {
            this.drawingContext.strokeStyle = "#000000";
            this.drawingContext.beginPath();
            this.drawingContext.moveTo(this.cities[this.currentPath[i]][0], this.cities[this.currentPath[i]][1]);
            this.drawingContext.lineTo(this.cities[this.currentPath[i + 1]][0], this.cities[this.currentPath[i + 1]][1])
            this.drawingContext.closePath();
            this.drawingContext.stroke();
        }
    },
    ev_canvas:function (ev) {

        if (ev.layerX || ev.layerX == 0) {
            ev._x = ev.layerX;
            ev._y = ev.layerY;
        }
        // Opera
        else if (ev.offsetX || ev.offsetX == 0) {
            ev._x = ev.offsetX;
            ev._y = ev.offsetY;
        }

        if (ev.type == 'mousedown' || ev.type == 'touchstart') {
            if (this.pointerDown != null) {
                this.pointerDown(ev._x, ev._y);
            }
        }
        else if (ev.type == 'mouseup' || ev.type == 'touchend') {
            if (this.pointerUp != null) {
                this.pointerUp(ev._x, ev._y);
            }
        }
        else if (ev.type == 'mousemove' || ev.type == 'touchmove') {
            if (this.pointerMove != null) {
                this.pointerMove(ev._x, ev._y);
            }
            if (this.captureTouch && ev.type == 'touchmove') {
                ev.preventDefault();
            }
        }
    }

};
