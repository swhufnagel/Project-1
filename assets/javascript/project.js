
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
var authorizationURL = "https://accounts.spotify.com/authorize?client_id=6ba0c775865d4f34a62198bacaebc943&response_type=token&redirect_uri=https://djpowell23.github.io/Project-1/"
// After user authorizes spotify, we need to get the hash that is returned so we can use it in future API reqeusts:
// How do I wait for the user to authenticate and then run the next line of code:
// var returnedHash = window.location.hash.substr(1)
// console.log(returnedHas)
console.log(document.getElementById(location.hash.substring(1)))

$("button").on("click", function() {
    var animal = $(this).attr("data-animal");
    var queryURL = "https://api.spotify.com/search?q=" +
      animal + "&api_key=dc6zaTOxFJmzC&limit=10";

    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function(response) {
      // Step 1: Run this file, click a button, and see what the response object looks like in the browser's console.
      // Open up the data key, then open up the 0th, element. Study the keys and how the JSON is structured.

      console.log(response);
    })
})

