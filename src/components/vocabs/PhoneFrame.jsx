import React from 'react';

export default function PhoneFrame({ children, showFrame = true }) {
  if (!showFrame) return <>{children}</>;

  return (
    <div className="w-full max-w-[420px] bg-white min-h-screen sm:min-h-[860px] sm:rounded-[32px] sm:shadow-[0_24px_64px_-24px_rgba(0,0,0,0.25)] overflow-hidden flex flex-col relative border border-zinc-200/60 mx-auto">
      <div className="h-[44px] flex items-center justify-between px-6 pt-2 shrink-0">
        <span className="text-[15px] font-semibold tracking-tight">9:41</span>
        <div className="flex gap-1.5 items-center">
          <div className="w-4 h-2.5 bg-black rounded-[2px]" />
          <div className="w-4 h-2.5 border border-black rounded-[2px]" />
          <div className="w-6 h-3 rounded-[4px] border border-black flex items-center p-[1px]">
            <div className="w-[70%] h-full bg-black rounded-[2px]" />
          </div>
        </div>
      </div>
      {children}
      <div className="h-[24px] bg-white flex justify-center items-end pb-2 shrink-0">
        <div className="w-[120px] h-[4px] bg-black rounded-full" />
      </div>
    </div>
  );
}
