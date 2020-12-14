<?php
    $timerFile = file_get_contents("timer.txt");
    $timerObject = unserialize($timerFile);
    echo $timerObject;