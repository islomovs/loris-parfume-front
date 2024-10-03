import SingleBlogsPage from "@/app/_pages/blogs/SingleBlogs";
import { getByIdBlog } from "@/services/blogs";
import React from "react";

const getData = async (slug: string) => {
  try {
    let data = {
      id: 5,
    };
    const response: any = await getByIdBlog(slug);

    return [response.data];
  } catch (error) {
    return [null];
  }
};

export default async function SingleBlogs({
  params: { slug },
}: {
  params: { slug: string };
}) {
  const [data] = await getData(slug);

  return <SingleBlogsPage data={data} />;
}
