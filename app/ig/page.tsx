"use client";

import Image from "next/image";
import { useState } from "react";

export default function IgDownloader() {
  // client side
  const rapidApiKey = process.env.NEXT_PUBLIC_RAPIDAPI_KEY as string;
  const rapidApiHost = process.env.NEXT_PUBLIC_RAPIDAPI_HOST_IG as string;

  const [inputValue, setInputValue] = useState("");
  const [downloadUrl, setDownloadUrl] = useState("");
  const [thumbnail, setThumbnail] = useState("");

  // function submit buat fetch thumbnail
  const handleSubmit = async () => {
    if (!inputValue.startsWith("http")) {
      alert("Masukkan URL yang valid.");
      return;
    }

    const apiUrl = `https://${rapidApiHost}/convert?url=${encodeURIComponent(
      inputValue
    )}`;

    try {
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "X-RapidAPI-Key": rapidApiKey,
          "X-RapidAPI-Host": rapidApiHost,
        },
      });
      const data = await response.json();
      if (data.media && data.media.length > 0) {
        setThumbnail(data.media[0].thumbnail || "");
        setDownloadUrl(data.media[0].url || "");
      } else {
        alert("Data tidak ditemukan, coba lagi.");
      }
    } catch (error) {
      console.error("Error saat submit:", error);
      alert("Terjadi error saat fetch data.");
    }
  };

  // function buat download
  const handleDownload = () => {
    if (!downloadUrl) {
      alert("Download link tidak tersedia. Submit link dulu.");
      return;
    }
    window.location.href = downloadUrl;
  };

  return (
    <div className="pt-15 bg-white dark:bg-gray-900">
      <h1 className="pt-5 text-center text-xl font-semibold dark:text-white">
        Instagram Downloader
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
            name="igLink"
            id="igLink"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder="Masukkan link Instagram di sini"
            required
          />
          <label
            htmlFor="igLink"
            className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Image / Reels / IGTV link
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
