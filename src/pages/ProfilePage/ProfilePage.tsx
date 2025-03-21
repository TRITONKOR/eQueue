import { Button } from "@heroui/button";
import { Checkbox } from "@heroui/checkbox";
import { Input } from "@heroui/input";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import "./profilePage.scss";

export const ProfilePage: React.FC = () => {
    const { userProfile, setUserProfile } = useUser();
    const navigate = useNavigate();

    // Ініціалізація стану форми з профілю користувача
    const [formData, setFormData] = useState({
        lastName: "",
        firstName: "",
        middleName: "",
        phone: "",
        email: "",
        companyName: "",
        agreement: false, // Це значення не буде передаватися в контекст
    });

    // Оновлення стану форми при зміні профілю в контексті
    useEffect(() => {
        if (userProfile) {
            setFormData({
                lastName: userProfile.lastName || "",
                firstName: userProfile.firstName || "",
                middleName: userProfile.middleName || "",
                phone: userProfile.phone || "",
                email: userProfile.email || "",
                companyName: userProfile.companyName || "",
                agreement: false, // Це значення не повинно ініціалізуватися з контексту
            });
        }
    }, [userProfile]);

    // Обробка зміни значень у формі
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        const updatedValue = type === "checkbox" ? checked : value;

        // Оновлення стану форми
        setFormData((prev) => ({
            ...prev,
            [name]: updatedValue,
        }));

        // Оновлення профілю користувача в контексті (без зміни 'agreement')
        if (name !== "agreement") {
            setUserProfile({
                ...userProfile,
                [name]: updatedValue,
            });
            console.log("User profile updated:", userProfile);
        }
    };

    // Перевірка коректності форми
    const isFormValid =
        formData.lastName.trim() !== "" &&
        formData.firstName.trim() !== "" &&
        formData.middleName.trim() !== "" &&
        formData.phone.trim() !== "" &&
        formData.agreement;

    return (
        <div className="container">
            <h1>Анкета відвідувача</h1>
            <form>
                <div className="form-group">
                    <label htmlFor="lastName">Прізвище*</label>
                    <Input
                        id="lastName"
                        className="form-control"
                        isRequired
                        type="text"
                        name="lastName"
                        onChange={handleChange}
                        value={formData.lastName}
                        size="lg"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="firstName">Ім'я*</label>
                    <Input
                        id="firstName"
                        className="form-control"
                        isRequired
                        type="text"
                        name="firstName"
                        onChange={handleChange}
                        value={formData.firstName}
                        size="lg"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="middleName">По батькові*</label>
                    <Input
                        id="middleName"
                        className="form-control"
                        isRequired
                        type="text"
                        name="middleName"
                        onChange={handleChange}
                        value={formData.middleName}
                        size="lg"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="companyName">Назва юридичної особи</label>
                    <Input
                        id="companyName"
                        className="form-control"
                        type="text"
                        name="companyName"
                        onChange={handleChange}
                        value={formData.companyName}
                        size="lg"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="phone">Номер телефону*</label>
                    <Input
                        id="phone"
                        isRequired
                        className="form-control"
                        type="tel"
                        name="phone"
                        onChange={handleChange}
                        value={formData.phone}
                        size="lg"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email">E-mail</label>
                    <Input
                        id="email"
                        className="form-control"
                        type="email"
                        name="email"
                        onChange={handleChange}
                        value={formData.email}
                        size="lg"
                    />
                </div>

                <div className="form-group">
                    <Checkbox
                        id="agreement"
                        name="agreement"
                        isRequired
                        onChange={handleChange}
                        checked={formData.agreement}
                    />
                    <label htmlFor="agreement">
                        Відповідно до ст. 11 Закону України «Про захист
                        персональних даних» надаю згоду на обробку та
                        використання моїх даних для здійснення повноважень,
                        пов'язаних із розглядом даного запиту
                    </label>
                </div>

                <div className="nav">
                    <Button
                        className="w-3/4 md:w-1/2 mt-6 min-h-20 text-lg"
                        color="primary"
                        onPress={() => navigate("/")}
                    >
                        Повернутися назад
                    </Button>
                    <Button
                        className="w-3/4 md:w-1/2 mt-6 min-h-20 text-lg"
                        color="primary"
                        isDisabled={!isFormValid}
                        onPress={() => navigate("/serviceCenters")}
                    >
                        Продовжити
                    </Button>
                </div>
            </form>
        </div>
    );
};
