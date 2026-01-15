"use server"
import {  deleteSingleFileFromGCS } from "../../lib/deleteFromGCS"


export async function deleteFile(fileUrl){

    await deleteSingleFileFromGCS(fileUrl);
}
