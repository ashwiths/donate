import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, updateDoc, doc } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "dummy",
    authDomain: "heal-and-play-49d9f.firebaseapp.com",
    projectId: "heal-and-play-49d9f",
    storageBucket: "heal-and-play-49d9f.firebasestorage.app",
    messagingSenderId: "123",
    appId: "123"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function run() {
  console.log('Migrating...');
  let count = 0;
  
  const cSnap = await getDocs(collection(db, 'contributions'));
  for (const c of cSnap.docs) {
    const data = c.data();
    if (data.childName === 'Baby Aarav' || data.beneficiaryName === 'Baby Aarav') {
      await updateDoc(doc(db, 'contributions', c.id), { childName: 'Janamithra', beneficiaryName: 'Janamithra' });
      count++;
    }
  }

  const certSnap = await getDocs(collection(db, 'certificates'));
  for (const c of certSnap.docs) {
    const data = c.data();
    if (data.childName === 'Baby Aarav') {
      await updateDoc(doc(db, 'certificates', c.id), { childName: 'Janamithra' });
      count++;
    }
  }

  const actSnap = await getDocs(collection(db, 'activities'));
  for (const a of actSnap.docs) {
    const data = a.data();
    if (data.text && data.text.includes('Aarav')) {
      await updateDoc(doc(db, 'activities', a.id), { 
        text: data.text.replace(/Baby Aarav/g, 'Janamithra').replace(/Aarav/g, 'Janamithra')
      });
      count++;
    }
  }
  
  console.log('Migrated docs:', count);
}
run().catch(console.error);
