
import { prisma } from "../prisma";

export async function findUserByEmailAndPassword (email,password){

    const user = await prisma.student.findUnique({
        where:{email:email, password:password}
    })

    return user;
}