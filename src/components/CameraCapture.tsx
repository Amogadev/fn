"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "./ui/button";
import { Camera, RefreshCcw, Image as ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CameraCaptureProps {
  onCapture: (dataUri: string) => void;
}

export function CameraCapture({ onCapture }: CameraCaptureProps) {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
      });
      setStream(mediaStream);
      setCapturedImage(null);
    } catch (err) {
      console.error("Error accessing camera:", err);
      toast({
        title: "Camera Error",
        description:
          "Could not access camera. Please check permissions and try again.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }
    return () => {
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, [stream]);

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext("2d");
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUri = canvas.toDataURL("image/jpeg");
        setCapturedImage(dataUri);
        onCapture(dataUri);
        stopCamera();
      }
    }
  };

  const stopCamera = () => {
    stream?.getTracks().forEach((track) => track.stop());
    setStream(null);
  };

  const resetCapture = () => {
    setCapturedImage(null);
    onCapture("");
    startCamera();
  };

  return (
    <div className="flex flex-col items-center w-full gap-4">
      <div className="relative w-full overflow-hidden border rounded-lg aspect-video bg-muted">
        {capturedImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={capturedImage}
            alt="Captured"
            className="object-cover w-full h-full"
          />
        ) : (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className={`w-full h-full object-cover ${stream ? "" : "hidden"}`}
          />
        )}
        {!stream && !capturedImage && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <Camera className="w-12 h-12 mb-2 text-muted-foreground" />
            <p className="text-muted-foreground">Camera is off</p>
          </div>
        )}
      </div>
      <div className="flex items-center gap-2">
        {!stream && !capturedImage && (
          <Button onClick={startCamera}>
            <Camera className="w-4 h-4 mr-2" />
            Start Camera
          </Button>
        )}
        {stream && (
          <Button onClick={captureImage}>
            <ImageIcon className="w-4 h-4 mr-2" />
            Capture Photo
          </Button>
        )}
        {capturedImage && (
          <Button variant="outline" onClick={resetCapture}>
            <RefreshCcw className="w-4 h-4 mr-2" />
            Retake
          </Button>
        )}
      </div>
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
