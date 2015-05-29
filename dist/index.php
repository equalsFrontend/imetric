<!DOCTYPE HTML>

<html lang="en" ng-app="iMetric">
	<head ng-controller="HeaderController">
	
		<meta charset="UTF-8">
		<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
		<meta name="apple-mobile-web-app-capable" content="yes">
		<meta name="mobile-web-app-capable" content="yes">
		<meta name="viewport" content="initial-scale=0.75, maximum-scale=0.75">
		<meta name="description" content="KNGFU" />
		
		<title>Firebase - iMetric</title>
		
		<!-- meta facebook -->
		<meta property="og:locale" content="en_US" />  
        <meta property="og:title" content="KNGFU | Montreal Based Web Company" />
        <meta property="og:type" content="website" />
        <meta property="og:description" content="KNGFU" />
        <meta property="og:site_name" content="KNGFU" />

		<link rel="stylesheet" type="text/css" href="../assets/css/bootstrap.3.2.0.css">
		<link rel="stylesheet" type="text/css" href="../assets/css/bootstrap-theme-3.0.0.css">
		<link rel="stylesheet" type="text/css" href="../assets/css/styles.css">
		<link rel="stylesheet" type="text/css" href="../assets/css/animate.css">
		
		<link rel="icon" type="image/x-icon" href="favicon.ico" />
		
		<script> var dist = true; </script>
		
	</head>
	
	<body id="body" ng-controller="MainController" class="">
		<header><!-- header --></header>
								
		<div class="ui-view-container">
			<div class="main" ui-view="main"></div>
		</div>
				
		<!-- bower:js -->
		<script src="../bower_components/jquery/dist/jquery.js"></script>
		<script src="../bower_components/angular/angular.js"></script>
		<script src="../bower_components/angular-sanitize/angular-sanitize.js"></script>
		<script src="../bower_components/angular-mocks/angular-mocks.js"></script>
		<script src="../bower_components/angular-ui-router/release/angular-ui-router.js"></script>
		<script src="../bower_components/angular-hotkeys/angular-hotkeys.js"></script>
		<script src="../bower_components/angular-hotkeys/angular-hotkeys.min.js"></script>
		<script src="../bower_components/angular-route/angular-route.js"></script>
		<script src="../bower_components/angular-animate/angular-animate.js"></script>
		<script src="../bower_components/underscore/underscore.js"></script>
		<script src="../bower_components/highcharts/highcharts.js"></script>
		<script src="../bower_components/highcharts/modules/exporting.js"></script>
		<script src="../bower_components/highcharts/modules/exporting-csv.js"></script>
		<script src="../bower_components/highcharts-ng/src/highcharts-ng.js"></script>
		<script src="../bower_components/lodash/lodash.js"></script>
		<!-- endbower -->
		
		<!-- firebase -->
		<script src="https://cdn.firebase.com/js/client/2.2.5/firebase.js"></script>
				
		<!-- gmaps -->
		<script src="https://maps.googleapis.com/maps/api/js?v=3.exp&signed_in=true&libraries=visualization"></script>
				
		<!-- app -->
		<script type="text/javascript" src="imetric-1.0.0.min.js"></script>
						
	</body>
</html>