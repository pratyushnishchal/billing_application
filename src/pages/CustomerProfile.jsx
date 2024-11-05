import React from 'react';
import CustomerOrdersTable from '../components/orders/CustomerOrdersTable';
import Header from "../components/common/Header";
import OverviewPage from './OverviewPage';

const CustomerProfile = ({ customerId }) => {
    const userType = window.localStorage.getItem("userType");

    return (
        <div>
            {userType === "ROLE_CUSTOMER" ? (
                <>
                    <Header title='Your Orders' />
                    <br />
                    <CustomerOrdersTable customerId={customerId} />
                </>
            ) : <OverviewPage />}
        </div>
    );
};

export default CustomerProfile;
