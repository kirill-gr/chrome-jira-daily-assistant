document.getElementById('start-daily').onclick = function () {
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {message: "startDaily"});
    });
};

document.getElementById('next-person').onclick = function () {
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {message: "nextPerson"});
    });
};

chrome.runtime.onMessage.addListener((msg) => {
    if (msg.message === 'initDoneEvt') {
        document.getElementById("debug-swimlane").innerText = "0"
        document.getElementById("debug-swimlane-total").innerText = msg.swimlaneIds.length.toString()
        document.getElementById("debug-status").innerText = "Started"
    }
    if (msg.message === 'updateStateEvt') {
        document.getElementById("debug-swimlane").innerText = msg.swimlaneCurrent
    }
    if (msg.message === 'noMoreParticipants') {
        document.getElementById("debug-status").innerText = "Finished"
    }
})