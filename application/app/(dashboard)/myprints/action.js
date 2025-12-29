import { getOrdersFromServer } from "../../../services/customer.service"
    export const getMyOrders = async () => {

     const orders =  await getOrdersFromServer()


     return orders.orders;

    };