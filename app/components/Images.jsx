'use client'
import React, { useRef, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

import { Image, ScrollControls, Scroll, useScroll, AdaptiveDpr, Bvh } from '@react-three/drei'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import {useStore} from '../../src/utils/useStore'


const Images = () => {
    const router = useRouter()
    const { width } = useThree((state) => state.viewport)
    const w = width < 10 ? 1.5 / 3 : 1 / 3

    const [hovered, setHovered] = useState(null)

    const imageUrls = useStore((state) => state.imageUrls);

    // Don't render if imageUrls are not ready
    if (!imageUrls || imageUrls.length === 0) {
        return null;
    }

    const handleImageClick = (index) => {
        // Navigate directly to the film page using the index
        router.push(`/screening/${index}`)
    }

    useFrame((state, delta) =>{
        state.gl.setClearColor('black')

        //scale hovered
      
    })

  return (
    <>
    {/* <Canvas> */}

    {/* <OrbitControls/> */}
    <ScrollControls  horizontal damping={1} pages={imageUrls.length} distance={1}>
          <Scroll>
     
    {imageUrls.map((url, index) => (
        url && <Image 
            key={index}
            url={url} 
            position={[index * 5, 0, 0]}
            scale={[4, 4, 1]}
            onClick={() => handleImageClick(index)}
            onPointerOver={() => setHovered(index)}
            onPointerOut={() => setHovered(null)}
            grayscale={hovered === index ? 0 : 1}
        />
    ))}

     {/* }) */}
        
    {/* } */}
          </Scroll>

          <Scroll html>
            <div className='flex text-[white] items-center gap-3'>
               <p className='text-[5rem] font-basis text-[white] z-10'>Screening Room</p>

                {/* <span className="material-symbols-outlined text-[5rem] font-bold">
                 arrow_forward
                </span> */}
            </div>

          </Scroll>

    </ScrollControls>
       
    {/* </Canvas> */}
    
    </>
  )
}

const ImagesExport = () => {
  return (
    <Canvas 
      className="w-full h-full z-10"
      style={{ 
        position: 'fixed',
        top: '10vh',
        left: 0,
        width: '100vw',
        height: '80vh'
      }}
    >
      <AdaptiveDpr pixelated />
      <Bvh firstHitOnly></Bvh>
        <Images />
    </Canvas>
  )
}

export default ImagesExport