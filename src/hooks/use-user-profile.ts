'use client';

import { useDoc, useFirestore, useUser, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import type { UserProfile, UserProfileHookResult } from '@/lib/definitions';

/**
 * Hook to fetch the current user's profile from Firestore.
 * @returns {UserProfileHookResult} Object with profile, isLoading, error.
 */
export function useUserProfile(): UserProfileHookResult {
  const firestore = useFirestore();
  const { user } = useUser(); // Get the authenticated user from Firebase Auth

  // Memoize the document reference to prevent re-renders
  const userProfileRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);

  const {
    data: profile,
    isLoading,
    error,
  } = useDoc<UserProfile>(userProfileRef);

  return { profile, isLoading, error };
}
