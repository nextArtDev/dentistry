'use client'
import * as THREE from 'three'
import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three-stdlib'
import { useFrame } from '@react-three/fiber'

type GLTFResult = GLTF & {
  nodes: {
    Object_4: THREE.Mesh
    Object_6: THREE.Mesh
    Object_7: THREE.Mesh
  }
  materials: {
    defaultMat: THREE.MeshPhysicalMaterial
    defaultMat_0: THREE.MeshPhysicalMaterial
  }
}

export default function Model(props: JSX.IntrinsicElements['group']) {
  const { nodes, materials } = useGLTF(
    '/models/teeth.glb'
  ) as unknown as GLTFResult
  const modelRef = useRef<THREE.Group>(null)

  useFrame(() => {
    if (modelRef.current) {
      //   modelRef.current.rotation.y += 0.007
      //   modelRef.current.rotation.x += 0.0002
    }
  })
  return (
    <group {...props} dispose={null} ref={modelRef}>
      <group rotation={[-Math.PI / 2, -0.003, -Math.PI]} scale={0.2}>
        <group position={[-8.34, -35.435, 0]}>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Object_4.geometry}
            material={materials.defaultMat}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Object_6.geometry}
            material={materials.defaultMat_0}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Object_7.geometry}
            material={materials.defaultMat_0}
          />
        </group>
      </group>
    </group>
  )
}

useGLTF.preload('/models/teeth.glb')
