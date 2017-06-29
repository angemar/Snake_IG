function SnakeBody (tranX, tranZ) {
    this.model = translate(tranX, 0.0, tranZ);
    this.modelNorm = normalMatrix(this.model, false);

    var obst = mult(this.model, vec4(0.0, 0.0, 0.0, 1.0));
    this.obstacle = vec3(obst[0], obst[1], obst[2]);
}

function configureSnakeBody (radius, height, slices, texture) {
    var vertices = [];
    var normals = [];
    var texCoords = [];
    var indices = [];

    var bottom = -height / 2.0, top = height / 2.0;
    
    for (var i = 0; i <= slices; i++) {
        var angle = i * Math.PI / slices;
        var nextAngle = (i + 1) * Math.PI / slices;
        var x = radius * Math.cos(angle);
        var y = radius * Math.sin(angle);

        var midAngle = (angle + nextAngle) / 2;
        var sideNorm = vec4(Math.cos(midAngle), Math.sin(midAngle), 0.0, 1.0);
        
        var v1 = vec4(x, y, bottom, 1.0);
        var v2 = vec4(x, y, top, 1.0);
        
        var n1 = sideNorm;
        var n2 = sideNorm;
        
        var c1 = vec2 (-i / slices, 1.0);
        var c2 = vec2 (-i / slices, 0.0);
        
        var verts = [], norms = [], coords = [];

        if (i === 0){
            verts.push (v1);
            norms.push (n1);
            coords.push (c1);
        }

        verts.push (v1);
        norms.push (n1);
        coords.push (c1);

        verts.push (v2);
        norms.push (n2);
        coords.push (c2);

        if (i === slices){
            verts.push (v2);
            norms.push (n2);
            coords.push (c2);
        }

        for (var k = 0; k < verts.length; k ++) {
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
            if (ind !== -1) indices.push (ind);
            else {
                indices.push (vertices.length);
                vertices.push (verts[k]);
                normals.push (norms[k]);
                texCoords.push (coords[k]);
            }
        }
    }
    indices = new Uint16Array(indices);
    
    SnakeBody.radius = radius;
    SnakeBody.height = height;
    SnakeBody.slices = slices;
    SnakeBody.texture = texture;

    SnakeBody.vertices = vertices;
    SnakeBody.normals = normals;
    SnakeBody.texCoords = texCoords;
    SnakeBody.indices = indices;
    
    SnakeBody.prototype.vertices = function () { return SnakeBody.vertices; };
    SnakeBody.prototype.normals = function () { return SnakeBody.normals; };
    SnakeBody.prototype.texCoords = function () { return SnakeBody.texCoords; };
    SnakeBody.prototype.indices = function () { return SnakeBody.indices; };
    SnakeBody.prototype.texture = function () { return SnakeBody.texture; };

    SnakeBody.prototype.collide = function (cylinder, other) {
        var dist = subtract(cylinder.obstacle, other);
        var distance = Math.sqrt(Math.pow(dist[0], 2) + Math.pow(dist[2], 2));
        if (distance <= SnakeBody.radius + SnakeBody.radius * 0.5)
            return normalize(dist);
        else
            return vec3(0.0, 0.0, 0.0);
    };
}