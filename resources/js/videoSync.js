'use strict';

// !! ------  ------ youtube player   ------ ------

// 2. This code loads the IFrame Player API code asynchronously.
let tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
let firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);


// 3. This function creates an <iframe> (and YouTube player) after the API code downloads.
let ytPlayer;
let yt_video_id = 'Xa0Q0J5tOP0';

let youtubePlayerOptions = {
      width: 1000,
      height: 540,
      videoId: yt_video_id,
      playerVars: {
            color: 'red',
            playlist: 'taJ60kskkns,FG0fTKAqZ5g'
      },
      events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
      }
};

function onYouTubeIframeAPIReady() {
      console.log("player API code downloads --> YT Iframe API ready !");
      ytPlayer = new YT.Player('video-placeholder', youtubePlayerOptions);
}


// 4. The API will call this function when the video player is ready.
// The onPlayerReady function will execute when the onReady event fires.
function onPlayerReady(event) {
      console.log('player is ready!!');
      document.getElementById('loading').style.display = 'none'; // stop loading and play the video

      document.getElementById('video-placeholder').style.borderColor = '#FF6D00';
      document.getElementById('video-placeholder').style.borderWidth = '1px';
}




// 5. The API calls this function when the player's state changes.
//    The function indicates that when playing a video (state=1), the player should play for six seconds and then stop.
//    which may indicate that the player is playing, paused, finished, and so forth.
function onPlayerStateChange(event) {
      // console.log("player state changed");
      changeBorderColor(event.data);

      // console.log(event.data); // ---> give the player state too
      // console.log(ytPlayer.getPlayerState(), "<<-- player state");


      let currentTime =  ytPlayer.getCurrentTime();
      let playerState = ytPlayer.getPlayerState();

      let videoUrl = ytPlayer.getVideoUrl();
      let parsedUrl = parseQuery(videoUrl);
      let videoId = parsedUrl.v;  // as https://www.youtube.com/watch?v=t6rHHnABoT8

      let isMuted = ytPlayer.isMuted();

      if(host){ // so if you  are the host then only you can emit this event
            socket.emit('onPlayerStateChange',{
                  playerState,
                  currentTime,
                  videoId,
                  isMuted
            });
      }

      /*
      console.log("==============================");
      console.log(ytPlayer.getCurrentTime());
      console.log(ytPlayer.getDuration());
      console.log(ytPlayer.getPlayerState());
      console.log(ytPlayer.getPlaylist());
      console.log(ytPlayer.getPlaylistId());
      console.log(ytPlayer.getPlaylistIndex());
      console.log(ytPlayer.getVideoUrl());
      console.log(ytPlayer.getVolume());


      console.log(ytPlayer.hideVideoInfo());

      console.log(ytPlayer.isMuted());
      console.log(ytPlayer.isVideoInfoVisible());
      */

}


function changeBorderColor(playerStatus) {
      let color;
      switch(playerStatus){
            case -1 :
            color = "#37474F"; // unstarted = gray
            break;

            case 0 :
            color = "#FFFF00"; // ended = yellow
            break;

            case 1 :
            color = "#33691E"; // playing = green
            break;

            case 2 :
            color = "#DD2C00"; // paused = red
            break;

            case 3 :
            color = "#AA00FF"; // buffering = purple
            break;

            case 4 :
            alert('status  is 4 ');
            color = undefined;
            break;

            case 5 :
            color = "#FF6DOO"; // video cued = orange
            break;
      }
      if (color) {
            document.getElementById('video-placeholder').style.borderColor = color;
      }
}



// -------- To stop vidoe after 6 sec --------
/*
let done = false;

function onPlayerStateChange(event) {
      if (event.data == YT.PlayerState.PLAYING && !done) {
            setTimeout(stopVideo, 0);
            done = true;
      }
}

function stopVideo() {
      ytPlayer.stopVideo();        // stop video
}
*/




// ?? ------------------------   Socket Listening   ------------------------

// Listen for chat event
socket.on('onPlayerStateChange', function(obj){
      console.log('onPlayerStateChange  Event from server');
      console.log(obj);

      let currVideoUrl = ytPlayer.getVideoUrl();
      let parsedUrl = parseQuery(currVideoUrl);
      let currVideoId  = parsedUrl.v;

      if(obj.videoId !== currVideoId){ // as https://www.youtube.com/watch?v=t6rHHnABoT8
            console.log("different Videos");
            console.log(obj.videoId, '  ---  ', currVideoId);
            ytPlayer.loadVideoById(obj.videoId);
      }

      ytPlayer.seekTo(obj.currentTime);

      switch(obj.playerState){
            case -1 : // unstarted = gray
            break;

            case 0 :// ended = yellow
            ytPlayer.stopVideo();        // stop video
            break;

            case 1 :// playing = green
            ytPlayer.playVideo();        // stop video
            break;

            case 2 :// paused = red
            ytPlayer.pauseVideo();        // stop video
            break;

            case 3 :// buffering = purple

            break;

            case 4 :
            alert('status  is 4 ');
            break;

            case 5 :// video cued = orange
            break;
      }
});





// !  ---------------- helper functions  ----------------
function parseQuery(url) {
      var query = {};
      let queryString = url.split('?')[1];
      // console.log(queryString, '<<<------');
      var pairs = (queryString[0] === '?' ? queryString.substr(1) : queryString).split('&');
      for (var i = 0; i < pairs.length; i++) {
            var pair = pairs[i].split('=');
            query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
      }
      // console.log(query, "<<~~~~~~~~");
      return query;
}










/*
clearVideo: function a()
​
cuePlaylist: function a()
​
cueVideoById: function a()
​
cueVideoByUrl: function a()
​etAvailableQualityLevels: function a()
​
getCurrentTime: function a()
​
getDuration: function a()
​
getPlayerState: function a()
​
getPlaylist: function a()
​
getPlaylistId: function a()
​
getPlaylistIndex: function a()
​
getVideoUrl: function a()
​
getVolume: function a()
​
hideVideoInfo: function a()
​
isMuted: function a()
​
isVideoInfoVisible: function a()
​
loadPlaylist: function a()
​
loadVideoById: function a()
​
loadVideoByUrl: function a()
​
nextVideo: function a()
​
pauseVideo: function a()
​
playVideo: function a()
​
playVideoAt: function a()
​
previousVideo: function a()
​
removeCueRange: function a()
​

seekTo: function a()
​
setLoop: function a()
​
setOption: function a()
​
setPlaybackQuality: function a()
​
setPlaybackRate: function a()
​
setShuffle: function a()
​
setSphericalProperties: function a()
​
setVolume: function a()
​
showVideoInfo: function a()
​
stopVideo: function a()
​
unMute: function a()
​
unloadModule: function a()
*/