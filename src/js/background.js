chrome.runtime.onInstalled.addListener(() => {
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
        chrome.declarativeContent.onPageChanged.addRules([{
            conditions: [new chrome.declarativeContent.PageStateMatcher({
                pageUrl: {pathContains: 'RapidBoard.jspa'},
            })
            ],
            actions: [new chrome.declarativeContent.ShowPageAction()]
        }]);
    });
});

chrome.runtime.onMessage.addListener((msg) => {
    if (msg.message === 'initDoneEvt') {
        chrome.storage.local.set({currentSwimlaneId: msg.swimlaneIds})
        chrome.storage.local.set({swimlineIds: msg.swimlaneIds})
        chrome.storage.local.set({dailyStatus: "ongoing"})
    }
    if (msg.message === 'updateStateEvt') {
        chrome.storage.local.set({currentSwimlaneId: msg.swimlaneCurrent})
    }
    if (msg.message === 'noMoreParticipants') {
        chrome.storage.local.remove("swimlineIds")
        chrome.storage.local.remove("currentSwimlaneId")
        chrome.storage.local.remove("dailyStatus")
    }
})