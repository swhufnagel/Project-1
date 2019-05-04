
// Declare Variables and call initial functions needed on page load
var redirectUri = window.location.href;
var authorizationToken = "";
var queryURL = "";
var searchTerm = $('#searchTerm').val().trim().toLowerCase();
var favButton;
getAuthorizationToken()
displayButton()

// This function toggles classes to hide/display buttons that make it clear to the user what steps they need to take
function displayButton() {
  // Toggle display of login and search button depending on if the user is authenticated
  if (authorizationToken === "Bearer ") {
    $('.field').attr('style', "display:none");
    $('.find').attr('style', "display:none");
    $('#login-button').attr('style', "display:block");
    $('#search-button').attr('style', "display:none");
  } else {
    $('.field').attr('style');
    $('.find').removeAttr('style');
    $('.find').attr('style', "display: block");
    $('#login-button').removeAttr('style');
    $('#login-button').attr('style', "display:none");
    $('#search-button').removeAttr('style');
    $('#search-button').attr('style', "display:block");
  }
}

// This function looks for and stores the authorization token
function getAuthorizationToken() {
  // This function needs to be called every time the page is loaded so that when users
  // are returned to the app after authenticating in Spotify, the access token is captured
  var returnedAuthorizationToken = location.hash.substr(1)
  authorizationToken = "Bearer " + returnedAuthorizationToken.substring(returnedAuthorizationToken.indexOf("=") + 1, returnedAuthorizationToken.indexOf("&"));
  console.log(authorizationToken);
}

function buildQueryURL() {
  searchTerm = $('#searchTerm').val().trim();
  queryURL = "https://api.spotify.com/v1/search?q=" + searchTerm + "&type=artist";
}

var redirectUri = window.location.href;
if (redirectUri !== "https://djpowell23.github.io/Project-1/") {
  redirectUri = redirectUri.substring(0, redirectUri.length - 1); // Used to truncate a trailing / (slash) so the login click handler works correctly
}
$('#login-button').on('click', function () {
  var scope = "user-library-modify";
  window.location.href = 'https://accounts.spotify.com/authorize?client_id=6ba0c775865d4f34a62198bacaebc943&response_type=token&scope=' + encodeURIComponent(scope) + '&redirect_uri=' + redirectUri;
})
function search(){
  buildQueryURL()
  if (searchTerm !== "") {
    $('.searchTable').removeAttr("style");
    $('.searchTable').attr('style', "display:block");
    $('#recommended-artists').removeAttr("style");
    $('#recommended-artists').attr('style', "display:none");
  }
  $.ajax({
    method: "GET",
    beforeSend: function (request) {
      request.setRequestHeader("Authorization", authorizationToken);
      request.setRequestHeader("Accept", "application/json");
    },
    url: queryURL,
  }).fail(function (jqXHR, textStatus, errorThrown) {
    location.reload();
  }).done(function (response) {
    console.log(response);
    if(response.artists.total === 0){
      $('.searchTable').removeAttr("style");
      $('.searchTable').attr('style', "display:none");
      $('#clear').removeAttr("style");
      $('#clear').attr('style', "display:none");
      $('#more').removeAttr("style");
      $('#more').attr('style', "display:none");
      var noneFound = $('#nothing');
      noneFound.html("No artists found please try again!");
      noneFound.removeAttr("style");
      noneFound.attr("style","display:block");
    }
    else{
      $('#nothing').removeAttr("style");
      $('#nothing').attr("style","display:none");
    // Display Artists that match what the user searched for
    $("#newTrackRow").empty();
    var limit = response.artists.items.length;
    if (limit > 4) {
      limit = 4;
    }
    for (var resultNum = 0; resultNum < limit; resultNum++) {
      var resultArtist = response.artists.items[resultNum].name;
      try {
        var resultImg = response.artists.items[resultNum].images[0].url;
      } catch (error) {
        resultImg = "assets/images/artistPlaceholder.png"
        console.log("An image was not found: " + error)
      }

      // Artist ID
      var resultId = response.artists.items[resultNum].id;
      var resultGenre = response.artists.items[resultNum].genres;

      // Create a new <tr> and all <td> needed for the results section
      var newRow = $('<tr>');
      newRow.attr("id", resultId);
      newRow.addClass("search-result")
      newRow.attr("style","min-height:80px")
      var newArtist = $('<td>');
      newArtist.addClass('artist');
      newArtist.attr("id","artistText")
      var newImg = $('<img>');
      newImg.addClass('artistImg');
      newImg.attr("id", "artistPic");
      newImg.attr('src', resultImg);
      newArtist.append(resultArtist);
      var newGenre = $('<td class="genre">');
      newGenre.attr("id","genreText")
      // Styling the items in genres array from Spotify
      for (i = 0; i < response.artists.items[resultNum].genres.length; i++) {
        if (resultGenre[i].indexOf(" ") !== -1) {
          resultGenre[i] = resultGenre[i].replace(" ", "-");
        }
        if (resultGenre.length < 2) {
          newGenre.append(resultGenre[i].charAt(0).toUpperCase() + resultGenre[i].slice(1) + "");
        }
        else if (i !== (response.artists.items[resultNum].genres.length - 1)) {
          newGenre.append(resultGenre[i].charAt(0).toUpperCase() + resultGenre[i].slice(1) + " | ");
        }
      }
      // Append to newRow
      newRow.append(newImg);
      newRow.append(newArtist);
      newRow.append(newGenre);

      // Append to HTML
      $('#newTrackRow').append(newRow);
    }
  }
  });
};
function buildTable(){
  $("#recommendations").empty();
  var queryURL = "https://api.spotify.com/v1/recommendations?limit=10&offset=10&market=US&seed_artists=" + artistId;
  $.ajax({
    method: "GET",
    beforeSend: function (request) {
      request.setRequestHeader("Authorization", authorizationToken);
      request.setRequestHeader("Accept", "application/json");
    },
    url: queryURL,
  }).fail(function (jqXHR, textStatus, errorThrown) {
  }).done(function (response) {
  for (var i = 0; i < 10; i++) {
    console.log(response);
    // Create Variables for Recommendation Row
    var imageSource = response.tracks[i].album.images[1].url;
    var songTitle = response.tracks[i].name;
    songTitle = songTitle.substring(0, 25);
    var songArtist = response.tracks[i].artists[0].name;
    var albumTitle = response.tracks[i].album.name;
    var recRow = $('<tr>');
    recRow.addClass("recRow")
    var favCol = $("<td>");
    favCol.attr("id","favoriteCol");
    favButton = $("<i>");
    favButton.addClass("far fa-heart");
    favButton.attr("id", "favorite");
    favButton.attr("song-id", response.tracks[i].id);
    favCol.append(favButton);
    // Create Variable for Image <td>
    var recImage = $('<img>').attr('src', imageSource)
    recImage.addClass('recImg');
    // recImage.append($('<img>').attr('src', imageSource))

    // Create Variable for Title <td>
    var recTitle = $('<td>');
    recTitle.addClass('recTitle');
    recTitle.text(songTitle);
    recTitle.attr("id", "recTitle")
    // Create Variable for Artist <td>
    var recArtist = $('<td>');
    recArtist.addClass('recArtist');
    recArtist.text(songArtist);
    recArtist.attr("id", "recArtist");
    // Create Variable for Album <td>
    var recAlbum = $('<td>');
    recAlbum.addClass('recAlbum');
    recAlbum.text(albumTitle)
    recAlbum.attr("id", "recAlbum")
    var recPlay = $('<td>');
    recPlay.attr("id","playerCol");
    var playUri = response.tracks[i].uri;
    playUri = playUri.substring(playUri.lastIndexOf(":") + 1);
    var src = "https://open.spotify.com/embed/track/" + playUri
    var player = $('<iframe id="playSong" width="80" height="80" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>');
    player.attr("src", src);
    recPlay.append(player);
    // Append to newRow
    recRow.append(favCol);
    recRow.append(recPlay);
    recRow.append(recTitle);
    recRow.append(recArtist);
    recRow.append(recAlbum);
    $('#recommendations').append(recRow);
  }
})
};
var limit = 10;
var artistId;
$(document).on("click", "#search-button", function () {
  search();
});
document.addEventListener('keypress', function (e) {
  var key = e.which || e.keyCode;
  if (key === 13) {
    search();
  }
});
$(document).on("click", "#favorite", function () {
  $(this).removeClass("far fa-heart");
  $(this).addClass("fas fa-heart");
  console.log($(this).attr("song-id"));
  queryURL = "https://api.spotify.com/v1/me/tracks?ids=" + $(this).attr("song-id");
  $.ajax({
    method: "PUT",
    beforeSend: function (request) {
      request.setRequestHeader("Authorization", authorizationToken);
      request.setRequestHeader("Accept", "application/json");
    },
    url: queryURL,
  }).fail(function (jqXHR, textStatus, errorThrown) {
    console.log(errorThrown);
  }).done(function () {
  })
})
$(document).on('click', '.search-result', function () {
  $('.searchTable').removeAttr("style");
  $('.searchTable').attr('style', "display:none");
  $('#clear').removeAttr("style");
  $('#clear').attr('style', "display:block");
  $('#more').removeAttr("style");
  $('#more').attr('style', "display:block");
  
  
  artistId = $(this).attr('id');
  var queryURL = "https://api.spotify.com/v1/recommendations?limit=10&market=US&seed_artists=" + artistId;
  $.ajax({
    method: "GET",
    beforeSend: function (request) {
      request.setRequestHeader("Authorization", authorizationToken);
      request.setRequestHeader("Accept", "application/json");
    },
    url: queryURL,
  }).fail(function (jqXHR, textStatus, errorThrown) {
  }).done(function (response) {
    $('#recommendations').empty();
    for (i = 0; i < limit; i++) {
      console.log(response);
      // Create Variables for Recommendation Row
      var imageSource = response.tracks[i].album.images[1].url;
      var songTitle = response.tracks[i].name;
      songTitle = songTitle.substring(0, 25);
      var songArtist = response.tracks[i].artists[0].name;
      var albumTitle = response.tracks[i].album.name;
      var recRow = $('<tr>');
      recRow.addClass("recRow")
      var favCol = $("<td>");
      favCol.attr("id","favoriteCol");
      favButton = $("<i>");
      favButton.addClass("far fa-heart");
      favButton.attr("id", "favorite");
      favButton.attr("song-id", response.tracks[i].id);
      favCol.append(favButton);
      // Create Variable for Image <td>
      var recImage = $('<img>').attr('src', imageSource)
      recImage.addClass('recImg');
      // recImage.append($('<img>').attr('src', imageSource))

      // Create Variable for Title <td>
      var recTitle = $('<td>');
      recTitle.addClass('recTitle');
      recTitle.text(songTitle);
      recTitle.attr("id", "recTitle")
      // Create Variable for Artist <td>
      var recArtist = $('<td>');
      recArtist.addClass('recArtist');
      recArtist.text(songArtist);
      recArtist.attr("id", "recArtist");
      // Create Variable for Album <td>
      var recAlbum = $('<td>');
      recAlbum.addClass('recAlbum');
      recAlbum.text(albumTitle)
      recAlbum.attr("id", "recAlbum")
      var recPlay = $('<td>');
      recPlay.attr("id","playerCol");
      var playUri = response.tracks[i].uri;
      playUri = playUri.substring(playUri.lastIndexOf(":") + 1);
      var src = "https://open.spotify.com/embed/track/" + playUri
      var player = $('<iframe id="playSong" width="80" height="80" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>');
      player.attr("src", src);
      recPlay.append(player);
      // Append to newRow
      recRow.append(favCol);
      recRow.append(recPlay);
      recRow.append(recTitle);
      recRow.append(recArtist);
      recRow.append(recAlbum);
      $('#recommendations').append(recRow);
    }
    // Need to unhide stuff here
    $("#recommended-artists").attr('style', 'display:block')
  })
});
$(document).on('click', "#clear", function(){
$("#searchTab").removeAttr("style");
$("#searchTab").attr("style", "display:none");
$("#recommended-artists").removeAttr("style");
$("#recommended-artists").attr("style", "display:none");
$("#more").removeAttr("style");
$("#more").attr("style", "display:none");
$("#clear").removeAttr("style");
$("#clear").attr("style", "display:none");
})
$(document).on('click', "#more", function(){
  buildTable();
})