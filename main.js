"use strict";

var gl, program;
var label;
var points=0, winPoints=300;

var height=20, width=20;

var matrix = [];
for(var i=0; i<height; i++){
    matrix.push([]);
    for(var j=0;j<width;j++){
        matrix[i].push('0');
    }
}

var objects = {'snake' : [], 'bonus' : [], 'world' : [], 'sea' : []};
var objKeys = [];

var vBuffer, nBuffer, tBuffer, iBuffer;
var vPosition, vNormal, vTexCoord;

var objPath = "../objects/";

var moveVar = 0;
var freqVar = 2;

var yaw = 0.0;
var pitch = -30.0 * Math.PI / 180.0;

var eye = vec3 (0.5, 2.0, -6.0);
var at = vec3 (0.5, 0.0, 0.0);
var newAt = [0.0, 0.0, 0.0];
newAt[0] = -Math.sin (yaw) * Math.cos (pitch);
newAt[1] = Math.sin (pitch);
newAt[2] = Math.cos (pitch) * Math.cos (yaw);
for (var i = 0; i < 3; i++) at[i] = eye[i] + newAt[i];
var up = vec3(0.0, 1.0, 0.0);

var fovy = 45.0, aspect, near = 0.1, far;
var view = lookAt (eye, at, up);
var viewNorm = normalMatrix (view, false);
var proj;

var dirDirection = [45.0, 45.0, 45.0, 0.0];
var posPosition = [0.0, 25.0, 0.0, 1.0];
var spotPosition = [eye[0], eye[1], eye[2], 1.0];
var spotDirection = [0.0, 0.0, -1.0, 0.0];

var keys = {'87' : false, '68' : false, '83' : false, '65' : false,
            '38' : false, '39' : false, '40' : false, '37' : false};
var keysKeys = Object.keys(keys);

var modelLoc, modelNormLoc, viewLoc, viewNormLoc, projLoc;
var dirDirLoc, posPosLoc, spotPosLoc, spotDirLoc;
var eyeDistLoc;

function loadTexture (texture, image) {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
}

function draw() {
    var ctx = document.getElementById('gl-canvas1').getContext('2d');

    for (var i = 0; i < height; i++) {
        for (var j = 0; j < width; j++) {
			
            if (matrix[i][j] === 'b')
                ctx.fillStyle = "rgb(255,0,0)";
            else if (matrix[i][j] === 'h')
                ctx.fillStyle = "rgb(220,220,220)";
            else ctx.fillStyle = "rgb(0,0,0)";
            
            ctx.fillRect((height - 1 - i) * 5, (width - 1 - j) * 5, 5, 5);
        }
    }
}


window.onload = function () {
	
	
    label = document.getElementById("label") ; 
	
    var canvas = document.getElementById("gl-canvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) alert("WebGL isn't available");

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.6, 0.9, 1.0, 1.0);

    gl.enable(gl.DEPTH_TEST);

    program = initShaders(gl, "vertex-shader", "fragment-shader");

    gl.useProgram(program);

    var snakeTex = gl.createTexture();
    var snakeImage = new Image ();
    snakeImage.onload = function () { loadTexture (snakeTex, snakeImage); };
    snakeImage.src = 'skin_512.jpg';
    
    var bonusTex = gl.createTexture();
    var bonusImage = new Image ();
    bonusImage.onload = function () { loadTexture (bonusTex, bonusImage); };
    bonusImage.src = 'apple_512.jpg';
    
    var worldTex = gl.createTexture();
    var worldImage = new Image ();
    worldImage.onload = function () { loadTexture (worldTex, worldImage); };
    worldImage.src = 'grass_512.jpg';
    
    var seaTex = gl.createTexture();
    var seaImage = new Image ();
    seaImage.onload = function () { loadTexture (seaTex, seaImage); };
    seaImage.src = 'sea_512.jpg';
    
    configureSnake (20, snakeTex);
    objects['snake'].push (new Snake());
    
    configureBonus (0.23, 30, 2, bonusTex);
    objects['bonus'].push (new Bonus (0.5, 3.5));
    matrix[10][13] = 'b';
     
    configureWorld (height, width, height, worldTex);
    objects['world'].push (new World ());
    
    configureSea (50, 50, 25, seaTex);
    objects['sea'].push (new Sea ());
    
    if (canvas.width < canvas.height) aspect = canvas.height / canvas.width;
    else aspect = canvas.width / canvas.height;
    far = Math.sqrt (Math.pow (World.width, 2.0) + Math.pow (World.height, 2.0));
    proj = perspective(fovy, aspect, near, far);
    
    window.onresize = function () {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        gl.viewport(0, 0, canvas.width, canvas.height);
        if (canvas.width < canvas.height) aspect = canvas.height / canvas.width;
        else aspect = canvas.width / canvas.height;
        far = Math.sqrt (Math.pow (World.width, 2.0) + Math.pow (World.height, 2.0));
        proj = perspective(fovy, aspect, near, far);
        gl.uniformMatrix4fv(projLoc, false, flatten(proj));
    };
    
    objKeys = Object.keys(objects);
    
    vBuffer = gl.createBuffer();
    nBuffer = gl.createBuffer();
    tBuffer = gl.createBuffer();
    iBuffer = gl.createBuffer();

    vPosition = gl.getAttribLocation(program, "vPosition");
    vNormal = gl.getAttribLocation(program, "vNormal");
    vTexCoord = gl.getAttribLocation(program, "vTexCoord");
    
    configureLight(gl, program);
    configureButtons(document, gl, program);
    
    modelLoc = gl.getUniformLocation (program, "model");
    modelNormLoc = gl.getUniformLocation (program, "modelNorm");
    viewLoc = gl.getUniformLocation (program, "view");
    viewNormLoc = gl.getUniformLocation (program, "viewNorm");
    projLoc = gl.getUniformLocation (program, "proj");
    
    dirDirLoc = gl.getUniformLocation(program, "dirDirection");
    posPosLoc = gl.getUniformLocation(program, "posPosition");
    spotPosLoc = gl.getUniformLocation(program, "spotPosition");
    spotDirLoc = gl.getUniformLocation(program, "spotDirection");
    
    eyeDistLoc = gl.getUniformLocation(program, "eyeDist");

    gl.uniformMatrix4fv(projLoc, false, flatten(proj));
    
    gl.activeTexture(gl.TEXTURE0);
    
    render();
    
};

var render = function () { 
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    if (moveVar % freqVar === 0) objects['snake'][0].move();
    moveVar += 1;
    
    move (keys, keysKeys);
    
    draw();
    
    objects['sea'][0].move();
    
    gl.uniformMatrix4fv(viewLoc, false, flatten(view));
    gl.uniformMatrix4fv(viewNormLoc, false, flatten(viewNorm));
    
    gl.uniform4fv(dirDirLoc, mult (viewNorm, dirDirection));
    gl.uniform4fv(posPosLoc, mult (view, posPosition));
    gl.uniform4fv(spotPosLoc, mult (view, spotPosition));
    gl.uniform4fv(spotDirLoc, mult (viewNorm, spotDirection));
    
    for (var i = 0; i < objKeys.length; i++) {
        if (objects[objKeys[i]].length === 0) continue;
        
        var proto = objects[objKeys[i]][0];
        
        gl.bindBuffer (gl.ELEMENT_ARRAY_BUFFER, iBuffer);
        gl.bufferData (gl.ELEMENT_ARRAY_BUFFER, proto.indices (), gl.DYNAMIC_DRAW);
        
        gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, flatten (proto.vertices ()), gl.DYNAMIC_DRAW);
        gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(vPosition);

        gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, flatten (proto.normals ()), gl.DYNAMIC_DRAW);
        gl.vertexAttribPointer(vNormal, 4, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(vNormal);
        
        gl.bindBuffer(gl.ARRAY_BUFFER, tBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, flatten (proto.texCoords ()), gl.DYNAMIC_DRAW);
        gl.vertexAttribPointer(vTexCoord, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(vTexCoord);
        
        gl.bindTexture(gl.TEXTURE_2D, proto.texture ());
        gl.uniform1i(gl.getUniformLocation(program, "tex"), 0);
        
        for (var j = 0; j < objects[objKeys[i]].length; j++) {
            var obj = objects[objKeys[i]][j];
            if(objKeys[i] === 'bonus') { 
                obj.model = mult(obj.model, Bonus.rotMat);
                obj.modelNorm = normalMatrix(obj.model, false);
                obj.eat(objects['snake'][0]);
            }
            if (objKeys[i] !== 'world' && objKeys[i] !== 'sea') {
                gl.uniform1f(eyeDistLoc, length (subtract (obj.obstacle, eye)));
            }
            else gl.uniform1f(eyeDistLoc, 0.0);
            
            gl.uniformMatrix4fv(modelLoc, false, flatten(obj.model));
            gl.uniformMatrix4fv(modelNormLoc, false, flatten(obj.modelNorm));
            gl.drawElements(gl.TRIANGLE_STRIP, proto.indices().length, gl.UNSIGNED_SHORT, 0);
        }
    }
    
    requestAnimFrame(render);
};
