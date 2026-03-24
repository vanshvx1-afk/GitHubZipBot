<div align="center">

# 🤖 GitHubZipBot

<img src="https://readme-typing-svg.herokuapp.com?font=Fira+Code&size=32&duration=2800&pause=2000&color=A9FEF7&center=true&vCenter=true&width=940&lines=Download+GitHub+Repos+Instantly!;Send+Repos+as+ZIP+to+Telegram!;Fast+%7C+Simple+%7C+Powerful" alt="Typing SVG" />

[![Telegram Bot](https://img.shields.io/badge/Telegram-Bot-blue?style=for-the-badge&logo=telegram)](https://t.me/your_bot_username)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![grammY](https://img.shields.io/badge/grammY-Framework-yellow?style=for-the-badge)](https://grammy.dev/)
[![License](https://img.shields.io/badge/License-ISC-green?style=for-the-badge)](LICENSE)

<p align="center">
  <img src="https://user-images.githubusercontent.com/74038190/212284100-561aa473-3905-4a80-b561-0d28506553ee.gif" width="700">
</p>

### 💫 A powerful Telegram bot that downloads GitHub repositories as ZIP files with rich metadata

[Features](#-features) • [Demo](#-demo) • [Setup](#-setup) • [Usage](#-usage) • [Contact](#-connect-with-me)

<img src="https://user-images.githubusercontent.com/74038190/212284115-f47cd8ff-2ffb-4b04-b5bf-4d1c14c0247f.gif" width="1000">

</div>

## ✨ Features

<div align="center">

| Feature | Description |
|---------|-------------|
| 🔗 **Smart URL Parsing** | Accepts full GitHub URLs or `owner/repo` shorthand |
| 📦 **Zip Download** | Downloads the default branch as a zip file instantly |
| 📝 **Rich Captions** | Displays name, description, languages, stars, forks & more |
| 📊 **Language Breakdown** | Beautiful percentage-based language composition |
| ⚡ **Live Progress** | Real-time status updates while processing |
| 🎨 **Premium Emojis** | Uses Telegram premium custom emojis for polish |
| ⚠️ **Error Handling** | Friendly messages for invalid repos & rate limits |
| 🚀 **Lightning Fast** | Optimized performance for quick downloads |

</div>

<div align="center">
  <img src="https://user-images.githubusercontent.com/74038190/212284158-e840e285-664b-44d7-b79b-e264b5e54825.gif" width="400">
</div>

## 🎬 Demo

<div align="center">

### 🔥 See It In Action!

Simply send a GitHub repo link and get instant results:

```
You: https://github.com/expressjs/express
```

```
Bot: 📦 Downloading express...
     ⚡ Processing...
     ✅ Done! Sending file...
```

<img src="https://user-images.githubusercontent.com/74038190/216649417-9acc58df-9186-4132-ad43-819a57babb67.gif" width="200">

</div>

## 🛠 Setup

<details>
<summary><b>📋 Prerequisites</b></summary>

- Node.js v16 or higher
- A Telegram Bot Token (get from [@BotFather](https://t.me/BotFather))
- (Optional) GitHub Personal Access Token

</details>

### 1️⃣ Clone the repository

```bash
git clone https://github.com/vanshvx1-afk/GitHubZipBot
cd GitHubZipBot
```

### 2️⃣ Install dependencies

```bash
npm install
```

<div align="center">
  <img src="https://user-images.githubusercontent.com/74038190/212257467-871d32b7-e401-42e8-a166-fcfd7baa4c6b.gif" width="100">
</div>

### 3️⃣ Configure environment variables

```bash
cp .env.example .env
```

Edit `.env` file:

```env
BOT_TOKEN=your_telegram_bot_token_here
GITHUB_TOKEN=your_github_personal_access_token  # optional
```

> 💡 **Pro Tip:** GitHub token increases rate limit from **60** to **5,000** requests/hour!

### 4️⃣ Start the bot

```bash
npm start
```

<div align="center">

### 🎉 Your bot is now live!

<img src="https://user-images.githubusercontent.com/74038190/213910845-af37a709-8995-40d6-be59-724526e3c3d7.gif" width="300">

</div>

## 📖 Usage

<div align="center">

### 🚀 Three Simple Steps

</div>

1. **Open** your bot on Telegram
2. **Send** a GitHub repository link:
   ```
   https://github.com/expressjs/express
   ```
   or use shorthand:
   ```
   expressjs/express
   ```
3. **Receive** the ZIP file with detailed metadata!

### 📦 Example Output

The bot sends a `.zip` file with a caption containing:

<div align="center">

| Info | Description |
|------|-------------|
| 📦 | Repository name |
| 📝 | Project description |
| 🌐 | Languages (with percentages) |
| ⭐ | Stars and 🔄 Forks |
| 🌿 | Branch info |
| 📄 | License type |
| 💾 | ZIP file size |
| 🔗 | Inline button to view on GitHub |

</div>

<div align="center">
  <img src="https://user-images.githubusercontent.com/74038190/212284136-03988914-d899-44b4-b1d9-4eeccf656e44.gif" width="400">
</div>

## 📁 Project Structure

```
GitHubZipBot/
├── 📜 bot.js           # Main bot logic
├── 🔐 .env             # Environment variables (not committed)
├── 📋 .env.example     # Template for .env
├── 🚫 .gitignore       # Git ignore rules
├── 📦 package.json     # Dependencies
└── 📖 README.md        # You are here!
```

## ⚠️ Limitations

<div align="center">

| Limitation | Details |
|------------|---------|
| 📤 **File Size** | 50 MB max (Telegram limit) |
| 🔒 **Private Repos** | Requires GitHub token with permissions |
| ⏱️ **Rate Limit** | 60/hr without token, 5000/hr with token |

> 💡 For repos > 50MB, bot provides direct GitHub download link!

</div>

## 🤝 Connect With Me

<div align="center">

### 📱 Let's Stay Connected!

<a href="https://t.me/botsarefather">
  <img src="https://img.shields.io/badge/Telegram_Channel-2CA5E0?style=for-the-badge&logo=telegram&logoColor=white" alt="Telegram Channel"/>
</a>
<a href="https://t.me/itsukiarai">
  <img src="https://img.shields.io/badge/Contact_Me-2CA5E0?style=for-the-badge&logo=telegram&logoColor=white" alt="Contact"/>
</a>
<a href="https://vanshcz.online">
  <img src="https://img.shields.io/badge/Portfolio-FF5722?style=for-the-badge&logo=google-chrome&logoColor=white" alt="Portfolio"/>
</a>

<br><br>

**📢 Join my Telegram channel:** [@botsarefather](https://t.me/botsarefather)  
**💬 Contact me:** [@itsukiarai](https://t.me/itsukiarai)  
**🌐 Portfolio:** [vanshcz.online](https://vanshcz.online)

<img src="https://user-images.githubusercontent.com/74038190/212284158-e840e285-664b-44d7-b79b-e264b5e54825.gif" width="300">

</div>

## 📜 License

<div align="center">

**ISC License**

Made with ❤️ by [Vansh](https://vanshcz.online)

<img src="https://user-images.githubusercontent.com/74038190/212284100-561aa473-3905-4a80-b561-0d28506553ee.gif" width="500">

### ⭐ Star this repo if you find it useful!

<img src="https://user-images.githubusercontent.com/74038190/216122041-518ac897-8d92-4c6b-9b3f-ca01dcaf38ee.png" width="200" />

---

<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&height=100&section=footer"/>
</p>

</div>
