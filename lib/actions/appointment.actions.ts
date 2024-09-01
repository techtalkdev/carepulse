"use server"; 

import { ID, Query } from "node-appwrite";
import { APPOINTMENT_COLLECTION_ID, DATABASE_ID, databases } from "../appwrite.config";
import { parseStringify } from "../utils";
import { Appointment } from "@/types/appwrite.types";


export const createAppointment = async (appointment : CreateAppointmentParams ) => {
    try {
        const newAppointment = await databases.createDocument(
            DATABASE_ID!,
            APPOINTMENT_COLLECTION_ID!,
            ID.unique(),
            appointment
        )  
        return parseStringify(newAppointment); 
    } catch (error) {
        console.log(error);
        
    }
} 

export const getAppointment = async (appointmentId : string) => {
    try {
        const appointment = await databases.getDocument(
            DATABASE_ID!,
            APPOINTMENT_COLLECTION_ID!,
            appointmentId, 
        )

        return parseStringify(appointment); 
    } catch (error) {
        console.log(error);
    }
 }  

 export const getRecentAppointmentList = async () => {
    try {
        const appointments = await databases.listDocuments(
            DATABASE_ID!,
            APPOINTMENT_COLLECTION_ID!,
            [Query.orderDesc('$createdAt')]
        );

        const initialCounts = {
            scheduledCount: 0,
            pendingCount: 0,
            cancelledCount: 0,
        }

        const counts = (appointments.documents as Appointment[]).reduce((acc, appointment) => {
              switch (appointment.status) {
                case "scheduled":
                  acc.scheduledCount++;
                  break;
                case "pending":
                  acc.pendingCount++;
                  break;
                case "cancelled":
                  acc.cancelledCount++;
                  break;
              }
              return acc;
            }, initialCounts); 

        const data = {
            totalCount: appointments.total,
            ...counts,
            documents: appointments.documents
        } 

        return parseStringify(data); 
        
    } catch (error) {
        console.log(error);
    }
 }   