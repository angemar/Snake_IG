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
    this.texture = function () { return Snake.texture; };
    
    this.move = function () {
        var parts = Snake.parts;
        var len = parts.length;
        
        //matrix[Math.floor(parts[0].model[0][3])+15][Math.floor(parts[0].model[2][3])+15]='0';
        //matrix[Math.floor(parts[0].model[0][3])+15][Math.floor(parts[0].model[2][3])+15]='h';
        
        if (Snake.step === 0) {
            Snake.turnLeftAnim = false;
            Snake.turnRightAnim = false;
            Snake.eatAnim = false;
            
            if (Snake.turningLeft) {
                parts.splice (1, 0, new SnakeLeftBody(0.0, 0.0));
                Snake.turningLeft = false;
                Snake.turnLeftAnim = true;
            }
            else if (Snake.turningRight) {
                parts.splice (1, 0, new SnakeRightBody(0.0, 0.0));
                Snake.turningRight = false;
                Snake.turnRightAnim = true;
            }
            else parts.splice (1, 0, new SnakeBody(0.0, 0.0));
            
            if (Snake.eating === true) {
                Snake.eating = false;
                Snake.eatAnim = true;
            }
                
            parts[1].model = parts[0].model;
            parts[1].normal = parts[0].normal;
            len += 1;
            
            if (!Snake.eatAnim) {
                parts.splice (len - 2, 1);
                len -= 1;
            }
        }
        
        if (Snake.turnLeftAnim) {
            var mat = mult (rotateY (-90 / Snake.slices),
                            translate (0.0, 0.0, 1.0 / Snake.slices));
            parts[0].model = mult(parts[0].model, mat);
        }
        else if (Snake.turnRightAnim) {
            var mat = mult (rotateY (90 / Snake.slices),
                            translate (0.0, 0.0, 1.0 / Snake.slices));
            parts[0].model = mult(parts[0].model, mat);
        }
        else {
            var mat = translate (0.0, 0.0, 1.0 / Snake.slices);
            parts[0].model = mult(parts[0].model, mat);
        }
        
        if (!Snake.eatAnim) {
            if (parts[len - 2] instanceof SnakeLeftBody) {
                var mat = mult (rotateY (-90 / Snake.slices),
                                translate (0.0, 0.0, 1.0 / Snake.slices));
                parts[len - 1].model = mult(parts[len - 1].model, mat);
            }
            else if (parts[len - 2] instanceof SnakeRightBody) {
                var mat = mult (rotateY (90 / Snake.slices),
                                translate (0.0, 0.0, 1.0 / Snake.slices));
                parts[len - 1].model = mult(parts[len - 1].model, mat);
            }
            else {
                var mat = translate (0.0, 0.0, 1.0 / Snake.slices);
                parts[len - 1].model = mult(parts[len - 1].model, mat);
            }
        }
        
        parts[0].modelNorm = normalMatrix(parts[0].model, false);
        parts[len - 1].modelNorm = normalMatrix(parts[len - 1].model, 0);
        
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
            else if (i === parts.length -2) {
                if (Snake.eatAnim) c = parts[i].indices (Snake.slices, Snake.slices);
                else c = parts[i].indices (Snake.step, Snake.slices);
            }
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
    
    Snake.eating = false;
    Snake.turningLeft = false;
    Snake.turningRight = false;
    
    Snake.eatAnim = false;
    Snake.turnLeftAnim = false;
    Snake.turnRightAnim = false;
}