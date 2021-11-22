let lastX = 0;
let lastY = 0;
let lastZ = 0;

let lastTime = new Date();

let shaking = false;
let timer = null;

const options = {
  threshold: 15
};


if ('Accelerometer' in window) {
  try {
    const acc = new Accelerometer({ frequency: 60 });
    /*acc.addEventListener("reading", function(){
 
    })*/
    acc.onreading = () => {
      const deltaX = Math.abs(lastX - acc.x);
      const deltaY = Math.abs(lastY - acc.y);
      const deltaZ = Math.abs(lastZ - acc.z);

      if (((deltaX > options.threshold) && (deltaY > options.threshold)) ||
        ((deltaX > options.threshold) && (deltaZ > options.threshold)) ||
        ((deltaY > options.threshold) && (deltaZ > options.threshold))
      ) {
        if (!shaking) {
          console.log('shake');
          shaking = true;
          document.body.style.backgroundColor = "red";
          if (timer) {
            clearTimeout(timer);
            timer = null;
          }
        }
      } else {
        if (shaking) {
          shaking = false;
          //document.body.style.backgroundColor = "white";
          timer = setTimeout(() => {
            console.log("stop");
            document.body.style.backgroundColor = "white";
          }, 500);
        }
      }

      lastX = acc.x;
      lastY = acc.y;
      lastZ = acc.z;

    }

    acc.start();
  } catch (err) {
    console.log(err);
  }
}