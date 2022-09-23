import * as THREE from 'three';
import {Sky} from './Sky.js';
import metaversefile from 'metaversefile';
const {useApp, useFrame, useLocalPlayer, useSkyManager} = metaversefile;

const skyLightPosition = new THREE.Vector3();
const sunPosition = new THREE.Vector3();
const moonPosition = new THREE.Vector3();

export default () => {
  const app = useApp();
  const localPlayer = useLocalPlayer();
  const skyManager = useSkyManager();

  const effectController = {
    turbidity: 20,
    rayleigh: 10,
    mieCoefficient: 0.1,
    mieDirectionalG: 0.9999,
    inclination: 0, // elevation / inclination
    azimuth: 0, // Facing front,
    // exposure: renderer.toneMappingExposure
  };

  const ambientLight = new THREE.AmbientLight('#fff', 0.5);
  app.add(ambientLight);

  const skyLight = skyManager.getSkyLight();

  app.add(skyLight);
  app.add(skyLight.target);

  const skybox = new Sky();
  skybox.scale.setScalar(10000);
  app.add(skybox);
  skybox.updateMatrixWorld();
  app.setComponent('renderPriority', 'low');

  useFrame(() => {
    // ?* moves the skybox app so that player never passes the skybox's walls
    app.position.copy(localPlayer.position);
    app.updateMatrixWorld();

    // uniforms
    const uniforms = skybox.material.uniforms;
    uniforms.turbidity.value = effectController.turbidity;
    uniforms.rayleigh.value = effectController.rayleigh;
    uniforms.mieCoefficient.value = effectController.mieCoefficient;
    uniforms.mieDirectionalG.value = effectController.mieDirectionalG;

    // const { position } = useLocalPlayer().leftHand;
    effectController.azimuth = (0.05 + (Date.now() / 4000) * 0.1) % 1;
    // effectController.azimuth = Math.min(Math.max(-position.z / 30, -0.3), 0.3);
    const theta = Math.PI * (effectController.inclination - 0.5);
    const phi = 2 * Math.PI * (effectController.azimuth - 0.5);

    sunPosition.x = Math.cos(phi);
    sunPosition.y = Math.sin(phi) * Math.sin(theta);
    sunPosition.z = Math.sin(phi) * Math.cos(theta);

    uniforms.sunPosition.value.copy(sunPosition);

    if (effectController.azimuth < 0.5) {
      // sun
      skyLightPosition.copy(sunPosition);
      skyManager.setSkyLightColor('#fff');
      skyManager.setSkyLightIntensity(6);
    } else {
      // moon
      moonPosition.copy(sunPosition).multiplyScalar(-1);
      skyLightPosition.copy(moonPosition);
      skyManager.setSkyLightColor('#98caf5');
      skyManager.setSkyLightIntensity(2);
    }

    skyManager.setSkyLightPosition(skyLightPosition);
  });

  return app;
};
