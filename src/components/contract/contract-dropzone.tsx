"use client";

import { motion } from "framer-motion";
import { FileSignature, FileUp, Lock } from "lucide-react";
import { useDropzone, type FileRejection } from "react-dropzone";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { MAX_CONTRACT_BYTES } from "@/lib/schemas/contract-audit";
import { cn } from "@/lib/utils";

function rejectionMessage(rejections: FileRejection[]): string {
  const codes = rejections.flatMap((r) => r.errors.map((e) => e.code));
  if (codes.includes("too-many-files")) return "Unggah satu file kontrak saja";
  if (codes.includes("file-invalid-type")) return "Format file harus PDF";
  if (codes.includes("file-too-large")) return "File maksimal 10MB";
  return "File tidak dapat dibaca, coba file lain";
}

export function ContractDropzone({ onFile, disabled }: { onFile: (file: File) => void; disabled?: boolean }) {
  const { getRootProps, getInputProps, isDragActive, isDragReject, open } = useDropzone({
    accept: { "application/pdf": [".pdf"] },
    maxSize: MAX_CONTRACT_BYTES,
    multiple: false,
    noClick: true,
    disabled,
    onDropAccepted: ([file]) => file && onFile(file),
    onDropRejected: (rejections) => toast.error(rejectionMessage(rejections)),
  });

  return (
    <div
      {...getRootProps({
        className: cn(
          "group relative flex flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed bg-card px-6 py-14 text-center transition-all duration-300 sm:py-16",
          isDragActive && !isDragReject && "scale-[1.01] border-primary bg-primary/[0.04] shadow-lg",
          isDragReject && "border-danger bg-danger/[0.04]",
          !isDragActive && "hover:border-primary/50 hover:shadow-md",
        ),
      })}
    >
      <input {...getInputProps({ "aria-label": "Pilih file kontrak PDF" })} />
      <div aria-hidden className="bg-grid pointer-events-none absolute inset-0 opacity-60" />
      <motion.span
        animate={isDragActive ? { y: -6, scale: 1.08 } : { y: 0, scale: 1 }}
        className={cn(
          "bg-gradient-brand relative inline-flex size-16 items-center justify-center rounded-2xl text-white shadow-xl shadow-primary/30",
          isDragReject && "bg-none bg-danger shadow-danger/30",
        )}
      >
        {isDragActive ? <FileSignature className="size-7" /> : <FileUp className="size-7" />}
      </motion.span>
      <h2 className="relative mt-6 text-xl font-bold">
        {isDragReject ? "Format file harus PDF" : isDragActive ? "Lepaskan untuk mulai audit" : "Seret & lepas kontrak kerja Anda di sini"}
      </h2>
      <p className="relative mt-2 text-sm text-muted-foreground">
        Format PDF · Ukuran maksimal <span className="font-mono font-semibold text-foreground">10MB</span> · Bahasa Inggris atau Indonesia
      </p>
      <Button type="button" size="lg" className="relative mt-6" onClick={open} disabled={disabled} aria-label="Pilih file kontrak dari perangkat">
        <FileUp data-icon="inline-start" /> Unggah Kontrak
      </Button>
      <p className="relative mt-5 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
        <Lock className="size-3.5 text-success" aria-hidden />
        File PDF tidak disimpan — hanya hasil audit yang Anda simpan sendiri.
      </p>
    </div>
  );
}
