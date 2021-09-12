// Used to fill and add to playlists automatically from a user's videos page

// Adds top n newest videos to the playlist
function addPlaylist(num)
{
    // ---- ADD SLEEP FUNCTION HERE ----

    // Get all loaded videos
    let allVids = document.querySelectorAll("ytd-grid-video-renderer");
    let tempButton;
    let tempOptions;
    let menuPopUp;
    let addButton;
    let plSelector;
    let sleepNum = 100;

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

    if (tempButton.length > 1) {
        // Something changed -- investigate
        throw "addPlaylist: there is more than 1 button per video";
    }

    // Click kebab button
    tempButton[0].click();

    // There has not been any sleep yet, so there should be 2 if unprimed and 3 if primed already
    tempOptions = document.querySelectorAll("tp-yt-iron-dropdown");

    if (tempOptions.length == 2) {
        // Waiting for the pop-up menu to be created
        while (tempOptions.length < 3) {
            // ---- SLEEP 100 ms ----
            tempOptions = document.querySelectorAll("tp-yt-iron-dropdown");
        }
    }
    else if (tempOptions.length == 3) {
        // Something changed or it is already primed -- investigate
        throw "addPlaylist: Either the menu is already primed or there are not 3 tp-yt-iron-dropdown tags when primed. Refresh the page once to be sure.";
    }
    else {
        // Something changed -- investigate
        throw "addPlaylist: there are not 3 tp-yt-iron-dropdown tags when primed";
    }

    // SAME menuPopUp ELEMENT IS USED BY ALL VIDEOS
    // Get pop-up menu
    menuPopUp = tempOptions[2];

    // Wait for it to become visible (if not already)
    while (menuPopUp.style.display == "none") {
        // ---- SLEEP 100 ms ----
    }

    // ASSIGN ADD BUTTON

    // CHECK FOR TOO MANY OPTIONS

    // CLICK IT

    // ASSIGN PLSELECTOR/CHECK FOR ITS EXISTENCE LIKE ABOVE AND WAIT FOR IT

    // WAIT FOR IT TO BECOME VISIBLE

    // FIND PLAYLIST

    // CLICK CHECKBOX

    num = num - 1;

    // REMOVE THIS
    return;

    // REGULAR OPERATION
    // Add remaining top n videos to playlist from oldest to newest
    for (let i = num; i > 0; i--) {
        // Get video kebab button
        tempButton = allVids[i - 1].querySelectorAll("button");

        if (tempButton.length > 1) {
            // Something changed -- investigate
            throw "addPlaylist: there is more than 1 button per video";
        }

        // Click kebab button
        tempButton[0].click();

        while (menuPopUp.style.display == "none") {
            // ---- SLEEP 100 ms ----
        }

        addButton.click();

        // ---- NOT SURE IF THIS ELEMENT IS PERSISTENT YET ----
        while (plSelector.style.display == "none") {
            // ---- SLEEP 100 ms ----
        }

        // ---- FIND PLAYLIST IN LIST AND CLICK CHECKBOX ----

        // ---- UNFINISHED. FILL IN INDICATED MISSING PARTS ----
    }

}

// Adds every single video to the playlist (as long as they are loaded on the page)
function fillPlaylist()
{
    addPlaylist("all");
}

// FOR CONVENIENCE
addPlaylist();
