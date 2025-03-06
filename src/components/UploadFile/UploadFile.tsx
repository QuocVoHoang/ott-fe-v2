"use client";

import { useRef } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { API_SERVER } from "@/constants/constants";
import { Paperclip } from "lucide-react";
import useSnackbar from "../Snackbar/hooks/useSnackbar";

interface Props {
  onChangeFileUrl: (url: string) => void
}

type FormData = {
  file: FileList;
};

export default function UploadFile({
  onChangeFileUrl
}: Props) {
  const { register, setValue } = useForm<FormData>();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const {
    setShowLeftSnackbar
  } = useSnackbar()

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setShowLeftSnackbar(true, "#fa645a", "❌ File should be < 5MB.")
      return;
    }

    setValue("file", event.target.files as FileList);

    const time = new Date();
    const uniqueFilename = `${time.toISOString()}-2025-${file.name}`;

    const formData = new FormData();
    formData.append("file", file, uniqueFilename);

    try {
      const response = await axios.post(`${API_SERVER}/bucket/upload/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (response) {
        setShowLeftSnackbar(true, "#5afa82", `✅ Upload successed.`)
        onChangeFileUrl(response.data.url)
      }
    } catch (error) {
      console.error(error);
      setShowLeftSnackbar(true, "#fa645a", "❌ Upload failed.")
    }

    event.target.value = "";
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
      fileInputRef.current.click();
    }
  };

  return (
    <div 
      className="w-[50px] h-[50px] flex justify-center items-center cursor-pointer rounded-full hover:bg-[#a6cbeb] transition-all duration-300"
      onClick={triggerFileInput}  
    >
      <div className="relative">
        <input
          type="file"
          multiple={false}
          {...register("file")}
          ref={(e) => {
            register("file").ref(e);
            fileInputRef.current = e;
          }}
          onChange={handleFileChange}
          className="hidden"
        />

        <div className="cursor-pointer">
          <Paperclip className="text-gray-600" />
        </div>
      </div>
    </div>
  );
}
