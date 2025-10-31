import { fetchAirtableDataProgressive } from "../src/utils/data";
import { AIRTABLE_CONFIG } from "../src/config/airtable";
import Constellation from "./components/Constellation";
import Link from "next/link";
import Image from "next/image";
import Hero from "./components/Hero";
import HomeScene from "./components/HomeScene";

export default async function HomePage() {


  // Server-side data fetching
  let fullData = [];
  let error = null;

  try {
    // Skip API calls in development to avoid wasting API quota
    if (process.env.NODE_ENV === 'development') {
      console.log('Development mode: Using empty data, client will handle caching');
      fullData = [];
    } else {
      console.log('Fetching Airtable data at build time...');
      
      // Fetch full data
      fullData = await fetchAirtableDataProgressive(
        AIRTABLE_CONFIG.defaultTable
      );
      
      // Cache the fetched data

    }
  } catch (err) {
    console.error('Error fetching Airtable data:', err);
    error = err.message;
  }

  const modes =[
    { name: "CONSTELLATION", description: "Explore a constellation of over 1000 cinemas, each representing a unique story and history. Click on individual cinemas to uncover their narratives.", link: "/constellation" },
    { name: "3D MAP", description: "Navigate a 3D map showcasing the geographical distribution of cinemas across Africa and the diaspora. Zoom in to discover detailed information about each location.", link: "/map" },
    { name: "SCREENING ROOM", description: "Use your mobile device to experience movies from a virtual screening room.", link: "/screening" },
   

  ]
  

  

  return (
    <div className="w-screen flex flex-col items-center relative bg-background">
      <div className="w-[90%]  h-full flex  font-inter text-primary md:grid grid-cols-2 gap-8 justify-start items-start bg-background relative bg-contain p-10">
        {/* Add this gradient overlay */}
        {/* <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black opacity-100 pointer-events-none"></div> */}
        {/* <div className="absolute inset-0 backdrop-blur-sm pointer-events-none"></div> */}
        <div className="h-[80vh] flex flex-col gap-8 ">
          <p className="w-full text-base font-light font-basis border-[0.5px] border-primary p-4">
          Dream Palaces explores the architectural, geographical, and cultural
          histories of Black cinema spaces across six countries in Africa and
          the diaspora. Initiated by an emotional encounter with a demolished
          historical cinema in South Africa, the project aims to recontextualize
          and archive these spaces digitally. It asks: how can we disrupt the
          erasure of Black cinema spaces and reimagine them as sites of memory
          and possibility?
        </p>

         <HomeScene />
        </div>  

<div className="w-full h-full hidden md:flex items-center justify-center relative gap-4 ">
  <Hero fullData={fullData} />



        {/* <h1 className="text-[5rem] font-sansation border-b-[0.5px]">
          {" "}
          WELCOME TO DREAM PALACES
        </h1> */}
       

 </div>
      
      </div>

        <div className="h-full w-[90%] bg-background font-basis  flex-col gap-4  p-8 justify-center">
          <p className=" text-yellow-400">[ Choose your experience ]</p>

          <div className="flex flex-col gap-8 w-full h-full items-between justify-start py-8 ">
            {modes.map((mode, index) => (
              <Link key={index} href={mode.link}>

            <div className=" w-full flex flex-row gap-4 items-start border-y-[0.5px] p-8 transition-all duration-200 ease-in-out hover:border-yellow-400">
            <div className="flex flex-col justify-end text-primary gap-4 md:w-1/2 text-xl">
                <p> {mode.name} </p>
              <p className="font-light text-primary text-sm w-full">
               {mode.description}
              </p>

            </div>

              {/* <div className="w-[20vh] h-[20vh] gap-4 bg-[#262322] "></div> */}

            
                {/* <button className="px-4 py-2 border-[1px] border-white text-white font-light rounded-lg hover:border-stone-700">
                  {" "}
                  ENTER
                </button> */}
            </div>
              </Link>
            ))}



          </div>
        </div>
    </div>
  );
}

// Enable static generation with revalidation
// export const revalidate = 3600; // Revalidate every hour
