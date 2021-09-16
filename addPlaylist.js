// Used to fill and add to playlists automatically from a user's videos page

// Adds top n newest videos to the specified playlist
async function addPlaylist(num, plName)
{
    // Sleep function
    function sleep(ms)
    {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Get all loaded videos
    let allVids = document.querySelectorAll("ytd-grid-video-renderer");
    let tempButton;
    let allPopUps;
    let tempOptions;
    let menuPopUp;
    let addButton;
    let tempSelector;
    let plSelector;
    let tempPlaylists;
    let tempPL;
    let playlist;
    let pNum;
    let titleNotFound = true;
    let sleepTime = 100;

    if (allVids.length <= 0) {
        // Something broke
        throw "addPlaylist: no ytd-grid-video-renderer tags found";
    }

    // If called from fillPlaylist()
    if (num == "all") {
        num = allVids.length;
    }

    // PRIMING PHASE
    // First iteration that primes the pop-up menus out of non-existence

    // Get video kebab button
    tempButton = allVids[num - 1].querySelectorAll("button");

    if (tempButton.length != 1) {
        // Something changed -- investigate
        throw "addPlaylist: there is more or less than 1 button per video";
    }

    if (document.querySelectorAll("ytd-popup-container").length != 1) {
        // Something changed -- investigate
        throw "addPlaylist: there is more or less than 1 ytd-popup-container";
    }

    // Get all pop-ups
    allPopUps = document.querySelectorAll("ytd-popup-container")[0];

    // Button has not been clicked yet, so there should be 0 if unprimed and 1 if primed already
    tempOptions = allPopUps.querySelectorAll("tp-yt-iron-dropdown");

    // Click kebab button
    tempButton[0].click();

    if (tempOptions.length == 0) {
        // Waiting for the pop-up menu to be created
        while (tempOptions.length < 1) {
            await sleep(sleepTime);

            // Refresh allPopUps
            allPopUps = document.querySelectorAll("ytd-popup-container")[0];
            tempOptions = allPopUps.querySelectorAll("tp-yt-iron-dropdown");
        }
    }
    else if (tempOptions.length == 1) {
        // Something changed or it is already primed -- investigate
        throw "addPlaylist: Either the menu is already primed or there is more than 1 tp-yt-iron-dropdown tag when primed. Refresh the page once to be sure.";
    }
    else {
        // Something changed -- investigate
        throw "addPlaylist: there is more than 1 tp-yt-iron-dropdown tag when primed";
    }

    // SAME menuPopUp ELEMENT IS USED BY ALL VIDEOS
    // Get pop-up menu
    menuPopUp = tempOptions[0];

    // Wait for it to become visible (if not already)
    while (menuPopUp.style.display == "none") {
        await sleep(sleepTime);
    }

    // SAME addButton ELEMENT IS USED BY ALL VIDEOS
    // Get "Save to playlist" button
    addButton = menuPopUp.querySelectorAll("ytd-menu-service-item-renderer")[2];

    // Check that it is correct
    if (addButton.querySelectorAll("yt-formatted-string")[0].innerText != "Save to playlist") {
        // Something changed -- investigate
        throw 'addPlaylist: button does not match "Save to playlist"';
    }

    // Button has not been clicked yet, so there should be 0 if unprimed and 1 if primed already
    tempSelector = allPopUps.querySelectorAll("tp-yt-paper-dialog");

    // Click "Save to playlist"
    addButton.click();

    if (tempSelector.length == 0) {
        // Waiting for the playlist menu to be created
        while (tempSelector.length < 1) {
            await sleep(sleepTime);

            // Refresh allPopUps
            allPopUps = document.querySelectorAll("ytd-popup-container")[0];
            tempSelector = allPopUps.querySelectorAll("tp-yt-paper-dialog");
        }
    }
    else {
        // Something changed -- investigate
        throw "addPlaylist: there is more than 1 tp-yt-paper-dialog tag when primed";
    }

    plSelector = tempSelector[0];

    // Wait for it to become visible (if not already)
    while (plSelector.style.display == "none") {
        await sleep(sleepTime);
    }

    // All playlists
    tempPlaylists = plSelector.querySelectorAll("ytd-playlist-add-to-option-renderer");

    // Playlist slot to use after first iteration
    tempPL = tempPlaylists[1].querySelectorAll("tp-yt-paper-checkbox");

    if (tempPL.length != 1) {
        // Something changed -- investigate
        throw "addPlaylist: there is more or less than 1 tp-yt-paper-checkbox per playlist";
    }

    // Playlist to use after first iteration
    playlist = tempPL[0];

    // Find playlist title in tempPlaylists
    for (pNum = 0; pNum < tempPlaylists.length; pNum++) {
        if (tempPlaylists[pNum].querySelectorAll("yt-formatted-string")[0].innerText == plName) {
            // Playlist title found
            titleNotFound = false;
            // Click checkbox
            tempPlaylists[pNum].querySelectorAll("tp-yt-paper-checkbox")[0].click();
            // Sleep in case it needs time to process click
            await sleep(sleepTime);
            break;
        }
    }

    if (titleNotFound) {
        throw "addPlaylist: Playlist title not found. Either playlist does not exist or something broke.";
    }

    // First iteration done
    console.log(num);
    num = num - 1;

    // REGULAR OPERATION
    // Add remaining top n videos to playlist from oldest to newest
    for (let i = num; i > 0; i--) {
        // Get video kebab button
        tempButton = allVids[i - 1].querySelectorAll("button");

        if (tempButton.length != 1) {
            // Something changed -- investigate
            throw "addPlaylist: there is more or less than 1 button per video";
        }

        // Click kebab button
        tempButton[0].click();

        // Wait for it to become visible (if not already)
        while (menuPopUp.style.display == "none") {
            await sleep(sleepTime);
        }

        // Click "Save to playlist"
        addButton.click();

        // Wait for it to become visible (if not already)
        while (plSelector.style.display == "none") {
            await sleep(sleepTime);
        }

        // Check playlist title
        if (playlist.querySelectorAll("yt-formatted-string")[0].innerText == plName) {
            // Click correct playlist title
            playlist.click();
        }
        else if (tempPlaylists[pNum].querySelectorAll("yt-formatted-string")[0].innerText == plName) {
            // Playlist has not changed slots yet -- not quick enough
            // Click correct playlist title
            tempPlaylists[pNum].querySelectorAll("tp-yt-paper-checkbox")[0].click();
        }
        else {
            // Something changed -- investigate
            throw "addPlaylist: playlist title in expected and original list slots does not match past 1st iteration";
        }

        // Sleep in case it needs time to process click
        await sleep(sleepTime);
        console.log(i);
    }
}

// Adds every single video to the specified playlist (as long as they are loaded on the page)
function fillPlaylist(plName)
{
    addPlaylist("all", plName);
}

// FOR CONVENIENCE
addPlaylist(, "Every Tom Scott Video Ever");
