import admin from "firebase-admin";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(), 
  });
}

const auth = admin.auth();

export const verifyFirebaseToken = async (idToken: string) => {
  try {
    const decoded = await auth.verifyIdToken(idToken);
    return decoded; 
  } catch (err) {
    throw new Error("Invalid Firebase token");
  }
};
