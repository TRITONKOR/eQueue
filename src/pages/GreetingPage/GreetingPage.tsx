import { Button } from "@heroui/button";
import React from "react";
import { useNavigate } from "react-router";

const GreetingPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="container-primary max-w-4xl mx-auto px-4 sm:px-6 py-8">
            <div className="text-center mb-8">
                <h1 className="h1-primary mb-6">
                    Вас вітає Центр надання адміністративних послуг!
                </h1>

                <div className="bg-blue-50 rounded-xl p-6 mb-4 border border-blue-100">
                    <p className="text-lg sm:text-xl text-gray-700 font-medium leading-relaxed">
                        Шановний відвідувачу, даний сервіс дозволяє Вам
                        здійснити попередній запис на прийом до адміністратора
                        ЦНАП.
                    </p>
                </div>
            </div>

            <div className="grid gap-6 mb-6">
                <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">
                        Інформація про запис
                    </h2>
                    <ul className="space-y-4 text-lg text-gray-600">
                        <li className="flex items-start">
                            <span className="mr-2 text-blue-500">•</span>
                            <span>
                                Один запис на одну послугу протягом робочого дня
                            </span>
                        </li>
                        <li className="flex items-start">
                            <span className="mr-2 text-blue-500">•</span>
                            <span>
                                Роздрукуйте інформацію про запис для
                                пред'явлення адміністратору
                            </span>
                        </li>
                        <li className="flex items-start">
                            <span className="mr-2 text-blue-500">•</span>
                            <span>
                                Не забудьте паспорт та доручення (у разі
                                представлення інтересів іншої особи)
                            </span>
                        </li>
                        <li className="flex items-start">
                            <span className="mr-2 text-blue-500">•</span>
                            <span>
                                Приходьте завчасно та слідкуйте за викликом на
                                моніторах
                            </span>
                        </li>
                    </ul>
                </div>

                <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                    <h3 className="font-medium text-xl text-yellow-800 mb-2">
                        Важливо!
                    </h3>
                    <p className="text-yellow-700 text-lg">
                        У разі запізнення на понад 10 хвилин Ваш запис може бути
                        анульовано.
                    </p>
                </div>
            </div>

            <div className="text-center">
                <Button
                    className="btn-primary px-8 py-4 text-lg text-center"
                    color="primary"
                    onPress={() => navigate("/serviceCenters")}
                >
                    Почати запис ➡️
                </Button>
            </div>
        </div>
    );
};

export default GreetingPage;
