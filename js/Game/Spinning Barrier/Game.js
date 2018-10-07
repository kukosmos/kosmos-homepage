var scene, camera, control;
var renderer, canvas;

var keys = { LEFT: false, RIGHT: false };
var lastFrame = 0;

var effect; // toon shading

var stats;

// World coordinate
var world;

document.addEventListener('keydown', keyboadHandle);
document.addEventListener('keyup', keyboadHandle);

if (WEBGL.isWebGLAvailable()) {
    init();
    animate();
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
    camera = new THREE.PerspectiveCamera(60, aspect, 1, 2000);

    // Controls
    control = new THREE.OrbitControls(camera, renderer.domElement);
    control.enableKeys = false;
    camera.position.set(0, 120, 150);
    control.update();

    // Make a scene
    scene = new THREE.Scene();

    // Make ambiend light
    scene.add(new THREE.AmbientLight(0x222222));

    // Make point light
    /*
    var pointLight = new THREE.PointLight(0xefefff, 2, 800);
    pointLight.position.set(0, 30, 0);
    pointLight.castShadow = true;
    scene.add(pointLight);

    var pointLightHelper = new THREE.PointLightHelper( pointLight, 3 );
    scene.add( pointLightHelper );

    // Setup shadow property
    pointLight.shadow.mapSize.width = 512;
    pointLight.shadow.mapSize.height = 512;
    */

    // Make directional light
    var directionalLight = new THREE.DirectionalLight(0xefefff, 2, 100);
    directionalLight.castShadow = true;
    directionalLight.position.set(50, 50, 50);
    scene.add(directionalLight);

    var directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 5);
    scene.add(directionalLightHelper);

    // Setup shadow property of directional light
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    var d = 100;
    directionalLight.shadow.camera.left = -d;
    directionalLight.shadow.camera.right = d;
    directionalLight.shadow.camera.top = d;
    directionalLight.shadow.camera.bottom = -d;

    // For the world coordinate
    world = new THREE.Group();
    scene.add(world);

    // Make 200 * 200 ground
    var groundGeometry = new THREE.BoxBufferGeometry(200, 0.1, 200);
    var groundMaterial = new THREE.MeshToonMaterial( { 
        color: 0x404040,
        reflectivity: 0,
        shininess: 16,
        specular: 0x111111
    } );
    var ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.position.y = 0.01;
    ground.receiveShadow = true;
    scene.add(ground);

    // Make torus
    var radius = 40;
    var tube = 3;
    var torusGeometry = new THREE.TorusBufferGeometry(radius, tube, 8, 6, Math.PI / 3);
    var torusMaterial = new THREE.MeshToonMaterial( {
        color: 0x990000,
        reflectivity: 16,
        shininess: 32,
        specular: 0x111111
    } );
    var torus = new THREE.Mesh(torusGeometry, torusMaterial);
    torus.castShadow = true;
    torus.rotation.x += Math.PI / 2;
    torus.position.set(0, tube + 2, 0);
    world.add(torus);

    // Make sphere
    var sphereGeometry = new THREE.SphereBufferGeometry(5, 32, 16);
    var sphereMaterial = new THREE.MeshToonMaterial( {
        color: 0x009900,
        reflectivity: 16,
        shininess: 32,
        specular: 0x111111
    } );
    var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.y = 5;
    sphere.castShadow = true;
    scene.add(sphere);

    effect = new THREE.OutlineEffect( renderer );
}

function smoothUpdate(deltaTime) {
    if (keys.LEFT)
        world.rotation.y -= 0.005 * deltaTime;
    else if (keys.RIGHT)
        world.rotation.y += 0.005 * deltaTime;
}

function keyboadHandle(event) {
    switch(event.type ){
        case "keydown":
            if (event.code == "KeyA")
                keys.LEFT = true;
            else if (event.code == "KeyD")
                keys.RIGHT = true;
        break;

        case "keyup":
        if (event.code == "KeyA")
            keys.LEFT = false;
        else if (event.code == "KeyD")
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
    var deltaTime = lastFrame - currentFrame;
    lastFrame = currentFrame;

    resize();
    smoothUpdate(deltaTime);
    control.update();

    stats.begin();
    effect.render(scene, camera);
    stats.end();

    requestAnimationFrame(animate);

}