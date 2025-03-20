import { createContext, ReactNode, useContext, useState } from "react";

interface ServiceCenter {
    ServiceCenterId: number;
    ServiceCenterName: string;
    BranchName: string;
    LocationName: string;
}

interface ServiceCenterContextType {
    selectedCenter: ServiceCenter | null;
    setSelectedCenter: (center: ServiceCenter) => void;
}

const ServiceCenterContext = createContext<
    ServiceCenterContextType | undefined
>(undefined);

export const ServiceCenterProvider = ({
    children,
}: {
    children: ReactNode;
}) => {
    const [selectedCenter, setSelectedCenter] = useState<ServiceCenter | null>(
        null
    );

    return (
        <ServiceCenterContext.Provider
            value={{ selectedCenter, setSelectedCenter }}
        >
            {children}
        </ServiceCenterContext.Provider>
    );
};

export const useServiceCenter = () => {
    const context = useContext(ServiceCenterContext);
    if (!context) {
        throw new Error(
            "useServiceCenter must be used within a ServiceCenterProvider"
        );
    }
    return context;
};
