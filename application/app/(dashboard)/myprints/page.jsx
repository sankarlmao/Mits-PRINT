
import { Suspense } from "react";
import MyPrintsClient from "../../../components/MyPrintsClient";
import { getServerSession } from "next-auth";
import { getMyOrders } from "./action";
import CircleLoader from "../../../components/CircleLoader";

export default async function  MyPrintsPage() {


  const data = await getMyOrders();

    
  return (


    <Suspense>
        <MyPrintsClient data={data}/>
    </Suspense>
  );
}
