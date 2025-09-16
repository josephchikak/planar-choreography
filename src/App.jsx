
import Scene from "./scene";
import { Canvas } from "@react-three/fiber";

function App() {
  return (
    <div className="w-full h-screen">
      <Canvas 
        className="canvas top-0 right-0 w-[100vw]  sm:h-[100%] "
        camera={{ position: [0, 0, 5] }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}

export default App;
