// Get the canvas element with the id "Canvas"
var c = document.getElementById("Canvas");
// Get the 2D rendering context for the canvas
var ctx = c.getContext("2d")

// Initialize variables for canvas width, canvas height, arrays to store shells and passes, and an array of colors
var cwidth, cheight;
var shells = [];
var pass = [];

var colors = ['#ff5252','#ff4081','#e040fb','#7c4dff','#53dff','#40cdff','#18ffff','#64ffda','#69f0ae','b2fff59']

// Trigger the reset function on window resize
window.onresize = function() { reset();}

// Initialize the canvas dimensions
reset();
// Reset function to set canvas dimensions based on window size
function reset(){
    cwidth = window.innerWidth;
    cheight = window.innerHeight;
    c.width = cwidth;
    c.height = cheight;
}

// Function to create a new shell with random properties
function newShell(){
    // Randomly determine if the shell should be on the left side
    var left = (Math.random() > 0.5);
    var shell = {};
    shell.x = (1*left);
    shell.y = 1;
    shell.xoff = (0.01 + Math.random() * 0.007) * (left ? 1: -1);
    shell.yoff = 0.01 + Math.random() * 0.007;
    shell.size = Math.random() * 6 + 3;
    shell.color = colors[Math.floor(Math.random() * colors.length )];

    // Add the new shell to the array
    shells.push(shell);
}

// Function to create new passes based on a given shell
function newPass(shell) {
    var pasCount = Math.ceil(Math.pow(shell.size, 2) * Math.PI);

    for (i = 0; i < pasCount; i++){

        var pas = {};
        pas.x = shell.x * cwidth;
        pas.y = shell.y * cheight;

        var a = Math.random() * 4;
        var s = Math.random() * 10;

        pas.xoff = s * Math.sin((5 - a) * (Math.PI / 2));
        pas.yoff = s * Math.sin(a * (Math.PI / 2));

        pas.color = shell.color;
        pas.size = Math.sqrt(shell.size); 

        if ( pass.length < 1000 ){
            pass.push(pas);
        }
    }
}

// Initialize variables for tracking the last run time and start the animation loop
var lastRun = 0;
Run();

// Animation loop
function Run() {
    var dt = 1;
    if (lastRun != 0) {
        dt = Math.min(50, (performance.now() - lastRun));
    }
    lastRun = performance.now();

    // Clear the canvas with a semi-transparent black background
    ctx.fillStyle = "rgba(0,0,0,0.25)";
    ctx.fillRect(0,0,cwidth,cheight);

    // Create new shells randomly and draw existing shells
    if ((shells.length < 10) && (Math.random() > 0.96)) {
        newShell();
    }

    for (let ix in shells){
        var shell = shells[ix];

        // Draw a circle for the shell
        ctx.beginPath();
        ctx.arc(shell.x * cwidth, shell.y * cheight, shell.size, 0, 2 * Math.PI);
        ctx.fillStyle = shell.color;
        ctx.fill();

        // Update shell position and velocity
        shell.x -= shell.xoff;
        shell.y -= shell.yoff;
        shell.xoff -= (shell.xoff * dt * 0.001);
        shell.yoff -= ((shell.yoff + 0.2) * dt * 0.00005);

        // If the shell is below a certain vertical velocity, create new passes and remove the shell
        if(shell.yoff < -0.005) {
            newPass(shell);
            shells.splice(ix, 1);
        }
    }

    // Draw and update passes, remove passes that are off-screen or have faded out
    for (let ix in pass) {
        var pas = pass[ix];

        // Draw a circle for the pass
        ctx.beginPath();
        ctx.arc(pas.x, pas.y, pas.size, 0, 2 * Math.PI);
        ctx.fillStyle = pas.color;
        ctx.fill();

        // Update pass position, velocity, and size
        pas.x -= pas.xoff;
        pas.y -= pas.yoff;
        pas.xoff -= (pas.xoff * dt * 0.001);
        pas.yoff -= ((pas.yoff + 5) * dt * 0.00005);
        pas.size -= (dt * 0.002 * Math.random());

        // Remove passes that are off-screen or have faded out
        if ((pas.y > cheight) || (pas.y < -50) || (pas.size <= 0)){
            pass.splice(ix, 1);
        }
    }
    // Request the next animation frame
    requestAnimationFrame(Run);
}

