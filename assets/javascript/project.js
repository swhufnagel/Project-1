
//  add_initial_authentication
// build authorization URL.
  // Question: How do we keep the client ID hidden?
  // Build Redirect URL: 
    // Question: Where should the redirect URL be where it will work in test and in production?

// On click of authorization URL, user is taken to log in.
// Use response to get an access token, which we can use to make subsequen API requests
    // I received an error when trying to use file:///Users/jamesclark/Desktop/coding_bootcamp/project1/Project-1/index.html
    // But it works with https://djpowell23.github.io/Project-1/
// On click of authorization URL, user is taken to log in.
// Use response to get an access token, which we can use to make subsequen API requests
// 

// After user authorizes spotify, we need to get the hash that is returned so we can use it in future API reqeusts:
// How do I wait for the user to authenticate and then run the next line of code:
// var returnedHash = window.location.hash.substr(1)
// console.log(returnedHas)
var redirectUri = window.location.href;
// var authorizationURL = "https://accounts.spotify.com/authorize?client_id=6ba0c775865d4f34a62198bacaebc943&response_type=token&redirect_uri="+ redirectUri;
var authorizationToken = ""
var queryURL = ""
displayButton()
getAuthorizationToken()

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

function getAuthorizationToken(){
  // This function needs to be called every time the page is loaded so that when users
  // are returned to the app after authenticating in Spotify, the access token is captured
  var returnedAuthorizationToken = location.hash.substr(1)
  console.log(returnedAuthorizationToken)
  // Need code to get the substring from returnedAuthorizationToken at the position of "=" + 1
  // something like this: x = x.substring(hash.indexOf("=")+1) which can be run in console as a text
  authorizationToken = "Bearer " + returnedAuthorizationToken.substring(returnedAuthorizationToken.indexOf("=")+1, returnedAuthorizationToken.indexOf("&"));
  console.log(authorizationToken)
  // We might also need to truncate the end of it so it's truly just the authorization token and not the other parameters
}

function buildQueryURL() {
  // add code here to built out the searchURL
  // the searchType can later be modifed to call the function with different searches
  // ie 'search' or 'seed'
  queryURL = "https://api.spotify.com/v1/search/q=" + $('#searchTerm').val().trim() + "&type=artist";

}

var redirectUri = window.location.href;
redirectUri = redirectUri.substring(0, redirectUri.length -1);
$('#login-button').on('click', function(){
  window.location.href = 'https://accounts.spotify.com/authorize?client_id=6ba0c775865d4f34a62198bacaebc943&response_type=token&redirect_uri=' + redirectUri;
})
console.log(redirectUri);

// Let's build this out with a basic search
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

