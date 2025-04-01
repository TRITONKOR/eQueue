import { Button } from "@heroui/button";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useReceipt } from "../../context/ReceiptContext";
import { useServiceCenter } from "../../context/ServiceCenterContext";
import { useService } from "../../context/ServiceContext";
import { useUser } from "../../context/UserContext";

import html2canvas from "html2canvas";

export const ReceiptPage: React.FC = () => {
    const navigate = useNavigate();
    const { userProfile } = useUser();
    const { selectedService } = useService();
    const { selectedCenter } = useServiceCenter();
    const { receipt } = useReceipt();

    const [htmlReceipt, setHtmlReceipt] = useState("");

    useEffect(() => {
        if (userProfile.firstName === "") {
            navigate("/profile");
            return;
        }

        if (!selectedService || !selectedCenter || !userProfile) {
            navigate("/servicesAndGroups");
            return;
        }

        try {
            axios
                .get(
                    `/api/QueueService.svc/json_pre_reg_https/GetReceipt?organisationGuid={${
                        import.meta.env.VITE_ORGANIZATION_GUID
                    }}&serviceCenterId=${
                        selectedCenter?.ServiceCenterId
                    }&orderGuid={${receipt?.CustOrderGuid}}`
                )
                .then((response) => {
                    const data = response.data;
                    setHtmlReceipt(data.d);
                    console.log(data);
                });
        } catch (error) {
            console.error("Error fetching receipt:", error);
        }
    }, [
        navigate,
        receipt?.CustOrderGuid,
        selectedCenter,
        selectedService,
        userProfile,
    ]);

    const downloadImageReceipt = () => {
        const receiptElement = document.getElementById("receipt-content");
        if (!receiptElement) {
            console.error("Receipt element not found");
            return;
        }

        const originalStyles = {
            width: receiptElement.style.width,
            overflow: receiptElement.style.overflow,
            paddingBottom: receiptElement.style.paddingBottom,
        };

        receiptElement.style.width = "400px";
        receiptElement.style.overflow = "visible";
        receiptElement.style.paddingBottom = "20px";

        const problematicElements = receiptElement.querySelectorAll(
            "hr, .divider, .border"
        );
        problematicElements.forEach((el) => {
            const element = el as HTMLElement;
            element.style.margin = "10px 0";
            element.style.display = "block";
            element.style.position = "static";
        });

        html2canvas(receiptElement, {
            scale: 2,
            useCORS: true,
            scrollY: 0,
            windowHeight: receiptElement.scrollHeight,
            width: 400,
            height: receiptElement.scrollHeight,
            logging: true,
        })
            .then((canvas) => {
                receiptElement.style.width = originalStyles.width;
                receiptElement.style.overflow = originalStyles.overflow;
                receiptElement.style.paddingBottom =
                    originalStyles.paddingBottom;

                problematicElements.forEach((el) => {
                    const element = el as HTMLElement;
                    element.style.margin = "";
                    element.style.display = "";
                    element.style.position = "";
                });

                const imgData = canvas.toDataURL("image/png");

                const link = document.createElement("a");
                link.href = imgData;
                link.download = "Чек_реєстрації.png";
                link.click();
            })
            .catch((error) => {
                console.error("Error generating receipt image:", error);
                receiptElement.style.width = originalStyles.width;
                receiptElement.style.overflow = originalStyles.overflow;
                receiptElement.style.paddingBottom =
                    originalStyles.paddingBottom;
            });
    };

    return (
        <div className="container-primary">
            <div className="p-8 text-center">
                <h1 className="text-2xl font-semibold text-gray-800">
                    Вітаємо з успішною реєстрацією на прийом до адміністратора
                    м. Ужгород, з питання
                    <span className="text-blue-600">
                        {" "}
                        {selectedService?.Description}
                    </span>
                    !
                </h1>

                <div className="mt-8 sm:text-lg text-base text-gray-700 flex align-center justify-center">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:text-left text-center w-full sm:w-1/2 mx-auto">
                        <p className="font-medium">📅 Дата прийому:</p>
                        <p className="font-bold">{receipt?.selectedDate}</p>

                        <p className="font-medium">⏰ Час:</p>
                        <p className="font-bold">{receipt?.selectedTime}</p>

                        <p className="font-medium">🔢 Номер у черзі:</p>
                        <p className="text-xl font-bold text-blue-600">
                            {receipt?.CustReceiptNum}
                        </p>
                    </div>
                </div>

                <span className="mt-6 bg-red-100 p-4 rounded-md text-left sm:text-lg text-base inline-block">
                    <h2 className="font-bold text-red-600">⚠️ Увага!</h2>
                    <ul className="list-disc list-inside text-gray-700">
                        <li>
                            Просимо своєчасно прибути до центру, у разі
                            запізнення ваш чек буде анульовано!
                        </li>
                        <li>
                            Один запис у черзі надає можливість отримання тільки
                            однієї послуги.
                        </li>
                        <li>
                            Запис до електронної черги є індивідуальним,
                            передача запису третім особам не допускається.
                        </li>
                    </ul>
                </span>

                <div
                    id="receipt-content"
                    className="mt-8"
                    dangerouslySetInnerHTML={{ __html: htmlReceipt }}
                ></div>

                <div className="flex justify-center sm:gap-2 flex-wrap">
                    <Button
                        className="btn-primary order-2 sm:order-1"
                        color="primary"
                        onPress={() => navigate("/servicesAndGroups")}
                    >
                        Завершити
                    </Button>
                    <Button
                        className="btn-primary order-1 sm:order-2"
                        color="primary"
                        onPress={downloadImageReceipt}
                    >
                        📥 Завантажити чек
                    </Button>
                </div>
            </div>
        </div>
    );
};
