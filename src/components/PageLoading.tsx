import React from "react";

export const PageLoading: React.FC = () => (
  <div className="flex flex-col items-center justify-center min-h-[400px] gap-8">
    <div className="relative w-24 h-24">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={`absolute w-8 h-8 rounded-full animate-ping`}
          style={{
            backgroundColor: ['#3B82F6', '#10B981', '#8e51ff'][i],
            top: '50%',
            left: '50%',
            transform: `rotate(${i * 120}deg) translateX(-100%) translateY(-50%)`,
            animationDelay: `${i * 0.2}s`,
          }}
        />
      ))}
    </div>
    <span className="text-gray-500 text-xl">加载中，请稍候...</span>
  </div>
);
