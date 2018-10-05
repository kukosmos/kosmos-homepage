var camera, scene, renderer;

if (WEBGL.isWebGLAvailable()) {
    init();
    animate();
} else {
    var warning = WEBGL.getWebGLErrorMessage();
    document.getElementById('canvas').appendChild(warning);
}

function init() {
    // Setup
    var canvas = document.getElementById('myCanvas');
    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialis: true });
    renderer.setClearColor(0x999999);

    // Make and setup a camera.
    var aspect = canvas.width / canvas.height;
    camera = new THREE.PerspectiveCamera(75, aspect, 1, 2000);
    camera.position.y = 400;
    // Make a scene
    scene = new THREE.Scene();

    // Make lights
    var Ambientlight = new THREE.AmbientLight(0xffffff, 0.5);
    Ambientlight.position.set(0, 0, 0);
    scene.add(Ambientlight);
 
    var PointLight = new THREE.PointLight(0xffffff, 0.5);
    PointLight.position.set(0, 0, 0);
    scene.add(PointLight);

    // Make objects
    var geometry = new THREE.PlaneGeometry( 500, 500 );
    var material = new THREE.MeshBasicMaterial( { color: 0xffffff , side: THREE.DoubleSide } );
    var Table = new THREE.Mesh(geometry, material);
    Table.position.set(0, 250, -2);

    var girdTable = new THREE.GridHelper(500, 10, 0x000000, 0x000000 );
    girdTable.rotation.x += Math.PI / 2;
    girdTable.position.set(0, 250, 0);

    geometry = new THREE.PlaneGeometry( 2000, 2000 );
    material = new THREE.MeshBasicMaterial( { color: 0xffffff, side: THREE.DoubleSide } );
    var Floor = new THREE.Mesh(geometry, material);
    Floor.rotation.x += Math.PI / 2;
    Floor.position.y -= 2;

    var gridFloor = new THREE.GridHelper( 2000, 40, 0x000000, 0x000000 );
    
    var group = new THREE.Group();

    group.add(Table);
    group.add(girdTable);
    group.add(Floor);
    group.add(gridFloor);

    group.position.set(0, 0, -1000);
    scene.add(group);
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
    //resize();

    //mesh.rotation.x += 0.01;
    //mesh.rotation.y += 0.01;
    //mesh.rotation.z += 0.01;
    //gridHelper.rotation.z += 0.01;

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}