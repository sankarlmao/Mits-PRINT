"use server"
import { deleteSingleFileFromMinio } from "@/lib/deleteFromMinIO";


export async function deleteFile(fileUrl){

    await deleteSingleFileFromMinio(fileUrl);
}
