<?php

require('simple_html_dom.php'); 

if (file_get_contents('php://input') != null) {
       

$input = str_replace(' ','+',json_decode(file_get_contents('php://input'))->key);

$myUrl = "https://www.youtube.com/results?search_query=" . $input;
$html = file_get_html($myUrl);

foreach ($html->find('div.yt-lockup-content') as $video) {

		$url = "https://www.youtube.com/embed" . $video->find('h3.yt-lockup-title a', 0)->href;
		$duration = $video->find('h3.yt-lockup-title span', 0);
        $views = $video->find('ul.yt-lockup-meta-info li', 1);
		
		if($duration != null && $views != null){
			//$views = preg_replace("/[^0-9]/","",$views);
			//$videos[] = array("url"=>$url, "views"=>$views);
			break;
				
		}
			
						
}


   echo str_replace('watch?v=','',$url);

	
}
	



?>