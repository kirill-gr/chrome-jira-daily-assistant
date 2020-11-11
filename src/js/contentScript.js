/**
 * @param {[]} array
 */
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function init() {
    let swimlaneIds = [];
    let allSwimlanes = document.getElementsByClassName("ghx-swimlane")
    for (let swimlane of allSwimlanes) {
        let swimlaneId = swimlane.attributes['swimlane-id'].value;
        if (parseInt(swimlaneId) !== allSwimlanes.length) {
            swimlaneIds.push(swimlaneId);
        }
        collapse(swimlane);
    }
    shuffleArray(swimlaneIds);

    chrome.storage.local.set({nextSwimlaneId: 0, swimlaneIds: swimlaneIds, dailyStatus: "ongoing"}, () => next())
}

function next() {
    chrome.storage.local.get(["nextSwimlaneId", "swimlaneIds"], (value) => {
        if (!value.swimlaneIds || (!value.nextSwimlaneId && value.nextSwimlaneId !== 0)) {
            init()
            return
        }

        let swimlaneIds = value.swimlaneIds;
        let currentSwimlaneId = value.nextSwimlaneId;

        let allSwimlanes = document.getElementsByClassName("ghx-swimlane")
        if (currentSwimlaneId < swimlaneIds.length) {
            collapseAllAndScrollTo(allSwimlanes, swimlaneIds, currentSwimlaneId++);
            chrome.storage.local.set({nextSwimlaneId: currentSwimlaneId})
        } else {
            expandSwimlanes(allSwimlanes);
            resetState();
        }
    })
}

function scrollToCurrent() {
    chrome.storage.local.get(["nextSwimlaneId", "swimlaneIds"], (value) => {
        if (!value.swimlaneIds || (!value.nextSwimlaneId && value.nextSwimlaneId !== 0)) {
            return
        }

        let allSwimlanes = document.getElementsByClassName("ghx-swimlane")
        collapseAllAndScrollTo(allSwimlanes, value.swimlaneIds, value.nextSwimlaneId - 1);
    });
}

/**
 * @param {HTMLCollectionOf<Element>} allSwimlanes
 * @param {number[]} swimlaneIds
 * @param {number} currentSwimlaneId
 */
function collapseAllAndScrollTo(allSwimlanes, swimlaneIds, currentSwimlaneId) {
    for (let swimlane of allSwimlanes) {
        collapse(swimlane);
    }
    let swimlaneId = swimlaneIds[currentSwimlaneId];
    let currentSwimlane = document.querySelector(`[class~="ghx-swimlane"][swimlane-id="${swimlaneId}"]`);

    scrollTo(currentSwimlane);
}

/**
 * @param {Element} swimlane
 */
function collapse(swimlane) {
    if (!swimlane.classList.contains("ghx-closed")) {
        clickSwimlaneExpander(swimlane);
    }
}

/**
 * @param {Element} swimlane
 */
function expand(swimlane) {
    if (swimlane.classList.contains("ghx-closed")) {
        clickSwimlaneExpander(swimlane);
    }
}

function clickSwimlaneExpander(swimlane) {
    swimlane.getElementsByClassName("ghx-expander")[0].click()
}

/**
 * @param {Element} swimlane
 */
function scrollTo(swimlane) {
    expand(swimlane);
    swimlane.scrollIntoView();
    // workaround for column headers covering the swimlane
    let columnHeaders = document.getElementById("ghx-column-headers");
    let headerStalker = document.getElementById("ghx-swimlane-header-stalker");
    let pool = document.getElementById("ghx-pool");
    if (swimlane.classList.contains("ghx-first")) {
        pool.scrollBy(0, -(columnHeaders.offsetHeight + headerStalker.offsetHeight))
    } else {
        pool.scrollBy(0, -(headerStalker.offsetHeight - 1));
    }
}

/**
 * @param {HTMLCollectionOf<Element>} swimlanes
 */
function expandSwimlanes(swimlanes) {
    for (let swimlane of swimlanes) {
        if (swimlane.classList.contains("ghx-closed")) {
            swimlane.getElementsByClassName("ghx-expander")[0].click()
        }
    }
}

function resetState() {
    chrome.storage.local.remove(["swimlaneIds", "nextSwimlaneId", "dailyStatus"])
}

chrome.runtime.onMessage.addListener((request) => {
    switch (request.message) {
        case "restart":
            resetState();
            break;
        case "proceed":
            next();
            break;
        case "scrollToCurrent":
            scrollToCurrent();
            break;
        default:
            console.log("Daily Stand up script: Unknown command");
    }
});