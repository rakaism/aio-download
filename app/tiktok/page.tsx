"use client";

import Image from "next/image";
import { useState } from "react";

export default function TiktokDownloader() {
  const rapidApiKey = process.env.NEXT_PUBLIC_RAPIDAPI_KEY as string;
  const rapidApiHost = process.env.NEXT_PUBLIC_RAPIDAPI_HOST_TT as string;

  const [inputValue, setInputValue] = useState("");
  const [downloadUrl, setDownloadUrl] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [title, setTitle] = useState("");
  const [nickname, setNickname] = useState("");

  const handleSubmit = async () => {
    if (!inputValue.startsWith("http")) {
      alert("Masukkan link yang valid.");
      return;
    }

    // fetch url
    const apiUrl = `https://${rapidApiHost}/analysis?url=${encodeURIComponent(
      inputValue
    )}&hd=0`;

    try {
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "X-RapidAPI-Key": rapidApiKey,
          "X-RapidAPI-Host": rapidApiHost,
        },
      });

      const data = await response.json();
      // cek struktur response json
      if (data && data.code === 0 && data.data) {
        const dt = data.data;
        setThumbnail(dt.origin_cover || "");
        setDownloadUrl(dt.play || "");
        setTitle(dt.title || "");
        setNickname(dt.author?.nickname || "");
      } else {
        alert("Data tidak ditemukan.");
      }
    } catch (error) {
      console.error("Error saat fetch data.", error);
      alert("Terjadi error saat fetch data.");
    }
  };

  const handleDownload = () => {
    if (!downloadUrl) {
      alert(
        "Download link tidak tersedia. Silakan submit link terlebih dahulu."
      );
      return;
    }
    window.location.href = downloadUrl;
  };

  return (
    <div className="pt-15 bg-white dark:bg-gray-900">
      <h1 className="pt-5 text-center text-xl font-semibold dark:text-white pb-5">
        TikTok Downloader
      </h1>

      {/* menampilkan metadata */}
      {thumbnail && (
        <div className="max-w-md mx-auto mb-4">
          <Image
            src={thumbnail}
            alt="Thumbnail Media"
            className="mx-auto rounded shadow-lg"
          />
          {title && (
            <p className="text-center mt-2 font-medium dark:text-white">
              Title: {title}
            </p>
          )}
          {nickname && (
            <p className="text-center mt-1 font-medium dark:text-white">
              Nickname: {nickname}
            </p>
          )}
        </div>
      )}

      <div className="mt-10 max-w-md mx-auto mb-10 pb-5">
        <div className="relative z-0 w-full mb-5 group">
          <input
            type="text"
            name="ttLink"
            id="ttLink"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder="Masukkan link TikTok di sini"
            required
          />
          <label
            htmlFor="ttLink"
            className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            TikTok Link
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
