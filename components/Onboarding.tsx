
import React from 'react';

interface OnboardingProps {
  onStart: () => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onStart }) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 bg-white overflow-y-auto">
      <div className="max-w-2xl w-full space-y-12">
        <div className="text-center">
          <div className="inline-block px-4 py-1.5 bg-zinc-100 rounded-full text-xs font-bold tracking-widest uppercase text-zinc-600 mb-6">
            Product Concept MVP
          </div>
          <h1 className="text-5xl font-black text-zinc-900 tracking-tight mb-4">MindShelf</h1>
          <p className="text-xl text-zinc-500 leading-relaxed font-serif italic">
            "Read with intention. Remember with precision."
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 text-left">
          <section>
            <h2 className="text-lg font-bold flex items-center gap-2 mb-3">
              <span className="w-6 h-6 bg-zinc-900 text-white text-[10px] rounded-full flex items-center justify-center">1</span>
              典型用户画像
            </h2>
            <p className="text-zinc-600 pl-8 border-l-2 border-zinc-100">
              追求高效知识内化、希望将零散感悟系统化构建为个人知识库的深度阅读者与终身学习者。
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold flex items-center gap-2 mb-3">
              <span className="w-6 h-6 bg-zinc-900 text-white text-[10px] rounded-full flex items-center justify-center">2</span>
              场景故事
            </h2>
            <p className="text-zinc-600 pl-8 border-l-2 border-zinc-100">
              用户在咖啡馆深度阅读《深度工作》时，通过 MindShelf 快速记录对“专注力”的新理解，并点击“AI Refine”自动补充相关概念链接和核心论点提炼，完成知识的高效吸收。
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold flex items-center gap-2 mb-3">
              <span className="w-6 h-6 bg-zinc-900 text-white text-[10px] rounded-full flex items-center justify-center">3</span>
              MVP 功能列表
            </h2>
            <ul className="list-disc pl-14 text-zinc-600 space-y-2">
              <li><strong>书架管理</strong>：建立个人书单，追踪阅读进度与书籍基本信息。</li>
              <li><strong>沉浸笔记</strong>：极简文本编辑界面，支持多级回溯，专注于内容产出。</li>
              <li><strong>AI 灵感辅助</strong>：集成 Gemini 3 Flash，为笔记内容提供摘要、反向观点或背景补充。</li>
              <li><strong>本地化存储</strong>：基于 LocalStorage 的数据持久化，确保隐私与响应速度。</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold flex items-center gap-2 mb-3">
              <span className="w-6 h-6 bg-zinc-900 text-white text-[10px] rounded-full flex items-center justify-center">4</span>
              交互流程
            </h2>
            <ul className="list-decimal pl-14 text-zinc-600 space-y-2">
              <li><strong>录入</strong>：在书架页添加当前正在阅读的书籍。</li>
              <li><strong>创作</strong>：点击进入书籍详情，直接在底部的灵感框输入笔记。</li>
              <li><strong>增强</strong>：点击 AI 按钮，获取模型对笔记的深度提炼。</li>
              <li><strong>回顾</strong>：在纵向流式视图中浏览按时间倒序排列的知识点。</li>
            </ul>
          </section>
        </div>

        <div className="flex justify-center pt-8">
          <button 
            onClick={onStart}
            className="px-10 py-4 bg-zinc-900 text-white font-bold rounded-xl hover:bg-zinc-800 transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
          >
            Start Reading Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
