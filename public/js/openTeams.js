$(document).ready(() => {
  $.get("/api/open-teams").then((data) => {
    const team = data;
    console.log(team);
    for (let i = 0; i < team.length; i++) {
      const cardFormat = `
<div class="card">
<div class="card-header">
    <span>${team[i].teamName}</span>
</div>
<div class="card-body">
    <h5 class="card-title">Current Roster</h5>
    <ul class="card-text">
    <li>Current Player Count: ${team[i].playerCount}</li>
    <li>Current Team Rank: ${team[i].teamRank}</li>
    </ul>
    <a class="btn btn-primary btn-lg" href="#" role="button">Join</a>
</div>
</div>
`;
      $("#openTeams").prepend(cardFormat);
    }
  });
});
