const timeManager = require('./util/Database').firebase.database().ref();
const ConsoleScreen = require('./util/ConsoleScreen');
var now = 0;

// timeManager.child('time').on('value', _time => {
//     now = _time.val();
//     console.log("INIT "+now);
//     timeManager.off();
// });

ConsoleScreen.TimerStartupScreen();

(function timer() {
    timeManager.update({
        "time" : `${now}`
    });   
    console.log(now);
    now++;
    
    if(now>720){
        timeManager.child('sessions').orderByChild('expired').equalTo('false')
        .on('child_added', active => {
            if(active===null){        
                now = 0;
            }
        });
    }
    setTimeout(timer, 1000);
})();