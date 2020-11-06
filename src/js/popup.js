document.addEventListener("DOMContentLoaded", () => {
    updateCurrentSwimlane();
    updateSwimlanesTotal();
    updateStatus();

    document.getElementById("restart").onclick = () => {
        chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {message: "restart"});
        });
    };

    document.getElementById("proceed").onclick = () => {
        chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {message: "proceed"});
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
        if (value.dailyStatus === "ongoing") {
            document.getElementById("proceed").innerText = "Next person"
        } else {
            document.getElementById("proceed").innerText = "Start daily"
        }
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