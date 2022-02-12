const UPDATE_BATCH_TIME = 500;
var updateHandle = 0;

function updateCount() {
    var wordCount = document.body.innerText.split(' ').length;
    chrome.runtime.sendMessage({ "wordCount": wordCount });
}

updateCount();

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.type === "recount") {
        updateCount();
    }
});

let observer = new MutationObserver(mutations => {
    clearTimeout(updateHandle);
    updateHandle = setTimeout(updateCount, UPDATE_BATCH_TIME);
});
observer.observe(document, { childList: true, subtree: true });