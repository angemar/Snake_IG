function SnakeTail (tranX, tranZ) {
    this.model = translate(tranX, 0.0, tranZ);
    this.modelNorm = normalMatrix(this.model, false);

    var obst = mult(this.model, vec4(0.0, 0.0, 0.0, 1.0));
    this.obstacle = vec3(obst[0], obst[1], obst[2]);
    
    this.slices = function () { return SnakeTail.slices; };
    this.vertices = function () { return SnakeTail.vertices; };
    this.normals = function () { return SnakeTail.normals; };
    this.texCoords = function () { return SnakeTail.texCoords; };
    this.indices = function () { return SnakeTail.indices; };
    this.texture = function () { return SnakeTail.texture; };
    
    this.indices = function (begin, end) {
        var indices = SnakeTail.indices;
        var slices = this.slices ();
        var start = begin * indices.length / slices;
        var stop = end * indices.length / slices;
        return SnakeTail.indices.slice (start, stop);
    };
}

function configureSnakeTail (radius1, radius2, slices, texture) {
    var vertices = [];
    var normals = [];
    var texCoords = [];
    var indices = [];
    
    for (var i = 0; i < slices; i++) {
        var angle1 = Math.PI - (i * Math.PI / 2 / slices);
        var nextAngle1 = Math.PI - ((i + 1) * Math.PI / 2 / slices);
        
        for (var j = 0; j <= slices; j++) {
            var angle2 = j * Math.PI / slices;
            
            var x1 = radius1 * Math.sin (angle1) * Math.cos (angle2);
            var y1 = radius1 * Math.sin (angle1) * Math.sin (angle2);
            var z1 = radius2 * Math.cos (angle1);
            
            var x2 = radius1 * Math.sin (nextAngle1) * Math.cos (angle2);
            var y2 = radius1 * Math.sin (nextAngle1) * Math.sin (angle2);
            var z2 = radius2 * Math.cos (nextAngle1);
            
            var v1 = vec4 (x1, y1, z1 + 0.5, 1.0);
            var v2 = vec4 (x2, y2, z2 + 0.5, 1.0);
            
            var n1 = vec4 (x1, y1, z1, 1.0);
            var n2 = vec4 (x2, y2, z2, 1.0);
            
            var c1 = vec2 (-j / slices, -i / slices);
            var c2 = vec2 (-j / slices, -(i + 1) / slices);
            
            
            var verts = [], norms = [], coords = [];
            
            if (j === 0){
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
            
            if (j === slices){
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
    }
    indices = new Uint16Array(indices);
    
    SnakeTail.radius1 = radius1;
    SnakeTail.radius2 = radius2;
    SnakeTail.slices = slices;
    SnakeTail.texture = texture;

    SnakeTail.vertices = vertices;
    SnakeTail.normals = normals;
    SnakeTail.texCoords = texCoords;
    SnakeTail.indices = indices;
}