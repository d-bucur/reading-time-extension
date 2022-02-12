function saveOptions() {
    var wpm = document.getElementById('wpm').value;
    var bgColor = document.getElementById('bgcolor').value;
    chrome.storage.sync.set({
        wpm: wpm,
        bgColor: bgColor
    });
}

function restoreOptions() {
    chrome.storage.sync.get({
        wpm: 200,
        bgColor: "#4688F1"
    }, function (items) {
        document.getElementById('wpm').value = items.wpm;
        document.getElementById('bgcolor').value = items.bgColor;
    });
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('save').addEventListener('click', saveOptions);