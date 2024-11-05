import React from 'react';
import Header from "../components/common/Header";
import OrderHistory from "../components/orders/OrderHistory";
import OverviewPage from './OverviewPage';

const OrderHistoryPage = ({ customerId }) => {
    const userType = window.localStorage.getItem("userType");

    return (
        <div>
            {userType === "ROLE_CUSTOMER" ? (
                <>
                    <Header title='Orders History' />
                    <br />
                    <OrderHistory customerId={customerId} />
                </>
            ) : <OverviewPage />}
        </div>
    );
};

export default OrderHistoryPage;
