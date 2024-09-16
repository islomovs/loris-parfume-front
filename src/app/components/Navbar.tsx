"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  DownOutlined,
  MenuOutlined,
  PlusOutlined,
  MinusOutlined,
} from "@ant-design/icons";
import {
  Dropdown,
  Space,
  Image,
  MenuProps,
  Row,
  Col,
  Drawer,
  Badge,
} from "antd";
import NavButton from "../components/NavButton";
import { cn } from "../../helpers/mergeFunction";
import { useQuery } from "react-query";
import { fetchCollectionsData, ICollectionItem } from "@/services/collections";
import useCartStore from "@/services/store";
import { fetchCategoriesData, ICategoryItem } from "@/services/categories";
import Marquee from "react-fast-marquee";
import { FiSearch } from "react-icons/fi";
import { TfiClose } from "react-icons/tfi";
import { fetchCataloguesData, ICatalogueItem } from "@/services/catalogues";
import { useDebounce } from "@/hooks/useDebounce";
import { fetchProductsData, IData, IProduct } from "@/services/products";
import { ProductCard } from "./ProductCard";
import { LiaShoppingBagSolid } from "react-icons/lia";
import { CustomDrawer } from "./CustomDrawer";
import { DrawerCartItem } from "./DrawerCartItem";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { Spinner } from "@chakra-ui/react";

interface INavbarProps {
  variant: "filled" | "transparent";
}

export const Navbar: React.FC<INavbarProps> = ({ variant }) => {
  const { cart } = useCartStore((state) => state);
  const [open, setOpen] = useState<boolean>(false);
  const [token, setToken] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const page = 1;
  const totalQuantity = Array.isArray(cart)
    ? cart.reduce((acc, item) => acc + item.quantity, 0)
    : 0;
  const [catalogues, setCataloguesData] = useState<ICatalogueItem[]>();
  const [isHovered, setIsHovered] = useState(false);
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [searchResults, setSearchResults] = useState<IData | null>(null);

  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();
  const { t, i18n } = useTranslation("common");
  const [isLoaded, setIsLoaded] = useState(false);

  const items: MenuProps["items"] = [
    {
      key: "uz",
      label: "Uzbek",
      onClick: () => i18n.changeLanguage("uz"),
    },
    {
      key: "ru",
      label: "Russian",
      onClick: () => i18n.changeLanguage("ru"),
    },
  ];

  // Function to handle navigation to product page
  const navigateToProduct = (productSlug: string) => {
    // Construct the URL for the product path
    const productPath = `/products/${productSlug}`;

    // Replace the current URL with the product URL
    router.replace(productPath);
  };

  // Detect screen size changes
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize(); // Check initial size
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("token");
      setToken(storedToken);
    }
    if (isSearchOpen || isSidebarOpen || open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isSearchOpen, isSidebarOpen, open]);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const handleSearchToggle = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);

    if (value.trim() === "") {
      setSearchResults(null);
    }
  };

  const closeSearch = () => {
    setSearchValue("");
    setIsSearchOpen(false);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const { isLoading: isLoadingCatalogues } = useQuery(
    ["cataloguesData"],
    async () => {
      const res = await fetchCataloguesData();
      setCataloguesData(res?.data);
    }
  );

  const { data } = useQuery(
    ["collectionsAndCategories", page],
    async () => {
      const collectionsResponse = await fetchCollectionsData(page);
      const categoriesResponse = await fetchCategoriesData(page);

      return {
        collections: collectionsResponse.data.content,
        categories: categoriesResponse.data.content,
      };
    },
    {
      staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    }
  );

  const debouncedSearchValue = useDebounce(searchValue, 300);

  const { data: searchResultsData, isLoading: isSearching } = useQuery(
    ["searchProducts", debouncedSearchValue],
    async () => {
      const res = await fetchProductsData(
        page,
        "",
        "",
        "",
        debouncedSearchValue
      );
      setSearchResults(res.data);
    },
    {
      enabled: !!debouncedSearchValue, // Only run query if there is a search value
    }
  );

  const [expandedCollections, setExpandedCollections] = useState<{
    [key: number]: boolean;
  }>({});

  const toggleCollection = (id: number) => {
    setExpandedCollections((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <>
      <nav
        className={cn(
          `pt-4 z-20 w-full transition-[background] duration-300 border-b border-solid border-[#dad9d9] relative`,
          {
            "absolute text-white bg-transparent hover:text-black hover:bg-white border-none":
              variant == "transparent" && !isSearchOpen,
            "text-black bg-white": variant == "filled" && !isSearchOpen,
            "absolute text-black bg-white": isSearchOpen,
          }
        )}
      >
        <div className="flex flex-row items-center px-4 md:px-[50px] pb-4 md:pb-[18px] justify-between">
          <div className="flex-1 flex items-center justify-between">
            <button
              className="block md:hidden text-[#454545] text-xl p-2 focus:outline-none"
              onClick={toggleSidebar}
            >
              <MenuOutlined />
            </button>
            <Dropdown
              className="hidden cursor-pointer md:block"
              menu={{ items }} // Attach the items to the Dropdown component
              trigger={["click"]}
            >
              <a
                className="text-xs md:text-[10px] uppercase hover:text-[#454545]"
                onClick={(e) => e.preventDefault()}
              >
                <Space>
                  {i18n.language.toUpperCase()}{" "}
                  {/* Display the current language */}
                  <DownOutlined />
                </Space>
              </a>
            </Dropdown>
          </div>
          <Link href="/">
            <Image
              preview={false}
              src="/logo.png"
              alt="logo"
              className="max-w-[100px] md:max-w-[290px]"
            />
          </Link>

          <div className="flex flex-row flex-1 justify-end gap-0 md:gap-10">
            {/* Desktop Mode: Show text */}
            <NavButton
              type="sm"
              className="hidden text-[10px] uppercase tracking-[.2em] md:block"
              link={token ? "/account" : "/account/login"}
            >
              {t(`navbar.account`)}
            </NavButton>
            <NavButton
              type="sm"
              className="hidden text-[10px] uppercase tracking-[.2em] md:block cursor-pointer"
              onClick={handleSearchToggle}
            >
              {t("navbar.search")}
            </NavButton>
            <NavButton
              type="md"
              className="hidden text-xs uppercase tracking-[.2em] md:block cursor-pointer"
              onClick={showDrawer}
            >
              {t("navbar.shoppingCart")}
              {cart && cart.length > 0 && (
                <span className="ml-1">({totalQuantity})</span>
              )}
            </NavButton>

            {/* Mobile Mode: Show Icons */}
            <button
              className="md:hidden text-xl p-2 focus:outline-none flex justify-center items-center"
              onClick={handleSearchToggle}
            >
              <FiSearch className="w-5 h-5 text-[#454545] hover:text-[#454545]" />
            </button>
            <button
              className="md:hidden text-xl p-2 focus:outline-none flex justify-center items-center group"
              onClick={showDrawer}
            >
              {cart && cart.length > 0 ? (
                <Badge
                  dot={true}
                  className="group-hover:text-[#454545] transition-colors"
                  color="#454545"
                  offset={[-2, 6]}
                >
                  <LiaShoppingBagSolid className="w-5 h-5 group-hover:text-[#454545] transition-colors" />
                </Badge>
              ) : (
                <LiaShoppingBagSolid className="w-5 h-5 text-[#454545] hover:text-[#454545] transition-colors" />
              )}
            </button>
          </div>

          {open && <CustomDrawer onClose={onClose} isOpen={open} />}
        </div>
        <div className="hidden md:flex flex-row items-center justify-center flex-wrap">
          {data?.collections?.map((collection: ICollectionItem) => {
            const filteredCategories = data?.categories?.filter(
              (category: ICategoryItem) =>
                category.collectionId === collection.id
            );

            const collectionName =
              i18n.language === "ru" ? collection.nameRu : collection.nameUz;

            return (
              <NavButton
                key={collection.id}
                type="md"
                link={`/collections/${collection.slug.toLowerCase()}`}
                isUnderline={true}
                dropdown={filteredCategories && filteredCategories.length > 0}
                dropdownItems={
                  filteredCategories
                    ? filteredCategories.map((category: ICategoryItem) => {
                        const categoryName =
                          i18n.language === "ru"
                            ? category.nameRu
                            : category.nameUz;

                        return {
                          label: categoryName,
                          link: `/collections/${collection.slug.toLowerCase()}/categories/${category.slug.toLowerCase()}`,
                        };
                      })
                    : []
                }
              >
                {collectionName}
              </NavButton>
            );
          })}
          <NavButton type="md" link="/branches" isUnderline={true}>
            {t("navbar.branches")}
          </NavButton>
          <div
            className="relative py-[9px] text-xs tracking-[.2em] uppercase my-2 md:my-[6px] mx-2 md:mx-[14px] font-montserrat bg-transparent cursor-pointer group after:bg-black after:absolute after:h-[2px] after:w-0 after:top-[38px] after:left-0 hover:after:w-full after:transition-all after:duration-300"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {t("navbar.e-catalog")}
            {isHovered && (
              <ul className="absolute left-0 top-[40px] bg-white border text-[#454545] w-48 z-10 p-4">
                {!isLoadingCatalogues ? (
                  catalogues?.map((catalogue: ICatalogueItem) => {
                    const name =
                      i18n.language == "ru"
                        ? catalogue.nameRu
                        : catalogue.nameUz;
                    const file =
                      i18n.language == "ru"
                        ? catalogue.fileRu
                        : catalogue.fileUz;
                    return (
                      <li key={catalogue.id} className="px-4 py-2">
                        <Link href={`${baseUrl}/${file}`}>{name}</Link>
                      </li>
                    );
                  })
                ) : (
                  <Spinner color="#87754f" size="xl" />
                )}
              </ul>
            )}
          </div>
        </div>
        <Marquee className="border-y-2 bg-primary border-y-primary py-1 text-center">
          <div className="text-sm md:text-lg font-semibold text-white">
            {t("navbar.announcement")}
          </div>
        </Marquee>

        {isSearchOpen && (
          <div
            className={cn(
              `fixed inset-x-0 z-50 flex flex-col justify-start items-center bg-white overflow-y-auto h-fit px-4 py-2 md:px-[60px]`,
              searchResults && "h-[60vh]"
            )}
          >
            <div className="w-full flex justify-center bg-white items-center">
              <div className="flex justify-center items-center w-full">
                <FiSearch className="text-xl text-[#9d9d9d]" />
                <input
                  type="text"
                  value={searchValue}
                  onChange={handleSearchChange}
                  autoFocus
                  className="w-full px-4 py-2 text-sm md:text-[18px] text-[#454545] focus:outline-none focus:ring-0 placeholder-[#9d9d9d] placeholder:tracking-[.2em]"
                  placeholder={`${t("navbar.search")}...`}
                />
                <button onClick={closeSearch}>
                  <TfiClose className="text-xl text-[#454545]" />
                </button>
              </div>
            </div>
            {/* Search Results */}
            {searchResults && (
              <div className="my-16 flex-1 w-full">
                <div className="flex flex-row justify-between items-center">
                  <p className="text-xs text-[#9D9D9D] font-normal uppercase tracking-[.2em]">
                    {searchResults?.page.totalElements} {t("navbar.results")}
                  </p>
                  <Link
                    href={`/search/${searchValue}`}
                    className="text-xs text-[#454545] font-semibold uppercase tracking-[.2em]"
                  >
                    {t("navbar.seeAll")}
                  </Link>
                </div>
                <hr className="border-t border-solid border-[#e3e3e3] mb-7 mt-[10px]" />
                <div className="mx-auto">
                  <Row gutter={[20, 30]}>
                    {isSearching ? (
                      <Spinner color="#87754f" size="xl" />
                    ) : searchResults && searchResults.content?.length > 0 ? (
                      <Row gutter={[20, 30]}>
                        {searchResults.content.slice(0, 3).map((product) => {
                          const discountPrice = product.discountPercent
                            ? (
                                parseFloat(product.price) *
                                (1 - product.discountPercent / 100)
                              ).toFixed(2)
                            : null;
                          const discountPriceMobile = product.discountPercent
                            ? product.price -
                              (product.price * product.discountPercent) / 100
                            : product.price;
                          return (
                            <Col
                              key={product.id}
                              xs={24}
                              sm={searchResults.content.length === 1 ? 24 : 12}
                              md={searchResults.content.length === 1 ? 24 : 8}
                              className="cursor-pointer"
                            >
                              {isMobile ? (
                                // Render DrawerCartItem for mobile mode
                                <DrawerCartItem
                                  isSimplified={true}
                                  id={product.id}
                                  slug={product.slug}
                                  title={product.nameRu}
                                  price={Number(discountPriceMobile)}
                                  image={product.imagesList[0]}
                                  onClick={() =>
                                    navigateToProduct(product.slug)
                                  }
                                />
                              ) : (
                                // Render ProductCard for desktop mode
                                <div
                                  onClick={() =>
                                    navigateToProduct(product.slug)
                                  }
                                >
                                  <ProductCard
                                    image={product.imagesList[0]}
                                    title={product.nameRu}
                                    originalPrice={product.price}
                                    discountPrice={
                                      discountPrice || product.price
                                    }
                                    hasDiscount={product.discountPercent > 0}
                                  />
                                </div>
                              )}
                            </Col>
                          );
                        })}
                      </Row>
                    ) : (
                      <p>{t("navbar.noProductsFound")}</p>
                    )}
                  </Row>
                </div>
              </div>
            )}
          </div>
        )}
      </nav>

      {/* Sidebar for Mobile */}
      <Drawer
        placement="left"
        closable={false}
        onClose={toggleSidebar}
        open={isSidebarOpen}
        width="80%"
        className="flex flex-col h-full justify-between md:hidden"
        style={{
          backgroundColor: "#454545",
          color: "white",
          overflowY: "hidden",
        }}
      >
        <div className="flex flex-col space-y-4 px-6">
          <Link
            href="/"
            className="text-lg font-semibold"
            onClick={toggleSidebar}
          >
            {t("mobileNavbar.home")}
          </Link>
          {data?.collections?.map((collection: ICollectionItem) => {
            const filteredCategories = data.categories.filter(
              (category: ICategoryItem) =>
                category.collectionId === collection.id
            );

            const collectionName =
              i18n.language == "ru" ? collection.nameRu : collection.nameUz;

            return (
              <div key={collection.id} className="relative">
                <div
                  className="flex justify-between items-center cursor-pointer"
                  style={{
                    borderBottom: "1px solid white",
                    paddingBottom: "10px",
                  }}
                >
                  <Link
                    href={`/collections/${collection.slug.toLowerCase()}`}
                    className="text-lg font-semibold flex-1"
                    onClick={toggleSidebar}
                  >
                    {collectionName}
                  </Link>
                  {filteredCategories.length > 0 && (
                    <button
                      className="ml-2"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevents the event from bubbling up to the link
                        e.preventDefault(); // Prevents the default link action when the button is clicked
                        toggleCollection(collection.id);
                      }}
                    >
                      {expandedCollections[collection.id] ? (
                        <MinusOutlined style={{ color: "white" }} />
                      ) : (
                        <PlusOutlined style={{ color: "white" }} />
                      )}
                    </button>
                  )}
                </div>

                {/* Categories collapse */}
                {expandedCollections[collection.id] && (
                  <div className="ml-4 mt-2">
                    {filteredCategories.map((category: ICategoryItem) => {
                      const categoryName =
                        i18n.language == "ru"
                          ? category.nameRu
                          : category.nameUz;
                      return (
                        <Link
                          key={category.id}
                          href={`/collections/${collection.slug.toLowerCase()}/categories/${category.slug.toLowerCase()}`}
                          className="block text-sm py-1 border-b border-white"
                          style={{ color: "white" }}
                          onClick={toggleSidebar}
                        >
                          {categoryName}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
          <Link
            href="/branches"
            className="text-lg font-semibold"
            onClick={toggleSidebar}
          >
            {t("mobileNavbar.branches")}
          </Link>
        </div>

        {/* Account and Language Dropdown Moved to Bottom */}
        <div className="flex flex-row justify-around items-end space-y-4 px-6 self-end">
          <Link
            href={token ? "/account" : "/account/login"}
            className="text-sm text-[#FFFFFF80] font-normal"
            onClick={toggleSidebar}
          >
            {t("mobileNavbar.account")}
          </Link>
          <Dropdown
            className="cursor-pointer md:hidden"
            menu={{ items }} // Attach the items to the Dropdown component
            trigger={["click"]}
          >
            <a
              className="text-xs md:text-[10px] uppercase hover:text-[#454545]"
              onClick={(e) => e.preventDefault()}
            >
              <Space>
                {i18n.language.toUpperCase()}{" "}
                {/* Display the current language */}
                <DownOutlined />
              </Space>
            </a>
          </Dropdown>
        </div>
      </Drawer>

      {/* Overlay and No-Scroll */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-10"
          onClick={toggleSidebar}
        ></div>
      )}
    </>
  );
};

export default Navbar;
