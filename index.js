'use strict';


// ? ---------------------------------  Globals ------------------------------------

let serverPort = 5000;
// make connection from front-end to the server
let socket = io.connect('http://localhost:'+serverPort);

let baseUrl = 'http://localhost:' + serverPort;


// ? -------------------------------------------------------------------------------

let app = angular.module("Tencation-UI", ["ngRoute"]); //'ngMap'



app.run(['$rootScope', '$route', '$window',function ($rootScope, $route, $window) {
      // ? change page title
      $rootScope.$on('$routeChangeSuccess', function () {
            document.title = $route.current.title;
      });

      // * check if used logged in Or NOT   ---> INITIALLY its false (AS we are NOT USING SESSIONS)
      $rootScope.user_loged_in = false; //? to check if the user loged in
      $rootScope._id = undefined;
      // $window.location.href = "#!/";



      //! user info
      $rootScope.userName = 'undefined';
      $rootScope.userEmail = 'undefined';
      $rootScope.userSocketId = 'undefined';
}]);




app.config(['$routeProvider', function ($routeProvider) {
      $routeProvider
      .when('/', {
            title: 'APP-Tencation',
            // templateUrl: './views/videoSync.html',
            templateUrl: './views/root.html',
            controller: 'main_ctrl',
      })
      .when('/videoSync', {
            title: 'TextChat',
            controller: 'videoChat_ctrl',
            templateUrl: './views/videoSync.html',
      })
      .when('/textChat', {
            title: 'TextChat',
            controller: 'textChat_ctrl',
            templateUrl: './views/textChat.html',
      })
      .when('/users/login', {
            title: 'Login',
            templateUrl: "./views/user_pages/user_login.html",
            controller: 'user_login',
      })
      .when('/users/signup', {
            title: 'Signup',
            templateUrl: "./views/user_pages/user_signup.html",
            controller: 'user_signup',
      })
      .otherwise({
            title: 'ERROR',
            templateUrl: "./views/page404.html",
            // templateUrl: "/",
            // controller: 'error_404_ctrl',
            redirectTo: "/"
      });
}]);


// ! =======================   Controllers    =================================




app.controller("main_ctrl", function ($window, $rootScope, $route, $http) { // NOT doing $scope injection   --> this refers to $scope
      let $rs = $rootScope;

      this.error404 = false;

      this.errorList = [];
      // ? if the user is loged in don't show the car LOGO to him
      if ($rs.user_loged_in) {
            $window.location.href = '#!/textChat';
      }

      // this.something = "++++++++++";

      this.logout = function () {
            console.log(" LOG-OUT clicked");

            let url = baseUrl + "/user/logout?email="+$rs.userEmail;

            // console.log(url);
            $http.get(url)
            .then(function (response) {
                  // console.log(response); //?do something witht the response
                  if (response.data.status === 200) {
                        $rootScope.user_loged_in = false;

                        // ! Re-Set the global data
                        $rs.userName = 'undefined';
                        $rs.userEmail = 'undefined';
                        $rs.userSocketId = 'undefined';

                        $window.location.href = "#!/";
                        console.log("Successfully logged OUT");
                  } else {
                        // todo : show erros to the user
                  }
            }, function (reject) {
                  console.log(reject); // ?show the exception
            });
      };
});







app.controller('user_login', function ($scope, $http, $window, $rootScope) {
      let $rs = $rootScope;


      // ? for testing purpose only
      this.email = "prashantkr314@gmail.com";
      this.password = "000000";

      // ! accessing the parent scope
      // console.log($scope.main.something);
      // $scope.main.something = "&&&&&";
      // console.log($scope.main.something);
      // //! ------------------------------

      this.send_data = function (email, password) {

            let validationErrors = validate_login_credentials(email, password);
            console.log(validationErrors);
            // console.log(email, password, role);

            if (validationErrors.length === 0) { //? ie if no errors do a post request to login backend
                  let url = baseUrl + "/user/login";

                  let data = {
                        email: email,
                        password: password,
                        socketId : socket.id
                  };


                  let config = {
                        dataType: 'json',
                        "Content-Type": "application/json"
                  };

                  // console.log(url);
                  $http.post(url, data, config)
                  .then(function (response) {
                        console.log(response); //?do something witht the response
                        if (response.data.status === 200) {
                              update_user_globals(data.email); //? show success message to user
                              console.log("Successfully logged in");
                              // console.log(response.data);

                              // ! set the global data
                              $rs.userName = response.data.succes_msg.name;
                              $rs.userEmail = response.data.succes_msg.email;
                              $rs.userSocketId = response.data.succes_msg.socketId;

                              console.log($rs.userName, $rs.userEmail, "<<<--- after login");

                        } else {
                              // todo : show erros to the user
                        }
                  }, function (reject) {
                        console.log(reject); // ?show the exception
                  });

            }
      };

      function update_user_globals(email) {
            // ! accessing the parent scope
            // ? main --> is the alias for the main_controller which is parent of ueser_login controller

            console.log(`before changing : ${$rs.user_loged_in}`);
            $rs.user_loged_in = true;
            console.log(`AFTER changing : ${$rs.user_loged_in}`);

            $rs.userEmail = email; // --> so that each time i would know the user email, i can use it to log out the user

            // $window.location.href = "#!/textChat";
            $window.location.href = "#!/videoSync";
      }


      function validate_login_credentials(email, password) {
            let ve = [];
            // console.log(email);

            // ? simple validation
            if (email === "" || email === undefined || email.length < 4) {
                  ve.push("email is required");
            }

            if (password === "" || password === undefined) {
                  ve.push("password is required");
            } else if (password.length < 4) {
                  ve.push("password must be min 5 character long");
            }

            return ve;
      }
});








app.controller("user_signup", function ($http, $window) {

      this.username= "prashant";
      this.email = "prashantkr314@gmail.com";
      this.password = "000000";
      this.password_2 = "000000";



      this.send_data = function (username, email, password, password_2) {
            let validationErrors = validate_signup_credentials(username, email, password, password_2);

            // console.log(validationErrors);
            if (validationErrors.length === 0) { //? ie if no errors do a post request to login backend
                  let url =  baseUrl + "/user/signup";

                  let data = {
                        username: username,
                        email: email,
                        password: password,
                  };

                  let config = {
                        dataType: 'json',
                        "Content-Type": "application/json"
                  };

                  // console.log(url);
                  $http.post(url, data, config)
                  .then(function (response) {
                        console.log(response);
                        if (response.data.status === 200) {
                              console.log("user registered Successfully.");
                              $window.location.href = '#!/users/login'; //? user registered so ---> REDIRECT
                        } else {
                              // TODO : show errors to the user
                              console.log("use not registered Might already be registered.");
                        }
                  }, function (reject) {
                        console.log("User registration REJECTED");
                        console.log(reject);
                  });
            }
      };


      function validate_signup_credentials(username, email, password, password_2) {
            let ve = [];

            // ? simple validation
            if (username === undefined || username === "" || (username.length < 4 || username.length > 15)) {
                  ve.push("invalid username");
            }


            if (email === undefined || email === "") {
                  ve.push("Email is required");
            }


            if (password === "" || password === undefined) {
                  ve.push("Password is required");
            } else if (password.length < 4) {
                  ve.push("Password must be min 5 character long");
            }

            if (password_2 === "" || password_2 === undefined) {
                  ve.push("Confirm your password");
            } else if (password !== password_2) {
                  ve.push("Passwords do not match");
            }

            return ve;
      }
});






// ? =======================      =================================


app.controller('textChat_ctrl', ['$scope', '$http', '$rootScope', function($scope, $http, $rootScope){
      let $rs = $rootScope;
      this.userHandle =  $rs.userName;
      // this.userHandle =  "prashant";
      console.log("textChat_ctrl controll");
}]);


app.controller('videoChat_ctrl', ['$scope', '$http', function($scope, $http){
      console.log("textChat_ctrl controll");
}]);


