const timeElement = document.getElementById('datetime');

if (timeElement != null) {
    function updateTime() {
        const now = new Date();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');

        timeElement.textContent = `✦ ${month}/${day} ${hours}:${minutes}:${seconds}`;
    }

    updateTime();

    function scheduleNext() {
        const now = new Date();
        const delay = 1000 - now.getMilliseconds();
        setTimeout(() => {
            updateTime();
            scheduleNext(); // 异步递归，不会爆栈
        }, delay);
    }

    scheduleNext();
}

function getHtml(target, time, title, tag, preview) {
    return `
    <div class="paper-review glass" onclick="window.location.href='${target}'">
        <div style="display: flex;">
            <div class="glass tag">
                <p>${tag}</p>
            </div>
            <h2>${title}</h2>
        </div>
        <p class="review-text">${preview}</p>
        <div>
            <p style="font-size: 10px; color: rgba(0, 0, 0, 0.6);">发布时间： ${time}</p>
        </div>
    </div>
`;
}

htmlString = "<h2 class=\"papers-title\">文章</h2>"

// ============================================================
// 配置
// ============================================================
const PREVIEW_LENGTH = 150;            // 预览字数
const MANIFEST_URL = './manifest.json'; // 文件清单路径
const PAPERS_BASE = './papers/';        // md 文件所在目录（相对路径）

// ============================================================
// 工具函数：提取标题和预览（与 Node 版本逻辑一致）
// ============================================================
function extractTitleAndPreview(content) {
    const lines = content.split('\n');
    let title = null;
    let titleIndex = -1;

    // 查找第一个一级标题（# 开头，且后面有空格）
    for (let i = 0; i < lines.length; i++) {
        const trimmed = lines[i].trim();
        if (trimmed.startsWith('# ') && trimmed.length > 2) {
            title = trimmed.slice(2).trim();
            titleIndex = i;
            break;
        }
    }

    // 正文从标题的下一行开始，若无标题则从第一行开始
    const startLine = titleIndex === -1 ? 0 : titleIndex + 1;
    const body = lines.slice(startLine).join('\n');

    let preview = body.slice(0, PREVIEW_LENGTH).trim();
    if (body.length > PREVIEW_LENGTH) {
        preview += '…';
    }

    return { title, preview };
}

async function loadPapers() {
    const container = document.getElementById('papers');
    if (!container) {
        return;
    }

    try {
        // 1. 获取文件清单
        const manifestRes = await fetch(MANIFEST_URL);
        if (!manifestRes.ok) throw new Error(`无法加载 manifest.json (${manifestRes.status})`);
        const fileNames = await manifestRes.json();

        if (!Array.isArray(fileNames) || fileNames.length === 0) {
            container.innerHTML = '<p>📭 没有找到任何 .md 文件。</p>';
            return;
        }

        // 2. 逐个加载 .md 文件并生成 HTML
        let htmlString = '';
        for (const file of fileNames) {
            try {
                const mdRes = await fetch(PAPERS_BASE + file);
                if (!mdRes.ok) {
                    console.warn(`跳过 ${file}，加载失败 (${mdRes.status})`);
                    continue;
                }
                const content = await mdRes.text();
                const { title, preview } = extractTitleAndPreview(content);

                // ★ 保留你要求的那行代码，参数顺序不变 ★
                htmlString += getHtml(
                    `./paper.html?file=${file}`,  // 链接
                    '未知',                       // 作者（可修改）
                    title,                        // 标题
                    '文章',                       // 类型
                    preview                       // 预览文本
                );
            } catch (err) {
                console.warn(`处理文件 ${file} 时出错:`, err.message);
            }
        }

        // 3. 将生成的 HTML 插入容器
        container.innerHTML = htmlString || '<p>⚠️ 没有成功加载任何文章。</p>';

    } catch (err) {
        console.error('加载过程失败:', err);
        container.innerHTML = `<p style="color:red;">❌ 加载失败：${err.message}</p>`;
    }
}

// ============================================================
// 页面加载完成后自动执行
// ============================================================
document.addEventListener('DOMContentLoaded', loadPapers);

// const container = document.getElementById('papers');
// container.innerHTML = htmlString;
