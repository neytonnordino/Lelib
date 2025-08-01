"use client";

import React from "react";
import CategoryCarousel from "../components/CategoryCarousel";
const Categories = () => {
  return (
    <section id="categories" className="py-20 px-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Explore Categories
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover books across various genres and categories. Find your next
            favorite read from our extensive collection.
          </p>
        </div>

        <div className="">
          <CategoryCarousel />
        </div>
      </div>
    </section>
  );
};

export default Categories;
