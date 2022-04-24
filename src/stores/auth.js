import { defineStore } from "pinia";
import {
  getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged,
  GoogleAuthProvider, signInWithPopup
} from "firebase/auth";
import { getFirestore, doc, getDoc, collection, getDocs, setDoc, updateDoc } from "firebase/firestore";
import { useToast } from "vue-toastification";
import { firebaseApp } from "../firebase";
import router from "../router";

const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);
const provider = new GoogleAuthProvider();
provider.setCustomParameters({
  prompt: "select_account",
});
const toast = useToast();

export const useAuthStore = defineStore({
  id: "auth",
  state: () => ({
    authenticating: false,
    loading: false,
    user: null,
    unauthorized: false,
    team: null,
    feedbackID: null,
    judging: null,
    feedback: [],
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
                team: data.team,
                name: data.name,
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
    clearJudgingTeam() {
      this.team = "";
      this.feedbackID = null;
      this.judging = null;
    },
    async submitTeamFeedback() {
      console.log("Submit team feedback action.");

      try {
        this.loading = true;

        if (!this.feedbackID) {
          // Create new document for feedback
          await setDoc(doc(db, "teams", this.team.team, "feedback", this.user.name), this.judging);
        } else {
          // Update existing document with values
          await updateDoc(doc(db, "teams", this.team.team, "feedback", this.user.name), this.judging);
        }
        toast.success(`Successfully submitted feedback for team ${this.team.team}`);
        this.clearJudgingTeam();
      } catch (error) {
        toast.error("Error submitting team feedback. Please try again shortly.");
        console.log("Submit team feedback action encountered an error.");
        console.log(error);
      } finally {
        this.loading = false;
      }
    },
    async selectTeam(team) {
      console.log("Selecting team action.");

      try {
        this.loading = true;
        this.team = "";
        this.feedbackID = null;
        this.judging = null;

        const teamRef = doc(db, "teams", team);
        const teamSnap = await getDoc(teamRef)
        if (teamSnap.exists()) {
          this.team = {
            team,
            ...teamSnap.data()
          };
          // Get current judge's feedback
          const fbRef = doc(db, "teams", team, "feedback", this.user.name);
          const fbSnap = await getDoc(fbRef);

          if (fbSnap.exists()) {
            this.feedbackID = fbSnap.id;
            this.judging = fbSnap.data();
          } else {
            this.feedbackID = null;
            this.judging = {
              q1: null,
              q2: null,
              q3: null,
              q4: null,
              comments: "",
            };
          }
        } else {
          toast.error(`Team ${team} does not exist in the databse.`);
        }
      } catch (error) {
        toast.error("Error retrieving team information. Please try again shortly.");
        console.log("Selecting team action encountered an error.");
        console.log(error);
      } finally {
        this.loading = false;
      }
    },
    async getTeamFeedback(team) {
      console.log("Fetching team feedback action.");

      try {
        this.loading = true;
        this.feedback = [];

        // Get team information
        const docRef = doc(db, "teams", team);
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
          this.team = docSnap.data();
          // Get Feedback if there is any
          const subColRef = collection(db, "teams", team, "feedback");
          const qSnap = await getDocs(subColRef)
          this.feedback = qSnap.docs.map(d => ({ judge: d.id, ...d.data() }));
        }
      } catch (error) {
        console.log(error);
      } finally {
        this.loading = false;
      }
    },
    async loginEP(email, password) {
      console.log("Log in with Email action.");

      try {
        this.authenticating = true;
        this.unauthorized = false;

        await signInWithEmailAndPassword(auth, email, password);
      } catch (error) {
        if (error.code == "auth/wrong-password" || error.code == "auth/user-not-found") {
          toast.error("Incorrect email and or password. Please try again.");
        } else {
          toast.error("Error logging you in. Please try again shortly.");
          console.log("Log in with Email action encountered an error.");
          console.log(error);
        }
      } finally {
        this.authenticating = false;
      }
    },
    async loginG() {
      console.log("Log in with Google action.");
      try {
        this.authenticating = true;
        this.unauthorized = false;

        await signInWithPopup(auth, provider);
      } catch (error) {
        if (error.code != "auth/popup-closed-by-user") {
          toast.error("Error logging you in. Please try again shortly.");
          console.log("Log in with Google action encountered an error.");
          console.log(error);
        }
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
        toast.error("Error logging you out. Please try again shortly.");
        console.log("Log out action encountered an error.");
        console.log(error);
      } finally {
        this.authenticating = false;
      }
    },
  }
})
