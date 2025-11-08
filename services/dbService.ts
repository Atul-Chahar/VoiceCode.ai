
import { 
    doc, 
    getDoc, 
    setDoc, 
    collection, 
    getDocs, 
    updateDoc, 
    deleteDoc 
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { CourseProgress } from '../types';
import { INITIAL_PROGRESS } from '../constants';

// Define a standard User Profile interface for Firestore
export interface UserProfile {
    uid: string;
    name: string;
    email: string;
    createdAt?: string;
    [key: string]: any; // Allow for flexible additional fields
}

export const dbService = {
    // --- Standard CRUD for 'users' collection ---

    // 1. Create (or overwrite) a generic user document
    async createUser(userId: string, userData: { name: string; email: string }): Promise<void> {
        try {
            // Use setDoc with merge: true to avoid accidental overwrites of existing subcollections if called later
            await setDoc(doc(db, 'users', userId), {
                uid: userId,
                name: userData.name,
                email: userData.email,
                createdAt: new Date().toISOString()
            }, { merge: true });
        } catch (error) {
            console.error("Error creating user:", error);
            throw error;
        }
    },

    // 2. Retrieve all documents from 'users' collection
    async getAllUsers(): Promise<UserProfile[]> {
        try {
            const querySnapshot = await getDocs(collection(db, 'users'));
            const users: UserProfile[] = [];
            querySnapshot.forEach((doc) => {
                users.push(doc.data() as UserProfile);
            });
            return users;
        } catch (error) {
            console.error("Error getting all users:", error);
            throw error;
        }
    },

    // 3. Update a specific user document
    async updateUser(userId: string, data: Partial<UserProfile>): Promise<void> {
        try {
            const userRef = doc(db, 'users', userId);
            await updateDoc(userRef, data);
        } catch (error) {
            console.error("Error updating user:", error);
            throw error;
        }
    },

    // 4. Delete a specific user document
    async deleteUser(userId: string): Promise<void> {
        try {
            await deleteDoc(doc(db, 'users', userId));
        } catch (error) {
            console.error("Error deleting user:", error);
            throw error;
        }
    },

    // --- Existing App-Specific Methods ---

    async getUserProgress(userId: string, courseId: string): Promise<CourseProgress> {
        try {
            const docRef = doc(db, 'users', userId, 'progress', courseId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                return docSnap.data() as CourseProgress;
            } else {
                return INITIAL_PROGRESS;
            }
        } catch (error) {
            console.error("Error fetching progress:", error);
            return INITIAL_PROGRESS;
        }
    },

    async saveUserProgress(userId: string, courseId: string, progress: CourseProgress): Promise<void> {
        try {
            const docRef = doc(db, 'users', userId, 'progress', courseId);
            await setDoc(docRef, progress, { merge: true });
        } catch (error) {
            console.error("Error saving progress:", error);
            throw error;
        }
    },

    async getUserNotes(userId: string): Promise<string> {
        try {
            const docRef = doc(db, 'users', userId, 'data', 'notes');
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                return docSnap.data().content || '';
            }
            return '';
        } catch (error) {
            console.error("Error fetching notes:", error);
            return '';
        }
    },

    async saveUserNotes(userId: string, content: string): Promise<void> {
         try {
            const docRef = doc(db, 'users', userId, 'data', 'notes');
            await setDoc(docRef, { content }, { merge: true });
        } catch (error) {
            console.error("Error saving notes:", error);
             throw error;
        }
    }
};
