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
    return true;
});

chrome.runtime.onInstalled.addListener(() => {
    // sets to default when extension installed, use existing settings if just a Chrome update
    var settings = getSettings();
    chrome.storage.sync.set(settings);
});

async function getSettings() {
    return await chrome.storage.sync.get({
        wpm: 200,
        bgColor: "#4688F1"
    });
}

chrome.action.onClicked.addListener(function (tab) {
    chrome.tabs.sendMessage(tab.id, { type: "recount" });
});