import Spotify from 'spotify-web-api-node';
import utils from './utils';
import config from '../config';
import artists from '../artists';

if (location.hash) {

    const spotifyApi = initializeSpotifyApi();

    if (spotifyApi) {

        const keys = Object.keys(artists);
        const artist = artists[keys[keys.length * Math.random() << 0]];

        spotifyApi.getArtistAlbums(artist).then(
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
    const state = utils.generateRandomString(8);
    localStorage.setItem(config.spotifyStateKey, state);

    window.location =
        `${config.spotifyAuthUri}?` +
        `client_id=${config.spotifyClientId}&` +
        `response_type=token&` +
        `redirect_uri=${config.redirectUri}` +
        `&state=${state}`;
}

function initializeSpotifyApi() {
    const params = utils.getHashParams();
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