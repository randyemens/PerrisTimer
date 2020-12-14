<?php
    $socketConnection = "tcp://localhost:5555";

    $postData = file_get_contents('php://input');
    $xml = simplexml_load_string($postData);
    $json = json_encode($xml);
    $timerFile = fopen("timer.txt", "w");
    fwrite($timerFile, serialize($json));
    fclose($timerFile);

    // post.php ???
    // This all was here before  ;)
    $entryData = array(
        'category' => 'updateTimer'
      , 'data'    => $xml
    );
    // This is our new stuff
    $context = new ZMQContext();
    $socket = $context->getSocket(ZMQ::SOCKET_PUSH, 'my pusher');
    $socket->connect($socketConnection);

    $socket->send(json_encode($entryData));
    echo $json;