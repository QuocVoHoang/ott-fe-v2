"use client"

export default function useMessage() {
  const getFileType = (url: string): string => {
    const extension = url.split(".").pop()?.toLowerCase();
    if (!extension) return "unknown";
  
    const fileTypes: { [key: string]: string } = {
      image: "jpg|jpeg|png|gif|bmp|webp|svg",
      video: "mp4|webm|ogg|mkv|mov|avi",
      audio: "mp3|wav|ogg|flac|aac",
      pdf: "pdf",
      document: "doc|docx|odt|rtf",
      text: "txt|md|json|csv|log",
      code: "js|ts|py|java|cpp|html|css",
    };
  
    for (const [type, pattern] of Object.entries(fileTypes)) {
      if (new RegExp(`\\.(${pattern})$`, "i").test(url)) return type;
    }
  
    return "unknown";
  };

  return {
    getFileType: getFileType
  }
}