<!DOCTYPE html>
<html lang="es">
<head>
	<meta http-equiv="content-type" content="text/html; charset=utf-8" />
	<title>Blog</title>
	<base href="{{base_url}}" />
			<meta name="viewport" content="width=992" />
		<meta name="description" content="" />
	<meta name="keywords" content="Blog" />
	
	<link href="css/bootstrap.min.css" rel="stylesheet" type="text/css" />
	<script src="js/jquery-1.11.3.min.js" type="text/javascript"></script>
	<script src="js/bootstrap.min.js" type="text/javascript"></script>
	<script src="js/main.js" type="text/javascript"></script>

	<link href="css/site.css?v=1.1.41" rel="stylesheet" type="text/css" />
	<link href="css/common.css?ts=1488689574" rel="stylesheet" type="text/css" />
	<link href="css/blog.css?ts=1488689574" rel="stylesheet" type="text/css" />
	<meta name="google-site-verification" content="" />
	<script type="text/javascript">var currLang = '';</script>		
	<!-- Le HTML5 shim, for IE6-8 support of HTML5 elements -->
	<!--[if lt IE 9]>
	  <script src="http://html5shim.googlecode.com/svn/trunk/html5.js"></script>
	<![endif]-->
</head>


<body>{{ga_code}}<div class="root"><div class="vbox wb_container" id="wb_header">
	
<div id="wb_element_instance53" class="wb_element"><ul class="hmenu menu-landing"><li><a href="#inicio" target="_self" title="Inicio">Inicio</a></li><li><a href="#tienda" target="_self" title="Tienda">Tienda</a></li><li><a href="#sobre-nosotros" target="_self" title="Sobre nosotros">Sobre nosotros</a></li><li><a href="#contactos" target="_self" title="Contactos">Contactos</a></li></ul></div><div id="wb_element_instance54" class="wb_element" style=" line-height: normal;"><h4 class="wb-stl-pagetitle">Florysol</h4>
</div><div id="wb_element_instance55" class="wb_element"><a href="#inicio"><img alt="logo" src="gallery_gen/03a15228ad0a60c0010ffd9cad5ef5ba_81x86.png"></a></div></div>
<div class="vbox wb_container" id="wb_main">
	
<div id="wb_element_instance60" class="wb_element" style="width: 100%;">
			<?php
				global $show_comments;
				if (isset($show_comments) && $show_comments) {
					renderComments(blog);
			?>
			<script type="text/javascript">
				$(function() {
					var block = $("#wb_element_instance60");
					var comments = block.children(".wb_comments").eq(0);
					var contentBlock = $("#wb_main");
					contentBlock.height(contentBlock.height() + comments.height());
				});
			</script>
			<?php
				} else {
			?>
			<script type="text/javascript">
				$(function() {
					$("#wb_element_instance60").hide();
				});
			</script>
			<?php
				}
			?>
			</div></div>
<div class="vbox wb_container" id="wb_footer" style="height: 148px;">
	
<div id="wb_element_instance56" class="wb_element" style=" line-height: normal;"><p class="wb-stl-footer">© 2017 <a href="http://mbrsoluciones.com">mbrsoluciones.com</a></p></div><div id="wb_element_instance57" class="wb_element"><a href="http://facebook.com" target="1"><img alt="fb" src="gallery_gen/85fd37e8949aec5872d591a7777cd846_32x32.png"></a></div><div id="wb_element_instance58" class="wb_element"><a href="http://pinterest.com" target="1"><img alt="1461561581_pinterest_online_social_media" src="gallery_gen/d72a40ff51298a225134ec0bedf3eaeb_32x32.png"></a></div><div id="wb_element_instance59" class="wb_element"><a href="http://instagram.com" target="1"><img alt="insta" src="gallery_gen/3ac01b035dbcd38ef11a07901bc9b608_32x32.png"></a></div><div id="wb_element_instance61" class="wb_element" style="text-align: center; width: 100%;"><div class="wb_footer"></div><script type="text/javascript">
			$(function() {
				var footer = $(".wb_footer");
				var html = (footer.html() + "").replace(/^\s+|\s+$/g, "");
				if (!html) {
					footer.parent().remove();
					footer = $("#wb_footer");
					footer.height(68);
				}
			});
			</script></div></div><div class="wb_sbg"></div></div></body>
</html>
