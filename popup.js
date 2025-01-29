console.log('popup.js 开始加载');


// 添加语言到文件扩展名的映射
const LANGUAGE_EXTENSIONS = {
  'javascript': 'js',
  'typescript': 'ts',
  'python': 'py',
  'py': 'py',
  'python3': 'py',
  'java': 'java',
  'c++': 'cpp',
  'cpp': 'cpp',
  'c': 'c',
  'csharp': 'cs',
  'c#': 'cs',
  'php': 'php',
  'ruby': 'rb',
  'go': 'go',
  'rust': 'rs',
  'swift': 'swift',
  'kotlin': 'kt',
  'html': 'html',
  'css': 'css',
  'sql': 'sql',
  'shell': 'sh',
  'bash': 'sh',
  'json': 'json',
  'xml': 'xml',
  'yaml': 'yml',
  'markdown': 'md',
  'vue': 'vue',                 // Vue组件
  'react': 'jsx',               // React JSX
  'tsx': 'tsx',                 // TypeScript React
  'scss': 'scss',               // SCSS样式
  'sass': 'sass',               // Sass样式
  'less': 'less',               // Less样式
  'stylus': 'styl',             // Stylus样式
  'dockerfile': 'dockerfile',    // Docker配置
  'docker': 'dockerfile',
  'nginx': 'conf',              // Nginx配置
  'apache': 'htaccess',         // Apache配置
  'perl': 'pl',                 // Perl脚本
  'lua': 'lua',                 // Lua脚本
  'r': 'r',                     // R语言
  'matlab': 'm',                // MATLAB
  'scala': 'scala',             // Scala
  'haskell': 'hs',             // Haskell
  'powershell': 'ps1',         // PowerShell
  'batch': 'bat',              // Windows批处理
  'gradle': 'gradle',          // Gradle构建
  'groovy': 'groovy',          // Groovy
  'toml': 'toml',              // TOML配置
  'ini': 'ini',                // INI配置
  'env': 'env',                // 环境变量
  'graphql': 'graphql',        // GraphQL
  'text': 'txt',
  'awk': 'awk',
};

// 添加网站特定的选择器配置
const SITE_SELECTORS = {
  'poe.com': {      // 消息对形式
    // 消息相关选择器（按照 DOM 结构从上到下排列）
    MESSAGE_STYLE: 'pairs',  // 标记为消息对形式
    MESSAGE_PAIRS: '[class*="ChatMessagesView_messagePair"]',  // 消息对容器

    // 用户消息
    HUMAN_MESSAGE: '[class*="Message_rightSideMessageBubble"]', 
    
    // 代码块相关选择器
    AI_MESSAGE: '[class*="Message_leftSideMessageBubble"]',     // AI消息
    CODE_CONTAINER: '[class*="MarkdownCodeBlock_container"]',    // 代码块容器
    LANGUAGE_NAME: '[class*="MarkdownCodeBlock_languageName"]',  // 语言类型标识
    CODE_ACTIONS: '[class*="MarkdownCodeBlock_codeActions"]',    // 代码操作按钮
    CODE_BLOCKS: [
      '[class*="MarkdownCodeBlock_preTag"]'                      // 代码块
    ]
  },
  
  'gemini.google.com': {  //  消息对
    
    // 消息相关选择器
    MESSAGE_STYLE: 'pairs',  // 标记为消息对形式
    MESSAGE_PAIRS: '.conversation-container',          // 消息对容器

    // 用户消息
    HUMAN_MESSAGE: '.user-query-container',             
    
    // 代码块相关选择器
    AI_MESSAGE: '.response-container-content',                  // AI消息
    CODE_CONTAINER: '.code-block',                    // 代码块容器
    LANGUAGE_NAME: '.code-block-decoration span',     // 语言标识
    CODE_ACTIONS: '.code-block-decoration .buttons',  // 代码操作按钮
    CODE_BLOCKS: [
      'code-block .code-container',                   // 代码容器
      'pre code'                                      // 预格式化代码
    ]
  },
  
  'chatgpt.com': {  // 平铺
    
    // 消息相关选择器
    MESSAGES_LIST: 'article[class]',     // 匹配带有class和dir属性的article元素

    // 用户消息
    HUMAN_MESSAGE: 'div[data-message-author-role="user"]',
    
    // 代码块相关选择器
    AI_MESSAGE: '[data-message-author-role="assistant"]',        // AI消息
    CODE_CONTAINER: '.contain-inline-size',                     // 代码块容器
    LANGUAGE_NAME: '.flex.items-center.text-xs.font-sans.justify-between', // 语言标识
    CODE_ACTIONS: '.flex.items-center.rounded',                 // 代码操作按钮
    CODE_BLOCKS: [
      '.markdown.prose pre code',                               // 代码块内容
      '.hljs.language-python',                                  // Python代码
      '.overflow-y-auto.p-4 > code'                            // 通用代码块
    ]
  },
  
  'copilot.microsoft.com': {  // 分组，然后平铺
    
    // 消息相关选择器（按照 DOM 结构从上到下排列）
    MESSAGES_LIST: '[role="article"]',

    HUMAN_MESSAGE: '[data-content="user-message"]',        // 用户消息
    
    // 代码块相关选择器
    AI_MESSAGE: '[data-content="ai-message"]',             // AI消息
    CODE_CONTAINER: '[data-testid="code-block-wrapper"]',  // 代码块容器
    LANGUAGE_NAME: 'span.capitalize',                      // 语言类型标识
    CODE_ACTIONS: 'button[class*="text-foreground-static-350"]', // 复制按钮
    CODE_BLOCKS: [
      'pre code',                                          // 基本代码块
      '[data-testid="code-block"]'                        // 测试ID标记的代码块
    ]
  },
  
  'claude.ai': {  // 平铺
    
    // 消息相关选择器
    MESSAGES_LIST: 'div[data-test-render-count]',

    HUMAN_MESSAGE: 'div.font-user-message',          // 用户消息
    
    // 代码块相关选择器
    AI_MESSAGE: '.font-claude-message',                  // AI消息
    CODE_CONTAINER: '.prose',                          // 代码块容器
    LANGUAGE_NAME: '.language-identifier',             // 语言类型标识
    CODE_ACTIONS: '.code-actions',                     // 代码操作按钮
    CODE_BLOCKS: [
      'pre code',                                      // 基本代码块
      '.code-block'                                    // 代码块
    ]
  },
  
  'mistral.ai': {  // 平铺形式
    
    // 消息相关选择器
    MESSAGES_LIST: 'div[class*="group"][class*="gap-3"]',  // 消息列表容器
    
    // 用户消息
    HUMAN_MESSAGE: 'div.prose.prose-neutral',  // 用户消息内容
    
    // 代码块相关选择器
    AI_MESSAGE: 'div.prose.prose-neutral',  // AI消息内容
    CODE_CONTAINER: 'pre div.rounded-md',  // 代码块容器
    LANGUAGE_NAME: 'span.language-identifier',  // 语言标识
    CODE_ACTIONS: 'button[aria-label="Copy code to clipboard"]',  // 复制按钮
    CODE_BLOCKS: [
      'pre code',  // 代码块
      'div.rounded-md code'  // 带圆角的代码块
    ]
  },
  'yiyan.baidu.com': {  // 直接平铺、倒序
  },
  'deepseek.com': {  // 直接平铺
  },
  'www.doubao.com': {  // 直接平铺
  },
  'www.xinghuo.xfyun.cn': {  // 平铺、倒序
  },
  'tongyi.aliyun.com': {  // 直接平铺 
  },
};

// 需要在文件开头添加
let lastScanTime = null;

// 扩展的主入口点，在popup页面加载完成时初始化
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOMContentLoaded 事件触发');
  initializeUI({
    onScan: () => {
      console.log('调用 scanFiles');
      scanFiles(updateUI);
    }
  });
  console.log('initializeUI 调用完成');
});

/**
 * 初始化UI和事件监听器
 * @param {Object} params - 初始化参数
 * @param {Function} params.onScan - 扫描按钮回调
 */
function initializeUI({ onScan }) {
  const scanButton = document.getElementById('extractCode');
  const feedbackButton = document.getElementById('feedback');
  
  // 页面加载时自动执行一次扫描
  onScan();
  
  // 绑定按钮事件
  scanButton.addEventListener('click', onScan);
  
  // 绑定反馈按钮事件
  feedbackButton.addEventListener('click', () => {
    window.open('mailto:yhc2073@gmail.com?subject=代码文件下载器反馈');
  });
  
  // 绑定快捷键：Ctrl/Cmd + R 重新加载扩展
  document.addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
      e.preventDefault();
      reloadExtension();
    }
  });
}

/**
 * 获取当前网站的选择器配置
 * @param {string} url - 当前网站URL
 * @returns {Object} 选择器配置
 */
function getSiteSelectors(url) {
  if (!url) {
    console.log('getSiteSelectors: url参数为空');
    return ;
  }
  
  const hostname = new URL(url).hostname.toLowerCase();
  console.log(`getSiteSelectors: 当前页面域名: ${hostname}`);
  
  // 精确匹配完整域名
  if (SITE_SELECTORS[hostname]) {
    console.log(`getSiteSelectors: ✓ 找到精确匹配的网站配置: ${hostname}`);
    return SITE_SELECTORS[hostname];
  }
  console.log(`getSiteSelectors: ✗ 未找到精确匹配,尝试部分匹配...`);
  
  // 部分匹配域名
  const siteKey = Object.keys(SITE_SELECTORS).find(key => {
    // 处理子域名情况
    const hostParts = hostname.split('.');
    const keyParts = key.split('.');
    
    // 从后向前匹配域名部分
    if (keyParts.length > hostParts.length) {
      console.log(`  跳过 ${key}: 配置域名部分(${keyParts.length})多于当前域名(${hostParts.length})`);
      return false;
    }
    
    for (let i = 1; i <= keyParts.length; i++) {
      if (hostParts[hostParts.length - i] !== keyParts[keyParts.length - i]) {
        console.log(`  跳过 ${key}: 域名部分不匹配 [${hostParts[hostParts.length - i]} ≠ ${keyParts[keyParts.length - i]}]`);
        return false;
      }
    }
    console.log(`  匹配成功: ${key}`);
    return true;
  });
  
  if (siteKey) {
    console.log(`✓ 找到部分匹配的网站配置: ${siteKey}, 当前域名: ${hostname}`);
    return SITE_SELECTORS[siteKey];
  }
  
  console.log(`✗ 未找到任何匹配的网站配置,使用基础配置。当前域名: ${hostname}`);
  return ;
}

/**
 * 扫描当前页面中的代码文件
 * @param {Function} updateUICallback - UI更新回调函数
 */
async function scanFiles(updateUICallback) {
  showLoading();
  updateLastScanTime();
  
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  console.log('当前标签页:', tab); // 添加日志
  
  // 获取当前网站的选择器配置
  const siteSelectors = getSiteSelectors(tab.url);
  console.log('获取到的选择器配置:', siteSelectors); // 添加日志
  
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: extractCode,
    args: [siteSelectors, LANGUAGE_EXTENSIONS]
  }, (results) => handleExtractResult(results, updateUICallback));
}

/**
 * 处理代码提取的结果
 * @param {Array} results - 执行结果数组
 * @param {Function} updateUICallback - UI更新回调
 */
function handleExtractResult(results, updateUICallback) {
  if (!results?.[0]?.result) {
    updateUICallback({ files: new Map(), questions: [], lastQuestion: null });
    return;
  }

  const { files, questions, lastQuestion } = results[0].result;
  console.log('处理提取结果:', {
    filesCount: Object.keys(files).length,
    questionsCount: questions.length,
    lastQuestion
  });

  // 将文件对象转换为 Map，保持顺序
  const filesMap = new Map(
    Object.entries(files)
  );

  console.log('转换后的文件 Map:', {
    size: filesMap.size,
    keys: Array.from(filesMap.keys())
  });

  updateUICallback({ 
    files: filesMap,
    questions,
    lastQuestion
  });
}

/**
 * 在页面中提取代码（在页面上下文中执行）
 * @param {Object} SELECTORS - 选择器配置
 * @param {Object} LANGUAGE_EXTENSIONS - 语言到扩展名的映射
 * @returns {Object} 提取结果，包含文件和最后一个问题
 */
function extractCode(SELECTORS, LANGUAGE_EXTENSIONS) {
  // 在函数开始处获取 hostname
  const hostname = window.location.hostname;
  console.log('当前网站:', hostname);

  /**
   * 根据消息组织形式获取问答对
   * @param {Object} SELECTORS - 选择器配置
   * @returns {Array} 问答对数组
   */
  function getPairs(SELECTORS) {
    const pairs = [];
    
    if (SELECTORS.MESSAGE_STYLE === 'pairs') {
      // 消息对形式处理
      const messagePairs = document.querySelectorAll(SELECTORS.MESSAGE_PAIRS);
      console.log('消息对选择器', `"${SELECTORS.MESSAGE_PAIRS}"`, '匹配到', messagePairs.length, '个元素');
      messagePairs.forEach(pair => {
        const humanMessage = pair.querySelector(SELECTORS.HUMAN_MESSAGE);
        const aiMessage = pair.querySelector(SELECTORS.AI_MESSAGE);
        if (humanMessage && aiMessage) {
          pairs.push([humanMessage, aiMessage]);
        }
      });
    } else {
      // 平铺形式处理 - 直接获取所有消息
      const messages = document.querySelectorAll(SELECTORS.MESSAGES_LIST);
      console.log('消息列表选择器', `"${SELECTORS.MESSAGES_LIST}"`, '匹配到', messages.length, '个元素');
      
      // 遍历所有消息
      for (let i = 0; i < messages.length - 1; i++) {
        const current = messages[i];
        
        // 检查当前消息或其子元素是否匹配人类消息选择器
        let humanMessage = current.matches(SELECTORS.HUMAN_MESSAGE) ? 
                          current : 
                          current.querySelector(SELECTORS.HUMAN_MESSAGE);
        
        if (!humanMessage) {
          console.log('当前消息不是人类消息, skip');
          continue;
        }
        
        const next = messages[i + 1];
        // 检查下一个消息或其子元素是否匹配AI消息选择器
        const isAIMessage = next.matches(SELECTORS.AI_MESSAGE) || 
                           next.querySelector(SELECTORS.AI_MESSAGE);
        
        if (isAIMessage) {
          pairs.push([humanMessage, next]);  // 使用精确匹配的人类消息，但保持原始的AI消息容器
          i++; // 跳过已配对的AI消息
        } else {
          console.log('当前消息不是AI消息, skip');
        }
      }
    }
    
    console.log(`找到 ${pairs.length} 个问答对`);
    return pairs;
  }

  try {
    console.group('选择器匹配检查');
    
    // 检查消息对选择器
    if (SELECTORS.MESSAGE_PAIRS) {
      const messagePairs = document.querySelectorAll(SELECTORS.MESSAGE_PAIRS);
      console.log('消息对选择器', `"${SELECTORS.MESSAGE_PAIRS}"`, '匹配到', messagePairs.length, '个元素');
    }
    
    if (SELECTORS.MESSAGES_LIST) {
      const messages = document.querySelectorAll(SELECTORS.MESSAGES_LIST);
      console.log('消息列表选择器', `"${SELECTORS.MESSAGES_LIST}"`, '匹配到', messages.length, '个元素');
    }

    // 检查人类消息选择器
    const humanMessages = document.querySelectorAll(SELECTORS.HUMAN_MESSAGE);
    console.log('人类消息选择器', `"${SELECTORS.HUMAN_MESSAGE}"`, '匹配到', humanMessages.length, '个元素');
    
    // 检查代码块选择器
    const codeBlocks = document.querySelectorAll(SELECTORS.CODE_BLOCKS.join(', '));
    console.log('代码块选择器', `"${SELECTORS.CODE_BLOCKS.join(', ')}"`, '匹配到', codeBlocks.length, '个元素');
    
    // 检查代码语言选择器
    const languageElements = document.querySelectorAll(SELECTORS.LANGUAGE_NAME);
    console.log('代码语言选择器', `"${SELECTORS.LANGUAGE_NAME}"`, '匹配到', languageElements.length, '个元素');
    if (languageElements.length > 0) {
      console.log('代码语言:', Array.from(languageElements).map(el => el.textContent.trim()));
    }
    
    // 检查代码操作按钮容器选择器
    const actionContainers = document.querySelectorAll(SELECTORS.CODE_ACTIONS);
    console.log('代码操作按钮容器选择器', `"${SELECTORS.CODE_ACTIONS}"`, '匹配到', actionContainers.length, '个元素');
    if (actionContainers.length > 0) {
      console.log('操作按钮:', Array.from(actionContainers).map(el => {
        const buttons = el.matches('button') ? [el] : el.querySelectorAll('button');
        return Array.from(buttons).map(btn => btn.textContent.trim());
      }));
    
    console.groupEnd();
    }

    /**
     * 从文本中提取指定扩展名的文件名
     * @param {string} text - 要搜索的文本
     * @param {string} extension - 文件扩展名（不含点号）
     * @returns {string|null} 找到的文件名，未找到返回null
     */
    function extractFileName(text, extension) {
      // 匹配包含指定扩展名的文件名
      // 文件名可以包含字母、数字、下划线、横线、点号和斜杠
      // 扩展名前必须有点号，且必须完全匹配
      const strictPattern = new RegExp(`([\\w-]+\\.${extension})(?=[^\\w/./-]|$)`, 'i');
      const match = text.match(strictPattern);
      console.log('提取文件名:', {
        text: text.substring(0, 50) + (text.length > 50 ? '...' : ''),
        extension,
        match
      });
      return match ? match[1] : null;
    }

    // 添加下载按钮到代码块
    function addDownloadButton(block, filename, content) {
      const hostname = window.location.hostname;
      let actionsContainer;
      
      if (hostname === 'copilot.microsoft.com') {
        // 对于 Copilot，先找到代码块容器
        const wrapper = block.closest('[data-testid="code-block-wrapper"]');
        if (!wrapper) {
          console.log('未找到代码块容器');
          return;
        }
        
        // 找到复制按钮
        const copyButton = wrapper.querySelector('button[class*="text-foreground-static-350"]');
        if (!copyButton) {
          console.log('未找到复制按钮');
          return;
        }
        
        // 使用复制按钮的父元素作为容器
        actionsContainer = copyButton.parentElement;
        console.log('找到操作按钮容器:', actionsContainer);
      } else {
        // 其他网站的查找逻辑保持不变
        const actionButton = block.querySelector(SELECTORS.CODE_ACTIONS);
        actionsContainer = actionButton?.matches('button') ? actionButton.parentElement : actionButton;
      }
      
      if (!actionsContainer) {
        console.log('未找到代码操作按钮容器',block, SELECTORS.CODE_ACTIONS);
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
      const copyButton = actionsContainer.matches('button') ? actionsContainer : actionsContainer.querySelector('button');
      
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
          downloadBtn.style.opacity = '0.6';
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
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      });

      // 添加到操作按钮容器
      actionsContainer.appendChild(downloadBtn);
      console.log('添加下载按钮到代码块:', filename);
    }

    // 添加自动监听代码块的功能
    function setupCodeBlockObserver() {
      // 创建观察器实例
      const observer = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
          // 检查新增的节点
          mutation.addedNodes.forEach(node => {
            if (node.nodeType === 1) { // 元素节点
              // 检查新增节点中的代码块
              const codeBlocks = node.querySelectorAll(SELECTORS.CODE_BLOCKS.join(', '));
              codeBlocks.forEach(block => processCodeBlock(block));
              
              // 如果新增节点本身就是代码块
              if (node.matches(SELECTORS.CODE_BLOCKS.join(', '))) {
                processCodeBlock(node);
              }
            }
          });
        });
      });

      // 配置观察选项
      const config = {
        childList: true,    // 观察子节点变化
        subtree: true,      // 观察所有后代节点
      };

      // 开始观察整个文档
      observer.observe(document.body, config);
      console.log('代码块观察器已设置');
    }

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
        
        if (window.location.hostname === 'copilot.microsoft.com') {
          // 对于 Copilot，直接从 capitalize span 获取语言
          const wrapper = block.closest('[data-testid="code-block-wrapper"]');
          if (wrapper) {
            const langElement = wrapper.querySelector('span.capitalize');
            if (langElement) {
              language = langElement.textContent.trim().toLowerCase();
              console.log('从 Copilot 找到语言:', language);
            }
          }
        } else {
          // 其他网站的语言识别逻辑保持不变
          const blockClasses = Array.from(block.classList || []);
          for (const cls of blockClasses) {
            const langMatch = cls.match(/(?:language|lang)-(\w+)/);
            if (langMatch) {
              language = langMatch[1].toLowerCase();
              break;
            }
          }

          if (!language) {
            const langElement = block.closest(SELECTORS.CODE_CONTAINER)
              ?.querySelector(SELECTORS.LANGUAGE_NAME);
            if (langElement) {
              language = langElement.textContent.trim().toLowerCase();
            }
          }
        }

        console.log('最终识别的语言:', language);
        const fileExtension = LANGUAGE_EXTENSIONS[language] || 'txt';
        console.log('使用文件扩展名:', fileExtension);
        const fileName = `code_${Date.now()}.${fileExtension}`;

        // 添加下载按钮
        addDownloadButton(block, fileName, codeText.trim());

        // 标记为已处理
        block.dataset.processed = 'true';
      } catch (e) {
        console.error('处理代码块时出错:', e);
      }
    }

    // 设置观察器
    setupCodeBlockObserver();

    // 处理现有的代码块
    const existingBlocks = document.querySelectorAll(SELECTORS.CODE_BLOCKS.join(', '));
    existingBlocks.forEach(block => processCodeBlock(block));

    // 使用 Map 替代普通对象，以保证顺序
    const allFiles = new Map();
    const questions = new Set();

    // 获取问答对
    const pairs = getPairs(SELECTORS);
    console.log(`找到 ${pairs.length} 个有效的问答对`);

    // 处理每个问答对
    pairs.forEach(([question, answer], pairIndex) => {
      // 获取问题文本
      const questionText = question.textContent.trim();
      if (questionText) {
        questions.add(questionText);
        console.log('添加问题:', questionText.substring(0, 50));
      }

      // 获取代码块
      let blocks = Array.from(answer.querySelectorAll(SELECTORS.CODE_BLOCKS.join(', ')));

      console.log(`在消息对中找到 ${blocks.length} 个代码块`);

      // 过滤掉嵌套的代码块
      const validBlocks = Array.from(blocks).filter(block => {
        try {
          // 检查所有祖先元素是否包含代码块
          let parent = block.parentElement;
          const container = answer;
          while (parent && parent !== container) {
            if (parent.matches('pre code, code, [data-testid="code-block"]')) {
              console.log('跳过嵌套的代码块');
              return false;
            }
            parent = parent.parentElement;
          }
          return true;
        } catch (e) {
          console.error('检查代码块嵌套时出错:', e);
          return false;
        }
      });

      console.log(`找到 ${validBlocks.length} 个有效代码块，开始处理...`);

      // 处理代码块，提取文件
      validBlocks.forEach((block, index) => {
        try {
          // 获取原始文本，保留空白字符
          const codeText = block.textContent || block.innerText;
          if (!codeText?.trim()) {
            console.log(`跳过代码块 ${index}：内容为空`);
            return;
          }

          // 处理代码块内容，保留空行和缩进
          let fileName = null;
          let content = null;
          let fileExtension = null;

          // 1. 首先确定代码语言和文件扩展名
          let language = null;
          
          // 检查代码块的class
          const blockClasses = Array.from(block.classList || []);
          for (const cls of blockClasses) {
            const langMatch = cls.match(/(?:language|lang)-(\w+)/);
            if (langMatch) {
              language = langMatch[1].toLowerCase();
              console.log('从class找到语言:', language);
              break;
            }
          }

          // 如果class中没找到，查找语言标识元素
          if (!language) {
            const langElement = block.closest(SELECTORS.CODE_CONTAINER)
              ?.querySelector(SELECTORS.LANGUAGE_NAME);
            if (langElement) {
              language = langElement.textContent.trim().toLowerCase();
              console.log('从语言标识元素找到语言:', language);
            }
          }

          // 确定文件扩展名
          if (language && LANGUAGE_EXTENSIONS[language]) {
            fileExtension = LANGUAGE_EXTENSIONS[language];
            console.log(`根据语言 ${language} 确定文件扩展名: ${fileExtension}`);
          } else {
            fileExtension = 'txt';
            console.log('未找到对应的语言扩展名，使用默认扩展名: txt');
          }

          // 2. 检查代码块第一行是否包含文件名
          const lines = codeText.split('\n');
          const firstLine = lines[0];
          console.log('第一行:', firstLine, fileExtension);
          fileName = extractFileName(firstLine, fileExtension);
          
          if (fileName) {
            console.log(`从第一行找到文件名: ${fileName}`);
          } else {
            // 3. 查找代码块所在的容器和相邻元素中的文件名
            const containerDiv = block.closest(SELECTORS.CODE_CONTAINER);
            if (containerDiv) {
              console.log('找到代码块容器:', containerDiv);
              const prevSibling = containerDiv.previousElementSibling;
              
              if (prevSibling) {
                console.log('找到上一个同级元素:', prevSibling);
                // 在上一个同级元素中递归查找文件名
                function findFileNameInElement(element) {
                  // 检查当前元素的文本
                  const text = element.textContent;
                  const foundFileName = extractFileName(text, fileExtension);
                  if (foundFileName) {
                    console.log(`在元素中找到文件名: ${foundFileName}`, element);
                    return foundFileName;
                  }
                  
                  // 递归检查子元素
                  for (const child of element.children) {
                    const result = findFileNameInElement(child);
                    if (result) return result;
                  }
                  
                  return null;
                }
                
                fileName = findFileNameInElement(prevSibling);
                if (fileName) {
                  console.log(`从上一个同级元素找到文件名: ${fileName}`);
                }
              } else {
                console.log('未找到上一个同级元素');
              }
            } else {
              console.log('未找到代码块容器');
            }

            // 4. 如果还是没找到，使用默认文件名
            if (!fileName) {
              fileName = `untitled_${pairIndex * 10 + index + 1}.${fileExtension}`;
              console.log('使用默认文件名:', fileName);
            }
          }

          // 使用 Map.set 添加文件
          allFiles.set(fileName, {
            content: codeText.trim(),
            question: questionText,
            order: pairIndex * 10 + index
          });
          console.log(`添加文件 ${fileName} 到全局列表，内容长度: ${codeText.length}，顺序: ${pairIndex * 10 + index}`);

          // 添加下载按钮到代码块
          addDownloadButton(block, fileName, codeText.trim());
        } catch (e) {
          console.error(`处理代码块 ${index} 时出错:`, e);
        }
      });
    });

    // 检查是否找到任何文件
    const fileCount = allFiles.size;
    console.log(`处理完成，共找到 ${fileCount} 个文件:`, Array.from(allFiles.keys()));

    // 返回时转换为对象，但保持顺序
    const orderedFiles = {};
    Array.from(allFiles.entries())
      .sort(([, a], [, b]) => a.order - b.order)
      .forEach(([fileName, data]) => {
        // 存储时不包含 order 字段
        const { content, question } = data;
        orderedFiles[fileName] = { content, question };
      });

    const questionList = Array.from(questions);
    return { 
      files: orderedFiles,
      questions: questionList,
      lastQuestion: questionList[0]
    };
  } catch (e) {
    console.error('extractCode 执行出错:', e);
    return { files: {}, questions: [], lastQuestion: null, error: '代码提取过程出错' };
  }
}

/**
 * 更新UI界面
 * @param {Object} params - UI更新参数
 * @param {Map} params.files - 文件Map对象
 * @param {Array} params.questions - 问题数组
 * @param {string} params.lastQuestion - 最后一个问题
 */
function updateUI({ files, questions, lastQuestion }) {
  console.log('updateUI 被调用，参数:', {
    filesType: files.constructor.name,
    filesSize: files.size,
    questionsLength: questions?.length,
    lastQuestion
  });

  const fileList = document.getElementById('fileList');
  
  // 清空文件列表
  fileList.innerHTML = '';

  // 如果没有找到任何问题，显示提示信息
  if (!questions?.length) {
    console.log('没有找到任何问题，显示提示信息');
    showMessage('未找到任何问题');
    return;
  }

  // 反转问题数组，让最新的问题显示在前面
  const reversedQuestions = [...questions].reverse();
  
  // 显示所有问题分组
  console.log('显示所有问题分组:', reversedQuestions);
  reversedQuestions.forEach(question => {
    const questionGroup = createQuestionGroup(question, files);
    fileList.appendChild(questionGroup);
  });
}

/**
 * 创建问题分组元素
 * @param {string} question - 问题内容
 * @param {Map} files - 相关的文件Map
 * @returns {HTMLElement} 问题分组DOM元素
 */
function createQuestionGroup(question, files) {
  console.log('创建问题分组元素:', {
    question,
    filesSize: files.size,
    filesEntries: Array.from(files.entries())
  });

  const group = document.createElement('div');
  group.className = 'question-group';
  group.style.marginBottom = '12px';

  const header = createGroupHeader(question);
  const filesContainer = createFilesContainer(files, question);

  group.appendChild(header);
  group.appendChild(filesContainer);
  return group;
}

/**
 * 创建问题分组的标题
 * @param {string} question - 问题内容
 * @returns {HTMLElement} 标题DOM元素
 */
function createGroupHeader(question) {
  const header = document.createElement('div');
  header.className = 'question-header';
  header.style.cssText = `
    background-color: #f5f5f5;
    padding: 8px;
    border-radius: 4px;
    margin-bottom: 4px;
    font-weight: bold;
    display: -webkit-box;
    -webkit-line-clamp: 2;        // 限制为2行
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 1.4;
    max-height: 2.8em;            // 2行的最大高度 (1.4em * 2)
    cursor: help;                 // 鼠标悬停时显示问号光标
  `;
  
  // 截短文本,保留前100个字符
  const shortQuestion = question.length > 100 ? 
    question.substring(0, 100) + '...' : 
    question;
  
  header.textContent = shortQuestion;
  header.title = question;  // 鼠标悬停时显示完整问题
  
  return header;
}

/**
 * 创建文件列表容器
 * @param {Map} files - 文件Map
 * @param {string} question - 问题内容
 * @returns {HTMLElement} 文件列表容器DOM元素
 */
function createFilesContainer(files, question) {
  console.log('创建文件容器 - 输入:', {
    filesType: files.constructor.name,
    filesSize: files.size,
    question
  });

  const container = document.createElement('div');
  container.className = 'question-files';
  container.style.marginTop = '0';

  // 获取属于这个问题的文件
  const questionFiles = Array.from(files.entries())
    .filter(([_, data]) => data.question === question)
    .map(([path, data]) => ({
      filePath: path,
      content: data.content,
      question: data.question
    }));

  console.log('过滤后的文件:', questionFiles);

  // 如果没有文件，使用更紧凑的布局显示提示信息
  if (questionFiles.length === 0) {
    const emptyMessage = document.createElement('div');
    emptyMessage.className = 'empty-files';
    emptyMessage.style.cssText = `
      color: #666;
      font-style: italic;
      padding: 2px 8px;
      min-height: 20px;
      line-height: 20px;
      margin: 2px 0;
      background-color: #f9f9f9;
      border-radius: 2px;
    `;
    emptyMessage.textContent = '暂无相关代码文件';
    container.appendChild(emptyMessage);
  } else {
    // 添加文件列表
    questionFiles.forEach(fileData => {
      console.log('创建文件项:', fileData);
      const fileItem = createFileItem(fileData);
      container.appendChild(fileItem);
    });
  }

  return container;
}

/**
 * 创建单个文件项
 * @param {Object} fileData - 文件数据
 * @returns {HTMLElement} 文件项DOM元素
 */
function createFileItem(fileData) {
  const item = document.createElement('div');
  item.className = 'file-item';
  item.style.cssText = `
    display: flex;
    align-items: center;
    padding: 8px;       // 保持原有内边距
    border-bottom: 1px solid #eee;
    min-height: 36px;   // 保持原有最小高度
  `;

  // 文件名
  const fileName = document.createElement('span');
  fileName.textContent = fileData.filePath.split('/').pop();
  fileName.style.flexGrow = '1';

  // 文件大小
  const fileSize = document.createElement('span');
  fileSize.textContent = formatFileSize(fileData.content.length);
  fileSize.style.marginLeft = '8px';
  fileSize.style.color = '#666';

  // 下载按钮 - 使用更紧凑的样式
  const downloadBtn = document.createElement('button');
  downloadBtn.textContent = '下载';
  downloadBtn.style.cssText = `
    margin-left: 8px;
    padding: 4px 12px;  // 减小内边距
    border: none;
    border-radius: 4px;
    background-color: #4CAF50;
    color: white;
    cursor: pointer;
    flex-shrink: 0;
    font-size: 13px;    // 稍微减小字体大小
    line-height: 1.4;   // 减小行高
  `;
  downloadBtn.addEventListener('mouseover', () => {
    downloadBtn.style.backgroundColor = '#45a049';
  });
  downloadBtn.addEventListener('mouseout', () => {
    downloadBtn.style.backgroundColor = '#4CAF50';
  });
  downloadBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    downloadSingleFile(fileData);
  });

  item.appendChild(fileName);
  item.appendChild(fileSize);
  item.appendChild(downloadBtn);

  // 保存文件内容到 dataset
  item.dataset.content = fileData.content;

  return item;
}

/**
 * 下载单个文件
 * @param {Object} fileData - 文件数据
 */
function downloadSingleFile(fileData) {
  const blob = new Blob([fileData.content], { type: 'text/plain' });
  const fileName = fileData.filePath.split('/').pop();
  downloadBlob(blob, fileName);
}

/**
 * 下载Blob对象为文件
 * @param {Blob} blob - 要下载的Blob对象
 * @param {string} filename - 下载文件名
 */
function downloadBlob(blob, filename) {
  console.log(`准备下载文件: ${filename}，大小: ${formatFileSize(blob.size)}`);
  const url = URL.createObjectURL(blob);
  console.log('创建的Blob URL:', url);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  
  console.log('添加下载链接到文档');
  document.body.appendChild(a);
  
  console.log('触发下载');
  a.click();
  
  console.log('清理下载链接');
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  console.log('下载流程完成');
}

/**
 * 在文件列表区域显示消息
 * @param {string} message - 要显示的消息
 */
function showMessage(message) {
  const fileList = document.getElementById('fileList');
  fileList.innerHTML = `<div class="message">${message}</div>`;
}

/**
 * 显示加载中的提示信息
 */
function showLoading() {
  showMessage('正在扫描代码文件...');
}

/**
 * 格式化文件大小
 * @param {number} size - 文件大小（字节）
 * @returns {string} 格式化后的文件大小字符串
 */
function formatFileSize(size) {
  const units = ['B', 'KB', 'MB'];
  let i = 0;
  while (size >= 1024 && i < units.length - 1) {
    size /= 1024;
    i++;
  }
  return `${size.toFixed(1)} ${units[i]}`;
}

/**
 * 格式化时间差
 * @param {Date} date - 要计算差值的时间
 * @returns {string} 格式化后的时间差字符串
 */
function formatTimeAgo(date) {
  const seconds = Math.floor((new Date() - date) / 1000);
  
  if (seconds < 60) {
    return `${seconds} 秒前`;
  }
  
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return `${minutes} 分钟前`;
  }
  
  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours} 小时前`;
  }
  
  const days = Math.floor(hours / 24);
  return `${days} 天前`;
}

/**
 * 更新最后扫描时间
 */
function updateLastScanTime() {
  const lastScanElement = document.getElementById('lastScanTime');
  lastScanTime = new Date();
  
  // 初始更新显示
  updateTimeDisplay();
  
  // 设置定时器，每秒更新显示
  setInterval(updateTimeDisplay, 1000);
}

/**
 * 更新时间显示
 */
function updateTimeDisplay() {
  const lastScanElement = document.getElementById('lastScanTime');
  if (lastScanTime) {
    lastScanElement.textContent = `上次扫描: ${formatTimeAgo(lastScanTime)}`;
  }
}

/**
 * 重新加载扩展
 * 向background脚本发送重载请求
 */
function reloadExtension() {
  chrome.runtime.sendMessage({ action: 'reload-extension' }, response => {
    console.log('Extension reload requested:', response);
  });
} 