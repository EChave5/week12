const API_ENDPOINT = 'https://65a30c2aa54d8e805ed35f6d.mockapi.io/api/SportsTeams';

$.get(API_ENDPOINT).then((data) =>
  data.map((team) => {
    $('tbody').append(
      $(`
      <tr>
        <td>${team.id}</td>
        <td>${teamName}</td>
        <td>${teamLocation}</td>
        <td>${gamesWon}</td>
        <td>
          <button onclick="deleteTeam(${team.id})>Delete</button>
        </td>
      </tr>`)
    )
  })
  )

  $('#submitTeam').click(function() {
    $.post(API_ENDPOINT, {
      teamName: $('#newName').val(), 
      teamLocation: $('#newLocation').val(), 
      gamesWon: $('#newGamesWon').val(),
    })
  })

  function deleteTeam(id) {
    $.ajax(`${API_ENDPOINT}/${id}`, {
      type: 'DELETE',
    })
  }

  function updateTeam() {
    id = $('#updateId').val()

    $.ajax(`${API_ENDPOINT}/${id}`, {
      method: 'PUT',
      data: {
        teamName: $('#updateName').val(), 
        teamLocation: $('#updateLocation').val(),
        gamesWon: $('#updateGamesWon').val(),
      },
    })
  }

  $('#updateTeam').click(updateTeam)