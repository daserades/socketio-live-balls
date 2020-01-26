app.controller('indexController', ['$scope', 'indexFactory', ($scope, indexFactory) => {

    $scope.messages = [ ];

    $scope.init = () => {
      const username = prompt('Please enter username');

      if (username) {
          initSocket(username);
      } else {
          return false;
      }
    };

    function initSocket(username) {
        const connectionOptions = {
            reconnectionAttempts: 3,
            reconnectionDelay: 600
        };

        indexFactory.connectSocket('http://localhost:3000/', connectionOptions)
            .then((socket) => {
                //console.log("Connection was provided", socket);
                socket.emit('newUser', { username });

                socket.on('newUser', (data) => {
                    const messageData = {
                        type: {
                            code: 0, //server or user message
                            message: 1 //login or logout message
                        }, //info
                        username: data.username
                    };
                    $scope.messages.push(messageData);
                    $scope.$apply();
                });

                socket.on('disconnectUser', (data) => {
                    const messageData = {
                        type: {
                            code: 0, //server or user message
                            message: 0 //login or logout message
                        }, //info
                        username: data.username
                    };
                    $scope.messages.push(messageData);
                    $scope.$apply();
                });

            }).catch((err) => {
                console.log(err);
            });
    }

}]);