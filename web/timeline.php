<?php
function debugPrint($json_result)
{
    $string = json_decode($json_result, true);
    
    if($string["errors"][0]["message"] != "") {echo "<h3>Sorry, there was a problem.</h3>
    	<p>Twitter returned the following error message:</p><p>
    <em>".$string[errors][0]["message"]."</em></p>";
    exit();}
    
    
    echo "<pre>";
    print_r($string);
    echo "</pre>";
    echo $string[0]['id']." - ".$string[0]['screen_name']." - ".$string[0]['location']."<br/>";
}

$userId=$_REQUEST["userId"];
$url = "http://twittercalheatmap.elasticbeanstalk.com/timeline?userId=".$userId;

$curl = curl_init();
curl_setopt($curl, CURLOPT_URL, $url);
curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
$result = curl_exec($curl);
curl_close($curl);

//debugPrint($result);

echo $result;

?>