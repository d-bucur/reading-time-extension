const DEFAULT_WPM = 200;
const DEFAULT_BG_COLOR = "#4688F1";
const DEFAULT_SCROLL = false;

function saveOptions() {
    var wpm = document.getElementById('wpm').value;
    var bgColor = document.getElementById('bgcolor').value;
    var updateOnScroll = document.getElementById('updateonscroll').checked;
    chrome.storage.sync.set({
        wpm: wpm,
        bgColor: bgColor,
        updateOnScroll: updateOnScroll
    });
    document.getElementById('status').classList.remove("visible");
}

function restoreOptions() {
    chrome.storage.sync.get({
        wpm: DEFAULT_WPM,
        bgColor: DEFAULT_BG_COLOR,
        updateOnScroll: DEFAULT_SCROLL,
    }, function (items) {
        document.getElementById('wpm').value = items.wpm;
        document.getElementById('bgcolor').value = items.bgColor;
        document.getElementById('updateonscroll').checked = items.updateOnScroll;
    });
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