import {
    AvailableTime,
    getAvailableDates,
    getAvailableTimes,
} from "../api/cnapApi";

export interface FormattedAvailableDate {
    label: string; // "1 січня"
    iso: string; // "2026-01-01"
}

export interface FormattedAvailableTime {
    time: string; // "HH:mm"
    IsAvailable: boolean;
}

export const fetchAvailableDates = async (
    serviceCenterId: number,
    serviceId: number
): Promise<FormattedAvailableDate[]> => {
    try {
        const response = await getAvailableDates(serviceCenterId, serviceId);

        if (response && Array.isArray(response)) {
            return response
                .filter((day) => day.IsAllow === 1)
                .map((day) => formatDate(day.DatePart));
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
    try {
        const response = await getAvailableTimes(
            serviceCenterId,
            serviceId,
            date
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
export const formatDate = (
    datePart: string
): { label: string; iso: string } => {
    const timestamp = parseInt(datePart.match(/\d+/)?.[0] || "0", 10);
    const date = new Date(timestamp);

    const label = date.toLocaleDateString("uk-UA", {
        day: "numeric",
        month: "long",
    });
    const iso = date.toISOString().slice(0, 10);

    return { label, iso };
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
