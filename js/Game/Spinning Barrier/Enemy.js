/**
 * Emeny object
*
*
*
*   Usage
*   new Enemy( {
*       defaultBoundary: 50
*       defaultSpeed: 0.1
*   })
*
*/

 var Enemy = function(parameters) {
    
    this.collide = false;
    this.x = this.z = 0;
    this.update = update;
    this.end = function() { if (defaultBoundary <= 0) return (this.collide = true); return false; }

    parameters = parameters || {};

    var defaultBoundary = parameters.defaultBoundary !== undefined ? parameters.defaultBoundary : 80;
    var defaultSpeed = parameters.defaultSpeed !== undefined ? parameters.defaultSpeed : 0.05;
    
    //zx coordinate
    var angle = 2 * Math.PI * Math.random(); //0 ~ 2pi
    var normalZ = Math.cos(angle)
    var normalX = Math.sin(angle);

    update(0);

    function update(deltaTime) {
        defaultBoundary -= defaultSpeed * deltaTime;
        this.x = defaultBoundary * normalX;
        this.z = defaultBoundary * normalZ;
    }

    this.enemyCollide = function(torusBegin, torusArc, torusRadius) {
        var angleBegin = torusBegin % (2 * Math.PI);
        if( angleBegin < 0 && -torusBegin > torusArc)
            angleBegin += 2 * Math.PI;
        var angleEnd = torusBegin + torusArc;

        console.log(angleBegin);
        if(!this.collide && 
            (torusRadius-10 < defaultBoundary) && (defaultBoundary < torusRadius+10) &&
            (angleBegin < angle) && (angle < angleEnd))
                return (this.collide = true);
        return false;
    }
 }