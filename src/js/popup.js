function sendMessage(message) {
    return () => {
        chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, message);
        });
    };
}

document.addEventListener("DOMContentLoaded", () => {
    updateNextSwimlane();
    updateSwimlanesTotal();
    updateStatus();

    document.getElementById("restart").onclick = sendMessage({message: "restart"});

    document.getElementById("proceed").onclick = sendMessage({message: "proceed"});

    document.getElementById("scrollToCurrent").onclick = sendMessage({message: "scrollToCurrent"});
})

chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === "local") {
        if ("nextSwimlaneId" in changes) {
            updateNextSwimlane()
        }
        if ("swimlaneIds" in changes) {
            updateSwimlanesTotal()
        }
        if ("dailyStatus" in changes) {
            updateStatus();
        }
    }
})

function updateNextSwimlane() {
    chrome.storage.local.get("nextSwimlaneId", (value) => {
        setDebugSwimlane(value.nextSwimlaneId)
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
            document.getElementById("scrollToCurrent").disabled = false
        } else {
            document.getElementById("proceed").innerText = "Start daily"
            document.getElementById("scrollToCurrent").disabled = true
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