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
        document.getElementById("debug-swimlane").innerText = msg.swimlaneCurrent
        document.getElementById("debug-swimlane-total").innerText = msg.swimlanesTotal
    }
    if (msg.message === 'updateStateEvt') {
        document.getElementById("debug-swimlane").innerText = msg.swimlaneCurrent
    }
})