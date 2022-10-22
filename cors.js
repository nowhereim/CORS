//인증된 요청 Credentials Request
//아래와같이 include를 설정하면 모든 요청에 인증정보를 포함시킨다.
//omit은 기본값으로 인증정보를 포함시키지 않는다.
//same-origin은 동일한 도메인에서만 인증정보를 포함시킨다.

// 클라이언트에서 요청할떄 크레덴셜을 인클루드 하여 보낸다.
// fetch('http://localhost:3001/cors', {
//   method: 'PUT',
//   credentials: 'include' // credentials 옵션
// })
// .then(function(response) {
//   ... 코드
// })
// .catch(function(error) {
//   ... 코드
// // })

// 서버에서는 크레덴셜을 트루 로 설정 해 줘야 한다.
// app.use(cors({
//     origin: true, // 출처 허용 옵션
//     credential: true // 사용자 인증이 필요한 리소스(쿠키 ..등) 접근
// }));

//만일 위와 같이 도메인이 다른 클라이언트가 쿠키 값을 보내고 싶으면,
//클라이언트에선 credentials 옵션 설정을 넣어주어야 하고, 서버에서도 cors 설정에서
//credentials: true 로 옵션을 둘다 설정해주어야 한다.

// credentials: true 라는 옵션은 다른 도메인 간에 쿠키 공유를 허락하는 옵션이다.
// 서버 간 도메인이 다른 경우 이 옵션을 활성화하지 않으면 로그인되지 않을 수 있다.

//cors 문제를 해결하기 위해서는 응답 헤더에 Access-Control-Allow-Origin 헤더를 넣어야 한다.
//이 헤더는 클라이언트 도메인의 요청을 허락하겠다는 뜻이다.

//^ CORS 허용
// res.setHeader('Access-Control-Allow-origin', '*');
// res.setHeader('Access-Control-Allow-Credentials', 'true'); // 쿠키 주고받기 허용
// //위와 같이 설정하면 모든 도메인에서 접근 가능하다.
// //"*"를 사용하면 모든 도메인에서 접근 가능하여 편리하지만 보안이 쓰레기가 된다.
// //

// //그러므로 아래와같이 특정 도메인만 허용하도록 설정해야한다.
// res.setHeader('Access-Control-Allow-origin', 'https://inpa.tistory.com');

// 만일 credentail: true로 인증된 요청을 사용할 경우
// , Access-Control-Allow-Origin 값이 '*' 일 경우 다음 에러가 발생한다.

// Access to XMLHttpRequest at 'http://lahuman.github.io' from origin
// 'http://localhost:8080' has been blocked by CORS policy: The value of
// the 'Access-Control-Allow-Origin' header in the response must not be
// the wildcard '*' when the request's credentials mode is 'include'.
// The credentials mode of requests initiated by the XMLHttpRequest is
// controlled by the withCredentials attribute.

// 요약 하자면, 인증 정보를 포함한 통신시 Access-Control-Allow-Origin
// 값이 '*' 일 경우 지원을 하지 않는 다는 것이다.
//  그래서 credentail옵션을 쓸때는 반드시 허용 출처를 *가 아닌 직접 명시를 해주어야 한다.

// //다음은 Access-Control 설정 종류들이다.

// // 헤더에 작성된 출처만 브라우저가 리소스를 접근할 수 있도록 허용함.
// Access-Control-Allow-Origin: "https://naver.com"

// // 리소스 접근을 허용하는 HTTP 메서드를 지정해 주는 헤더
// Access-Control-Request-Methods: GET, POST, PUT, DELETE

// // 서버에서 응답 헤더에 추가해 줘야 브라우저의 자바스크립트에서 헤더에 접근 허용
// Access-Control-Expose-Headers: Authorization

// // preflight 요청 결과를 캐시 할 수 있는 시간을 나타냄.
// // 60초 동안 preflight 요청을 캐시하는 설정으로, 첫 요청 이후 60초 동안은 OPTIONS 메소드를 사용하는 예비 요청을 보내지 않는다.
// Access-Control-Max-Age: 60

// // 자바스크립트 요청에서 credentials가 include일 때 요청에 대한 응답을 할 수 있는지를 나타낸다
// Access-Control-Allow-Credentials: true

//cors 미들웨어 사용
// npm i cors
// const express = require('express')
// const cors = require('cors');

// const app = express();

// app.use(cors({
//     origin: '*', // 모든 출처 허용 옵션. true 를 써도 된다.
// }));

//proxy 설정은 package.json에 아래와 같이 설정한다.
// "proxy": "http://localhost:3000"

//이후 아래와 같이 해주면 된다.

//아래와 같이 하면 localhost:3000/api/~~~ 이런식으로 요청을 보내면
//localhost:3000/api/~~~ 이런식으로 요청을 보내는 것과 같다.

const { createProxyMiddleware } = require("http-proxy-middleware"); // npm i http-proxy-middleware

module.exports = function (app) {
  // app은 express()로 생성된 app 객체
  app.use(
    // app.use()로 미들웨어를 등록한다.
    "/api", // /api로 시작하는 요청에 대해서만 프록시를 적용한다.
    createProxyMiddleware({
      // createProxyMiddleware()로 프록시 미들웨어를 생성한다.
      // proxy할 주소, 즉, 백단의 주소를 적어줍니다.
      target: "http://localhost:5000", // 백단 주소
      changeOrigin: true, // 프론트단의 주소와 백단의 주소가 다를 경우 true로 설정해야 합니다.
    })
  );
};

//npm i cors한다.
const cors = require("cors"); //cors 미들웨어 사용
app.use(cors()); //cors 미들웨어를 사용한다.
app.use((req, res, next) => {
  //cors 미들웨어를 사용한다.
  res.setHeader("Access-Control-Allow-origin", "*"); //모든 출처 허용
  res.setHeader("Access-Control-Allow-Headers", "*"); //모든 헤더 허용
  res.setHeader(
    //모든 메소드 허용
    "Access-Control-Allow-Methods", //모든 메소드 허용
    "GET, POST, OPTIONS, PUT, PATCH, DELETE" //모든 메소드 허용
  );
  next();
});

//package.json에 cors이 추가 되었는지 확인한다.
