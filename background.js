async function updateReadTime(tabId, wordCount) {
    let settings = await getSettings();
    let minsToRead = wordCount / settings.wpm;
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
    chrome.action.setBadgeBackgroundColor({color: settings.bgColor});
}

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    updateReadTime(sender.tab.id, message.wordCount);
});

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({
        wpm: 200,
        bgColor: "#4688F1"
    });
});

async function getSettings() {
    let settings = await chrome.storage.sync.get(["wpm", "bgColor"]);
    return settings;
}

chrome.action.onClicked.addListener(function (tab) {
    chrome.tabs.sendMessage(tab.id, { type: "recount" });
});