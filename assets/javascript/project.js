
// Declare Variables and call initial functions needed on page load
var redirectUri = window.location.href;
var authorizationToken = "";
var queryURL = "";
var searchTerm = $('#searchTerm').val().trim();
getAuthorizationToken()
displayButton()

// This function toggles classes to hide/display buttons that make it clear to the user what steps they need to take
function displayButton(){
  // We need someone to get the CSS hide class to work so that only one button shows
  // This is likely being overridden in semantic.css somewhere
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
  // add code here to build out the searchURL
  // the searchType can later be modifed to call the function with different searches
  // ie 'search' or 'seed'
  queryURL = "https://api.spotify.com/v1/search?q=" + searchTerm + "&type=artist";
  
}

var redirectUri = window.location.href;
redirectUri = redirectUri.substring(0, redirectUri.length -1); // Used to truncate a trailing / (slash) so the login click handler works correctly
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
      console.log("true");
      $('.searchTable').removeAttr("style");
      $('.searchTable').attr('style', "display:block");
    }
    $.ajax({
      method: "GET",
      beforeSend: function(request) {
        request.setRequestHeader("Authorization", authorizationToken);
        request.setRequestHeader("Accept", "application/json");
      },
      url: queryURL,
    }).then(function(response) {
      // console.log('response: ', response);

      // This code is for the direct response table, not for the recommendations table
      // Variable Definition and Troubleshooting
      // Name
      for(var resultNum = 0; resultNum < 4; resultNum++){
      var resultArtist = response.artists.items[resultNum].name;
      // console.log('name: ', resultArtist);
      // Image
      var resultImg = response.artists.items[resultNum].images[0].url;
      // console.log('image: ', resultImg);
      // Artist ID:
      var resultId = response.artists.items[resultNum].id;
      console.log('artist id: ', resultId);
      // Popularity Rating: 
      var resultPopularity = response.artists.items[resultNum].popularity;
      // console.log('popularity: ', resultPopularity);
      // Genres: 
      var resultGenre = response.artists.items[resultNum].genres;
      // console.log('genres: ', resultGenre);

      // Create variables for pushing to HTML
      // New Row Variable
      var newRow = $('<tr>');
      newRow.attr("data-number", resultId);
      // New Artist Variable
      var newArtist = $('<td>');
      // Add Class to newArtist
      newArtist.addClass('artist');
      // Create <td> for img
      var newImgTag = $('<td>');
      // Add Class to newImgTag
      newImgTag.addClass('image');
      // New Image Variable
      var newImg = $('<img>');
      // Add Class to Image
      newImg.addClass('artistImg');
      // Store Image in Variable
      newImg.attr('src', resultImg);
      // Append newImg to newImgTag
      newImgTag.append(newImg);
      // Store Artist Name in variable
      newArtist.append(resultArtist);
      // New Genre Variable
      var newGenre = $('<td class="genre">');
      for(i = 0; i< response.artists.items[resultNum].genres.length; i++){
      if(resultGenre[i].indexOf(" ") !== -1){
        resultGenre[i] = resultGenre[i].replace(" ", "-");
      }
      if(resultGenre.length<2){
        newGenre.append(resultGenre[i].charAt(0).toUpperCase() + resultGenre[i].slice(1) + "");
      }
      else{
        console.log("last" + resultGenre.lastIndexOf());
        if(i !== resultGenre.lastIndexOf()){
        newGenre.append(resultGenre[i].charAt(0).toUpperCase() + resultGenre[i].slice(1) + " | ");
        }
      }
      }
      // New Popularity Variable
      var newPopularity = $('<td class="popularity">');
      newPopularity.append(resultPopularity);
      var newIdtag = $("<td>");
      newIdtag.addClass("id");
      newIdtag.append(resultId);
      // Append to newRow
      newRow.append(newImg);
      newRow.append(newArtist);
      newRow.append(newGenre);
      newRow.append(newPopularity);

      // Prepend to HTML
      $('#newTrackRow').append(newRow);
      }
      // This code is for appending the RECOMMENDED songs to the appropriate table
      // Variable Declaration/Troubleshooting/Locations
      // Path for Image
      // var recResultImage
      // // Path for Song Name
      // var recResultTitle
      // // Path for Artist
      // var recResultArtist
      // // Path for Album
      // var recResultAlbum
      // // Path for Duration
      // var recResultDuration
      
      // // Create Variable for Recommendation Row
      // var recRow = $('<tr>');
      // // Create Play Button
      // var recPlay = $('<td>');
      // recPlay.addClass('recPlay');
      // // Create Recommended Image Tag
      // var recImageTag = ('<td>');
      // recImageTag.addClass('image');
      // var recImage = ('<img>');
      // recImage.addClass('recImage');
      // // recImage.attr('src', ############);
      // // Create Variable for Title <td>
      // var recTitle = $('<td>');
      // recTitle.addClass('recTitle');
      // // Create Variable for Artist Tag
      // var recArtist = $('<td>');
      // recArtist.addClass('recArtist');
      // // Create Variable for Album Tag
      // var recAlbum = $('<td>');
      // recAlbum.addClass('recAlbum');
      // // Create Variable for Duration
      // var recDuration = $('<td>');
      // recDuration.addClass('recDuration');
      // // Create Variable for Add to Playlist
      // var recAdd = $('<td>');
      // recAdd.addClass('recAdd');
    	// $(document).ready(function() { 
      //   $("backgrnd-img").hide();
      // })

      console.log(response);
      // Function when the user clicks on a row
      $(document).on('click', "tr", function() {
        console.log($(this).attr("data-number"));
       var id = $(this).attr("data-number");
      });
    });
});



