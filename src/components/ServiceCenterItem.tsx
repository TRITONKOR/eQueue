import { Button } from "@heroui/button";
import { useNavigate } from "react-router-dom";

interface ServiceCenter {
    BranchName: string;
    ServiceCenterId: number;
    ServiceCenterName: string;
    LocationName: string;
}

interface ServiceCenterItemProps {
    serviceCenter: ServiceCenter;
    onPress: (center: ServiceCenter) => void;
}

export const ServiceCenterItem: React.FC<ServiceCenterItemProps> = ({
    serviceCenter,
    onPress,
}) => {
    const navigate = useNavigate();

    const handleClick = () => {
        onPress(serviceCenter);
        navigate("/servicesAndGroups");
    };

    return (
        <Button
            className="w-full text-lg text-center px-6 py-4 min-h-20 whitespace-normal"
            color="primary"
            onPress={handleClick}
        >
            {serviceCenter.ServiceCenterName}
        </Button>
    );
};
