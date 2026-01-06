import { SIMPLE_STATUS } from "../constants/status";

const PrinterStatus = ({ printer }) => {
  const status =
    SIMPLE_STATUS[printer.status] || SIMPLE_STATUS.ERROR;

  const isReady = printer.status === "READY";

  return (
    <div
      className="w-full rounded-2xl border border-gray-200 
      bg-gradient-to-br from-gray-50 to-white
      px-4 py-3 shadow-sm hover:shadow-md transition-shadow"
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">
            {printer.name}
          </h3>

          {/* Type */}
          <p className="text-[11px] text-gray-500 mt-0.5">
            {printer.type}
          </p>

          {/* Status label */}
          <p className={`text-xs mt-1 ${status.text}`}>
            {status.label}
          </p>
        </div>

        {/* Status Dot */}
        <span
          className={`w-2.5 h-2.5 rounded-full ${status.color}
          shadow-[0_0_6px_rgba(0,0,0,0.15)]`}
        />
      </div>

      {/* Status Bar */}
      <div className="mt-3 w-full h-[4px] bg-gray-200/70 rounded-full overflow-hidden">
        <div
          className={`h-full ${status.color} transition-all duration-500 shadow-inner`}
          style={{ width: `${status.percent}%` }}
        />
      </div>

      {/* Reason + Centered Message */}
      {!isReady && (
        <div className="mt-4 text-xs text-center">
          <p className="text-gray-600">
            <span className="font-medium text-red-500">
              Reason:
            </span>{" "}
            {printer.reason || "Unavailable"}
          </p>

          <p className="text-gray-400 mt-2 italic">
            Try again later
          </p>
        </div>
      )}
    </div>
  );
};

export default PrinterStatus;
