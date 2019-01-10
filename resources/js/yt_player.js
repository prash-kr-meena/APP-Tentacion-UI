'use strict';
let socket = io.connect('http://localhost:5000');



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

      event.target.playVideo();
}

// 5. The API calls this function when the player's state changes.
//    The function indicates that when playing a video (state=1), the player should play for six seconds and then stop.
//    which may indicate that the player is playing, paused, finished, and so forth.




let done = false;
function onPlayerStateChange(event) {
      console.log("player state changed 0_0");

      // console.log(event);
      if (event.data == YT.PlayerState.PLAYING && !done) {
            setTimeout(stopVideo, 6000);
            done = true;
      }

      // socket.emit('sync',{

      // });

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
      // console.log(ytPlayer.());
      // console.log(ytPlayer.());
      // console.log(ytPlayer.());
      // console.log(ytPlayer.());
      // console.log(ytPlayer.());





      /* clearVideo: function a()
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
}

function stopVideo() {
      ytPlayer.stopVideo();
}




// Listen for chat event
socket.on('sync', function(event){
      console.log('sync event listened');
});

