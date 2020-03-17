var colours = {
'primary-colour': null,
'primary-dark': null,
'action-colour': null,
'action-colour-light': null,
'action-colour-dark': null,
'acrylic-dark': null,
'acrylic-light': null,
};

var mousePos = {x: 0, y: 0};

$(window).on('mousedown', function(e){
	mousePos.x = e.pageX;
	mousePos.y = e.pageY;
});

var names = Object.keys(colours)

for(var colour of names)
{
	var tr = document.createElement('tr');
	$('#colourTable').append($(tr));

	var td = document.createElement('td');
	$(tr).append($(td));
	td.innerHTML = '<p>'+ colour +'</p>';

	var td = document.createElement('td');
	$(tr).append($(td));
	td.colour = '#ff0000';
	td.innerHTML = '<div class="colourDisplay" id="'+ colour +'-display" style="background: '+ td.colour +'"></div>';
	var col = td;

	var td = document.createElement('td');
	$(tr).append($(td));
	td.colour = col;
	td.innerHTML = '<button type="button" class="copyButton" onclick="copyContent(this)">copy</button>';
}

function copyContent(e, event)
{
	var str = e.parentElement.colour.colour;
	const el = document.createElement('textarea');
	el.value = str;
	document.body.appendChild(el);
	el.select();
	document.execCommand('copy');
	document.body.removeChild(el);

	var tmp = document.createElement('div');
	tmp.innerHTML = '<p>Copied to clipboard</p>'
	$(tmp).css({
		position: 'absolute',
		left: mousePos.x,
		top: mousePos.y,
		width: 'auto', height: 'auto',
		background: 'white',
		border: '1px solid black',
		'border-radius':'3px',
	});
	document.body.appendChild(tmp);
	setTimeout(function(){$(tmp).remove()}, 500);
}

var input = document.getElementById('input');
var baseColour = input.value;
input.onchange = function(){

	baseColour = /#?(\w+)/.exec(input.value)[1];
	baseColour = hexToRgb(baseColour);
	var white = {r: 255, g: 255, b: 255};	

	while(contrast(baseColour, white) < 3)
	{
		baseColour = RGBtoHSV(baseColour);
		if(baseColour.s < 0.6)		
			baseColour.s += 0.02;
		else
			baseColour.v -= 0.02;
		baseColour = HSVtoRGB(baseColour);
	}

	//set primary colour
	colours['primary-colour'] = rgbToHex(baseColour);	
	$('#' + names[0] + '-display').css({background: colours['primary-colour']});
	document.getElementById(names[0] + '-display').innerHTML = '<p class="centeredText">'+ colours['primary-colour'] +'</p>';
	document.getElementById(names[0] + '-display').parentElement.colour = colours['primary-colour'];

	//set primary dark
	var primaryDark = hexToRgb(colours['primary-colour']);
	primaryDark = RGBtoHSV(primaryDark);
	primaryDark.v *= 0.4;
	primaryDark = HSVtoRGB(primaryDark);

	colours['primary-dark'] = rgbToHex(primaryDark);
	$('#' + names[1] + '-display').css({background: colours['primary-dark']});
	document.getElementById(names[1] + '-display').innerHTML = '<p class="centeredText">'+ colours['primary-dark'] +'</p>';
	document.getElementById(names[1] + '-display').parentElement.colour = colours['primary-dark'];


	//get action colour
	var action = hexToRgb(colours['primary-colour']);
	action = RGBtoHSV(action);
	var h = Math.round(action.h * 360);
	var oppH = h - 180;
	if(oppH < 0)
	{
		oppH = 360 + oppH;
	}

	//move 25 degrees towards 180 or 0
	console.log(oppH);

	//convert back to HSV
	oppH = Math.round(oppH/360);
	action.h = oppH;

	//check brightness
	if(action.v >= .9)	
		action.v *= 0.92;	

	//check saturation
	action.s = Math.max(action.s, 0.6);

	//convert to rgb
	var newAction = HSVtoRGB(action);

	colours['action-colour'] = rgbToHex(newAction);
	$('#' + names[2] + '-display').css({background: colours['action-colour']});
	document.getElementById(names[2] + '-display').innerHTML = '<p class="centeredText">'+ colours['action-colour'] +'</p>';
	document.getElementById(names[2] + '-display').parentElement.colour = colours['action-colour'];


	//set action colour light
	var tmp = {h: action.h, s: action.s, v: action.v};
	tmp.v *= 1.13;
	tmp = HSVtoRGB(tmp);

	colours['action-colour-light'] = rgbToHex(tmp);
	$('#' + names[3] + '-display').css({background: colours['action-colour-light']});
	document.getElementById(names[3] + '-display').innerHTML = '<p class="centeredText">'+ colours['action-colour-light'] +'</p>';
	document.getElementById(names[3] + '-display').parentElement.colour = colours['action-colour-light'];

	//set action colour dark
	var tmp = {h: action.h, s: action.s, v: action.v};
	tmp.v *= 0.87;
	tmp = HSVtoRGB(tmp);

	colours['action-colour-dark'] = rgbToHex(tmp);
	$('#' + names[4] + '-display').css({background: colours['action-colour-dark']});
	document.getElementById(names[4] + '-display').innerHTML = '<p class="centeredText">'+ colours['action-colour-dark'] +'</p>';
	document.getElementById(names[4] + '-display').parentElement.colour = colours['action-colour-dark'];


	//set acrylic-dark
	var acrylicDark = hexToRgb(colours['primary-colour']);
	acrylicDark = RGBtoHSV(acrylicDark);
	acrylicDark.s = 0.15;
	acrylicDark.v = 0.4;
	acrylicDark = HSVtoRGB(acrylicDark);

	while(contrast(acrylicDark, white) < 3)
	{
		acrylicDark = RGBtoHSV(acrylicDark);
		acrylicDark.v -= 0.02;
		acrylicDark = HSVtoRGB(acrylicDark);
	}

	colours['acrylic-dark'] = 'rgba('+ acrylicDark.r +', '+ acrylicDark.g +', '+ acrylicDark.b +', 0.8)';
	$('#' + names[5] + '-display').css({background: colours['acrylic-dark']});
	document.getElementById(names[5] + '-display').innerHTML = '<p class="centeredText">'+ colours['acrylic-dark'] +'</p>';
	document.getElementById(names[5] + '-display').parentElement.colour = colours['acrylic-dark'];

	//set acrylic-light
	var acrylicLight = hexToRgb(colours['primary-colour']);
	acrylicLight = RGBtoHSV(acrylicLight);
	acrylicLight.s = 0.15;
	acrylicLight.v = 0.4;
	acrylicLight = HSVtoRGB(acrylicLight);

	var primaryDark = hexToRgb(colours['primary-dark']);

	while(contrast(acrylicLight, primaryDark) < 3)
	{
		acrylicLight = RGBtoHSV(acrylicLight);
		acrylicLight.v += 0.02;
		acrylicLight = HSVtoRGB(acrylicLight);
	}

	colours['acrylic-light'] = 'rgba('+ acrylicLight.r +', '+ acrylicLight.g +', '+ acrylicLight.b +', 0.8)';
	$('#' + names[6] + '-display').css({background: colours['acrylic-light']});
	document.getElementById(names[6] + '-display').innerHTML = '<p class="centeredText" style="color: '+ colours['primary-dark'] +'">'+ colours['acrylic-light'] +'</p>';
	document.getElementById(names[6] + '-display').parentElement.colour = colours['acrylic-light'];
};

function luminanace(colour) {

	var r = colour.r;
	var g = colour.g;
	var b = colour.b;


    var a = [r, g, b].map(function (v) {
        v /= 255;
        return v <= 0.03928
            ? v / 12.92
            : Math.pow( (v + 0.055) / 1.055, 2.4 );
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

function contrast(colour1, colour2) {
    var lum1 = luminanace(colour1);
    var lum2 = luminanace(colour2);
    var brightest = Math.max(lum1, lum2);
    var darkest = Math.min(lum1, lum2);
    return (brightest + 0.05)
         / (darkest + 0.05);
}

function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

function rgbToHex(colour) { 

	var r = Number(colour.r).toString(16);
	if (r.length < 2) {
		r = "0" + r;
	}
	var g = Number(colour.g).toString(16);
	if (g.length < 2) {
		g = "0" + g;
	}
	var b = Number(colour.b).toString(16);
	if (b.length < 2) {
		b = "0" + b;
	}

	return ('#' + r + g + b);
}

function HSVtoRGB(h, s, v) {
    var r, g, b, i, f, p, q, t;
    if (arguments.length === 1) {
        s = h.s, v = h.v, h = h.h;
    }
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }
    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255)
    };
}

function RGBtoHSV(r, g, b) {
    if (arguments.length === 1) {
        g = r.g, b = r.b, r = r.r;
    }
    var max = Math.max(r, g, b), min = Math.min(r, g, b),
        d = max - min,
        h,
        s = (max === 0 ? 0 : d / max),
        v = max / 255;

    switch (max) {
        case min: h = 0; break;
        case r: h = (g - b) + d * (g < b ? 6: 0); h /= 6 * d; break;
        case g: h = (b - r) + d * 2; h /= 6 * d; break;
        case b: h = (r - g) + d * 4; h /= 6 * d; break;
    }

    return {
        h: h,
        s: s,
        v: v
    };
}

function radsToDegs(rads)
{
	return rads * (180/Math.PI);
}