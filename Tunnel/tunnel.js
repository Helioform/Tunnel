var w,h;
var c,ctx;
var pixels,imgdata;            
var texture=[];
var tw,th;
var distance=[];
var angle=[];
var tstart;
window.addEventListener('load', function()
{                     
    init();
    setInterval(draw,15);
});
        
function color(r,g,b)
{
    this.r=r;
    this.g=g;
    this.b=b;
}

function init()
{
    c=document.querySelector("canvas");
    ctx=c.getContext('2d');
    c.width=640;
    c.height=480;
    w=c.width;
    h=c.height;
    tw=256;
    th=256;
    for(i=0;i<tw;i++)
        texture[i]=new Array(th);
        
    initTexture();
    createBitwiseTexture();// create our weird texture
    for(i=0;i<w;i++)        
        distance[i]=new Array(h);
        
    createDistanceTable();// precompute distances
    
    for(i=0;i<w;i++)
        angle[i]=new Array(h);
    
    createAngleTable();//precompute angles
    tstart = 0;

}

function debugOutput(s1, s2)
{
   ctx.fillStyle="Red";
   ctx.font="20px Georgia";
   ctx.fillText("coordx:"+s1, 10, 30);
   ctx.fillText("coordy:"+s2, 10, 50);
}
function setPixel(x,y,r,g,b,a)
{    
    var index=(x+y*imgdata.width)*4;
    pixels[index]=r;
    pixels[index+1]=g;
    pixels[index+2]=b;
    pixels[index+3]=a;  
}

function createDistanceTable()
{
    var r = 30;
    
    for(x=0;x<w;x++)
    {
       for(y=0;y<h;y++)
       {
          var dx = (x - 0.5*w); // x delta from center of screen
          var dy = (y - 0.5*h); // y delta from center of screen    
          if(dx==0&&dy==0) // avoid division by 0
              distance[x][y]=0;
          else
              distance[x][y]= Math.floor((r*th / Math.sqrt(dx*dx+dy*dy)))%th;
       } 
    }
}

function createAngleTable()
{
    for(x=0;x<w;x++)
    {
       for(y=0;y<h;y++)
       {
          var dx = x-0.5*w;
          var dy = y-0.5*h;
          angle[x][y] = Math.abs(Math.floor((0.5*tw*Math.atan2(dy, dx)/Math.PI))); // atan2 returns the angle formed from center of screen given x, y coordinates
          
       } 
    }
    
}
function initTexture()
{
    for(i=0;i<tw;i++)
    {
       for(j=0;j<th;j++)
       {
          texture[i][j]=new color(128,128,28); 
       } 
    }
}

function createBitwiseTexture()
{
    for(i=0;i<tw;i++)
    {
       for(j=0;j<th;j++)
       {
          var c= i^j; 
          texture[i][j]=new color(c,1-c,1-c);
       } 
    }
}

function draw()
{    
    tstart=new Date();    
    imgdata=ctx.getImageData(0,0,w,h);
    pixels=imgdata.data;
    // how much do we shift per pixel animated
    var shx = Math.floor(tw + tstart*0.1); // movement speed
    var shy = Math.floor(th + 0.99 * tstart*0.1); // rotation speed
     
    for(x=0;x<w;x++)
    {
       for(y=0;y<h;y++)
       {        
          // get texture coordinates 
          var coordx = Math.abs(Math.floor((distance[x][y] + shx)))%tw;
          var coordy = Math.abs(Math.floor((angle[x][y] + shy)))%th;
              var r = texture[coordx][coordy].r;
              var g = texture[coordx][coordy].g;
              var b = texture[coordx][coordy].b;
              setPixel(x,y,r,g,b,128);
       } 
    }

    ctx.putImageData(imgdata,0,0);
}
    