const CleanupWorker = require('./Database').firebase.database();

(function cleaup() {
    console.log('\n\t [SESSIONS DATA MAINTAINENCE] \n');
    console.log('\n\t        :: CLEANUP ::         \n');

    let deleteKeys = [];
    CleanupWorker.ref().child('sessions').orderByChild('isDeleted').equalTo(true)
    .on('child_added', child => {
        try{
            if(child.key!==null) {
                console.log('[DELETE] Deleting spent session :: ', child.key);
                CleanupWorker.ref('sessions/' + child.key).remove();
            }
        } catch(err) {
            console.log(err);
        }
    });
})();