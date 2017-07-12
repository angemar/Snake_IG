function Snake () {
    this.model = translate (0.0, 0.0, 0.0);
    this.modelNorm = this.model;
    var obst = mult(this.model, vec4(0.0, 0.0, 0.0, 1.0));
    this.obstacle = vec3(obst[0], obst[1], obst[2]);
    
    this.vertices = function () { return Snake.vertices; };
    this.normals = function () { return Snake.normals; };
    this.texCoords = function () { return Snake.texCoords; };
    this.indices = function () { return Snake.indices; };
    this.parts = function () { return Snake.parts; };
    
    this.move = function (step) {  
        var parts = this.parts();
        matrix[Math.floor(parts[0].model[0][3])+15][Math.floor(parts[0].model[2][3])+15]='0';
        parts[0].model=mult(parts[0].model, translate(0.0, 0.0, step));
        parts[0].modelNorm = normalMatrix(parts[0].model, false);
         matrix[Math.floor(parts[0].model[0][3])+15][Math.floor(parts[0].model[2][3])+15]='h';
        configureSnake2(parts);
        
    };
    
    this.changeDir = function(code){
        matrix[Math.floor(this.parts()[0].model[0][3])+15][Math.floor(this.parts()[0].model[2][3])+15]='0';
        if(code === 110) {
            rotation(this, 'l');
        }else{ 
            rotation(this, 'r');
        }
    };
    
    this.aggiungi = function(){
        var parts = this.parts();
        
        parts[0].model=mult(parts[0].model, translate(0.0, 0.0, 1.0));
        parts[0].modelNorm = normalMatrix(parts[0].model, false);  
        
        parts.splice(1, 0, new SnakeBody(0.0, 0.0));
        configureSnake2(parts);
        
    };
}

function configureSnake (texture) {

    configureSnakeHead (0.35, 0.5, 30, texture);
    configureSnakeBody (0.25, 1.0, 15, texture);
    configureSnakeTail (0.25, 1.0, 60, texture);
    configureSnakeLeftBody (0.25, 15, texture);
    configureSnakeRightBody (0.25, 15, texture);
    
    var parts = [
        new SnakeHead (0.5, 0.5),
        new SnakeBody (0.0, 0.0),
        new SnakeBody (0.0, 0.0),
        new SnakeTail (0.0, 0.0)
    ];
    
    for (var i = 1; i < parts.length; i++){
        parts[i].model=mult(parts[i-1].model, translate(0.0, 0.0, -1.0));
        parts[i].modelNorm = normalMatrix(parts[i].model, false);
    }
    
    Snake.texture = texture;
    Snake.prototype.texture = function () { return Snake.texture; };
    
    configureSnake2(parts);
}

function configureSnake2(parts){ 
    var vertices = [];
    var normals = [];
    var texCoords = [];
    var indices = [];
    
    for (var i = 1; i < parts.length; i++){
        if(!(parts[i] instanceof SnakeLeftBody || parts[i] instanceof SnakeRightBody)){
            parts[i].model=mult(parts[i-1].model, translate(0.0, 0.0, -1.0));
            parts[i].modelNorm = normalMatrix(parts[i].model, false);
        }
    }
    
    var tot = 0;
    
    for (var i = 0; i < parts.length; i++) {
        var v = parts[i].vertices ();
        var n = parts[i].normals ();
        var t = parts[i].texCoords ();
        var c = parts[i].indices ();

        for (var j = 0; j < v.length; j++) {
            vertices.push (mult (parts[i].model, v[j]));
            normals.push (mult (parts[i].modelNorm, n[j]));
            texCoords.push (t[j]);
        }
        for (var k = 0; k < c.length; k++) indices.push (c[k] + tot);
        
        tot += v.length;
    }
    indices = new Uint16Array(indices);
    
    Snake.vertices = vertices;
    Snake.normals = normals;
    Snake.texCoords = texCoords;
    Snake.indices = indices;
    Snake.parts = parts;
}

function rotation(snake, dir){
    var parts = snake.parts();
    
    if(Math.abs(parts[0].model[2][3]+0.2 - Math.floor(parts[0].model[2][3])) > 0.1 || 
            Math.abs(parts[0].model[2][3]+0.2 - Math.floor(parts[0].model[2][3])) > 0.1){
        flagRotate = dir;
        //return;
    }
    flagRotate=0;
    console.log(flagRotate+ " "+parts[0].model[2][3] + " " +parts[0].model[0][3] );
    
    parts[0].model[0][3] = Math.ceil(parts[0].model[0][3]) - 0.5;
    parts[0].model[2][3] = Math.ceil(parts[0].model[2][3]) - 0.5;
    /*if((parts[0].model[2][3] / 0.5) %2 !== 1){
        var pos=parts[0].model[2][3] + 0.7;
        var x= Math.ceil(pos) - 0.5;
        parts[0].model[2][3]=x;
    }
    if((parts[0].model[2][3] / 0.5) %2 !== 1){
        var pos=parts[0].model[0][3] - 0.7;
        var x= Math.ceil(pos) - 0.5;
        parts[0].model[0][3]=x;
    }*/
    
    var obj;
    if(dir === 'l'){
        obj = new SnakeLeftBody(0.0, 0.0);
        obj.model = parts[0].model;
    }else{
        obj = new SnakeRightBody(0.0, 0.0);
        obj.model = parts[0].model;
    }
    
    obj.modelNorm = normalMatrix(obj.model, false); 
    
    parts.splice(1, 0, obj);
    
     
    //while(parts[0].model[0][3] % 0.5 !==0 && parts[0].model[2][3] % 0.5 !==0){};
    if( dir === 'l') parts[0].model = mult(parts[0].model , rotate(90, 0.0, 1.0, 0.0));
    else parts[0].model = mult(parts[0].model , rotate(-90, 0.0, 1.0, 0.0));
    
    parts[0].model = mult(parts[0].model , translate(0.0, 0.0, 1.0));
    parts[0].modelNorm = normalMatrix(parts[0].model, false);

    configureSnake2(parts);
}