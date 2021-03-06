# Movies Organiser Roadmap

## Implemented

#### REST API

- **OMDb API Wrapper**
  - Get movie info by ID (GET _"/movie?id=\<int\>"_)
  - Search for movie (GET _"/movie?query=\<string\>&type=\<movie|series\>&year=\<int\>"_)
- **User CRUD operations**
  - Create new user (username, age, gender, location, password) (_POST "/user"_)
  - View profile (_GET "/user/:username" or "/user"_)
  - Change details (_PATCH "/user"_)
  - Delete account (_DELETE "/user"_)
  - Search users (_GET "/user?name=\<string\>&location=\<string\>"_)
    - name matches username and display name.
  - Create list (name, public/private, items array) (_POST "/list"_)
  - Get list (_GET "/list/:id"_)
  - Get lists for user (_GET "/user/:username/list/" or "/list"_)
  - Update list (_PATCH "/list/:id"_, "add" or "remove" in body with ID array (movieID for add, objectID for remove))
  - Delete list (_DELETE "/list/:id"_)
- **User Authentication**
  - Login user (using username and password)
  - Return JSWT
  - View profile
    - Show public profile for other users/not logged in (public lists only, no location or age)
  - Only show private lists to owner

#### Front End

- **Login page** (_"/login"_)
  - Username, password
- **Sign-up page** (_"/signup"_)
  - Username (string, required), password (string, required), age (int), gender (\<female, male, non-binary, other\>), location (string) (**note: no email for data protection**)

## In Progress

#### REST API

- **User CRUD operations**
  - Search lists (_GET "/list?contains=\<\[string\]\>&createdBy=\<string\>&createdAt=\<string\>&sortBy=\<createdAt|modifiedAt|length|alphabetical\>\_\<asc|desc\>"_)

#### Front End

- **Profile page** (_"/profile" or "/profile/:id"_)
  - Name, info, and lists
- **Settings page** (_"/profile/settings"_)
  - Update details
  - Set information visibility
  - Set default list visibility
  - Delete account
    - Modal pop-up for confirmation
    - Require typing password to confirm

## Planned

#### REST API

- **OMDb API Wrapper**
  - Store movie info in DB cache, retrieve from DB if exists, otherwise retrieve from OMDb
  - Implement pagination for searching
- **User CRUD operations** (_"/user"_)
  - Search users (_GET "/user?name=\<string\>&location=\<string\>"_)
    - Pagination (_"&page=\<int\>&count=\<int=10\>"_)
  - Add avatar (_POST "/user/avatar"_)
  - View avatar (_GET "/user/:id/avatar"_)
- **Sharing**
  - Allow adding friends
  - Allow sharing list with friends
  - Allow sharing list via URL
- **Settings**
  - Allow users to set information visibility
  - Allow users to set default list visibility

#### Front End

- **Home page** (_"/"_)
  - If logged in, show feed
    - Feed shows recently updated lists by friends
  - If not logged in, show sign-up/login buttons
- **User lists page** (_"/profile/lists"_)
  - Lists for logged in user
- **Individual list page** (_"/list/:id"_)
  - Show list of movies
    - Index in list
    - Movie image
    - Title
    - Synopsis
    - Rating
    - Links?
  - Remove from list
  - Delete list
  - Reorder by typing new index
  - Reorder by drag-and-drop
- **Search lists page** (_"/search/list"_)
  - Same GET query string as for "Search list" CRUD operation
- **Search movie page** (_"/search/movie"_)
  - Same GET query string as for OMDb wrapper search
