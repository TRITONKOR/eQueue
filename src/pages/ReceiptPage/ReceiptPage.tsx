import { Button } from "@heroui/button";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getReceipt } from "../../api/cnapApi";
import { useServiceCenter } from "../../context/ServiceCenterContext";
import { useService } from "../../context/ServiceContext";
import { useUser } from "../../context/UserContext";

import html2canvas from "html2canvas";

export const ReceiptPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const { userProfile } = useUser();
    const { selectedService } = useService();
    const { selectedCenter } = useServiceCenter();

    const [htmlReceipt, setHtmlReceipt] = useState("");

    useEffect(() => {
        if (userProfile.firstName === "") {
            navigate("/profile");
            return;
        }

        if (!selectedService || !selectedCenter) {
            navigate("/servicesAndGroups");
            return;
        }

        const fetchReceipt = async () => {
            try {
                const html = await getReceipt(
                    import.meta.env.VITE_ORGANIZATION_GUID,
                    selectedCenter?.ServiceCenterId ?? 0,
                    location.state?.CustOrderGuid ?? ""
                );
                setHtmlReceipt(html);
            } catch (error) {
                console.error("Error fetching receipt:", error);
            }
        };
        fetchReceipt();
    }, [
        navigate,
        location.state?.CustOrderGuid,
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
            <div className="p-8">
                <h1 className="text-2xl font-semibold text-gray-800 text-center mb-8">
                    Вітаємо з успішною реєстрацією на прийом до адміністратора
                    м. Ужгород, з питання
                    <span className="text-blue-600">
                        {" "}
                        {selectedService?.Description}
                    </span>
                    !
                </h1>

                <div className="flex flex-col lg:flex-row gap-8">
                    <div className="lg:w-1/2">
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h2 className="text-xl font-bold mb-4 text-blue-600">
                                Деталі реєстрації
                            </h2>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 sm:text-lg text-base">
                                <div>
                                    <p className="font-medium">
                                        📅 Дата прийому:{" "}
                                        <span className="font-bold">
                                            {location?.state.date}
                                        </span>
                                    </p>
                                </div>
                                <div>
                                    <p className="font-medium">
                                        ⏰ Час:{" "}
                                        <span className="font-bold">
                                            {location?.state.time}
                                        </span>
                                    </p>
                                </div>
                                <div>
                                    <p className="font-medium">
                                        🔢 Номер у черзі:{" "}
                                        <span className="font-bold">
                                            {location?.state.CustReceiptNum}
                                        </span>
                                    </p>
                                </div>
                                <div>
                                    <p className="font-medium">
                                        📍 Центр обслуговування:
                                    </p>
                                    <p className="font-bold">
                                        {selectedCenter?.ServiceCenterName}
                                    </p>
                                </div>
                            </div>

                            <div className="bg-red-100 p-4 rounded-md">
                                <h3 className="font-bold text-red-600 mb-2 sm:text-xl text-lg">
                                    ⚠️ Увага!
                                </h3>
                                <ul className="list-disc list-inside space-y-2 sm:text-lg text-base">
                                    <li>
                                        Просимо своєчасно прибути до центру, у
                                        разі запізнення ваш чек буде анульовано!
                                    </li>
                                    <li>
                                        Один запис у черзі надає можливість
                                        отримання тільки однієї послуги.
                                    </li>
                                    <li>
                                        Запис до електронної черги є
                                        індивідуальним, передача запису третім
                                        особам не допускається.
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="lg:w-1/2">
                        <div className="bg-white p-6 rounded-lg shadow-md sticky top-4">
                            <h2 className="text-xl font-bold mb-4 text-blue-600">
                                Ваш чек
                            </h2>
                            <div
                                id="receipt-content"
                                className="receipt-container"
                                dangerouslySetInnerHTML={{
                                    __html: htmlReceipt,
                                }}
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-center flex-wrap sm:gap-2 mt-6">
                    <Button
                        className="btn-primary order-2 sm:order-1"
                        color="primary"
                        onPress={() =>
                            (window.location.href =
                                "https://rada-uzhgorod.gov.ua/about-city")
                        }
                    >
                        🚪 Завершити
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
