const filesInDirectory = dir => new Promise(resolve =>
  dir.createReader().readEntries(entries =>
    Promise.all(entries.filter(e => e.name[0] !== '.').map(e =>
      e.isDirectory ? filesInDirectory(e) : new Promise(resolve => e.file(resolve))
    ))
    .then(files => [].concat(...files))
    .then(resolve)
  )
);

const timestampForFilesInDirectory = dir =>
  filesInDirectory(dir).then(files =>
    files.map(f => f.name + f.lastModifiedDate).join());

const reload = () => {
  chrome.runtime.reload();
  chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    if (tabs[0]) {
      chrome.tabs.reload(tabs[0].id);
    }
  });
};

const watchChanges = (dir, lastTimestamp) => {
  timestampForFilesInDirectory(dir).then(timestamp => {
    if (!lastTimestamp || (lastTimestamp === timestamp)) {
      setTimeout(() => watchChanges(dir, timestamp), 1000); // 每秒检查一次
    } else {
      reload();
    }
  });
};

chrome.management.getSelf(self => {
  if (self.installType === 'development') {
    chrome.runtime.getPackageDirectoryEntry(dir => watchChanges(dir));
    chrome.runtime.onStartup.addListener(() => {
      chrome.runtime.getPackageDirectoryEntry(dir => watchChanges(dir));
    });
  }
});

// 添加重新加载事件监听器
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'reload-extension') {
    reload();
    sendResponse({ success: true });
  }
});

console.log('Hot reload service worker started'); 