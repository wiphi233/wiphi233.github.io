// --- 1. 获取 URL 参数 ---
function getParameterByName(name, url = window.location.href) {
    // 对参数名进行编码，以匹配 URL 编码 [reference:4]
    name = name.replace(/[\[\]]/g, '\\$&');
    const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
    const results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    // 对获取到的值进行解码 [reference:5]
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

// --- 2. 主流程 ---
async function loadAndRenderMarkdown() {
    const contentDiv = document.getElementById('content');
    
    // 2.1 从 URL 获取文件名
    const fileName = getParameterByName('file');
    if (!fileName) {
        contentDiv.innerHTML = '<div class="error">❌ 错误：未指定要加载的文章。</div>';
        return;
    }

    try {
        // 2.2 构建 Markdown 文件的路径 (根据你的实际目录结构调整)
        // 假设 paper.html 和 papers 文件夹在同级目录
        const filePath = `./papers/${fileName}`; 

        // 2.3 使用 Fetch API 获取文件内容 [reference:6][reference:7]
        const response = await fetch(filePath);
        
        // 检查文件是否获取成功
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const markdownText = await response.text();

        // 2.4 使用 marked.js 将 Markdown 转换为 HTML [reference:8][reference:9]
        // marked.parse() 是 v4+ 版本的推荐用法 [reference:10]
        const htmlContent = marked.parse(markdownText);

        // 2.5 将渲染后的 HTML 插入到页面中
        contentDiv.innerHTML = htmlContent;

    } catch (error) {
        console.error('加载或渲染文章失败:', error);
        contentDiv.innerHTML = `<div class="error">❌ 加载失败：${error.message}</div>`;
    }
}

// --- 3. 页面加载完成后执行 ---
document.addEventListener('DOMContentLoaded', loadAndRenderMarkdown);