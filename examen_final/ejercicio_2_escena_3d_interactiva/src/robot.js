import * as THREE from 'three';

/**
 * Construye un brazo robótico articulado usando una JERARQUÍA de THREE.Group.
 *
 * Jerarquía (cada nodo es hijo del anterior, por eso al rotar un padre se
 * arrastran todos sus hijos):
 *
 *   base
 *    └─ hombro   (rota en Y -> gira todo el brazo)
 *        └─ brazo    (rota en Z -> inclina hacia delante/atrás)
 *            └─ antebrazo (rota en Z -> "codo")
 *                └─ muñeca    (rota en Z)
 *                    └─ pinza  (dos dedos que abren/cierran)
 *
 * Materiales PBR (MeshStandardMaterial con metalness/roughness).
 *
 * Devuelve un objeto con referencias a las articulaciones para poder animarlas.
 */
export function crearBrazoRobotico() {
  // --- Materiales PBR reutilizables -------------------------------------
  const matMetal = new THREE.MeshStandardMaterial({
    color: 0x9aa6b2,
    metalness: 0.9,
    roughness: 0.35,
  });
  const matNaranja = new THREE.MeshStandardMaterial({
    color: 0xff7a18,
    metalness: 0.4,
    roughness: 0.5,
  });
  const matOscuro = new THREE.MeshStandardMaterial({
    color: 0x2b2f36,
    metalness: 0.6,
    roughness: 0.6,
  });

  // Helper: crea una malla con sombras activadas.
  const malla = (geom, mat) => {
    const m = new THREE.Mesh(geom, mat);
    m.castShadow = true;
    m.receiveShadow = true;
    return m;
  };

  // --- Base fija --------------------------------------------------------
  const base = new THREE.Group();
  const baseDisco = malla(new THREE.CylinderGeometry(0.9, 1.1, 0.3, 32), matOscuro);
  baseDisco.position.y = 0.15;
  base.add(baseDisco);

  // --- Hombro (rotación en Y) ------------------------------------------
  const hombro = new THREE.Group();
  hombro.position.y = 0.3;
  base.add(hombro);
  const hombroMesh = malla(new THREE.CylinderGeometry(0.55, 0.55, 0.5, 24), matNaranja);
  hombroMesh.position.y = 0.25;
  hombro.add(hombroMesh);

  // --- Brazo (rotación en Z, pivote en la articulación) ----------------
  const brazo = new THREE.Group();
  brazo.position.y = 0.5;
  hombro.add(brazo);
  const brazoMesh = malla(new THREE.BoxGeometry(0.35, 1.6, 0.35), matMetal);
  brazoMesh.position.y = 0.8; // se extiende hacia arriba desde el pivote
  brazo.add(brazoMesh);

  // --- Antebrazo ("codo", rotación en Z) -------------------------------
  const antebrazo = new THREE.Group();
  antebrazo.position.y = 1.6; // al final del brazo
  brazo.add(antebrazo);
  const antebrazoMesh = malla(new THREE.BoxGeometry(0.28, 1.3, 0.28), matNaranja);
  antebrazoMesh.position.y = 0.65;
  antebrazo.add(antebrazoMesh);

  // --- Muñeca (rotación en Z) ------------------------------------------
  const muneca = new THREE.Group();
  muneca.position.y = 1.3;
  antebrazo.add(muneca);
  const munecaMesh = malla(new THREE.CylinderGeometry(0.2, 0.2, 0.3, 16), matMetal);
  munecaMesh.rotation.z = Math.PI / 2;
  muneca.add(munecaMesh);

  // --- Pinza (dos dedos que abren/cierran) -----------------------------
  const pinza = new THREE.Group();
  pinza.position.y = 0.25;
  muneca.add(pinza);

  const palma = malla(new THREE.BoxGeometry(0.4, 0.15, 0.3), matOscuro);
  pinza.add(palma);

  const dedoIzq = malla(new THREE.BoxGeometry(0.08, 0.4, 0.2), matMetal);
  dedoIzq.position.set(-0.16, 0.25, 0);
  pinza.add(dedoIzq);

  const dedoDer = malla(new THREE.BoxGeometry(0.08, 0.4, 0.2), matMetal);
  dedoDer.position.set(0.16, 0.25, 0);
  pinza.add(dedoDer);

  // Punto donde se "sujeta" la pieza (entre los dedos).
  const puntoAgarre = new THREE.Object3D();
  puntoAgarre.position.set(0, 0.4, 0);
  pinza.add(puntoAgarre);

  return {
    base,
    articulaciones: { hombro, brazo, antebrazo, muneca },
    dedos: { dedoIzq, dedoDer },
    puntoAgarre,
  };
}
