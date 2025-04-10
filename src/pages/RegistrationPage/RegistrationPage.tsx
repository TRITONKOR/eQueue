import { Button } from "@heroui/button";
import { Select, SelectItem } from "@heroui/select";
import { Spinner } from "@heroui/spinner";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useReceipt } from "../../context/ReceiptContext";
import { useServiceCenter } from "../../context/ServiceCenterContext";
import { useService } from "../../context/ServiceContext";
import { useUser } from "../../context/UserContext";
import {
    fetchAvailableDates,
    fetchAvailableTimes,
    reformatDate,
} from "../../services/dateService";

export const RegistrationPage: React.FC = () => {
    const { userProfile } = useUser();
    const { selectedService } = useService();
    const { selectedCenter } = useServiceCenter();
    const { setReceipt } = useReceipt();

    const [availableDates, setAvailableDates] = useState<string[]>([]);
    const [availableTimes, setAvailableTimes] = useState<
        { time: string; isAvailable: boolean }[]
    >([]);

    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);

    const [loading, setLoading] = useState<boolean>(true);

    const navigate = useNavigate();

    const organizationGuid = import.meta.env.VITE_ORGANIZATION_GUID;

    useEffect(() => {
        if (userProfile.firstName === "") {
            navigate("/profile");
            return;
        }

        if (!selectedService || !selectedCenter || !userProfile) {
            navigate("/servicesAndGroups");
            return;
        }

        setLoading(true);
        try {
            fetchAvailableDates(
                selectedCenter.ServiceCenterId,
                selectedService.ServiceId
            )
                .then((dates) => {
                    setAvailableDates(dates);
                    setLoading(false);
                })
                .catch((error) => {
                    console.error("Error fetching dates:", error);
                    setLoading(false);
                });
        } catch (error) {
            console.error("Error fetching dates:", error);
            setLoading(false);
        }
    }, [selectedService, selectedCenter, userProfile, navigate]);

    const handleDateChange = (keys: {
        anchorKey?: string;
        currentKey?: string;
    }) => {
        if (!selectedService || !selectedCenter) {
            navigate("/servicesAndGroups");
            return;
        }

        const date = keys.currentKey as string;
        setSelectedDate(date);

        fetchAvailableTimes(
            selectedCenter.ServiceCenterId,
            selectedService.ServiceId,
            date
        )
            .then((times) => {
                setAvailableTimes(times);
                setSelectedTime(null);
            })
            .catch((error) => console.error("Error fetching times:", error));
    };

    const handleRegistration = () => {
        if (!selectedDate || !selectedTime) return;

        axios
            .get(
                `/api/QueueService.svc/json_pre_reg_https/RegCustomerEx?organisationGuid={${organizationGuid}}&serviceCenterId=${
                    selectedCenter?.ServiceCenterId
                }&serviceId=${selectedService?.ServiceId}&phone=${
                    userProfile.phone
                }&email=${userProfile.email}&name=${userProfile.lastName} ${
                    userProfile.firstName
                } ${userProfile.middleName}&customerInfo=${
                    userProfile.companyName
                }&date=${reformatDate(selectedDate)} ${selectedTime}:00`
            )
            .then((response) => {
                const { CustOrderGuid, CustReceiptNum } = response.data.d;
                setReceipt({
                    CustOrderGuid,
                    CustReceiptNum,
                    selectedDate,
                    selectedTime,
                });
                navigate("/receipt");
            })
            .catch((error) => {
                console.error("Error registration:", error);
            });
    };

    const isButtonDisabled = !selectedDate || !selectedTime;

    return (
        <div className="container-primary max-w-4xl mx-auto px-4 sm:px-6 py-8">
            {loading ? (
                <div className="flex flex-col items-center justify-center h-64">
                    <Spinner size="lg" label="Завантаження доступних дат..." />
                </div>
            ) : (
                <>
                    <div className="text-center mb-10">
                        <h1 className="h1-primary mb-4">Оберіть час візиту</h1>
                        <div className="bg-blue-50 rounded-lg p-4 inline-block">
                            <p className="text-xl font-semibold text-blue-800">
                                {selectedService?.Description}
                            </p>
                            <p className="text-gray-600 text-lg">
                                {selectedCenter?.ServiceCenterName}
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                        <div className="space-y-2">
                            <label className="block text-lg font-medium text-gray-700 ml-2 mb-2">
                                Оберіть дату
                            </label>
                            <Select
                                className="border rounded-2xl"
                                classNames={{
                                    trigger: "w-full min-w-[300px]",
                                }}
                                items={availableDates.map((date) => ({
                                    label: date,
                                }))}
                                onSelectionChange={handleDateChange}
                                size="lg"
                                placeholder="Оберіть дату"
                            >
                                {(availableDate) => (
                                    <SelectItem key={availableDate.label}>
                                        {availableDate.label}
                                    </SelectItem>
                                )}
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-lg font-medium text-gray-700 ml-2 mb-2">
                                Оберіть час
                            </label>
                            <Select
                                className="border rounded-2xl"
                                classNames={{
                                    trigger: "w-full min-w-[300px]",
                                }}
                                items={availableTimes.map((timeObj) => ({
                                    label: timeObj.time,
                                    key: timeObj.time,
                                    isDisabled: !timeObj.isAvailable,
                                }))}
                                onSelectionChange={(keys) =>
                                    setSelectedTime(keys.currentKey as string)
                                }
                                size="lg"
                                placeholder="Оберіть час"
                                isDisabled={!selectedDate}
                                disabledKeys={availableTimes
                                    .filter((time) => !time.isAvailable)
                                    .map((time) => time.time)}
                            >
                                {(availableTime) => (
                                    <SelectItem
                                        key={availableTime.key}
                                        className={
                                            !availableTime.isDisabled
                                                ? ""
                                                : "opacity-50 line-through"
                                        }
                                    >
                                        {availableTime.label}
                                    </SelectItem>
                                )}
                            </Select>
                        </div>
                    </div>

                    {selectedDate && selectedTime && (
                        <div className="bg-green-50 rounded-lg p-4 mb-4 text-center w-full max-w-2xl mx-auto">
                            <p className="text-lg font-medium text-green-800">
                                Ви обрали: {selectedDate} о {selectedTime}
                            </p>
                        </div>
                    )}

                    <div className="flex flex-col sm:flex-row justify-center gap-4 w-full">
                        <Button
                            className="btn-primary px-8 py-3 w-full sm:w-auto"
                            color="primary"
                            onPress={() => navigate("/servicesAndGroups")}
                        >
                            ⬅️ Повернутися
                        </Button>
                        <Button
                            className="btn-primary px-8 py-3 w-full sm:w-auto"
                            color="primary"
                            onPress={handleRegistration}
                            isDisabled={isButtonDisabled}
                        >
                            ✅ Підтвердити запис
                        </Button>
                    </div>
                </>
            )}
        </div>
    );
};
