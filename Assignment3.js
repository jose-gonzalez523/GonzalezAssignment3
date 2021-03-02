//author: Jose Gonzalez
//date: 3/2/2021
//description: Made a basic program that displays a rotating square and 
//a still one. They are both different colors. The Slider moves the shape across the
//x axis but only to the right. The button changes the direction of the spin of the square
//Press D to change spin direction, Press R to move the square right and 
//Press L to move the square right. The menu options perform the same operations as the keybinds

//Proposed Points(9/10): The program met the specifications required but was not able to
//perform translations to the negative side of the x axis causing non-optimal functionality

"use strict";

var canvas;
var gl;

var theta = 0.0;
var thetaLoc;

// Shape and Program variables
var vertices;
var verticesSquare;
var colors;
var program;
var programSquare;
var colors2;

//Dynamic variables
var direction = true;
var translation
var Tx = .1;
var Ty = .1;
var Tz = 0;

window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );
    gl = canvas.getContext('webgl2');
    if (!gl) alert( "WebGL 2.0 isn't available" );


    //
    //  Configure WebGL
    //
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(.9, .9, .9, 1.0);

    //  Load shaders and initialize attribute buffers
    program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    vertices = [ //Vertices for the first square
        [0, .3],
        [-.3, 0],
        [.3, 0],

        
        [0, -.3],
        [-.3, 0],
        [.3, 0]
    ];

    colors = [ //Colors for first square
        vec3(1,0,1),
        vec3(1,0,1),
        vec3(1,0,1),

        vec3(1,0,1),
        vec3(1,0,1),
        vec3(1,0,1),
    ];

    verticesSquare = [ //Vertices for still square
        vec2(.4, .5),
        vec2(.1, .2),
        vec2(.7, .2),
        
        vec2(.4, -.1),
        vec2(.1, .2),
        vec2(.7, .2)
    ];

    colors2 = [ // Colors for the second square
        vec3(1,0,0),
        vec3(0,1,0),
        vec3(0,0,1),

        vec3(1,0,0),
        vec3(0,1,0),
        vec3(0,0,1),
    ];

    program = initShaders(gl, "vertex-shader", "fragment-shader");
    thetaLoc = gl.getUniformLocation(program, "uTheta");
    programSquare = initShaders(gl, 'vertex-shader-still', "fragment-shader");
    translation = gl.getUniformLocation(program, 'translation')//get the translation uniform


    // Initialize event handlers
    document.getElementById("Direction").onclick = function() {
        console.log("pressed button");
        direction = !direction; //change direction of the spinning square
    }

    document.getElementById("slider").onchange = function(event) {
        Tx = parseFloat(event.target.value); //Slider Determines the position of the square
        console.log("slider", Tx);
    }

    document.getElementById("Controls").onclick = function(event) {
        switch(event.target.index) {
            case 0:
                direction = !direction; //Changes the Direction of the spin when this case is selected from menu
                break;
            case 1:
                Tx += .01; //Moves square to the right when this case is selected from menu
                break;
            case 2:
                Tx -= .01; //Moves square to the left when this case is selected from menu
                break;
        }
    }

    window.onkeydown = function(event) {
        var key = String.fromCharCode(event.keyCode);
        switch( key ) {
          case 'D': //Press D to change spin direction
          case 'd':
            direction = !direction;
            break;
          case 'R': //Press R to move the square right
          case 'r':
            Tx += .1;
            break;
          case 'L': // Press L to move the square right
          case 'l':
            Tx -= .1;
            break;
        }
    };

    render();
};


function render() {
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(program);

    //COLOR BUFFERS for first square
    var cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );

    var colorLoc = gl.getAttribLocation(program, "aColor");
    gl.vertexAttribPointer(colorLoc, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(colorLoc);

    // Load the data into the GPU
    var bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);


    // Associate out shader variables with our data bufferData
    var positionLoc = gl.getAttribLocation(program, "aPosition");
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLoc);

    if (direction == true) {
        theta += 0.01;
    }
    else {
        theta -= 0.01;
    }
    gl.uniform1f(thetaLoc, theta);
    gl.uniform4f(translation, Tx, Ty, Tz, 0.0);
    gl.drawArrays(gl.TRIANGLES, 0, vertices.length);

    gl.useProgram(programSquare);

    // Load the data into the GPU
    var bufferId2 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId2);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(verticesSquare), gl.STATIC_DRAW);

    // Associate out shader variables with our data bufferData
    var positionLoc2 = gl.getAttribLocation(programSquare, "aPosition");
    gl.vertexAttribPointer(positionLoc2, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLoc2);

    //COLOR BUFFERS for Second square
    var cBuffer2 = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer2 );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colors2), gl.STATIC_DRAW );

    var colorLoc2 = gl.getAttribLocation(programSquare, "aColor");
    gl.vertexAttribPointer(colorLoc2, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(colorLoc2);

    gl.drawArrays(gl.TRIANGLES, 0,verticesSquare.length);
    requestAnimationFrame(render);

    
};
