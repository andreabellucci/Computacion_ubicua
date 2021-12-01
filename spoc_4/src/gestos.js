useEffect(() => {
    // configureGestures();
  }, []);

  function configureGestures() {
    // touch control block
    let start_x = 0;
    let end_x = 0;
    let start_time = 0;
    let start_hold;
    const TIME_SLIDE_THRESHOLD = 500; // Timer for Slide action
    const SPACE_THRESHOLD = 100;

    document.body.addEventListener("touchstart", function (e) {
      e.preventDefault();
      start_x = e.targetTouches[0].screenX;
      start_time = e.timeStamp;

      // if you keep your finger at the task, it will be erased two seconds after
      start_hold = setTimeout(function () {
        var target_task = e.changedTouches[0];
        // extract the index of the selected task
        var task_index = target_task.target.id.match(/\d+/)[0];
        done(task_index);
      }, 2000);

    }, { passive: false });

    document.body.addEventListener("touchmove", function (e) {
      e.preventDefault();
      end_x = e.changedTouches[0].screenX;
    }, { passive: false });

    document.body.addEventListener("touchend", function (e) {

      // clear the timeout that activates hold action
      clearTimeout(start_hold);

      e.preventDefault();
      let end_time = e.timeStamp;

      // If this sentence is true, that means you've performed a SLIDE action
      if (end_time - start_time < TIME_SLIDE_THRESHOLD && end_x - start_x > SPACE_THRESHOLD) {
        var target_task = e.changedTouches[0];
        // extract the index of the selected task
        var task_index = target_task.target.id.match(/\d+/)[0];
        remove(task_index);
      }
    });
  }


