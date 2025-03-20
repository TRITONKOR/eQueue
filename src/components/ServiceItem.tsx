import { Button } from "@heroui/button";

interface Service {
    Description: string;
    ServiceCenterId: number;
    ServiceId: number;
    OrderWeight: number;
}

interface ServiceItemProps {
    service: Service;
    //onPress: (center: ServiceCenter) => void;
}

export const ServiceItem: React.FC<ServiceItemProps> = ({ service }) => {
    return (
        <Button
            className="w-full text-lg text-center px-6 py-4 min-h-20 whitespace-normal"
            color="primary"
        >
            {service.Description}
        </Button>
    );
};
