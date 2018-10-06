var scene, camera, control;
var renderer, canvas;

if (WEBGL.isWebGLAvailable()) {
    init();
    animate();
} else {
    var warning = WEBGL.getWebGLErrorMessage();
    document.getElementById('canvas').appendChild(warning);
}

function init() {

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
    resize();

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}