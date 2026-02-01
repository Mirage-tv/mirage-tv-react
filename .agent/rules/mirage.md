---
trigger: always_on
---

Vérifie bien la doc côté back
{
info: {**Breaking change** (V0.9.8 - 7/12/2025)

- VideoURLs is now only returned when the user is subscribed.
  _Before this patch, some endpoints systematically returned URLs._
  "
  },
  components: {
  schemas: {
  AgeRange: {
  type: "string",
  description: "• 0+ → allAges
  • 6+ → sixPlus
  • 12+ → twelvePlus
  • 16+ → sixteenPlus
  • 18+ → eighteenPlus",
  enum: [
  "0+",
  "6+",
  "12+",
  "16+",
  "18+"
  ]
  },
  PageSeriePreview: {
  type: "object",
  properties: {
  items: {
  type: "array",
  items: {
  $ref: "#/components/schemas/SeriePreview"
}
},
metadata: {
$ref: "#/components/schemas/PageMetadata"
  }
  },
  required: [
  "items",
  "metadata"
  ]
  },
  VideoQuality: {
  description: "• sd → sd
  • hd → hd
  • 2k → twok
  • 4k → fourk",
  enum: [
  "sd",
  "hd",
  "2k",
  "4k"
  ],
  type: "string"
  },
  UpdateUserMailReq: {
  properties: {
  mail: {
  type: "string"
  }
  },
  type: "object",
  required: [
  "mail"
  ]
  },
  UpdateUserPasswordReq: {
  properties: {
  password: {
  type: "string"
  }
  },
  required: [
  "password"
  ],
  type: "object"
  },
  Media: {
  type: "object"
  },
  Subtitle: {
  properties: {
  language: {
  type: "string"
  },
  url: {
  type: "string"
  }
  },
  required: [
  "language",
  "url"
  ],
  type: "object"
  },
  VideoURLsDTO: {
  type: "object",
  properties: {
  trailer: {
  nullable: true,
  type: "string"
  },
  subtitles: {
  type: "array",
  items: {
  $ref: "#/components/schemas/Subtitle"
}
},
source: {
type: "string"
}
},
required: [
"source",
"subtitles"
]
},
CheckoutSessionRes: {
required: [
"sessionId",
"url"
],
properties: {
url: {
type: "string"
},
sessionId: {
type: "string"
}
},
type: "object"
},
SeriePreview: {
type: "object",
properties: {
description: {
nullable: true,
type: "string"
},
title: {
type: "string"
},
totalSeasons: {
type: "integer",
format: "int64"
},
numberOfmedias: {
type: "integer",
format: "int64"
},
posterURL: {
type: "string",
nullable: true
},
id: {
type: "string",
nullable: true,
format: "uuid"
}
},
required: [
"numberOfmedias",
"title",
"totalSeasons"
]
},
UserDTO: {
required: [
"mail",
"name"
],
properties: {
planName: {
type: "string",
nullable: true
},
name: {
type: "string"
},
mail: {
type: "string"
}
},
type: "object"
},
Questions: {
properties: {
id: {
format: "uuid",
type: "string"
},
answers: {
type: "string"
},
question: {
type: "string"
},
updatedAt: {
format: "date-time",
nullable: true,
type: "string"
}
},
required: [
"answers",
"id",
"question"
],
type: "object"
},
UpdateUserNameReq: {
required: [
"name"
],
properties: {
name: {
type: "string"
}
},
type: "object"
},
MediaDTO: {
required: [
"ageRange",
"duration",
"episodeInfo",
"isFavorite",
"name",
"quality",
"synopsis",
"thunbailURL"
],
type: "object",
properties: {
isFavorite: {
type: "boolean"
},
episodeInfo: {
$ref: "#/components/schemas/EpisodeInfo"
  },
  videoURL: {
  $ref: "#/components/schemas/VideoURLsDTO"
},
duration: {
type: "string"
},
thunbailURL: {
type: "string"
},
name: {
type: "string"
},
id: {
type: "string",
nullable: true,
format: "uuid"
},
synopsis: {
type: "string"
},
progress: {
type: "number",
nullable: true,
format: "double"
},
ageRange: {
$ref: "#/components/schemas/AgeRange"
  },
  quality: {
  $ref: "#/components/schemas/VideoQuality"
}
}
},
StripeConfigRes: {
type: "object",
properties: {
publishableKey: {
type: "string"
}
},
required: [
"publishableKey"
]
},
CheckoutSessionReq: {
type: "object",
properties: {
planId: {
type: "string",
format: "uuid"
}
},
required: [
"planId"
]
},
MediaThumbnail: {
properties: {
progress: {
type: "number",
format: "double",
nullable: true
},
isFavorite: {
type: "boolean"
},
thumbnailUrl: {
type: "string"
},
id: {
nullable: true,
format: "uuid",
type: "string"
},
videoURLs: {
$ref: "#/components/schemas/VideoURLsDTO"
  },
  name: {
  type: "string"
  }
  },
  type: "object",
  required: [
  "isFavorite",
  "name",
  "thumbnailUrl"
  ]
  },
  PageMediaThumbnail: {
  properties: {
  metadata: {
  $ref: "#/components/schemas/PageMetadata"
},
items: {
type: "array",
items: {
$ref: "#/components/schemas/MediaThumbnail"
  }
  }
  },
  type: "object",
  required: [
  "items",
  "metadata"
  ]
  },
  CreateViewingHistoryRequest: {
  required: [
  "mediaId",
  "progress"
  ],
  properties: {
  mediaId: {
  type: "string",
  format: "uuid"
  },
  progress: {
  type: "number",
  format: "double"
  }
  },
  type: "object"
  },
  ToggleFavoriteReq: {
  required: [
  "mediaId"
  ],
  type: "object",
  properties: {
  mediaId: {
  format: "uuid",
  type: "string"
  }
  }
  },
  InvoiceDTO: {
  type: "object",
  properties: {
  amountCents: {
  format: "int64",
  type: "integer"
  },
  id: {
  type: "string",
  format: "uuid",
  nullable: true
  },
  paidAt: {
  format: "date-time",
  nullable: true,
  type: "string"
  },
  status: {
  $ref: "#/components/schemas/PaymentStatus"
},
stripeRef: {
type: "string",
nullable: true
}
},
required: [
"amountCents",
"status"
]
},
FeaturedMediaDTO: {
properties: {
label: {
type: "string",
nullable: true
},
id: {
type: "string",
format: "uuid",
nullable: true
},
previewMedia: {
$ref: "#/components/schemas/MediaPreview"
  }
  },
  required: [
  "previewMedia"
  ],
  type: "object"
  },
  ConfirmCheckoutReq: {
  type: "object",
  properties: {
  sessionId: {
  type: "string"
  }
  },
  required: [
  "sessionId"
  ]
  },
  CreateUserReportReq: {
  required: [
  "mediaID"
  ],
  properties: {
  mediaID: {
  format: "uuid",
  type: "string"
  }
  },
  type: "object"
  },
  AvailableCategories: {
  type: "object",
  properties: {
  list: {
  items: {
  type: "string"
  },
  type: "array"
  }
  },
  required: [
  "list"
  ]
  },
  CreateUserReq: {
  type: "object",
  properties: {
  name: {
  type: "string"
  },
  password: {
  type: "string"
  },
  mail: {
  type: "string"
  }
  },
  required: [
  "mail",
  "name",
  "password"
  ]
  },
  PaymentStatus: {
  type: "string",
  enum: [
  "succeeded",
  "failed",
  "pending",
  "refunded"
  ]
  },
  SubscriptionStatus: {
  type: "string",
  enum: [
  "active",
  "cancelled",
  "expired",
  "gracePeriod"
  ]
  },
  PlanDuration: {
  enum: [
  "weekly",
  "monthly",
  "yearly"
  ],
  type: "string"
  },
  EpisodeInfo: {
  type: "object"
  },
  PageMetadata: {
  required: [
  "page",
  "per",
  "total"
  ],
  properties: {
  total: {
  type: "integer",
  format: "int64"
  },
  page: {
  type: "integer",
  format: "int64"
  },
  per: {
  format: "int64",
  type: "integer"
  }
  },
  type: "object"
  },
  PlanDTO: {
  required: [
  "duration",
  "name",
  "priceCents"
  ],
  properties: {
  name: {
  type: "string"
  },
  duration: {
  $ref: "#/components/schemas/PlanDuration"
},
id: {
format: "uuid",
type: "string",
nullable: true
},
priceCents: {
format: "int64",
type: "integer"
}
},
type: "object"
},
MediaSearchResponse: {
type: "object",
required: [
"movies",
"series"
],
properties: {
movies: {
$ref: "#/components/schemas/PageMediaThumbnail"
  },
  series: {
  $ref: "#/components/schemas/PageSeriePreview"
}
}
},
MediaPreview: {
properties: {
duration: {
type: "string"
},
posterURL: {
type: "string",
nullable: true
},
name: {
type: "string"
},
synopsis: {
type: "string"
},
id: {
type: "string",
nullable: true,
format: "uuid"
},
quality: {
$ref: "#/components/schemas/VideoQuality"
  },
  ageRange: {
  $ref: "#/components/schemas/AgeRange"
},
videoURLs: {
$ref: "#/components/schemas/VideoURLsDTO"
  }
  },
  type: "object",
  required: [
  "ageRange",
  "duration",
  "name",
  "quality",
  "synopsis"
  ]
  },
  SerieDTO: {
  properties: {
  totalSeasons: {
  format: "int64",
  type: "integer"
  },
  medias: {
  type: "array",
  items: {
  $ref: "#/components/schemas/Media"
}
},
id: {
format: "uuid",
nullable: true,
type: "string"
},
title: {
type: "string"
},
posterURL: {
type: "string",
nullable: true
},
description: {
nullable: true,
type: "string"
}
},
required: [
"medias",
"title",
"totalSeasons"
],
type: "object"
},
SubscriptionDTO: {
properties: {
endDate: {
type: "string",
format: "date-time",
nullable: true
},
status: {
$ref: "#/components/schemas/SubscriptionStatus"
  },
  startDate: {
  type: "string",
  format: "date-time"
  },
  invoices: {
  type: "array",
  items: {
  $ref: "#/components/schemas/InvoiceDTO"
}},
price: {
format: "int64",
type: "integer"
},
id: {
type: "string",
format: "uuid",
nullable: true
},
planName: {
type: "string"
}
},
type: "object",
required: [
"invoices",
"planName",
"price",
"startDate",
"status"
]
},
LoginReq: {
properties: {
password: {
type: "string"
},
mail: {
type: "string"
}
},
required: [
"mail",
"password"
],
type: "object"
}
},
examples: {
HTTPResponseStatus: {
value: 204
},
Bool: {
value: true
}
}
},
tags: [
{
name: "User"
},
{
name: "Auth"
},
{
name: "Featured Media"
},
{
name: "Media"
},
{
name: "Categories"
},
{
name: "Video"
},
{
name: "Viewing History"
},
{
name: "Favorites"
},
{
name: "Subscriptions"
},
{
name: "FAQ"
},
{
name: "Report"
},
{
name: "index"
}
],
openapi: "3.0.1",
paths: {
/api/v1/media/shows: {
get: {
operationId: "getApiV1MediaShows",
responses: {
200: {
content: {
application/json: {
schema: {
$ref: "#/components/schemas/PageSeriePreview"
  }
  }
  },
  description: "Paginated list of show previews with poster art and names, including pagination metadata."
  }
  },
  tags: [
  "Media"
  ],
  description: "Returns lightweight previews for shows to populate browse rails and selectors.

Pagination:

- Query `page` (Int, default 1): The page index starting at 1.
- Query `per` (Int, default 20, max 100): Number of items per page.

The response is a paginated object containing items and pagination metadata.",
summary: "List available shows"
}
},
/api/v1/sub/cancel: {
post: {
tags: [
"Subscriptions"
],
description: "Schedules the viewer's subscription for cancellation at the end of the current billing period.",
summary: "Cancel subscription",
operationId: "postApiV1SubCancel",
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
description: "Returns 200 OK when the cancellation is registered. Future reads of the subscription endpoint will reflect the pending cancellation."
}
}
}
},
/index: {
get: {
responses: {
200: {
description: "OK",
content: {
application/json: {
schema: {
format: "int64",
type: "integer"
}
}
}
}
},
description: "Renders a server-side view that showcases the app's color palette for design reference and QA. The page is styled using TailwindCSS.",
operationId: "getIndex",
tags: [
"index"
],
summary: "index"
}
},
/api/v1/auth/sign-up: {
post: {
description: "Registers a brand-new viewer and immediately authenticates them so the client can persist the session cookie.",
summary: "Create an account",
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
tags: [
"Auth"
],
operationId: "postApiV1AuthSign-up",
requestBody: {
required: true,
content: {
application/json: {
schema: {
$ref: "#/components/schemas/CreateUserReq"
}
}
}
}
}
},
/api/v1/user/update-name: {
post: {
requestBody: {
required: true,
content: {
application/json: {
schema: {
$ref: "#/components/schemas/UpdateUserNameReq"
}}}},
description: "Updates the authenticated viewer's display name from the profile settings form.",
summary: "Update the display name",
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
description: "Returns 204 No Content when the name is saved. Replies with 401 Unauthorized if the session expired."
}
},
operationId: "postApiV1UserUpdate-name"
}
},
/api/v1/media/shows/
