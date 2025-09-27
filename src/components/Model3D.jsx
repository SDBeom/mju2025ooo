import React, { Suspense, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, useGLTF, Environment } from '@react-three/drei'

// 3D 모델 컴포넌트
function Model({ url }) {
  const { scene } = useGLTF(url)
  return <primitive object={scene} scale={1} position={[0, 0, 0]} />
}

// 로딩 컴포넌트
function Loader() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="orange" />
    </mesh>
  )
}

// 메인 3D 뷰어 컴포넌트
function Model3D({ modelPath }) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#000' }}>
      {/* 상태 표시 */}
      <div style={{ 
        position: 'absolute', 
        top: '20px', 
        left: '20px', 
        color: 'white', 
        zIndex: 1000,
        background: 'rgba(0,0,0,0.7)',
        padding: '10px',
        borderRadius: '5px'
      }}>
        <p>3D 모델 뷰어</p>
        <p>로딩: {isLoading ? '중...' : '완료'}</p>
        <p>에러: {hasError ? '있음' : '없음'}</p>
      </div>

      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        {/* 조명 설정 */}
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        
        {/* 3D 모델 */}
        <Suspense fallback={<Loader />}>
          <Model url={modelPath} />
        </Suspense>
        
        {/* 컨트롤 */}
        <OrbitControls 
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          autoRotate={true}
          autoRotateSpeed={0.5}
        />
        
        {/* 환경 조명 */}
        <Environment preset="sunset" />
      </Canvas>
    </div>
  )
}

export default Model3D
