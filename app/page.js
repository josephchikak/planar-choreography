import { fetchAirtableDataProgressive } from "../src/utils/data";
import { AIRTABLE_CONFIG } from "../src/config/airtable";
import Constellation from "./components/Constellation";
import Link from "next/link";

export default function HomePage() {
  return (
    <>
      <div className="w-screen h-screen min-h-screen font-sansation text-white flex flex-col gap-8 justify-start items-start relative bg-contain bg-black p-8">
       {/* Add this gradient overlay */}
  {/* <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black opacity-100 pointer-events-none"></div> */}
  {/* <div className="absolute inset-0 backdrop-blur-sm pointer-events-none"></div> */}


        <h1 className="text-[5rem] font-sansation border-b-[0.5px]">
          {" "}
          WELCOME TO DREAM PALACES
        </h1>
        <p className="w-1/2 text-lg ">
          Dream Palaces explores the architectural, geographical, and cultural
          histories of Black cinema spaces across six countries in Africa and
          the diaspora. Initiated by an emotional encounter with a demolished
          historical cinema in South Africa, the project aims to recontextualize
          and archive these spaces digitally. It asks: how can we disrupt the
          erasure of Black cinema spaces and reimagine them as sites of memory
          and possibility?
        </p>
        <p className=" text-green-500">
          [ Choose your experience ]
        </p>
        <div className="flex flex-row gap-8 w-full h-[50vh] items-center justify-center text-sm">
          <div className=" w-[20vw] flex flex-col gap-4 ">
            <div className="w-[20vh] h-[20vh] bg-[#262322] "></div>
            <p> NON-CARTOGRAPHIC MODE </p>
            <p className="font-light text-slate-300 text-xs w-full">
              Explore a constellation of over a 1000 cinemas, each representing
              a unique story and history. Click on individual cinemas to uncover
              their narratives.
            </p>
            <Link href="/constellation">
              <button className="px-4 py-2 border-[1px] border-white text-white font-light rounded-lg hover:border-stone-700">
                {" "}
                ENTER
              </button>
            </Link>
          </div>

           <div className=" w-[20vw] flex flex-col gap-4 ">
            <div className="w-[20vh] h-[20vh] bg-[#262322] "></div>
            <p> CARTOGRAPHIC MODE </p>
            <p className="font-light text-slate-300 text-xs w-full">
              Explore a constellation of over a 1000 cinemas, each representing
              a unique story and history. Click on individual cinemas to uncover
              their narratives.
            </p>
            <Link href="/constellation">
              <button className="px-4 py-2 border-[1px] border-white text-white font-light rounded-lg hover:border-stone-700">
                {" "}
                ENTER
              </button>
            </Link>
          </div>

           <div className=" w-[20vw] flex flex-col gap-4 ">
            <div className="w-[20vh] h-[20vh] bg-[#262322] "></div>
            <p> VIRTUAL SCREENING ROOM</p>
            <p className="font-light text-slate-300 text-xs w-full">
              Explore a constellation of over a 1000 cinemas, each representing
              a unique story and history. Click on individual cinemas to uncover
              their narratives.
            </p>
            <Link href="/constellation">
              <button className="px-4 py-2 border-[1px] border-white text-white font-light rounded-lg hover:border-stone-700">
                {" "}
                ENTER
              </button>
            </Link>
          </div>

       
        </div>
      </div>
    </>
  );
}

// Enable static generation with revalidation
// export const revalidate = 3600; // Revalidate every hour
