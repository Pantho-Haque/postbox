import { TPostBoxCollections } from "@/types";

export const POSTBOX_METHODS = [
  "GET",
  "POST",
  "PUT",
  "PATCH",
  "DELETE",
  "HEAD",
];

// export const collections: TPostBoxCollections = [
//   {
//     collectionName: "prism",
//     curls: [
//       {
//         name: "init-prism",
//         curl: `curl -X POST https://jsonplaceholder.typicode.com/posts \\
//   -H "Content-Type: application/json" \\
//   -d '{"title": "Init Prism", "body": "Initializing the prism service", "userId": 1}'`,
//         response: "",
//       },
//       {
//         name: "activity",
//         curl: `curl -X GET https://jsonplaceholder.typicode.com/posts?userId=1 \\
//   -H "Accept: application/json"`,
//         response: "",
//       },
//       {
//         name: "log",
//         curl: `curl -X GET https://jsonplaceholder.typicode.com/posts/1/comments \\
//   -H "Accept: application/json"`,
//         response: "",
//       },
//     ],
//     env: {
//       host: "https://jsonplaceholder.typicode.com",
//       token: "dummy-prism-token-abc123",
//     },
//   },
//   {
//     collectionName: "marshal",
//     curls: [
//       {
//         name: "get-started",
//         curl: `curl -X GET https://jsonplaceholder.typicode.com/users/1 \\
//   -H "Accept: application/json"`,
//         response: "",
//       },
//       {
//         name: "create-post",
//         curl: `curl -X POST https://jsonplaceholder.typicode.com/posts \\
//   -H "Content-Type: application/json" \\
//   -d '{"title": "Marshal Post", "body": "Created via marshal", "userId": 2}'`,
//         response: "",
//       },
//       {
//         name: "update-post",
//         curl: `curl -X PATCH https://jsonplaceholder.typicode.com/posts/1 \\
//   -H "Content-Type: application/json" \\
//   -d '{"title": "Updated Marshal Post"}'`,
//         response: "",
//       },
//     ],
//     env: {
//       host: "https://jsonplaceholder.typicode.com",
//       token: "dummy-marshal-token-xyz789",
//     },
//   }
// ];

export const collections: TPostBoxCollections = [
  {
    collectionName: "JSONPlaceholder Lab",
    curls: [
      {
        name: "List Resources (GET)",
        curl: `curl -X GET https://jsonplaceholder.typicode.com/posts?_limit=5 \\
  -H "Accept: application/json"`,
        response: "",
      },
      {
        name: "Create Resource (POST)",
        curl: `curl -X POST https://jsonplaceholder.typicode.com/posts \\
  -H "Content-Type: application/json" \\
  -d '{"title": "New Post", "body": "Testing proxy POST", "userId": 1}'`,
        response: "",
      },
      {
        name: "Replace Resource (PUT)",
        curl: `curl -X PUT https://jsonplaceholder.typicode.com/posts/1 \\
  -H "Content-Type: application/json" \\
  -d '{"id": 1, "title": "Fully Updated", "body": "PUT replaces the whole resource", "userId": 1}'`,
        response: "",
      },
      {
        name: "Update Resource (PATCH)",
        curl: `curl -X PATCH https://jsonplaceholder.typicode.com/posts/1 \\
  -H "Content-Type: application/json" \\
  -d '{"title": "Partially Updated"}'`,
        response: "",
      },
      {
        name: "Remove Resource (DELETE)",
        curl: `curl -X DELETE https://jsonplaceholder.typicode.com/posts/1`,
        response: "",
      },
      {
        name: "Check Headers (HEAD)",
        curl: `curl -I -X HEAD https://jsonplaceholder.typicode.com/posts`,
        response: "",
      },
    ],
    env: {
      host: "https://jsonplaceholder.typicode.com",
      token: "no-auth-required",
    },
  },
];