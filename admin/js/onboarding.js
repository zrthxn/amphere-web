function generateSignupQueryURL(query) {
    return (
        `rname=${encodeURI(query.r_name)}&` +
        `name=${encodeURI(query._name)}&` +
        `phone=${encodeURI(query.phone)}&` +
        `email=${encodeURI(query.email)}&` +
        `comments=${encodeURI(query.comments)}&` +
        `address=${encodeURI(query.address)}`
    );
}

function validateInputs(rname, name, phone, email, address) {
    if(rname!=="" && name!=="" && phone!=="" && email!=="" && address!==""){
        if(/^\d+$/.test(phone) && phone.length <= 12 && phone.length >= 8) {
            return true;
        } else return ("phone");
    } else return ("empty");
}