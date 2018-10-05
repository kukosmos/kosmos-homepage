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
    renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('canvas'), antialis: true });
    renderer.setClearColor(0x000000);

    // Make and setup a camera.
    var aspect = window.innerWidth / window.innerHeight;
    camera = new THREE.PerspectiveCamera(75, aspect, 1, 1000);
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
    var material = new THREE.MeshBasicMaterial( { color: 0x1f1f1f , side: THREE.DoubleSide } );
    var mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(0, 250, 0);

    var girdTable = new THREE.GridHelper(500, 10, 0xffffff );
    girdTable.rotation.x = -Math.PI / 2;
    girdTable.position.set(0, 250, 0);
   
    var gridFloor = new THREE.GridHelper(2000, 40, 0xffffff);
    
    var group = new THREE.Group();

    group.add(mesh);
    group.add(girdTable);
    group.add(gridFloor);

    group.position.set(0, 0, -500);
    scene.add(group);
    console.log(scene.position);
}

function resize() {
    var width = renderer.domElement.clientWidth;
	var height = renderer.domElement.clientHeight;
	if (renderer.domElement.width !== width || renderer.domElement.height !== height) {
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