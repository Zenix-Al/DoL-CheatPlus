<style>
#floating-button{position:fixed;top:20px;right:20px;z-index:999}#toastContainer{position:fixed;top:20px;left:50%;transform:translateX(-50%);z-index:9999}@media(prefers-reduced-motion:reduce){.fade{transition:none}}.fade:not(.show){opacity:0}.collapse:not(.show){display:none}.collapsing{height:0;overflow:hidden;transition:height .35s ease}@media(prefers-reduced-motion:reduce){.collapsing{transition:none}}.collapsing.collapse-horizontal{width:0;height:auto;transition:width .35s ease}@media(prefers-reduced-motion:reduce){.collapsing.collapse-horizontal{transition:none}}.toast{background-color:#333;color:#fff;padding:10px 20px;border-radius:5px;margin-bottom:10px;opacity:1;transition:opacity .3s ease-in-out}.modal{display:none;position:fixed;z-index:1000;left:0;top:0;width:100%;height:100%;overflow:auto;background-color:rgba(0,0,0,0.5)}.modal-content{background-color:#fefefe;margin:10px auto;border:1px solid #888;width:90%}.close{cursor:pointer;font-weight:bold}.close:hover,.close:focus{color:black;cursor:pointer}.modal-content-container{display:flex;flex-direction:column}.modal-row{display:flex;justify-content:space-between;align-items:center;margin-bottom:10px}.modal-label{flex:1}.modal-inputs{flex:2}.modal-content{background-color:#222}.modal-content-container{max-height:400px;overflow-y:auto}.navbar{display:flex;justify-content:space-between;align-items:center;background-color:#333;color:#fff}.nav-link{width:100%;cursor:pointer;text-align:center;cursor:pointer;position:relative;border-right:1px solid #fff;padding:10px}.nav-link.active{text-decoration:underline}.content{display:none;padding:20px}.content.active{display:block}
</style>
<div id="cheat">
  <div id="floating-button">
    <button id="cheat-history-backwards" hidden>&#8592;</button>
    <button id="cheat-history-forwards" hidden>&#8594;</button>
    <button id="cheat-sidebar" style="font-size: 89%;" hidden>&#x2630;</button>
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
