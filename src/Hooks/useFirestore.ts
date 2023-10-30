import firebase from '@react-native-firebase/app';
import '@react-native-firebase/firestore';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useEffect, useState} from 'react';
import {userData} from '@/Types';
import {MESSAGES} from '@/Constant';
import {delay, errorMessage, successMessage} from '@/Component/commonFunctions';
export default function useFirestore(type: string) {
  const db = firebase.firestore();
  const usersCollection = db.collection(type === 'auth' ? 'users' : 'sessions');

  // Use local state for userId
  const [userId, setUserId] = useState<string | null>('');

  // Initialize the user and userDocument when authentication is ready
  const initializeUser = async () => {
    console.log('initializeuser');
    let data: string | null = await AsyncStorage.getItem('userUid');
    const user: FirebaseAuthTypes.User | null = auth().currentUser;
    if (data) {
      setUserId(data);
    } else {
      setUserId(user?.uid!);
    }
  };

  useEffect(() => {
    initializeUser();
  }, []);

  // Create a new user during OTP verification
  async function createNewUser({uid, mobile}: {uid: string; mobile: string}) {
    setUserId(uid);
    const userDocument = usersCollection.doc(uid);
    const userData: userData = {
      name: '',
      email: '',
      mobile: mobile,
      dob: '',
      weight: '',
      height: '',
      gender: '',
      // @ts-ignore
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      // @ts-ignore
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
    };
    try {
      const docSnapshot = await userDocument.get();
      if (!docSnapshot.exists) {
        await userDocument.set(userData);
        console.log('User document created successfully');
        getUser(uid);
      } else {
        console.log('A user with the same credentials already exists');
        getUser(uid);
      }
    } catch (error) {
      console.error('Error creating user document: ', error);
      errorMessage({message: MESSAGES.ERROR});
    }
  }

  // Update user data
  async function updateData(data: object) {
    const dataToUpdate = {
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      ...data,
    };
    try {
      await usersCollection.doc(userId!).update(dataToUpdate);
      console.log('User document updated successfully');
      successMessage({message: MESSAGES.SAVE_DATA});
    } catch (error) {
      console.error('Error updating user document: ', error);
      errorMessage({message: MESSAGES.ERROR_UPDATEDATA});
    }
  }

  // Get user's data
  const [user, setUser] = useState<userData | null>(null);
  async function getUser(uid: string) {
    const usersCollection = db.collection('users');
    try {
      const doc = await usersCollection.doc(uid).get();
      if (doc.exists) {
        const userData: userData = doc.data() as userData;
        setUser(userData);
      } else {
        console.log('User not found');
      }
    } catch (error) {
      console.log('Error while fetching user data:', error);
    }
  }
  useEffect(() => {
    if (userId) {
      getUser(userId);
    }
  }, [userId]);

  // Create a session
  async function createSession(data: object | any) {
    const sessionCollection = usersCollection
      .doc(userId!)
      .collection(data?.sessionType == '0' ? 'batting' : 'balling')
      .doc(data?.createdAt);
    const dataToUpdate = {
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid: userId,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      sessionName: data?.sessionName,
      sessionTime: '',
    };
    try {
      await sessionCollection.set(dataToUpdate);
      console.log('Session document created successfully');
    } catch (error) {
      console.error('Error creating session document: ', error);
    }
  }

  // Update session data
  async function updateSession(data: object | any, type: string) {
    const sessionCollection = usersCollection
      .doc(userId!)
      .collection(type == '0' ? 'batting' : 'balling')
      .doc(data?.createdAt);
    let dataToUpdate: object;
    if (Object.keys(data?.balls).length > 0) {
      dataToUpdate = {
        balls: firebase.firestore.FieldValue.arrayUnion(data?.balls),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
        sessionTime: data?.sessionTime || '',
      };
    } else {
      dataToUpdate = {
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
        sessionTime: data?.sessionTime || '',
      };
    }
    try {
      await sessionCollection.update(dataToUpdate);
      console.log('Session document updated successfully');
    } catch (error) {
      console.error('Error updating session document: ', error);
    }
  }

  // Retrieve session data
  const [sessionData, setSessionData] = useState<object | any>({});
  async function getSessionData(type: string, createdAt: string) {
    const sessionCollection = usersCollection
      .doc(userId!)
      .collection(type == '0' ? 'batting' : 'balling');
    try {
      const doc = await sessionCollection.doc(createdAt).get();
      if (doc.exists) {
        setSessionData(doc.data());
      } else {
        console.log('Session not found');
      }
    } catch (error) {
      console.log('Error while fetching session data:', error);
    }
  }

  // Get dashboard data
  const [dashboardData, setDashboardData] = useState<Array<object>>([]);
  async function getDashboardData(docID: string, type: string) {
    try {
      const querySnapshot = await usersCollection
        .doc(docID)
        .collection(type)
        .get();
      const data = querySnapshot.docs.map(doc => doc.data());
      setDashboardData(data);
    } catch (error) {
      console.log('Error occurred while getting data:', error);
    }
  }

  // Get dashboard data
  const getDashboard = async (docId: string, type: string) => {
    try {
      const battingQuery = await usersCollection
        .doc(docId)
        .collection(type)
        .get();
      return battingQuery;
    } catch (error) {
      console.log('Error occurred while getting data:', error);
    }
  };

  return {
    createNewUser,
    updateData,
    createSession,
    updateSession,
    getSessionData,
    sessionData,
    user,
    dashboardData,
    usersCollection,
    userId,
    getDashboard,
    getDashboardData,
  };
}
