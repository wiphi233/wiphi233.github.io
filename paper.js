// 获取 URL 参数 
function getParameterByName(name, url = window.location.href) {
    name = name.replace(/[\[\]]/g, '\\$&');
    const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
    const results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

async function loadAndRenderMarkdown() {
    const contentDiv = document.getElementById('content');
    
    const fileName = getParameterByName('file');
    if (!fileName) {
        contentDiv.innerHTML = '<div class="error">❌ 错误：未指定要加载的文章。</div>';
        return;
    }

    try {
        const filePath = `./papers/${fileName}`;
        const response = await fetch(filePath);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const markdownText = await response.text();

        // 渲染 Markdown
        const htmlContent = marked.parse(markdownText);
        contentDiv.innerHTML = htmlContent;

        // ✅ 等待 MathJax 渲染公式
        if (window.MathJax && window.MathJax.typesetPromise) {
            try {
                await MathJax.typesetPromise([contentDiv]);
            } catch (mathError) {
                console.warn('MathJax 渲染公式时出错:', mathError);
            }
        }

    } catch (error) {
        console.error('加载或渲染文章失败:', error);
        contentDiv.innerHTML = `<div class="error">❌ 加载失败：${error.message}</div>`;
    }
}

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', loadAndRenderMarkdown);