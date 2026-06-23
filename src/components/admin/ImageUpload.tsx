import { useState } from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

type ImageUploadProps = {
  value: string;
  onChange: (url: string) => void;
  label?: string;
};

export function ImageUpload({ value, onChange, label = "Upload Image" }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Upload failed");
      }

      const { url } = await response.json();
      onChange(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-2">
      <label className="block space-y-2">
        <span className="text-sm font-medium">{label}</span>
        <div className="relative flex items-center gap-3">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading}
            className="flex-1 rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground file:mr-2 file:rounded file:border-0 file:bg-primary file:px-2 file:py-1 file:text-sm file:font-medium file:text-primary-foreground"
          />
        </div>
        {error && <p className="text-xs text-destructive">{error}</p>}
      </label>

      {value && (
        <div className="flex items-center gap-3 rounded-lg border border-border bg-secondary/30 p-3">
          <img src={value} alt="Uploaded" className="h-16 w-16 rounded object-cover" />
          <div className="flex-1">
            <p className="break-all text-xs text-muted-foreground">{value}</p>
            <button
              type="button"
              onClick={() => onChange("")}
              className="mt-1 text-xs text-destructive hover:underline"
            >
              Remove
            </button>
          </div>
        </div>
      )}

      {uploading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Upload className="h-4 w-4 animate-pulse" />
          Uploading...
        </div>
      )}
    </div>
  );
}
