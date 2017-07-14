function configureButtons(document, gl, program) {
    var dirOnLoc = gl.getUniformLocation(program, "dirOn");
    var posOnLoc = gl.getUniformLocation(program, "posOn");
    var spotOnLoc = gl.getUniformLocation(program, "spotOn");
    var texOnLoc = gl.getUniformLocation(program, "texOn");

    /*document.getElementById("ButtonDir").onclick = function () {
        var flag = gl.getUniform(program, dirOnLoc);
        gl.uniform1f(dirOnLoc, !flag);
    };

    document.getElementById("ButtonPos").onclick = function () {
        var flag = gl.getUniform(program, posOnLoc);
        gl.uniform1f(posOnLoc, !flag);
    };

    document.getElementById("ButtonSpot").onclick = function () {
        var flag = gl.getUniform(program, spotOnLoc);
        gl.uniform1f(spotOnLoc, !flag);
    };

    document.getElementById("ButtonTex").onclick = function () {
        var flag = gl.getUniform(program, texOnLoc);
        gl.uniform1f(texOnLoc, !flag);
    };*/

    document.onkeydown = document.onkeyup = function (e) {
        e = e || window.event;
        if (Object.keys(keys).indexOf(e.keyCode.toString()) == -1) return;
        keys[e.keyCode] = e.type == 'keydown';
    };
    
    document.onkeypress = function(e){
        e = e || window.event;
        var code = e.keyCode;
        if(code === 39) { // N
            if (!Snake.turningRight){
                Snake.turningLeft = true;}
            return
        }
        if (code === 37) { // M
            if (!Snake.turningLeft)
                Snake.turningRight = true;
            return;
        }
    };

    gl.uniform1f(dirOnLoc, 1.0);
    gl.uniform1f(posOnLoc, 1.0);
    gl.uniform1f(spotOnLoc, 1.0);
    gl.uniform1f(texOnLoc, 1.0);
}