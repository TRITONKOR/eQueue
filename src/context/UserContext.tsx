import React, { createContext, ReactNode, useContext, useState } from "react";

interface UserProfile {
    lastName: string;
    firstName: string;
    middleName: string;
    phone: string;
    email?: string;
    companyName?: string;
}

interface UserContextType {
    userProfile: UserProfile;
    setUserProfile: (updatedProfile: UserProfile) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({
    children,
}) => {
    const [userProfile, setUserProfile] = useState<UserProfile>({
        lastName: "",
        firstName: "",
        middleName: "",
        phone: "",
        email: "",
        companyName: "",
    });

    return (
        <UserContext.Provider value={{ userProfile, setUserProfile }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = (): UserContextType => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
};
