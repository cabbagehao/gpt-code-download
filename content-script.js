// 语言到文件扩展名的映射
const LANGUAGE_EXTENSIONS = {
  'javascript': 'js',
  'typescript': 'ts',
  'python': 'py',
  // ... 其他语言映射保持不变 ...
};

// 选择器配置
const SELECTORS = {
  CODE_BLOCKS: [
    '[class*="MarkdownCodeBlock_preTag"]',
    'pre code',                    // Copilot 的代码块
    '[data-testid="code-block"]'   // Copilot 的测试ID标记
  ],
  CODE_ACTIONS: [
    '[class*="MarkdownCodeBlock_codeActions"]',
    '.flex.items-center.gap-3'     // Copilot 的操作按钮容器
  ].join(', '),
  CODE_CONTAINER: [
    '[class*="MarkdownCodeBlock_container"]',
    '.relative.text-sm'            // Copilot 的代码容器
  ].join(', '),
  LANGUAGE_NAME: [
    '[class*="MarkdownCodeBlock_languageName"]',
    '[class*="language-"]',
    '[class*="lang-"]',
    'span.capitalize'              // Copilot 的语言标识
  ].join(', ')
};

// 处理单个代码块
function processCodeBlock(block) {
  try {
    // 检查是否已经处理过
    if (block.dataset.processed) {
      return;
    }

    const codeText = block.innerText;
    if (!codeText?.trim()) {
      return;
    }

    // 获取语言和文件扩展名
    let language = null;
    const blockClasses = Array.from(block.classList || []);
    for (const cls of blockClasses) {
      const langMatch = cls.match(/(?:language|lang)-(\w+)/);
      if (langMatch) {
        language = langMatch[1].toLowerCase();
        break;
      }
    }

    if (!language) {
      const langElement = block.closest('[class*="MarkdownCodeBlock_container"]')
        ?.querySelector(SELECTORS.LANGUAGE_NAME);
      if (langElement) {
        language = langElement.textContent.trim().toLowerCase();
      }
    }

    const fileExtension = LANGUAGE_EXTENSIONS[language] || 'txt';
    const fileName = `code_${Date.now()}.${fileExtension}`;

    // 添加下载按钮
    addDownloadButton(block, fileName, codeText.trim());

    // 标记为已处理
    block.dataset.processed = 'true';
  } catch (e) {
    console.error('处理代码块时出错:', e);
  }
}

// 添加下载按钮到代码块
function addDownloadButton(block, fileName, content) {
  // 查找代码操作按钮容器
  const actionsContainer = block.closest('[class*="MarkdownCodeBlock_container"]')
    ?.querySelector('[class*="MarkdownCodeBlock_codeActions"]');
  
  if (!actionsContainer) {
    console.log('未找到代码操作按钮容器');
    return;
  }

  // 检查是否已经添加过下载按钮
  if (actionsContainer.querySelector('.code-download-btn')) {
    console.log('该代码块已有下载按钮');
    return;
  }

  // 创建下载按钮
  const downloadBtn = document.createElement('button');
  downloadBtn.className = 'code-download-btn';
  downloadBtn.textContent = '下载';

  // 获取原生复制按钮，用于复制样式
  const copyButton = actionsContainer.querySelector('button');
  
  if (copyButton) {
    // 如果找到了原生按钮，复制其样式
    console.log('找到原生按钮，复制其样式');
    const copyButtonStyles = window.getComputedStyle(copyButton);
    downloadBtn.style.cssText = `
      background: ${copyButtonStyles.background};
      border: ${copyButtonStyles.border};
      padding: ${copyButtonStyles.padding};
      margin: ${copyButtonStyles.margin};
      font: ${copyButtonStyles.font};
      color: ${copyButtonStyles.color};
      cursor: pointer;
      opacity: 1;
      transition: opacity 0.2s;
    `;

    // 添加悬停效果
    downloadBtn.addEventListener('mouseover', () => {
      downloadBtn.style.opacity = '1';
    });
    downloadBtn.addEventListener('mouseout', () => {
      downloadBtn.style.opacity = '1';
    });
  } else {
    // 如果没找到原生按钮，使用默认样式（与popup页面一致）
    console.log('未找到原生按钮，使用默认样式');
    downloadBtn.style.cssText = `
      margin-left: 8px;
      padding: 4px 12px;
      border: none;
      border-radius: 4px;
      background-color: #4CAF50;
      color: white;
      cursor: pointer;
      font-size: 13px;
      line-height: 1.4;
    `;

    // 添加悬停效果
    downloadBtn.addEventListener('mouseover', () => {
      downloadBtn.style.backgroundColor = '#45a049';
    });
    downloadBtn.addEventListener('mouseout', () => {
      downloadBtn.style.backgroundColor = '#4CAF50';
    });
  }

  downloadBtn.title = '下载';

  // 添加点击事件
  downloadBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });

  // 添加到操作按钮容器
  actionsContainer.appendChild(downloadBtn);
  console.log('添加下载按钮到代码块:', fileName);
}

// 设置观察器
function setupCodeBlockObserver() {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach(mutation => {
      mutation.addedNodes.forEach(node => {
        if (node.nodeType === 1) {
          const codeBlocks = node.querySelectorAll(SELECTORS.CODE_BLOCKS.join(', '));
          codeBlocks.forEach(block => processCodeBlock(block));
          
          if (node.matches(SELECTORS.CODE_BLOCKS.join(', '))) {
            processCodeBlock(node);
          }
        }
      });
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}

// 初始化
function initialize() {
  // 处理现有的代码块
  const existingBlocks = document.querySelectorAll(SELECTORS.CODE_BLOCKS.join(', '));
  existingBlocks.forEach(block => processCodeBlock(block));

  // 设置观察器以处理新的代码块
  setupCodeBlockObserver();
}

// 页面加载完成后初始化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initialize);
} else {
  initialize();
} 