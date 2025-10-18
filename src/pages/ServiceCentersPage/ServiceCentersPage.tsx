import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Spinner } from "@heroui/spinner";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getServiceCenters, type ServiceCenter } from "../../api/cnapApi";
import { ServiceCenterItem } from "../../components/ServiceCenterItem";
import { useServiceCenter } from "../../context/ServiceCenterContext";

const allowedServiceCenterIds = [1, 2];
const CACHE_KEY = "serviceCentersCache";
const CACHE_EXPIRY = 15 * 60 * 1000; // 15 хвилин

export const ServiceCentersPage: React.FC = () => {
    const { setSelectedCenter } = useServiceCenter();
    const navigate = useNavigate();

    const [centers, setCenters] = useState<ServiceCenter[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const cachedData = localStorage.getItem(CACHE_KEY);
        if (cachedData) {
            const parsedData = JSON.parse(cachedData);
            if (parsedData.expiry > Date.now()) {
                setCenters(parsedData.data);
                setLoading(false);
                return;
            }
        }

        fetchServiceCenters();
    }, []);

    const fetchServiceCenters = async () => {
        setLoading(true);
        try {
            const allCenters = await getServiceCenters();
            const filteredCenters = allCenters.filter((center) =>
                allowedServiceCenterIds.includes(center.ServiceCenterId)
            );

            setCenters(filteredCenters);
            localStorage.setItem(
                CACHE_KEY,
                JSON.stringify({
                    data: filteredCenters,
                    expiry: Date.now() + CACHE_EXPIRY,
                })
            );
        } catch (error) {
            console.error("Error fetching service centers:", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredCenters = centers.filter((service) =>
        service.ServiceCenterName?.toLowerCase().includes(
            searchQuery.toLowerCase()
        )
    );

    return (
        <div className="container-primary max-w-4xl mx-auto px-4 sm:px-6 py-8">
            {loading ? (
                <div className="flex flex-col items-center justify-center h-64">
                    <Spinner size="lg" label="Завантаження центрів..." />
                </div>
            ) : (
                <>
                    <div className="text-center mb-10">
                        <h1 className="h1-primary mb-4">Попередній запис</h1>
                        <p className="text-xl text-gray-600">
                            Будь ласка, оберіть ЦНАП або його територіальний
                            підрозділ
                        </p>
                    </div>

                    <div className="mb-8 w-full max-w-md mx-auto">
                        <Input
                            type="search"
                            placeholder="Пошук сервісного центру..."
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

                    {filteredCenters.length > 0 ? (
                        <div
                            className={`grid ${
                                filteredCenters.length === 1
                                    ? "justify-items-center"
                                    : ""
                            } gap-6 mb-8`}
                        >
                            <div
                                className={`grid ${
                                    filteredCenters.length === 1
                                        ? "md:grid-cols-1 max-w-xl"
                                        : "md:grid-cols-2"
                                } gap-6`}
                            >
                                {filteredCenters.map((center) => (
                                    <ServiceCenterItem
                                        key={center.ServiceCenterId}
                                        serviceCenter={center}
                                        onPress={setSelectedCenter}
                                    />
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="bg-blue-50 rounded-lg p-6 text-center mb-8">
                            <p className="text-lg text-gray-700">
                                Не знайдено центрів за вашим запитом
                            </p>
                        </div>
                    )}

                    <div className="flex justify-center">
                        <Button
                            className="btn-primary px-8 py-3"
                            color="primary"
                            onPress={() => navigate("/profile")}
                        >
                            ⬅️ Повернутися назад
                        </Button>
                    </div>
                </>
            )}
        </div>
    );
};
