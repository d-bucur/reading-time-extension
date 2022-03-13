const UPDATE_BATCH_TIME = 500;
var updateHandle = null;

function updateCount() {
    let wordCount = document.body.innerText.split(' ').length;
    let readPercent = this.scrollY/document.body.scrollHeight;
    chrome.runtime.sendMessage({ "wordCount": wordCount, "readPercent": readPercent});
    updateHandle = null;
}

// Update on page load
updateCount();

function batchUpdate() {
    if (updateHandle === null) {
        updateHandle = setTimeout(updateCount, UPDATE_BATCH_TIME);
    }
}

// Register handler to update on page mutations
let observer = new MutationObserver(mutations => {
    // schedule new update if page has changed and no update is already scheduled
    batchUpdate()
});
observer.observe(document, { childList: true, subtree: true });

// Handle message for recounting
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.type === "recount") {
        updateCount();
    }
    sendResponse();
});

const scroller = window;
scroller.addEventListener("scroll", event => {
    batchUpdate();
});