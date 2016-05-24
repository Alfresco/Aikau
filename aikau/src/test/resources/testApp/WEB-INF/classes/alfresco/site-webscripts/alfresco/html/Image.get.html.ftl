<script>
   window.bodyClicked = false;
   document.body.addEventListener("click", function() {
      console.error("Body click was triggered!");
      window.bodyClicked = true;
   });
</script>

<@processJsonModel />