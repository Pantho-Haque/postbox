

## Selector 
### give 

- collections
- setCollections
- setSelectorResponse

### get
```json
{
    "collectionName": "prism",
    "curlName": "init-prism",
    "env": {
        "host": "https://jsonplaceholder.typicode.com",
        "token": "dummy-prism-token-abc123"
    },
    "curlJson":{
        "method": "POST",
        "url": "https://jsonplaceholder.typicode.com/posts",
        "headers": {
            "Content-Type": "application/json",
            "Authorization": "Bearer dummy-prism-token-abc123"
        },
        "body": {
            "title": "Init Prism",
            "body": "Initializing the prism service",
            "userId": 1
        }
    }
}
```

## creating collection
### get
```json
collections.push <- 
{
 "collectionName": "e.target.value",
 "curls": [],
 "env": {}
} 
```

## creating route

### give
- collectionName

### get
```json
collections-> collectionName-> curls.push <- 
{
    "name": "e.target.value"
}
```
 after actions
 - selection.curlName
 - selectorResponse


## creating (props)
### give
- selection
- setSelection
- setCollections
- setSelectorResponse


## renaming 

### give 
// collection
- collectionCurlList
- currentName
- type
- setCollections

// route
- collectionCurlList
- currentName
- type
- collectionName
- setCollections

## deleting 

// collection 
currentName
type
collectionCurlList
setSelection
setCollections




### env 

- envs
- collectionName
- setSelectorResponse
- setCollection