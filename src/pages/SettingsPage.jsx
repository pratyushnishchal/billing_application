import Header from "../components/common/Header";
// import DangerZone from "../components/settings/DangerZone";
import Profile from "../components/settings/Profile";
import CustomerSetting from "../components/settings/CustomerSetting";
import AccountantProfile from "../components/settings/AccountantProfile";
// import Security from "../components/settings/Security";

const SettingsPage = () => {
	const userType = window.localStorage.getItem("userType");
// const navigate = useNavigate();

	return (
		<div className='flex-1 overflow-auto relative bg-gray-900'>
			<Header title='Settings' />
			<main className='max-w-4xl py-6 px-4 lg:px-8'>
				{userType === "ROLE_ADMIN" ? (
				<Profile />
				):null}
				{userType === "ROLE_ACCOUNTANT" ? (
				<AccountantProfile />
				):null}
				{userType === "ROLE_CUSTOMER" ? (
				<CustomerSetting />
				):null}
				{/* <Security /> */}
			</main>
		</div>
	);
};
export default SettingsPage;
