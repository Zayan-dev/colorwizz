import imageCompression from "browser-image-compression";
import { toast } from "react-toastify";

const base64ToBlob = (base64, mimeType) => {
  const byteCharacters = atob(base64.split(",")[1]); // Decode Base64 string
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += 512) {
    const slice = byteCharacters.slice(offset, offset + 512);

    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  return new Blob(byteArrays, { type: mimeType });
};


export const compressImage = async (imageFile) => {
  try {
    const options = {
      maxSizeMB: 1, // Set max size in MB
      maxWidthOrHeight: 1024, // Set max width/height
      useWebWorker: true, // Use web worker for faster processing
    };

    const blob = base64ToBlob(imageFile, "image/jpeg");
    const compressedFile = await imageCompression(blob, options);
    const compressedImageUrl = URL.createObjectURL(compressedFile); // Get compressed image URL

    // Convert image to base64 string
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onloadend = () => {
        const base64Image = reader.result;
        resolve(base64Image);
      };
      reader.onerror = reject;
      reader.readAsDataURL(compressedFile); // Convert to base64
    });
  } catch (error) {
    toast.error("Cannot compress image, please upload a smaller image")
    // console.error("Error compressing image:", error);
    throw error;
  }
};
