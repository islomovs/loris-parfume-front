import React, { useEffect, useState } from "react";
import { GrLocationPin } from "react-icons/gr";

interface YandexMapProps {
  onCoordinatesChange: (latitude: number, longitude: number) => void;
}

const YandexMap: React.FC<YandexMapProps> = ({ onCoordinatesChange }) => {
  const [selectedCoordinates, setSelectedCoordinates] = useState<
    [number, number] | null
  >(null);

  useEffect(() => {
    function initMap() {
      const mapContainer = document.getElementById("map");

      // Prevent multiple map instances
      if (!mapContainer || mapContainer.childElementCount > 0) return;

      // Initialize map centered at a default location (Tashkent)
      const myMap = new window.ymaps.Map(mapContainer, {
        center: [41.314472, 69.27991], // Default coordinates
        zoom: 14, // Set initial zoom level to 14
        controls: [],
      });

      const updateCenterCoordinates = () => {
        const coords = myMap.getCenter();
        setSelectedCoordinates(coords as [number, number]);
        onCoordinatesChange(coords[0], coords[1]);
      };

      myMap.events.add("actionend", updateCenterCoordinates);

      // Add geolocation control for user to find current location
      const geolocationControl = new window.ymaps.control.GeolocationControl({
        options: { float: "left" },
      });

      geolocationControl.events.add("locationchange", (event: any) => {
        const userCoords = event.get("position");
        if (userCoords) {
          // Set map center and zoom to user's location
          myMap.setCenter(userCoords, 14, {
            checkZoomRange: true,
            duration: 300,
          });
          setSelectedCoordinates(userCoords as [number, number]);
          onCoordinatesChange(userCoords[0], userCoords[1]);
        }
      });

      // Handle geolocation error (optional)
      geolocationControl.events.add("error", (error: any) => {
        console.error("Geolocation error:", error);
        alert("Failed to retrieve your location. Please try again.");
      });

      // Add controls to the map
      myMap.controls.add(geolocationControl);

      // Set initial coordinates when the map is loaded
      updateCenterCoordinates();
    }

    // Load Yandex Maps script if not already loaded
    if (!window.ymaps) {
      const script = document.createElement("script");
      script.src = `https://api-maps.yandex.ru/2.1/?apikey=${process.env.NEXT_PUBLIC_YANDEX_API_KEY}&lang=ru_RU`;
      script.async = true;
      script.id = "yandex-map-script"; // ID to prevent multiple loads
      document.head.appendChild(script);

      script.onload = () => {
        window.ymaps.ready(initMap);
      };
    } else {
      window.ymaps.ready(initMap);
    }

    // Cleanup the script when the component unmounts
    return () => {
      const scriptElement = document.getElementById("yandex-map-script");
      if (scriptElement) {
        document.head.removeChild(scriptElement);
      }
    };
  }, [onCoordinatesChange]);

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
