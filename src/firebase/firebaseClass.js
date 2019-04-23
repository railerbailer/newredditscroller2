import app from "firebase/app";
import "firebase/auth";
import "firebase/database";

const config = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID
};
class Firebase {
  constructor() {
    app.initializeApp(config);
    this.auth = app.auth();
    this.db = app.database();
  }

  // authUser = () => {
  //   this.auth.onAuthStateChanged(function(user) {
  //     if (user) {
  //       console.log("if", user);
  //       return user;
  //     } else {
  //       console.log("else", user);
  //       return user;
  //     }
  //   });
  // };

  // *** DB API ***
  replaceFieldsToUser = fields => {
    if (!this.db.ref(this.auth.currentUser.uid)) {
      this.db.ref().set({ [this.auth.currentUser.uid]: {} });
    } else {
      this.db.ref(this.auth.currentUser.uid).set({ ...fields });
    }
  };
  pushFeedback = string => {
    this.db.ref(`feedback/messages`).push(string);
  };
  setDataToCollection = (data, collection, uid) => {
    this.db.ref(`users/${uid}/collections/${collection}`).set(data);
  };
  updateCollectionToPublic = fields => {
    this.db.ref(`public/collections/${this.auth.currentUser.uid}`).update(fields);
  };
  pushCollectionToPublic = fields => {
    this.db.ref(`public/collections/${this.auth.currentUser.uid}`).push(fields);
  };
  pushDataToCollection = (fields, collection) => {
    this.db.ref(`users/${this.auth.currentUser.uid}/collections/${collection}`).push(fields);
  };
  updateDataToCollection = (fields, collection) => {
    this.db.ref(`users/${this.auth.currentUser.uid}/collections/${collection}`).update(fields);
  };

  removeCollection = collection => {
    this.db.ref(`users/${this.auth.currentUser.uid}/collections/${collection}`).remove();
  };

  updateDataOnUser = (fieldsToUpdate, data) => {
    if (!this.db.ref(this.auth.currentUser.uid)) {
      this.db.ref().set({ [this.auth.currentUser.uid]: {} });
    } else {
      this.db.ref(`users/${this.auth.currentUser.uid}/${fieldsToUpdate}`).update({ ...data });
    }
  };

  readDataOnUser = async userId => {
    let val;
    await this.db.ref(`users/${userId}`).on("value", function(snapshot) {
      val = snapshot.val();
    });
    return val;
  };

  // *** Auth API ***
  // create user
  userId = () => this.auth.currentUser && this.auth.currentUser.uid;
  userEmail = () => this.auth.currentUser && this.auth.currentUser.email;

  doCreateUserWithEmailAndPassword = async (email, password, userName) => {
    await this.auth.createUserWithEmailAndPassword(email, password);
    userName && this.auth.currentUser.updateProfile({ displayName: userName });
    this.db.ref(`users/${this.auth.currentUser.uid}/collections/${["Favorites"]}`).set("set at creation");
  };
  // sign in with user
  doSignInWithEmailAndPassword = (email, password) => this.auth.signInWithEmailAndPassword(email, password);
  // sign out with user
  doSignOut = () => this.auth.signOut();
  // send reset password email
  doPasswordReset = email => this.auth.sendPasswordResetEmail(email);
  // update the actual pwd
  doPasswordUpdate = password => this.auth.currentUser.updatePassword(password);
}

export default Firebase;
