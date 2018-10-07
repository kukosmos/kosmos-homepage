var scene, camera, orbitControl, renderer, canvas;

var keys = { LEFT: false, RIGHT: false };
var lastFrame = new Date().getTime();

var effect; // toon shading

var stats; //stat monitor

// objects
var torus;
var enemy = new Array();

// game play
var play = false;
var score = 0;
var life = 5;
var lifeMesh, scoreMesh;

// timer
var timer = function(){ setInterval(function(){ createEmeny() }, 1000); }

document.addEventListener('keydown', keyboadHandle);
document.addEventListener('keyup', keyboadHandle);

var loader = new THREE.FontLoader();
var font;

if (WEBGL.isWebGLAvailable()) {
    loader.load( 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/fonts/gentilis_regular.typeface.json', function ( _font ) {
        font = _font;
        init();
        animate();
    } );
} else {
    var warning = WEBGL.getWebGLErrorMessage();
    document.getElementById('myCanvas').appendChild(warning);
}

function init() {
    // Setup
    canvas = document.getElementById('myCanvas');

    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialis: true });
    renderer.setClearColor(0x000000);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap

    // Stats
    stats = new Stats();
    stats.showPanel(0);
    document.body.appendChild(stats.domElement);

    // Make and setup a camera.
    var aspect = canvas.width / canvas.height;
    camera = new THREE.PerspectiveCamera(40, aspect, 1, 2000);

    // orbitControls
    orbitControl = new THREE.OrbitControls(camera, renderer.domElement);
    orbitControl.enableKeys = false;
    camera.position.set(0, 300, 400);
    orbitControl.update();

    // Make a scene
    scene = new THREE.Scene();

    // Make ambiend light
    scene.add(new THREE.AmbientLight(0x222222));

    // Make directional light
    var directionalLight = new THREE.DirectionalLight(0xefefff, 2, 100);
    directionalLight.castShadow = true;
    directionalLight.position.set(-100, 100, -100);
    scene.add(directionalLight);

    /*
    var directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 5);
    scene.add(directionalLightHelper);
    */

    // Setup shadow property of directional light
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    var d = 300;
    directionalLight.shadow.camera.left = -d;
    directionalLight.shadow.camera.right = d;
    directionalLight.shadow.camera.top = d;
    directionalLight.shadow.camera.bottom = -d;

    // Make 250 radius ground with grid
    var groundGeometry = new THREE.CylinderBufferGeometry(250, 250, 0.1, 50);
    var groundMaterial = new THREE.MeshToonMaterial( { 
        color: 0x404040,
        reflectivity: 0,
        shininess: 16,
        specular: 0x111111
    } );
    var ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.position.y = 0.05;
    ground.receiveShadow = true;
    scene.add(ground);

    /*
    var groundGrid = new THREE.GridHelper(300, 30, 0x000000, 0x000000);
    groundGrid.position.y = 0.2;
    scene.add(groundGrid);
    */

    // Make torus
    var radius = 50;
    var tube = 3;
    var torusGeometry = new THREE.TorusBufferGeometry(radius, tube, 8, 30, Math.PI / 3);
    var torusMaterial = new THREE.MeshToonMaterial( {
        color: 0x990000,
        reflectivity: 16,
        shininess: 32,
        specular: 0x111111
    } );
    torus = new THREE.Mesh(torusGeometry, torusMaterial);
    torus.castShadow = true;
    torus.rotation.x += Math.PI / 2;
    torus.position.set(0, tube+0.5, 0);
    scene.add(torus);

    addLabel("How to play :", new THREE.Vector3( -180, 100, -200 ), 15, 0);
    addLabel("Block spheres by rotating the torus.", new THREE.Vector3( -180, 80, -200 ), 15, 0);
    addLabel("Move camera with mouse dragging and wheeling.", new THREE.Vector3( -180, 60, -200 ), 15, 0);
    addLabel("Rotate torus with A,D and arrow key.", new THREE.Vector3( -180, 40, -200 ), 15, 0);
    addLabel("Press Enter key to start.", new THREE.Vector3( -180, 20, -200 ), 15, 0);

    scoreMesh = addLabel("Score : " + score.toString(), new THREE.Vector3( 150, 20, -180 ), 20, -Math.PI / 6);
    lifeMesh = addLabel("Life : " + life.toString(), new THREE.Vector3( -280, 20, -150 ), 20, Math.PI / 6);

    effect = new THREE.OutlineEffect( renderer );
}

function addLabel( name, location, size, rotate ) {
    var textGeo = new THREE.TextBufferGeometry( name, {
        font: font,
        size: size,
        height: 5,
        curveSegments: 1
    });
    var textMaterial = new THREE.MeshBasicMaterial( { color: 0xffffff } );
    var textMesh = new THREE.Mesh( textGeo, textMaterial );
    textMesh.position.copy( location );
    textMesh.rotation.y += rotate;
    scene.add( textMesh );

    return textMesh;
}

function smoothUpdateTorus(deltaTime) {
    if (keys.LEFT)
        torus.rotation.z -= 0.008 * deltaTime;
    else if (keys.RIGHT)
        torus.rotation.z += 0.008 * deltaTime;
}

function smoothUpdateEnemy(deltaTime) {
    for(i = 0; i < enemy.length; i++){
        enemy[i].ENEMY.update(deltaTime);
        enemy[i].MESH.position.set(
            enemy[i].ENEMY.x, 
            5,
            enemy[i].ENEMY.z)
    }

}

function detectCollision() {
    for(i = 0; i < enemy.length; i++){
        if (enemy[i].ENEMY.enemyCollide(Math.PI / 6 - torus.rotation.z, Math.PI / 3 , 50)){
            score += 1;
            scene.remove(scoreMesh);
            scoreMesh = addLabel("Score : " + score.toString(), new THREE.Vector3( 150, 20, -180 ), 20, -Math.PI / 6);
        }
        if (enemy[i].ENEMY.end()){
            life -= 1;
            scene.remove(lifeMesh);
            lifeMesh = addLabel("Life : " + life.toString(), new THREE.Vector3( -280, 20, -150 ), 20, Math.PI / 6);
        }
    }
}

function handleCollision() {
    for(i = 0; i < enemy.length;){
        if(enemy[i].ENEMY.collide){
            scene.remove(enemy[i].MESH);
            enemy.splice(i, 1);
        }
        else
            i++;
    }
}

function createEmeny() {
    var sphereGeometry = new THREE.SphereBufferGeometry(5, 32, 16);
    var sphereMaterial = new THREE.MeshToonMaterial( {
        color: 0x009900,
        reflectivity: 16,
        shininess: 32,
        specular: 0x111111
    } );

    enemy.push({ 
        ENEMY: new Enemy( {
            defaultBoundary: 250,
            defaultSpeed: 0.18
        } ), 
        MESH: new  THREE.Mesh(sphereGeometry, sphereMaterial)
    });
    enemy[enemy.length - 1].MESH.position.set(
        enemy[enemy.length - 1].ENEMY.x,
        5,
        enemy[enemy.length - 1].ENEMY.z);
    
    enemy[enemy.length - 1].MESH.castShadow = true;
    scene.add(enemy[enemy.length - 1].MESH);
}

function keyboadHandle(event) {
    switch(event.type ){
        case "keydown":
            if ((event.code == "KeyA") || (event.code == "ArrowLeft"))
                keys.LEFT = true;
            else if ((event.code == "KeyD") || (event.code == "ArrowRight"))
                keys.RIGHT = true;
            else if (!play && (event.code == "Enter") || (event.code == "NumpadEnter")){
                play = true;
                timer();
            }
        break;

        case "keyup":
        if ((event.code == "KeyA") || (event.code == "ArrowLeft"))
            keys.LEFT = false;
        else if ((event.code == "KeyD") || (event.code == "ArrowRight"))
            keys.RIGHT = false;
        break;
    }
}

function resize() {
    var width = canvas.width;
	var height = canvas.height;
	if (canvas.width !== width || canvas.height !== height) {
		renderer.setSize(width, height, false);
		camera.aspect = width / height;
		camera.updateProjectionMatrix();
	}
}

function animate() {
    var currentFrame = new Date().getTime();
    var deltaTime = currentFrame - lastFrame;
    lastFrame = currentFrame;

    resize();
    
    detectCollision();
    handleCollision();

    smoothUpdateTorus(deltaTime);
    smoothUpdateEnemy(deltaTime);

    orbitControl.update();

    stats.begin();
    effect.render(scene, camera);
    stats.end();
    
    if(life!=0)
        requestAnimationFrame(animate);
    else
        alert("Game Over\n" + "Score : " + score.toString());
}