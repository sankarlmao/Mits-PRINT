import { useEffect, useRef, useState } from "react";
import { FiFileText, FiCheckCircle, FiUploadCloud } from "react-icons/fi";

export default function UploadProgressBar({ file, progress ,allUploaded}) {
  const startTime = useRef(Date.now());
  const lastLoaded = useRef(0);
  const lastTime = useRef(Date.now());

  const [elapsed, setElapsed] = useState(0);
  const [speed, setSpeed] = useState(0);

  useEffect(() => {
    if (progress === 100) return;

    const timer = setInterval(() => {
      const now = Date.now();
      setElapsed((now - startTime.current) / 1000);

      const uploadedBytes = (progress / 100) * file.size;
      const deltaBytes = uploadedBytes - lastLoaded.current;
      const deltaTime = (now - lastTime.current) / 1000;

      if (deltaTime > 0) {
        setSpeed(deltaBytes / deltaTime);
      }

      lastLoaded.current = uploadedBytes;
      lastTime.current = now;
    }, 500);

    return () => clearInterval(timer);
  }, [progress, file.size]);

  const uploadedBytes = (progress / 100) * file.size;
  const remainingBytes = file.size - uploadedBytes;
  const remainingTime = speed > 0 ? remainingBytes / speed : null;

 
  if (allUploaded) {
    return (
      <div className="flex min-h-[240px] w-full max-w-sm flex-col items-center justify-center rounded-2xl bg-white px-6 py-8 shadow-lg">
        <FiCheckCircle className="mb-4 text-6xl text-green-500" />
        <p className="text-lg font-semibold text-gray-800">
          Upload Successful
        </p>
        <p className="mt-1 text-sm text-gray-500">
          All files have been sent to MITS Store PC 
        </p>

        
      </div>
    );
  }

  // uploading UI stays unchanged


  /* ⬆️ UPLOADING VIEW */
  return (
    <div className="flex min-h-[260px] w-full max-w-sm flex-col justify-between rounded-2xl bg-white px-6 py-6 shadow-lg">

      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50">
          <FiUploadCloud className="text-xl text-blue-600" />
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-800">
            Uploading file
          </p>
          <p className="text-xs text-gray-500">
            Please don’t close this window
          </p>
        </div>
      </div>

      {/* File */}
      <div className="mt-6 flex items-center gap-3 rounded-xl border border-gray-200 p-3">
        <FiFileText className="text-2xl text-gray-500" />
        <div className="flex-1 overflow-hidden">
          <p className="truncate text-sm font-medium text-gray-800">
            {file.name}
          </p>
          <p className="text-xs text-gray-500">
            {(file.size / 1024 / 1024).toFixed(2)} MB
          </p>
        </div>
        <span className="text-sm font-semibold text-blue-600">
          {progress}%
        </span>
      </div>

      {/* Progress Bar */}
      <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-gray-200">
        <div
          className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Stats */}
      <div className="mt-4 grid grid-cols-2 gap-4 text-xs text-gray-600">
        <div>
          <p className="text-gray-400">Speed</p>
          <p className="font-medium text-gray-800">
            {(speed / 1024 / 1024).toFixed(2)} MB/s
          </p>
        </div>
        <div>
          <p className="text-gray-400">Remaining</p>
          <p className="font-medium text-gray-800">
            {remainingTime ? `${remainingTime.toFixed(1)}s` : "--"}
          </p>
        </div>
      </div>
    </div>
  );
}
