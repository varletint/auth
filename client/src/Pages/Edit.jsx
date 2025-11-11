import React, { useState } from "react";

export default function Edit() {
  const [name, setName] = useState("");

  const url = "https://lookupsbackend.vercel.app";
  console.log(name);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${url}/webhook`, {
        method: "POST",
        headers: {
          "Access-Control-Allow-Origin": "https://lookupsbackend.vercel.app",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });
      const data = await response.json();
      // console.log(data);

      alert("Form submitted successfully!");
    } catch (error) {
      alert(error);
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div>
      Edit
      <form onSubmit={handleSubmit}>
        <input
          type='text'
          placeholder='Name'
          id='name'
          className='bg-red-600'
          onChange={(e) => setName(e.target.value)}
        />
        <button>Submit</button>
      </form>
    </div>
  );
}
