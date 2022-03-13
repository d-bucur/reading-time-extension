const UPDATE_BATCH_TIME = 500;
var updateHandle = null;

function updateCount() {
    var wordCount = document.body.innerText.split(' ').length;
    chrome.runtime.sendMessage({ "wordCount": wordCount });
    updateHandle = null;
}

// Update on page load
updateCount();

// Register handler to update on page mutations
let observer = new MutationObserver(mutations => {
    // schedule new update if page has changed and no update is already scheduled
    if (updateHandle === null) {
        updateHandle = setTimeout(updateCount, UPDATE_BATCH_TIME);
    }
});
observer.observe(document, { childList: true, subtree: true });

// Handle message for recounting
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.type === "recount") {
        updateCount();
    }
    sendResponse();
});