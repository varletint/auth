import { Image01Icon } from "hugeicons-react";
import { useState } from "react";
import ProductCard from "../Components/ProductCard";

// Mock Product Data for Testing
const MOCK_PRODUCT = {
  _id: "test-id-123",
  name: "Premium Wireless Headphones with Noise Cancellation",
  price: 45000,
  images: [
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop",
  ],
  category: "Electronics",
  rating: 4.8,
  viewCount: 1250,
  stock: 15,
};

const MOCK_PRODUCT_2 = {
  _id: "test-id-456",
  name: "Minimalist Smart Watch",
  price: 85000,
  images: [
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop"
  ],
  category: "Accessories",
  rating: 4.5,
  viewCount: 856,
  stock: 0
}

export default function File() {
  const [images, setImages] = useState([]);
  const [message, setMsg] = useState("");
  const [imgP, setImgP] = useState([]);
  console.log(imgP);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + images.length >= 5) {
      setMsg("image cant mor than 5");
      return;
    }
    const newImg = [...images, ...files];
    setImages(newImg);

    const previews = newImg.map((file) => URL.createObjectURL(file));

    setImgP(previews);
  };

  const handleImgDel = (index) => {
    console.log("click");
    const newImages = images.filter((_, i) => i !== index);
    const newImgP = imgP.filter((_, i) => i !== index);

    URL.revokeObjectURL(setImgP[index]);
    console.log(URL.revokeObjectURL(setImgP[index]));

    setImages(newImages);
    setImgP(newImgP);
  };

  return (
    <div className="p-10 space-y-12">
      <div className="border-b pb-12">
        <h2 className="text-2xl font-bold mb-6">Component Test: ProductCard</h2>
        <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-6 bg-gray-50 p-8 rounded-3xl">
          <ProductCard
            product={MOCK_PRODUCT}
            onAddToCart={() => alert("Added to cart!")}
            onToggleWishlist={() => alert("Toggled wishlist!")}
            isInWishlist={false}
          />
          <ProductCard
            product={MOCK_PRODUCT_2}
            onAddToCart={() => alert("Added to cart!")}
            onToggleWishlist={() => alert("Toggled wishlist!")}
            isInWishlist={true}
          />
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-6">Original File Upload Test</h2>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Product Images (Max 5) *
        </label>
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-indigo-500 transition-colors duration-200 bg-gray-50">
          <input
            type="file"
            id="images"
            multiple
            accept="image/*"
            onChange={handleImageChange}
          //   className='hidden'
          />
        </div>
        <div className="  flex gap-2.5 mt-4">
          {imgP &&
            imgP.map((img, iindex) => (
              <div key={iindex} className=" w-[100px] h-[100px]">
                <img
                  src={img}
                  alt=""
                  className="w-full object-cover rounded-lg border border-gray-200"
                  onDoubleClick={() => handleImgDel(iindex)}
                />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
