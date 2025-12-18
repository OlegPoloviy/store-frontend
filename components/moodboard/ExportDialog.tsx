"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ImageFormat } from "@/lib/util/exportToImage";
import { FileImage, Download } from "lucide-react";

interface ExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onExport: (format: ImageFormat, filename: string, quality: number) => void;
  loading?: boolean;
}

export function ExportDialog({
  open,
  onOpenChange,
  onExport,
  loading = false,
}: ExportDialogProps) {
  const [selectedFormat, setSelectedFormat] = useState<ImageFormat>("png");
  const [filename, setFilename] = useState("my-moodboard");
  const [quality, setQuality] = useState(90);

  const handleExport = () => {
    onExport(selectedFormat, filename, quality / 100);
  };

  const formats: { value: ImageFormat; label: string; description: string }[] =
    [
      {
        value: "png",
        label: "PNG",
        description: "Good quality,transparent background",
      },
      {
        value: "jpg",
        label: "JPG",
        description: "Good quality",
      },
      {
        value: "webp",
        label: "WebP",
        description: "Modern format",
      },
    ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileImage className="w-5 h-5" />
            Export Moodboard
          </DialogTitle>
          <DialogDescription>
            Choose format and settings for your moodboard export
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Filename Input */}
          <div className="space-y-2">
            <Label htmlFor="filename">File Name</Label>
            <Input
              id="filename"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              placeholder="my-moodboard"
              disabled={loading}
            />
          </div>

          {/* Format Selection */}
          <div className="space-y-3">
            <Label>Image Format</Label>
            <div className="space-y-2">
              {formats.map((format) => (
                <button
                  key={format.value}
                  onClick={() => setSelectedFormat(format.value)}
                  disabled={loading}
                  className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                    selectedFormat === format.value
                      ? "border-gray-900 bg-gray-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-gray-900">
                        {format.label}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {format.description}
                      </p>
                    </div>
                    {selectedFormat === format.value && (
                      <div className="w-5 h-5 rounded-full bg-gray-900 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-white" />
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Quality Slider (for JPG and WebP) */}
          {(selectedFormat === "jpg" || selectedFormat === "webp") && (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="quality">Quality</Label>
                <span className="text-sm text-gray-500">{quality}%</span>
              </div>
              <input
                id="quality"
                type="range"
                min="10"
                max="100"
                step="10"
                value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
                disabled={loading}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-gray-900"
              />
              <div className="flex justify-between text-xs text-gray-400">
                <span>Smaller file</span>
                <span>Better quality</span>
              </div>
            </div>
          )}

          {/* Preview Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-xs text-blue-800">
              💡 The image will be exported at 2x resolution for better quality
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleExport}
            disabled={loading || !filename.trim()}
            className="bg-gray-900 hover:bg-gray-800"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Export Image
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
