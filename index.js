import Spotify from 'spotify-web-api-node';
import config from './config';
import artists from './artists';

if (location.hash) {

    const spotifyApi = initializeSpotifyApi();

    if (spotifyApi) {

        spotifyApi.getArtistAlbums(artists.KATE_BUSH).then(
            function(data) {
                const container = document.getElementById('container');
                data.body.items.forEach(item => {
                    if (item.album_group === 'album' || item.album_group === 'single') {
                        const img = document.createElement('img');
                        img.setAttribute('src', item.images[1].url);
                        container.appendChild(img);
                    }
                });
            },
            function(err) {
                console.error(err);
            }
        );
    }

} else {
    goAuthorizeUser();
}

function goAuthorizeUser() {
    const state = generateRandomString(8);
    localStorage.setItem(config.spotifyStateKey, state);

    window.location =
        `${config.spotifyAuthUri}?` +
        `client_id=${config.spotifyClientId}&` +
        `response_type=token&` +
        `redirect_uri=${config.redirectUri}` +
        `&state=${state}`;
}

function initializeSpotifyApi() {
    const params = getHashParams();
    const savedState = localStorage.getItem(config.spotifyStateKey);

    if (params.state === savedState && params.access_token) {
        const api = new Spotify({
            clientId: config.spotifyClientId,
            clientSecret: config.spotifyClientSecret
        });
        api.setAccessToken(params.access_token);
        return api;

    } else {
        console.error('state did not match');
    }
}

function getHashParams() {
    var hashParams = {};
    var e, r = /([^&;=]+)=?([^&;]*)/g,
        q = window.location.hash.substring(1);
    while ( e = r.exec(q)) {
        hashParams[e[1]] = decodeURIComponent(e[2]);
    }
    return hashParams;
}

function generateRandomString(length) {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}