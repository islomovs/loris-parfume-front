import React, { useEffect, useState, useRef } from "react";
import { GrLocationPin } from "react-icons/gr";

interface YandexMapProps {
  onCoordinatesChange: (latitude: number, longitude: number) => void;
}

const YandexMap: React.FC<YandexMapProps> = ({ onCoordinatesChange }) => {
  const [selectedCoordinates, setSelectedCoordinates] = useState<
    [number, number] | null
  >(null);
  const mapRef = useRef<any>(null); // Ref to store map instance
  const [userHasMovedMap, setUserHasMovedMap] = useState(false); // Flag to track if user has moved the map

useEffect(() => {
  // This code will run only once after the component is mounted
  console.log("This runs only once after rendering.");

  // You can put your one-time setup logic here, e.g., initializing a map or making an API call

  // Cleanup function if needed (runs when the component is unmounted)
  return () => {
    console.log("Component unmounted.");
  };
}, []);

  useEffect(() => {
    const initMap = () => {
      const mapContainer = document.getElementById("map");

      // Prevent multiple map instances
      if (!mapContainer || mapContainer.childElementCount > 0) {
        console.log("Map already initialized.");
        return;
      }

      // Initialize map centered at a default location (Tashkent)
      const myMap = new window.ymaps.Map(mapContainer, {
        center: [41.314472, 69.27991], // Default coordinates
        zoom: 14, // Set initial zoom level to 14
        controls: [],
      });

      mapRef.current = myMap; // Store the map instance in ref

      const updateCenterCoordinates = () => {
        const coords = myMap.getCenter();
        console.log("Map center updated to:", coords);
        setSelectedCoordinates(coords as [number, number]);
        onCoordinatesChange(coords[0], coords[1]);
      };

      myMap.events.add("actionend", () => {
        updateCenterCoordinates();
        setUserHasMovedMap(true); // User has moved the map
      });

      // Add geolocation control for user to find current location
      const geolocationControl = new window.ymaps.control.GeolocationControl({
        options: { float: "left" },
      });

      // Handle location change by geolocation control
      geolocationControl.events.add("locationchange", (event: any) => {
        const userPosition = event.get("position");
        if (userPosition) {
          console.log("User position found:", userPosition);
          if (!userHasMovedMap) {
            myMap.setCenter(userPosition, 16, {
              checkZoomRange: true,
              duration: 300,
            });
            setSelectedCoordinates(userPosition as [number, number]);
            onCoordinatesChange(userPosition[0], userPosition[1]);
          }
        }
      });

      // Handle geolocation button press to re-enable centering if needed
      geolocationControl.events.add("press", () => {
        setUserHasMovedMap(false); // Allow centering on next location change
      });

      // Handle geolocation error
      geolocationControl.events.add("error", (error: any) => {
        console.error("Geolocation error:", error);
        alert(
          "Failed to retrieve your location. Please check your permissions and try again."
        );
      });

      // Add controls to the map
      myMap.controls.add(geolocationControl);

      // Initial coordinates update
      updateCenterCoordinates();
    };

    // Load Yandex Maps script if not already loaded
    const scriptId = "yandex-map-script";
    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.src = `https://api-maps.yandex.ru/2.1/?apikey=${process.env.NEXT_PUBLIC_YANDEX_API_KEY}&lang=ru_RU`;
      script.async = true;
      script.id = scriptId;
      document.head.appendChild(script);

      script.onload = () => {
        console.log("Yandex Maps script loaded successfully.");
        window.ymaps.ready(initMap);
      };
    } else if (window.ymaps && window.ymaps.ready) {
      console.log("Yandex Maps script already loaded, initializing map.");
      window.ymaps.ready(initMap);
    }

    // Cleanup when the component unmounts
    return () => {
      if (mapRef.current) {
        mapRef.current.destroy(); // Properly destroy the map instance on unmount
        mapRef.current = null; // Clear the map instance ref
      }
    };
  }, [onCoordinatesChange, userHasMovedMap]); // Dependencies include userHasMovedMap

  return (
    <div className="yandex-map-container" style={{ position: "relative" }}>
      <div id="map" style={{ width: "100%", height: "500px" }}></div>

      {/* Center icon to represent user's selected location */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          pointerEvents: "none",
          zIndex: 10,
        }}
      >
        <GrLocationPin className="w-7 h-7 text-red-500" />
      </div>

      <div className="coordinates-display" style={{ marginTop: "10px" }}>
        <p>Selected Coordinates:</p>
        <p>
          Latitude:{" "}
          {selectedCoordinates
            ? selectedCoordinates[0].toFixed(6)
            : "Not selected"}
        </p>
        <p>
          Longitude:{" "}
          {selectedCoordinates
            ? selectedCoordinates[1].toFixed(6)
            : "Not selected"}
        </p>
      </div>
    </div>
  );
};

export default YandexMap;
