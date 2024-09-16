"use client";

import { Col, Row, message } from "antd";
import { Spinner } from "@chakra-ui/react";
import { useQuery } from "react-query";
import { BranchCard } from "../components/BranchCard";
import { fetchBranchesData, IBranchItem } from "@/services/branches";
import YandexMap from "../components/BYandexMap";
import { useTranslation } from "react-i18next";

export default function Contacts() {
  const defaultState = {
    center: [55.751574, 37.573856],
    zoom: 5,
  };
  const { t } = useTranslation("common");
  const page = 1;

  // Fetch branches data using useQuery
  const { data, isLoading, isError } = useQuery<any, Error>(
    ["branchesData", page],
    () => fetchBranchesData(),
    {
      onError: (error) => {
        console.error("Error fetching branches data:", error);
        message.error("Failed to load branches. Please try again.");
      },
    }
  );

  const branches = data?.data;

  return (
    <div className="flex flex-col py-5 px-4 md:px-8">
      <h1 className="uppercase font-normal text-center md:my-[50px] text-xl tracking-[.2em] text-[#454545] mb-8">
        {t("branches")}
      </h1>
      <Row gutter={[16, 16]}>
        {isLoading ? (
          <div className="flex justify-center items-center w-full py-10">
            <Spinner size="lg" color="#87754f" /> {/* Chakra UI Spinner */}
          </div>
        ) : isError ? (
          <p className="text-center text-red-500">Error loading branches</p>
        ) : (
          branches?.map((branch: IBranchItem) => (
            <Col xs={24} sm={12} md={8} lg={8} key={branch.id}>
              <BranchCard
                title={branch.name}
                address={branch.name}
                phone={branch.phone}
                location={branch.redirectTo}
              />
            </Col>
          ))
        )}
      </Row>
      <div className="mt-8 md:mt-14">
        {branches ? (
          <YandexMap branches={branches} />
        ) : (
          <div className="flex justify-center items-center">
            <Spinner size="lg" color="#87754f" />{" "}
            {/* Chakra UI Spinner for the map */}
          </div>
        )}
      </div>
    </div>
  );
}
