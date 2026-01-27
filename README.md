
# 📚 MindShelf 部署指南

这是一个基于 AI 驱动的极简读书笔记应用。您可以按照以下步骤将其部署到生产环境。

## 1. 准备工作
- 获取 [Gemini API Key](https://aistudio.google.com/app/apikey)。
- 确保本地安装了 Node.js (v18+)。

## 2. 部署到 Vercel (最快)
1. 将本项目代码上传到您的 GitHub 仓库。
2. 登录 [Vercel](https://vercel.com/)。
3. 点击 **"Add New"** -> **"Project"**。
4. 导入您的 GitHub 仓库。
5. **关键步骤**：在 "Environment Variables" 部分：
   - 添加 Name: `API_KEY`
   - 添加 Value: `您的Gemini_API_密钥`
6. 点击 **"Deploy"**。

## 3. 本地运行
如果您想在本地预览：
```bash
npm install
npm run dev
```

## 4. 技术栈
- **Frontend**: React 19 + Tailwind CSS
- **AI Engine**: Google Gemini 3 Flash
- **Storage**: Browser LocalStorage (隐私安全)
- **Icons**: Lucide/HeroIcons (SVG)
