document.addEventListener("DOMContentLoaded", () => {
    updateCurrentSwimlane();
    updateSwimlanesTotal();
    updateStatus();

    document.getElementById("start-daily").onclick = () => {
        chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {message: "startDaily"});
        });
    };

    document.getElementById("next-person").onclick = () => {
        chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {message: "nextPerson"});
        });
    };
})

chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === "local") {
        if ("currentSwimlaneId" in changes) {
            updateCurrentSwimlane()
        }
        if ("swimlaneIds" in changes) {
            updateSwimlanesTotal()
        }
        if ("dailyStatus" in changes) {
            updateStatus();
        }
    }
})

function updateCurrentSwimlane() {
    chrome.storage.local.get("currentSwimlaneId", (value) => {
        setDebugSwimlane(value.currentSwimlaneId)
    })
}

function updateSwimlanesTotal() {
    chrome.storage.local.get("swimlaneIds", (value) => {
        if (!!value.swimlaneIds) {
            setDebugSwimlaneTotal(value.swimlaneIds.length.toString());
        } else {
            setDebugSwimlaneTotal()
        }
    })
}

function updateStatus() {
    chrome.storage.local.get("dailyStatus", (value) => {
        setDebugStatus(value.dailyStatus)
    })
}

function setDebugSwimlane(swimlaneNumber = "-") {
    document.getElementById("debug-swimlane").innerText = swimlaneNumber
}

function setDebugSwimlaneTotal(swimlaneTotalNumber = "-") {
    document.getElementById("debug-swimlane-total").innerText = swimlaneTotalNumber
}

function setDebugStatus(status = "not running") {
    document.getElementById("debug-status").innerText = status
}