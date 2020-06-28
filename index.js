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

  const events = await getUpcomingEvents(token, 'FreeCodeCamp-Norman');
  console.log(events);

  displayEvents(events);
}

// async function fetchProGroups(token) {
//   const res = await fetch(`${proxy}${baseEndpoint}/pro/${proUrlName}/groups`, {
//     headers: new Headers({
//       Authorization: `Bearer ${token}`,
//     }),
//   });
//   const data = await res.json();

//   // let groups = data.map((group) => {
//   //   return group.urlname;
//   // });
//   let groups = ['FreeCodeCamp-Norman'];

//   console.log('Groups list', groups);

//   groups.forEach((group) => {
//     console.log('current group', group);

//     let upcoming = fetchGroupUpcomingEvents(token, group);

//     return upcoming;

//     // upcoming.forEach((event) => {
//     //   console.log('name: ', event.name);
//     // });
//   });

//   // return groups;
// }

async function getUpcomingEvents(token, groupUrlName) {
  let response = await fetch(`${proxy}${baseEndpoint}/${groupUrlName}/events?status=upcoming`, {
    headers: new Headers({
      Authorization: `Bearer ${token}`,
    }),
  });

  let data = await response.json();
  return data;
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
