import React, { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, useGLTF } from '@react-three/drei'

// GLTF 모델 로더 컴포넌트
function Model({ url }) {
  const { scene } = useGLTF(url)
  return <primitive object={scene} scale={1} position={[0, 0, 0]} />
}

// 로딩 컴포넌트
function Loading() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="orange" />
    </mesh>
  )
}

// 메인 3D 뷰어 컴포넌트
function ModelViewer({ modelPath }) {
  return (
    <div style={{ width: '100vw', height: '100vh', background: '#000' }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        
        <Suspense fallback={<Loading />}>
          <Model url={modelPath} />
        </Suspense>
        
        <OrbitControls 
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          autoRotate={true}
          autoRotateSpeed={0.5}
        />
        
        <Environment preset="sunset" />
      </Canvas>
    </div>
  )
}

export default ModelViewer
