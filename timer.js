const timeManager = require('./util/Database').firebase.database().ref();
var now = 0;

(function timer() {
    timeManager.update({
        "time" : `${now}`
    });
    now++;
    
    //CHECK SESSIONS FOR ACTIVE SESSIONS
    //
    if(now>720){
        now = 0;
    }
    setTimeout(timer, 1000);
})();