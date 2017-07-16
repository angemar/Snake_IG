function Sky () {
    this.model = translate(0.0, 0.0, 0.0);
    this.modelNorm = normalMatrix(this.model, false);

    var obst = mult(this.model, vec4(0.0, 0.0, 0.0, 1.0));
    this.obstacle = vec3(obst[0], obst[1], obst[2]);
    
    this.slices = function () { return Sky.slices; };
    this.vertices = function () { return Sky.vertices; };
    this.normals = function () { return Sky.normals; };
    this.texCoords = function () { return Sky.texCoords; };
    this.texture = function () { return Sky.texture; };
    this.indices = function () { return Sky.indices; };
}

function configureSky (radius, height, slices, texture) {
    var vertices = [];
    var normals = [];
    var texCoords = [];
    var indices = [];
    
    var bottom = -height / 2, top = height / 2;

    for (var i = 0; i <= slices; i++) {
        var angle = i * 2 * Math.PI / slices;
        var x = radius * Math.cos(angle);
        var z = radius * Math.sin(angle);

        var sideNorm = vec4(-Math.cos(angle), 0.0, -Math.sin(angle), 1.0);

        var v1 = vec4(x, bottom, z, 1.0);
        var v2 = vec4(x, top, z, 1.0);

        var n1 = sideNorm;
        var n2 = sideNorm;

        var c1 = vec2 (-i / (slices / 5), 1.0);
        var c2 = vec2 (-i / (slices / 5), 0.0);

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
    
    Sky.radius = radius;
    Sky.height = height;
    Sky.slices = slices;
    Sky.texture = texture;

    Sky.vertices = vertices;
    Sky.normals = normals;
    Sky.texCoords = texCoords;
    Sky.indices = indices;
}