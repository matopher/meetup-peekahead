const baseEndpoint = 'https://api.meetup.com/';
const proxy = `https://cors-anywhere.herokuapp.com/`;

function getParameterByName(name) {
  var match = RegExp('[#&]' + name + '=([^&]*)').exec(window.location.hash);
  return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}

function getAccessToken() {
  return getParameterByName('access_token');
}

function boot() {
  var token = getAccessToken();

  console.log(token);

  fetchSelf(token);
}

async function fetchSelf(token) {
  const res = await fetch(`${proxy}${baseEndpoint}/members/self`, {
    headers: new Headers({
      Authorization: `Bearer ${token}`,
    }),
  });
  const data = await res.json();
  console.log(data);
  return data;
}

boot();
