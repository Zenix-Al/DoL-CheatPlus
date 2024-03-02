<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="includes/main.css">
</head>
<body>
<div id="cheat">
  <div id="floating-button">
    <button id="cheat-open">Cheat</button>
    <button id="cheat-up" hidden>&#9650;</button>
    <button id="cheat-down">&#9660;</button>
</div>
<div id="toastContainer"></div>
  

  <div id="modal" class="modal">
    <div class="modal-content">
	   <div class="navbar">
        <div class="nav-link gold" id="quick-link">Quick</div>
        <div class="nav-link" id="stats-link">Stat</div>
        <div class="nav-link" id="misc-link">Misc</div>
        <div id="closeButton" class="close nav-link">&times;</div>
       </div>
      <div id="modal-content-container">
		<div class="content active" id="quick-content" >
			<!-- Content for the stats category -->
		</div>
        <div class="content" id="stats-content">
			<!-- Content for the stats category -->
		</div>
		<div class="content" id="misc-content">
			<!-- Content for the stats category -->
		</div>
      </div>
	   <div class="navbar">
        <div id="closeButton" class="close nav-link">&times;</div>
       </div>
    </div>
  </div>
</div>
  <?php require_once("main.html"); ?>
  <script>
    document.addEventListener("DOMContentLoaded", function() {
      var script = document.createElement("script");
      script.src = "includes/main.js";
      document.body.appendChild(script);
	  
	  var script = document.createElement("script");
      script.src = "includes/sync.js";
      document.body.appendChild(script);
	  
	  var script = document.createElement("script");
      script.src = "includes/mycode_toggle.js";
      document.body.appendChild(script);
	  
	  var script = document.createElement("script");
      script.src = "includes/mycode.js";
      document.body.appendChild(script);
	  
	  var script = document.createElement("script");
      script.src = "includes/listener.js";
      document.body.appendChild(script);
	  
	  var script = document.createElement("script");
      script.src = "includes/cheat_init.js";
      document.body.appendChild(script);
	  
	  var script = document.createElement("script");
      script.src = "includes/info_fetcher.js";
      document.body.appendChild(script);
    });
  </script>
  
</body>
</html>
