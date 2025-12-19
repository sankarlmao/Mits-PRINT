import { Suspense } from "react";
import MyPrintsClient from "../../../components/MyPrintsClient";
import { getServerSession } from "next-auth";
import { getMyOrders } from "./action";
import CircleLoader from "../../../components/CircleLoader";

export default async function  MyPrintsPage({searchParams}) {


  const data = await getMyOrders();

    
  return (


    <Suspense fallback={<CircleLoader/>}>
        <MyPrintsClient data={data}/>
    </Suspense>
  );
}
