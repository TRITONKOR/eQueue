import { Button } from "@heroui/button";
import { Select, SelectItem } from "@heroui/select";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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

    const [availableDates, setAvailableDates] = useState<string[]>([]);
    const [availableTimes, setAvailableTimes] = useState<string[]>([]);

    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);

    const navigate = useNavigate();

    useEffect(() => {
        if (!userProfile) {
            navigate("/profile");
            return;
        }

        if (!selectedService || !selectedCenter || !userProfile) {
            navigate("/servicesAndGroups");
            return;
        }

        fetchAvailableDates(
            selectedCenter.ServiceCenterId,
            selectedService.ServiceId
        )
            .then((dates) => setAvailableDates(dates))
            .catch((error) => console.error("Error fetching dates:", error));
    }, [selectedService, selectedCenter]);

    const handleDateChange = (keys: {
        anchorKey?: string;
        currentKey?: string;
    }) => {
        const date = keys.currentKey as string;
        setSelectedDate(date);

        if (!selectedService || !selectedCenter) {
            navigate("/servicesAndGroups");
            return;
        }

        console.log("Selected date:", date);

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
        if (
            !selectedCenter ||
            !selectedService ||
            !selectedDate ||
            !selectedTime ||
            !userProfile
        ) {
            console.log("no");
            return;
        }
        axios
            .get(
                `/api/QueueService.svc/json_pre_reg_https/RegCustomerEx?organisationGuid={4c750754-aa83-410c-8a7f-55d71233380a}&serviceCenterId=${
                    selectedCenter?.ServiceCenterId
                }&serviceId=${selectedService?.ServiceId}&phone=${
                    userProfile.phone
                }&email=${userProfile.email}&name=${userProfile.lastName} ${
                    userProfile.firstName
                } ${userProfile.middleName}&date=${reformatDate(
                    selectedDate
                )} ${selectedTime}:00`
            )
            .then((response) => {
                const data = response.data;
                if (data) {
                    console.log(data.d);
                } else {
                    console.error("Registration failed");
                }
            })
            .catch((error) => {
                console.error("Error registration:", error);
            });
    };

    const isButtonDisabled = !selectedDate || !selectedTime;

    return (
        <div className="container w-full flex flex-col items-center justify-center gap-6 p-4">
            <h1 className="text-2xl font-bold text-center">Попередній запис</h1>

            <p className="text-center ">
                Будь ласка, оберіть бажаний час візиту
            </p>

            <p className="text-center font-bold text-xl">
                {selectedService?.Description}
            </p>

            <div className="flex items-center gap-4 w-full">
                <Select
                    items={availableDates.map((date) => ({ label: date }))}
                    label="Оберіть дату"
                    onSelectionChange={handleDateChange}
                    size="lg"
                >
                    {(availableDate) => (
                        <SelectItem key={availableDate.label}>
                            {availableDate.label}
                        </SelectItem>
                    )}
                </Select>
                <Select
                    items={availableTimes.map((time) => ({ label: time }))}
                    label="Оберіть час"
                    onSelectionChange={(keys) =>
                        setSelectedTime(keys.currentKey as string)
                    }
                    size="lg"
                >
                    {(availableTime) => (
                        <SelectItem key={availableTime.label}>
                            {availableTime.label}
                        </SelectItem>
                    )}
                </Select>
            </div>

            <div className="w-full flex items-center gap-4">
                <Button
                    className="w-3/4 md:w-1/2 mt-6 min-h-20 text-lg"
                    color="primary"
                    onPress={() => navigate("/servicesAndGroups")}
                >
                    Повернутися назад
                </Button>
                <Button
                    className="w-3/4 md:w-1/2 mt-6 min-h-20 text-lg"
                    color="primary"
                    onPress={handleRegistration}
                    isDisabled={isButtonDisabled}
                >
                    Зареєструватись
                </Button>
            </div>
        </div>
    );
};
