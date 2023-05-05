async function getActiveTab() { 
    let queryOptions = { active: true, lastFocusedWindow: true };
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;
}

async function refreshMeasurement() {
    let tab = await getActiveTab();
    let resp = await chrome.tabs.sendMessage(tab.id, { type: "getActiveMeasurement" });
    if (resp.hasOwnProperty("started")) {
        document.getElementById("estimate-button").innerText = resp.started ? "Stop" : "Start";
    }
}

refreshMeasurement();

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.type === "stopMeasurement" ) {
        var wpmFormatted = Math.ceil(message.wpm)
        document.getElementById("wpm").innerText = wpmFormatted
        document.getElementById("wpm-box").classList.remove("hidden");
        document.getElementById("wpm-instructions").classList.add("hidden");
    }
});

document.getElementById("estimate-button").onclick = async function() {
    document.getElementById("wpm-instructions").classList.remove("hidden");
    let tab = await getActiveTab();
    if (tab) {
        await chrome.tabs.sendMessage(tab.id, { type: "measurementSwitch" });
    }
    await refreshMeasurement();
}