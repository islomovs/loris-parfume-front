"use client";
import { AnimatedButton } from "@/app/components/AnimatedButton";
import { CustomInput } from "@/app/components/CustomInput";
import CustomTextArea from "@/app/components/CustomTextArea";
import { postB2b } from "@/services/b2bservice";
import { Box, Center, Flex, Grid, Text, Textarea } from "@chakra-ui/react";
import { message } from "antd";
import Link from "next/link";
import React, { FormEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import PhoneInput from "react-phone-input-2";
import Img1 from "../../../../public/flag.png";
import Img2 from "../../../../public/star.png";
import Img3 from "../../../../public/key.png";
import Img4 from "../../../../public/euro.png";
import Image from "next/image";

const B2bPage = () => {
  const { t } = useTranslation();
  const [data, setData] = useState({
    // id: 0,
    fullName: "",
    email: "",
    phone: "",
    contactSource: "",
    message: "",
  });
  const handelSubmit = (e: FormEvent) => {
    e.preventDefault();
    data?.phone &&
      postB2b(data)
        .then((res) => {
          message.success(t("b2b.success_sent"));
          setData({
            fullName: "",
            email: "",
            phone: "",
            contactSource: "",
            message: "",
          });
        })
        .catch((err) => {
          console.log(err);
          message.error("Error");
        });
  };
  return (
    <Box
      m={3}
      className="md:px-10 lg:px-20 mb-10 
    "
    >
      <Text fontSize={28} fontWeight={500} m={5}>
        {t("b2b.partner")} (B&B)
      </Text>
      <Flex
        maxW={"580px"}
        width="100%"
        justifyContent="center"
        alignItems="center"
        bg="#F3F4F6"
        padding={8}
        m={5}
        mx="auto"
        flexDirection="column"
      >
        <Box textAlign="start" width="100%">
          
          
          <Box mt={5}>
            <Text fontSize={25} fontWeight={500}>
              {t("b2b.contact")}
            </Text>
            <Text fontSize={12}>
              {t("b2b.phone")}:
              <Link href="tel:+998 93 911 99 44"> +998 93 911 99 44</Link>
            </Text>
          </Box>

          <form className="mt-5 w-full" onSubmit={handelSubmit}>
            <Flex w={"100%"} flexDir={{ base: "column", md: "row" }} gap={4}>
              <CustomInput
                className="w-full p-0 m-0"
                value={data?.fullName}
                onChange={(e) =>
                  setData((prev) => ({ ...prev, fullName: e.target.value }))
                }
                type="text"
                borders="rounded"
                title={t("b2b.name")}
              />
              <CustomInput
                className="w-full p-0 m-0"
                value={data?.email}
                onChange={(e) =>
                  setData((prev) => ({ ...prev, email: e.target.value }))
                }
                type="text"
                borders="rounded"
                title={t("b2b.email")}
              />
            </Flex>

            <Flex flexDir="column" gap={4} my={4}>
              <PhoneInput
                country="uz"
                value={data?.phone}
                onChange={(e) => setData((prev) => ({ ...prev, phone: e }))}
                enableSearch={false}
                placeholder="Enter phone number"
                inputStyle={{
                  width: "100%",
                  height: "50px",
                  borderRadius: "5px",
                  border: "1px solid #e3e3e3",
                  outline: "1px solid #e3e3e3",
                  paddingTop: "13.5px",
                  paddingBottom: "13.5px",
                  outlineWidth: "2px",
                  transition: "all 0.3s",
                }}
                dropdownStyle={{
                  textAlign: "left",
                }}
              />
              <CustomInput
                value={data?.contactSource}
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    contactSource: e.target.value,
                  }))
                }
                type="text"
                borders="rounded"
                title={t("b2b.contact_source")}
              />
              <CustomTextArea
                value={data?.message}
                onChange={(e: any) =>
                  setData((prev) => ({
                    ...prev,
                    message: e.target.value,
                  }))
                }
                borders="rounded"
                title={t("b2b.message")}
              />
              <AnimatedButton
                title={t("b2b.sent")}
                variant="dark"
                type="submit"
                width="w-full"
              />
            </Flex>
          </form>
        </Box>
      </Flex>
      
    </Box>
  );
};

export default B2bPage;
