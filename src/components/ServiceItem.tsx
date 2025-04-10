import { Button } from "@heroui/button";
import { useNavigate } from "react-router-dom";

interface Service {
    Description: string;
    ServiceCenterId: number;
    ServiceId: number;
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
            className="w-full text-base sm:text-xl tracking-tight text-center px-6 py-6 h-auto min-h-20 whitespace-normal break-words max-w-full"
            color="primary"
            onPress={handleClick}
        >
            {service.Description}
        </Button>
    );
};
