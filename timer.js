const timeManager = require('./util/Database').firebase.database();
const ConsoleScreen = require('./util/ConsoleScreen');
var now = 0;

ConsoleScreen.TimerStartupScreen();
(function timer() {
    timeManager.ref().update({
        "time" : `${now}`
    });
    now++;
    if(now===1440-3) console.log('\n\t [SESSIONS DATA MAINTAINENCE] \n');
    if(now>=1440-2){
        let deleteKeys = [];
        timeManager.ref().child('sessions').orderByChild('isDeleted').equalTo(true)
        .on('child_added', child => {
            if(child.key!==null) deleteKeys.push(child.key);
        });
        try{
            if(deleteKeys!==null) {
                deleteKeys.forEach((key)=>{
                    console.log('[DELETE] Deleting spent session :: ', key);
                    timeManager.ref('sessions/' + key).remove();
                });
            }
        } catch(err) {
            console.log(err);
        }
    }
    if(now>=1440-1){
        let deleteKeys = [];
        timeManager.ref().child('sessions').orderByChild('activated').equalTo(true)
        .on('child_added', child => {
            if(child.key!==null) deleteKeys.push(child.key);
        });
        try{
            if(deleteKeys!==null) {
                deleteKeys.forEach((key)=>{
                    console.log('[DELETE] Deleting unattended session :: Error Prone :: ', key);
                    timeManager.ref('sessions/' + key).remove();
                });
            }
        } catch(err) {
            console.log(err);
        }
    }

    if(now>1440) now = 0;

    setTimeout(timer, 60000);
})();