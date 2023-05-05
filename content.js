const UPDATE_BATCH_TIME = 500;
var updateHandle = null;
var startTimestamp = null;
var wordCount = null;

function updateCount() {
    wordCount = document.body.innerText.split(' ').length;
    chrome.runtime.sendMessage({ "wordCount": wordCount });
    updateHandle = null;
}

function updateCountdownMode() {
    var timeSinceStarted = new Date() - startTimestamp
    chrome.runtime.sendMessage({ 
        "wordCount": wordCount,
        "timeSinceStarted": timeSinceStarted,
    });
}

function startMeasurement() {
    startTimestamp = new Date()
    // TODO this is WPM estimation, make separate button for countdown mode
    // setInterval(updateCountdownMode, 10000); 
}

function stopMeasurement() {
    var totalTime = (new Date() - startTimestamp) / 60000;
    var estimatedWPM = wordCount / totalTime;
    chrome.runtime.sendMessage({
        type: "stopMeasurement",
        wpm: estimatedWPM
    })
    console.log(`wpm: ${estimatedWPM}`);
    startTimestamp = null;
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
    if (message.type === "triggerRecount") {
        updateCount();
    }
    else if (message.type === "measurementSwitch") {
        if (startTimestamp) {
            stopMeasurement();
        }
        else {
            startMeasurement();
        }
    }
    else if (message.type === "getActiveMeasurement") {
        sendResponse({started: startTimestamp != null});
    }
    sendResponse();
});