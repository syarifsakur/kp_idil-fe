import React, { useEffect, useState } from "react";
import { Progress } from "antd";
import logo from "/src/assets/logo.jpg"; // sesuaikan path

interface Props {
  setIsLoading?: (value: boolean) => void; // optional (auto close / manual)
}

const Loading: React.FC<Props> = ({ setIsLoading }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + 20;
      });
    }, 250);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Auto close jika setIsLoading disediakan
    if (progress === 100 && setIsLoading) {
      setTimeout(() => setIsLoading(false), 350);
    }
  }, [progress, setIsLoading]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white/90 backdrop-blur-md z-50 animate-fade-in">
      <div className="flex flex-col items-center space-y-6">
        {/* Logo */}
        <div className="p-4 rounded-full bg-white shadow-lg">
          <img
            src={logo}
            alt="Honda Logo"
            className="w-20 h-20 animate-bounce"
            style={{ objectFit: "contain" }}
          />
        </div>

        {/* Progress */}
        <div className="w-56">
          <Progress
            percent={progress}
            showInfo
            strokeWidth={12}
            strokeColor="#e60000"
          />
        </div>

        {/* Loading Text */}
        <p className="text-gray-700 text-sm tracking-wide animate-pulse">
          Memuat sistem...
        </p>
      </div>
    </div>
  );
};

export default Loading