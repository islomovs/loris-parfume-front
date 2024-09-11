"use client";

import { Col, Row } from "antd";
import { useQuery } from "react-query";
import { BranchCard } from "../components/BranchCard";
import { fetchBranchesData, IBranchItem } from "@/services/branches";
import YandexMap from "../components/YandexMap";

export default function Contacts() {
  const defaultState = {
    center: [55.751574, 37.573856],
    zoom: 5,
  };

  const page = 1;

  const { data, isLoading, isError } = useQuery<any, Error>(
    ["branchesData", page],
    () => fetchBranchesData()
  );

  const branches = data?.data;

  return (
    <div className="flex flex-col py-5 px-4 md:px-8">
      <h1 className="uppercase font-normal text-center text-xl tracking-[.2em] text-[#454545] mb-8">
        Branches
      </h1>
      <Row gutter={[16, 16]}>
        {isLoading
          ? "Loading..."
          : isError
          ? "Error loading branches"
          : branches?.map((branch: IBranchItem) => (
              <Col xs={24} sm={12} md={8} lg={8} key={branch.id}>
                <BranchCard
                  title={branch.name}
                  address={branch.name}
                  phone={branch.phone}
                  location={branch.redirectTo}
                />
              </Col>
            ))}
      </Row>
      <div className="mt-8 md:mt-14">
        <YandexMap branches={branches} />
      </div>
    </div>
  );
}
