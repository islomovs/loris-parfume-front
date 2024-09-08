"use client";

import { YMaps, Map, Placemark } from "@pbe/react-yandex-maps";
import { Col, Row } from "antd";
import { useQuery } from "react-query";
import { BranchCard } from "../components/BranchCard";
// import YandexMap from "../components/YandexMap";
import {
  fetchBranchesData,
  IBranchItem,
  ApiResponse,
} from "@/services/branches";
import { AxiosResponse } from "axios";

export default function Contacts() {
  const defaultState = {
    center: [55.751574, 37.573856],
    zoom: 5,
  };

  const page = 1;

  const { data, isLoading, isError } = useQuery<
    AxiosResponse<ApiResponse>,
    Error
  >(["branchesData", page], () => fetchBranchesData(page));

  const branches = data?.data.content;

  return (
    <div className="flex flex-col py-5">
      <h1 className="uppercase font-normal text-center text-xl tracking-[.2em] text-[#454545]">
        Branches
      </h1>
      <Row>
        {isLoading
          ? "Loading..."
          : isError
          ? "Error loading branches"
          : branches?.map((branch: IBranchItem) => (
              <Col span={8} key={branch.id}>
                <BranchCard
                  title={branch.name}
                  address={branch.name}
                  phone="+998992229922"
                  location={branch.redirectTo}
                />
              </Col>
            ))}
      </Row>
      <div>
        {/* <YandexMap /> */}
      </div>
      <div className="flex justify-center px-20">
        <YMaps>
          <Map defaultState={defaultState} className="w-full">
            {branches?.map((branch) => (
              <Placemark
                key={branch.id}
                geometry={[branch.latitude, branch.longitude]}
                properties={{
                  balloonContent: branch.name,
                }}
              />
            ))}
          </Map>
        </YMaps>
      </div>
    </div>
  );
}
