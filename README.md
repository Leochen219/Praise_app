# 📨 匿名反馈 (Anonymous Feedback)

> 创建私密房间，分享链接给朋友，收集最真实的匿名评价。

## 💡 为什么做这个？

在日常生活和工作中，我们很难了解他人对自己的真实评价。同事、朋友往往碍于情面不会说出真心话。**匿名反馈** 通过"开房"模式，让你在小圈子里安全地收集匿名评价，帮助你了解更真实的自己。

## ✨ 核心功能

- 🏠 **创建房间** — 设置主题（如"对我演讲的反馈"），自动生成6位房间码
- 🔗 **一键分享** — 把房间码或链接发给朋友，他们无需注册即可加入
- ✍️ **完全匿名** — 留言者身份完全保密，不记录任何个人信息
- 📬 **异步接收** — 你不在线也能收到留言，下次登录即可查看
- 🔴 **未读提醒** — 新消息红色标记，一目了然
- 🔒 **小圈子私密** — 只有知道房间码的人才能进入，防止外人闯入

## 🛠 技术栈

| 层面 | 技术 |
|------|------|
| 前端 | Next.js 16 (App Router) + React 19 + Tailwind CSS 4 |
| 后端 | Next.js API Routes + TypeScript |
| 数据库 | SQLite (本地) / Turso (生产) |
| 认证 | JWT (jose) + bcryptjs |
| 部署 | Vercel + Turso |

## 🚀 快速开始

### 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 打开浏览器
# http://localhost:3000
```

无需配置数据库，自动使用本地 SQLite 文件。

### 部署到 Vercel

1. Fork 本仓库
2. 在 [Turso](https://turso.tech) 创建免费数据库
3. 在 Vercel 导入项目，设置环境变量：
   - `JWT_SECRET` — 随机密钥
   - `TURSO_DATABASE_URL` — Turso 数据库地址
   - `TURSO_AUTH_TOKEN` — Turso 认证令牌
4. 部署！

## 📁 项目结构

```
src/
├── app/
│   ├── page.tsx                 # 首页
│   ├── login/page.tsx           # 登录
│   ├── register/page.tsx        # 注册
│   ├── join/page.tsx            # 加入房间
│   ├── dashboard/page.tsx       # 仪表盘（我的房间）
│   ├── dashboard/rooms/[id]/    # 房间详情（查看留言）
│   ├── room/[code]/page.tsx     # 匿名留言页面
│   └── api/                     # API 路由
│       ├── auth/                # 注册/登录/登出
│       └── rooms/               # 房间和留言 CRUD
├── lib/
│   ├── db.ts                    # 数据库连接
│   ├── auth.ts                  # JWT + 密码哈希
│   ├── queries.ts               # 数据库查询封装
│   └── room-code.ts             # 房间码生成
├── middleware.ts                 # 认证中间件
└── types/index.ts               # 类型定义
```

## 🔄 工作流程

```
房主                          朋友（无需注册）
  │                               │
  ├─ 注册/登录                    │
  ├─ 创建房间（获得房间码）         │
  ├─ 分享房间码 ──────────────→  │
  │                               ├─ 输入房间码加入
  │                               ├─ 写匿名留言 ✍️
  │                               └─ 发送 ✅
  ├─ 登录查看留言 📬              │
  ├─ 看到未读标记 🔴              │
  └─ 获得真实反馈 🎉              │
```

## 📄 License

MIT
