import React, { useEffect, useRef, useState } from "react";
import { FaFilter } from "react-icons/fa";
import FilterSidebar from "../components/Products/FilterSidebar";
import ProductGrid from "../components/Products/ProductGrid";
import SortOptions from "../components/Products/SortOptions";

const CollectionPage = () => {
  const [products, setProducts] = useState([]);
  const sideBarRef = useRef(null);
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);

  const toggleSideBar = () => {
    console.log("Sidebar toggled:", !isSideBarOpen);
    setIsSideBarOpen(!isSideBarOpen);
  };

  const handleClickOutside = (e) => {
    if (sideBarRef.current && !sideBarRef.current.contains(e.target)) {
      setIsSideBarOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setTimeout(() => {
      const fetchProducts = [
        {
          _id: 1,
          name: "Product 1",
          price: 100,
          images: [{ url: "https://picsum.photos/500/500?random=5" }],
        },
        {
          _id: 2,
          name: "Product 2",
          price: 120,
          images: [{ url: "https://picsum.photos/500/500?random=6" }],
        },
        {
          _id: 3,
          name: "Product 3",
          price: 90,
          images: [{ url: "https://picsum.photos/500/500?random=7" }],
        },
        {
          _id: 4,
          name: "Product 4",
          price: 150,
          images: [{ url: "https://picsum.photos/500/500?random=8" }],
        },
        {
          _id: 5,
          name: "Product 5",
          price: 150,
          images: [{ url: "https://picsum.photos/500/500?random=9" }],
        },
        {
          _id: 6,
          name: "Product 6",
          price: 150,
          images: [{ url: "https://picsum.photos/500/500?random=10" }],
        },
        {
          _id: 7,
          name: "Product 7",
          price: 150,
          images: [{ url: "https://picsum.photos/500/500?random=11" }],
        },
        {
          _id: 8,
          name: "Product 8",
          price: 150,
          images: [{ url: "https://picsum.photos/500/500?random=12" }],
        },
      ];
      setProducts(fetchProducts);
    }, 1000);
  }, []);

  return (
    <div className="flex flex-col lg:flex-row">
      {/* Mobile Filter Button */}
      <button
        onClick={toggleSideBar}
        className="lg:hidden border p-2 flex justify-center items-center bg-gray-100 rounded-md shadow"
      >
        <FaFilter className="mr-2" /> Filters
      </button>

      {/* Filter Sidebar */}
      <div
        ref={sideBarRef}
        className={`${
          isSideBarOpen ? "translate-x-0" : "-translate-x-full"
        } fixed inset-y-0 left-0 w-64 bg-white shadow-lg transition-transform duration-300 lg:relative lg:translate-x-0`}
      >
        <FilterSidebar />
      </div>

      <div className="flex-grow p-4">
        <h2 className="text-2xl uppercase mb-4">All Collection</h2>
        {/* Sort Options */}
        <SortOptions />
        {/* Product Grid */}
        <ProductGrid products={products} />
      </div>
    </div>
  );
};

export default CollectionPage;
