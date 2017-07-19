function Bonus(tranX, tranZ) {
    this.model = translate(tranX, Bonus.radius, tranZ);
    this.modelNorm = normalMatrix(this.model, false);

    var obst = mult(this.model, vec4(0.0, 0.0, 0.0, 1.0));
    this.obstacle = vec3(obst[0], obst[1], obst[2]);
    
    this.spotPosition = vec4 (mult (this.model, vec4 (0.0, 3.0, 0.0, 1.0)));
    this.spotDirection = vec4 (0.0, 1.0, 0.0, 1.0);
    this.spotCutoff = 10.0;

    this.vertices = function () { return Bonus.vertices; };
    this.normals = function () { return Bonus.normals; };
    this.texCoords = function () { return Bonus.texCoords; };
    this.indices = function () { return Bonus.indices; };
    this.texture = function () { return Bonus.texture; };
    
    this.move = function () {
        this.model = mult (this.model, rotateY (1.0));
        this.modelNorm = normalMatrix(this.model, false);
        
        var snake = objects['snake'];

        var parts = snake.parts();
        var x1 = parts[0].model[0][3];
        var x2 = this.model[0][3];
        var y1 = parts[0].model[2][3];
        var y2 = this.model[2][3];
        
        var x = this.model[0][3], z = this.model[2][3];
        if (Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)) < Bonus.radius) {
            audioEat.pause();
            audioEat.play();
            Bonus.points += 1;
            pointsLabel.innerHTML = "Points : " + Bonus.points.toString();

            if (Bonus.points === Bonus.winPoints) {
                winner = true;
		return;
            }
            
            var row = Math.floor(this.model[0][3]) + World.height / 2;
            var col = Math.floor(this.model[2][3]) + World.width / 2;
            Map.matrix[row][col] = '0';
            
            do {
                x = Math.floor((Math.random() * (World.height - 1))) - (World.height / 2 - 0.5);
                z = Math.floor((Math.random() * (World.width - 1))) - (World.width / 2 - 0.5);
            }
            while (Map.matrix[Math.floor(x) + World.height / 2][Math.floor(z) + World.width / 2] !== '0');

            this.model[0][3] = x;
            this.model[2][3] = z;
            
            this.spotPosition = vec4 (mult (this.model, vec4 (0.0, 3.0, 0.0, 1.0)));
            Snake.eating = true;
        }
        Map.matrix[Math.floor(x) + World.height / 2][Math.floor(z) + World.width / 2] = 'b';
    };
}

function configureBonus(radius, slices, texture) {
    var vertices = [];
    var normals = [];
    var texCoords = [];
    var indices = [];

    for (var i = 0; i < slices; i++) {
        var angle1 = Math.PI - (i * Math.PI / slices);
        var nextAngle1 = Math.PI - ((i + 1) * Math.PI / slices);

        for (var j = 0; j <= slices; j++) {
            var angle2 = j * 2 * Math.PI / slices;

            var x1 = radius * Math.sin(angle1) * Math.cos(angle2);
            var y1 = radius * Math.sin(angle1) * Math.sin(angle2);
            var z1 = radius * Math.cos(angle1);

            var x2 = radius * Math.sin(nextAngle1) * Math.cos(angle2);
            var y2 = radius * Math.sin(nextAngle1) * Math.sin(angle2);
            var z2 = radius * Math.cos(nextAngle1);

            var v1 = vec4(x1, y1, z1, 1.0);
            var v2 = vec4(x2, y2, z2, 1.0);

            var n1 = vec4(x1 / radius, y1 / radius, z1 / radius, 1.0);
            var n2 = vec4(x2 / radius, y2 / radius, z2 / radius, 1.0);

            var c1 = vec2(j / slices, i / slices);
            var c2 = vec2(j / slices, (i + 1) / slices);

            var verts = [], norms = [], coords = [];

            if (j === 0) {
                verts.push(v1);
                norms.push(n1);
                coords.push(c1);
            }

            verts.push(v1);
            norms.push(n1);
            coords.push(c1);

            verts.push(v2);
            norms.push(n2);
            coords.push(c2);

            if (j === slices) {
                verts.push(v2);
                norms.push(n2);
                coords.push(c2);
            }

            for (var k = 0; k < verts.length; k++) {
                var ind = -1;
                for (var z = 0; z < vertices.length; z++) {
                    if (verts[k][0] === vertices[z][0] &&
                            verts[k][1] === vertices[z][1] &&
                            verts[k][2] === vertices[z][2]) {
                        if (coords[k][0] === texCoords[z][0] &&
                                coords[k][1] === texCoords[z][1]) {
                            ind = z;
                            break;
                        }
                    }
                }
                if (ind !== -1)
                    indices.push(ind);
                else {
                    indices.push(vertices.length);
                    vertices.push(verts[k]);
                    normals.push(norms[k]);
                    texCoords.push(coords[k]);
                }
            }
        }
    }
    indices = new Uint16Array(indices);

    Bonus.points = 0;
    Bonus.winPoints = 200;

    Bonus.radius = radius;
    Bonus.slices = slices;
    Bonus.texture = texture;

    Bonus.vertices = vertices;
    Bonus.normals = normals;
    Bonus.texCoords = texCoords;
    Bonus.indices = indices;
}
