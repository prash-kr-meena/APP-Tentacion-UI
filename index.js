"use strict";

// ? ------------------------------------------------------------------------------------------------------
let baseUrl = 'http://localhost:3000';


// ? ------------------------------------------------------------------------------------------------------

let appModule = angular.module("appathon-frontend", ["ngRoute"]) //'ngMap'

.run(function ($rootScope, $window) {
      // * check if used logged in Or NOT   ---> INITIALLY its false (AS we are NOT USING SESSIONS)
      $rootScope.user_loged_in = false; //? to check if the user loged in
      $rootScope._id = undefined;
      // $window.location.href = "#!/";
});

appModule.config(['$routeProvider', function ($routeProvider) {
      $routeProvider
      .when('/', {
            title: 'APP-Tencation',
            controller: 'main_ctrl',
            // templateUrl: './views/root.html',
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
            // templateUrl: "./views/page404.html",
            // templateUrl: "/",
            // controller: 'error_404_ctrl',
            redirectTo: "/"
      });
}]);


// ! ========================================================


appModule.controller("main_ctrl", function ($window, $rootScope, $route) { // NOT doing $scope injection   --> this refers to $scope
      let $rs = $rootScope;

      this.error404 = false;

      this.errorList = [];

      // console.log($rs.buyer_loged_in);
      // console.log($rs.dealer_loged_in);


      // ? if the user is loged in don't show the car LOGO to him
      if ($rs.buyer_loged_in) {
            $window.location.href = '#!/cars';
      } else if ($rs.dealer_loged_in) {
            $window.location.href = '#!/dashboard';
      }


      this.re_render = function () {
            $route.reload();
      };

      // this.something = "++++++++++";

      this.logout = function () {
            console.log(" link clicked");
            $rootScope.buyer_loged_in = false;
            $rootScope.dealer_loged_in = false;
      };



});



appModule.controller('user_login', function ($scope, $http, $window, $rootScope) {
      let $rs = $rootScope;

      this.usermail = "prashantkr314@gmail.com";
      this.password = "000000";
      this.role = "buyer";

      // ! accessing the parent scope
      // console.log($scope.main.something);
      // $scope.main.something = "&&&&&";
      // console.log($scope.main.something);
      // //! ------------------------------



      this.send_data = function (usermail, password, role) {

            let validationErrors = validate_login_credentials(usermail, password, role);
            console.log(validationErrors);
            // console.log(usermail, password, role);

            if (validationErrors.length === 0) { //? ie if no errors do a post request to login backend
                  let url;

                  if (role === "buyer") {
                        url = baseUrl + "/buyer/login";
                  } else {
                        url = baseUrl + "/dealer/login";
                  }


                  let data = {
                        email: usermail,
                        password: password
                  };


                  let config = {
                        dataType: 'json',
                        "Content-Type": "application/json"
                  };

                  // console.log(url);
                  $http.post(url, data, config)
                  .then(function (response) {
                        // console.log(response); //?do something witht the response
                        if (response.data.status === 200) {
                              allow_user_to_log_in(role); //? show success message to user

                              //! sorry for this code
                              let splited = response.data.succes_msg.split("@");
                              $rootScope._id = splited[0];
                              $rootScope.email = splited[1];
                              $rootScope.fullemail = $rootScope.email + "@" + splited[2];
                              // console.log($rootScope._id);
                              // console.log($rootScope.email);
                              console.log("Successfully logged in");
                              console.log(response.data);

                        } else {
                              // todo : show erros to the user

                        }
                  }, function (reject) {
                        console.log(reject); // ?show the exception
                  });

            }
      };

      function allow_user_to_log_in(role) {
            // ! accessing the parent scope

            // ? main --> is the alias for the main_controller which is parent of ueser_login controller
            if (role === "buyer") {
                  console.log(`before changing : ${$rs.buyer_loged_in}`);
                  $rs.buyer_loged_in = true;
                  console.log(`AFTER changing : ${$rs.buyer_loged_in}`);
            } else {
                  $rs.dealer_loged_in = true;
            }

            console.log(`Allowed :  ${role} to log in!`);
            // alert();
            $window.location.href = "#!/";

      }


      function validate_login_credentials(usermail, password, role) {
            let ve = [];

            console.log(usermail);

            // ? simple validation
            if (usermail === "" || usermail === undefined) { // can't be empty
            ve.push("UserMail is required");
      } else if (usermail.length < 4) {
            ve.push("UserMail must be min 5 character long");
      }

      if (password === "" || password === undefined) {
            ve.push("password is required");
      } else if (password.length < 4) {
            ve.push("password must be min 5 character long");
      }
      if (role === undefined) {
            ve.push("select a role");
      }

      return ve;
}

});



appModule.controller("user_signup", function ($http, $window) {



      this.send_data = function (username, email, password, password_2, address, role) {
            let validationErrors = validate_signup_credentials(username, email, password, password_2, address, role);

            // console.log(validationErrors);

            if (validationErrors.length === 0) { //? ie if no errors do a post request to login backend
                  let url;

                  if (role === "buyer") {
                        url = baseUrl + "/buyer/signup";
                  } else {
                        url = baseUrl + "/dealer/signup";
                  }

                  let data = {
                        username: username,
                        email: email,
                        password: password,
                        address: address, // Todo : at this point use geocoding to get the lat long of user
                  };

                  let config = {
                        dataType: 'json',
                        "Content-Type": "application/json"
                  };

                  // console.log(url);
                  $http.post(url, data, config)
                  .then(function (response) {
                        console.log(response);
                        if (response.data.status === 200) { //? user is registered ---> REDIRECT
                              $window.location.href = '#!/users/login';
                        } else {
                              // TODO : show errors to the user
                        }

                  }, function (reject) {
                        console.log(reject);
                  });

            }


      };


      function validate_signup_credentials(username, email, password, password_2, address, role) {
            let ve = [];

            // ? simple validation
            if (username === undefined || username === "") { // can't be empty
            ve.push("Username is required");
      } else if (username.length < 4 || username.length > 15) {
            ve.push("Username can be min:5 and max:15 character long");
      }

      if (email === undefined || email === "") {
            ve.push("Email is required");
      }

      if (address === undefined || address === "") {
            ve.push("Address is required");
      } else if (address.length < 10) {
            ve.push("Address must be min 10 character long");
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

      if (role === undefined) {
            ve.push("Select a role");
      }


      return ve;
}

});








// ! ========================================================


// ? change page title
appModule.run(['$rootScope', '$route', function ($rootScope, $route) {
      $rootScope.$on('$routeChangeSuccess', function () {
            document.title = $route.current.title;
      });
}]);