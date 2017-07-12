function Snake () {
    this.model = translate (0.0, 0.0, 0.0);
    this.modelNorm = this.model;
    var obst = mult(this.model, vec4(0.0, 0.0, 0.0, 1.0));
    this.obstacle = vec3(obst[0], obst[1], obst[2]);
    
    this.eating = false;
    this.turningLeft = false;
    this.turningRight = false;
    
    this.vertices = function () { return Snake.vertices; };
    this.normals = function () { return Snake.normals; };
    this.texCoords = function () { return Snake.texCoords; };
    this.indices = function () { return Snake.indices; };
    this.parts = function () { return Snake.parts; };
    this.texture = function () { return Snake.texture; };
    
    this.tailModel = null;
    
    this.move = function () {
        var parts = Snake.parts;
        var len = parts.length;
        
        if (Snake.step === 0) {
            parts.splice (1, 0, new SnakeBody(0.0, 0.0));
            parts[1].model = parts[0].model;
            parts[1].normal = parts[0].normal;
            len += 1;
            if (!this.eating) {
                parts.splice (len - 2, 1);
                len -= 1;
            }
            this.eating = false;
        }
        
        parts[0].model = mult(parts[0].model, translate(0.0, 0.0, 1.0 / Snake.slices));
        parts[0].modelNorm = normalMatrix(parts[0].model, false);
        parts[len - 1].model = mult(parts[len - 1].model,
                                    translate(0.0, 0.0, 1.0 / Snake.slices));
        parts[len - 1].normal = normalMatrix(parts[len - 1].model, 0);
        
        var vertices = [];
        var normals = [];
        var texCoords = [];
        var indices = [];

        var tot = 0;
        for (var i = 0; i < parts.length; i++) {
            var v = parts[i].vertices ();
            var n = parts[i].normals ();
            var t = parts[i].texCoords ();
            var c = [];
            if (i === 1) c = parts[i].indices (0, Snake.step + 1);
            else if (i === parts.length -2)
                c = parts[i].indices (Snake.step, Snake.slices);
            else c = parts[i].indices (0, Snake.slices);

            for (var j = 0; j < v.length; j++) {
                vertices.push (mult (parts[i].model, v[j]));
                normals.push (mult (parts[i].modelNorm, n[j]));
                if (i !== 0 && i !== parts.length - 1)
                    t[j][1] += 0.33333 / Snake.slices;
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
        
        Snake.step = (Snake.step + 1) % (Snake.slices);
    };
    
    this.changeDir = function(code){
        //if(code === 110) rotation(this, 'l');
        //else rotation(this, 'r');
    };
    
    this.aggiungi = function(){
        var parts = Snake.parts;
        
        parts[0].model=mult(parts[0].model, translate(0.0, 0.0, 1.0));
        parts[0].modelNorm = normalMatrix(parts[0].model, false);  
        
        parts.splice(1, 0, new SnakeBody(0.0, 0.0));
        configureSnake2(parts);
        
    };
}

function configureSnake (slices, texture) {
    configureSnakeHead (0.35, 0.5, slices, texture);
    configureSnakeBody (0.25, 1.0, slices, texture);
    configureSnakeTail (0.25, 1.0, slices, texture);
    configureSnakeLeftBody (0.25, slices, texture);
    configureSnakeRightBody (0.25, slices, texture);
    
    var parts = [
        new SnakeHead (0.5, 0.5),
        new SnakeBody (0.5, -0.5),
        new SnakeBody (0.5, -1.5),
        new SnakeBody (0.5, -2.5),
        new SnakeTail (0.5, -2.5)
    ];
    
    Snake.step = 0;
    Snake.slices = slices;
    Snake.texture = texture;
    Snake.parts = parts;
}

function rotation(snake, dir){
    var parts = snake.parts();
    
    if(parts[0].model[2][3] % 0.5 !==0){
        var pos=parts[0].model[2][3] + 0.7;
        var x= Math.ceil(pos) - 0.5;
        parts[0].model[2][3]=x;
    }
    if(parts[0].model[0][3] % 0.5 !==0){
        var pos=parts[0].model[0][3] - 0.7;
        var x= Math.ceil(pos) - 0.5;
        parts[0].model[0][3]=x;
    }
    
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