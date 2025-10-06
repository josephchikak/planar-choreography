import React, {
  useRef,
  useMemo,
  useEffect,
  useState,
  useCallback,
  useLayoutEffect,
  use,
} from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, OrthographicCamera } from "@react-three/drei";
import * as THREE from "three";
import fragment from "./shaders/fragment.glsl";
import vertex from "./shaders/vertex.glsl";
import lineFragment from "./shaders/lineFragment.glsl";
import { analyzeAirtableData } from "./utils/d3Analysis";
import { useStore } from "./utils/useStore";
import { seededRandom } from "three/src/math/MathUtils.js";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { index } from "d3";

gsap.registerPlugin(useGSAP);

const ConstellationBackground = () => {
  const radii = [
    1, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90,
    95, 100,
  ];
  const radialSegments = 16;
  const radialLength = 100;

  // Create circle geometries
  const circleGeometries = useMemo(() => {
    return radii.map((radius) => {
      const segments = 128;
      const geometry = new THREE.BufferGeometry();
      const vertices = [];
      for (let i = 0; i <= segments; i++) {
        const theta = (i / segments) * Math.PI * 2;
        vertices.push(Math.cos(theta) * radius, Math.sin(theta) * radius, 0);
      }
      geometry.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(vertices, 3)
      );
      return geometry;
    });
  }, []);

  // Create radial line geometries
  const radialGeometries = useMemo(() => {
    return Array.from({ length: radialSegments }, (_, i) => {
      const theta = (i / radialSegments) * Math.PI * 2;
      const x = Math.cos(theta) * radialLength;
      const y = Math.sin(theta) * radialLength;

      return new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(x, y, 0),
      ]);
    });
  }, []);

  return (
    <group>
      {circleGeometries.map((geometry, index) => (
        <line key={`circle-${index}`} geometry={geometry}>
          <lineBasicMaterial color={0x444466} transparent opacity={0.6} />
        </line>
      ))}

      {radialGeometries.map((geometry, index) => (
        <line key={`radial-${index}`} geometry={geometry}>
          <lineBasicMaterial color={0x444466} transparent opacity={0.4} />
        </line>
      ))}
    </group>
  );
};

const CustomGeometryParticles = ({ data, count, originalData, groupIndex }) => {
  const points = useRef();
  const particlesRef = useRef();

  useThree((state) => {
    state.raycaster.params.Points.threshold = 10;

    state.raycaster.near = 0; // start checking just in front of the camera
    // state.raycaster.far = 150;
  });

  const { filters, setSelectedCinema, setAnimateParticles } = useStore();

  const animateParticles = useCallback(() => {
    // console.log('🎬 Animation triggered!', points.current);
    gsap.fromTo(
      points.current.material.uniforms.uPosition,
      { value: 0.0 },
      {
        value: 8.0,
        duration: 2,
        ease: "back.out",
      }
    );
  }, []);

  useEffect(() => {
    setAnimateParticles(animateParticles);
  }, [setAnimateParticles]);

  // const [hoveredIndex, setHoveredIndex] = useState(null);

  // Scale only the hovered particle
  // const handlePointerOver = (event) => {
  //   if (event.object === points.current) {
  //     const pointIndex = event.index;
  //     setHoveredIndex(pointIndex);

  //     // Scale only this specific particle
  //     gsap.to(scales, {
  //       [pointIndex]: 5.0, // Scale up this specific particle
  //       duration: 0.3,
  //       ease: "power2.out",
  //       onUpdate: () => {
  //         // Update the buffer attribute so the change is visible
  //         points.current.geometry.attributes.aScale.needsUpdate = true;
  //       }
  //     });
  //   }
  // };

  // const handlePointerOut = (event) => {
  //   if (event.object === points.current) {
  //     const pointIndex = event.index;
  //     setHoveredIndex(null);

  //     // Scale back down only this specific particle
  //     gsap.to(scales, {
  //       [pointIndex]: 1.0, // Original scale
  //       duration: 0.3,
  //       ease: "power2.out",
  //       onUpdate: () => {
  //         points.current.geometry.attributes.aScale.needsUpdate = true;
  //       }
  //     });
  //   }
  // };

  // const handlePointerOver = () => {
  //   gsap.to(points.current.material.uniforms.uSize, {
  //     value: 20.0,
  //     duration: 0.3,
  //     ease: "power2.out"
  //   });
  // };

  // const handlePointerOut = () => {
  //   gsap.to(points.current.material.uniforms.uSize, {
  //     value: 8.0,
  //     duration: 0.3,
  //     ease: "power2.out"
  //   });
  // };

  // Handle click on particles
  const handleClick = (e) => {
    // console.log(e)

    e.stopPropagation();
    // if (e.object === points.current) {
    const pointIndex = e.index;
    // console.log('Clicked particle index:', pointIndex);
    // console.log('Total particles:', data.length);
    const cinema = data[pointIndex]; // Use data prop directly
    // console.log('Selected cinema:', cinema);
    setSelectedCinema(cinema);

    // }
  };

  const uniforms = useMemo(() => {
    return {
      uTime: {
        value: 0.0,
      },
      uSize: {
        value: 10.0,
      },
      uPosition: {
        value: 0.0,
      },
    };
  }, []);

  const radius = 80; // Much larger radius for better spread

  // const count = 100;
  //  const count = data.length
  const countryColorMap = useMemo(() => {
     const countries = new Set();
    originalData.forEach((cinema) => {
      countries.add(cinema.fields?.Country || "Unknown");
    });

    // Convert to array and create color map
    const countryArray = Array.from(countries);
    // console.log("Countries in data:", countryArray);
    // console.log("Total countries:", countryArray.length);

    // Define your color palette
    const colorPalette = [
      [0.53, 0.81, 0.92], // Blue
      [0.0, 1.0, 0.0], // Green
      [1.0, 0.0, 0.0], // Red
     
      [1.0, 1.0, 0.0], // Yellow
      [1.0, 0.0, 1.0], // Magenta
      [0.0, 1.0, 1.0], // Cyan
      [1.0, 0.5, 0.0], // Orange
      [0.5, 0.0, 1.0], // Purple
      [1.0, 0.0, 0.5], // Pink
      [0.5, 1.0, 0.0], // Lime
      [0.0, 0.5, 1.0], // Sky blue
      [1.0, 0.8, 0.0], // Gold
      [0.8, 0.0, 0.8], // Dark magenta
      [0.0, 0.8, 0.8], // Teal
      [0.8, 0.5, 0.0], // Brown-orange
      [0.5, 0.8, 0.0], // Yellow-green
      [0.0, 0.8, 0.5], // Sea green
      [0.8, 0.0, 0.5], // Deep pink
      [0.5, 0.0, 0.8], // Indigo
      [0.6, 0.6, 0.6], // Gray
    ];

    // Dynamically create country color map
    const colorMap = {};
    countryArray.forEach((country, index) => {
      colorMap[country] = colorPalette[index % colorPalette.length];
    });

   return colorMap;
  }, [originalData]);

  const { positions, groups, scales, colors } = useMemo(() => {
    const groups = new Float32Array(count);
    const positions = new Float32Array(count * 3);
    const scales = new Float32Array(count);
    const colors = new Float32Array(count * 3);

    // Simple seeded random function
    const seededRandom = (seed) => {
      const x = Math.sin(seed) * 10000;
      return x - Math.floor(x);
    };

   

    for (let i = 0; i < count; i++) {
      const cinema = data[i];
      const fields = cinema.fields;
      const country = fields?.Country || "Unknown";

      // Get color from the dynamic map
      const [r, g, b] = countryColorMap[country] || [0.5, 0.5, 0.5];
      colors.set([r, g, b], i * 3);

      groups[i] = groupIndex; // All particles in this system belong to the same group

      // Use cinema ID as seed for consistent random values
      const seed = cinema.id ? cinema.id.charCodeAt(0) + i : i;
      scales[i] = Math.random() * 1.0 + 0.5; // Random scale between 0.5 and 1.5

      // Use simple random positioning (vertex shader will add Perlin noise)
      const distance = Math.sqrt(Math.random(seed + 1)) * radius;
      const theta = Math.random(seed + 2) * 360;
      const phi = Math.random(seed + 3) * 360;

      let x = distance * Math.sin(theta) * Math.cos(phi);
      let y = distance * Math.sin(theta) * Math.sin(phi);
      let z = 0;

      // add the 3 values to the attribute array for every loop
      positions.set([x, y, z], i * 3);
    }

    return { positions, groups, scales, colors };
  }, [count, groupIndex, data]);

  useFrame((state) => {
    const { clock } = state;
    const gl = state.gl;

    gl.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    gl.toneMapping = THREE.ACESFilmicToneMapping;
    gl.outputColorSpace = THREE.SRGBColorSpace;

    points.current.material.uniforms.uTime.value = clock.elapsedTime;
  });

  const lineGeometry = useMemo(() => {
    // const lineColors = [];
    // const linePositions = [];
    // // const maxDistance = 5.0;

    // for (let i = 0; i < count - 1; i++) {
    //   const x = positions[i * 3];
    //   const y = positions[i * 3 + 1];
    //   const z = positions[i * 3 + 2];

    //   // const x2 = positions[(i + 1) * 3];
    //   // const y2 = positions[(i + 1) * 3 + 1];
    //   // const z2 = positions[(i + 1) * 3 + 2];

    //   linePositions.push(x, y, z);
    // }

    return new THREE.BufferGeometry().setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array(positions), 3)
    );
  }, [positions, count]);

  const { camera } = useThree();

  useGSAP(() => {
    if (!points.current) return; // don’t animate yet if geometry isn’t ready

    gsap.fromTo(
      camera.position,
      { z: 10 },
      { z: 70, duration: 4, ease: "power2.out" }
    );
    // return null;
  }, [points.current]);

  // useLayoutEffect(() => {
  //   setAnimateParticles(animateParticles);
  // }, [animateParticles, setAnimateParticles])

  const pointsGeometryRef = useRef();

  return (
    <>
      {lineGeometry &&
        filters &&
        Object.values(filters).some((value) => value !== "all") && (
          <line geometry={lineGeometry}>
            <shaderMaterial
              fragmentShader={lineFragment}
              vertexShader={vertex}
              uniforms={uniforms}
              blending={THREE.AdditiveBlending}
              transparent
              depthWrite={false}
            />
          </line>
        )}

      <points
        ref={points}
        onPointerDown={handleClick}
        className="cursor-pointer"
        // setIndex={null}
        // onClick={() => handleClickRef.current}

        // onPointerEnter={handlePointerOver}
        // onPointerLeave={handlePointerOut}
        // onPointerOver={handlePointerOver}
        // onPointerOut={handlePointerOut}
      >
        <bufferGeometry ref={pointsGeometryRef} key={positions.length}>
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
          <bufferAttribute
            attach="attributes-aScale"
            count={scales.length}
            array={scales}
            itemSize={1}
          />
          <bufferAttribute
            attach="attributes-color"
            count={count}
            array={colors}
            itemSize={3}
          />
        </bufferGeometry>
        <shaderMaterial
          depthWrite={false}
          fragmentShader={fragment}
          vertexShader={vertex}
          uniforms={uniforms}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </>
  );
};

export default function Scene({ fullData }) {
  const {
    airtableData,
    setData,
    setAirtableData,
    setFilters,
    filteredData,
    setLoading,
    setProgress,
  } = useStore();

  const [count, setCount] = useState(0);
  // console.log("animateParticles in component:", animateParticles);

  const initialFilters = {};
  // Initialize with data
  useEffect(() => {
    if (fullData && fullData.length > 0) {
      console.log(
        "📊 Initializing with full data from server:",
        fullData.length,
        "records"
      );

      setCount(fullData.length);
      setData(fullData);

      // Prepare data with D3
      const prepared = analyzeAirtableData(fullData);
      Object.keys(prepared).forEach((field) => {
        initialFilters[field] = "all";
      });
      setFilters(initialFilters);

      // setAirtableData(prepared);

      // Set loading as complete
      setLoading(false);
      setProgress({
        loaded: fullData.length,
        total: fullData.length,
        percentage: 100,
      });

      console.log("📊 D3 Prepared Data:", prepared);
    }
  }, [fullData]);

  // useEffect(() => {
  //   if (airtableData) {
  //     const initialFilters = {};

  //     Object.keys(airtableData).forEach((field) => {
  //       initialFilters[field] = "all";
  //     });
  //     setFilters(initialFilters);
  //   }
  // }, [airtableData]);

  const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
  };

  useFrame(({ gl, scene, camera }) => {
    // console.log(camera.position.z)
    // gl.setClearColor(0x000000, 1);
    // if (planeRef.current) {
    //   planeRef.current.scale.set(window.innerWidth, window.innerHeight, 1);
    // }
  });

  const planeRef = useRef();

  return (
    <>
      {/* <OrthographicCamera
          near={0.1}
          far={1000}
          makeDefault
          position={[0, 0, 10]}
          left={sizes.width / -2}
          right={sizes.width / 2}
          top={sizes.height / 2}
          bottom={sizes.height / -2}
        /> */}
      <ambientLight intensity={1} />

      <ConstellationBackground />

      {filteredData && (
        <>
          <CustomGeometryParticles
            data={filteredData}
            originalData={fullData}
            count={filteredData.length}
            groupType="all"
            groupIndex={7}
            // offset={{ x: 0, y: 0, z: 0 }}

            // setAnimateParticles={setAnimateParticles}
          />
        </>
      )}

      <OrbitControls
        enableRotate={false}
        maxDistance={65}
        minDistance={10}
        // minZoom={10}
      />
    </>
  );
}
