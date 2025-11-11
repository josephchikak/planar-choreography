'use client'
import Image from "next/image";
import { useStore } from "../../../src/utils/useStore";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ScreeningPage() {
  const params = useParams()
  const film = params.film
  const imageUrls = useStore((state) => state.imageUrls);
  const setImageUrls = useStore((state) => state.setImageUrls);

  // Load images if not already loaded
  useEffect(() => {
    if (!imageUrls || imageUrls.length === 0) {
      // Check localStorage cache first
      try {
        const cached = localStorage.getItem('airtable-cache');
        if (cached) {
          const parsed = JSON.parse(cached);
          const dataSource = parsed.fullData || [];
          
          if (dataSource.length > 0) {
            // Process images same as Hero component
            const urls = dataSource
              .filter(cinema => cinema.fields?.Images?.length > 0)
              .map(cinema => cinema.fields.Images[0].url)
              .filter(Boolean);

            // Random selection
            const shuffled = [...urls].sort(() => 0.5 - Math.random());
            const selectedUrls = shuffled.slice(0, 5);

            setImageUrls(selectedUrls);
          }
        }
      } catch (error) {
        console.warn('Cache read failed:', error);
      }
    }
  }, [imageUrls, setImageUrls]);



  // Check if we have the specific film image
  const filmImageUrl = imageUrls[film];

  if (!filmImageUrl) {
    return (
      <div className="w-screen h-screen flex flex-col items-center justify-center bg-background text-primary">
        <h1 className="text-2xl font-basis mb-4">Loading film...</h1>
        <p className="font-basis text-sm">Film {film}</p>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen flex flex-col items-center font-basis gap-4 justify-center bg-background text-primary overflow-hidden relative">
      <h1 className="text-2xl mb-6">Movie Title</h1>
      <div className="relative w-full max-w-4xl aspect-video">
        <Image
          src={filmImageUrl}
          alt="Film Screening"
          fill
          className="object-contain"
        />
      </div>
      <p className="text-xs">
        movie description goes here. This is a placeholder for the film details
      </p>



    </div>
  );
}
