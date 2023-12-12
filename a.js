function init() {
	document.forms.lyrics.currentline.value = 0 ;
	document.forms.lyrics.currentline.phrase = 0 ;
	document.getElementById("scrolllyrics").scrollTop = 0 ;
}

function escapeHtml(unsafe)
{
	return unsafe
	.replace(/&(?!amp;)/g, "&amp;")
	.replace(/<(?!lt;)/g, "&lt;")
	.replace(/>(?!gt;)/g, "&gt;")
	.replace(/"(?!quot;)/g, "&quot;")
	.replace(/'(?!#039;)/g, "&#039;") ;
}

function storeaudio(obj)
{
	var files = obj.files ;
	var file = URL.createObjectURL(files[0]) ;
	document.getElementById('songfile').value = file ;
	document.getElementById("startbutton").focus() ;
}

function startsong()
{
	$("div#countdown select").attr('disabled', 'disabled') ;

	if(document.forms.lyrics.elements.seconds.value > 0)
	{
		countdown(document.forms.lyrics.elements.seconds.value) ;
	}
	else
	{
		playsong() ;
	}
}

function playsong()
{
	audio_player.play() ;
	startcounter() ;
	document.getElementById("startbutton").onclick = pausesong ;
}

function pausesong()
{
	if (typeof(c) != "undefined") clearTimeout(c) ;
	var d = new Date() ;
	document.forms.lyrics.elements.songpausetime.value = d.getTime()
	audio_player.pause() ;
	document.getElementById("startbutton").onclick = continuesong ;
	document.getElementById("startbutton").childNodes[0].nodeValue = "Continue..." ;
	document.getElementById("startbutton").focus() ;
	$("#startbutton").removeClass("playing") ;
  $("input[name=backtoline]").css("visibility","visible");
  $("div#countdown select").removeAttr("disabled") ;
}

function continuesong()
{
	var d = new Date() ;

	document.forms.lyrics.elements.songstarttime.value = Number(document.forms.lyrics.elements.songstarttime.value) + (d.getTime() - document.forms.lyrics.elements.songpausetime.value) ;
  $("input[name=backtoline]").css("visibility","hidden");
  $("div#countdown select").attr('disabled', 'disabled') ;
  audio_player.currentTime -= Math.max(1,document.forms.lyrics.elements.seconds.value);
	audio_player.play() ;
	c = setTimeout("counter()",100) ;
	document.getElementById("startbutton").onclick = pausesong ;
	document.getElementById("nextbutton").focus() ;
	$("#startbutton").addClass("playing") ;
}

function getaudio(obj)
{
	var files = obj.files ;
	var file = URL.createObjectURL(files[0]) ;
	audio_player.src = file ;
	document.getElementsByName("songfilename")[0].value = files[0].name.substring(0,files[0].name.lastIndexOf('.')) ;
	document.getElementsByName("audiofile")[0].value = files[0].name ;
}

function countdown(seconds)
{
	document.getElementById("startbutton").childNodes[0].nodeValue = '- ' + seconds ;

	var beep = document.getElementById("beep") ;
	if(seconds <= 3) beep.play() ;

	if(seconds > 0)
	{
		seconds-- ;
		cd = setTimeout("countdown(" + seconds + ")",1000) ;
	}

	else
	{
		playsong() ;
	}
}

function startcounter()
{
	var d = new Date() ;

	$("#startbutton").addClass("playing") ;

	document.forms.lyrics.elements.songstarttime.value = d.getTime() ;
	document.getElementById("nextbutton").disabled = false ;
	document.getElementById("nextbutton").focus() ;

	counter() ;
}

function counter()
{
	var d = new Date() ;

	elapsedtime = new Date((audio_player.src ? (audio_player.currentTime * 1000) : d.getTime() - document.forms.lyrics.elements.songstarttime.value)) ;

	e_min = elapsedtime.getMinutes() ;
	e_sec = elapsedtime.getSeconds() ;

	if(e_min < 10) e_min = "0" + e_min ;
	if(e_sec < 10) e_sec = "0" + e_sec ;

	document.getElementById("startbutton").childNodes[0].nodeValue = e_min + ':' + e_sec ;

	if(e_min < 60) c = setTimeout("counter()",100) ;
}

function nextphrase()
{
	var d = new Date() ;

	a = Math.max(0,document.forms.lyrics.elements.currentline.value) ;
	b = Math.max(0,document.forms.lyrics.elements.currentphrase.value) ;

	anticipation = document.forms.lyrics.elements.anticipation.value ;

	indexphrase = 'phr[' + a + '][' + b + ']' ;

	emptyline = (document.getElementById(indexphrase).innerHTML == '' ? true : false) ;

	elapsedtime = (audio_player.src ? (audio_player.currentTime * 1000) : d.getTime() - document.forms.lyrics.elements.songstarttime.value) ;
	elapsedtime = Math.max(1,elapsedtime - (anticipation * 1000)) ;

	fieldname = 'starttime[' + a + '][' + b + ']' ;

	document.forms.lyrics.elements[fieldname].value = (emptyline ? "" : elapsedtime) ;

	textblock = eval("document.getElementById('phr[" + a + "][" + b + "]')") ;
	textblock.classList.add("synced") ;

	if(!emptyline) document.getElementById("backtoline[" + a + "]").disabled = false; ;

	if (b == textline[a].length - 1)
	{
		if (a == textline.length - 1)
		{
			document.getElementById("nextbutton").childNodes[0].nodeValue = "Get file" ;
			document.getElementById("nextbutton").onclick = generate ;
			$("#nextbutton").addClass("check") ;
		}
		else
		{
			document.forms.lyrics.elements.currentline.value++ ;
			document.forms.lyrics.elements.currentphrase.value = 0 ;

			$("#scrolllyrics").animate({scrollTop: Math.max(textblock.offsetTop - textblock.offsetParent.offsetParent.offsetTop - 220,0)},300,"swing") ;
		}
	}
	else document.forms.lyrics.elements.currentphrase.value++ ;

	if(emptyline) nextphrase() ;
}

function btl(ligne)
{
	// alert(ligne);

	document.forms.lyrics.elements.currentline.value = ligne;

	fieldname = 'starttime[' + ligne + '][0]';
	audio_player.currentTime = document.forms.lyrics.elements[fieldname].value / 1000;

	for(a = ligne ; a < textline.length ; a++)
	{
		if(a > ligne && document.getElementById('backtoline[' + a + ']')) document.getElementById('backtoline[' + a + ']').disabled = true;
		for(b = 0 ; b < textline[a].length ; b++)
		{
			textblock = eval("document.getElementById('phr[" + a + "][" + b + "]')") ;
			textblock.classList.remove("synced") ;

			fieldname = 'starttime[' + a + '][' + b + ']' ;
			document.forms.lyrics.elements[fieldname].value = null;
		}
	}
}

function generate()
{
	var d = new Date() ;

	lastgap = Math.max(1,d.getTime() - document.forms.lyrics.elements.songstarttime.value) ;

	if(document.getElementById("usename").checked == true && audio_player.src != '')
	{
		document.getElementsByName("ti")[0].value = escapeHtml(document.getElementsByName("songfilename")[0].value) ;
	}
	else document.getElementsByName("ti")[0].value = escapeHtml(document.getElementsByName("songtitle")[0].value) ;

	reinit() ;

	for(a = 0 ; a < textline.length ; a++)
	{
		for(b = 0 ; b < textline[a].length ; b++)
		{
			phrases_inp = '' ;
      document.forms.lyrics.elements['phrase[' + a + '][' + b + ']'].value = document.getElementById('phr[' + a + '][' + b + ']').innerHTML;
		}
	}

	document.forms.lyrics.action = 'get_file_4.php?lastgap=' + lastgap ;
	document.forms.lyrics.submit() ;

	// alert("The new LRC file will be transfered in your download folder.\nIf you like this website and think it's worth it, please consider donating !\n\nContact: support@lrcgenerator.com") ;
}

function reinit()
{
	if (typeof(c) != "undefined") clearTimeout(c) ;
	if (typeof(cd) != "undefined") clearTimeout(cd) ;

	audio_player.pause() ;
	audio_player.load() ;

  $("input[name=backtoline]").css("visibility","hidden");
	$("div#countdown select").removeAttr("disabled") ;
	$("#startbutton").removeClass("playing") ;
	$("#nextbutton").removeClass("check") ;
	document.getElementById("startbutton").childNodes[0].nodeValue = "START" ;
	document.getElementById("startbutton").disabled = false ;
	document.getElementById("startbutton").onclick = startsong ;
	document.getElementById("startbutton").focus() ;
	document.getElementById("nextbutton").onclick = nextphrase ;
	document.getElementById("nextbutton").childNodes[0].nodeValue = "Next Line" ;
	// document.getElementById("nextbutton").disabled = true ;
	// document.getElementById("generatebutton").disabled = true ;
	document.forms.lyrics.reset() ;
	document.forms.lyrics.currentline.value = 0 ;
	document.forms.lyrics.currentline.phrase = 0 ;
	document.getElementById("scrolllyrics").scrollTop = 0 ;
	for(a = 0 ; a < textline.length ; a++)
	{
		for(b = 0 ; b < textline[a].length ; b++)
		{
			textblock = eval("document.getElementById('phr[" + a + "][" + b + "]')") ;
			textblock.classList.remove("synced") ;
		}
	}
}
