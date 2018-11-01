<?php

if(!isset($_POST['actionUrl'])){
    exit;
}
$actionUrl = $_POST['actionUrl'];
unset($_POST['actionUrl']);
if (!empty($_FILES)) {
    foreach ($_FILES as $key => $file) {
      move_uploaded_file($file['tmp_name'],"/tmp/".$file["name"]);
      $_POST[$key] = new \CURLFile("/tmp/".$file["name"]);
    }
}
$result = curlPost($actionUrl,$_POST);
header('Access-Control-Allow-Origin:*');
header('Access-Control-Allow-Methods:POST');
header('Access-Control-Allow-Headers:x-requested-with,content-type');
header('Content-Type: application/json;charset=utf-8');
echo $result;
exit;

/**
 * post
 * @param $url
 * @param $data
 * @param int $timeout
 * @param string $headerAry
 * @return mixed
 */
function curlPost($url, $data, $timeout = 3, $headerAry = '')
{
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
    curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, $timeout);
    curl_setopt($ch, CURLOPT_TIMEOUT, $timeout);

    curl_setopt($ch, CURLOPT_HEADER, false);
    if ($headerAry != '') {
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headerAry);
    }
    $res = curl_exec($ch);

    return $res;
}
