let bgColor = '#4688F1';
let wordsPerMinute = 200;

function updateReadTime(tabId, wordCount) {
    let minsToRead = wordCount / wordsPerMinute;
    let badgeText = "";
    if (minsToRead < 1) {
        let secsToRead = minsToRead / 60;
        badgeText = Math.ceil(secsToRead).toString() + "s";
    }
    else {
        badgeText = Math.ceil(minsToRead).toString() + "m";
    }
    chrome.action.setBadgeText({
        text: badgeText,
        tabId: tabId
    });
}

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    updateReadTime(sender.tab.id, message.wordCount);
});

chrome.runtime.onInstalled.addListener(() => {
    // chrome.storage.sync.set({ bgColor }); // TODO save values to storage
    chrome.action.setBadgeBackgroundColor({color: bgColor});
});

chrome.action.onClicked.addListener(function(tab) {
    chrome.tabs.sendMessage(tab.id, {type: "recount"});
});