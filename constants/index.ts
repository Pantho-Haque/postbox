import { TPostBoxCollections } from "@/types";

export * from "./postbox"



export const collections: TPostBoxCollections = [
  {
    collectionName: "prism",
    curls: [
      {
        name: "init-prism",
        curl: `curl -X POST https://jsonplaceholder.typicode.com/posts \\
  -H "Content-Type: application/json" \\
  -d '{"title": "Init Prism", "body": "Initializing the prism service", "userId": 1}'`,
      },
      {
        name: "activity",
        curl: `curl -X GET https://jsonplaceholder.typicode.com/posts?userId=1 \\
  -H "Accept: application/json"`,
      },
      {
        name: "log",
        curl: `curl -X GET https://jsonplaceholder.typicode.com/posts/1/comments \\
  -H "Accept: application/json"`,
      },
    ],
    env: {
      host: "https://jsonplaceholder.typicode.com",
      token: "dummy-prism-token-abc123",
    },
  },
  {
    collectionName: "marshal",
    curls: [
      {
        name: "get-started",
        curl: `curl -X GET https://jsonplaceholder.typicode.com/users/1 \\
  -H "Accept: application/json"`,
      },
      {
        name: "create-post",
        curl: `curl -X POST https://jsonplaceholder.typicode.com/posts \\
  -H "Content-Type: application/json" \\
  -d '{"title": "Marshal Post", "body": "Created via marshal", "userId": 2}'`,
      },
      {
        name: "update-post",
        curl: `curl -X PATCH https://jsonplaceholder.typicode.com/posts/1 \\
  -H "Content-Type: application/json" \\
  -d '{"title": "Updated Marshal Post"}'`,
      },
    ],
    env: {
      host: "https://jsonplaceholder.typicode.com",
      token: "dummy-marshal-token-xyz789",
    },
  },
  {
    collectionName: "palantir",
    curls: [
      {
        name: "get-started",
        curl: `curl -X GET https://jsonplaceholder.typicode.com/users/1 \\
  -H "Accept: application/json"`,
      },
    ],
    env: {
      host: "https://jsonplaceholder.typicode.com",
      token: "dummy-marshal-token-xyz789",
    },
  },
];