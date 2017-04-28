/*
var x_center = 50; //0 in both x_center and y_center will place the center
var y_center = 50; // at the top left of the browser
var resolution_step = 360; //how many times to stop along the circle to plot your character.
var radius = 50; //how big ya want your circle?
var plot_character = "·"; //could use any character here, try letters/words for cool effects
var div_top_offset=10;
var div_left_offset=10;
var x,y;

var rosco = "";
var rosco_DOM = document.getElementById("rosco");

for ( var angle_theta = 0;  angle_theta < 2 * Math.PI;  angle_theta += 2 * Math.PI/resolution_step ){
    x = x_center + radius * Math.cos(angle_theta);
    y = y_center - radius * Math.sin(angle_theta);
    rosco += "<div style='position:absolute;top:" + (y+div_top_offset) + ";left:"+ (x+div_left_offset) + "'>" + plot_character + "</div>";
}

rosco_DOM.innerHTML = rosco;
*/