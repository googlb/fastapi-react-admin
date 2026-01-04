import React from "react";

interface PageLoadingProps {
  fullScreen?: boolean; // 新增属性：是否全屏
  tip?: string;
}

export const PageLoading: React.FC<PageLoadingProps> = ({
  fullScreen = false,
  tip = "加载中，请稍候..."
}) => {
  // 基础样式：flex布局，水平垂直居中
  const baseClasses = "flex flex-col items-center justify-center gap-8 transition-all duration-300 z-[9999]";

  // 样式变体
  // 全屏模式：固定定位，占满屏幕，背景通常加一点点模糊或遮罩
  const fullScreenClasses = "fixed inset-0 w-screen h-screen bg-white/80 backdrop-blur-sm";

  // 局部模式：占满父容器 (Content区域)，确保父容器有高度
  const contentClasses = "w-full h-full min-h-[400px]";

  return (
    <div className={`${baseClasses} ${fullScreen ? fullScreenClasses : contentClasses}`}>
      {/* 动画容器 */}
      <div className="relative w-24 h-24">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="absolute w-6 h-6 rounded-full animate-ping opacity-75"
            style={{
              backgroundColor: ['#3B82F6', '#10B981', '#8e51ff'][i],
              // 优化定位逻辑，确保视觉中心
              top: '50%',
              left: '50%',
              marginLeft: '-12px', // 抵消宽度的一半
              marginTop: '-12px',  // 抵消高度的一半
              transformOrigin: 'center center',
              transform: `rotate(${i * 120}deg) translate(32px)`, // 修改动画轨迹，让它围绕中心转
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
      </div>
      <span className="text-gray-500 font-medium tracking-wide">{tip}</span>
    </div>
  );
};
