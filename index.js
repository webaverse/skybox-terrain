import * as THREE from 'three';
// import {BufferGeometryUtils} from 'BufferGeometryUtils';
import {scene, renderer, camera, runtime, world, physics, ui, app, appManager} from 'app';
import {Sky} from './Sky.js';

const localVector = new THREE.Vector3();
const localVector2 = new THREE.Vector3();
const localVector3 = new THREE.Vector3();
const localQuaternion = new THREE.Quaternion();
const localEuler = new THREE.Euler();
const localMatrix = new THREE.Matrix4();
const localRaycaster = new THREE.Raycaster();
const localRay = new THREE.Ray();
const localColor = new THREE.Color();
const localColor2 = new THREE.Color();

const effectController = {
  turbidity: 2,
  rayleigh: 3,
  mieCoefficient: 0.2,
  mieDirectionalG: 0.9999,
  inclination: 0, // elevation / inclination
  azimuth: 0, // Facing front,
  // exposure: renderer.toneMappingExposure
};
const sun = new THREE.Vector3();
function update() {
  var uniforms = skybox.material.uniforms;
  uniforms.turbidity.value = effectController.turbidity;
  uniforms.rayleigh.value = effectController.rayleigh;
  uniforms.mieCoefficient.value = effectController.mieCoefficient;
  uniforms.mieDirectionalG.value = effectController.mieDirectionalG;

  // effectController.azimuth = (0.05 + ((Date.now() / 1000) * 0.1)) % 1;
  effectController.azimuth = 0.25;
  var theta = Math.PI * (effectController.inclination - 0.5);
  var phi = 2 * Math.PI * (effectController.azimuth - 0.5);

  sun.x = Math.cos(phi);
  sun.y = Math.sin(phi) * Math.sin(theta);
  sun.z = Math.sin(phi) * Math.cos(theta);

  uniforms.sunPosition.value.copy(sun);
}
const skybox = new Sky();
skybox.scale.setScalar(1000);
skybox.update = update;
skybox.update();
app.object.add(skybox);

renderer.setAnimationLoop(() => {
  update();
});