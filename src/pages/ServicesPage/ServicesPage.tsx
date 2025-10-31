import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Spinner } from "@heroui/spinner";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    getAllServices,
    getGroups,
    getServices,
    type Service,
    type ServiceGroup,
} from "../../api/cnapApi";
import { GroupItem } from "../../components/GroupItem";
import { ServiceItem } from "../../components/ServiceItem";
import { useServiceCenter } from "../../context/ServiceCenterContext";
import { useService } from "../../context/ServiceContext";

export const ServicesPage: React.FC = () => {
    const { selectedCenter } = useServiceCenter();
    const { setSelectedService } = useService();

    const [services, setServices] = useState<Service[]>([]);
    const [groups, setGroups] = useState<ServiceGroup[]>([]);
    const [selectedGroup, setSelectedGroup] = useState<ServiceGroup | null>(
        null
    );
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);

    const navigate = useNavigate();

    const [missingServices, setMissingServices] = useState<Service[]>([]);

    useEffect(() => {
        if (!selectedCenter) {
            navigate("/serviceCenters");
            return;
        }

        fetchGroups();
        fetchAllServices();
    }, [navigate, selectedCenter]);

    const fetchAllServices = async () => {
        if (!selectedCenter) return;
        try {
            const allServices = await getAllServices(
                selectedCenter.ServiceCenterId
            );
            setServices(allServices);
        } catch (error) {
            console.error("Error fetching all services:", error);
        }
    };

    const fetchGroups = async () => {
        const missingGroupId = 0;

        if (!selectedCenter) return;
        setLoading(true);
        try {
            const serviceGroups = await getGroups(
                selectedCenter.ServiceCenterId
            );

            setGroups(serviceGroups);

            if (selectedCenter.ServiceCenterId === 1) {
                const missingGroupServices = await getServices(
                    selectedCenter.ServiceCenterId,
                    missingGroupId
                );

                setMissingServices(missingGroupServices);
            }
            setGroups(serviceGroups);
        } catch (error) {
            console.error("Error fetching groups:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchServices = async (groupId: number) => {
        if (!selectedCenter) return;
        setLoading(true);
        try {
            const groupServices = await getServices(
                selectedCenter.ServiceCenterId,
                groupId
            );
            setServices(groupServices);
        } catch (error) {
            console.error("Error fetching services:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleGroupSelect = (group: ServiceGroup) => {
        setSelectedGroup(group);
        fetchServices(group.GroupId);
    };

    const filteredServices = services.filter((service) =>
        service.Description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="container-primary max-w-4xl mx-auto px-4 sm:px-6 py-8">
            {loading ? (
                <div className="flex flex-col items-center justify-center h-64">
                    <Spinner size="lg" label="Завантаження..." />
                </div>
            ) : (
                <>
                    <div className="text-center mb-10">
                        <h1 className="h1-primary mb-4">
                            {selectedGroup || searchQuery
                                ? "Оберіть послугу"
                                : "Оберіть групу послуг"}
                        </h1>
                        <p className="text-xl text-gray-600">
                            {selectedCenter?.ServiceCenterName}
                        </p>
                    </div>

                    <div className="mb-8 w-full max-w-md mx-auto">
                        <Input
                            type="search"
                            placeholder="Пошук послуг..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full mx-auto"
                            size="lg"
                            classNames={{
                                input: "form-input__field",
                                inputWrapper: "form-input__wrapper",
                            }}
                        />
                    </div>

                    {!searchQuery && !selectedGroup && (
                        <div className="grid gap-4 mb-8 grid-cols-1 sm:grid-cols-2">
                            {groups.map((group) => (
                                <GroupItem
                                    key={`group-${group.GroupId}`}
                                    group={group}
                                    onPress={handleGroupSelect}
                                />
                            ))}

                            {missingServices.map((service) => (
                                <ServiceItem
                                    key={`missing-${service.ServiceId}`}
                                    service={service}
                                    onPress={setSelectedService}
                                />
                            ))}
                        </div>
                    )}

                    {(selectedGroup || searchQuery || groups.length == 0) && (
                        <>
                            {filteredServices.length > 0 ? (
                                <div
                                    className={`grid ${
                                        filteredServices.length === 1
                                            ? "justify-items-center"
                                            : ""
                                    } gap-6 mb-8`}
                                >
                                    <div
                                        className={`grid ${
                                            filteredServices.length === 1
                                                ? "md:grid-cols-1 max-w-md"
                                                : "md:grid-cols-2"
                                        } gap-6`}
                                    >
                                        {filteredServices.map((service) => (
                                            <ServiceItem
                                                key={service.ServiceId}
                                                service={service}
                                                onPress={setSelectedService}
                                            />
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-blue-50 rounded-lg p-6 text-center mb-8">
                                    <p className="text-lg text-gray-700">
                                        Не знайдено послуг за вашим запитом
                                    </p>
                                </div>
                            )}
                        </>
                    )}

                    <div className="flex justify-center">
                        <Button
                            className="btn-primary px-8 py-3"
                            color="primary"
                            onPress={async () => {
                                if (selectedGroup || searchQuery) {
                                    setSelectedGroup(null);
                                    setSearchQuery("");
                                    fetchAllServices();
                                } else {
                                    navigate("/serviceCenters");
                                }
                            }}
                        >
                            ⬅️{" "}
                            {selectedGroup || searchQuery
                                ? "Повернутися до груп"
                                : "Повернутися до центрів"}
                        </Button>
                    </div>
                </>
            )}
        </div>
    );
};
