async function updateReadTime(tabId, wordCount, timeSinceStarted) {
    let settings = await getSettings();
    let minsToRead = wordCount / settings.wpm;

    if (timeSinceStarted) {
        // only in countdown mode
        var timeStartedReading = timeSinceStarted / 60000;
        minsToRead -= timeStartedReading;
    }
    let badgeText = "";
    // TODO handle negative in case of countdown mode
    if (minsToRead < 1) {
        let secsToRead = minsToRead * 60;
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
    if (message.wordCount) {
        updateReadTime(sender.tab.id, message.wordCount, message.timeSinceStarted);
    }
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
