
// Declare Variables and call initial functions needed on page load
var redirectUri = window.location.href;
var authorizationToken = "";
var queryURL = "";
var searchTerm = $('#searchTerm').val().trim().toLowerCase();
getAuthorizationToken()
displayButton()

// This function toggles classes to hide/display buttons that make it clear to the user what steps they need to take
function displayButton(){
  // Toggle display of login and search button depending on if the user is authenticated
  if (authorizationToken === "Bearer "){
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
function getAuthorizationToken(){
  // This function needs to be called every time the page is loaded so that when users
  // are returned to the app after authenticating in Spotify, the access token is captured
  var returnedAuthorizationToken = location.hash.substr(1)
  authorizationToken = "Bearer " + returnedAuthorizationToken.substring(returnedAuthorizationToken.indexOf("=")+1, returnedAuthorizationToken.indexOf("&"));
  console.log(authorizationToken)
}

function buildQueryURL() {
  searchTerm = $('#searchTerm').val().trim();
  queryURL = "https://api.spotify.com/v1/search?q=" + searchTerm + "&type=artist";
}

var redirectUri = window.location.href;
if(redirectUri !== "https://djpowell23.github.io/Project-1/"){
redirectUri = redirectUri.substring(0, redirectUri.length -1); // Used to truncate a trailing / (slash) so the login click handler works correctly
}
$('#login-button').on('click', function(){
  window.location.href = 'https://accounts.spotify.com/authorize?client_id=6ba0c775865d4f34a62198bacaebc943&response_type=token&redirect_uri=' + redirectUri;
})
console.log(redirectUri);

$(document).ready(function(){
  $(".padding").attr("style", "display:none");
  $('.searchTable').attr('style', "display:none");
})

$("#search-button").on("click", function() {
  buildQueryURL()
    if(searchTerm !== ""){
      console.log("Show results if a search term exists");
      $('.searchTable').removeAttr("style");
      $('.searchTable').attr('style', "display:block");
      $('#recommended-artists').removeAttr("style");
      $('#recommended-artists').attr('style', "display:none");
    }
    $.ajax({
      method: "GET",
      beforeSend: function(request) {
        request.setRequestHeader("Authorization", authorizationToken);
        request.setRequestHeader("Accept", "application/json");
      },
      url: queryURL,
    }).then(function(response) {
      // Display Artists that match what the user searched for
      $("#newTrackRow").empty()
      var limit = response.artists.items.length;
      if(limit > 4){
        limit = 4;
      }
      for(var resultNum = 0; resultNum < limit; resultNum++){
        var resultArtist = response.artists.items[resultNum].name;
        try {
          var resultImg = response.artists.items[resultNum].images[0].url;
        } catch(error) {
          resultImg = "/assets/images/artistPlaceholder.png"
          console.log("An image was not found: " + error)
        }
        
        // Artist ID
        var resultId = response.artists.items[resultNum].id;
        console.log('artist id: ', resultId);
        var resultPopularity = response.artists.items[resultNum].popularity;
        var resultGenre = response.artists.items[resultNum].genres;
        
        // Create a new <tr> and all <td> needed for the results section
        var newRow = $('<tr>');
        newRow.attr("id", resultId);
        newRow.addClass("search-result")
        var newArtist = $('<td>');
        newArtist.addClass('artist');
        // var newImgTag = $('<td>');
        // newImgTag.addClass('image');
        var newImg = $('<img>');
        newImg.addClass('artistImg');
        newImg.attr('src', resultImg);
        // newImgTag.append(newImg);
        newArtist.append(resultArtist);
        var newGenre = $('<td class="genre">');
        // Styling the items in genres array from Spotify
        for(i = 0; i< response.artists.items[resultNum].genres.length; i++){
          if(resultGenre[i].indexOf(" ") !== -1){
            resultGenre[i] = resultGenre[i].replace(" ", "-");
          }
          if(resultGenre.length<2){
            newGenre.append(resultGenre[i].charAt(0).toUpperCase() + resultGenre[i].slice(1) + "");
          }
          else if(i !== (response.artists.items[resultNum].genres.length - 1)){
            newGenre.append(resultGenre[i].charAt(0).toUpperCase() + resultGenre[i].slice(1) + " | ");
            }
        }
        // var newIdtag = $("<td>");
        // newIdtag.addClass("id");
        // newIdtag.append(resultId);
        // Append to newRow
        newRow.append(newImg);
        newRow.append(newArtist);
        newRow.append(newGenre);

        // Append to HTML
        $('#newTrackRow').append(newRow);
      }  

          // Function when the user clicks on a row
          // Sample artist ID = 540vIaP2JwjQb9dm3aArA4
          $('.search-result').on('click', function() {
            $('.searchTable').removeAttr("style");
            $('.searchTable').attr('style', "display:none");
            var artistId = $(this).attr('id');
            var queryURL = "https://api.spotify.com/v1/recommendations?limit=10&market=US&seed_artists=" + artistId;
            $.ajax({
              method: "GET",
              beforeSend: function(request) {
                request.setRequestHeader("Authorization", authorizationToken);
                request.setRequestHeader("Accept", "application/json");
              },
              url: queryURL,
          }).then(function(response){
            $('#recommendations').empty();
            for (var i = 0; i < response.tracks.length; i++) {
              console.log(response.tracks[i]);    
              // Create Variables for Recommendation Row
              var imageSource = response.tracks[i].album.images[1].url;
              var songTitle =  response.tracks[i].name;
              var songArtist =  response.tracks[i].artists[0].name;
              var albumTitle =  response.tracks[i].album.name;
              var recRow = $('<tr>');
              recRow.addClass("recRow")

              // Create Variable for Image <td>
              var recImage = $('<img>').attr('src', imageSource)
              recImage.addClass('recImg');
              // recImage.append($('<img>').attr('src', imageSource))

              // Create Variable for Title <td>
              var recTitle = $('<td>');
              recTitle.addClass('recTitle');
              recTitle.text(songTitle)

              // Create Variable for Artist <td>
              var recArtist = $('<td>');
              recArtist.addClass('recArtist');
              recArtist.text(songArtist)

              // Create Variable for Album <td>
              var recAlbum = $('<td>');
              recAlbum.addClass('recAlbum');
              recAlbum.text(albumTitle)
              var recPlay = $('<td>');
              var playUri = response.tracks[i].uri;
              playUri = playUri.substring(playUri.lastIndexOf(":")+1);
              var src = "https://open.spotify.com/embed/track/" + playUri
              console.log(response);
              console.log(playUri);
              var player = $('<iframe width="300" height="80" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>')
              player.attr("src", src)
              recPlay.append(player);
              // Append to newRow
              recRow.append(recPlay);
              recRow.append(recImage);
              recRow.append(recTitle);
              recRow.append(recArtist);
              recRow.append(recAlbum);
              $('#recommendations').append(recRow);
            }
          // Need to unhide stuff here
          $("#recommended-artists").attr('style', 'display:block')
          })
    });
    });
  });

