import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import GUI from 'lil-gui';
import { crearBrazoRobotico } from './robot.js';

// ===========================================================================
// Escena 3D interactiva — Tema: Robótica / automatización
// Un brazo robótico recoge una pieza, la traslada a una zona destino y la suelta.
// ===========================================================================

// --- Escena, cámara y renderer --------------------------------------------
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x10141a);
scene.fog = new THREE.Fog(0x10141a, 14, 28);

const camera = new THREE.PerspectiveCamera(
  55,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
camera.position.set(6, 5, 7);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

// --- Cámara interactiva (mouse: orbitar / zoom / pan) ---------------------
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.target.set(0, 1.5, 0);

// --- Iluminación coherente con un entorno industrial ----------------------
scene.add(new THREE.AmbientLight(0xffffff, 0.35));

const luzPrincipal = new THREE.DirectionalLight(0xffffff, 1.1);
luzPrincipal.position.set(6, 10, 6);
luzPrincipal.castShadow = true;
luzPrincipal.shadow.mapSize.set(2048, 2048);
luzPrincipal.shadow.camera.near = 1;
luzPrincipal.shadow.camera.far = 30;
luzPrincipal.shadow.camera.left = -10;
luzPrincipal.shadow.camera.right = 10;
luzPrincipal.shadow.camera.top = 10;
luzPrincipal.shadow.camera.bottom = -10;
scene.add(luzPrincipal);

// Luz de acento (punto) que da el toque "industrial" naranja.
const luzAcento = new THREE.PointLight(0xff8c3a, 0.8, 20);
luzAcento.position.set(-4, 4, -2);
scene.add(luzAcento);

// --- Suelo / mesa de trabajo ----------------------------------------------
const suelo = new THREE.Mesh(
  new THREE.PlaneGeometry(40, 40),
  new THREE.MeshStandardMaterial({ color: 0x1d2630, metalness: 0.2, roughness: 0.9 })
);
suelo.rotation.x = -Math.PI / 2;
suelo.receiveShadow = true;
scene.add(suelo);

// Rejilla para dar sensación de planta industrial.
const grid = new THREE.GridHelper(40, 40, 0x2f3b46, 0x2f3b46);
scene.add(grid);

// --- Zona de recogida y zona destino --------------------------------------
const matZona = new THREE.MeshStandardMaterial({
  color: 0x35c46a,
  metalness: 0.1,
  roughness: 0.8,
  transparent: true,
  opacity: 0.6,
});
const zonaOrigen = new THREE.Mesh(new THREE.CircleGeometry(0.7, 32), matZona);
zonaOrigen.rotation.x = -Math.PI / 2;
zonaOrigen.position.set(2.8, 0.01, 0);
scene.add(zonaOrigen);

const zonaDestino = new THREE.Mesh(
  new THREE.CircleGeometry(0.7, 32),
  new THREE.MeshStandardMaterial({
    color: 0x3a8cff,
    metalness: 0.1,
    roughness: 0.8,
    transparent: true,
    opacity: 0.6,
  })
);
zonaDestino.rotation.x = -Math.PI / 2;
zonaDestino.position.set(-2.8, 0.01, 1.5);
scene.add(zonaDestino);

// --- Pieza que el robot manipula ------------------------------------------
const pieza = new THREE.Mesh(
  new THREE.BoxGeometry(0.5, 0.5, 0.5),
  new THREE.MeshStandardMaterial({ color: 0xffd23f, metalness: 0.3, roughness: 0.4 })
);
pieza.castShadow = true;
const POS_ORIGEN = new THREE.Vector3(2.8, 0.25, 0);
pieza.position.copy(POS_ORIGEN);
scene.add(pieza);

// --- Brazo robótico (jerarquía de grupos) ---------------------------------
const robot = crearBrazoRobotico();
scene.add(robot.base);

// ===========================================================================
// Control de articulaciones (estado en grados, fácil de exponer a sliders)
// ===========================================================================
const estado = {
  hombro: 0,
  brazo: 25,
  antebrazo: -40,
  muneca: 10,
  pinza: 0.18, // separación de los dedos (abierto)
  animacionAuto: true,
};

const gr = (deg) => (deg * Math.PI) / 180;

function aplicarEstado() {
  robot.articulaciones.hombro.rotation.y = gr(estado.hombro);
  robot.articulaciones.brazo.rotation.z = gr(estado.brazo);
  robot.articulaciones.antebrazo.rotation.z = gr(estado.antebrazo);
  robot.articulaciones.muneca.rotation.z = gr(estado.muneca);
  robot.dedos.dedoIzq.position.x = -estado.pinza;
  robot.dedos.dedoDer.position.x = estado.pinza;
}
aplicarEstado();

// ===========================================================================
// Interacción de usuario 1: panel de sliders (lil-gui)
// ===========================================================================
const gui = new GUI({ title: 'Control del robot' });
gui.add(estado, 'hombro', -180, 180, 1).listen().onChange(aplicarEstado);
gui.add(estado, 'brazo', -80, 80, 1).listen().onChange(aplicarEstado);
gui.add(estado, 'antebrazo', -120, 60, 1).listen().onChange(aplicarEstado);
gui.add(estado, 'muneca', -90, 90, 1).listen().onChange(aplicarEstado);
gui.add(estado, 'pinza', 0.02, 0.18, 0.01).name('apertura pinza').listen().onChange(aplicarEstado);
gui.add(estado, 'animacionAuto').name('animación automática');

// ===========================================================================
// Interacción de usuario 2: teclado
//   Barra espaciadora -> pausar / reanudar animación automática
//   R -> reiniciar la secuencia y devolver la pieza al origen
// ===========================================================================
window.addEventListener('keydown', (e) => {
  if (e.code === 'Space') {
    e.preventDefault();
    estado.animacionAuto = !estado.animacionAuto;
  }
  if (e.code === 'KeyR') {
    reiniciar();
  }
});

// ===========================================================================
// Animación automática por secuencia de poses (con interpolación suave).
// La pinza "agarra" la pieza reparentándola al puntoAgarre, y la suelta en
// la zona destino -> interacción entre el robot y un elemento de la escena.
// ===========================================================================
const POSES = [
  // [hombro, brazo, antebrazo, muneca, pinza, accion]
  { v: [0, 25, -40, 10, 0.18], accion: null },        // reposo
  { v: [0, 55, -75, 25, 0.18], accion: null },        // baja a la pieza (origen)
  { v: [0, 55, -75, 25, 0.05], accion: 'agarrar' },   // cierra pinza
  { v: [0, 20, -30, 10, 0.05], accion: null },        // levanta
  { v: [120, 20, -30, 10, 0.05], accion: null },      // gira hacia destino
  { v: [120, 55, -70, 25, 0.05], accion: null },      // baja en destino
  { v: [120, 55, -70, 25, 0.18], accion: 'soltar' },  // abre pinza
  { v: [120, 20, -30, 10, 0.18], accion: null },      // sube
];

let poseActual = 0;
let poseObjetivo = 1;
let t = 0;                  // progreso de interpolación [0,1]
const VELOCIDAD = 0.4;      // fracción de pose por segundo

function lerp(a, b, k) {
  return a + (b - a) * k;
}

function agarrarPieza() {
  // Reparentamos la pieza al punto de agarre conservando su posición mundial.
  robot.puntoAgarre.add(pieza);
  pieza.position.set(0, 0, 0);
}

function soltarPieza() {
  // Devolvemos la pieza a la escena en la posición de la zona destino.
  scene.add(pieza);
  pieza.position.set(
    zonaDestino.position.x,
    0.25,
    zonaDestino.position.z
  );
}

function reiniciar() {
  poseActual = 0;
  poseObjetivo = 1;
  t = 0;
  scene.add(pieza);
  pieza.position.copy(POS_ORIGEN);
  Object.assign(estado, { hombro: 0, brazo: 25, antebrazo: -40, muneca: 10, pinza: 0.18 });
  aplicarEstado();
}

function actualizarAnimacion(dt) {
  if (!estado.animacionAuto) return;

  t += dt * VELOCIDAD;
  const desde = POSES[poseActual].v;
  const hacia = POSES[poseObjetivo].v;
  const k = Math.min(t, 1);

  estado.hombro = lerp(desde[0], hacia[0], k);
  estado.brazo = lerp(desde[1], hacia[1], k);
  estado.antebrazo = lerp(desde[2], hacia[2], k);
  estado.muneca = lerp(desde[3], hacia[3], k);
  estado.pinza = lerp(desde[4], hacia[4], k);
  aplicarEstado();

  if (t >= 1) {
    t = 0;
    // Ejecutar la acción asociada a la pose recién alcanzada.
    const accion = POSES[poseObjetivo].accion;
    if (accion === 'agarrar') agarrarPieza();
    if (accion === 'soltar') soltarPieza();

    poseActual = poseObjetivo;
    poseObjetivo = (poseObjetivo + 1) % POSES.length;
    // Al cerrar el ciclo, devolver la pieza al origen para repetir la demo.
    if (poseObjetivo === 0) {
      poseActual = 0;
      poseObjetivo = 1;
      pieza.position.copy(POS_ORIGEN);
      scene.add(pieza);
    }
  }
}

// ===========================================================================
// Bucle de render
// ===========================================================================
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  const dt = clock.getDelta();
  actualizarAnimacion(dt);
  // Pequeña pulsación de la luz de acento para dar vida a la escena.
  luzAcento.intensity = 0.7 + 0.2 * Math.sin(clock.elapsedTime * 2);
  controls.update();
  renderer.render(scene, camera);
}
animate();

// --- Responsivo ------------------------------------------------------------
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
