import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Spinner } from "@heroui/spinner";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GroupItem } from "../../components/GroupItem";
import { ServiceItem } from "../../components/ServiceItem";
import { useServiceCenter } from "../../context/ServiceCenterContext";
import { useService } from "../../context/ServiceContext";
import { useUser } from "../../context/UserContext";

interface Service {
    Description: string;
    ServiceCenterId: number;
    ServiceId: number;
    GroupId: number;
}

interface ServiceGroup {
    Description: string;
    GroupGuid: string;
    GroupId: number;
    isActive: number;
}

export const ServicesPage: React.FC = () => {
    const { userProfile } = useUser();
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
    const organizationGuid = import.meta.env.VITE_ORGANIZATION_GUID;

    useEffect(() => {
        if (userProfile.firstName === "") {
            navigate("/profile");
            return;
        }

        if (!selectedCenter) {
            navigate("/serviceCenters");
            return;
        }

        fetchGroups();
        fetchAllServices();
    }, [navigate, selectedCenter, userProfile.firstName]);

    const fetchAllServices = async () => {
        try {
            const response = await axios.get(
                `/api/QueueService.svc/json_pre_reg_https/GetServiceList?organisationGuid={${organizationGuid}}&serviceCenterId=${selectedCenter?.ServiceCenterId}`
            );
            const data = response.data;
            if (data && Array.isArray(data.d)) {
                setServices(data.d);
            }
        } catch (error) {
            console.error("Error fetching all services:", error);
        }
    };

    const fetchGroups = async () => {
        setLoading(true);
        try {
            const response = await axios.get(
                `/api/QueueService.svc/json_wellcome_point_https/getGroupsByCenterId?organisationGuid={${organizationGuid}}&serviceCenterId=${selectedCenter?.ServiceCenterId}&parentGroupId=0&languageId=1&preliminary=1`
            );
            const data = response.data;
            if (data && Array.isArray(data.d)) {
                setGroups(data.d);
            }
        } catch (error) {
            console.error("Error fetching groups:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchServices = async (groupId: number) => {
        setLoading(true);
        try {
            const response = await axios.get(
                `/api/QueueService.svc/json_wellcome_point_https/getServicesByCenterId?organisationGuid={${organizationGuid}}&serviceCenterId=${selectedCenter?.ServiceCenterId}&groupId=${groupId}&languageId=1&preliminary=1`
            );
            const data = response.data;
            if (data && Array.isArray(data.d)) {
                setServices(data.d);
            }
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
                                    key={group.GroupId}
                                    group={group}
                                    onPress={handleGroupSelect}
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
