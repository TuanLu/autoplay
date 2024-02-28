let playerTimmer;
let maxTimeToTry = 5;
let maxTimeToTryFindSearchBox = 10;
let searchBoxTimmer;
let autoPlayFlag = true;
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
        createPiPButton();
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

function registerEnterEvent() {
    const iframe = document.getElementById('frame_content');
    const innerDoc = iframe.contentDocument || iframe.contentWindow.document;
    const searchBoxElem = innerDoc.getElementById('xsearch');
    const submitBtn = innerDoc.querySelector('input[type=button][value="TÌM"');
    submitBtn.style.backgroundColor = 'green';
    searchBoxElem.addEventListener('keyup', function(event) {
        event.preventDefault();
        if(event.keyCode === 13 || event.key === 'Enter') {
            if(searchBoxElem.value && submitBtn) {
                console.log('doSomething :>> ', {event, submitBtn, val: searchBoxElem.value});
                submitBtn.click();
            }
        }
    });
}

function findSearchBox() {
    const iframe = document.getElementById('frame_content');
    const innerDoc = iframe.contentDocument || iframe.contentWindow.document;
    maxTimeToTryFindSearchBox--;
    if(!innerDoc || !innerDoc.getElementById('xsearch')) {
        searchBoxTimmer = setTimeout(findSearchBox, 3000);
        if(maxTimeToTryFindSearchBox < 0) {
            console.log('>> can not find searchbox after max time tried!');
            clearTimeout(searchBoxTimmer);
        }
    } else {
        clearTimeout(searchBoxTimmer);
        registerEnterEvent();
    }
}

function addInlineIframe({src, top}) {
    const vIframe = document.createElement('iframe');
    vIframe.src = src;
    vIframe.width = 200;
    vIframe.height = 200;
    vIframe.style = `position: fixed; top: ${top}px; left: 0; z-index: 10000;`;
    const script = document.createElement('script');
    script.textContent = `
        setTimeout(() => {
            window?.player?.player?.play();
        }, 3000)
    `;
    document.body.append(vIframe);
    document.body.append(script);
}

async function togglePictureInPicture() {
    // Close Picture-in-Picture window if any.
    if (documentPictureInPicture.window) {
        documentPictureInPicture.window.close();
        return;
    }

    // Open a Picture-in-Picture window.
    const pipWindow = await documentPictureInPicture.requestWindow({
        width: 640,
        height: 360,
    });

    // Copy all style sheets.
    [...document.styleSheets].forEach((styleSheet) => {
        try {
            const cssRules = [...styleSheet.cssRules]
                .map((rule) => rule.cssText)
                .join('');
            const style = document.createElement('style');

            style.textContent = cssRules;
            pipWindow.document.head.appendChild(style);
        } catch (e) {
            const link = document.createElement('link');

            link.rel = 'stylesheet';
            link.type = styleSheet.type;
            link.media = styleSheet.media;
            link.href = styleSheet.href;
            pipWindow.document.head.appendChild(link);
        }
    });

    // Move video to the Picture-in-Picture window and make it full page.
    const video = document.querySelector('#player_html5_api');
    pipWindow.document.body.append(video);
    video?.classList?.toggle('fullpage', true);

    // Listen for the PiP closing event to move the video back.
    pipWindow.addEventListener('pagehide', (event) => {
        const videoContainer = document.querySelector('#player');
        const pipVideo = event.target.querySelector('#player_html5_api');
        pipVideo?.classList?.toggle('fullpage', false);
        videoContainer.append(pipVideo);
    });
}


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

function createPiPButton() {
    const pipButton = document.createElement('button');
    pipButton.textContent = 'PIP';
    pipButton.style = 'position: fixed;top: 0;left: 0;z-index: 100000; width: 3em; height: 3em;';
    pipButton.addEventListener('click', function() {
        togglePictureInPicture();
    });
    document.body.append(pipButton);
}

function afterDOMLoaded() {
    autoSelectCheckbox();
    // findSearchBox();
    // addInlineIframe({ top: 100, src: 'https://eplayvid.net/watch/bc361340e8101df'});
    // addInlineIframe({ top: 300, src: 'https://eplayvid.net/watch/70ee23e6bdec7c7'});
    // addInlineIframe({ top: 500, src: 'https://eplayvid.net/watch/8d0b0592a45a826'});
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