import React, { useEffect, useState } from "react";
import { IBranchItem } from "@/services/branches";

interface YandexMapProps {
  branches: IBranchItem[];
}

const YandexMap: React.FC<YandexMapProps> = ({ branches = [] }) => {
  const [mapInstance, setMapInstance] = useState<any>(null);
  const [placemarks, setPlacemarks] = useState<any[]>([]);

  useEffect(() => {
    if (!branches.length) {
      console.warn("Branches data is empty or not provided.");
      return; // Exit if no branches data is available
    }

    function initMap() {
      const mapContainer = document.getElementById("map");

      if (!mapContainer || mapContainer.childElementCount > 0) return;

      const myMap = new window.ymaps.Map(mapContainer, {
        center: [41.3123363, 69.2787079], // Default center
        zoom: 12, // Zoom level for initial view
        controls: ["zoomControl", "fullscreenControl"], // Add zoom and fullscreen controls
      });

      const placemarksArray = branches
        .map((branch: IBranchItem) => {
          if (!branch.latitude || !branch.longitude) {
            console.warn(`Missing coordinates for branch: ${branch.name}`);
            return null;
          }
          const placemark = new window.ymaps.Placemark(
            [branch.longitude, branch.latitude],
            {
              balloonContent: `<strong>${branch.name}</strong>`,
            },
            {
              preset: "islands#redDotIcon",
            }
          );
          myMap.geoObjects.add(placemark); // Add placemark to map
          return { placemark, name: branch.name }; // Store placemark with branch name
        })
        .filter(Boolean); // Filter out null values if coordinates were missing

      setMapInstance(myMap); // Store map instance in state
      setPlacemarks(placemarksArray); // Store placemarks in state
    }

    // Load Yandex Maps script if not already loaded
    if (!window.ymaps) {
      const script = document.createElement("script");
      script.src = `https://api-maps.yandex.ru/2.1/?apikey=${process.env.NEXT_PUBLIC_YANDEX_API_KEY}&lang=ru_RU`;
      script.async = true;
      script.id = "yandex-map-script";
      document.head.appendChild(script);

      script.onload = () => {
        console.log("Yandex Maps API loaded successfully.");
        window.ymaps.ready(initMap);
      };

      script.onerror = () => {
        console.error("Failed to load Yandex Maps API.");
      };
    } else {
      window.ymaps.ready(initMap);
    }

    return () => {
      const scriptElement = document.getElementById("yandex-map-script");
      if (scriptElement) {
        document.head.removeChild(scriptElement);
      }
    };
  }, [branches]);

  // Handle branch list item click to focus on placemark
  const handleBranchClick = (branchName: string) => {
    if (!placemarks.length) {
      console.error("Placemarks not initialized or empty.");
      return;
    }

    const selectedPlacemark = placemarks.find((p) => p.name === branchName);
    if (selectedPlacemark && mapInstance) {
      const coords = selectedPlacemark.placemark.geometry.getCoordinates();
      mapInstance.setCenter(coords, 14, {
        checkZoomRange: true,
        duration: 300, // Smooth transition animation
      });
      selectedPlacemark.placemark.balloon.open(); // Open balloon for the placemark
    } else {
      console.error("Placemark not found for branch:", branchName);
    }
  };

  return (
    <div className="yandex-map-container flex flex-col md:flex-row">
      {/* Branch list on the left */}
      <div className="flex-1 overflow-y-auto max-h-[200px] md:max-h-[500px] pr-2 md:pr-[10px] md:mb-0 mb-4">
        <ul className="list-none p-0">
          {branches.map((branch: IBranchItem) => (
            <li key={branch.id} className="mb-2">
              <button
                onClick={() => handleBranchClick(branch.name)}
                className="cursor-pointer p-2 mb-[5px] text-white bg-primary border-none w-full text-left rounded-md hover:bg-primary-dark"
              >
                {branch.name}
              </button>
            </li>
          ))}
        </ul>
      </div>
      {/* Yandex map display */}
      <div id="map" className="w-full h-[300px] md:h-[500px] flex-[3]"></div>
    </div>
  );
};

export default YandexMap;
