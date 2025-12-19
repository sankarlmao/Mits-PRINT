const CircleLoader = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/60">
      <div className="relative">
        <div className="h-16 w-16 rounded-full border-4 border-green-300 border-t-green-600 animate-spin" />
        <div className="absolute inset-0 rounded-full blur-md bg-green-400/40" />
      </div>
    </div>
  );
};

export default CircleLoader;