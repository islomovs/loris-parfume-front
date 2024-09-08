import React, { useState, useEffect } from "react";
import Link from "next/link";
import { DownOutlined, MenuOutlined } from "@ant-design/icons";
import { Dropdown, Space, Image, MenuProps, Col, Row, Drawer } from "antd";
import NavButton from "../components/NavButton";
import { CustomDrawer } from "./CustomDrawer";
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
import { LiaShoppingBagSolid } from "react-icons/lia"; // Cart icon

const items: MenuProps["items"] = [
  // Dropdown items
];

const doprdownItems = {};

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

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("token");
      setToken(storedToken);
    }
  }, []);

  useEffect(() => {
    if (isSearchOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isSearchOpen]);

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

  const { data, isLoading } = useQuery(
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
          <div className="flex flex-row items-center space-x-4 md:space-x-8 flex-1">
            {/* Burger Menu Icon for Mobile */}
            <button
              className="md:hidden text-xl p-2 focus:outline-none"
              onClick={toggleSidebar}
            >
              <MenuOutlined />
            </button>
            <Link href="/">
              <Image
                preview={false}
                src="/logo.png"
                alt="logo"
                className="max-w-[200px] md:max-w-[290px]"
              />
            </Link>
          </div>
          <div className="flex flex-row items-center justify-end space-x-2 md:space-x-4 flex-1">
            <button
              className="md:hidden text-xl p-2 focus:outline-none"
              onClick={handleSearchToggle}
            >
              <FiSearch />
            </button>
            <button
              className="md:hidden text-xl p-2 focus:outline-none"
              onClick={showDrawer}
            >
              <LiaShoppingBagSolid />
              {cart && cart.length > 0 && (
                <span className="ml-1">{totalQuantity}</span>
              )}
            </button>
            <NavButton
              type="sm"
              className="hidden md:block"
              link={token ? "/account" : "/account/login"}
            >
              account
            </NavButton>
            <NavButton
              type="sm"
              className="hidden md:block"
              onClick={handleSearchToggle}
            >
              <FiSearch />
            </NavButton>
            <NavButton
              type="md"
              className="hidden md:block"
              onClick={showDrawer}
            >
              <LiaShoppingBagSolid />
              {cart && cart.length > 0 && (
                <span className="ml-1">{totalQuantity}</span>
              )}
            </NavButton>
          </div>
          {open && <CustomDrawer onClose={onClose} isOpen={open} />}
        </div>
        <div className="hidden md:flex flex-row items-center justify-center flex-wrap">
          {data?.collections?.map((collection: ICollectionItem) => {
            const filteredCategories = data?.categories?.filter(
              (category: ICategoryItem) =>
                category.collectionId === collection.id
            );

            return (
              <NavButton
                key={collection.id}
                type="md"
                link={`/collections/${collection.slug.toLowerCase()}`}
                isUnderline={true}
                dropdown={filteredCategories && filteredCategories.length > 0}
                dropdownItems={
                  filteredCategories
                    ? filteredCategories.map((category: ICategoryItem) => ({
                        label: category.nameEng,
                        link: `/collections/${collection.slug.toLowerCase()}/categories/${category.slug.toLowerCase()}`,
                      }))
                    : []
                }
              >
                {collection.nameRu}
              </NavButton>
            );
          })}
          <NavButton type="md" link="/" isUnderline={true}>
            Contact
          </NavButton>
          <NavButton type="md" link="/branches" isUnderline={true}>
            Branches
          </NavButton>
          <div
            className="relative py-[9px] text-xs md:text-[18px] tracking-[.2em] uppercase my-2 md:my-[6px] mx-2 md:mx-[14px] font-montserrat bg-transparent cursor-pointer group"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            e-catalog
            {isHovered && (
              <ul className="absolute left-0 top-full bg-white border text-[#454545] w-48 z-10 p-4">
                {!isLoadingCatalogues
                  ? catalogues?.map((catalogue: ICatalogueItem) => (
                      <li key={catalogue.id} className="px-4 py-2">
                        <Link href={`${baseUrl}/${catalogue.fileUz}`}>
                          {catalogue.nameEng}
                        </Link>
                      </li>
                    ))
                  : "Loading..."}
              </ul>
            )}
          </div>
        </div>
        <Marquee className="border-y-2 bg-primary border-y-primary py-1 text-center">
          <div className="text-sm md:text-lg font-semibold text-white">
            Скидка 5% в корзине для новых участников при первой покупке
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
                  placeholder="SEARCH..."
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
                    {searchResults?.page.totalElements} results
                  </p>
                  <Link
                    href={`/search/${searchValue}`}
                    className="text-xs text-[#454545] font-semibold uppercase tracking-[.2em]"
                  >
                    see all
                  </Link>
                </div>
                <hr className="border-t border-solid border-[#e3e3e3] mb-7 mt-[10px]" />
                <div className="mx-auto">
                  <Row gutter={[20, 30]}>
                    {isSearching ? (
                      <p>Loading...</p>
                    ) : searchResults && searchResults?.content?.length > 0 ? (
                      searchResults.content
                        .slice(0, 3)
                        .map((product: IProduct) => (
                          <Col key={product.id} xs={24} sm={12} md={8}>
                            <Link href={`products/${product.slug}`}>
                              <ProductCard
                                image={product.imagesList[0]}
                                title={product.nameRu}
                                originalPrice={product.price}
                                hasDiscount={product.discountPercent > 0}
                              />
                            </Link>
                          </Col>
                        ))
                    ) : (
                      <p>No products found</p>
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
        className="md:hidden"
        bodyStyle={{
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          height: "100%",
        }}
      >
        <div className="flex flex-col space-y-4">
          <Link
            href="/"
            className="text-lg font-semibold"
            onClick={toggleSidebar}
          >
            Home
          </Link>
          {data?.collections?.map((collection: ICollectionItem) => (
            <Link
              key={collection.id}
              href={`/collections/${collection.slug.toLowerCase()}`}
              className="text-lg font-semibold"
              onClick={toggleSidebar}
            >
              {collection.nameRu}
            </Link>
          ))}
          <Link
            href="/branches"
            className="text-lg font-semibold"
            onClick={toggleSidebar}
          >
            Branches
          </Link>
          <Link
            href="/"
            className="text-lg font-semibold"
            onClick={toggleSidebar}
          >
            Contact
          </Link>
        </div>

        {/* Account and Language Dropdown Moved to Bottom */}
        <div className="space-y-4">
          <NavButton type="sm" link={token ? "/account" : "/account/login"}>
            Account
          </NavButton>
          <Dropdown menu={{ items }} trigger={["click"]}>
            <a
              className="text-xs md:text-[10px] uppercase hover:text-black"
              onClick={(e) => e.preventDefault()}
            >
              <Space>
                uzb
                <DownOutlined />
              </Space>
            </a>
          </Dropdown>
        </div>
      </Drawer>

      {/* Overlay and No-Scroll */}
      {isSearchOpen && (
        <div className="fixed inset-0 bg-black opacity-50 z-10"></div>
      )}
    </>
  );
};

export default Navbar;
