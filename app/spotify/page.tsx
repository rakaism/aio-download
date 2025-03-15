"use client";

import { useState } from "react";

export default function Spotify() {
  const [inputValue, setInputValue] = useState("");
  const [trackId, setTrackId] = useState("");

  // buat embed player
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let id = "";
    try {
      if (inputValue.startsWith("http")) {
        const urlObj = new URL(inputValue);
        const parts = urlObj.pathname.split("/");
        if (parts.length >= 3 && parts[1] === "track") {
          id = parts[2];
        } else {
          id = inputValue;
        }
      } else {
        id = inputValue;
      }
      // ngambil bagian "?" di link
      if (id.includes("?")) {
        id = id.split("?")[0];
      }
      setTrackId(id);
    } catch (error) {
      console.error("Invalid URL:", error);
      setTrackId(inputValue);
    }
  };

  // fungsi download
  const handleDownload = async () => {
    if (!inputValue.startsWith("http")) {
      alert("Masukkan link lagu lengkap yang valid untuk download.");
      return;
    }

    // manggil api route
    const apiUrl = `/api/download?songId=${encodeURIComponent(inputValue)}`;
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      if (data.success && data.data && data.data.downloadLink) {
        window.location.href = data.data.downloadLink;
      } else {
        alert("Download gagal. Silakan coba lagi.");
      }
    } catch (error) {
      console.error("Error saat download:", error);
      alert("Download gagal, terjadi error.");
    }
  };

  // ngambil trackId buat embed player
  const embedSrc = trackId
    ? `https://open.spotify.com/embed/track/${trackId}?utm_source=generator`
    : "";

  return (
    <div className="pt-10 bg-white dark:bg-gray-900">
      {trackId && (
        <iframe
          className="flex justify-self-center"
          style={{ borderRadius: "12px" }}
          src={embedSrc}
          width="60%"
          height="352"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
        ></iframe>
      )}
      <h1 className="pt-5 text-center text-xl font-semibold dark:text-white">
        Embed Player
      </h1>

      <form onSubmit={handleSubmit} className="mt-10 max-w-md mx-auto mb-10">
        <div className="relative z-0 w-full mb-5 group">
          <input
            type="text"
            name="songLink"
            id="songLink"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder="Place the song link here"
            required
          />
          <label
            htmlFor="songLink"
            className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Song link
          </label>
        </div>
        <div className="flex flex-nowrap justify-center gap-6 mb-5">
          <button
            type="submit"
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
      </form>
    </div>
  );
}
