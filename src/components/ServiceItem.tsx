import { Button } from "@heroui/button";
import { useNavigate } from "react-router-dom";

interface Service {
    Description: string;
    ServiceCenterId: number;
    ServiceId: number;
    OrderWeight: number;
}

interface ServiceItemProps {
    service: Service;
    onPress: (center: Service) => void;
}

export const ServiceItem: React.FC<ServiceItemProps> = ({
    service,
    onPress,
}) => {
    const navigate = useNavigate();

    const handleClick = () => {
        onPress(service);
        navigate("/services");
    };

    return (
        <Button
            className="w-full text-lg text-center px-6 py-6 min-h-[100px] h-auto whitespace-normal break-words"
            color="primary"
            onPress={handleClick}
        >
            {service.Description}
        </Button>
    );
};
