function updateCount() {
    var wordCount = document.body.innerText.split(' ').length;
    chrome.runtime.sendMessage({ "wordCount": wordCount })
}

updateCount();

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.type === "recount") {
        updateCount();
    }
});