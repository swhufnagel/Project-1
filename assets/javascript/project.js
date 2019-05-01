
// Declare Variables and call initial functions needed on page load
var redirectUri = window.location.href;
var authorizationToken = ""
var queryURL = ""
displayButton()
getAuthorizationToken()

// This function toggles classes to hide/display buttons that make it clear to the user what steps they need to take
function displayButton(){
  // We need someone to get the CSS hide class to work so that only one button shows
  // This is likely being overridden in semantic.css somewhere
  if (authorizationToken === ""){
    $('#login-button').removeClass('hide')
    $('#search-button').addClass('hide')
  } else {
    $('#login-button').addClass('hide')
    $('#search-button').removeClass('hide')
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
  // add code here to build out the searchURL
  // the searchType can later be modifed to call the function with different searches
  // ie 'search' or 'seed'
  queryURL = "https://api.spotify.com/v1/search?q=" + $('#searchTerm').val().trim() + "&type=artist";
}

var redirectUri = window.location.href;
redirectUri = redirectUri.substring(0, redirectUri.length -1); // Used to truncate a trailing / (slash) so the login click handler works correctly
$('#login-button').on('click', function(){
  window.location.href = 'https://accounts.spotify.com/authorize?client_id=6ba0c775865d4f34a62198bacaebc943&response_type=token&redirect_uri=' + redirectUri;
})
console.log(redirectUri);


$("#search-button").on("click", function() {
    buildQueryURL()
    $.ajax({
      method: "GET",
      beforeSend: function(request) {
        request.setRequestHeader("Authorization", authorizationToken)
      },
      url: queryURL,
    }).then(function(response) {
      console.log(response);
    })
})

