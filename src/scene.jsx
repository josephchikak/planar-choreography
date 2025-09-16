import React, { useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Html,
  OrbitControls,
  OrthographicCamera,
  useAspect,
} from "@react-three/drei";
import * as THREE from "three";
import { GUI } from "lil-gui";
import fragment from "./shaders/fragment.glsl";
import vertex from "./shaders/vertex.glsl";
import lineFragment from "./shaders/lineFragment.glsl";
import lineVertex from "./shaders/lineVertex.glsl";
import { fetchAirtableData } from "./utils/data";
import { analyzeAirtableData } from "./utils/d3Analysis";

export default function Scene() {
  // State for Airtable data
  const [airtableData, setAirtableData] = useState(null);
  const [originalData, setOriginalData] = useState(null);
  const [airtableLoading, setAirtableLoading] = useState(true);
  const [airtableError, setAirtableError] = useState(null);
  const [count, setCount] = useState(0);

  // GUI controls for group line toggles
  const guiRef = useRef();
  const [groupToggles, setGroupToggles] = useState({
    city: true,
    closure: true,
    condition: true,

    creation: true,
    name: true,
    country: true,
    state: true,
    zipcode: true,
  });

  // Fetch Airtable data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setAirtableLoading(true);
        console.log("Loading Airtable data...");
        setAirtableError(null);
        const data = await fetchAirtableData();
        setCount(data.length);
        // console.log('Airtable data loaded:', data);
        setOriginalData(data);

        // Prepare data with D3
        const prepared = analyzeAirtableData(data);
        setAirtableData(prepared);

        console.log("📊 D3 Prepared Data:", prepared);
      } catch (error) {
        setAirtableError(error);
        console.error("Error loading Airtable data:", error);
      } finally {
        setAirtableLoading(false);
        console.log("Airtable data loaded");
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    // Create GUI
    guiRef.current = new GUI();
    guiRef.current.title("Group Line Controls");

    // Add toggles for each group using actual group names
    const groupKeys = Object.keys(groupToggles);

    groupKeys.forEach((groupKey) => {
      guiRef.current
        .add(groupToggles, groupKey)
        .name(groupKey.charAt(0).toUpperCase() + groupKey.slice(1))
        .onChange((value) => {
          setGroupToggles((prev) => ({
            ...prev,
            [groupKey]: value,
          }));
        });
    });

    // Cleanup
    return () => {
      if (guiRef.current) {
        guiRef.current.destroy();
      }
    };
  }, [airtableData]);

  const CustomGeometryParticles = ({
    data,
    count,
    groupType,
    groupIndex,
    offset,
  }) => {
    const points = useRef();
    const [selectedCinema, setSelectedCinema] = useState(null);

    // Handle click on particles
    const handleClick = (event) => {
      if (event.object === points.current) {
        const pointIndex = event.index;
        const cinema = data[pointIndex]; // Use data prop directly
        setSelectedCinema(cinema);
      }
    };

    const unforms = useMemo(
      () => ({
        uTime: {
          value: 0.0,
        },
      }),
      []
    );

    const radius = 2;

    // const count = 100;

    const { positions, groups } = useMemo(() => {
      const groups = new Float32Array(count);
      const positions = new Float32Array(count * 3);

      for (let i = 0; i < count; i++) {
        const cinema = data[i];
        const fields = cinema.fields;
        // const groupIndex = fields[groupType];
        groups[i] = groupIndex; // All particles in this system belong to the same group
        //generate random values for x,y and z

        const creationYear = parseInt(fields.Creation);
        const closureYear = parseInt(fields.Closure);
        const activeYears = closureYear - creationYear;
        const condition = fields.Condition;
        const city = fields.City;
        const country = fields.Country;
        const state = fields.State;
        const zipcode = fields.Zipcode;
        const name = fields.Name;


        const distance = Math.sqrt(Math.random()) * radius;
        const theta = THREE.MathUtils.randFloatSpread(360);
        const phi = THREE.MathUtils.randFloatSpread(360);

        let x = distance * Math.sin(theta) * Math.cos(phi) + offset.x;
        let y = distance * Math.sin(theta) * Math.sin(phi) + offset.y;
        let z = distance * Math.cos(theta) + offset.z;

        // add the 3 values to the attribute array for every loop
        positions.set([x, y, z], i * 3);
      }

      return { positions, groups };
    }, [count, groupIndex, offset]);

    useFrame((state) => {
      const { clock } = state;

      points.current.material.uniforms.uTime.value = clock.elapsedTime;
    });

    // Create connections within each group (respecting toggle states)
    const { linePositions, lineGroups } = useMemo(() => {
      const linePos = [];
      const lineGroupData = [];

      // Group particles by their group number
      const particlesByGroup = {};
      for (let i = 0; i < count; i++) {
        const groupNum = groups[i];
        if (!particlesByGroup[groupNum]) {
          particlesByGroup[groupNum] = [];
        }
        particlesByGroup[groupNum].push(i);
      }

      // Connect particles within each group (only if toggle is enabled)
      Object.keys(particlesByGroup).forEach((groupNum) => {
        const groupIndex = parseInt(groupNum);
        // Map group index to actual field names
        const fieldNames = [
          "city",
          "closure",
          "condition",
          "creation",
          "name",
          "country",
          "state",
          "zipcode",
        ];
        const groupKey = fieldNames[groupIndex] || `group${groupIndex}`;

        // Only create lines if this group's toggle is enabled
        if (groupToggles[groupKey]) {
          const groupParticles = particlesByGroup[groupNum];

          // Connect each particle to the next few particles in the same group
          for (let i = 0; i < groupParticles.length - 1; i++) {
            const currentParticle = groupParticles[i];
            const nextParticle = groupParticles[i + 1];

            linePos.push(
              positions[currentParticle * 3],
              positions[currentParticle * 3 + 1],
              positions[currentParticle * 3 + 2],
              positions[nextParticle * 3],
              positions[nextParticle * 3 + 1],
              positions[nextParticle * 3 + 2]
            );

            // Add group number for both line endpoints
            lineGroupData.push(parseInt(groupNum), parseInt(groupNum));
          }
        }
      });

      return {
        linePositions: new Float32Array(linePos),
        lineGroups: new Float32Array(lineGroupData),
      };
    }, [positions, groups, count, groupToggles]);

    return (
      <>
        <points ref={points} onClick={handleClick}>
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
          <shaderMaterial
            depthWrite={false}
            fragmentShader={fragment}
            vertexShader={vertex}
            uniforms={unforms}
            blending={THREE.AdditiveBlending}
          />
        </points>

        {/* Show text ONLY when clicked */}
        {selectedCinema && (
          <Html
            position={[selectedCinema.x, selectedCinema.y, selectedCinema.z]}
            distanceFactor={10}
          >
            <div className="bg-black bg-opacity-75 text-white p-2 rounded text-xs whitespace-nowrap">
              <div className="font-bold">{selectedCinema.fields.Name}</div>
              <div>
                {selectedCinema.fields.City}, {selectedCinema.fields.Country}
              </div>
              <div>
                {selectedCinema.fields.Creation} -{" "}
                {selectedCinema.fields.Closure}
              </div>
            </div>
          </Html>
        )}

        <lineSegments>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={linePositions.length / 3}
              array={linePositions}
              itemSize={3}
            />
            <bufferAttribute
              attach="attributes-group"
              count={lineGroups.length}
              array={lineGroups}
              itemSize={1}
            />
          </bufferGeometry>
          <shaderMaterial
            vertexShader={lineVertex}
            fragmentShader={lineFragment}
            uniforms={unforms}
            transparent
          />
        </lineSegments>
      </>
    );
  };

  const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
  };

  useFrame(({ gl, scene, camera }) => {
    // gl.setClearColor(0x000000, 1);

    if (planeRef.current) {
      planeRef.current.scale.set(window.innerWidth, window.innerHeight, 1);
    }
  });

  const planeRef = useRef();

  console.log(airtableData);

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

      {/* Separate particle systems for each group */}
      {airtableData && (
        <>
          {/* <CustomGeometryParticles 
              data={airtableData.city} 
              count={airtableData.city.length} 
              groupType="city"
              groupIndex={0}
              offset={{x: -10, y: 0, z: 0}}
            />
            <CustomGeometryParticles 
              data={airtableData.closure} 
              count={airtableData.closure.length} 
              groupType="closure"
              groupIndex={1}
              offset={{x: -5, y: 0, z: 0}}
            />
            <CustomGeometryParticles 
              data={airtableData.condition} 
              count={airtableData.condition.length} 
              groupType="condition"
              groupIndex={2}
              offset={{x: 0, y: 0, z: 0}}
            />
            <CustomGeometryParticles 
              data={airtableData.creation} 
              count={airtableData.creation.length} 
              groupType="creation"
              groupIndex={3}
              offset={{x: 5, y: 0, z: 0}}
            /> */}
          {/* <CustomGeometryParticles 
              data={airtableData.name} 
              count={airtableData.name.length} 
              groupType="name"
              groupIndex={4}
              offset={{x: 10, y: 0, z: 0}}
            /> */}
          {/* <CustomGeometryParticles 
              data={airtableData.country} 
              count={airtableData.country.length} 
              groupType="country"
              groupIndex={5}
              offset={{x: -10, y: 5, z: 0}}
            />
            <CustomGeometryParticles 
              data={airtableData.state} 
              count={airtableData.state[0][1].length} 
              groupType="state"
              groupIndex={6}
              offset={{x: -5, y: 5, z: 0}}
            /> */}
          <CustomGeometryParticles
            data={originalData}
            count={originalData.length}
            groupType="all"
            groupIndex={7}
            offset={{ x: 0, y: 0, z: 0 }}
          />
        </>
      )}
      {/* <Grid /> */}

      <OrbitControls
      // enableRotate={false}
      />
    </>
  );
}
