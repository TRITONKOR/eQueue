import axios, { AxiosError } from "axios";
import { reformatDate } from "../services/dateService";

export interface ServiceCenter {
    ServiceCenterId: number;
    BranchName: string;
    ServiceCenterName: string;
    LocationName: string;
    Preliminary?: boolean;
}

export interface ServiceGroup {
    GroupId: number;
    Description: string;
    GroupGuid: string;
    isActive: number;
}

export interface Service {
    ServiceId: number;
    Description: string;
    ServiceCenterId: number;
    GroupId: number;
}

export interface AvailableDate {
    DatePart: string;
    IsAllow: number;
}

export interface AvailableTime {
    StartTime: string;
    IsAllow: number;
}

export interface RegistrationResponse {
    CustOrderGuid: string;
    CustReceiptNum: string;
}

const organizationGuid = import.meta.env.VITE_ORGANIZATION_GUID;

const api = axios.create({
    baseURL: "/api/QueueService.svc",
    headers: {
        "Content-Type": "application/json",
    },
});

const handleApiError = (error: AxiosError) => {
    console.error("API Error:", error.response?.data || error.message);
    throw error;
};

export const getServiceCenters = async (): Promise<ServiceCenter[]> => {
    try {
        const response = await api.get(
            `/json_pre_reg_https/getServiceCenterList?organisationGuid={${organizationGuid}}`
        );
        return response.data.d;
    } catch (error) {
        return handleApiError(error as AxiosError);
    }
};

export const getGroups = async (
    serviceCenterId: number
): Promise<ServiceGroup[]> => {
    try {
        const response = await api.get(
            `/json_wellcome_point_https/getGroupsByCenterId?organisationGuid={${organizationGuid}}&serviceCenterId=${serviceCenterId}&parentGroupId=0&languageId=1&preliminary=1`
        );
        return response.data.d;
    } catch (error) {
        return handleApiError(error as AxiosError);
    }
};

export const getServices = async (
    serviceCenterId: number,
    groupId: number
): Promise<Service[]> => {
    try {
        const response = await api.get(
            `/json_wellcome_point_https/getServicesByCenterId?organisationGuid={${organizationGuid}}&serviceCenterId=${serviceCenterId}&groupId=${groupId}&languageId=1&preliminary=1`
        );
        return response.data.d;
    } catch (error) {
        return handleApiError(error as AxiosError);
    }
};

export const getAllServices = async (
    serviceCenterId: number
): Promise<Service[]> => {
    try {
        const response = await api.get(
            `/json_pre_reg_https/GetServiceList?organisationGuid={${organizationGuid}}&serviceCenterId=${serviceCenterId}`
        );
        return response.data.d;
    } catch (error) {
        return handleApiError(error as AxiosError);
    }
};

export const getAvailableDates = async (
    serviceCenterId: number,
    serviceId: number
): Promise<AvailableDate[]> => {
    try {
        const response = await api.get(
            `/json_pre_reg_https/GetDayList?organisationGuid={${organizationGuid}}&serviceCenterId=${serviceCenterId}&serviceId=${serviceId}`
        );
        return response.data.d;
    } catch (error) {
        return handleApiError(error as AxiosError);
    }
};

export const getAvailableTimes = async (
    serviceCenterId: number,
    serviceId: number,
    date: string
): Promise<AvailableTime[]> => {
    try {
        const response = await api.get(
            `/json_pre_reg_https/GetTimeList?organisationGuid={${organizationGuid}}&serviceCenterId=${serviceCenterId}&serviceId=${serviceId}&date=${date}`
        );
        return response.data.d;
    } catch (error) {
        return handleApiError(error as AxiosError);
    }
};

export interface RegisterCustomerParams {
    serviceCenterId: number;
    serviceId: number;
    date: string;
    time: string;
    lastName: string;
    firstName: string;
    middleName: string;
    phone: string;
    email?: string;
    companyName?: string;
}

export const registerCustomer = async (
    params: RegisterCustomerParams
): Promise<RegistrationResponse> => {
    try {
        const response = await api.get(
            `/json_pre_reg_https/RegCustomerEx?organisationGuid={${organizationGuid}}&serviceCenterId=${
                params.serviceCenterId
            }&serviceId=${params.serviceId}&name=${params.lastName} ${
                params.firstName
            } ${params.middleName}&phone=${params.phone}${
                params.email ? `&email=${params.email}` : ""
            }${params.companyName ? `&customerInfo=${params.companyName}` : ""}
            &date=${reformatDate(params.date)} ${params.time}:00`
        );
        return response.data.d;
    } catch (error) {
        return handleApiError(error as AxiosError);
    }
};

export const getReceipt = async (
    organizationGuid: string,
    serviceCenterId: number,
    orderGuid: string
): Promise<string> => {
    try {
        const response = await api.get(
            `/json_pre_reg_https/GetReceipt?organisationGuid={${organizationGuid}}&serviceCenterId=${serviceCenterId}&orderGuid={${orderGuid}}`
        );
        return response.data.d;
    } catch (error) {
        console.error("Error fetching receipt:", error);
        return "";
    }
};
