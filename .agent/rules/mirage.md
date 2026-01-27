---
trigger: always_on
---

Vérifie bien la doc côté back
{
paths: {
/api/v1/sub/config: {
get: {
operationId: "getApiV1SubConfig",
responses: {
200: {
description: "Returns the configured publishable key.",
content: {
application/json: {
schema: {
$ref: "#/components/schemas/StripeConfigRes"
}
}
}
}
},
description: "Provides the Stripe publishable key so the React app can initialise Stripe.js before redirecting to checkout.",
summary: "Stripe publishable key",
tags: [
"Subscriptions"
]
}
},
/api/v1/media/up-vote/{id}: {
post: {
responses: {
200: {
description: "Returns 200 OK when the vote is stored. Responds with 401 Unauthorized if the session is missing or the viewer is not a subscriber.",
content: {
application/json: {
examples: {
HTTPResponseStatus: {
$ref: "#/components/examples/HTTPResponseStatus"
}
},
schema: {
type: "integer",
format: "int64"
}
}
}
}
},
operationId: "postApiV1MediaUp-voteById",
summary: "Up-vote a media",
description: "Records a positive vote from a subscriber so engagement metrics stay in sync with the UI.",
parameters: [
{
schema: {
type: "string"
},
in: "path",
name: "id",
required: true
}
],
tags: [
"Media"
]
}
},
/api/v1/user: {
delete: {
operationId: "deleteApiV1User",
tags: [
"User"
],
responses: {
200: {
content: {
application/json: {
schema: {
format: "int64",
type: "integer"
},
examples: {
HTTPResponseStatus: {
$ref: "#/components/examples/HTTPResponseStatus"
}
}
}
},
description: "Returns 200 OK when the account is deleted. The client should clear cached state and redirect to onboarding."
}
},
description: "Permanently removes the authenticated viewer's account and related data.",
summary: "Delete the current user account"
},
get: {
description: "Returns the authenticated viewer's profile for populating account and navigation UI.",
operationId: "getApiV1User",
tags: [
"User"
],
responses: {
200: {
content: {
application/json: {
schema: {
$ref: "#/components/schemas/UserDTO"
}
}
},
description: "Provides the viewer's name, email, and subscription highlights when a session cookie is present."
}
},
summary: "Get current user profile"
}
},
/api/v1/sub: {
get: {
summary: "Get current subscription",
responses: {
200: {
content: {
application/json: {
schema: {
$ref: "#/components/schemas/SubscriptionDTO"
}
}
},
description: "OK"
}
},
tags: [
"Subscriptions"
],
description: "Retrieves the authenticated viewer's subscription so the billing screen can display status and renewal details. Returns 204 No Content when the user has no active subscription.",
operationId: "getApiV1Sub"
}
},
/api/v1/media/shows: {
get: {
tags: [
"Media"
],
summary: "List available shows",
description: "Returns lightweight previews for shows to populate browse rails and selectors.

Pagination:

- Query `page` (Int, default 1): The page index starting at 1.
- Query `per` (Int, default 20, max 100): Number of items per page.

The response is a paginated object containing items and pagination metadata.",
responses: {
200: {
description: "Paginated list of show previews with poster art and names, including pagination metadata.",
content: {
application/json: {
schema: {
$ref: "#/components/schemas/PageSeriePreview"
}
}
}
}
},
operationId: "getApiV1MediaShows"
}
},
/index: {
get: {
operationId: "getIndex",
tags: [
"index"
],
summary: "index",
description: "Renders a server-side view that showcases the app's color palette for design reference and QA. The page is styled using TailwindCSS.",
responses: {
200: {
description: "OK",
content: {
application/json: {
schema: {
type: "integer",
format: "int64"
}
}
}
}
}
}
},
/api/v1/categories: {
get: {
tags: [
"Categories"
],
summary: "List available categories",
operationId: "getApiV1Categories",
responses: {
200: {
description: "Returns every supported category identifier.",
content: {
application/json: {
schema: {
$ref: "#/components/schemas/AvailableCategories"
}
}
}
}
},
description: "Provides the category slugs React should display in browse filters and link to when calling `/api/v1/media/category/{category}`."
}
},
/api/v1/featured-media/hero-banner: {
get: {
description: "Fetches the featured media entry that powers the home hero section.",
responses: {
200: {
content: {
application/json: {
schema: {
$ref: "#/components/schemas/FeaturedMediaDTO"
}
}
},
description: "Returns the highlighted media with `previewMedia`, marketing label, and artwork needed for the hero layout."
}
},
summary: "Get hero banner",
operationId: "getApiV1Featured-mediaHero-banner",
tags: [
"Featured Media"
]
}
},
/api/v1/auth/forgot-password: {
post: {
summary: "Trigger a password reset",
tags: [
"Auth"
],
description: "Accepts the user's email and triggers the password reset workflow. The response is intentionally neutral so attackers cannot guess whether an address exists.

Request body:

```json
{
  "mail": "viewer@example.com"
}
```

",
operationId: "postApiV1AuthForgot-password",
responses: {
200: {
content: {
application/json: {
schema: {
format: "int64",
type: "integer"
},
examples: {
HTTPResponseStatus: {
$ref: "#/components/examples/HTTPResponseStatus"
}
}
}
},
description: "Always returns **200 OK**."
}
}
}
},
/api/v1/user/update-mail: {
post: {
description: "Updates the email address used for login once the viewer confirms the change in the settings UI.",
responses: {
200: {
description: "Returns 204 No Content on success. Responds with 401 Unauthorized when the session cookie is missing.",
content: {
application/json: {
schema: {
format: "int64",
type: "integer"
},
examples: {
HTTPResponseStatus: {
$ref: "#/components/examples/HTTPResponseStatus"
}
}
}
}
}
},
requestBody: {
content: {
application/json: {
schema: {
$ref: "#/components/schemas/UpdateUserMailReq"
}
}
},
required: true
},
tags: [
"User"
],
summary: "Update the login email",
operationId: "postApiV1UserUpdate-mail"
}
},
/api/v1/sub/cancel: {
post: {
description: "Schedules the viewer's subscription for cancellation at the end of the current billing period.",
tags: [
"Subscriptions"
],
operationId: "postApiV1SubCancel",
summary: "Cancel subscription",
responses: {
200: {
description: "Returns 200 OK when the cancellation is registered. Future reads of the subscription endpoint will reflect the pending cancellation.",
content: {
application/json: {
schema: {
type: "integer",
format: "int64"
},
examples: {
HTTPResponseStatus: {
$ref: "#/components/examples/HTTPResponseStatus"
}
}
}
}
}
}
}
},
/api/v1/history: {
post: {
operationId: "postApiV1History",
description: "Seeds the continue-watching rail when playback starts for a subscriber.",
summary: "Create / update a viewing history entry",
requestBody: {
content: {
application/json: {
schema: {
$ref: "#/components/schemas/CreateViewingHistoryRequest"
}
}
},
required: true
},
responses: {
200: {
description: "Returns 201 Created when the entry is stored. Use the update endpoint to refresh progress as playback continues.",
content: {
application/json: {
schema: {
type: "integer",
format: "int64"
},
examples: {
HTTPResponseStatus: {
$ref: "#/components/examples/HTTPResponseStatus"
}
}
}
}
}
},
tags: [
"Viewing History"
]
}
},
/api/v1/user/update-name: {
post: {
description: "Updates the authenticated viewer's display name from the profile settings form.",
operationId: "postApiV1UserUpdate-name",
responses: {
200: {
description: "Returns 204 No Content when the name is saved. Replies with 401 Unauthorized if the session expired.",
content: {
application/json: {
schema: {
type: "integer",
format: "int64"
},
examples: {
HTTPResponseStatus: {
$ref: "#/components/examples/HTTPResponseStatus"
}
}
}
}
}
},
summary: "Update the display name",
tags: [
"User"
],
requestBody: {
required: true,
content: {
application/json: {
schema: {
$ref: "#/components/schemas/UpdateUserNameReq"
}
}
}
}
}
},
/api/v1/sub/checkout: {
post: {
requestBody: {
required: true,
content: {
application/json: {
schema: {
$ref: "#/components/schemas/CheckoutSessionReq"
}
}
}
},
tags: [
"Subscriptions"
],
operationId: "postApiV1SubCheckout",
responses: {
200: {
content: {
application/json: {
schema: {
$ref: "#/components/schemas/CheckoutSessionRes"
}
}
},
description: "Stripe session id and URL to redirect the viewer to."
}
},
summary: "Create Stripe checkout session",
description: "Initialises a Stripe Checkout session for the selected plan and returns the redirect URL."
}
},
/api/v1/auth/sign-up: {
post: {
responses: {
200: {
content: {
application/json: {
examples: {
HTTPResponseStatus: {
$ref: "#/components/examples/HTTPResponseStatus"
}
},
schema: {
type: "integer",
format: "int64"
}
}
},
description: "Returns 201 Created with the session cookie set. Sends 400 Bad Request when validation fails and 429 Too Many Requests if the signup rate limiter is exceeded."
}
},
operationId: "postApiV1AuthSign-up",
requestBody: {
content: {
application/json: {
schema: {
$ref: "#/components/schemas/CreateUserReq"
}
}
},
required: true
},
summary: "Create an account",
description: "Registers a brand-new viewer and immediately authenticates them so the client can persist the session cookie.",
tags: [
"Auth"
]
}
},
/api/v1/media/{id}: {
get: {
tags: [
"Media"
],
summary: "Get media details",
parameters: [
{
name: "id",
schema: {
type: "string"
},
required: true,
in: "path"
}
],
responses: {
200: {
content: {
application/json: {
schema: {
$ref: "#/components/schemas/MediaDTO"
}
}
},
description: "Returns media details including artwork, parental guidance, playback progress, and subscriber-only streaming URLs."
}
},
description: "Loads the full metadata for a movie or episode so the React detail view can render synopsis, artwork, and playback controls.",
operationId: "getApiV1MediaById"}},
/api/v1/report: {
post: {
description: "Creates a report for the specified media.",
responses: {
200: {
description: "201 Created",
content: {
application/json: {
schema: {
format: "int64",
type: "integer"}}}}},
tags: [
"Report"],
operationId: "postApiV1Report",
requestBody: {
required: true,
content: {
application/json: {
schema: {
$ref: "#/components/schemas/CreateUserReportReq"}}}},
summary: "Create a user report"}},
/api/v1/faq: {
get: {
summary: "List all frequently asked questions",
operationId: "getApiV1Faq",
tags: [
"FAQ"
],
responses: {
200: {
content: {
application/json: {
schema: {
items: {
$ref: "#/components/schemas/Questions"},
type: "array}}},
description: "OK"}},
description: "Returns the complete list of FAQ questions and answers."}},
/api/v1/history/continue-watching: {
get: {
tags: [
"Viewing History"],
summary: "Get continue-watching rail",
operationId: "getApiV1HistoryContinue-watching",
responses: {
200: {
description: "Provides thumbnails with playback progress and favorite state for the authenticated viewer. Responds with 401 Unauthorized if no session is present.",
content: {
application/json: {
schema: {
type: "array",
items: {
$ref: "#/components/schemas/MediaThumbnail"}}}}}
,
description: "Returns the last 25 partially watched items so that the home screen can display the “Continue watching” list."
}
},
/api/v1/media/category/{category}: {
get: {
operationId: "getApiV1MediaCategoryByCategory",
tags: [
"Media"
],
summary: "Browse media by category",
description: "Lists movies and episodes for a given category slug. Use `/api/v1/categories` to build the filter menu, then pass the selected `category` path parameter.

Path parameters:

- `category`: Category slug validated server-side. Invalid values return **400 Bad Request**.

Pagination:

- Query `page` (Int, default 1): The page index starting at 1.
- Query `per` (Int, default 20, max 100): Number of items per page.
  ",
  parameters: [
  {
  name: "category",
  schema: {
  type: "string"
  },
  required: true,
  in: "path"
  }
  ],
  responses: {
  200: {
  description: "OK",
  content: {
  application/json: {
  schema: {$ref: "#/components/schemas/PageMediaThumbnail"}}}}}}},
  /api/v1/featured-media/trending-now: {
  get: {
  description: "Provides the "Trending now" rail. The payload merges trending titles with the caller's favorites to pre-toggle heart icons.
