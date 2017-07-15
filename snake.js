function Snake () {
    this.model = translate (0.0, 0.0, 0.0);
    this.modelNorm = this.model;
    var obst = mult(Snake.parts[0].model, vec4(0.0, 0.0, 0.0, 1.0));
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
        
        for(var i = 0; i < len; i++) {
            var row = Math.floor(parts[i].model[0][3])+ World.height / 2;
            var col = Math.floor(parts[i].model[2][3])+ World.width / 2;
            matrix[row][col]='0';
        }
       
        if (Snake.step === 0) {
            Snake.turnLeftAnim = false;
            Snake.turnRightAnim = false;
            Snake.eatAnim = false;
            
            var x = parts[0].model[0][3];
            var z = parts[0].model[2][3];
            x = Math.floor(x) + 0.5;
            z = Math.floor(z) + 0.5;
            parts[0].model[0][3] = x;
            parts[0].model[2][3] = z;
            
            x = parts[len - 1].model[0][3];
            z = parts[len - 1].model[2][3];
            x = Math.floor(x) + 0.5;
            z = Math.floor(z) + 0.5;
            parts[len - 1].model[0][3] = x;
            parts[len - 1].model[2][3] = z;
            
            
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
            
            //Rotation Minimap
            if(Snake.step === Snake.slices-1){
                ctx.clearRect(0, 0, canvas1.width, canvas1.height);
                ctx.translate(canvas1.width / 2, canvas1.height / 2);
                ctx.rotate(Math.PI/2);
                ctx.translate(-canvas1.width / 2, -canvas1.height / 2);
                ctx.restore();
            }
        }
        else if (Snake.turnRightAnim) {
            var tran = mult (this.headMat, vec4 (-Snake.step / Snake.slices, 0.0, 0.0, 1.0));
            parts[0].model = mult(parts[0].model, rotateY (90 / Snake.slices));
            parts[0].model[0][3] = tran[0];
            parts[0].model[2][3] = tran[2];
            
            //Rotation Minimap
            if(Snake.step === Snake.slices-1){
                ctx.clearRect(0, 0, canvas1.width, canvas1.height);
                ctx.translate(canvas1.width / 2, canvas1.height / 2);
                ctx.rotate(-Math.PI/2);
                ctx.translate(-canvas1.width / 2, -canvas1.height / 2);
                ctx.restore();
            }
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
        
        var eye = mult (parts[0].model, vec4 (0.0, 3.0, -5.0, 1.0));
        var at = mult (parts[0].model, vec4 (0.0, 1.0, 0.0, 1.0));
        this.eye = vec3 (eye[0], eye[1], eye[2]);
        this.at = vec3 (at[0], at[1], at[2]);
        this.up = vec3 (0.0, 1.0, 0.0);
        
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
        
        if(Math.floor(parts[0].model[0][3]) + World.height / 2 < 0 ||
           Math.floor(parts[0].model[0][3])+ World.height / 2 > World.width - 1 ||
           Math.floor(parts[0].model[2][3])+ World.height / 2 < 0 ||
           Math.floor(parts[0].model[2][3])+ World.height / 2 > World.height - 1) {
                alert("GAME OVER!\nPress OK to restart the game!");
                window.location.reload(false); 
        }
        
        var row = Math.floor(parts[0].model[0][3]) + World.height / 2;
        var col = Math.floor(parts[0].model[2][3])+ World.width / 2;
        matrix[row][col] = 'h';
        
        row = Math.floor(parts[1].model[0][3]) + World.height / 2;
        col = Math.floor(parts[1].model[2][3]) + World.width / 2;
        matrix[row][col] = 'h1';
        
        for(var i=2; i<len; i++){
            var row = Math.floor(parts[i].model[0][3]) + World.height / 2;
            var col = Math.floor(parts[i].model[2][3]) + World.width / 2;
            matrix[row][col] = 's';
        }
        
        row = Math.floor(parts[0].model[0][3])+ World.height / 2;
        col = Math.floor(parts[0].model[2][3])+ World.width / 2;
        if(matrix[row][col] === 's'){
            alert("GAME OVER!\nPress OK to restart the game!");
            window.location.reload(false); 
        }
        
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
