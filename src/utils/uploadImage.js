import { supabase } from "../api/supabaseClient";

import { v4 as uuidv4 } from "uuid"; // npm i uuid
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export async function uploadProductImage(file) {
  if (file.size > MAX_FILE_SIZE) {
    throw new Error("Dosya boyutu 10MB’dan büyük olamaz.");
  }

  const fileExt = file.name.split(".").pop();
  const uniqueId = uuidv4().split("-")[0]; // kısa UUID parçası
  const timestamp = Date.now();
  const fileName = `product-${timestamp}-${uniqueId}.${fileExt}`;
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

  return data.publicUrl;
}
