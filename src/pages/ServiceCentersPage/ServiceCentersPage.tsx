import { Button } from "@heroui/button";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ServiceCenterItem } from "../../components/ServiceCenterItem";
import { useServiceCenter } from "../../context/ServiceCenterContext";
import { useUser } from "../../context/UserContext";
import "./serviceCentersPage.scss";

interface ServiceCenter {
    BranchName: string;
    ServiceCenterId: number;
    ServiceCenterName: string;
    LocationName: string;
}

export const ServiceCentersPage: React.FC = () => {
    const { userProfile } = useUser();
    const [centers, setCenters] = useState<ServiceCenter[]>([]);
    const { setSelectedCenter } = useServiceCenter();
    const navigate = useNavigate();

    useEffect(() => {
        console.log("rendered center");
        console.log(userProfile);

        axios
            .get(
                `/api/QueueService.svc/json_pre_reg_https/getServiceCenterList?organisationGuid={4c750754-aa83-410c-8a7f-55d71233380a}`
            )
            .then((response) => {
                const data = response.data;
                if (data && Array.isArray(data.d)) {
                    setCenters(data.d);
                } else {
                    console.error(
                        "ServiceCenters not found or 'd' is not an array"
                    );
                }
            })
            .catch((error) => {
                console.error("Error fetching service centers:", error);
            });
    }, []);

    return (
        <div className="container w-full flex flex-col items-center justify-center gap-6 p-4">
            <h1 className="text-2xl font-bold text-center">Попередній запис</h1>

            <p className="text-center ">
                Будь ласка, оберіть ЦНАП, або його територіальний підрозділ
            </p>

            <div className="flex flex-col items-center w-full gap-4">
                {centers.map((center: ServiceCenter) => (
                    <ServiceCenterItem
                        key={center.ServiceCenterId}
                        serviceCenter={center}
                        onPress={setSelectedCenter}
                    />
                ))}
            </div>

            <Button
                className="w-3/4 md:w-1/2 mt-6 min-h-20 text-lg"
                color="primary"
                onPress={() => navigate("/profile")}
            >
                Повернутися назад
            </Button>
        </div>
    );
};
