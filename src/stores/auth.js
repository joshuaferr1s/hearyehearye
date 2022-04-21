import { defineStore } from "pinia";
import {
  getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged,
  GoogleAuthProvider, signInWithPopup
} from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { firebaseApp } from "../firebase";
import router from "../router";

const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);
const provider = new GoogleAuthProvider();
provider.setCustomParameters({
  prompt: "select_account",
});

export const useAuthStore = defineStore({
  id: "auth",
  state: () => ({
    authenticating: false,
    user: null,
    unauthorized: false,
  }),
  actions: {
    initializeAuthListener() {
      return new Promise((resolve) => {
        onAuthStateChanged(auth, async user => {
          if (user) {
            const docRef = doc(db, "users", user.email);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
              const data = docSnap.data();
              this.user = {
                email: user.email,
                type: data.type,
              };
              if (data.type == "student") {
                router.push({ name: "Student" });
              } else if (data.type == "instructor") {
                router.push({ name: "Instructor" });
              } else {
                router.push({ name: "Judge" });
              }
            } else {
              console.log("Invalid user attempting to log in.");
              this.unauthorized = true;
              this.user = null;
              this.logout()
              router.push({ name: "Unauthorized" });
            }
          } else {
            this.user = null;
          }

          resolve(true);
        });
      });
    },
    async loginEP(email, password) {
      console.log("Log in with Email action.");

      try {
        this.authenticating = true;
        this.unauthorized = false;

        const { user } = signInWithEmailAndPassword(auth, email, password);
        // get status from firestore (team, judge, or instructor)
        // set user state
      } catch (error) {
        console.log("Log in with Email action encountered an error.");
        console.log(error);
      } finally {
        this.authenticating = false;
      }
    },
    async loginG() {
      console.log("Log in with Google action.");
      try {
        this.authenticating = true;
        this.unauthorized = false;

        const { user } = await signInWithPopup(auth, provider);
      } catch (error) {
        console.log("Log in with Google action encountered an error.");
        console.log(error);
      } finally {
        this.authenticating = false;
      }
    },
    async logout() {
      console.log("Log out action.");

      try {
        this.authenticating = true;

        await signOut(auth);
        router.push({ name: "Login" });
      } catch (error) {
        console.log("Log out action encountered an error.");
        console.log(error);
      } finally {
        this.authenticating = false;
      }
    },
  }
})
