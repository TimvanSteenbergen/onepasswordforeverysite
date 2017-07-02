

let key = window.crypto.subtle.generateKey(
    {
        name: "AES-CBC",
        length: 256, //can be  128, 192, or 256
    },
    false, //whether the key is extractable (i.e. can be used in exportKey)
    ["encrypt", "decrypt"] //can be "encrypt", "decrypt", "wrapKey", or "unwrapKey"
)
    .then(function(key){
        //returns a key object
        console.log(key);
    });

let userDataEncrypted =
    window.crypto.subtle.encrypt(
        {
            name: "AES-CBC",
            //Don't re-use initialization vectors!
            //Always generate a new iv every time your encrypt!
            iv: window.crypto.getRandomValues(new Uint8Array(16)),
        },
        key, //from generateKey or importKey above
        userData //ArrayBuffer of data you want to encrypt
    )
        .then(function(encrypted){
            //returns an ArrayBuffer containing the encrypted data
            console.log(new Uint8Array(encrypted));
        })
        .catch(function(err){
            console.error(err);
        });