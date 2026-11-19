import {
  doc,
  onSnapshot,
  runTransaction,
  serverTimestamp,
  type Unsubscribe,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';

const STATS_COLLECTION = 'siteStats';
const OVERVIEW_DOC_ID = 'overview';
const OVERVIEW_PATH = `${STATS_COLLECTION}/${OVERVIEW_DOC_ID}`;
const SESSION_KEY = 'tno_visit_recorded';

export async function recordWebsiteVisit(): Promise<number> {
  const statsRef = doc(db, STATS_COLLECTION, OVERVIEW_DOC_ID);
  try {
    let alreadyCounted = false;
    try {
      alreadyCounted = window.sessionStorage.getItem(SESSION_KEY) === '1';
    } catch {
      alreadyCounted = false;
    }

    if (alreadyCounted) {
      return await runTransaction(db, async (tx) => {
        const snap = await tx.get(statsRef);
        if (!snap.exists()) {
          tx.set(statsRef, {
            totalVisits: 1,
            updatedAt: serverTimestamp(),
          });
          return 1;
        }
        const current = snap.data().totalVisits;
        return typeof current === 'number' ? current : 1;
      });
    }

    const updatedCount = await runTransaction(db, async (tx) => {
      const snap = await tx.get(statsRef);
      if (!snap.exists()) {
        tx.set(statsRef, {
          totalVisits: 1,
          updatedAt: serverTimestamp(),
        });
        return 1;
      }
      const prev = snap.data().totalVisits;
      const currentInt = typeof prev === 'number' && Number.isInteger(prev) ? prev : 0;
      const next = currentInt + 1;
      tx.update(statsRef, {
        totalVisits: next,
        updatedAt: serverTimestamp(),
      });
      return next;
    });

    try {
      window.sessionStorage.setItem(SESSION_KEY, '1');
    } catch {
      // Ignore storage access restrictions
    }

    return updatedCount;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, OVERVIEW_PATH);
  }
}

export function subscribeWebsiteVisits(
  onUpdate: (count: number) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  const statsRef = doc(db, STATS_COLLECTION, OVERVIEW_DOC_ID);
  return onSnapshot(
    statsRef,
    (snapshot) => {
      if (!snapshot.exists()) return;
      const value = snapshot.data().totalVisits;
      if (typeof value === 'number') {
        onUpdate(value);
      }
    },
    (error) => {
      try {
        handleFirestoreError(error, OperationType.GET, OVERVIEW_PATH);
      } catch (wrapped) {
        if (onError && wrapped instanceof Error) {
          onError(wrapped);
        }
      }
    }
  );
}
