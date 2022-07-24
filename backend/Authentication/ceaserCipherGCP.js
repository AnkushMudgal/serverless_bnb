 const Firestore = require('@google-cloud/firestore');
 const projectId = 'serverlessprojects22';
 const collection = 'user-cipher';
 const firestore = new Firestore({
   projectId: projectId,
   timestampsInSnapshots: true
 });
 exports.ceaserCipher = (req, res) => {
    res.set('Access-Control-Allow-Origin', "*")
   res.set('Access-Control-Allow-Methods',"*");
   res.set('Access-Control-Allow-Headers', "*");
    if (req.method === 'OPTIONS') {
     // Send response to OPTIONS requests
     res.set('Access-Control-Allow-Methods', 'GET');
     res.set('Access-Control-Allow-Headers', 'Content-Type');
     res.set('Access-Control-Max-Age', '3600');
     res.status(204).send('');
   } else {
     const path = req.path;
     switch(path) {
         case '/generateEncryptedCode':
             const message = generateEncryptedCipher();
             res.status(200).send(message);
             break;
         case '/decryptCipher':
             const alphabets = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
             var randomKey;
             var decryptedCipher = '';
            const encryptedCipher = req.body.encryptedCode;
            const decryptedText = req.body.decryptedCode;
            let matched = false;
            return firestore.collection(collection).doc(req.body.emailID).get().then((doc) => {
                if (doc.exists) {
                    console.log("Document data:", doc.data().cipher);
                    randomKey = doc.data().cipher
                    console.log("randomKey: ", randomKey);
                    for (var i = 0; i < encryptedCipher.length; ++i) {
                        var index = alphabets.indexOf(encryptedCipher[i]) - randomKey;
                        if (index < 0) {
                            index = index + 26;
                        }
                        decryptedCipher = decryptedCipher + alphabets[index];
                    }
                    if(decryptedText === decryptedCipher)
                    {
                        matched = true;
                    }
                    return res.status(200).send({
                        status: 200,
                        mactched: matched
                    });
                } 
            });
         break;
         default: 
         res.status(200).send('Server is working');
   }
   }
 };
 
 const generateEncryptedCipher = () => {
     const charString = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
     const length = 5;
     var result = '';
     for (var i = length; i > 0; --i) {
         result += charString[Math.floor(Math.random() * charString.length)];
     }
     console.log("generateEncryptedCipher - " + result);
     return result;
 }