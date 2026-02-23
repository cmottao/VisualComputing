import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'

// Animated 3D cube with translation, rotation and scale
function AnimatedCube({ enableTranslation, enableRotation, enableScale, speed }) {
  const meshRef = useRef()

  useFrame(({ clock }) => {
    if (!meshRef.current) return

    const t = clock.getElapsedTime() * speed

    // Translation: circular trajectory
    if (enableTranslation) {
      const radius = 3
      meshRef.current.position.x = Math.cos(t) * radius
      meshRef.current.position.y = 2
      meshRef.current.position.z = Math.sin(t) * radius
    } else {
      meshRef.current.position.set(0, 2, 0)
    }

    // Rotation: increment on each frame
    if (enableRotation) {
      meshRef.current.rotation.x += 0.01 * speed
      meshRef.current.rotation.y += 0.02 * speed
    }

    // Scale: smooth temporal function
    if (enableScale) {
      const scaleValue = 1 + Math.sin(t) * 0.4
      meshRef.current.scale.set(scaleValue, scaleValue, scaleValue)
    } else {
      meshRef.current.scale.set(1, 1, 1)
    }
  })

  return (
    <mesh ref={meshRef} position={[0, 2, 0]}>
      <boxGeometry args={[1.5, 1.5, 1.5]} />
      <meshStandardMaterial color="#4a9eff" roughness={0.3} metalness={0.6} />
    </mesh>
  )
}

// Circular trajectory path visualization
function TrajectoryPath({ enableTranslation }) {
  if (!enableTranslation) return null

  const points = []
  const segments = 128
  const radius = 3

  for (let i = 0; i <= segments; i++) {
    const t = (i / segments) * Math.PI * 2
    points.push(Math.cos(t) * radius, 2, Math.sin(t) * radius)
  }

  return (
    <line>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={new Float32Array(points)}
          count={points.length / 3}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial color="#ffffff" opacity={0.3} transparent />
    </line>
  )
}

// Main ModelViewer component
export default function ModelViewer({ enableTranslation, enableRotation, enableScale, speed }) {
  return (
    <Canvas
      camera={{ position: [8, 6, 8], fov: 50 }}
      style={{ background: '#1a1a1a' }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <pointLight position={[-10, -10, -5]} intensity={0.5} />
      
      <AnimatedCube
        enableTranslation={enableTranslation}
        enableRotation={enableRotation}
        enableScale={enableScale}
        speed={speed}
      />

      <TrajectoryPath
        enableTranslation={enableTranslation}
      />
      
      <OrbitControls
        enableDamping
        dampingFactor={0.05}
        rotateSpeed={0.5}
        zoomSpeed={0.8}
      />
      
      <gridHelper args={[20, 20]} />
      <axesHelper args={[10]} />
    </Canvas>
  )
}
