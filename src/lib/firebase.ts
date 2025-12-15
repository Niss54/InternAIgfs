import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, User, RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyBQhbVO3VQsyxGsakpnoA07yK00cqcm-zg",
  authDomain: "superbase-login-bb399.firebaseapp.com",
  projectId: "superbase-login-bb399",
  storageBucket: "superbase-login-bb399.firebasestorage.app",
  messagingSenderId: "402030997917",
  appId: "1:402030997917:web:83d2cb9d6aa86f199fff74",
  measurementId: "G-CYGTLXYNTH"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const analytics = getAnalytics(app);

const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async (): Promise<{ user: User | null; error: any }> => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return { user: result.user, error: null };
  } catch (error: any) {
    return { user: null, error };
  }
};

// Phone authentication functions
export const sendOTP = async (phoneNumber: string): Promise<{ confirmationResult: ConfirmationResult | null; error: any }> => {
  try {
    const recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
      size: 'invisible',
      callback: () => {
        console.log('reCAPTCHA solved');
      }
    });

    const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
    return { confirmationResult, error: null };
  } catch (error: any) {
    return { confirmationResult: null, error };
  }
};

export const verifyOTP = async (confirmationResult: ConfirmationResult, otp: string): Promise<{ user: User | null; error: any }> => {
  try {
    const result = await confirmationResult.confirm(otp);
    return { user: result.user, error: null };
  } catch (error: any) {
    return { user: null, error };
  }
};