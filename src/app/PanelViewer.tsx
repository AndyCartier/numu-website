'use client'

import { useRef, Suspense, Component, type ReactNode } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, useTexture, Center } from '@react-three/drei'
import * as THREE from 'three'

class WebGLBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  render() { return this.state.failed ? null : this.props.children }
}

const TILT_X = -0.28
const SPIN_SPEED = 0.32

function AcousticModel({ isInvestor }: { isInvestor: boolean }) {
  const { scene } = useGLTF('/models/acoustic_tile_final.glb')
  const ref = useRef<THREE.Group>(null)

  const [normalMap, bumpMap] = useTexture([
    '/images/textures/normal_map.png',
    '/images/textures/baked_normal_final.png',
  ])

  // Normal maps must use linear color space, not sRGB
  normalMap.colorSpace = THREE.LinearSRGBColorSpace
  normalMap.flipY = false
  normalMap.wrapS = normalMap.wrapT = THREE.RepeatWrapping
  normalMap.anisotropy = 16

  bumpMap.colorSpace = THREE.LinearSRGBColorSpace
  bumpMap.flipY = false
  bumpMap.wrapS = bumpMap.wrapT = THREE.RepeatWrapping
  bumpMap.anisotropy = 16

  const cloned = useRef<THREE.Object3D | null>(null)
  if (!cloned.current) {
    cloned.current = scene.clone(true)
    cloned.current.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh
        const applyMat = (m: THREE.Material) => {
          const mat = m.clone() as THREE.MeshStandardMaterial
          mat.transparent = false
          mat.normalMap = normalMap
          mat.normalScale = new THREE.Vector2(1.4, 1.4)
          mat.bumpMap = bumpMap
          mat.bumpScale = 0.5
          mat.roughness = 0.97     // near-matte — mycelium has no specular reflection
          mat.metalness = 0.0
          mat.envMapIntensity = 0  // suppress any env map reflection
          mat.needsUpdate = true
          return mat
        }
        if (Array.isArray(mesh.material)) {
          mesh.material = mesh.material.map(applyMat)
        } else if (mesh.material) {
          mesh.material = applyMat(mesh.material as THREE.Material)
        }
      }
    })
  }

  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.elapsedTime
    ref.current.rotation.z = Math.PI / 2   // flip panel face toward viewer
    ref.current.rotation.y = t * SPIN_SPEED
    ref.current.rotation.x = TILT_X + Math.sin(t * 0.18) * 0.04
  })

  return (
    <Center>
      <primitive ref={ref} object={cloned.current} />
    </Center>
  )
}

useGLTF.preload('/models/acoustic_tile_final.glb')

export default function PanelViewer({ isInvestor = false }: { isInvestor?: boolean }) {
  return (
    <WebGLBoundary>
      <Canvas
        camera={{ position: [0, 0.2, 1.1], fov: 52 }}
        gl={{ alpha: true, antialias: true }}
        style={{ background: 'transparent', width: '100%', height: '100%' }}
      >
        {/* Ambient — kept low so directional lights create visible shadow/depth */}
        <ambientLight intensity={0.45} />

        {/* Raking key light — strong angle reveals normal-map depth */}
        <directionalLight
          position={[-4, 3, 2]}
          intensity={isInvestor ? 1.4 : 2.2}
          color={isInvestor ? '#f0e8d8' : '#e8dfd4'}
        />

        {/* Soft cross light — broadens diffuse, kills harsh shadow boundary */}
        <directionalLight
          position={[4, 1, 1]}
          intensity={isInvestor ? 0.6 : 0.9}
          color={isInvestor ? '#ddd5c8' : '#d4cfc8'}
        />

        {/* Bounce fill — keeps underside readable */}
        <directionalLight
          position={[0, -3, 2]}
          intensity={isInvestor ? 0.3 : 0.35}
          color={isInvestor ? '#c8c0b4' : '#c0b8b0'}
        />

        <Suspense fallback={null}>
          <AcousticModel isInvestor={isInvestor} />
        </Suspense>
      </Canvas>
    </WebGLBoundary>
  )
}
