"use client";
import { IBlog } from "@/services/blogs";
import i18n from "@/utils/i18n";
import {
  AspectRatio,
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Container,
  Text,
} from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useTranslation } from "react-i18next";
import { BsChevronRight } from "react-icons/bs";

const SingleBlogsPage = ({ data }: { data: IBlog }) => {
  const { t } = useTranslation();
  const title = i18n.language === "uz" ? data?.titleUz : data?.titleRu;
  const description =
    i18n.language === "uz" ? data?.descriptionUz : data?.descriptionRu;

  return (
    <>
      <Box position="relative">
        <Box maxH={"400px"} className="aspect-[3/2] overflow-hidden w-full">
          <Image
            src={data?.mainImage}
            alt="img"
            fill
            className="object-cover w-full"
          />
        </Box>

        <Text
          color={"#fff"}
          fontSize={{ base: "2xl", md: "4xl" }}
          position={"absolute"}
          top={"40%"}
          left={"50%"}
          transform={"translateX(-50%)"}
          maxW={"750px"}
          bg="rgba(0, 0, 0, 0.6)"
          w={"100%"}
          zIndex={1}
          p={2}
          textAlign={"center"}
          fontWeight={700}
          lineHeight={"38px"}
          letterSpacing={"5px"}
          borderRadius="md"
        >
          {title}
        </Text>
      </Box>
      <Box px={4} mx={"auto"} w={"100%"} maxW={"1100px"}>
        <Breadcrumb
          my={{ base: 4, md: 8 }}
          spacing="8px"
          separator={<BsChevronRight />}
        >
          <BreadcrumbItem>
            <BreadcrumbLink href="/" cursor={"pointer"}>
              {t("mobileNavbar.home")}
            </BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbItem isCurrentPage>
            <BreadcrumbLink href="#">
              {title?.substring(0, 25) + (title?.length > 25 ? "..." : "")}
            </BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
        <Text w={"full"} mb={8} textAlign="left">
          {description}
        </Text>
      </Box>
    </>
  );
};

export default SingleBlogsPage;
