import React, { Suspense, useState, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, useGLTF } from '@react-three/drei'

// GLTF 모델 로더 컴포넌트
function Model({ url, onError, onLoad }) {
  try {
    const { scene } = useGLTF(url, true) // useDraco: true로 압축 해제
    console.log('Model loaded successfully:', scene)
    onLoad && onLoad()
    return <primitive object={scene} scale={0.1} position={[0, 0, 0]} />
  } catch (error) {
    console.error('Model loading error:', error)
    onError && onError(error)
    return null
  }
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

// 에러 컴포넌트
function ErrorFallback({ error }) {
  return (
    <mesh>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial color="red" />
    </mesh>
  )
}

// 기본 큐브 컴포넌트 (모델 로드 실패시)
function DefaultCube() {
  return (
    <group>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="blue" />
      </mesh>
      <mesh position={[2, 0, 0]}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial color="red" />
      </mesh>
      <mesh position={[-2, 0, 0]}>
        <coneGeometry args={[0.5, 1, 8]} />
        <meshStandardMaterial color="green" />
      </mesh>
    </group>
  )
}

// 메인 3D 뷰어 컴포넌트
function ModelViewer({ modelPath }) {
  const [hasError, setHasError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [loadTimeout, setLoadTimeout] = useState(false)

  useEffect(() => {
    console.log('ModelViewer mounted, modelPath:', modelPath)
    
    // 30초 타임아웃 설정
    const timeout = setTimeout(() => {
      console.log('Model loading timeout')
      setLoadTimeout(true)
      setHasError(true)
      setIsLoading(false)
    }, 30000)

    return () => clearTimeout(timeout)
  }, [modelPath])

  const handleModelError = (error) => {
    console.error('Model loading failed:', error)
    setHasError(true)
    setIsLoading(false)
  }

  const handleModelLoad = () => {
    console.log('Model loaded successfully')
    setIsLoading(false)
    setHasError(false)
  }

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#000' }}>
      <div style={{ position: 'absolute', top: '10px', left: '10px', color: 'white', zIndex: 1000, background: 'rgba(0,0,0,0.7)', padding: '10px' }}>
        <p>Model Path: {modelPath}</p>
        <p>Loading: {isLoading ? 'Yes' : 'No'}</p>
        <p>Error: {hasError ? 'Yes' : 'No'}</p>
        <p>Timeout: {loadTimeout ? 'Yes' : 'No'}</p>
        <p>Status: {hasError ? 'Showing fallback objects' : 'Loading model...'}</p>
      </div>
      
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        
        {hasError ? (
          <DefaultCube />
        ) : (
          <Suspense fallback={<Loading />}>
            <Model url={modelPath} onError={handleModelError} onLoad={handleModelLoad} />
          </Suspense>
        )}
        
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
