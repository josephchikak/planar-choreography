import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  OrthographicCamera,
  useAspect,
} from "@react-three/drei";
import * as THREE from "three";
import fragment from "./shaders/fragment.glsl";
import vertex from "./shaders/vertex.glsl";


export default function Scene() {
    const CustomGeometryParticles = ({ count }) => {
  
    const points = useRef()
   
  
    const unforms = useMemo(() => ({
      uTime: {
        value: 0.0
      }
    }),[])


  
      // const count = 100;
  
      const {positions, groups} = useMemo(() => {

        const groups = new Float32Array(count)

    
        const positions = new Float32Array(count * 3);
  
        for (let i = 0; i < count; i++) {
          groups[i] = i % 10;
          //generate random values for x,y and z
  
          let x = (Math.random() - 0.5) * 2;
          let y = (Math.random() - 0.5) * 2;
          let z = (Math.random() - 0.5) * 2;
  
          // add the 3 values to the attribute array for every loop
          positions.set([x, y, z], i * 3);
        }
  
        return {positions, groups};
      }, [count]);
  
      useFrame((state) => {
        const {clock} = state;
  
        points.current.material.uniforms.uTime.value = clock.elapsedTime
      });
  
      return (
        <points ref={points}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={positions.length / 3}
              array={positions}
              itemSize={3}
            />
              <bufferAttribute
              attach="attributes-group"
              count={groups.length}
              array={groups}
              itemSize={1}
            />
          </bufferGeometry>
          {/* <pointsMaterial
            size={0.012}
            color="#5786F5"
            sizeAttenuation
            depthWrite={false}
          /> */}
          <shaderMaterial
              depthWrite = {false}
              fragmentShader={fragment}
              vertexShader={vertex}
              uniforms={unforms}
              blending={THREE.AdditiveBlending}
          />
        </points>
      );
    };
  
  
    const sizes = {
      width: window.innerWidth,
      height: window.innerHeight,
    };
  
    useFrame(({ gl, scene, camera }) => {
      gl.setClearColor(0x000000, 1);
  
      if (planeRef.current) {
        planeRef.current.scale.set(window.innerWidth, window.innerHeight, 1);
      }
    });
  
    const planeRef = useRef();
  
    return (
      <>
        {/* <OrthographicCamera
          near={-1000}
          far={1000}
          makeDefault
          position={[0, 0, 2]}
          left={sizes.width / -2}
          right={sizes.width / 2}
          top={sizes.height / 2}
          bottom={sizes.height / -2}
        /> */}
        <ambientLight intensity={1} />
  
        {/* <mesh ref={planeRef}>
          <planeGeometry args={[1, 1]} />
          <shaderMaterial
            fragmentShader={fragment}
            vertexShader={vertex}
            side={THREE.DoubleSide}
            transparent
          />
          {/* <meshBasicMaterial color="white"
          side={THREE.DoubleSide}
          /> 
        </mesh> */}
  
        <CustomGeometryParticles count={2000} />

        <OrbitControls />
      </>
    );
  }
