"use client";

import Image from "next/image";
import { useState } from "react";

export default function BackgroundRemover() {
  const rapidApiKey = process.env.NEXT_PUBLIC_RAPIDAPI_KEY as string;
  const rapidApiHost = process.env.NEXT_PUBLIC_RAPIDAPI_HOST_BG as string;

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageDimensions, setImageDimensions] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const [resultImage, setResultImage] = useState("");
  const [title, setTitle] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg("");
    setResultImage("");
    setTitle("");

    if (!selectedFile) {
      setErrorMsg("Pilih file gambar terlebih dahulu.");
      return;
    }

    const formData = new FormData();
    formData.append("image", selectedFile);

    const apiUrl = `https://${rapidApiHost}/v1/results?mode=fg-image`;

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "x-rapidapi-host": rapidApiHost,
          "x-rapidapi-key": rapidApiKey,
        },
        body: formData,
      });

      const data = await response.json();

      //response
      if (data.results && data.results.length > 0) {
        const result = data.results[0];
        if (result.status && result.status.code === "ok") {
          type Entity = {
            kind: string;
            image?: string;
          };

          const entity = result.entities.find(
            (ent: Entity) => ent.kind === "image"
          );
          if (entity && entity.image) {
            const imageData = entity.image;
            setResultImage(imageData);

            const img = new window.Image();
            img.src = `data:image/png;base64,${imageData}`;
            img.onload = () => {
              setImageDimensions({
                width: img.naturalWidth,
                height: img.naturalHeight,
              });
            };
          } else {
            setErrorMsg("Gagal mengambil hasil gambar.");
          }
          if (result.title) {
            setTitle(result.title);
          } else if (result.name) {
            setTitle(result.name);
          }
        } else {
          setErrorMsg(result.status?.message || "Proses gagal.");
        }
      } else {
        setErrorMsg("Proses gagal.");
      }
    } catch (error) {
      console.error("Error saat memproses gambar:", error);
      setErrorMsg("Terjadi error saat memproses gambar.");
    }
  };

  const handleDownload = () => {
    if (!resultImage) {
      setErrorMsg("Input gambar dulu.");
      return;
    }
    const link = document.createElement("a");
    link.href = `data:image/png;base64,${resultImage}`;
    link.download = title ? `${title}.png` : "result.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="pt-10 bg-white dark:bg-gray-900 px-4 pt-15">
      <h1 className="text-center text-xl font-semibold dark:text-white">
        Background Remover
      </h1>
      <form onSubmit={handleSubmit} className="mt-8 max-w-md mx-auto pb-10">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer dark:text-gray-400 dark:bg-gray-700 dark:border-gray-600"
          required
        />
        <button
          type="submit"
          className="mt-4 w-full bg-blue-700 text-white py-2 rounded hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Remove Background
        </button>
      </form>

      {errorMsg && (
        <div className="max-w-md mx-auto mt-4 text-center text-red-500">
          {errorMsg}
        </div>
      )}

      {resultImage && imageDimensions && (
        <div className="max-w-md mx-auto mt-6 text-center pb-10">
          {title && (
            <p className="mb-2 text-lg font-medium dark:text-white">{title}</p>
          )}
          <p className="mb-2 font-medium dark:text-white">Result Image:</p>
          <Image
            src={`data:image/png;base64,${resultImage}`}
            alt="Processed Image"
            width={imageDimensions.width}
            height={imageDimensions.height}
            className="mx-auto rounded shadow-lg"
          />
          <button
            type="submit"
            onClick={handleDownload}
            className="mt-5 w-full bg-blue-700 text-white py-2 rounded hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Download
          </button>
        </div>
      )}
    </div>
  );
}
