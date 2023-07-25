const readline = require('readline');
const SockJS = require('sockjs-client');
const Stomp = require('stompjs');
const path = require('path');

const socket = new SockJS('http://localhost:8090/ws',{headers: {"senderId": "1"}});
const stompClient = Stomp.over(socket);

stompClient.connect(headers={"senderId":"1"}, function (frame) {
  console.log('STOMP connection established');

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

    stompClient.subscribe('/topic/1', function (response) {
      console.log(response.body);
    });

  rl.setPrompt('Enter your message (or type "exit" to quit): ');
  rl.prompt();

  rl.on('line', function (input) {
    if (input.toLowerCase() === 'exit') {
      rl.close();
      return;
    }

    const currentTimestamp = new Date().getTime();

    const message = {
    content: input,
    senderId: 1,
    recipientId:2,
    timestamp: currentTimestamp,
    };

    const headers = {};

    stompClient.send('/app/chat.sendMessage', headers, JSON.stringify(message));

    rl.prompt();
  });

  rl.on('close', function () {
    console.log('Chat session ended');
    stompClient.disconnect();
    process.exit(0);
  });
});

stompClient.debug = null; // Disable debug logs

stompClient.onDisconnect = function () {
  console.log('STOMP connection closed');
};

socket.onclose = function () {
  console.log('WebSocket connection closed');
};

socket.onerror = function (error) {
  console.error('WebSocket error:', error);
};

