import vertexShaderSrc from './vertex.glsl.js';
import fragmentShaderSrc from './fragment.glsl.js'

var gl;
var program;
var vao;
var uniformLoc;
var currColor;
var newColor;
var currTri;
var animRunning = false;
var start;
var colorPickerLoc;
var colorPicker;
var uniformColor;

function createShader(type, source) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader,source);
    gl.compileShader(shader);
    if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS)){
        var info = gl.getShaderInfoLog(shader);
        console.log('Could not compile WebGL program:' + info);
    }
    
    return shader;
}

function createProgram(vertexShader, fragmentShader) {
    var program = gl.createProgram();

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS) ) {
        var info = gl.getProgramInfoLog(program);
        console.log('Could not compile WebGL program:' + info);
    }

    return program;
}

function createBuffer(vertices) {
    var buffer= gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    return buffer;
}

function createVAO(posAttribLoc, colorAttribLoc, posBuffer, colorBuffer, posColorBuffer) {
    
    var vao = gl.createVertexArray();

    // Two buffers approach
    gl.bindVertexArray(vao);
    gl.enableVertexAttribArray(posAttribLoc);
    var size = 3; // number of components per attribute
    var type = gl.FLOAT;
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
    gl.vertexAttribPointer(posAttribLoc, size, type, false, 0, 0);

    gl.enableVertexAttribArray(colorAttribLoc);
    size = 4;
    type = gl.FLOAT;
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.vertexAttribPointer(colorAttribLoc, size, type, false, 0, 0);


    // Single buffer approach
    // gl.bindVertexArray(vao);
    // gl.bindBuffer(gl.ARRAY_BUFFER, posColorBuffer);
    // gl.enableVertexAttribArray(posAttribLoc);
    // var size = 3; // number of components per attribute
    // var type = gl.FLOAT;
    // var normalization = false;
    // var stride = 7 * 4; // offset in bytes to next attribute
    // var offset = 0;
    // gl.vertexAttribPointer(posAttribLoc, size, type, false, stride, offset);

    // gl.enableVertexAttribArray(colorAttribLoc);
    // size = 4;
    // type = gl.FLOAT;
    // normalization = false;
    // stride = 7 * 4; 
    // offset = 3 * 4;
    // gl.vertexAttribPointer(colorAttribLoc, size, type, normalization, stride, offset);


    return vao;
}

function draw(timestamp) {

    gl.clearColor(1, 1, 1, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    gl.useProgram(program);
    gl.uniform4fv(uniformLoc, new Float32Array(uniformColor));
    gl.uniform1f(colorPickerLoc, colorPicker)
    gl.bindVertexArray(vao);
    var primitiveType = gl.TRIANGLES;
    var count = 3*currTri; // number of elements (vertices)
    gl.drawArrays(primitiveType, 0, count);

    requestAnimationFrame(draw);
}

function createTriangle() {

    var positions = [
        0, 0.5, 0,
        -0.5, -0.5, 0,
        0.5, -0.5, 0
    ];
    var colors = [
        1,0,0,1,
        0,1,0,1,
        0,0,1,1
    ];

    var poscolors = [
        0, 0.5, 0, 1,0,0,1,
        -0.5, -0.5, 0, 0,1,0,1,
        0.5, -0.5, 0, 0,0,1,1
    ];

    return {'positions': positions, 'colors': colors, 'poscolors': poscolors};

}

function initialize(triangles, totalTriangles, sliderColor, colorFrom='file') {
    // console.log(window.innerWidth)
    // console.log(window.innerHeight)
    // console.log(document.getElementsByClassName('right')[0].clientWidth)
    // console.log(document.getElementsByClassName('right')[0].offsetWidth)


    var canvas = document.querySelector("#glcanvas");
    // canvas.width = canvas.clientWidth;
    // canvas.height = canvas.clientHeight;

    canvas.width = document.getElementsByClassName('right')[0].clientWidth;
    canvas.height = window.innerHeight - 50;

    gl = canvas.getContext("webgl2");
    
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    // console.log(totalTriangles)
    currTri = totalTriangles;
    // var triangles = createTriangle();
    // currColor = [0, 0, 0, 1];
    // newColor = currColor;

    uniformColor = sliderColor
    // console.log(uniformColor)
    // console.log(new Float32Array(uniformColor))
    // console.log(new Float32Array([0,1,0,1]))

    if(colorFrom == 'file'){
        colorPicker = 1.0
    }else{
        colorPicker = 2.0
    }
    
    var vertexShader = createShader(gl.VERTEX_SHADER, vertexShaderSrc);
    var fragmentShader = createShader(gl.FRAGMENT_SHADER, fragmentShaderSrc);
    program = createProgram(vertexShader, fragmentShader);

    var posAttribLoc = gl.getAttribLocation(program, "position");
    var colorAttribLoc = gl.getAttribLocation(program, "color");
    uniformLoc = gl.getUniformLocation(program, 'uColor');

    colorPickerLoc = gl.getUniformLocation(program, 'check')

    var posBuffer = createBuffer(triangles['positions']);
    var colorBuffer = createBuffer(triangles['colors']);
    // var posColorBuffer = createBuffer(triangles['poscolors']);
    vao = createVAO(posAttribLoc, colorAttribLoc, posBuffer, colorBuffer);

    window.requestAnimationFrame(draw);
}


export {initialize}
