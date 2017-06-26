function configureButtons(document, gl, program) {
    var dirLightOnLoc = gl.getUniformLocation(program, "dirLightOn");
    var posLightOnLoc = gl.getUniformLocation(program, "posLightOn");
    var spotLightOnLoc = gl.getUniformLocation(program, "spotLightOn");
    var texOnLoc = gl.getUniformLocation(program, "texOn");

    document.getElementById("ButtonDir").onclick = function () {
        var flag = gl.getUniform(program, dirLightOnLoc);
        gl.uniform1f(dirLightOnLoc, !flag);
    };

    document.getElementById("ButtonPos").onclick = function () {
        var flag = gl.getUniform(program, posLightOnLoc);
        gl.uniform1f(posLightOnLoc, !flag);
    };

    document.getElementById("ButtonSpot").onclick = function () {
        var flag = gl.getUniform(program, spotLightOnLoc);
        gl.uniform1f(spotLightOnLoc, !flag);
    };

    document.getElementById("ButtonTex").onclick = function () {
        var flag = gl.getUniform(program, texOnLoc);
        gl.uniform1f(texOnLoc, !flag);
    };

    document.onkeydown = document.onkeyup = function (e) {
        e = e || window.event;
        if (Object.keys(keys).indexOf(e.keyCode.toString()) == -1) return;
        keys[e.keyCode] = e.type == 'keydown';
    };

    gl.uniform1f(dirLightOnLoc, 1.0);
    gl.uniform1f(posLightOnLoc, 1.0);
    gl.uniform1f(spotLightOnLoc, 1.0);

    gl.uniform1f(texOnLoc, 1.0);
}