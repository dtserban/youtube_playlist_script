# addPlaylist.js

This code is used to automatically add a large quantity of YouTube videos to a pre-existing YouTube playlist. It is designed to be run in the browser console on the "Videos" page of any given YouTube channel whose videos you want to add to your playlist. The code adds videos to a playlist by navigating the page elements and programmatically performing the necessary button clicks on the videos to save them to the specified playlist as though the user were doing it manually. A large batch of 600 videos can be added to a playlist in about 10 minutes.

In order for the code to work properly, every video that is being added to the playlist must be loaded and appear on the page. If you do not scroll down on the page to make all the videos you want load and appear on the page, those videos that are missing will not be added to the playlist. The playlist must already have been created before running the code and it is recommended (but not required) that the playlist be configured to add new videos to the top instead of the bottom. This has been tested and run in Chrome. If any issues are encountered, a page refresh may fix them.

## Functions

### `addPlaylist(num, plName)`

This adds the top n newest videos to the specified playlist. It takes the number of videos and the playlist name as arguments. Videos are added in ascending chronological order, starting with the oldest of the top n newest videos.

### `fillPlaylist(plName)`

This adds all of a channel's videos to the specified playlist. It takes the playlist name as an argument. Videos are added in ascending chronological order, starting with the oldest video. *Make sure all of the videos have been loaded onto the page before calling this function.*

### `addSelected(plName, vidArray)`

This adds selected videos to the specified playlist passed in as an array of video numbers (with 1 being the most recent video). It takes the playlist name and array of numbers as arguments. The array is designed to be passed in with numbers in descending order.  
e.g. `[98, 65, 43, 27, 11]`  
However, the video numbers can be in any order. Each video indicated in the array is added to the playlist in order starting from the beginning of the array.

## Future work

Add functionality for recognizing substrings in video titles. e.g. Include videos with substring in title or exclude videos with substring in title. Include the ability to enter multiple substrings at the same time both for inclusion and exclusion purposes.
