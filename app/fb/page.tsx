"use client";

import Image from "next/image";
import { useState } from "react";

export default function FbDownload() {
  const rapidApiEndpoint = process.env.NEXT_PUBLIC_RAPIDAPI_HOST_FB as string;
  const rapidApiHostHeader = new URL(rapidApiEndpoint).host;
  const rapidApiKey = process.env.NEXT_PUBLIC_RAPIDAPI_KEY as string;

  const [inputValue, setInputValue] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [downloadUrl, setDownloadUrl] = useState("");

  const handleSubmit = async () => {
    if (!inputValue.startsWith("http")) {
      alert("Masukkan url yang valid.");
      return;
    }

    const apiUrl = `${rapidApiEndpoint}url=${encodeURIComponent(inputValue)}`;

    try {
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "X-RapidAPI-Key": rapidApiKey,
          "X-RapidAPI-Host": rapidApiHostHeader,
        },
      });

      const data = await response.json();
      if (data.success) {
        setThumbnail(data.thumbnail || "");
        if (data.links) {
          setDownloadUrl(data.links["Download High Quality"] || "");
        }
        alert("");
      } else {
        alert("Data tidak ditemukan.");
      }
    } catch (error) {
      console.error("Gagal saat fetch data.", error);
      alert("Gagal fetch data.");
    }
  };

  const handleDownload = () => {
    if (!downloadUrl) {
      alert("Link tidak valid.");
      return;
    }
    window.location.href = downloadUrl;
  };

  return (
    <div className="pt-15 bg-white dark:bg-gray-900">
      <h1 className="pt-5 text-center text-xl font-semibold dark:text-white mb-5">
        Facebook Downloader
      </h1>

      {/* Menampilkan thumbnail jika ada */}
      {thumbnail && (
        <div className="max-w-md mx-auto mb-4">
          <Image
            src={thumbnail}
            alt="Thumbnail Media"
            className="mx-auto rounded shadow-lg"
          />
        </div>
      )}

      <div className="mt-10 max-w-md mx-auto mb-10 pb-5">
        <div className="relative z-0 w-full mb-5 group">
          <input
            type="text"
            name="fbLink"
            id="fbLink"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder="Masukkan link Instagram di sini"
            required
          />
          <label
            htmlFor="fbLink"
            className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Video / Story link
          </label>
        </div>
        <div className="flex flex-nowrap justify-center gap-6 mb-5">
          <button
            type="button"
            onClick={handleSubmit}
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Submit
          </button>
          <button
            type="button"
            onClick={handleDownload}
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Download
          </button>
        </div>
      </div>
    </div>
  );
}
