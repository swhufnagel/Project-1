# Tunedea

The Tundea application uses several Spotify APIs to let users search for an artist and retrieve listening recommendations based on the artist searched for.  The application can easily be expanded to allow users to search for songs/tracked.

## Team Members
- Josh Moganfield
- Devin Powell
- Jim Clark
- Sean Hufnagel

## Setup Instructions
- A local server is needed for the callback API to work correctly.
-- The team used node/express for the local webserver with the command: npx http-server -p 8081

## Technologies Used
- Spotify API
- Semantic CSS library

## User Flow
- Users log in using their Spotify User ID and Password
-- Authorization was implemented using the Implicit Grant Flow
-- For more information on the authorization flow, see https://developer.spotify.com/documentation/general/guides/authorization-guide/ 
-- https://tools.ietf.org/html/rfc6749#section-4.2 
- Once logged in, users can search for an artist
-- The Artist Search API is documented here: https://developer.spotify.com/documentation/web-api/reference/search/search/
- After searching for an artist, the results are presented to the user.
- Users can then select the artist that they were searching for from the result set list
- Selecting an artist will cause the application to look for recommendations based on the seed data
-- The Get-Recommendations API is documented here: https://developer.spotify.com/console/get-recommendations/

## Future Enhancements
- Create a new playlist based on recommendations that the user selected
- Ability to search and get recommendations based on tracks in addition to artists