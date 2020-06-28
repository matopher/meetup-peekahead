const baseEndpoint = 'https://api.meetup.com';
const proxy = `https://cors-anywhere.herokuapp.com/`;
const proUrlName = `Techlahoma`;
const eventList = document.querySelector('.event-list');

function getParameterByName(name) {
  var match = RegExp('[#&]' + name + '=([^&]*)').exec(window.location.hash);
  return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}

function getAccessToken() {
  return getParameterByName('access_token');
}

async function fetchAndDisplay() {
  const token = getAccessToken();

  const groups = await getGroupsWithUpcomingEvent(token);
  console.log(groups);

  groups.forEach((group) => {
    async () => {
      let urlName = group.urlName;

      let events = await getUpcomingEvents(token, urlName);
      console.log(events);

      displayEvents(events);
    };
  });

  // const events = await getUpcomingEvents(token, 'FreeCodeCamp-Norman');
  // console.log(events);

  // displayEvents(events);
}

async function getGroupsWithUpcomingEvent(token) {
  const response = await fetch(`${proxy}${baseEndpoint}/pro/${proUrlName}/groups?upcoming_events_min=1`, {
    headers: new Headers({
      Authorization: `Bearer ${token}`,
    }),
  });

  let groupData = await response.json();
  return groupData;
}

async function getUpcomingEvents(token, groupUrlName) {
  let response = await fetch(`${proxy}${baseEndpoint}/${groupUrlName}/events?status=upcoming`, {
    headers: new Headers({
      Authorization: `Bearer ${token}`,
    }),
  });

  let eventData = await response.json();
  return eventData;
}

function displayEvents(events) {
  console.log('creating events');

  const html = events.map(
    (event) => `
    <div>
      <h3>${event.name} - ${event.group.name}</h3>
      <p>${new Date(event.time).toDateString()}</p>
      <p>${event.description}</p>
      <a href="${event.link}">View Event &rarr;</a>
    </div>
    `
  );
  eventList.innerHTML = html.join('');
}

fetchAndDisplay();
