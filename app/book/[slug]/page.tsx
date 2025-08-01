import React from "react";

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

const Slug = async (props: Props) => {
  const { slug } = await props.params;
  const decodedSlug = decodeURIComponent(slug);

  return (
    <section className="container mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold mb-4">Book Details</h1>
      <p className="text-lg">Book: {decodedSlug}</p>
      {/* Add more book details here */}
    </section>
  );
};

export default Slug;
