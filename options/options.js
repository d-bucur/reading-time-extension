// TODO should only write defaults once as used in background.js as well
const DEFAULT_WPM = 200;
const DEFAULT_BG_COLOR = "#4688F1";

function saveOptions() {
    var wpm = document.getElementById('wpm').value;
    var bgColor = document.getElementById('bgcolor').value;
    chrome.storage.sync.set({
        wpm: wpm,
        bgColor: bgColor
    });
    document.getElementById('status').classList.remove("visible");
}

async function restoreOptions() {
    var items = await chrome.storage.sync.get({
        wpm: DEFAULT_WPM,
        bgColor: DEFAULT_BG_COLOR
    });
    document.getElementById('wpm').value = items.wpm;
    document.getElementById('bgcolor').value = items.bgColor;
}

function restoreDefaults() {
    document.getElementById('wpm').value = DEFAULT_WPM;
    document.getElementById('bgcolor').value = DEFAULT_BG_COLOR;
}

function notifyChanges () {
    document.getElementById('status').classList.add("visible")
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('save').addEventListener('click', saveOptions);
document.getElementById('defaults').addEventListener('click', restoreDefaults);
document.getElementById('defaults').addEventListener('click', notifyChanges);
document.getElementById('options-form').addEventListener('input', notifyChanges);