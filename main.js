"use strict";

var gl, program;

var objects = {'body' : [], 'tail' : [], 'head' : [], 'world' : []};
var objKeys = [];

var vBuffer, nBuffer, tBuffer;
var vPosition, vNormal, vTexCoord;

var objPath = "../objects/";

var yaw = 0.0;
var pitch = -30.0 * Math.PI / 180.0;

var eye = vec3 (0.0, 2.0, -2.0);
var at = vec3 (0.0, 0.0, 0.0);
var newAt = [0.0, 0.0, 0.0];
newAt[0] = -Math.sin (yaw) * Math.cos (pitch);
newAt[1] = Math.sin (pitch);
newAt[2] = Math.cos (pitch) * Math.cos (yaw);
for (var i = 0; i < 3; i++) at[i] = eye[i] + newAt[i];
var up = vec3(0.0, 1.0, 0.0);

var fovy = 45.0;
var aspect = 1.0;
var near = 0.1;
var far = Math.sqrt (Math.pow (100.0, 2.0) + Math.pow (100.0, 2.0));

var viewMat = lookAt (eye, at, up);
var viewNormMat = normalMatrix (viewMat, false);
var projMat = perspective(fovy, aspect, near, far);

var dirLightDirection = [45.0, 45.0, 45.0, 0.0];
var posLightPosition = [0.0, 25.0, 0.0, 1.0];
var spotLightPosition = [eye[0], eye[1], eye[2], 1.0];
var spotLightDirection = [0.0, 0.0, -1.0, 0.0];

var keys = {'87' : false, '68' : false, '83' : false, '65' : false,
            '38' : false, '39' : false, '40' : false, '37' : false};
var keysKeys = Object.keys(keys);

var modelMatLoc, modelNormMatLoc, viewMatLoc, viewNormMatLoc, projMatLoc;
var dirLightDirLoc, posLightPosLoc, spotLightPosLoc, spotLightDirLoc;

function loadTexture (texture, image) {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
}

window.onload = function () {
    var canvas = document.getElementById("gl-canvas");

    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) alert("WebGL isn't available");

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    gl.enable(gl.DEPTH_TEST);

    program = initShaders(gl, "vertex-shader", "fragment-shader");

    gl.useProgram(program);

    var snakeBodyTex = gl.createTexture();
    var snakeBodyImage = new Image ();
    snakeBodyImage.onload = function () { loadTexture (snakeBodyTex, snakeBodyImage); };
    snakeBodyImage.src = 'cable_512fica.jpg';
    
    var headTex = gl.createTexture();
    var headImage = new Image ();
    headImage.onload = function () { loadTexture (headTex, headImage); };
    headImage.src = 'eyed_cable_512.jpg';
    
    var worldTex = gl.createTexture();
    var worldImage = new Image ();
    worldImage.onload = function () { loadTexture (worldTex, worldImage); };
    worldImage.src = 'circuit.jpg';
    
    configureSnakeHead (0.3, 90, headTex);
    objects['head'].push (new SnakeHead (0.0, 1.65));
    
    configureSnakeBody (0.25, 1.0, 360, snakeBodyTex);
    objects['body'].push (new SnakeBody (0.0, 1.0));
    objects['body'].push (new SnakeBody (0.0, 0.0));
    
    configureSnakeTail (0.25, 0.5, 360, snakeBodyTex);
    objects['tail'].push (new SnakeTail (0.0, -0.75));
    
    configureWorld (100, 100, 50, worldTex);
    objects['world'].push (new World (0.0, 0.0));
    
    objKeys = Object.keys(objects);
    
    vBuffer = gl.createBuffer();
    nBuffer = gl.createBuffer();
    tBuffer = gl.createBuffer();

    vPosition = gl.getAttribLocation(program, "vPosition");
    vNormal = gl.getAttribLocation(program, "vNormal");
    vTexCoord = gl.getAttribLocation(program, "vTexCoord");
    
    configureLight(gl, program);
    configureButtons(document, gl, program);
    
    modelMatLoc = gl.getUniformLocation (program, "modelMat");
    modelNormMatLoc = gl.getUniformLocation (program, "modelNormMat");
    viewMatLoc = gl.getUniformLocation (program, "viewMat");
    viewNormMatLoc = gl.getUniformLocation (program, "viewNormMat");
    projMatLoc = gl.getUniformLocation (program, "projMat");
    
    dirLightDirLoc = gl.getUniformLocation(program, "dirLightDirection");
    posLightPosLoc = gl.getUniformLocation(program, "posLightPosition");
    spotLightPosLoc = gl.getUniformLocation(program, "spotLightPosition");
    spotLightDirLoc = gl.getUniformLocation(program, "spotLightDirection");

    gl.uniformMatrix4fv(viewMatLoc, false, flatten(viewMat));
    gl.uniformMatrix4fv(viewNormMatLoc, false, flatten(viewNormMat));
    gl.uniformMatrix4fv(projMatLoc, false, flatten(projMat));
    
    gl.activeTexture(gl.TEXTURE0);
    
    render();
};

var render = function () {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    move (keys, keysKeys);
    
    gl.uniform4fv(dirLightDirLoc, mult (viewNormMat, dirLightDirection));
    gl.uniform4fv(posLightPosLoc, mult (viewMat, posLightPosition));
    gl.uniform4fv(spotLightPosLoc, mult (viewMat, spotLightPosition));
    gl.uniform4fv(spotLightDirLoc, mult (viewNormMat, spotLightDirection));
    
    for (var i = 0; i < objKeys.length; i++) {
        var proto = Object.getPrototypeOf(objects[objKeys[i]][0]);
        
        gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, flatten (proto.vertices ()), gl.STATIC_DRAW);
        gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(vPosition);

        gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, flatten (proto.normals ()), gl.STATIC_DRAW);
        gl.vertexAttribPointer(vNormal, 4, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(vNormal);
        
        gl.bindBuffer(gl.ARRAY_BUFFER, tBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, flatten (proto.texCoords ()), gl.STATIC_DRAW);
        gl.vertexAttribPointer(vTexCoord, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(vTexCoord);
        
        gl.bindTexture(gl.TEXTURE_2D, proto.texture ());
        gl.uniform1i(gl.getUniformLocation(program, "tex"), 0);
        
        for (var j = 0; j < objects[objKeys[i]].length; j++) {
            var obj = objects[objKeys[i]][j];
            gl.uniformMatrix4fv(modelMatLoc, false, flatten (obj.modelMat));
            gl.uniformMatrix4fv(modelNormMatLoc, false, flatten (obj.modelNormMat));
            gl.drawArrays(gl.TRIANGLES, 0, proto.vertices().length);
        }
    }
    requestAnimFrame(render);
};