let playerTimmer;
let maxTimeToTry = 5;
function checkPlayer() {
    maxTimeToTry--;
    console.log('>> check player', {ok: window?.player?.player})
    if(!window?.player?.player) {
        playerTimmer = setTimeout(checkPlayer, 1000);
        if(maxTimeToTry < 0) {
            console.log('>> can not find player after max time tried!');
            clearTimeout(playerTimmer);
        }
    } else {
        clearTimeout(playerTimmer);
        setupAutoPlayVideoEvents(window?.player?.player);
        // forceToPlayVideoInHidden();
    }
}
function autoPlay(player) {
    try {
        player.muted(true);
        player.play();
    } catch(error) {
        console.warn('Can not auto play video!');
    }
}

let autoPlayFlag = true;

function setupAutoPlayVideoEvents(player) {
    /**
     const EVENTS = [
        // HTMLMediaElement events
        'abort',
        'canplay',
        'canplaythrough',
        'durationchange',
        'emptied',
        'ended',
        'error',
        'loadeddata',
        'loadedmetadata',
        'loadstart',
        'pause',
        'play',
        'playing',
        'progress',
        'ratechange',
        'seeked',
        'seeking',
        'stalled',
        'suspend',
        'timeupdate',
        'volumechange',
        'waiting',

        // HTMLVideoElement events
        'enterpictureinpicture',
        'leavepictureinpicture',

        // Element events
        'fullscreenchange',
        'resize',

        // video.js events
        'audioonlymodechange',
        'audiopostermodechange',
        'controlsdisabled',
        'controlsenabled',
        'debugon',
        'debugoff',
        'disablepictureinpicturechanged',
        'dispose',
        'enterFullWindow',
        'error',
        'exitFullWindow',
        'firstplay',
        'fullscreenerror',
        'languagechange',
        'loadedmetadata',
        'loadstart',
        'playerreset',
        'playerresize',
        'posterchange',
        'ready',
        'textdata',
        'useractive',
        'userinactive',
        'usingcustomcontrols',
        'usingnativecontrols',
    ];
     */
    player.on('playing', function() {
        console.log('-->> video is playing');
        if(autoPlayFlag) {
            player.currentTime(player.duration() - 5);
            autoPlayFlag = false;
        }
    });
    player.on('ended', function() {
        alert('ENDED');
    });
    player.on('error', function() {
        console.warn(player.error());
    });
    player.on('waiting', function() {
        console.info('>> waiting event');
    });
    player.on('abort', function() {
        console.info('>> abort event');
    });
    // player.on('loadedmetadata', function() {
    //     console.log('-->> video loadedmetadata');
    // });
    autoPlay(player);
}

function forceToPlayVideoInHidden() {
    console.info('>> force to play video in hidden');
    const player = window?.player?.player;
    if(player && player.paused()) {
        console.log('>> force to call on hidden')
        player.play();
    }
    function handleVisibilityChange() {
        if(window.document.hidden) {
            // the page is hidden
            if(player && player.paused()) {
                console.log('>> force to call on hidden')
                player.play();
            }
        } else {
            // the page is visible
            console.info('>> page is visible');
        }
    }

    window.document.addEventListener("visibilitychange", handleVisibilityChange, false);
}

function autoSelectCheckbox() {
    if(document.querySelector('input[type="checkbox"][name="check_full"]') && document.querySelector('input[type="checkbox"][name="check_textarea"]')) {
        document.querySelector('input[type="checkbox"][name="check_full"]').checked = true;
        document.querySelector('input[type="checkbox"][name="check_textarea"]').checked = true;
        document.querySelector('input[type="submit"][name="ok"]').click();
    }
}

function registerEnterEvent() {
    console.log('>> register enter event')
    if(document.querySelector('#xsearch')) {
        document.querySelector('#xsearch').addEventListener('keydown', function(event) {
            if(event.keyCode === 13 || event.key === 'Enter') {
                console.log('press enter', event)
            }

        });
    }
}

function afterDOMLoaded() {
    autoSelectCheckbox();
    // registerEnterEvent();
}

let timmer;
function start() {
    if (document.readyState !== 'complete') {
        timmer = setTimeout(start, 100);
    } else {
        clearTimeout(timmer);
        afterDOMLoaded();
    }
}

start();
checkPlayer();