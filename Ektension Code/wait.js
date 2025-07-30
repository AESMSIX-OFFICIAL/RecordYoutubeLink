let lastUrl = location.href;

function handleVideoChange() {
  const currentUrl = location.href;
  const currentTitle = document.title;
  const isYoutubeVideoPage = currentUrl.includes("watch?v=");
  if (isYoutubeVideoPage && currentUrl !== lastUrl) {
    lastUrl = currentUrl;
    console.log("YouTube video changed, title confirmed:", currentTitle);
    chrome.runtime.sendMessage({ 
      action: "videoChanged", 
      url: currentUrl, 
      title: currentTitle 
    });
  }
}

const titleObserver = new MutationObserver(() => {
  console.log("Title changed to:", document.title);
  handleVideoChange();
});

const titleElement = document.querySelector('head > title');
if (titleElement) {
  titleObserver.observe(titleElement, { childList: true });
}

handleVideoChange();