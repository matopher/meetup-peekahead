const baseEndpoint = 'https://api.meetup.com';
const proxy = `https://cors-anywhere.herokuapp.com/`;
const proUrlName = `Techlahoma`;
const eventList = document.querySelector('.event-list');
const copyButton = document.querySelector('#copyButton');

function getParameterByName(name) {
  var match = RegExp('[#&]' + name + '=([^&]*)').exec(window.location.hash);
  return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}

function getAccessToken() {
  return getParameterByName('access_token');
}

async function fetchAndDisplay() {
  const token = getAccessToken();

  if (token) {
    document.querySelector('#sign-in').classList.add('d-none');
  }

  const groups = await getGroupsWithUpcomingEvent(token);
  console.log(groups);

  for (group of groups) {
    let urlName = group.urlname;
    console.log(urlName);

    async function getEventsByGroup() {
      let events = await getUpcomingEvents(token, urlName);
      await displayEvents(events);
      console.log(`Added new event!`, events);
    }
    getEventsByGroup();
  }
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
  const daysAhead = 10;
  let unformattedDate = new Date(Date.now() + daysAhead * 24 * 60 * 60 * 1000).setUTCHours(0, 0, 0, 0);
  let noLaterThanDate = new Date(unformattedDate).toISOString().slice(0, -1);

  let response = await fetch(
    `${proxy}${baseEndpoint}/${groupUrlName}/events?status=upcoming&no_later_than=${noLaterThanDate}`,
    {
      headers: new Headers({
        Authorization: `Bearer ${token}`,
      }),
    }
  );

  let eventData = await response.json();
  return eventData;
}

function displayEvents(events) {
  console.log('creating events');

  let onlineEvents = events.filter((event) => event.is_online_event === true);

  const html = onlineEvents.map(
    (event) => `
    <div>
      <a href="${event.link}">
        <h3>${event.name} - ${event.group.name}</h3>
      </a>
      <strong>${moment(event.time).format('dddd, MMMM Do @ h:mm a')}</strong>
      <p>${event.description}</p>
      <a href="${event.link}">View Event &rarr;</a>
      <hr>
    </div>
    `
  );
  eventList.innerHTML += html;
}

function copyToClipboard() {
  const el = document.createElement('textarea');
  el.value = eventList.innerHTML;
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
}

copyButton.addEventListener('click', () => {
  copyToClipboard();
  document.querySelector('.alert').classList.remove('d-none');
});

fetchAndDisplay();
