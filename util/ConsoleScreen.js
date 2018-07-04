exports.StartupScreen = function (info){
    console.log('\n');
    console.log("\t           - - = = A M P H E R E = = - -          ");
    console.log("\t--------------------------------------------------");
    console.log("\tSERVER ============== SERVER ============== SERVER");
    console.log("\t--------------------------------------------------");
    console.log('\n');

    if(info.ServerState==="NORMAL"){
        console.log(`\t    ---=== [INITIALIZING] : PORT ${info.PORT} ===---    `);
    } else {
        console.log("\t[UNABLE TO START] SORRY, This server is under maintainence!");
        console.log("\n- - - = = = [PROCESS TERMINATED] = = = - - -\n");
    }
    
    console.log('\n');
}