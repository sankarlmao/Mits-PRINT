import { getOrdersFromServer } from "../../../services/customer.service"
    export const getMyOrders = async () => {

     const orders =  await getOrdersFromServer()


     console.log(orders.orders)
     return orders.orders;

    };