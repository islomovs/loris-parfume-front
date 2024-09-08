import React, { useEffect, useState } from "react";
import { GrLocationPin } from "react-icons/gr";

// Branch data with names and coordinates
const branches = [
  { name: "Branch 1", coordinates: [41.311081, 69.240562] },
  { name: "Branch 2", coordinates: [41.327069, 69.281797] },
  { name: "Branch 3", coordinates: [41.29746, 69.24987] },
  { name: "Branch 4", coordinates: [41.315387, 69.286304] },
  { name: "Branch 5", coordinates: [41.309078, 69.248819] },
  { name: "Branch 6", coordinates: [41.324345, 69.293992] },
  { name: "Branch 7", coordinates: [41.320841, 69.251511] },
  { name: "Branch 8", coordinates: [41.312306, 69.275799] },
  { name: "Branch 9", coordinates: [41.311845, 69.279619] },
  { name: "Branch 10", coordinates: [41.30963, 69.282421] },
  { name: "Branch 11", coordinates: [41.304975, 69.272304] },
];

const YandexMap = () => {
  const [mapInstance, setMapInstance] = useState<any>(null);
  const [placemarks, setPlacemarks] = useState<any[]>([]);

  useEffect(() => {
    function initMap() {
      const mapContainer = document.getElementById("map");

      if (!mapContainer || mapContainer.childElementCount > 0) return;

      const myMap = new window.ymaps.Map(mapContainer, {
        center: [41.3123363, 69.2787079], // Default center
        zoom: 12, // Zoom level for initial view
        controls: ["zoomControl", "fullscreenControl"], // Add zoom and fullscreen controls
      });

      // Create placemarks for each branch
      const placemarksArray = branches.map((branch) => {
        const placemark = new window.ymaps.Placemark(
          branch.coordinates,
          {
            balloonContent: `<strong>${branch.name}</strong>`,
          },
          {
            preset: "islands#redDotIcon",
          }
        );
        myMap.geoObjects.add(placemark); // Add placemark to map
        return { placemark, name: branch.name }; // Store placemark with branch name
      });

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
        window.ymaps.ready(initMap);
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
  }, []);

  // Handle branch list item click to focus on placemark
  const handleBranchClick = (branchName: string) => {
    const selectedPlacemark = placemarks.find((p) => p.name === branchName);
    if (selectedPlacemark && mapInstance) {
      const coords = selectedPlacemark.placemark.geometry.getCoordinates();
      mapInstance.setCenter(coords, 14, {
        checkZoomRange: true,
        duration: 300, // Smooth transition animation
      });
      selectedPlacemark.placemark.balloon.open(); // Open balloon for the placemark
    }
  };

  return (
    <div className="yandex-map-container" style={{ display: "flex" }}>
      {/* Branch list on the left */}
      <div
        style={{
          flex: "1",
          overflowY: "auto",
          maxHeight: "500px",
          paddingRight: "10px",
        }}
      >
        <ul style={{ listStyleType: "none", padding: 0 }}>
          {branches.map((branch) => (
            <li key={branch.name}>
              <button
                onClick={() => handleBranchClick(branch.name)}
                style={{
                  cursor: "pointer",
                  padding: "10px",
                  marginBottom: "5px",
                  backgroundColor: "#f0f0f0",
                  border: "none",
                  borderRadius: "5px",
                  width: "100%",
                  textAlign: "left",
                }}
              >
                {branch.name}
              </button>
            </li>
          ))}
        </ul>
      </div>
      {/* Yandex map display */}
      <div id="map" style={{ width: "100%", height: "500px", flex: "3" }}></div>
    </div>
  );
};

export default YandexMap;
