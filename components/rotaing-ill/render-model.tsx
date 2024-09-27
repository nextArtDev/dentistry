'use client'
import { Center, Environment, OrbitControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import clsx from 'clsx'
import dynamic from 'next/dynamic'
import React, { ReactNode, Suspense } from 'react'

const RenderModel = ({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) => {
  return (
    <Canvas
      className={clsx('  -z-10 relative', className)}
      shadows={false}
      dpr={[1, 2]}
    >
      <OrbitControls />
      <Center>
        <Suspense fallback={null}>{children}</Suspense>
      </Center>

      <Environment preset="forest" />
    </Canvas>
  )
}

export default RenderModel
