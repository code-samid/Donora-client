// Uploads an image file to imgbb and returns the hosted URL, per spec
// ("use imageBB to upload the user avatar"). Requires VITE_IMGBB_API_KEY.
export async function uploadToImgbb(file) {
  const apiKey = import.meta.env.VITE_IMGBB_API_KEY;
  if (!apiKey || apiKey === "your_imgbb_api_key_here") {
    throw new Error("imgbb API key is not configured (VITE_IMGBB_API_KEY)");
  }
  const formData = new FormData();
  formData.append("image", file);

  const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
    method: "POST",
    body: formData,
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.error?.message || "Image upload failed");
  return data.data.url;
}
