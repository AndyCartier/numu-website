'use client'

import { useRef, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, useTexture, ContactShadows, Environment } from '@react-three/drei'
import * as THREE from 'three'

function AcousticTile() {
  const { scene } = useGLTF('/models/acoustic_tile_final.glb?v=5')
  const groupRef = useRef<THREE.Group>(null)

  const [colorMap, normalMap] = useTexture([
    '/images/textures/baked_color.png',
    '/images/textures/baked_normal.png',
  ])

  colorMap.colorSpace = THREE.SRGBColorSpace
  colorMap.flipY = false
  normalMap.flipY = false

  scene.traverse((obj) => {
    if ((obj as THREE.Mesh).isMesh) {
      const mesh = obj as THREE.Mesh
      const mat = mesh.material as THREE.MeshStandardMaterial
      if (!mat.isMeshStandardMaterial) return
      mat.map       = colorMap
      mat.normalMap = normalMap
      mat.normalScale.set(2, 2)
      mat.roughness = 0.75
      mat.metalness = 0
      mat.needsUpdate = true
    }
  })

  const elapsed = useRef(0)

  useFrame((_, delta) => {
    elapsed.current += delta
    if (elapsed.current > 2 && groupRef.current) {
      groupRef.current.rotation.y += delta * 0.21
    }
  })

  return (
    <group ref={groupRef} position={[0.8, 0, 0]}>
      <primitive object={scene} scale={2.4} rotation={[Math.PI / 2, 0, 0]} />
    </group>
  )
}

export function ModelViewer() {
  return (
    <Canvas
      camera={{ position: [-0.4, 0.2, 3], fov: 40 }}
      gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.1 }}
      dpr={[1, 2]}
      style={{ width: '100%', height: '100%', background: 'transparent' }}
    >
      {/* Soft ambient base — studio feel, not flat */}
      <ambientLight intensity={0.25} />

      {/* Key light — upper right, warm angle */}
      <directionalLight position={[4, 3, 2]} intensity={1.8} />

      {/* Fill light — opposite side, cooler, softer */}
      <directionalLight position={[-3, 1, -1]} intensity={0.5} />

      {/* Top light — separates panel from background */}
      <directionalLight position={[0, 5, 1]} intensity={0.4} />

      <Suspense fallback={null}>
        <AcousticTile />

        {/* Studio HDRI — natural bounce light, reads material surface well */}
        <Environment preset="studio" environmentIntensity={0.6} />

        <ContactShadows
          position={[0, -1.2, 0]}
          opacity={0.22}
          scale={6}
          blur={2.8}
          far={3}
          color="#111009"
        />
      </Suspense>
    </Canvas>
  )
}

useGLTF.preload('/models/acoustic_tile_final.glb?v=5')
