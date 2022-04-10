var vertexShaderSource = `
    precision mediump float;
    attribute vec2 vertPosition;
    attribute vec3 vertColor;
    varying vec3 fragColor;
    void main(){
        fragColor = vertColor;
        gl_Position = vec4(vertPosition,0.0,1.0);
    }
    `;

var fragmentShaderSource = `
    precision mediump float;
    varying vec3 fragColor;
    void main(){
        gl_FragColor = vec4(fragColor,1.0);
    }
    `;

var InitDemo = function() {
    console.log("this is working");

    var canvas = document.getElementById("screen-canvas"); //get the canvas element
    var gl = canvas.getContext("webgl"); //get the context of the canvas

    //log message if webgl is not supported
    if (!gl) {
        console.log("WebGL not supported, falling back on experimental-webgl");
        gl = canvas.getContext("experimental-webgl");
    }
    if(!gl){
        alert("Your browser does not support WebGL");
    }

    // canvas.width = window.innerWidth;
    // canvas.height = window.innerHeight;
    // gl.viewport(0, 0, window.innerWidth, window.innerHeight);

    //clear and set color of the canvas
    gl.clearColor(0.75, 0.85, 0.8, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    //create shaders
    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

    //attach source code to shaders
    gl.shaderSource(vertexShader, vertexShaderSource);
    gl.shaderSource(fragmentShader, fragmentShaderSource);

    //compile shaders
    gl.compileShader(vertexShader);
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
        console.error("ERROR compiling vertex shader!", gl.getShaderInfoLog(vertexShader));
        return;
    }
    gl.compileShader(fragmentShader);
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
        console.error("ERROR compiling fragment shader!", gl.getShaderInfoLog(fragmentShader));
        return;
    }

    //create program
    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);

    //link program
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error("ERROR linking program!", gl.getProgramInfoLog(program));
        return;
    }

    //validate program (not exactly sure what this does other than catching other errors)
    gl.validateProgram(program);
    if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
        console.error("ERROR validating program!", gl.getProgramInfoLog(program));
        return;
    }

    //create buffer
    var triangleVertices = [
    //   x, y ,  r, g, b
        0.0, 0.5,   1.0, 0.0, 0.0,
        -0.5, -0.5, 0.0, 1.0, 0.0,
        0.5, -0.5,  0.0, 0.0, 1.0
    ];
    var triangleVertexBufferObject = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexBufferObject);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVertices), gl.STATIC_DRAW);

    //set attribute pointers
    var positionAttribLocation = gl.getAttribLocation(program, "vertPosition");
    var colorAttribLocation = gl.getAttribLocation(program, "vertColor");
    gl.vertexAttribPointer(
        positionAttribLocation, //attribute location
        2, //number of elements per attribute
        gl.FLOAT, //type of elements
        gl.FALSE,
        5 * Float32Array.BYTES_PER_ELEMENT, //size of an individual vertex
        0 //offset from the beginning of a single vertex to this attribute
    );
    gl.vertexAttribPointer(
        colorAttribLocation, //attribute location
        3, //number of elements per attribute
        gl.FLOAT, //type of elements
        gl.FALSE,
        5 * Float32Array.BYTES_PER_ELEMENT, //size of an individual vertex
        2 * Float32Array.BYTES_PER_ELEMENT //offset from the beginning of a single vertex to this attribute
    );

    //enable attribute pointers
    gl.enableVertexAttribArray(positionAttribLocation);
    gl.enableVertexAttribArray(colorAttribLocation);


    //main render loop
    //for now we will just draw a single triangle so no looping required.
    gl.useProgram(program);
    gl.drawArrays(gl.TRIANGLES, 0, 3);




};

