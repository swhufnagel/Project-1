
//  add_initial_authentication
console.log("javascript file is working")
// build authorization URL.
  // Question: How do we keep the client ID hidden?
  // Build Redirect URL: 
    // Question: Where should the redirect URL be where it will work in test and in production?
// On click of authorization URL, user is taken to log in.
// Use response to get an access token, which we can use to make subsequen API requests

var authorizationURL = "https://accounts.spotify.com/authorize?client_id=6ba0c775865d4f34a62198bacaebc943&response_type=token&redirect_uri=https://www.google.com"


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

