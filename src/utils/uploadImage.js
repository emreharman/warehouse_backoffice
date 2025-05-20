import { supabase } from "../api/supabaseClient";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

export async function uploadProductImage(file) {
  if (file.size > MAX_FILE_SIZE) {
    throw new Error("Dosya boyutu 10MB’dan büyük olamaz.");
  }

  const fileExt = file.name.split(".").pop();
  const fileName = `${Date.now()}.${fileExt}`;
  const filePath = `${fileName}`;

  const { data: uploadData, error: uploadError } = await supabase.storage
    .from("warehouse")
    .upload(filePath, file);

  if (uploadError) {
    throw uploadError;
  }

  const { data, error: urlError } = supabase.storage
    .from("warehouse")
    .getPublicUrl(filePath);

  if (urlError) {
    throw urlError;
  }

  console.log("publicUrl", data.publicUrl);

  return data.publicUrl;
}
