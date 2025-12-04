import { Button } from "@heroui/button";
import { Checkbox } from "@heroui/checkbox";
import { Form } from "@heroui/form";
import { Input } from "@heroui/input";
import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { registerCustomer } from "../../api/cnapApi";
import { useServiceCenter } from "../../context/ServiceCenterContext";
import { useService } from "../../context/ServiceContext";
import { useUser } from "../../context/UserContext";
import "./profilePage.scss";

export const ProfilePage: React.FC = () => {
    const { userProfile, setUserProfile } = useUser();
    const { selectedService } = useService();
    const { selectedCenter } = useServiceCenter();

    const navigate = useNavigate();
    const location = useLocation();

    const [formData, setFormData] = useState({
        lastName: "",
        firstName: "",
        middleName: "",
        phone: "",
        email: "",
        companyName: "",
        agreement: false,
    });

    const [validationStatus, setValidationStatus] = useState({
        lastName: true,
        firstName: true,
        middleName: true,
        phone: true,
        email: true,
        companyName: true,
    });

    const [validationMessages, setValidationMessages] = useState({
        lastName: "",
        firstName: "",
        middleName: "",
        phone: "",
        email: "",
        companyName: "",
    });

    useEffect(() => {
        if (
            !selectedCenter ||
            !selectedService ||
            !location.state.selectedDate ||
            !location.state.selectedTime
        ) {
            navigate("/");
        }
        setFormData({
            lastName: userProfile.lastName || "",
            firstName: userProfile.firstName || "",
            middleName: userProfile.middleName || "",
            phone: userProfile.phone || "",
            email: userProfile.email || "",
            companyName: userProfile.companyName || "",
            agreement: false,
        });
    }, [
        userProfile,
        navigate,
        selectedCenter,
        selectedService,
        location.state,
    ]);

    const validateLastName = useCallback((value: string) => {
        const isValid = value.trim().length >= 2;
        return isValid ? null : "Прізвище повинно містити не менше 2 символів";
    }, []);

    const validateFirstName = useCallback((value: string) => {
        const isValid = value.trim().length >= 2;
        return isValid ? null : "Ім'я повинно містити не менше 2 символів";
    }, []);

    const validateMiddleName = useCallback((value: string) => {
        const isValid = value.trim().length >= 2;
        return isValid
            ? null
            : "По батькові повинно містити не менше 2 символів";
    }, []);

    const validatePhone = useCallback((value: string) => {
        const isValid = /^\d{10}$/.test(value);
        return isValid ? null : "Номер телефону повинен містити рівно 10 цифр";
    }, []);

    const validateEmail = useCallback((value: string) => {
        if (!value.trim()) {
            return null;
        }

        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const isValid = emailPattern.test(value);
        return isValid ? null : "Невірний формат email";
    }, []);

    const validateCompanyName = useCallback((value: string) => {
        const isValid = value.trim().length >= 2;
        return isValid
            ? null
            : "Назва юридичної особи повинно містити не менше 2 символів";
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        const updatedValue = type === "checkbox" ? checked : value;

        setFormData((prev) => ({
            ...prev,
            [name]: updatedValue,
        }));

        if (name !== "agreement") {
            setUserProfile({
                ...userProfile,
                [name]: updatedValue,
            });

            let isValid = true;
            let errorMessage = "";

            switch (name) {
                case "lastName":
                    errorMessage = validateLastName(value as string) || "";
                    isValid = !errorMessage;
                    break;
                case "firstName":
                    errorMessage = validateFirstName(value as string) || "";
                    isValid = !errorMessage;
                    break;
                case "middleName":
                    errorMessage = validateMiddleName(value as string) || "";
                    isValid = !errorMessage;
                    break;
                case "phone":
                    errorMessage = validatePhone(value as string) || "";
                    isValid = !errorMessage;
                    break;
                case "email":
                    errorMessage = validateEmail(value as string) || "";
                    isValid = !errorMessage;
                    break;
                case "companyName":
                    errorMessage = validateCompanyName(value as string) || "";
                    isValid = !errorMessage;
                    break;
            }

            setValidationStatus((prev) => ({
                ...prev,
                [name]: isValid,
            }));

            setValidationMessages((prev) => ({
                ...prev,
                [name]: errorMessage,
            }));
        }
    };

    const isFormValid =
        validationStatus.lastName &&
        validationStatus.firstName &&
        validationStatus.middleName &&
        validationStatus.phone &&
        validationStatus.email &&
        formData.lastName.trim() !== "" &&
        formData.firstName.trim() !== "" &&
        formData.middleName.trim() !== "" &&
        formData.phone.trim() !== "" &&
        formData.agreement;

    const handleSubmit = async () => {
        try {
            if (
                isFormValid &&
                location.state.selectedDate &&
                location.state.selectedTime &&
                selectedService &&
                selectedCenter
            ) {
                const { CustOrderGuid, CustReceiptNum } =
                    await registerCustomer({
                        serviceCenterId: selectedCenter.ServiceCenterId,
                        serviceId: selectedService.ServiceId,
                        date: location.state.selectedDate,
                        time: location.state.selectedTime,
                        lastName: formData.lastName,
                        firstName: formData.firstName,
                        middleName: formData.middleName,
                        phone: formData.phone,
                        email: formData.email,
                        companyName: formData.companyName,
                    });

                navigate("/receipt", {
                    state: {
                        CustOrderGuid,
                        CustReceiptNum,
                        selectedDate: location.state.date,
                        selectedTime: location.state.time,
                    },
                });
            }
        } catch (error) {
            console.error("Error submitting form:", error);
        }
    };

    return (
        <div className="container-primary max-w-3xl mx-auto px-4 sm:px-6 py-8">
            <div className="text-center mb-5">
                <h1 className="h1-primary mb-4">Анкета відвідувача</h1>
                <p className="text-gray-600 sm:text-xl text-lg">
                    Будь ласка, заповніть обов'язкові поля (позначені{" "}
                    <span className="text-red-500">*</span>) для продовження
                </p>
            </div>

            <Form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                    <div className="space-y-6">
                        <div className="form-group">
                            <label htmlFor="lastName" className="form-label">
                                Прізвище<span className="text-red-500">*</span>
                            </label>
                            <Input
                                id="lastName"
                                className="form-input"
                                classNames={{
                                    input: "form-input__field",
                                    inputWrapper: "form-input__wrapper",
                                }}
                                isRequired
                                type="text"
                                name="lastName"
                                onChange={handleChange}
                                value={formData.lastName}
                                size="lg"
                                errorMessage={validationMessages.lastName}
                                isInvalid={
                                    !validationStatus.lastName &&
                                    formData.lastName !== ""
                                }
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="firstName" className="form-label">
                                Ім'я<span className="text-red-500">*</span>
                            </label>
                            <Input
                                id="firstName"
                                className="form-input"
                                classNames={{
                                    input: "form-input__field",
                                    inputWrapper: "form-input__wrapper",
                                }}
                                isRequired
                                type="text"
                                name="firstName"
                                onChange={handleChange}
                                value={formData.firstName}
                                size="lg"
                                errorMessage={validationMessages.firstName}
                                isInvalid={
                                    !validationStatus.firstName &&
                                    formData.firstName !== ""
                                }
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="middleName" className="form-label">
                                По батькові
                                <span className="text-red-500">*</span>
                            </label>
                            <Input
                                id="middleName"
                                className="form-input"
                                classNames={{
                                    input: "form-input__field",
                                    inputWrapper: "form-input__wrapper",
                                }}
                                isRequired
                                type="text"
                                name="middleName"
                                onChange={handleChange}
                                value={formData.middleName}
                                size="lg"
                                errorMessage={validationMessages.middleName}
                                isInvalid={
                                    !validationStatus.middleName &&
                                    formData.middleName !== ""
                                }
                            />
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="form-group">
                            <label htmlFor="phone" className="form-label">
                                Номер телефону
                                <span className="text-red-500">*</span>
                            </label>
                            <Input
                                id="phone"
                                className="form-input"
                                classNames={{
                                    input: "form-input__field",
                                    inputWrapper: "form-input__wrapper",
                                }}
                                placeholder="XXXXXXXXX"
                                isRequired
                                type="tel"
                                name="phone"
                                onChange={handleChange}
                                value={formData.phone}
                                size="lg"
                                errorMessage={validationMessages.phone}
                                isInvalid={
                                    !validationStatus.phone &&
                                    formData.phone !== ""
                                }
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="email" className="form-label">
                                E-mail
                            </label>
                            <Input
                                id="email"
                                className="form-input"
                                classNames={{
                                    input: "form-input__field",
                                    inputWrapper: "form-input__wrapper",
                                }}
                                type="email"
                                name="email"
                                onChange={handleChange}
                                value={formData.email}
                                size="lg"
                                errorMessage={validationMessages.email}
                                isInvalid={
                                    !validationStatus.email &&
                                    formData.email !== ""
                                }
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="companyName" className="form-label">
                                Назва юридичної особи
                            </label>
                            <Input
                                id="companyName"
                                className="form-input"
                                classNames={{
                                    input: "form-input__field",
                                    inputWrapper: "form-input__wrapper",
                                }}
                                type="text"
                                name="companyName"
                                onChange={handleChange}
                                value={formData.companyName}
                                size="lg"
                                errorMessage={validationMessages.companyName}
                                isInvalid={
                                    !validationStatus.companyName &&
                                    formData.companyName !== ""
                                }
                            />
                        </div>
                    </div>
                </div>

                <div className="bg-blue-50 rounded-lg p-6 border border-blue-100 mt-6">
                    <Checkbox
                        id="agreement"
                        name="agreement"
                        classNames={{
                            base: "items-start",
                            wrapper: "mt-1",
                            label: "text-base sm:text-lg text-gray-700",
                        }}
                        isRequired
                        onChange={handleChange}
                        checked={formData.agreement}
                    >
                        Відповідно до ст. 11 Закону України «Про захист
                        персональних даних» надаю згоду на обробку та
                        використання моїх даних для здійснення повноважень,
                        пов'язаних із розглядом даного запиту
                    </Checkbox>
                </div>

                <div className="flex flex-col sm:flex-row justify-center gap-4 mt-10 w-full">
                    <Button
                        className="btn-primary px-8 py-3 order-2 sm:order-1"
                        color="primary"
                        onPress={() => navigate("/")}
                    >
                        ⬅️ Повернутися назад
                    </Button>
                    <Button
                        className="btn-primary px-8 py-3 order-1 sm:order-2"
                        color="primary"
                        isDisabled={!isFormValid}
                        onPress={handleSubmit}
                    >
                        Продовжити ➡️
                    </Button>
                </div>
            </Form>
        </div>
    );
};
