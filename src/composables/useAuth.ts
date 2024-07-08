import { ref } from 'vue';
import { getAuth, signInWithEmailAndPassword, signInWithPopup, signOut } from 'firebase/auth';
import { GoogleAuthProvider } from 'firebase/auth/web-extension';
// import { auth } from '@/api/initApp';

// export const useAuth = () => {
//   const user = ref<any>(null);
//   // const user = ref<User | null>(null);
//   const error = ref<string | null>(null);

//   const login = async (email: string, password: string) => {
//     try {
//       const auth = getAuth();
//       const userCredential = await signInWithEmailAndPassword(auth, email, password);
//       user.value = userCredential.user;
//     } catch (err) {
//       error.value = (err as Error).message;
//     }
//   };

//   const logout = async () => {
//     try {
//       const auth = getAuth();
//       await signOut(auth);
//       user.value = null;
//     } catch (err) {
//       error.value = (err as Error).message;
//     }
//   };

//   return { user, error, login, logout };
// };

// export async function signInWithGoogle() {
//   const provider = new GoogleAuthProvider();
//   const result = await signInWithPopup(auth, provider);

//   console.log('user: ', result.user);
// }
