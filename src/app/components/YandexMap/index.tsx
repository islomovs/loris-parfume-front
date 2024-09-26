import { useEffect, useState, useRef } from "react";
import { YMaps, Map, GeolocationControl, SearchControl } from "@pbe/react-yandex-maps";
import axios from "axios";
import { Box } from "@chakra-ui/react";
import Marker from "./Marker";

interface YandexMapProps {
  onLocationChange: (e: {
    address: string;
    city: string;
    location: [number, number];
  }) => void;
  onNearestBranch: (coords: [number, number]) => void;  // Для запроса филиала
}

const YandexMap: React.FC<YandexMapProps> = ({ onLocationChange, onNearestBranch }) => {
  const [isLoading, setLoading] = useState(false);
  const [isDragging, setDragging] = useState(false);
  const [searchValue, setSearchValue] = useState("");  // Для ввода текста поиска
  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const onBoundsChange = (e: any) => {
    const coords = e.originalEvent.newCenter;
    setDragging(false);

    getAddress([coords[1], coords[0]]);

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };

  const getAddress = async (coords: number[]) => {
    try {
      const response = await axios.get(
        `https://geocode-maps.yandex.ru/1.x/?apikey=${
          process.env.NEXT_PUBLIC_YANDEX_API_KEY
        }&geocode=${String(coords)}&lang=ru_RU&format=json`
      );

      if (response?.data) {
        const geoObject =
          response?.data?.response?.GeoObjectCollection?.featureMember[0]
            ?.GeoObject;
        let city = "";
        if (geoObject.metaDataProperty?.GeocoderMetaData?.Address?.Components) {
          for (const item of geoObject.metaDataProperty?.GeocoderMetaData
            ?.Address?.Components) {
            if (item.kind === "locality") {
              city = item.name;
            }
          }
        }
        onLocationChange({
          address: geoObject?.name,
          city,
          location: [coords[1], coords[0]],
        });

        // Запрос ближайшего филиала
        onNearestBranch([coords[1], coords[0]]);
      }
    } catch (error: any) {
      console.log(error?.data?.message);
    }
  };

  const handleSearchInput = (e: any) => {
    const value = e.get("target").getRequestString();
    setSearchValue(value);

    // Устанавливаем таймер для debounce
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    searchTimeout.current = setTimeout(() => {
      searchAddress(value);
    }, 1500);
  };

  const searchAddress = async (query: string) => {
    if (!query) return;

    try {
      const response = await axios.get(
        `https://geocode-maps.yandex.ru/1.x/?apikey=${
          process.env.NEXT_PUBLIC_YANDEX_API_KEY
        }&geocode=${encodeURIComponent(query)}&lang=ru_RU&format=json`
      );

      if (response?.data) {
        const geoObject =
          response?.data?.response?.GeoObjectCollection?.featureMember[0]
            ?.GeoObject;
        const coords = geoObject.Point.pos.split(" ").map(Number);
        const lat = coords[1];
        const lng = coords[0];

        getAddress([lat, lng]);  // Используем координаты для получения адреса и ближайшего филиала
      }
    } catch (error: any) {
      console.log(error?.data?.message);
    }
  };

  return (
    <Box position="relative" zIndex={1}>
      <Marker hover={isDragging} isLoading={isLoading} />
      <YMaps query={{ apikey: process.env.NEXT_PUBLIC_YANDEX_API_KEY }}>
        <Map
          className="map w-full h-[360px] md:h-96"
          onMouseDown={() => setDragging(true)}
          defaultState={{ center: [41.314472, 69.27991], zoom: 14 }}
          onBoundsChange={onBoundsChange}
          options={{
            copyrightLogoVisible: false,
            copyrightProvidersVisible: false,
            copyrightUaVisible: false,
            avoidFractionalZoom: true,
            suppressMapOpenBlock: true,
          }}
        >
          <GeolocationControl />
          <SearchControl
            options={{ float: "right", noPlacemark: true }}
            onSearchChange={handleSearchInput}  // Отслеживание изменений текста
          />
        </Map>
      </YMaps>
    </Box>
  );
};

export default YandexMap;
