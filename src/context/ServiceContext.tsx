import { createContext, ReactNode, useContext, useState } from "react";

interface Service {
    Description: string;
    ServiceCenterId: number;
    ServiceId: number;
    OrderWeight: number;
}

interface ServiceContextType {
    selectedService: Service | null;
    setSelectedService: (service: Service) => void;
}

const ServiceContext = createContext<ServiceContextType | undefined>(undefined);

export const ServiceProvider = ({ children }: { children: ReactNode }) => {
    const [selectedService, setSelectedService] = useState<Service | null>(
        null
    );

    return (
        <ServiceContext.Provider
            value={{ selectedService, setSelectedService }}
        >
            {children}
        </ServiceContext.Provider>
    );
};

export const useService = () => {
    const context = useContext(ServiceContext);
    if (!context) {
        throw new Error("useService must be used within a ServiceProvider");
    }
    return context;
};
