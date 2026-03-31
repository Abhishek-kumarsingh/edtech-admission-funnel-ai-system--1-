import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  addDoc, 
  query, 
  where, 
  onSnapshot,
  FirestoreError
} from 'firebase/firestore';
import { db, auth } from './firebase';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export const getLead = async (leadId: string) => {
  try {
    const docRef = doc(db, 'leads', leadId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() : null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, `leads/${leadId}`);
  }
};

export const saveLead = async (leadData: any) => {
  try {
    const leadRef = doc(collection(db, 'leads'));
    await setDoc(leadRef, { ...leadData, id: leadRef.id, createdAt: new Date().toISOString() });
    return leadRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, 'leads');
  }
};

export const updateLeadStatus = async (leadId: string, status: string) => {
  try {
    const docRef = doc(db, 'leads', leadId);
    await updateDoc(docRef, { status });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `leads/${leadId}`);
  }
};

export const saveConversation = async (userId: string, messages: any[], stage: string) => {
  try {
    const convRef = doc(collection(db, 'conversations'));
    await setDoc(convRef, { 
      id: convRef.id, 
      userId, 
      messages, 
      stage, 
      updatedAt: new Date().toISOString() 
    });
    return convRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, 'conversations');
  }
};

export const saveScholarship = async (userId: string, marks: number, percentage: number) => {
  try {
    const schRef = doc(collection(db, 'scholarships'));
    await setDoc(schRef, { 
      id: schRef.id, 
      userId, 
      marks, 
      percentage 
    });
    return schRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, 'scholarships');
  }
};
