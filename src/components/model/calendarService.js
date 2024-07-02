// src/components/model/calendarService.js
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../db/firebase';

const reservationsCollection = collection(db, 'reservations');

export const addReservation = async (reservation) => {
  try {
    const docRef = await addDoc(reservationsCollection, reservation);
    return { id: docRef.id, ...reservation }; // Retorna el documento con su id
  } catch (e) {
    console.error('Error adding reservation: ', e);
  }
};

export const getReservations = async () => {
  try {
    const querySnapshot = await getDocs(reservationsCollection);
    return querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
  } catch (e) {
    console.error('Error getting reservations: ', e);
    return [];
  }
};

export const updateReservation = async (updatedEvent) => {
  try {
    const eventDoc = doc(db, 'reservations', updatedEvent.id); // Referencia correcta al documento
    await updateDoc(eventDoc, updatedEvent);
  } catch (e) {
    console.error('Error updating reservation: ', e);
  }
};

export const deleteReservation = async (id) => {
  try {
    const eventDoc = doc(db, 'reservations', id); // Referencia correcta al documento
    await deleteDoc(eventDoc);
  } catch (e) {
    console.error('Error deleting reservation: ', e);
  }
};
