"use client";

import { Eye, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  url: string;
};

export default function PDFViewer({ url, className }: Props) {
  const [show, setShow] = useState(true);
  return (
    <>
      <Button
        variant={"outline"}
        onClick={() => setShow(!show)}
        size={"icon"}
        className="m-2 hidden shrink-0 md:inline-flex"
      >
        {show ? <X size={20} /> : <Eye size={20} />}
      </Button>
      {show && (
        <div
          className={cn(
            "hidden h-full w-full max-w-sm overflow-hidden rounded-xl p-2 md:flex",
            className
          )}
        >
          <iframe src={url} className="h-full w-full rounded-md" />
        </div>
      )}
    </>
  );
}
