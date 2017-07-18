"use strict";

var gl, program;

var vBuffer, nBuffer, tBuffer, iBuffer;
var vPosition, vNormal, vTexCoord;

var modelLoc, modelNormLoc, viewLoc, viewNormLoc, projLoc;
var ambProdLoc, diffProdLoc, specProdLoc, shinLoc;
var posPosLoc, spotPosLoc, spotDirLoc, spotCutoffLoc;
var posAttLoc, spotAttLoc, spotCutoffLoc;
var eyeDistLoc;

var objects = {};
var map;
var pointsLabel;
var pause=false, dead=false, winner=false;

var audioEat = new Audio('musicEat.mp3');
var audioWin = new Audio('musicWin.mp3');
var audioLose = new Audio('musicLose.mp3');


function loadTexture (texture, image) {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
}

window.onload = function () {
    
    var canvas = document.getElementById("gl-canvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    var mapCanvas = document.getElementById('map-canvas') ;    
    pointsLabel = document.getElementById("points-label") ; 

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
    
    var skyTex = gl.createTexture();
    var skyImage = new Image ();
    skyImage.onload = function () { loadTexture (skyTex, skyImage); };
    skyImage.src = 'clouds_512.png';
    
    configureWorld (16, 16, 16, worldTex);
    objects['world'] = new World ();
    
    configureMap (World.width, World.height, mapCanvas);
    map = new Map ();
    
    configureSnake (15, snakeTex);
    objects['snake'] = new Snake ();
    
    configureBonus (0.25, 20, bonusTex);
    objects['bonus'] = new Bonus (0.5, 3.5);
    
    configureSea (60, 60, 20, seaTex);
    objects['sea'] = new Sea ();
    
    configureSky (25, 20, 200, skyTex);
    objects['sky'] = new Sky ();
    
    if (canvas.width < canvas.height) var aspect = canvas.height / canvas.width;
    else var aspect = canvas.width / canvas.height;
    var far = 2 * Sky.radius;
    var proj = perspective(45.0, aspect, 0.1, far);
    
    window.onresize = function () {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        gl.viewport(0, 0, canvas.width, canvas.height);
        if (canvas.width < canvas.height) var aspect = canvas.height / canvas.width;
        else var aspect = canvas.width / canvas.height;
        var far = 2 * Sky.radius;
        var proj = perspective(45.0, aspect, 0.1, far);
        gl.uniformMatrix4fv(projLoc, false, flatten(proj));
    };
    
    document.onkeypress = function(e){
        e = e || window.event;
        var code = e.keyCode;
        if(code === 0) code = e.charCode;
        if (code === 37) { // <-
            if (!Snake.turningRight) Snake.turningLeft = true;
            return;
        }
        if (code === 39) { // ->
            if (!Snake.turningLeft) Snake.turningRight = true;
            return;
        }
        if(code === 32) pause=true;
    };
    
    vBuffer = gl.createBuffer();
    nBuffer = gl.createBuffer();
    tBuffer = gl.createBuffer();
    iBuffer = gl.createBuffer();

    vPosition = gl.getAttribLocation(program, "vPosition");
    vNormal = gl.getAttribLocation(program, "vNormal");
    vTexCoord = gl.getAttribLocation(program, "vTexCoord");
    
    modelLoc = gl.getUniformLocation (program, "model");
    modelNormLoc = gl.getUniformLocation (program, "modelNorm");
    viewLoc = gl.getUniformLocation (program, "view");
    viewNormLoc = gl.getUniformLocation (program, "viewNorm");
    projLoc = gl.getUniformLocation (program, "proj");

    ambProdLoc = gl.getUniformLocation(program, "ambientProduct");
    diffProdLoc = gl.getUniformLocation(program, "diffuseProduct");
    specProdLoc = gl.getUniformLocation(program, "specularProduct");
    shinLoc = gl.getUniformLocation(program, "shininess");
    
    posPosLoc = gl.getUniformLocation(program, "posPosition");
    spotPosLoc = gl.getUniformLocation(program, "spotPosition");
    spotDirLoc = gl.getUniformLocation(program, "spotDirection");
    spotCutoffLoc = gl.getUniformLocation(program, "spotCutoffAngle");
    
    posAttLoc = gl.getUniformLocation(program, "posAtt");
    spotAttLoc = gl.getUniformLocation(program, "spotAtt");
    eyeDistLoc = gl.getUniformLocation(program, "eyeDist");
    
    gl.uniformMatrix4fv(projLoc, false, flatten(proj));

    gl.uniform4fv(ambProdLoc, vec4 (0.0, 0.0, 0.0, 1.0));
    gl.uniform4fv(diffProdLoc, vec4 (1.0, 1.0, 1.0, 1.0));
    gl.uniform4fv(specProdLoc, vec4 (1.0, 1.0, 1.0, 1.0));
    gl.uniform1f(shinLoc, 100.0);
    
    gl.uniform4fv(posPosLoc, vec4 (0.0, 15.0, 0.0, 1.0));
    gl.uniform3fv(posAttLoc, vec3 (1.0, 0.01, 0.0001));
    gl.uniform3fv(spotAttLoc, vec3 (1.0, 0.01, 0.0001));
    
    gl.activeTexture(gl.TEXTURE0);
    
    render();
};

var render = function () { 
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    var objKeys = Object.keys(objects);
    
    for (var i = 0; i < objKeys.length; i++) {
        var obj = objects[objKeys[i]];
        
        obj.move();
        
        gl.bindBuffer (gl.ELEMENT_ARRAY_BUFFER, iBuffer);
        gl.bufferData (gl.ELEMENT_ARRAY_BUFFER, obj.indices (), gl.DYNAMIC_DRAW);
        
        gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, flatten (obj.vertices ()), gl.DYNAMIC_DRAW);
        gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(vPosition);

        gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, flatten (obj.normals ()), gl.DYNAMIC_DRAW);
        gl.vertexAttribPointer(vNormal, 4, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(vNormal);
        
        gl.bindBuffer(gl.ARRAY_BUFFER, tBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, flatten (obj.texCoords ()), gl.DYNAMIC_DRAW);
        gl.vertexAttribPointer(vTexCoord, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(vTexCoord);
        
        gl.bindTexture(gl.TEXTURE_2D, obj.texture ());
        gl.uniform1i(gl.getUniformLocation(program, "tex"), 0);
        
        if (obj instanceof Snake || obj instanceof Bonus) {
            var dist = length (subtract (obj.obstacle, objects['snake'].eye));
            gl.uniform1f(eyeDistLoc, dist);
        }
        else gl.uniform1f(eyeDistLoc, 0.0);
        
        gl.uniformMatrix4fv(modelLoc, false, flatten(obj.model));
        gl.uniformMatrix4fv(modelNormLoc, false, flatten(obj.modelNorm));
        
        gl.drawElements(gl.TRIANGLE_STRIP, obj.indices().length, gl.UNSIGNED_SHORT, 0);
    }
    
    var snake = objects['snake'];
    var bonus = objects['bonus'];
    
    var view = lookAt (snake.eye, snake.at, snake.up);
    var viewNorm = normalMatrix(view, false);
    
    gl.uniformMatrix4fv(viewLoc, false, flatten(view));
    gl.uniformMatrix4fv(viewNormLoc, false, flatten(viewNorm));
    gl.uniform4fv(spotPosLoc, bonus.spotPosition);
    gl.uniform4fv(spotDirLoc, bonus.spotDirection);
    gl.uniform1f(spotCutoffLoc, bonus.spotCutoff);
    
    map.draw();
    
    if(pause){
        alert("Game in pause! Press OK to play!");
        pause = false;
        audio.play();
    }else if(winner){
        audioWin.play();
        alert ("Points: "+Bonus.points+"/"+Bonus.winPoints+"\nYOU WIN!\nPress OK to restart the game!");
        winner=false;
        window.location.href="start.html";
        
    }else if(dead){
        audioLose.play();
        alert("Points: "+Bonus.points+"/"+Bonus.winPoints+"\nGAME OVER!\nPress OK to restart the game!");
        dead=false;
        window.location.href="start.html";
    }
    
    requestAnimFrame(render);
};
