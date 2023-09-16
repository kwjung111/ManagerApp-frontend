
self.addEventListener("install", () => {
    self.skipWaiting();
  });

  //TODO 서비스 워커 웹푸시
/*
  self.addEventListener("fetch", function (event) {
    console.log("Fetch request for: ", event.request.url);
  });

  self.addEventListener("push", function (event) {
    console.log("push event activated");
  });
*/
  