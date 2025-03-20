import { Button } from "@heroui/button";
import { Checkbox } from "@heroui/checkbox";
import { Input } from "@heroui/input";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./profilePage.scss";

export const ProfilePage: React.FC = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        lastName: "",
        firstName: "",
        middleName: "",
        phone: "",
        email: "",
        companyName: "",
        agreement: false,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

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
                        пов'язаних із розглядом данного запиту
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
