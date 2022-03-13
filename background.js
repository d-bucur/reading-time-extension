async function updateReadTime(tabId, wordCount, readPercent) {
    let settings = await getSettings();
    if (settings.updateOnScroll)
        wordCount -= readPercent * wordCount;
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
    updateReadTime(sender.tab.id, message.wordCount, message.readPercent);
    return true;
});

chrome.runtime.onInstalled.addListener(() => {
    // TODO use defaults in options.js
    chrome.storage.sync.set({
        wpm: 200,
        bgColor: "#4688F1",
        updateOnScroll: false,
    });
});

async function getSettings() {
    let settings = await chrome.storage.sync.get(["wpm", "bgColor", "updateOnScroll"]);
    return settings;
}

chrome.action.onClicked.addListener(function (tab) {
    chrome.tabs.sendMessage(tab.id, { type: "recount" });
});