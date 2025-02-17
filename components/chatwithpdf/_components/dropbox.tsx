"use client";

import { IconLoader2 } from "@tabler/icons-react";
import { UploadCloudIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import useLoginForm from "@/hooks/user-login-form";

export function Dropbox({
  user,
  limitReached,
}: {
  user: any;
  limitReached: boolean;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const loginForm = useLoginForm();
  const path = usePathname();

  const onDrop = useCallback((acceptedFiles: any) => {
    if (acceptedFiles.length > 1) {
      toast.error("Only one file is allowed");
      return;
    }
    if (acceptedFiles[0].type !== "application/pdf") {
      toast.error("Only PDF files are allowed");
      return;
    }
    if (acceptedFiles[0].size > 10 * 1024 * 1024) {
      toast.error("File size should be less than 2MB");
      return;
    }
    setFile(acceptedFiles[0]);
    onSubmit(acceptedFiles[0]);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const onSubmit = async (pdf_file: File) => {
    if (!user?.id) {
      loginForm.onOpen();
      toast.error("User not found");
      return;
    }
    if (limitReached) {
      toast.error(
        "You've reached the daily message limit. Please try again tomorrow."
      );
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      if (!pdf_file) {
        toast.error("Please select a file");
        return;
      }
      const date = Date.now().toString();
      const document_id =
        pdf_file.name.replace(" ", "-").substring(0, 10) + "-" + date;
      formData.append(document_id, pdf_file);
      formData.append("document_name", pdf_file.name);
      formData.append("document_id", document_id);
      formData.append("userId", user?.id);
      formData.append("app_slug", "chatwithpdf");
      formData.append("path", path);

      const response = await fetch("/api/chatwithpdf/store", {
        method: "POST",
        body: formData,
      }).then((res) => res.json());

      if (response.success && response.data) {
        toast.success(response.message);
        router.push(`/chatwithpdf/chat/${response.data[0].id}`);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("Something went wrong! Try again");
    } finally {
      setLoading(false);
      setFile(null);
    }
  };

  return (
    <>
      {limitReached && (
        <div className="mx-auto mt-8 grid h-44 w-full max-w-md place-items-center rounded-2xl border border-slate-400 px-16 text-center text-slate-400">
          <p className="">
            Daily message limit reached. Please try again tomorrow. 😓
          </p>
        </div>
      )}
      {!limitReached && (
        <div
          {...getRootProps()}
          className={`mx-auto mt-8 grid h-44 w-full max-w-md place-items-center rounded-2xl border border-slate-400 px-16 text-center text-slate-400 ${
            limitReached ? "cursor-not-allowed opacity-50" : ""
          }`}
        >
          <input {...getInputProps()} accept=".pdf" />
          {isDragActive ? (
            <div className="">
              <p>Drop the files here ...</p>
            </div>
          ) : !!file ? (
            <div className="space-y-3">
              {loading && (
                <IconLoader2 className="mx-auto h-6 w-6 animate-spin" />
              )}
              <p className="break-all">{file.name}</p>
              <p>{(file.size / (1024 * 1024)).toFixed(2)}MB</p>
            </div>
          ) : (
            <div className="space-y-3">
              <p>Drag & drop some files here, or click to select files</p>
              <UploadCloudIcon className="mx-auto h-6 w-6 fill-slate-400" />
            </div>
          )}
        </div>
      )}
    </>
  );
}
