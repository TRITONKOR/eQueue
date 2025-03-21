import { Button } from "@heroui/button";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ServiceItem } from "../../components/ServiceItem";
import { useServiceCenter } from "../../context/ServiceCenterContext";
import { useService } from "../../context/ServiceContext";

interface Service {
    Description: string;
    ServiceCenterId: number;
    ServiceId: number;
    OrderWeight: number;
}

export const ServicesPage: React.FC = () => {
    const { selectedCenter } = useServiceCenter();
    const { setSelectedService } = useService();
    const [services, setServices] = useState<Service[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (selectedCenter === null) {
            navigate("/serviceCenters");
        }

        console.log("rendered services");

        axios
            .get(
                `/api/QueueService.svc/json_pre_reg_https/GetServiceList?organisationGuid={4c750754-aa83-410c-8a7f-55d71233380a}&serviceCenterId=${selectedCenter?.ServiceCenterId}`
            )
            .then((response) => {
                const data = response.data;
                if (data && Array.isArray(data.d)) {
                    setServices(data.d);
                } else {
                    console.error("Services not found or 'd' is not an array");
                }
            })
            .catch((error) => {
                console.error("Error fetching services:", error);
            });
    }, []);

    return (
        <div className="container w-full gap-6 p-6">
            <h1 className="text-2xl font-bold text-center">
                Будь ласка, оберіть необхідну послугу
            </h1>

            <div className="w-full h-[70vh] overflow-y-auto flex flex-wrap gap-5 px-6 justify-center">
                {services.map((service: Service) => (
                    <ServiceItem
                        key={service.ServiceId}
                        service={service}
                        onPress={setSelectedService}
                    />
                ))}
            </div>

            <Button
                className="w-3/4 lg:w-1/2 mt-6 min-h-20 text-xl"
                color="primary"
                onPress={() => navigate("/serviceCenters")}
            >
                Повернутися назад
            </Button>
        </div>
    );
};
