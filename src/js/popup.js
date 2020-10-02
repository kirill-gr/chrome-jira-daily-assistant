document.addEventListener("DOMContentLoaded", () => {
    chrome.storage.local.get("currentSwimlaneId", (value) => {
        setDebugSwimlane(value.currentSwimlaneId)
    })
    chrome.storage.local.get("swimlineIds", (value) => {
        if (!!value.swimlineIds) {
            setDebugSwimlaneTotal(value.swimlineIds.length.toString());
        } else {
            setDebugSwimlaneTotal()
        }
    })
    chrome.storage.local.get("dailyStatus", (value) => {
        setDebugStatus(value.dailyStatus)
    })
})

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
        setDebugSwimlane("0");
        setDebugSwimlaneTotal(msg.swimlaneIds.length.toString());
        setDebugStatus("ongoing");
    }
    if (msg.message === 'updateStateEvt') {
        setDebugSwimlane(msg.swimlaneCurrent)
    }
    if (msg.message === 'noMoreParticipants') {
        setDebugStatus();
    }
})

let setDebugSwimlane = function (swimlaneNumber = "-") {
    document.getElementById("debug-swimlane").innerText = swimlaneNumber
};

let setDebugSwimlaneTotal = function (swimlaneTotalNumber = "-") {
    document.getElementById("debug-swimlane-total").innerText = swimlaneTotalNumber
};

let setDebugStatus = function (status = "not running") {
    document.getElementById("debug-status").innerText = status
};