import React, { useEffect } from "react";

const CustomYandexMap = () => {
  useEffect(() => {
    // Check if the Yandex Maps script is already loaded
    const existingScript = document.querySelector(
      `script[src="https://api-maps.yandex.ru/2.1/?lang=ru_RU&apikey=29cb3b6c-9578-4644-a6e6-257573e1a438"]`
    );
    if (!existingScript) {
      const script = document.createElement("script");
      script.src =
        "https://api-maps.yandex.ru/2.1/?lang=ru_RU&apikey=29cb3b6c-9578-4644-a6e6-257573e1a438";
      script.type = "text/javascript";
      script.onload = () => {
        initializeMap();
      };
      document.head.appendChild(script);
    } else {
      initializeMap();
    }
  }, []);

  const initializeMap = () => {
    const ymaps = window.ymaps;
    if (ymaps) {
      ymaps.ready(() => {
        const myMap = new ymaps.Map("map", {
          center: [55.751574, 37.573856],
          zoom: 9,
          controls: ["searchControl"],
        });

        const MyIconContentLayout = ymaps.templateLayoutFactory.createClass(
          '<div style="color: #FFFFFF; font-weight: bold;">$[properties.iconContent]</div>'
        );

        const myPlacemark = new ymaps.Placemark(
          myMap.getCenter(),
          {
            hintContent: "Собственный значок метки",
            balloonContent: "Это красивая метка",
          },
          {
            iconLayout: "default#image",
            iconImageHref: "../../myIcon.gif",
            iconImageSize: [30, 42],
            iconImageOffset: [-5, -38],
          }
        );

        const myPlacemarkWithContent = new ymaps.Placemark(
          [55.661574, 37.573856],
          {
            hintContent: "Собственный значок метки с контентом",
            balloonContent: "А эта — новогодняя",
            iconContent: "12",
          },
          {
            iconLayout: "default#imageWithContent",
            iconImageHref: "../../ball.png",
            iconImageSize: [48, 48],
            iconImageOffset: [-24, -24],
            iconContentOffset: [15, 15],
            iconContentLayout: MyIconContentLayout,
          }
        );

        myMap.geoObjects.add(myPlacemark).add(myPlacemarkWithContent);
      });
    }
  };

  return <div id="map" style={{ width: "100%", height: "400px" }}></div>;
};

export default CustomYandexMap;
