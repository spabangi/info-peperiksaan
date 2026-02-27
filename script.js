// Replace with your Google Sheet ID
const sheetID = "<1MymTLO2DSGL5SM7MqGkyzyoAe5dYXFIfxMFxbzTgUmY>";
const sheetURL = `https://spreadsheets.google.com/feeds/list/${sheetID}/od6/public/values?alt=json`;

async function fetchData() {
  const response = await fetch(sheetURL);
  const data = await response.json();
  const students = data.feed.entry.map(item => ({
    id: item.gsx$studentid.$t,
    name: item.gsx$studentname.$t,
    course: item.gsx$coursecode.$t,
    date: item.gsx$examdate.$t,
    time: item.gsx$examtime.$t,
    venue: item.gsx$venue.$t,
    seat: item.gsx$seatnumber.$t
  }));
  return students;
}

function searchStudent(students, query) {
  query = query.toLowerCase();
  return students.filter(student => 
    student.id.toLowerCase() === query ||
    student.name.toLowerCase().includes(query)
  );
}

document.getElementById("searchBtn").addEventListener("click", async () => {
  const query = document.getElementById("searchInput").value.trim();
  const resultsDiv = document.getElementById("results");

  if (!query) {
    resultsDiv.innerHTML = "<p>Please enter something to search.</p>";
    return;
  }

  const students = await fetchData();
  const results = searchStudent(students, query);

  if (results.length === 0) {
    resultsDiv.innerHTML = "<p>No matching records found.</p>";
    return;
  }

  resultsDiv.innerHTML = results.map(s => `
    <p>
      <b>${s.name}</b> (${s.id})<br>
      ${s.course} – ${s.date} ${s.time}<br>
      Venue: ${s.venue} | Seat: ${s.seat}
    </p>
  `).join('');
});
