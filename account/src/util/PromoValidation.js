export default function validatePromoCode (code) {
    if(code === "AMP"){
        return true;
    } else if(code==="") {
        return null;
    } else {
        return false;
    }
}

/*
THIS FILE WILL USE THE      fetch()     METHOD POST A REQUEST TO GET DATA FROM THE EXPRESS JS ROUTER 
ON THE BACKEND WHICH WILL HAVE ROUTES FOR THE URL THAT THIS METHOD POSTS TO. THOSE ROUTES WILL HAVE
FUNCTIONS THAT GET DATA FROM THE        FIREBASE        DB AND RESPOND WITH DATA + 200OK.

*/
