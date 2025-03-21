import axios from "axios";

interface PreRegDay {
    DatePart: string;
    IsAllow: number;
}

interface PreRegTime {
    StartTime: string;
    IsAllow: number;
}

export const fetchAvailableDates = async (
    serviceCenterId: number,
    serviceId: number
): Promise<string[]> => {
    try {
        const response = await axios.get(
            `/api/QueueService.svc/json_pre_reg_https/GetDayList?organisationGuid={4c750754-aa83-410c-8a7f-55d71233380a}&serviceCenterId=${serviceCenterId}&serviceId=${serviceId}`
        );

        const data = response.data;

        if (data && Array.isArray(data.d)) {
            return data.d
                .filter((day: PreRegDay) => day.IsAllow === 1)
                .map((day: PreRegDay) => formatDate(day.DatePart));
        } else {
            console.error("Invalid data format:", data);
            return [];
        }
    } catch (error) {
        console.error("Error fetching available dates:", error);
        return [];
    }
};

export const fetchAvailableTimes = async (
    serviceCenterId: number,
    serviceId: number,
    date: string
): Promise<string[]> => {
    try {
        const response = await axios.get(
            `/api/QueueService.svc/json_pre_reg_https/GetTimeList?organisationGuid={4c750754-aa83-410c-8a7f-55d71233380a}&serviceCenterId=${serviceCenterId}&serviceId=${serviceId}&date=${date}`
        );

        const data = response.data;

        if (data && Array.isArray(data.d)) {
            return data.d
                .filter((time: PreRegTime) => time.IsAllow === 1)
                .map((time: PreRegTime) => parseTime(time.StartTime));
        } else {
            console.error("Invalid time data format:", data);
            return [];
        }
    } catch (error) {
        console.error("Error fetching available times:", error);
        return [];
    }
};

export const formatDate = (datePart: string): string => {
    const timestamp = parseInt(datePart.match(/\d+/)?.[0] || "0", 10);
    const date = new Date(timestamp);
    console.log(date);
    return date.toLocaleDateString("en-GB", { day: "numeric", month: "long" });
};

export const parseTime = (isoTime: string): string => {
    const match = isoTime.match(/PT(\d+)H(\d+)M/);
    if (match) {
        const [, hours, minutes] = match;
        return `${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}`;
    }
    return "Invalid time";
};

export const reformatDate = (formattedDate: string): string => {
    const [day, month] = formattedDate.split(" ");

    const monthNames: { [key: string]: number } = {
        January: 1,
        February: 2,
        March: 3,
        April: 4,
        May: 5,
        June: 6,
        July: 7,
        August: 8,
        September: 9,
        October: 10,
        November: 11,
        December: 12,
    };

    const monthNumber = monthNames[month];

    if (!monthNumber) {
        throw new Error("Invalid month name");
    }

    const currentYear = new Date().getFullYear();
    const date = new Date(
        currentYear,
        monthNumber - 1,
        parseInt(day, 10),
        12,
        0
    );

    return date.toISOString().split("T")[0];
};
