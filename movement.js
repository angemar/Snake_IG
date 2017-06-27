function move(keys, keysKeys) {
    var moving = false;
    for (var i = 0; i < keysKeys.length; i++) {
        if (keys[keysKeys[i]]) {
            moving = true;
            break;
        }
    }
    if (!moving) return;
    
    var frontDir = vec3 (normalize (subtract (vec3 (at[0], eye[1], at[2]), eye)));
    var sideDir = vec3 (normalize (cross (up, frontDir)));
    var cannotMoveDirs = [];
    var frontMove = vec3 (0.0, 0.0, 0.0);
    var sideMove =  vec3 (0.0, 0.0, 0.0);
    for (var i = 0; i < 3; i++) {
        frontMove[i] = frontDir[i] / 10.0;
        sideMove[i] = sideDir[i] / 10.0;
    }
    var origin = vec3 (0.0, 0.0, 0.0);
    for (var j = 0; j < objects['body'].length; j++) {
        var obj = objects['body'][j];
        var collide = SnakeBody.prototype.collide (obj, eye);
        if (!equal(collide, origin)) cannotMoveDirs.push (collide);
    }
    
    if (keys['87']) {
        // W key
        var canGoFront = true;
        for (var i = 0; i < cannotMoveDirs.length; i++)
            if (dot (frontDir, cannotMoveDirs[i]) >= 0.35)
                canGoFront = false;
        if (canGoFront) eye = add (eye, frontMove);
    }
    if (keys['68']) {
        // D key
        var canGoRight = true;
        for (var i = 0; i < cannotMoveDirs.length; i++)
            if (dot (negate(sideDir), cannotMoveDirs[i]) >= 0.35)
                canGoRight = false;
        if (canGoRight) eye = subtract (eye, sideMove);
    }
    if (keys['83']) {
        // S key
        var canGoBack = true;
        for (var i = 0; i < cannotMoveDirs.length; i++)
            if (dot (negate(frontDir), cannotMoveDirs[i]) >= 0.35)
                canGoBack = false;
        if (canGoBack) eye = subtract (eye, frontMove);
    }
    if (keys['65']) {
        // A key
        var canGoLeft = true;
        for (var i = 0; i < cannotMoveDirs.length; i++)
            if (dot (sideDir, cannotMoveDirs[i]) >= 0.35)
                canGoLeft = false;
        if (canGoLeft) eye = add (eye, sideMove);
    }
    if (keys['38'] && pitch < Math.PI / 4.0) {
        // Up Arrow
        pitch += 1.0 * Math.PI / 180.0;
    }
    if (keys['39']) {
        // Right Arrow
        yaw += 1.0 * Math.PI / 180.0;
    }
    if (keys['40'] && pitch > -Math.PI / 4.0) {
        // Down Arrow
        pitch -= 1.0 * Math.PI / 180.0;
    }
    if (keys['37']) { // Left Arrow
        yaw -= 1.0 * Math.PI / 180.0;
    }
    var newAt = [0.0, 0.0, 0.0];
    newAt[0] = -Math.sin (yaw) * Math.cos (pitch);
    newAt[1] = Math.sin (pitch);
    newAt[2] = Math.cos (pitch) * Math.cos (yaw);
    for (var i = 0; i < 3; i++) at[i] = eye[i] + newAt[i];
    for (var i = 0; i < 3; i++) spotPosition[i] = eye[i];
    for (var i = 0; i < 3; i++) spotDirection[i] = -newAt[i];
    view = lookAt(eye, at, up);
    viewNorm = normalMatrix (view, false);
}