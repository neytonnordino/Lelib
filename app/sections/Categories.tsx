import React from "react";

const Categories = () => {
  const categories = [
    { name: "Fiction", count: "2,847", color: "bg-blue-500" },
    { name: "Non-Fiction", count: "1,923", color: "bg-green-500" },
    { name: "Science Fiction", count: "1,234", color: "bg-purple-500" },
    { name: "Mystery", count: "987", color: "bg-red-500" },
    { name: "Romance", count: "1,567", color: "bg-pink-500" },
    { name: "Biography", count: "756", color: "bg-yellow-500" },
  ];

  return (
    <section className="py-20 px-6 bg-gray-50">
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer"
            >
              <div
                className={`w-16 h-16 ${category.color} rounded-lg mb-6 flex items-center justify-center`}
              >
                <span className="text-white text-2xl font-bold">
                  {category.name.charAt(0)}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {category.name}
              </h3>
              <p className="text-gray-600 mb-4">
                {category.count} books available
              </p>
              <button className="text-amber-600 font-semibold hover:text-amber-700 transition-colors">
                Browse Category →
              </button>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <button className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105">
            View All Categories
          </button>
        </div>
      </div>
    </section>
  );
};

export default Categories;
