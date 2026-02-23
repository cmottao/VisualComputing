import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { useControls, folder } from 'leva'
import * as THREE from 'three'

// Edges overlay component for wireframe outlines
function Edges({ geometry, color = '#ffffff', threshold = 15 }) {
  const edges = new THREE.EdgesGeometry(geometry, threshold)
  return (
    <lineSegments geometry={edges}>
      <lineBasicMaterial color={color} transparent opacity={0.3} />
    </lineSegments>
  )
}

// Hierarchy scene with 3 levels: Parent > Child > Grandchild
function HierarchyScene() {
  const parentRef = useRef()
  const childRef = useRef()
  const grandchildRef = useRef()

  // Parent controls (Level 1)
  const parent = useControls('Parent (Level 1)', {
    position: folder({
      parentPosX: { value: 0, min: -5, max: 5, step: 0.1, label: 'X' },
      parentPosY: { value: 0, min: -5, max: 5, step: 0.1, label: 'Y' },
      parentPosZ: { value: 0, min: -5, max: 5, step: 0.1, label: 'Z' },
    }),
    rotation: folder({
      parentRotX: { value: 0, min: -Math.PI, max: Math.PI, step: 0.01, label: 'X' },
      parentRotY: { value: 0, min: -Math.PI, max: Math.PI, step: 0.01, label: 'Y' },
      parentRotZ: { value: 0, min: -Math.PI, max: Math.PI, step: 0.01, label: 'Z' },
    }),
    scale: folder({
      parentScaleX: { value: 1, min: 0.1, max: 5, step: 0.1, label: 'X' },
      parentScaleY: { value: 1, min: 0.1, max: 5, step: 0.1, label: 'Y' },
      parentScaleZ: { value: 1, min: 0.1, max: 5, step: 0.1, label: 'Z' },
    }),
  })

  // Child controls (Level 2)
  const child = useControls('Child (Level 2)', {
    position: folder({
      childPosX: { value: 3, min: -5, max: 5, step: 0.1, label: 'X' },
      childPosY: { value: 0, min: -5, max: 5, step: 0.1, label: 'Y' },
      childPosZ: { value: 0, min: -5, max: 5, step: 0.1, label: 'Z' },
    }),
    rotation: folder({
      childRotX: { value: 0, min: -Math.PI, max: Math.PI, step: 0.01, label: 'X' },
      childRotY: { value: 0, min: -Math.PI, max: Math.PI, step: 0.01, label: 'Y' },
      childRotZ: { value: 0, min: -Math.PI, max: Math.PI, step: 0.01, label: 'Z' },
    }),
    scale: folder({
      childScaleX: { value: 1, min: 0.1, max: 5, step: 0.1, label: 'X' },
      childScaleY: { value: 1, min: 0.1, max: 5, step: 0.1, label: 'Y' },
      childScaleZ: { value: 1, min: 0.1, max: 5, step: 0.1, label: 'Z' },
    }),
  })

  // Grandchild controls (Level 3 - Bonus)
  const grandchild = useControls('Grandchild (Level 3)', {
    position: folder({
      grandPosX: { value: 2, min: -5, max: 5, step: 0.1, label: 'X' },
      grandPosY: { value: 0, min: -5, max: 5, step: 0.1, label: 'Y' },
      grandPosZ: { value: 0, min: -5, max: 5, step: 0.1, label: 'Z' },
    }),
    rotation: folder({
      grandRotX: { value: 0, min: -Math.PI, max: Math.PI, step: 0.01, label: 'X' },
      grandRotY: { value: 0, min: -Math.PI, max: Math.PI, step: 0.01, label: 'Y' },
      grandRotZ: { value: 0, min: -Math.PI, max: Math.PI, step: 0.01, label: 'Z' },
    }),
    scale: folder({
      grandScaleX: { value: 1, min: 0.1, max: 5, step: 0.1, label: 'X' },
      grandScaleY: { value: 1, min: 0.1, max: 5, step: 0.1, label: 'Y' },
      grandScaleZ: { value: 1, min: 0.1, max: 5, step: 0.1, label: 'Z' },
    }),
  })

  // Geometries for edge overlays
  const boxGeometry = new THREE.BoxGeometry(1.5, 1.5, 1.5)
  const sphereGeometry = new THREE.SphereGeometry(0.8, 32, 32)
  const torusGeometry = new THREE.TorusGeometry(0.5, 0.2, 16, 32)

  return (
    <group
      ref={parentRef}
      position={[parent.parentPosX, parent.parentPosY, parent.parentPosZ]}
      rotation={[parent.parentRotX, parent.parentRotY, parent.parentRotZ]}
      scale={[parent.parentScaleX, parent.parentScaleY, parent.parentScaleZ]}
    >
      {/* Parent mesh - Cube */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1.5, 1.5, 1.5]} />
        <meshStandardMaterial color="#4a9eff" metalness={0.3} roughness={0.4} />
      </mesh>
      <Edges geometry={boxGeometry} color="#7bb8ff" />

      {/* Child group (Level 2) */}
      <group
        ref={childRef}
        position={[child.childPosX, child.childPosY, child.childPosZ]}
        rotation={[child.childRotX, child.childRotY, child.childRotZ]}
        scale={[child.childScaleX, child.childScaleY, child.childScaleZ]}
      >
        {/* Child mesh - Sphere */}
        <mesh castShadow receiveShadow>
          <sphereGeometry args={[0.8, 32, 32]} />
          <meshStandardMaterial color="#10b981" metalness={0.3} roughness={0.4} />
        </mesh>
        <Edges geometry={sphereGeometry} color="#34d399" />

        {/* Grandchild group (Level 3 - Bonus) */}
        <group
          ref={grandchildRef}
          position={[grandchild.grandPosX, grandchild.grandPosY, grandchild.grandPosZ]}
          rotation={[grandchild.grandRotX, grandchild.grandRotY, grandchild.grandRotZ]}
          scale={[grandchild.grandScaleX, grandchild.grandScaleY, grandchild.grandScaleZ]}
        >
          {/* Grandchild mesh - Torus */}
          <mesh castShadow receiveShadow>
            <torusGeometry args={[0.5, 0.2, 16, 32]} />
            <meshStandardMaterial color="#f59e0b" metalness={0.3} roughness={0.4} />
          </mesh>
          <Edges geometry={torusGeometry} color="#fbbf24" />
        </group>
      </group>
    </group>
  )
}

// Connection lines between parent-child centers
function ConnectionLines() {
  // These are drawn as simple visual helpers
  // They update in real-time since they're inside the same hierarchy
  return null
}

// Main SceneViewer component
export default function SceneViewer() {
  return (
    <Canvas
      camera={{ position: [8, 6, 8], fov: 50 }}
      shadows
      style={{ background: '#1a1a1a' }}
    >
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={1}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <pointLight position={[-10, -10, -5]} intensity={0.3} />

      <HierarchyScene />

      <OrbitControls
        enableDamping
        dampingFactor={0.05}
        rotateSpeed={0.5}
        zoomSpeed={0.8}
      />

      <gridHelper args={[20, 20, '#333333', '#333333']} />
      <axesHelper args={[10]} />
    </Canvas>
  )
}
