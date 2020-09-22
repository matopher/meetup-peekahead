const baseEndpoint = 'https://api.meetup.com';
const proxy = `https://cors-anywhere.herokuapp.com/`;
const proUrlName = `Techlahoma`;
const eventList = document.querySelector('.event-list');
const copyButton = document.querySelector('#copyButton');
const daysAhead = 10;

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

  const unsortedEvents = [];

  for (group of groups) {
    let urlName = group.urlname;

    async function getEventsByGroup() {
      let events = await getUpcomingEvents(token, urlName, daysAhead);

      // await displayEvents(events);

      await unsortedEvents.push(events);
      console.log('updated ', unsortedEvents);
    }
    getEventsByGroup();
  }

  console.log('hold on...');

  await new Promise((resolve, reject) => setTimeout(resolve, 4000));

  console.log('resuming');

  let flattenedEvents = _.flatten(unsortedEvents);

  const sortedEvents = _.sortBy(flattenedEvents, ['time']);
  console.log('sorted', sortedEvents);

  displayEvents(sortedEvents);
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

async function getUpcomingEvents(token, groupUrlName, daysAhead) {
  // const daysAhead = 10;
  let unformattedDate = new Date(Date.now() + daysAhead * 24 * 60 * 60 * 1000).setUTCHours(0, 0, 0, 0);
  let noLaterThanDate = new Date(unformattedDate).toISOString().slice(0, -1);

  let response = await fetch(
    `${proxy}${baseEndpoint}/${groupUrlName}/events?status=upcoming&no_later_than=${noLaterThanDate}&desc=true`,
    {
      headers: new Headers({
        Authorization: `Bearer ${token}`,
      }),
    }
  );

  let eventData = await response.json();
  console.log(eventData);
  return eventData;
}

function displayEvents(events) {
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

function displayDaysAhead(daysAhead) {
  const daysText = document.querySelector('.days-ahead');
  daysText.innerHTML = `Showing upcoming online events for the next <strong>${daysAhead} days</strong> until ${moment()
    .add(daysAhead, 'days')
    .format('dddd, MMMM Do')}.`;
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

displayDaysAhead(daysAhead);
fetchAndDisplay();
