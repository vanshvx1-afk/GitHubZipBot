require("dotenv").config();
const { Bot, InputFile, InlineKeyboard } = require("grammy");
const axios = require("axios");
const fs = require("fs");
const path = require("path");

// ── Config ──────────────────────────────────────────────────────────────────
const BOT_TOKEN = process.env.BOT_TOKEN;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || "";

if (!BOT_TOKEN) {
  console.error("❌ BOT_TOKEN is missing. Set it in your .env file.");
  process.exit(1);
}

const bot = new Bot(BOT_TOKEN);

const TEMP_DIR = path.join(__dirname, "temp");
if (!fs.existsSync(TEMP_DIR)) fs.mkdirSync(TEMP_DIR);

// ── Premium Emoji Helper ────────────────────────────────────────────────────
// Wraps a fallback emoji with a premium custom emoji tag for HTML parse mode
function pe(emojiId, fallback) {
  return `<tg-emoji emoji-id="${emojiId}">${fallback}</tg-emoji>`;
}

// ── Premium Emoji IDs ───────────────────────────────────────────────────────
const E = {
  PACKAGE:    "5924720918826848520",  // 📦
  MEMO:       "5960551395730919906",  // 📝
  GLOBE:      "5879585266426973039",  // 🌐
  STAR:       "5958376256788502078",  // ⭐️
  BRANCH:     "5449885771420934013",  // 🌱
  LICENSE:    "5956561916573782596",  // 📄
  SAVE:       "5884064642438795702",  // 💾
  LINK:       "5877465816030515018",  // 🔗
  WAVE:       "5994750571041525522",  // 👋
  BULB:       "5472146462362048818",  // 💡
  INFO:       "5879501875341955281",  // ℹ️
  WARN:       "5881702736843511327",  // ⚠️
  ERROR:      "5967355281057779430",  // ❌
  FOLDER:     "5875206779196935950",  // 📁
  DOWN:       "5899757765743615694",  // ⬇️
  UPLOAD:     "5877540355187937244",  // 📤
  CLOCK:      "5778605968208170641",  // 🕒
  ROCKET:     "5445284980978621387",  // 🚀
  CODE:       "5877318502947229960",  // 💻
  DIAMOND:    "5462902520215002477",  // 💎
  FIRE:       "6008118472066732010",  // 🔥
  CHECK:      "5805532930662996322",  // ✅
  FORK:       "5292226786229236118",  // 🔄
  NUM1:       "5836949564166246623",  // 1️⃣
  NUM2:       "5834838360106996653",  // 2️⃣
  NUM3:       "5836961770463302468",  // 3️⃣
  CHART:      "5875291072225087249",  // 📊
  LOCK:       "5832546462478635761",  // 🔒
};

// ── GitHub API Headers ──────────────────────────────────────────────────────
function githubHeaders() {
  const headers = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "GitHub-DL-Bot",
  };
  if (GITHUB_TOKEN) headers.Authorization = `token ${GITHUB_TOKEN}`;
  return headers;
}

// ── Parse GitHub URL ────────────────────────────────────────────────────────
function parseGithubUrl(text) {
  const regex =
    /(?:https?:\/\/)?(?:www\.)?github\.com\/([A-Za-z0-9_.-]+)\/([A-Za-z0-9_.-]+)/i;
  const match = text.match(regex);
  if (!match) return null;
  const repo = match[2].replace(/\.git$/, "");
  return { owner: match[1], repo };
}

// ── Fetch Repo Info ─────────────────────────────────────────────────────────
async function fetchRepoInfo(owner, repo) {
  const url = `https://api.github.com/repos/${owner}/${repo}`;
  const { data } = await axios.get(url, { headers: githubHeaders() });
  return data;
}

// ── Fetch Languages ─────────────────────────────────────────────────────────
async function fetchRepoLanguages(owner, repo) {
  const url = `https://api.github.com/repos/${owner}/${repo}/languages`;
  const { data } = await axios.get(url, { headers: githubHeaders() });
  return data;
}

// ── Download Zip ────────────────────────────────────────────────────────────
async function downloadZip(owner, repo, branch) {
  const url = `https://api.github.com/repos/${owner}/${repo}/zipball/${branch}`;
  const filePath = path.join(TEMP_DIR, `${owner}-${repo}.zip`);

  const response = await axios.get(url, {
    headers: githubHeaders(),
    responseType: "stream",
    maxRedirects: 5,
  });

  const writer = fs.createWriteStream(filePath);
  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on("finish", () => resolve(filePath));
    writer.on("error", reject);
  });
}

// ── Format File Size ────────────────────────────────────────────────────────
function formatSize(bytes) {
  if (bytes === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return (bytes / Math.pow(1024, i)).toFixed(2) + " " + units[i];
}

// ── Build Language Bar ──────────────────────────────────────────────────────
function buildLanguageList(languages) {
  const total = Object.values(languages).reduce((a, b) => a + b, 0);
  if (total === 0) return "N/A";

  return Object.entries(languages)
    .sort((a, b) => b[1] - a[1])
    .map(([lang, bytes]) => {
      const pct = ((bytes / total) * 100).toFixed(1);
      return `  • <b>${lang}</b> — ${pct}%`;
    })
    .join("\n");
}

// ── Build Caption ───────────────────────────────────────────────────────────
function buildCaption(repoInfo, languages, zipSize) {
  const name = repoInfo.full_name;
  const description = repoInfo.description || "<i>No description provided</i>";
  const stars = repoInfo.stargazers_count;
  const forks = repoInfo.forks_count;
  const branch = repoInfo.default_branch;
  const license = repoInfo.license?.spdx_id || "N/A";
  const langList = buildLanguageList(languages);

  return (
    `${pe(E.PACKAGE, "📦")} <b>${name}</b>\n\n` +
    `${pe(E.MEMO, "📝")} <b>Description:</b>\n${description}\n\n` +
    `${pe(E.GLOBE, "🌐")} <b>Languages:</b>\n${langList}\n\n` +
    `${pe(E.STAR, "⭐")} <b>Stars:</b> ${stars}   |   ${pe(E.FORK, "🔄")} <b>Forks:</b> ${forks}\n` +
    `${pe(E.BRANCH, "🌿")} <b>Branch:</b> ${branch}   |   ${pe(E.LICENSE, "📄")} <b>License:</b> ${license}\n` +
    `${pe(E.SAVE, "💾")} <b>Zip Size:</b> ${formatSize(zipSize)}`
  );
}

// ── /start Command ──────────────────────────────────────────────────────────
bot.command("start", async (ctx) => {
  await ctx.reply(
    `${pe(E.WAVE, "👋")} <b>Welcome to GitHub Downloader Bot!</b>\n\n` +
      `Send me a GitHub repository link and I'll download it as a <b>.zip</b> file for you.\n\n` +
      `<b>Example:</b>\n` +
      `<code>https://github.com/user/repo</code>\n\n` +
      `${pe(E.BULB, "💡")} You can also send just <code>owner/repo</code> format.`,
    { parse_mode: "HTML" }
  );
});

// ── /help Command ───────────────────────────────────────────────────────────
bot.command("help", async (ctx) => {
  await ctx.reply(
    `${pe(E.INFO, "ℹ️")} <b>How to use this bot</b>\n\n` +
      `${pe(E.NUM1, "1️⃣")}  Send a GitHub repository URL\n` +
      `     <code>https://github.com/owner/repo</code>\n\n` +
      `${pe(E.NUM2, "2️⃣")}  Or use the short format\n` +
      `     <code>owner/repo</code>\n\n` +
      `${pe(E.NUM3, "3️⃣")}  I'll fetch the repo info, download it as a <b>.zip</b>, and send it to you with all the details.\n\n` +
      `${pe(E.WARN, "⚠️")} <b>Note:</b> Telegram limits file uploads to <b>50 MB</b>. Large repos might not be deliverable.`,
    { parse_mode: "HTML" }
  );
});

// ── Handle Text Messages (GitHub Links) ─────────────────────────────────────
bot.on("message:text", async (ctx) => {
  const text = ctx.message.text.trim();

  // Try to parse as GitHub URL first
  let parsed = parseGithubUrl(text);

  // If not a URL, try owner/repo format
  if (!parsed) {
    const shortRegex = /^([A-Za-z0-9_.-]+)\/([A-Za-z0-9_.-]+)$/;
    const shortMatch = text.match(shortRegex);
    if (shortMatch) {
      parsed = { owner: shortMatch[1], repo: shortMatch[2].replace(/\.git$/, "") };
    }
  }

  if (!parsed) {
    await ctx.reply(
      `${pe(E.ERROR, "❌")} <b>Invalid input!</b>\n\n` +
        `Please send a valid GitHub repository link or use the <code>owner/repo</code> format.\n\n` +
        `<b>Examples:</b>\n` +
        `<code>https://github.com/owner/repo</code>\n` +
        `<code>owner/repo</code>`,
      { parse_mode: "HTML" }
    );
    return;
  }

  const { owner, repo } = parsed;
  let statusMsg;

  try {
    // ── Step 1: Send status ──
    statusMsg = await ctx.reply(
      `${pe(E.CLOCK, "⏳")} <b>Processing…</b>\n\n` +
        `${pe(E.FOLDER, "📂")} Fetching info for <code>${owner}/${repo}</code>`,
      { parse_mode: "HTML" }
    );

    // ── Step 2: Fetch repo info + languages in parallel ──
    const [repoInfo, languages] = await Promise.all([
      fetchRepoInfo(owner, repo),
      fetchRepoLanguages(owner, repo),
    ]);

    // ── Step 3: Update status — downloading ──
    await ctx.api.editMessageText(
      ctx.chat.id,
      statusMsg.message_id,
      `${pe(E.DOWN, "⬇️")} <b>Downloading…</b>\n\n` +
        `${pe(E.FOLDER, "📂")} <code>${repoInfo.full_name}</code>\n` +
        `${pe(E.BRANCH, "🌿")} Branch: <b>${repoInfo.default_branch}</b>`,
      { parse_mode: "HTML" }
    );

    // ── Step 4: Download zip ──
    const zipPath = await downloadZip(owner, repo, repoInfo.default_branch);
    const zipStats = fs.statSync(zipPath);
    const zipSizeBytes = zipStats.size;

    // Check Telegram 50 MB limit
    if (zipSizeBytes > 50 * 1024 * 1024) {
      fs.unlinkSync(zipPath);

      const largeLinkKb = new InlineKeyboard()
        .url("Download from GitHub", `${repoInfo.html_url}/archive/refs/heads/${repoInfo.default_branch}.zip`)
        .icon(E.DOWN);

      await ctx.api.editMessageText(
        ctx.chat.id,
        statusMsg.message_id,
        `${pe(E.ERROR, "❌")} <b>File too large!</b>\n\n` +
          `The zip file is <b>${formatSize(zipSizeBytes)}</b>, which exceeds Telegram's <b>50 MB</b> upload limit.`,
        { parse_mode: "HTML", reply_markup: largeLinkKb }
      );
      return;
    }

    // ── Step 5: Update status — uploading ──
    await ctx.api.editMessageText(
      ctx.chat.id,
      statusMsg.message_id,
      `${pe(E.UPLOAD, "📤")} <b>Uploading…</b>\n\n` +
        `${pe(E.FOLDER, "📂")} <code>${repoInfo.full_name}</code>\n` +
        `${pe(E.SAVE, "💾")} Size: <b>${formatSize(zipSizeBytes)}</b>`,
      { parse_mode: "HTML" }
    );

    // ── Step 6: Build caption & send document ──
    const caption = buildCaption(repoInfo, languages, zipSizeBytes);

    const keyboard = new InlineKeyboard()
      .url("View on GitHub", repoInfo.html_url)
      .icon(E.LINK);

    await ctx.replyWithDocument(
      new InputFile(zipPath, `${owner}-${repo}.zip`),
      {
        caption,
        parse_mode: "HTML",
        reply_markup: keyboard,
      }
    );

    // ── Step 7: Cleanup ──
    fs.unlinkSync(zipPath);
    await ctx.api.deleteMessage(ctx.chat.id, statusMsg.message_id);
  } catch (err) {
    console.error("Error processing request:", err.message);

    const errorText =
      err.response?.status === 404
        ? `${pe(E.ERROR, "❌")} <b>Repository not found!</b>\n\n<code>${owner}/${repo}</code> doesn't exist or is private.`
        : err.response?.status === 403
        ? `${pe(E.WARN, "⚠️")} <b>Rate limited!</b>\n\nGitHub API rate limit exceeded. Try again later.`
        : `${pe(E.ERROR, "❌")} <b>Something went wrong!</b>\n\n<code>${err.message}</code>`;

    if (statusMsg) {
      await ctx.api
        .editMessageText(ctx.chat.id, statusMsg.message_id, errorText, {
          parse_mode: "HTML",
        })
        .catch(() => {});
    } else {
      await ctx.reply(errorText, { parse_mode: "HTML" });
    }

    // Cleanup temp file if it exists
    const tempFile = path.join(TEMP_DIR, `${owner}-${repo}.zip`);
    if (fs.existsSync(tempFile)) fs.unlinkSync(tempFile);
  }
});

// ── Error Handler ───────────────────────────────────────────────────────────
bot.catch((err) => {
  console.error("Bot error:", err);
});

// ── Start Bot ───────────────────────────────────────────────────────────────
bot.start();
console.log("🤖 GitHub Downloader Bot is running...");
