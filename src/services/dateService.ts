import {
    AvailableDate,
    AvailableTime,
    getAvailableDates,
    getAvailableTimes,
} from "../api/cnapApi";

export interface FormattedAvailableDate {
    date: string; // "15 жовтня"
}

export interface FormattedAvailableTime {
    time: string; // "HH:mm"
    IsAvailable: boolean;
}

export const fetchAvailableDates = async (
    serviceCenterId: number,
    serviceId: number
): Promise<FormattedAvailableDate["date"][]> => {
    try {
        const response = await getAvailableDates(serviceCenterId, serviceId);

        if (response && Array.isArray(response)) {
            return response
                .filter((day: AvailableDate) => day.IsAllow === 1)
                .map((day: AvailableDate) => formatDate(day.DatePart));
        } else {
            console.error("Invalid data format:", response);
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
): Promise<FormattedAvailableTime[]> => {
    const formattedDate = reformatDate(date);

    try {
        const response = await getAvailableTimes(
            serviceCenterId,
            serviceId,
            formattedDate
        );

        if (response && Array.isArray(response)) {
            return response.map((time: AvailableTime) => ({
                time: parseTime(time.StartTime),
                IsAvailable: time.IsAllow === 1,
            }));
        } else {
            console.error("Invalid time format:", response);
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

    return date.toLocaleDateString("uk-UA", { day: "numeric", month: "long" });
};

export const parseTime = (isoTime: string): string => {
    const match = isoTime.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
    if (match) {
        const hours = match[1] ? match[1].padStart(2, "0") : "00";
        const minutes = match[2] ? match[2].padStart(2, "0") : "00";
        return `${hours}:${minutes}`;
    }
    return "Invalid time";
};

export const reformatDate = (formattedDate: string): string => {
    const [day, month] = formattedDate.split(" ");

    const monthMap: { [key: string]: number } = {
        січня: 0,
        лютого: 1,
        березня: 2,
        квітня: 3,
        травня: 4,
        червня: 5,
        липня: 6,
        серпня: 7,
        вересня: 8,
        жовтня: 9,
        листопада: 10,
        грудня: 11,
    };

    const monthIndex = monthMap[month];

    if (monthIndex === undefined) {
        throw new Error("Invalid month name");
    }

    const currentYear = new Date().getFullYear();
    const date = new Date(currentYear, monthIndex, parseInt(day, 10));

    return `${date.getFullYear()}-${(date.getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
};
