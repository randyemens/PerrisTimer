<?php
    use MyApp\TimerPusher;

    require __DIR__ . '/../vendor/autoload.php';

    $bindPort = 'tcp://127.0.0.1:5555';
    $clientPort = '0.0.0.0:8080';

    use React\EventLoop\Factory;
    use React\ZMQ\Context;
    use React\Socket\Server;
    use Ratchet\Server\IoServer;
    use Ratchet\Http\HttpServer;
    use Ratchet\WebSocket\WsServer;
    use Ratchet\Wamp\WampServer;

    $loop = Factory::create();
    $pusher = new TimerPusher();

    // Listen for the web server to make a ZeroMQ push after an ajax request
    $context = new Context($loop);
    $pull = $context->getSocket(ZMQ::SOCKET_PULL);
    $pull->bind($bindPort); // Binding to 127.0.0.1 means the only client that can connect is itself
    $pull->on('message', array($pusher, 'onUpdateTimer'));

    // Set up our WebSocket server for clients wanting real-time updates
    $webSock = new Server($clientPort, $loop); // Binding to 0.0.0.0 means remotes can connect
    $webServer = new IoServer(
        new HttpServer(
            new WsServer(
                new WampServer(
                    $pusher
                )
            )
        ),
        $webSock
    );

    $loop->run();