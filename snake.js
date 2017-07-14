function Snake () {
    this.model = translate (0.0, 0.0, 0.0);
    this.modelNorm = this.model;
    var obst = mult(this.model, vec4(0.0, 0.0, 0.0, 1.0));
    this.obstacle = vec3(obst[0], obst[1], obst[2]);
    
    this.headMat;
    this.tailMat;
    
    this.vertices = function () { return Snake.vertices; };
    this.normals = function () { return Snake.normals; };
    this.texCoords = function () { return Snake.texCoords; };
    this.indices = function () { return Snake.indices; };
    this.parts = function () { return Snake.parts; };
    this.texture = function () { return Snake.texture; };
    
    this.move = function () {
        var parts = Snake.parts;
        var len = parts.length;
        /*
        for(var i=0; i<len; i++)
            matrix[Math.floor(parts[i].model[0][3])+15][Math.floor(parts[i].model[2][3])+15]='0';
        */
        if (Snake.step === 0) {
            console.log (parts[0].model[0][3]);
            console.log (parts[0].model[2][3] + '\n');
            Snake.turnLeftAnim = false;
            Snake.turnRightAnim = false;
            Snake.eatAnim = false;
            
            if (Snake.turningLeft) {
                parts.splice (1, 0, new SnakeLeftBody(0.0, 0.0));
                this.headMat = parts[0].model;
                Snake.turningLeft = false;
                Snake.turnLeftAnim = true;
            }
            else if (Snake.turningRight) {
                parts.splice (1, 0, new SnakeRightBody(0.0, 0.0));
                this.headMat = parts[0].model;
                this.tailMat = parts[parts.length - 2].model;
                Snake.turningRight = false;
                Snake.turnRightAnim = true;
            }
            else parts.splice (1, 0, new SnakeBody(0.0, 0.0));
            
            if (Snake.eating === true) {
                Snake.eating = false;
                Snake.eatAnim = true;
            }
                
            parts[1].model = parts[0].model;
            parts[1].modelNorm = parts[0].modelNorm;
            len += 1;
            
            if (!Snake.eatAnim) {
                parts.splice (len - 2, 1);
                len -= 1;
            }
            
            this.tailMat = null;
        }
        
        if (Snake.turnLeftAnim) {
            var tran = mult (this.headMat, vec4 (Snake.step / Snake.slices, 0.0, 0.0, 1.0));
            parts[0].model = mult(parts[0].model, rotateY (-90 / Snake.slices));
            parts[0].model[0][3] = tran[0];
            parts[0].model[2][3] = tran[2];
        }
        else if (Snake.turnRightAnim) {
            var tran = mult (this.headMat, vec4 (-Snake.step / Snake.slices, 0.0, 0.0, 1.0));
            parts[0].model = mult(parts[0].model, rotateY (90 / Snake.slices));
            parts[0].model[0][3] = tran[0];
            parts[0].model[2][3] = tran[2];
        }
        else parts[0].model = mult (parts[0].model, translate (0.0, 0.0, 1.0 / Snake.slices));
        
        if (!Snake.eatAnim) {
            var l = len -1;
            if (parts[l - 1] instanceof SnakeLeftBody) {
                if (this.tailMat === null) this.tailMat = parts[l].model;
                var tran = mult (this.tailMat,
                                 vec4 (0.0, 0.0, Snake.step / Snake.slices, 1.0));
                parts[l].model = mult(parts[l].model, rotateY (-90 / Snake.slices));
                parts[l].model[0][3] = tran[0];
                parts[l].model[2][3] = tran[2];
            }
            else if (parts[l - 1] instanceof SnakeRightBody) {
                if (this.tailMat === null) this.tailMat = parts[l].model;
                var tran = mult (this.tailMat,
                                 vec4 (0.0, 0.0, Snake.step / Snake.slices, 1.0));
                parts[l].model = mult(parts[l].model, rotateY (90 / Snake.slices));
                parts[l].model[0][3] = tran[0];
                parts[l].model[2][3] = tran[2];
            }
            else parts[l].model = mult (parts[len - 1].model,
                                        translate (0.0, 0.0, 1.0 / Snake.slices));
        }
        
        parts[0].modelNorm = normalMatrix(parts[0].model, false);
        parts[len - 1].modelNorm = normalMatrix(parts[len - 1].model, 0);
        
        var vertices = [];
        var normals = [];
        var texCoords = [];
        var indices = [];
        
        var bodyChanged = false;
        var leftBodyChanged = false;
        var rightBodyChanged = false;
        
        var tot = 0;
        for (var i = 0; i < len; i++) {
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
                
                if (parts[i] instanceof SnakeBody && !bodyChanged ||
                    parts[i] instanceof SnakeLeftBody && !leftBodyChanged ||
                    parts[i] instanceof SnakeRightBody && !rightBodyChanged)
                    t[j][1] += 1.0 / Snake.slices;
                
                texCoords.push (t[j]);
            }
            
            if (parts[i] instanceof SnakeBody) bodyChanged = true;
            else if (parts[i] instanceof SnakeLeftBody) leftBodyChanged = true;
            else if (parts[i] instanceof SnakeRightBody) rightBodyChanged = true;
            
            for (var k = 0; k < c.length; k++) indices.push (c[k] + tot);

            tot += v.length;
        }
        indices = new Uint16Array(indices);

        Snake.vertices = vertices;
        Snake.normals = normals;
        Snake.texCoords = texCoords;
        Snake.indices = indices;
        /*
        matrix[Math.floor(parts[0].model[0][3])+15][Math.floor(parts[0].model[2][3])+15]='h';
        for(var i=2; i<len; i++){
            matrix[Math.floor(parts[i].model[0][3])+15][Math.floor(parts[i].model[2][3])+15]='s';
        }
        
        
        if(matrix[Math.floor(parts[0].model[0][3])+15][Math.floor(parts[0].model[2][3])+15] === 's' ||
                Math.floor(parts[0].model[0][3]) +15 < 0 ||
                Math.floor(parts[0].model[0][3])+15 > width-1 ||
                Math.floor(parts[0].model[2][3])+15 < 0 ||
                Math.floor(parts[0].model[2][3])+15 > height-1) {
            alert("Game Over! Press OK to restart the game!");
            configureSnake(20, this.texture());
            objects['snake'][0] = new Snake();
        }*/
        
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