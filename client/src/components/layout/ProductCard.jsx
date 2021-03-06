import React from "react";
import { Link } from "react-router-dom";
const ProductCard = ({ product }) => {
  const { name, description, price, _id } = product;
  const addProductToCache = (e) => {
    window.localStorage.setItem("product", JSON.stringify(product));
  };
  return (
    <div className="w-full flex justify-center items-center">
      <div className="container mx-auto max-w-sm w-full p-4 ">
        <div className="card flex flex-col justify-center p-10 bg-white rounded-lg shadow-2xl">
          <div className="prod-title">
            <p className="text-2xl uppercase text-gray-900 font-bold">
              {name}{" "}
            </p>
            <p className="uppercase text-sm text-gray-400">{description}</p>
          </div>
          <div className="prod-img">
            <img
              src="https://unsplash.com/photos/IJjfPInzmdk/download?force=true&w=1920"
              className="w-full object-cover object-center"
              alt="a product"
            />
          </div>
          <div className="prod-info grid gap-10">
            <div className="flex flex-col md:flex-row justify-between items-center text-gray-900">
              <p className="font-bold text-xl">{price}</p>
              <Link
                to={{
                  pathname: `/product/${_id}`,
                  product,
                }}
              >
                <button
                  onClick={addProductToCache}
                  className="px-6 py-2 font-medium transition ease-in duration-200 uppercase rounded-full hover:bg-gray-800 hover:text-white border-2 border-gray-900 focus:outline-none"
                >
                  See More
                </button>
              </Link>
            </div>
          </div>
        </div>
        <div></div>
      </div>
    </div>
  );
};

export default ProductCard;
