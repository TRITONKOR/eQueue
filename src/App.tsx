import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ServiceCenterProvider } from "./context/ServiceCenterContext";
import { ServiceProvider } from "./context/ServiceContext";
import { UserProvider } from "./context/UserContext";
import { GreetingLayout } from "./layouts/GreetingLayout";
import { ProfileLayout } from "./layouts/ProfileLayout";
import { RegistrationLayout } from "./layouts/RegistrationLayout";
import { ServiceCentersLayout } from "./layouts/ServiceCentersLayout";
import { ServicesLayout } from "./layouts/ServicesLayout";
function App() {
    return (
        <UserProvider>
            <ServiceCenterProvider>
                <ServiceProvider>
                    <BrowserRouter>
                        <Routes>
                            <Route path="/" element={<GreetingLayout />} />
                            <Route path="profile" element={<ProfileLayout />} />
                            <Route
                                path="serviceCenters"
                                element={<ServiceCentersLayout />}
                            />
                            <Route
                                path="servicesAndGroups"
                                element={<ServicesLayout />}
                            />
                            <Route
                                path="services"
                                element={<RegistrationLayout />}
                            />
                            <Route path="*" element={<div>404</div>} />
                        </Routes>
                    </BrowserRouter>
                </ServiceProvider>
            </ServiceCenterProvider>
        </UserProvider>
    );
}

export default App;
