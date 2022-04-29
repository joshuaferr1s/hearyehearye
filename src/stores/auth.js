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

const asyncForEach = async (arr, cb) => {
  for (let index = 0; index < arr.length; index++) {
    await cb(arr[index], index, arr);
  }
};
const TEAMS = [
  "A1", "A2", "A3", "A4", "A5", "A7", "A8", "A9", "A10", "A11",
  "B1", "B2", "B3", "B4", "B5", "B7", "B8", "B9", "B10", "B11",
  "C1", "C2", "C3", "C4", "C5", "C7", "C8", "C9", "C10", "C11",
  "D1", "D2", "D3", "D4", "D5", "D7", "D8", "D9", "D10", "D11",
  "E1", "E2", "E3", "E4", "E5", "E7", "E8", "E9", "E10", "E11",
  "F1", "F2", "F3", "F4", "F5", "F7", "F8", "F9", "F10", "F11",
  "G1", "G2", "G3", "G4", "G5", "G7", "G8", "G9", "G10", "G11",
  "H1", "H2", "H3", "H4", "H5", "H7", "H8", "H9", "H10", "H11",
  "I1", "I2", "I3", "I4", "I5", "I7", "I8", "I9", "I10", "I11",
  "J1", "J2", "J3", "J4", "J5", "J7", "J8", "J9", "J10", "J11",
  "K1", "K2", "K3", "K4", "K5", "K7", "K8", "K9", "K10", "K11",
];

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
    async exportToCSV() {
      console.log("Export to CSV action.");

      try {
        this.loading = true;
        toast.info("The export process could take up to a few minutes. Please do not refresh the page.");
        let csv = "Team,Judge Name,Q1,Q2,Q3,Q4,Comments\n";

        await asyncForEach(TEAMS, async (t) => {
          const tSnap = await getDocs(collection(db, "teams", t, "feedback"));
          tSnap.forEach(doc => {
            const data = doc.data();
            const toExport = [t, doc.id, data.q1, data.q2, data.q3, data.q4, data.comments]
            csv += toExport.join(",");
            csv += "\n";
          });
        });

        const anchor = document.createElement("a");
        anchor.href = "data:text/csv;charset=utf-8," + encodeURIComponent(csv);
        anchor.target = "_blank";
        anchor.download = "client_challenge_judge_feedback.csv";
        anchor.click();
        
      } catch (error) {
        toast.error("Error downloading results. Please try again shortly.");
        console.log("Export to CSV action encountered an error.");
        console.log(error);
      } finally {
        this.loading = false;
      }
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
    resetSelection() {
      this.team = null;
      this.feedback = [];
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
