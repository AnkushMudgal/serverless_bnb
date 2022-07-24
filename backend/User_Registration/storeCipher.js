const Firestore = require('@google-cloud/firestore');
const projectId = 'serverlessprojects22';
const collection = 'user-cipher';
const firestore = new Firestore({
  projectId: projectId,
  timestampsInSnapshots: true
});
exports.storeCipher = (req, res) => {
    res.set('Access-Control-Allow-Origin', "*")
    res.set('Access-Control-Allow-Methods',"*");
    res.set('Access-Control-Allow-Headers', "*");
    if (req.method === 'OPTIONS') {
      res.set('Access-Control-Allow-Methods', "*");
      res.set('Access-Control-Allow-Origin', "*")
      res.set('Access-Control-Allow-Headers', 'Content-Type');
      res.set('Access-Control-Max-Age', '3600');
      res.status(204).send();
    }
    const data = (req.body)
    const email = data.email_id
    const cipher = data.cipher
    const logged_in = data.logged_in
    return firestore.collection(collection).doc(email).set({
        cipher,
        logged_in
    }).then(document => {
         return res.status(200).send(document)
    }).catch(err => {
      console.error(err);
      return res.status(500).send({
        error: 'Failed to update the table',
        err
      });
    })
};
