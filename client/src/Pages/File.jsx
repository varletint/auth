import { Image01Icon } from "hugeicons-react";
import { useState } from "react";

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
    <div>
      <label className='block text-sm font-semibold text-gray-700 mb-2'>
        Product Images (Max 5) *
      </label>
      <div className='border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-indigo-500 transition-colors duration-200 bg-gray-50'>
        <input
          type='file'
          id='images'
          multiple
          accept='image/*'
          onChange={handleImageChange}
          //   className='hidden'
        />
        {/* <label
          htmlFor='images'
          className='cursor-pointer flex flex-col items-center gap-3'>
          <div className='w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600'>
            <Image01Icon size={24} />
          </div>
          <div>
            <span className='text-indigo-600 font-semibold hover:text-indigo-700'>
              Click to upload
            </span>
            <span className='text-gray-500'> or drag and drop</span>
          </div>
          <p className='text-xs text-gray-400'>PNG, JPG, GIF up to 10MB</p>
        </label> */}
      </div>
      <div className='  flex gap-2.5'>
        {imgP &&
          imgP.map((img, iindex) => (
            <div className=' w-[100px] h-[100px]'>
              <img
                src={img}
                key={iindex}
                alt=''
                className='w-full object-cover'
                onDoubleClick={() => handleImgDel(iindex)}
              />
              {/* <button
                className=' bg-red-600/60 text-center'
                onClick={() => handleImgDel(iindex)}>
                delete
              </button> */}
            </div>
          ))}
      </div>
    </div>
  );
}
