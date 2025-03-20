import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ServiceCenterProvider } from "./context/ServiceCenterContext";
import { GreetingLayout } from "./layouts/GreetingLayout";
import { ProfileLayout } from "./layouts/ProfileLayout";
import { ServiceCentersLayout } from "./layouts/ServiceCentersLayout";
import { ServicesLayout } from "./layouts/ServicesLayout";
function App() {
    return (
        <ServiceCenterProvider>
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
                    <Route path="*" element={<div>404</div>} />
                </Routes>
            </BrowserRouter>
        </ServiceCenterProvider>
    );
}

export default App;
